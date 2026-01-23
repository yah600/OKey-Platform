import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Application } from '@/types/screening';
import { cn } from '@/lib/utils';

interface ScreeningChecklistProps {
  application: Application;
}

/**
 * Screening Checklist
 * 6-category checklist for tenant screening
 */
export function ScreeningChecklist({ application }: ScreeningChecklistProps) {
  const { screening } = application;

  const checklistItems = [
    {
      category: 'Credit Check',
      status: screening.creditCheck.status,
      details: screening.creditCheck.score
        ? `Score: ${screening.creditCheck.score}`
        : 'Pending verification',
      weight: '30%',
    },
    {
      category: 'Background Check',
      status: screening.backgroundCheck.status,
      details:
        screening.backgroundCheck.status === 'completed'
          ? `Criminal: ${screening.backgroundCheck.criminalRecord ? 'Yes' : 'No'}, Eviction: ${
              screening.backgroundCheck.evictionHistory ? 'Yes' : 'No'
            }`
          : 'Pending verification',
      weight: '15%',
    },
    {
      category: 'Employment Verification',
      status: screening.employmentVerification.status === 'verified' ? 'completed' : 'pending',
      details: screening.employmentVerification.verified
        ? 'Verified'
        : 'Pending employer contact',
      weight: '10%',
    },
    {
      category: 'References',
      status:
        screening.references.filter((r) => r.contacted).length > 0 ? 'completed' : 'pending',
      details: `${screening.references.filter((r) => r.contacted).length}/${
        screening.references.length
      } contacted`,
      weight: '20%',
    },
    {
      category: 'Income Verification',
      status: screening.incomeVerification.status === 'verified' ? 'completed' : 'pending',
      details: screening.incomeVerification.meetsRequirement
        ? '✓ Meets 3x requirement'
        : '✗ Below requirement',
      weight: '25%',
    },
    {
      category: 'Rental History',
      status: screening.rentalHistory.status === 'verified' ? 'completed' : 'pending',
      details:
        screening.rentalHistory.paymentHistory
          ? `Payment history: ${screening.rentalHistory.paymentHistory}`
          : 'Pending verification',
      weight: '0%',
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'completed' || status === 'verified') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    } else if (status === 'pending' || status === 'under_review') {
      return <Clock className="w-5 h-5 text-yellow-600" />;
    }
    return <Circle className="w-5 h-5 text-neutral-300" />;
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-neutral-900">Screening Checklist</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {checklistItems.map((item) => (
          <div
            key={item.category}
            className={cn(
              'p-4 rounded-lg border',
              item.status === 'completed' || item.status === 'verified'
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-neutral-200'
            )}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-neutral-900">{item.category}</span>
                  <span className="text-xs text-neutral-500">{item.weight}</span>
                </div>
                <p className="text-sm text-neutral-600">{item.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Documents */}
      {application.documents.length > 0 && (
        <div className="pt-4 border-t border-neutral-200">
          <h5 className="font-medium text-neutral-900 mb-2">Submitted Documents</h5>
          <div className="flex flex-wrap gap-2">
            {application.documents.map((doc) => (
              <span
                key={doc.id}
                className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded text-sm"
              >
                {doc.type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {application.notes && (
        <div className="pt-4 border-t border-neutral-200">
          <h5 className="font-medium text-neutral-900 mb-2">Notes</h5>
          <p className="text-sm text-neutral-600">{application.notes}</p>
        </div>
      )}
    </div>
  );
}
