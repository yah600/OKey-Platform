import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import Checkbox from '@/components/atoms/Checkbox';
import { cn } from '@/lib/utils';

interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'range' | 'select';
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  defaultExpanded?: boolean;
}

interface FilterPanelProps {
  sections: FilterSection[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onApply?: () => void;
  onClear?: () => void;
  className?: string;
}

/**
 * Filter Panel Component
 * Advanced filtering with collapsible sections, multiple filter types
 */
export function FilterPanel({
  sections,
  values,
  onChange,
  onApply,
  onClear,
  className
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.filter(s => s.defaultExpanded).map(s => s.id)
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleCheckboxChange = (sectionId: string, optionValue: string, checked: boolean) => {
    const currentValues = values[sectionId] || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v: string) => v !== optionValue);
    onChange({ ...values, [sectionId]: newValues });
  };

  const handleRangeChange = (sectionId: string, key: 'min' | 'max', value: number) => {
    onChange({
      ...values,
      [sectionId]: { ...(values[sectionId] || {}), [key]: value },
    });
  };

  const handleSelectChange = (sectionId: string, value: string) => {
    onChange({ ...values, [sectionId]: value });
  };

  const activeFilterCount = Object.values(values).filter(v =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ''
  ).length;

  return (
    <div className={cn('bg-white border border-neutral-200 rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-neutral-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {onClear && activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="max-h-96 overflow-y-auto">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className="border-b border-neutral-200 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <span className="font-medium text-neutral-900">{section.title}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-4">
                  {/* Checkbox Group */}
                  {section.type === 'checkbox' && section.options && (
                    <div className="space-y-2">
                      {section.options.map((option) => (
                        <Checkbox
                          key={option.value}
                          checked={(values[section.id] || []).includes(option.value)}
                          onChange={(checked) =>
                            handleCheckboxChange(section.id, option.value, checked)
                          }
                          label={option.label}
                        />
                      ))}
                    </div>
                  )}

                  {/* Range Slider */}
                  {section.type === 'range' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          Min: {values[section.id]?.min || section.min}
                        </label>
                        <input
                          type="range"
                          min={section.min}
                          max={section.max}
                          value={values[section.id]?.min || section.min}
                          onChange={(e) =>
                            handleRangeChange(section.id, 'min', parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          Max: {values[section.id]?.max || section.max}
                        </label>
                        <input
                          type="range"
                          min={section.min}
                          max={section.max}
                          value={values[section.id]?.max || section.max}
                          onChange={(e) =>
                            handleRangeChange(section.id, 'max', parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Select Dropdown */}
                  {section.type === 'select' && section.options && (
                    <select
                      value={values[section.id] || ''}
                      onChange={(e) => handleSelectChange(section.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg"
                    >
                      <option value="">All</option>
                      {section.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {onApply && (
        <div className="px-6 py-4 border-t border-neutral-200">
          <button
            onClick={onApply}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
