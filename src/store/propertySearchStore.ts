import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  image: string;
  images: string[];
  units: number;
  availableUnits: number;
  priceFrom: number;
  priceTo: number;
  type: 'Apartment' | 'Condo' | 'House' | 'Loft' | 'Townhouse';
  beds: string;
  baths: string;
  yearBuilt: number;
  description: string;
  amenities: string[];
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  propertyType: string;
  priceMin: number;
  priceMax: number;
  beds: string;
  baths: string;
  city: string;
}

export interface SortOption {
  field: 'priceFrom' | 'createdAt' | 'name';
  direction: 'asc' | 'desc';
}

interface PropertySearchState {
  properties: Property[];
  filters: SearchFilters;
  sortBy: SortOption;
  currentPage: number;
  itemsPerPage: number;

  // Actions
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setSortBy: (sort: SortOption) => void;
  setCurrentPage: (page: number) => void;
  getFilteredProperties: () => Property[];
  getPaginatedProperties: () => Property[];
  getTotalPages: () => number;
}

const defaultFilters: SearchFilters = {
  query: '',
  propertyType: 'all',
  priceMin: 0,
  priceMax: 10000,
  beds: 'all',
  baths: 'all',
  city: 'all',
};

// Mock property data - in production this would come from API
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Main St',
    city: 'Montreal',
    province: 'QC',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
    ],
    units: 12,
    availableUnits: 3,
    priceFrom: 1800,
    priceTo: 2200,
    type: 'Apartment',
    beds: '1-2',
    baths: '1',
    yearBuilt: 2018,
    description: 'Modern apartment complex in downtown Montreal',
    amenities: ['Gym', 'Parking', 'Security'],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Downtown Plaza',
    address: '456 King St',
    city: 'Montreal',
    province: 'QC',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
    ],
    units: 20,
    availableUnits: 5,
    priceFrom: 2200,
    priceTo: 3500,
    type: 'Condo',
    beds: '2-3',
    baths: '2',
    yearBuilt: 2020,
    description: 'Luxury condos in the heart of downtown',
    amenities: ['Concierge', 'Pool', 'Gym', 'Parking'],
    createdAt: '2026-01-18T14:30:00Z',
  },
  {
    id: '3',
    name: 'Riverside Complex',
    address: '789 River Rd',
    city: 'Laval',
    province: 'QC',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
    ],
    units: 8,
    availableUnits: 2,
    priceFrom: 2500,
    priceTo: 3200,
    type: 'House',
    beds: '3-4',
    baths: '2.5',
    yearBuilt: 2019,
    description: 'Spacious family homes near the waterfront',
    amenities: ['Backyard', 'Garage', 'Parking'],
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: '4',
    name: 'Urban Lofts',
    address: '321 Urban Ave',
    city: 'Montreal',
    province: 'QC',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
    ],
    units: 15,
    availableUnits: 4,
    priceFrom: 1950,
    priceTo: 2400,
    type: 'Loft',
    beds: '1-2',
    baths: '1',
    yearBuilt: 2017,
    description: 'Industrial-style lofts with high ceilings',
    amenities: ['Bike Storage', 'Rooftop', 'Parking'],
    createdAt: '2026-01-20T11:15:00Z',
  },
  {
    id: '5',
    name: 'Garden Residences',
    address: '555 Park Blvd',
    city: 'Laval',
    province: 'QC',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
    ],
    units: 24,
    availableUnits: 6,
    priceFrom: 1750,
    priceTo: 2800,
    type: 'Apartment',
    beds: '1-3',
    baths: '1-2',
    yearBuilt: 2021,
    description: 'Eco-friendly apartments surrounded by green spaces',
    amenities: ['Garden', 'Playground', 'Gym', 'Parking'],
    createdAt: '2026-01-12T16:45:00Z',
  },
  {
    id: '6',
    name: 'Executive Towers',
    address: '888 Business St',
    city: 'Montreal',
    province: 'QC',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
    ],
    units: 30,
    availableUnits: 8,
    priceFrom: 2800,
    priceTo: 4500,
    type: 'Condo',
    beds: '2-4',
    baths: '2-3',
    yearBuilt: 2022,
    description: 'Premium high-rise condos with panoramic views',
    amenities: ['Concierge', 'Pool', 'Spa', 'Gym', 'Valet Parking'],
    createdAt: '2026-01-22T08:00:00Z',
  },
  {
    id: '7',
    name: 'Plateau Studios',
    address: '234 Saint-Denis St',
    city: 'Montreal',
    province: 'QC',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
    ],
    units: 10,
    availableUnits: 3,
    priceFrom: 1500,
    priceTo: 1800,
    type: 'Apartment',
    beds: '1',
    baths: '1',
    yearBuilt: 2016,
    description: 'Affordable studios in vibrant Plateau neighborhood',
    amenities: ['Bike Storage', 'Laundry'],
    createdAt: '2026-01-08T13:20:00Z',
  },
  {
    id: '8',
    name: 'Waterfront Villas',
    address: '777 Lakeside Dr',
    city: 'Laval',
    province: 'QC',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
    ],
    units: 6,
    availableUnits: 1,
    priceFrom: 3500,
    priceTo: 4200,
    type: 'House',
    beds: '4',
    baths: '3',
    yearBuilt: 2023,
    description: 'Luxury lakeside villas with private docks',
    amenities: ['Private Dock', 'Garage', 'Garden', 'Security'],
    createdAt: '2026-01-19T10:30:00Z',
  },
];

