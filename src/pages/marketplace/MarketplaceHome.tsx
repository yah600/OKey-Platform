import { Building2, DollarSign, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function MarketplaceHome() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">
            O'Key Platform
          </h1>
          <div className="flex items-center gap-3">
            {user && (
              <>
                <span className="text-sm text-neutral-600">
                  {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-neutral-900 mb-2">Dashboard</h2>
          <p className="text-neutral-600">Manage your properties and track performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Building2, label: 'Properties', value: '12', change: '+2 this month' },
            { icon: DollarSign, label: 'Revenue', value: '$28,450', change: '+12% from last month' },
            { icon: Users, label: 'Tenants', value: '48', change: '96% occupancy' },
          ].map((stat) => (
            <Card key={stat.label} padding="sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-neutral-500" />
                    <p className="text-sm text-neutral-600">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-semibold text-neutral-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-neutral-500">{stat.change}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="secondary" className="justify-start">
              Browse Properties
            </Button>
            <Button variant="secondary" className="justify-start">
              List a Property
            </Button>
            <Button variant="secondary" className="justify-start">
              View Reports
            </Button>
            <Button variant="secondary" className="justify-start">
              Manage Tenants
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
