import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, CheckCircle, XCircle, Calendar, Trash2, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBidsStore, type Bid } from '../../store/bidsStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/organisms/EmptyState';
import Modal from '../../components/organisms/Modal';
import { toast } from 'sonner';

export default function MyBids() {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected' | 'withdrawn'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const { user } = useAuthStore();
  const { bids: allBids, withdrawBid } = useBidsStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Get bids for current user
  const userBids = user ? allBids.filter(bid => bid.userId === user.id) : [];

  const tabs = [
    { id: 'pending', label: 'Pending', count: userBids.filter((b) => b.status === 'pending').length },
    { id: 'accepted', label: 'Accepted', count: userBids.filter((b) => b.status === 'accepted').length },
    { id: 'rejected', label: 'Rejected', count: userBids.filter((b) => b.status === 'rejected').length },
    { id: 'withdrawn', label: 'Withdrawn', count: userBids.filter((b) => b.status === 'withdrawn').length },
  ];

  const filteredBids = userBids.filter((bid) => bid.status === activeTab);

  const handleWithdrawBid = (bidId: string) => {
    withdrawBid(bidId);
    toast.success('Bid Withdrawn', {
      description: 'Your bid has been withdrawn successfully.',
    });
  };

  const handleSignLease = (bid: Bid) => {
    setSelectedBid(bid);
    setShowLeaseModal(true);
  };

  const handleConfirmLeaseSigning = () => {
    if (!selectedBid) return;

    // In a real app, this would integrate with DocuSign
    toast.success('Lease Signed Successfully!', {
      description: `Your lease for ${selectedBid.unitDetails.propertyName} - Unit ${selectedBid.unitDetails.number} has been signed. Welcome home!`,
      duration: 5000,
    });

    setShowLeaseModal(false);
    setSelectedBid(null);

    // Navigate to tenant dashboard after a delay
    setTimeout(() => {
      window.location.href = '/tenant';
    }, 2000);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-blue-600', variant: 'primary' as const, label: 'Pending Review' };
      case 'accepted':
        return { icon: CheckCircle, color: 'text-green-600', variant: 'success' as const, label: 'Accepted' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', variant: 'error' as const, label: 'Not Selected' };
      case 'withdrawn':
        return { icon: XCircle, color: 'text-neutral-600', variant: 'secondary' as const, label: 'Withdrawn' };
      default:
        return { icon: Clock, color: 'text-neutral-600', variant: 'secondary' as const, label: 'Unknown' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 animate-fadeIn">
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
                    {/* Image Placeholder */}
                    <div className="w-32 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-primary-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-neutral-900">
                              {bid.unitDetails.propertyName} - Unit {bid.unitDetails.number}
                            </h3>
                            <Badge variant={statusConfig.variant}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-neutral-600 mb-1">
                            {bid.unitDetails.address}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Submitted {new Date(bid.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm mt-3">
                        <div>
                          <p className="text-xs text-neutral-600">Your Bid</p>
                          <p className="font-semibold text-green-600">${bid.amount}/mo</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">Asking Rent</p>
                          <p className="font-semibold text-neutral-900">${bid.unitDetails.rent}/mo</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">Lease Term</p>
                          <p className="font-medium text-neutral-900">{bid.leaseTerm} months</p>
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

                      {bid.message && (
                        <div className="mt-3 p-2 bg-neutral-50 rounded text-xs text-neutral-600">
                          <strong>Message:</strong> {bid.message}
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <Link
                          to={`/marketplace/property/${bid.propertyId}/unit/${bid.unitId}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Unit Details →
                        </Link>
                        <div className="flex items-center gap-2">
                          {bid.status === 'accepted' && (
                            <Button variant="primary" size="sm" onClick={() => handleSignLease(bid)}>
                              <FileText className="w-3 h-3" />
                              Sign Lease
                            </Button>
                          )}
                          {bid.status === 'pending' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleWithdrawBid(bid.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={TrendingUp}
              title={`No ${activeTab} bids`}
              description={
                activeTab === 'pending'
                  ? 'Start browsing properties to place your first bid'
                  : activeTab === 'accepted'
                  ? "You haven't won any bids yet"
                  : activeTab === 'rejected'
                  ? 'No rejected bids to show'
                  : 'No withdrawn bids'
              }
              action={{
                label: 'Browse Properties',
                onClick: () => window.location.href = '/marketplace/search',
              }}
            />
          </Card>
        )}
      </div>

      {/* Lease Signing Modal */}
      {selectedBid && (
        <Modal
          isOpen={showLeaseModal}
          onClose={() => {
            setShowLeaseModal(false);
            setSelectedBid(null);
          }}
          title="Sign Lease Agreement"
          description="Review and sign your lease electronically"
          size="lg"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowLeaseModal(false);
                  setSelectedBid(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmLeaseSigning}>
                <FileText className="w-4 h-4" />
                Sign Lease
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Lease Summary */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-3">Lease Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-neutral-600">Property</p>
                  <p className="font-medium text-neutral-900">{selectedBid.unitDetails.propertyName}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Unit</p>
                  <p className="font-medium text-neutral-900">Unit {selectedBid.unitDetails.number}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Monthly Rent</p>
                  <p className="font-medium text-neutral-900">${selectedBid.amount}/month</p>
                </div>
                <div>
                  <p className="text-neutral-600">Lease Term</p>
                  <p className="font-medium text-neutral-900">{selectedBid.leaseTerm} months</p>
                </div>
                <div>
                  <p className="text-neutral-600">Move-In Date</p>
                  <p className="font-medium text-neutral-900">
                    {new Date(selectedBid.moveInDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-600">Security Deposit</p>
                  <p className="font-medium text-neutral-900">${selectedBid.amount}</p>
                </div>
              </div>
            </div>

            {/* Lease Document Preview */}
            <div className="border border-neutral-200 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-neutral-600" />
                <h4 className="font-semibold text-neutral-900">Lease Agreement</h4>
              </div>
              <div className="h-48 bg-neutral-100 rounded flex items-center justify-center text-neutral-600 text-sm">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
                  <p>Lease document preview</p>
                  <p className="text-xs text-neutral-500 mt-1">In production, this would show the actual lease PDF</p>
                </div>
              </div>
            </div>

            {/* Terms Acknowledgment */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> By clicking "Sign Lease", you agree to the terms and conditions outlined in the lease agreement.
                In a production environment, this would integrate with DocuSign for legal e-signature.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
