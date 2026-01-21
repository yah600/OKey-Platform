import { DollarSign, Home, Wrench, FileText, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface TenantDashboardProps {
  onNavigate: (route: string, id?: string) => void;
}

export function TenantDashboard({ onNavigate }: TenantDashboardProps) {
  // Mock tenant data - in real app would come from API
  const tenant = {
    name: 'Jean Tremblay',
    unit: '4B - The Maxwell',
    address: '1200 Rue Saint-Antoine Ouest, Montreal',
    leaseStart: '2025-02-01',
    leaseEnd: '2026-02-01',
    monthlyRent: 2400,
    nextPaymentDue: '2026-02-01',
    score: 720,
  };

  const upcomingPayments = [
    { date: '2026-02-01', amount: 2400, status: 'pending' },
    { date: '2026-03-01', amount: 2400, status: 'scheduled' },
  ];

  const maintenanceRequests = [
    {
      id: '1',
      title: 'Leaky faucet in kitchen',
      status: 'in_progress',
      date: '2026-01-15',
      priority: 'medium',
    },
    {
      id: '2',
      title: 'Heating not working properly',
      status: 'completed',
      date: '2026-01-10',
      priority: 'high',
    },
  ];

  const recentPayments = [
    { date: '2026-01-01', amount: 2400, status: 'paid', method: 'Auto-pay' },
    { date: '2025-12-01', amount: 2400, status: 'paid', method: 'Credit Card' },
    { date: '2025-11-01', amount: 2400, status: 'paid', method: 'Auto-pay' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Tenant Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome back, {tenant.name}!</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="text-2xl font-bold">{tenant.unit}</div>
              <div className="text-sm text-gray-600">Your Unit</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold">${tenant.monthlyRent}</div>
              <div className="text-sm text-gray-600">Monthly Rent</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold">{new Date(tenant.nextPaymentDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              <div className="text-sm text-gray-600">Next Payment</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold">{maintenanceRequests.filter(r => r.status !== 'completed').length}</div>
              <div className="text-sm text-gray-600">Open Requests</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Payments */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Upcoming Payments</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            payment.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            <DollarSign className={`w-6 h-6 ${
                              payment.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium">
                              {new Date(payment.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">{payment.status}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-teal-600">
                            ${payment.amount.toLocaleString()}
                          </div>
                          {payment.status === 'pending' && (
                            <button className="mt-2 px-4 py-1 bg-teal-600 text-white text-sm rounded hover:bg-teal-700">
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Maintenance Requests */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Maintenance Requests</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {maintenanceRequests.map((request) => (
                      <div key={request.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            request.status === 'completed' ? 'bg-green-100' :
                            request.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            {request.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : request.status === 'in_progress' ? (
                              <Clock className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Wrench className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{request.title}</div>
                            <div className="text-sm text-gray-600">
                              Submitted {new Date(request.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-1 text-xs rounded ${
                                request.status === 'completed' ? 'bg-green-100 text-green-700' :
                                request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {request.status.replace('_', ' ')}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                request.priority === 'high' ? 'bg-red-100 text-red-700' :
                                request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {request.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-teal-500 hover:text-teal-600 font-medium">
                    + New Maintenance Request
                  </button>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Recent Payments</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {recentPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium">
                              {new Date(payment.date).toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-600">{payment.method}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${payment.amount.toLocaleString()}</div>
                          <div className="text-sm text-green-600">Paid</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Lease Information */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold">Lease Information</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Property</div>
                    <div className="font-medium">{tenant.unit}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Address</div>
                    <div className="font-medium text-sm">{tenant.address}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Lease Period</div>
                    <div className="font-medium">
                      {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Monthly Rent</div>
                    <div className="text-xl font-bold text-teal-600">${tenant.monthlyRent}</div>
                  </div>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Lease
                  </button>
                </div>
              </div>

              {/* Your O'Key Score */}
              <div className="bg-gradient-to-br from-teal-600 to-teal-400 rounded-lg shadow-sm text-white">
                <div className="p-6">
                  <div className="text-center">
                    <div className="text-sm opacity-90 mb-2">Your O'Key Score</div>
                    <div className="text-5xl font-bold mb-2">{tenant.score}</div>
                    <div className="text-sm opacity-90 mb-4">Excellent Standing</div>
                    <button
                      onClick={() => onNavigate('score')}
                      className="w-full px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-gray-100 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-2">
                  <button className="w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-3">
                    <DollarSign className="w-4 h-4" />
                    Make a Payment
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-3">
                    <Wrench className="w-4 h-4" />
                    Request Maintenance
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    View Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
