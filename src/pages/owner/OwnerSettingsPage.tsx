import { useState } from 'react';
import { User, Bell, CreditCard, Shield, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function OwnerSettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'notifications' | 'billing' | 'security'>('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="p-6">
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">First Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name.split(' ')[0]}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name.split(' ')[1]}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(514) 555-0123"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="pt-4">
                  <Button variant="primary">Save Changes</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Language</label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>English</option>
                    <option>French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Time Zone</label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Date Format</label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Currency</label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>CAD ($)</option>
                    <option>USD ($)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Button variant="primary">Save Preferences</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Payment Notifications</p>
                    <p className="text-xs text-neutral-600">Get notified when payments are received</p>
                  </div>
                  <input type="checkbox" defaultChecked className="mt-1" />
                </div>

                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Maintenance Requests</p>
                    <p className="text-xs text-neutral-600">Alerts for new maintenance requests</p>
                  </div>
                  <input type="checkbox" defaultChecked className="mt-1" />
                </div>

                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Lease Renewals</p>
                    <p className="text-xs text-neutral-600">Reminders for upcoming lease renewals</p>
                  </div>
                  <input type="checkbox" defaultChecked className="mt-1" />
                </div>

                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">New Applications</p>
                    <p className="text-xs text-neutral-600">Notifications for new rental applications</p>
                  </div>
                  <input type="checkbox" defaultChecked className="mt-1" />
                </div>

                <div className="flex items-start justify-between py-3 border-b border-neutral-100">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Marketing Updates</p>
                    <p className="text-xs text-neutral-600">News and updates about O'Key Platform</p>
                  </div>
                  <input type="checkbox" className="mt-1" />
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
