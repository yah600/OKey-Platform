import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in and tries to access login page, redirect based on role
  if (user) {
    if (user.role === 'tenant') {
      return <Navigate to="/tenant" replace />;
    } else if (['owner', 'property_manager', 'super_admin'].includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
