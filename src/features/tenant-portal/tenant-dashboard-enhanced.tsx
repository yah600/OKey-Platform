import { useState } from 'react';
import {
  Home, DollarSign, Wrench, FileText, Calendar, CreditCard, MessageCircle,
  User, Bell, Settings, CheckCircle2, Clock, AlertCircle, Download, Upload,
  Eye, TrendingDown, TrendingUp, Package, Shield, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PaymentProcessor } from '@/components/payments/PaymentProcessor';
import { MaintenanceRequestForm } from '@/components/maintenance/MaintenanceRequestForm';
import { DocumentManager } from '@/components/documents/DocumentManager';
import { MessageCenter } from '@/components/messaging/MessageCenter';

interface TenantDashboardEnhancedProps {
  onNavigate: (route: string, id?: string) => void;
}

type Tab = 'overview' | 'payments' | 'maintenance' | 'documents' | 'lease' | 'messages';

export function TenantDashboardEnhanced({ onNavigate }: TenantDashboardEnhancedProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{ amount: number; description: string } | null>(null);

  // Mock tenant data
  const tenant = {
    name: 'Jean Tremblay',
    email: 'jean.tremblay@email.com',
    phone: '(514) 555-0200',
    unit: '4B',
    property: 'The Maxwell',
    address: '1200 Rue Saint-Antoine Ouest, Montreal',
    leaseStart: '2025-02-01',
    leaseEnd: '2026-02-01',
    monthlyRent: 2400,
    nextPaymentDue: '2026-02-01',
    score: 720,
    autopayEnabled: true,
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'lease', label: 'Lease Info', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  const stats = [
    { label: 'Monthly Rent', value: `$${tenant.monthlyRent.toLocaleString()}`, icon: DollarSign, color: 'blue', trend: null },
    { label: 'O\'Key Score', value: tenant.score, icon: Star, color: 'purple', trend: '+15' },
    { label: 'Next Payment', value: new Date(tenant.nextPaymentDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), icon: Calendar, color: 'green', trend: null },
    { label: 'Open Requests', value: '2', icon: Wrench, color: 'orange', trend: null },
  ];

  const upcomingPayments = [
    { date: '2026-02-01', amount: 2400, status: 'pending', dueIn: '10 days' },
    { date: '2026-03-01', amount: 2400, status: 'scheduled', dueIn: '40 days' },
    { date: '2026-04-01', amount: 2400, status: 'scheduled', dueIn: '70 days' },
  ];

  const recentPayments = [
    { date: '2026-01-01', amount: 2400, status: 'paid', method: 'Auto-pay', confirmationId: 'PMT-2401-001' },
    { date: '2025-12-01', amount: 2400, status: 'paid', method: 'Credit Card', confirmationId: 'PMT-2312-045' },
    { date: '2025-11-01', amount: 2400, status: 'paid', method: 'Auto-pay', confirmationId: 'PMT-2311-089' },
    { date: '2025-10-01', amount: 2400, status: 'paid', method: 'Auto-pay', confirmationId: 'PMT-2310-123' },
  ];

  const maintenanceRequests = [
    {
      id: 'MR-001',
      title: 'Leaky faucet in kitchen',
      status: 'in_progress',
      priority: 'medium',
      submittedDate: '2026-01-15',
      assignedTo: 'ABC Plumbing',
      estimatedCompletion: '2026-01-23',
    },
    {
      id: 'MR-002',
      title: 'Heating not working properly',
      status: 'pending',
      priority: 'high',
      submittedDate: '2026-01-18',
      assignedTo: null,
      estimatedCompletion: null,
    },
    {
      id: 'MR-003',
      title: 'Light fixture replacement',
      status: 'completed',
      priority: 'low',
      submittedDate: '2026-01-05',
      assignedTo: 'Electric Pro',
      completedDate: '2026-01-08',
    },
  ];

  const documents = [
    { id: 'doc-1', name: 'Lease Agreement.pdf', type: 'application/pdf', category: 'lease', size: '245 KB', uploadedDate: '2025-02-01' },
    { id: 'doc-2', name: 'Move-in Inspection Report.pdf', type: 'application/pdf', category: 'inspection', size: '1.2 MB', uploadedDate: '2025-02-01' },
    { id: 'doc-3', name: 'Parking Pass.pdf', type: 'application/pdf', category: 'other', size: '89 KB', uploadedDate: '2025-02-05' },
    { id: 'doc-4', name: 'Building Rules & Regulations.pdf', type: 'application/pdf', category: 'other', size: '156 KB', uploadedDate: '2025-02-01' },
    { id: 'doc-5', name: 'January Rent Receipt.pdf', type: 'application/pdf', category: 'invoice', size: '128 KB', uploadedDate: '2026-01-05' },
    { id: 'doc-6', name: 'Insurance Policy.pdf', type: 'application/pdf', category: 'insurance', size: '892 KB', uploadedDate: '2025-02-10' },
  ];

  const handleDocumentUpload = (file: File, category: string) => {
    console.log('Uploading document:', file.name, 'Category:', category);
    // In real app, this would upload to backend
  };

  const handleDocumentDelete = (id: string) => {
    console.log('Deleting document:', id);
    // In real app, this would delete from backend
  };

  const handleDocumentDownload = (id: string) => {
    console.log('Downloading document:', id);
    // In real app, this would download from backend
  };

  const handleMaintenanceSubmit = (data: any) => {
    console.log('Maintenance request submitted:', data);
    setShowMaintenanceForm(false);
    // In real app, this would submit to backend
  };

  const messages = [
    { from: 'Property Manager', subject: 'Building maintenance on Feb 1st', date: '2026-01-20', unread: true },
    { from: 'Maintenance Team', subject: 'Your request has been assigned', date: '2026-01-18', unread: true },
    { from: 'Property Manager', subject: 'Rent payment confirmation', date: '2026-01-01', unread: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {tenant.name.split(' ')[0]}!</h1>
                <p className="text-gray-600">Unit {tenant.unit} • {tenant.property}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 pl-4 border-l">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {tenant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const colors = {
                  blue: 'from-blue-500 to-blue-600',
                  purple: 'from-purple-500 to-purple-600',
                  green: 'from-green-500 to-green-600',
                  orange: 'from-orange-500 to-orange-600',
                };
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colors[stat.color as keyof typeof colors]} rounded-lg flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {stat.trend && (
                        <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {stat.trend}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 whitespace-nowrap font-medium transition-all ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === 'messages' && (
                      <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">2</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSelectedPayment({ amount: tenant.monthlyRent, description: 'Monthly Rent Payment' });
                        setShowPaymentModal(true);
                      }}
                      className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                    >
                      <DollarSign className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                      <div className="font-medium text-gray-900">Make Payment</div>
                      <div className="text-xs text-gray-500">Pay your rent online</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('maintenance')}
                      className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                    >
                      <Wrench className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                      <div className="font-medium text-gray-900">New Request</div>
                      <div className="text-xs text-gray-500">Submit maintenance</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                    >
                      <FileText className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                      <div className="font-medium text-gray-900">View Documents</div>
                      <div className="text-xs text-gray-500">Access your files</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                    >
                      <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                      <div className="font-medium text-gray-900">Contact Manager</div>
                      <div className="text-xs text-gray-500">Send a message</div>
                    </button>
                  </div>
                </div>

                {/* Upcoming Payments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-transparent">
                    <h2 className="text-lg font-bold text-gray-900">Upcoming Payments</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {upcomingPayments.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              payment.status === 'pending' ? 'bg-orange-100' : 'bg-gray-200'
                            }`}>
                              <Calendar className={`w-6 h-6 ${
                                payment.status === 'pending' ? 'text-orange-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {new Date(payment.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="text-sm text-gray-600">Due in {payment.dueIn}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              ${payment.amount.toLocaleString()}
                            </div>
                            {payment.status === 'pending' && (
                              <button
                                onClick={() => {
                                  setSelectedPayment({ amount: payment.amount, description: `Rent Payment - ${new Date(payment.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` });
                                  setShowPaymentModal(true);
                                }}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium transition-colors"
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {tenant.autopayEnabled && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">Auto-pay is enabled</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Maintenance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-transparent">
                    <h2 className="text-lg font-bold text-gray-900">Active Maintenance Requests</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {maintenanceRequests.filter(r => r.status !== 'completed').map((request) => (
                        <div key={request.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{request.title}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  request.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {request.priority}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {request.status.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Submitted {new Date(request.submittedDate).toLocaleDateString()}
                              </div>
                              {request.assignedTo && (
                                <div className="text-sm text-gray-600 mt-1">
                                  Assigned to: <span className="font-medium">{request.assignedTo}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowMaintenanceForm(true)}
                      className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all"
                    >
                      + New Maintenance Request
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar - 1 column */}
              <div className="space-y-6">
                {/* O'Key Score */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl shadow-lg text-white p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20">
                        <div>
                          <div className="text-4xl font-bold">{tenant.score}</div>
                          <div className="text-xs opacity-90">/ 850</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm opacity-90 mb-1">Your O'Key Score</div>
                    <div className="text-lg font-semibold mb-4">Excellent Standing</div>
                    <button
                      onClick={() => onNavigate('score')}
                      className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Lease Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    Lease Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Property</div>
                      <div className="font-medium text-gray-900">{tenant.property}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Unit</div>
                      <div className="font-medium text-gray-900">{tenant.unit}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Lease Period</div>
                      <div className="font-medium text-gray-900 text-sm">
                        {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="text-xs text-gray-500 mb-1">Monthly Rent</div>
                      <div className="text-2xl font-bold text-blue-600">${tenant.monthlyRent}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('lease')}
                    className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    View Full Lease
                  </button>
                </div>

                {/* Recent Messages */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    Recent Messages
                  </h3>
                  <div className="space-y-3">
                    {messages.slice(0, 3).map((msg, index) => (
                      <div key={index} className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                        msg.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between mb-1">
                          <div className="font-medium text-sm text-gray-900">{msg.from}</div>
                          {msg.unread && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{msg.subject}</div>
                        <div className="text-xs text-gray-500">{new Date(msg.date).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="w-full mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                  >
                    View All Messages
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Management</h2>

                {/* Payment Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="text-sm text-green-700 mb-1">Total Paid (YTD)</div>
                    <div className="text-3xl font-bold text-green-700">$24,000</div>
                    <div className="text-xs text-green-600 mt-2">10 payments</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-700 mb-1">Next Payment</div>
                    <div className="text-3xl font-bold text-blue-700">${tenant.monthlyRent}</div>
                    <div className="text-xs text-blue-600 mt-2">Due {new Date(tenant.nextPaymentDue).toLocaleDateString()}</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                    <div className="text-sm text-purple-700 mb-1">Payment History</div>
                    <div className="text-3xl font-bold text-purple-700">100%</div>
                    <div className="text-xs text-purple-600 mt-2">On-time rate</div>
                  </div>
                </div>

                {/* Payment History */}
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment History</h3>
                <div className="space-y-3">
                  {recentPayments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {new Date(payment.date).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-600">{payment.method} • {payment.confirmationId}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">${payment.amount.toLocaleString()}</div>
                        <div className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Paid
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Maintenance Requests</h2>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-600/20">
                    + New Request
                  </button>
                </div>

                <div className="space-y-4">
                  {maintenanceRequests.map((request) => (
                    <div key={request.id} className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{request.title}</h3>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                              request.priority === 'high' ? 'bg-red-100 text-red-700' :
                              request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {request.priority} priority
                            </span>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                              request.status === 'completed' ? 'bg-green-100 text-green-700' :
                              request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {request.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Request ID: {request.id}</div>
                            <div>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</div>
                            {request.assignedTo && (
                              <div>Assigned to: <span className="font-medium">{request.assignedTo}</span></div>
                            )}
                            {request.estimatedCompletion && (
                              <div>Estimated completion: {new Date(request.estimatedCompletion).toLocaleDateString()}</div>
                            )}
                            {request.completedDate && (
                              <div>Completed: {new Date(request.completedDate).toLocaleDateString()}</div>
                            )}
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <DocumentManager
              documents={documents}
              onUpload={handleDocumentUpload}
              onDelete={handleDocumentDelete}
              onDownload={handleDocumentDownload}
              userRole="tenant"
            />
          )}

          {activeTab === 'lease' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lease Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-2">Property & Unit</div>
                    <div className="text-xl font-bold text-gray-900">{tenant.property} - {tenant.unit}</div>
                    <div className="text-sm text-gray-600 mt-2">{tenant.address}</div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-2">Lease Period</div>
                    <div className="text-xl font-bold text-gray-900">
                      {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">12 month term</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 border rounded-xl">
                    <div className="font-bold text-gray-900 mb-2">Rent Details</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Rent</span>
                        <span className="font-semibold">${tenant.monthlyRent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Due Date</span>
                        <span className="font-semibold">1st of each month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Late Fee</span>
                        <span className="font-semibold">$50 after 5 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border rounded-xl">
                    <div className="font-bold text-gray-900 mb-2">Security Deposit</div>
                    <div className="text-2xl font-bold text-blue-600">${tenant.monthlyRent}</div>
                    <div className="text-sm text-gray-600 mt-1">Refundable at lease end</div>
                  </div>

                  <button className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Full Lease Agreement
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <MessageCenter currentUserId="user-3" currentUserRole="tenant" />
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPayment && (
          <PaymentProcessor
            amount={selectedPayment.amount}
            description={selectedPayment.description}
            onSuccess={() => {
              setShowPaymentModal(false);
              setSelectedPayment(null);
              // In real app, would refresh payment data
            }}
            onCancel={() => {
              setShowPaymentModal(false);
              setSelectedPayment(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Maintenance Form Modal */}
      <AnimatePresence>
        {showMaintenanceForm && (
          <MaintenanceRequestForm
            onClose={() => setShowMaintenanceForm(false)}
            onSubmit={handleMaintenanceSubmit}
            propertyInfo={{
              name: tenant.property,
              unit: tenant.unit,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
