import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, CreditCard, X, Calendar, Building2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usePaymentsStore, type ScheduledPayment } from '../../store/paymentsStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { toast } from 'sonner';

const paymentSchema = z.object({
  paymentMethodId: z.string().min(1, 'Please select a payment method'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledPayment: ScheduledPayment;
}

export default function PaymentModal({ isOpen, onClose, scheduledPayment }: PaymentModalProps) {
  const { user } = useAuthStore();
  const { makePayment, paymentMethods, getDefaultPaymentMethod } = usePaymentsStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const defaultMethod = getDefaultPaymentMethod();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethodId: defaultMethod?.id || '',
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    if (!user) return;

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      makePayment(scheduledPayment.id, data.paymentMethodId);

      // Generate confirmation number
      const confNum = `CONF-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      setConfirmationNumber(confNum);

      setShowSuccess(true);

      toast.success('Payment Successful!', {
        description: `Your rent payment of $${scheduledPayment.amount} has been processed.`,
      });

      setTimeout(() => {
        setShowSuccess(false);
        reset();
        onClose();
      }, 3000);
    } catch (error) {
      toast.error('Payment Failed', {
        description: 'Please try again or contact support.',
      });
    }
  };

  if (!isOpen) return null;

  const selectedMethod = paymentMethods.find((pm) => pm.id === defaultMethod?.id);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <Card className="glass-card relative">
          {showSuccess ? (
            // Success State
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Payment Successful!</h2>
              <p className="text-sm text-neutral-600 mb-4">
                Your rent payment has been processed successfully.
              </p>
              <div className="p-4 bg-neutral-50 rounded-lg mb-4">
                <p className="text-xs text-neutral-600 mb-1">Confirmation Number</p>
                <p className="text-lg font-mono font-semibold text-neutral-900">{confirmationNumber}</p>
              </div>
              <p className="text-xs text-neutral-500">
                A receipt has been sent to your email.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                    Make Payment
                  </h2>
                  <p className="text-sm text-neutral-600">
                    {scheduledPayment.month} Rent
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Payment Details */}
              <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {scheduledPayment.propertyName}
                    </p>
                    <p className="text-xs text-neutral-600">Unit {scheduledPayment.unitNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-neutral-600">Due Date</p>
                    <div className="flex items-center gap-1 text-neutral-900 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(scheduledPayment.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600">Amount</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      ${scheduledPayment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Payment Method <span className="text-red-500">*</span>
                  </label>

                  {paymentMethods.length > 0 ? (
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedMethod?.id === method.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <input
                            {...register('paymentMethodId')}
                            type="radio"
                            value={method.id}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                          />
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-neutral-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                {method.type === 'card' ? method.brand : method.bankName} •••• {method.last4}
                              </p>
                              {method.type === 'card' && method.expiryMonth && method.expiryYear && (
                                <p className="text-xs text-neutral-600">
                                  Expires {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                                </p>
                              )}
                              {method.isDefault && (
                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-neutral-50 rounded-lg">
                      <CreditCard className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600 mb-1">No payment methods saved</p>
                      <p className="text-xs text-neutral-500">Add a card or bank account to continue</p>
                    </div>
                  )}

                  {errors.paymentMethodId && (
                    <p className="mt-1 text-sm text-red-600">{errors.paymentMethodId.message}</p>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => {
                      toast.info('Payment Method Management', {
                        description: 'Add/edit payment methods feature coming soon.',
                      });
                    }}
                  >
                    + Add New Payment Method
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                    This is a simulated payment - no real charges will be made.
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
                    disabled={paymentMethods.length === 0}
                  >
                    {isSubmitting ? 'Processing...' : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        Pay ${scheduledPayment.amount.toLocaleString()}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
