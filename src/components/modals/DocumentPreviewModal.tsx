import { X, Download, Printer, ExternalLink } from 'lucide-react';
import Modal from '@/components/organisms/Modal';
import Button from '@/components/ui/Button';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any;
}

export function DocumentPreviewModal({ isOpen, onClose, document }: DocumentPreviewModalProps) {
  if (!document) return null;

  const handleDownload = () => {
    // Would trigger actual download
    window.open(document.url, '_blank');
  };

  const handlePrint = () => {
    // Would trigger print dialog
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-neutral-900">{document.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-neutral-600">
              <span>{document.category}</span>
              <span>•</span>
              <span>{document.size}</span>
              <span>•</span>
              <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <button onClick={onClose} className="ml-2 text-neutral-500 hover:text-neutral-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-neutral-50 p-4">
          {document.type === 'pdf' ? (
            <iframe
              src={document.url}
              className="w-full h-full border border-neutral-200 rounded-lg bg-white"
              title={document.name}
            />
          ) : document.type === 'image' ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={document.url}
                alt={document.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ExternalLink className="w-16 h-16 text-neutral-300 mb-4" />
              <p className="text-neutral-600 mb-4">Preview not available for this file type</p>
              <Button variant="primary" onClick={handleDownload}>
                <Download className="w-4 h-4" />
                Download to View
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-200">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
