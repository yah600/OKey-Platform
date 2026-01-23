import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Zap, Droplet, Flame, Wifi, Trash2, Wind } from 'lucide-react';
import { useOwnerPropertiesStore } from '@/store/ownerPropertiesStore';
import { useUtilityStore } from '@/store/utilityStore';
import { UtilityType } from '@/types/utility';
import Input from '@/components/atoms/Input';
import Select from '@/components/molecules/Select';
import { toast } from 'sonner';

const utilityIcons: Record<UtilityType, any> = {
  electric: Zap,
  gas: Flame,
  water: Droplet,
  sewer: Wind,
  trash: Trash2,
  internet: Wifi,
};

const utilityLabels: Record<UtilityType, string> = {
  electric: 'Electric',
  gas: 'Gas',
  water: 'Water',
  sewer: 'Sewer',
  trash: 'Trash',
  internet: 'Internet/Cable',
};

export function UtilityManagement() {
  const navigate = useNavigate();
  const { properties } = useOwnerPropertiesStore();
  const { accounts, addAccount, deleteAccount, getAccountsByProperty } = useUtilityStore();

  const [selectedProperty, setSelectedProperty] = useState(properties[0]?.id || '');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    utilityType: 'electric' as UtilityType,
    provider: '',
    accountNumber: '',
    contactPhone: '',
    billingType: 'landlord' as const,
    monthlyEstimate: 0,
  });

  const propertyAccounts = getAccountsByProperty(selectedProperty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount({
      propertyId: selectedProperty,
      ...formData,
      active: true,
    });
    toast.success('Utility account added');
    setFormData({
      utilityType: 'electric',
      provider: '',
      accountNumber: '',
      contactPhone: '',
      billingType: 'landlord',
      monthlyEstimate: 0,
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/owner/properties')} className="p-2 hover:bg-neutral-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Utility Management</h1>
                <p className="text-sm text-neutral-600">Track utility accounts and meter readings</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Utility
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Property Selector */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Property</label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
            >
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>{prop.buildingName}</option>
              ))}
            </select>
          </div>

          {/* Add Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-neutral-900">Add Utility Account</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Utility Type</label>
                  <select
                    value={formData.utilityType}
                    onChange={(e) => setFormData({ ...formData, utilityType: e.target.value as UtilityType })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                  >
                    {Object.entries(utilityLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Provider</label>
                  <Input
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="Hydro-Québec"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Account Number</label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="123456789"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Contact Phone</label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="1-800-xxx-xxxx"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Add Account
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Accounts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {propertyAccounts.map((account) => {
              const Icon = utilityIcons[account.utilityType];
              return (
                <div key={account.id} className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900">{utilityLabels[account.utilityType]}</h4>
                        <p className="text-sm text-neutral-600">{account.provider}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Delete this utility account?')) {
                          deleteAccount(account.id);
                          toast.success('Account deleted');
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Account:</span>
                      <span className="font-medium">{account.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Contact:</span>
                      <span className="font-medium">{account.contactPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Billing:</span>
                      <span className="font-medium capitalize">{account.billingType}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UtilityManagement;
