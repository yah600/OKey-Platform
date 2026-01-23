/**
 * Tax Document Types
 * Used for generating tax forms and reports
 */

export interface ScheduleEData {
  year: number;
  propertyId: string;
  propertyAddress: string;

  // Income
  rentalIncome: number;
  otherIncome: number;
  totalIncome: number;

  // Expenses
  advertising: number;
  auto: number;
  cleaning: number;
  commissions: number;
  insurance: number;
  legal: number;
  management: number;
  mortgageInterest: number;
  otherInterest: number;
  repairs: number;
  supplies: number;
  taxes: number;
  utilities: number;
  depreciation: number;
  otherExpenses: number;
  totalExpenses: number;

  // Net Income
  netRentalIncome: number;
}

export interface Form1099Vendor {
  id: string;
  name: string;
  tin: string; // Tax Identification Number
  address: string;
  city: string;
  state: string;
  zipCode: string;
  totalPaid: number;
  year: number;
}

export interface DepreciationSchedule {
  propertyId: string;
  propertyAddress: string;
  acquisitionDate: string;
  acquisitionCost: number;
  landValue: number;
  depreciableBasis: number;
  depreciationMethod: 'MACRS' | 'Straight-Line';
  recoveryPeriod: number; // 27.5 years for residential
  annualDepreciation: number;
  accumulatedDepreciation: number;
  remainingDepreciableValue: number;
  currentYear: number;
  yearsDepreciated: number;
}

export interface TaxSummary {
  year: number;
  properties: ScheduleEData[];
  totalRentalIncome: number;
  totalExpenses: number;
  totalNetIncome: number;
  totalDepreciation: number;
  vendors1099: Form1099Vendor[];
}
