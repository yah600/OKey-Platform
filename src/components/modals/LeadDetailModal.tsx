import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, MessageSquare, FileText, Star, TrendingUp } from 'lucide-react';
import Modal from '@/components/organisms/Modal';
import Button from '@/components/ui/Button';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState(lead?.status || 'new');

  if (!lead) return null;

  const handleStatusUpdate = (newStatus: string) => {
    setStatus(newStatus);
    // Would call leadsStore.updateLeadStatus(lead.id, newStatus)
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    // Would call leadsStore.addNote(lead.id, newNote)
    setNewNote('');
  };

  const handleScheduleViewing = () => {
    // Would open calendar modal
  };

  const handleSendMessage = () => {
    // Would open message compose modal
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-purple-100 text-purple-700',
      contacted: 'bg-blue-100 text-blue-700',
      viewing_scheduled: 'bg-yellow-100 text-yellow-700',
      application_submitted: 'bg-green-100 text-green-700',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-700';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-1">{lead.name}</h2>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 ${getStatusColor(status)} text-xs font-medium rounded-full`}>
                  {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-neutral-900">Lead Score: {lead.score}/100</span>
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-600">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-600">{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-600">{lead.propertyName} - {lead.unitNumber}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleSendMessage} className="flex-1">
            <MessageSquare className="w-4 h-4" />
            Send Message
          </Button>
          <Button variant="secondary" size="sm" onClick={handleScheduleViewing} className="flex-1">
            <Calendar className="w-4 h-4" />
            Schedule Viewing
          </Button>
          <Button variant="secondary" size="sm" className="flex-1">
            <FileText className="w-4 h-4" />
            Send Application
          </Button>
        </div>

        {/* Status Update */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-900 mb-2">Update Status</label>
          <select
            value={status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="viewing_scheduled">Viewing Scheduled</option>
            <option value="application_submitted">Application Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Lead Information */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Lead Information</h3>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-sm text-neutral-600">Source:</span>
              <span className="text-sm font-medium text-neutral-900">{lead.source}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-sm text-neutral-600">Created:</span>
              <span className="text-sm font-medium text-neutral-900">{new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
            {lead.lastContact && (
              <div className="flex items-start justify-between">
                <span className="text-sm text-neutral-600">Last Contact:</span>
                <span className="text-sm font-medium text-neutral-900">{new Date(lead.lastContact).toLocaleDateString()}</span>
              </div>
            )}
            {lead.scheduledViewing && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-yellow-700" />
                  <span className="text-sm font-medium text-yellow-900">Scheduled Viewing</span>
                </div>
                <p className="text-sm text-yellow-700">{new Date(lead.scheduledViewing).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Notes</h3>
          <div className="space-y-3 mb-3">
            <div className="p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium text-neutral-900">Initial Note</span>
                <span className="text-xs text-neutral-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-neutral-700">{lead.notes}</p>
            </div>
          </div>

          {/* Add Note */}
          <div>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              placeholder="Add a note about this lead..."
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="mt-2 flex justify-end">
              <Button variant="secondary" size="sm" onClick={handleAddNote}>
                Add Note
              </Button>
            </div>
          </div>
        </div>

        {/* Lead Score Breakdown */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-blue-900">Lead Score Breakdown</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Response Time</span>
              <span className="font-medium text-blue-900">25/30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Engagement Level</span>
              <span className="font-medium text-blue-900">20/25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Budget Match</span>
              <span className="font-medium text-blue-900">22/25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Timeline Fit</span>
              <span className="font-medium text-blue-900">18/20</span>
            </div>
            <div className="pt-2 border-t border-blue-300 flex justify-between font-semibold">
              <span className="text-blue-900">Total Score</span>
              <span className="text-blue-900">{lead.score}/100</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Close
          </Button>
          {status === 'new' && (
            <Button variant="primary" onClick={() => handleStatusUpdate('contacted')} className="flex-1">
              Mark as Contacted
            </Button>
          )}
          {status === 'contacted' && (
            <Button variant="primary" onClick={handleScheduleViewing} className="flex-1">
              Schedule Viewing
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
