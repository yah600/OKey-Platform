import { useState } from 'react';
import { motion } from 'motion/react';
import {
  DollarSign, TrendingUp, TrendingDown, Calendar, Download, Upload, Plus,
  Search, Filter, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle,
  CreditCard, Building2, Receipt, PieChart, BarChart3, FileSpreadsheet
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  property: string;
  unit?: string;
  tenant?: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  receiptUrl?: string;
  notes?: string;
}

interface Budget {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
}

export function FinancialManagement() {
  const [activeView, setActiveView] = useState<'overview' | 'transactions' | 'budget' | 'reports'>('overview');
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // Mock financial data
  const financialSummary = {
    totalIncome: 28800,
    totalExpenses: 8450,
    netIncome: 20350,
    occupancyRate: 94,
    collectionRate: 98,
    avgRentPerUnit: 2400,
    outstandingBalance: 4800,
    monthlyGrowth: 12.5,
  };

  const incomeBreakdown = [
    { category: 'Rent Payments', amount: 26400, percentage: 91.7 },
    { category: 'Late Fees', amount: 800, percentage: 2.8 },
    { category: 'Parking Fees', amount: 1200, percentage: 4.2 },
    { category: 'Other Income', amount: 400, percentage: 1.3 },
  ];

  const expenseBreakdown = [
    { category: 'Maintenance & Repairs', amount: 3200, percentage: 37.9 },
    { category: 'Property Management', amount: 2400, percentage: 28.4 },
    { category: 'Insurance', amount: 1200, percentage: 14.2 },
    { category: 'Property Tax', amount: 800, percentage: 9.5 },
    { category: 'Utilities', amount: 600, percentage: 7.1 },
    { category: 'Other', amount: 250, percentage: 3.0 },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: 'txn-1',
      date: '2026-01-01',
      type: 'income',
      category: 'Rent Payment',
      description: 'January rent',
      property: 'The Maxwell',
      unit: '4B',
      tenant: 'Jean Tremblay',
      amount: 2400,
      paymentMethod: 'Auto-pay',
      status: 'completed',
    },
    {
      id: 'txn-2',
      date: '2026-01-15',
      type: 'expense',
      category: 'Maintenance',
      description: 'Plumbing repair - Kitchen faucet',
      property: 'The Maxwell',
      unit: '4B',
      amount: 450,
      paymentMethod: 'Check',
      status: 'completed',
    },
    {
      id: 'txn-3',
      date: '2026-01-01',
      type: 'income',
      category: 'Rent Payment',
      description: 'January rent',
      property: 'Riverside Commons',
      unit: '12A',
      tenant: 'Sophie Gagnon',
      amount: 1850,
      paymentMethod: 'Credit Card',
      status: 'completed',
    },
    {
      id: 'txn-4',
      date: '2026-01-20',
      type: 'expense',
      category: 'Insurance',
      description: 'Property insurance premium',
      property: 'All Properties',
      amount: 1200,
      paymentMethod: 'Bank Transfer',
      status: 'completed',
    },
    {
      id: 'txn-5',
      date: '2026-01-05',
      type: 'expense',
      category: 'Utilities',
      description: 'Common area electricity',
      property: 'The Maxwell',
      amount: 350,
      paymentMethod: 'Auto-pay',
      status: 'completed',
    },
  ];

  const budgetData: Budget[] = [
    { category: 'Maintenance', budgeted: 3500, actual: 3200, variance: 300 },
    { category: 'Management Fees', budgeted: 2400, actual: 2400, variance: 0 },
    { category: 'Insurance', budgeted: 1200, actual: 1200, variance: 0 },
    { category: 'Property Tax', budgeted: 800, actual: 800, variance: 0 },
    { category: 'Utilities', budgeted: 700, actual: 600, variance: 100 },
    { category: 'Marketing', budgeted: 500, actual: 250, variance: 250 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Financial Management</h1>
          <p className="text-neutral-600 mt-1">Track income, expenses, and generate reports</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="px-5 py-2.5 gradient-primary text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'transactions', label: 'Transactions', icon: Receipt },
          { id: 'budget', label: 'Budget', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
        ].map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold transition-colors ${
                activeView === view.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {view.label}
            </button>
          );
        })}
      </div>

      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-premium p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{financialSummary.monthlyGrowth}%
                </span>
              </div>
              <div className="text-3xl font-bold text-neutral-900">${financialSummary.totalIncome.toLocaleString()}</div>
              <div className="text-sm text-neutral-600 mt-1">Total Income (MTD)</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-premium p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 gradient-danger rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-neutral-500">29% of income</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900">${financialSummary.totalExpenses.toLocaleString()}</div>
              <div className="text-sm text-neutral-600 mt-1">Total Expenses (MTD)</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-premium p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-600">71% margin</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900">${financialSummary.netIncome.toLocaleString()}</div>
              <div className="text-sm text-neutral-600 mt-1">Net Income (MTD)</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-amber-600">2 units</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900">${financialSummary.outstandingBalance.toLocaleString()}</div>
              <div className="text-sm text-neutral-600 mt-1">Outstanding</div>
            </motion.div>
          </div>

          {/* Income & Expense Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Breakdown */}
            <div className="card-premium p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Income Breakdown</h3>
              <div className="space-y-3">
                {incomeBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">{item.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-neutral-900">${item.amount.toLocaleString()}</span>
                        <span className="text-xs text-neutral-500">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full gradient-success"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="card-premium p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Expense Breakdown</h3>
              <div className="space-y-3">
                {expenseBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">{item.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-neutral-900">${item.amount.toLocaleString()}</span>
                        <span className="text-xs text-neutral-500">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full gradient-danger"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card-premium">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">Recent Transactions</h3>
              <button
                onClick={() => setActiveView('transactions')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>
            <div className="divide-y">
              {recentTransactions.slice(0, 5).map((txn) => (
                <div key={txn.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        txn.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {txn.type === 'income' ? (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">{txn.description}</div>
                        <div className="text-sm text-neutral-600">
                          {txn.property} {txn.unit && `• Unit ${txn.unit}`} {txn.tenant && `• ${txn.tenant}`}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {new Date(txn.date).toLocaleDateString()} • {txn.paymentMethod}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                        <CheckCircle className="w-3 h-3" />
                        {txn.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'transactions' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="card-premium p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="input-premium w-full pl-11"
                />
              </div>
              <select className="input-premium">
                <option>All Types</option>
                <option>Income</option>
                <option>Expense</option>
              </select>
              <select className="input-premium">
                <option>All Categories</option>
                <option>Rent Payment</option>
                <option>Maintenance</option>
                <option>Utilities</option>
              </select>
              <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="input-premium" />
            </div>
          </div>

          {/* Transactions List */}
          <div className="card-premium divide-y">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      txn.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {txn.type === 'income' ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="font-semibold text-neutral-900">{txn.description}</div>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          txn.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {txn.category}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-600">
                        {txn.property} {txn.unit && `• Unit ${txn.unit}`} {txn.tenant && `• ${txn.tenant}`}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                        <span>{new Date(txn.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{txn.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1 justify-end">
                        <CheckCircle className="w-3 h-3" />
                        {txn.status}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </button>
                      <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-neutral-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'budget' && (
        <div className="space-y-6">
          <div className="card-premium p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Monthly Budget vs Actual</h3>
            <div className="space-y-4">
              {budgetData.map((item, index) => (
                <div key={index} className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-neutral-900">{item.category}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-neutral-500">Budgeted</div>
                        <div className="font-bold text-neutral-700">${item.budgeted.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-neutral-500">Actual</div>
                        <div className="font-bold text-neutral-900">${item.actual.toLocaleString()}</div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="text-xs text-neutral-500">Variance</div>
                        <div className={`font-bold ${item.variance > 0 ? 'text-green-600' : item.variance < 0 ? 'text-red-600' : 'text-neutral-700'}`}>
                          {item.variance > 0 ? '+' : ''}${item.variance.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-400"
                        style={{ width: `${Math.min((item.actual / item.budgeted) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-600">
                      {Math.round((item.actual / item.budgeted) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Profit & Loss Statement', description: 'Income vs expenses by period', icon: BarChart3, color: 'blue' },
            { name: 'Cash Flow Report', description: 'Track money in and out', icon: DollarSign, color: 'green' },
            { name: 'Rent Roll Report', description: 'Current tenants and rent status', icon: Building2, color: 'purple' },
            { name: 'Tax Summary', description: 'Annual tax documentation', icon: Receipt, color: 'amber' },
            { name: 'Owner Statement', description: 'Monthly owner distributions', icon: FileSpreadsheet, color: 'indigo' },
            { name: 'Budget Analysis', description: 'Budget vs actual comparison', icon: PieChart, color: 'rose' },
          ].map((report, index) => {
            const Icon = report.icon;
            return (
              <button
                key={index}
                className="card-premium card-interactive p-6 text-left"
              >
                <div className={`w-12 h-12 bg-${report.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${report.color}-600`} />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{report.name}</h3>
                <p className="text-sm text-neutral-600 mb-4">{report.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors">
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 gradient-primary text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                    Export
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
