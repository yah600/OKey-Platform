import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Calendar,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  PawPrint,
  Check,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  DollarSign,
  ArrowLeft,
  Users,
  Heart,
  Share2,
  Phone,
} from 'lucide-react';
import {
  getUnitById,
  getPropertyById,
  getBidsByUnit,
  getAvailableUnits,
  type Unit,
  type Property,
  type Bid,
} from '@/lib/data/mockData';
import { useAuth } from '@/context/AuthContext';

interface UnitDetailProps {
  onNavigate: (route: string, id?: string) => void;
}

type BidStep = 'amount' | 'review' | 'processing' | 'success';

export function UnitDetail({ onNavigate }: UnitDetailProps) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Bid modal state
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidStep, setBidStep] = useState<BidStep>('amount');
  const [bidAmount, setBidAmount] = useState('');
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);
  const [maxAutoBid, setMaxAutoBid] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const unitData = getUnitById(id);
      if (unitData) {
        setUnit(unitData);
        const propertyData = getPropertyById(unitData.property_id);
        setProperty(propertyData || null);
        const unitBids = getBidsByUnit(id).sort((a, b) => b.bid_amount - a.bid_amount);
        setBids(unitBids);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const userScore = user?.okey_score || 0;
  const userBid = bids.find(b => b.bidder_id === user?.id);
  const highestBid = bids[0];
  const isWinning = userBid && highestBid && userBid.id === highestBid.id;
  const qualifies = userScore >= (unit?.minimum_okey_score || 0);

  const handlePreviousPhoto = () => {
    if (!unit) return;
    setSelectedPhotoIndex(prev => (prev === 0 ? unit.photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    if (!unit) return;
    setSelectedPhotoIndex(prev => (prev === unit.photos.length - 1 ? 0 : prev + 1));
  };

  const handleOpenBidModal = () => {
    if (!user) {
      alert('Please sign in to place a bid');
      onNavigate('auth/login');
      return;
    }
    if (!qualifies) {
      return;
    }
    setBidStep('amount');
    setBidAmount(userBid ? userBid.bid_amount.toString() : '');
    setBidMessage(userBid?.message || '');
    setShowBidModal(true);
  };

  const validateBidAmount = (amount: number): string | null => {
    if (!unit) return 'Unit not found';
    if (amount < unit.monthly_rent) {
      return `Bid must be at least $${unit.monthly_rent.toLocaleString()} (monthly rent)`;
    }
    if (highestBid && amount <= highestBid.bid_amount) {
      return `Bid must be higher than $${highestBid.bid_amount.toLocaleString()}`;
    }
    if (autoBidEnabled && maxAutoBid) {
      const maxAuto = parseFloat(maxAutoBid);
      if (maxAuto <= amount) {
        return 'Max auto-bid must be higher than your bid';
      }
    }
    return null;
  };

  const handleReviewBid = () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      setBidError('Please enter a valid amount');
      return;
    }

    const error = validateBidAmount(amount);
    if (error) {
      setBidError(error);
      return;
    }

    setBidError('');
    setBidStep('review');
  };

  const handleSubmitBid = () => {
    if (!agreedToTerms) {
      setBidError('You must agree to the bidding terms');
      return;
    }

    setBidStep('processing');

    // Simulate API call
    setTimeout(() => {
      const newBid: Bid = {
        id: `bid-${Date.now()}`,
        unit_id: unit?.id || '',
        bidder_id: user?.id || '',
        bid_amount: parseFloat(bidAmount),
        message: bidMessage || undefined,
        status: 'active',
        auto_bid_enabled: autoBidEnabled,
        max_auto_bid: autoBidEnabled && maxAutoBid ? parseFloat(maxAutoBid) : undefined,
        expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update bids list
      const updatedBids = userBid
        ? bids.map(b => (b.id === userBid.id ? { ...newBid, id: userBid.id } : b))
        : [newBid, ...bids];

      setBids(updatedBids.sort((a, b) => b.bid_amount - a.bid_amount));
      setBidStep('success');
    }, 1500);
  };

  const handleWithdrawBid = () => {
    if (!userBid) return;
    if (!confirm('Are you sure you want to withdraw your bid?')) return;

    setBids(bids.filter(b => b.id !== userBid.id));
    alert('Bid withdrawn successfully');
  };

  const handleCloseBidModal = () => {
    setShowBidModal(false);
    setBidStep('amount');
    setBidError('');
    setAgreedToTerms(false);
  };

  const similarUnits = unit
    ? getAvailableUnits()
        .filter(
          u =>
            u.id !== unit.id &&
            u.bedrooms === unit.bedrooms &&
            Math.abs(u.monthly_rent - unit.monthly_rent) < 500
        )
        .slice(0, 3)
    : [];

  if (loading) {
    return <LoadingState />;
  }

  if (!unit || !property) {
    return <NotFoundState onNavigate={onNavigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate('')} className="hover:text-blue-600">
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <button onClick={() => onNavigate('search')} className="hover:text-blue-600">
              Search
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => onNavigate('property', property.id)}
              className="hover:text-blue-600"
            >
              {property.name}
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Unit {unit.unit_number}</span>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative h-[60vh] bg-gray-200 rounded-2xl overflow-hidden group mb-4">
              <img
                src={unit.photos[selectedPhotoIndex] || property.images[0] || '/placeholder.jpg'}
                alt={`Unit ${unit.unit_number}`}
                className="w-full h-full object-cover"
              />
              {unit.photos.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm">
                {selectedPhotoIndex + 1} / {unit.photos.length}
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {unit.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 ${
                    selectedPhotoIndex === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={photo} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Unit Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Unit Header */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {property.name} - Unit {unit.unit_number}
                </h1>
                <h2 className="text-2xl text-gray-700 mb-4">
                  {unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} Bedroom`}
                  {unit.bedrooms > 1 ? 's' : ''}, {unit.bathrooms} Bathroom
                  {unit.bathrooms > 1 ? 's' : ''}
                </h2>

                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-5 h-5" />
                    <span>{unit.square_feet} sq ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>Floor {unit.floor}</span>
                  </div>
                  {unit.parking_spaces > 0 && (
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      <span>{unit.parking_spaces} parking space(s)</span>
                    </div>
                  )}
                  {unit.pet_friendly && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <PawPrint className="w-5 h-5" />
                      <span>Pet Friendly</span>
                    </div>
                  )}
                </div>

                {unit.utilities_included && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Utilities Included</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 text-sm text-green-700">
                        <Check className="w-4 h-4" />
                        Heating
                      </span>
                      <span className="flex items-center gap-1 text-sm text-green-700">
                        <Check className="w-4 h-4" />
                        Hot Water
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bidding Status */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bidding Status</h2>
                {bids.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No bids yet - Be the first!</h3>
                    <p className="text-gray-600">Starting bid: ${unit.monthly_rent.toLocaleString()}/month</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <div className="text-sm text-gray-600 mb-1">Current Highest Bid</div>
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        ${highestBid.bid_amount.toLocaleString()}
                      </div>
                      {isWinning && (
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                          <CheckCircle2 className="w-5 h-5" />
                          You're winning!
                        </div>
                      )}
                      {userBid && !isWinning && (
                        <div className="flex items-center gap-2 text-orange-600 font-semibold">
                          <AlertCircle className="w-5 h-5" />
                          You've been outbid
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Total Bids</div>
                        <div className="text-xl font-bold text-gray-900">{bids.length}</div>
                      </div>
                      {userBid && (
                        <>
                          <div>
                            <div className="text-gray-600">Your Bid</div>
                            <div className="text-xl font-bold text-gray-900">
                              ${userBid.bid_amount.toLocaleString()}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-gray-600 mb-2">Your Rank</div>
                            <div className="text-lg font-semibold text-gray-900">
                              #{bids.findIndex(b => b.id === userBid.id) + 1} of {bids.length}
                            </div>
                            {!isWinning && (
                              <div className="text-sm text-orange-600 mt-1">
                                +${(highestBid.bid_amount - userBid.bid_amount).toLocaleString()} to win
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {userBid && (
                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          onClick={handleOpenBidModal}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                          Increase Bid
                        </button>
                        <button
                          onClick={handleWithdrawBid}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Withdraw
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bid History */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bid Activity</h2>
                {bids.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No bids yet. Be the first to bid!</p>
                ) : (
                  <div className="space-y-3">
                    {bids.slice(0, 10).map((bid, index) => (
                      <BidHistoryItem
                        key={bid.id}
                        bid={bid}
                        isHighest={index === 0}
                        isUserBid={bid.bidder_id === user?.id}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Unit Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Unit Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <DetailRow label="Unit Number" value={unit.unit_number} />
                  <DetailRow label="Floor" value={unit.floor.toString()} />
                  <DetailRow label="Square Feet" value={`${unit.square_feet} ft²`} />
                  <DetailRow label="Monthly Rent" value={`$${unit.monthly_rent.toLocaleString()}`} />
                  <DetailRow
                    label="Security Deposit"
                    value={`$${unit.monthly_rent.toLocaleString()}`}
                  />
                  <DetailRow
                    label="Available Date"
                    value={new Date(unit.available_date).toLocaleDateString()}
                  />
                  <DetailRow label="Lease Type" value="12 months" />
                  <DetailRow
                    label="Pet Policy"
                    value={unit.pet_friendly ? 'Pets allowed' : 'No pets'}
                  />
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {property.name}</h2>
                <p className="text-gray-700 mb-6">
                  This unit is located in {property.name}, a {property.type.toLowerCase()} in{' '}
                  {property.address.city}. Built in {property.year_built}, the building offers modern
                  living with exceptional amenities.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {property.amenities.slice(0, 8).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600" />
                      {amenity}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => onNavigate('property', property.id)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View Full Property Details →
                </button>
              </div>

              {/* Location */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <div className="flex items-start gap-2 text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 mt-1" />
                  <div>
                    <p>{property.address.street}</p>
                    <p>
                      {property.address.city}, {property.address.province}{' '}
                      {property.address.postal_code}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              {/* Similar Units */}
              {similarUnits.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Units You May Like</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {similarUnits.map(similar => (
                      <SimilarUnitCard key={similar.id} unit={similar} onNavigate={onNavigate} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Price Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    ${unit.monthly_rent.toLocaleString()}
                  </div>
                  <div className="text-gray-600">/month</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <div className="text-sm text-gray-600">Available from</div>
                      <div className="font-semibold">
                        {new Date(unit.available_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">O'Key Score Requirement</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Required:</span>
                      <span className="font-bold">{unit.minimum_okey_score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Your Score:</span>
                      <span
                        className={`font-bold ${
                          qualifies ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {userScore}
                      </span>
                    </div>
                    {qualifies ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
                        <CheckCircle2 className="w-4 h-4" />
                        You qualify!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                        <AlertCircle className="w-4 h-4" />
                        Score too low
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {!user ? (
                    <button
                      onClick={() => onNavigate('auth/login')}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Sign In to Bid
                    </button>
                  ) : !qualifies ? (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold"
                    >
                      Score Too Low
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenBidModal}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                    >
                      {userBid ? 'Update Your Bid' : 'Place Your Bid'}
                    </button>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <button className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <BidModal
        isOpen={showBidModal}
        onClose={handleCloseBidModal}
        step={bidStep}
        unit={unit}
        property={property}
        userScore={userScore}
        highestBid={highestBid}
        userBid={userBid}
        bidAmount={bidAmount}
        setBidAmount={setBidAmount}
        autoBidEnabled={autoBidEnabled}
        setAutoBidEnabled={setAutoBidEnabled}
        maxAutoBid={maxAutoBid}
        setMaxAutoBid={setMaxAutoBid}
        bidMessage={bidMessage}
        setBidMessage={setBidMessage}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        bidError={bidError}
        onReview={handleReviewBid}
        onSubmit={handleSubmitBid}
        onBack={() => setBidStep('amount')}
        onNavigate={onNavigate}
      />

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 md:hidden z-20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              ${unit.monthly_rent.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">/month</div>
          </div>
          {!user ? (
            <button
              onClick={() => onNavigate('auth/login')}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
              Sign In
            </button>
          ) : !qualifies ? (
            <button
              disabled
              className="flex-1 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold"
            >
              Score Too Low
            </button>
          ) : (
            <button
              onClick={handleOpenBidModal}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold"
            >
              {userBid ? 'Update Bid' : 'Place Bid'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS

function BidHistoryItem({
  bid,
  isHighest,
  isUserBid,
}: {
  bid: Bid;
  isHighest: boolean;
  isUserBid: boolean;
}) {
  const timeAgo = new Date(bid.created_at).toLocaleTimeString();

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg ${
        isHighest
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
          : isUserBid
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <div>
        <div className="font-bold text-gray-900">${bid.bid_amount.toLocaleString()}</div>
        <div className="text-xs text-gray-600">{timeAgo}</div>
      </div>
      <div className="text-right">
        {isUserBid ? (
          <span className="text-sm font-semibold text-blue-600">Your bid</span>
        ) : (
          <span className="text-sm text-gray-600">Anonymous bidder</span>
        )}
        {isHighest && (
          <div className="text-xs text-green-600 font-semibold mt-1">Winning bid</div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function SimilarUnitCard({
  unit,
  onNavigate,
}: {
  unit: Unit;
  onNavigate: (route: string, id?: string) => void;
}) {
  const property = getPropertyById(unit.property_id);

  return (
    <div
      onClick={() => onNavigate('unit', unit.id)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="h-40 bg-gray-200">
        <img
          src={unit.photos[0] || property?.images[0] || '/placeholder.jpg'}
          alt={`Unit ${unit.unit_number}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1">Unit {unit.unit_number}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {unit.bedrooms}BR • {unit.bathrooms}BA • {unit.square_feet} ft²
        </p>
        <div className="text-xl font-bold text-blue-600">
          ${unit.monthly_rent.toLocaleString()}<span className="text-sm text-gray-500">/mo</span>
        </div>
      </div>
    </div>
  );
}

function BidModal({
  isOpen,
  onClose,
  step,
  unit,
  property,
  userScore,
  highestBid,
  userBid,
  bidAmount,
  setBidAmount,
  autoBidEnabled,
  setAutoBidEnabled,
  maxAutoBid,
  setMaxAutoBid,
  bidMessage,
  setBidMessage,
  agreedToTerms,
  setAgreedToTerms,
  bidError,
  onReview,
  onSubmit,
  onBack,
  onNavigate,
}: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        {step === 'amount' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {userBid ? 'Update Your Bid' : 'Place Your Bid'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex gap-4">
                <img
                  src={unit.photos[0] || property.images[0]}
                  alt="Unit"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-900">
                    {property.name} - Unit {unit.unit_number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monthly Rent: ${unit.monthly_rent.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-600">Your O'Key Score:</span>
                  <span className="ml-2 font-bold text-green-600">{userScore}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Required:</span>
                  <span className="ml-2 font-bold text-gray-900">{unit.minimum_okey_score}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">You qualify for this unit</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Your Bid Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={unit.monthly_rent.toString()}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Must be ≥ ${unit.monthly_rent.toLocaleString()} (monthly rent)
              </div>
              {highestBid && (
                <div className="mt-1 text-sm text-orange-600">
                  Current highest: ${highestBid.bid_amount.toLocaleString()}
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-900 mb-2">Quick Bid</div>
              <div className="flex gap-2">
                {[50, 100, 150].map(amount => (
                  <button
                    key={amount}
                    onClick={() =>
                      setBidAmount(
                        ((highestBid?.bid_amount || unit.monthly_rent) + amount).toString()
                      )
                    }
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    +${amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBidEnabled}
                  onChange={e => setAutoBidEnabled(e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="font-semibold text-gray-900">Enable Auto-Bid</span>
              </label>
              {autoBidEnabled && (
                <div className="mt-3">
                  <label className="block text-sm text-gray-700 mb-2">
                    Maximum Auto-Bid Amount
                  </label>
                  <input
                    type="number"
                    value={maxAutoBid}
                    onChange={e => setMaxAutoBid(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 3000"
                  />
                  <p className="mt-2 text-xs text-gray-600">
                    We'll automatically increase your bid by $50 if outbid, up to your max
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Message to Landlord (Optional)
              </label>
              <textarea
                value={bidMessage}
                onChange={e => setBidMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
                maxLength={500}
                placeholder="Tell the landlord why you're a great tenant..."
              />
              <div className="text-xs text-gray-500 mt-1">{bidMessage.length}/500</div>
            </div>

            {bidError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {bidError}
              </div>
            )}

            <button
              onClick={onReview}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Review Bid
            </button>
          </div>
        )}

        {step === 'review' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Bid</h2>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-600 mb-1">Your Bid Amount</div>
                <div className="text-4xl font-bold text-blue-600">
                  ${parseFloat(bidAmount).toLocaleString()}
                </div>
              </div>

              {autoBidEnabled && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-1">Auto-Bid Enabled</div>
                  <div className="text-sm text-gray-600">
                    Max auto-bid: ${parseFloat(maxAutoBid).toLocaleString()}
                  </div>
                </div>
              )}

              {bidMessage && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-1">Your Message</div>
                  <div className="text-sm text-gray-700">{bidMessage}</div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  I agree to the bidding terms. My bid is binding for 7 days.
                </span>
              </label>
            </div>

            {bidError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {bidError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Back
              </button>
              <button
                onClick={onSubmit}
                disabled={!agreedToTerms}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Bid
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Submitting your bid...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bid Placed Successfully!</h2>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              ${parseFloat(bidAmount).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mb-6">Reference: #BID-{Date.now()}</div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-bold text-gray-900 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  The property manager will review all bids
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  You'll be notified if outbid
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  Check your bid status anytime
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('my-bids')}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                View My Bids
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Keep Browsing
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading unit...</p>
      </div>
    </div>
  );
}

function NotFoundState({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <Building2 className="w-24 h-24 text-gray-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Unit Not Found</h1>
        <p className="text-gray-600 mb-8">This unit may have been removed or doesn't exist.</p>
        <button
          onClick={() => onNavigate('search')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Search
        </button>
      </div>
    </div>
  );
}
