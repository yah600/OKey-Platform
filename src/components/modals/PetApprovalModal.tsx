import { useState } from 'react';
import { X, PawPrint, Upload } from 'lucide-react';
import Modal from '@/components/organisms/Modal';
import Button from '@/components/ui/Button';

interface PetApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PetApprovalModal({ isOpen, onClose }: PetApprovalModalProps) {
  const [formData, setFormData] = useState({
    petType: 'dog',
    petName: '',
    breed: '',
    weight: '',
    age: '',
    vaccinated: false,
    spayedNeutered: false,
    additionalPets: '',
    veterinarianName: '',
    veterinarianPhone: '',
    emergencyContact: '',
    emergencyContactPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would call adminRequestsStore.submitPetApproval(formData)
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PawPrint className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-neutral-900">Pet Approval Request</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pet Policy Notice */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-1">Pet Policy</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Maximum 2 pets per unit</li>
              <li>• Pet deposit: $500 (refundable)</li>
              <li>• Monthly pet rent: $50 per pet</li>
              <li>• Weight limit: 50 lbs for dogs</li>
              <li>• Restricted breeds: Pit Bull, Rottweiler, Doberman</li>
            </ul>
          </div>

          {/* Pet Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Pet Type *
            </label>
            <select
              value={formData.petType}
              onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="fish">Fish</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Pet Name *
              </label>
              <input
                type="text"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Breed *
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Weight (lbs) *
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Age (years) *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="vaccinated"
                checked={formData.vaccinated}
                onChange={(e) => setFormData({ ...formData, vaccinated: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="vaccinated" className="text-sm text-neutral-700">
                Up to date on all vaccinations *
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="spayedNeutered"
                checked={formData.spayedNeutered}
                onChange={(e) => setFormData({ ...formData, spayedNeutered: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="spayedNeutered" className="text-sm text-neutral-700">
                Spayed/Neutered
              </label>
            </div>
          </div>

          {/* Veterinarian Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Veterinarian Name *
              </label>
              <input
                type="text"
                value={formData.veterinarianName}
                onChange={(e) => setFormData({ ...formData, veterinarianName: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Veterinarian Phone *
              </label>
              <input
                type="tel"
                value={formData.veterinarianPhone}
                onChange={(e) => setFormData({ ...formData, veterinarianPhone: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Emergency Contact Name *
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="If you're unavailable to care for pet"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Emergency Contact Phone *
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Pet Photo
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-600 mb-1">Upload a photo of your pet</p>
              <p className="text-xs text-neutral-500">JPG, PNG up to 5MB</p>
              <input type="file" accept="image/*" className="hidden" id="petPhoto" />
              <label htmlFor="petPhoto">
                <Button type="button" variant="ghost" size="sm" className="mt-3">
                  Choose File
                </Button>
              </label>
            </div>
          </div>

          {/* Additional Pets */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Other Pets in Unit (Optional)
            </label>
            <textarea
              value={formData.additionalPets}
              onChange={(e) => setFormData({ ...formData, additionalPets: e.target.value })}
              rows={2}
              placeholder="List any other pets already approved..."
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
