import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Trophy,
  DollarSign,
  Percent,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  BedDouble,
  Bath,
  Square,
  MapPin,
  X,
  ChevronRight,
  Home,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getBidsByUser,
  getUnitById,
  getPropertyById,
  getBidsByUnit,
  mockBids,
} from '@/lib/data/mockData';

// ============================================================================
// TYPES
// ============================================================================

type TabType = 'active' | 'won' | 'lost' | 'expired';
type SortOption = 'recent' | 'highest' | 'lowest' | 'expiring';
type BidStatus = 'active' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';

interface EnrichedBid {
  id: string;
  unit_id: string;
  bidder_id: string;
  bid_amount: number;
  message?: string;
  status: BidStatus;
  auto_bid_enabled: boolean;
  max_auto_bid?: number | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  unit: any;
  property: any;
  isWinning: boolean;
  rank: number;
  totalBids: number;
  highestBid: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MyBids() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [selectedBid, setSelectedBid] = useState<EnrichedBid | null>(null);
  const [bids, setBids] = useState<EnrichedBid[]>([]);

  // Update bid modal state
  const [bidAmount, setBidAmount] = useState('');
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);
  const [maxAutoBid, setMaxAutoBid] = useState('');
  const [bidError, setBidError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load bids
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const userBids = getBidsByUser(user.id);

      // Enrich bids with unit, property, and competition data
      const enriched: EnrichedBid[] = userBids.map(bid => {
        const unit = getUnitById(bid.unit_id);
        const property = unit ? getPropertyById(unit.property_id) : null;
        const unitBids = getBidsByUnit(bid.unit_id);
        const sortedBids = unitBids.sort((a, b) => b.bid_amount - a.bid_amount);
        const isWinning = sortedBids[0]?.id === bid.id;
        const rank = sortedBids.findIndex(b => b.id === bid.id) + 1;
        const highestBid = sortedBids[0]?.bid_amount || bid.bid_amount;

        return {
          ...bid,
          unit,
          property,
          isWinning,
          rank,
          totalBids: sortedBids.length,
          highestBid,
        };
      });

      setBids(enriched);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // Filter bids by tab
  const activeBids = useMemo(() => bids.filter(b => b.status === 'active'), [bids]);
  const wonBids = useMemo(() => bids.filter(b => b.status === 'accepted'), [bids]);
  const lostBids = useMemo(() => bids.filter(b => b.status === 'rejected'), [bids]);
  const expiredBids = useMemo(() => {
    return bids.filter(b => {
      if (b.status === 'expired') return true;
      if (b.expires_at && new Date(b.expires_at) < new Date()) return true;
      return false;
    });
  }, [bids]);

  // Calculate stats
  const winningBids = activeBids.filter(b => b.isWinning).length;
  const totalSpent = wonBids.reduce((sum, b) => sum + b.bid_amount, 0);
  const winRate = bids.length > 0 ? ((wonBids.length / bids.length) * 100).toFixed(0) : 0;

  // Get current tab bids
  const getCurrentTabBids = () => {
    switch (activeTab) {
      case 'active':
        return activeBids;
      case 'won':
        return wonBids;
      case 'lost':
        return lostBids;
      case 'expired':
        return expiredBids;
      default:
        return [];
    }
  };

  // Filter by search
  const filteredBids = useMemo(() => {
    const tabBids = getCurrentTabBids();
    if (!searchQuery) return tabBids;

    const query = searchQuery.toLowerCase();
    return tabBids.filter(bid => {
      if (!bid.unit || !bid.property) return false;
      const propertyName = bid.property.name?.toLowerCase() || '';
      const unitNumber = bid.unit.unit_number?.toLowerCase() || '';
      const address = `${bid.property.address.street} ${bid.property.address.city}`.toLowerCase();
      return propertyName.includes(query) || unitNumber.includes(query) || address.includes(query);
    });
  }, [searchQuery, activeTab, activeBids, wonBids, lostBids, expiredBids]);

  // Sort bids
  const sortedBids = useMemo(() => {
    const sorted = [...filteredBids];
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'highest':
        return sorted.sort((a, b) => b.bid_amount - a.bid_amount);
      case 'lowest':
        return sorted.sort((a, b) => a.bid_amount - b.bid_amount);
      case 'expiring':
        return sorted.sort((a, b) => {
          if (!a.expires_at) return 1;
          if (!b.expires_at) return -1;
          return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
        });
      default:
        return sorted;
    }
  }, [filteredBids, sortBy]);

  // Handlers
  const handleUpdateBid = (bid: EnrichedBid) => {
    setSelectedBid(bid);
    setBidAmount(bid.bid_amount.toString());
    setAutoBidEnabled(bid.auto_bid_enabled);
    setMaxAutoBid(bid.max_auto_bid?.toString() || '');
    setBidError(null);
    setShowUpdateModal(true);
  };

  const handleWithdrawBid = (bid: EnrichedBid) => {
    setSelectedBid(bid);
    setShowWithdrawDialog(true);
  };

  const confirmWithdraw = () => {
    if (!selectedBid) return;

    // Simulate API call
    setTimeout(() => {
      setBids(bids.filter(b => b.id !== selectedBid.id));
      setShowWithdrawDialog(false);
      setSelectedBid(null);
    }, 500);
  };

  const validateBidAmount = (amount: number): string | null => {
    if (!selectedBid) return 'No bid selected';
    if (amount <= selectedBid.bid_amount) {
      return `New bid must be higher than your current bid ($${selectedBid.bid_amount.toLocaleString()})`;
    }
    if (amount <= selectedBid.highestBid && !selectedBid.isWinning) {
      return `Bid must be higher than current highest bid ($${selectedBid.highestBid.toLocaleString()})`;
    }
    if (autoBidEnabled && maxAutoBid) {
      const maxAuto = parseFloat(maxAutoBid);
      if (maxAuto <= amount) {
        return 'Max auto-bid must be higher than your bid';
      }
    }
    return null;
  };

  const submitBidUpdate = () => {
    if (!selectedBid) return;

    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      setBidError('Please enter a valid amount');
      return;
    }

    const validationError = validateBidAmount(amount);
    if (validationError) {
      setBidError(validationError);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const updatedBids = bids.map(b => {
        if (b.id === selectedBid.id) {
          return {
            ...b,
            bid_amount: amount,
            auto_bid_enabled: autoBidEnabled,
            max_auto_bid: autoBidEnabled && maxAutoBid ? parseFloat(maxAutoBid) : null,
            updated_at: new Date().toISOString(),
          };
        }
        return b;
      });

      // Recalculate winning status
      const enriched = updatedBids.map(bid => {
        const unitBids = updatedBids.filter(ub => ub.unit_id === bid.unit_id);
        const sortedBids = unitBids.sort((a, b) => b.bid_amount - a.bid_amount);
        const isWinning = sortedBids[0]?.id === bid.id;
        const rank = sortedBids.findIndex(b => b.id === bid.id) + 1;
        const highestBid = sortedBids[0]?.bid_amount || bid.bid_amount;

        return {
          ...bid,
          isWinning,
          rank,
          highestBid,
        };
      });

      setBids(enriched);
      setIsSubmitting(false);
      setShowUpdateModal(false);
      setSelectedBid(null);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your bids.
          </p>
          <button
            onClick={() => navigate('/auth/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your bids...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => navigate('/')}
              className="hover:text-blue-600 flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">My Bids</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bids</h1>
          <p className="text-lg text-gray-600">Track and manage all your property bids</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* Total Active Bids */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">{activeBids.length}</div>
              <div className="text-sm font-medium text-blue-700">Active Bids</div>
            </div>

            {/* Winning Bids */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-900 mb-1">{winningBids}</div>
              <div className="text-sm font-medium text-green-700">Winning</div>
            </div>

            {/* Total Spent */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-900 mb-1">
                ${totalSpent.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-purple-700">Total Won</div>
            </div>

            {/* Win Rate */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Percent className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-orange-900 mb-1">{winRate}%</div>
              <div className="text-sm font-medium text-orange-700">Win Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by property name, location, or unit number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Bid First</option>
            <option value="lowest">Lowest Bid First</option>
            <option value="expiring">Expiring Soon</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'active'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Active ({activeBids.length})
              </button>
              <button
                onClick={() => setActiveTab('won')}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'won'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Won ({wonBids.length})
              </button>
              <button
                onClick={() => setActiveTab('lost')}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'lost'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Lost ({lostBids.length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'expired'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Expired ({expiredBids.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {sortedBids.length === 0 ? (
              <EmptyState tab={activeTab} onBrowse={() => navigate('/search')} />
            ) : (
              <div className="space-y-4">
                {sortedBids.map(bid => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    tab={activeTab}
                    onViewUnit={() => navigate(`/unit/${bid.unit_id}`)}
                    onUpdateBid={() => handleUpdateBid(bid)}
                    onWithdrawBid={() => handleWithdrawBid(bid)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Bid Modal */}
      {showUpdateModal && selectedBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Update Your Bid</h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Unit Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 flex gap-4">
                <img
                  src={selectedBid.unit?.images?.[0]}
                  alt={`Unit ${selectedBid.unit?.unit_number}`}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{selectedBid.property?.name}</h3>
                  <p className="text-gray-600">Unit {selectedBid.unit?.unit_number}</p>
                  <p className="text-sm text-gray-500">
                    {selectedBid.unit?.bedrooms} BR • {selectedBid.unit?.bathrooms} BA • {selectedBid.unit?.square_feet} sq ft
                  </p>
                </div>
              </div>

              {/* Current Status */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Your Current Bid</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${selectedBid.bid_amount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Current Highest</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${selectedBid.highestBid.toLocaleString()}
                    </div>
                  </div>
                </div>
                {!selectedBid.isWinning && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      You're currently #{selectedBid.rank} of {selectedBid.totalBids} bidders
                    </span>
                  </div>
                )}
              </div>

              {/* New Bid Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Bid Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => {
                      setBidAmount(e.target.value);
                      setBidError(null);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="Enter new amount"
                  />
                </div>

                {/* Quick Increase Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      const current = parseFloat(bidAmount) || selectedBid.bid_amount;
                      setBidAmount((current + 50).toString());
                      setBidError(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                  >
                    +$50
                  </button>
                  <button
                    onClick={() => {
                      const current = parseFloat(bidAmount) || selectedBid.bid_amount;
                      setBidAmount((current + 100).toString());
                      setBidError(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                  >
                    +$100
                  </button>
                  <button
                    onClick={() => {
                      const current = parseFloat(bidAmount) || selectedBid.bid_amount;
                      setBidAmount((current + 150).toString());
                      setBidError(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                  >
                    +$150
                  </button>
                </div>
              </div>

              {/* Auto-Bid */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable Auto-Bid</label>
                    <p className="text-xs text-gray-500">
                      Automatically increase your bid if outbid
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoBidEnabled(!autoBidEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      autoBidEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        autoBidEnabled ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {autoBidEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Auto-Bid Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={maxAutoBid}
                        onChange={(e) => {
                          setMaxAutoBid(e.target.value);
                          setBidError(null);
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter maximum amount"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {bidError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-800">{bidError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBidUpdate}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Bid'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Confirmation Dialog */}
      {showWithdrawDialog && selectedBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">Withdraw Your Bid?</h2>

            <p className="text-gray-600 text-center mb-2">
              Are you sure you want to withdraw your bid of{' '}
              <span className="font-semibold text-gray-900">
                ${selectedBid.bid_amount.toLocaleString()}
              </span>{' '}
              on Unit {selectedBid.unit?.unit_number}?
            </p>

            <p className="text-sm text-gray-500 text-center mb-6">
              This action cannot be undone. The property manager will be notified.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawDialog(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmWithdraw}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Yes, Withdraw Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BID CARD COMPONENT
// ============================================================================

interface BidCardProps {
  bid: EnrichedBid;
  tab: TabType;
  onViewUnit: () => void;
  onUpdateBid: () => void;
  onWithdrawBid: () => void;
}

function BidCard({ bid, tab, onViewUnit, onUpdateBid, onWithdrawBid }: BidCardProps) {
  if (!bid.unit || !bid.property) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Photo */}
          <div
            onClick={onViewUnit}
            className="lg:w-64 h-48 lg:h-auto rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
          >
            <img
              src={bid.unit.images?.[0]}
              alt={`Unit ${bid.unit.unit_number}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3
                  onClick={onViewUnit}
                  className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer truncate"
                >
                  {bid.property.name}
                </h3>
                <p className="text-gray-600 mb-1">Unit {bid.unit.unit_number}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" />
                    {bid.unit.bedrooms} BR
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {bid.unit.bathrooms} BA
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-4 h-4" />
                    {bid.unit.square_feet} sq ft
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {bid.property.address.street}, {bid.property.address.city}
                </p>
              </div>

              {/* Status Badge */}
              <div className="ml-4 flex-shrink-0">
                {tab === 'active' && bid.isWinning && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <Trophy className="w-5 h-5" />
                    Winning!
                  </div>
                )}
                {tab === 'active' && !bid.isWinning && (
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-5 h-5" />
                    Outbid
                  </div>
                )}
                {tab === 'won' && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-5 h-5" />
                    Accepted
                  </div>
                )}
                {tab === 'lost' && (
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <XCircle className="w-5 h-5" />
                    Not Accepted
                  </div>
                )}
                {tab === 'expired' && (
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <Clock className="w-5 h-5" />
                    Expired
                  </div>
                )}
              </div>
            </div>

            {/* Bid Info */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pt-4 border-t border-gray-100">
              <div>
                <div className="text-xs text-gray-500 mb-1">Your Bid</div>
                <div className="text-lg font-bold text-blue-600">
                  ${bid.bid_amount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Monthly Rent</div>
                <div className="text-lg font-bold text-gray-900">
                  ${bid.unit.monthly_rent.toLocaleString()}
                </div>
              </div>
              {tab === 'active' && (
                <>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Highest Bid</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${bid.highestBid.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Your Rank</div>
                    <div className="text-lg font-bold text-gray-900">
                      #{bid.rank} of {bid.totalBids}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <span>Placed {formatDate(bid.created_at)}</span>
              {bid.auto_bid_enabled && bid.max_auto_bid && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  Auto-bid enabled up to ${bid.max_auto_bid.toLocaleString()}
                </span>
              )}
              {bid.expires_at && (
                <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Expires {formatDate(bid.expires_at)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onViewUnit}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                View Unit
              </button>

              {tab === 'active' && (
                <>
                  <button
                    onClick={onUpdateBid}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    {bid.isWinning ? 'Increase Bid' : 'Update Bid'}
                  </button>
                  <button
                    onClick={onWithdrawBid}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Withdraw
                  </button>
                </>
              )}

              {tab === 'won' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  Contact Manager
                </button>
              )}

              {tab === 'lost' && (
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700">
                  View Similar Units
                </button>
              )}
            </div>

            {/* Outbid Alert (Active Tab Only) */}
            {tab === 'active' && !bid.isWinning && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-yellow-900">
                      You've been outbid!
                    </div>
                    <div className="text-xs text-yellow-700 mt-1">
                      Current highest bid is ${bid.highestBid.toLocaleString()}. You need to bid at least ${(bid.highestBid + 1).toLocaleString()} to take the lead.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Winning Status (Active Tab Only) */}
            {tab === 'active' && bid.isWinning && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-900">
                      You're currently winning!
                    </div>
                    <div className="text-xs text-green-700 mt-1">
                      Keep an eye on this bid. The landlord may accept it at any time.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

interface EmptyStateProps {
  tab: TabType;
  onBrowse: () => void;
}

function EmptyState({ tab, onBrowse }: EmptyStateProps) {
  const content = {
    active: {
      icon: TrendingUp,
      title: 'No Active Bids',
      message: "You haven't placed any bids yet. Start browsing properties to find your perfect home!",
      action: 'Browse Properties',
    },
    won: {
      icon: Trophy,
      title: 'No Won Bids Yet',
      message: 'Keep bidding on properties you love. Your winning bids will appear here.',
      action: 'Browse Properties',
    },
    lost: {
      icon: XCircle,
      title: 'No Lost Bids',
      message: "You haven't lost any bids yet. Keep trying!",
      action: null,
    },
    expired: {
      icon: Clock,
      title: 'No Expired Bids',
      message: 'No bids have expired without action.',
      action: null,
    },
  };

  const { icon: Icon, title, message, action } = content[tab];

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>
      {action && (
        <button
          onClick={onBrowse}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          {action}
        </button>
      )}
    </div>
  );
}
