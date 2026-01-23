import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RatingSize = 'sm' | 'md' | 'lg';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: RatingSize;
  readonly?: boolean;
  allowHalf?: boolean;
  showValue?: boolean;
  className?: string;
}

const sizeMap: Record<RatingSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

/**
 * Star rating component with interactive and readonly modes
 * Supports half-star increments and keyboard navigation
 *
 * @example
 * <Rating value={4.5} readonly size="md" />
 * <Rating value={rating} onChange={setRating} allowHalf />
 */
export function Rating({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  allowHalf = false,
  showValue = false,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (index: number, isHalf: boolean) => {
    if (readonly || !onChange) return;
    const newValue = isHalf ? index + 0.5 : index + 1;
    onChange(newValue);
  };

  const handleMouseMove = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (readonly || !allowHalf) {
      setHoverValue(index + 1);
      return;
    }

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - left) / width;
    setHoverValue(percent < 0.5 ? index + 0.5 : index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (readonly || !onChange) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChange(index + 1);
    } else if (event.key === 'ArrowLeft' && value > 0) {
      event.preventDefault();
      onChange(Math.max(0, value - (allowHalf ? 0.5 : 1)));
    } else if (event.key === 'ArrowRight' && value < max) {
      event.preventDefault();
      onChange(Math.min(max, value + (allowHalf ? 0.5 : 1)));
    }
  };

  const displayValue = hoverValue ?? value;

  const getStarFill = (index: number): 'full' | 'half' | 'empty' => {
    if (displayValue >= index + 1) return 'full';
    if (displayValue > index && displayValue < index + 1) return 'half';
    return 'empty';
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={handleMouseLeave}
        role="radiogroup"
        aria-label={`Rating: ${value} out of ${max} stars`}
      >
        {Array.from({ length: max }, (_, index) => {
          const fill = getStarFill(index);

          return (
            <button
              key={index}
              type="button"
              disabled={readonly}
              onClick={(e) => {
                if (allowHalf) {
                  const { left, width } = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - left) / width;
                  handleClick(index, percent < 0.5);
                } else {
                  handleClick(index, false);
                }
              }}
              onMouseMove={(e) => handleMouseMove(index, e)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'relative transition-transform duration-150',
                !readonly && 'hover:scale-110 focus:scale-110 cursor-pointer',
                readonly && 'cursor-default'
              )}
              aria-label={`Rate ${index + 1} out of ${max}`}
              aria-checked={value === index + 1}
              role="radio"
              tabIndex={readonly ? -1 : 0}
            >
              {/* Empty star (background) */}
              <Star
                className={cn(
                  sizeMap[size],
                  'text-neutral-300 transition-colors duration-150'
                )}
              />

              {/* Filled star */}
              {fill !== 'empty' && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: fill === 'half' ? '50%' : '100%',
                  }}
                >
                  <Star
                    className={cn(
                      sizeMap[size],
                      'text-yellow-400 fill-yellow-400 transition-colors duration-150'
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="ml-2 text-sm font-medium text-neutral-700">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
