import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { BidProvider } from './context/BidContext';

// Route Guards
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { RoleRoute } from './components/routes/RoleRoute';
import { PublicRoute } from './components/routes/PublicRoute';

// Layout
import { MainLayout } from './components/layout/MainLayout';

// Public Pages
import { LoginPage } from './features/auth/LoginPage';
import { MarketplaceHome } from './components/adapters/MarketplaceHomeAdapter';
import { PropertySearch } from './components/adapters/PropertySearchAdapter';
import { PropertyDetail } from './components/adapters/PropertyDetailAdapter';
import { UnitDetail } from './components/adapters/UnitDetailAdapter';

// Protected Pages (Any Authenticated User)
import { MyBids } from './components/adapters/MyBidsAdapter';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { ScoreDashboard } from './components/adapters/ScoreDashboardAdapter';

// Tenant Pages
import { TenantDashboardEnhanced } from './components/adapters/TenantDashboardAdapter';
import { TenantPaymentsPage } from './pages/tenant/TenantPaymentsPage';
import { TenantMaintenancePage } from './pages/tenant/TenantMaintenancePage';
import { TenantDocumentsPage } from './pages/tenant/TenantDocumentsPage';
import { TenantMessagesPage } from './pages/tenant/TenantMessagesPage';

// Owner/Manager/Admin Pages
import { OwnerDashboardEnhanced } from './components/adapters/OwnerDashboardAdapter';
import { PropertiesPage } from './pages/owner/PropertiesPage';
import { PropertyDetailPage } from './pages/owner/PropertyDetailPage';
import { FinancesPage } from './pages/owner/FinancesPage';
import { MaintenancePage } from './pages/owner/MaintenancePage';
import { ResidentsPage } from './pages/owner/ResidentsPage';
import { DocumentsPage } from './pages/owner/DocumentsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <BidProvider>
            <Routes>
            {/* Public Routes with PublicRoute guard */}
            <Route element={<PublicRoute />}>
              <Route path="/auth/login" element={<LoginPage />} />
            </Route>

            {/* Public Routes (accessible to everyone) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<MarketplaceHome />} />
              <Route path="/search" element={<PropertySearch />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/unit/:id" element={<UnitDetail />} />

              {/* Protected Routes (any authenticated user) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/my-bids" element={<MyBids />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/score" element={<ScoreDashboard />} />

                {/* Tenant Routes */}
                <Route element={<RoleRoute allowedRoles={['tenant']} />}>
                  <Route path="/tenant" element={<TenantDashboardEnhanced />} />
                  <Route path="/tenant/payments" element={<TenantPaymentsPage />} />
                  <Route path="/tenant/maintenance" element={<TenantMaintenancePage />} />
                  <Route path="/tenant/documents" element={<TenantDocumentsPage />} />
                  <Route path="/tenant/messages" element={<TenantMessagesPage />} />
                </Route>

                {/* Owner/Manager/Admin Routes */}
                <Route element={<RoleRoute allowedRoles={['owner', 'property_manager', 'super_admin']} />}>
                  <Route path="/dashboard" element={<OwnerDashboardEnhanced />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/properties/:id" element={<PropertyDetailPage />} />
                  <Route path="/finances" element={<FinancesPage />} />
                  <Route path="/maintenance" element={<MaintenancePage />} />
                  <Route path="/residents" element={<ResidentsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                </Route>
              </Route>
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BidProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
