import { forwardRef, HTMLAttributes, Fragment } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  showHome?: boolean;
  separator?: React.ReactNode;
}

const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, items, showHome = true, separator, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center space-x-1', className)}
        {...props}
      >
        <ol className="flex items-center space-x-1">
          {showHome && (
            <>
              <li>
                <Link
                  to="/"
                  className="flex items-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              </li>
              {items.length > 0 && (
                <li aria-hidden="true" className="flex items-center text-neutral-400">
                  {separator || <ChevronRight className="w-4 h-4" />}
                </li>
              )}
            </>
          )}
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <Fragment key={index}>
                <li>
                  {item.href && !isLast ? (
                    <Link
                      to={item.href}
                      className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        'flex items-center gap-1.5 text-sm',
                        isLast ? 'text-neutral-900 font-medium' : 'text-neutral-600'
                      )}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.icon}
                      {item.label}
                    </span>
                  )}
                </li>
                {!isLast && (
                  <li aria-hidden="true" className="flex items-center text-neutral-400">
                    {separator || <ChevronRight className="w-4 h-4" />}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
