import { useAuth } from '@/context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.full_name}</h2>
              <p className="text-gray-600 capitalize">{user?.role?.replace('_', ' ')}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
            </div>
            {user?.okey_score && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">O'Key Score</label>
                <p className="text-2xl font-bold text-blue-600">{user.okey_score}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {user?.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
