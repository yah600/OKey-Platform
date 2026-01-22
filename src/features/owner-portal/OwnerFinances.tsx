import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp, TrendingDown, DollarSign, AlertCircle, Download, FileText, Plus, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPropertiesByOwner, getTransactionsByProperty, getBillsByProperty } from '@/lib/data/mockData';

type TimePeriod = 'month' | '3months' | '6months' | 'year' | 'lastyear' | 'custom';
type TransactionTab = 'all' | 'income' | 'expenses' | 'pending';
type TransactionType = 'payment' | 'expense' | 'late_fee' | 'refund';
type ExpenseCategory = 'maintenance' | 'utilities' | 'fees' | 'insurance' | 'legal' | 'marketing' | 'other';

interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  property_id: string;
  category: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export function OwnerFinances() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [activeTab, setActiveTab] = useState<TransactionTab>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Modals
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);

  // Add Expense form
  const [expenseForm, setExpenseForm] = useState({
    type: 'maintenance' as ExpenseCategory,
    property_id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    description: '',
    category: 'operating',
    payment_method: 'bank_transfer',
  });
  const [expenseErrors, setExpenseErrors] = useState<any>({});

  // Generate Report form
  const [reportForm, setReportForm] = useState({
    type: 'pl',
    period: 'month' as TimePeriod,
    properties: [] as string[],
    format: 'pdf',
  });

  useEffect(() => {
    if (!user) return;
    const owned = getPropertiesByOwner(user.id);
    setProperties(owned);

    // Load transactions
    const allTransactions: Transaction[] = [];
    owned.forEach(property => {
      const propertyTransactions = getTransactionsByProperty(property.id);
      propertyTransactions.forEach((tx: any) => {
        allTransactions.push({
          id: tx.id,
          date: tx.created_at,
          type: tx.type === 'expense' ? 'expense' : 'payment',
          description: tx.description,
          property_id: property.id,
          category: tx.type === 'expense' ? tx.category || 'other' : 'rent',
          amount: tx.amount,
          status: tx.status || 'completed',
        });
      });
    });
    setTransactions(allTransactions);
  }, [user]);

  // Calculate date range based on period
  const dateRange = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (timePeriod) {
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'lastyear':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        return { start: startDate, end: new Date(now.getFullYear() - 1, 11, 31) };
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return { start: startDate, end: now };
  }, [timePeriod]);

  // Filter transactions by period and property
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const inDateRange = txDate >= dateRange.start && txDate <= dateRange.end;
      const inProperty = selectedProperty === 'all' || tx.property_id === selectedProperty;
      return inDateRange && inProperty;
    });

    // Filter by tab
    if (activeTab === 'income') {
      filtered = filtered.filter(tx => tx.type === 'payment' || tx.type === 'late_fee');
    } else if (activeTab === 'expenses') {
      filtered = filtered.filter(tx => tx.type === 'expense');
    } else if (activeTab === 'pending') {
      filtered = filtered.filter(tx => tx.status === 'pending');
    }

    // Apply additional filters
    if (searchQuery) {
      filtered = filtered.filter(tx =>
        tx.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tx => tx.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortOrder === 'desc' ? diff : -diff;
      } else {
        const diff = b.amount - a.amount;
        return sortOrder === 'desc' ? diff : -diff;
      }
    });

    return filtered;
  }, [transactions, dateRange, selectedProperty, activeTab, searchQuery, typeFilter, categoryFilter, statusFilter, sortBy, sortOrder]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const income = filteredTransactions
      .filter(tx => tx.type === 'payment' || tx.type === 'late_fee')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = filteredTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const netIncome = income - expenses;

    // Calculate outstanding receivables
    const allBills: any[] = [];
    properties.forEach(prop => {
      const bills = getBillsByProperty(prop.id);
      allBills.push(...bills);
    });
    const outstanding = allBills
      .filter(b => b.status !== 'paid' && new Date(b.due_date) < new Date())
      .reduce((sum, b) => sum + b.amount_due, 0);

    // Mock trend calculation (12.5% increase)
    const incomeTrend = 12.5;
    const expensesTrend = 5.2;
    const netTrend = 18.3;

    return { income, expenses, netIncome, outstanding, incomeTrend, expensesTrend, netTrend };
  }, [filteredTransactions, properties]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const expensesByCategory: any = {};
    filteredTransactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
      });

    const total = Object.values(expensesByCategory).reduce((sum: number, val: any) => sum + val, 0) as number;

    return Object.entries(expensesByCategory).map(([category, amount]: [string, any]) => ({
      category,
      amount,
      percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : '0',
    }));
  }, [filteredTransactions]);

  // Pagination
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Handle add expense
  const handleAddExpense = () => {
    const errors: any = {};
    if (!expenseForm.property_id) errors.property_id = 'Property is required';
    if (!expenseForm.amount || parseFloat(expenseForm.amount) <= 0) errors.amount = 'Valid amount is required';
    if (!expenseForm.vendor) errors.vendor = 'Vendor is required';
    if (!expenseForm.description) errors.description = 'Description is required';

    if (Object.keys(errors).length > 0) {
      setExpenseErrors(errors);
      return;
    }

    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      date: expenseForm.date,
      type: 'expense',
      description: expenseForm.description,
      property_id: expenseForm.property_id,
      category: expenseForm.type,
      amount: parseFloat(expenseForm.amount),
      status: 'completed',
    };

    setTransactions([newTransaction, ...transactions]);
    setShowAddExpense(false);
    setExpenseForm({
      type: 'maintenance',
      property_id: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      description: '',
      category: 'operating',
      payment_method: 'bank_transfer',
    });
    setExpenseErrors({});
    alert('Expense recorded successfully!');
  };

  // Handle generate report
  const handleGenerateReport = () => {
    if (reportForm.properties.length === 0) {
      alert('Please select at least one property');
      return;
    }
    setTimeout(() => {
      alert(`${reportForm.type.toUpperCase()} report generated and downloaded as ${reportForm.format.toUpperCase()}`);
      setShowGenerateReport(false);
    }, 1000);
  };

  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.name || 'Unknown';
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-green-100 text-green-700';
      case 'expense': return 'bg-red-100 text-red-700';
      case 'late_fee': return 'bg-yellow-100 text-yellow-700';
      case 'refund': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Finances</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
              <p className="text-gray-600 mt-1">Track revenue, expenses, and financial performance</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                QuickBooks (Soon)
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            {properties.length > 1 && (
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Properties</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}

            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="month">This Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">This Year</option>
              <option value="lastyear">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">${metrics.income.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">+{metrics.incomeTrend}%</span>
              <span className="text-gray-500">vs previous period</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">From {filteredTransactions.filter(tx => tx.type === 'payment').length} payments</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Expenses</span>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">${metrics.expenses.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span className="text-red-600 font-medium">+{metrics.expensesTrend}%</span>
              <span className="text-gray-500">vs previous period</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Maintenance, utilities, fees</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Net Income</span>
              <DollarSign className={`w-5 h-5 ${metrics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className={`text-3xl font-bold ${metrics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(metrics.netIncome).toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">+{metrics.netTrend}%</span>
              <span className="text-gray-500">vs previous period</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Revenue - Expenses</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Outstanding</span>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">${metrics.outstanding.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-gray-500">Overdue payments</span>
            </div>
            <button className="text-xs text-blue-600 hover:underline mt-1">View Details</button>
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h2>
            <div className="space-y-3">
              {categoryBreakdown.map(item => (
                <div key={item.category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 capitalize">{item.category}</span>
                    <span className="font-medium text-gray-900">${item.amount.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setShowAddExpense(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Record Expense
          </button>
          <button
            onClick={() => setShowGenerateReport(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex gap-8 px-6">
              {(['all', 'income', 'expenses', 'pending'] as TransactionTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {tab === 'pending' && metrics.outstanding > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                      ${metrics.outstanding.toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="payment">Payment</option>
                <option value="expense">Expense</option>
                <option value="late_fee">Late Fee</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="rent">Rent</option>
                <option value="maintenance">Maintenance</option>
                <option value="utilities">Utilities</option>
                <option value="fees">Fees</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split('-');
                  setSortBy(by as 'date' | 'amount');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  {properties.length > 1 && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={properties.length > 1 ? 7 : 6} className="px-6 py-12 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeBadgeColor(tx.type)}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{tx.description}</td>
                      {properties.length > 1 && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {getPropertyName(tx.property_id)}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {tx.category}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        tx.type === 'expense' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {tx.type === 'expense' ? '-' : '+'}${tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadgeColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Record Expense</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type *</label>
                  <select
                    value={expenseForm.type}
                    onChange={(e) => setExpenseForm({...expenseForm, type: e.target.value as ExpenseCategory})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="utilities">Utilities</option>
                    <option value="insurance">Insurance</option>
                    <option value="fees">Property Management</option>
                    <option value="legal">Legal</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                  <select
                    value={expenseForm.property_id}
                    onChange={(e) => setExpenseForm({...expenseForm, property_id: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      expenseErrors.property_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {expenseErrors.property_id && (
                    <p className="text-red-500 text-xs mt-1">{expenseErrors.property_id}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                      className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        expenseErrors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {expenseErrors.amount && (
                    <p className="text-red-500 text-xs mt-1">{expenseErrors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Payee *</label>
                <input
                  type="text"
                  value={expenseForm.vendor}
                  onChange={(e) => setExpenseForm({...expenseForm, vendor: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    expenseErrors.vendor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ABC Plumbing"
                />
                {expenseErrors.vendor && (
                  <p className="text-red-500 text-xs mt-1">{expenseErrors.vendor}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    expenseErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the expense..."
                />
                {expenseErrors.description && (
                  <p className="text-red-500 text-xs mt-1">{expenseErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="operating">Operating Expense</option>
                    <option value="capital">Capital Improvement</option>
                    <option value="emergency">Emergency Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={expenseForm.payment_method}
                    onChange={(e) => setExpenseForm({...expenseForm, payment_method: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddExpense(false);
                  setExpenseErrors({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Record Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Generate Financial Report</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <div className="space-y-2">
                  {[
                    { value: 'pl', label: 'Profit & Loss (P&L) Statement' },
                    { value: 'cashflow', label: 'Cash Flow Statement' },
                    { value: 'balance', label: 'Balance Sheet' },
                    { value: 'tax', label: 'Tax Summary' },
                  ].map(type => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="reportType"
                        value={type.value}
                        checked={reportForm.type === type.value}
                        onChange={(e) => setReportForm({...reportForm, type: e.target.value})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                <select
                  value={reportForm.period}
                  onChange={(e) => setReportForm({...reportForm, period: e.target.value as TimePeriod})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="month">This Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="year">This Year</option>
                  <option value="lastyear">Last Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Properties to Include</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {properties.map(prop => (
                    <label key={prop.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportForm.properties.includes(prop.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReportForm({...reportForm, properties: [...reportForm.properties, prop.id]});
                          } else {
                            setReportForm({...reportForm, properties: reportForm.properties.filter(id => id !== prop.id)});
                          }
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{prop.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <div className="flex gap-4">
                  {['pdf', 'excel', 'csv'].map(format => (
                    <label key={format} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={reportForm.format === format}
                        onChange={(e) => setReportForm({...reportForm, format: e.target.value})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 uppercase">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowGenerateReport(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
