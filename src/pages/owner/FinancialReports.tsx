import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import Tabs from '../../components/ui/Tabs';
import Select from '../../components/molecules/Select';
import DatePicker from '../../components/molecules/DatePicker';
import Table from '../../components/organisms/Table';
import Modal from '../../components/organisms/Modal';
import Input from '../../components/atoms/Input';
import LineChart, { LineChartDataPoint } from '../../components/molecules/LineChart';
import BarChart, { BarChartDataPoint } from '../../components/molecules/BarChart';
import DonutChart, { DonutChartSegment } from '../../components/molecules/DonutChart';
import { toast } from 'sonner';

export default function FinancialReports() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profit-loss');
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleExportPDF = () => {
    toast.success('Exporting Report', {
      description: 'Your financial report is being generated as a PDF. This will download shortly.',
      duration: 3000,
    });

    // In production, this would generate actual PDF
    // For now, simulate download
    setTimeout(() => {
      toast.success('Download Complete', {
        description: 'Financial_Report.pdf has been downloaded.',
      });
    }, 1500);
  };

  const handleApplyDateRange = () => {
    if (!startDate || !endDate) {
      toast.error('Invalid Date Range', {
        description: 'Please select both start and end dates.',
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Invalid Date Range', {
        description: 'Start date must be before end date.',
      });
      return;
    }

    setReportPeriod('custom');
    toast.success('Date Range Applied', {
      description: `Report updated for ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
    });
    setShowDateRangeModal(false);
  };

  // Mock data for P&L Statement
  const profitLossData = [
    { category: 'Rental Income', jan: 24500, feb: 24500, mar: 26000, ytd: 75000 },
    { category: 'Late Fees', jan: 150, feb: 200, mar: 100, ytd: 450 },
    { category: 'Other Income', jan: 500, feb: 300, mar: 600, ytd: 1400 },
    { category: 'Total Revenue', jan: 25150, feb: 25000, mar: 26700, ytd: 76850, isTotal: true },
    { category: 'Repairs & Maintenance', jan: -2100, feb: -1800, mar: -2500, ytd: -6400 },
    { category: 'Property Management', jan: -1200, feb: -1200, mar: -1300, ytd: -3700 },
    { category: 'Insurance', jan: -800, feb: -800, mar: -800, ytd: -2400 },
    { category: 'Property Tax', jan: -1500, feb: -1500, mar: -1500, ytd: -4500 },
    { category: 'Utilities', jan: -600, feb: -650, mar: -700, ytd: -1950 },
    { category: 'Total Expenses', jan: -6200, feb: -5950, mar: -6800, ytd: -18950, isTotal: true },
    { category: 'Net Income', jan: 18950, feb: 19050, mar: 19900, ytd: 57900, isTotal: true, isNetIncome: true },
  ];

  // Mock data for Balance Sheet
  const balanceSheetData = [
    { category: 'Cash & Bank Accounts', amount: 125000, type: 'asset' },
    { category: 'Accounts Receivable', amount: 4500, type: 'asset' },
    { category: 'Security Deposits Held', amount: 12000, type: 'asset' },
    { category: 'Total Assets', amount: 141500, type: 'asset', isTotal: true },
    { category: 'Accounts Payable', amount: 3200, type: 'liability' },
    { category: 'Security Deposits Liability', amount: 12000, type: 'liability' },
    { category: 'Total Liabilities', amount: 15200, type: 'liability', isTotal: true },
    { category: 'Owner Equity', amount: 126300, type: 'equity', isTotal: true },
  ];

  // Mock data for Cash Flow
  const cashFlowData: LineChartDataPoint[] = [
    { label: 'Jan', value: 18950 },
    { label: 'Feb', value: 19050 },
    { label: 'Mar', value: 19900 },
    { label: 'Apr', value: 20500 },
    { label: 'May', value: 19800 },
    { label: 'Jun', value: 21200 },
  ];

  // Mock data for Expense Breakdown
  const expenseBreakdown: DonutChartSegment[] = [
    { label: 'Repairs & Maintenance', value: 6400, color: 'blue' },
    { label: 'Property Management', value: 3700, color: 'green' },
    { label: 'Insurance', value: 2400, color: 'orange' },
    { label: 'Property Tax', value: 4500, color: 'red' },
    { label: 'Utilities', value: 1950, color: 'purple' },
  ];

  // Mock data for Revenue by Property
  const revenueByProperty: BarChartDataPoint[] = [
    { label: 'Sunset Apartments', value: 42000, color: 'primary' },
    { label: 'Downtown Plaza', value: 28500, color: 'success' },
    { label: 'Lake View Condos', value: 6350, color: 'warning' },
  ];

  const tabs = [
    { id: 'profit-loss', label: 'Profit & Loss' },
    { id: 'balance-sheet', label: 'Balance Sheet' },
    { id: 'cash-flow', label: 'Cash Flow' },
    { id: 'expenses', label: 'Expense Analysis' },
    { id: 'revenue', label: 'Revenue Analysis' },
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
              Financial Reports
            </h1>
            <p className="text-sm text-neutral-600">
              Comprehensive financial statements and analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
            />
            <Button variant="secondary" onClick={() => setShowDateRangeModal(true)}>
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
            <Button variant="primary" onClick={handleExportPDF}>
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">YTD Revenue</p>
              <h3 className="text-2xl font-bold text-neutral-900">$76,850</h3>
              <p className="text-xs text-green-600 mt-1">+15.2% vs last year</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">YTD Expenses</p>
              <h3 className="text-2xl font-bold text-neutral-900">$18,950</h3>
              <p className="text-xs text-red-600 mt-1">+8.5% vs last year</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Net Income</p>
              <h3 className="text-2xl font-bold text-green-600">$57,900</h3>
              <p className="text-xs text-neutral-500 mt-1">Year to date</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Profit Margin</p>
              <h3 className="text-2xl font-bold text-neutral-900">75.3%</h3>
              <p className="text-xs text-neutral-500 mt-1">Average</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'profit-loss' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Profit & Loss Statement</h3>
              <p className="text-sm text-neutral-600">January - March 2026</p>
            </div>
            <Table
              columns={[
                { key: 'category', label: 'Category', sortable: false, align: 'left' },
                {
                  key: 'jan',
                  label: 'January',
                  sortable: true,
                  align: 'right',
                  render: (value: any, row: any) => (
                    <span className={row.isNetIncome && value > 0 ? 'text-green-600 font-semibold' : row.isTotal ? 'font-semibold' : ''}>
                      ${Math.abs(value).toLocaleString()}
                    </span>
                  ),
                },
                {
                  key: 'feb',
                  label: 'February',
                  sortable: true,
                  align: 'right',
                  render: (value: any, row: any) => (
                    <span className={row.isNetIncome && value > 0 ? 'text-green-600 font-semibold' : row.isTotal ? 'font-semibold' : ''}>
                      ${Math.abs(value).toLocaleString()}
                    </span>
                  ),
                },
                {
                  key: 'mar',
                  label: 'March',
                  sortable: true,
                  align: 'right',
                  render: (value: any, row: any) => (
                    <span className={row.isNetIncome && value > 0 ? 'text-green-600 font-semibold' : row.isTotal ? 'font-semibold' : ''}>
                      ${Math.abs(value).toLocaleString()}
                    </span>
                  ),
                },
                {
                  key: 'ytd',
                  label: 'YTD Total',
                  sortable: true,
                  align: 'right',
                  render: (value: any, row: any) => (
                    <span className={row.isNetIncome && value > 0 ? 'text-green-600 font-bold' : row.isTotal ? 'font-bold' : ''}>
                      ${Math.abs(value).toLocaleString()}
                    </span>
                  ),
                },
              ]}
              data={profitLossData}
              keyExtractor={(row, index) => `pl-${index}`}
              striped
              bordered
            />
          </Card>
        )}

        {activeTab === 'balance-sheet' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Balance Sheet</h3>
              <p className="text-sm text-neutral-600">As of March 31, 2026</p>
            </div>
            <Table
              columns={[
                { key: 'category', label: 'Account', sortable: false, align: 'left' },
                {
                  key: 'amount',
                  label: 'Amount',
                  sortable: true,
                  align: 'right',
                  render: (value: any, row: any) => (
                    <span className={row.isTotal ? 'font-bold' : ''}>
                      ${value.toLocaleString()}
                    </span>
                  ),
                },
              ]}
              data={balanceSheetData}
              keyExtractor={(row, index) => `bs-${index}`}
              striped
              bordered
            />
          </Card>
        )}

        {activeTab === 'cash-flow' && (
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Cash Flow Statement</h3>
            <p className="text-sm text-neutral-600 mb-6">Net income trend over the last 6 months</p>
            <LineChart
              data={cashFlowData}
              height={300}
              color="primary"
              showTrend
              valuePrefix="$"
              showGrid
            />
          </Card>
        )}

        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Expense Breakdown</h3>
              <DonutChart
                data={expenseBreakdown}
                size={300}
                showLegend
                showPercentages
                centerContent={
                  <div className="text-center">
                    <div className="text-xs text-neutral-600">Total Expenses</div>
                    <div className="text-2xl font-bold text-neutral-900">$18,950</div>
                  </div>
                }
              />
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Monthly Expense Trend</h3>
              <p className="text-sm text-neutral-600 mb-6">Expenses by category over time</p>
              <BarChart
                data={expenseBreakdown.map(exp => ({
                  label: exp.label,
                  value: exp.value,
                  color: exp.color,
                }))}
                height={300}
                valuePrefix="$"
                showValues
                showGrid
              />
            </Card>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue by Property</h3>
              <p className="text-sm text-neutral-600 mb-6">Year-to-date revenue breakdown by property</p>
              <BarChart
                data={revenueByProperty}
                height={300}
                valuePrefix="$"
                showValues
                showGrid
              />
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Details</h3>
              <Table
                columns={[
                  { key: 'label', label: 'Property', sortable: true, align: 'left' },
                  {
                    key: 'value',
                    label: 'YTD Revenue',
                    sortable: true,
                    align: 'right',
                    render: (value: any) => <span className="font-semibold">${value.toLocaleString()}</span>,
                  },
                ]}
                data={revenueByProperty}
                keyExtractor={(row, index) => `rev-${index}`}
                striped
                bordered
              />
            </Card>
          </div>
        )}
      </div>

      {/* Date Range Modal */}
      <Modal
        isOpen={showDateRangeModal}
        onClose={() => setShowDateRangeModal(false)}
        title="Custom Date Range"
        description="Select a custom date range for the financial report"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDateRangeModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyDateRange}>
              Apply Range
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            <p>Select a date range to view financial data for a custom period.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
