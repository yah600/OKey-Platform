import { useState, useEffect } from 'react';
import { Plus, Search, Phone, Mail, MapPin, Star, Edit, Trash2, Wrench } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import SearchBar from '../../components/molecules/SearchBar';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/atoms/Avatar';
import EmptyState from '../../components/organisms/EmptyState';
import Modal from '../../components/organisms/Modal';
import Input from '../../components/atoms/Input';
import Textarea from '../../components/atoms/Textarea';
import Select from '../../components/molecules/Select';
import { useAuthStore } from '../../store/authStore';
import { useVendorStore } from '../../store/vendorStore';
import { toast } from 'sonner';

const vendorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.enum(['Plumbing', 'HVAC', 'Electrical', 'Cleaning', 'Landscaping', 'Roofing', 'Painting', 'Other']),
  phone: z.string().min(10, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  notes: z.string().optional(),
});

type VendorFormData = z.infer<typeof vendorSchema>;

export default function VendorManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuthStore();
  const { getVendorsByOwner, getVendorById, addVendor, updateVendor, deleteVendor } = useVendorStore();

  const addForm = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: '',
      category: 'Other',
      phone: '',
      email: '',
      address: '',
      notes: '',
    },
  });

  const editForm = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Populate edit form when editing a vendor
  useEffect(() => {
    if (editingVendor) {
      const vendor = getVendorById(editingVendor);
      if (vendor) {
        editForm.reset({
          name: vendor.name,
          category: vendor.category,
          phone: vendor.phone,
          email: vendor.email,
          address: vendor.address,
          notes: vendor.notes || '',
        });
      }
    }
  }, [editingVendor, getVendorById, editForm]);

  const vendors = user ? getVendorsByOwner(user.id) : [];

  const categories = ['all', 'Plumbing', 'HVAC', 'Electrical', 'Cleaning', 'Landscaping', 'Roofing', 'Painting', 'Other'];

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (vendorId: string, vendorName: string) => {
    if (window.confirm(`Are you sure you want to delete ${vendorName}?`)) {
      deleteVendor(vendorId);
      toast.success('Vendor Deleted', {
        description: `${vendorName} has been removed from your vendors.`,
      });
    }
  };

  const handleEdit = (vendorId: string) => {
    setEditingVendor(vendorId);
    setShowEditModal(true);
  };

  const handleAddVendor = addForm.handleSubmit((data) => {
    if (!user) return;

    addVendor({
      ownerId: user.id,
      name: data.name,
      category: data.category,
      phone: data.phone,
      email: data.email,
      address: data.address,
      status: 'active',
      notes: data.notes,
    });

    toast.success('Vendor Added', {
      description: `${data.name} has been added to your vendors.`,
    });

    addForm.reset();
    setShowAddModal(false);
  });

  const handleSaveEdit = editForm.handleSubmit((data) => {
    if (!editingVendor) return;

    updateVendor(editingVendor, {
      name: data.name,
      category: data.category,
      phone: data.phone,
      email: data.email,
      address: data.address,
      notes: data.notes,
    });

    toast.success('Vendor Updated', {
      description: `${data.name} has been updated successfully.`,
    });

    setEditingVendor(null);
    setShowEditModal(false);
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
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Vendor Management</h1>
        <p className="text-sm text-neutral-600">Manage your trusted service providers</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors..."
          />
        </div>
        <div className="flex gap-2">
          <Select
            options={categories.map((cat) => ({
              value: cat,
              label: cat === 'all' ? 'All Categories' : cat,
            }))}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-48"
          />
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length === 0 ? (
        <Card>
          <EmptyState
            icon={Wrench}
            title="No vendors found"
            description="Try adjusting your search or add a new vendor to get started."
            action={{
              label: 'Add Vendor',
              onClick: () => setShowAddModal(true),
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="hover:border-neutral-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Avatar name={vendor.name} size="md" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-0.5">{vendor.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {vendor.category}
                    </Badge>
                  </div>
                </div>
                <Badge variant={vendor.status === 'active' ? 'success' : 'default'}>
                  {vendor.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-neutral-600">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="truncate">{vendor.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-medium text-neutral-900">{vendor.rating}</span>
                  </div>
                  <span className="text-neutral-600">{vendor.completedJobs} jobs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(vendor.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(vendor.id, vendor.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Vendor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          addForm.reset();
        }}
        title="Add New Vendor"
        description="Enter vendor information to add them to your list"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowAddModal(false);
              addForm.reset();
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddVendor}>
              Add Vendor
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Vendor Name"
            placeholder="ABC Services Inc"
            required
            {...addForm.register('name')}
            error={addForm.formState.errors.name?.message}
          />
          <Select
            label="Category"
            options={categories
              .filter((c) => c !== 'all')
              .map((cat) => ({ value: cat, label: cat }))}
            required
            {...addForm.register('category')}
            error={addForm.formState.errors.category?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              required
              {...addForm.register('phone')}
              error={addForm.formState.errors.phone?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="contact@vendor.com"
              required
              {...addForm.register('email')}
              error={addForm.formState.errors.email?.message}
            />
          </div>
          <Input
            label="Address"
            placeholder="123 Service St, City, Province"
            required
            {...addForm.register('address')}
            error={addForm.formState.errors.address?.message}
          />
          <Textarea
            label="Notes"
            placeholder="Additional notes about this vendor..."
            rows={3}
            {...addForm.register('notes')}
          />
        </form>
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingVendor(null);
        }}
        title="Edit Vendor"
        description="Update vendor information"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false);
              setEditingVendor(null);
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Vendor Name"
            placeholder="ABC Services Inc"
            required
            {...editForm.register('name')}
            error={editForm.formState.errors.name?.message}
          />
          <Select
            label="Category"
            options={categories
              .filter((c) => c !== 'all')
              .map((cat) => ({ value: cat, label: cat }))}
            required
            {...editForm.register('category')}
            error={editForm.formState.errors.category?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              required
              {...editForm.register('phone')}
              error={editForm.formState.errors.phone?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="contact@vendor.com"
              required
              {...editForm.register('email')}
              error={editForm.formState.errors.email?.message}
            />
          </div>
          <Input
            label="Address"
            placeholder="123 Service St, City, Province"
            required
            {...editForm.register('address')}
            error={editForm.formState.errors.address?.message}
          />
          <Textarea
            label="Notes"
            placeholder="Additional notes about this vendor..."
            rows={3}
            {...editForm.register('notes')}
          />
        </form>
      </Modal>
    </div>
  );
}
