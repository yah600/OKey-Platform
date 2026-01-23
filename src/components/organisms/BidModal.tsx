import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Calendar, FileText, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBidsStore } from '../../store/bidsStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { toast } from 'sonner';

const bidSchema = z.object({
  amount: z.string()
    .min(1, 'Bid amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be a valid number'),
  moveInDate: z.string().min(1, 'Move-in date is required'),
  leaseTerm: z.string()
    .min(1, 'Lease term is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 6, 'Minimum 6 months'),
  message: z.string().optional(),
});

type BidFormData = z.infer<typeof bidSchema>;

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: {
    id: string;
    propertyId: string;
    number: string;
    propertyName: string;
    address: string;
    rent: number;
    availableDate: string;
    okeyScoreRequired: number;
  };
}

export default function BidModal({ isOpen, onClose, unit }: BidModalProps) {
  const { user } = useAuthStore();
  const { addBid } = useBidsStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<BidFormData>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: unit.rent.toString(),
      leaseTerm: '12',
    },
  });

  const bidAmount = watch('amount');
  const leaseTerm = watch('leaseTerm');

  const onSubmit = async (data: BidFormData) => {
    if (!user) return;

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      addBid({
        unitId: unit.id,
        propertyId: unit.propertyId,
        userId: user.id,
        amount: Number(data.amount),
        moveInDate: data.moveInDate,
        leaseTerm: Number(data.leaseTerm),
        message: data.message,
        unitDetails: {
          number: unit.number,
          propertyName: unit.propertyName,
          address: unit.address,
          rent: unit.rent,
        },
      });

      toast.success('Bid Placed Successfully!', {
        description: `Your bid of $${data.amount}/month has been submitted for Unit ${unit.number}.`,
      });

      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to place bid', {
        description: 'Please try again or contact support.',
      });
    }
  };

  if (!isOpen) return null;

  const bidAboveMinimum = Number(bidAmount) >= unit.rent;
  const totalCost = Number(bidAmount) * Number(leaseTerm || 1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="glass-card relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                Place Your Bid
              </h2>
              <p className="text-sm text-neutral-600">
                Unit {unit.number} • {unit.propertyName}
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
            {/* Bid Amount */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Monthly Rent Bid <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register('amount')}
                  type="number"
                  step="50"
                  placeholder={unit.rent.toString()}
                  className={`w-full pl-10 pr-4 py-3 text-lg font-medium rounded-lg border ${
                    errors.amount
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-neutral-600">Minimum rent: ${unit.rent}/month</span>
                {bidAboveMinimum ? (
                  <span className="text-green-600 font-medium">
                    ✓ Above minimum
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">
                    Bid must meet or exceed minimum
                  </span>
                )}
              </div>
            </div>

            {/* Move-in Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Preferred Move-In Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register('moveInDate')}
                  type="date"
                  min={unit.availableDate}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.moveInDate
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
              </div>
              {errors.moveInDate && (
                <p className="mt-1 text-sm text-red-600">{errors.moveInDate.message}</p>
              )}
              <p className="mt-1 text-xs text-neutral-500">
                Available from {new Date(unit.availableDate).toLocaleDateString()}
              </p>
            </div>

            {/* Lease Term */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Lease Term (months) <span className="text-red-500">*</span>
              </label>
              <select
                {...register('leaseTerm')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.leaseTerm
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                } focus:outline-none focus:ring-2 transition-colors`}
              >
                <option value="6">6 months</option>
                <option value="12">12 months (Standard)</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
              </select>
              {errors.leaseTerm && (
                <p className="mt-1 text-sm text-red-600">{errors.leaseTerm.message}</p>
              )}
            </div>

            {/* Message to Owner */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Message to Property Owner (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Introduce yourself and explain why you'd be a great tenant..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors resize-none"
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                A personal message can help your bid stand out
              </p>
            </div>

            {/* Bid Summary */}
            <div className="p-4 bg-neutral-50 rounded-lg space-y-2">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Bid Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Monthly rent:</span>
                <span className="font-medium text-neutral-900">${bidAmount || 0}/month</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Lease term:</span>
                <span className="font-medium text-neutral-900">{leaseTerm || 0} months</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-neutral-200">
                <span className="text-neutral-900 font-medium">Total commitment:</span>
                <span className="font-semibold text-neutral-900">${totalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* O'Key Score Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>O'Key Score Required:</strong> {unit.okeyScoreRequired}+
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Your O'Key Score and rental history will be reviewed alongside your bid.
              </p>
            </div>

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
                disabled={!bidAboveMinimum}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Bid'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
