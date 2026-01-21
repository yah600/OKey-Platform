import { useState } from 'react';
import { BidProvider } from './context/BidContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
import { LogOut, User } from 'lucide-react';

// Pages
import { MarketplaceHome } from './features/marketplace/marketplace-home';
import { PropertySearch } from './features/marketplace/property-search';
import { PropertyDetail } from './features/marketplace/property-detail';
import { UnitDetail } from './features/marketplace/unit-detail';
import { ScoreDashboard } from './features/marketplace/score-dashboard';
import { MyBids } from './features/marketplace/my-bids';
import { TenantDashboardEnhanced } from './features/tenant-portal/tenant-dashboard-enhanced';
import { OwnerDashboardEnhanced } from './features/property-management/owner-dashboard-enhanced';

type Page = 'home' | 'search' | 'property' | 'unit' | 'score' | 'bids' | 'tenant' | 'owner';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedId, setSelectedId] = useState<string>('');

  const navigate = (page: string, id?: string) => {
    setCurrentPage(page as Page);
    if (id) setSelectedId(id);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BidProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Navigation */}
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('home')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">O</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">O'Key Platform</span>
                  <div className="text-xs text-gray-500 -mt-1">Property Management</div>
                </div>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                <button
                  onClick={() => navigate('home')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    currentPage === 'home'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Marketplace
                </button>
                <button
                  onClick={() => navigate('search')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    currentPage === 'search'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Search
                </button>
                <button
                  onClick={() => navigate('score')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    currentPage === 'score'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  My Score
                </button>
                <button
                  onClick={() => navigate('bids')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    currentPage === 'bids'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  My Bids
                </button>
              </div>

              <div className="h-8 w-px bg-gray-300"></div>

              <div className="flex gap-2">
                {user?.role === 'tenant' && (
                  <button
                    onClick={() => navigate('tenant')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      currentPage === 'tenant'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Tenant Portal
                  </button>
                )}
                {user?.role === 'owner' && (
                  <button
                    onClick={() => navigate('owner')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      currentPage === 'owner'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Owner Portal
                  </button>
                )}
              </div>

              <div className="h-8 w-px bg-gray-300"></div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-600 capitalize">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        {currentPage === 'home' && <MarketplaceHome onNavigate={navigate} />}
        {currentPage === 'search' && <PropertySearch onNavigate={navigate} />}
        {currentPage === 'property' && <PropertyDetail propertyId={selectedId} onNavigate={navigate} />}
        {currentPage === 'unit' && <UnitDetail unitId={selectedId} onNavigate={navigate} />}
        {currentPage === 'score' && <ScoreDashboard onNavigate={navigate} />}
        {currentPage === 'bids' && <MyBids onNavigate={navigate} />}
        {currentPage === 'tenant' && <TenantDashboardEnhanced onNavigate={navigate} />}
        {currentPage === 'owner' && <OwnerDashboardEnhanced onNavigate={navigate} />}
      </div>
    </BidProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
