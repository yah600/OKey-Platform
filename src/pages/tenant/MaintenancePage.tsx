import { useState, useEffect } from 'react';
import { Wrench, Plus, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';

export default function MaintenancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showEmpty, setShowEmpty] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const requests = showEmpty ? [] : [
    { id: 1, title: 'Leaking faucet', location: 'Kitchen', priority: 'Medium', status: 'In Progress', date: '2026-01-20' },
    { id: 2, title: 'AC not cooling', location: 'Living Room', priority: 'High', status: 'Pending', date: '2026-01-22' },
    { id: 3, title: 'Door lock sticky', location: 'Front Door', priority: 'Low', status: 'Completed', date: '2026-01-15' },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-700';
    if (status === 'Pending') return 'bg-amber-100 text-amber-700';
    return 'bg-neutral-100 text-neutral-700';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'High') return 'text-red-600';
    if (priority === 'Medium') return 'text-amber-600';
    return 'text-neutral-600';
  };

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Maintenance</h1>
          <p className="text-sm text-neutral-600">Submit and track maintenance requests</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Active Requests</p>
          <p className="text-2xl font-semibold text-neutral-900">2</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">In Progress</p>
          <p className="text-2xl font-semibold text-blue-600">1</p>
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
        <Button variant="ghost" size="sm">Completed</Button>
        <Button variant="ghost" size="sm" onClick={() => setShowEmpty(!showEmpty)}>
          {showEmpty ? 'Show Requests' : 'Show Empty'}
        </Button>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map((request) => (
          <Card key={request.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{request.title}</h3>
                  <p className="text-xs text-neutral-600 mb-2">{request.location}</p>
                  <div className="flex items-center gap-2">
                    <span className={'text-xs px-2 py-0.5 rounded ' + getStatusColor(request.status)}>
                      {request.status}
                    </span>
                    <span className={'text-xs font-medium ' + getPriorityColor(request.priority)}>
                      {request.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500">{new Date(request.date).toLocaleDateString()}</p>
                <Button variant="ghost" size="sm" className="mt-2">View Details</Button>
              </div>
            </div>
          </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Wrench}
            title="No maintenance requests"
            description="You don't have any maintenance requests. Submit a new request if you need repairs."
            action={{
              label: 'New Request',
              onClick: () => alert('New request modal would open'),
            }}
          />
        </Card>
      )}
    </div>
  );
}
