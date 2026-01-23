import { useState, useEffect } from 'react';
import { Plus, Wrench, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/organisms/EmptyState';
import MaintenanceRequestModal from '../../components/organisms/MaintenanceRequestModal';
import { useAuthStore } from '../../store/authStore';
import { useMaintenanceStore } from '../../store/maintenanceStore';

export function TenantMaintenancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuthStore();
  const { getRequestsByTenant } = useMaintenanceStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const requests = user ? getRequestsByTenant(user.id) : [];

  const tabs = [
    { id: 'all', label: 'All', count: requests.length },
    { id: 'pending', label: 'Pending', count: requests.filter((r) => r.status === 'pending').length },
    {
      id: 'in-progress',
      label: 'In Progress',
      count: requests.filter((r) => r.status === 'in-progress').length,
    },
    { id: 'completed', label: 'Completed', count: requests.filter((r) => r.status === 'completed').length },
  ];

  const filteredRequests = requests.filter((request) => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="default">
            <Wrench className="w-3 h-3" />
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="error">Urgent</Badge>;
      case 'high':
        return <Badge variant="error">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="default">Low</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Maintenance Requests</h1>
              <p className="text-sm text-neutral-600">Submit and track your maintenance requests</p>
            </div>
            <Button variant="primary" onClick={() => setShowRequestModal(true)}>
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Total Requests</p>
              <p className="text-3xl font-semibold text-neutral-900">{requests.length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Pending</p>
              <p className="text-3xl font-semibold text-amber-600">
                {requests.filter((r) => r.status === 'pending').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">In Progress</p>
              <p className="text-3xl font-semibold text-blue-600">
                {requests.filter((r) => r.status === 'in-progress').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Completed</p>
              <p className="text-3xl font-semibold text-green-600">
                {requests.filter((r) => r.status === 'completed').length}
              </p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} showCount />

        {/* Requests List */}
        <div className="mt-6">
          {filteredRequests.length === 0 ? (
            <Card>
              <EmptyState
                icon={Wrench}
                title="No maintenance requests"
                description="Create a new request to report any maintenance issues."
                action={{
                  label: 'New Request',
                  onClick: () => setShowRequestModal(true),
                }}
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:border-neutral-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        request.priority === 'urgent' || request.priority === 'high'
                          ? 'bg-red-100'
                          : request.priority === 'medium'
                          ? 'bg-amber-100'
                          : 'bg-neutral-100'
                      }`}
                    >
                      <Wrench
                        className={`w-6 h-6 ${
                          request.priority === 'urgent' || request.priority === 'high'
                            ? 'text-red-600'
                            : request.priority === 'medium'
                            ? 'text-amber-600'
                            : 'text-neutral-600'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-900 mb-1">{request.title}</h3>
                          <p className="text-sm text-neutral-600 mb-2">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(request.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span>#{request.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getPriorityBadge(request.priority)}
                          {getStatusBadge(request.status)}
                        </div>
                      </div>

                      {request.assignedTo && (
                        <div className="mt-3 pt-3 border-t border-neutral-100">
                          <p className="text-xs text-neutral-600">
                            Assigned to: <span className="font-medium text-neutral-900">{request.assignedTo}</span>
                          </p>
                          {request.completedAt && (
                            <p className="text-xs text-neutral-600 mt-1">
                              Completed:{' '}
                              {new Date(request.completedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* New Request Modal */}
        <MaintenanceRequestModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
        />
      </div>
    </div>
  );
}
