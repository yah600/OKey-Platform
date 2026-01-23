import { useState, useEffect } from 'react';
import { Download, FileText, User } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';
import { Form1099Vendor } from '@/types/tax';

interface Form1099GeneratorProps {
  year: number;
}

/**
 * Form 1099-MISC Generator
 * Generate 1099-MISC forms for contractors/vendors paid $600+
 */
export function Form1099Generator({ year }: Form1099GeneratorProps) {
  const { expenses } = useExpenseStore();
  const [vendors1099, setVendors1099] = useState<Form1099Vendor[]>([]);

  useEffect(() => {
    // Aggregate vendor payments for the year
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const yearExpenses = expenses.filter(
      (e) => e.date >= startDate && e.date <= endDate && e.vendor
    );

    // Group by vendor
    const vendorPayments: Record<string, number> = {};
    yearExpenses.forEach((expense) => {
      if (expense.vendor) {
        vendorPayments[expense.vendor] = (vendorPayments[expense.vendor] || 0) + expense.amount;
      }
    });

    // Filter vendors with $600+ payments
    const vendorsOver600 = Object.entries(vendorPayments)
      .filter(([_, amount]) => amount >= 600)
      .map(([vendorName, amount], index) => ({
        id: `vendor_${index}`,
        name: vendorName,
        tin: '**-***0000', // Mock TIN
        address: '123 Vendor St',
        city: 'Montreal',
        state: 'QC',
        zipCode: 'H1A 1A1',
        totalPaid: amount,
        year,
      }));

    setVendors1099(vendorsOver600);
  }, [year, expenses]);

  const handleDownloadPDF = (vendor: Form1099Vendor) => {
    alert(`Generate 1099-MISC PDF for ${vendor.name}`);
  };

  const handleDownloadAll = () => {
    alert('Generate all 1099-MISC forms as PDF');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">
            1099-MISC Generator
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Generate 1099-MISC forms for contractors and vendors paid $600 or more in {year}
          </p>
        </div>
        {vendors1099.length > 0 && (
          <button
            onClick={handleDownloadAll}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Download All ({vendors1099.length})
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-700 font-medium mb-1">
          Vendors Requiring 1099-MISC
        </div>
        <div className="text-3xl font-bold text-blue-900">
          {vendors1099.length}
        </div>
        <div className="text-xs text-blue-600 mt-2">
          Total payments: ${vendors1099.reduce((sum, v) => sum + v.totalPaid, 0).toLocaleString()}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-sm text-yellow-800">
          <strong>Important:</strong> You must collect W-9 forms from all vendors before
          issuing 1099-MISC forms. 1099-MISC forms must be sent to recipients by January 31
          and filed with the IRS by February 28 (March 31 if filing electronically).
        </div>
      </div>

      {/* Vendors List */}
      {vendors1099.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 border border-neutral-200 rounded-lg">
          <User className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-600">
            No vendors paid $600 or more in {year}
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            1099-MISC forms are only required for vendors paid $600 or more per year
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vendors1099.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white border border-neutral-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">
                        {vendor.name}
                      </h4>
                      <div className="text-xs text-neutral-500">
                        TIN: {vendor.tin}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-500 text-xs mb-1">Address</div>
                      <div className="text-neutral-900">
                        {vendor.address}
                        <br />
                        {vendor.city}, {vendor.state} {vendor.zipCode}
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-500 text-xs mb-1">Total Paid ({year})</div>
                      <div className="text-2xl font-bold text-neutral-900">
                        ${vendor.totalPaid.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadPDF(vendor)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Generate Form
                </button>
              </div>

              {/* Form Preview */}
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="text-xs text-neutral-500 mb-2">
                  Form 1099-MISC Box 1 (Rents) or Box 7 (Nonemployee compensation)
                </div>
                <div className="bg-neutral-50 rounded p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Payer:</span>
                    <span className="font-medium">Your Business Name</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-neutral-700">Recipient:</span>
                    <span className="font-medium">{vendor.name}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-neutral-700">Amount:</span>
                    <span className="font-semibold text-neutral-900">
                      ${vendor.totalPaid.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
        <h4 className="font-semibold text-neutral-900 mb-3">
          1099-MISC Filing Instructions
        </h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700">
          <li>Collect W-9 forms from all vendors to obtain their TIN</li>
          <li>Generate 1099-MISC forms using the button above</li>
          <li>Send Copy B to each recipient by January 31, {year + 1}</li>
          <li>File Copy A with the IRS by February 28, {year + 1} (or March 31 if filing electronically)</li>
          <li>Keep Copy C for your records</li>
        </ol>
      </div>
    </div>
  );
}
