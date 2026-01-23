import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lease, LeaseBuilderState } from '@/types/lease';

interface LeaseBuilderStore extends LeaseBuilderState {
  // Navigation
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Lease data
  setLease: (lease: Partial<Lease>) => void;
  updateLease: (updates: Partial<Lease>) => void;
  setTemplate: (templateId: string) => void;

  // Validation
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;

  // Actions
  saveDraft: () => void;
  loadDraft: (leaseId: string) => void;
  clearDraft: () => void;
  resetBuilder: () => void;

  // Loading state
  setLoading: (isLoading: boolean) => void;
}

const initialState: LeaseBuilderState = {
  currentStep: 0,
  lease: {
    status: 'draft',
  },
  isLoading: false,
  errors: {},
};

/**
 * Lease Builder Store
 * Manages state for the multi-step lease creation wizard
 */
export const useLeaseBuilderStore = create<LeaseBuilderStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation
      setStep: (step: number) =>
        set({ currentStep: Math.max(0, Math.min(6, step)) }),

      nextStep: () => {
        const { currentStep } = get();
        set({ currentStep: Math.min(6, currentStep + 1) });
      },

      prevStep: () => {
        const { currentStep } = get();
        set({ currentStep: Math.max(0, currentStep - 1) });
      },

      // Lease data
      setLease: (lease: Partial<Lease>) => set({ lease }),

      updateLease: (updates: Partial<Lease>) =>
        set((state) => ({
          lease: { ...state.lease, ...updates },
        })),

      setTemplate: (templateId: string) =>
        set({ templateId }),

      // Validation
      setError: (field: string, error: string) =>
        set((state) => ({
          errors: { ...state.errors, [field]: error },
        })),

      clearError: (field: string) =>
        set((state) => {
          const { [field]: _, ...rest } = state.errors;
          return { errors: rest };
        }),

      clearAllErrors: () => set({ errors: {} }),

      // Actions
      saveDraft: () => {
        const { lease } = get();
        const drafts = JSON.parse(localStorage.getItem('lease_drafts') || '[]');
        const existingIndex = drafts.findIndex((d: Lease) => d.id === lease.id);

        if (existingIndex >= 0) {
          drafts[existingIndex] = {
            ...drafts[existingIndex],
            ...lease,
            updatedAt: new Date().toISOString(),
          };
        } else {
          drafts.push({
            ...lease,
            id: lease.id || `draft_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        localStorage.setItem('lease_drafts', JSON.stringify(drafts));
      },

      loadDraft: (leaseId: string) => {
        const drafts = JSON.parse(localStorage.getItem('lease_drafts') || '[]');
        const draft = drafts.find((d: Lease) => d.id === leaseId);
        if (draft) {
          set({ lease: draft });
        }
      },

      clearDraft: () => {
        const { lease } = get();
        if (lease.id) {
          const drafts = JSON.parse(localStorage.getItem('lease_drafts') || '[]');
          const filtered = drafts.filter((d: Lease) => d.id !== lease.id);
          localStorage.setItem('lease_drafts', JSON.stringify(filtered));
        }
      },

      resetBuilder: () => set(initialState),

      // Loading state
      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: 'lease-builder-storage',
      partialize: (state) => ({
        lease: state.lease,
        templateId: state.templateId,
        currentStep: state.currentStep,
      }),
    }
  )
);
