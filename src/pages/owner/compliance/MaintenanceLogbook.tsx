import { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, User, Building2, Download, Filter } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import SearchBar from '../../../components/molecules/SearchBar';
import Badge from '../../../components/ui/Badge';
import Tabs from '../../../components/ui/Tabs';
import Modal from '../../../components/organisms/Modal';
import Input from '../../../components/atoms/Input';
import Textarea from '../../../components/atoms/Textarea';
import Select from '../../../components/molecules/Select';
import DatePicker from '../../../components/molecules/DatePicker';
import EmptyState from '../../../components/organisms/EmptyState';

export default function MaintenanceLogbook() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock logbook entries (Quebec Law 16 requirement)
  const entries = [
    {
      id: 1,
      date: '2026-01-20',
      category: 'Structural',
      title: 'Foundation Inspection',
      description: 'Annual structural inspection completed. No issues found.',
      property: 'Sunset Apartments',
      contractor: 'Structural Engineers Inc',
      cost: 1500,
      documents: ['inspection-report.pdf'],
      status: 'completed',
    },
    {
      id: 2,
      date: '2026-01-18',
      category: 'Plumbing',
      title: 'Main Water Line Repair',
      description: 'Repaired leak in main water supply line',
      property: 'Downtown Plaza',
      contractor: 'ABC Plumbing',
      cost: 850,
      documents: ['work-order.pdf', 'invoice.pdf'],
      status: 'completed',
    },
    {
      id: 3,
      date: '2026-01-15',
      category: 'Electrical',
      title: 'Emergency Generator Maintenance',
      description: 'Quarterly maintenance and testing of backup generator',
      property: 'All Properties',
      contractor: 'Power Systems Ltd',
      cost: 600,
      documents: ['maintenance-log.pdf'],
      status: 'completed',
    },
    {
      id: 4,
      date: '2026-01-12',
      category: 'HVAC',
      title: 'Heating System Repair',
      description: 'Replaced faulty thermostat in Unit 4B',
      property: 'Sunset Apartments',
      contractor: 'Elite HVAC Solutions',
      cost: 350,
      documents: [],
      status: 'completed',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Entries', count: entries.length },
    { id: 'structural', label: 'Structural', count: entries.filter(e => e.category === 'Structural').length },
    { id: 'plumbing', label: 'Plumbing', count: entries.filter(e => e.category === 'Plumbing').length },
    { id: 'electrical', label: 'Electrical', count: entries.filter(e => e.category === 'Electrical').length },
    { id: 'hvac', label: 'HVAC', count: entries.filter(e => e.category === 'HVAC').length },
  ];

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || entry.category.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

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
              Maintenance Logbook
            </h1>
            <p className="text-sm text-neutral-600">
              Quebec Law 16 Compliance - Track all major maintenance work
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              New Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Quebec Law 16 Requirement
            </h3>
            <p className="text-xs text-blue-800">
              All condominiums in Quebec must maintain a logbook of major maintenance work performed on common areas.
              This includes structural work, plumbing, electrical, HVAC, and other significant repairs or improvements.
            </p>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search maintenance records..."
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} showCount />

      {/* Entries List */}
      <div className="mt-6">
        {filteredEntries.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileText}
              title="No maintenance records"
              description="Start documenting maintenance work to comply with Quebec Law 16."
              action={{
                label: 'Add Entry',
                onClick: () => setShowAddModal(true),
              }}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:border-neutral-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-900">{entry.title}</h3>
                          <Badge variant="secondary">{entry.category}</Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{entry.description}</p>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {entry.property}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {entry.contractor}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-semibold text-neutral-900">
                          ${entry.cost.toLocaleString()}
                        </p>
                        {entry.documents.length > 0 && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {entry.documents.length} document{entry.documents.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {entry.documents.length > 0 && (
                      <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                        {entry.documents.map((doc, idx) => (
                          <button
                            key={idx}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            {doc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Maintenance Entry"
        description="Document maintenance work for Law 16 compliance"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(false)}>
              Add Entry
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Work Title" placeholder="e.g., Foundation Inspection" required />
          <Textarea
            label="Description"
            placeholder="Detailed description of the maintenance work..."
            rows={3}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={[
                { value: 'structural', label: 'Structural' },
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'electrical', label: 'Electrical' },
                { value: 'hvac', label: 'HVAC' },
                { value: 'roofing', label: 'Roofing' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
            <DatePicker label="Date of Work" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Property"
              options={[
                { value: 'all', label: 'All Properties' },
                { value: 'sunset', label: 'Sunset Apartments' },
                { value: 'downtown', label: 'Downtown Plaza' },
              ]}
              required
            />
            <Input label="Cost" type="number" placeholder="0.00" required />
          </div>
          <Input label="Contractor/Company" placeholder="Company name" required />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Attachments
            </label>
            <p className="text-xs text-neutral-500 mb-2">
              Upload invoices, work orders, inspection reports, photos
            </p>
            <Button variant="secondary" size="sm">
              <Plus className="w-4 h-4" />
              Add Files
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
