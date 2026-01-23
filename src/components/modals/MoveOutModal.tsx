import { useState } from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';
import Modal from '@/components/organisms/Modal';
import Button from '@/components/ui/Button';

interface MoveOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoveOutModal({ isOpen, onClose }: MoveOutModalProps) {
  const [formData, setFormData] = useState({
    moveOutDate: '',
    forwardingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    reason: '',
    scheduleInspection: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would call adminRequestsStore.submitMoveOut(formData)
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900">Move Out Notice</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notice Period Warning */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 mb-1">Notice Period Required</p>
              <p className="text-xs text-yellow-700">
                Your lease requires 30 days notice before moving out. Please ensure your move-out date is at least 30 days from today.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Lease Info */}
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="text-sm font-medium text-neutral-900 mb-2">Current Lease</h3>
            <div className="space-y-1 text-sm text-neutral-600">
              <p>Unit: 4B - Sunset Apartments</p>
              <p>Lease End Date: March 31, 2026</p>
              <p>Notice Period: 30 days</p>
            </div>
          </div>

          {/* Move Out Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Intended Move Out Date *
            </label>
            <input
              type="date"
              value={formData.moveOutDate}
              onChange={(e) => setFormData({ ...formData, moveOutDate: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Forwarding Address */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Forwarding Address *
            </label>
            <input
              type="text"
              value={formData.forwardingAddress}
              onChange={(e) => setFormData({ ...formData, forwardingAddress: e.target.value })}
              placeholder="Street address"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <p className="text-xs text-neutral-500 mt-1">For security deposit return and final documents</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-neutral-700 mb-2">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-neutral-700 mb-2">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Zip *</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Reason for Moving (Optional)
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              placeholder="We'd love to know why you're leaving..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Schedule Inspection */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="scheduleInspection"
              checked={formData.scheduleInspection}
              onChange={(e) => setFormData({ ...formData, scheduleInspection: e.target.checked })}
              className="mt-1"
            />
            <label htmlFor="scheduleInspection" className="text-sm text-neutral-700">
              Schedule a pre-move-out inspection to identify any issues before final checkout
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Submit Notice
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
