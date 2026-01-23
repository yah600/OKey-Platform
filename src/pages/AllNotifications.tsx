import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import EmptyState from '../components/organisms/EmptyState';

export default function AllNotifications() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      message: 'Rent payment of $2,500 received from Unit 4B',
      time: '2026-01-22T10:30:00',
      read: false,
      priority: 'normal',
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Maintenance Request',
      message: 'New request: Leaking faucet in Unit 12A',
      time: '2026-01-22T09:15:00',
      read: false,
      priority: 'high',
    },
    {
      id: 3,
      type: 'lease',
      title: 'Lease Expiring Soon',
      message: 'Lease for Unit 7C expires in 30 days',
      time: '2026-01-22T08:00:00',
      read: true,
      priority: 'normal',
    },
    {
      id: 4,
      type: 'document',
      title: 'Document Shared',
      message: 'New document uploaded: Property Insurance Policy',
      time: '2026-01-21T16:45:00',
      read: true,
      priority: 'low',
    },
    {
      id: 5,
      type: 'meeting',
      title: 'Meeting Reminder',
      message: 'Annual General Meeting scheduled for Feb 15, 2026',
      time: '2026-01-21T14:30:00',
      read: false,
      priority: 'normal',
    },
    {
      id: 6,
      type: 'payment',
      title: 'Late Payment Alert',
      message: 'Rent payment overdue for Unit 3A',
      time: '2026-01-21T10:00:00',
      read: false,
      priority: 'high',
    },
    {
      id: 7,
      type: 'application',
      title: 'New Rental Application',
      message: 'Application received for Unit 8B',
      time: '2026-01-20T15:20:00',
      read: true,
      priority: 'normal',
    },
    {
      id: 8,
      type: 'system',
      title: 'System Update',
      message: 'New features available: Enhanced reporting dashboard',
      time: '2026-01-20T12:00:00',
      read: true,
      priority: 'low',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { id: 'maintenance', label: 'Maintenance', count: notifications.filter(n => n.type === 'maintenance').length },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  const getNotificationIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'payment':
        return <span className="text-green-600">💰</span>;
      case 'maintenance':
        return <span className="text-orange-600">🔧</span>;
      case 'lease':
        return <span className="text-blue-600">📄</span>;
      case 'document':
        return <span className="text-neutral-600">📁</span>;
      case 'meeting':
        return <span className="text-purple-600">📅</span>;
      case 'application':
        return <span className="text-primary-600">✉️</span>;
      case 'system':
        return <span className="text-neutral-500">⚙️</span>;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  };

  const markAllAsRead = () => {
    // In a real app, this would call an API
    console.log('Marking all as read');
  };

  const deleteAll = () => {
    // In a real app, this would call an API
    console.log('Deleting all notifications');
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
              Notifications
            </h1>
            <p className="text-sm text-neutral-600">
              Stay updated with important events and activities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </Button>
            <Button variant="secondary" size="sm">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total</p>
              <p className="text-2xl font-bold text-neutral-900">{notifications.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Unread</p>
              <p className="text-2xl font-bold text-orange-600">
                {notifications.filter(n => !n.read).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {notifications.filter(n => n.priority === 'high').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Read</p>
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.read).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} showCount />

      {/* Notifications List */}
      <div className="mt-6">
        {filteredNotifications.length === 0 ? (
          <Card>
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up! No notifications to display."
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  'hover:border-neutral-300 transition-colors cursor-pointer',
                  !notification.read && 'bg-blue-50/30 border-blue-200'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={cn(
                          'font-semibold',
                          !notification.read ? 'text-neutral-900' : 'text-neutral-700'
                        )}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      {notification.priority === 'high' && (
                        <Badge variant="error" className="flex-shrink-0">High Priority</Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {getTimeAgo(notification.time)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
