import { Application } from '@/types/screening';
import { User, DollarSign, Briefcase, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicantComparisonProps {
  applications: Application[];
}

/**
 * Applicant Comparison
 * Side-by-side comparison of up to 3 applicants
 */
export function ApplicantComparison({ applications }: ApplicantComparisonProps) {
  const compareApplicants = applications.slice(0, 3);

  const criteria = [
    {
      label: 'Overall Score',
      key: 'overallScore',
      icon: Star,
      format: (val: number) => `${val}/100`,
    },
    {
      label: 'Credit Score',
      key: 'creditScore',
      icon: Star,
      format: (val: number) => val || 'N/A',
    },
    {
      label: 'Monthly Income',
      key: 'monthlyIncome',
      icon: DollarSign,
      format: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      label: 'Employment Duration',
      key: 'employmentDuration',
      icon: Briefcase,
      format: (val: number) => `${val} months`,
    },
  ];

  const getValueForCriteria = (app: Application, key: string) => {
    switch (key) {
      case 'overallScore':
        return app.overallScore;
      case 'creditScore':
        return app.screening.creditCheck.score || 0;
      case 'monthlyIncome':
        return app.annualIncome / 12;
      case 'employmentDuration':
        return app.employmentDuration;
      default:
        return 0;
    }
  };

  const getBestValue = (key: string): number => {
    return Math.max(
      ...compareApplicants.map((app) => getValueForCriteria(app, key))
    );
  };

  return (
    <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-neutral-900">
          Applicant Comparison
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left p-4 text-sm font-medium text-neutral-500">
                Criteria
              </th>
              {compareApplicants.map((app) => (
                <th key={app.id} className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="font-semibold text-neutral-900">
                    {app.firstName} {app.lastName.charAt(0)}.
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Score: {app.overallScore}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion) => {
              const Icon = criterion.icon;
              const bestValue = getBestValue(criterion.key);

              return (
                <tr key={criterion.key} className="border-b border-neutral-100">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-900">
                        {criterion.label}
                      </span>
                    </div>
                  </td>
                  {compareApplicants.map((app) => {
                    const value = getValueForCriteria(app, criterion.key);
                    const isBest = value === bestValue && value > 0;

                    return (
                      <td key={app.id} className="p-4 text-center">
                        <span
                          className={cn(
                            'inline-block px-3 py-1 rounded font-medium text-sm',
                            isBest
                              ? 'bg-green-100 text-green-900'
                              : 'bg-neutral-100 text-neutral-900'
                          )}
                        >
                          {criterion.format(value)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Background Check */}
            <tr className="border-b border-neutral-100">
              <td className="p-4">
                <span className="text-sm font-medium text-neutral-900">
                  Background Check
                </span>
              </td>
              {compareApplicants.map((app) => {
                const bg = app.screening.backgroundCheck;
                const isClean = !bg.criminalRecord && !bg.evictionHistory;

                return (
                  <td key={app.id} className="p-4 text-center">
                    <span
                      className={cn(
                        'inline-block px-3 py-1 rounded font-medium text-sm',
                        isClean
                          ? 'bg-green-100 text-green-900'
                          : 'bg-red-100 text-red-900'
                      )}
                    >
                      {isClean ? 'Clean' : 'Issues Found'}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Income Requirement */}
            <tr>
              <td className="p-4">
                <span className="text-sm font-medium text-neutral-900">
                  Meets 3x Income
                </span>
              </td>
              {compareApplicants.map((app) => {
                const meets = app.screening.incomeVerification.meetsRequirement;

                return (
                  <td key={app.id} className="p-4 text-center">
                    <span
                      className={cn(
                        'inline-block px-3 py-1 rounded font-medium text-sm',
                        meets
                          ? 'bg-green-100 text-green-900'
                          : 'bg-yellow-100 text-yellow-900'
                      )}
                    >
                      {meets ? 'Yes' : 'No'}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
