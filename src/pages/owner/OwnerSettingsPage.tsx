import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Bell, CreditCard, Shield, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOwnerSettingsStore } from '../../store/ownerSettingsStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { toast } from 'sonner';

const accountSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  companyName: z.string().optional(),
});

const preferencesSchema = z.object({
  language: z.enum(['en', 'fr']),
  timezone: z.string(),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),
  currency: z.enum(['CAD', 'USD']),
});

type AccountFormData = z.infer<typeof accountSchema>;
type PreferencesFormData = z.infer<typeof preferencesSchema>;

export default function OwnerSettingsPage() {
  const { user } = useAuthStore();
  const { getSettings, updateAccount, updatePreferences, toggleNotification } = useOwnerSettingsStore();
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'notifications' | 'billing' | 'security'>('account');
  const [isLoading, setIsLoading] = useState(true);

  const settings = user ? getSettings(user.id) : undefined;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const accountForm = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    values: {
      firstName: settings?.account.firstName || '',
      lastName: settings?.account.lastName || '',
      email: settings?.account.email || '',
      phone: settings?.account.phone || '',
      companyName: settings?.account.companyName || '',
    },
  });

  const preferencesForm = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    values: {
      language: settings?.preferences.language || 'en',
      timezone: settings?.preferences.timezone || 'America/Toronto',
      dateFormat: settings?.preferences.dateFormat || 'MM/DD/YYYY',
      currency: settings?.preferences.currency || 'CAD',
    },
  });

  const handleAccountSave = (data: AccountFormData) => {
    if (!user) return;
    updateAccount(user.id, data);
    toast.success('Account Updated', {
      description: 'Your account information has been saved.',
    });
  };

  const handlePreferencesSave = (data: PreferencesFormData) => {
    if (!user) return;
    updatePreferences(user.id, data);
    toast.success('Preferences Updated', {
      description: 'Your preferences have been saved.',
    });
  };

  const handleToggleNotification = (key: keyof typeof settings.notifications) => {
    if (!user || !settings) return;
    toggleNotification(user.id, key);
    toast.success('Notification Setting Updated', {
      description: 'Your notification preferences have been updated.',
    });
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Settings</h1>
        <p className="text-sm text-neutral-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <Card padding="sm">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Account Information</h2>
              <form onSubmit={accountForm.handleSubmit(handleAccountSave)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...accountForm.register('firstName')}
                      type="text"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {accountForm.formState.errors.firstName && (
                      <p className="text-xs text-red-600 mt-1">
                        {accountForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...accountForm.register('lastName')}
                      type="text"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {accountForm.formState.errors.lastName && (
                      <p className="text-xs text-red-600 mt-1">
                        {accountForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-600 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...accountForm.register('email')}
                    type="email"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {accountForm.formState.errors.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {accountForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-neutral-600 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...accountForm.register('phone')}
                    type="tel"
                    placeholder="(514) 555-0123"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {accountForm.formState.errors.phone && (
                    <p className="text-xs text-red-600 mt-1">
                      {accountForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Company Name</label>
                  <input
                    {...accountForm.register('companyName')}
                    type="text"
                    placeholder="Optional"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Preferences</h2>
              <form onSubmit={preferencesForm.handleSubmit(handlePreferencesSave)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Language</label>
                  <select
                    {...preferencesForm.register('language')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Time Zone</label>
                  <select
                    {...preferencesForm.register('timezone')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="America/Toronto">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Date Format</label>
                  <select
                    {...preferencesForm.register('dateFormat')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Currency</label>
                  <select
                    {...preferencesForm.register('currency')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="CAD">CAD ($)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && settings && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Payment Notifications</p>
                    <p className="text-xs text-neutral-600">Get notified when payments are received</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.paymentNotifications}
                    onChange={() => handleToggleNotification('paymentNotifications')}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Maintenance Requests</p>
                    <p className="text-xs text-neutral-600">Alerts for new maintenance requests</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.maintenanceRequests}
                    onChange={() => handleToggleNotification('maintenanceRequests')}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Lease Renewals</p>
                    <p className="text-xs text-neutral-600">Reminders for upcoming lease renewals</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.leaseRenewals}
                    onChange={() => handleToggleNotification('leaseRenewals')}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">New Applications</p>
                    <p className="text-xs text-neutral-600">Notifications for new rental applications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newApplications}
                    onChange={() => handleToggleNotification('newApplications')}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Emergency Alerts</p>
                    <p className="text-xs text-neutral-600">Critical alerts for emergency situations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emergencyAlerts}
                    onChange={() => handleToggleNotification('emergencyAlerts')}
                    className="mt-1"
                  />
                </div>

                <div className="pt-4">
                  <Button variant="primary">Save Settings</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Billing & Subscription</h2>
              <div className="space-y-6">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Professional Plan</p>
                      <p className="text-xs text-neutral-600">Up to 50 units</p>
                    </div>
                    <span className="text-lg font-semibold text-neutral-900">$99/mo</span>
                  </div>
                  <p className="text-xs text-neutral-600">Next billing date: Feb 1, 2026</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Payment Method</h3>
                  <div className="p-3 border border-neutral-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-neutral-900 rounded flex items-center justify-center text-white text-xs font-semibold">
                        VISA
                      </div>
                      <div>
                        <p className="text-sm text-neutral-900">•••• •••• •••• 4242</p>
                        <p className="text-xs text-neutral-600">Expires 12/2027</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Update
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Billing History</h3>
                  <div className="space-y-2">
                    {[
                      { date: '2026-01-01', amount: '$99.00', status: 'Paid' },
                      { date: '2025-12-01', amount: '$99.00', status: 'Paid' },
                      { date: '2025-11-01', amount: '$99.00', status: 'Paid' },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-100">
                        <div>
                          <p className="text-sm text-neutral-900">{invoice.date}</p>
                          <p className="text-xs text-neutral-600">{invoice.amount}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                            {invoice.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <Button variant="primary">Update Password</Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Two-Factor Authentication</p>
                      <p className="text-xs text-neutral-600">Add an extra layer of security</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Active Sessions</h3>
                  <div className="space-y-2">
                    {[
                      { device: 'MacBook Pro', location: 'Montreal, QC', date: 'Active now' },
                      { device: 'iPhone 14', location: 'Montreal, QC', date: '2 hours ago' },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm text-neutral-900">{session.device}</p>
                          <p className="text-xs text-neutral-600">{session.location} • {session.date}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Revoke
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
