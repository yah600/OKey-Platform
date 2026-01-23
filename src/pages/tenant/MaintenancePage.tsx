import { useState, useEffect } from 'react';
import { Wrench, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useMaintenanceStore, type MaintenanceRequest } from '../../store/maintenanceStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import MaintenanceRequestModal from '../../components/organisms/MaintenanceRequestModal';

export default function MaintenancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | MaintenanceRequest['status']>('all');
  const { user } = useAuthStore();

  const { getRequestsByUser, getRequestsByStatus, getActiveRequestsCount } = useMaintenanceStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const allRequests = user ? getRequestsByUser(user.id) : [];
  const activeCount = user ? getActiveRequestsCount(user.id) : 0;
  const inProgressCount = allRequests.filter((r) => r.status === 'in_progress').length;
  const completedCount = allRequests.filter((r) => r.status === 'completed').length;

  const filteredRequests =
    activeFilter === 'all'
      ? allRequests
      : user
      ? getRequestsByStatus(user.id, activeFilter)
      : [];

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-700';
    if (status === 'Pending') return 'bg-amber-100 text-amber-700';
    return 'bg-neutral-100 text-neutral-700';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'High') return 'text-red-600';
    if (priority === 'Medium') return 'text-amber-600';
    return 'text-neutral-600';
  };

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Maintenance</h1>
          <p className="text-sm text-neutral-600">Submit and track maintenance requests</p>
        </div>
        <Button variant="primary" onClick={() => setShowRequestModal(true)}>
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Active Requests</p>
          <p className="text-2xl font-semibold text-neutral-900">{activeCount}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">In Progress</p>
          <p className="text-2xl font-semibold text-blue-600">{inProgressCount}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Completed</p>
          <p className="text-2xl font-semibold text-green-600">{completedCount}</p>
        </Card>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Button
          variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('all')}
        >
          All ({allRequests.length})
        </Button>
        <Button
          variant={activeFilter === 'pending' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('pending')}
        >
          Pending ({allRequests.filter((r) => r.status === 'pending').length})
        </Button>
        <Button
          variant={activeFilter === 'in_progress' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('in_progress')}
        >
          In Progress ({inProgressCount})
        </Button>
        <Button
          variant={activeFilter === 'completed' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('completed')}
        >
          Completed ({completedCount})
        </Button>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const categoryIcons: Record<string, string> = {
              plumbing: '🚰',
              electrical: '⚡',
              hvac: '❄️',
              appliance: '🔧',
              structural: '🏠',
              other: '🔨',
            };

            return (
              <Card key={request.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-lg">
                      {categoryIcons[request.category] || '🔧'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-neutral-900 mb-1">{request.title}</h3>
                      <p className="text-xs text-neutral-600 mb-2">
                        {request.location} • {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                      </p>
                      <p className="text-xs text-neutral-500 mb-2 line-clamp-2">
                        {request.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={'text-xs px-2 py-0.5 rounded ' + getStatusColor(request.status)}>
                          {request.status === 'in_progress'
                            ? 'In Progress'
                            : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className={'text-xs font-medium ' + getPriorityColor(request.priority)}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                        </span>
                        {request.assignedTo && (
                          <span className="text-xs text-neutral-500">
                            Assigned: {request.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-neutral-500 mb-1">
                      Submitted {new Date(request.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    {request.scheduledDate && request.status === 'in_progress' && (
                      <p className="text-xs text-blue-600 mb-2">
                        Scheduled {new Date(request.scheduledDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                    {request.completedDate && (
                      <p className="text-xs text-green-600 mb-2">
                        Completed {new Date(request.completedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Wrench}
            title={
              activeFilter === 'all'
                ? 'No maintenance requests'
                : `No ${activeFilter.replace('_', ' ')} requests`
            }
            description={
              activeFilter === 'all'
                ? "You don't have any maintenance requests. Submit a new request if you need repairs."
                : `You don't have any ${activeFilter.replace('_', ' ')} maintenance requests.`
            }
            action={{
              label: 'New Request',
              onClick: () => setShowRequestModal(true),
            }}
          />
        </Card>
      )}

      {/* Maintenance Request Modal */}
      <MaintenanceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
}
