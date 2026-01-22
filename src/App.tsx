import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import TenantDashboard from './pages/tenant/TenantDashboard';
import PaymentsPage from './pages/tenant/PaymentsPage';
import MaintenancePage from './pages/tenant/MaintenancePage';
import DocumentsPage from './pages/tenant/DocumentsPage';
import MessagesPage from './pages/tenant/MessagesPage';
import TenantProfile from './pages/tenant/TenantProfile';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import PropertiesPage from './pages/owner/PropertiesPage';
import ResidentsPage from './pages/owner/ResidentsPage';
import FinancialsPage from './pages/owner/FinancialsPage';
import OwnerMaintenancePage from './pages/owner/OwnerMaintenancePage';
import OwnerDocumentsPage from './pages/owner/OwnerDocumentsPage';
import OwnerMeetingsPage from './pages/owner/OwnerMeetingsPage';
import OwnerSettingsPage from './pages/owner/OwnerSettingsPage';
import PortfolioAnalytics from './pages/owner/PortfolioAnalytics';
import PropertyDetailPage from './pages/owner/PropertyDetailPage';
import ResidentDetailPage from './pages/owner/ResidentDetailPage';
import VendorManagement from './pages/owner/VendorManagement';
import CalendarPage from './pages/owner/CalendarPage';
import TaskManagement from './pages/owner/TaskManagement';
import UnitsManagement from './pages/owner/UnitsManagement';
import ScheduledMaintenance from './pages/owner/ScheduledMaintenance';
import MaintenanceLogbook from './pages/owner/compliance/MaintenanceLogbook';
import ContingencyFund from './pages/owner/compliance/ContingencyFund';
import SalesCertificates from './pages/owner/compliance/SalesCertificates';
import CommonSystemsInventory from './pages/owner/compliance/CommonSystemsInventory';
import OwnerResponsibilities from './pages/owner/compliance/OwnerResponsibilities';
import MarketplaceHome from './pages/marketplace/MarketplaceHome';
import PropertySearch from './pages/marketplace/PropertySearch';
import PropertyDetail from './pages/marketplace/PropertyDetail';
import UnitDetail from './pages/marketplace/UnitDetail';
import MyBids from './pages/marketplace/MyBids';
import HelpCenter from './pages/HelpCenter';
import NotFound from './pages/errors/NotFound';
import AccessDenied from './pages/errors/AccessDenied';

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
        {/* Public Marketplace Routes */}
        <Route path="/" element={<MarketplaceHome />} />
        <Route path="/marketplace/search" element={<PropertySearch />} />
        <Route path="/marketplace/property/:id" element={<PropertyDetail />} />
        <Route path="/marketplace/property/:propertyId/unit/:unitId" element={<UnitDetail />} />

        {/* Protected Marketplace Routes */}
        <Route
          path="/marketplace/my-bids"
          element={
            <PrivateRoute>
              <MyBids />
            </PrivateRoute>
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Help Center */}
        <Route
          path="/help"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <HelpCenter />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

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
                  <Route path="profile" element={<TenantProfile />} />
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
                  <Route path="properties/:id" element={<PropertyDetailPage />} />
                  <Route path="properties/:propertyId/units" element={<UnitsManagement />} />
                  <Route path="residents" element={<ResidentsPage />} />
                  <Route path="residents/:id" element={<ResidentDetailPage />} />
                  <Route path="financials" element={<FinancialsPage />} />
                  <Route path="vendors" element={<VendorManagement />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="tasks" element={<TaskManagement />} />
                  <Route path="maintenance" element={<OwnerMaintenancePage />} />
                  <Route path="maintenance/scheduled" element={<ScheduledMaintenance />} />
                  <Route path="compliance/logbook" element={<MaintenanceLogbook />} />
                  <Route path="compliance/contingency-fund" element={<ContingencyFund />} />
                  <Route path="compliance/sales-certificates" element={<SalesCertificates />} />
                  <Route path="compliance/systems-inventory" element={<CommonSystemsInventory />} />
                  <Route path="compliance/owner-responsibilities" element={<OwnerResponsibilities />} />
                  <Route path="documents" element={<OwnerDocumentsPage />} />
                  <Route path="meetings" element={<OwnerMeetingsPage />} />
                  <Route path="analytics" element={<PortfolioAnalytics />} />
                  <Route path="settings" element={<OwnerSettingsPage />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Error Routes */}
        <Route path="/403" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
