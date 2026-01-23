import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Paperclip, Image as ImageIcon, Search, MoreVertical, Phone, Video, AlertCircle, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'tenant' | 'owner' | 'manager';
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: { name: string; url: string }[];
}

interface Conversation {
  id: string;
  participant: {
    name: string;
    role: 'tenant' | 'owner' | 'manager';
    avatar: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

interface MessageCenterProps {
  currentUserId: string;
  currentUserRole: 'tenant' | 'owner';
}

export function MessageCenter({ currentUserId, currentUserRole }: MessageCenterProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const conversations: Conversation[] = [
    {
      id: 'conv-1',
      participant: {
        name: 'Property Manager',
        role: 'manager',
        avatar: 'PM',
      },
      lastMessage: 'Your maintenance request has been assigned to a technician',
      lastMessageTime: '10 mins ago',
      unreadCount: 2,
      online: true,
    },
    {
      id: 'conv-2',
      participant: {
        name: currentUserRole === 'tenant' ? 'Building Management' : 'Jean Tremblay',
        role: currentUserRole === 'tenant' ? 'manager' : 'tenant',
        avatar: currentUserRole === 'tenant' ? 'BM' : 'JT',
      },
      lastMessage: 'Thank you for the quick response!',
      lastMessageTime: '2 hours ago',
      unreadCount: 0,
      online: false,
    },
    {
      id: 'conv-3',
      participant: {
        name: 'Maintenance Team',
        role: 'manager',
        avatar: 'MT',
      },
      lastMessage: 'We will be there tomorrow at 10 AM',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      online: true,
    },
  ];

  const messages: Record<string, Message[]> = {
    'conv-1': [
      {
        id: 'msg-1',
        senderId: 'other',
        senderName: 'Property Manager',
        senderRole: 'manager',
        content: 'Hello! How can I help you today?',
        timestamp: '2026-01-21T10:00:00',
        read: true,
      },
      {
        id: 'msg-2',
        senderId: currentUserId,
        senderName: 'You',
        senderRole: currentUserRole,
        content: 'I submitted a maintenance request for the leaky faucet',
        timestamp: '2026-01-21T10:05:00',
        read: true,
      },
      {
        id: 'msg-3',
        senderId: 'other',
        senderName: 'Property Manager',
        senderRole: 'manager',
        content: 'Yes, I see it here. I\'ve assigned it to our plumbing team.',
        timestamp: '2026-01-21T10:10:00',
        read: true,
      },
      {
        id: 'msg-4',
        senderId: 'other',
        senderName: 'Property Manager',
        senderRole: 'manager',
        content: 'They should be able to come by tomorrow between 10 AM and 2 PM. Does that work for you?',
        timestamp: '2026-01-21T10:11:00',
        read: false,
      },
    ],
    'conv-2': [],
    'conv-3': [],
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    // In a real app, this would send to the backend
    setMessageInput('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-96 border-r border-neutral-200 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors text-left ${
                selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {conv.participant.avatar}
                  </div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-neutral-900 truncate">
                      {conv.participant.name}
                    </span>
                    <span className="text-xs text-neutral-500 flex-shrink-0 ml-2">
                      {conv.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-600 truncate">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-neutral-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {conversations.find(c => c.id === selectedConversation)?.participant.avatar}
                  </div>
                  {conversations.find(c => c.id === selectedConversation)?.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">
                    {conversations.find(c => c.id === selectedConversation)?.participant.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {conversations.find(c => c.id === selectedConversation)?.online ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-neutral-600" />
                </button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-neutral-600" />
                </button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
            {selectedMessages.map((message) => {
              const isOwnMessage = message.senderId === currentUserId;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                          : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-neutral-500 ${
                      isOwnMessage ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {isOwnMessage && (
                        message.read ? (
                          <CheckCheck className="w-3 h-3 text-blue-600" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-neutral-200 bg-white">
            <div className="flex items-end gap-2">
              <button className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors flex-shrink-0">
                <Paperclip className="w-5 h-5 text-neutral-600" />
              </button>
              <button className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors flex-shrink-0">
                <ImageIcon className="w-5 h-5 text-neutral-600" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-3 gradient-primary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              Press Enter to send, Shift + Enter for new line
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No conversation selected</h3>
            <p className="text-neutral-600">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
