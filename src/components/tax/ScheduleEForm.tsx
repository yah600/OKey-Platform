import { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { useOwnerPropertiesStore } from '@/store/ownerPropertiesStore';
import { useExpenseStore } from '@/store/expenseStore';
import { ScheduleEData } from '@/types/tax';

interface ScheduleEFormProps {
  year: number;
  propertyId: string;
}

/**
 * Schedule E Form Generator
 * IRS Form 1040 Schedule E - Supplemental Income and Loss (Rental Real Estate)
 */
export function ScheduleEForm({ year, propertyId }: ScheduleEFormProps) {
  const { properties } = useOwnerPropertiesStore();
  const { getExpensesByCategory, getExpensesByProperty } = useExpenseStore();

  const [scheduleEData, setScheduleEData] = useState<ScheduleEData[]>([]);

  useEffect(() => {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const propertiesToProcess = propertyId
      ? properties.filter((p) => p.id === propertyId)
      : properties;

    const data = propertiesToProcess.map((property) => {
      const expenses = getExpensesByProperty(property.id).filter(
        (e) => e.date >= startDate && e.date <= endDate
      );

      const expensesByCategory = getExpensesByCategory(property.id, startDate, endDate);

      // Calculate rental income (would come from payment records)
      const rentalIncome = property.totalUnits * 1500 * 12; // Mock calculation
      const otherIncome = 0;
      const totalIncome = rentalIncome + otherIncome;

      // Map expense categories to Schedule E line items
      const advertising = expensesByCategory.marketing || 0;
      const cleaning = 0; // Would need to track separately
      const insurance = expensesByCategory.insurance || 0;
      const legal = expensesByCategory.legal_professional || 0;
      const management = expensesByCategory.management_fees || 0;
      const mortgageInterest = expensesByCategory.mortgage_interest || 0;
      const repairs = expensesByCategory.maintenance_repairs || 0;
      const taxes = expensesByCategory.property_taxes || 0;
      const utilities = expensesByCategory.utilities || 0;
      const depreciation = calculateDepreciation(property, year);
      const otherExpenses = expensesByCategory.other || 0;

      const totalExpenses =
        advertising +
        cleaning +
        insurance +
        legal +
        management +
        mortgageInterest +
        repairs +
        taxes +
        utilities +
        depreciation +
        otherExpenses;

      const netRentalIncome = totalIncome - totalExpenses;

      return {
        year,
        propertyId: property.id,
        propertyAddress: property.address,
        rentalIncome,
        otherIncome,
        totalIncome,
        advertising,
        auto: 0,
        cleaning,
        commissions: 0,
        insurance,
        legal,
        management,
        mortgageInterest,
        otherInterest: 0,
        repairs,
        supplies: 0,
        taxes,
        utilities,
        depreciation,
        otherExpenses,
        totalExpenses,
        netRentalIncome,
      };
    });

    setScheduleEData(data);
  }, [year, propertyId, properties, getExpensesByProperty, getExpensesByCategory]);

  const calculateDepreciation = (property: any, year: number): number => {
    // Simplified MACRS calculation (27.5 years residential)
    // Assumes property was acquired in 2020 for $300,000 with 20% land value
    const acquisitionCost = 300000;
    const landValue = acquisitionCost * 0.2;
    const depreciableBasis = acquisitionCost - landValue;
    const annualDepreciation = depreciableBasis / 27.5;
    return Math.round(annualDepreciation);
  };

  const totalAllProperties = scheduleEData.reduce(
    (acc, data) => ({
      rentalIncome: acc.rentalIncome + data.rentalIncome,
      totalIncome: acc.totalIncome + data.totalIncome,
      totalExpenses: acc.totalExpenses + data.totalExpenses,
      netRentalIncome: acc.netRentalIncome + data.netRentalIncome,
    }),
    { rentalIncome: 0, totalIncome: 0, totalExpenses: 0, netRentalIncome: 0 }
  );

  const handleDownloadPDF = () => {
    alert('PDF generation would be implemented here using a library like jsPDF');
  };

  const handleExportCSV = () => {
    const csv = [
      [
        'Property',
        'Rental Income',
        'Total Income',
        'Advertising',
        'Insurance',
        'Legal',
        'Management',
        'Mortgage Interest',
        'Repairs',
        'Taxes',
        'Utilities',
        'Depreciation',
        'Other',
        'Total Expenses',
        'Net Income',
      ].join(','),
      ...scheduleEData.map((data) =>
        [
          `"${data.propertyAddress}"`,
          data.rentalIncome,
          data.totalIncome,
          data.advertising,
          data.insurance,
          data.legal,
          data.management,
          data.mortgageInterest,
          data.repairs,
          data.taxes,
          data.utilities,
          data.depreciation,
          data.otherExpenses,
          data.totalExpenses,
          data.netRentalIncome,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-e-${year}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">
            Schedule E - Supplemental Income and Loss
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Rental real estate income and expenses for tax year {year}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm"
          >
            <FileText className="w-4 h-4" />
            Generate PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 font-medium">Total Income</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            ${totalAllProperties.totalIncome.toLocaleString()}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 font-medium">Total Expenses</div>
          <div className="text-2xl font-bold text-red-900 mt-1">
            ${totalAllProperties.totalExpenses.toLocaleString()}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 font-medium">Net Income</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            ${totalAllProperties.netRentalIncome.toLocaleString()}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-700 font-medium">Properties</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">
            {scheduleEData.length}
          </div>
        </div>
      </div>

      {/* Property-by-Property Breakdown */}
      <div className="space-y-4">
        {scheduleEData.map((data) => (
          <div
            key={data.propertyId}
            className="bg-neutral-50 border border-neutral-200 rounded-lg p-6"
          >
            <h4 className="font-semibold text-neutral-900 mb-4">
              {data.propertyAddress}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* Income */}
              <div>
                <div className="text-xs font-medium text-neutral-500 uppercase mb-2">
                  Income
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Rental Income:</span>
                    <span className="font-semibold">
                      ${data.rentalIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-300 pt-1 mt-1">
                    <span className="font-medium">Total Income:</span>
                    <span className="font-bold">
                      ${data.totalIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div>
                <div className="text-xs font-medium text-neutral-500 uppercase mb-2">
                  Expenses
                </div>
                <div className="space-y-1 text-sm">
                  {data.advertising > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Advertising:</span>
                      <span>${data.advertising.toLocaleString()}</span>
                    </div>
                  )}
                  {data.insurance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Insurance:</span>
                      <span>${data.insurance.toLocaleString()}</span>
                    </div>
                  )}
                  {data.legal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Legal & Professional:</span>
                      <span>${data.legal.toLocaleString()}</span>
                    </div>
                  )}
                  {data.management > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Management:</span>
                      <span>${data.management.toLocaleString()}</span>
                    </div>
                  )}
                  {data.mortgageInterest > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Mortgage Interest:</span>
                      <span>${data.mortgageInterest.toLocaleString()}</span>
                    </div>
                  )}
                  {data.repairs > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Repairs:</span>
                      <span>${data.repairs.toLocaleString()}</span>
                    </div>
                  )}
                  {data.taxes > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Property Taxes:</span>
                      <span>${data.taxes.toLocaleString()}</span>
                    </div>
                  )}
                  {data.utilities > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Utilities:</span>
                      <span>${data.utilities.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Depreciation:</span>
                    <span>${data.depreciation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-300 pt-1 mt-1">
                    <span className="font-medium">Total Expenses:</span>
                    <span className="font-bold">
                      ${data.totalExpenses.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div className="mt-4 pt-4 border-t border-neutral-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-neutral-900">
                  Net Rental Income (Loss):
                </span>
                <span
                  className={`text-xl font-bold ${
                    data.netRentalIncome >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  ${data.netRentalIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
