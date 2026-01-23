import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserCheck, Package } from 'lucide-react';
import Input from '@/components/atoms/Input';
import { toast } from 'sonner';

interface Visitor {
  id: string;
  name: string;
  purpose: string;
  date: string;
  unit: string;
  checkedIn: boolean;
}

export function VisitorManagement() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Visitor[]>([
    { id: '1', name: 'John Doe', purpose: 'Maintenance', date: '2026-01-23', unit: 'Unit 201', checkedIn: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', purpose: '', date: '', unit: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitors([...visitors, { id: Date.now().toString(), ...formData, checkedIn: false }]);
    toast.success('Visitor registered');
    setFormData({ name: '', purpose: '', date: '', unit: '' });
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
                <h1 className="text-2xl font-bold text-neutral-900">Visitor Management</h1>
                <p className="text-sm text-neutral-600">Pre-register visitors and track packages</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Register Visitor
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {showForm && (
            <form onSubmit={handleAdd} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Visitor name" required />
                <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="Unit" required />
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                <Input value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} placeholder="Purpose" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">Register</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {visitors.map((visitor) => (
              <div key={visitor.id} className="bg-white border border-neutral-200 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">{visitor.name}</h4>
                      <p className="text-sm text-neutral-600">{visitor.purpose}</p>
                      <p className="text-xs text-neutral-500 mt-1">{visitor.unit} • {new Date(visitor.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setVisitors(visitors.map(v => v.id === visitor.id ? { ...v, checkedIn: !v.checkedIn } : v));
                      toast.success(visitor.checkedIn ? 'Checked out' : 'Checked in');
                    }}
                    className={`px-4 py-2 rounded-lg ${visitor.checkedIn ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'}`}
                  >
                    {visitor.checkedIn ? 'Checked In' : 'Check In'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitorManagement;
