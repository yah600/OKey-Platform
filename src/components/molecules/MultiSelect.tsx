import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Multi-Select Component
 * Checkbox dropdown with search and select all/deselect all
 */
export function MultiSelect({ options, value, onChange, placeholder = 'Select...', className }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    onChange(filteredOptions.map(opt => opt.value));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white hover:bg-neutral-50 flex items-center justify-between"
      >
        <span className="text-neutral-700">
          {value.length === 0 ? placeholder : `${value.length} selected`}
        </span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg">
          <div className="p-2 border-b border-neutral-200">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded"
            />
          </div>
          <div className="p-2 flex gap-2 border-b border-neutral-200">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-primary-600 hover:underline"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="text-xs text-neutral-600 hover:underline"
            >
              Deselect All
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600"
                />
                <span className="text-sm text-neutral-700">{option.label}</span>
                {value.includes(option.value) && (
                  <Check className="w-4 h-4 text-primary-600 ml-auto" />
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
