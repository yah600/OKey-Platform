import { Users, Mail, Phone, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function ResidentsPage() {
  const residents = [
    { id: 1, name: 'Sarah Johnson', unit: 'Sunset Apt #4B', rent: 2500, lease: 'Dec 31, 2026', status: 'current', phone: '(514) 555-0123' },
    { id: 2, name: 'Michael Chen', unit: 'Downtown #12A', rent: 2200, lease: 'Mar 15, 2026', status: 'expiring', phone: '(514) 555-0456' },
    { id: 3, name: 'Emily Rodriguez', unit: 'Riverside #3C', rent: 1800, lease: 'Jun 30, 2027', status: 'current', phone: '(514) 555-0789' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Residents</h1>
        <p className="text-sm text-neutral-600">Manage tenants and leases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Total Tenants</p>
          <p className="text-2xl font-semibold text-neutral-900">{residents.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Expiring Soon</p>
          <p className="text-2xl font-semibold text-amber-600">1</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Avg Lease Term</p>
          <p className="text-2xl font-semibold text-neutral-900">18 mo</p>
        </Card>
      </div>

      <div className="space-y-3">
        {residents.map((resident) => (
          <Card key={resident.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-neutral-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{resident.name}</h3>
                  <p className="text-sm text-neutral-600 mb-2">{resident.unit}</p>
                  <div className="flex items-center gap-3 text-xs text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {resident.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Lease ends {resident.lease}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-neutral-900">${resident.rent}</p>
                <p className="text-xs text-neutral-500 mb-2">per month</p>
                <span className={`text-xs px-2 py-0.5 rounded ${resident.status === 'current' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {resident.status === 'expiring' ? 'Expiring Soon' : 'Active'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
