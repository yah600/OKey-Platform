import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  DollarSign,
  Receipt,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Filter,
  Loader2,
  Plus,
  Trash2,
  Star,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { PaymentProcessor } from '@/components/payments/PaymentProcessor';
import {
  getBillsByTenant,
  getTransactionsByUser,
  calculateTotalDue,
  getLeasesByTenant,
} from '@/lib/data/mockData';

// ============================================================================
// TYPES
// ============================================================================

type TimePeriod = '30days' | '3months' | '6months' | '1year' | 'all';
type TransactionType = 'all' | 'rent' | 'late_fee' | 'other';
type TransactionStatus = 'all' | 'paid' | 'pending' | 'failed';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TenantPayments() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [unpaidBills, setUnpaidBills] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [totalDue, setTotalDue] = useState(0);
  const [lease, setLease] = useState<any>(null);

  // Filter state
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30days');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Auto-pay state
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'card-1',
      type: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2026',
      isDefault: true,
    },
    {
      id: 'card-2',
      type: 'mastercard',
      last4: '5555',
      expiryMonth: '09',
      expiryYear: '2025',
      isDefault: false,
    },
  ]);

  const itemsPerPage = 10;

  // Load data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      // Load unpaid bills
      const bills = getBillsByTenant(user.id).filter(b => b.status !== 'paid');
      setUnpaidBills(bills);

      // Calculate total due
      const total = calculateTotalDue(user.id);
      setTotalDue(total);

      // Load all transactions
      const transactions = getTransactionsByUser(user.id);
      setAllTransactions(transactions);

      // Load lease
      const leases = getLeasesByTenant(user.id);
      const activeLease = leases.find(l => l.status === 'active');
      setLease(activeLease);

      // Load auto-pay settings from localStorage
      const autoPaySettings = localStorage.getItem(`autoPay_${user.id}`);
      if (autoPaySettings) {
        const settings = JSON.parse(autoPaySettings);
        setAutoPayEnabled(settings.enabled);
      }

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // Calculate next payment
  const nextPayment = useMemo(() => {
    if (unpaidBills.length === 0) return null;
    return unpaidBills.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
  }, [unpaidBills]);

  // Filter transactions by time period
  const periodFilteredTransactions = useMemo(() => {
    if (selectedPeriod === 'all') return allTransactions;

    const now = new Date();
    const periodDays = {
      '30days': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365,
    };

    const days = periodDays[selectedPeriod];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return allTransactions.filter(tx => new Date(tx.created_at) >= cutoffDate);
  }, [allTransactions, selectedPeriod]);

  // Apply all filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...periodFilteredTransactions];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.description.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortColumn) {
        case 'date':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [periodFilteredTransactions, searchQuery, typeFilter, statusFilter, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Refresh data
    window.location.reload();
  };

  const toggleAutoPay = () => {
    const newValue = !autoPayEnabled;
    setAutoPayEnabled(newValue);

    // Save to localStorage
    if (user) {
      localStorage.setItem(
        `autoPay_${user.id}`,
        JSON.stringify({
          enabled: newValue,
          methodId: paymentMethods.find(m => m.isDefault)?.id || 'card-1',
          schedule: 'monthly',
        })
      );
    }

    // Show toast
    if (newValue) {
      const defaultMethod = paymentMethods.find(m => m.isDefault);
      alert(`Auto-pay enabled! We'll charge your ${defaultMethod?.type} ending in ${defaultMethod?.last4} on the 5th of each month.`);
    } else {
      alert('Auto-pay disabled.');
    }
  };

  const downloadReceipt = (transactionId: string) => {
    alert(`Receipt for Transaction #${transactionId} downloaded`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => navigate('/')}
              className="hover:text-blue-600 flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Payments</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
              <p className="text-gray-600 mt-1">Manage your rent payments and view history</p>
            </div>

            {/* Time Period Selector */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => {
                  setSelectedPeriod(e.target.value as TimePeriod);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10 cursor-pointer"
              >
                <option value="30days">Last 30 days</option>
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
                <option value="all">All time</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Outstanding Balance Card */}
        <div className={`rounded-xl shadow-sm border p-6 ${
          totalDue > 0 ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
        }`}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Balance & Breakdown */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  totalDue > 0 ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {totalDue > 0 ? (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-600 mb-1">Total Outstanding</h2>
                  <div className={`text-4xl font-bold ${
                    totalDue > 0 ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {formatCurrency(totalDue)}
                  </div>
                  {totalDue === 0 && (
                    <p className="text-sm text-green-700 mt-2">You're all paid up! 🎉</p>
                  )}
                </div>
              </div>

              {/* Breakdown */}
              {unpaidBills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Outstanding Bills:</h3>
                  {unpaidBills.map(bill => (
                    <div key={bill.id} className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{bill.description}</div>
                        <div className="text-xs text-gray-600">
                          Due {formatDate(bill.due_date)}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(bill.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Next Payment & Auto-Pay */}
            <div className="lg:w-80 space-y-4">
              {/* Next Payment */}
              {nextPayment && (
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Next Payment</h3>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(nextPayment.amount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Due {formatDate(nextPayment.due_date)}
                  </div>
                </div>
              )}

              {/* Auto-Pay Status */}
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Auto-Pay</h3>
                  </div>
                  {autoPayEnabled ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      Enabled
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      Disabled
                    </span>
                  )}
                </div>
                {autoPayEnabled ? (
                  <p className="text-sm text-gray-600 mb-3">
                    Charges on the 5th of each month
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mb-3">
                    Never miss a payment
                  </p>
                )}
                <button
                  onClick={toggleAutoPay}
                  className={`w-full px-4 py-2 rounded-lg font-medium text-sm ${
                    autoPayEnabled
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {autoPayEnabled ? 'Disable Auto-Pay' : 'Enable Auto-Pay'}
                </button>
              </div>

              {/* Pay Now Button */}
              {totalDue > 0 && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg shadow-blue-600/20 transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pay {formatCurrency(totalDue)} Now
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
            <button
              onClick={() => alert('Coming soon!')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Method
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`p-4 rounded-lg border-2 relative ${
                  method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                {method.isDefault && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                      Default
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center border">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 capitalize">
                      {method.type}
                    </div>
                    <div className="text-sm text-gray-600">•••• {method.last4}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as TransactionType);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="rent">Rent</option>
                <option value="late_fee">Late Fee</option>
                <option value="other">Other</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as TransactionStatus);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              {/* Results Count */}
              <div className="flex items-center justify-end text-sm text-gray-600">
                Showing {filteredTransactions.length} {filteredTransactions.length === 1 ? 'payment' : 'payments'}
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'No payments match your filters'
                  : 'No payment history yet'}
              </h3>
              <p className="text-gray-600">
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Your payments will appear here'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center gap-1">
                          Date
                          {sortColumn === 'date' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('description')}
                      >
                        <div className="flex items-center gap-1">
                          Description
                          {sortColumn === 'description' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center gap-1">
                          Amount
                          {sortColumn === 'amount' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {sortColumn === 'status' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {tx.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {tx.type.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'completed' || tx.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {tx.status === 'completed' ? 'Paid' : tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {(tx.status === 'completed' || tx.status === 'paid') && (
                            <button
                              onClick={() => downloadReceipt(tx.id)}
                              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y">
                {paginatedTransactions.map(tx => (
                  <div key={tx.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {tx.description}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(tx.created_at)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' || tx.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.status === 'completed' ? 'Paid' : tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(tx.amount)}
                      </div>
                      {(tx.status === 'completed' || tx.status === 'paid') && (
                        <button
                          onClick={() => downloadReceipt(tx.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Receipt
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      Next
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <PaymentProcessor
            amount={totalDue}
            description="Outstanding Balance Payment"
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
