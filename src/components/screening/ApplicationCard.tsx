import { useState } from 'react';
import { Check, X, Eye, Mail, Phone, User, Briefcase, Home, AlertCircle } from 'lucide-react';
import { useTenantScreeningStore } from '@/store/tenantScreeningStore';
import { Application } from '@/types/screening';
import { ScreeningChecklist } from './ScreeningChecklist';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: Application;
  isSelectedForComparison: boolean;
  onToggleComparison: () => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  under_review: 'bg-blue-100 text-blue-700 border-blue-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

/**
 * Application Card
 * Display individual rental application with screening info
 */
export function ApplicationCard({
  application,
  isSelectedForComparison,
  onToggleComparison,
}: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { approveApplication, rejectApplication } = useTenantScreeningStore();

  const handleApprove = () => {
    if (confirm('Approve this application?')) {
      approveApplication(application.id, 'current_owner');
    }
  };

  const handleReject = () => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      rejectApplication(application.id, 'current_owner', reason);
    }
  };

  const monthlyRentRequired = 1500; // Would come from unit data
  const meetsIncomeRequirement = application.annualIncome / 12 >= monthlyRentRequired * 3;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {application.firstName} {application.lastName}
                </h3>
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border capitalize',
                    statusColors[application.status]
                  )}
                >
                  {application.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {application.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {application.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div className="text-center">
            <div
              className={cn(
                'text-2xl font-bold mb-1',
                application.overallScore >= 80
                  ? 'text-green-900'
                  : application.overallScore >= 60
                  ? 'text-yellow-900'
                  : 'text-red-900'
              )}
            >
              {application.overallScore}
            </div>
            <div className="text-xs text-neutral-500">Overall Score</div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-neutral-500">Employment</div>
              <div className="text-sm font-medium text-neutral-900 truncate">
                {application.jobTitle}
              </div>
              <div className="text-xs text-neutral-600 truncate">{application.employer}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Home className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-neutral-500">Income</div>
              <div className="text-sm font-medium text-neutral-900">
                ${(application.annualIncome / 12).toLocaleString()}/mo
              </div>
              <div
                className={cn(
                  'text-xs',
                  meetsIncomeRequirement ? 'text-green-600' : 'text-red-600'
                )}
              >
                {meetsIncomeRequirement ? '✓ Meets 3x requirement' : '✗ Below 3x requirement'}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-neutral-500">Move-in Date</div>
              <div className="text-sm font-medium text-neutral-900">
                {new Date(application.desiredMoveInDate).toLocaleDateString()}
              </div>
              <div className="text-xs text-neutral-600">
                {application.leaseTermPreference} month lease
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            {isExpanded ? 'Hide' : 'View'} Details
          </button>
          <button
            onClick={onToggleComparison}
            className={cn(
              'px-4 py-2 border-2 rounded-lg transition-colors text-sm',
              isSelectedForComparison
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-neutral-300 hover:bg-neutral-50'
            )}
          >
            {isSelectedForComparison ? 'Selected' : 'Compare'}
          </button>
          {application.status === 'under_review' && (
            <>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-neutral-200 p-6 bg-neutral-50">
          <ScreeningChecklist application={application} />
        </div>
      )}
    </div>
  );
}
