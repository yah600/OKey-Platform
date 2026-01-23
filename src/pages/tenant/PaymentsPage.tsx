import { useState, useEffect } from 'react';
import { DollarSign, Calendar, Download, CreditCard, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePaymentsStore } from '../../store/paymentsStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import PaymentModal from '../../components/organisms/PaymentModal';

export default function PaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useAuthStore();

  const {
    getPaymentHistory,
    getUpcomingPayment,
    getDefaultPaymentMethod,
  } = usePaymentsStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const paymentHistory = user ? getPaymentHistory(user.id) : [];
  const upcomingPayment = user ? getUpcomingPayment(user.id) : undefined;
  const defaultPaymentMethod = getDefaultPaymentMethod();
  const lastPayment = paymentHistory[0];

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Payments</h1>
        <p className="text-sm text-neutral-600">Manage your rent payments and view history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              upcomingPayment ? 'bg-red-50' : 'bg-green-50'
            }`}>
              {upcomingPayment ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <DollarSign className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div>
              <p className="text-xs text-neutral-600">Balance Due</p>
              <p className="text-2xl font-semibold text-neutral-900">
                ${upcomingPayment?.amount.toLocaleString() || '0'}
              </p>
              {upcomingPayment && (
                <p className="text-xs text-red-600">
                  Due {new Date(upcomingPayment.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
              {!upcomingPayment && (
                <p className="text-xs text-green-600">No balance due</p>
              )}
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
              <p className="text-lg font-semibold text-neutral-900">
                ${lastPayment?.amount.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-neutral-500">
                {lastPayment
                  ? new Date(lastPayment.paidDate || lastPayment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'No payments yet'}
              </p>
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
              {defaultPaymentMethod ? (
                <>
                  <p className="text-sm font-medium text-neutral-900">
                    •••• {defaultPaymentMethod.last4}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {defaultPaymentMethod.type === 'card'
                      ? defaultPaymentMethod.brand
                      : defaultPaymentMethod.bankName}
                  </p>
                </>
              ) : (
                <p className="text-sm text-neutral-500">No method set</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {upcomingPayment && (
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                {upcomingPayment.month} Rent
              </h3>
              <p className="text-xs text-neutral-600">
                {upcomingPayment.propertyName} - Unit {upcomingPayment.unitNumber}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Due {new Date(upcomingPayment.dueDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-neutral-900 mb-2">
                ${upcomingPayment.amount.toLocaleString()}.00
              </p>
              <Button variant="primary" onClick={() => setShowPaymentModal(true)}>
                <DollarSign className="w-4 h-4" />
                Pay Now
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-neutral-900">Payment History</h3>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <div className="space-y-3">
          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    payment.status === 'paid' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <DollarSign className={`w-4 h-4 ${
                      payment.status === 'paid' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{payment.month}</p>
                    <p className="text-xs text-neutral-600">
                      {payment.propertyName} - Unit {payment.unitNumber}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Paid on {new Date(payment.paidDate || payment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    {payment.confirmationNumber && (
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        {payment.confirmationNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">
                    ${payment.amount.toLocaleString()}
                  </p>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded ${
                    payment.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : payment.status === 'failed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {payment.status === 'paid' ? 'Paid' : payment.status === 'failed' ? 'Failed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <DollarSign className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm">No payment history yet</p>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Modal */}
      {upcomingPayment && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          scheduledPayment={upcomingPayment}
        />
      )}
    </div>
  );
}
