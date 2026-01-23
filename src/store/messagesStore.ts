import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'tenant' | 'owner' | 'manager' | 'system';
  recipientId: string;
  recipientName: string;
  subject: string;
  body: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
  propertyId?: string;
  unitId?: string;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  subject: string;
  participants: {
    id: string;
    name: string;
    role: 'tenant' | 'owner' | 'manager' | 'system';
  }[];
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: number;
  propertyId?: string;
  unitId?: string;
}

interface MessagesState {
  messages: Message[];
  conversations: Conversation[];

  // Actions
  sendMessage: (message: Omit<Message, 'id' | 'sentAt' | 'isRead'>) => void;
  markAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  getMessagesByUser: (userId: string) => Message[];
  getConversationsByUser: (userId: string) => Conversation[];
  getUnreadCount: (userId: string) => number;
  getMessagesByConversation: (conversationId: string) => Message[];
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 'msg-1',
          conversationId: 'conv-1',
          senderId: 'owner-1',
          senderName: 'Property Manager',
          senderRole: 'manager',
          recipientId: 'user-1',
          recipientName: 'Tenant',
          subject: 'Lease Renewal Reminder',
          body: 'Your lease is set to expire on December 31, 2026. We would love to have you renew for another year. Please let us know your intentions by February 15th so we can plan accordingly.',
          isRead: false,
          sentAt: '2026-01-20T10:00:00Z',
          propertyId: 'prop-1',
          unitId: 'unit-1',
        },
        {
          id: 'msg-2',
          conversationId: 'conv-2',
          senderId: 'owner-1',
          senderName: 'Property Manager',
          senderRole: 'manager',
          recipientId: 'user-1',
          recipientName: 'Tenant',
          subject: 'Maintenance Update',
          body: 'The kitchen faucet repair has been scheduled for January 23rd at 9:00 AM. Our plumber John will arrive and the repair should take about 30 minutes. Please ensure someone is available to provide access.',
          isRead: true,
          sentAt: '2026-01-18T14:30:00Z',
          readAt: '2026-01-18T15:00:00Z',
          propertyId: 'prop-1',
          unitId: 'unit-1',
        },
        {
          id: 'msg-3',
          conversationId: 'conv-3',
          senderId: 'system',
          senderName: 'Building Manager',
          senderRole: 'system',
          recipientId: 'user-1',
          recipientName: 'Tenant',
          subject: 'Monthly Newsletter - January 2026',
          body: 'Check out what is happening this month at Sunset Apartments! We have exciting updates about our new fitness center, upcoming community events, and important reminders for winter weather preparation.',
          isRead: true,
          sentAt: '2026-01-15T09:00:00Z',
          readAt: '2026-01-15T18:30:00Z',
          propertyId: 'prop-1',
        },
      ],

      conversations: [],

      sendMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sentAt: new Date().toISOString(),
          isRead: false,
        };

        set((state) => ({
          messages: [newMessage, ...state.messages],
        }));
      },

      markAsRead: (messageId) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId && !msg.isRead
              ? { ...msg, isRead: true, readAt: new Date().toISOString() }
              : msg
          ),
        }));
      },

      markConversationAsRead: (conversationId) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.conversationId === conversationId && !msg.isRead
              ? { ...msg, isRead: true, readAt: new Date().toISOString() }
              : msg
          ),
        }));
      },

      getMessagesByUser: (userId) => {
        return get()
          .messages.filter((msg) => msg.recipientId === userId || msg.senderId === userId)
          .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
      },

      getConversationsByUser: (userId) => {
        const messages = get().getMessagesByUser(userId);

        // Group messages by conversation/subject
        const conversationMap = new Map<string, Message[]>();

        messages.forEach((msg) => {
          const key = msg.conversationId || msg.subject;
          if (!conversationMap.has(key)) {
            conversationMap.set(key, []);
          }
          conversationMap.get(key)!.push(msg);
        });

        // Create conversation objects
        const conversations: Conversation[] = [];
        conversationMap.forEach((msgs, convId) => {
          const sortedMsgs = msgs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
          const lastMsg = sortedMsgs[0];
          const unreadCount = msgs.filter((m) => m.recipientId === userId && !m.isRead).length;

          // Get unique participants
          const participantsMap = new Map<string, { id: string; name: string; role: 'tenant' | 'owner' | 'manager' | 'system' }>();
          msgs.forEach((m) => {
            if (!participantsMap.has(m.senderId)) {
              participantsMap.set(m.senderId, {
                id: m.senderId,
                name: m.senderName,
                role: m.senderRole,
              });
            }
            if (!participantsMap.has(m.recipientId)) {
              participantsMap.set(m.recipientId, {
                id: m.recipientId,
                name: m.recipientName,
                role: 'tenant', // Default for recipient
              });
            }
          });

          conversations.push({
            id: convId,
            subject: lastMsg.subject,
            participants: Array.from(participantsMap.values()),
            lastMessageAt: lastMsg.sentAt,
            lastMessagePreview: lastMsg.body.substring(0, 100) + (lastMsg.body.length > 100 ? '...' : ''),
            unreadCount,
            propertyId: lastMsg.propertyId,
            unitId: lastMsg.unitId,
          });
        });

        return conversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      },

      getUnreadCount: (userId) => {
        return get().messages.filter((msg) => msg.recipientId === userId && !msg.isRead).length;
      },

      getMessagesByConversation: (conversationId) => {
        return get()
          .messages.filter((msg) => msg.conversationId === conversationId)
          .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
      },
    }),
    {
      name: 'okey-messages-storage',
    }
  )
);
