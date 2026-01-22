import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function MyBids() {
  const [activeTab, setActiveTab] = useState<'active' | 'won' | 'lost' | 'expired'>('active');

  const bids = [
    {
      id: 1,
      propertyName: 'Sunset Apartments',
      unit: '4B',
      propertyId: '1',
      unitId: '1',
      bidAmount: 1850,
      askingRent: 1800,
      status: 'active',
      submittedDate: '2026-01-20',
      moveInDate: '2026-02-15',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      propertyName: 'Downtown Plaza',
      unit: '5A',
      propertyId: '2',
      unitId: '2',
      bidAmount: 2300,
      askingRent: 2200,
      status: 'won',
      submittedDate: '2026-01-18',
      moveInDate: '2026-03-01',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      propertyName: 'Urban Lofts',
      unit: '3C',
      propertyId: '4',
      unitId: '3',
      bidAmount: 2000,
      askingRent: 1950,
      status: 'lost',
      submittedDate: '2026-01-15',
      moveInDate: '2026-02-20',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      propertyName: 'Garden Residences',
      unit: '2A',
      propertyId: '5',
      unitId: '4',
      bidAmount: 1800,
      askingRent: 1750,
      status: 'expired',
      submittedDate: '2026-01-10',
      moveInDate: '2026-02-01',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    },
  ];

  const tabs = [
    { id: 'active', label: 'Active', count: bids.filter((b) => b.status === 'active').length },
    { id: 'won', label: 'Won', count: bids.filter((b) => b.status === 'won').length },
    { id: 'lost', label: 'Lost', count: bids.filter((b) => b.status === 'lost').length },
    { id: 'expired', label: 'Expired', count: bids.filter((b) => b.status === 'expired').length },
  ];

  const filteredBids = bids.filter((bid) => bid.status === activeTab);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: Clock, color: 'text-blue-700', bg: 'bg-blue-100', label: 'Pending Review' };
      case 'won':
        return { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-100', label: 'Accepted' };
      case 'lost':
        return { icon: XCircle, color: 'text-red-700', bg: 'bg-red-100', label: 'Not Selected' };
      case 'expired':
        return { icon: Clock, color: 'text-neutral-700', bg: 'bg-neutral-100', label: 'Expired' };
      default:
        return { icon: Clock, color: 'text-neutral-700', bg: 'bg-neutral-100', label: 'Unknown' };
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-semibold text-neutral-900">
              O'Key Platform
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">My Bids</h1>
          <p className="text-sm text-neutral-600">Track your rental applications and bids</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-neutral-200">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 text-xs rounded ${
                    activeTab === tab.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bids List */}
        {filteredBids.length > 0 ? (
          <div className="space-y-4">
            {filteredBids.map((bid) => {
              const statusConfig = getStatusConfig(bid.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={bid.id}>
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-32 h-24 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={bid.image}
                        alt={bid.propertyName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-neutral-900">
                            {bid.propertyName} - Unit {bid.unit}
                          </h3>
                          <p className="text-xs text-neutral-600">
                            Submitted {new Date(bid.submittedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${statusConfig.bg} ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-neutral-600">Your Bid</p>
                          <p className="font-semibold text-neutral-900">${bid.bidAmount}/mo</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">Asking Rent</p>
                          <p className="font-semibold text-neutral-900">${bid.askingRent}/mo</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">Move-In Date</p>
                          <p className="font-medium text-neutral-900">
                            {new Date(bid.moveInDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <Link
                          to={`/marketplace/property/${bid.propertyId}/unit/${bid.unitId}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Unit Details →
                        </Link>
                        {bid.status === 'won' && (
                          <Button variant="primary" size="sm">
                            Sign Lease
                          </Button>
                        )}
                        {bid.status === 'active' && (
                          <Button variant="secondary" size="sm">
                            Withdraw Bid
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No {activeTab} bids
            </h3>
            <p className="text-sm text-neutral-600 mb-6">
              {activeTab === 'active' && 'Start browsing properties to place your first bid'}
              {activeTab === 'won' && 'You haven\'t won any bids yet'}
              {activeTab === 'lost' && 'No lost bids to show'}
              {activeTab === 'expired' && 'No expired bids'}
            </p>
            <Link to="/marketplace/search">
              <Button variant="primary">
                Browse Properties
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
