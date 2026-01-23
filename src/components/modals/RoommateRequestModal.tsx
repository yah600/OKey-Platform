import { useState } from 'react';
import { X, UserPlus, UserMinus } from 'lucide-react';
import Modal from '@/components/organisms/Modal';
import Button from '@/components/ui/Button';

interface RoommateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoommateRequestModal({ isOpen, onClose }: RoommateRequestModalProps) {
  const [requestType, setRequestType] = useState<'add' | 'remove'>('add');
  const [formData, setFormData] = useState({
    // Add roommate
    newRoommateName: '',
    newRoommateEmail: '',
    newRoommatePhone: '',
    relationshipToTenant: '',
    // Remove roommate
    roommateToRemove: '',
    removalReason: '',
    // Common
    requestNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would call adminRequestsStore.submitRoommateRequest(requestType, formData)
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900">Roommate Request</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Request Type Selector */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRequestType('add')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              requestType === 'add'
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <UserPlus className={`w-8 h-8 mx-auto mb-2 ${requestType === 'add' ? 'text-primary-600' : 'text-neutral-600'}`} />
            <p className={`text-sm font-medium ${requestType === 'add' ? 'text-primary-900' : 'text-neutral-900'}`}>
              Add Roommate
            </p>
          </button>
          <button
            type="button"
            onClick={() => setRequestType('remove')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              requestType === 'remove'
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <UserMinus className={`w-8 h-8 mx-auto mb-2 ${requestType === 'remove' ? 'text-primary-600' : 'text-neutral-600'}`} />
            <p className={`text-sm font-medium ${requestType === 'remove' ? 'text-primary-900' : 'text-neutral-900'}`}>
              Remove Roommate
            </p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {requestType === 'add' ? (
            <>
              {/* Add Roommate Fields */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  New Roommate Full Name *
                </label>
                <input
                  type="text"
                  value={formData.newRoommateName}
                  onChange={(e) => setFormData({ ...formData, newRoommateName: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.newRoommateEmail}
                  onChange={(e) => setFormData({ ...formData, newRoommateEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.newRoommatePhone}
                  onChange={(e) => setFormData({ ...formData, newRoommatePhone: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Relationship to You *
                </label>
                <select
                  value={formData.relationshipToTenant}
                  onChange={(e) => setFormData({ ...formData, relationshipToTenant: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse/Partner</option>
                  <option value="family">Family Member</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  The new roommate will need to complete a background check and sign the lease addendum. We'll send them an email with instructions.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Remove Roommate Fields */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Roommate to Remove *
                </label>
                <select
                  value={formData.roommateToRemove}
                  onChange={(e) => setFormData({ ...formData, roommateToRemove: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select roommate</option>
                  <option value="rm-1">Jane Smith</option>
                  <option value="rm-2">Mike Johnson</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Reason for Removal *
                </label>
                <textarea
                  value={formData.removalReason}
                  onChange={(e) => setFormData({ ...formData, removalReason: e.target.value })}
                  rows={4}
                  placeholder="Please explain why this roommate is being removed..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-900">
                  Removing a roommate may require lease modification and approval from management. This process typically takes 5-7 business days.
                </p>
              </div>
            </>
          )}

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.requestNotes}
              onChange={(e) => setFormData({ ...formData, requestNotes: e.target.value })}
              rows={3}
              placeholder="Any additional information..."
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
