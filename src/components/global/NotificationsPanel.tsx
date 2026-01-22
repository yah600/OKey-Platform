import { useState, useEffect } from 'react';
import { X, Bell, DollarSign, Wrench, MessageSquare, FileText, AlertTriangle, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type NotificationType = 'payment' | 'maintenance' | 'message' | 'document' | 'alert' | 'lease';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock notifications - in real app would come from backend
    const mockNotifications: Notification[] = [
      {
        id: 'n1',
        type: 'payment',
        title: 'Payment Received',
        description: 'Rent payment of $2,500 received from Unit 204',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
        link: '/finances',
      },
      {
        id: 'n2',
        type: 'maintenance',
        title: 'New Maintenance Request',
        description: 'Unit 101 reported a leaking faucet',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        link: '/maintenance',
      },
      {
        id: 'n3',
        type: 'message',
        title: 'New Message',
        description: 'John Smith sent you a message',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        link: '/messages',
      },
      {
        id: 'n4',
        type: 'document',
        title: 'Document Shared',
        description: 'Lease agreement signed by tenant',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        link: '/documents',
      },
      {
        id: 'n5',
        type: 'lease',
        title: 'Lease Expiring Soon',
        description: 'Unit 305 lease expires in 45 days',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        link: '/residents',
      },
    ];
    setNotifications(mockNotifications);
  }, [user]);

  const getIcon = (type: NotificationType) => {
    const iconMap = {
      payment: <DollarSign className="w-5 h-5 text-green-600" />,
      maintenance: <Wrench className="w-5 h-5 text-orange-600" />,
      message: <MessageSquare className="w-5 h-5 text-blue-600" />,
      document: <FileText className="w-5 h-5 text-purple-600" />,
      alert: <AlertTriangle className="w-5 h-5 text-red-600" />,
      lease: <FileText className="w-5 h-5 text-blue-600" />,
    };
    return iconMap[type];
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return then.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'archived') return false; // No archived for now
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));
    // Navigate if link exists
    if (notification.link) {
      window.location.href = notification.link;
    }
    onClose();
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {(['all', 'unread', 'archived'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <div className="p-2 border-b">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">You're all caught up!</h3>
              <p className="text-gray-600">No new notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map(notification => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
}
