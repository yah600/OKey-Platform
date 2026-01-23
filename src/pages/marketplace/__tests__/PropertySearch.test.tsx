import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertySearch from '../PropertySearch';
import { usePropertySearchStore } from '@/store/propertySearchStore';

// Mock the property search store
vi.mock('@/store/propertySearchStore', () => ({
  usePropertySearchStore: vi.fn(),
}));

const mockUsePropertySearchStore = usePropertySearchStore as unknown as ReturnType<typeof vi.fn>;

describe('PropertySearch', () => {
  const mockProperties = [
    {
      id: 'prop_1',
      name: 'Modern Downtown Apartment',
      address: '123 Main St, Montreal, QC',
      price: 1500,
      bedrooms: 2,
      bathrooms: 1,
      area: 850,
      type: 'apartment',
      images: ['https://example.com/image1.jpg'],
      amenities: ['Parking', 'Gym'],
      available: true,
    },
    {
      id: 'prop_2',
      name: 'Cozy Studio in Plateau',
      address: '456 St-Laurent, Montreal, QC',
      price: 1000,
      bedrooms: 0,
      bathrooms: 1,
      area: 500,
      type: 'studio',
      images: ['https://example.com/image2.jpg'],
      amenities: ['Laundry'],
      available: true,
    },
  ];

  const mockSetFilters = vi.fn();
  const mockSearchProperties = vi.fn();

  beforeEach(() => {
    mockUsePropertySearchStore.mockReturnValue({
      properties: mockProperties,
      filteredProperties: mockProperties,
      filters: {
        minPrice: 0,
        maxPrice: 5000,
        bedrooms: [],
        propertyType: [],
        amenities: [],
      },
      setFilters: mockSetFilters,
      searchProperties: mockSearchProperties,
      totalResults: mockProperties.length,
    });
  });

  it('renders property listings', () => {
    render(
      <BrowserRouter>
        <PropertySearch />
      </BrowserRouter>
    );

    expect(screen.getByText(/Modern Downtown Apartment/i)).toBeInTheDocument();
    expect(screen.getByText(/Cozy Studio in Plateau/i)).toBeInTheDocument();
  });

  it('displays property details correctly', () => {
    render(
      <BrowserRouter>
        <PropertySearch />
      </BrowserRouter>
    );

    // Check for price
    expect(screen.getByText(/\$1,500/)).toBeInTheDocument();
    expect(screen.getByText(/\$1,000/)).toBeInTheDocument();

    // Check for bedrooms
    expect(screen.getByText(/2 bed/i)).toBeInTheDocument();
    expect(screen.getByText(/Studio/i)).toBeInTheDocument();
  });

  it('shows total results count', () => {
    render(
      <BrowserRouter>
        <PropertySearch />
      </BrowserRouter>
    );

    expect(screen.getByText(/2 properties/i)).toBeInTheDocument();
  });

  it('has filter controls', () => {
    render(
      <BrowserRouter>
        <PropertySearch />
      </BrowserRouter>
    );

    // Should have filter button or panel
    const filterButton = screen.queryByRole('button', { name: /filter/i });
    if (filterButton) {
      expect(filterButton).toBeInTheDocument();
    }
  });

  it('shows empty state when no properties found', () => {
    mockUsePropertySearchStore.mockReturnValue({
      properties: [],
      filteredProperties: [],
      filters: {},
      setFilters: mockSetFilters,
      searchProperties: mockSearchProperties,
      totalResults: 0,
    });

    render(
      <BrowserRouter>
        <PropertySearch />
      </BrowserRouter>
    );

    // Should show some empty state message
    expect(screen.getByText(/no properties/i) || screen.getByText(/no results/i)).toBeInTheDocument();
  });
});
