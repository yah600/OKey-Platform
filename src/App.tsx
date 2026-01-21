import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/lib/hooks/use-theme';
import { AuthProvider, useAuth } from '@/lib/auth/auth-provider';
import { RBACProvider } from '@/lib/rbac/rbac-context';
import { I18nProvider } from '@/lib/i18n/i18n-context';
import { BidProvider } from '@/context/BidContext';
import { Toaster } from '@/components/ui/sonner';

// Layout Components
import { PublicNavigation } from '@/components/layout/public-navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

// Auth Pages
import { LoginPage } from '@/components/auth/login-page';
import { RegisterPage } from '@/components/auth/register-page';

// Public Marketplace Pages (from Okeyapp)
import { MarketplaceHome } from '@/features/marketplace/marketplace-home';
import { PropertySearch } from '@/features/marketplace/property-search';
import { PropertyDetail } from '@/features/marketplace/property-detail';
import { UnitDetail } from '@/features/marketplace/unit-detail';
import { MyBids } from '@/features/marketplace/my-bids';
import { ScoreDashboard } from '@/features/marketplace/score-dashboard';

// Tenant Portal Pages
import { TenantDashboard } from '@/features/tenant-portal/tenant-dashboard';
import { TenantPayments } from '@/features/tenant-portal/tenant-payments';
import { TenantMaintenance } from '@/features/tenant-portal/tenant-maintenance';
import { TenantDocuments } from '@/features/tenant-portal/tenant-documents';

// Property Management Pages (from ImmoflowNew)
import { OwnerDashboard } from '@/features/property-management/owner-dashboard';
import { PropertiesPage } from '@/features/property-management/properties-page';
import { TenantsPage } from '@/features/property-management/tenants-page';
import { FinancesPage } from '@/features/property-management/finances-page';
import { MaintenancePage } from '@/features/property-management/maintenance-page';
import { DocumentsPage } from '@/features/property-management/documents-page';
import { AnalyticsPage } from '@/features/property-management/analytics-page';

// Route type definition
type Route =
  // Public routes
  | 'marketplace' | 'search' | 'property' | 'unit' | 'score' | 'my-bids'
  // Tenant routes
  | 'tenant-dashboard' | 'tenant-payments' | 'tenant-maintenance' | 'tenant-documents'
  // Owner/Manager routes
  | 'owner-dashboard' | 'properties' | 'tenants' | 'finances' | 'maintenance' | 'documents' | 'analytics'
  // Auth routes
  | 'login' | 'register';

function AppContent() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [currentRoute, setCurrentRoute] = useState<Route>('marketplace');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Determine default route based on user role
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentRoute('marketplace');
      return;
    }

    // Redirect based on role
    if (user?.role === 'tenant') {
      setCurrentRoute('tenant-dashboard');
    } else if (user?.role === 'owner' || user?.role === 'property_manager') {
      setCurrentRoute('owner-dashboard');
    } else {
      setCurrentRoute('marketplace');
    }
  }, [isAuthenticated, user?.role]);

  const handleNavigate = (route: string, id?: string) => {
    if (route === 'property') {
      setSelectedPropertyId(id || null);
    } else if (route === 'unit') {
      setSelectedUnitId(id || null);
    }
    setCurrentRoute(route as Route);
  };

  // Auth routes
  if (!isAuthenticated && (currentRoute === 'login' || currentRoute === 'register')) {
    return (
      <div className="min-h-screen bg-background">
        {currentRoute === 'login' ? (
          <LoginPage onNavigate={handleNavigate} />
        ) : (
          <RegisterPage onNavigate={handleNavigate} />
        )}
      </div>
    );
  }

  // Determine which layout to use
  const isPublicRoute = ['marketplace', 'search', 'property', 'unit', 'score', 'my-bids'].includes(currentRoute);

  // Render content based on route
  const renderContent = () => {
    switch (currentRoute) {
      // Public Marketplace
      case 'marketplace':
        return <MarketplaceHome onNavigate={handleNavigate} />;
      case 'search':
        return <PropertySearch onNavigate={handleNavigate} />;
      case 'property':
        return selectedPropertyId ? (
          <PropertyDetail propertyId={selectedPropertyId} onNavigate={handleNavigate} />
        ) : (
          <MarketplaceHome onNavigate={handleNavigate} />
        );
      case 'unit':
        return selectedUnitId ? (
          <UnitDetail unitId={selectedUnitId} onNavigate={handleNavigate} />
        ) : (
          <MarketplaceHome onNavigate={handleNavigate} />
        );
      case 'score':
        return <ScoreDashboard onNavigate={handleNavigate} />;
      case 'my-bids':
        return <MyBids onNavigate={handleNavigate} />;

      // Tenant Portal
      case 'tenant-dashboard':
        return <TenantDashboard onNavigate={handleNavigate} />;
      case 'tenant-payments':
        return <TenantPayments onNavigate={handleNavigate} />;
      case 'tenant-maintenance':
        return <TenantMaintenance onNavigate={handleNavigate} />;
      case 'tenant-documents':
        return <TenantDocuments onNavigate={handleNavigate} />;

      // Owner/Manager Portal
      case 'owner-dashboard':
        return <OwnerDashboard onNavigate={handleNavigate} />;
      case 'properties':
        return <PropertiesPage onNavigate={handleNavigate} />;
      case 'tenants':
        return <TenantsPage onNavigate={handleNavigate} />;
      case 'finances':
        return <FinancesPage onNavigate={handleNavigate} />;
      case 'maintenance':
        return <MaintenancePage onNavigate={handleNavigate} />;
      case 'documents':
        return <DocumentsPage onNavigate={handleNavigate} />;
      case 'analytics':
        return <AnalyticsPage onNavigate={handleNavigate} />;

      default:
        return <MarketplaceHome onNavigate={handleNavigate} />;
    }
  };

  // Public routes use public navigation
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavigation
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          user={user}
        />
        {renderContent()}
      </div>
    );
  }

  // Authenticated routes use dashboard layout
  return (
    <DashboardLayout
      currentRoute={currentRoute}
      onNavigate={handleNavigate}
      user={user}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider defaultLanguage="en">
        <AuthProvider>
          <RBACProvider>
            <BidProvider>
              <AppContent />
              <Toaster />
            </BidProvider>
          </RBACProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
