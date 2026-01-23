import { useState, ReactNode } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Card from '../ui/Card';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  isValid?: boolean | (() => boolean);
  isOptional?: boolean;
}

export interface WizardProps {
  steps: WizardStep[];
  onComplete: (data?: any) => void;
  onCancel?: () => void;
  currentStep?: number;
  showProgress?: boolean;
  allowSkip?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  nextLabel?: string;
  previousLabel?: string;
  className?: string;
}

export default function Wizard({
  steps,
  onComplete,
  onCancel,
  currentStep: controlledCurrentStep,
  showProgress = true,
  allowSkip = false,
  submitLabel = 'Complete',
  cancelLabel = 'Cancel',
  nextLabel = 'Next',
  previousLabel = 'Previous',
  className,
}: WizardProps) {
  const [internalCurrentStep, setInternalCurrentStep] = useState(0);
  const currentStep = controlledCurrentStep !== undefined ? controlledCurrentStep : internalCurrentStep;

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const currentStepData = steps[currentStep];

  const isStepValid = () => {
    const validationResult = currentStepData.isValid;
    if (typeof validationResult === 'function') {
      return validationResult();
    }
    return validationResult !== false;
  };

  const handleNext = () => {
    if (!isStepValid() && !currentStepData.isOptional) {
      return;
    }

    if (isLastStep) {
      onComplete();
    } else {
      setInternalCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setInternalCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on previous steps or current step
    if (stepIndex <= currentStep) {
      setInternalCurrentStep(stepIndex);
    }
  };

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Steps */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const isClickable = index <= currentStep;

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <button
                      onClick={() => handleStepClick(index)}
                      disabled={!isClickable}
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                        status === 'completed' && 'bg-green-600 text-white',
                        status === 'current' && 'bg-primary-600 text-white',
                        status === 'upcoming' && 'bg-neutral-200 text-neutral-500',
                        isClickable && status !== 'current' && 'cursor-pointer hover:scale-110'
                      )}
                    >
                      {status === 'completed' ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </button>
                    <div className="mt-2 text-center">
                      <div
                        className={cn(
                          'text-xs font-medium',
                          status === 'current' && 'text-neutral-900',
                          status !== 'current' && 'text-neutral-600'
                        )}
                      >
                        {step.title}
                      </div>
                      {step.description && (
                        <div className="text-xs text-neutral-500 mt-0.5 max-w-[100px] hidden md:block">
                          {step.description}
                        </div>
                      )}
                      {step.isOptional && (
                        <div className="text-xs text-neutral-400 mt-0.5">(Optional)</div>
                      )}
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 -mt-[100px]">
                      <div
                        className={cn(
                          'h-full transition-colors',
                          index < currentStep ? 'bg-green-600' : 'bg-neutral-200'
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step Content */}
      <Card className="mb-6">
        <div className="min-h-[300px]">
          {currentStepData.content}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          {!isFirstStep && (
            <Button variant="secondary" onClick={handlePrevious}>
              {previousLabel}
            </Button>
          )}
          {isFirstStep && onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Optional Skip Button */}
          {allowSkip && currentStepData.isOptional && !isLastStep && (
            <Button variant="link" onClick={handleNext}>
              Skip
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {/* Next/Complete Button */}
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!isStepValid() && !currentStepData.isOptional}
          >
            {isLastStep ? submitLabel : nextLabel}
            {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
