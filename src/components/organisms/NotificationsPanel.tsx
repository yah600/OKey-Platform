import { useState, useMemo } from 'react';
import {
  Bell,
  Check,
  DollarSign,
  FileText,
  Home,
  Mail,
  TrendingUp,
  Wrench,
  X,
  CheckCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Drawer from './Drawer';

export interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'payment' | 'maintenance' | 'document' | 'message' | 'bid' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Rent Payment Due',
    message: 'Your rent payment of $1,800 is due in 3 days',
    timestamp: '2026-01-22T10:30:00',
    read: false,
    actionUrl: '/tenant/payments',
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Maintenance Request Updated',
    message: 'Your maintenance request #1234 has been assigned to a technician',
    timestamp: '2026-01-22T09:15:00',
    read: false,
    actionUrl: '/tenant/maintenance',
  },
  {
    id: '3',
    type: 'document',
    title: 'New Document Available',
    message: 'Your lease renewal document is ready for review',
    timestamp: '2026-01-21T16:45:00',
    read: true,
    actionUrl: '/tenant/documents',
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message from Property Manager',
    message: 'You have a new message regarding building maintenance',
    timestamp: '2026-01-21T14:20:00',
    read: true,
    actionUrl: '/tenant/messages',
  },
  {
    id: '5',
    type: 'bid',
    title: 'Bid Status Update',
    message: 'Your bid for Unit 4B at Sunset Apartments is being reviewed',
    timestamp: '2026-01-20T11:00:00',
    read: true,
    actionUrl: '/marketplace/my-bids',
  },
  {
    id: '6',
    type: 'general',
    title: 'Welcome to O\'Key Platform',
    message: 'Thank you for joining O\'Key Platform. Explore your dashboard to get started.',
    timestamp: '2026-01-19T08:00:00',
    read: true,
  },
];

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      payment: <DollarSign className="w-5 h-5" />,
      maintenance: <Wrench className="w-5 h-5" />,
      document: <FileText className="w-5 h-5" />,
      message: <Mail className="w-5 h-5" />,
      bid: <TrendingUp className="w-5 h-5" />,
      general: <Bell className="w-5 h-5" />,
    };
    return icons[type];
  };

  const getNotificationColor = (type: Notification['type']) => {
    const colors = {
      payment: 'bg-green-100 text-green-600',
      maintenance: 'bg-amber-100 text-amber-600',
      document: 'bg-blue-100 text-blue-600',
      message: 'bg-purple-100 text-purple-600',
      bid: 'bg-primary-100 text-primary-600',
      general: 'bg-neutral-100 text-neutral-600',
    };
    return colors[type];
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="md"
      title="Notifications"
      showCloseButton
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-neutral-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative',
                activeTab === 'all'
                  ? 'text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              All
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative flex items-center gap-1.5',
                activeTab === 'unread'
                  ? 'text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              Unread
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-semibold bg-primary-600 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
              {activeTab === 'unread' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"></div>
              )}
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-600 mb-1">No notifications</p>
            <p className="text-xs text-neutral-500">
              {activeTab === 'unread'
                ? 'You\'re all caught up!'
                : 'You don\'t have any notifications yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'relative p-4 rounded-lg border transition-colors group',
                  notification.read
                    ? 'bg-white border-neutral-200'
                    : 'bg-primary-50/30 border-primary-200'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                      getNotificationColor(notification.type)
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-neutral-900">
                        {notification.title}
                      </p>
                      <span className="text-xs text-neutral-500 flex-shrink-0">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Mark as read
                        </button>
                      )}
                      {notification.actionUrl && (
                        <button
                          onClick={() => {
                            markAsRead(notification.id);
                            onClose();
                            // Navigate to actionUrl
                          }}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View →
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-100 rounded"
                    aria-label="Delete notification"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}
