import { useState } from 'react';
import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';
import Checkbox from '@/components/atoms/Checkbox';
import Input from '@/components/atoms/Input';
import { cn } from '@/lib/utils';

/**
 * Step 5: Additional Clauses
 */
export function Step5AdditionalClauses() {
  const { lease, updateLease, nextStep, prevStep } = useLeaseBuilderStore();
  const [formData, setFormData] = useState({
    petsAllowed: lease.additionalTerms?.petsAllowed || false,
    petDeposit: lease.additionalTerms?.petDeposit || 0,
    smokingAllowed: lease.additionalTerms?.smokingAllowed || false,
    parkingSpots: lease.additionalTerms?.parkingSpots || 0,
    parkingFee: lease.additionalTerms?.parkingFee || 0,
    utilitiesIncluded: lease.additionalTerms?.utilitiesIncluded || [],
  });

  const utilities = ['Water', 'Electricity', 'Gas', 'Internet', 'Cable TV', 'Heating'];

  const toggleUtility = (utility: string) => {
    setFormData(prev => ({
      ...prev,
      utilitiesIncluded: prev.utilitiesIncluded.includes(utility)
        ? prev.utilitiesIncluded.filter(u => u !== utility)
        : [...prev.utilitiesIncluded, utility],
    }));
  };

  const handleContinue = () => {
    updateLease({
      additionalTerms: {
        petsAllowed: formData.petsAllowed,
        petDeposit: formData.petsAllowed ? formData.petDeposit : undefined,
        smokingAllowed: formData.smokingAllowed,
        parkingSpots: formData.parkingSpots,
        parkingFee: formData.parkingSpots > 0 ? formData.parkingFee : undefined,
        utilitiesIncluded: formData.utilitiesIncluded,
        maintenanceResponsibility: {
          landlord: ['Structural repairs', 'Plumbing', 'Heating', 'Electrical'],
          tenant: ['Cleaning', 'Minor repairs', 'Light bulbs', 'Filters'],
        },
      },
    });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Additional Terms
        </h2>
        <p className="text-neutral-600">
          Set pet policy, parking, utilities, and other terms
        </p>
      </div>

      {/* Pets */}
      <div className="space-y-3">
        <h3 className="font-semibold text-neutral-900">Pet Policy</h3>
        <Checkbox
          checked={formData.petsAllowed}
          onChange={(checked) => setFormData(prev => ({ ...prev, petsAllowed: checked }))}
          label="Allow pets"
        />
        {formData.petsAllowed && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Pet Deposit
            </label>
            <Input
              type="number"
              value={formData.petDeposit || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, petDeposit: parseFloat(e.target.value) }))}
              placeholder="250"
              min="0"
            />
          </div>
        )}
      </div>

      {/* Smoking */}
      <div className="space-y-3">
        <h3 className="font-semibold text-neutral-900">Smoking Policy</h3>
        <Checkbox
          checked={formData.smokingAllowed}
          onChange={(checked) => setFormData(prev => ({ ...prev, smokingAllowed: checked }))}
          label="Allow smoking"
        />
      </div>

      {/* Parking */}
      <div className="space-y-3">
        <h3 className="font-semibold text-neutral-900">Parking</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Number of Spots
            </label>
            <Input
              type="number"
              value={formData.parkingSpots || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, parkingSpots: parseInt(e.target.value) }))}
              placeholder="0"
              min="0"
            />
          </div>
          {formData.parkingSpots > 0 && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Monthly Fee (per spot)
              </label>
              <Input
                type="number"
                value={formData.parkingFee || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, parkingFee: parseFloat(e.target.value) }))}
                placeholder="50"
                min="0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Utilities */}
      <div className="space-y-3">
        <h3 className="font-semibold text-neutral-900">Utilities Included</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {utilities.map(utility => (
            <Checkbox
              key={utility}
              checked={formData.utilitiesIncluded.includes(utility)}
              onChange={() => toggleUtility(utility)}
              label={utility}
            />
          ))}
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
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
