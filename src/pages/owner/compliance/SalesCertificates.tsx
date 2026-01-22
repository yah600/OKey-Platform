import { useState, useEffect } from 'react';
import { FileCheck, Download, Plus, Calendar, User, Building2, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import SearchBar from '../../../components/molecules/SearchBar';
import Badge from '../../../components/ui/Badge';
import Tabs from '../../../components/ui/Tabs';
import Modal from '../../../components/organisms/Modal';
import Input from '../../../components/atoms/Input';
import Select from '../../../components/molecules/Select';
import DatePicker from '../../../components/molecules/DatePicker';
import EmptyState from '../../../components/organisms/EmptyState';

export default function SalesCertificates() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock certificate requests
  const certificates = [
    {
      id: 1,
      property: 'Sunset Apartments',
      unit: '4B',
      requestDate: '2026-01-20',
      requestedBy: 'Sarah Johnson (Owner)',
      buyerName: 'Michael Chen',
      notaryName: 'Notary Public Services Inc.',
      notaryEmail: 'contact@notarypublic.ca',
      saleDate: '2026-02-15',
      status: 'pending',
      documents: [
        { name: 'Certificate of Compliance', generated: true },
        { name: 'Contingency Fund Certificate', generated: true },
        { name: 'Declaration of Co-ownership', generated: true },
        { name: 'Financial Statements', generated: false },
        { name: 'Meeting Minutes (Last 2 Years)', generated: false },
      ],
      deliveryStatus: 'not_sent',
    },
    {
      id: 2,
      property: 'Downtown Plaza',
      unit: '12A',
      requestDate: '2026-01-15',
      requestedBy: 'James Wilson (Owner)',
      buyerName: 'Emily Rodriguez',
      notaryName: 'Legal Services Quebec',
      notaryEmail: 'info@legalqc.ca',
      saleDate: '2026-01-30',
      status: 'completed',
      documents: [
        { name: 'Certificate of Compliance', generated: true },
        { name: 'Contingency Fund Certificate', generated: true },
        { name: 'Declaration of Co-ownership', generated: true },
        { name: 'Financial Statements', generated: true },
        { name: 'Meeting Minutes (Last 2 Years)', generated: true },
      ],
      deliveryStatus: 'sent',
      deliveryDate: '2026-01-18',
    },
    {
      id: 3,
      property: 'Sunset Apartments',
      unit: '7C',
      requestDate: '2026-01-10',
      requestedBy: 'David Brown (Owner)',
      buyerName: 'Olivia Martin',
      notaryName: 'Quebec Notary Group',
      notaryEmail: 'notary@qcgroup.ca',
      saleDate: '2026-03-01',
      status: 'in_progress',
      documents: [
        { name: 'Certificate of Compliance', generated: true },
        { name: 'Contingency Fund Certificate', generated: true },
        { name: 'Declaration of Co-ownership', generated: true },
        { name: 'Financial Statements', generated: true },
        { name: 'Meeting Minutes (Last 2 Years)', generated: false },
      ],
      deliveryStatus: 'not_sent',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Requests', count: certificates.length },
    { id: 'pending', label: 'Pending', count: certificates.filter(c => c.status === 'pending').length },
    { id: 'in_progress', label: 'In Progress', count: certificates.filter(c => c.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: certificates.filter(c => c.status === 'completed').length },
  ];

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || cert.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getDeliveryBadge = (deliveryStatus: string) => {
    switch (deliveryStatus) {
      case 'sent':
        return <Badge variant="success">Sent</Badge>;
      case 'not_sent':
        return <Badge variant="secondary">Not Sent</Badge>;
      default:
        return <Badge variant="secondary">Not Sent</Badge>;
    }
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
              Sales Certificates
            </h1>
            <p className="text-sm text-neutral-600">
              Quebec Law 16 Compliance - Mandatory certificates for unit sales
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowGenerateModal(true)}>
            <Plus className="w-4 h-4" />
            New Certificate Request
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Quebec Law 16 Requirement
            </h3>
            <p className="text-xs text-blue-800 mb-2">
              When selling a condo unit in Quebec, the seller must provide the buyer with specific certificates and documents
              including: certificate of compliance, contingency fund study certificate, declaration of co-ownership, bylaws,
              financial statements, and meeting minutes from the last 2 years.
            </p>
            <p className="text-xs text-blue-800">
              <strong>Timeline:</strong> These documents must be provided to the buyer before the sale is finalized. The condo
              association has 15 days to provide the requested certificates after receiving the request.
            </p>
          </div>
        </div>
      </Card>

      {/* Required Documents Checklist */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Required Documents for Unit Sales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Certificate of Compliance (Condo Fees Paid)',
            'Contingency Fund Study Certificate',
            'Declaration of Co-ownership',
            'Condo Association Bylaws',
            'Financial Statements (Last Fiscal Year)',
            'Meeting Minutes (Last 2 Years)',
            'Certificate of No Pending Legal Actions',
            'Certificate of Registration',
          ].map((doc, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by property, unit, buyer, or owner..."
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} showCount />

      {/* Certificates List */}
      <div className="mt-6">
        {filteredCertificates.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileCheck}
              title="No certificate requests"
              description="Certificate requests for unit sales will appear here."
              action={{
                label: 'New Request',
                onClick: () => setShowGenerateModal(true),
              }}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCertificates.map((cert) => (
              <Card key={cert.id} className="hover:border-neutral-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-900">
                            {cert.property} - Unit {cert.unit}
                          </h3>
                          <Badge variant={getStatusVariant(cert.status)}>
                            {cert.status.replace('_', ' ')}
                          </Badge>
                          {getDeliveryBadge(cert.deliveryStatus)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Requested: {new Date(cert.requestDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Sale Date: {new Date(cert.saleDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-neutral-600">
                            <User className="w-3 h-3" />
                            <span className="text-xs">Seller: {cert.requestedBy}</span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-600">
                            <User className="w-3 h-3" />
                            <span className="text-xs">Buyer: {cert.buyerName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-600">
                            <Building2 className="w-3 h-3" />
                            <span className="text-xs">Notary: {cert.notaryName}</span>
                          </div>
                          {cert.deliveryDate && (
                            <div className="flex items-center gap-1 text-neutral-600">
                              <Send className="w-3 h-3" />
                              <span className="text-xs">Sent: {new Date(cert.deliveryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button variant="secondary" size="sm">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Document Checklist */}
                    <div className="pt-3 border-t border-neutral-100">
                      <p className="text-xs font-medium text-neutral-700 mb-2">Document Status:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {cert.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            {doc.generated ? (
                              <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-orange-600 flex-shrink-0" />
                            )}
                            <span className={doc.generated ? 'text-neutral-700' : 'text-orange-700'}>
                              {doc.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    {cert.status !== 'completed' && (
                      <div className="pt-3 border-t border-neutral-100 mt-3 flex items-center gap-2">
                        <Button variant="link" size="sm">
                          Generate Missing Documents
                        </Button>
                        {cert.documents.every(d => d.generated) && cert.deliveryStatus !== 'sent' && (
                          <Button variant="primary" size="sm">
                            <Send className="w-3 h-3" />
                            Send to Notary
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Generate Certificate Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="New Certificate Request"
        description="Generate sales certificates for a unit sale"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowGenerateModal(false)}>
              Create Request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Property"
              options={[
                { value: 'sunset', label: 'Sunset Apartments' },
                { value: 'downtown', label: 'Downtown Plaza' },
              ]}
              required
            />
            <Input label="Unit Number" placeholder="e.g., 4B" required />
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
            <p className="text-xs font-medium text-neutral-700 mb-2">Seller Information</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Owner Name" placeholder="Full name" required />
              <Input label="Owner Email" type="email" placeholder="email@example.com" required />
            </div>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
            <p className="text-xs font-medium text-neutral-700 mb-2">Buyer Information</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Buyer Name" placeholder="Full name" required />
              <Input label="Buyer Email" type="email" placeholder="email@example.com" />
            </div>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
            <p className="text-xs font-medium text-neutral-700 mb-2">Notary Information</p>
            <div className="space-y-3">
              <Input label="Notary Name/Firm" placeholder="Notary office name" required />
              <Input label="Notary Email" type="email" placeholder="email@notary.ca" required />
              <Input label="Notary Phone" type="tel" placeholder="(514) 555-0123" />
            </div>
          </div>

          <DatePicker label="Expected Sale Date" required />

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> All required certificates and documents will be automatically generated based on the
              current data in the system. You will be able to review and send them to the notary once generated.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
