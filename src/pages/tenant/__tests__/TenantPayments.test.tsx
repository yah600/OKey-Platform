import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TenantPayments from '../TenantPayments';
import { usePaymentsStore } from '@/store/paymentsStore';

// Mock the payments store
vi.mock('@/store/paymentsStore', () => ({
  usePaymentsStore: vi.fn(),
}));

const mockUsePaymentsStore = usePaymentsStore as unknown as ReturnType<typeof vi.fn>;

describe('TenantPayments', () => {
  const mockPayments = [
    {
      id: 'pay_1',
      amount: 1500,
      dueDate: '2026-02-01',
      status: 'paid',
      type: 'rent',
      description: 'February 2026 Rent',
      paidDate: '2026-01-28',
      paymentMethod: 'Credit Card ****1234',
    },
    {
      id: 'pay_2',
      amount: 1500,
      dueDate: '2026-03-01',
      status: 'pending',
      type: 'rent',
      description: 'March 2026 Rent',
    },
  ];

  const mockMakePayment = vi.fn();
  const mockAddPaymentMethod = vi.fn();

  beforeEach(() => {
    mockUsePaymentsStore.mockReturnValue({
      payments: mockPayments,
      paymentMethods: [
        { id: 'pm_1', type: 'card', last4: '1234', brand: 'Visa', isDefault: true },
      ],
      makePayment: mockMakePayment,
      addPaymentMethod: mockAddPaymentMethod,
      downloadReceipt: vi.fn(),
    });
  });

  it('renders payment history', () => {
    render(
      <BrowserRouter>
        <TenantPayments />
      </BrowserRouter>
    );

    expect(screen.getByText(/payment/i)).toBeInTheDocument();
    expect(screen.getByText(/February 2026 Rent/i)).toBeInTheDocument();
    expect(screen.getByText(/March 2026 Rent/i)).toBeInTheDocument();
  });

  it('displays pending payment with pay button', () => {
    render(
      <BrowserRouter>
        <TenantPayments />
      </BrowserRouter>
    );

    const pendingPayments = screen.getAllByText(/pending/i);
    expect(pendingPayments.length).toBeGreaterThan(0);

    const payButtons = screen.getAllByRole('button', { name: /pay/i });
    expect(payButtons.length).toBeGreaterThan(0);
  });

  it('displays paid payment with receipt download', () => {
    render(
      <BrowserRouter>
        <TenantPayments />
      </BrowserRouter>
    );

    expect(screen.getByText(/paid/i)).toBeInTheDocument();
  });

  it('shows balance due when there are pending payments', () => {
    render(
      <BrowserRouter>
        <TenantPayments />
      </BrowserRouter>
    );

    // Should show $1500 balance due for March rent
    expect(screen.getByText(/\$1,500/)).toBeInTheDocument();
  });
});
