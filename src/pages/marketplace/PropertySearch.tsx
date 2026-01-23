import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Building2, ArrowUpDown, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import { usePropertySearchStore } from '../../store/propertySearchStore';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'sonner';

export default function PropertySearch() {
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [priceError, setPriceError] = useState('');

  const {
    filters,
    setFilters,
    resetFilters,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    getPaginatedProperties,
    getFilteredProperties,
    getTotalPages,
  } = usePropertySearchStore();

  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Update filters when debounced search query changes
  useEffect(() => {
    setFilters({ query: debouncedSearchQuery });
  }, [debouncedSearchQuery, setFilters]);

  // Price validation handlers
  const handleMinPriceChange = (value: number) => {
    if (value > filters.priceMax) {
      setPriceError('Minimum price cannot exceed maximum price');
      toast.error('Invalid Price Range', {
        description: 'Minimum price cannot be greater than maximum price.',
      });
      return;
    }
    setPriceError('');
    setFilters({ priceMin: value });
  };

  const handleMaxPriceChange = (value: number) => {
    if (value < filters.priceMin) {
      setPriceError('Maximum price cannot be less than minimum price');
      toast.error('Invalid Price Range', {
        description: 'Maximum price cannot be less than minimum price.',
      });
      return;
    }
    setPriceError('');
    setFilters({ priceMax: value });
  };

  const paginatedProperties = getPaginatedProperties();
  const filteredCount = getFilteredProperties().length;
  const totalPages = getTotalPages();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link to="/" className="text-lg font-semibold text-neutral-900">O'Key Platform</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8"><Loading /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-semibold text-neutral-900">
              O'Key Platform
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filters */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by location, property name..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card padding="sm" className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ propertyType: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="house">House</option>
                    <option value="loft">Loft</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ city: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Cities</option>
                    <option value="montreal">Montreal</option>
                    <option value="laval">Laval</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Bedrooms</label>
                  <select
                    value={filters.beds}
                    onChange={(e) => setFilters({ beds: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Bathrooms</label>
                  <select
                    value={filters.baths}
                    onChange={(e) => setFilters({ baths: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-neutral-600 mb-1">
                    Price Range: ${filters.priceMin} - ${filters.priceMax}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.priceMin}
                      onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.priceMax}
                      onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                  {priceError && (
                    <div className="flex items-center gap-2 text-xs text-red-600 mt-2">
                      <AlertCircle className="w-3 h-3" />
                      {priceError}
                    </div>
                  )}
                </div>
                <div className="flex items-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      resetFilters();
                      setLocalSearchQuery('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">{filteredCount} properties found</p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-neutral-400" />
              <select
                value={`${sortBy.field}-${sortBy.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-') as [
                    'priceFrom' | 'createdAt' | 'name',
                    'asc' | 'desc'
                  ];
                  setSortBy({ field, direction });
                }}
                className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="priceFrom-asc">Price: Low to High</option>
                <option value="priceFrom-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProperties.map((property) => (
            <Link key={property.id} to={`/marketplace/property/${property.id}`}>
              <Card padding="none" className="hover:border-neutral-300 transition-colors cursor-pointer overflow-hidden h-full">
                <div className="aspect-video bg-neutral-200 overflow-hidden relative">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-white text-neutral-900 rounded shadow-sm font-medium">
                    {property.type}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 mb-1">{property.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-neutral-600 mb-3">
                    <MapPin className="w-3 h-3" />
                    {property.address}, {property.city}, {property.province}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-600 mb-3 pb-3 border-b border-neutral-100">
                    <span>{property.beds} beds</span>
                    <span>•</span>
                    <span>{property.baths} baths</span>
                    <span>•</span>
                    <span>{property.availableUnits} available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">Starting from</p>
                      <p className="text-lg font-semibold text-neutral-900">
                        ${property.priceFrom.toLocaleString()}
                        <span className="text-xs text-neutral-500 font-normal">/mo</span>
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
            ))}
          </div>
        ) : (
          <Card className="mt-6">
            <EmptyState
              icon={Building2}
              title="No properties found"
              description="Try adjusting your search filters to find more properties."
              action={{
                label: 'Clear Filters',
                onClick: () => {
                  resetFilters();
                  setLocalSearchQuery('');
                },
              }}
            />
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-neutral-400">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
