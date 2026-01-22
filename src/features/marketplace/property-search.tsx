import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MapPin,
  DollarSign,
  BedDouble,
  Bath,
  Star,
  ChevronDown,
  Filter,
  X,
  Grid3x3,
  List,
  Calendar,
  Dumbbell,
  Waves,
  Car,
  UserCheck,
  Home,
  Package,
  Users,
  Building2,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { getAvailableUnits, getPropertyById, mockUsers } from '@/lib/data/mockData';
import type { Unit, Property } from '@/lib/data/mockData';

interface PropertySearchProps {
  onNavigate: (route: string, id?: string) => void;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'recommended' | 'price_low' | 'price_high' | 'newest' | 'available_soon';

interface Filters {
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  propertyTypes: string[];
  amenities: string[];
  availableDate: string;
  okeyScore: number;
}

const PROPERTY_TYPES = ['Condo', 'Apartment', 'House', 'Commercial'];
const AMENITIES = [
  { id: 'Gym', label: 'Gym', icon: Dumbbell },
  { id: 'Pool', label: 'Pool', icon: Waves },
  { id: 'Parking', label: 'Parking', icon: Car },
  { id: 'Doorman', label: 'Doorman', icon: UserCheck },
  { id: 'Rooftop', label: 'Rooftop', icon: Home },
  { id: 'Pet-Friendly', label: 'Pet-Friendly', icon: Users },
  { id: 'Bike Room', label: 'Bike Room', icon: Package },
  { id: 'Storage', label: 'Storage', icon: Package },
  { id: 'Lounge', label: 'Lounge', icon: Users },
];

const CITIES = ['All Locations', 'Montreal', 'Quebec City', 'Laval', 'Longueuil'];

export function PropertySearch({ onNavigate }: PropertySearchProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // View & Display State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<Filters>({
    location: searchParams.get('location') || 'All Locations',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 5000,
    bedrooms: searchParams.get('bedrooms') || 'any',
    bathrooms: searchParams.get('bathrooms') || 'any',
    propertyTypes: searchParams.get('types')?.split(',') || PROPERTY_TYPES,
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
    availableDate: searchParams.get('availableDate') || '',
    okeyScore: Number(searchParams.get('okeyScore')) || (mockUsers[0]?.okey_score || 85),
  });

  const resultsPerPage = viewMode === 'grid' ? 12 : 10;

  // Get user's O'Key score (use logged-in user, default to 85 for demo)
  const userScore = mockUsers[0]?.okey_score || 85;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.location !== 'All Locations') params.set('location', filters.location);
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice < 5000) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms !== 'any') params.set('bedrooms', filters.bedrooms);
    if (filters.bathrooms !== 'any') params.set('bathrooms', filters.bathrooms);
    if (filters.propertyTypes.length > 0 && filters.propertyTypes.length < PROPERTY_TYPES.length) {
      params.set('types', filters.propertyTypes.join(','));
    }
    if (filters.amenities.length > 0) params.set('amenities', filters.amenities.join(','));
    if (filters.availableDate) params.set('availableDate', filters.availableDate);
    if (filters.okeyScore !== userScore) params.set('okeyScore', filters.okeyScore.toString());

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams, userScore]);

  // Filter units
  const filteredUnits = useMemo(() => {
    let units = getAvailableUnits();

    // Location filter
    if (filters.location !== 'All Locations') {
      units = units.filter(unit => {
        const property = getPropertyById(unit.property_id);
        return property?.address.city === filters.location;
      });
    }

    // Price filter
    units = units.filter(unit =>
      unit.monthly_rent >= filters.minPrice && unit.monthly_rent <= filters.maxPrice
    );

    // Bedrooms filter
    if (filters.bedrooms !== 'any') {
      const bedroomCount = filters.bedrooms === 'studio' ? 0 : parseInt(filters.bedrooms);
      units = units.filter(unit => unit.bedrooms === bedroomCount);
    }

    // Bathrooms filter
    if (filters.bathrooms !== 'any') {
      const bathroomCount = parseFloat(filters.bathrooms);
      units = units.filter(unit => unit.bathrooms >= bathroomCount);
    }

    // Property type filter (OR logic - any matching type)
    if (filters.propertyTypes.length > 0 && filters.propertyTypes.length < PROPERTY_TYPES.length) {
      units = units.filter(unit => {
        const property = getPropertyById(unit.property_id);
        return property && filters.propertyTypes.includes(property.type);
      });
    }

    // Amenities filter (AND logic - must have ALL selected amenities)
    if (filters.amenities.length > 0) {
      units = units.filter(unit => {
        const property = getPropertyById(unit.property_id);
        if (!property) return false;
        return filters.amenities.every(amenity =>
          property.amenities.includes(amenity)
        );
      });
    }

    // Available date filter
    if (filters.availableDate) {
      const filterDate = new Date(filters.availableDate);
      units = units.filter(unit => {
        const unitDate = new Date(unit.available_date);
        return unitDate <= filterDate;
      });
    }

    // O'Key score filter (show only units user qualifies for)
    units = units.filter(unit => unit.minimum_okey_score <= filters.okeyScore);

    return units;
  }, [filters]);

  // Sort units
  const sortedUnits = useMemo(() => {
    const sorted = [...filteredUnits];

    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.monthly_rent - b.monthly_rent);
      case 'price_high':
        return sorted.sort((a, b) => b.monthly_rent - a.monthly_rent);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      case 'available_soon':
        return sorted.sort((a, b) => new Date(a.available_date).getTime() - new Date(b.available_date).getTime());
      case 'recommended':
      default:
        // Sort by how close the unit's minimum score is to user's score
        return sorted.sort((a, b) => {
          const scoreDiffA = Math.abs(a.minimum_okey_score - filters.okeyScore);
          const scoreDiffB = Math.abs(b.minimum_okey_score - filters.okeyScore);
          return scoreDiffA - scoreDiffB;
        });
    }
  }, [filteredUnits, sortBy, filters.okeyScore]);

  // Paginate units
  const totalPages = Math.ceil(sortedUnits.length / resultsPerPage);
  const paginatedUnits = sortedUnits.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      location: 'All Locations',
      minPrice: 0,
      maxPrice: 5000,
      bedrooms: 'any',
      bathrooms: 'any',
      propertyTypes: PROPERTY_TYPES,
      amenities: [],
      availableDate: '',
      okeyScore: userScore,
    });
  };

  const hasActiveFilters =
    filters.location !== 'All Locations' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 5000 ||
    filters.bedrooms !== 'any' ||
    filters.bathrooms !== 'any' ||
    filters.propertyTypes.length < PROPERTY_TYPES.length ||
    filters.amenities.length > 0 ||
    filters.availableDate !== '' ||
    filters.okeyScore !== userScore;

  const togglePropertyType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* LEFT SIDEBAR - FILTERS (Desktop) */}
        <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* 1. LOCATION FILTER */}
              <FilterSection title="Location">
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </FilterSection>

              {/* 2. PRICE RANGE FILTER */}
              <FilterSection title="Price Range">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>${filters.minPrice.toLocaleString()}</span>
                    <span>${filters.maxPrice.toLocaleString()}+</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) || 0 }))}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || 5000 }))}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </FilterSection>

              {/* 3. BEDROOMS FILTER */}
              <FilterSection title="Bedrooms">
                <div className="flex flex-wrap gap-2">
                  {['any', 'studio', '1', '2', '3', '4+'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFilters(prev => ({ ...prev, bedrooms: option }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.bedrooms === option
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                      }`}
                    >
                      {option === 'studio' ? 'Studio' : option === 'any' ? 'Any' : option === '4+' ? '4+' : `${option} BR`}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* 4. BATHROOMS FILTER */}
              <FilterSection title="Bathrooms">
                <div className="flex flex-wrap gap-2">
                  {['any', '1', '1.5', '2', '2.5+'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFilters(prev => ({ ...prev, bathrooms: option }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.bathrooms === option
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                      }`}
                    >
                      {option === 'any' ? 'Any' : `${option} Bath`}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* 5. PROPERTY TYPE FILTER */}
              <FilterSection title="Property Type">
                <div className="space-y-2">
                  {PROPERTY_TYPES.map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.propertyTypes.includes(type)}
                        onChange={() => togglePropertyType(type)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* 6. AMENITIES FILTER */}
              <FilterSection title="Amenities">
                <div className="space-y-2">
                  {AMENITIES.map(({ id, label, icon: Icon }) => (
                    <label key={id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(id)}
                        onChange={() => toggleAmenity(id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* 7. AVAILABILITY DATE FILTER */}
              <FilterSection title="Available From">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={filters.availableDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, availableDate: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                {filters.availableDate && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, availableDate: '' }))}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                  >
                    Clear date
                  </button>
                )}
              </FilterSection>

              {/* 8. O'KEY SCORE FILTER */}
              <FilterSection title="O'Key Score">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">My Score:</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      filters.okeyScore >= 80 ? 'bg-green-100 text-green-700' :
                      filters.okeyScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {filters.okeyScore}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filters.okeyScore}
                    onChange={(e) => setFilters(prev => ({ ...prev, okeyScore: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Showing properties you qualify for (Score: {filters.okeyScore}+)
                  </p>
                </div>
              </FilterSection>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">{sortedUnits.length}</span> properties found
                  {currentPage > 1 && (
                    <span className="ml-2">
                      (Showing {(currentPage - 1) * resultsPerPage + 1}-{Math.min(currentPage * resultsPerPage, sortedUnits.length)})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="newest">Newest Listings</option>
                    <option value="available_soon">Available Soon</option>
                  </select>

                  {/* View Toggle */}
                  <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 text-sm font-medium transition-colors border-l ${
                        viewMode === 'list'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                        •
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="p-6">
            {isLoading ? (
              <LoadingState viewMode={viewMode} />
            ) : paginatedUnits.length === 0 ? (
              <EmptyState onClearFilters={clearFilters} />
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <GridView units={paginatedUnits} onNavigate={onNavigate} />
                ) : (
                  <ListView units={paginatedUnits} onNavigate={onNavigate} />
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      <MobileFiltersSheet
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        setFilters={setFilters}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        togglePropertyType={togglePropertyType}
        toggleAmenity={toggleAmenity}
        userScore={userScore}
      />
    </div>
  );
}

// HELPER COMPONENTS

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function GridView({ units, onNavigate }: { units: Unit[]; onNavigate: (route: string, id?: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {units.map((unit, index) => {
        const property = getPropertyById(unit.property_id);
        if (!property) return null;

        return (
          <UnitCard key={unit.id} unit={unit} property={property} index={index} onNavigate={onNavigate} />
        );
      })}
    </div>
  );
}

function ListView({ units, onNavigate }: { units: Unit[]; onNavigate: (route: string, id?: string) => void }) {
  return (
    <div className="space-y-4">
      {units.map((unit, index) => {
        const property = getPropertyById(unit.property_id);
        if (!property) return null;

        return (
          <UnitCardHorizontal key={unit.id} unit={unit} property={property} index={index} onNavigate={onNavigate} />
        );
      })}
    </div>
  );
}

function UnitCard({
  unit,
  property,
  index,
  onNavigate
}: {
  unit: Unit;
  property: Property;
  index: number;
  onNavigate: (route: string, id?: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onNavigate('unit', unit.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={property.images[0] || '/placeholder.jpg'}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
          ${unit.monthly_rent.toLocaleString()}/mo
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {property.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {property.address.street}, {property.address.city}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 pb-3 border-b">
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

        <div className="flex flex-wrap gap-2 mb-3">
          {property.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              +{property.amenities.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>Available {new Date(unit.available_date).toLocaleDateString()}</span>
          <div className={`px-2 py-1 rounded-full font-bold ${
            unit.minimum_okey_score >= 80 ? 'bg-red-100 text-red-700' :
            unit.minimum_okey_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            Min Score: {unit.minimum_okey_score}
          </div>
        </div>

        <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-semibold text-sm transition-all">
          View Details
        </button>
      </div>
    </motion.div>
  );
}

function UnitCardHorizontal({
  unit,
  property,
  index,
  onNavigate
}: {
  unit: Unit;
  property: Property;
  index: number;
  onNavigate: (route: string, id?: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onClick={() => onNavigate('unit', unit.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group flex"
    >
      {/* Image */}
      <div className="relative w-64 h-48 bg-gray-200 overflow-hidden flex-shrink-0">
        <img
          src={property.images[0] || '/placeholder.jpg'}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {property.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {property.address.street}, {property.address.city}
              </p>
            </div>
            <div className="text-2xl font-bold text-blue-600 ml-4">
              ${unit.monthly_rent.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
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
            <span className="text-gray-400">•</span>
            <span>Available {new Date(unit.available_date).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {property.amenities.slice(0, 5).map((amenity, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 5 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                +{property.amenities.length - 5}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className={`px-3 py-1 rounded-full font-bold text-xs ${
            unit.minimum_okey_score >= 80 ? 'bg-red-100 text-red-700' :
            unit.minimum_okey_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            Min Score: {unit.minimum_okey_score}
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-semibold text-sm transition-all">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
      <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        Clear all filters
      </button>
    </div>
  );
}

function LoadingState({ viewMode }: { viewMode: ViewMode }) {
  const skeletonCount = viewMode === 'grid' ? 6 : 5;

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-5 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void
}) {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

function MobileFiltersSheet({
  isOpen,
  onClose,
  filters,
  setFilters,
  hasActiveFilters,
  clearFilters,
  togglePropertyType,
  toggleAmenity,
  userScore,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  togglePropertyType: (type: string) => void;
  toggleAmenity: (amenity: string) => void;
  userScore: number;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={() => {
                  clearFilters();
                  onClose();
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Location */}
          <FilterSection title="Location">
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>${filters.minPrice.toLocaleString()}</span>
                <span>${filters.maxPrice.toLocaleString()}+</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) || 0 }))}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || 5000 }))}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </FilterSection>

          {/* Bedrooms */}
          <FilterSection title="Bedrooms">
            <div className="flex flex-wrap gap-2">
              {['any', 'studio', '1', '2', '3', '4+'].map(option => (
                <button
                  key={option}
                  onClick={() => setFilters(prev => ({ ...prev, bedrooms: option }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.bedrooms === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}
                >
                  {option === 'studio' ? 'Studio' : option === 'any' ? 'Any' : option === '4+' ? '4+' : `${option} BR`}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Bathrooms */}
          <FilterSection title="Bathrooms">
            <div className="flex flex-wrap gap-2">
              {['any', '1', '1.5', '2', '2.5+'].map(option => (
                <button
                  key={option}
                  onClick={() => setFilters(prev => ({ ...prev, bathrooms: option }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.bathrooms === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}
                >
                  {option === 'any' ? 'Any' : `${option} Bath`}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Property Types */}
          <FilterSection title="Property Type">
            <div className="space-y-2">
              {PROPERTY_TYPES.map(type => (
                <label key={type} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.propertyTypes.includes(type)}
                    onChange={() => togglePropertyType(type)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Amenities */}
          <FilterSection title="Amenities">
            <div className="space-y-2">
              {AMENITIES.map(({ id, label, icon: Icon }) => (
                <label key={id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(id)}
                    onChange={() => toggleAmenity(id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Availability Date */}
          <FilterSection title="Available From">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filters.availableDate}
                onChange={(e) => setFilters(prev => ({ ...prev, availableDate: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </FilterSection>

          {/* O'Key Score */}
          <FilterSection title="O'Key Score">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">My Score:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  filters.okeyScore >= 80 ? 'bg-green-100 text-green-700' :
                  filters.okeyScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {filters.okeyScore}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.okeyScore}
                onChange={(e) => setFilters(prev => ({ ...prev, okeyScore: Number(e.target.value) }))}
                className="w-full"
              />
            </div>
          </FilterSection>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </div>
  );
}
