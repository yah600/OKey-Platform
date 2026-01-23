import { useState, useEffect } from 'react';
import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';
import Input from '@/components/atoms/Input';
import { cn } from '@/lib/utils';

/**
 * Step 3: Tenant Information
 */
export function Step3TenantInformation() {
  const { lease, updateLease, nextStep, prevStep } = useLeaseBuilderStore();
  const [formData, setFormData] = useState({
    tenantName: lease.parties?.tenantName || '',
    tenantEmail: lease.parties?.tenantEmail || '',
    tenantPhone: lease.parties?.tenantPhone || '',
  });

  const isValid = formData.tenantName && formData.tenantEmail && formData.tenantPhone;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (isValid) {
      updateLease({
        parties: {
          landlordId: 'current_owner',
          landlordName: 'Property Owner',
          landlordEmail: 'owner@okey.com',
          landlordPhone: '(514) 555-0100',
          tenantName: formData.tenantName,
          tenantEmail: formData.tenantEmail,
          tenantPhone: formData.tenantPhone,
        },
      });
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Tenant Information
        </h2>
        <p className="text-neutral-600">
          Enter the tenant's contact information
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="tenantName" className="block text-sm font-medium text-neutral-700 mb-2">
            Full Name *
          </label>
          <Input
            id="tenantName"
            type="text"
            value={formData.tenantName}
            onChange={(e) => handleChange('tenantName', e.target.value)}
            placeholder="John Smith"
            required
          />
        </div>

        <div>
          <label htmlFor="tenantEmail" className="block text-sm font-medium text-neutral-700 mb-2">
            Email Address *
          </label>
          <Input
            id="tenantEmail"
            type="email"
            value={formData.tenantEmail}
            onChange={(e) => handleChange('tenantEmail', e.target.value)}
            placeholder="john.smith@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="tenantPhone" className="block text-sm font-medium text-neutral-700 mb-2">
            Phone Number *
          </label>
          <Input
            id="tenantPhone"
            type="tel"
            value={formData.tenantPhone}
            onChange={(e) => handleChange('tenantPhone', e.target.value)}
            placeholder="(514) 555-0123"
            required
          />
        </div>
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
