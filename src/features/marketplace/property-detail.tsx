import { ArrowLeft, MapPin, Calendar, Users, CheckCircle2, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ScoreBadge } from '@/app/components/score-badge';
import { useBids } from '@/app/context/BidContext';
import { mockProperties } from '@/app/data/mockData';

interface BuildingDetailProps {
  propertyId: string;
  onBack: () => void;
  onUnitClick: (unitId: string) => void;
}

export function BuildingDetail({ propertyId, onBack, onUnitClick }: BuildingDetailProps) {
  const { units } = useBids();
  const property = mockProperties.find(p => p.id === propertyId);
  const buildingUnits = units.filter(u => u.buildingId === propertyId);

  if (!property) return null;

  const getStatusColor = (status: string) => {
    if (status === 'available') return 'bg-green-500';
    if (status === 'pending') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = (status: string) => {
    if (status === 'available') return 'Available';
    if (status === 'pending') return 'Pending';
    return 'Occupied';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image Gallery */}
      <div className="relative h-96 bg-gray-900">
        <img 
          src={property.image} 
          alt={property.buildingName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <Button
          variant="outline"
          className="absolute top-4 left-4 bg-white hover:bg-gray-100"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{property.buildingName}</h1>
                  {property.verified && (
                    <Badge className="bg-white text-[#0D7377]">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  {property.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Building Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <ScoreBadge score={property.buildingScore} size="md" />
              <p className="text-sm text-muted-foreground mt-2">Building Score</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#FEF3E8] rounded-full flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-[#F4A261]" />
                </div>
                <div className="text-3xl font-bold text-[#F4A261]">{property.ownerScore}</div>
                <p className="text-sm text-muted-foreground">Owner Score</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#E6F7F8] rounded-full flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-[#0D7377]" />
                </div>
                <div className="text-3xl font-bold">{property.availableUnits}</div>
                <p className="text-sm text-muted-foreground">Available Units</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#E6F7F8] rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-[#0D7377]" />
                </div>
                <div className="text-3xl font-bold">{property.occupancyRate}%</div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="units" className="space-y-6">
          <TabsList>
            <TabsTrigger value="units">Available Units ({buildingUnits.length})</TabsTrigger>
            <TabsTrigger value="overview">Building Overview</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buildingUnits.map((unit) => (
                <Card 
                  key={unit.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onUnitClick(unit.id)}
                >
                  <div className="relative h-48">
                    {unit.images[0] && (
                      <img 
                        src={unit.images[0]} 
                        alt={`Unit ${unit.unitNumber}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <Badge 
                      className={`absolute top-3 right-3 ${getStatusColor(unit.status)} text-white`}
                    >
                      {getStatusText(unit.status)}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">Unit {unit.unitNumber}</h3>
                      <Badge variant="outline">Floor {unit.floor}</Badge>
                    </div>

                    <div className="text-sm text-muted-foreground mb-3">
                      {unit.bedrooms} Bed | {unit.bathrooms} Bath | {unit.sqft} sq ft
                    </div>

                    {unit.status === 'available' && (
                      <>
                        <div className="mb-3">
                          <div className="text-sm text-muted-foreground">
                            {unit.type === 'rent' ? 'Starting Bid' : 'Asking Price'}
                          </div>
                          <div className="text-2xl font-bold text-[#0D7377]">
                            ${unit.askingPrice.toLocaleString()}{unit.type === 'rent' && '/mo'}
                          </div>
                          {unit.currentBid && (
                            <div className="text-sm text-[#E76F51] font-semibold">
                              Current bid: ${unit.currentBid.toLocaleString()}{unit.type === 'rent' && '/mo'}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-3 text-sm">
                          <span className="text-muted-foreground">Bids: {unit.totalBids}</span>
                          <span className="text-muted-foreground">Ends in {unit.auctionEndsIn}h</span>
                        </div>

                        <Button 
                          className="w-full bg-[#0D7377] hover:bg-[#0a5a5d]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnitClick(unit.id);
                          }}
                        >
                          View & Bid
                        </Button>
                      </>
                    )}

                    {unit.status !== 'available' && (
                      <div className="text-center py-4 text-muted-foreground">
                        Available {unit.availableDate}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview">
            <Card>
              <CardContent className="p-6">
                <p className="text-lg mb-6">{property.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Year Built</div>
                    <div className="font-semibold">{property.yearBuilt}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Units</div>
                    <div className="font-semibold">{property.totalUnits}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Price Range</div>
                    <div className="font-semibold">{property.priceRange}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amenities">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-[#0D7377]" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground py-8">
                  Reviews from verified tenants will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}