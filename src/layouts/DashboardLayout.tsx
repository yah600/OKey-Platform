import { ReactNode } from 'react';
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
  Calendar
} from 'lucide-react';
import Button from '../components/ui/Button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const tenantNav = [
    { name: 'Dashboard', path: '/tenant/dashboard', icon: Home },
    { name: 'Payments', path: '/tenant/payments', icon: DollarSign },
    { name: 'Maintenance', path: '/tenant/maintenance', icon: Wrench },
    { name: 'Documents', path: '/tenant/documents', icon: FileText },
    { name: 'Messages', path: '/tenant/messages', icon: Mail },
  ];

  const ownerNav = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: Home },
    { name: 'Properties', path: '/owner/properties', icon: Building2 },
    { name: 'Residents', path: '/owner/residents', icon: Users },
    { name: 'Financials', path: '/owner/financials', icon: BarChart3 },
    { name: 'Maintenance', path: '/owner/maintenance', icon: Wrench },
    { name: 'Documents', path: '/owner/documents', icon: FileText },
  ];

  const navigation = user?.role === 'tenant' ? tenantNav : ownerNav;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">O'Key Platform</h1>
          <div className="flex items-center gap-4">
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
    </div>
  );
}
