import { DollarSign, Calendar, Download, CreditCard } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function PaymentsPage() {
  const payments = [
    { id: 1, month: 'January 2026', amount: 2500, status: 'paid', date: '2026-01-01', dueDate: '2026-01-01' },
    { id: 2, month: 'December 2025', amount: 2500, status: 'paid', date: '2025-12-01', dueDate: '2025-12-01' },
    { id: 3, month: 'November 2025', amount: 2500, status: 'paid', date: '2025-11-01', dueDate: '2025-11-01' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Payments</h1>
        <p className="text-sm text-neutral-600">Manage your rent payments and view history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Balance Due</p>
              <p className="text-2xl font-semibold text-neutral-900">$2,500</p>
              <p className="text-xs text-red-600">Due Feb 1, 2026</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Last Payment</p>
              <p className="text-lg font-semibold text-neutral-900">$2,500</p>
              <p className="text-xs text-neutral-500">Jan 1, 2026</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Payment Method</p>
              <p className="text-sm font-medium text-neutral-900">•••• 4242</p>
              <p className="text-xs text-neutral-500">Visa</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">February 2026 Rent</h3>
            <p className="text-xs text-neutral-600">Due in 9 days</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-neutral-900 mb-2">$2,500.00</p>
            <Button variant="primary">Pay Now</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-neutral-900">Payment History</h3>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{payment.month}</p>
                  <p className="text-xs text-neutral-600">Paid on {new Date(payment.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-neutral-900">${payment.amount}</p>
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Paid</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
