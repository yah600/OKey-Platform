import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building2, Wifi, Car, Dumbbell, Shield, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

export default function PropertyDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock property data
  const property = {
    id: id || '1',
    name: 'Sunset Apartments',
    address: '123 Main St, Montreal, QC H3A 1B2',
    type: 'Apartment Building',
    yearBuilt: 2018,
    description: 'Modern apartment complex located in the heart of downtown Montreal. Features state-of-the-art amenities and contemporary design. Close to public transportation, shopping, and dining.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
    ],
    amenities: [
      { icon: Wifi, label: 'High-Speed Internet' },
      { icon: Car, label: 'Underground Parking' },
      { icon: Dumbbell, label: 'Fitness Center' },
      { icon: Shield, label: '24/7 Security' },
      { icon: Building2, label: 'Rooftop Terrace' },
    ],
    units: [
      { id: 1, number: '4B', beds: 1, baths: 1, sqft: 650, rent: 1800, available: true },
      { id: 2, number: '5A', beds: 2, baths: 1, sqft: 850, rent: 2200, available: true },
      { id: 3, number: '6C', beds: 2, baths: 2, sqft: 950, rent: 2500, available: true },
      { id: 4, number: '3B', beds: 1, baths: 1, sqft: 700, rent: 1900, available: false },
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const availableUnits = property.units.filter((u) => u.available);

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
          <Link to="/marketplace/search" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Image Gallery */}
        <Card padding="none" className="mb-6 overflow-hidden">
          <div className="relative aspect-[21/9] bg-neutral-200">
            <img
              src={property.images[currentImageIndex]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-neutral-900" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Info */}
            <Card className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 mb-2">{property.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    {property.address}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded">
                  {property.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg mb-4">
                <div>
                  <p className="text-xs text-neutral-600">Year Built</p>
                  <p className="text-sm font-semibold text-neutral-900">{property.yearBuilt}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Available Units</p>
                  <p className="text-sm font-semibold text-neutral-900">{availableUnits.length}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Description</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{property.description}</p>
              </div>
            </Card>

            {/* Amenities */}
            <Card className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-neutral-700">
                    <div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center flex-shrink-0">
                      <amenity.icon className="w-4 h-4 text-neutral-600" />
                    </div>
                    {amenity.label}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - Available Units */}
          <div>
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                Available Units ({availableUnits.length})
              </h3>
              <div className="space-y-3">
                {availableUnits.map((unit) => (
                  <Link
                    key={unit.id}
                    to={`/marketplace/property/${property.id}/unit/${unit.id}`}
                  >
                    <div className="p-3 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">Unit {unit.number}</p>
                          <p className="text-xs text-neutral-600">
                            {unit.beds} bed • {unit.baths} bath • {unit.sqft} sq ft
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                        <span className="text-lg font-semibold text-neutral-900">
                          ${unit.rent}
                          <span className="text-xs text-neutral-500 font-normal">/mo</span>
                        </span>
                        <span className="text-xs text-primary-600 font-medium">View Details →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {availableUnits.length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600">No units currently available</p>
                  <p className="text-xs text-neutral-500 mt-1">Check back later for openings</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
