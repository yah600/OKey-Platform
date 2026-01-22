import { useState, useEffect } from 'react';
import { PiggyBank, TrendingUp, TrendingDown, FileText, Download, Plus, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import Badge from '../../../components/ui/Badge';
import Tabs from '../../../components/ui/Tabs';
import Modal from '../../../components/organisms/Modal';
import Input from '../../../components/atoms/Input';
import Textarea from '../../../components/atoms/Textarea';
import DatePicker from '../../../components/molecules/DatePicker';
import EmptyState from '../../../components/organisms/EmptyState';

export default function ContingencyFund() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddContributionModal, setShowAddContributionModal] = useState(false);
  const [showAddStudyModal, setShowAddStudyModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock fund data
  const fundData = {
    currentBalance: 125000,
    requiredBalance: 150000,
    monthlyContribution: 2500,
    lastStudyDate: '2024-03-15',
    nextStudyDue: '2029-03-15',
    totalProperties: 3,
    totalUnits: 48,
  };

  const deficit = fundData.requiredBalance - fundData.currentBalance;
  const fundingPercentage = Math.round((fundData.currentBalance / fundData.requiredBalance) * 100);

  // Mock contribution history
  const contributions = [
    {
      id: 1,
      date: '2026-01-01',
      amount: 2500,
      type: 'Monthly Contribution',
      source: 'All Properties',
      description: 'Regular monthly contribution from condo fees',
    },
    {
      id: 2,
      date: '2025-12-01',
      amount: 2500,
      type: 'Monthly Contribution',
      source: 'All Properties',
      description: 'Regular monthly contribution from condo fees',
    },
    {
      id: 3,
      date: '2025-11-01',
      amount: 5000,
      type: 'Special Assessment',
      source: 'Sunset Apartments',
      description: 'Special assessment for roof replacement',
    },
    {
      id: 4,
      date: '2025-11-01',
      amount: 2500,
      type: 'Monthly Contribution',
      source: 'All Properties',
      description: 'Regular monthly contribution from condo fees',
    },
  ];

  // Mock fund studies
  const fundStudies = [
    {
      id: 1,
      date: '2024-03-15',
      validUntil: '2029-03-15',
      consultant: 'Quebec Condo Consultants Inc.',
      recommendedBalance: 150000,
      projectedExpenses: [
        { item: 'Roof Replacement', year: 2027, cost: 45000 },
        { item: 'Parking Lot Resurfacing', year: 2028, cost: 30000 },
        { item: 'Building Exterior Painting', year: 2026, cost: 25000 },
        { item: 'Elevator Modernization', year: 2029, cost: 50000 },
      ],
      documents: ['contingency-fund-study-2024.pdf', 'appendix-a-cost-estimates.pdf'],
      status: 'current',
    },
    {
      id: 2,
      date: '2019-02-20',
      validUntil: '2024-02-20',
      consultant: 'Property Analysis Group',
      recommendedBalance: 120000,
      projectedExpenses: [],
      documents: ['contingency-fund-study-2019.pdf'],
      status: 'expired',
    },
  ];

  // Mock projected expenses from current study
  const currentStudy = fundStudies.find(s => s.status === 'current');
  const projectedExpenses = currentStudy?.projectedExpenses || [];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contributions', label: 'Contributions', count: contributions.length },
    { id: 'studies', label: 'Fund Studies', count: fundStudies.length },
    { id: 'projections', label: 'Projections', count: projectedExpenses.length },
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
              Contingency Fund
            </h1>
            <p className="text-sm text-neutral-600">
              Quebec Law 16 Compliance - Mandatory fund for major repairs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button variant="primary" onClick={() => setShowAddContributionModal(true)}>
              <Plus className="w-4 h-4" />
              Add Contribution
            </Button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <PiggyBank className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Quebec Law 16 Requirement
            </h3>
            <p className="text-xs text-blue-800">
              All Quebec condominiums must establish and maintain a contingency fund to finance major repairs and replacements
              of common elements. A contingency fund study must be conducted every 5 years by a qualified professional to
              determine the required fund level based on projected expenses.
            </p>
          </div>
        </div>
      </Card>

      {/* Fund Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Current Balance</p>
              <h3 className="text-2xl font-bold text-neutral-900">
                ${fundData.currentBalance.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Required Balance</p>
              <h3 className="text-2xl font-bold text-neutral-900">
                ${fundData.requiredBalance.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Fund Status</p>
              <h3 className="text-2xl font-bold text-orange-600">
                {deficit > 0 ? '-' : '+'}${Math.abs(deficit).toLocaleString()}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">{fundingPercentage}% funded</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${deficit > 0 ? 'bg-orange-100' : 'bg-green-100'}`}>
              {deficit > 0 ? (
                <TrendingDown className="w-5 h-5 text-orange-600" />
              ) : (
                <TrendingUp className="w-5 h-5 text-green-600" />
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Monthly Contribution</p>
              <h3 className="text-2xl font-bold text-neutral-900">
                ${fundData.monthlyContribution.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Fund Study Alert */}
      {deficit > 0 && (
        <Card className="mb-6 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-orange-900 mb-1">
                Fund Deficit Detected
              </h3>
              <p className="text-xs text-orange-800 mb-2">
                The contingency fund is ${deficit.toLocaleString()} below the required level as determined by the most recent
                fund study. Consider increasing monthly contributions or implementing a special assessment to meet the target.
              </p>
              <Button variant="secondary" size="sm">
                Review Fund Study
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Next Study Due */}
      <Card className="mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">
              Next Contingency Fund Study Due: {new Date(fundData.nextStudyDue).toLocaleDateString()}
            </h3>
            <p className="text-xs text-neutral-600">
              Last study conducted on {new Date(fundData.lastStudyDate).toLocaleDateString()} by {currentStudy?.consultant}.
              Quebec law requires a new study every 5 years.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowAddStudyModal(true)}>
            <Plus className="w-4 h-4" />
            Schedule Study
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} showCount />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Funding Progress */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Funding Progress</h3>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-neutral-600">
                  ${fundData.currentBalance.toLocaleString()} of ${fundData.requiredBalance.toLocaleString()}
                </span>
                <span className="font-medium text-neutral-900">{fundingPercentage}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    fundingPercentage >= 100 ? 'bg-green-600' : fundingPercentage >= 75 ? 'bg-blue-600' : 'bg-orange-600'
                  }`}
                  style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                />
              </div>
            </Card>

            {/* Recent Contributions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">Recent Contributions</h3>
                <Button variant="link" onClick={() => setActiveTab('contributions')}>
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {contributions.slice(0, 3).map((contribution) => (
                  <div key={contribution.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{contribution.type}</p>
                      <p className="text-xs text-neutral-600">{contribution.source}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {new Date(contribution.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      +${contribution.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'contributions' && (
          <Card>
            <div className="space-y-3">
              {contributions.map((contribution) => (
                <div key={contribution.id} className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-neutral-900">{contribution.type}</h4>
                        <Badge variant={contribution.type === 'Special Assessment' ? 'warning' : 'success'}>
                          {contribution.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{contribution.description}</p>
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(contribution.date).toLocaleDateString()}
                        </span>
                        <span>{contribution.source}</span>
                      </div>
                    </div>
                    <p className="text-xl font-semibold text-green-600">
                      +${contribution.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'studies' && (
          <div className="space-y-4">
            {fundStudies.map((study) => (
              <Card key={study.id} className={study.status === 'current' ? 'border-primary-300 bg-primary-50/30' : ''}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-neutral-900">
                            Contingency Fund Study - {new Date(study.date).getFullYear()}
                          </h4>
                          <Badge variant={study.status === 'current' ? 'success' : 'secondary'}>
                            {study.status === 'current' ? 'Current' : 'Expired'}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">Conducted by {study.consultant}</p>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Study Date: {new Date(study.date).toLocaleDateString()}
                          </span>
                          <span>Valid Until: {new Date(study.validUntil).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-600 mb-1">Recommended Balance</p>
                        <p className="text-xl font-semibold text-neutral-900">
                          ${study.recommendedBalance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {study.documents.length > 0 && (
                      <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                        {study.documents.map((doc, idx) => (
                          <button
                            key={idx}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            {doc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'projections' && (
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Projected Major Expenses (from {new Date(currentStudy?.date || '').getFullYear()} Study)
            </h3>
            {projectedExpenses.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No projections available"
                description="Upload a contingency fund study to see projected expenses."
              />
            ) : (
              <div className="space-y-3">
                {projectedExpenses.map((expense, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">{expense.item}</h4>
                      <p className="text-sm text-neutral-600">Projected Year: {expense.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-neutral-900">
                        ${expense.cost.toLocaleString()}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {expense.year - new Date().getFullYear()} years away
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-neutral-900">Total Projected Expenses</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      ${projectedExpenses.reduce((sum, exp) => sum + exp.cost, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Add Contribution Modal */}
      <Modal
        isOpen={showAddContributionModal}
        onClose={() => setShowAddContributionModal(false)}
        title="Add Contribution"
        description="Record a new contribution to the contingency fund"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddContributionModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowAddContributionModal(false)}>
              Add Contribution
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Contribution Amount" type="number" placeholder="0.00" required />
          <DatePicker label="Date" required />
          <Input label="Source" placeholder="e.g., All Properties, Sunset Apartments" required />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" value="monthly" className="text-primary-600" />
                <span className="text-sm text-neutral-900">Monthly Contribution</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" value="special" className="text-primary-600" />
                <span className="text-sm text-neutral-900">Special Assessment</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" value="other" className="text-primary-600" />
                <span className="text-sm text-neutral-900">Other</span>
              </label>
            </div>
          </div>
          <Textarea label="Description" placeholder="Brief description of this contribution" rows={3} />
        </div>
      </Modal>

      {/* Add Study Modal */}
      <Modal
        isOpen={showAddStudyModal}
        onClose={() => setShowAddStudyModal(false)}
        title="Schedule Contingency Fund Study"
        description="Schedule a new 5-year contingency fund study"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddStudyModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowAddStudyModal(false)}>
              Schedule Study
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Consultant/Firm Name" placeholder="e.g., Quebec Condo Consultants Inc." required />
          <DatePicker label="Scheduled Date" required />
          <Input label="Estimated Cost" type="number" placeholder="0.00" required />
          <Textarea label="Notes" placeholder="Any additional information about the study" rows={3} />
        </div>
      </Modal>
    </div>
  );
}
