import { useState } from 'react';
import { Calendar, Plus, Users, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function OwnerMeetingsPage() {
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);

  const meetings = [
    {
      id: 1,
      title: 'Q1 Board Meeting',
      date: '2026-02-15',
      time: '6:00 PM',
      location: 'Conference Room A',
      attendees: 12,
      totalInvited: 15,
      status: 'upcoming',
      agenda: ['Budget Review', 'Maintenance Updates', 'New Policies'],
    },
    {
      id: 2,
      title: 'Annual General Meeting',
      date: '2026-03-20',
      time: '7:00 PM',
      location: 'Community Hall',
      attendees: 45,
      totalInvited: 50,
      status: 'upcoming',
      agenda: ['Financial Report', 'Board Elections', 'Community Updates'],
    },
    {
      id: 3,
      title: 'Emergency Maintenance Discussion',
      date: '2026-01-10',
      time: '5:30 PM',
      location: 'Virtual (Zoom)',
      attendees: 18,
      totalInvited: 20,
      status: 'completed',
      agenda: ['Roof Repair', 'Budget Allocation', 'Timeline Discussion'],
    },
  ];

  const votes = [
    {
      id: 1,
      title: 'Approve $50K Roof Repair',
      endDate: '2026-02-01',
      totalVotes: 45,
      required: 50,
      yesVotes: 38,
      noVotes: 7,
      status: 'active',
    },
    {
      id: 2,
      title: 'New Pet Policy Amendment',
      endDate: '2026-02-10',
      totalVotes: 30,
      required: 50,
      yesVotes: 25,
      noVotes: 5,
      status: 'active',
    },
    {
      id: 3,
      title: 'Install Security Cameras',
      endDate: '2026-01-15',
      totalVotes: 50,
      required: 50,
      yesVotes: 42,
      noVotes: 8,
      status: 'passed',
    },
  ];

  const upcomingMeetings = meetings.filter((m) => m.status === 'upcoming');
  const activeVotes = votes.filter((v) => v.status === 'active');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Meetings & Voting</h1>
          <p className="text-sm text-neutral-600">Schedule meetings and manage community votes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowVotingModal(true)}>
            <Plus className="w-4 h-4" />
            New Vote
          </Button>
          <Button variant="primary" onClick={() => setShowNewMeetingModal(true)}>
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Upcoming Meetings</p>
          <p className="text-2xl font-semibold text-neutral-900">{upcomingMeetings.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Active Votes</p>
          <p className="text-2xl font-semibold text-neutral-900">{activeVotes.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-neutral-600 mb-1">Participation Rate</p>
          <p className="text-2xl font-semibold text-neutral-900">84%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meetings */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Scheduled Meetings</h2>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <Card key={meeting.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{meeting.title}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(meeting.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <Clock className="w-3 h-3" />
                        {meeting.time}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <MapPin className="w-3 h-3" />
                        {meeting.location}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      meeting.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {meeting.status}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-neutral-600 mb-1">Agenda:</p>
                  <ul className="text-xs text-neutral-700 space-y-0.5">
                    {meeting.agenda.map((item, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Users className="w-3 h-3" />
                    {meeting.attendees}/{meeting.totalInvited} attending
                  </div>
                  <Button variant="secondary" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Voting */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Votes</h2>
          <div className="space-y-3">
            {votes.map((vote) => {
              const yesPercentage = (vote.yesVotes / vote.totalVotes) * 100;
              const noPercentage = (vote.noVotes / vote.totalVotes) * 100;
              const participationPercentage = (vote.totalVotes / vote.required) * 100;

              return (
                <Card key={vote.id}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-1">{vote.title}</h3>
                      <p className="text-xs text-neutral-600">
                        Ends {new Date(vote.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        vote.status === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : vote.status === 'passed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {vote.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {/* Yes/No bars */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-neutral-700">Yes</span>
                        </div>
                        <span className="text-neutral-600">{vote.yesVotes} ({yesPercentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${yesPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span className="text-neutral-700">No</span>
                        </div>
                        <span className="text-neutral-600">{vote.noVotes} ({noPercentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${noPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100">
                    <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
                      <span>Participation</span>
                      <span>{vote.totalVotes}/{vote.required} ({participationPercentage.toFixed(0)}%)</span>
                    </div>
                    {vote.status === 'active' && (
                      <Button variant="primary" size="sm" className="w-full">
                        Cast Your Vote
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Schedule New Meeting</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Q2 Board Meeting"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Date *</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Time *</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Location *</label>
                <input
                  type="text"
                  placeholder="e.g., Conference Room A"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Agenda Items</label>
                <textarea
                  rows={3}
                  placeholder="One item per line"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowNewMeetingModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" className="flex-1">
                Schedule Meeting
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* New Vote Modal */}
      {showVotingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Create New Vote</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Vote Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Approve New Policy"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide details about what's being voted on"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">End Date *</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowVotingModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" className="flex-1">
                Create Vote
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
