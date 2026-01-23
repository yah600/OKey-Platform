import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wrench, X, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { toast } from 'sonner';

const maintenanceRequestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Please provide more details (at least 10 characters)').max(1000, 'Description too long'),
  location: z.string().min(2, 'Location is required'),
  category: z.enum(['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'emergency']),
});

type MaintenanceRequestFormData = z.infer<typeof maintenanceRequestSchema>;

interface MaintenanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MaintenanceRequestModal({ isOpen, onClose }: MaintenanceRequestModalProps) {
  const { user } = useAuthStore();
  const { addRequest } = useMaintenanceStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<MaintenanceRequestFormData>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      category: 'other',
      priority: 'medium',
    },
  });

  const priority = watch('priority');

  const onSubmit = async (data: MaintenanceRequestFormData) => {
    if (!user) return;

    try {
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In a real app, property and unit info would come from user's lease
      addRequest({
        userId: user.id,
        propertyId: 'prop-1',
        unitId: 'unit-1',
        propertyName: 'Sunset Apartments',
        unitNumber: '4B',
        title: data.title,
        description: data.description,
        location: data.location,
        category: data.category,
        priority: data.priority,
      });

      toast.success('Request Submitted!', {
        description: 'Your maintenance request has been submitted. You\'ll be notified of updates.',
      });

      reset();
      onClose();
    } catch (error) {
      toast.error('Submission Failed', {
        description: 'Please try again or contact support.',
      });
    }
  };

  if (!isOpen) return null;

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return { color: 'text-red-600', bg: 'bg-red-50', label: 'Emergency - Immediate response', icon: AlertTriangle };
      case 'high':
        return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'High - Within 24 hours', icon: AlertTriangle };
      case 'medium':
        return { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Medium - Within 3-5 days', icon: Wrench };
      case 'low':
        return { color: 'text-neutral-600', bg: 'bg-neutral-50', label: 'Low - Within 1-2 weeks', icon: Wrench };
      default:
        return { color: 'text-neutral-600', bg: 'bg-neutral-50', label: 'Medium', icon: Wrench };
    }
  };

  const priorityInfo = getPriorityInfo(priority);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="glass-card relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                New Maintenance Request
              </h2>
              <p className="text-sm text-neutral-600">
                Describe the issue and we'll get it resolved
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                type="text"
                placeholder="e.g., Leaking faucet in kitchen"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                } focus:outline-none focus:ring-2 transition-colors`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Category and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category')}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.category
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                  } focus:outline-none focus:ring-2 transition-colors`}
                >
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC / Heating / Cooling</option>
                  <option value="appliance">Appliance</option>
                  <option value="structural">Structural / Doors / Windows</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('location')}
                  type="text"
                  placeholder="e.g., Kitchen, Bathroom, Living Room"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.location
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Please describe the issue in detail. Include when it started, how often it occurs, and any other relevant information..."
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.description
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                } focus:outline-none focus:ring-2 transition-colors resize-none`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <select
                {...register('priority')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.priority
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                } focus:outline-none focus:ring-2 transition-colors`}
              >
                <option value="low">Low - Not urgent</option>
                <option value="medium">Medium - Normal timeline</option>
                <option value="high">High - Needs attention soon</option>
                <option value="emergency">Emergency - Immediate attention required</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
              )}

              {/* Priority Info */}
              <div className={`mt-2 p-3 ${priorityInfo.bg} rounded-lg flex items-center gap-2`}>
                <priorityInfo.icon className={`w-4 h-4 ${priorityInfo.color}`} />
                <p className={`text-xs ${priorityInfo.color} font-medium`}>
                  {priorityInfo.label}
                </p>
              </div>
            </div>

            {/* Photo Upload Placeholder */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center">
                <ImageIcon className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-600 mb-1">Add photos to help explain the issue</p>
                <p className="text-xs text-neutral-500">Photo upload functionality coming soon</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-3"
                  disabled
                >
                  Select Photos
                </Button>
              </div>
            </div>

            {/* Emergency Notice */}
            {priority === 'emergency' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 mb-1">
                      Emergency Request
                    </p>
                    <p className="text-xs text-red-700">
                      For life-threatening emergencies (fire, flood, gas leak), call 911 immediately.
                      For urgent property emergencies, contact the emergency line: (555) 123-4567
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
