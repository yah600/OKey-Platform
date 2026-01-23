import { useAuthStore } from '@/store/authStore';
import { useMessagesStore, Conversation } from '@/store/messagesStore';
import { Search, Mail, MailOpen } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({ selectedConversationId, onSelectConversation }: ConversationListProps) {
  const { user } = useAuthStore();
  const { getConversationsByUser } = useMessagesStore();
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = user ? getConversationsByUser(user.id) : [];

  const filteredConversations = conversations.filter((conv) =>
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessagePreview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 border-r border-neutral-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">Messages</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No conversations yet</p>
          </div>
        ) : (
          <div>
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={cn(
                  'w-full p-4 border-b border-neutral-100 text-left hover:bg-neutral-50 transition-colors',
                  selectedConversationId === conv.id && 'bg-primary-50 border-l-4 border-l-primary-600'
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {conv.unreadCount > 0 ? (
                      <MailOpen className="w-4 h-4 text-primary-600" />
                    ) : (
                      <Mail className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className={cn(
                      'text-sm font-medium',
                      conv.unreadCount > 0 ? 'text-neutral-900' : 'text-neutral-700'
                    )}>
                      {conv.subject}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">{formatTime(conv.lastMessageAt)}</span>
                </div>

                <p className={cn(
                  'text-xs line-clamp-2',
                  conv.unreadCount > 0 ? 'text-neutral-700 font-medium' : 'text-neutral-500'
                )}>
                  {conv.lastMessagePreview}
                </p>

                {conv.unreadCount > 0 && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                      {conv.unreadCount} new
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
