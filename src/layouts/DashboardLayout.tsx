import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Home,
  DollarSign,
  Wrench,
  FileText,
  Mail,
  User,
  LogOut,
  Building2,
  Users,
  BarChart3,
  Calendar,
  TrendingUp,
  Settings,
  Bell,
  Search,
  HelpCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import CommandPalette from '../components/organisms/CommandPalette';
import NotificationsPanel from '../components/organisms/NotificationsPanel';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Cmd+K to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tenantNav = [
    { name: 'Dashboard', path: '/tenant/dashboard', icon: Home },
    { name: 'Payments', path: '/tenant/payments', icon: DollarSign },
    { name: 'Maintenance', path: '/tenant/maintenance', icon: Wrench },
    { name: 'Documents', path: '/tenant/documents', icon: FileText },
    { name: 'Messages', path: '/tenant/messages', icon: Mail },
    { name: 'Profile', path: '/tenant/profile', icon: User },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  const ownerNav = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: Home },
    { name: 'Properties', path: '/owner/properties', icon: Building2 },
    { name: 'Residents', path: '/owner/residents', icon: Users },
    { name: 'Financials', path: '/owner/financials', icon: BarChart3 },
    { name: 'Maintenance', path: '/owner/maintenance', icon: Wrench },
    { name: 'Documents', path: '/owner/documents', icon: FileText },
    { name: 'Meetings', path: '/owner/meetings', icon: Calendar },
    { name: 'Analytics', path: '/owner/analytics', icon: TrendingUp },
    { name: 'Settings', path: '/owner/settings', icon: Settings },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  const navigation = user?.role === 'tenant' ? tenantNav : ownerNav;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">O'Key Platform</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCommandPalette(true)}
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(true)}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-neutral-200 mx-2"></div>
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
              <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Global Components */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
