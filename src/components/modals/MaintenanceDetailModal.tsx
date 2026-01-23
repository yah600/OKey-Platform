import { X, Calendar, User, AlertCircle, CheckCircle, Clock, MessageSquare, Image as ImageIcon, DollarSign } from 'lucide-react';
import Modal from '@/components/organisms/Modal';
import Button from '@/components/ui/Button';
import { useState } from 'react';

interface MaintenanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
}

export function MaintenanceDetailModal({ isOpen, onClose, request }: MaintenanceDetailModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!request) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <AlertCircle className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'normal': return 'bg-blue-100 text-blue-700';
      case 'low': return 'bg-neutral-100 text-neutral-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const handleCancel = () => {
    // Would call maintenanceStore.cancelRequest(request.id)
    setShowCancelConfirm(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(request.status)}
              <h2 className="text-2xl font-semibold text-neutral-900">{request.title}</h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                {request.priority}
              </span>
              <span>ID: {request.id}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Created</span>
            </div>
            <p className="text-sm text-neutral-900">{new Date(request.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
              <User className="w-4 h-4" />
              <span className="font-medium">Assigned To</span>
            </div>
            <p className="text-sm text-neutral-900">{request.assignedTo || 'Not assigned'}</p>
          </div>
          {request.scheduledDate && (
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Scheduled</span>
              </div>
              <p className="text-sm text-neutral-900">{new Date(request.scheduledDate).toLocaleString()}</p>
            </div>
          )}
          {request.estimatedCost && (
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">Estimated Cost</span>
              </div>
              <p className="text-sm text-neutral-900">${request.estimatedCost}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Description</h3>
          <p className="text-sm text-neutral-600 whitespace-pre-wrap">{request.description}</p>
        </div>

        {/* Location */}
        {request.location && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-900 mb-2">Location</h3>
            <p className="text-sm text-neutral-600">{request.location}</p>
          </div>
        )}

        {/* Photos */}
        {request.photos && request.photos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-neutral-600" />
              <h3 className="text-sm font-medium text-neutral-900">Photos ({request.photos.length})</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {request.photos.map((photo: string, index: number) => (
                <div key={index} className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-neutral-600" />
            <h3 className="text-sm font-medium text-neutral-900">Activity Timeline</h3>
          </div>
          <div className="space-y-3">
            {request.activity?.map((item: any, index: number) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-600"></div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-900">{item.description}</p>
                  <p className="text-xs text-neutral-500">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )) || (
              <p className="text-sm text-neutral-500">No activity yet</p>
            )}
          </div>
        </div>

        {/* Technician Notes */}
        {request.technicianNotes && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-900">Technician Notes</h3>
            </div>
            <p className="text-sm text-blue-700">{request.technicianNotes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          {request.status === 'pending' && (
            <>
              {!showCancelConfirm ? (
                <Button variant="ghost" onClick={() => setShowCancelConfirm(true)} className="flex-1">
                  Cancel Request
                </Button>
              ) : (
                <div className="flex-1 flex gap-2">
                  <Button variant="ghost" onClick={() => setShowCancelConfirm(false)} className="flex-1">
                    Keep Request
                  </Button>
                  <Button variant="primary" onClick={handleCancel} className="flex-1 bg-red-600 hover:bg-red-700">
                    Confirm Cancel
                  </Button>
                </div>
              )}
            </>
          )}
          {request.status === 'completed' && request.allowRating && (
            <Button variant="primary" className="flex-1">
              Rate Service
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
