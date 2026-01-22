import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Calendar,
  Users,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  Dumbbell,
  Waves,
  Home,
  Package,
  UserCheck,
  Phone,
  Mail,
  MessageSquare,
  ArrowLeft,
  Copy,
  Check,
  PawPrint,
  Zap,
} from 'lucide-react';
import {
  getPropertyById,
  getUnitsByProperty,
  getUserById,
  getAllProperties,
  type Property,
  type Unit,
  type User,
} from '@/lib/data/mockData';

interface PropertyDetailProps {
  onNavigate: (route: string, id?: string) => void;
}

export function PropertyDetail({ onNavigate }: PropertyDetailProps) {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [manager, setManager] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      const propertyData = getPropertyById(id);
      if (propertyData) {
        setProperty(propertyData);
        const propertyUnits = getUnitsByProperty(id);
        const availableUnits = propertyUnits.filter(u => u.status === 'available');
        setUnits(availableUnits);

        // Get manager or owner
        const managerId = propertyData.manager_id || propertyData.owner_id;
        if (managerId) {
          const managerData = getUserById(managerId);
          setManager(managerData);
        }
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handlePreviousPhoto = () => {
    if (!property) return;
    setSelectedPhotoIndex(prev =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    if (!property) return;
    setSelectedPhotoIndex(prev =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleCopyAddress = () => {
    if (!property) return;
    const fullAddress = `${property.address.street}, ${property.address.city}, ${property.address.province} ${property.address.postal_code}`;
    navigator.clipboard.writeText(fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Calculate stats
  const availableCount = units.length;
  const startingPrice = units.length > 0 ? Math.min(...units.map(u => u.monthly_rent)) : 0;
  const avgSize = units.length > 0
    ? Math.round(units.reduce((sum, u) => sum + u.square_feet, 0) / units.length)
    : 0;

  // Get similar properties
  const similarProperties = property
    ? getAllProperties()
        .filter(p =>
          p.id !== property.id &&
          p.address.city === property.address.city &&
          p.type === property.type
        )
        .slice(0, 3)
    : [];

  if (loading) {
    return <LoadingState />;
  }

  if (!property) {
    return <NotFoundState onNavigate={onNavigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => onNavigate('')}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => onNavigate('search')}
              className="hover:text-blue-600 transition-colors"
            >
              Search
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{property.name}</span>
          </div>
        </div>
      </div>

      {/* 1. PHOTO GALLERY SECTION */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Main Image */}
            <div className="relative h-[60vh] bg-gray-200 rounded-2xl overflow-hidden group mb-4">
              <img
                src={property.images[selectedPhotoIndex] || '/placeholder.jpg'}
                alt={`${property.name} - Photo ${selectedPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                  </button>
                </>
              )}

              {/* Photo Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {selectedPhotoIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedPhotoIndex === index
                      ? 'border-blue-600 scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROPERTY INFORMATION HEADER */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Property Info */}
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{property.name}</h1>

                <div className="flex items-start gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg">{property.address.street}</p>
                    <p className="text-lg">
                      {property.address.city}, {property.address.province} {property.address.postal_code}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {property.type}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Built in {property.year_built}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {property.total_units} units
                  </span>
                </div>
              </div>

              {/* Right Column - Contact Card */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Interested in this property?
                  </h3>

                  {manager && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Property Manager</p>
                      <p className="font-semibold text-gray-900">{manager.full_name}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Send Message
                    </button>
                    <button className="w-full py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition-all flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Schedule Viewing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK STATS BAR */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatBox
                icon={<Building2 className="w-6 h-6" />}
                value={availableCount.toString()}
                label="Available Units"
                color="blue"
              />
              <StatBox
                icon={<DollarSign className="w-6 h-6" />}
                value={`$${startingPrice.toLocaleString()}`}
                label="Starting Price"
                color="green"
              />
              <StatBox
                icon={<Maximize2 className="w-6 h-6" />}
                value={`${avgSize} ft²`}
                label="Avg Unit Size"
                color="purple"
              />
              <StatBox
                icon={<PawPrint className="w-6 h-6" />}
                value={units.some(u => u.pet_friendly) ? 'Yes' : 'No'}
                label="Pet Friendly"
                color="orange"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* 4. AMENITIES SECTION */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Building Amenities</h2>
            {property.amenities.length === 0 ? (
              <p className="text-gray-600">No amenities listed</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {property.amenities.map((amenity, index) => (
                  <AmenityCard key={index} amenity={amenity} />
                ))}
              </div>
            )}
          </section>

          {/* 5. PROPERTY DESCRIPTION */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Property</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                {property.name} is a {property.type.toLowerCase()} located in {property.address.city}.
                Built in {property.year_built}, this {property.total_units}-unit property offers modern living
                with contemporary design and premium amenities.
              </p>
              <p>
                Residents enjoy access to exceptional facilities including {property.amenities.slice(0, 3).join(', ')}
                {property.amenities.length > 3 ? `, and ${property.amenities.length - 3} more amenities` : ''}.
                The building features secure access and professional management.
              </p>
              <p>
                Perfectly situated on {property.address.street}, you're in the heart of {property.address.city}.
                This prime location offers convenient access to shopping, dining, entertainment, and public transportation.
              </p>
            </div>
          </section>

          {/* 6. AVAILABLE UNITS SECTION */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Available Units ({units.length})
            </h2>
            {units.length === 0 ? (
              <div className="text-center py-12 bg-gray-100 rounded-2xl">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Units Available</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no available units in this property.
                </p>
                <button
                  onClick={() => onNavigate('search')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Browse Other Properties
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit, index) => (
                  <UnitCard key={unit.id} unit={unit} index={index} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </section>

          {/* 7. LOCATION SECTION */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Location</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Map Placeholder */}
              <div className="lg:col-span-2">
                <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-50"></div>
                  <div className="relative text-center z-10">
                    <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {property.address.street}
                    </p>
                    <p className="text-gray-600 mb-4">
                      {property.address.city}, {property.address.province}
                    </p>
                    <button
                      onClick={handleCopyAddress}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm flex items-center gap-2 mx-auto"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Address
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Nearby Points of Interest */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Nearby</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        🚇
                      </div>
                      <div>
                        <p className="font-medium">McGill Metro</p>
                        <p className="text-xs text-gray-500">5 min walk</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        🛒
                      </div>
                      <div>
                        <p className="font-medium">Provigo Grocery</p>
                        <p className="text-xs text-gray-500">3 min walk</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        🏞️
                      </div>
                      <div>
                        <p className="font-medium">Mount Royal Park</p>
                        <p className="text-xs text-gray-500">10 min walk</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        ☕
                      </div>
                      <div>
                        <p className="font-medium">Cafes & Restaurants</p>
                        <p className="text-xs text-gray-500">2 min walk</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. PROPERTY MANAGER INFO */}
          {manager && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Property Management</h2>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Manager Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {manager.full_name.charAt(0)}
                    </div>
                  </div>

                  {/* Manager Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{manager.full_name}</h3>
                    <p className="text-gray-600 mb-4">
                      {property.manager_id ? 'Property Manager' : 'Owner'}
                    </p>

                    <div className="space-y-2 mb-6">
                      <a
                        href={`mailto:${manager.email}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        {manager.email}
                      </a>
                      <a
                        href={`tel:${manager.phone}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        {manager.phone}
                      </a>
                    </div>

                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 9. SIMILAR PROPERTIES */}
          {similarProperties.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Similar Properties Nearby</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProperties.map((prop) => {
                  const propUnits = getUnitsByProperty(prop.id).filter(u => u.status === 'available');
                  const minPrice = propUnits.length > 0
                    ? Math.min(...propUnits.map(u => u.monthly_rent))
                    : 0;

                  return (
                    <SimilarPropertyCard
                      key={prop.id}
                      property={prop}
                      availableUnits={propUnits.length}
                      startingPrice={minPrice}
                      onNavigate={onNavigate}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 md:hidden z-20">
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            Contact
          </button>
          <button
            onClick={() => {
              document.getElementById('units-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <Building2 className="w-5 h-5" />
            View Units
          </button>
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS

function StatBox({
  icon,
  value,
  label,
  color
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center mx-auto mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Gym': <Dumbbell className="w-5 h-5" />,
  'Fitness Center': <Dumbbell className="w-5 h-5" />,
  'Pool': <Waves className="w-5 h-5" />,
  'Swimming Pool': <Waves className="w-5 h-5" />,
  'Parking': <Car className="w-5 h-5" />,
  'Indoor Parking': <Car className="w-5 h-5" />,
  'Outdoor Parking': <Car className="w-5 h-5" />,
  'Doorman': <UserCheck className="w-5 h-5" />,
  '24/7 Doorman': <UserCheck className="w-5 h-5" />,
  'Rooftop': <Home className="w-5 h-5" />,
  'Rooftop Terrace': <Home className="w-5 h-5" />,
  'Bike Storage': <Package className="w-5 h-5" />,
  'Bike Room': <Package className="w-5 h-5" />,
  'Storage': <Package className="w-5 h-5" />,
  'Storage Lockers': <Package className="w-5 h-5" />,
  'Lounge': <Users className="w-5 h-5" />,
  'Party Room': <Users className="w-5 h-5" />,
  'Pet-Friendly': <PawPrint className="w-5 h-5" />,
};

function AmenityCard({ amenity }: { amenity: string }) {
  const icon = AMENITY_ICONS[amenity] || <Zap className="w-5 h-5" />;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium text-gray-900">{amenity}</span>
    </div>
  );
}

function UnitCard({
  unit,
  index,
  onNavigate
}: {
  unit: Unit;
  index: number;
  onNavigate: (route: string, id?: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onNavigate('unit', unit.id)}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
      id={index === 0 ? 'units-section' : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            Unit {unit.unit_number}
          </h3>
          <p className="text-sm text-gray-600">Floor {unit.floor}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            ${unit.monthly_rent.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">/month</div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
        <div className="flex items-center gap-1">
          <BedDouble className="w-4 h-4" />
          <span>{unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} BR`}</span>
        </div>
        <div className="flex items-center gap-1">
          <Bath className="w-4 h-4" />
          <span>{unit.bathrooms} BA</span>
        </div>
        <div className="flex items-center gap-1">
          <Maximize2 className="w-4 h-4" />
          <span>{unit.square_feet} ft²</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Available</span>
          <span className="font-medium text-gray-900">
            {new Date(unit.available_date).toLocaleDateString()}
          </span>
        </div>
        {unit.parking_spaces > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Parking</span>
            <span className="font-medium text-gray-900">{unit.parking_spaces} space(s)</span>
          </div>
        )}
        {unit.utilities_included && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Check className="w-4 h-4" />
            <span>Utilities Included</span>
          </div>
        )}
        {unit.pet_friendly && (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <PawPrint className="w-4 h-4" />
            <span>Pet Friendly</span>
          </div>
        )}
      </div>

      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all">
        View Details
      </button>
    </motion.div>
  );
}

function SimilarPropertyCard({
  property,
  availableUnits,
  startingPrice,
  onNavigate
}: {
  property: Property;
  availableUnits: number;
  startingPrice: number;
  onNavigate: (route: string, id?: string) => void;
}) {
  return (
    <div
      onClick={() => onNavigate('property', property.id)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={property.images[0] || '/placeholder.jpg'}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {availableUnits > 0 && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {availableUnits} units
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {property.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {property.address.street}, {property.address.city}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-blue-600">
              ${startingPrice.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Starting at</div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-all">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading property...</p>
      </div>
    </div>
  );
}

function NotFoundState({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <Building2 className="w-24 h-24 text-gray-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-8">
          This property may have been removed or doesn't exist.
        </p>
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

// Add DollarSign icon component since it's used in StatBox
function DollarSign({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
