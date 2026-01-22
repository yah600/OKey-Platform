import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  DollarSign,
  Wrench,
  FileText,
  Calendar,
  MessageCircle,
  Bell,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  Download,
  ChevronRight,
  TrendingUp,
  Package,
  User,
  Building2,
  Receipt,
  Mail,
  Loader2,
  MapPin,
  Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { PaymentProcessor } from '@/components/payments/PaymentProcessor';
import { MaintenanceRequestForm } from '@/components/maintenance/MaintenanceRequestForm';
import {
  getLeasesByTenant,
  getUnitById,
  getPropertyById,
  getBillsByTenant,
  getUnpaidBills,
  calculateTotalDue,
  getIssuesByReporter,
  getTransactionsByUser,
  getDocumentsByUser,
  getNotificationsByUser,
  getUserById,
} from '@/lib/data/mockData';

// ============================================================================
// TYPES
// ============================================================================

interface Activity {
  id: string;
  type: 'payment' | 'maintenance' | 'document' | 'message' | 'lease';
  description: string;
  timestamp: string;
  status?: string;
  link?: string;
}

interface UpcomingEvent {
  id: string;
  type: 'payment' | 'maintenance' | 'lease' | 'building';
  title: string;
  date: string;
  amount?: number;
  daysUntil: number;
  urgency: 'high' | 'medium' | 'low';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TenantDashboardEnhanced() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{ amount: number; description: string } | null>(null);

  // Data state
  const [lease, setLease] = useState<any>(null);
  const [unit, setUnit] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [unpaidBills, setUnpaidBills] = useState<any[]>([]);
  const [totalDue, setTotalDue] = useState(0);
  const [issues, setIssues] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [propertyManager, setPropertyManager] = useState<any>(null);

  // Load tenant data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      // Get tenant's lease
      const tenantLeases = getLeasesByTenant(user.id);
      const activeLease = tenantLeases.find(l => l.status === 'active');

      if (activeLease) {
        setLease(activeLease);

        // Get unit and property
        const leaseUnit = getUnitById(activeLease.unit_id);
        if (leaseUnit) {
          setUnit(leaseUnit);
          const leaseProperty = getPropertyById(leaseUnit.property_id);
          if (leaseProperty) {
            setProperty(leaseProperty);

            // Get property manager
            const managerId = leaseProperty.manager_id || leaseProperty.owner_id;
            if (managerId) {
              const manager = getUserById(managerId);
              setPropertyManager(manager);
            }
          }
        }
      }

      // Get bills and calculate total due
      const bills = getUnpaidBills(user.id);
      setUnpaidBills(bills);
      const total = calculateTotalDue(user.id);
      setTotalDue(total);

      // Get maintenance requests
      const tenantIssues = getIssuesByReporter(user.id);
      setIssues(tenantIssues);

      // Get recent transactions (last 5)
      const transactions = getTransactionsByUser(user.id);
      setRecentTransactions(transactions.slice(0, 5));

      // Get documents
      const userDocuments = getDocumentsByUser(user.id);
      setDocuments(userDocuments);

      // Get notifications
      const userNotifications = getNotificationsByUser(user.id);
      setNotifications(userNotifications.filter(n => !n.read_at));

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // Calculate stats
  const nextPaymentBill = useMemo(() => {
    if (unpaidBills.length === 0) return null;
    return unpaidBills.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
  }, [unpaidBills]);

