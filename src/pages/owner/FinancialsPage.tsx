import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Download, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { useAuthStore } from '../../store/authStore';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';
import { exportFinancialReport } from '../../utils/exportUtils';
import { toast } from 'sonner';

export default function FinancialsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { getPropertiesByOwner } = useOwnerPropertiesStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Get owner's properties and calculate totals
  const properties = user ? getPropertiesByOwner(user.id) : [];
  const totalRevenue = properties.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const totalExpenses = properties.reduce((sum, p) => sum + p.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netIncome / totalRevenue) * 100) : 0;

  const handleExportReport = () => {
    try {
      exportFinancialReport(properties, 'csv');
      toast.success('Report Exported', {
        description: 'Financial report downloaded successfully.',
      });
    } catch (error) {
      toast.error('Export Failed', {
        description: 'Unable to export report. Please try again.',
      });
    }
  };

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Financials</h1>
          <p className="text-sm text-neutral-600">Track revenue, expenses, and reports</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleExportReport}>
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <p className="text-xs text-neutral-600">Total Revenue</p>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-neutral-500 mt-1">Monthly</p>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-red-600" />
            <p className="text-xs text-neutral-600">Total Expenses</p>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">${totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-neutral-500 mt-1">Monthly</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-2">Net Income</p>
          <p className="text-2xl font-semibold text-green-600">${netIncome.toLocaleString()}</p>
          <p className="text-xs text-neutral-500 mt-1">Monthly</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-2">Profit Margin</p>
          <p className="text-2xl font-semibold text-neutral-900">{profitMargin}%</p>
          <p className="text-xs text-neutral-500 mt-1">Average</p>
        </Card>
      </div>

      {/* Property Breakdown */}
      <Card>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Property Breakdown</h3>
        <div className="space-y-3">
          {properties.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <Building2 className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm">No properties yet</p>
            </div>
          ) : (
            properties.map((property) => (
              <Link key={property.id} to={`/owner/properties/${property.id}`}>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{property.name}</p>
                      <p className="text-xs text-neutral-600">
                        {property.occupiedUnits}/{property.totalUnits} units occupied
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      ${property.netIncome.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500">net/month</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
