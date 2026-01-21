import {
  Building2, DollarSign, TrendingUp, Users, Key, AlertCircle,
  CheckCircle2, Clock, Star, Award, ArrowRight, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  mockProperties,
  mockUnits,
  mockBids,
  getBidsByUnitId,
  getUnitById,
} from '@/lib/data/mockData';

interface OwnerDashboardProps {
  onNavigate: (route: string, id?: string) => void;
}

export function OwnerDashboard({ onNavigate }: OwnerDashboardProps) {
  // Mock - in real app would get from auth context
  const ownerId = 'user-2';
  const ownerProperties = mockProperties.filter((p) => p.ownerId === ownerId);
  const ownerUnits = mockUnits.filter((u) =>
    ownerProperties.some((p) => p.id === u.propertyId)
  );

  // Get all bids for owner's units
  const allBids = ownerUnits.flatMap((unit) => getBidsByUnitId(unit.id));
  const pendingBids = allBids.filter((b) => b.status === 'active');
  const acceptedBids = allBids.filter((b) => b.status === 'accepted');

  const stats = {
    totalProperties: ownerProperties.length,
    totalUnits: ownerUnits.reduce((sum, u) => sum + 1, 0),
    availableUnits: ownerUnits.filter((u) => u.status === 'available').length,
    occupancyRate: Math.round(
      ((ownerUnits.length - ownerUnits.filter((u) => u.status === 'available').length) /
        ownerUnits.length) *
        100
    ),
    monthlyRevenue: ownerUnits.reduce((sum, u) => sum + (u.askingPrice || 0), 0),
    activeBids: pendingBids.length,
    ownerScore: 810,
  };

  const PendingBidCard = ({ bid }: { bid: typeof allBids[0] }) => {
    const unit = getUnitById(bid.unitId);
    if (!unit) return null;

    const property = ownerProperties.find((p) => p.id === unit.propertyId);
    if (!property) return null;

    const isHighestBid = unit.currentBid === bid.amount;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">
                Unit {unit.unitNumber} - {property.buildingName}
              </h3>
              <p className="text-sm text-gray-600">
                {unit.bedrooms} bed, {unit.bathrooms} bath • {unit.sqft} sqft
              </p>
            </div>
            {isHighestBid && (
              <Badge className="bg-green-500">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Highest Bid
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-[#0D7377] rounded-full flex items-center justify-center text-white font-bold text-lg">
              {bid.bidderName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-medium">{bid.bidderName}</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Score:</span>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{bid.bidderScore}</span>
                </div>
                {bid.bidderScore >= 700 && (
                  <Badge variant="secondary" className="text-xs">
                    Excellent
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Bid Amount</div>
              <div className="text-2xl font-bold text-[#0D7377]">
                ${bid.amount.toLocaleString()}
              </div>
              {unit.askingPrice && (
                <div className="text-xs text-gray-500">
                  +${(bid.amount - unit.askingPrice).toLocaleString()} above asking
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => {
                // In real app, would call API to accept bid
                alert(`Accepted bid from ${bid.bidderName} for $${bid.amount.toLocaleString()}`);
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Accept Bid
            </Button>
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button variant="destructive" onClick={() => alert('Bid rejected')}>
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Owner Dashboard</h1>
            <p className="text-lg text-gray-600">Manage your properties and review bids</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-[#E6F7F8] rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#0D7377]" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalProperties}</div>
                <div className="text-sm text-gray-600">Total Properties</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-[#FEF3E8] rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#F4A261]" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">
                  ${(stats.monthlyRevenue / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-[#E6F7F8] rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#0D7377]" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.occupancyRate}%</div>
                <div className="text-sm text-gray-600">Occupancy Rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-[#FDE8E4] rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#E76F51]" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.activeBids}</div>
                <div className="text-sm text-gray-600">Active Bids</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Pending Bids */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Pending Bids ({pendingBids.length})</span>
                    {pendingBids.length > 0 && (
                      <Badge variant="destructive" className="animate-pulse">
                        Action Required
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingBids.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No pending bids at the moment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingBids.slice(0, 5).map((bid) => (
                        <PendingBidCard key={bid.id} bid={bid} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Properties Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ownerProperties.map((property) => {
                      const propertyUnits = ownerUnits.filter((u) => u.propertyId === property.id);
                      const availableUnits = propertyUnits.filter((u) => u.status === 'available');

                      return (
                        <div
                          key={property.id}
                          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => onNavigate('property', property.id)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg">{property.buildingName}</h3>
                              <p className="text-sm text-gray-600">
                                {property.city}, {property.province}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">
                                {(property.buildingScore / 100).toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-xs text-gray-600">Total Units</div>
                              <div className="font-medium">{propertyUnits.length}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Available</div>
                              <div className="font-medium text-green-600">{availableUnits.length}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Occupancy</div>
                              <div className="font-medium">{property.occupancyRate}%</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => onNavigate('properties')}
                  >
                    View All Properties
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Owner Score */}
              <Card className="mb-6">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#0D7377] to-[#14FFEC] mb-3">
                      <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-[#0D7377]">{stats.ownerScore}</div>
                      </div>
                    </div>
                    <h3 className="font-bold mb-1">Your Owner Score</h3>
                    <p className="text-sm text-gray-600">Excellent standing</p>
                  </div>

                  <div className="text-left space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Response Time</span>
                      <Badge className="bg-green-500">Fast</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Property Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Verified</span>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  </div>

                  <Button variant="outline" className="w-full text-sm">
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="w-4 h-4 mr-2" />
                    List New Unit
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onNavigate('finances')}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    View Finances
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onNavigate('tenants')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Tenants
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
