import { useState, useEffect } from 'react';
import { DollarSign, Wrench, FileText, Mail, Calendar, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePaymentsStore } from '../../store/paymentsStore';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import { useMessagesStore } from '../../store/messagesStore';
import { useDocumentsStore } from '../../store/documentsStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

export default function TenantDashboard() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const { getUpcomingPayment, getPaymentHistory } = usePaymentsStore();
  const { getRequestsByUser, getActiveRequestsCount } = useMaintenanceStore();
  const { getUnreadCount } = useMessagesStore();
  const { getDocumentsByUser } = useDocumentsStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Get real data from stores
  const upcomingPayment = user ? getUpcomingPayment(user.id) : undefined;
  const paymentHistory = user ? getPaymentHistory(user.id) : [];
  const maintenanceRequests = user ? getRequestsByUser(user.id) : [];
  const activeMaintenanceCount = user ? getActiveRequestsCount(user.id) : 0;
  const unreadMessages = user ? getUnreadCount(user.id) : 0;
  const documents = user ? getDocumentsByUser(user.id) : [];

  const pendingRequests = maintenanceRequests.filter((r) => r.status === 'pending').length;

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Welcome back, {user?.name}</h1>
        <p className="text-sm text-neutral-600">Here's what's happening with your rental</p>
      </div>

      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Sunset Apartments</h3>
              <p className="text-sm text-neutral-600">Unit 4B • Montreal, QC</p>
              <p className="text-xs text-neutral-500 mt-1">Lease expires: Dec 31, 2026</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">View Details</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-600">Next Payment Due</p>
              <p className="text-lg font-semibold text-neutral-900">
                ${upcomingPayment?.amount.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-neutral-500">
                {upcomingPayment
                  ? `Due ${new Date(upcomingPayment.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}`
                  : 'No upcoming payments'}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-600">Maintenance Requests</p>
              <p className="text-lg font-semibold text-neutral-900">
                {activeMaintenanceCount} Active
              </p>
              <p className="text-xs text-neutral-500">
                {pendingRequests > 0
                  ? `${pendingRequests} pending review`
                  : 'All up to date'}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-600">Messages</p>
              <p className="text-lg font-semibold text-neutral-900">
                {unreadMessages} Unread
              </p>
              <p className="text-xs text-neutral-500">
                {unreadMessages > 0 ? 'New messages' : 'No new messages'}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-600">Documents</p>
              <p className="text-lg font-semibold text-neutral-900">{documents.length}</p>
              <p className="text-xs text-neutral-500">Total documents</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Link to="/tenant/payments">
            <Button variant="secondary" size="sm" className="justify-start w-full">
              <DollarSign className="w-4 h-4" />
              Pay Rent
            </Button>
          </Link>
          <Link to="/tenant/maintenance">
            <Button variant="secondary" size="sm" className="justify-start w-full">
              <Wrench className="w-4 h-4" />
              Request Repair
            </Button>
          </Link>
          <Link to="/tenant/documents">
            <Button variant="secondary" size="sm" className="justify-start w-full">
              <FileText className="w-4 h-4" />
              Documents
            </Button>
          </Link>
          <Link to="/tenant/messages">
            <Button variant="secondary" size="sm" className="justify-start w-full">
              <Mail className="w-4 h-4" />
              Messages
            </Button>
          </Link>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {(() => {
            // Combine recent activities from all stores
            const activities: Array<{
              icon: typeof DollarSign;
              title: string;
              desc: string;
              date: string;
              timestamp: number;
            }> = [];

            // Recent payments
            paymentHistory.slice(0, 2).forEach((payment) => {
              activities.push({
                icon: DollarSign,
                title: 'Payment Received',
                desc: `${payment.month} - $${payment.amount.toLocaleString()}`,
                date: new Date(payment.paidDate || payment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                }),
                timestamp: new Date(payment.paidDate || payment.createdAt).getTime(),
              });
            });

            // Recent maintenance requests
            maintenanceRequests
              .filter((r) => r.status === 'completed')
              .slice(0, 2)
              .forEach((request) => {
                activities.push({
                  icon: Wrench,
                  title: 'Maintenance Completed',
                  desc: request.title,
                  date: new Date(request.completedDate || request.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  }),
                  timestamp: new Date(request.completedDate || request.updatedAt).getTime(),
                });
              });

            // Recent documents
            documents.slice(0, 2).forEach((doc) => {
              activities.push({
                icon: FileText,
                title: 'Document Uploaded',
                desc: doc.name,
                date: new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                }),
                timestamp: new Date(doc.uploadedAt).getTime(),
              });
            });

            // Sort by timestamp and take top 5
            const sortedActivities = activities
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 5);

            if (sortedActivities.length === 0) {
              return (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600">No recent activity</p>
                  <p className="text-xs text-neutral-500 mt-1">Activity will appear here as you use the platform</p>
                </div>
              );
            }

            return sortedActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-neutral-100 last:border-0">
                <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                  <p className="text-xs text-neutral-600">{activity.desc}</p>
                </div>
                <span className="text-xs text-neutral-500">{activity.date}</span>
              </div>
            ));
          })()}
        </div>
      </Card>
    </div>
  );
}
