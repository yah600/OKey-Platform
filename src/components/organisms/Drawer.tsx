import { forwardRef, HTMLAttributes, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      position = 'right',
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      footer,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const sizeClasses = {
      left: {
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[32rem]',
        full: 'w-full',
      },
      right: {
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[32rem]',
        full: 'w-full',
      },
      top: {
        sm: 'h-64',
        md: 'h-80',
        lg: 'h-96',
        full: 'h-full',
      },
      bottom: {
        sm: 'h-64',
        md: 'h-80',
        lg: 'h-96',
        full: 'h-full',
      },
    };

    const positionClasses = {
      left: 'top-0 left-0 h-full',
      right: 'top-0 right-0 h-full',
      top: 'top-0 left-0 w-full',
      bottom: 'bottom-0 left-0 w-full',
    };

    const animationClasses = {
      left: isOpen ? 'translate-x-0' : '-translate-x-full',
      right: isOpen ? 'translate-x-0' : 'translate-x-full',
      top: isOpen ? 'translate-y-0' : '-translate-y-full',
      bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
    };

    useEffect(() => {
      if (isOpen) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        drawerRef.current?.focus();
      } else {
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen || !closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}

        {/* Drawer */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          aria-describedby={description ? 'drawer-description' : undefined}
          tabIndex={-1}
          className={cn(
            'fixed z-50 bg-white shadow-2xl transition-transform duration-300 ease-in-out',
            positionClasses[position],
            sizeClasses[position][size],
            animationClasses[position],
            className
          )}
          {...props}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-6 border-b border-neutral-200 flex-shrink-0">
                <div className="flex-1">
                  {title && (
                    <h2 id="drawer-title" className="text-lg font-semibold text-neutral-900">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="drawer-description" className="mt-1 text-sm text-neutral-600">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-4 p-1 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2 p-6 border-t border-neutral-200 bg-neutral-50 flex-shrink-0">
                {footer}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

Drawer.displayName = 'Drawer';

export default Drawer;
