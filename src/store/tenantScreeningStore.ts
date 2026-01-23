import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Application, ApplicationStatus, ScreeningResults } from '@/types/screening';

interface TenantScreeningStore {
  applications: Application[];

  // Actions
  addApplication: (application: Omit<Application, 'id' | 'submittedAt' | 'overallScore'>) => string;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  getApplicationById: (id: string) => Application | undefined;
  getApplicationsByProperty: (propertyId: string) => Application[];
  getApplicationsByStatus: (status: ApplicationStatus) => Application[];

  // Screening actions
  updateScreening: (id: string, screening: Partial<ScreeningResults>) => void;
  calculateOverallScore: (id: string) => number;

  // Status actions
  approveApplication: (id: string, reviewedBy: string) => void;
  rejectApplication: (id: string, reviewedBy: string, reason: string) => void;
}

/**
 * Tenant Screening Store
 * Manages rental applications and screening workflow
 */
export const useTenantScreeningStore = create<TenantScreeningStore>()(
  persist(
    (set, get) => ({
      applications: [],

      addApplication: (application) => {
        const newApplication: Application = {
          ...application,
          id: `app_${Date.now()}`,
          submittedAt: new Date().toISOString(),
          overallScore: 0,
        };

        set((state) => ({
          applications: [...state.applications, newApplication],
        }));

        // Calculate initial score
        get().calculateOverallScore(newApplication.id);

        return newApplication.id;
      },

      updateApplication: (id, updates) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app
          ),
        }));

        // Recalculate score if screening updated
        if (updates.screening) {
          get().calculateOverallScore(id);
        }
      },

      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        }));
      },

      getApplicationById: (id) => {
        return get().applications.find((app) => app.id === id);
      },

      getApplicationsByProperty: (propertyId) => {
        return get().applications.filter((app) => app.propertyId === propertyId);
      },

      getApplicationsByStatus: (status) => {
        return get().applications.filter((app) => app.status === status);
      },

      updateScreening: (id, screening) => {
        const application = get().getApplicationById(id);
        if (application) {
          get().updateApplication(id, {
            screening: { ...application.screening, ...screening },
          });
        }
      },

      calculateOverallScore: (id) => {
        const application = get().getApplicationById(id);
        if (!application) return 0;

        const { screening } = application;
        let totalScore = 0;
        let maxScore = 0;

        // Credit check (30 points)
        if (screening.creditCheck.status === 'completed' && screening.creditCheck.score) {
          const creditScore = screening.creditCheck.score;
          if (creditScore >= 750) totalScore += 30;
          else if (creditScore >= 700) totalScore += 25;
          else if (creditScore >= 650) totalScore += 20;
          else if (creditScore >= 600) totalScore += 15;
          else totalScore += 10;
        }
        maxScore += 30;

        // Income verification (25 points)
        if (screening.incomeVerification.status === 'verified') {
          if (screening.incomeVerification.meetsRequirement) totalScore += 25;
          else totalScore += 15;
        }
        maxScore += 25;

        // References (20 points)
        const completedRefs = screening.references.filter((ref) => ref.contacted);
        if (completedRefs.length > 0) {
          const avgRating =
            completedRefs.reduce((sum, ref) => sum + (ref.rating || 0), 0) / completedRefs.length;
          totalScore += (avgRating / 5) * 20;
        }
        maxScore += 20;

        // Background check (15 points)
        if (screening.backgroundCheck.status === 'completed') {
          if (!screening.backgroundCheck.criminalRecord && !screening.backgroundCheck.evictionHistory) {
            totalScore += 15;
          } else if (!screening.backgroundCheck.evictionHistory) {
            totalScore += 10;
          } else {
            totalScore += 5;
          }
        }
        maxScore += 15;

        // Employment verification (10 points)
        if (screening.employmentVerification.status === 'verified') {
          totalScore += 10;
        }
        maxScore += 10;

        const overallScore = Math.round((totalScore / maxScore) * 100);

        get().updateApplication(id, { overallScore });

        return overallScore;
      },

      approveApplication: (id, reviewedBy) => {
        get().updateApplication(id, {
          status: 'approved',
          reviewedAt: new Date().toISOString(),
          reviewedBy,
        });
      },

      rejectApplication: (id, reviewedBy, reason) => {
        get().updateApplication(id, {
          status: 'rejected',
          reviewedAt: new Date().toISOString(),
          reviewedBy,
          notes: reason,
        });
      },
    }),
    {
      name: 'tenant-screening-storage',
    }
  )
);
