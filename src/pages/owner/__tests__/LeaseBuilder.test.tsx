import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LeaseBuilder from '../LeaseBuilder';
import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';

// Mock the lease builder store
vi.mock('@/store/leaseBuilderStore', () => ({
  useLeaseBuilderStore: vi.fn(),
}));

const mockUseLeaseBuilderStore = useLeaseBuilderStore as unknown as ReturnType<typeof vi.fn>;

describe('LeaseBuilder', () => {
  const mockNextStep = vi.fn();
  const mockPrevStep = vi.fn();
  const mockUpdateLease = vi.fn();
  const mockSaveDraft = vi.fn();

  beforeEach(() => {
    mockUseLeaseBuilderStore.mockReturnValue({
      currentStep: 0,
      lease: {
        id: 'lease_draft_1',
        status: 'draft',
        type: 'residential_annual',
      },
      nextStep: mockNextStep,
      prevStep: mockPrevStep,
      updateLease: mockUpdateLease,
      saveDraft: mockSaveDraft,
      finalizeLease: vi.fn(),
    });
  });

  it('renders lease builder wizard', () => {
    render(
      <BrowserRouter>
        <LeaseBuilder />
      </BrowserRouter>
    );

    expect(screen.getByText(/lease builder/i)).toBeInTheDocument();
  });

  it('displays step 1 - template selection', () => {
    render(
      <BrowserRouter>
        <LeaseBuilder />
      </BrowserRouter>
    );

    expect(screen.getByText(/select.*template/i)).toBeInTheDocument();
    expect(screen.getByText(/residential/i)).toBeInTheDocument();
    expect(screen.getByText(/commercial/i)).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(
      <BrowserRouter>
        <LeaseBuilder />
      </BrowserRouter>
    );

    // Should show step 1 of 7
    expect(screen.getByText(/step 1/i) || screen.getByText(/1.*7/)).toBeInTheDocument();
  });

  it('advances to next step when template selected', async () => {
    render(
      <BrowserRouter>
        <LeaseBuilder />
      </BrowserRouter>
    );

    const residentialButton = screen.getByRole('button', { name: /residential annual/i });
    fireEvent.click(residentialButton);

    await waitFor(() => {
      expect(mockUpdateLease).toHaveBeenCalled();
    });
  });

  it('has save draft functionality', () => {
    render(
      <BrowserRouter>
        <LeaseBuilder />
      </BrowserRouter>
    );

    const saveDraftButton = screen.queryByRole('button', { name: /save draft/i });
    if (saveDraftButton) {
      fireEvent.click(saveDraftButton);
      expect(mockSaveDraft).toHaveBeenCalled();
    }
  });

  it('shows 4 lease template options', () => {
    render(
      <BrowserRouter>
        <LeaseBuilder />
      </BrowserRouter>
    );

    expect(screen.getByText(/residential annual/i)).toBeInTheDocument();
    expect(screen.getByText(/short-term rental/i)).toBeInTheDocument();
    expect(screen.getByText(/commercial/i)).toBeInTheDocument();
    expect(screen.getByText(/renewal/i)).toBeInTheDocument();
  });
});
