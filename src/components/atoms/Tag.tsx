import { forwardRef, HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  leftIcon?: React.ReactNode;
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      dismissible = false,
      onDismiss,
      leftIcon,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      primary: 'bg-primary-100 text-primary-700 border-primary-200',
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-amber-100 text-amber-700 border-amber-200',
      error: 'bg-red-100 text-red-700 border-red-200',
      info: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm',
    };

    const iconSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-full border',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {leftIcon && <span className={iconSizeClasses[size]}>{leftIcon}</span>}
        {children}
        {dismissible && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.();
            }}
            className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            <X className={iconSizeClasses[size]} />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

export default Tag;
