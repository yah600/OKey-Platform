import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const getDashboardPath = () => {
    if (!isAuthenticated || !user) return '/login';
    return user.role === 'tenant' ? '/tenant/dashboard' : '/owner/dashboard';
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* 403 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-9xl font-bold text-neutral-200">403</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-12 h-12 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
          Access Denied
        </h2>
        <p className="text-neutral-600 mb-8">
          You don't have permission to access this page.
          {!isAuthenticated
            ? ' Please sign in to continue.'
            : ' This page is restricted to certain user roles.'}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(getDashboardPath())}
            className="w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 mb-3">
            If you believe this is an error, please contact support.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <button
              onClick={() => navigate('/help')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Visit Help Center
            </button>
            {isAuthenticated && (
              <>
                <span className="text-neutral-300">•</span>
                <span className="text-neutral-600">
                  Logged in as: <span className="font-medium">{user?.email}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
