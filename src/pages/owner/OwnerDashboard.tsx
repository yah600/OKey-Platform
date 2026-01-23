import { useState, useEffect } from 'react';
import { Building2, DollarSign, Users, TrendingUp, AlertCircle, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

export default function OwnerDashboard() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const { getPropertiesByOwner, getTotalRevenue } = useOwnerPropertiesStore();
  const { requests: allMaintenanceRequests } = useMaintenanceStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const properties = user ? getPropertiesByOwner(user.id) : [];
  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const monthlyRevenue = user ? getTotalRevenue(user.id) : 0;

  // Get owner's maintenance requests (for all their properties)
  const propertyIds = properties.map((p) => p.id);
  const maintenanceRequests = allMaintenanceRequests
    .filter((req) => propertyIds.includes(req.propertyId))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Portfolio Overview</h1>
          <p className="text-sm text-neutral-600">Manage your properties and track performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card padding="sm">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-neutral-500" />
              <p className="text-xs text-neutral-600">Properties</p>
            </div>
            <p className="text-2xl font-semibold text-neutral-900 mb-0.5">{properties.length}</p>
            <p className="text-xs text-neutral-500">{totalUnits} total units</p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-neutral-500" />
              <p className="text-xs text-neutral-600">Monthly Revenue</p>
            </div>
            <p className="text-2xl font-semibold text-neutral-900 mb-0.5">
              ${monthlyRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-500">
              Net: ${properties.reduce((sum, p) => sum + p.netIncome, 0).toLocaleString()}
            </p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-neutral-500" />
              <p className="text-xs text-neutral-600">Occupancy</p>
            </div>
            <p className="text-2xl font-semibold text-neutral-900 mb-0.5">{occupancyRate}%</p>
            <p className="text-xs text-neutral-500">
              {occupiedUnits}/{totalUnits} units
            </p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-neutral-500" />
              <p className="text-xs text-neutral-600">Maintenance</p>
            </div>
            <p className="text-2xl font-semibold text-neutral-900 mb-0.5">
              {maintenanceRequests.filter((r) => r.status === 'pending' || r.status === 'in_progress').length}
            </p>
            <p className="text-xs text-neutral-500">Active requests</p>
          </Card>
        </div>

        {/* Alerts */}
        {maintenanceRequests.filter((r) => r.priority === 'high' || r.priority === 'emergency').length > 0 && (
          <Card className="mb-6 border-l-4 border-l-red-500">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">Urgent Maintenance</h3>
                <p className="text-sm text-neutral-600 mb-2">
                  {maintenanceRequests.filter((r) => r.priority === 'high' || r.priority === 'emergency').length} high-priority requests require attention
                </p>
                <Link to="/owner/maintenance">
                  <Button variant="secondary" size="sm">View Requests</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {properties.filter((p) => p.availableUnits > 0).length > 0 && (
          <Card className="mb-6 border-l-4 border-l-amber-500">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">Vacant Units</h3>
                <p className="text-sm text-neutral-600 mb-2">
                  {properties.reduce((sum, p) => sum + p.availableUnits, 0)} units available for rent
                </p>
                <Link to="/owner/properties">
                  <Button variant="secondary" size="sm">Review Properties</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Properties */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">Properties</h3>
              <Link to="/owner/properties">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {properties.slice(0, 3).map((property) => (
                <Link key={property.id} to={`/owner/properties/${property.id}`}>
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{property.name}</p>
                      <p className="text-xs text-neutral-600">
                        {property.occupiedUnits}/{property.totalUnits} units occupied
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-neutral-900">
                        ${property.monthlyRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-neutral-500">per month</p>
                    </div>
                  </div>
                </Link>
              ))}
              {properties.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <Building2 className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                  <p className="text-sm">No properties yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Maintenance */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">Maintenance Requests</h3>
              <Link to="/owner/maintenance">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {maintenanceRequests.slice(0, 3).map((request) => {
                const getPriorityColor = (priority: string) => {
                  if (priority === 'emergency') return 'bg-red-100 text-red-700';
                  if (priority === 'high') return 'bg-orange-100 text-orange-700';
                  if (priority === 'medium') return 'bg-amber-100 text-amber-700';
                  return 'bg-neutral-100 text-neutral-700';
                };

                const getStatusColor = (status: string) => {
                  if (status === 'completed') return 'text-green-600';
                  if (status === 'in_progress') return 'text-blue-600';
                  return 'text-neutral-600';
                };

                return (
                  <div
                    key={request.id}
                    className="flex items-start gap-3 pb-3 border-b border-neutral-100 last:border-0"
                  >
                    <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{request.title}</p>
                      <p className="text-xs text-neutral-600">
                        {request.propertyName} - Unit {request.unitNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(request.priority)}`}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </span>
                        <span className={`text-xs ${getStatusColor(request.status)}`}>
                          {request.status === 'in_progress'
                            ? 'In Progress'
                            : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {maintenanceRequests.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <Wrench className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                  <p className="text-sm">No maintenance requests</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
