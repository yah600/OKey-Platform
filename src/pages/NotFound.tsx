import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoToDashboard = () => {
    if (user?.role === 'tenant') {
      navigate('/tenant/dashboard');
    } else if (user?.role === 'owner') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoToDashboard}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-white flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Homepage
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-3">Or search for what you need</p>
          <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow-sm">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 outline-none text-gray-900"
              onFocus={() => {/* Would open command palette */}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
