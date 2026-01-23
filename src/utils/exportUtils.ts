/**
 * Utility functions for exporting data to various formats
 */

export function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values with commas by wrapping in quotes
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadJSON(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generatePDFReport(data: any[], title: string): Promise<void> {
  // In a real app, this would use a library like jsPDF or pdfmake
  // For now, we'll create a simple HTML-based PDF
  return new Promise((resolve) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: 600; }
            tr:nth-child(even) { background-color: #fafafa; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>© O'Key Platform - Property Management System</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      resolve();
    };
  });
}

export function exportFinancialReport(properties: any[], format: 'csv' | 'pdf' = 'csv') {
  const reportData = properties.map(property => ({
    Property: property.name,
    'Total Units': property.totalUnits,
    'Occupied Units': property.occupiedUnits,
    'Occupancy %': Math.round((property.occupiedUnits / property.totalUnits) * 100),
    'Monthly Revenue': `$${property.monthlyRevenue.toLocaleString()}`,
    'Monthly Expenses': `$${property.expenses.toLocaleString()}`,
    'Net Income': `$${(property.monthlyRevenue - property.expenses).toLocaleString()}`,
    'Profit Margin': `${Math.round(((property.monthlyRevenue - property.expenses) / property.monthlyRevenue) * 100)}%`,
  }));

  const filename = `financial-report-${new Date().toISOString().split('T')[0]}`;

  if (format === 'csv') {
    downloadCSV(reportData, `${filename}.csv`);
  } else {
    generatePDFReport(reportData, 'Financial Report');
  }
}

export function exportAnalyticsReport(properties: any[], format: 'csv' | 'pdf' = 'csv') {
  const analyticsData = properties.map(property => ({
    Property: property.name,
    Location: property.location,
    'Total Units': property.totalUnits,
    'Occupied': property.occupiedUnits,
    'Vacant': property.totalUnits - property.occupiedUnits,
    'Occupancy Rate': `${Math.round((property.occupiedUnits / property.totalUnits) * 100)}%`,
    'Avg Rent/Unit': `$${Math.round(property.monthlyRevenue / property.occupiedUnits)}`,
    'Monthly Revenue': `$${property.monthlyRevenue.toLocaleString()}`,
    'Monthly Expenses': `$${property.expenses.toLocaleString()}`,
    'NOI': `$${(property.monthlyRevenue - property.expenses).toLocaleString()}`,
  }));

  const filename = `analytics-report-${new Date().toISOString().split('T')[0]}`;

  if (format === 'csv') {
    downloadCSV(analyticsData, `${filename}.csv`);
  } else {
    generatePDFReport(analyticsData, 'Portfolio Analytics Report');
  }
}

export function exportPropertyComparison(properties: any[]) {
  const comparisonData = properties.map(property => {
    const occupancyRate = (property.occupiedUnits / property.totalUnits) * 100;
    const avgRent = property.monthlyRevenue / property.occupiedUnits;
    const netIncome = property.monthlyRevenue - property.expenses;
    const profitMargin = (netIncome / property.monthlyRevenue) * 100;

    return {
      Property: property.name,
      Location: property.location,
      Units: property.totalUnits,
      'Occupancy %': Math.round(occupancyRate),
      'Avg Rent': `$${Math.round(avgRent)}`,
      Revenue: `$${property.monthlyRevenue.toLocaleString()}`,
      Expenses: `$${property.expenses.toLocaleString()}`,
      NOI: `$${netIncome.toLocaleString()}`,
      'Profit %': Math.round(profitMargin),
      Performance: profitMargin > 30 ? 'Excellent' : profitMargin > 15 ? 'Good' : 'Fair',
    };
  });

  const filename = `property-comparison-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(comparisonData, filename);
}
