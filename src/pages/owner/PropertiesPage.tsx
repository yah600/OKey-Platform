import { Building2, Plus, Search, MapPin, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function PropertiesPage() {
  const properties = [
    { id: 1, name: 'Sunset Apartments', address: '123 Main St, Montreal', units: 24, occupied: 24, revenue: 12400, occupancy: 100 },
    { id: 2, name: 'Downtown Plaza', address: '456 King St, Montreal', units: 18, occupied: 16, revenue: 9800, occupancy: 89 },
    { id: 3, name: 'Riverside Complex', address: '789 River Rd, Laval', units: 8, occupied: 8, revenue: 6250, occupancy: 100 },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Properties</h1>
          <p className="text-sm text-neutral-600">Manage your property portfolio</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {properties.map((property) => (
          <Card key={property.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-neutral-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{property.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-neutral-600 mb-2">
                    <MapPin className="w-3 h-3" />
                    {property.address}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">{property.occupied}/{property.units} units</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${property.occupancy === 100 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {property.occupancy}% occupied
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-neutral-900">${property.revenue.toLocaleString()}</p>
                <p className="text-xs text-neutral-500 mb-3">monthly revenue</p>
                <Button variant="secondary" size="sm">View Details</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
