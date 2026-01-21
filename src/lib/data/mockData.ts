// Mock data for OKey Platform
import type { Property, Unit, User, Bid, Lease, MaintenanceRequest, Payment } from '@/types';

// ============================================================================
// MOCK USERS
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@okey.com',
    name: 'Alexandre Dupont',
    role: 'super_admin',
    verified: true,
    okeyScore: 850,
    scoreBreakdown: {
      paymentHistory: 850,
      rentalDuration: 850,
      incomeVerification: 850,
      references: 850,
      identityVerification: 850,
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-21T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'owner@okey.com',
    name: 'Marie Dubois',
    role: 'owner',
    phone: '(514) 555-0100',
    verified: true,
    okeyScore: 810,
    propertyIds: ['prop-1', 'prop-2'],
    scoreBreakdown: {
      paymentHistory: 820,
      rentalDuration: 800,
      incomeVerification: 810,
      references: 805,
      identityVerification: 850,
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2026-01-21T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'tenant@okey.com',
    name: 'Jean Tremblay',
    role: 'tenant',
    phone: '(514) 555-0200',
    verified: true,
    okeyScore: 720,
    unitIds: ['unit-1'],
    scoreBreakdown: {
      paymentHistory: 750,
      rentalDuration: 680,
      incomeVerification: 740,
      references: 710,
      identityVerification: 800,
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-01-21T00:00:00Z',
  },
  {
    id: 'user-4',
    email: 'bidder@okey.com',
    name: 'Sophie Gagnon',
    role: 'tenant',
    phone: '(514) 555-0300',
    verified: true,
    okeyScore: 680,
    scoreBreakdown: {
      paymentHistory: 700,
      rentalDuration: 650,
      incomeVerification: 720,
      references: 660,
      identityVerification: 750,
    },
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2026-01-21T00:00:00Z',
  },
];

// ============================================================================
// MOCK PROPERTIES
// ============================================================================

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    buildingName: 'The Maxwell',
    address: '1200 Rue Saint-Antoine Ouest',
    city: 'Montreal',
    province: 'QC',
    postalCode: 'H3C 1B5',
    country: 'Canada',
    lat: 45.4972,
    lng: -73.5664,
    yearBuilt: 2018,
    totalUnits: 120,
    availableUnits: 8,
    occupancyRate: 93,
    ownerId: 'user-2',
    ownerName: 'Marie Dubois',
    ownerScore: 810,
    amenities: ['Gym', 'Pool', 'Parking', 'Concierge', 'Rooftop Terrace', '24/7 Security'],
    description: 'Luxury high-rise in the heart of downtown Montreal with stunning city views and premium amenities. Modern design with floor-to-ceiling windows, smart home technology, and access to world-class facilities.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    ],
    buildingScore: 782,
    verified: true,
    priceRange: '$1,800 - $3,500',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-01-21T00:00:00Z',
  },
  {
    id: 'prop-2',
    buildingName: 'Riverside Commons',
    address: '88 Rue de la Commune Est',
    city: 'Montreal',
    province: 'QC',
    postalCode: 'H2Y 1J1',
    country: 'Canada',
    lat: 45.5017,
    lng: -73.5540,
    yearBuilt: 2020,
    totalUnits: 85,
    availableUnits: 3,
    occupancyRate: 96,
    ownerId: 'user-2',
    ownerName: 'Marie Dubois',
    ownerScore: 810,
    amenities: ['Gym', 'Bike Storage', 'Pet-friendly', 'Co-working Space', 'EV Charging'],
    description: 'Modern waterfront living with eco-friendly design and smart home technology. Steps from Old Montreal, featuring sustainable building materials and energy-efficient systems.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    ],
    buildingScore: 745,
    verified: true,
    priceRange: '$2,200 - $4,200',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2026-01-21T00:00:00Z',
  },
  {
    id: 'prop-3',
    buildingName: 'Heritage Lofts',
    address: '425 Rue McGill',
    city: 'Montreal',
    province: 'QC',
    postalCode: 'H2Y 2G1',
    country: 'Canada',
    lat: 45.5007,
    lng: -73.5550,
    yearBuilt: 1910,
    totalUnits: 45,
    availableUnits: 2,
    occupancyRate: 95,
    ownerId: 'user-2',
    ownerName: 'Marie Dubois',
    ownerScore: 810,
    amenities: ['Historic Building', 'Exposed Brick', 'High Ceilings', 'Parking'],
    description: 'Beautifully restored heritage building with modern amenities. Original architectural details preserved including exposed brick, hardwood floors, and oversized windows.',
    images: [
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800',
    ],
    buildingScore: 710,
    verified: true,
    priceRange: '$1,600 - $3,200',
    createdAt: '2024-04-15T00:00:00Z',
    updatedAt: '2026-01-21T00:00:00Z',
  },
];

// ============================================================================
// MOCK UNITS
// ============================================================================

