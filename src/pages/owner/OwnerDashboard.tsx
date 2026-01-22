import { Building2, DollarSign, Users, TrendingUp, AlertCircle, Wrench } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function OwnerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Portfolio Overview</h1>
          <p className="text-sm text-neutral-600">Manage your properties and track performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Building2, label: 'Properties', value: '12', change: '+2' },
            { icon: DollarSign, label: 'Monthly Revenue', value: '$28,450', change: '+12%' },
            { icon: Users, label: 'Occupancy', value: '96%', change: '48/50' },
            { icon: TrendingUp, label: 'YTD Growth', value: '+18%', change: 'vs 2025' },
          ].map((metric) => (
            <Card key={metric.label} padding="sm">
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className="w-4 h-4 text-neutral-500" />
                <p className="text-xs text-neutral-600">{metric.label}</p>
              </div>
              <p className="text-2xl font-semibold text-neutral-900 mb-0.5">{metric.value}</p>
              <p className="text-xs text-neutral-500">{metric.change}</p>
            </Card>
          ))}
        </div>

        {/* Alerts */}
        <Card className="mb-6 border-l-4 border-l-amber-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">Action Required</h3>
              <p className="text-sm text-neutral-600 mb-2">3 leases expiring in the next 60 days</p>
              <Button variant="secondary" size="sm">Review Leases</Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Properties */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">Properties</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Sunset Apartments', units: '24', occupied: '24', revenue: '$12,400' },
                { name: 'Downtown Plaza', units: '18', occupied: '16', revenue: '$9,800' },
                { name: 'Riverside Complex', units: '8', occupied: '8', revenue: '$6,250' },
              ].map((property, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{property.name}</p>
                    <p className="text-xs text-neutral-600">{property.occupied}/{property.units} units occupied</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900">{property.revenue}</p>
                    <p className="text-xs text-neutral-500">per month</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Maintenance */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">Maintenance Requests</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {[
                { property: 'Sunset Apt #12A', issue: 'Leaking faucet', priority: 'Medium', status: 'In Progress' },
                { property: 'Downtown #5B', issue: 'AC not cooling', priority: 'High', status: 'Pending' },
                { property: 'Riverside #2C', issue: 'Door lock replacement', priority: 'Low', status: 'Scheduled' },
              ].map((request, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-neutral-100 last:border-0">
                  <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">{request.issue}</p>
                    <p className="text-xs text-neutral-600">{request.property}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded">{request.priority}</span>
                      <span className="text-xs text-neutral-500">{request.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
