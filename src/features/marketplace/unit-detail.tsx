import { useState } from 'react';
import {
  ArrowLeft, MapPin, BedDouble, Bath, Square, Calendar, TrendingUp,
  Clock, DollarSign, Shield, AlertCircle, CheckCircle2, Users, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { getUnitById, getPropertyById, getBidsByUnitId, mockUsers } from '@/lib/data/mockData';
import { useBids } from '@/context/BidContext';

interface UnitDetailProps {
  unitId: string;
  onNavigate: (route: string, id?: string) => void;
}

export function UnitDetail({ unitId, onNavigate }: UnitDetailProps) {
  const unit = getUnitById(unitId);
  const property = unit ? getPropertyById(unit.propertyId) : null;
  const bids = unit ? getBidsByUnitId(unitId) : [];
  const { placeBid } = useBids();

  const [bidAmount, setBidAmount] = useState<string>('');
  const [autoBid, setAutoBid] = useState(false);
  const [maxAutoBid, setMaxAutoBid] = useState<string>('');
  const [showBidSuccess, setShowBidSuccess] = useState(false);

  // Mock user score - in real app this would come from auth context
  const mockUserScore = 720;
  const meetsMinScore = mockUserScore >= (unit?.minScore || 0);

  if (!unit || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Unit Not Found</h2>
          <Button onClick={() => onNavigate('marketplace')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= (unit.currentBid || unit.askingPrice)) {
      return;
    }

    const success = placeBid(unitId, amount, autoBid);
    if (success) {
      setShowBidSuccess(true);
      setBidAmount('');
      setTimeout(() => setShowBidSuccess(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (unit.buyNowPrice) {
      placeBid(unitId, unit.buyNowPrice, false);
      setShowBidSuccess(true);
      setTimeout(() => {
        onNavigate('my-bids');
      }, 2000);
    }
  };

  const minBidAmount = unit.currentBid
    ? unit.currentBid + 50
    : unit.askingPrice;

  const timeRemaining = unit.auctionEndsAt
    ? new Date(unit.auctionEndsAt).getTime() - Date.now()
    : 0;
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const daysRemaining = Math.floor(hoursRemaining / 24);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onNavigate('property', property.id)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {property.buildingName}
            </Button>
            <div className="flex items-center gap-2">
              {unit.auctionActive && (
                <Badge variant="destructive" className="animate-pulse">
                  Live Auction
                </Badge>
              )}
              {unit.verified && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={unit.images[0]}
                  alt={`Unit ${unit.unitNumber}`}
                  className="w-full h-full object-cover"
                />
                {unit.auctionActive && hoursRemaining > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                    <Clock className="w-4 h-4 inline mr-2" />
                    {daysRemaining > 0
                      ? `${daysRemaining}d ${hoursRemaining % 24}h remaining`
                      : `${hoursRemaining}h remaining`}
                  </div>
                )}
              </div>
              {unit.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {unit.images.slice(1).map((img, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg overflow-hidden">
                      <img src={img} alt={`View ${i + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Unit Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Unit {unit.unitNumber} - {property.buildingName}
              </h1>
              <p className="text-gray-600 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" />
                {property.address}, {property.city}, {property.province}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <BedDouble className="w-6 h-6 text-[#0D7377]" />
                  <div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                    <div className="font-bold">{unit.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Bath className="w-6 h-6 text-[#F4A261]" />
                  <div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                    <div className="font-bold">{unit.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Square className="w-6 h-6 text-[#E76F51]" />
                  <div>
                    <div className="text-sm text-gray-600">Square Feet</div>
                    <div className="font-bold">{unit.sqft}</div>
                  </div>
                </div>
              </div>

              {unit.description && (
                <p className="text-gray-700 mb-6">{unit.description}</p>
              )}

              <div>
                <h3 className="font-bold mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {unit.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="bids" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bids">Bid History ({bids.length})</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="bids" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Bids</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bids.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No bids yet. Be the first to bid!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {bids.map((bid, i) => (
                          <div
                            key={bid.id}
                            className={`flex items-center justify-between p-4 rounded-lg ${
                              i === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#0D7377] rounded-full flex items-center justify-center text-white font-bold">
                                {bid.bidderName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{bid.bidderName}</div>
                                <div className="text-sm text-gray-600">
                                  Score: {bid.bidderScore}
                                  {bid.autoBid && (
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                      Auto-bid
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-[#0D7377]">
                                ${bid.amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(bid.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Unit Number</div>
                        <div className="font-medium">{unit.unitNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Floor</div>
                        <div className="font-medium">{unit.floor}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Available Date</div>
                        <div className="font-medium">
                          {new Date(unit.availableDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Minimum Score Required</div>
                        <div className="font-medium flex items-center gap-2">
                          {unit.minScore}
                          {meetsMinScore ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Bidding Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {showBidSuccess && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Your bid has been placed successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-1">Monthly Rent</div>
                  <div className="text-3xl font-bold text-[#0D7377]">
                    ${unit.askingPrice.toLocaleString()}
                  </div>
                  {unit.currentBid && (
                    <div className="text-sm text-gray-600 mt-1">
                      Current bid: ${unit.currentBid.toLocaleString()}
                    </div>
                  )}
                </div>

                {!meetsMinScore && (
                  <Alert className="mb-4 bg-yellow-50 border-yellow-200">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Your score ({mockUserScore}) is below the minimum required ({unit.minScore}).
                      <Button
                        variant="link"
                        className="p-0 h-auto text-yellow-800 underline ml-1"
                        onClick={() => onNavigate('score')}
                      >
                        Improve your score
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {unit.auctionActive ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Bid Amount
                      </label>
                      <Input
                        type="number"
                        placeholder={`Min: $${minBidAmount.toLocaleString()}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={minBidAmount}
                        disabled={!meetsMinScore}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum bid: ${minBidAmount.toLocaleString()}
                      </p>
                    </div>

                    <Button
                      className="w-full bg-[#0D7377] hover:bg-[#0a5a5d]"
                      onClick={handlePlaceBid}
                      disabled={!bidAmount || parseFloat(bidAmount) < minBidAmount || !meetsMinScore}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Place Bid
                    </Button>

                    {unit.buyNowPrice && (
                      <>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-2 text-gray-500">or</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377] hover:text-white"
                          onClick={handleBuyNow}
                          disabled={!meetsMinScore}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Buy Now - ${unit.buyNowPrice.toLocaleString()}/mo
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <Button
                    className="w-full bg-[#0D7377] hover:bg-[#0a5a5d]"
                    disabled={!meetsMinScore}
                  >
                    Apply Now
                  </Button>
                )}

                {unit.auctionActive && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Total Bids</span>
                      <span className="font-medium">{unit.totalBids}</span>
                    </div>
                    {hoursRemaining > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Time Remaining</span>
                        <span className="font-medium text-red-600">
                          {daysRemaining > 0
                            ? `${daysRemaining}d ${hoursRemaining % 24}h`
                            : `${hoursRemaining}h`}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">Secure bidding powered by O'Key</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">Verified property and owner</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">Fair and transparent process</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
