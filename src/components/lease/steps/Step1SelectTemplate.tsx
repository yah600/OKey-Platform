import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';
import { leaseTemplates } from '@/lib/templates/leaseTemplates';
import { FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Step 1: Select Lease Template
 */
export function Step1SelectTemplate() {
  const { templateId, setTemplate, updateLease, nextStep } = useLeaseBuilderStore();

  const handleSelectTemplate = (id: string) => {
    setTemplate(id);
    const template = leaseTemplates.find(t => t.id === id);
    if (template) {
      updateLease({
        type: template.type,
        selectedClauses: template.clauses.filter(c => c.required).map(c => c.id),
      });
    }
  };

  const handleContinue = () => {
    if (templateId) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Choose a Lease Template
        </h2>
        <p className="text-neutral-600">
          Select the type of lease that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leaseTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            className={cn(
              'p-6 border-2 rounded-xl text-left transition-all duration-200 hover:border-primary-300 hover:shadow-md',
              templateId === template.id
                ? 'border-primary-600 bg-primary-50 shadow-md'
                : 'border-neutral-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              {templateId === template.id && (
                <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {template.name}
            </h3>
            <p className="text-sm text-neutral-600 mb-3">
              {template.description}
            </p>
            <div className="text-xs text-neutral-500">
              Default: {template.defaultDuration} months
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!templateId}
          className={cn(
            'px-6 py-3 rounded-lg font-medium transition-all',
            templateId
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
