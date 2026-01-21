import { useState } from 'react';
import { Search, MapPin, DollarSign, BedDouble, Bath, Star, ChevronDown, Filter, X } from 'lucide-react';
import { motion } from 'motion/react';
import { mockProperties, mockUnits, getAvailableUnits } from '@/lib/data/mockData';

interface PropertySearchProps {
  onNavigate: (route: string, id?: string) => void;
}

export function PropertySearch({ onNavigate }: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const availableUnits = getAvailableUnits();

  // Filter properties
  const filteredProperties = mockProperties.filter(property => {
    const propertyUnits = mockUnits.filter(u => u.propertyId === property.id);
    const matchesSearch = !searchQuery ||
      property.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = propertyUnits.some(unit => {
      const min = priceMin ? parseFloat(priceMin) : 0;
      const max = priceMax ? parseFloat(priceMax) : Infinity;
      return unit.askingPrice >= min && unit.askingPrice <= max;
    });

    const matchesBeds = !bedrooms || propertyUnits.some(u => u.bedrooms === parseInt(bedrooms));
    const matchesBaths = !bathrooms || propertyUnits.some(u => u.bathrooms === parseInt(bathrooms));

    return matchesSearch && (!priceMin && !priceMax || matchesPrice) && matchesBeds && matchesBaths;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setPriceMin('');
    setPriceMax('');
    setBedrooms('');
    setBathrooms('');
  };

  const activeFiltersCount = [priceMin, priceMax, bedrooms, bathrooms].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Search Properties</h1>
            <p className="text-lg text-gray-600">Find your perfect rental from {mockProperties.length} available properties</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by building name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 whitespace-nowrap"
              >
                <Filter className="w-5 h-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-teal-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    disabled={activeFiltersCount === 0}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-bold text-teal-600">{filteredProperties.length}</span> of {mockProperties.length} properties
            </p>
          </div>

          {/* Property Grid */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property, index) => {
                const propertyUnits = mockUnits.filter(u => u.propertyId === property.id && u.status === 'available');
                const minPrice = Math.min(...propertyUnits.map(u => u.askingPrice));

                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => onNavigate('property', property.id)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={property.images[0]}
                        alt={property.buildingName}
                        className="w-full h-full object-cover"
                      />
                      {property.verified && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          Verified
                        </div>
                      )}
                      {propertyUnits.length > 0 && (
                        <div className="absolute bottom-3 left-3 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {propertyUnits.length} units available
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold">{property.buildingName}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.city}, {property.province}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{(property.buildingScore / 100).toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xl font-bold text-teal-600">
                          From ${minPrice.toLocaleString()}/mo
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      <button className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
                        View Property
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
