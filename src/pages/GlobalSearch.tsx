import { useState, useEffect } from 'react';
import { Search, Building2, User, FileText, Wrench, Calendar, DollarSign, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import SearchBar from '../components/molecules/SearchBar';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import EmptyState from '../components/organisms/EmptyState';
import Modal from '../components/organisms/Modal';
import Checkbox from '../components/atoms/Checkbox';
import Input from '../components/atoms/Input';
import { toast } from 'sonner';

export default function GlobalSearch() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterTypes, setFilterTypes] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleApplyFilters = () => {
    let description = 'Advanced filters applied';

    if (filterTypes.length > 0) {
      description += `: ${filterTypes.join(', ')}`;
    }

    if (filterDateRange && filterStartDate && filterEndDate) {
      description += ` | Date range: ${filterStartDate} to ${filterEndDate}`;
    }

    toast.success('Filters Applied', { description });
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilterTypes([]);
    setFilterDateRange(false);
    setFilterStartDate('');
    setFilterEndDate('');
    toast.info('Filters Cleared', {
      description: 'All search filters have been reset.',
    });
    setShowFilterModal(false);
  };

  const toggleFilterType = (type: string) => {
    setFilterTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Mock search results
  const searchResults = [
    {
      id: 1,
      type: 'property',
      title: 'Sunset Apartments',
      description: '123 Main Street, Montreal, QC',
      details: '24 units • Built 2010 • $450,000 annual revenue',
      link: '/owner/properties/1',
    },
    {
      id: 2,
      type: 'resident',
      title: 'Sarah Johnson',
      description: 'Tenant • Unit 4B, Sunset Apartments',
      details: 'Lease expires: Dec 2026 • Rent: $2,500/mo',
      link: '/owner/residents/1',
    },
    {
      id: 3,
      type: 'document',
      title: 'Property Insurance Policy 2026',
      description: 'Insurance • Sunset Apartments',
      details: 'Uploaded: Jan 15, 2026 • PDF, 2.3 MB',
      link: '/owner/documents',
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Leaking Faucet - Unit 12A',
      description: 'Maintenance Request • High Priority',
      details: 'Reported: Jan 20, 2026 • Status: In Progress',
      link: '/owner/maintenance',
    },
    {
      id: 5,
      type: 'property',
      title: 'Downtown Plaza',
      description: '456 King Street, Montreal, QC',
      details: '12 units • Built 2015 • $280,000 annual revenue',
      link: '/owner/properties/2',
    },
    {
      id: 6,
      type: 'resident',
      title: 'Michael Chen',
      description: 'Tenant • Unit 7C, Downtown Plaza',
      details: 'Lease expires: Mar 2027 • Rent: $2,200/mo',
      link: '/owner/residents/2',
    },
    {
      id: 7,
      type: 'meeting',
      title: 'Annual General Meeting',
      description: 'Meeting • Feb 15, 2026 at 7:00 PM',
      details: 'Sunset Apartments • Community Room',
      link: '/owner/meetings',
    },
    {
      id: 8,
      type: 'payment',
      title: 'Rent Payment - Unit 4B',
      description: 'Payment Received • $2,500',
      details: 'Jan 1, 2026 • Sarah Johnson',
      link: '/owner/financials',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Results', count: searchResults.length },
    { id: 'property', label: 'Properties', count: searchResults.filter(r => r.type === 'property').length },
    { id: 'resident', label: 'Residents', count: searchResults.filter(r => r.type === 'resident').length },
    { id: 'document', label: 'Documents', count: searchResults.filter(r => r.type === 'document').length },
    { id: 'maintenance', label: 'Maintenance', count: searchResults.filter(r => r.type === 'maintenance').length },
  ];

  const filteredResults = searchResults.filter((result) => {
    const matchesSearch =
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || result.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const getResultIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'property':
        return <Building2 className={`${iconClass} text-blue-600`} />;
      case 'resident':
        return <User className={`${iconClass} text-green-600`} />;
      case 'document':
        return <FileText className={`${iconClass} text-neutral-600`} />;
      case 'maintenance':
        return <Wrench className={`${iconClass} text-orange-600`} />;
      case 'meeting':
        return <Calendar className={`${iconClass} text-purple-600`} />;
      case 'payment':
        return <DollarSign className={`${iconClass} text-green-600`} />;
      default:
        return <Search className={iconClass} />;
    }
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      property: 'Property',
      resident: 'Resident',
      document: 'Document',
      maintenance: 'Maintenance',
      meeting: 'Meeting',
      payment: 'Payment',
    };
    return labels[type] || type;
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
              Search Results
            </h1>
            <p className="text-sm text-neutral-600">
              Find properties, residents, documents, and more
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowFilterModal(true)}>
            <Filter className="w-4 h-4" />
            Advanced Filters
            {(filterTypes.length > 0 || filterDateRange) && (
              <Badge variant="primary" className="ml-2">
                {filterTypes.length + (filterDateRange ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search across all content..."
          className="w-full md:w-1/2"
        />
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-neutral-600">
          Found <strong>{filteredResults.length}</strong> result{filteredResults.length !== 1 ? 's' : ''}
          {searchQuery && <> for "<strong>{searchQuery}</strong>"</>}
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} showCount />

      {/* Search Results */}
      <div className="mt-6">
        {filteredResults.length === 0 ? (
          <Card>
            <EmptyState
              icon={Search}
              title="No results found"
              description={
                searchQuery
                  ? `No results found for "${searchQuery}". Try different keywords.`
                  : 'Start typing to search across all content.'
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredResults.map((result) => (
              <Card
                key={result.id}
                className="hover:border-neutral-300 transition-colors cursor-pointer"
                onClick={() => window.location.href = result.link}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                    {getResultIcon(result.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">
                          {result.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeBadge(result.type)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-1">
                      {result.description}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {result.details}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Popular Searches */}
      {searchQuery === '' && (
        <Card className="mt-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {['Sunset Apartments', 'Lease Agreements', 'Maintenance Requests', 'Financial Reports', 'Tenant Payments'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Advanced Filters Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Advanced Filters"
        description="Refine your search results with advanced filters"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Content Type Filters */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Content Types</h3>
            <div className="space-y-2">
              {['properties', 'residents', 'documents', 'maintenance', 'meetings', 'financials'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filterTypes.includes(type)}
                    onChange={() => toggleFilterType(type)}
                  />
                  <span className="text-sm text-neutral-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <Checkbox
                checked={filterDateRange}
                onChange={() => setFilterDateRange(!filterDateRange)}
              />
              <span className="text-sm font-semibold text-neutral-900">Filter by Date Range</span>
            </label>

            {filterDateRange && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <Input
                  label="Start Date"
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
