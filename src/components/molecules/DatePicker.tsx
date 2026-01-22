import { forwardRef, InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  onDateSelect?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      value,
      onChange,
      onDateSelect,
      minDate,
      maxDate,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      value ? new Date(value as string) : null
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      return {
        daysInMonth: lastDay.getDate(),
        startingDayOfWeek: firstDay.getDay(),
      };
    };

    const previousMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const selectDate = (day: number) => {
      const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

      if (minDate && selected < minDate) return;
      if (maxDate && selected > maxDate) return;

      setSelectedDate(selected);
      onDateSelect?.(selected);

      const formattedDate = selected.toISOString().split('T')[0];
      if (onChange) {
        const event = {
          target: { value: formattedDate }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }

      setIsOpen(false);
    };

    const isDateDisabled = (day: number) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    const isToday = (day: number) => {
      const today = new Date();
      return (
        day === today.getDate() &&
        currentMonth.getMonth() === today.getMonth() &&
        currentMonth.getFullYear() === today.getFullYear()
      );
    };

    const isSelected = (day: number) => {
      if (!selectedDate) return false;
      return (
        day === selectedDate.getDate() &&
        currentMonth.getMonth() === selectedDate.getMonth() &&
        currentMonth.getFullYear() === selectedDate.getFullYear()
      );
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

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

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
            value={selectedDate ? selectedDate.toLocaleDateString() : ''}
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
            placeholder="Select date"
            {...props}
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />

          {isOpen && (
            <div className="absolute z-50 mt-2 bg-white rounded-lg border border-neutral-200 shadow-lg p-4 animate-slideInUp">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={previousMonth}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-600" />
                </button>
                <span className="text-sm font-semibold text-neutral-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-neutral-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const disabled = isDateDisabled(day);
                  const today = isToday(day);
                  const selected = isSelected(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => !disabled && selectDate(day)}
                      disabled={disabled}
                      className={cn(
                        'w-8 h-8 text-xs rounded transition-colors',
                        disabled
                          ? 'text-neutral-300 cursor-not-allowed'
                          : selected
                          ? 'bg-primary-600 text-white font-semibold'
                          : today
                          ? 'bg-primary-100 text-primary-600 font-semibold'
                          : 'text-neutral-900 hover:bg-neutral-100'
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
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

DatePicker.displayName = 'DatePicker';

export default DatePicker;
