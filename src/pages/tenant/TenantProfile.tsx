import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Home, Bell, Shield, Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import { toast } from 'sonner';

type Tab = 'personal' | 'lease' | 'preferences' | 'security';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
});

const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  relationship: z.string().min(2, 'Relationship is required'),
  phone: z.string().min(10, 'Invalid phone number'),
});

export default function TenantProfile() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { getProfile, updatePersonalInfo, updateEmergencyContact, updatePreferences, toggleNotification } = useProfileStore();

  const profile = user ? getProfile(user.id) : null;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Personal Info Form
  const personalInfoForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    },
  });

  // Emergency Contact Form
  const emergencyForm = useForm({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: profile?.emergencyContact.name || '',
      relationship: profile?.emergencyContact.relationship || '',
      phone: profile?.emergencyContact.phone || '',
    },
  });

  const handlePersonalInfoSave = (data: z.infer<typeof personalInfoSchema>) => {
    if (!user) return;
    updatePersonalInfo(user.id, data);
    toast.success('Profile Updated', {
      description: 'Your personal information has been saved.',
    });
  };

  const handleEmergencyContactSave = (data: z.infer<typeof emergencyContactSchema>) => {
    if (!user) return;
    updateEmergencyContact(user.id, data);
    toast.success('Emergency Contact Updated', {
      description: 'Your emergency contact has been saved.',
    });
  };

  const handlePreferencesSave = () => {
    toast.success('Preferences Saved', {
      description: 'Your preferences have been updated.',
    });
  };

  const handleNotificationToggle = (type: 'email' | 'sms' | 'push') => {
    if (!user) return;
    toggleNotification(user.id, type);
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
          <form onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSave)} className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">First Name</label>
                    <input
                      {...personalInfoForm.register('firstName')}
                      type="text"
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        personalInfoForm.formState.errors.firstName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'
                      } focus:outline-none focus:ring-2`}
                    />
                    {personalInfoForm.formState.errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">
                        {personalInfoForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Last Name</label>
                    <input
                      {...personalInfoForm.register('lastName')}
                      type="text"
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        personalInfoForm.formState.errors.lastName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'
                      } focus:outline-none focus:ring-2`}
                    />
                    {personalInfoForm.formState.errors.lastName && (
                      <p className="mt-1 text-xs text-red-600">
                        {personalInfoForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      {...personalInfoForm.register('email')}
                      type="email"
                      className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border ${
                        personalInfoForm.formState.errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {personalInfoForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {personalInfoForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      {...personalInfoForm.register('phone')}
                      type="tel"
                      className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border ${
                        personalInfoForm.formState.errors.phone
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {personalInfoForm.formState.errors.phone && (
                    <p className="mt-1 text-xs text-red-600">
                      {personalInfoForm.formState.errors.phone.message}
                    </p>
                  )}
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
                      {...emergencyForm.register('name')}
                      type="text"
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        emergencyForm.formState.errors.name
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'
                      } focus:outline-none focus:ring-2`}
                    />
                    {emergencyForm.formState.errors.name && (
                      <p className="mt-1 text-xs text-red-600">
                        {emergencyForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Relationship</label>
                    <input
                      {...emergencyForm.register('relationship')}
                      type="text"
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        emergencyForm.formState.errors.relationship
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'
                      } focus:outline-none focus:ring-2`}
                    />
                    {emergencyForm.formState.errors.relationship && (
                      <p className="mt-1 text-xs text-red-600">
                        {emergencyForm.formState.errors.relationship.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      {...emergencyForm.register('phone')}
                      type="tel"
                      className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border ${
                        emergencyForm.formState.errors.phone
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {emergencyForm.formState.errors.phone && (
                    <p className="mt-1 text-xs text-red-600">
                      {emergencyForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  personalInfoForm.reset();
                  emergencyForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={async (e) => {
                  e.preventDefault();
                  const personalValid = await personalInfoForm.trigger();
                  const emergencyValid = await emergencyForm.trigger();

                  if (personalValid) {
                    handlePersonalInfoSave(personalInfoForm.getValues());
                  }
                  if (emergencyValid) {
                    handleEmergencyContactSave(emergencyForm.getValues());
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Lease Info Tab */}
        {activeTab === 'lease' && profile && (
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Current Lease</h3>
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-neutral-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {profile.address.property} - Unit {profile.address.unit}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {profile.address.street}, {profile.address.city}, {profile.address.province} {profile.address.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded capitalize">
                      {profile.lease.status}
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
                      {new Date(profile.lease.startDate).toLocaleDateString('en-US', {
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
                      {new Date(profile.lease.endDate).toLocaleDateString('en-US', {
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
                    <p className="text-sm font-semibold text-neutral-900">${profile.lease.monthlyRent.toLocaleString()}</p>
                  </div>
                  <div className="p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-neutral-500" />
                      <p className="text-xs text-neutral-600">Security Deposit</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">${profile.lease.securityDeposit.toLocaleString()}</p>
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
                    Your lease expires in {Math.ceil((new Date(profile.lease.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days.
                    You'll be notified when renewal options are available.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && profile && (
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
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile.preferences.notifications.email}
                      onChange={() => handleNotificationToggle('email')}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">SMS Notifications</p>
                    <p className="text-xs text-neutral-600">Receive updates via text message</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile.preferences.notifications.sms}
                      onChange={() => handleNotificationToggle('sms')}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Push Notifications</p>
                    <p className="text-xs text-neutral-600">Receive updates on your device</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile.preferences.notifications.push}
                      onChange={() => handleNotificationToggle('push')}
                    />
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
                    value={profile.preferences.language}
                    onChange={(e) => {
                      if (user) {
                        updatePreferences(user.id, {
                          language: e.target.value as 'en' | 'fr',
                        });
                      }
                    }}
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Timezone</label>
                  <select
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={profile.preferences.timezone}
                    onChange={(e) => {
                      if (user) {
                        updatePreferences(user.id, {
                          timezone: e.target.value,
                        });
                      }
                    }}
                  >
                    <option value="America/Toronto">Eastern Time (ET)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
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
                  value={profile.preferences.theme}
                  onChange={(e) => {
                    if (user) {
                      updatePreferences(user.id, {
                        theme: e.target.value as 'light' | 'dark' | 'system',
                      });
                    }
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => {
                // Reset would reload from store
                window.location.reload();
              }}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePreferencesSave}>
                Save Preferences
              </Button>
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
