import { useState, useEffect } from 'react';
import { Wrench, Filter, User, Clock, Building2, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import Modal from '../../components/organisms/Modal';
import Select from '../../components/molecules/Select';
import Textarea from '../../components/atoms/Textarea';
import { useAuthStore } from '../../store/authStore';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';
import { useMaintenanceStore, type MaintenanceRequest } from '../../store/maintenanceStore';
import { toast } from 'sonner';

type FilterStatus = 'all' | 'pending' | 'in_progress' | 'completed';

export default function OwnerMaintenancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [notes, setNotes] = useState('');
  const { user } = useAuthStore();
  const { getPropertiesByOwner } = useOwnerPropertiesStore();
  const { requests: allMaintenanceRequests, updateRequest } = useMaintenanceStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRequestClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setNewAssignee(request.assignedTo || '');
    setNotes('');
    setShowRequestModal(true);
  };

  const handleUpdateRequest = () => {
    if (!selectedRequest) return;

    const updates: Partial<MaintenanceRequest> = {};

    if (newStatus !== selectedRequest.status) {
      updates.status = newStatus as 'pending' | 'in_progress' | 'completed';
    }

    if (newAssignee !== selectedRequest.assignedTo) {
      updates.assignedTo = newAssignee;
    }

    if (Object.keys(updates).length > 0) {
      updateRequest(selectedRequest.id, updates);

      toast.success('Request Updated', {
        description: `Maintenance request has been updated successfully.`,
      });
    }

    if (notes.trim()) {
      toast.info('Note Added', {
        description: 'Note saved (in production, this would be stored with the request).',
      });
    }

    setShowRequestModal(false);
    setSelectedRequest(null);
  };

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
              <Card
                key={request.id}
                className="hover:border-neutral-300 transition-colors cursor-pointer"
                onClick={() => handleRequestClick(request)}
              >
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

      {/* Request Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={showRequestModal}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedRequest(null);
          }}
          title="Maintenance Request Details"
          description={`Request #${selectedRequest.id.slice(0, 8).toUpperCase()}`}
          size="lg"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedRequest(null);
                }}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdateRequest}>
                Update Request
              </Button>
            </>
          }
        >
          <div className="space-y-6">
            {/* Request Details */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Request Information
              </h3>
              <div className="bg-neutral-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Property:</span>
                  <span className="font-medium text-neutral-900">{selectedRequest.propertyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Unit:</span>
                  <span className="font-medium text-neutral-900">{selectedRequest.unitNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Title:</span>
                  <span className="font-medium text-neutral-900">{selectedRequest.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Description:</span>
                  <span className="font-medium text-neutral-900">{selectedRequest.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Priority:</span>
                  <span className="font-medium text-neutral-900 capitalize">{selectedRequest.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Submitted:</span>
                  <span className="font-medium text-neutral-900">
                    {new Date(selectedRequest.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <Select
                label="Status"
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ]}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </div>

            {/* Assign To */}
            <div>
              <Select
                label="Assign To"
                options={[
                  { value: '', label: 'Unassigned' },
                  { value: 'Internal Maintenance Team', label: 'Internal Maintenance Team' },
                  { value: 'ABC Plumbing', label: 'ABC Plumbing' },
                  { value: 'Elite HVAC Solutions', label: 'Elite HVAC Solutions' },
                  { value: 'QuickFix Repairs', label: 'QuickFix Repairs' },
                ]}
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
              />
            </div>

            {/* Add Notes */}
            <div>
              <Textarea
                label="Add Notes"
                placeholder="Add any notes or updates about this request..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
