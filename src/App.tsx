import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';
import { LoadingScreen } from './components/global/LoadingScreen';

// Lazy load all page components for code splitting
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// Marketplace pages
const MarketplaceHome = lazy(() => import('./pages/marketplace/MarketplaceHome'));
const PropertySearch = lazy(() => import('./pages/marketplace/PropertySearch'));
const PropertyDetail = lazy(() => import('./pages/marketplace/PropertyDetail'));
const UnitDetail = lazy(() => import('./pages/marketplace/UnitDetail'));
const MyBids = lazy(() => import('./pages/marketplace/MyBids'));

// Tenant pages
const TenantDashboard = lazy(() => import('./pages/tenant/TenantDashboard'));
const PaymentsPage = lazy(() => import('./pages/tenant/PaymentsPage'));
const MaintenancePage = lazy(() => import('./pages/tenant/MaintenancePage'));
const DocumentsPage = lazy(() => import('./pages/tenant/DocumentsPage'));
const MessagesPage = lazy(() => import('./pages/tenant/MessagesPage'));
const TenantProfile = lazy(() => import('./pages/tenant/TenantProfile'));

// Owner pages
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'));
const PropertiesPage = lazy(() => import('./pages/owner/PropertiesPage'));
const PropertyDetailPage = lazy(() => import('./pages/owner/PropertyDetailPage'));
const UtilityManagement = lazy(() => import('./pages/owner/UtilityManagement'));
const ParkingAmenities = lazy(() => import('./pages/owner/ParkingAmenities'));
const VisitorManagement = lazy(() => import('./pages/owner/VisitorManagement'));
const EmergencyProtocols = lazy(() => import('./pages/owner/EmergencyProtocols'));
const BulkOperations = lazy(() => import('./pages/owner/BulkOperations'));
const UnitsManagement = lazy(() => import('./pages/owner/UnitsManagement'));
const ResidentsPage = lazy(() => import('./pages/owner/ResidentsPage'));
const ResidentDetailPage = lazy(() => import('./pages/owner/ResidentDetailPage'));
const TenantScreening = lazy(() => import('./pages/owner/TenantScreening'));
const LeaseBuilder = lazy(() => import('./pages/owner/LeaseBuilder'));
const MoveInChecklist = lazy(() => import('./pages/owner/MoveInChecklist'));
const MoveOutChecklist = lazy(() => import('./pages/owner/MoveOutChecklist'));
const FinancialsPage = lazy(() => import('./pages/owner/FinancialsPage'));
const FinancialReports = lazy(() => import('./pages/owner/FinancialReports'));
const ExpenseTracking = lazy(() => import('./pages/owner/ExpenseTracking'));
const TaxDocuments = lazy(() => import('./pages/owner/TaxDocuments'));
const OwnerMaintenancePage = lazy(() => import('./pages/owner/OwnerMaintenancePage'));
const ScheduledMaintenance = lazy(() => import('./pages/owner/ScheduledMaintenance'));
const OwnerDocumentsPage = lazy(() => import('./pages/owner/OwnerDocumentsPage'));
const OwnerMeetingsPage = lazy(() => import('./pages/owner/OwnerMeetingsPage'));
const OwnerSettingsPage = lazy(() => import('./pages/owner/OwnerSettingsPage'));
const PortfolioAnalytics = lazy(() => import('./pages/owner/PortfolioAnalytics'));
const VendorManagement = lazy(() => import('./pages/owner/VendorManagement'));
const CalendarPage = lazy(() => import('./pages/owner/CalendarPage'));
const TaskManagement = lazy(() => import('./pages/owner/TaskManagement'));

// Quebec Law 16 Compliance pages
const MaintenanceLogbook = lazy(() => import('./pages/owner/compliance/MaintenanceLogbook'));
const ContingencyFund = lazy(() => import('./pages/owner/compliance/ContingencyFund'));
const SalesCertificates = lazy(() => import('./pages/owner/compliance/SalesCertificates'));
const CommonSystemsInventory = lazy(() => import('./pages/owner/compliance/CommonSystemsInventory'));
const OwnerResponsibilities = lazy(() => import('./pages/owner/compliance/OwnerResponsibilities'));

// Shared pages
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const AllNotifications = lazy(() => import('./pages/AllNotifications'));
const GlobalSearch = lazy(() => import('./pages/GlobalSearch'));

// Error pages
const NotFound = lazy(() => import('./pages/errors/NotFound'));
const AccessDenied = lazy(() => import('./pages/errors/AccessDenied'));

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
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
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
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Shared Protected Routes */}
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
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AllNotifications />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <GlobalSearch />
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
                  <Route path="bids" element={<MyBids />} />
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
                  <Route path="utilities" element={<UtilityManagement />} />
                  <Route path="properties/:propertyId/units" element={<UnitsManagement />} />
                  <Route path="residents" element={<ResidentsPage />} />
                  <Route path="residents/:id" element={<ResidentDetailPage />} />
                  <Route path="screening" element={<TenantScreening />} />
                  <Route path="lease/new" element={<LeaseBuilder />} />
                  <Route path="checklist/move-in" element={<MoveInChecklist />} />
                  <Route path="checklist/move-out" element={<MoveOutChecklist />} />
                  <Route path="financials" element={<FinancialsPage />} />
                  <Route path="financials/reports" element={<FinancialReports />} />
                  <Route path="financials/expenses" element={<ExpenseTracking />} />
                  <Route path="financials/tax-documents" element={<TaxDocuments />} />
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
                  <Route path="parking" element={<ParkingAmenities />} />
                  <Route path="visitors" element={<VisitorManagement />} />
                  <Route path="emergency" element={<EmergencyProtocols />} />
                  <Route path="bulk-operations" element={<BulkOperations />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Error Routes */}
        <Route path="/403" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
