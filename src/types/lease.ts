/**
 * Lease Management Types
 * Used for lease creation, editing, and management
 */

export type LeaseType = 'residential_annual' | 'short_term' | 'commercial' | 'renewal';

export type LeaseStatus = 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';

export interface LeaseTemplate {
  id: string;
  type: LeaseType;
  name: string;
  description: string;
  defaultDuration: number; // in months
  clauses: LeaseClause[];
}

export interface LeaseClause {
  id: string;
  category: string;
  title: string;
  content: string;
  required: boolean;
  editable: boolean;
}

export interface LeaseTerm {
  startDate: string;
  endDate: string;
  duration: number; // in months
  rentAmount: number;
  rentDueDay: number; // 1-31
  paymentSchedule: 'monthly' | 'bi-weekly' | 'weekly';
  securityDeposit: number;
  firstMonthRent: boolean;
  lastMonthRent: boolean;
  lateFeeAmount?: number;
  lateFeeGracePeriod?: number; // days
}

export interface LeaseParties {
  landlordId: string;
  landlordName: string;
  landlordEmail: string;
  landlordPhone: string;
  tenantId?: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  coTenants?: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
}

export interface LeaseProperty {
  propertyId: string;
  unitId: string;
  address: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

export interface LeaseAdditionalTerms {
  petsAllowed: boolean;
  petDeposit?: number;
  petRent?: number;
  smokingAllowed: boolean;
  parkingSpots?: number;
  parkingFee?: number;
  utilitiesIncluded: string[];
  maintenanceResponsibility: {
    landlord: string[];
    tenant: string[];
  };
}

export interface Lease {
  id: string;
  type: LeaseType;
  status: LeaseStatus;

  // Parties
  parties: LeaseParties;

  // Property
  property: LeaseProperty;

  // Terms
  terms: LeaseTerm;

  // Additional Terms
  additionalTerms: LeaseAdditionalTerms;

  // Custom Clauses
  customClauses: string; // Rich text HTML

  // Selected Standard Clauses
  selectedClauses: string[]; // Array of clause IDs

  // Documents
  documentUrl?: string; // PDF URL
  signatureStatus: {
    landlordSigned: boolean;
    landlordSignedAt?: string;
    tenantSigned: boolean;
    tenantSignedAt?: string;
  };

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface LeaseBuilderState {
  currentStep: number;
  lease: Partial<Lease>;
  templateId?: string;
  isLoading: boolean;
  errors: Record<string, string>;
}