export const mockUnits: Unit[] = [
  // The Maxwell Units
  {
    id: 'unit-1',
    propertyId: 'prop-1',
    unitNumber: '4B',
    floor: 4,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: 'rent',
    askingPrice: 2400,
    currentBid: 2450,
    buyNowPrice: 2600,
    auctionActive: true,
    auctionEndsAt: '2026-01-25T23:59:59Z',
    totalBids: 5,
    minScore: 650,
    availableDate: '2026-02-01',
    status: 'available',
    features: [
      'Hardwood Floors',
      'Granite Countertops',
      'In-Unit Laundry',
      'Balcony',
      'Dishwasher',
      'Central AC',
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    description: 'Bright and spacious 2-bedroom unit with stunning city views.',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-01-21T12:00:00Z',
  },
  {
    id: 'unit-2',
    propertyId: 'prop-1',
    unitNumber: '12A',
    floor: 12,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 850,
    type: 'rent',
    askingPrice: 1800,
    currentBid: 1850,
    auctionActive: true,
    auctionEndsAt: '2026-01-28T23:59:59Z',
    totalBids: 3,
    minScore: 600,
    availableDate: '2026-02-15',
    status: 'available',
    features: ['Hardwood Floors', 'In-Unit Laundry', 'Balcony', 'Dishwasher'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    description: 'Cozy 1-bedroom with beautiful views of downtown.',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2026-01-21T10:00:00Z',
  },
  {
    id: 'unit-3',
    propertyId: 'prop-1',
    unitNumber: '18C',
    floor: 18,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1800,
    type: 'rent',
    askingPrice: 3200,
    buyNowPrice: 3500,
    auctionActive: false,
    totalBids: 0,
    minScore: 700,
    availableDate: '2026-03-01',
    status: 'available',
    features: [
      'Hardwood Floors',
      'Granite Countertops',
      'In-Unit Laundry',
      'Large Balcony',
      'Walk-in Closet',
      'Dishwasher',
      'Central AC',
      'Floor-to-Ceiling Windows',
    ],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    description: 'Luxurious 3-bedroom penthouse-style unit with panoramic views.',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2026-01-21T00:00:00Z',
  },
  // Riverside Commons Units
  {
    id: 'unit-4',
    propertyId: 'prop-2',
    unitNumber: '3A',
    floor: 3,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    type: 'rent',
    askingPrice: 2200,
    currentBid: 2300,
    auctionActive: true,
    auctionEndsAt: '2026-01-26T23:59:59Z',
    totalBids: 7,
    minScore: 680,
    availableDate: '2026-02-10',
    status: 'available',
    features: [
      'Waterfront View',
      'Smart Home System',
      'In-Unit Laundry',
      'Balcony',
      'Dishwasher',
    ],
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    ],
    description: 'Eco-friendly 2-bedroom with river views and smart home features.',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2026-01-21T14:00:00Z',
  },
  {
    id: 'unit-5',
    propertyId: 'prop-2',
    unitNumber: '5B',
    floor: 5,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    type: 'rent',
    askingPrice: 1900,
    auctionActive: false,
    totalBids: 0,
    minScore: 620,
    availableDate: '2026-02-20',
    status: 'available',
    features: ['Waterfront View', 'Smart Home System', 'In-Unit Laundry'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    description: 'Modern studio with sustainable features.',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  // Heritage Lofts Units
  {
    id: 'unit-6',
    propertyId: 'prop-3',
    unitNumber: '8C',
    floor: 8,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1400,
    type: 'rent',
    askingPrice: 2100,
    currentBid: 2200,
    auctionActive: true,
    auctionEndsAt: '2026-01-27T23:59:59Z',
    totalBids: 4,
    minScore: 650,
    availableDate: '2026-03-01',
    status: 'available',
    features: [
      'Exposed Brick',
      'High Ceilings',
      'Hardwood Floors',
      'Large Windows',
      'Updated Kitchen',
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    description: 'Character-filled loft with original architectural details.',
    createdAt: '2024-04-20T00:00:00Z',
    updatedAt: '2026-01-21T11:00:00Z',
  },
];

// ============================================================================
// MOCK BIDS
// ============================================================================

export const mockBids: Bid[] = [
  {
    id: 'bid-1',
    unitId: 'unit-1',
    bidderId: 'user-3',
    bidderName: 'Jean Tremblay',
    bidderScore: 720,
    bidderEmail: 'tenant@okey.com',
    amount: 2450,
    autoBid: false,
    status: 'active',
    createdAt: '2026-01-21T10:30:00Z',
    updatedAt: '2026-01-21T10:30:00Z',
  },
  {
    id: 'bid-2',
    unitId: 'unit-1',
    bidderId: 'user-4',
    bidderName: 'Sophie Gagnon',
    bidderScore: 680,
    bidderEmail: 'bidder@okey.com',
    amount: 2400,
    autoBid: true,
    maxAutoBid: 2500,
    status: 'outbid',
    createdAt: '2026-01-21T09:00:00Z',
    updatedAt: '2026-01-21T10:30:00Z',
  },
  {
    id: 'bid-3',
    unitId: 'unit-2',
    bidderId: 'user-4',
    bidderName: 'Sophie Gagnon',
    bidderScore: 680,
    bidderEmail: 'bidder@okey.com',
    amount: 1850,
    autoBid: false,
    status: 'active',
    createdAt: '2026-01-20T15:00:00Z',
    updatedAt: '2026-01-20T15:00:00Z',
  },
  {
    id: 'bid-4',
    unitId: 'unit-4',
    bidderId: 'user-3',
    bidderName: 'Jean Tremblay',
    bidderScore: 720,
    bidderEmail: 'tenant@okey.com',
    amount: 2300,
    autoBid: false,
    status: 'active',
    createdAt: '2026-01-21T08:00:00Z',
    updatedAt: '2026-01-21T08:00:00Z',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find((p) => p.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return mockUnits.find((u) => u.id === id);
}

export function getUnitsByPropertyId(propertyId: string): Unit[] {
  return mockUnits.filter((u) => u.propertyId === propertyId);
}

export function getBidsByUnitId(unitId: string): Bid[] {
  return mockBids.filter((b) => b.unitId === unitId).sort((a, b) => b.amount - a.amount);
}

export function getBidsByUserId(userId: string): Bid[] {
  return mockBids.filter((b) => b.bidderId === userId);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getAvailableUnits(): Unit[] {
  return mockUnits.filter((u) => u.status === 'available');
}

export function getActiveAuctions(): Unit[] {
  return mockUnits.filter((u) => u.auctionActive && u.status === 'available');
}
