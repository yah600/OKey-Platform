import { useState } from 'react';
import { FileText, Home, Users, PawPrint, AlertTriangle, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { LeaseRenewalModal } from '@/components/modals/LeaseRenewalModal';
import { MoveOutModal } from '@/components/modals/MoveOutModal';
import { RoommateRequestModal } from '@/components/modals/RoommateRequestModal';
import { PetApprovalModal } from '@/components/modals/PetApprovalModal';
import { IncidentReportModal } from '@/components/modals/IncidentReportModal';

interface AdminRequest {
  id: string;
  type: 'lease_renewal' | 'move_out' | 'roommate' | 'pet' | 'incident' | 'transfer';
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  submittedAt: string;
  updatedAt?: string;
  notes?: string;
}

export default function AdminRequests() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [requests] = useState<AdminRequest[]>([
    {
      id: 'req-1',
      type: 'lease_renewal',
      title: 'Lease Renewal Request - 12 Months',
      status: 'pending',
      submittedAt: '2026-01-20T10:00:00Z',
    },
    {
      id: 'req-2',
      type: 'pet',
      title: 'Pet Approval - Golden Retriever',
      status: 'approved',
      submittedAt: '2026-01-15T14:30:00Z',
      updatedAt: '2026-01-18T09:00:00Z',
      notes: 'Approved. Pet deposit of $500 paid.',
    },
  ]);

  const requestTypes = [
    {
      id: 'lease_renewal',
      icon: FileText,
      title: 'Lease Renewal',
      description: 'Request to renew your lease',
      color: 'blue',
    },
    {
      id: 'move_out',
      icon: Home,
      title: 'Move Out Notice',
      description: 'Submit your notice to vacate',
      color: 'orange',
    },
    {
      id: 'roommate',
      icon: Users,
      title: 'Roommate Request',
      description: 'Add or remove a roommate',
      color: 'purple',
    },
    {
      id: 'pet',
      icon: PawPrint,
      title: 'Pet Approval',
      description: 'Request approval for a pet',
      color: 'green',
    },
    {
      id: 'incident',
      icon: AlertTriangle,
      title: 'Incident Report',
      description: 'Report an incident or concern',
      color: 'red',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lease_renewal': return FileText;
      case 'move_out': return Home;
      case 'roommate': return Users;
      case 'pet': return PawPrint;
      case 'incident': return AlertTriangle;
      default: return FileText;
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Admin Requests</h1>
        <p className="text-sm text-neutral-600">Submit and track administrative requests</p>
      </div>

      {/* Request Type Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Submit New Request</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {requestTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Card
                key={type.id}
                className="cursor-pointer hover:border-primary-600 transition-colors text-center"
                onClick={() => setActiveModal(type.id)}
              >
                <div className={`w-12 h-12 bg-${type.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className={`w-6 h-6 text-${type.color}-600`} />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1 text-sm">{type.title}</h3>
                <p className="text-xs text-neutral-600">{type.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Active Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">My Requests</h2>
          <span className="text-sm text-neutral-600">{requests.length} total</span>
        </div>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No requests submitted yet</p>
              </div>
            </Card>
          ) : (
            requests.map((request) => {
              const IconComponent = getTypeIcon(request.type);
              return (
                <Card key={request.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-neutral-900">{request.title}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Submitted {new Date(request.submittedAt).toLocaleDateString()}</span>
                        </div>
                        {request.updatedAt && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Clock className="w-4 h-4" />
                            <span>Updated {new Date(request.updatedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {request.notes && (
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">{request.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <Button variant="ghost" size="sm">
                        Cancel
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      <LeaseRenewalModal
        isOpen={activeModal === 'lease_renewal'}
        onClose={() => setActiveModal(null)}
      />
      <MoveOutModal
        isOpen={activeModal === 'move_out'}
        onClose={() => setActiveModal(null)}
      />
      <RoommateRequestModal
        isOpen={activeModal === 'roommate'}
        onClose={() => setActiveModal(null)}
      />
      <PetApprovalModal
        isOpen={activeModal === 'pet'}
        onClose={() => setActiveModal(null)}
      />
      <IncidentReportModal
        isOpen={activeModal === 'incident'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
