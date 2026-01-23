import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, File } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/organisms/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { useDocumentsStore } from '../../store/documentsStore';
import { toast } from 'sonner';

export function TenantDocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuthStore();
  const { getDocumentsByUser } = useDocumentsStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const documents = user ? getDocumentsByUser(user.id) : [];

  const categories = ['all', 'lease', 'insurance', 'receipt', 'notice', 'other'];

  const filteredDocuments = documents.filter((doc) => {
    if (selectedCategory === 'all') return true;
    return doc.type === selectedCategory;
  });

  const handleView = (documentId: string, documentName: string) => {
    toast.info('View Document', {
      description: `Opening ${documentName}...`,
    });
  };

  const handleDownload = (documentId: string, documentName: string) => {
    toast.success('Download Started', {
      description: `Downloading ${documentName}...`,
    });
  };

  const getCategoryBadge = (type: string) => {
    switch (type) {
      case 'lease':
        return <Badge variant="default">Lease</Badge>;
      case 'insurance':
        return <Badge variant="default">Insurance</Badge>;
      case 'receipt':
        return <Badge variant="success">Receipt</Badge>;
      case 'notice':
        return <Badge variant="warning">Notice</Badge>;
      default:
        return <Badge variant="default">Other</Badge>;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'lease':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'insurance':
        return <FileText className="w-6 h-6 text-green-600" />;
      case 'receipt':
        return <FileText className="w-6 h-6 text-purple-600" />;
      case 'notice':
        return <FileText className="w-6 h-6 text-amber-600" />;
      default:
        return <File className="w-6 h-6 text-neutral-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Documents</h1>
          <p className="text-sm text-neutral-600">View and manage your lease documents and receipts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Total Documents</p>
              <p className="text-3xl font-semibold text-neutral-900">{documents.length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Lease Documents</p>
              <p className="text-3xl font-semibold text-blue-600">
                {documents.filter((d) => d.type === 'lease').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Receipts</p>
              <p className="text-3xl font-semibold text-purple-600">
                {documents.filter((d) => d.type === 'receipt').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-1">Other</p>
              <p className="text-3xl font-semibold text-neutral-600">
                {documents.filter((d) => d.type === 'other' || d.type === 'insurance' || d.type === 'notice').length}
              </p>
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileText}
              title="No documents found"
              description="Your lease documents and receipts will appear here."
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:border-neutral-300 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                    {getFileIcon(document.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 mb-1 truncate">{document.name}</h3>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(document.type)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{formatFileSize(document.size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uploaded:</span>
                    <span className="font-medium">
                      {new Date(document.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleView(document.id, document.name)}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(document.id, document.name)}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
