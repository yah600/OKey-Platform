import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';
import { toast } from 'sonner';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
}

const propertySchema = z.object({
  name: z.string().min(2, 'Property name must be at least 2 characters'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().length(2, 'Province must be 2 characters (e.g., QC, ON)'),
  postalCode: z.string().regex(/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/, 'Invalid postal code format (e.g., H3A 1B2)'),
  type: z.enum(['residential', 'commercial', 'mixed']),
  yearBuilt: z.coerce.number().min(1800, 'Invalid year').max(new Date().getFullYear(), 'Year cannot be in the future'),
  totalUnits: z.coerce.number().min(1, 'Must have at least 1 unit'),
  monthlyRevenue: z.coerce.number().min(0, 'Revenue cannot be negative'),
  expenses: z.coerce.number().min(0, 'Expenses cannot be negative'),
  amenities: z.string().optional(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function AddPropertyModal({ isOpen, onClose, ownerId }: AddPropertyModalProps) {
  const { addProperty } = useOwnerPropertiesStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'residential',
      province: 'QC',
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    const amenitiesArray = data.amenities
      ? data.amenities.split(',').map((a) => a.trim()).filter((a) => a.length > 0)
      : [];

    const netIncome = data.monthlyRevenue - data.expenses;

    addProperty({
      ownerId,
      name: data.name,
      address: {
        street: data.street,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode.toUpperCase(),
      },
      type: data.type,
      yearBuilt: data.yearBuilt,
      totalUnits: data.totalUnits,
      occupiedUnits: 0,
      availableUnits: data.totalUnits,
      monthlyRevenue: data.monthlyRevenue,
      expenses: data.expenses,
      netIncome,
      imageUrl: data.imageUrl || undefined,
      amenities: amenitiesArray,
    });

    toast.success('Property Added', {
      description: `${data.name} has been added to your portfolio.`,
    });

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Add New Property</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
            <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
              {/* Property Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Sunset Apartments"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Address Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-900">Address</h3>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('street')}
                    id="street"
                    type="text"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 123 Main St"
                  />
                  {errors.street && (
                    <p className="text-xs text-red-600 mt-1">{errors.street.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('city')}
                      id="city"
                      type="text"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Montreal"
                    />
                    {errors.city && (
                      <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-neutral-700 mb-1">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('province')}
                      id="province"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="QC">Quebec</option>
                      <option value="ON">Ontario</option>
                      <option value="BC">British Columbia</option>
                      <option value="AB">Alberta</option>
                      <option value="MB">Manitoba</option>
                      <option value="SK">Saskatchewan</option>
                      <option value="NS">Nova Scotia</option>
                      <option value="NB">New Brunswick</option>
                      <option value="PE">Prince Edward Island</option>
                      <option value="NL">Newfoundland and Labrador</option>
                    </select>
                    {errors.province && (
                      <p className="text-xs text-red-600 mt-1">{errors.province.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('postalCode')}
                    id="postalCode"
                    type="text"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., H3A 1B2"
                  />
                  {errors.postalCode && (
                    <p className="text-xs text-red-600 mt-1">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-900">Property Details</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
                      Property Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('type')}
                      id="type"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="mixed">Mixed</option>
                    </select>
                    {errors.type && (
                      <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="yearBuilt" className="block text-sm font-medium text-neutral-700 mb-1">
                      Year Built <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('yearBuilt')}
                      id="yearBuilt"
                      type="number"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 2020"
                    />
                    {errors.yearBuilt && (
                      <p className="text-xs text-red-600 mt-1">{errors.yearBuilt.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="totalUnits" className="block text-sm font-medium text-neutral-700 mb-1">
                    Total Units <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('totalUnits')}
                    id="totalUnits"
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 12"
                  />
                  {errors.totalUnits && (
                    <p className="text-xs text-red-600 mt-1">{errors.totalUnits.message}</p>
                  )}
                </div>
              </div>

              {/* Financials */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-900">Financials</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-neutral-700 mb-1">
                      Monthly Revenue <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
                      <input
                        {...register('monthlyRevenue')}
                        id="monthlyRevenue"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.monthlyRevenue && (
                      <p className="text-xs text-red-600 mt-1">{errors.monthlyRevenue.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="expenses" className="block text-sm font-medium text-neutral-700 mb-1">
                      Monthly Expenses <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
                      <input
                        {...register('expenses')}
                        id="expenses"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.expenses && (
                      <p className="text-xs text-red-600 mt-1">{errors.expenses.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-900">Additional Information (Optional)</h3>

                <div>
                  <label htmlFor="amenities" className="block text-sm font-medium text-neutral-700 mb-1">
                    Amenities
                  </label>
                  <input
                    {...register('amenities')}
                    id="amenities"
                    type="text"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Parking, Gym, Pool (comma-separated)"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Separate multiple amenities with commas</p>
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700 mb-1">
                    Image URL
                  </label>
                  <input
                    {...register('imageUrl')}
                    id="imageUrl"
                    type="url"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imageUrl && (
                    <p className="text-xs text-red-600 mt-1">{errors.imageUrl.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-neutral-200">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Property'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
