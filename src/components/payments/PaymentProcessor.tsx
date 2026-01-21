import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Building2, Check, AlertCircle, Loader2, ChevronRight, Shield, Lock } from 'lucide-react';

interface PaymentProcessorProps {
  amount: number;
  description: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentProcessor({ amount, description, onSuccess, onCancel }: PaymentProcessorProps) {
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | null>(null);
  const [processing, setProcessing] = useState(false);

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const [bankData, setBankData] = useState({
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
  });

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setCardData({ ...cardData, expiry: `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}` });
    } else {
      setCardData({ ...cardData, expiry: cleaned });
    }
  };

  const handleSubmit = async () => {
    setProcessing(true);
    setStep('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    setStep('success');
    setProcessing(false);

    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 z-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">Payment Processing</h2>
          <p className="text-neutral-600">{description}</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">${amount.toLocaleString()}</span>
            <span className="text-neutral-500">CAD</span>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'method' && (
              <motion.div
                key="method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Select Payment Method</h3>

                <button
                  onClick={() => {
                    setPaymentMethod('card');
                    setStep('details');
                  }}
                  className="w-full p-6 border-2 border-neutral-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CreditCard className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                          Credit or Debit Card
                        </div>
                        <div className="text-sm text-neutral-600">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </button>

                <button
                  onClick={() => {
                    setPaymentMethod('bank');
                    setStep('details');
                  }}
                  className="w-full p-6 border-2 border-neutral-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                          Bank Transfer (ACH)
                        </div>
                        <div className="text-sm text-neutral-600">Direct from your bank account</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </button>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold text-blue-900 mb-1">Secure Payment</div>
                    <div className="text-blue-700">All transactions are encrypted and PCI-DSS compliant</div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'details' && paymentMethod === 'card' && (
              <motion.div
                key="card-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900">Card Details</h3>
                  <button
                    onClick={() => setStep('method')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Change Method
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="input-premium w-full"
                    />
                    <CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    placeholder="John Doe"
                    className="input-premium w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="input-premium w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">CVV</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                        placeholder="123"
                        maxLength={4}
                        className="input-premium w-full"
                      />
                      <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv}
                    className="flex-1 gradient-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all"
                  >
                    Pay ${amount.toLocaleString()}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'details' && paymentMethod === 'bank' && (
              <motion.div
                key="bank-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900">Bank Account Details</h3>
                  <button
                    onClick={() => setStep('method')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Change Method
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBankData({ ...bankData, accountType: 'checking' })}
                      className={`p-4 border-2 rounded-xl font-medium transition-all ${
                        bankData.accountType === 'checking'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      Checking
                    </button>
                    <button
                      onClick={() => setBankData({ ...bankData, accountType: 'savings' })}
                      className={`p-4 border-2 rounded-xl font-medium transition-all ${
                        bankData.accountType === 'savings'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      Savings
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Routing Number</label>
                  <input
                    type="text"
                    value={bankData.routingNumber}
                    onChange={(e) => setBankData({ ...bankData, routingNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="123456789"
                    maxLength={9}
                    className="input-premium w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={bankData.accountNumber}
                    onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="1234567890"
                    className="input-premium w-full"
                  />
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    Bank transfers may take 1-3 business days to process
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!bankData.accountNumber || !bankData.routingNumber}
                    className="flex-1 gradient-success text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all"
                  >
                    Pay ${amount.toLocaleString()}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Processing Payment</h3>
                <p className="text-neutral-600 mb-4">Please wait while we process your payment...</p>
                <div className="max-w-xs mx-auto h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-shimmer"></div>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </motion.div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Payment Successful!</h3>
                <p className="text-neutral-600 mb-6">Your payment of ${amount.toLocaleString()} has been processed.</p>
                <div className="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <Check className="w-4 h-4" />
                  Receipt sent to your email
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
