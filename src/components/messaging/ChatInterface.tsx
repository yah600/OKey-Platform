import { useAuthStore } from '@/store/authStore';
import { useMessagesStore } from '@/store/messagesStore';
import { Send, Paperclip, MoreVertical } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ChatInterfaceProps {
  conversationId: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const { user } = useAuthStore();
  const { getMessagesByConversation, sendMessage, markConversationAsRead } = useMessagesStore();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = getMessagesByConversation(conversationId);
  const conversation = messages[0]; // Get conversation info from first message

  useEffect(() => {
    // Mark conversation as read when opened
    if (conversationId && user) {
      markConversationAsRead(conversationId);
    }
  }, [conversationId, user, markConversationAsRead]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !user || !conversation) return;

    sendMessage({
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role as 'tenant' | 'owner',
      recipientId: conversation.senderId === user.id ? conversation.recipientId : conversation.senderId,
      recipientName: conversation.senderId === user.id ? conversation.recipientName : conversation.senderName,
      subject: conversation.subject,
      body: messageInput.trim(),
    });

    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-neutral-900">{conversation.subject}</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            {conversation.senderRole === 'manager' ? 'Property Manager' :
             conversation.senderRole === 'system' ? 'Building Manager' :
             conversation.senderName}
          </p>
        </div>
        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-neutral-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === user?.id;

          return (
            <div
              key={message.id}
              className={cn('flex', isOwnMessage ? 'justify-end' : 'justify-start')}
            >
              <div className={cn('max-w-[70%]', isOwnMessage ? 'items-end' : 'items-start')}>
                {!isOwnMessage && (
                  <div className="text-xs font-medium text-neutral-700 mb-1">
                    {message.senderName}
                  </div>
                )}
                <div
                  className={cn(
                    'px-4 py-3 rounded-lg',
                    isOwnMessage
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-900'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                </div>
                <div className="text-xs text-neutral-500 mt-1 px-1">
                  {formatTime(message.sentAt)}
                  {message.isRead && isOwnMessage && ' • Read'}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-neutral-600" />
          </button>
          <div className="flex-1">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
