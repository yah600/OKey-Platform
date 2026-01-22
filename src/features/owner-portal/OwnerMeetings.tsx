import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Calendar, Users, Vote, FileText, Plus, X, Clock, MapPin, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type MeetingTab = 'upcoming' | 'past' | 'votes' | 'minutes';
type MeetingType = 'board' | 'agm' | 'special' | 'emergency';
type RSVPStatus = 'going' | 'not_going' | 'maybe';

interface Meeting {
  id: string;
  type: MeetingType;
  title: string;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  agenda_items: string[];
  attendees: number;
  confirmed: number;
  rsvp_status?: RSVPStatus;
}

interface ActiveVote {
  id: string;
  title: string;
  description: string;
  type: 'simple' | 'majority' | 'unanimous';
  options: string[];
  deadline: string;
  hasVoted: boolean;
  results?: { [key: string]: number };
}

export function OwnerMeetings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MeetingTab>('upcoming');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedVote, setSelectedVote] = useState<ActiveVote | null>(null);
  const [voteSelection, setVoteSelection] = useState('');

  // Mock meetings
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 'm1',
      type: 'board',
      title: 'Monthly Board Meeting',
      date: '2026-02-15',
      time: '18:00',
      location: 'Community Room',
      isVirtual: false,
      agenda_items: ['Budget Review', 'Maintenance Updates', 'New Proposals'],
      attendees: 12,
      confirmed: 8,
      rsvp_status: 'going',
    },
    {
      id: 'm2',
      type: 'agm',
      title: 'Annual General Meeting',
      date: '2026-03-01',
      time: '19:00',
      location: 'Zoom Meeting',
      isVirtual: true,
      agenda_items: ['Financial Report', 'Board Elections', 'Strategic Planning'],
      attendees: 50,
      confirmed: 23,
    },
  ]);

  // Mock active votes
  const [activeVotes, setActiveVotes] = useState<ActiveVote[]>([
    {
      id: 'v1',
      title: 'Approve Pool Renovation Budget',
      description: 'Vote to approve $50,000 budget for pool renovation including new tiles and heating system.',
      type: 'simple',
      options: ['Yes', 'No', 'Abstain'],
      deadline: '2026-02-10',
      hasVoted: false,
      results: { Yes: 15, No: 3, Abstain: 2 },
    },
    {
      id: 'v2',
      title: 'Select New Property Management Company',
      description: 'Choose from three vetted property management companies.',
      type: 'majority',
      options: ['ABC Property Management', 'XYZ Realty Services', 'Professional Property Co'],
      deadline: '2026-02-20',
      hasVoted: false,
    },
  ]);

  // Schedule meeting form
  const [scheduleForm, setScheduleForm] = useState({
    type: 'board' as MeetingType,
    title: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    isVirtual: false,
    agendaItems: [''],
  });

  const stats = {
    upcomingMeetings: meetings.filter(m => new Date(m.date) >= new Date()).length,
    pendingVotes: activeVotes.filter(v => !v.hasVoted).length,
    decisionsThisYear: 12,
  };

  const getMeetingTypeBadge = (type: MeetingType) => {
    const badges = {
      board: 'bg-blue-100 text-blue-700',
      agm: 'bg-purple-100 text-purple-700',
      special: 'bg-orange-100 text-orange-700',
      emergency: 'bg-red-100 text-red-700',
    };
    const labels = {
      board: 'Board Meeting',
      agm: 'AGM',
      special: 'Special Meeting',
      emergency: 'Emergency',
    };
    return (
      <span className={`px-2 py-1 ${badges[type]} text-xs font-medium rounded-full`}>
        {labels[type]}
      </span>
    );
  };

  const handleScheduleMeeting = () => {
    if (!scheduleForm.title || !scheduleForm.date || !scheduleForm.time) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Meeting scheduled successfully! Invitations will be sent.');
    setShowScheduleModal(false);
  };

  const handleVoteSubmit = () => {
    if (!voteSelection) {
      alert('Please select an option');
      return;
    }
    alert('Vote submitted successfully!');
    setShowVoteModal(false);
    setVoteSelection('');
    if (selectedVote) {
      const updatedVotes = activeVotes.map(v =>
        v.id === selectedVote.id ? { ...v, hasVoted: true } : v
      );
      setActiveVotes(updatedVotes);
    }
  };

  const handleRSVP = (meetingId: string, status: RSVPStatus) => {
    setMeetings(meetings.map(m =>
      m.id === meetingId ? { ...m, rsvp_status: status } : m
    ));
    alert(`RSVP updated to: ${status}`);
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
            <span className="text-gray-900 font-medium">Meetings</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meetings & Governance</h1>
              <p className="text-gray-600 mt-1">Manage board meetings, votes, and decisions</p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.upcomingMeetings}</div>
                  <div className="text-sm text-gray-600">Upcoming Meetings</div>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingVotes}</div>
                  <div className="text-sm text-gray-600">Pending Votes</div>
                </div>
                <Vote className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.decisionsThisYear}</div>
                  <div className="text-sm text-gray-600">Decisions This Year</div>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-white rounded-t-lg border-b">
              <div className="flex gap-8 px-6">
                {[
                  { id: 'upcoming', label: 'Upcoming' },
                  { id: 'past', label: 'Past Meetings' },
                  { id: 'votes', label: 'Votes & Decisions' },
                  { id: 'minutes', label: 'Meeting Minutes' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as MeetingTab)}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-b-lg shadow p-6">
              {activeTab === 'upcoming' && (
                <div className="space-y-4">
                  {meetings.filter(m => new Date(m.date) >= new Date()).length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No upcoming meetings scheduled</p>
                    </div>
                  ) : (
                    meetings.filter(m => new Date(m.date) >= new Date()).map(meeting => (
                      <div key={meeting.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getMeetingTypeBadge(meeting.type)}
                              <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(meeting.date).toLocaleDateString()} at {meeting.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {meeting.isVirtual ? (
                                  <>
                                    <Video className="w-4 h-4" />
                                    <span>{meeting.location}</span>
                                  </>
                                ) : (
                                  <>
                                    <MapPin className="w-4 h-4" />
                                    <span>{meeting.location}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{meeting.agenda_items.length} agenda items</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{meeting.confirmed} of {meeting.attendees} confirmed</span>
                              </div>
                            </div>
                          </div>
                          {meeting.rsvp_status && (
                            <div className="ml-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                meeting.rsvp_status === 'going' ? 'bg-green-100 text-green-700' :
                                meeting.rsvp_status === 'not_going' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {meeting.rsvp_status === 'going' ? 'Going' :
                                 meeting.rsvp_status === 'not_going' ? 'Not Going' : 'Maybe'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedMeeting(meeting);
                              setShowDetailModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            View Details
                          </button>
                          {!meeting.rsvp_status && (
                            <>
                              <button
                                onClick={() => handleRSVP(meeting.id, 'going')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                              >
                                Going
                              </button>
                              <button
                                onClick={() => handleRSVP(meeting.id, 'maybe')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                              >
                                Maybe
                              </button>
                              <button
                                onClick={() => handleRSVP(meeting.id, 'not_going')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                              >
                                Can't Attend
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'votes' && (
                <div className="space-y-4">
                  {activeVotes.map(vote => (
                    <div key={vote.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{vote.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{vote.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Deadline: {new Date(vote.deadline).toLocaleDateString()}</span>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              {vote.type === 'simple' ? 'Simple Majority' :
                               vote.type === 'majority' ? '2/3 Majority' : 'Unanimous'}
                            </span>
                          </div>
                        </div>
                        {vote.hasVoted ? (
                          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            ✓ Voted
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedVote(vote);
                              setShowVoteModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Cast Vote
                          </button>
                        )}
                      </div>
                      {vote.results && (
                        <div className="border-t pt-4 mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Current Results:</p>
                          {vote.options.map(option => (
                            <div key={option} className="flex items-center gap-3 mb-2">
                              <span className="text-sm text-gray-700 w-32">{option}</span>
                              <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-600"
                                  style={{
                                    width: `${((vote.results![option] || 0) /
                                      Object.values(vote.results!).reduce((a, b) => a + b, 0)) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                {vote.results![option] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(activeTab === 'past' || activeTab === 'minutes') && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No {activeTab === 'past' ? 'past meetings' : 'meeting minutes'} available</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Active Votes */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Votes</h3>
              {activeVotes.filter(v => !v.hasVoted).length === 0 ? (
                <p className="text-sm text-gray-600">No pending votes</p>
              ) : (
                <div className="space-y-4">
                  {activeVotes.filter(v => !v.hasVoted).map(vote => (
                    <div key={vote.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">{vote.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <Clock className="w-3 h-3" />
                        <span>Ends {new Date(vote.deadline).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedVote(vote);
                          setShowVoteModal(true);
                        }}
                        className="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                      >
                        Cast Vote Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Detail Modal */}
      {showDetailModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{selectedMeeting.title}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Meeting Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Type:</span> {getMeetingTypeBadge(selectedMeeting.type)}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedMeeting.date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Time:</span> {selectedMeeting.time}</p>
                    <p><span className="font-medium">Location:</span> {selectedMeeting.location}</p>
                    <p><span className="font-medium">Expected Attendees:</span> {selectedMeeting.attendees}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Agenda</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {selectedMeeting.agenda_items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Schedule New Meeting</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type *</label>
                <select
                  value={scheduleForm.type}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value as MeetingType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="board">Board Meeting</option>
                  <option value="agm">Annual General Meeting</option>
                  <option value="special">Special Meeting</option>
                  <option value="emergency">Emergency Meeting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Meeting title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleForm.isVirtual}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, isVirtual: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Virtual Meeting</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleMeeting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vote Modal */}
      {showVoteModal && selectedVote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">{selectedVote.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">{selectedVote.description}</p>
              <div className="mb-4">
                <span className="text-sm text-gray-600">Vote Type: </span>
                <span className="text-sm font-medium">
                  {selectedVote.type === 'simple' ? 'Simple Majority' :
                   selectedVote.type === 'majority' ? '2/3 Majority Required' : 'Unanimous Required'}
                </span>
              </div>
              <div className="space-y-2">
                {selectedVote.options.map(option => (
                  <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="vote"
                      value={option}
                      checked={voteSelection === option}
                      onChange={(e) => setVoteSelection(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowVoteModal(false);
                  setVoteSelection('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVoteSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
