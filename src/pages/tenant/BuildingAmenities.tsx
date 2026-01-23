import { useState } from 'react';
import { Calendar, Dumbbell, Users, Coffee, CalendarCheck, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function BuildingAmenities() {
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);

  const amenities = [
    { id: 'gym', name: 'Fitness Center', icon: Dumbbell, available: true, capacity: 10 },
    { id: 'common', name: 'Common Room', icon: Users, available: true, capacity: 30 },
    { id: 'lounge', name: 'Business Lounge', icon: Coffee, available: true, capacity: 15 },
  ];

  const myReservations = [
    {
      id: 'res-1',
      amenity: 'Fitness Center',
      date: '2026-01-25',
      time: '07:00 AM - 08:00 AM',
      status: 'confirmed',
    },
    {
      id: 'res-2',
      amenity: 'Common Room',
      date: '2026-01-28',
      time: '06:00 PM - 09:00 PM',
      status: 'confirmed',
    },
  ];

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Building Amenities</h1>
        <p className="text-sm text-neutral-600">Reserve shared spaces and amenities</p>
      </div>

      {/* My Reservations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">My Reservations</h2>
          <span className="text-sm text-neutral-600">{myReservations.length} upcoming</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myReservations.map((reservation) => (
            <Card key={reservation.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">{reservation.amenity}</h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(reservation.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{reservation.time}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Cancel</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Amenities */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Available Amenities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {amenities.map((amenity) => (
            <Card
              key={amenity.id}
              className="cursor-pointer hover:border-primary-600 transition-colors"
              onClick={() => setSelectedAmenity(amenity.id)}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <amenity.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">{amenity.name}</h3>
                <p className="text-sm text-neutral-600 mb-4">Capacity: {amenity.capacity} people</p>
                {amenity.available ? (
                  <span className="inline-flex items-center gap-1 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm text-neutral-500">
                    <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                    Unavailable
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Building Events Calendar */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming Building Events</h2>
        <Card>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">26</div>
                <div className="text-xs text-neutral-600">JAN</div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-neutral-900">Building Wide Maintenance</h3>
                <p className="text-sm text-neutral-600 mt-1">Water will be shut off 9AM-12PM</p>
                <p className="text-xs text-neutral-500 mt-1">All Units</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">30</div>
                <div className="text-xs text-neutral-600">JAN</div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-neutral-900">Community Social</h3>
                <p className="text-sm text-neutral-600 mt-1">Meet your neighbors! Pizza & drinks provided</p>
                <p className="text-xs text-neutral-500 mt-1">Common Room • 6:00 PM</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
