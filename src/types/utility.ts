/**
 * Utility Management Types
 */

export type UtilityType = 'electric' | 'gas' | 'water' | 'sewer' | 'trash' | 'internet';

export interface UtilityAccount {
  id: string;
  propertyId: string;
  unitId?: string; // null = property-wide
  utilityType: UtilityType;
  provider: string;
  accountNumber: string;
  contactPhone: string;
  meterNumber?: string;
  active: boolean;

  // Billing
  billingType: 'landlord' | 'tenant' | 'split';
  monthlyEstimate?: number;

  createdAt: string;
  updatedAt: string;
}

export interface MeterReading {
  id: string;
  accountId: string;
  reading: number;
  unit: string;
  readDate: string;
  readBy: string;
  photo?: string;
  notes?: string;
}

export interface UtilityUsage {
  accountId: string;
  period: string; // YYYY-MM
  startReading: number;
  endReading: number;
  usage: number;
  cost?: number;
}
