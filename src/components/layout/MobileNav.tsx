import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Wrench,
  FileText,
  MoreHorizontal,
  Building2,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavTab {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  badge?: number;
}

/**
 * Mobile bottom navigation bar with role-based tabs
 * iOS-style bottom navigation with smooth animations and badge support
 */
export function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = useMemo<NavTab[]>(() => {
    if (!user) return [];

    // Tenant navigation
    if (user.role === 'tenant') {
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/tenant/dashboard',
        },
        {
          id: 'payments',
          label: 'Payments',
          icon: CreditCard,
          path: '/tenant/payments',
        },
        {
          id: 'maintenance',
          label: 'Maintenance',
          icon: Wrench,
          path: '/tenant/maintenance',
        },
        {
          id: 'documents',
          label: 'Documents',
          icon: FileText,
          path: '/tenant/documents',
        },
        {
          id: 'more',
          label: 'More',
          icon: MoreHorizontal,
          path: '/tenant/profile',
        },
      ];
    }

    // Owner navigation
    if (user.role === 'owner' || user.role === 'property_manager') {
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/owner/dashboard',
        },
        {
          id: 'properties',
          label: 'Properties',
          icon: Building2,
          path: '/owner/properties',
        },
        {
          id: 'financials',
          label: 'Financials',
          icon: DollarSign,
          path: '/owner/financials',
        },
        {
          id: 'maintenance',
          label: 'Maintenance',
          icon: Wrench,
          path: '/owner/maintenance',
        },
        {
          id: 'more',
          label: 'More',
          icon: MoreHorizontal,
          path: '/owner/settings',
        },
      ];
    }

    return [];
  }, [user]);

  if (!user || tabs.length === 0) return null;

  const isTabActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-neutral-200 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.path);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 gap-1 py-2 px-1',
                'transition-all duration-200 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg',
                isActive
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700 active:scale-95'
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'transition-all duration-200',
                    isActive ? 'w-6 h-6' : 'w-5 h-5'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs transition-all duration-200',
                  isActive ? 'font-semibold' : 'font-medium'
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
