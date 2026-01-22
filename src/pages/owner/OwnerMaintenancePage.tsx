import { Wrench, Filter, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function OwnerMaintenancePage() {
  const requests = [
    { id: 1, property: 'Sunset Apt #12A', tenant: 'Sarah Johnson', issue: 'Leaking faucet', priority: 'Medium', status: 'In Progress', date: '2026-01-20' },
    { id: 2, property: 'Downtown #5B', tenant: 'Michael Chen', issue: 'AC not cooling', priority: 'High', status: 'Pending', date: '2026-01-22' },
    { id: 3, property: 'Riverside #2C', tenant: 'Emily Rodriguez', issue: 'Door lock sticky', priority: 'Low', status: 'Completed', date: '2026-01-15' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Maintenance</h1>
        <p className="text-sm text-neutral-600">Manage maintenance requests across all properties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Total Requests</p>
          <p className="text-2xl font-semibold text-neutral-900">3</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">In Progress</p>
          <p className="text-2xl font-semibold text-blue-600">1</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Pending</p>
          <p className="text-2xl font-semibold text-amber-600">1</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Completed</p>
          <p className="text-2xl font-semibold text-green-600">1</p>
        </Card>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Button variant="secondary" size="sm">
          <Filter className="w-4 h-4" />
          All
        </Button>
        <Button variant="ghost" size="sm">Pending</Button>
        <Button variant="ghost" size="sm">In Progress</Button>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <Card key={request.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{request.issue}</h3>
                  <p className="text-xs text-neutral-600 mb-2">{request.property}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <User className="w-3 h-3 text-neutral-500" />
                    <span className="text-neutral-600">{request.tenant}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded">{request.priority}</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{request.status}</span>
                </div>
                <Button variant="ghost" size="sm">Assign</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
