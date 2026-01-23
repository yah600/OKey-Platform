import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OwnerProperty {
  id: string;
  ownerId: string;
  name: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  type: 'residential' | 'commercial' | 'mixed';
  yearBuilt: number;
  totalUnits: number;
  occupiedUnits: number;
  availableUnits: number;
  monthlyRevenue: number;
  expenses: number;
  netIncome: number;
  imageUrl?: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rent: number;
  status: 'occupied' | 'available' | 'maintenance';
  tenantId?: string;
  tenantName?: string;
  leaseStart?: string;
  leaseEnd?: string;
}

interface OwnerPropertiesState {
  properties: OwnerProperty[];
  units: PropertyUnit[];

  // Property Actions
  getPropertiesByOwner: (ownerId: string) => OwnerProperty[];
  getPropertyById: (propertyId: string) => OwnerProperty | undefined;
  addProperty: (property: Omit<OwnerProperty, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProperty: (propertyId: string, updates: Partial<OwnerProperty>) => void;

  // Unit Actions
  getUnitsByProperty: (propertyId: string) => PropertyUnit[];
  getUnitById: (unitId: string) => PropertyUnit | undefined;
  addUnit: (unit: Omit<PropertyUnit, 'id'>) => void;
  updateUnit: (unitId: string, updates: Partial<PropertyUnit>) => void;
  deleteUnit: (unitId: string) => void;
  getOccupiedUnitsCount: (propertyId: string) => number;
  getTotalRevenue: (ownerId: string) => number;
}

export const useOwnerPropertiesStore = create<OwnerPropertiesState>()(
  persist(
    (set, get) => ({
      properties: [
        {
          id: 'prop-owner-1',
          ownerId: 'owner-1',
          name: 'Sunset Apartments',
          address: {
            street: '123 Main St',
            city: 'Montreal',
            province: 'QC',
            postalCode: 'H3A 1B2',
          },
          type: 'residential',
          yearBuilt: 2018,
          totalUnits: 24,
          occupiedUnits: 24,
          availableUnits: 0,
          monthlyRevenue: 48000,
          expenses: 18000,
          netIncome: 30000,
          amenities: ['Gym', 'Parking', 'Security', 'Elevator'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2026-01-20T14:30:00Z',
        },
        {
          id: 'prop-owner-2',
          ownerId: 'owner-1',
          name: 'Downtown Plaza',
          address: {
            street: '456 King St',
            city: 'Montreal',
            province: 'QC',
            postalCode: 'H2X 1A1',
          },
          type: 'residential',
          yearBuilt: 2020,
          totalUnits: 18,
          occupiedUnits: 16,
          availableUnits: 2,
          monthlyRevenue: 39200,
          expenses: 14000,
          netIncome: 25200,
          amenities: ['Concierge', 'Pool', 'Gym', 'Parking'],
          createdAt: '2024-03-10T10:00:00Z',
          updatedAt: '2026-01-18T09:15:00Z',
        },
        {
          id: 'prop-owner-3',
          ownerId: 'owner-1',
          name: 'Riverside Complex',
          address: {
            street: '789 River Rd',
            city: 'Laval',
            province: 'QC',
            postalCode: 'H7L 2K5',
          },
          type: 'residential',
          yearBuilt: 2019,
          totalUnits: 8,
          occupiedUnits: 8,
          availableUnits: 0,
          monthlyRevenue: 25000,
          expenses: 9000,
          netIncome: 16000,
          amenities: ['Parking', 'Backyard', 'Garden'],
          createdAt: '2024-06-05T10:00:00Z',
          updatedAt: '2026-01-15T11:00:00Z',
        },
      ],

      units: [
        // Sunset Apartments units
        ...Array.from({ length: 24 }, (_, i) => ({
          id: `unit-sunset-${i + 1}`,
          propertyId: 'prop-owner-1',
          unitNumber: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
          bedrooms: i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 3,
          bathrooms: i % 3 === 0 ? 1 : 2,
          sqft: 650 + (i % 3) * 200,
          rent: 1800 + (i % 3) * 400,
          status: 'occupied' as const,
          tenantId: `tenant-${i + 1}`,
          tenantName: `Tenant ${i + 1}`,
          leaseStart: '2025-09-01',
          leaseEnd: '2026-08-31',
        })),

        // Downtown Plaza units
        ...Array.from({ length: 18 }, (_, i) => ({
          id: `unit-downtown-${i + 1}`,
          propertyId: 'prop-owner-2',
          unitNumber: `${Math.floor(i / 3) + 1}${String.fromCharCode(65 + (i % 3))}`,
          bedrooms: i % 2 === 0 ? 2 : 3,
          bathrooms: 2,
          sqft: 850 + (i % 2) * 100,
          rent: 2200 + (i % 2) * 300,
          status: i < 16 ? ('occupied' as const) : ('available' as const),
          ...(i < 16 && {
            tenantId: `tenant-downtown-${i + 1}`,
            tenantName: `Tenant ${i + 1}`,
            leaseStart: '2025-10-01',
            leaseEnd: '2026-09-30',
          }),
        })),

        // Riverside Complex units
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `unit-riverside-${i + 1}`,
          propertyId: 'prop-owner-3',
          unitNumber: `${i + 1}`,
          bedrooms: 3 + (i % 2),
          bathrooms: 2 + (i % 2),
          sqft: 1200 + (i % 2) * 300,
          rent: 2800 + (i % 2) * 400,
          status: 'occupied' as const,
          tenantId: `tenant-riverside-${i + 1}`,
          tenantName: `Tenant ${i + 1}`,
          leaseStart: '2025-07-01',
          leaseEnd: '2026-06-30',
        })),
      ],

      getPropertiesByOwner: (ownerId) => {
        return get()
          .properties.filter((p) => p.ownerId === ownerId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getPropertyById: (propertyId) => {
        return get().properties.find((p) => p.id === propertyId);
      },

      addProperty: (property) => {
        const newProperty: OwnerProperty = {
          ...property,
          id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          properties: [newProperty, ...state.properties],
        }));
      },

      updateProperty: (propertyId, updates) => {
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === propertyId
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      getUnitsByProperty: (propertyId) => {
        return get().units.filter((u) => u.propertyId === propertyId);
      },

      getUnitById: (unitId) => {
        return get().units.find((u) => u.id === unitId);
      },

      addUnit: (unit) => {
        const newUnit: PropertyUnit = {
          ...unit,
          id: `unit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        set((state) => ({
          units: [newUnit, ...state.units],
        }));

        // Update property stats
        const property = get().properties.find((p) => p.id === unit.propertyId);
        if (property) {
          const updatedOccupiedCount = get().getOccupiedUnitsCount(unit.propertyId);
          const updatedTotalUnits = property.totalUnits + 1;
          const updatedAvailableUnits = updatedTotalUnits - updatedOccupiedCount;

          get().updateProperty(unit.propertyId, {
            totalUnits: updatedTotalUnits,
            occupiedUnits: updatedOccupiedCount,
            availableUnits: updatedAvailableUnits,
          });
        }
      },

      updateUnit: (unitId, updates) => {
        const oldUnit = get().units.find((u) => u.id === unitId);

        set((state) => ({
          units: state.units.map((u) =>
            u.id === unitId ? { ...u, ...updates } : u
          ),
        }));

        // Update property stats if status changed
        if (oldUnit && updates.status && updates.status !== oldUnit.status) {
          const property = get().properties.find((p) => p.id === oldUnit.propertyId);
          if (property) {
            const updatedOccupiedCount = get().getOccupiedUnitsCount(oldUnit.propertyId);
            const updatedAvailableUnits = property.totalUnits - updatedOccupiedCount;

            get().updateProperty(oldUnit.propertyId, {
              occupiedUnits: updatedOccupiedCount,
              availableUnits: updatedAvailableUnits,
            });
          }
        }
      },

      deleteUnit: (unitId) => {
        const unit = get().units.find((u) => u.id === unitId);

        set((state) => ({
          units: state.units.filter((u) => u.id !== unitId),
        }));

        // Update property stats
        if (unit) {
          const property = get().properties.find((p) => p.id === unit.propertyId);
          if (property) {
            const updatedOccupiedCount = get().getOccupiedUnitsCount(unit.propertyId);
            const updatedTotalUnits = property.totalUnits - 1;
            const updatedAvailableUnits = updatedTotalUnits - updatedOccupiedCount;

            get().updateProperty(unit.propertyId, {
              totalUnits: updatedTotalUnits,
              occupiedUnits: updatedOccupiedCount,
              availableUnits: updatedAvailableUnits,
            });
          }
        }
      },

      getOccupiedUnitsCount: (propertyId) => {
        return get().units.filter((u) => u.propertyId === propertyId && u.status === 'occupied')
          .length;
      },

      getTotalRevenue: (ownerId) => {
        const ownerProperties = get().getPropertiesByOwner(ownerId);
        return ownerProperties.reduce((total, prop) => total + prop.monthlyRevenue, 0);
      },
    }),
    {
      name: 'okey-owner-properties-storage',
    }
  )
);
