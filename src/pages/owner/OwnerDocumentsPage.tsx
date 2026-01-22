import { FileText, Upload, Folder } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function OwnerDocumentsPage() {
  const folders = [
    { name: 'Leases', count: 12, icon: Folder },
    { name: 'Inspections', count: 8, icon: Folder },
    { name: 'Financials', count: 24, icon: Folder },
    { name: 'Legal', count: 6, icon: Folder },
  ];

  const recentDocs = [
    { id: 1, name: 'Lease Agreement - Unit 4B.pdf', folder: 'Leases', size: '2.4 MB', date: '2026-01-20' },
    { id: 2, name: 'Inspection Report - Sunset Apt.pdf', folder: 'Inspections', size: '1.8 MB', date: '2026-01-18' },
    { id: 3, name: 'Tax Summary 2025.xlsx', folder: 'Financials', size: '0.5 MB', date: '2026-01-15' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Documents</h1>
          <p className="text-sm text-neutral-600">Manage property documents and files</p>
        </div>
        <Button variant="primary">
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {folders.map((folder) => (
          <Card key={folder.name} padding="sm" className="cursor-pointer hover:bg-neutral-50">
            <div className="flex flex-col items-center text-center">
              <folder.icon className="w-8 h-8 text-neutral-600 mb-2" />
              <p className="text-sm font-medium text-neutral-900">{folder.name}</p>
              <p className="text-xs text-neutral-500">{folder.count} files</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Recent Documents</h3>
        <div className="space-y-3">
          {recentDocs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                  <p className="text-xs text-neutral-600">{doc.folder} • {doc.size}</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500">{new Date(doc.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
