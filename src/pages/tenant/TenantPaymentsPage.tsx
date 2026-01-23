import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/organisms/EmptyState';
import Modal from '../../components/organisms/Modal';
import { useAuthStore } from '../../store/authStore';
import { usePaymentsStore } from '../../store/paymentsStore';
import { toast } from 'sonner';

export function TenantPaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useAuthStore();
  const {
    getPaymentHistory,
    getScheduledPaymentsByUser,
    getUpcomingPayment,
    makePayment,
    paymentMethods,
    getDefaultPaymentMethod,
  } = usePaymentsStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const paymentHistory = user ? getPaymentHistory(user.id) : [];
  const scheduledPayments = user ? getScheduledPaymentsByUser(user.id) : [];
  const upcomingPayment = user ? getUpcomingPayment(user.id) : undefined;
  const defaultMethod = getDefaultPaymentMethod();

  const handleMakePayment = () => {
    if (!upcomingPayment) {
      toast.error('No Payment Due', {
        description: 'There are no upcoming payments at this time.',
      });
      return;
    }

    if (!defaultMethod) {
      toast.error('No Payment Method', {
        description: 'Please add a payment method before making a payment.',
      });
      return;
    }

    makePayment(upcomingPayment.id, defaultMethod.id);
    toast.success('Payment Successful', {
      description: `Your payment of $${upcomingPayment.amount.toLocaleString()} has been processed.`,
    });
    setShowPaymentModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'overdue':
        return <Badge variant="error">Overdue</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Payments</h1>
          <p className="text-sm text-neutral-600">Manage your rent payments and view history</p>
        </div>

        {/* Upcoming Payment */}
        {upcomingPayment && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Upcoming Payment</h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    {upcomingPayment.propertyName} - Unit {upcomingPayment.unitNumber}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(upcomingPayment.dueDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="font-semibold text-neutral-900">
                      ${upcomingPayment.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="primary" onClick={() => setShowPaymentModal(true)}>
                Pay Now
              </Button>
            </div>
          </Card>
        )}

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Total Paid This Year</p>
              <p className="text-3xl font-semibold text-neutral-900">
                ${paymentHistory
                  .filter((p) => p.status === 'paid' && p.paidDate?.startsWith('2026'))
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Payments Made</p>
              <p className="text-3xl font-semibold text-green-600">
                {paymentHistory.filter((p) => p.status === 'paid').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Payment Methods</p>
              <p className="text-3xl font-semibold text-neutral-900">{paymentMethods.length}</p>
            </div>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Payment History</h2>
          </div>

          {paymentHistory.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No payment history"
              description="Your payment history will appear here once you make your first payment."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Month</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Property</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Paid Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Confirmation</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3 px-4 text-sm text-neutral-900">{payment.month}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {payment.propertyName} - Unit {payment.unitNumber}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-neutral-900">
                        ${payment.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600 font-mono">
                        {payment.confirmationNumber || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Payment Confirmation Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Confirm Payment"
          description="Review your payment details"
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleMakePayment}>
                Confirm Payment
              </Button>
            </>
          }
        >
          {upcomingPayment && (
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">Property</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {upcomingPayment.propertyName}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">Unit</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {upcomingPayment.unitNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">Month</span>
                  <span className="text-sm font-medium text-neutral-900">{upcomingPayment.month}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">Due Date</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {new Date(upcomingPayment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                  <span className="text-sm font-semibold text-neutral-900">Total Amount</span>
                  <span className="text-lg font-bold text-neutral-900">
                    ${upcomingPayment.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {defaultMethod && (
                <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {defaultMethod.type === 'card' ? defaultMethod.brand : defaultMethod.bankName}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {defaultMethod.type === 'card' ? 'Card' : 'Bank Account'} ending in{' '}
                      {defaultMethod.last4}
                    </p>
                  </div>
                </div>
              )}

              {!defaultMethod && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 mb-1">No payment method</p>
                    <p className="text-xs text-amber-700">
                      Please add a payment method in Settings before making a payment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
