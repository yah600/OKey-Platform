import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Wrench, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useAuthStore } from '../../store/authStore';
import { useScheduledMaintenanceStore } from '../../store/scheduledMaintenanceStore';
import { useOwnerPropertiesStore } from '../../store/ownerPropertiesStore';
import { toast } from 'sonner';

const scheduleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  propertyId: z.string().optional(),
  propertyName: z.string().min(1, 'Property is required'),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually']),
  nextDue: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high']),
  vendorName: z.string().min(1, 'Vendor name is required'),
  estimatedCost: z.coerce.number().min(0, 'Cost must be positive'),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export default function ScheduledMaintenance() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuthStore();
  const { getSchedulesByOwner, markAsCompleted, deleteSchedule, addSchedule } = useScheduledMaintenanceStore();
  const { getPropertiesByOwner } = useOwnerPropertiesStore();

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      title: '',
      description: '',
      propertyName: '',
      frequency: 'Monthly',
      nextDue: '',
      priority: 'medium',
      vendorName: '',
      estimatedCost: 0,
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const schedules = user ? getSchedulesByOwner(user.id) : [];
  const properties = user ? getPropertiesByOwner(user.id) : [];

  const propertyOptions = [
    { value: 'all', label: 'All Properties' },
    ...properties.map((p) => ({ value: p.id, label: p.name })),
  ];

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: schedules.filter(s => s.status === 'upcoming').length },
    { id: 'overdue', label: 'Overdue', count: schedules.filter(s => s.status === 'overdue').length },
    { id: 'completed', label: 'Completed', count: schedules.filter(s => s.status === 'completed').length },
  ];

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = schedule.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleMarkCompleted = (scheduleId: string) => {
    markAsCompleted(scheduleId);
    toast.success('Maintenance Completed', {
      description: 'The maintenance has been marked as completed and rescheduled.',
    });
  };

  const handleDelete = (scheduleId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteSchedule(scheduleId);
      toast.success('Schedule Deleted', {
        description: 'The maintenance schedule has been removed.',
      });
    }
  };

  const handleAddSchedule = form.handleSubmit((data) => {
    if (!user) return;

    addSchedule({
      ownerId: user.id,
      propertyId: data.propertyId,
      propertyName: data.propertyName,
      title: data.title,
      description: data.description,
      frequency: data.frequency,
      nextDue: data.nextDue,
      priority: data.priority,
      vendorName: data.vendorName,
      estimatedCost: data.estimatedCost,
      status: 'upcoming',
    });

    toast.success('Schedule Created', {
      description: `${data.title} has been scheduled successfully.`,
    });

    form.reset();
    setShowAddModal(false);
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
                            {schedule.propertyName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Wrench className="w-3 h-3" />
                            {schedule.vendorName}
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
                        <span className="text-neutral-600">${schedule.estimatedCost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {schedule.status !== 'completed' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleMarkCompleted(schedule.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Complete
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(schedule.id, schedule.title)}
                        >
                          Delete
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
        onClose={() => {
          setShowAddModal(false);
          form.reset();
        }}
        title="Create Maintenance Schedule"
        description="Set up a recurring maintenance task"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowAddModal(false);
              form.reset();
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSchedule}>
              Create Schedule
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g., HVAC System Inspection"
            required
            {...form.register('title')}
            error={form.formState.errors.title?.message}
          />
          <Textarea
            label="Description"
            placeholder="Describe the maintenance task..."
            rows={3}
            {...form.register('description')}
            error={form.formState.errors.description?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Property"
              options={propertyOptions}
              required
              {...form.register('propertyName')}
              onChange={(e) => {
                const selectedValue = e.target.value;
                const property = properties.find((p) => p.id === selectedValue);
                form.setValue('propertyName', property?.name || 'All Properties');
                form.setValue('propertyId', selectedValue === 'all' ? undefined : selectedValue);
              }}
              error={form.formState.errors.propertyName?.message}
            />
            <Select
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              required
              {...form.register('priority')}
              error={form.formState.errors.priority?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Frequency"
              options={[
                { value: 'Daily', label: 'Daily' },
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Quarterly', label: 'Quarterly' },
                { value: 'Annually', label: 'Annually' },
              ]}
              required
              {...form.register('frequency')}
              error={form.formState.errors.frequency?.message}
            />
            <Input
              label="First Due Date"
              type="date"
              required
              {...form.register('nextDue')}
              error={form.formState.errors.nextDue?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Vendor"
              placeholder="Vendor name"
              required
              {...form.register('vendorName')}
              error={form.formState.errors.vendorName?.message}
            />
            <Input
              label="Estimated Cost"
              type="number"
              placeholder="0.00"
              {...form.register('estimatedCost')}
              error={form.formState.errors.estimatedCost?.message}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
