import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Upload } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import {
  useDocumentsStore,
  formatFileSize,
  getFileTypeColor,
  getCategoryColor,
  type Document,
} from '../../store/documentsStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import DocumentUploadModal from '../../components/organisms/DocumentUploadModal';
import { toast } from 'sonner';

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | Document['category']>('all');
  const { user } = useAuthStore();

  const { getDocumentsByUser, getDocumentsByCategory } = useDocumentsStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const allDocuments = user ? getDocumentsByUser(user.id) : [];
  const filteredDocuments =
    activeFilter === 'all'
      ? allDocuments
      : user
      ? getDocumentsByCategory(user.id, activeFilter)
      : [];

  const handleDownload = (doc: Document) => {
    toast.success('Download Started', {
      description: `Downloading ${doc.name}...`,
    });
    // In real app, would download from doc.url
  };

  const handleView = (doc: Document) => {
    toast.info('View Document', {
      description: 'Document viewer coming soon.',
    });
    // In real app, would open document viewer modal
  };

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Documents</h1>
          <p className="text-sm text-neutral-600">Access your lease, receipts, and important documents</p>
        </div>
        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
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
          Lease ({allDocuments.filter((d) => d.category === 'lease').length})
        </Button>
        <Button
          variant={activeFilter === 'receipt' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('receipt')}
        >
          Receipts ({allDocuments.filter((d) => d.category === 'receipt').length})
        </Button>
        <Button
          variant={activeFilter === 'inspection' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('inspection')}
        >
          Inspection ({allDocuments.filter((d) => d.category === 'inspection').length})
        </Button>
        <Button
          variant={activeFilter === 'insurance' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveFilter('insurance')}
        >
          Insurance ({allDocuments.filter((d) => d.category === 'insurance').length})
        </Button>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id}>
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileTypeColor(doc.type)}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1 truncate">{doc.name}</h3>
                  <p className="text-xs text-neutral-600 mb-2">
                    {doc.type.toUpperCase()} • {formatFileSize(doc.size)} •{' '}
                    {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  {doc.description && (
                    <p className="text-xs text-neutral-500 mb-2 line-clamp-1">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded ${getCategoryColor(doc.category)}`}>
                      {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      by {doc.uploadedBy === 'tenant' ? 'You' : doc.uploadedBy === 'owner' ? 'Owner' : 'System'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => handleView(doc)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">
              {activeFilter === 'all' ? 'No documents yet' : `No ${activeFilter} documents`}
            </h3>
            <p className="text-xs text-neutral-600 mb-4">
              Upload documents to keep everything organized in one place
            </p>
            <Button variant="primary" size="sm" onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4" />
              Upload Document
            </Button>
          </div>
        </Card>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </div>
  );
}
