import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/auth/LoginPage';
import MarketplaceHome from './pages/marketplace/MarketplaceHome';
import TenantDashboard from './pages/tenant/TenantDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated, user } = useAuthStore();

  // Redirect based on role after login
  const DashboardRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" />;
    }

    if (user.role === 'tenant') {
      return <Navigate to="/tenant/dashboard" />;
    } else if (user.role === 'owner') {
      return <Navigate to="/owner/dashboard" />;
    }

    return <Navigate to="/marketplace" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Tenant Routes */}
        <Route
          path="/tenant/dashboard"
          element={
            <PrivateRoute allowedRoles={['tenant']}>
              <TenantDashboard />
            </PrivateRoute>
          }
        />

        {/* Owner Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <PrivateRoute allowedRoles={['owner', 'admin']}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />

        {/* Marketplace */}
        <Route
          path="/marketplace"
          element={
            <PrivateRoute>
              <MarketplaceHome />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
