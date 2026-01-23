import { useState } from 'react';
import { X, Home, DollarSign, Calendar, Image as ImageIcon, Upload } from 'lucide-react';
import Modal from '@/components/organisms/Modal';
import Button from '@/components/ui/Button';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
}

export function ListingModal({ isOpen, onClose, unit }: ListingModalProps) {
  const [formData, setFormData] = useState({
    title: unit ? `${unit.propertyName} - Unit ${unit.unitNumber}` : '',
    description: '',
    rent: unit?.rent || '',
    availableFrom: unit?.availableFrom || '',
    bedrooms: unit?.bedrooms || 1,
    bathrooms: unit?.bathrooms || 1,
    sqft: '',
    amenities: [] as string[],
    petPolicy: 'no_pets',
    utilities: 'tenant_pays',
    parkingSpaces: 0,
    listOnZillow: true,
    listOnApartments: true,
    listOnWebsite: true,
  });

  const amenityOptions = [
    'In-unit laundry',
    'Dishwasher',
    'Air conditioning',
    'Hardwood floors',
    'Balcony/Patio',
    'Storage',
    'Gym access',
    'Pool access',
  ];

  const handleToggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would call listingStore.createListing(formData)
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-neutral-900">
              {unit ? 'Edit Listing' : 'Create Listing'}
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Listing Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Monthly Rent *
              </label>
              <input
                type="number"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Available From *
              </label>
              <input
                type="date"
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Square Feet
              </label>
              <input
                type="number"
                value={formData.sqft}
                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                placeholder="e.g., 850"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Parking Spaces
              </label>
              <input
                type="number"
                min="0"
                value={formData.parkingSpaces}
                onChange={(e) => setFormData({ ...formData, parkingSpaces: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe the unit, neighborhood, and any special features..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {amenityOptions.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 p-2 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleToggleAmenity(amenity)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-neutral-900">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Pet Policy *
              </label>
              <select
                value={formData.petPolicy}
                onChange={(e) => setFormData({ ...formData, petPolicy: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="no_pets">No Pets</option>
                <option value="cats_only">Cats Only</option>
                <option value="small_dogs">Small Dogs Only</option>
                <option value="pets_allowed">All Pets Allowed (with deposit)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Utilities *
              </label>
              <select
                value={formData.utilities}
                onChange={(e) => setFormData({ ...formData, utilities: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="tenant_pays">Tenant Pays All</option>
                <option value="some_included">Water/Trash Included</option>
                <option value="all_included">All Utilities Included</option>
              </select>
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Photos
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-600 mb-1">Upload unit photos</p>
              <p className="text-xs text-neutral-500">JPG, PNG up to 10MB each. Recommended: 8-12 photos</p>
              <input type="file" accept="image/*" multiple className="hidden" id="listing-photos" />
              <label htmlFor="listing-photos">
                <Button type="button" variant="ghost" size="sm" className="mt-3">
                  Choose Files
                </Button>
              </label>
            </div>
          </div>

          {/* Listing Platforms */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              List On
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.listOnWebsite}
                  onChange={(e) => setFormData({ ...formData, listOnWebsite: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-neutral-900">O'Key Platform Website</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.listOnZillow}
                  onChange={(e) => setFormData({ ...formData, listOnZillow: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-neutral-900">Zillow</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.listOnApartments}
                  onChange={(e) => setFormData({ ...formData, listOnApartments: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-neutral-900">Apartments.com</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {unit ? 'Update Listing' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
