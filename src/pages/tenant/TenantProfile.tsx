import { useState, useEffect } from 'react';
import { User, Home, Bell, Shield, Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';

type Tab = 'personal' | 'lease' | 'preferences' | 'security';

export default function TenantProfile() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock tenant data
  const tenant = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'tenant@okey.com',
    phone: '+1 (514) 555-0123',
    emergencyContact: {
      name: 'John Johnson',
      relationship: 'Father',
      phone: '+1 (514) 555-0456',
    },
    address: {
      unit: '4B',
      property: 'Sunset Apartments',
      street: '123 Main St',
      city: 'Montreal',
      province: 'QC',
      postalCode: 'H3A 1B2',
    },
    lease: {
      startDate: '2025-09-01',
      endDate: '2026-08-31',
      monthlyRent: 1800,
      securityDeposit: 1800,
      status: 'active',
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      language: 'en',
      theme: 'light',
    },
  };

  const tabs = [
    { id: 'personal' as Tab, label: 'Personal Info', icon: User },
    { id: 'lease' as Tab, label: 'Lease Info', icon: Home },
    { id: 'preferences' as Tab, label: 'Preferences', icon: Bell },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
  ];

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">My Profile</h1>
          <p className="text-sm text-neutral-600">Manage your account information and preferences</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-neutral-200">
          <div className="flex gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">First Name</label>
                    <input
                      type="text"
                      value={tenant.firstName}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={tenant.lastName}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={tenant.email}
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      value={tenant.phone}
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={tenant.emergencyContact.name}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={tenant.emergencyContact.relationship}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      value={tenant.emergencyContact.phone}
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        )}

        {/* Lease Info Tab */}
        {activeTab === 'lease' && (
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Current Lease</h3>
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-neutral-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {tenant.address.property} - Unit {tenant.address.unit}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {tenant.address.street}, {tenant.address.city}, {tenant.address.province} {tenant.address.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded capitalize">
                      {tenant.lease.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <p className="text-xs text-neutral-600">Lease Start</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {new Date(tenant.lease.startDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <p className="text-xs text-neutral-600">Lease End</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {new Date(tenant.lease.endDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-neutral-500" />
                      <p className="text-xs text-neutral-600">Monthly Rent</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">${tenant.lease.monthlyRent}</p>
                  </div>
                  <div className="p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-neutral-500" />
                      <p className="text-xs text-neutral-600">Security Deposit</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">${tenant.lease.securityDeposit}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-900 mb-1">Lease Renewal</h4>
                  <p className="text-xs text-amber-800">
                    Your lease expires in {Math.ceil((new Date(tenant.lease.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days.
                    You'll be notified when renewal options are available.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Notification Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Email Notifications</p>
                    <p className="text-xs text-neutral-600">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={tenant.preferences.notifications.email} />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">SMS Notifications</p>
                    <p className="text-xs text-neutral-600">Receive updates via text message</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={tenant.preferences.notifications.sms} />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Push Notifications</p>
                    <p className="text-xs text-neutral-600">Receive updates on your device</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={tenant.preferences.notifications.push} />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Language & Region</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Language</label>
                  <select
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    defaultValue={tenant.preferences.language}
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Timezone</label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Eastern Time (ET)</option>
                    <option>Pacific Time (PT)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Appearance</h3>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Theme</label>
                <select
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  defaultValue={tenant.preferences.theme}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Save Preferences</Button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="primary">Update Password</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Two-Factor Authentication</h3>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-900 mb-1">Secure your account</p>
                  <p className="text-xs text-neutral-600">
                    Add an extra layer of security by requiring a code in addition to your password.
                  </p>
                </div>
                <Button variant="secondary" size="sm">Enable 2FA</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Current Session</p>
                    <p className="text-xs text-neutral-600">macOS · Chrome · Montreal, QC</p>
                    <p className="text-xs text-neutral-500 mt-1">Last active: Just now</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Active</span>
                </div>
                <div className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">iPhone</p>
                    <p className="text-xs text-neutral-600">iOS · Safari · Montreal, QC</p>
                    <p className="text-xs text-neutral-500 mt-1">Last active: 2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm">Revoke</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
