/**
 * Tenant Screening Types
 * Used for rental application and tenant screening management
 */

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export type ScreeningCategory =
  | 'credit_check'
  | 'background_check'
  | 'employment_verification'
  | 'references'
  | 'income_verification'
  | 'rental_history';

export interface Application {
  id: string;
  propertyId: string;
  unitId: string;
  status: ApplicationStatus;

  // Applicant Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentAddress: string;
  dateOfBirth: string;

  // Employment
  employer: string;
  jobTitle: string;
  employmentDuration: number; // months
  annualIncome: number;

  // Rental Info
  desiredMoveInDate: string;
  leaseTermPreference: number; // months
  numberOfOccupants: number;
  hasPets: boolean;
  petDetails?: string;

  // Documents
  documents: ApplicationDocument[];

  // Screening
  screening: ScreeningResults;
  overallScore: number; // 0-100

  // Metadata
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface ApplicationDocument {
  id: string;
  type: 'id' | 'pay_stub' | 'tax_return' | 'reference_letter' | 'other';
  name: string;
  url: string; // Base64 or URL
  uploadedAt: string;
}

export interface ScreeningResults {
  creditCheck: CreditCheckResult;
  backgroundCheck: BackgroundCheckResult;
  employmentVerification: EmploymentVerificationResult;
  references: ReferenceCheckResult[];
  incomeVerification: IncomeVerificationResult;
  rentalHistory: RentalHistoryResult;
}

export interface CreditCheckResult {
  status: 'pending' | 'completed' | 'not_required';
  score?: number; // 300-850
  reportDate?: string;
  notes?: string;
}

export interface BackgroundCheckResult {
  status: 'pending' | 'completed' | 'not_required';
  criminalRecord: boolean;
  evictionHistory: boolean;
  details?: string;
  checkDate?: string;
}

export interface EmploymentVerificationResult {
  status: 'pending' | 'verified' | 'failed';
  verified: boolean;
  verifiedDate?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface ReferenceCheckResult {
  id: string;
  type: 'landlord' | 'employer' | 'personal';
  name: string;
  phone: string;
  relationship: string;
  contacted: boolean;
  contactDate?: string;
  rating?: number; // 1-5
  notes?: string;
}

export interface IncomeVerificationResult {
  status: 'pending' | 'verified' | 'failed';
  verified: boolean;
  annualIncome: number;
  monthlyIncome: number;
  meetsRequirement: boolean; // 3x rent
  verifiedDate?: string;
  notes?: string;
}

export interface RentalHistoryResult {
  status: 'pending' | 'verified' | 'failed';
  previousAddresses: PreviousAddress[];
  paymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}

export interface PreviousAddress {
  address: string;
  landlordName: string;
  landlordPhone: string;
  moveInDate: string;
  moveOutDate: string;
  rentAmount: number;
  reasonForLeaving: string;
}

export interface ApplicantComparison {
  applications: Application[];
  criteria: ComparisonCriteria;
  scores: Record<string, number>;
}

export interface ComparisonCriteria {
  creditWeight: number;
  incomeWeight: number;
  referencesWeight: number;
  rentalHistoryWeight: number;
  backgroundWeight: number;
  employmentWeight: number;
}
