import { useState, useEffect } from 'react';
import { Plus, Search, Phone, Mail, MapPin, Star, Edit, Trash2, Wrench } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import SearchBar from '../../components/molecules/SearchBar';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/atoms/Avatar';
import EmptyState from '../../components/organisms/EmptyState';
import Modal from '../../components/organisms/Modal';
import Input from '../../components/atoms/Input';
import Select from '../../components/molecules/Select';

export default function VendorManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock vendor data
  const vendors = [
    {
      id: 1,
      name: 'ABC Plumbing Services',
      category: 'Plumbing',
      phone: '+1 (514) 555-0101',
      email: 'contact@abcplumbing.com',
      address: '123 Service St, Montreal, QC',
      rating: 4.8,
      completedJobs: 24,
      status: 'active',
    },
    {
      id: 2,
      name: 'Elite HVAC Solutions',
      category: 'HVAC',
      phone: '+1 (514) 555-0202',
      email: 'info@elitehvac.com',
      address: '456 Repair Ave, Montreal, QC',
      rating: 4.9,
      completedJobs: 18,
      status: 'active',
    },
    {
      id: 3,
      name: 'Professional Electricians Inc',
      category: 'Electrical',
      phone: '+1 (514) 555-0303',
      email: 'service@proelec.com',
      address: '789 Power Rd, Montreal, QC',
      rating: 4.7,
      completedJobs: 31,
      status: 'active',
    },
    {
      id: 4,
      name: 'Clean & Shine Maintenance',
      category: 'Cleaning',
      phone: '+1 (514) 555-0404',
      email: 'hello@cleanshine.com',
      address: '321 Sparkle Ln, Montreal, QC',
      rating: 4.6,
      completedJobs: 42,
      status: 'active',
    },
    {
      id: 5,
      name: 'Garden Masters Landscaping',
      category: 'Landscaping',
      phone: '+1 (514) 555-0505',
      email: 'info@gardenmasters.com',
      address: '654 Green Way, Montreal, QC',
      rating: 4.5,
      completedJobs: 15,
      status: 'inactive',
    },
  ];

  const categories = ['all', 'Plumbing', 'HVAC', 'Electrical', 'Cleaning', 'Landscaping', 'Other'];

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
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
        onClose={() => setShowAddModal(false)}
        title="Add New Vendor"
        description="Enter vendor information to add them to your list"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(false)}>
              Add Vendor
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Vendor Name" placeholder="ABC Services Inc" required />
          <Select
            label="Category"
            options={categories
              .filter((c) => c !== 'all')
              .map((cat) => ({ value: cat, label: cat }))}
            required
          />
          <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" required />
          <Input label="Email" type="email" placeholder="contact@vendor.com" required />
          <Input label="Address" placeholder="123 Service St, City, Province" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Rating" type="number" step="0.1" min="0" max="5" placeholder="4.5" />
            <Input label="Hourly Rate" type="number" placeholder="75" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
