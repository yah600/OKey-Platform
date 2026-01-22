import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Building2,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  LayoutGrid,
  List,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  X,
  Upload,
  FileText,
  Wrench,
  Receipt
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getPropertiesByOwner,
  getUnitsByProperty,
  getLeasesByProperty,
  getTransactionsByProperty,
  getIssuesByProperty
} from '@/lib/data/mockData';

type ViewMode = 'grid' | 'list';
type OccupancyFilter = 'all' | 'full' | 'partial' | 'vacant';
type SortBy = 'name_asc' | 'name_desc' | 'occupancy' | 'revenue';
type DetailTab = 'overview' | 'units' | 'financials' | 'maintenance' | 'documents';

interface EnrichedProperty {
  property: any;
  units: any[];
  occupiedUnits: number;
  totalUnits: number;
  occupancyRate: number;
  monthlyRevenue: number;
  activeLeases: number;
}

export function OwnerProperties() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [properties, setProperties] = useState<EnrichedProperty[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [occupancyFilter, setOccupancyFilter] = useState<OccupancyFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('name_asc');

  // Modals
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<EnrichedProperty | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');

  // Add Property form
  const [newPropertyForm, setNewPropertyForm] = useState({
    name: '',
    type: 'apartment',
    address: '',
    city: '',
    province: 'Quebec',
    postal_code: '',
    year_built: '',
    total_sq_ft: '',
    floors: '',
    description: '',
  });
  const [propertyFormErrors, setPropertyFormErrors] = useState<any>({});

  // Load properties
  useEffect(() => {
    if (!user) return;

    const owned = getPropertiesByOwner(user.id);
    const enriched: EnrichedProperty[] = owned.map(property => {
      const units = getUnitsByProperty(property.id);
      const leases = getLeasesByProperty(property.id);
      const activeLeases = leases.filter((l: any) => l.status === 'active');
      const occupiedUnits = activeLeases.length;
      const totalUnits = units.length;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

      // Calculate monthly revenue
      const monthlyRevenue = activeLeases.reduce((sum: number, lease: any) => {
        return sum + (lease.monthly_rent || 0);
      }, 0);

      return {
        property,
        units,
        occupiedUnits,
        totalUnits,
        occupancyRate,
        monthlyRevenue,
        activeLeases: activeLeases.length,
      };
    });

    setProperties(enriched);
  }, [user]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProperties = properties.length;
    const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
    const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
    const avgOccupancy = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    return {
      totalProperties,
      totalUnits,
      avgOccupancy,
    };
  }, [properties]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(p => {
      const searchMatch = searchQuery === '' ||
        p.property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.property.city.toLowerCase().includes(searchQuery.toLowerCase());

      let occupancyMatch = true;
      if (occupancyFilter === 'full') {
        occupancyMatch = p.occupancyRate === 100;
      } else if (occupancyFilter === 'partial') {
        occupancyMatch = p.occupancyRate > 0 && p.occupancyRate < 100;
      } else if (occupancyFilter === 'vacant') {
        occupancyMatch = p.occupancyRate === 0;
      }

      return searchMatch && occupancyMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.property.name.localeCompare(b.property.name);
      } else if (sortBy === 'name_desc') {
        return b.property.name.localeCompare(a.property.name);
      } else if (sortBy === 'occupancy') {
        return b.occupancyRate - a.occupancyRate;
      } else if (sortBy === 'revenue') {
        return b.monthlyRevenue - a.monthlyRevenue;
      }
      return 0;
    });

    return filtered;
  }, [properties, searchQuery, occupancyFilter, sortBy]);

  // Handle add property
  const handleAddProperty = () => {
    const errors: any = {};
    if (!newPropertyForm.name) errors.name = 'Property name is required';
    if (!newPropertyForm.address) errors.address = 'Address is required';
    if (!newPropertyForm.city) errors.city = 'City is required';
    if (!newPropertyForm.postal_code) errors.postal_code = 'Postal code is required';

    if (Object.keys(errors).length > 0) {
      setPropertyFormErrors(errors);
      return;
    }

    alert(`Property "${newPropertyForm.name}" added successfully!`);
    setShowAddProperty(false);
    setNewPropertyForm({
      name: '',
      type: 'apartment',
      address: '',
      city: '',
      province: 'Quebec',
      postal_code: '',
      year_built: '',
      total_sq_ft: '',
      floors: '',
      description: '',
    });
    setPropertyFormErrors({});
  };

  // Handle view property details
  const handleViewProperty = (property: EnrichedProperty) => {
    setSelectedProperty(property);
    setDetailTab('overview');
    setShowPropertyDetail(true);
  };

  // Get occupancy badge color
  const getOccupancyBadge = (rate: number) => {
    if (rate === 100) {
      return { text: 'Fully Occupied', color: 'bg-green-100 text-green-800' };
    } else if (rate >= 75) {
      return { text: 'High Occupancy', color: 'bg-blue-100 text-blue-800' };
    } else if (rate >= 50) {
      return { text: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    } else if (rate > 0) {
      return { text: 'Low Occupancy', color: 'bg-orange-100 text-orange-800' };
    } else {
      return { text: 'Vacant', color: 'bg-red-100 text-red-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">My Properties</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-gray-600">Manage and monitor all your properties</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Properties</span>
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
            <p className="text-sm text-gray-500 mt-1">{stats.totalUnits} total units</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Units</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUnits}</p>
            <p className="text-sm text-gray-500 mt-1">
              {properties.reduce((sum, p) => sum + p.occupiedUnits, 0)} occupied
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Average Occupancy</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.avgOccupancy}%</p>
            <p className="text-sm text-gray-500 mt-1">Across all properties</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filters and Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Occupancy Filter */}
              <select
                value={occupancyFilter}
                onChange={(e) => setOccupancyFilter(e.target.value as OccupancyFilter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Occupancy</option>
                <option value="full">Fully Occupied</option>
                <option value="partial">Partially Vacant</option>
                <option value="vacant">Fully Vacant</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="occupancy">Occupancy</option>
                <option value="revenue">Revenue</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Add Property */}
              <button
                onClick={() => setShowAddProperty(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Property
              </button>
            </div>
          </div>
        </div>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || occupancyFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first property'}
            </p>
            {!searchQuery && occupancyFilter === 'all' && (
              <button
                onClick={() => setShowAddProperty(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Property
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((enriched) => {
              const badge = getOccupancyBadge(enriched.occupancyRate);
              return (
                <div
                  key={enriched.property.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Property Image */}
                  <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white opacity-50" />
                  </div>

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {enriched.property.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{enriched.property.address}</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Occupancy Badge */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Units</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {enriched.occupiedUnits}/{enriched.totalUnits}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Occupancy</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {Math.round(enriched.occupancyRate)}%
                        </p>
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${enriched.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>

                    {/* Property Info */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div>Type: <span className="text-gray-900 capitalize">{enriched.property.type}</span></div>
                      <div>Year Built: <span className="text-gray-900">{enriched.property.year_built || 'N/A'}</span></div>
                      {enriched.property.total_sq_ft && (
                        <div>Size: <span className="text-gray-900">{enriched.property.total_sq_ft.toLocaleString()} sq ft</span></div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProperty(enriched)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupancy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProperties.map((enriched) => {
                  const badge = getOccupancyBadge(enriched.occupancyRate);
                  return (
                    <tr key={enriched.property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{enriched.property.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{enriched.property.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{enriched.property.address}, {enriched.property.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 font-medium">
                          {enriched.occupiedUnits}/{enriched.totalUnits}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {Math.round(enriched.occupancyRate)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          ${enriched.monthlyRevenue.toLocaleString()}/mo
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewProperty(enriched)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Property</h2>
              <button
                onClick={() => {
                  setShowAddProperty(false);
                  setPropertyFormErrors({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Property Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPropertyForm.name}
                    onChange={(e) => setNewPropertyForm({ ...newPropertyForm, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      propertyFormErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Sunset Apartments"
                  />
                  {propertyFormErrors.name && (
                    <p className="text-sm text-red-500 mt-1">{propertyFormErrors.name}</p>
                  )}
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={newPropertyForm.type}
                    onChange={(e) => setNewPropertyForm({ ...newPropertyForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="house">House</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPropertyForm.address}
                    onChange={(e) => setNewPropertyForm({ ...newPropertyForm, address: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      propertyFormErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {propertyFormErrors.address && (
                    <p className="text-sm text-red-500 mt-1">{propertyFormErrors.address}</p>
                  )}
                </div>

                {/* City, Province, Postal Code */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPropertyForm.city}
                      onChange={(e) => setNewPropertyForm({ ...newPropertyForm, city: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                        propertyFormErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Montreal"
                    />
                    {propertyFormErrors.city && (
                      <p className="text-sm text-red-500 mt-1">{propertyFormErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <select
                      value={newPropertyForm.province}
                      onChange={(e) => setNewPropertyForm({ ...newPropertyForm, province: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Quebec">QC</option>
                      <option value="Ontario">ON</option>
                      <option value="BC">BC</option>
                      <option value="Alberta">AB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPropertyForm.postal_code}
                    onChange={(e) => setNewPropertyForm({ ...newPropertyForm, postal_code: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      propertyFormErrors.postal_code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="H3A 1A1"
                  />
                  {propertyFormErrors.postal_code && (
                    <p className="text-sm text-red-500 mt-1">{propertyFormErrors.postal_code}</p>
                  )}
                </div>

                {/* Year Built, Sq Ft, Floors */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                    <input
                      type="number"
                      value={newPropertyForm.year_built}
                      onChange={(e) => setNewPropertyForm({ ...newPropertyForm, year_built: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Sq Ft</label>
                    <input
                      type="number"
                      value={newPropertyForm.total_sq_ft}
                      onChange={(e) => setNewPropertyForm({ ...newPropertyForm, total_sq_ft: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
                    <input
                      type="number"
                      value={newPropertyForm.floors}
                      onChange={(e) => setNewPropertyForm({ ...newPropertyForm, floors: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="3"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newPropertyForm.description}
                    onChange={(e) => setNewPropertyForm({ ...newPropertyForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe your property..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddProperty(false);
                  setPropertyFormErrors({});
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProperty}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      {showPropertyDetail && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedProperty.property.name}</h2>
                <p className="text-sm text-gray-600">{selectedProperty.property.address}</p>
              </div>
              <button
                onClick={() => setShowPropertyDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-gray-50 border-b border-gray-200 px-6">
              <div className="flex gap-1">
                {(['overview', 'units', 'financials', 'maintenance', 'documents'] as DetailTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                      detailTab === tab
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {detailTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="text-base font-medium text-gray-900 capitalize">{selectedProperty.property.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Year Built</p>
                        <p className="text-base font-medium text-gray-900">{selectedProperty.property.year_built || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Square Feet</p>
                        <p className="text-base font-medium text-gray-900">
                          {selectedProperty.property.total_sq_ft ? `${selectedProperty.property.total_sq_ft.toLocaleString()} sq ft` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Floors</p>
                        <p className="text-base font-medium text-gray-900">{selectedProperty.property.floors || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Units</p>
                        <p className="text-base font-medium text-gray-900">{selectedProperty.totalUnits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Occupied Units</p>
                        <p className="text-base font-medium text-gray-900">{selectedProperty.occupiedUnits}</p>
                      </div>
                    </div>
                  </div>

                  {selectedProperty.property.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedProperty.property.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(selectedProperty.occupancyRate)}%</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${selectedProperty.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Active Leases</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedProperty.activeLeases}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'units' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Units</h3>
                  <div className="space-y-3">
                    {selectedProperty.units.map((unit: any) => (
                      <div key={unit.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Unit {unit.unit_number}</p>
                          <p className="text-sm text-gray-600">
                            {unit.bedrooms} bed, {unit.bathrooms} bath • {unit.square_feet} sq ft
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${unit.rent}/mo</p>
                          <p className={`text-sm ${unit.status === 'occupied' ? 'text-green-600' : 'text-orange-600'}`}>
                            {unit.status === 'occupied' ? 'Occupied' : 'Vacant'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailTab === 'financials' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Financial data will be displayed here</p>
                  </div>
                </div>
              )}

              {detailTab === 'maintenance' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Requests</h3>
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Maintenance requests will be displayed here</p>
                  </div>
                </div>
              )}

              {detailTab === 'documents' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Property documents will be displayed here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowPropertyDetail(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
