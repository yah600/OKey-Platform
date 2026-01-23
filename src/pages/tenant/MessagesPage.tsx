import { useState } from 'react';
import { ConversationList } from '@/components/messaging/ConversationList';
import { ChatInterface } from '@/components/messaging/ChatInterface';
import { Mail } from 'lucide-react';

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <div className="h-[calc(100vh-100px)] flex bg-neutral-50">
      {/* Conversations Sidebar */}
      <ConversationList
        selectedConversationId={selectedConversationId || undefined}
        onSelectConversation={setSelectedConversationId}
      />

      {/* Chat Interface */}
      {selectedConversationId ? (
        <ChatInterface conversationId={selectedConversationId} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <Mail className="w-16 h-16 text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Select a conversation</h3>
          <p className="text-sm text-neutral-500">Choose a conversation from the left to start messaging</p>
        </div>
      )}
    </div>
  );
}
