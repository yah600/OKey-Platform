import { useState } from 'react';
import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';
import Textarea from '@/components/atoms/Textarea';

/**
 * Step 6: Custom Clauses
 * Rich text editor for special terms
 */
export function Step6CustomClauses() {
  const { lease, updateLease, nextStep, prevStep } = useLeaseBuilderStore();
  const [customClauses, setCustomClauses] = useState(lease.customClauses || '');

  const handleContinue = () => {
    updateLease({ customClauses });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Custom Clauses
        </h2>
        <p className="text-neutral-600">
          Add any special terms or conditions specific to this lease
        </p>
      </div>

      <div>
        <label htmlFor="customClauses" className="block text-sm font-medium text-neutral-700 mb-2">
          Custom Terms (Optional)
        </label>
        <Textarea
          id="customClauses"
          value={customClauses}
          onChange={(e) => setCustomClauses(e.target.value)}
          placeholder="Enter any additional terms, conditions, or special agreements..."
          rows={10}
          className="font-mono text-sm"
        />
        <p className="mt-2 text-xs text-neutral-500">
          These terms will be included in the final lease document. You can add specific requirements, restrictions, or agreements that are unique to this rental situation.
        </p>
      </div>

      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <h4 className="font-medium text-neutral-900 mb-2">Example Custom Clauses:</h4>
        <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
          <li>Tenant agrees to maintain lawn and snow removal</li>
          <li>Property includes access to shared storage unit #12</li>
          <li>Tenant is responsible for replacing HVAC filters quarterly</li>
          <li>Rent includes one designated parking spot (#23)</li>
          <li>Move-in cleaning required before occupancy</li>
        </ul>
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
          Continue to Review
        </button>
      </div>
    </div>
  );
}
