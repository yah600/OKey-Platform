import { useNavigate } from 'react-router-dom';
import { useLeaseBuilderStore } from '@/store/leaseBuilderStore';
import { FileText, Download, Check, Building2, User, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

/**
 * Step 7: Review and Sign
 * PDF preview and signature capture
 */
export function Step7ReviewAndSign() {
  const navigate = useNavigate();
  const { lease, prevStep, saveDraft, resetBuilder } = useLeaseBuilderStore();

  const handleSaveDraft = () => {
    saveDraft();
    alert('Lease saved as draft!');
    navigate('/owner/residents');
  };

  const handleFinalize = () => {
    // In real app, would send for signature via DocuSign
    alert('Lease finalized! In production, this would send for digital signature.');
    resetBuilder();
    navigate('/owner/residents');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Review & Sign
        </h2>
        <p className="text-neutral-600">
          Review the lease details before finalizing
        </p>
      </div>

      {/* Lease Summary */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-neutral-900">Property</div>
            <div className="text-sm text-neutral-600">
              {lease.property?.address}, Unit {lease.property?.unitNumber}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {lease.property?.bedrooms} bed • {lease.property?.bathrooms} bath • {lease.property?.sqft} sqft
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-neutral-900">Tenant</div>
            <div className="text-sm text-neutral-600">{lease.parties?.tenantName}</div>
            <div className="text-xs text-neutral-500 mt-1">
              {lease.parties?.tenantEmail} • {lease.parties?.tenantPhone}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-neutral-900">Lease Term</div>
            <div className="text-sm text-neutral-600">
              {lease.terms?.startDate && format(new Date(lease.terms.startDate), 'MMM d, yyyy')} -{' '}
              {lease.terms?.endDate && format(new Date(lease.terms.endDate), 'MMM d, yyyy')}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {lease.terms?.duration} months
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-neutral-900">Financial Terms</div>
            <div className="text-sm text-neutral-600">
              ${lease.terms?.rentAmount?.toLocaleString()}/month • Due day: {lease.terms?.rentDueDay}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Security deposit: ${lease.terms?.securityDeposit?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Terms Summary */}
      {lease.additionalTerms && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h3 className="font-semibold text-neutral-900 mb-2">Additional Terms</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            {lease.additionalTerms.petsAllowed && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary-600" />
                Pets allowed (Deposit: ${lease.additionalTerms.petDeposit})
              </li>
            )}
            {!lease.additionalTerms.petsAllowed && (
              <li className="text-neutral-500">No pets allowed</li>
            )}
            {lease.additionalTerms.parkingSpots && lease.additionalTerms.parkingSpots > 0 && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary-600" />
                {lease.additionalTerms.parkingSpots} parking spot(s) (${lease.additionalTerms.parkingFee}/month)
              </li>
            )}
            {lease.additionalTerms.utilitiesIncluded && lease.additionalTerms.utilitiesIncluded.length > 0 && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary-600" />
                Utilities: {lease.additionalTerms.utilitiesIncluded.join(', ')}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Custom Clauses */}
      {lease.customClauses && (
        <div className="border border-neutral-200 rounded-lg p-4">
          <h3 className="font-semibold text-neutral-900 mb-2">Custom Clauses</h3>
          <p className="text-sm text-neutral-600 whitespace-pre-wrap">{lease.customClauses}</p>
        </div>
      )}

      {/* PDF Preview Placeholder */}
      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
        <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <div className="text-neutral-600 mb-4">
          PDF preview will be generated here
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
          <Download className="w-4 h-4" />
          Download Draft PDF
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={prevStep}
          className="px-6 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-6 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleFinalize}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Finalize & Send for Signature
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> In production, this would integrate with DocuSign for digital signatures.
          Both landlord and tenant would receive email notifications to sign the lease electronically.
        </p>
      </div>
    </div>
  );
}
