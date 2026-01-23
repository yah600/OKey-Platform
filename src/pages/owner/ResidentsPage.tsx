import { useState, useEffect } from 'react';
import { Users, Search, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { useAuthStore } from '../../store/authStore';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';

export default function ResidentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const { getPropertiesByOwner, units: allUnits } = useOwnerPropertiesStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Get owner's properties
  const properties = user ? getPropertiesByOwner(user.id) : [];
  const propertyIds = properties.map((p) => p.id);

  // Get all occupied units for owner's properties
  const occupiedUnits = allUnits
    .filter((unit) => propertyIds.includes(unit.propertyId) && unit.status === 'occupied' && unit.tenantName)
    .map((unit) => {
      const property = properties.find((p) => p.id === unit.propertyId);
      return {
        ...unit,
        propertyName: property?.name || 'Unknown Property',
      };
    });

  // Filter residents by search query
  const filteredResidents = occupiedUnits.filter(
    (unit) =>
      unit.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalTenants = occupiedUnits.length;
  const today = new Date();
  const threeMonthsFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
  const expiringSoon = occupiedUnits.filter((unit) => {
    if (!unit.leaseEnd) return false;
    const leaseEndDate = new Date(unit.leaseEnd);
    return leaseEndDate >= today && leaseEndDate <= threeMonthsFromNow;
  }).length;

  // Calculate average lease term in months
  const avgLeaseTerm = occupiedUnits.length > 0
    ? Math.round(
        occupiedUnits.reduce((sum, unit) => {
          if (!unit.leaseStart || !unit.leaseEnd) return sum;
          const start = new Date(unit.leaseStart);
          const end = new Date(unit.leaseEnd);
          const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
          return sum + months;
        }, 0) / occupiedUnits.length
      )
    : 0;

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Residents</h1>
        <p className="text-sm text-neutral-600">Manage tenants and leases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Total Tenants</p>
          <p className="text-2xl font-semibold text-neutral-900">{totalTenants}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Expiring Soon</p>
          <p className="text-2xl font-semibold text-amber-600">{expiringSoon}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Avg Lease Term</p>
          <p className="text-2xl font-semibold text-neutral-900">{avgLeaseTerm} mo</p>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search residents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredResidents.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm text-neutral-500">
                {searchQuery ? 'No residents match your search' : 'No residents yet'}
              </p>
            </div>
          </Card>
        ) : (
          filteredResidents.map((unit) => {
            const leaseEndDate = unit.leaseEnd ? new Date(unit.leaseEnd) : null;
            const isExpiringSoon =
              leaseEndDate && leaseEndDate >= today && leaseEndDate <= threeMonthsFromNow;

            return (
              <Card key={unit.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">{unit.tenantName}</h3>
                      <p className="text-sm text-neutral-600 mb-2">
                        {unit.propertyName} - Unit {unit.unitNumber}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {unit.leaseStart && unit.leaseEnd ? (
                            <>
                              {new Date(unit.leaseStart).toLocaleDateString()} -{' '}
                              {new Date(unit.leaseEnd).toLocaleDateString()}
                            </>
                          ) : (
                            'Lease dates not available'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-neutral-900">${unit.rent.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500 mb-2">per month</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        isExpiringSoon
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {isExpiringSoon ? 'Expiring Soon' : 'Active'}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
