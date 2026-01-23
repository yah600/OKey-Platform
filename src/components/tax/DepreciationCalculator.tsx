import { useState, useEffect } from 'react';
import { Calculator, Download } from 'lucide-react';
import { useOwnerPropertiesStore } from '@/store/ownerPropertiesStore';
import { DepreciationSchedule } from '@/types/tax';
import Input from '@/components/atoms/Input';

interface DepreciationCalculatorProps {
  year: number;
  propertyId: string;
}

/**
 * Depreciation Calculator
 * Calculate property depreciation using MACRS method
 */
export function DepreciationCalculator({ year, propertyId }: DepreciationCalculatorProps) {
  const { properties } = useOwnerPropertiesStore();

  const [schedules, setSchedules] = useState<DepreciationSchedule[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    acquisitionCost: 0,
    landValue: 0,
    acquisitionDate: '',
  });

  useEffect(() => {
    const propertiesToProcess = propertyId
      ? properties.filter((p) => p.id === propertyId)
      : properties;

    const deprecSchedules = propertiesToProcess.map((property) => {
      // Mock acquisition data - would come from property records
      const acquisitionDate = '2020-01-01';
      const acquisitionCost = 300000;
      const landValue = acquisitionCost * 0.2; // Typically 15-25% of purchase price
      const depreciableBasis = acquisitionCost - landValue;
      const recoveryPeriod = 27.5; // Residential rental property

      // Calculate years depreciated
      const acqYear = new Date(acquisitionDate).getFullYear();
      const yearsDepreciated = year - acqYear;

      // MACRS annual depreciation
      const annualDepreciation = depreciableBasis / recoveryPeriod;
      const accumulatedDepreciation = Math.min(
        annualDepreciation * yearsDepreciated,
        depreciableBasis
      );
      const remainingDepreciableValue = depreciableBasis - accumulatedDepreciation;

      return {
        propertyId: property.id,
        propertyAddress: property.address,
        acquisitionDate,
        acquisitionCost,
        landValue,
        depreciableBasis,
        depreciationMethod: 'MACRS' as const,
        recoveryPeriod,
        annualDepreciation,
        accumulatedDepreciation,
        remainingDepreciableValue,
        currentYear: year,
        yearsDepreciated,
      };
    });

    setSchedules(deprecSchedules);
  }, [year, propertyId, properties]);

  const handleCalculate = () => {
    const landValue = calculatorData.landValue || calculatorData.acquisitionCost * 0.2;
    const depreciableBasis = calculatorData.acquisitionCost - landValue;
    const recoveryPeriod = 27.5;
    const annualDepreciation = depreciableBasis / recoveryPeriod;

    const acqYear = new Date(calculatorData.acquisitionDate).getFullYear();
    const yearsDepreciated = year - acqYear;
    const accumulatedDepreciation = Math.min(
      annualDepreciation * yearsDepreciated,
      depreciableBasis
    );

    alert(
      `Annual Depreciation: $${annualDepreciation.toFixed(2)}\n` +
        `Accumulated: $${accumulatedDepreciation.toFixed(2)}\n` +
        `Remaining: $${(depreciableBasis - accumulatedDepreciation).toFixed(2)}`
    );
  };

  const totalAnnualDepreciation = schedules.reduce((sum, s) => sum + s.annualDepreciation, 0);
  const totalAccumulated = schedules.reduce((sum, s) => sum + s.accumulatedDepreciation, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">
            Depreciation Calculator
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            MACRS depreciation schedule for residential rental property (27.5 years)
          </p>
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm"
        >
          <Calculator className="w-4 h-4" />
          {showCalculator ? 'Hide' : 'Show'} Calculator
        </button>
      </div>

      {/* Quick Calculator */}
      {showCalculator && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 space-y-4">
          <h4 className="font-semibold text-neutral-900">Quick Depreciation Calculator</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="acquisitionCost" className="block text-sm font-medium text-neutral-700 mb-2">
                Acquisition Cost
              </label>
              <Input
                id="acquisitionCost"
                type="number"
                value={calculatorData.acquisitionCost || ''}
                onChange={(e) =>
                  setCalculatorData({
                    ...calculatorData,
                    acquisitionCost: parseFloat(e.target.value),
                  })
                }
                placeholder="300000"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="landValue" className="block text-sm font-medium text-neutral-700 mb-2">
                Land Value (optional)
              </label>
              <Input
                id="landValue"
                type="number"
                value={calculatorData.landValue || ''}
                onChange={(e) =>
                  setCalculatorData({
                    ...calculatorData,
                    landValue: parseFloat(e.target.value),
                  })
                }
                placeholder="60000"
                min="0"
              />
              <p className="text-xs text-neutral-500 mt-1">Defaults to 20% of cost</p>
            </div>
            <div>
              <label htmlFor="acquisitionDate" className="block text-sm font-medium text-neutral-700 mb-2">
                Acquisition Date
              </label>
              <Input
                id="acquisitionDate"
                type="date"
                value={calculatorData.acquisitionDate}
                onChange={(e) =>
                  setCalculatorData({
                    ...calculatorData,
                    acquisitionDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            Calculate Depreciation
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 font-medium">Annual Depreciation</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            ${totalAnnualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-blue-600 mt-1">Tax year {year}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-700 font-medium">Total Accumulated</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">
            ${totalAccumulated.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-purple-600 mt-1">Through {year}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 font-medium">Properties</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            {schedules.length}
          </div>
          <div className="text-xs text-green-600 mt-1">Being depreciated</div>
        </div>
      </div>

      {/* Property Schedules */}
      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.propertyId}
            className="bg-white border border-neutral-200 rounded-lg p-6"
          >
            <h4 className="font-semibold text-neutral-900 mb-4">
              {schedule.propertyAddress}
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-neutral-500 text-xs mb-1">Acquisition Cost</div>
                <div className="font-semibold text-neutral-900">
                  ${schedule.acquisitionCost.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs mb-1">Land Value</div>
                <div className="font-semibold text-neutral-900">
                  ${schedule.landValue.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs mb-1">Depreciable Basis</div>
                <div className="font-semibold text-neutral-900">
                  ${schedule.depreciableBasis.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs mb-1">Recovery Period</div>
                <div className="font-semibold text-neutral-900">
                  {schedule.recoveryPeriod} years
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-neutral-500 text-xs mb-1">Annual Depreciation</div>
                <div className="text-lg font-bold text-blue-900">
                  ${schedule.annualDepreciation.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs mb-1">
                  Accumulated ({schedule.yearsDepreciated} years)
                </div>
                <div className="text-lg font-bold text-purple-900">
                  ${schedule.accumulatedDepreciation.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs mb-1">Remaining Value</div>
                <div className="text-lg font-bold text-green-900">
                  ${schedule.remainingDepreciableValue.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span>Depreciation Progress</span>
                <span>
                  {((schedule.accumulatedDepreciation / schedule.depreciableBasis) * 100).toFixed(
                    1
                  )}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (schedule.accumulatedDepreciation / schedule.depreciableBasis) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Information */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
        <h4 className="font-semibold text-neutral-900 mb-3">
          About MACRS Depreciation
        </h4>
        <div className="text-sm text-neutral-700 space-y-2">
          <p>
            <strong>MACRS (Modified Accelerated Cost Recovery System)</strong> is the depreciation
            method used for residential rental property in the United States.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Residential rental property: 27.5-year recovery period</li>
            <li>Commercial property: 39-year recovery period</li>
            <li>Land is never depreciable (typically 15-25% of purchase price)</li>
            <li>Depreciation begins when property is placed in service (available for rent)</li>
            <li>
              Use mid-month convention: Half month of depreciation in first and last years
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
