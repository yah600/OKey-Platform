import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, User, Building, Bell, CreditCard, Shield, Save, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type SettingsTab = 'account' | 'property' | 'notifications' | 'billing' | 'security';

interface Settings {
  // Account
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  tax_id: string;

  // Property Management
  late_fee_percentage: string;
  grace_period_days: string;
  default_lease_term: string;
  auto_renewal_enabled: boolean;
  security_deposit_amount: string;
  auto_assign_maintenance: boolean;
  default_maintenance_team: string;
  emergency_contact: string;

  // Notifications
  email_rent_payment: boolean;
  email_maintenance: boolean;
  email_lease_expiration: boolean;
  email_applications: boolean;
  email_system: boolean;
  sms_rent_payment: boolean;
  sms_maintenance: boolean;
  sms_lease_expiration: boolean;
  sms_applications: boolean;
  sms_system: boolean;
  notification_frequency: string;
}

export function OwnerSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [settings, setSettings] = useState<Settings>({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company_name: '',
    tax_id: '',
    late_fee_percentage: '5',
    grace_period_days: '5',
    default_lease_term: '1year',
    auto_renewal_enabled: false,
    security_deposit_amount: '1month',
    auto_assign_maintenance: false,
    default_maintenance_team: '',
    emergency_contact: '',
    email_rent_payment: true,
    email_maintenance: true,
    email_lease_expiration: true,
    email_applications: true,
    email_system: false,
    sms_rent_payment: false,
    sms_maintenance: true,
    sms_lease_expiration: false,
    sms_applications: false,
    sms_system: false,
    notification_frequency: 'instant',
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    if (user) {
      const savedSettings = localStorage.getItem(`ownerSettings_${user.id}`);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      }
    }
  }, [user]);

  const handleSaveSettings = () => {
    if (user) {
      localStorage.setItem(`ownerSettings_${user.id}`, JSON.stringify(settings));
      alert('Settings saved successfully!');
    }
  };

  const handlePasswordChange = () => {
    if (!passwordForm.current_password) {
      alert('Please enter your current password');
      return;
    }
    if (passwordForm.new_password.length < 8) {
      alert('New password must be at least 8 characters');
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('Passwords do not match');
      return;
    }
    alert('Password updated successfully!');
    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(passwordForm.new_password));
  }, [passwordForm.new_password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Settings</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow">
              <nav className="p-2">
                {[
                  { id: 'account', label: 'Account Settings', icon: User },
                  { id: 'property', label: 'Property Management', icon: Building },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
                  { id: 'security', label: 'Security', icon: Shield },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={settings.full_name}
                        onChange={(e) => setSettings({ ...settings, full_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
                      <input
                        type="text"
                        value={settings.company_name}
                        onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID / EIN (Optional)</label>
                      <input
                        type="text"
                        value={settings.tax_id}
                        onChange={(e) => setSettings({ ...settings, tax_id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="XX-XXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Property Management Preferences */}
              {activeTab === 'property' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Management Preferences</h2>

                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Default Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Percentage</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={settings.late_fee_percentage}
                              onChange={(e) => setSettings({ ...settings, late_fee_percentage: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0"
                              max="100"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (Days)</label>
                          <input
                            type="number"
                            value={settings.grace_period_days}
                            onChange={(e) => setSettings({ ...settings, grace_period_days: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Lease Term</label>
                        <select
                          value={settings.default_lease_term}
                          onChange={(e) => setSettings({ ...settings, default_lease_term: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="6months">6 Months</option>
                          <option value="1year">1 Year</option>
                          <option value="2years">2 Years</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.auto_renewal_enabled}
                            onChange={(e) => setSettings({ ...settings, auto_renewal_enabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700">Enable auto-renewal by default</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit Amount</label>
                        <select
                          value={settings.security_deposit_amount}
                          onChange={(e) => setSettings({ ...settings, security_deposit_amount: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="1month">1 Month Rent</option>
                          <option value="1.5months">1.5 Months Rent</option>
                          <option value="2months">2 Months Rent</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.auto_assign_maintenance}
                            onChange={(e) => setSettings({ ...settings, auto_assign_maintenance: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700">Auto-assign maintenance requests</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Maintenance Team</label>
                        <select
                          value={settings.default_maintenance_team}
                          onChange={(e) => setSettings({ ...settings, default_maintenance_team: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select team...</option>
                          <option value="internal">Internal Team</option>
                          <option value="abc_plumbing">ABC Plumbing</option>
                          <option value="xyz_electric">XYZ Electric</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
                        <input
                          type="tel"
                          value={settings.emergency_contact}
                          onChange={(e) => setSettings({ ...settings, emergency_contact: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="For emergency maintenance"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Preferences */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'email_rent_payment', label: 'Rent payments received' },
                          { key: 'email_maintenance', label: 'Maintenance requests submitted' },
                          { key: 'email_lease_expiration', label: 'Lease expirations (60 days before)' },
                          { key: 'email_applications', label: 'Tenant applications' },
                          { key: 'email_system', label: 'System updates' },
                        ].map((notif) => (
                          <label key={notif.key} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[notif.key as keyof Settings] as boolean}
                              onChange={(e) => setSettings({ ...settings, [notif.key]: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{notif.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'sms_rent_payment', label: 'Rent payments received' },
                          { key: 'sms_maintenance', label: 'Maintenance requests submitted' },
                          { key: 'sms_lease_expiration', label: 'Lease expirations (60 days before)' },
                          { key: 'sms_applications', label: 'Tenant applications' },
                          { key: 'sms_system', label: 'System updates' },
                        ].map((notif) => (
                          <label key={notif.key} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[notif.key as keyof Settings] as boolean}
                              onChange={(e) => setSettings({ ...settings, [notif.key]: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{notif.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Frequency</h3>
                      <div className="space-y-2">
                        {[
                          { value: 'instant', label: 'Instant (as they happen)' },
                          { value: 'daily', label: 'Daily Digest' },
                          { value: 'weekly', label: 'Weekly Summary' },
                        ].map((freq) => (
                          <label key={freq.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="notification_frequency"
                              value={freq.value}
                              checked={settings.notification_frequency === freq.value}
                              onChange={(e) => setSettings({ ...settings, notification_frequency: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{freq.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Billing & Subscription */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Professional Plan</h3>
                          <p className="text-3xl font-bold text-blue-600 mt-2">$99<span className="text-lg text-gray-600">/month</span></p>
                        </div>
                        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">Current Plan</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-700">✓ Up to 10 properties</p>
                        <p className="text-sm text-gray-700">✓ Unlimited units</p>
                        <p className="text-sm text-gray-700">✓ Advanced analytics</p>
                        <p className="text-sm text-gray-700">✓ Priority support</p>
                        <p className="text-sm text-gray-700">✓ Custom branding</p>
                      </div>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Upgrade Plan (Coming Soon)
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                      <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CreditCard className="w-8 h-8 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/2027</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          Update
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {[
                              { date: '2026-01-01', desc: 'Professional Plan - January', amount: '$99.00' },
                              { date: '2025-12-01', desc: 'Professional Plan - December', amount: '$99.00' },
                              { date: '2025-11-01', desc: 'Professional Plan - November', amount: '$99.00' },
                              { date: '2025-10-01', desc: 'Professional Plan - October', amount: '$99.00' },
                              { date: '2025-09-01', desc: 'Professional Plan - September', amount: '$99.00' },
                            ].map((invoice, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 text-sm text-gray-900">{invoice.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{invoice.desc}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.amount}</td>
                                <td className="px-6 py-4 text-sm">
                                  <button className="text-blue-600 hover:text-blue-700">Download</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            value={passwordForm.current_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            value={passwordForm.new_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {passwordForm.new_password && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${getPasswordStrengthColor()}`}
                                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-600">{getPasswordStrengthLabel()}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordForm.confirm_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <button
                          onClick={handlePasswordChange}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="border-t pt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Status: <span className="text-red-600">Disabled</span></p>
                          <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" title="Coming soon">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    <div className="border-t pt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        {[
                          { device: 'MacBook Pro', location: 'San Francisco, CA', time: 'Current session' },
                          { device: 'iPhone 14', location: 'San Francisco, CA', time: '2 hours ago' },
                        ].map((session, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{session.device}</p>
                              <p className="text-sm text-gray-600">{session.location} • {session.time}</p>
                            </div>
                            {idx !== 0 && (
                              <button className="text-sm text-red-600 hover:text-red-700">Sign Out</button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button className="mt-4 text-sm text-blue-600 hover:text-blue-700">
                        Sign Out All Other Sessions
                      </button>
                    </div>

                    <div className="border-t pt-8">
                      <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Danger Zone
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                          <div>
                            <p className="font-medium text-gray-900">Deactivate Account</p>
                            <p className="text-sm text-gray-600">Temporarily disable your account</p>
                          </div>
                          <button
                            onClick={() => setShowDeactivateModal(true)}
                            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"
                          >
                            Deactivate
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                          <div>
                            <p className="font-medium text-gray-900">Delete Account</p>
                            <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                          </div>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Deactivate Account?</h3>
            <p className="text-gray-600 mb-6">
              Your account will be temporarily disabled. You can reactivate it by logging in again.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
