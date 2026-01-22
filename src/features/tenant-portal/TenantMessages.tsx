import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MessageCenter } from '@/components/messaging/MessageCenter';

export function TenantMessages() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Messages</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with your property manager</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MessageCenter currentUserId={user?.id || ''} currentUserRole="tenant" />
      </div>
    </div>
  );
}
