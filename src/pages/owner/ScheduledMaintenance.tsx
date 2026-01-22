import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Wrench, Building2, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import SearchBar from '../../components/molecules/SearchBar';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/organisms/EmptyState';
import Modal from '../../components/organisms/Modal';
import Input from '../../components/atoms/Input';
import Textarea from '../../components/atoms/Textarea';
import Select from '../../components/molecules/Select';
import DatePicker from '../../components/molecules/DatePicker';

export default function ScheduledMaintenance() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock scheduled maintenance data
  const schedules = [
    {
      id: 1,
      title: 'HVAC System Inspection',
      property: 'Sunset Apartments',
      description: 'Annual HVAC system inspection and filter replacement',
      frequency: 'Quarterly',
      nextDue: '2026-02-15',
      lastCompleted: '2025-11-15',
      vendor: 'Elite HVAC Solutions',
      cost: 350,
      status: 'upcoming',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Fire Alarm Testing',
      property: 'All Properties',
      description: 'Test all fire alarms and replace batteries as needed',
      frequency: 'Monthly',
      nextDue: '2026-01-31',
      lastCompleted: '2026-01-01',
      vendor: 'SafeGuard Systems',
      cost: 200,
      status: 'upcoming',
      priority: 'high',
    },
    {
      id: 3,
      title: 'Elevator Maintenance',
      property: 'Downtown Plaza',
      description: 'Regular elevator inspection and maintenance',
      frequency: 'Monthly',
      nextDue: '2026-01-28',
      lastCompleted: '2025-12-28',
      vendor: 'Vertical Transport Inc',
      cost: 450,
      status: 'upcoming',
      priority: 'medium',
    },
    {
      id: 4,
      title: 'Landscaping Service',
      property: 'Sunset Apartments',
      description: 'Lawn mowing, trimming, and general landscaping',
      frequency: 'Weekly',
      nextDue: '2026-01-26',
      lastCompleted: '2026-01-19',
      vendor: 'Garden Masters',
      cost: 150,
      status: 'upcoming',
      priority: 'low',
    },
    {
      id: 5,
      title: 'Common Area Cleaning',
      property: 'All Properties',
      description: 'Deep cleaning of common areas',
      frequency: 'Weekly',
      nextDue: '2026-01-25',
      lastCompleted: '2026-01-18',
      vendor: 'Clean & Shine',
      cost: 300,
      status: 'overdue',
      priority: 'medium',
    },
    {
      id: 6,
      title: 'Pool Maintenance',
      property: 'Urban Lofts',
      description: 'Pool cleaning, chemical balancing, and equipment check',
      frequency: 'Weekly',
      nextDue: '2026-02-01',
      lastCompleted: '2026-01-20',
      vendor: 'Pool Pro Services',
      cost: 200,
      status: 'completed',
      priority: 'medium',
    },
  ];

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: schedules.filter(s => s.status === 'upcoming').length },
    { id: 'overdue', label: 'Overdue', count: schedules.filter(s => s.status === 'overdue').length },
    { id: 'completed', label: 'Completed', count: schedules.filter(s => s.status === 'completed').length },
  ];

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || schedule.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const isOverdue = (date: string) => {
    return new Date(date) < new Date();
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
              Scheduled Maintenance
            </h1>
            <p className="text-sm text-neutral-600">Manage recurring maintenance tasks</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            New Schedule
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search schedules..."
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} showCount />

      {/* Schedules List */}
      <div className="mt-6">
        {filteredSchedules.length === 0 ? (
          <Card>
            <EmptyState
              icon={Calendar}
              title="No scheduled maintenance"
              description="Create a new maintenance schedule to get started."
              action={{
                label: 'New Schedule',
                onClick: () => setShowAddModal(true),
              }}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredSchedules.map((schedule) => (
              <Card key={schedule.id} className="hover:border-neutral-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                      schedule.status === 'overdue'
                        ? 'bg-red-100'
                        : schedule.status === 'completed'
                        ? 'bg-green-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    <Wrench
                      className={`w-6 h-6 ${
                        schedule.status === 'overdue'
                          ? 'text-red-600'
                          : schedule.status === 'completed'
                          ? 'text-green-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-neutral-900 mb-1">
                          {schedule.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-2">{schedule.description}</p>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {schedule.property}
                          </span>
                          <span className="flex items-center gap-1">
                            <Wrench className="w-3 h-3" />
                            {schedule.vendor}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant={
                            schedule.priority === 'high'
                              ? 'error'
                              : schedule.priority === 'medium'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {schedule.priority}
                        </Badge>
                        {schedule.status === 'overdue' && (
                          <Badge variant="error">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-neutral-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Next: {new Date(schedule.nextDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-600">
                          <Clock className="w-4 h-4" />
                          <span>{schedule.frequency}</span>
                        </div>
                        <span className="text-neutral-600">${schedule.cost}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {schedule.status !== 'completed' && (
                          <Button variant="secondary" size="sm">
                            Mark Complete
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Schedule Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Maintenance Schedule"
        description="Set up a recurring maintenance task"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(false)}>
              Create Schedule
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Task Title" placeholder="e.g., HVAC System Inspection" required />
          <Textarea
            label="Description"
            placeholder="Describe the maintenance task..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Property"
              options={[
                { value: 'all', label: 'All Properties' },
                { value: 'sunset', label: 'Sunset Apartments' },
                { value: 'downtown', label: 'Downtown Plaza' },
                { value: 'urban', label: 'Urban Lofts' },
              ]}
              required
            />
            <Select
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Frequency"
              options={[
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'annually', label: 'Annually' },
              ]}
              required
            />
            <DatePicker label="First Due Date" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vendor" placeholder="Vendor name" />
            <Input label="Estimated Cost" type="number" placeholder="0.00" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
