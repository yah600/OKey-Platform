import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar, Users, DollarSign, Bed, Bath, Maximize, Edit, Trash2, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock property data
  const property = {
    id: id || '1',
    name: 'Sunset Apartments',
    address: '123 Main St',
    city: 'Montreal',
    province: 'QC',
    postalCode: 'H3A 1B2',
    type: 'Apartment Building',
    yearBuilt: 2018,
    totalUnits: 12,
    occupiedUnits: 10,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
    description: 'Modern apartment building in the heart of downtown Montreal with excellent amenities and easy access to public transportation.',
    amenities: ['Parking', 'Gym', 'Laundry', 'Security', 'Elevator', 'Bike Storage'],
    monthlyRevenue: 21600,
    expenses: 8500,
    netIncome: 13100,
  };

  const units = [
    { id: 1, number: '101', beds: 1, baths: 1, sqft: 650, rent: 1800, status: 'occupied', tenant: 'Sarah Johnson' },
    { id: 2, number: '102', beds: 2, baths: 1, sqft: 850, rent: 2200, status: 'occupied', tenant: 'Michael Chen' },
    { id: 3, number: '103', beds: 2, baths: 2, sqft: 950, rent: 2500, status: 'vacant', tenant: null },
    { id: 4, number: '201', beds: 1, baths: 1, sqft: 700, rent: 1900, status: 'occupied', tenant: 'Emma Davis' },
    { id: 5, number: '202', beds: 2, baths: 1, sqft: 850, rent: 2200, status: 'maintenance', tenant: null },
  ];

  const maintenanceRequests = [
    { id: 1, unit: '101', issue: 'Leaking faucet', priority: 'medium', status: 'in-progress' },
    { id: 2, unit: '202', issue: 'Broken heater', priority: 'high', status: 'pending' },
    { id: 3, unit: '103', issue: 'Door lock replacement', priority: 'low', status: 'completed' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'units', label: 'Units' },
    { id: 'financials', label: 'Financials' },
    { id: 'maintenance', label: 'Maintenance' },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Properties', href: '/owner/properties' },
            { label: property.name },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/owner/properties')}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">{property.name}</h1>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPin className="w-4 h-4" />
                <span>{property.address}, {property.city}, {property.province} {property.postalCode}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Edit className="w-4 h-4" />
              Edit Property
            </Button>
            <Button variant="secondary">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Property Image */}
      <Card padding="none" className="mb-6 overflow-hidden">
        <div className="aspect-[21/9] bg-neutral-200">
          <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600">Total Units</p>
                    <p className="text-xl font-semibold text-neutral-900">{property.totalUnits}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600">Occupied</p>
                    <p className="text-xl font-semibold text-neutral-900">{property.occupiedUnits}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600">Monthly Revenue</p>
                    <p className="text-xl font-semibold text-neutral-900">${property.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600">Year Built</p>
                    <p className="text-xl font-semibold text-neutral-900">{property.yearBuilt}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Property Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Type</span>
                    <span className="font-medium text-neutral-900">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Year Built</span>
                    <span className="font-medium text-neutral-900">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Units</span>
                    <span className="font-medium text-neutral-900">{property.totalUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Occupancy Rate</span>
                    <span className="font-medium text-neutral-900">
                      {Math.round((property.occupiedUnits / property.totalUnits) * 100)}%
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Monthly Financials</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Revenue</span>
                    <span className="font-medium text-green-600">${property.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Expenses</span>
                    <span className="font-medium text-red-600">-${property.expenses.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex justify-between">
                    <span className="font-semibold text-neutral-900">Net Income</span>
                    <span className="font-semibold text-neutral-900">${property.netIncome.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Description</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{property.description}</p>
            </Card>

            {/* Amenities */}
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'units' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-neutral-600">{units.length} units</p>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Add Unit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {units.map((unit) => (
                <Card key={unit.id} className="hover:border-neutral-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-neutral-900">Unit {unit.number}</h4>
                    <Badge
                      variant={
                        unit.status === 'occupied'
                          ? 'success'
                          : unit.status === 'vacant'
                          ? 'default'
                          : 'warning'
                      }
                    >
                      {unit.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-neutral-600 mb-3">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {unit.beds} bed
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {unit.baths} bath
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="w-4 h-4" />
                        {unit.sqft} sqft
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-lg font-semibold text-neutral-900">${unit.rent}/mo</span>
                    {unit.tenant && (
                      <span className="text-xs text-neutral-600">{unit.tenant}</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <Card>
            <p className="text-sm text-neutral-600">Financial reports and analytics will be displayed here.</p>
          </Card>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-3">
            {maintenanceRequests.map((request) => (
              <Card key={request.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">{request.issue}</h4>
                    <p className="text-sm text-neutral-600">Unit {request.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        request.priority === 'high'
                          ? 'error'
                          : request.priority === 'medium'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {request.priority}
                    </Badge>
                    <Badge
                      variant={
                        request.status === 'completed'
                          ? 'success'
                          : request.status === 'in-progress'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
