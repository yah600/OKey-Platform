import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string; // Visa, Mastercard, etc.
  bankName?: string;
  isDefault: boolean;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface Payment {
  id: string;
  userId: string;
  unitId: string;
  propertyName: string;
  unitNumber: string;
  amount: number;
  month: string;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'failed';
  paymentMethodId?: string;
  confirmationNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledPayment {
  id: string;
  userId: string;
  amount: number;
  dueDate: string;
  month: string;
  status: 'upcoming' | 'due' | 'overdue';
  unitId: string;
  propertyName: string;
  unitNumber: string;
}

interface PaymentsState {
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  scheduledPayments: ScheduledPayment[];

  // Payment Actions
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'confirmationNumber'>) => void;
  makePayment: (scheduledPaymentId: string, paymentMethodId: string) => void;
  getPaymentsByUser: (userId: string) => Payment[];
  getPaymentHistory: (userId: string) => Payment[];

  // Payment Method Actions
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;

  // Scheduled Payment Actions
  getScheduledPaymentsByUser: (userId: string) => ScheduledPayment[];
  getUpcomingPayment: (userId: string) => ScheduledPayment | undefined;
}

export const usePaymentsStore = create<PaymentsState>()(
  persist(
    (set, get) => ({
      payments: [
        {
          id: 'pay-1',
          userId: 'user-1',
          unitId: 'unit-1',
          propertyName: 'Sunset Apartments',
          unitNumber: '4B',
          amount: 2500,
          month: 'January 2026',
          dueDate: '2026-01-01',
          paidDate: '2026-01-01',
          status: 'paid',
          paymentMethodId: 'pm-1',
          confirmationNumber: 'CONF-2026-01-001',
          createdAt: '2026-01-01T10:00:00Z',
          updatedAt: '2026-01-01T10:00:00Z',
        },
        {
          id: 'pay-2',
          userId: 'user-1',
          unitId: 'unit-1',
          propertyName: 'Sunset Apartments',
          unitNumber: '4B',
          amount: 2500,
          month: 'December 2025',
          dueDate: '2025-12-01',
          paidDate: '2025-12-01',
          status: 'paid',
          paymentMethodId: 'pm-1',
          confirmationNumber: 'CONF-2025-12-001',
          createdAt: '2025-12-01T10:00:00Z',
          updatedAt: '2025-12-01T10:00:00Z',
        },
      ],

      paymentMethods: [
        {
          id: 'pm-1',
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          isDefault: true,
          expiryMonth: 12,
          expiryYear: 2027,
        },
      ],

      scheduledPayments: [
        {
          id: 'sched-1',
          userId: 'user-1',
          amount: 2500,
          dueDate: '2026-02-01',
          month: 'February 2026',
          status: 'upcoming',
          unitId: 'unit-1',
          propertyName: 'Sunset Apartments',
          unitNumber: '4B',
        },
      ],

      addPayment: (payment) => {
        const newPayment: Payment = {
          ...payment,
          id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          confirmationNumber: `CONF-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          payments: [newPayment, ...state.payments],
        }));
      },

      makePayment: (scheduledPaymentId, paymentMethodId) => {
        const scheduled = get().scheduledPayments.find((sp) => sp.id === scheduledPaymentId);
        if (!scheduled) return;

        const newPayment: Payment = {
          id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: scheduled.userId,
          unitId: scheduled.unitId,
          propertyName: scheduled.propertyName,
          unitNumber: scheduled.unitNumber,
          amount: scheduled.amount,
          month: scheduled.month,
          dueDate: scheduled.dueDate,
          paidDate: new Date().toISOString(),
          status: 'paid',
          paymentMethodId,
          confirmationNumber: `CONF-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          payments: [newPayment, ...state.payments],
          scheduledPayments: state.scheduledPayments.filter((sp) => sp.id !== scheduledPaymentId),
        }));
      },

      getPaymentsByUser: (userId) => {
        return get().payments.filter((p) => p.userId === userId);
      },

      getPaymentHistory: (userId) => {
        return get()
          .payments.filter((p) => p.userId === userId && p.status === 'paid')
          .sort((a, b) => new Date(b.paidDate || b.createdAt).getTime() - new Date(a.paidDate || a.createdAt).getTime());
      },

      addPaymentMethod: (method) => {
        const newMethod: PaymentMethod = {
          ...method,
          id: `pm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        set((state) => ({
          paymentMethods: [...state.paymentMethods, newMethod],
        }));
      },

      updatePaymentMethod: (method) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((m) => (m.id === method.id ? method : m)),
        }));
      },

      removePaymentMethod: (methodId) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((pm) => pm.id !== methodId),
        }));
      },

      setDefaultPaymentMethod: (methodId) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((pm) => ({
            ...pm,
            isDefault: pm.id === methodId,
          })),
        }));
      },

      getDefaultPaymentMethod: () => {
        return get().paymentMethods.find((pm) => pm.isDefault);
      },

      getScheduledPaymentsByUser: (userId) => {
        return get().scheduledPayments.filter((sp) => sp.userId === userId);
      },

      getUpcomingPayment: (userId) => {
        const scheduled = get()
          .scheduledPayments.filter((sp) => sp.userId === userId)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        return scheduled[0];
      },
    }),
    {
      name: 'okey-payments-storage',
    }
  )
);
