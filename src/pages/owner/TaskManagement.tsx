import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, Clock, Flag, User } from 'lucide-react';
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
import Checkbox from '../../components/atoms/Checkbox';

export default function TaskManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock task data
  const tasks = [
    {
      id: 1,
      title: 'Review lease renewal for Unit 4B',
      description: 'Check lease terms and prepare renewal documents',
      property: 'Sunset Apartments',
      priority: 'high',
      status: 'pending',
      dueDate: '2026-01-25',
      assignedTo: 'Property Manager',
    },
    {
      id: 2,
      title: 'Schedule annual property inspection',
      description: 'Coordinate with inspector for all properties',
      property: 'All Properties',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2026-01-28',
      assignedTo: 'You',
    },
    {
      id: 3,
      title: 'Update insurance policies',
      description: 'Review and renew property insurance',
      property: 'Downtown Plaza',
      priority: 'high',
      status: 'pending',
      dueDate: '2026-01-26',
      assignedTo: 'You',
    },
    {
      id: 4,
      title: 'Prepare monthly financial reports',
      description: 'Compile revenue and expense reports for January',
      property: 'All Properties',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2026-01-31',
      assignedTo: 'Accountant',
    },
    {
      id: 5,
      title: 'Follow up with late rent payments',
      description: 'Contact tenants with outstanding balances',
      property: 'Urban Lofts',
      priority: 'low',
      status: 'completed',
      dueDate: '2026-01-20',
      assignedTo: 'Property Manager',
    },
    {
      id: 6,
      title: 'Schedule HVAC maintenance',
      description: 'Book preventive maintenance for all units',
      property: 'Sunset Apartments',
      priority: 'low',
      status: 'completed',
      dueDate: '2026-01-15',
      assignedTo: 'Maintenance Team',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'pending', label: 'Pending', count: tasks.filter((t) => t.status === 'pending').length },
    { id: 'in-progress', label: 'In Progress', count: tasks.filter((t) => t.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: tasks.filter((t) => t.status === 'completed').length },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || task.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Circle className="w-5 h-5 text-neutral-400" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && filteredTasks.find((t) => t.dueDate === dueDate)?.status !== 'completed';
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
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Task Management</h1>
            <p className="text-sm text-neutral-600">Organize and track your property tasks</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        showCount
      />

      {/* Tasks List */}
      <div className="mt-6">
        {filteredTasks.length === 0 ? (
          <Card>
            <EmptyState
              icon={CheckCircle}
              title="No tasks found"
              description="Create a new task to get started with managing your to-dos."
              action={{
                label: 'New Task',
                onClick: () => setShowAddModal(true),
              }}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:border-neutral-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-neutral-900 mb-1 ${task.status === 'completed' ? 'line-through text-neutral-500' : ''}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-neutral-600">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={getPriorityColor(task.priority)}>
                          <Flag className="w-3 h-3" />
                          {task.priority}
                        </Badge>
                        {isOverdue(task.dueDate) && (
                          <Badge variant="error">Overdue</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-600">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        <span className="capitalize">{task.status.replace('-', ' ')}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.assignedTo}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {task.property}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Task"
        description="Add a new task to your list"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(false)}>
              Create Task
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Task Title" placeholder="e.g., Review lease renewal" required />
          <Textarea
            label="Description"
            placeholder="Add details about the task..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              required
            />
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Due Date" type="date" required />
            <Select
              label="Assign To"
              options={[
                { value: 'you', label: 'You' },
                { value: 'manager', label: 'Property Manager' },
                { value: 'accountant', label: 'Accountant' },
                { value: 'maintenance', label: 'Maintenance Team' },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
