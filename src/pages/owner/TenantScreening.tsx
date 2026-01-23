import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Filter } from 'lucide-react';
import { useTenantScreeningStore } from '@/store/tenantScreeningStore';
import { ApplicationCard } from '@/components/screening/ApplicationCard';
import { ApplicantComparison } from '@/components/screening/ApplicantComparison';
import { ApplicationStatus } from '@/types/screening';

/**
 * Tenant Screening Workflow Page
 * Manage rental applications and screen tenants
 */
export function TenantScreening() {
  const navigate = useNavigate();
  const { applications, getApplicationsByStatus } = useTenantScreeningStore();

  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  const filteredApplications =
    statusFilter === 'all' ? applications : getApplicationsByStatus(statusFilter);

  const statusCounts = {
    all: applications.length,
    pending: getApplicationsByStatus('pending').length,
    under_review: getApplicationsByStatus('under_review').length,
    approved: getApplicationsByStatus('approved').length,
    rejected: getApplicationsByStatus('rejected').length,
  };

  const handleToggleComparison = (appId: string) => {
    setSelectedForComparison((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId].slice(0, 3)
    );
  };

  const applicationsForComparison = applications.filter((app) =>
    selectedForComparison.includes(app.id)
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/owner/residents')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Tenant Screening
                </h1>
                <p className="text-sm text-neutral-600">
                  Manage rental applications and screen potential tenants
                </p>
              </div>
            </div>
            <button
              onClick={() => alert('Add New Application form would open')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Application
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Fair Housing Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex gap-3">
              <Users className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Fair Housing Compliance
                </h3>
                <p className="text-sm text-blue-800">
                  All screening criteria must be applied consistently. Do not discriminate based on
                  race, color, national origin, religion, sex, familial status, or disability.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  statusFilter === status
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="text-2xl font-bold text-neutral-900">{count}</div>
                <div className="text-sm text-neutral-600 capitalize mt-1">
                  {status.replace('_', ' ')}
                </div>
              </button>
            ))}
          </div>

          {/* Comparison Toggle */}
          {selectedForComparison.length >= 2 && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-primary-900">
                  {selectedForComparison.length} applicants selected for comparison
                </div>
                <div className="text-sm text-primary-700">
                  Compare up to 3 applicants side-by-side
                </div>
              </div>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                {showComparison ? 'Hide' : 'Show'} Comparison
              </button>
            </div>
          )}

          {/* Comparison View */}
          {showComparison && applicationsForComparison.length >= 2 && (
            <ApplicantComparison applications={applicationsForComparison} />
          )}

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 bg-white border border-neutral-200 rounded-xl">
              <Users className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">No applications found</p>
              <p className="text-sm text-neutral-500 mt-1">
                Applications will appear here when submitted
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  isSelectedForComparison={selectedForComparison.includes(application.id)}
                  onToggleComparison={() => handleToggleComparison(application.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TenantScreening;
