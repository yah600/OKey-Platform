import { useState, useEffect } from 'react';
import { FileText, Upload, Folder, Download, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/organisms/Modal';
import Input from '../../components/atoms/Input';
import Select from '../../components/molecules/Select';
import { DocumentPreviewModal } from '../../components/modals/DocumentPreviewModal';
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

const uploadSchema = z.object({
  name: z.string().min(3, 'Document name is required'),
  propertyId: z.string().min(1, 'Property is required'),
  category: z.enum(['lease', 'inspection', 'insurance', 'other']),
  type: z.string().min(1, 'Document type is required'),
  size: z.coerce.number().min(1, 'File size required'),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export default function OwnerDocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | Document['category']>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { user } = useAuthStore();
  const { getPropertiesByOwner } = useOwnerPropertiesStore();
  const { getDocumentsByProperties, getDocumentsByPropertyAndCategory, addDocument } = useDocumentsStore();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      name: '',
      category: 'other',
      type: 'application/pdf',
      size: 0,
    },
  });

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
    setShowUploadModal(true);
  };

  const handleUploadSubmit = form.handleSubmit((data) => {
    if (!user) return;

    addDocument({
      name: data.name,
      propertyId: data.propertyId,
      userId: user.id,
      category: data.category,
      type: data.type,
      size: data.size,
      url: `https://example.com/documents/${data.name.replace(/\s+/g, '_')}`,
    });

    toast.success('Document Uploaded', {
      description: `${data.name} has been uploaded successfully.`,
    });

    form.reset();
    setShowUploadModal(false);
  });

  const handleDownload = (doc: Document) => {
    toast.success('Download Started', {
      description: `Downloading ${doc.name}...`,
    });
  };

  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
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

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          form.reset();
        }}
        title="Upload Document"
        description="Add a new document to your property files"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowUploadModal(false);
              form.reset();
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUploadSubmit}>
              Upload
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Document Name"
            placeholder="e.g., Lease Agreement - Unit 4B"
            required
            {...form.register('name')}
            error={form.formState.errors.name?.message}
          />
          <Select
            label="Property"
            options={properties.map((p) => ({ value: p.id, label: p.name }))}
            required
            {...form.register('propertyId')}
            error={form.formState.errors.propertyId?.message}
          />
          <Select
            label="Category"
            options={[
              { value: 'lease', label: 'Lease' },
              { value: 'inspection', label: 'Inspection' },
              { value: 'insurance', label: 'Insurance' },
              { value: 'other', label: 'Other' },
            ]}
            required
            {...form.register('category')}
            error={form.formState.errors.category?.message}
          />
          <Input
            label="File Size (KB)"
            type="number"
            placeholder="e.g., 250"
            required
            {...form.register('size')}
            error={form.formState.errors.size?.message}
            helpText="Simulated upload - enter approximate file size"
          />
        </form>
      </Modal>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        document={selectedDocument}
      />
    </div>
  );
}
