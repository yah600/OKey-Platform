import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bed, Bath, Maximize, Calendar, TrendingUp, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import BidModal from '../../components/organisms/BidModal';

export default function UnitDetail() {
  const { propertyId, unitId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const { isAuthenticated } = useAuthStore();
  const [showBidModal, setShowBidModal] = useState(false);

  // Mock unit data
  const unit = {
    id: unitId || '1',
    number: '4B',
    propertyName: 'Sunset Apartments',
    address: '123 Main St, Montreal, QC H3A 1B2',
    beds: 1,
    baths: 1,
    sqft: 650,
    rent: 1800,
    available: true,
    availableDate: '2026-02-15',
    description: 'Bright and spacious one-bedroom unit with modern finishes. Features an open-concept living area, stainless steel appliances, and large windows with city views. Includes in-unit laundry and ample storage.',
    features: [
      'Hardwood floors',
      'Stainless steel appliances',
      'In-unit washer/dryer',
      'Walk-in closet',
      'Balcony',
      'Central A/C',
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
    ],
    okeyScoreRequired: 650,
  };

  const handlePlaceBid = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowBidModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            to={`/marketplace/property/${propertyId}`}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Property
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <Card padding="none" className="mb-6 overflow-hidden">
              <div className="aspect-video bg-neutral-200">
                <img
                  src={unit.images[0]}
                  alt={`Unit ${unit.number}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {/* Unit Info */}
            <Card className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
                    Unit {unit.number}
                  </h1>
                  <p className="text-sm text-neutral-600">{unit.propertyName}</p>
                  <p className="text-xs text-neutral-500">{unit.address}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  unit.available ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {unit.available ? 'Available' : 'Leased'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-600">Bedrooms</p>
                    <p className="text-sm font-semibold text-neutral-900">{unit.beds}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-600">Bathrooms</p>
                    <p className="text-sm font-semibold text-neutral-900">{unit.baths}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-600">Square Feet</p>
                    <p className="text-sm font-semibold text-neutral-900">{unit.sqft}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Description</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{unit.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {unit.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-neutral-600">
                      <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Pricing & Bidding */}
            <Card className="mb-6">
              <div className="mb-4 pb-4 border-b border-neutral-200">
                <p className="text-xs text-neutral-600 mb-1">Monthly Rent</p>
                <p className="text-3xl font-semibold text-neutral-900">${unit.rent}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-600">Available</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {new Date(unit.availableDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-600">O'Key Score Required</p>
                    <p className="text-sm font-medium text-neutral-900">{unit.okeyScoreRequired}+</p>
                  </div>
                </div>
              </div>

              <Button variant="primary" onClick={handlePlaceBid} className="w-full">
                <TrendingUp className="w-4 h-4" />
                Place Bid
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-neutral-500 text-center mt-2">
                  Sign in required to place bids
                </p>
              )}
            </Card>

            {/* How Bidding Works */}
            <Card className="bg-neutral-50">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">How Bidding Works</h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p>1. Submit your best offer above the asking rent</p>
                <p>2. Property owner reviews all bids</p>
                <p>3. If accepted, you'll sign the lease digitally</p>
                <p>4. Move in on your selected date</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <BidModal
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        unit={{
          id: unit.id,
          propertyId: propertyId || '1',
          number: unit.number,
          propertyName: unit.propertyName,
          address: unit.address,
          rent: unit.rent,
          availableDate: unit.availableDate,
          okeyScoreRequired: unit.okeyScoreRequired,
        }}
      />
    </div>
  );
}
