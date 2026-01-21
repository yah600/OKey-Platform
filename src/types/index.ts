// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export type UserRole =
  | 'super_admin'
  | 'property_manager'
  | 'board_member'
  | 'accountant'
  | 'owner'
  | 'tenant'
  | 'vendor'
  | 'emergency_agent'
  | 'public'; // For marketplace browsing

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;

  // Permissions
  propertyIds?: string[]; // Properties this user has access to
  unitIds?: string[]; // Units this user has access to

  // O'Key Score
  okeyScore?: number; // 300-850
  scoreBreakdown?: {
    paymentHistory: number;
    rentalDuration: number;
    incomeVerification: number;
    references: number;
    identityVerification: number;
  };

  // Profile
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PROPERTY TYPES
// ============================================================================

export interface Property {
  id: string;
  buildingName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;

  // Location
  lat: number;
  lng: number;

  // Details
  yearBuilt: number;
  totalUnits: number;
  availableUnits: number;
  occupancyRate: number;

  // Ownership
  ownerId: string;
  ownerName?: string;
  ownerScore?: number;

  // Features
  amenities: string[];
  description: string;
  images: string[];

  // Scores & Verification
  buildingScore: number; // Quality/condition score
  verified: boolean;

  // Financial
  priceRange?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor: number;

  // Physical details
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'rent' | 'buy';

  // Pricing
  askingPrice: number;
  currentBid?: number;
  buyNowPrice?: number;

  // Auction details
  auctionActive: boolean;
  auctionEndsAt?: string;
  totalBids: number;
  minScore: number; // Minimum O'Key score required to bid

  // Availability
  availableDate: string;
  status: 'available' | 'pending' | 'rented' | 'sold';

  // Current occupant
  currentTenantId?: string;
  leaseEndDate?: string;

  // Features
  features: string[];
  images: string[];
  description?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// BIDDING & AUCTION TYPES
// ============================================================================

export interface Bid {
  id: string;
  unitId: string;

  // Bidder info
  bidderId: string;
  bidderName: string;
  bidderScore: number;
  bidderEmail?: string;

  // Bid details
  amount: number;
  autoBid: boolean;
  maxAutoBid?: number;

  // Status
  status: 'active' | 'accepted' | 'rejected' | 'withdrawn' | 'outbid';

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Lease {
  id: string;
  unitId: string;
  propertyId: string;

  // Parties
  tenantId: string;
  landlordId: string;

  // Terms
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;

  // Payment
  paymentDay: number; // Day of month
  paymentMethod?: 'manual' | 'auto' | 'pad';

  // Status
  status: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
  signedAt?: string;

  // Documents
  documentUrl?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PROPERTY MANAGEMENT TYPES
// ============================================================================

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  unitId?: string;

  // Request details
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'emergency';

  // Submitted by
  submittedBy: string;
  submittedByName?: string;

  // Assignment
  assignedTo?: string;
  assignedToName?: string;

  // Status
  status: 'new' | 'triaged' | 'assigned' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

  // Urgency scoring
  urgencyScore?: number; // 1-100

  // Estimated completion
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;

  // Media
  images?: string[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;

  // Related entities
  propertyId: string;
  unitId: string;
  tenantId: string;
  leaseId: string;

  // Payment details
  amount: number;
  type: 'rent' | 'late_fee' | 'security_deposit' | 'utility' | 'other';
  method: 'credit_card' | 'bank_transfer' | 'pad' | 'check' | 'cash';

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

  // Payment period
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  paidAt?: string;

  // External references
  stripePaymentId?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;

  // Related entities
  propertyId?: string;
  unitId?: string;
  userId?: string;

  // Document details
  title: string;
  description?: string;
  category: 'lease' | 'financial' | 'legal' | 'maintenance' | 'compliance' | 'other';
  fileType: string;
  fileSize: number;
  fileUrl: string;

  // Access control
  accessLevel: 'public' | 'property' | 'unit' | 'private';

  // Metadata
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  userId: string;

  // Notification details
  type: 'bid' | 'payment' | 'maintenance' | 'lease' | 'message' | 'system';
  title: string;
  message: string;

  // Related entity
  relatedId?: string;
  relatedType?: 'property' | 'unit' | 'bid' | 'payment' | 'maintenance';

  // Status
  read: boolean;
  actionUrl?: string;

  // Metadata
  createdAt: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface PropertyAnalytics {
  propertyId: string;

  // Occupancy
  occupancyRate: number;
  avgDaysToRent: number;

  // Financial
  totalRevenue: number;
  avgRentPrice: number;
  collectionRate: number;

  // Maintenance
  avgMaintenanceTime: number;
  maintenanceSpend: number;

  // Trends
  period: 'month' | 'quarter' | 'year';
  comparedToPrevious: number;
}

// ============================================================================
// FORM & UI TYPES
// ============================================================================

export interface SearchFilters {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: 'rent' | 'buy';
  amenities?: string[];
  minScore?: number;
  availableDate?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
