import { useState } from 'react';
import { Home, Users, Eye, MessageSquare, Calendar, TrendingUp, DollarSign, MapPin, Star, Phone, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ListingModal } from '@/components/modals/ListingModal';
import { LeadDetailModal } from '@/components/modals/LeadDetailModal';

interface VacantUnit {
  id: string;
  propertyName: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  availableFrom: string;
  status: 'vacant' | 'listed' | 'showing';
  daysVacant: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  unitNumber: string;
  propertyName: string;
  status: 'new' | 'contacted' | 'viewing_scheduled' | 'application_submitted' | 'approved' | 'rejected';
  source: 'website' | 'zillow' | 'apartments.com' | 'referral';
  score: number;
  notes: string;
  createdAt: string;
  lastContact?: string;
  scheduledViewing?: string;
}

export default function VacancyMarketing() {
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<VacantUnit | null>(null);

  const vacantUnits: VacantUnit[] = [
    {
      id: 'unit-1',
      propertyName: 'Sunset Apartments',
      unitNumber: '3A',
      bedrooms: 2,
      bathrooms: 1,
      rent: 1800,
      availableFrom: '2026-02-15',
      status: 'listed',
      daysVacant: 12,
    },
    {
      id: 'unit-2',
      propertyName: 'Riverside Complex',
      unitNumber: '5B',
      bedrooms: 3,
      bathrooms: 2,
      rent: 2400,
      availableFrom: '2026-02-01',
      status: 'showing',
      daysVacant: 25,
    },
    {
      id: 'unit-3',
      propertyName: 'Downtown Lofts',
      unitNumber: 'L8',
      bedrooms: 1,
      bathrooms: 1,
      rent: 1500,
      availableFrom: '2026-03-01',
      status: 'vacant',
      daysVacant: 3,
    },
  ];

  const leads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 123-4567',
      unitId: 'unit-1',
      unitNumber: '3A',
      propertyName: 'Sunset Apartments',
      status: 'viewing_scheduled',
      source: 'website',
      score: 85,
      notes: 'Looking for February move-in. Has cat. Employed as software engineer.',
      createdAt: '2026-01-20T10:00:00Z',
      lastContact: '2026-01-22T15:30:00Z',
      scheduledViewing: '2026-01-25T14:00:00Z',
    },
    {
      id: 'lead-2',
      name: 'Michael Chen',
      email: 'mchen@email.com',
      phone: '(555) 234-5678',
      unitId: 'unit-2',
      unitNumber: '5B',
      propertyName: 'Riverside Complex',
      status: 'application_submitted',
      source: 'zillow',
      score: 92,
      notes: 'Family of 4. Excellent credit score. Moving from out of state for work.',
      createdAt: '2026-01-18T14:20:00Z',
      lastContact: '2026-01-23T09:00:00Z',
    },
    {
      id: 'lead-3',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '(555) 345-6789',
      unitId: 'unit-3',
      unitNumber: 'L8',
      propertyName: 'Downtown Lofts',
      status: 'new',
      source: 'apartments.com',
      score: 70,
      notes: 'First-time renter. Recent college graduate.',
      createdAt: '2026-01-23T16:45:00Z',
    },
  ];

  // Calculate metrics
  const totalVacant = vacantUnits.length;
  const listedUnits = vacantUnits.filter(u => u.status === 'listed' || u.status === 'showing').length;
  const avgDaysVacant = Math.round(vacantUnits.reduce((sum, u) => sum + u.daysVacant, 0) / vacantUnits.length);
  const potentialRevenue = vacantUnits.reduce((sum, u) => sum + u.rent, 0);
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.score >= 75).length;

  const getStatusBadge = (status: VacantUnit['status']) => {
    switch (status) {
      case 'vacant':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Vacant</span>;
      case 'listed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Listed</span>;
      case 'showing':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Showing</span>;
    }
  };

  const getLeadStatusBadge = (status: Lead['status']) => {
    const styles: Record<Lead['status'], string> = {
      new: 'bg-purple-100 text-purple-700',
      contacted: 'bg-blue-100 text-blue-700',
      viewing_scheduled: 'bg-yellow-100 text-yellow-700',
      application_submitted: 'bg-green-100 text-green-700',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`px-2 py-1 ${styles[status]} text-xs font-medium rounded-full`}>
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getSourceBadge = (source: Lead['source']) => {
    const icons: Record<Lead['source'], string> = {
      website: '🌐',
      zillow: '🏘️',
      'apartments.com': '🏢',
      referral: '👥',
    };

    return (
      <span className="text-xs text-neutral-600">
        {icons[source]} {source.charAt(0).toUpperCase() + source.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Vacancy & Marketing</h1>
        <p className="text-sm text-neutral-600">Manage vacant units and track leads</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{totalVacant}</p>
              <p className="text-sm text-neutral-600">Vacant Units</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{avgDaysVacant}</p>
              <p className="text-sm text-neutral-600">Avg Days Vacant</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{qualifiedLeads}/{totalLeads}</p>
              <p className="text-sm text-neutral-600">Qualified Leads</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">${potentialRevenue.toLocaleString()}</p>
              <p className="text-sm text-neutral-600">Potential Revenue</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Vacant Units */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Vacant Units</h2>
          <Button variant="primary" size="sm" onClick={() => setShowListingModal(true)}>
            Create Listing
          </Button>
        </div>

        <div className="space-y-4">
          {vacantUnits.map((unit) => (
            <Card key={unit.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-neutral-900">{unit.propertyName} - Unit {unit.unitNumber}</h3>
                      {getStatusBadge(unit.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
                      <span>{unit.bedrooms} bed, {unit.bathrooms} bath</span>
                      <span>•</span>
                      <span className="font-medium text-neutral-900">${unit.rent}/mo</span>
                      <span>•</span>
                      <span>Available {new Date(unit.availableFrom).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`${unit.daysVacant > 30 ? 'text-red-600' : 'text-neutral-600'}`}>
                        Vacant for {unit.daysVacant} days
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedUnit(unit);
                    setShowListingModal(true);
                  }}>
                    <Eye className="w-4 h-4" />
                    View Listing
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Calendar className="w-4 h-4" />
                    Schedule Showing
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Lead Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Lead Pipeline</h2>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="all">All Leads</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="viewing_scheduled">Viewing Scheduled</option>
              <option value="application_submitted">Application Submitted</option>
            </select>
            <Button variant="secondary" size="sm">
              Export CSV
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id} className="hover:border-primary-600 cursor-pointer transition-colors" onClick={() => setSelectedLead(lead)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-neutral-900">{lead.name}</h3>
                      {getLeadStatusBadge(lead.status)}
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-neutral-900">{lead.score}/100</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {lead.propertyName} - {lead.unitNumber}
                      </span>
                      <span>•</span>
                      {getSourceBadge(lead.source)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </span>
                    </div>
                    {lead.scheduledViewing && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-900">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Viewing scheduled: {new Date(lead.scheduledViewing).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    // Handle message
                  }}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLead(lead);
                  }}>
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ListingModal
        isOpen={showListingModal}
        onClose={() => {
          setShowListingModal(false);
          setSelectedUnit(null);
        }}
        unit={selectedUnit}
      />
      <LeadDetailModal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
      />
    </div>
  );
}
