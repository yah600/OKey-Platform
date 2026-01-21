import { useState } from 'react';
import {
  TrendingUp, Clock, MapPin, BedDouble, Bath, Square, AlertCircle,
  CheckCircle2, XCircle, Award, Filter, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { getBidsByUserId, getUnitById, getPropertyById } from '@/lib/data/mockData';
import { useBids } from '@/context/BidContext';

interface MyBidsProps {
  onNavigate: (route: string, id?: string) => void;
}

export function MyBids({ onNavigate }: MyBidsProps) {
  const { units } = useBids();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock current user ID - in real app this would come from auth context
  const currentUserId = 'user-3';
  const userBids = getBidsByUserId(currentUserId);

  // Enrich bids with unit and property data
  const enrichedBids = userBids.map((bid) => {
    const unit = getUnitById(bid.unitId);
    const property = unit ? getPropertyById(unit.propertyId) : null;
    const isWinning = unit && unit.currentBid === bid.amount;
    const isOutbid = bid.status === 'outbid';

    return {
      ...bid,
      unit,
      property,
      isWinning,
      isOutbid,
    };
  });

  const activeBids = enrichedBids.filter((b) => b.status === 'active');
  const wonBids = enrichedBids.filter((b) => b.status === 'accepted');
  const lostBids = enrichedBids.filter((b) => b.status === 'rejected' || b.status === 'outbid');

  const getStatusBadge = (status: string, isWinning?: boolean) => {
    if (status === 'active' && isWinning) {
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Winning
        </Badge>
      );
    }
    if (status === 'active') {
      return (
        <Badge className="bg-blue-500">
          <Clock className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    if (status === 'accepted') {
      return (
        <Badge className="bg-green-600">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Won
        </Badge>
      );
    }
    if (status === 'outbid') {
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Outbid
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <XCircle className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const BidCard = ({ bid }: { bid: typeof enrichedBids[0] }) => {
    if (!bid.unit || !bid.property) return null;

    const timeRemaining = bid.unit.auctionEndsAt
      ? new Date(bid.unit.auctionEndsAt).getTime() - Date.now()
      : 0;
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const daysRemaining = Math.floor(hoursRemaining / 24);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Image */}
            <div
              className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
              onClick={() => onNavigate('unit', bid.unitId)}
            >
              <img
                src={bid.unit.images[0]}
                alt={`Unit ${bid.unit.unitNumber}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3
                    className="text-xl font-bold mb-1 cursor-pointer hover:text-[#0D7377]"
                    onClick={() => onNavigate('unit', bid.unitId)}
                  >
                    Unit {bid.unit.unitNumber} - {bid.property.buildingName}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {bid.property.city}, {bid.property.province}
                  </p>
                </div>
                {getStatusBadge(bid.status, bid.isWinning)}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BedDouble className="w-4 h-4" />
                  {bid.unit.bedrooms} beds
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bath className="w-4 h-4" />
                  {bid.unit.bathrooms} baths
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Square className="w-4 h-4" />
                  {bid.unit.sqft} sqft
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Your Bid</div>
                  <div className="text-2xl font-bold text-[#0D7377]">
                    ${bid.amount.toLocaleString()}
                  </div>
                </div>

                {bid.unit.currentBid && bid.unit.currentBid !== bid.amount && (
                  <div>
                    <div className="text-sm text-gray-600">Current Bid</div>
                    <div className="text-lg font-bold">
                      ${bid.unit.currentBid.toLocaleString()}
                    </div>
                  </div>
                )}

                {bid.unit.auctionActive && hoursRemaining > 0 && (
                  <div>
                    <div className="text-sm text-gray-600">Time Left</div>
                    <div className="text-lg font-bold text-red-600">
                      {daysRemaining > 0
                        ? `${daysRemaining}d ${hoursRemaining % 24}h`
                        : `${hoursRemaining}h`}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigate('unit', bid.unitId)}
                >
                  View Details
                </Button>
                {bid.status === 'active' && !bid.isWinning && (
                  <Button size="sm" className="bg-[#0D7377] hover:bg-[#0a5a5d]">
                    Increase Bid
                  </Button>
                )}
                {bid.status === 'accepted' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    View Lease
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Bids</h1>
            <p className="text-lg text-gray-600">Track all your rental bids in one place</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{activeBids.length}</div>
                    <div className="text-sm text-gray-600">Active Bids</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{wonBids.length}</div>
                    <div className="text-sm text-gray-600">Won</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {activeBids.filter((b) => b.isWinning).length}
                    </div>
                    <div className="text-sm text-gray-600">Winning</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0D7377]/10 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#0D7377]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userBids.length}</div>
                    <div className="text-sm text-gray-600">Total Bids</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by property or unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active ({activeBids.length})</TabsTrigger>
              <TabsTrigger value="won">Won ({wonBids.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({lostBids.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {activeBids.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Active Bids</h3>
                    <p className="text-gray-600 mb-6">
                      Start bidding on properties to see them here
                    </p>
                    <Button
                      className="bg-[#0D7377] hover:bg-[#0a5a5d]"
                      onClick={() => onNavigate('search')}
                    >
                      Browse Properties
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {activeBids.map((bid) => (
                    <BidCard key={bid.id} bid={bid} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="won" className="mt-6">
              {wonBids.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Won Bids Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Keep bidding! Your accepted bids will appear here
                    </p>
                    <Button
                      className="bg-[#0D7377] hover:bg-[#0a5a5d]"
                      onClick={() => onNavigate('search')}
                    >
                      Browse Properties
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {wonBids.map((bid) => (
                    <BidCard key={bid.id} bid={bid} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {lostBids.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Past Bids</h3>
                    <p className="text-gray-600">
                      Your rejected or outbid submissions will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {lostBids.map((bid) => (
                    <BidCard key={bid.id} bid={bid} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
