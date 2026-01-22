import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function PropertySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const properties = [
    {
      id: 1,
      name: 'Sunset Apartments',
      address: '123 Main St, Montreal, QC',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      units: 3,
      priceFrom: 1800,
      type: 'Apartment',
      beds: '1-2',
      baths: '1',
    },
    {
      id: 2,
      name: 'Downtown Plaza',
      address: '456 King St, Montreal, QC',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      units: 5,
      priceFrom: 2200,
      type: 'Condo',
      beds: '2-3',
      baths: '2',
    },
    {
      id: 3,
      name: 'Riverside Complex',
      address: '789 River Rd, Laval, QC',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      units: 2,
      priceFrom: 2500,
      type: 'House',
      beds: '3',
      baths: '2.5',
    },
    {
      id: 4,
      name: 'Urban Lofts',
      address: '321 Urban Ave, Montreal, QC',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      units: 4,
      priceFrom: 1950,
      type: 'Loft',
      beds: '1-2',
      baths: '1',
    },
    {
      id: 5,
      name: 'Garden Residences',
      address: '555 Park Blvd, Laval, QC',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      units: 6,
      priceFrom: 1750,
      type: 'Apartment',
      beds: '1-3',
      baths: '1-2',
    },
    {
      id: 6,
      name: 'Executive Towers',
      address: '888 Business St, Montreal, QC',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      units: 8,
      priceFrom: 2800,
      type: 'Condo',
      beds: '2-4',
      baths: '2-3',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="house">House</option>
                    <option value="loft">Loft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-2000">$0 - $2,000</option>
                    <option value="2000-2500">$2,000 - $2,500</option>
                    <option value="2500+">$2,500+</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setPropertyType('all');
                      setPriceRange('all');
                      setSearchQuery('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <p className="text-sm text-neutral-600">{properties.length} properties found</p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
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
                    {property.address}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-600 mb-3 pb-3 border-b border-neutral-100">
                    <span>{property.beds} beds</span>
                    <span>•</span>
                    <span>{property.baths} baths</span>
                    <span>•</span>
                    <span>{property.units} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">Starting from</p>
                      <p className="text-lg font-semibold text-neutral-900">
                        ${property.priceFrom}
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

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" disabled>
            Previous
          </Button>
          <Button variant="primary" size="sm">
            1
          </Button>
          <Button variant="secondary" size="sm">
            2
          </Button>
          <Button variant="secondary" size="sm">
            3
          </Button>
          <Button variant="secondary" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
