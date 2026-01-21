import { ReactNode } from 'react';
import {
  Home,
  Building,
  Users,
  DollarSign,
  Wrench,
  FileText,
  BarChart,
  Menu,
  LogOut,
  CreditCard,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { User } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
  user: User | null;
}

export function DashboardLayout({ children, currentRoute, onNavigate, user }: DashboardLayoutProps) {
  // Determine navigation items based on user role
  const getNavigationItems = () => {
    if (user?.role === 'tenant') {
      return [
        { route: 'tenant-dashboard', label: 'Dashboard', icon: Home },
        { route: 'tenant-payments', label: 'Payments', icon: CreditCard },
        { route: 'tenant-maintenance', label: 'Maintenance', icon: Wrench },
        { route: 'tenant-documents', label: 'Documents', icon: FileText },
      ];
    }

    // Owner/Property Manager navigation
    return [
      { route: 'owner-dashboard', label: 'Dashboard', icon: Home },
      { route: 'properties', label: 'Properties', icon: Building },
      { route: 'tenants', label: 'Tenants', icon: Users },
      { route: 'finances', label: 'Finances', icon: DollarSign },
      { route: 'maintenance', label: 'Maintenance', icon: Wrench },
      { route: 'documents', label: 'Documents', icon: FileText },
      { route: 'analytics', label: 'Analytics', icon: BarChart },
    ];
  };

  const navItems = getNavigationItems();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r">
        {/* Logo */}
        <div className="flex items-center gap-2 p-6 border-b">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">O</span>
          </div>
          <span className="text-xl font-bold">O'Key Platform</span>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role?.replace('_', ' ') || 'User'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;

            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onNavigate('marketplace')}
          >
            <Home className="w-4 h-4 mr-3" />
            Marketplace
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive">
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 flex items-center gap-4 p-4 bg-white border-b">
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="font-bold">O'Key</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
