import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';

export default function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mock events
  const events = [
    {
      id: 1,
      title: 'Board Meeting',
      date: '2026-01-25',
      time: '14:00',
      type: 'meeting',
      location: 'Conference Room',
    },
    {
      id: 2,
      title: 'Property Inspection - Sunset Apartments',
      date: '2026-01-26',
      time: '10:00',
      type: 'inspection',
      location: 'Sunset Apartments',
    },
    {
      id: 3,
      title: 'Rent Collection Due',
      date: '2026-01-31',
      time: '23:59',
      type: 'payment',
      location: 'N/A',
    },
    {
      id: 4,
      title: 'HVAC Maintenance',
      date: '2026-01-28',
      time: '09:00',
      type: 'maintenance',
      location: 'All Properties',
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.filter((event) => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const eventTypeColors = {
    meeting: 'bg-blue-100 text-blue-700 border-blue-200',
    inspection: 'bg-purple-100 text-purple-700 border-purple-200',
    payment: 'bg-green-100 text-green-700 border-green-200',
    maintenance: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Calendar</h1>
            <p className="text-sm text-neutral-600">Manage your schedule and events</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900">{monthName}</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={today}>
                  Today
                </Button>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-neutral-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const date = index + 1;
                  const dayEvents = getEventsForDate(date);
                  const isToday =
                    date === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={date}
                      className={`aspect-square p-2 border rounded-lg hover:border-neutral-300 transition-colors cursor-pointer ${
                        isToday ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
                      }`}
                    >
                      <div className="text-sm font-medium text-neutral-900 mb-1">{date}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-1.5 py-0.5 rounded truncate ${
                              eventTypeColors[event.type as keyof typeof eventTypeColors]
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-neutral-600 px-1.5">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Events Sidebar */}
        <div>
          <Card>
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-neutral-900">{event.title}</h4>
                    <Badge
                      variant={
                        event.type === 'meeting'
                          ? 'primary'
                          : event.type === 'inspection'
                          ? 'secondary'
                          : event.type === 'payment'
                          ? 'success'
                          : 'warning'
                      }
                      className="text-xs"
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-neutral-600">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
