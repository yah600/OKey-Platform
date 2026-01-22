import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import TenantDashboard from './pages/tenant/TenantDashboard';
import PaymentsPage from './pages/tenant/PaymentsPage';
import MaintenancePage from './pages/tenant/MaintenancePage';
import DocumentsPage from './pages/tenant/DocumentsPage';
import MessagesPage from './pages/tenant/MessagesPage';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import PropertiesPage from './pages/owner/PropertiesPage';
import ResidentsPage from './pages/owner/ResidentsPage';
import FinancialsPage from './pages/owner/FinancialsPage';
import OwnerMaintenancePage from './pages/owner/OwnerMaintenancePage';
import OwnerDocumentsPage from './pages/owner/OwnerDocumentsPage';

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

  const DashboardRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" />;
    }

    if (user.role === 'tenant') {
      return <Navigate to="/tenant/dashboard" />;
    } else if (user.role === 'owner') {
      return <Navigate to="/owner/dashboard" />;
    }

    return <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Tenant Routes */}
        <Route
          path="/tenant/*"
          element={
            <PrivateRoute allowedRoles={['tenant']}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<TenantDashboard />} />
                  <Route path="payments" element={<PaymentsPage />} />
                  <Route path="maintenance" element={<MaintenancePage />} />
                  <Route path="documents" element={<DocumentsPage />} />
                  <Route path="messages" element={<MessagesPage />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Owner Routes */}
        <Route
          path="/owner/*"
          element={
            <PrivateRoute allowedRoles={['owner', 'admin']}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<OwnerDashboard />} />
                  <Route path="properties" element={<PropertiesPage />} />
                  <Route path="residents" element={<ResidentsPage />} />
                  <Route path="financials" element={<FinancialsPage />} />
                  <Route path="maintenance" element={<OwnerMaintenancePage />} />
                  <Route path="documents" element={<OwnerDocumentsPage />} />
                </Routes>
              </DashboardLayout>
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
