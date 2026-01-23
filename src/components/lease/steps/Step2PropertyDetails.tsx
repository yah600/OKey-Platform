import { useState, useEffect } from 'react';
import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';
import { useOwnerPropertiesStore } from '@/store/ownerPropertiesStore';
import { Building2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Step 2: Property Details
 * Auto-populate from existing properties
 */
export function Step2PropertyDetails() {
  const { lease, updateLease, nextStep, prevStep } = useLeaseBuilderStore();
  const { properties } = useOwnerPropertiesStore();
  const [selectedProperty, setSelectedProperty] = useState(lease.property?.propertyId || '');
  const [selectedUnit, setSelectedUnit] = useState(lease.property?.unitId || '');

  const property = properties.find(p => p.id === selectedProperty);
  const units = property?.units || [];

  const handleContinue = () => {
    if (selectedProperty && selectedUnit) {
      const unit = units.find(u => u.id === selectedUnit);
      if (unit && property) {
        updateLease({
          property: {
            propertyId: property.id,
            unitId: unit.id,
            address: property.address,
            unitNumber: unit.unitNumber,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            sqft: unit.sqft,
          },
        });
        nextStep();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Property Details
        </h2>
        <p className="text-neutral-600">
          Select the property and unit for this lease
        </p>
      </div>

      {/* Property Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Property
        </label>
        <div className="grid grid-cols-1 gap-3">
          {properties.map((prop) => (
            <button
              key={prop.id}
              onClick={() => {
                setSelectedProperty(prop.id);
                setSelectedUnit('');
              }}
              className={cn(
                'p-4 border-2 rounded-lg text-left transition-all hover:border-primary-300',
                selectedProperty === prop.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 bg-white'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-900">
                    {prop.buildingName}
                  </div>
                  <div className="text-sm text-neutral-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {prop.address}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Unit Selection */}
      {selectedProperty && units.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Unit
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit.id)}
                className={cn(
                  'p-4 border-2 rounded-lg transition-all hover:border-primary-300',
                  selectedUnit === unit.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-200 bg-white',
                  unit.occupied && 'opacity-50 cursor-not-allowed'
                )}
                disabled={unit.occupied}
              >
                <div className="font-semibold text-neutral-900">
                  Unit {unit.unitNumber}
                </div>
                <div className="text-xs text-neutral-600 mt-1">
                  {unit.bedrooms} bed • {unit.bathrooms} bath
                </div>
                {unit.occupied && (
                  <div className="text-xs text-red-600 mt-1">Occupied</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={prevStep}
          className="px-6 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedProperty || !selectedUnit}
          className={cn(
            'px-6 py-3 rounded-lg font-medium transition-all',
            selectedProperty && selectedUnit
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
