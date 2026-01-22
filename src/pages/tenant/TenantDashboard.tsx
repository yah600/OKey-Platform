import { useState, useEffect } from 'react';
import { DollarSign, Wrench, FileText, Mail, Calendar, Home } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

export default function TenantDashboard() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Welcome back, {user?.name}</h1>
        <p className="text-sm text-neutral-600">Here's what's happening with your rental</p>
      </div>

      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Sunset Apartments</h3>
              <p className="text-sm text-neutral-600">Unit 4B • Montreal, QC</p>
              <p className="text-xs text-neutral-500 mt-1">Lease expires: Dec 31, 2026</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">View Details</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-600">Next Payment Due</p>
              <p className="text-lg font-semibold text-neutral-900">$2,500</p>
              <p className="text-xs text-neutral-500">Due Feb 1, 2026</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-600">Maintenance Requests</p>
              <p className="text-lg font-semibold text-neutral-900">2 Active</p>
              <p className="text-xs text-neutral-500">1 pending review</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button variant="secondary" size="sm" className="justify-start">
            <DollarSign className="w-4 h-4" />
            Pay Rent
          </Button>
          <Button variant="secondary" size="sm" className="justify-start">
            <Wrench className="w-4 h-4" />
            Request Repair
          </Button>
          <Button variant="secondary" size="sm" className="justify-start">
            <FileText className="w-4 h-4" />
            Documents
          </Button>
          <Button variant="secondary" size="sm" className="justify-start">
            <Mail className="w-4 h-4" />
            Messages
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { icon: DollarSign, title: 'Payment Received', desc: 'Jan rent payment - $2,500', date: 'Jan 1' },
            { icon: Wrench, title: 'Maintenance Completed', desc: 'Kitchen sink repair', date: 'Dec 28' },
            { icon: FileText, title: 'Document Uploaded', desc: 'Lease renewal signed', date: 'Dec 15' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 border-b border-neutral-100 last:border-0">
              <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                <activity.icon className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                <p className="text-xs text-neutral-600">{activity.desc}</p>
              </div>
              <span className="text-xs text-neutral-500">{activity.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
