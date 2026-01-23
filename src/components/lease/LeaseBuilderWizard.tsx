import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';
import { Step1SelectTemplate } from './steps/Step1SelectTemplate';
import { Step2PropertyDetails } from './steps/Step2PropertyDetails';
import { Step3TenantInformation } from './steps/Step3TenantInformation';
import { Step4LeaseTerms } from './steps/Step4LeaseTerms';
import { Step5AdditionalClauses } from './steps/Step5AdditionalClauses';
import { Step6CustomClauses } from './steps/Step6CustomClauses';
import { Step7ReviewAndSign } from './steps/Step7ReviewAndSign';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Template', component: Step1SelectTemplate },
  { id: 2, name: 'Property', component: Step2PropertyDetails },
  { id: 3, name: 'Tenant', component: Step3TenantInformation },
  { id: 4, name: 'Terms', component: Step4LeaseTerms },
  { id: 5, name: 'Clauses', component: Step5AdditionalClauses },
  { id: 6, name: 'Custom', component: Step6CustomClauses },
  { id: 7, name: 'Review', component: Step7ReviewAndSign },
];

/**
 * Lease Builder Wizard Container
 * Manages step navigation and displays current step
 */
export function LeaseBuilderWizard() {
  const { currentStep } = useLeaseBuilderStore();
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200',
                    index < currentStep
                      ? 'bg-primary-600 text-white'
                      : index === currentStep
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : 'bg-neutral-200 text-neutral-500'
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    index <= currentStep
                      ? 'text-neutral-900'
                      : 'text-neutral-500'
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 transition-all duration-200',
                    index < currentStep ? 'bg-primary-600' : 'bg-neutral-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <CurrentStepComponent />
      </div>
    </div>
  );
}
