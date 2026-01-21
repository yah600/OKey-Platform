import { useState } from 'react';

// Pages
import { MarketplaceHome } from './features/marketplace/marketplace-home';
import { PropertyDetail } from './features/marketplace/property-detail';
import { UnitDetail } from './features/marketplace/unit-detail';
import { ScoreDashboard } from './features/marketplace/score-dashboard';
import { MyBids } from './features/marketplace/my-bids';
import { OwnerDashboard } from './features/property-management/owner-dashboard';

type Page = 'home' | 'property' | 'unit' | 'score' | 'bids' | 'owner';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedId, setSelectedId] = useState<string>('');

  const navigate = (page: string, id?: string) => {
    setCurrentPage(page as Page);
    if (id) setSelectedId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">O</span>
            </div>
            <span className="text-xl font-bold">O'Key Platform</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('home')}
              className={`px-4 py-2 rounded ${currentPage === 'home' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('score')}
              className={`px-4 py-2 rounded ${currentPage === 'score' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}
            >
              My Score
            </button>
            <button
              onClick={() => navigate('bids')}
              className={`px-4 py-2 rounded ${currentPage === 'bids' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}
            >
              My Bids
            </button>
            <button
              onClick={() => navigate('owner')}
              className={`px-4 py-2 rounded ${currentPage === 'owner' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}
            >
              Owner Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'home' && <MarketplaceHome onNavigate={navigate} />}
      {currentPage === 'property' && <PropertyDetail propertyId={selectedId} onNavigate={navigate} />}
      {currentPage === 'unit' && <UnitDetail unitId={selectedId} onNavigate={navigate} />}
      {currentPage === 'score' && <ScoreDashboard onNavigate={navigate} />}
      {currentPage === 'bids' && <MyBids onNavigate={navigate} />}
      {currentPage === 'owner' && <OwnerDashboard onNavigate={navigate} />}
    </div>
  );
}

export default App;
