import { useState, useEffect } from 'react';
import { UserCheck, Plus, Download, Building2, User, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
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
import EmptyState from '../../../components/organisms/EmptyState';

export default function OwnerResponsibilities() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock responsibility items
  const responsibilities = [
    {
      id: 1,
      category: 'Plumbing',
      item: 'Interior Plumbing Fixtures',
      description: 'Faucets, sinks, toilets, showerheads within individual units',
      responsibleParty: 'owner',
      rationale: 'Located within private portion of unit',
      legalReference: 'Declaration of Co-ownership, Article 12.3',
      notes: 'Owner responsible for repairs and replacements',
      lastUpdated: '2024-01-15',
    },
    {
      id: 2,
      category: 'Plumbing',
      item: 'Main Water Supply Lines',
      description: 'Primary water distribution to all units',
      responsibleParty: 'association',
      rationale: 'Common property serving all units',
      legalReference: 'Declaration of Co-ownership, Article 8.1',
      notes: 'Condo association maintains and repairs',
      lastUpdated: '2024-01-15',
    },
    {
      id: 3,
      category: 'HVAC',
      item: 'Individual Unit Thermostats',
      description: 'Temperature control devices within units',
      responsibleParty: 'owner',
      rationale: 'Controls for individual unit comfort',
      legalReference: 'Declaration of Co-ownership, Article 12.5',
      notes: 'Owner responsible for replacement and batteries',
      lastUpdated: '2024-01-15',
    },
    {
      id: 4,
      category: 'HVAC',
      item: 'Central Heating System',
      description: 'Building-wide heating infrastructure',
      responsibleParty: 'association',
      rationale: 'Common system serving all units',
      legalReference: 'Declaration of Co-ownership, Article 8.2',
      notes: 'Condo association responsible for maintenance and repairs',
      lastUpdated: '2024-01-15',
    },
    {
      id: 5,
      category: 'Electrical',
      item: 'Unit Electrical Outlets & Switches',
      description: 'Electrical outlets and light switches within units',
      responsibleParty: 'owner',
      rationale: 'Located within private portion of unit',
      legalReference: 'Declaration of Co-ownership, Article 12.4',
      notes: 'Owner responsible unless issue originates from common wiring',
      lastUpdated: '2024-01-15',
    },
    {
      id: 6,
      category: 'Electrical',
      item: 'Main Electrical Panels',
      description: 'Primary electrical distribution panels',
      responsibleParty: 'association',
      rationale: 'Common infrastructure',
      legalReference: 'Declaration of Co-ownership, Article 8.3',
      notes: 'Condo association maintains',
      lastUpdated: '2024-01-15',
    },
    {
      id: 7,
      category: 'Structural',
      item: 'Interior Unit Walls',
      description: 'Non-load-bearing walls within units',
      responsibleParty: 'owner',
      rationale: 'Private portion modifications',
      legalReference: 'Declaration of Co-ownership, Article 12.1',
      notes: 'Owner can modify with approval for non-structural changes',
      lastUpdated: '2024-01-15',
    },
    {
      id: 8,
      category: 'Structural',
      item: 'Building Foundation & Load-Bearing Walls',
      description: 'Structural elements of the building',
      responsibleParty: 'association',
      rationale: 'Common structural elements',
      legalReference: 'Declaration of Co-ownership, Article 8.4',
      notes: 'Condo association fully responsible',
      lastUpdated: '2024-01-15',
    },
    {
      id: 9,
      category: 'Exterior',
      item: 'Unit Windows & Doors',
      description: 'Exterior-facing windows and entrance doors',
      responsibleParty: 'shared',
      rationale: 'Affects both private and common areas',
      legalReference: 'Declaration of Co-ownership, Article 10.2',
      notes: 'Association pays for exterior maintenance; owner for interior repairs',
      lastUpdated: '2024-01-15',
    },
    {
      id: 10,
      category: 'Exterior',
      item: 'Building Exterior & Roof',
      description: 'Outer walls, roof, and external structure',
      responsibleParty: 'association',
      rationale: 'Common property',
      legalReference: 'Declaration of Co-ownership, Article 8.5',
      notes: 'Condo association fully responsible',
      lastUpdated: '2024-01-15',
    },
    {
      id: 11,
      category: 'Flooring',
      item: 'Unit Flooring',
      description: 'Flooring materials within individual units',
      responsibleParty: 'owner',
      rationale: 'Private portion of unit',
      legalReference: 'Declaration of Co-ownership, Article 12.2',
      notes: 'Owner chooses and maintains. Must meet sound insulation requirements.',
      lastUpdated: '2024-01-15',
    },
    {
      id: 12,
      category: 'Common Areas',
      item: 'Hallways, Lobby, Elevators',
      description: 'Shared common areas',
      responsibleParty: 'association',
      rationale: 'Common property for all residents',
      legalReference: 'Declaration of Co-ownership, Article 8.6',
      notes: 'Condo association maintains and cleans',
      lastUpdated: '2024-01-15',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Items', count: responsibilities.length },
    { id: 'owner', label: 'Owner', count: responsibilities.filter(r => r.responsibleParty === 'owner').length },
    { id: 'association', label: 'Association', count: responsibilities.filter(r => r.responsibleParty === 'association').length },
    { id: 'shared', label: 'Shared', count: responsibilities.filter(r => r.responsibleParty === 'shared').length },
  ];

  const filteredResponsibilities = responsibilities.filter((item) => {
    const matchesSearch =
      item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || item.responsibleParty === activeTab;
    return matchesSearch && matchesTab;
  });

  const getResponsibilityIcon = (party: string) => {
    switch (party) {
      case 'owner':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'association':
        return <Building2 className="w-4 h-4 text-green-600" />;
      case 'shared':
        return <HelpCircle className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getResponsibilityVariant = (party: string) => {
    switch (party) {
      case 'owner':
        return 'primary';
      case 'association':
        return 'success';
      case 'shared':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getResponsibilityLabel = (party: string) => {
    switch (party) {
      case 'owner':
        return 'Unit Owner';
      case 'association':
        return 'Condo Association';
      case 'shared':
        return 'Shared Responsibility';
      default:
        return party;
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
              Owner Responsibilities
            </h1>
            <p className="text-sm text-neutral-600">
              Quebec Law 16 Compliance - Clear delineation of owner vs association responsibilities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Download className="w-4 h-4" />
              Export Guide
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Quebec Law 16 Requirement
            </h3>
            <p className="text-xs text-blue-800">
              Quebec condominiums must maintain clear documentation of responsibilities between individual unit owners
              and the condo association. This includes maintenance, repairs, and replacement of various building components
              and systems. This information must be clearly communicated to all owners and referenced in the declaration
              of co-ownership.
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Owner Responsibilities</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {responsibilities.filter(r => r.responsibleParty === 'owner').length}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Items under owner control</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Association Responsibilities</p>
              <h3 className="text-2xl font-bold text-green-600">
                {responsibilities.filter(r => r.responsibleParty === 'association').length}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Common area items</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Shared Responsibilities</p>
              <h3 className="text-2xl font-bold text-orange-600">
                {responsibilities.filter(r => r.responsibleParty === 'shared').length}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Joint responsibilities</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Reference Guide */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quick Reference Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-900">Unit Owner</h4>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Interior plumbing fixtures</li>
              <li>• Unit thermostats & HVAC controls</li>
              <li>• Electrical outlets & switches</li>
              <li>• Interior non-structural walls</li>
              <li>• Flooring & finishes</li>
              <li>• Appliances & personal property</li>
            </ul>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-semibold text-green-900">Condo Association</h4>
            </div>
            <ul className="text-xs text-green-800 space-y-1">
              <li>• Main water & sewer lines</li>
              <li>• Central heating & cooling</li>
              <li>• Main electrical panels</li>
              <li>• Building structure & foundation</li>
              <li>• Roof & exterior walls</li>
              <li>• Common areas & amenities</li>
            </ul>
          </div>

          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-orange-600" />
              <h4 className="text-sm font-semibold text-orange-900">Shared</h4>
            </div>
            <ul className="text-xs text-orange-800 space-y-1">
              <li>• Windows & doors (exterior/interior)</li>
              <li>• Balconies & patios</li>
              <li>• Pipes within walls (case-by-case)</li>
              <li>• Special assessments projects</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search responsibilities by item, description, or category..."
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} showCount />

      {/* Responsibilities List */}
      <div className="mt-6">
        {filteredResponsibilities.length === 0 ? (
          <Card>
            <EmptyState
              icon={UserCheck}
              title="No responsibilities found"
              description="Start documenting owner and association responsibilities."
              action={{
                label: 'Add Item',
                onClick: () => setShowAddModal(true),
              }}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredResponsibilities.map((item) => (
              <Card key={item.id} className="hover:border-neutral-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    item.responsibleParty === 'owner'
                      ? 'bg-blue-100'
                      : item.responsibleParty === 'association'
                      ? 'bg-green-100'
                      : 'bg-orange-100'
                  }`}>
                    {getResponsibilityIcon(item.responsibleParty)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-900">{item.item}</h3>
                          <Badge variant={getResponsibilityVariant(item.responsibleParty)}>
                            {getResponsibilityLabel(item.responsibleParty)}
                          </Badge>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-neutral-700 min-w-[80px]">Rationale:</span>
                            <span className="text-neutral-600">{item.rationale}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-neutral-700 min-w-[80px]">Legal Ref:</span>
                            <span className="text-neutral-600">{item.legalReference}</span>
                          </div>
                          {item.notes && (
                            <div className="flex items-start gap-2">
                              <span className="font-medium text-neutral-700 min-w-[80px]">Notes:</span>
                              <span className="text-neutral-600">{item.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                      Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Responsibility Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Responsibility Item"
        description="Define a new responsibility item and assign ownership"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(false)}>
              Add Item
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Item Name" placeholder="e.g., Interior Plumbing Fixtures" required />
          <Textarea
            label="Description"
            placeholder="Detailed description of the item or system..."
            rows={3}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={[
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'hvac', label: 'HVAC' },
                { value: 'electrical', label: 'Electrical' },
                { value: 'structural', label: 'Structural' },
                { value: 'exterior', label: 'Exterior' },
                { value: 'flooring', label: 'Flooring' },
                { value: 'common-areas', label: 'Common Areas' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
            <Select
              label="Responsible Party"
              options={[
                { value: 'owner', label: 'Unit Owner' },
                { value: 'association', label: 'Condo Association' },
                { value: 'shared', label: 'Shared Responsibility' },
              ]}
              required
            />
          </div>
          <Textarea
            label="Rationale"
            placeholder="Why is this party responsible? (e.g., Located within private portion)"
            rows={2}
            required
          />
          <Input
            label="Legal Reference"
            placeholder="e.g., Declaration of Co-ownership, Article 12.3"
            required
          />
          <Textarea label="Additional Notes" placeholder="Any special conditions or exceptions..." rows={2} />
        </div>
      </Modal>
    </div>
  );
}
