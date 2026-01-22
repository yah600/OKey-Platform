import { useState } from 'react';
import { X, Bell, DollarSign, Wrench, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const notifications = [
    {
      id: 1,
      type: 'payment',
      icon: DollarSign,
      title: 'Payment Received',
      message: 'Rent payment of $2,500 from Unit 4B',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'maintenance',
      icon: Wrench,
      title: 'Maintenance Request',
      message: 'New request for kitchen sink repair in Unit 5A',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'document',
      icon: FileText,
      title: 'Document Signed',
      message: 'Lease renewal signed by Sarah Johnson',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 4,
      type: 'success',
      icon: CheckCircle,
      title: 'Maintenance Completed',
      message: 'Roof repair has been completed',
      time: '1 day ago',
      read: true,
    },
    {
      id: 5,
      type: 'reminder',
      icon: Clock,
      title: 'Upcoming Meeting',
      message: 'Board meeting scheduled for tomorrow at 6:00 PM',
      time: '2 days ago',
      read: true,
    },
    {
      id: 6,
      type: 'alert',
      icon: AlertCircle,
      title: 'Lease Expiring Soon',
      message: 'Unit 3C lease expires in 30 days',
      time: '3 days ago',
      read: true,
    },
  ];

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter((n) => !n.read) 
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIconColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'text-green-600 bg-green-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      case 'document':
        return 'text-purple-600 bg-purple-100';
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'reminder':
        return 'text-amber-600 bg-amber-100';
      case 'alert':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  const markAllAsRead = () => {
    alert('All notifications marked as read');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-neutral-900" />
              <h2 className="text-lg font-semibold text-neutral-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-primary-600 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={"px-3 py-1.5 text-sm rounded-lg transition-colors " + (
                filter === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={"px-3 py-1.5 text-sm rounded-lg transition-colors " + (
                filter === 'unread'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <button
                    key={notification.id}
                    className={"w-full px-6 py-4 hover:bg-neutral-50 transition-colors text-left " + (
                      !notification.read ? 'bg-blue-50/50' : ''
                    )}
                  >
                    <div className="flex gap-3">
                      <div className={"w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 " + getIconColor(notification.type)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={"text-sm " + (!notification.read ? 'font-semibold' : 'font-medium') + " text-neutral-900"}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">{notification.message}</p>
                        <p className="text-xs text-neutral-500">{notification.time}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <Bell className="w-16 h-16 text-neutral-300 mb-4" />
              <p className="text-sm font-medium text-neutral-900 mb-1">No notifications</p>
              <p className="text-sm text-neutral-500 text-center">
                {filter === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="px-6 py-4 border-t border-neutral-200">
            <Button variant="secondary" onClick={markAllAsRead} className="w-full">
              Mark All as Read
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
