import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Car, Calendar, QrCode } from 'lucide-react';
import Input from '@/components/atoms/Input';
import { toast } from 'sonner';

interface ParkingSpot {
  id: string;
  spotNumber: string;
  type: 'covered' | 'uncovered';
  assignedTo?: string;
}

export function ParkingAmenities() {
  const navigate = useNavigate();
  const [spots, setSpots] = useState<ParkingSpot[]>([
    { id: '1', spotNumber: 'P-101', type: 'covered', assignedTo: 'Unit 201' },
    { id: '2', spotNumber: 'P-102', type: 'covered' },
    { id: '3', spotNumber: 'P-201', type: 'uncovered' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ spotNumber: '', type: 'covered' as const });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setSpots([...spots, { id: Date.now().toString(), ...formData }]);
    toast.success('Parking spot added');
    setFormData({ spotNumber: '', type: 'covered' });
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
                <h1 className="text-2xl font-bold text-neutral-900">Parking & Amenities</h1>
                <p className="text-sm text-neutral-600">Manage parking and amenity bookings</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Spot
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {showForm && (
            <form onSubmit={handleAdd} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={formData.spotNumber}
                  onChange={(e) => setFormData({ ...formData, spotNumber: e.target.value })}
                  placeholder="P-101"
                  required
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="px-3 py-2 border border-neutral-200 rounded-lg"
                >
                  <option value="covered">Covered</option>
                  <option value="uncovered">Uncovered</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">Add</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spots.map((spot) => (
              <div key={spot.id} className="bg-white border border-neutral-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Car className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{spot.spotNumber}</h4>
                    <p className="text-sm text-neutral-600 capitalize">{spot.type}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-neutral-600">Assigned to: </span>
                  <span className="font-medium">{spot.assignedTo || 'Available'}</span>
                </div>
                {spot.assignedTo && (
                  <button className="mt-4 w-full px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Generate Permit
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParkingAmenities;
