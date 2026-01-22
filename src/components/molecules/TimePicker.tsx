import { forwardRef, InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  onTimeSelect?: (time: string) => void;
  format?: '12h' | '24h';
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      value,
      onChange,
      onTimeSelect,
      format = '12h',
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState('12');
    const [minutes, setMinutes] = useState('00');
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    const formatTime = (h: string, m: string, p?: 'AM' | 'PM') => {
      if (format === '24h') {
        return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
      }
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')} ${p}`;
    };

    const parseTime = (timeString: string) => {
      if (!timeString) return;

      if (format === '12h') {
        const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (match) {
          setHours(match[1]);
          setMinutes(match[2]);
          setPeriod(match[3].toUpperCase() as 'AM' | 'PM');
        }
      } else {
        const match = timeString.match(/(\d{1,2}):(\d{2})/);
        if (match) {
          setHours(match[1]);
          setMinutes(match[2]);
        }
      }
    };

    useEffect(() => {
      if (value) {
        parseTime(value as string);
      }
    }, [value]);

    const handleSelect = () => {
      const timeString = formatTime(hours, minutes, period);
      onTimeSelect?.(timeString);

      if (onChange) {
        const event = {
          target: { value: timeString }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }

      setIsOpen(false);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const hourOptions = format === '12h'
      ? Array.from({ length: 12 }, (_, i) => String(i + 1))
      : Array.from({ length: 24 }, (_, i) => String(i));

    const minuteOptions = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

    const displayValue = value ? value as string : '';

    return (
      <div ref={containerRef} className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="text"
            id={inputId}
            value={displayValue}
            onChange={() => {}}
            onClick={() => setIsOpen(!isOpen)}
            readOnly
            className={cn(
              'w-full pl-10 pr-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer',
              'focus:outline-none focus:ring-2',
              'placeholder:text-neutral-400',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20',
              className
            )}
            placeholder="Select time"
            {...props}
          />
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />

          {isOpen && (
            <div className="absolute z-50 mt-2 bg-white rounded-lg border border-neutral-200 shadow-lg p-4 animate-slideInUp">
              <div className="flex gap-2 mb-3">
                {/* Hours */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    {format === '12h' ? 'Hour' : 'Hours'}
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-neutral-200 rounded">
                    {hourOptions.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setHours(hour)}
                        className={cn(
                          'w-full px-3 py-1 text-sm text-left hover:bg-neutral-100 transition-colors',
                          hours === hour && 'bg-primary-100 text-primary-700 font-medium'
                        )}
                      >
                        {hour.padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minutes */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Minutes
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-neutral-200 rounded">
                    {minuteOptions.map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => setMinutes(minute)}
                        className={cn(
                          'w-full px-3 py-1 text-sm text-left hover:bg-neutral-100 transition-colors',
                          minutes === minute && 'bg-primary-100 text-primary-700 font-medium'
                        )}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM */}
                {format === '12h' && (
                  <div className="flex-shrink-0">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Period
                    </label>
                    <div className="border border-neutral-200 rounded">
                      {(['AM', 'PM'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPeriod(p)}
                          className={cn(
                            'w-full px-3 py-1 text-sm hover:bg-neutral-100 transition-colors',
                            period === p && 'bg-primary-100 text-primary-700 font-medium'
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSelect}
                className="w-full px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                Select Time
              </button>
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-xs text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';

export default TimePicker;
