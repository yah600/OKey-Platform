import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

export default function FinancialsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const transactions = [
    { id: 1, type: 'income', desc: 'Rent - Sunset Apt #4B', amount: 2500, date: '2026-01-01' },
    { id: 2, type: 'expense', desc: 'Plumbing repair - Downtown #12A', amount: -350, date: '2026-01-15' },
    { id: 3, type: 'income', desc: 'Rent - Downtown #12A', amount: 2200, date: '2026-01-01' },
  ];

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Financials</h1>
          <p className="text-sm text-neutral-600">Track revenue, expenses, and reports</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <p className="text-xs text-neutral-600">Total Revenue</p>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">$28,450</p>
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <TrendingUp className="w-3 h-3" />
            +12%
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-red-600" />
            <p className="text-xs text-neutral-600">Total Expenses</p>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">$8,230</p>
          <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <TrendingDown className="w-3 h-3" />
            -5%
          </div>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-2">Net Income</p>
          <p className="text-2xl font-semibold text-green-600">$20,220</p>
          <p className="text-xs text-neutral-500 mt-1">This month</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-2">Profit Margin</p>
          <p className="text-2xl font-semibold text-neutral-900">71%</p>
          <p className="text-xs text-neutral-500 mt-1">Average</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <DollarSign className={`w-4 h-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{transaction.desc}</p>
                  <p className="text-xs text-neutral-600">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
