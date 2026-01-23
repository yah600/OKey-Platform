import { useState } from 'react';
import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';
import Input from '@/components/atoms/Input';
import Select from '@/components/molecules/Select';
import Checkbox from '@/components/atoms/Checkbox';
import { cn } from '@/lib/utils';

/**
 * Step 4: Lease Terms
 */
export function Step4LeaseTerms() {
  const { lease, updateLease, nextStep, prevStep } = useLeaseBuilderStore();
  const [formData, setFormData] = useState({
    startDate: lease.terms?.startDate || '',
    duration: lease.terms?.duration || 12,
    rentAmount: lease.terms?.rentAmount || 0,
    rentDueDay: lease.terms?.rentDueDay || 1,
    securityDeposit: lease.terms?.securityDeposit || 0,
    firstMonthRent: lease.terms?.firstMonthRent || false,
    lastMonthRent: lease.terms?.lastMonthRent || false,
  });

  const isValid = formData.startDate && formData.rentAmount > 0 && formData.securityDeposit >= 0;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEndDate = () => {
    if (!formData.startDate) return '';
    const start = new Date(formData.startDate);
    start.setMonth(start.getMonth() + formData.duration);
    return start.toISOString().split('T')[0];
  };

  const handleContinue = () => {
    if (isValid) {
      updateLease({
        terms: {
          startDate: formData.startDate,
          endDate: calculateEndDate(),
          duration: formData.duration,
          rentAmount: formData.rentAmount,
          rentDueDay: formData.rentDueDay,
          paymentSchedule: 'monthly',
          securityDeposit: formData.securityDeposit,
          firstMonthRent: formData.firstMonthRent,
          lastMonthRent: formData.lastMonthRent,
        },
      });
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Lease Terms
        </h2>
        <p className="text-neutral-600">
          Set the rental terms and payment details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 mb-2">
            Start Date *
          </label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-neutral-700 mb-2">
            Duration (months) *
          </label>
          <Select
            value={formData.duration.toString()}
            onChange={(e) => handleChange('duration', parseInt(e.target.value))}
          >
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
          </Select>
        </div>

        <div>
          <label htmlFor="rentAmount" className="block text-sm font-medium text-neutral-700 mb-2">
            Monthly Rent *
          </label>
          <Input
            id="rentAmount"
            type="number"
            value={formData.rentAmount || ''}
            onChange={(e) => handleChange('rentAmount', parseFloat(e.target.value))}
            placeholder="1500"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="rentDueDay" className="block text-sm font-medium text-neutral-700 mb-2">
            Rent Due Day
          </label>
          <Select
            value={formData.rentDueDay.toString()}
            onChange={(e) => handleChange('rentDueDay', parseInt(e.target.value))}
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="securityDeposit" className="block text-sm font-medium text-neutral-700 mb-2">
            Security Deposit *
          </label>
          <Input
            id="securityDeposit"
            type="number"
            value={formData.securityDeposit || ''}
            onChange={(e) => handleChange('securityDeposit', parseFloat(e.target.value))}
            placeholder="1500"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Checkbox
          checked={formData.firstMonthRent}
          onChange={(checked) => handleChange('firstMonthRent', checked)}
          label="Require first month's rent upfront"
        />
        <Checkbox
          checked={formData.lastMonthRent}
          onChange={(checked) => handleChange('lastMonthRent', checked)}
          label="Require last month's rent upfront"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={prevStep}
          className="px-6 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={cn(
            'px-6 py-3 rounded-lg font-medium transition-all',
            isValid
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