  const daysUntilPayment = useMemo(() => {
    if (!nextPaymentBill) return 0;
    const dueDate = new Date(nextPaymentBill.due_date);
    const today = new Date();
    return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [nextPaymentBill]);

  const paymentStatus = useMemo(() => {
    if (daysUntilPayment < 0) return 'overdue';
    if (daysUntilPayment < 5) return 'due_soon';
    return 'upcoming';
  }, [daysUntilPayment]);

  const openIssues = useMemo(() => {
    return issues.filter(i => i.status === 'open' || i.status === 'in_progress');
  }, [issues]);

  const leaseDaysRemaining = useMemo(() => {
    if (!lease) return 0;
    const endDate = new Date(lease.end_date);
    const today = new Date();
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [lease]);

  const leaseProgress = useMemo(() => {
    if (!lease) return 0;
    const start = new Date(lease.start_date).getTime();
    const end = new Date(lease.end_date).getTime();
    const today = new Date().getTime();
    return ((today - start) / (end - start)) * 100;
  }, [lease]);

  // Generate recent activity
  const recentActivity = useMemo(() => {
    const activities: Activity[] = [];

    // Add transactions
    recentTransactions.forEach(tx => {
      activities.push({
        id: tx.id,
        type: 'payment',
        description: `You paid $${tx.amount.toLocaleString()} for ${tx.description}`,
        timestamp: tx.created_at,
        status: tx.status,
      });
    });

    // Add maintenance requests
    issues.slice(0, 5).forEach(issue => {
      activities.push({
        id: issue.id,
        type: 'maintenance',
        description: `You submitted a maintenance request for "${issue.title}"`,
        timestamp: issue.created_at,
        status: issue.status,
      });
    });

    // Add documents (last 3)
    documents.slice(0, 3).forEach(doc => {
      activities.push({
        id: doc.id,
        type: 'document',
        description: `New document uploaded: "${doc.name}"`,
        timestamp: doc.uploaded_at,
      });
    });

    // Sort by timestamp (most recent first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
  }, [recentTransactions, issues, documents]);

  // Generate upcoming events
  const upcomingEvents = useMemo(() => {
    const events: UpcomingEvent[] = [];
    const today = new Date();

    // Add upcoming bill due dates
    unpaidBills.forEach(bill => {
      const dueDate = new Date(bill.due_date);
      const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil >= 0) {
        events.push({
          id: bill.id,
          type: 'payment',
          title: `Rent Payment Due`,
          date: bill.due_date,
          amount: bill.amount,
          daysUntil,
          urgency: daysUntil < 3 ? 'high' : daysUntil < 7 ? 'medium' : 'low',
        });
      }
    });

    // Add scheduled maintenance (if assigned but not completed)
    issues.forEach(issue => {
      if (issue.assigned_to && !issue.completed_at && issue.status === 'in_progress') {
        // Simulate scheduled date (in real app, would have scheduled_date field)
        const scheduledDate = new Date(issue.updated_at);
        scheduledDate.setDate(scheduledDate.getDate() + 2);
        const daysUntil = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil >= 0 && daysUntil <= 7) {
          events.push({
            id: issue.id,
            type: 'maintenance',
            title: `Maintenance: ${issue.title}`,
            date: scheduledDate.toISOString(),
            daysUntil,
            urgency: daysUntil < 2 ? 'high' : 'medium',
          });
        }
      }
    });

    // Add lease end date if within 90 days
    if (lease && leaseDaysRemaining <= 90 && leaseDaysRemaining > 0) {
      events.push({
        id: lease.id,
        type: 'lease',
        title: 'Lease Renewal Decision',
        date: lease.end_date,
        daysUntil: leaseDaysRemaining,
        urgency: leaseDaysRemaining < 30 ? 'high' : leaseDaysRemaining < 60 ? 'medium' : 'low',
      });
    }

    // Sort by date (soonest first)
    return events.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [unpaidBills, issues, lease, leaseDaysRemaining]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  // Handlers
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    // Refresh data in real app
    window.location.reload();
  };

  const handleMaintenanceSubmit = (data: any) => {
    console.log('Maintenance request submitted:', data);
    setShowMaintenanceModal(false);
    // In real app, would add to mockIssues and refresh
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // No active lease state
  if (!lease) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Active Lease Found</h2>
          <p className="text-gray-600 mb-6">
            You don't currently have an active lease. Contact your property manager or browse available properties.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Available Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-blue-100 text-sm mb-4">
            <button
              onClick={() => navigate('/')}
              className="hover:text-white flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Dashboard</span>
          </div>

          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.full_name.split(' ')[0]}!
          </h1>
          <p className="text-lg text-blue-100 mb-4">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-blue-100 text-sm">Your Unit</p>
              <p className="text-white font-semibold text-lg">
                Unit {unit?.unit_number}, {property?.name}
              </p>
            </div>
            <button
              onClick={() => navigate(`/property/${property?.id}`)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
            >
              View Property Details
            </button>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
        {/* Rent Overdue Alert */}
        {paymentStatus === 'overdue' && nextPaymentBill && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Rent Payment Overdue</h3>
              <p className="text-sm text-red-800 mt-1">
                You have overdue rent of ${nextPaymentBill.amount.toLocaleString()}. Please make a payment immediately to avoid late fees.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPayment({ amount: nextPaymentBill.amount, description: nextPaymentBill.description });
                setShowPaymentModal(true);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium whitespace-nowrap"
            >
              Pay Now
            </button>
          </div>
        )}

        {/* Lease Expiring Alert */}
        {leaseDaysRemaining <= 60 && leaseDaysRemaining > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Lease Expiring Soon</h3>
              <p className="text-sm text-blue-800 mt-1">
                Your lease expires in {leaseDaysRemaining} days. Contact your property manager about renewal options.
              </p>
            </div>
            <button
              onClick={() => setShowMessageModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
            >
              Contact Manager
            </button>
          </div>
        )}

        {/* Maintenance Update Alert */}
        {openIssues.some(i => {
          const lastUpdate = new Date(i.updated_at);
          const hoursSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
          return hoursSinceUpdate < 24 && i.status === 'in_progress';
        }) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Wrench className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Maintenance Request Update</h3>
              <p className="text-sm text-green-800 mt-1">
                Your maintenance request has been assigned to a technician and is in progress.
              </p>
            </div>
            <button
              onClick={() => navigate('/tenant/maintenance')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium whitespace-nowrap"
            >
              View Details
            </button>
          </div>
        )}
      </div>

      {/* Key Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Next Rent Payment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                paymentStatus === 'overdue' ? 'bg-red-100' :
                paymentStatus === 'due_soon' ? 'bg-orange-100' : 'bg-blue-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  paymentStatus === 'overdue' ? 'text-red-600' :
                  paymentStatus === 'due_soon' ? 'text-orange-600' : 'text-blue-600'
                }`} />
              </div>
              {paymentStatus === 'overdue' && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Overdue</span>
              )}
              {paymentStatus === 'due_soon' && (
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">Due Soon</span>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${nextPaymentBill ? nextPaymentBill.amount.toLocaleString() : '0'}
            </div>
            <div className="text-sm text-gray-600 mb-2">Next Payment Due</div>
            {nextPaymentBill && (
              <>
                <div className="text-xs text-gray-500 mb-3">
                  Due {formatDate(nextPaymentBill.due_date)} • {Math.abs(daysUntilPayment)} days {daysUntilPayment < 0 ? 'overdue' : 'remaining'}
                </div>
                <button
                  onClick={() => {
                    setSelectedPayment({ amount: nextPaymentBill.amount, description: nextPaymentBill.description });
                    setShowPaymentModal(true);
                  }}
                  className={`w-full px-4 py-2 rounded-lg font-medium text-sm ${
                    paymentStatus === 'overdue' ? 'bg-red-600 hover:bg-red-700' :
                    paymentStatus === 'due_soon' ? 'bg-orange-600 hover:bg-orange-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  Pay Now
                </button>
              </>
            )}
            {!nextPaymentBill && (
              <div className="bg-green-50 text-green-700 px-3 py-2 rounded text-xs font-medium">
                ✓ All Paid Up!
              </div>
            )}
          </div>

          {/* Card 2: Outstanding Balance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                totalDue > 0 ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <Receipt className={`w-6 h-6 ${
                  totalDue > 0 ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${totalDue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mb-2">Total Outstanding</div>
            <div className="text-xs text-gray-500 mb-3">
              {unpaidBills.length} unpaid {unpaidBills.length === 1 ? 'bill' : 'bills'}
            </div>
            {totalDue > 0 ? (
              <button
                onClick={() => {
                  setSelectedPayment({ amount: totalDue, description: 'Outstanding Balance Payment' });
                  setShowPaymentModal(true);
                }}
                className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium text-sm"
              >
                Make Payment
              </button>
            ) : (
              <div className="bg-green-50 text-green-700 px-3 py-2 rounded text-xs font-medium">
                ✓ No Outstanding Balance
              </div>
            )}
          </div>

          {/* Card 3: Maintenance Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {openIssues.length}
            </div>
            <div className="text-sm text-gray-600 mb-2">Open Requests</div>
            {openIssues.length > 0 && (
              <>
                <div className="text-xs text-gray-500 mb-1 truncate">
                  {openIssues[0].title}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  <span className={`inline-block px-2 py-0.5 rounded ${
                    openIssues[0].status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {openIssues[0].status.replace('_', ' ')}
                  </span>
                  {' '}• Updated {formatRelativeTime(openIssues[0].updated_at)}
                </div>
              </>
            )}
            <button
              onClick={() => navigate('/tenant/maintenance')}
              className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-sm mb-2"
            >
              View All
            </button>
            <button
              onClick={() => setShowMaintenanceModal(true)}
              className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm"
            >
              New Request
            </button>
          </div>

          {/* Card 4: Lease Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                leaseDaysRemaining < 30 ? 'bg-red-100' :
                leaseDaysRemaining < 90 ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <Calendar className={`w-6 h-6 ${
                  leaseDaysRemaining < 30 ? 'text-red-600' :
                  leaseDaysRemaining < 90 ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatDate(lease.end_date)}
            </div>
            <div className="text-sm text-gray-600 mb-2">Lease End Date</div>
            <div className="text-xs text-gray-500 mb-3">
              {leaseDaysRemaining} days remaining
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    leaseProgress > 90 ? 'bg-red-500' :
                    leaseProgress > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(leaseProgress, 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => navigate('/tenant/documents')}
              className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-sm"
            >
              View Lease
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setSelectedPayment({ amount: lease.monthly_rent, description: 'Monthly Rent Payment' });
                    setShowPaymentModal(true);
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <DollarSign className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-semibold text-gray-900 text-sm">Make a Payment</div>
                  <div className="text-xs text-gray-500 mt-1">Pay rent or charges</div>
                </button>

                <button
                  onClick={() => setShowMaintenanceModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left group"
                >
                  <Wrench className="w-6 h-6 text-orange-600 mb-2" />
                  <div className="font-semibold text-gray-900 text-sm">Report an Issue</div>
                  <div className="text-xs text-gray-500 mt-1">Request maintenance</div>
                </button>

                <button
                  onClick={() => navigate('/tenant/documents')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                >
                  <FileText className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="font-semibold text-gray-900 text-sm">My Documents</div>
                  <div className="text-xs text-gray-500 mt-1">Access files</div>
                </button>

                <button
                  onClick={() => setShowMessageModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                >
                  <MessageCircle className="w-6 h-6 text-green-600 mb-2" />
                  <div className="font-semibold text-gray-900 text-sm">Message Manager</div>
                  <div className="text-xs text-gray-500 mt-1">Contact property</div>
                </button>

                <button
                  onClick={() => navigate('/tenant/payments')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all text-left group"
                >
                  <Receipt className="w-6 h-6 text-cyan-600 mb-2" />
                  <div className="font-semibold text-gray-900 text-sm">Payment History</div>
                  <div className="text-xs text-gray-500 mt-1">View past payments</div>
                </button>

                <button
                  onClick={() => alert('Coming soon!')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
                >
                  <Calendar className="w-6 h-6 text-indigo-600 mb-2" />
                  <div className="font-semibold text-gray-900 text-sm">Schedule Viewing</div>
                  <div className="text-xs text-gray-500 mt-1">Book property tour</div>
                </button>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-green-600" />}
                        {activity.type === 'maintenance' && <Wrench className="w-5 h-5 text-orange-600" />}
                        {activity.type === 'document' && <FileText className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'message' && <MessageCircle className="w-5 h-5 text-purple-600" />}
                        {activity.type === 'lease' && <Calendar className="w-5 h-5 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Events Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming</h2>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <p className="font-medium text-gray-900 mb-1">No upcoming events</p>
                  <p className="text-sm">You're all set for now!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        event.urgency === 'high' ? 'border-red-500 bg-red-50' :
                        event.urgency === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {event.type === 'payment' && <DollarSign className="w-4 h-4 text-gray-600" />}
                            {event.type === 'maintenance' && <Wrench className="w-4 h-4 text-gray-600" />}
                            {event.type === 'lease' && <Calendar className="w-4 h-4 text-gray-600" />}
                            {event.type === 'building' && <Building2 className="w-4 h-4 text-gray-600" />}
                            <span className="font-semibold text-gray-900 text-sm">{event.title}</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {formatDate(event.date)} • In {event.daysUntil} {event.daysUntil === 1 ? 'day' : 'days'}
                          </p>
                          {event.amount && (
                            <p className="text-lg font-bold text-gray-900 mt-2">
                              ${event.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Property Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600" />
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Your Property</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Property</div>
                    <div className="font-semibold text-gray-900">{property?.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Unit</div>
                    <div className="font-semibold text-gray-900">Unit {unit?.unit_number}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Address</div>
                    <div className="text-sm text-gray-700">
                      {property?.address.street}<br />
                      {property?.address.city}, {property?.address.province}
                    </div>
                  </div>

                  {propertyManager && (
                    <div className="pt-3 border-t">
                      <div className="text-xs text-gray-500 mb-2">Property Manager</div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{propertyManager.full_name}</div>
                          <div className="text-xs text-gray-500">{propertyManager.role.replace('_', ' ')}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMessageModal(true)}
                        className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Contact
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips & Announcements */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm">Helpful Tip</h4>
                  <p className="text-sm text-blue-800">
                    Set up auto-pay to never miss a rent payment and maintain your excellent payment history!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPayment && (
          <PaymentProcessor
            amount={selectedPayment.amount}
            description={selectedPayment.description}
            onSuccess={handlePaymentSuccess}
            onCancel={() => {
              setShowPaymentModal(false);
              setSelectedPayment(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Maintenance Request Modal */}
      <AnimatePresence>
        {showMaintenanceModal && (
          <MaintenanceRequestForm
            onClose={() => setShowMaintenanceModal(false)}
            onSubmit={handleMaintenanceSubmit}
            propertyInfo={{
              name: property?.name || '',
              unit: unit?.unit_number || '',
            }}
          />
        )}
      </AnimatePresence>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Message Property Manager</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To: {propertyManager?.full_name || 'Property Manager'}
              </label>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
              />
              <textarea
                placeholder="Type your message here..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Message sent!');
                  setShowMessageModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
