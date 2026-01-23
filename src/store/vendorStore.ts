import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Vendor {
  id: string;
  ownerId: string;
  name: string;
  category: 'Plumbing' | 'HVAC' | 'Electrical' | 'Cleaning' | 'Landscaping' | 'Roofing' | 'Painting' | 'Other';
  phone: string;
  email: string;
  address: string;
  rating: number; // 0-5
  completedJobs: number;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface VendorState {
  vendors: Vendor[];
  getVendorsByOwner: (ownerId: string) => Vendor[];
  getVendorById: (vendorId: string) => Vendor | undefined;
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'completedJobs'>) => void;
  updateVendor: (vendorId: string, updates: Partial<Vendor>) => void;
  deleteVendor: (vendorId: string) => void;
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      vendors: [
        {
          id: 'vendor-1',
          ownerId: 'owner-1',
          name: 'ABC Plumbing Services',
          category: 'Plumbing',
          phone: '+1 (514) 555-0101',
          email: 'contact@abcplumbing.com',
          address: '123 Service St, Montreal, QC H2X 1A1',
          rating: 4.8,
          completedJobs: 24,
          status: 'active',
          notes: 'Reliable for emergency repairs',
          createdAt: '2024-06-15T10:00:00Z',
          updatedAt: '2026-01-15T14:30:00Z',
        },
        {
          id: 'vendor-2',
          ownerId: 'owner-1',
          name: 'Elite HVAC Solutions',
          category: 'HVAC',
          phone: '+1 (514) 555-0202',
          email: 'info@elitehvac.com',
          address: '456 Repair Ave, Montreal, QC H3B 2C2',
          rating: 4.9,
          completedJobs: 18,
          status: 'active',
          notes: 'Excellent for annual maintenance',
          createdAt: '2024-08-20T10:00:00Z',
          updatedAt: '2026-01-10T11:15:00Z',
        },
        {
          id: 'vendor-3',
          ownerId: 'owner-1',
          name: 'Professional Electricians Inc',
          category: 'Electrical',
          phone: '+1 (514) 555-0303',
          email: 'service@proelec.com',
          address: '789 Power Rd, Montreal, QC H4C 3D3',
          rating: 4.7,
          completedJobs: 31,
          status: 'active',
          notes: 'Quick response time',
          createdAt: '2024-05-10T10:00:00Z',
          updatedAt: '2026-01-12T09:45:00Z',
        },
        {
          id: 'vendor-4',
          ownerId: 'owner-1',
          name: 'Clean & Shine Maintenance',
          category: 'Cleaning',
          phone: '+1 (514) 555-0404',
          email: 'hello@cleanshine.com',
          address: '321 Sparkle Ln, Montreal, QC H5D 4E4',
          rating: 4.6,
          completedJobs: 42,
          status: 'active',
          notes: 'Monthly deep cleaning service',
          createdAt: '2024-03-25T10:00:00Z',
          updatedAt: '2026-01-18T16:20:00Z',
        },
        {
          id: 'vendor-5',
          ownerId: 'owner-1',
          name: 'Garden Masters Landscaping',
          category: 'Landscaping',
          phone: '+1 (514) 555-0505',
          email: 'info@gardenmasters.com',
          address: '654 Green Way, Montreal, QC H6E 5F5',
          rating: 4.5,
          completedJobs: 15,
          status: 'inactive',
          notes: 'Seasonal service - not currently contracted',
          createdAt: '2024-04-12T10:00:00Z',
          updatedAt: '2025-11-01T10:00:00Z',
        },
        {
          id: 'vendor-6',
          ownerId: 'owner-1',
          name: 'Superior Roofing Co',
          category: 'Roofing',
          phone: '+1 (514) 555-0606',
          email: 'contact@superiorroofing.com',
          address: '987 Heights Blvd, Montreal, QC H7F 6G6',
          rating: 4.9,
          completedJobs: 8,
          status: 'active',
          notes: 'Specializes in flat roof repairs',
          createdAt: '2024-09-05T10:00:00Z',
          updatedAt: '2026-01-08T13:00:00Z',
        },
      ],

      getVendorsByOwner: (ownerId) => {
        return get()
          .vendors.filter((v) => v.ownerId === ownerId)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getVendorById: (vendorId) => {
        return get().vendors.find((v) => v.id === vendorId);
      },

      addVendor: (vendor) => {
        const newVendor: Vendor = {
          ...vendor,
          id: `vendor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          rating: 0,
          completedJobs: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          vendors: [newVendor, ...state.vendors],
        }));
      },

      updateVendor: (vendorId, updates) => {
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === vendorId
              ? { ...v, ...updates, updatedAt: new Date().toISOString() }
              : v
          ),
        }));
      },

      deleteVendor: (vendorId) => {
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== vendorId),
        }));
      },
    }),
    {
      name: 'okey-vendor-storage',
    }
  )
);
