import { useState } from 'react';
import { X, CreditCard, Building2, Smartphone } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/molecules/Select';
import Modal from '@/components/organisms/Modal';
import { usePaymentsStore } from '@/store/paymentsStore';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  method?: any; // For editing existing method
}

export function PaymentMethodModal({ isOpen, onClose, method }: PaymentMethodModalProps) {
  const { addPaymentMethod, updatePaymentMethod } = usePaymentsStore();
  const [formData, setFormData] = useState({
    type: method?.type || 'card',
    cardNumber: method?.last4 ? `****${method.last4}` : '',
    expiryMonth: method?.expiryMonth || '',
    expiryYear: method?.expiryYear || '',
    cvv: '',
    nameOnCard: method?.nameOnCard || '',
    bankName: method?.bankName || '',
    accountNumber: method?.accountNumber || '',
    routingNumber: method?.routingNumber || '',
    phoneNumber: method?.phoneNumber || '',
    isDefault: method?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentMethod = {
      id: method?.id || `pm_${Date.now()}`,
      type: formData.type,
      ...(formData.type === 'card' && {
        last4: formData.cardNumber.slice(-4),
        brand: 'Visa', // Would detect from card number
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        nameOnCard: formData.nameOnCard,
      }),
      ...(formData.type === 'bank' && {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
      }),
      ...(formData.type === 'interac' && {
        phoneNumber: formData.phoneNumber,
      }),
      isDefault: formData.isDefault,
    };

    if (method) {
      updatePaymentMethod(paymentMethod);
    } else {
      addPaymentMethod(paymentMethod);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            {method ? 'Edit Payment Method' : 'Add Payment Method'}
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Type Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Payment Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'card' })}
                className={`p-4 border-2 rounded-lg text-center ${
                  formData.type === 'card'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <CreditCard className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Card</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'bank' })}
                className={`p-4 border-2 rounded-lg text-center ${
                  formData.type === 'bank'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <Building2 className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">ACH</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'interac' })}
                className={`p-4 border-2 rounded-lg text-center ${
                  formData.type === 'interac'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <Smartphone className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Interac</span>
              </button>
            </div>
          </div>

          {/* Credit Card Fields */}
          {formData.type === 'card' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Card Number
                </label>
                <Input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Expiry Month
                  </label>
                  <Select
                    value={formData.expiryMonth}
                    onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                    required
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Expiry Year
                  </label>
                  <Select
                    value={formData.expiryYear}
                    onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={2026 + i}>
                        {2026 + i}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Name on Card
                </label>
                <Input
                  type="text"
                  value={formData.nameOnCard}
                  onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
            </>
          )}

          {/* Bank Account Fields */}
          {formData.type === 'bank' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Bank Name
                </label>
                <Input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Wells Fargo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Account Number
                </label>
                <Input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="123456789"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Routing Number
                </label>
                <Input
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  placeholder="021000021"
                  required
                />
              </div>
            </>
          )}

          {/* Interac Fields */}
          {formData.type === 'interac' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Phone Number
              </label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          )}

          {/* Default Method Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-neutral-700">
              Set as default payment method
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {method ? 'Update' : 'Add'} Payment Method
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
