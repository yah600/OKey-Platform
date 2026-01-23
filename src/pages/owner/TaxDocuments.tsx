import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calculator } from 'lucide-react';
import { useOwnerPropertiesStore } from '@/store/ownerPropertiesStore';
import { useExpenseStore } from '@/store/expenseStore';
import { ScheduleEForm } from '@/components/tax/ScheduleEForm';
import { Form1099Generator } from '@/components/tax/Form1099Generator';
import { DepreciationCalculator } from '@/components/tax/DepreciationCalculator';

/**
 * Tax Documents Page
 * Generate tax forms and reports for rental properties
 */
export function TaxDocuments() {
  const navigate = useNavigate();
  const { properties } = useOwnerPropertiesStore();
  const { getTaxDeductibleTotal } = useExpenseStore();

  const [activeTab, setActiveTab] = useState<'schedule-e' | '1099' | 'depreciation'>('schedule-e');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedProperty, setSelectedProperty] = useState(properties[0]?.id || '');

  const years = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/owner/financials')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Tax Documents
                </h1>
                <p className="text-sm text-neutral-600">
                  Generate tax forms and reports for rental income
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Tax Year & Property Selector */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tax Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                >
                  <option value="">All Properties</option>
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.buildingName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Important Tax Information
                </h3>
                <p className="text-sm text-yellow-800">
                  These documents are provided for informational purposes only. Always consult
                  with a qualified tax professional or CPA before filing your tax returns.
                  O'Key Platform does not provide tax advice.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="flex border-b border-neutral-200">
              <button
                onClick={() => setActiveTab('schedule-e')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'schedule-e'
                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Schedule E
                </div>
              </button>
              <button
                onClick={() => setActiveTab('1099')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === '1099'
                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  1099-MISC
                </div>
              </button>
              <button
                onClick={() => setActiveTab('depreciation')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'depreciation'
                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Depreciation
                </div>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'schedule-e' && (
                <ScheduleEForm
                  year={selectedYear}
                  propertyId={selectedProperty}
                />
              )}
              {activeTab === '1099' && (
                <Form1099Generator year={selectedYear} />
              )}
              {activeTab === 'depreciation' && (
                <DepreciationCalculator
                  year={selectedYear}
                  propertyId={selectedProperty}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaxDocuments;