export const usePropertySearchStore = create<PropertySearchState>()(
  persist(
    (set, get) => ({
      properties: mockProperties,
      filters: defaultFilters,
      sortBy: { field: 'createdAt', direction: 'desc' },
      currentPage: 1,
      itemsPerPage: 9,

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1, // Reset to first page when filters change
        }));
      },

      resetFilters: () => {
        set({
          filters: defaultFilters,
          currentPage: 1,
        });
      },

      setSortBy: (sort) => {
        set({ sortBy: sort, currentPage: 1 });
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      getFilteredProperties: () => {
        const { properties, filters, sortBy } = get();

        let filtered = properties.filter((property) => {
          // Search query filter
          const matchesQuery =
            filters.query === '' ||
            property.name.toLowerCase().includes(filters.query.toLowerCase()) ||
            property.address.toLowerCase().includes(filters.query.toLowerCase()) ||
            property.city.toLowerCase().includes(filters.query.toLowerCase());

          // Property type filter
          const matchesType =
            filters.propertyType === 'all' ||
            property.type.toLowerCase() === filters.propertyType.toLowerCase();

          // Price filter
          const matchesPrice =
            property.priceFrom >= filters.priceMin &&
            property.priceFrom <= filters.priceMax;

          // City filter
          const matchesCity =
            filters.city === 'all' ||
            property.city.toLowerCase() === filters.city.toLowerCase();

          // Beds filter
          const matchesBeds = filters.beds === 'all' || property.beds.includes(filters.beds);

          // Baths filter
          const matchesBaths = filters.baths === 'all' || property.baths.includes(filters.baths);

          return (
            matchesQuery &&
            matchesType &&
            matchesPrice &&
            matchesCity &&
            matchesBeds &&
            matchesBaths
          );
        });

        // Sort
        filtered.sort((a, b) => {
          const aValue = a[sortBy.field];
          const bValue = b[sortBy.field];

          if (sortBy.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        return filtered;
      },

      getPaginatedProperties: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredProperties();

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return filtered.slice(startIndex, endIndex);
      },

      getTotalPages: () => {
        const { itemsPerPage } = get();
        const filtered = get().getFilteredProperties();
        return Math.ceil(filtered.length / itemsPerPage);
      },
    }),
    {
      name: 'okey-property-search-storage',
      partialize: (state) => ({
        filters: state.filters,
        sortBy: state.sortBy,
      }),
    }
  )
);
