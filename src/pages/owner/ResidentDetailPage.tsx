import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, FileText, Wrench, User, Edit } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import Avatar from '../../components/atoms/Avatar';
import Timeline from '../../components/organisms/Timeline';

export default function ResidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock resident data
  const resident = {
    id: id || '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (514) 555-0123',
    avatar: '',
    property: 'Sunset Apartments',
    unit: '4B',
    leaseStart: '2023-09-01',
    leaseEnd: '2024-08-31',
    rent: 1800,
    securityDeposit: 1800,
    status: 'active',
    balance: 0,
    emergencyContact: {
      name: 'John Johnson',
      relationship: 'Father',
      phone: '+1 (514) 555-0456',
    },
  };

  const payments = [
    { id: 1, date: '2026-01-01', amount: 1800, method: 'Bank Transfer', status: 'paid' },
    { id: 2, date: '2025-12-01', amount: 1800, method: 'Credit Card', status: 'paid' },
    { id: 3, date: '2025-11-01', amount: 1800, method: 'Bank Transfer', status: 'paid' },
    { id: 4, date: '2025-10-01', amount: 1800, method: 'Bank Transfer', status: 'paid' },
  ];

  const maintenanceRequests = [
    { id: 1, date: '2026-01-15', issue: 'Leaking faucet', priority: 'medium', status: 'completed' },
    { id: 2, date: '2025-12-10', issue: 'Heater not working', priority: 'high', status: 'completed' },
    { id: 3, date: '2025-11-05', issue: 'Door lock issue', priority: 'low', status: 'completed' },
  ];

  const documents = [
    { id: 1, name: 'Lease Agreement.pdf', category: 'Lease', date: '2023-08-15', size: '2.4 MB' },
    { id: 2, name: 'Move-in Inspection.pdf', category: 'Inspection', date: '2023-09-01', size: '1.8 MB' },
    { id: 3, name: 'Insurance Certificate.pdf', category: 'Insurance', date: '2023-08-20', size: '856 KB' },
  ];

  const timeline = [
    {
      id: '1',
      title: 'Rent Payment Received',
      description: 'January rent payment of $1,800',
      timestamp: '2 days ago',
      variant: 'success' as const,
    },
    {
      id: '2',
      title: 'Maintenance Request Resolved',
      description: 'Leaking faucet fixed',
      timestamp: '1 week ago',
      variant: 'default' as const,
    },
    {
      id: '3',
      title: 'Lease Renewal Notice Sent',
      description: 'Renewal options for lease ending Aug 2024',
      timestamp: '2 weeks ago',
      variant: 'default' as const,
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'payments', label: 'Payments' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'documents', label: 'Documents' },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Residents', href: '/owner/residents' },
            { label: resident.name },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/owner/residents')}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <Avatar name={resident.name} size="xl" />
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">{resident.name}</h1>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {resident.property} - Unit {resident.unit}
                </span>
                <Badge variant={resident.status === 'active' ? 'success' : 'default'}>
                  {resident.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="secondary">
            <Edit className="w-4 h-4" />
            Edit Resident
          </Button>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-600 mb-0.5">Email</p>
              <p className="text-sm font-medium text-neutral-900 truncate">{resident.email}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-600 mb-0.5">Phone</p>
              <p className="text-sm font-medium text-neutral-900">{resident.phone}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-600 mb-0.5">Balance</p>
              <p className="text-sm font-semibold text-neutral-900">
                ${resident.balance.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Lease Information */}
              <Card>
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Lease Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Property</span>
                    <span className="font-medium text-neutral-900">{resident.property}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Unit</span>
                    <span className="font-medium text-neutral-900">{resident.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Lease Start</span>
                    <span className="font-medium text-neutral-900">
                      {new Date(resident.leaseStart).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Lease End</span>
                    <span className="font-medium text-neutral-900">
                      {new Date(resident.leaseEnd).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-neutral-200">
                    <span className="text-neutral-600">Monthly Rent</span>
                    <span className="font-semibold text-neutral-900">${resident.rent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Security Deposit</span>
                    <span className="font-medium text-neutral-900">${resident.securityDeposit}</span>
                  </div>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Emergency Contact</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Name</span>
                    <span className="font-medium text-neutral-900">{resident.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Relationship</span>
                    <span className="font-medium text-neutral-900">{resident.emergencyContact.relationship}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Phone</span>
                    <span className="font-medium text-neutral-900">{resident.emergencyContact.phone}</span>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <div className="text-center">
                    <p className="text-xs text-neutral-600 mb-1">Total Paid</p>
                    <p className="text-2xl font-semibold text-neutral-900">
                      ${(payments.length * resident.rent).toLocaleString()}
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-xs text-neutral-600 mb-1">Requests</p>
                    <p className="text-2xl font-semibold text-neutral-900">{maintenanceRequests.length}</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-xs text-neutral-600 mb-1">Documents</p>
                    <p className="text-2xl font-semibold text-neutral-900">{documents.length}</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <Card>
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Recent Activity</h3>
                <Timeline items={timeline} />
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-3">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">${payment.amount}</p>
                      <p className="text-xs text-neutral-600">{payment.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="success">{payment.status}</Badge>
                    <p className="text-xs text-neutral-600 mt-1">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-3">
            {maintenanceRequests.map((request) => (
              <Card key={request.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{request.issue}</p>
                      <p className="text-xs text-neutral-600">
                        {new Date(request.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        request.priority === 'high'
                          ? 'error'
                          : request.priority === 'medium'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {request.priority}
                    </Badge>
                    <Badge variant="success">{request.status}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                      <p className="text-xs text-neutral-600">
                        {doc.category} • {doc.size} • {new Date(doc.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
