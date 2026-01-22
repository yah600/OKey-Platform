import { useState, useEffect } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const documents = [
    { id: 1, name: 'Lease Agreement', type: 'PDF', size: '2.4 MB', date: '2025-12-01', category: 'Lease' },
    { id: 2, name: 'Move-in Inspection', type: 'PDF', size: '1.8 MB', date: '2025-12-05', category: 'Inspection' },
    { id: 3, name: 'Parking Agreement', type: 'PDF', size: '0.5 MB', date: '2025-12-01', category: 'Addendum' },
    { id: 4, name: 'Rent Receipt Jan 2026', type: 'PDF', size: '0.3 MB', date: '2026-01-01', category: 'Receipt' },
  ];

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Documents</h1>
        <p className="text-sm text-neutral-600">Access your lease, receipts, and important documents</p>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="secondary" size="sm">All Documents</Button>
        <Button variant="ghost" size="sm">Lease</Button>
        <Button variant="ghost" size="sm">Receipts</Button>
        <Button variant="ghost" size="sm">Inspection</Button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900 mb-1 truncate">{doc.name}</h3>
                <p className="text-xs text-neutral-600 mb-2">
                  {doc.type} • {doc.size} • {new Date(doc.date).toLocaleDateString()}
                </p>
                <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded">
                  {doc.category}
                </span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
