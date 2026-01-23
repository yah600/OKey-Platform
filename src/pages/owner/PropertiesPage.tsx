import { useState, useEffect } from 'react';
import { Building2, Plus, Search, MapPin, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { toast } from 'sonner';

export default function PropertiesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const { getPropertiesByOwner } = useOwnerPropertiesStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const allProperties = user ? getPropertiesByOwner(user.id) : [];

  const filteredProperties = allProperties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProperty = () => {
    toast.info('Add Property', {
      description: 'Property creation form coming soon.',
    });
  };

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Properties</h1>
          <p className="text-sm text-neutral-600">
            {allProperties.length} {allProperties.length === 1 ? 'property' : 'properties'} in your portfolio
          </p>
        </div>
        <Button variant="primary" onClick={handleAddProperty}>
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-600">Total Units</p>
              <p className="text-lg font-semibold text-neutral-900">
                {allProperties.reduce((sum, p) => sum + p.totalUnits, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-600">Occupancy Rate</p>
              <p className="text-lg font-semibold text-neutral-900">
                {allProperties.length > 0
                  ? Math.round(
                      (allProperties.reduce((sum, p) => sum + p.occupiedUnits, 0) /
                        allProperties.reduce((sum, p) => sum + p.totalUnits, 0)) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-600">Total Revenue</p>
              <p className="text-lg font-semibold text-neutral-900">
                ${allProperties.reduce((sum, p) => sum + p.monthlyRevenue, 0).toLocaleString()}/mo
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProperties.map((property) => {
          const occupancyRate = Math.round((property.occupiedUnits / property.totalUnits) * 100);

          return (
            <Link key={property.id} to={`/owner/properties/${property.id}`}>
              <Card className="hover:border-neutral-300 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">{property.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-neutral-600 mb-2">
                        <MapPin className="w-3 h-3" />
                        {property.address.street}, {property.address.city}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-700">
                            {property.occupiedUnits}/{property.totalUnits} units
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            occupancyRate === 100
                              ? 'bg-green-100 text-green-700'
                              : occupancyRate >= 90
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {occupancyRate}% occupied
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-600 mb-1">Monthly Revenue</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      ${property.monthlyRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500 mb-2">
                      Net: ${property.netIncome.toLocaleString()}
                    </p>
                    <Button variant="secondary" size="sm" onClick={(e) => e.preventDefault()}>
                      View Details →
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
