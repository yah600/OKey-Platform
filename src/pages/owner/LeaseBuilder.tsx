import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';
import { LeaseBuilderWizard } from '@/components/lease/LeaseBuilderWizard';

/**
 * Lease Builder & Editor Page
 * Multi-step wizard for creating and editing leases
 */
export function LeaseBuilder() {
  const navigate = useNavigate();
  const { currentStep, resetBuilder } = useLeaseBuilderStore();

  useEffect(() => {
    // Reset builder on mount
    return () => {
      // Optional: Save draft on unmount
    };
  }, []);

  const handleCancel = () => {
    if (currentStep > 0) {
      const confirmed = window.confirm(
        'Are you sure you want to cancel? Your progress will be saved as a draft.'
      );
      if (confirmed) {
        navigate('/owner/residents');
      }
    } else {
      navigate('/owner/residents');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Lease Builder
                </h1>
                <p className="text-sm text-neutral-600">
                  Create a new lease agreement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LeaseBuilderWizard />
      </div>
    </div>
  );
}

export default LeaseBuilder;
