import { useState, useEffect } from 'react';
import { Mail, Send, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useMessagesStore } from '../../store/messagesStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import ComposeMessageModal from '../../components/organisms/ComposeMessageModal';
import EmptyState from '../../components/ui/EmptyState';

export default function MessagesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { user } = useAuthStore();

  const { getConversationsByUser, markAsRead, getUnreadCount } = useMessagesStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const conversations = user ? getConversationsByUser(user.id) : [];
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Messages</h1>
          <p className="text-sm text-neutral-600">
            Communicate with your property manager
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowComposeModal(true)}>
          <Send className="w-4 h-4" />
          New Message
        </Button>
      </div>

      {conversations.length > 0 ? (
        <div className="space-y-3">
          {conversations.map((conversation) => {
            const otherParticipant = conversation.participants.find((p) => p.id !== user?.id);
            const hasUnread = conversation.unreadCount > 0;

            return (
              <Card
                key={conversation.id}
                className={`cursor-pointer hover:border-neutral-300 transition-colors ${
                  hasUnread ? 'border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={
                            hasUnread
                              ? 'text-sm font-semibold text-neutral-900'
                              : 'text-sm font-medium text-neutral-900'
                          }
                        >
                          {otherParticipant?.name || 'Unknown'}
                        </h3>
                        {hasUnread && (
                          <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p
                        className={
                          hasUnread
                            ? 'text-sm font-medium text-neutral-900 mb-1'
                            : 'text-sm text-neutral-900 mb-1'
                        }
                      >
                        {conversation.subject}
                      </p>
                      <p className="text-xs text-neutral-600 line-clamp-2">
                        {conversation.lastMessagePreview}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-neutral-500">
                      {new Date(conversation.lastMessageAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={MessageSquare}
            title="No messages yet"
            description="Start a conversation with your property manager or wait for messages from them."
            action={{
              label: 'Send Message',
              onClick: () => setShowComposeModal(true),
            }}
          />
        </Card>
      )}

      {/* Compose Message Modal */}
      <ComposeMessageModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
      />
    </div>
  );
}
