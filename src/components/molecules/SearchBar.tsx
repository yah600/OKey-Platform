import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  isLoading?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, value, onChange, onClear, isLoading, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && String(value).length > 0;

    const handleClear = () => {
      onClear?.();
      if (onChange) {
        onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div
        className={cn(
          'relative flex items-center w-full transition-all',
          isFocused && 'ring-2 ring-primary-500/20 rounded-lg',
          className
        )}
      >
        <Search className="absolute left-3 w-5 h-5 text-neutral-400 pointer-events-none" />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-neutral-200',
            'focus:outline-none focus:border-primary-500',
            'placeholder:text-neutral-400',
            'transition-colors'
          )}
          {...props}
        />
        {isLoading && (
          <div className="absolute right-3">
            <div className="w-4 h-4 border-2 border-neutral-300 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}
        {hasValue && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-0.5 hover:bg-neutral-100 rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
