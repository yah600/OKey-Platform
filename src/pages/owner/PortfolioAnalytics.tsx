import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Building2, DollarSign, Users, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';

export default function PortfolioAnalytics() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  const properties = [
    {
      id: 1,
      name: 'Sunset Apartments',
      units: 24,
      occupied: 24,
      revenue: 43200,
      expenses: 18500,
      profit: 24700,
      occupancy: 100,
      avgRent: 1800,
      trend: 'up',
    },
    {
      id: 2,
      name: 'Downtown Plaza',
      units: 18,
      occupied: 16,
      revenue: 35200,
      expenses: 15200,
      profit: 20000,
      occupancy: 89,
      avgRent: 2200,
      trend: 'down',
    },
    {
      id: 3,
      name: 'Riverside Complex',
      units: 8,
      occupied: 8,
      revenue: 20000,
      expenses: 8500,
      profit: 11500,
      occupancy: 100,
      avgRent: 2500,
      trend: 'up',
    },
  ];

  const totalUnits = properties.reduce((sum, p) => sum + p.units, 0);
  const totalOccupied = properties.reduce((sum, p) => sum + p.occupied, 0);
  const totalRevenue = properties.reduce((sum, p) => sum + p.revenue, 0);
  const totalExpenses = properties.reduce((sum, p) => sum + p.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgOccupancy = Math.round((totalOccupied / totalUnits) * 100);

  const monthlyData = [
    { month: 'Jan', revenue: 98400, expenses: 42200, profit: 56200 },
    { month: 'Feb', revenue: 98400, expenses: 43100, profit: 55300 },
    { month: 'Mar', revenue: 95200, expenses: 41800, profit: 53400 },
    { month: 'Apr', revenue: 98400, expenses: 42500, profit: 55900 },
    { month: 'May', revenue: 98400, expenses: 43800, profit: 54600 },
    { month: 'Jun', revenue: 98400, expenses: 42200, profit: 56200 },
  ];

  const maxValue = Math.max(...monthlyData.map((d) => Math.max(d.revenue, d.expenses, d.profit)));

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Portfolio Analytics</h1>
          <p className="text-sm text-neutral-600">Comprehensive view of your property portfolio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Export Report
          </Button>
          <Button variant="primary" size="sm">
            Compare Properties
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-neutral-500" />
            <p className="text-xs text-neutral-600">Total Units</p>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">{totalUnits}</p>
          <p className="text-xs text-neutral-500">{totalOccupied} occupied</p>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-neutral-500" />
            <p className="text-xs text-neutral-600">Occupancy Rate</p>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">{avgOccupancy}%</p>
          <p className="text-xs text-green-600">+2% from last month</p>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-neutral-500" />
            <p className="text-xs text-neutral-600">Monthly Revenue</p>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-600">+5% from last month</p>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-neutral-500" />
            <p className="text-xs text-neutral-600">Net Profit</p>
          </div>
          <p className="text-2xl font-semibold text-neutral-900">${totalProfit.toLocaleString()}</p>
          <p className="text-xs text-green-600">+8% from last month</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Financial Trends</h2>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-neutral-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-neutral-600">Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-neutral-600">Profit</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <div className="flex items-end justify-between h-full gap-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center h-full justify-end">
                <div className="w-full flex gap-1 mb-2">
                  <div
                    className="flex-1 bg-green-500 rounded-t"
                    style={{ height: `${(data.revenue / maxValue) * 200}px` }}
                    title={`Revenue: $${data.revenue.toLocaleString()}`}
                  ></div>
                  <div
                    className="flex-1 bg-red-500 rounded-t"
                    style={{ height: `${(data.expenses / maxValue) * 200}px` }}
                    title={`Expenses: $${data.expenses.toLocaleString()}`}
                  ></div>
                  <div
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ height: `${(data.profit / maxValue) * 200}px` }}
                    title={`Profit: $${data.profit.toLocaleString()}`}
                  ></div>
                </div>
                <span className="text-xs text-neutral-600">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Property Comparison */}
      <Card>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Property Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left text-xs font-semibold text-neutral-600 pb-3">Property</th>
                <th className="text-right text-xs font-semibold text-neutral-600 pb-3">Units</th>
                <th className="text-right text-xs font-semibold text-neutral-600 pb-3">Occupancy</th>
                <th className="text-right text-xs font-semibold text-neutral-600 pb-3">Avg Rent</th>
                <th className="text-right text-xs font-semibold text-neutral-600 pb-3">Revenue</th>
                <th className="text-right text-xs font-semibold text-neutral-600 pb-3">Expenses</th>
                <th className="text-right text-xs font-semibold text-neutral-600 pb-3">Profit</th>
                <th className="text-right text-xs font-semibold text-neutral-600 pb-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-neutral-100">
                  <td className="py-3">
                    <p className="text-sm font-medium text-neutral-900">{property.name}</p>
                  </td>
                  <td className="text-right text-sm text-neutral-900">
                    {property.occupied}/{property.units}
                  </td>
                  <td className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        property.occupancy === 100
                          ? 'bg-green-100 text-green-700'
                          : property.occupancy >= 90
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {property.occupancy}%
                    </span>
                  </td>
                  <td className="text-right text-sm text-neutral-900">${property.avgRent}</td>
                  <td className="text-right text-sm text-neutral-900">
                    ${property.revenue.toLocaleString()}
                  </td>
                  <td className="text-right text-sm text-neutral-900">
                    ${property.expenses.toLocaleString()}
                  </td>
                  <td className="text-right text-sm font-semibold text-green-700">
                    ${property.profit.toLocaleString()}
                  </td>
                  <td className="text-right">
                    {property.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600 inline" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 inline" />
                    )}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-neutral-300 font-semibold">
                <td className="py-3 text-sm text-neutral-900">Total</td>
                <td className="text-right text-sm text-neutral-900">
                  {totalOccupied}/{totalUnits}
                </td>
                <td className="text-right">
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    {avgOccupancy}%
                  </span>
                </td>
                <td className="text-right text-sm text-neutral-900">-</td>
                <td className="text-right text-sm text-neutral-900">
                  ${totalRevenue.toLocaleString()}
                </td>
                <td className="text-right text-sm text-neutral-900">
                  ${totalExpenses.toLocaleString()}
                </td>
                <td className="text-right text-sm text-green-700">
                  ${totalProfit.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
