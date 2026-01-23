import { useState } from 'react';
import { X, Calendar, DollarSign } from 'lucide-react';
import Modal from '@/components/organisms/Modal';
import Button from '@/components/ui/Button';

interface LeaseRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaseRenewalModal({ isOpen, onClose }: LeaseRenewalModalProps) {
  const [formData, setFormData] = useState({
    renewalTerm: '12',
    proposedStartDate: '',
    requestedRent: '',
    additionalNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would call adminRequestsStore.submitLeaseRenewal(formData)
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900">Lease Renewal Request</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Lease Info */}
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="text-sm font-medium text-neutral-900 mb-2">Current Lease</h3>
            <div className="space-y-1 text-sm text-neutral-600">
              <p>Unit: 4B - Sunset Apartments</p>
              <p>Current Rent: $2,500/month</p>
              <p>Expires: March 31, 2026</p>
            </div>
          </div>

          {/* Renewal Term */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Renewal Term
            </label>
            <select
              value={formData.renewalTerm}
              onChange={(e) => setFormData({ ...formData, renewalTerm: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="18">18 Months</option>
              <option value="24">24 Months</option>
            </select>
          </div>

          {/* Proposed Start Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Proposed Start Date
            </label>
            <input
              type="date"
              value={formData.proposedStartDate}
              onChange={(e) => setFormData({ ...formData, proposedStartDate: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <p className="text-xs text-neutral-500 mt-1">Typically matches your current lease end date</p>
          </div>

          {/* Requested Rent */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Requested Monthly Rent (Optional)
            </label>
            <input
              type="number"
              value={formData.requestedRent}
              onChange={(e) => setFormData({ ...formData, requestedRent: e.target.value })}
              placeholder="Leave blank to keep current rate"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-neutral-500 mt-1">If you'd like to negotiate the renewal rate</p>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              rows={4}
              placeholder="Any additional information or requests..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
