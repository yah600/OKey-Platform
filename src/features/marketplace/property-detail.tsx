import { ArrowLeft, MapPin, Calendar, Users, CheckCircle2, Star, TrendingUp, BedDouble, Bath, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPropertyById, getUnitsByPropertyId } from '@/lib/data/mockData';

interface PropertyDetailProps {
  propertyId: string;
  onNavigate: (route: string, id?: string) => void;
}

export function PropertyDetail({ propertyId, onNavigate }: PropertyDetailProps) {
  const property = getPropertyById(propertyId);
  const units = getUnitsByPropertyId(propertyId);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
          <Button onClick={() => onNavigate('marketplace')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const availableUnits = units.filter(u => u.status === 'available');
  const activeAuctions = units.filter(u => u.auctionActive);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image Gallery */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={property.images[0]}
          alt={property.buildingName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <Button
          variant="outline"
          className="absolute top-4 left-4 bg-white hover:bg-gray-100"
          onClick={() => onNavigate('marketplace')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{property.buildingName}</h1>
                <p className="text-lg flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5" />
                  {property.address}, {property.city}, {property.province}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold">{(property.buildingScore / 100).toFixed(1)}</span>
                </div>
                <div className="text-sm">Building Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#0D7377]">{property.totalUnits}</div>
              <div className="text-sm text-gray-600">Total Units</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#F4A261]">{availableUnits.length}</div>
              <div className="text-sm text-gray-600">Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#E76F51]">{property.occupancyRate}%</div>
              <div className="text-sm text-gray-600">Occupancy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#0D7377]">{property.yearBuilt}</div>
              <div className="text-sm text-gray-600">Year Built</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="units" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="units">Available Units ({availableUnits.length})</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="units" className="mt-6">
                <div className="space-y-4">
                  {availableUnits.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-gray-500">
                        No units currently available
                      </CardContent>
                    </Card>
                  ) : (
                    availableUnits.map((unit) => (
                      <Card
                        key={unit.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => onNavigate('unit', unit.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold mb-1">Unit {unit.unitNumber}</h3>
                              <p className="text-sm text-gray-600">Floor {unit.floor}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#0D7377]">
                                ${unit.askingPrice.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">per month</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <BedDouble className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{unit.bedrooms} beds</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Bath className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{unit.bathrooms} baths</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Square className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{unit.sqft} sqft</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {unit.features.slice(0, 4).map((feature, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {unit.features.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{unit.features.length - 4} more
                              </Badge>
                            )}
                          </div>

                          {unit.auctionActive && (
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">
                                  Live Auction - {unit.totalBids} bids
                                </span>
                              </div>
                              {unit.currentBid && (
                                <div className="text-sm">
                                  Current bid: <span className="font-bold">${unit.currentBid.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {!unit.auctionActive && unit.buyNowPrice && (
                            <div className="pt-4 border-t">
                              <div className="text-sm text-gray-600">
                                Buy Now: <span className="font-bold text-[#0D7377]">${unit.buyNowPrice.toLocaleString()}/mo</span>
                              </div>
                            </div>
                          )}

                          <Button className="w-full mt-4 bg-[#0D7377] hover:bg-[#0a5a5d]">
                            View Details & Bid
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Building Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {property.amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">About This Property</h3>
                    <p className="text-gray-700 mb-6">{property.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Year Built</div>
                        <div className="font-medium">{property.yearBuilt}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Units</div>
                        <div className="font-medium">{property.totalUnits}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Occupancy Rate</div>
                        <div className="font-medium">{property.occupancyRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Building Score</div>
                        <div className="font-medium flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          {(property.buildingScore / 100).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Property Owner</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0D7377] rounded-full flex items-center justify-center text-white font-bold">
                    {property.ownerName?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <div className="font-medium">{property.ownerName}</div>
                    <div className="text-sm text-gray-600">Property Owner</div>
                  </div>
                </div>

                {property.ownerScore && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-600 mb-1">Owner Score</div>
                    <div className="text-2xl font-bold text-[#0D7377]">{property.ownerScore}</div>
                    <div className="text-xs text-gray-500 mt-1">Verified & Trusted</div>
                  </div>
                )}

                {property.verified && (
                  <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verified Property</span>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-600">Price Range</div>
                    <div className="font-medium">{property.priceRange}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Available Date</div>
                    <div className="font-medium">
                      {availableUnits.length > 0
                        ? new Date(availableUnits[0].availableDate).toLocaleDateString()
                        : 'Contact owner'}
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-[#0D7377] hover:bg-[#0a5a5d]">
                  Contact Owner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
