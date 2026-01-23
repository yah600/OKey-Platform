import { useState, useEffect } from 'react';
import { FileText, Upload, Folder, Download, Eye } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';
import {
  useDocumentsStore,
  formatFileSize,
  getFileTypeColor,
  getCategoryColor,
  type Document,
} from '../../store/documentsStore';
import { toast } from 'sonner';

export default function OwnerDocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | Document['category']>('all');
  const { user } = useAuthStore();
  const { getPropertiesByOwner } = useOwnerPropertiesStore();
  const { getDocumentsByProperties, getDocumentsByPropertyAndCategory } = useDocumentsStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Get owner's properties
  const properties = user ? getPropertiesByOwner(user.id) : [];
  const propertyIds = properties.map((p) => p.id);

  // Get all documents for owner's properties
  const allDocuments = getDocumentsByProperties(propertyIds);
  const filteredDocuments =
    activeFilter === 'all'
      ? allDocuments
      : getDocumentsByPropertyAndCategory(propertyIds, activeFilter);

  // Calculate folder counts
  const leaseCount = getDocumentsByPropertyAndCategory(propertyIds, 'lease').length;
  const inspectionCount = getDocumentsByPropertyAndCategory(propertyIds, 'inspection').length;
  const insuranceCount = getDocumentsByPropertyAndCategory(propertyIds, 'insurance').length;
  const otherCount = getDocumentsByPropertyAndCategory(propertyIds, 'other').length;

  const handleUpload = () => {
    toast.info('Upload Document', {
      description: 'Document upload coming soon.',
    });
  };

  const handleDownload = (doc: Document) => {
    toast.success('Download Started', {
      description: `Downloading ${doc.name}...`,
    });
  };

  const handleView = (doc: Document) => {
    toast.info('View Document', {
      description: 'Document viewer coming soon.',
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Documents</h1>
          <p className="text-sm text-neutral-600">Manage property documents and files</p>
        </div>
        <Button variant="primary" onClick={handleUpload}>
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card
          padding="sm"
          className="cursor-pointer hover:bg-neutral-50 transition-all"
          onClick={() => setActiveFilter('lease')}
        >
          <div className="flex flex-col items-center text-center">
            <Folder className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-neutral-900">Leases</p>
            <p className="text-xs text-neutral-500">{leaseCount} files</p>
          </div>
        </Card>
        <Card
          padding="sm"
          className="cursor-pointer hover:bg-neutral-50 transition-all"
          onClick={() => setActiveFilter('inspection')}
        >
          <div className="flex flex-col items-center text-center">
            <Folder className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-neutral-900">Inspections</p>
            <p className="text-xs text-neutral-500">{inspectionCount} files</p>
          </div>
        </Card>
        <Card
          padding="sm"
          className="cursor-pointer hover:bg-neutral-50 transition-all"
          onClick={() => setActiveFilter('insurance')}
        >
          <div className="flex flex-col items-center text-center">
            <Folder className="w-8 h-8 text-indigo-600 mb-2" />
            <p className="text-sm font-medium text-neutral-900">Insurance</p>
            <p className="text-xs text-neutral-500">{insuranceCount} files</p>
          </div>
        </Card>
        <Card
          padding="sm"
          className="cursor-pointer hover:bg-neutral-50 transition-all"
          onClick={() => setActiveFilter('other')}
        >
          <div className="flex flex-col items-center text-center">
            <Folder className="w-8 h-8 text-neutral-600 mb-2" />
            <p className="text-sm font-medium text-neutral-900">Other</p>
            <p className="text-xs text-neutral-500">{otherCount} files</p>
          </div>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Button
          variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('all')}
        >
          All Documents ({allDocuments.length})
        </Button>
        <Button
          variant={activeFilter === 'lease' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('lease')}
        >
          Leases ({leaseCount})
        </Button>
        <Button
          variant={activeFilter === 'inspection' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('inspection')}
        >
          Inspections ({inspectionCount})
        </Button>
        <Button
          variant={activeFilter === 'insurance' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('insurance')}
        >
          Insurance ({insuranceCount})
        </Button>
        <Button
          variant={activeFilter === 'other' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('other')}
        >
          Other ({otherCount})
        </Button>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">
          {activeFilter === 'all' ? 'All Documents' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Documents`}
        </h3>
        {filteredDocuments.length > 0 ? (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getFileTypeColor(doc.type)}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(doc.category)}`}>
                        {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                      </span>
                      <span className="text-xs text-neutral-600">{formatFileSize(doc.size)}</span>
                      <span className="text-xs text-neutral-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleView(doc)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload your first document to get started managing your property files."
            action={{
              label: 'Upload Document',
              onClick: handleUpload,
            }}
          />
        )}
      </Card>
    </div>
  );
}
