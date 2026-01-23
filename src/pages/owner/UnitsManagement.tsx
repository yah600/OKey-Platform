import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Bed, Bath, Maximize, DollarSign, Edit, Trash2, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import Badge from '../../components/ui/Badge';
import SearchBar from '../../components/molecules/SearchBar';
import EmptyState from '../../components/organisms/EmptyState';
import Modal from '../../components/organisms/Modal';
import Input from '../../components/atoms/Input';
import Select from '../../components/molecules/Select';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';
import { toast } from 'sonner';

export default function UnitsManagement() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { getPropertyById, getUnitsByProperty } = useOwnerPropertiesStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const property = getPropertyById(propertyId || '');
  const allUnits = getUnitsByProperty(propertyId || '');

  // Redirect if property not found
  if (!isLoading && !property) {
    navigate('/owner/properties');
    return null;
  }

  const handleAddUnit = () => {
    toast.info('Add Unit', {
      description: 'Unit creation form coming soon.',
    });
    setShowAddModal(false);
  };

  const handleEditUnit = (unitId: string) => {
    toast.info('Edit Unit', {
      description: 'Unit editing coming soon.',
    });
  };

  const handleDeleteUnit = (unitId: string, unitNumber: string) => {
    toast.info('Delete Unit', {
      description: `Deleting Unit ${unitNumber} coming soon.`,
    });
  };

  const units = allUnits;

  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.tenantName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: units.length,
    occupied: units.filter((u) => u.status === 'occupied').length,
    vacant: units.filter((u) => u.status === 'available').length,
    maintenance: units.filter((u) => u.status === 'maintenance').length,
  };

  if (isLoading || !property) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Properties', href: '/owner/properties' },
            { label: property.name, href: `/owner/properties/${property.id}` },
            { label: 'Units' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate(`/owner/properties/${property.id}`)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
                {property.name} - Units
              </h1>
              <p className="text-sm text-neutral-600">{stats.total} total units</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Unit
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-xs text-neutral-600 mb-1">Total Units</p>
            <p className="text-3xl font-semibold text-neutral-900">{stats.total}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-xs text-neutral-600 mb-1">Occupied</p>
            <p className="text-3xl font-semibold text-green-600">{stats.occupied}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-xs text-neutral-600 mb-1">Vacant</p>
            <p className="text-3xl font-semibold text-amber-600">{stats.vacant}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-xs text-neutral-600 mb-1">Maintenance</p>
            <p className="text-3xl font-semibold text-red-600">{stats.maintenance}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search units or tenants..."
          />
        </div>
        <Select
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'occupied', label: 'Occupied' },
            { value: 'vacant', label: 'Vacant' },
            { value: 'maintenance', label: 'Maintenance' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        />
      </div>

      {/* Units Grid */}
      {filteredUnits.length === 0 ? (
        <Card>
          <EmptyState
            icon={Search}
            title="No units found"
            description="Try adjusting your search or filters."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => (
            <Card key={unit.id} className="hover:border-neutral-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    Unit {unit.unitNumber}
                  </h3>
                </div>
                <Badge
                  variant={
                    unit.status === 'occupied'
                      ? 'success'
                      : unit.status === 'available'
                      ? 'warning'
                      : 'error'
                  }
                >
                  {unit.status === 'available' ? 'vacant' : unit.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {unit.bedrooms} bed
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {unit.bathrooms} bath
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    {unit.sqft} sqft
                  </span>
                </div>
                {unit.tenantName && (
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium">Tenant:</span> {unit.tenantName}
                  </p>
                )}
                {unit.leaseEnd && (
                  <p className="text-xs text-neutral-500">
                    Lease ends: {new Date(unit.leaseEnd).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-neutral-900">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-lg font-semibold">{unit.rent.toLocaleString()}</span>
                  <span className="text-sm text-neutral-600">/mo</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditUnit(unit.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUnit(unit.id, unit.unitNumber)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Unit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Unit"
        description="Create a new unit for this property"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUnit}>
              Add Unit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Unit Number" placeholder="101" required />
            <Input label="Floor" type="number" placeholder="1" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Bedrooms" type="number" placeholder="2" required />
            <Input label="Bathrooms" type="number" step="0.5" placeholder="1.5" required />
            <Input label="Square Feet" type="number" placeholder="850" required />
          </div>
          <Input label="Monthly Rent" type="number" placeholder="2200" required />
          <Select
            label="Status"
            options={[
              { value: 'vacant', label: 'Vacant' },
              { value: 'occupied', label: 'Occupied' },
              { value: 'maintenance', label: 'Maintenance' },
            ]}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
