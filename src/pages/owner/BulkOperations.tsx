import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bell, FileText, Wrench } from 'lucide-react';
import Textarea from '@/components/atoms/Textarea';
import { toast } from 'sonner';

export function BulkOperations() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'rent' | 'notices' | 'renewals'>('rent');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    toast.success(`${activeTab === 'rent' ? 'Rent reminders' : activeTab === 'notices' ? 'Notices' : 'Renewal offers'} sent successfully`);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/owner/residents')} className="p-2 hover:bg-neutral-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Bulk Operations</h1>
                <p className="text-sm text-neutral-600">Send bulk messages and manage tenants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="flex border-b border-neutral-200">
              <button
                onClick={() => setActiveTab('rent')}
                className={`flex-1 px-6 py-4 font-medium ${activeTab === 'rent' ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600' : 'text-neutral-600 hover:bg-neutral-50'}`}
              >
                <Bell className="w-4 h-4 inline mr-2" />
                Rent Reminders
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                className={`flex-1 px-6 py-4 font-medium ${activeTab === 'notices' ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600' : 'text-neutral-600 hover:bg-neutral-50'}`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Bulk Notices
              </button>
              <button
                onClick={() => setActiveTab('renewals')}
                className={`flex-1 px-6 py-4 font-medium ${activeTab === 'renewals' ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600' : 'text-neutral-600 hover:bg-neutral-50'}`}
              >
                <Wrench className="w-4 h-4 inline mr-2" />
                Lease Renewals
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {activeTab === 'rent' && 'Rent Reminder Message'}
                  {activeTab === 'notices' && 'Notice Message'}
                  {activeTab === 'renewals' && 'Renewal Offer Message'}
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={6}
                />
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-900 mb-2">Recipients</div>
                <div className="text-sm text-neutral-600">
                  {activeTab === 'rent' && 'All tenants with outstanding balance'}
                  {activeTab === 'notices' && 'All active tenants'}
                  {activeTab === 'renewals' && 'Tenants with leases expiring in 60 days'}
                </div>
                <div className="text-xs text-neutral-500 mt-1">Estimated: 12 recipients</div>
              </div>

              <button
                onClick={handleSend}
                disabled={!message}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send to All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkOperations;
