import { useState } from 'react';
import { X, AlertTriangle, Upload } from 'lucide-react';
import Modal from '@/components/organisms/Modal';
import Button from '@/components/ui/Button';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncidentReportModal({ isOpen, onClose }: IncidentReportModalProps) {
  const [formData, setFormData] = useState({
    incidentType: '',
    dateOccurred: '',
    timeOccurred: '',
    location: '',
    description: '',
    injuries: false,
    injuryDetails: '',
    witnessName: '',
    witnessContact: '',
    policeReportFiled: false,
    policeReportNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would call adminRequestsStore.submitIncidentReport(formData)
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-semibold text-neutral-900">Incident Report</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Emergency Notice */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900 mb-1">Emergency Situations</p>
              <p className="text-xs text-red-700">
                For immediate emergencies (fire, medical, break-in), call 911 first, then contact property management at (555) 123-4567.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Incident Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Incident Type *
            </label>
            <select
              value={formData.incidentType}
              onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select incident type</option>
              <option value="property_damage">Property Damage</option>
              <option value="theft">Theft/Break-in</option>
              <option value="personal_injury">Personal Injury</option>
              <option value="fire">Fire/Smoke</option>
              <option value="water_damage">Water Damage/Flood</option>
              <option value="noise_complaint">Noise Complaint</option>
              <option value="safety_hazard">Safety Hazard</option>
              <option value="vandalism">Vandalism</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date Occurred *
              </label>
              <input
                type="date"
                value={formData.dateOccurred}
                onChange={(e) => setFormData({ ...formData, dateOccurred: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Time Occurred *
              </label>
              <input
                type="time"
                value={formData.timeOccurred}
                onChange={(e) => setFormData({ ...formData, timeOccurred: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Specific Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Unit 4B - Living Room, Parking Lot Level 2, Main Hallway"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              placeholder="Please provide as much detail as possible about what happened..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Injuries */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                id="injuries"
                checked={formData.injuries}
                onChange={(e) => setFormData({ ...formData, injuries: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="injuries" className="text-sm font-medium text-neutral-700">
                Were there any injuries?
              </label>
            </div>
            {formData.injuries && (
              <textarea
                value={formData.injuryDetails}
                onChange={(e) => setFormData({ ...formData, injuryDetails: e.target.value })}
                rows={3}
                placeholder="Describe the injuries and medical attention received..."
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            )}
          </div>

          {/* Witness Information */}
          <div>
            <h3 className="text-sm font-medium text-neutral-900 mb-3">Witness Information (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Witness Name
                </label>
                <input
                  type="text"
                  value={formData.witnessName}
                  onChange={(e) => setFormData({ ...formData, witnessName: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Witness Contact
                </label>
                <input
                  type="text"
                  value={formData.witnessContact}
                  onChange={(e) => setFormData({ ...formData, witnessContact: e.target.value })}
                  placeholder="Phone or email"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Police Report */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                id="policeReportFiled"
                checked={formData.policeReportFiled}
                onChange={(e) => setFormData({ ...formData, policeReportFiled: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="policeReportFiled" className="text-sm font-medium text-neutral-700">
                Police report filed?
              </label>
            </div>
            {formData.policeReportFiled && (
              <input
                type="text"
                value={formData.policeReportNumber}
                onChange={(e) => setFormData({ ...formData, policeReportNumber: e.target.value })}
                placeholder="Police report number"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Photos/Evidence
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-600 mb-1">Upload photos or documents</p>
              <p className="text-xs text-neutral-500">Multiple files allowed, up to 10MB each</p>
              <input type="file" accept="image/*,.pdf" multiple className="hidden" id="incidentPhotos" />
              <label htmlFor="incidentPhotos">
                <Button type="button" variant="ghost" size="sm" className="mt-3">
                  Choose Files
                </Button>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
