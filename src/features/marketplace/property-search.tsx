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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Your Next Home</h1>
            <p className="text-lg text-gray-600">Browse {mockProperties.length} verified properties across Montreal</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
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
            <p className="text-lg text-gray-700">
              <span className="font-bold text-gray-900">{filteredProperties.length}</span> <span className="text-gray-600">properties available</span>
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
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    onClick={() => onNavigate('property', property.id)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="relative h-56 bg-gray-200 overflow-hidden">
                      <img
                        src={property.images[0]}
                        alt={property.buildingName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{property.buildingName}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {property.city}, {property.province}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-gradient-to-br from-yellow-50 to-orange-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                          <Star className="w-4 h-4 text-yellow-600 fill-yellow-500" />
                          <span className="text-sm font-bold text-yellow-900">{(property.buildingScore / 100).toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="mb-4 pb-4 border-b">
                        <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                          From ${minPrice.toLocaleString()}<span className="text-base text-gray-600 font-normal">/mo</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-teal-600/30 font-semibold transition-all duration-300">
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
