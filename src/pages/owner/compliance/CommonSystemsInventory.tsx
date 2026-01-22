import { useState, useEffect } from 'react';
import { Wrench, Plus, Download, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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

export default function CommonSystemsInventory() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock inventory items
  const inventoryItems = [
    {
      id: 1,
      category: 'Structural',
      name: 'Building Foundation',
      description: 'Concrete foundation and structural base',
      property: 'All Properties',
      installDate: '1985-06-15',
      expectedLifespan: 100,
      currentAge: 41,
      condition: 'Good',
      lastInspection: '2024-03-15',
      nextInspection: '2029-03-15',
      replacementCost: 500000,
      maintenanceSchedule: 'Inspect every 5 years',
      responsibleParty: 'Condo Association',
      documents: ['foundation-inspection-2024.pdf'],
    },
    {
      id: 2,
      category: 'HVAC',
      name: 'Central Heating System',
      description: 'Gas-fired boiler heating system for all units',
      property: 'Sunset Apartments',
      installDate: '2010-09-20',
      expectedLifespan: 25,
      currentAge: 15,
      condition: 'Fair',
      lastInspection: '2025-11-10',
      nextInspection: '2026-11-10',
      replacementCost: 85000,
      maintenanceSchedule: 'Annual servicing',
      responsibleParty: 'Condo Association',
      documents: ['hvac-maintenance-log.pdf'],
    },
    {
      id: 3,
      category: 'Roofing',
      name: 'Main Roof Membrane',
      description: 'Flat roof membrane covering',
      property: 'All Properties',
      installDate: '2015-05-10',
      expectedLifespan: 20,
      currentAge: 11,
      condition: 'Good',
      lastInspection: '2025-09-15',
      nextInspection: '2027-09-15',
      replacementCost: 120000,
      maintenanceSchedule: 'Inspect bi-annually',
      responsibleParty: 'Condo Association',
      documents: ['roof-inspection-2025.pdf'],
    },
    {
      id: 4,
      category: 'Plumbing',
      name: 'Main Water Supply Line',
      description: 'Primary water supply infrastructure',
      property: 'Downtown Plaza',
      installDate: '1990-03-12',
      expectedLifespan: 50,
      currentAge: 36,
      condition: 'Fair',
      lastInspection: '2025-06-20',
      nextInspection: '2026-06-20',
      replacementCost: 65000,
      maintenanceSchedule: 'Annual inspection',
      responsibleParty: 'Condo Association',
      documents: ['plumbing-assessment.pdf'],
    },
    {
      id: 5,
      category: 'Electrical',
      name: 'Electrical Panel Upgrade',
      description: 'Main electrical distribution panels',
      property: 'Sunset Apartments',
      installDate: '2018-08-05',
      expectedLifespan: 30,
      currentAge: 8,
      condition: 'Excellent',
      lastInspection: '2025-12-01',
      nextInspection: '2028-12-01',
      replacementCost: 45000,
      maintenanceSchedule: 'Inspect every 3 years',
      responsibleParty: 'Condo Association',
      documents: [],
    },
    {
      id: 6,
      category: 'Exterior',
      name: 'Exterior Paint & Siding',
      description: 'Building exterior finishing and protection',
      property: 'All Properties',
      installDate: '2020-07-15',
      expectedLifespan: 15,
      currentAge: 6,
      condition: 'Good',
      lastInspection: '2025-10-10',
      nextInspection: '2028-10-10',
      replacementCost: 95000,
      maintenanceSchedule: 'Inspect every 3 years',
      responsibleParty: 'Condo Association',
      documents: ['exterior-assessment.pdf'],
    },
    {
      id: 7,
      category: 'Elevators',
      name: 'Passenger Elevator System',
      description: '2 passenger elevators serving 12 floors',
      property: 'Downtown Plaza',
      installDate: '2005-04-20',
      expectedLifespan: 25,
      currentAge: 21,
      condition: 'Fair',
      lastInspection: '2026-01-15',
      nextInspection: '2027-01-15',
      replacementCost: 150000,
      maintenanceSchedule: 'Monthly maintenance',
      responsibleParty: 'Condo Association',
      documents: ['elevator-inspection-2026.pdf', 'maintenance-contract.pdf'],
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Systems', count: inventoryItems.length },
    { id: 'Structural', label: 'Structural', count: inventoryItems.filter(i => i.category === 'Structural').length },
    { id: 'HVAC', label: 'HVAC', count: inventoryItems.filter(i => i.category === 'HVAC').length },
    { id: 'Roofing', label: 'Roofing', count: inventoryItems.filter(i => i.category === 'Roofing').length },
    { id: 'Plumbing', label: 'Plumbing', count: inventoryItems.filter(i => i.category === 'Plumbing').length },
    { id: 'Electrical', label: 'Electrical', count: inventoryItems.filter(i => i.category === 'Electrical').length },
    { id: 'Exterior', label: 'Exterior', count: inventoryItems.filter(i => i.category === 'Exterior').length },
    { id: 'Elevators', label: 'Elevators', count: inventoryItems.filter(i => i.category === 'Elevators').length },
  ];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getConditionVariant = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'success';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fair':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getRemainingLifePercentage = (currentAge: number, expectedLifespan: number) => {
    return Math.max(0, Math.min(100, ((expectedLifespan - currentAge) / expectedLifespan) * 100));
  };

  const totalReplacementCost = inventoryItems.reduce((sum, item) => sum + item.replacementCost, 0);

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
              Common Systems Inventory
            </h1>
            <p className="text-sm text-neutral-600">
              Quebec Law 16 Compliance - Mandatory inventory of common property systems
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Download className="w-4 h-4" />
              Export Inventory
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Add System
            </Button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Wrench className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Quebec Law 16 Requirement
            </h3>
            <p className="text-xs text-blue-800">
              All Quebec condominiums must maintain a detailed inventory of common property systems and elements.
              This inventory must include the installation date, expected lifespan, current condition, replacement cost,
              and maintenance schedule for each system. This information is essential for the mandatory contingency fund study.
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Systems</p>
              <h3 className="text-2xl font-bold text-neutral-900">{inventoryItems.length}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Replacement Cost</p>
              <h3 className="text-2xl font-bold text-neutral-900">
                ${(totalReplacementCost / 1000).toFixed(0)}K
              </h3>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Good Condition</p>
              <h3 className="text-2xl font-bold text-green-600">
                {inventoryItems.filter(i => ['excellent', 'good'].includes(i.condition.toLowerCase())).length}
              </h3>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Needs Attention</p>
              <h3 className="text-2xl font-bold text-orange-600">
                {inventoryItems.filter(i => ['fair', 'poor'].includes(i.condition.toLowerCase())).length}
              </h3>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search systems by name, description, or property..."
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} showCount />

      {/* Inventory List */}
      <div className="mt-6">
        {filteredItems.length === 0 ? (
          <Card>
            <EmptyState
              icon={Wrench}
              title="No systems found"
              description="Start documenting common property systems to comply with Quebec Law 16."
              action={{
                label: 'Add System',
                onClick: () => setShowAddModal(true),
              }}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const remainingLifePercent = getRemainingLifePercentage(item.currentAge, item.expectedLifespan);
              const yearsRemaining = item.expectedLifespan - item.currentAge;

              return (
                <Card key={item.id} className="hover:border-neutral-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                            <Badge variant={getConditionVariant(item.condition)}>{item.condition}</Badge>
                            <Badge variant="secondary">{item.category}</Badge>
                          </div>
                          <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-neutral-500">
                            <div>
                              <span className="block text-neutral-700 font-medium mb-0.5">Install Date</span>
                              {new Date(item.installDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="block text-neutral-700 font-medium mb-0.5">Age / Lifespan</span>
                              {item.currentAge} / {item.expectedLifespan} years
                            </div>
                            <div>
                              <span className="block text-neutral-700 font-medium mb-0.5">Property</span>
                              {item.property}
                            </div>
                            <div>
                              <span className="block text-neutral-700 font-medium mb-0.5">Replacement Cost</span>
                              ${item.replacementCost.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {getConditionIcon(item.condition)}
                        </div>
                      </div>

                      {/* Remaining Life Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-neutral-600">Remaining Lifespan</span>
                          <span className="font-medium text-neutral-900">
                            {yearsRemaining} years ({remainingLifePercent.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              remainingLifePercent > 50
                                ? 'bg-green-600'
                                : remainingLifePercent > 25
                                ? 'bg-orange-600'
                                : 'bg-red-600'
                            }`}
                            style={{ width: `${remainingLifePercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <Calendar className="w-3 h-3" />
                          <div>
                            <span className="font-medium text-neutral-700">Last Inspection:</span>{' '}
                            {new Date(item.lastInspection).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <Calendar className="w-3 h-3" />
                          <div>
                            <span className="font-medium text-neutral-700">Next Inspection:</span>{' '}
                            {new Date(item.nextInspection).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <Clock className="w-3 h-3" />
                          <div>
                            <span className="font-medium text-neutral-700">Maintenance:</span> {item.maintenanceSchedule}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <div>
                            <span className="font-medium text-neutral-700">Responsible:</span> {item.responsibleParty}
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      {item.documents.length > 0 && (
                        <div className="flex items-center gap-2 pt-3 border-t border-neutral-100 mt-3">
                          <span className="text-xs font-medium text-neutral-700">Documents:</span>
                          {item.documents.map((doc, idx) => (
                            <button
                              key={idx}
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              {doc}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add System Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Common System"
        description="Add a new system or element to the inventory"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(false)}>
              Add System
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="System Name" placeholder="e.g., Central Heating System" required />
          <Textarea
            label="Description"
            placeholder="Detailed description of the system..."
            rows={3}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={[
                { value: 'structural', label: 'Structural' },
                { value: 'hvac', label: 'HVAC' },
                { value: 'roofing', label: 'Roofing' },
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'electrical', label: 'Electrical' },
                { value: 'exterior', label: 'Exterior' },
                { value: 'elevators', label: 'Elevators' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
            <Select
              label="Property"
              options={[
                { value: 'all', label: 'All Properties' },
                { value: 'sunset', label: 'Sunset Apartments' },
                { value: 'downtown', label: 'Downtown Plaza' },
              ]}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DatePicker label="Installation Date" required />
            <Input label="Expected Lifespan (years)" type="number" placeholder="25" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Current Condition"
              options={[
                { value: 'excellent', label: 'Excellent' },
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
                { value: 'poor', label: 'Poor' },
              ]}
              required
            />
            <Input label="Replacement Cost" type="number" placeholder="0.00" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DatePicker label="Last Inspection Date" required />
            <DatePicker label="Next Inspection Date" required />
          </div>
          <Input label="Maintenance Schedule" placeholder="e.g., Annual servicing" required />
          <Input
            label="Responsible Party"
            placeholder="e.g., Condo Association"
            value="Condo Association"
            required
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Documents
            </label>
            <p className="text-xs text-neutral-500 mb-2">
              Upload inspection reports, warranties, maintenance contracts
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
