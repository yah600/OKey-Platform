import { useState, useEffect } from 'react';
import { Wrench, Filter, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { useAuthStore } from '../../store/authStore';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';
import { useMaintenanceStore } from '../../store/maintenanceStore';

type FilterStatus = 'all' | 'pending' | 'in_progress' | 'completed';

export default function OwnerMaintenancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const { user } = useAuthStore();
  const { getPropertiesByOwner } = useOwnerPropertiesStore();
  const { requests: allMaintenanceRequests } = useMaintenanceStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Get owner's properties
  const properties = user ? getPropertiesByOwner(user.id) : [];
  const propertyIds = properties.map((p) => p.id);

  // Get all maintenance requests for owner's properties
  const ownerRequests = allMaintenanceRequests
    .filter((req) => propertyIds.includes(req.propertyId))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  // Filter by status
  const filteredRequests =
    filterStatus === 'all'
      ? ownerRequests
      : ownerRequests.filter((req) => req.status === filterStatus);

  // Calculate stats
  const totalRequests = ownerRequests.length;
  const inProgressCount = ownerRequests.filter((req) => req.status === 'in_progress').length;
  const pendingCount = ownerRequests.filter((req) => req.status === 'pending').length;
  const completedCount = ownerRequests.filter((req) => req.status === 'completed').length;

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Maintenance</h1>
        <p className="text-sm text-neutral-600">Manage maintenance requests across all properties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Total Requests</p>
          <p className="text-2xl font-semibold text-neutral-900">{totalRequests}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">In Progress</p>
          <p className="text-2xl font-semibold text-blue-600">{inProgressCount}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Pending</p>
          <p className="text-2xl font-semibold text-amber-600">{pendingCount}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Completed</p>
          <p className="text-2xl font-semibold text-green-600">{completedCount}</p>
        </Card>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={filterStatus === 'all' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          <Filter className="w-4 h-4" />
          All
        </Button>
        <Button
          variant={filterStatus === 'pending' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilterStatus('pending')}
        >
          Pending
        </Button>
        <Button
          variant={filterStatus === 'in_progress' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilterStatus('in_progress')}
        >
          In Progress
        </Button>
        <Button
          variant={filterStatus === 'completed' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilterStatus('completed')}
        >
          Completed
        </Button>
      </div>

      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <Wrench className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm text-neutral-500">
                {filterStatus === 'all'
                  ? 'No maintenance requests'
                  : `No ${filterStatus.replace('_', ' ')} requests`}
              </p>
            </div>
          </Card>
        ) : (
          filteredRequests.map((request) => {
            const getPriorityColor = (priority: string) => {
              if (priority === 'emergency') return 'bg-red-100 text-red-700';
              if (priority === 'high') return 'bg-orange-100 text-orange-700';
              if (priority === 'medium') return 'bg-amber-100 text-amber-700';
              return 'bg-neutral-100 text-neutral-700';
            };

            const getStatusColor = (status: string) => {
              if (status === 'completed') return 'bg-green-100 text-green-700';
              if (status === 'in_progress') return 'bg-blue-100 text-blue-700';
              if (status === 'pending') return 'bg-amber-100 text-amber-700';
              return 'bg-neutral-100 text-neutral-700';
            };

            return (
              <Card key={request.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 mb-1">{request.title}</h3>
                      <p className="text-xs text-neutral-600 mb-1">
                        {request.propertyName} - Unit {request.unitNumber}
                      </p>
                      <p className="text-xs text-neutral-500 mb-2">{request.description}</p>
                      <p className="text-xs text-neutral-400">
                        Submitted {new Date(request.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(request.priority)}`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(request.status)}`}>
                        {request.status === 'in_progress'
                          ? 'In Progress'
                          : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
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
