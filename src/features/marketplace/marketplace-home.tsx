import { useState } from 'react';
import {
  Search, TrendingUp, Users, Key, MapPin, DollarSign, Home,
  Star, Shield, Clock, Award, Heart, Bell, Filter, ChevronRight,
  Building2, Zap, CheckCircle, ArrowRight, BedDouble, Bath, Square,
  TrendingDown, MessageCircle, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { mockProperties, getAvailableUnits, getActiveAuctions } from '@/lib/data/mockData';

interface MarketplaceHomeProps {
  onNavigate: (route: string, id?: string) => void;
}

export function MarketplaceHome({ onNavigate }: MarketplaceHomeProps) {
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const availableUnits = getAvailableUnits();
  const activeAuctions = getActiveAuctions();

  const stats = [
    { value: `${mockProperties.length}`, label: 'Active Properties', icon: Building2, color: '#0D7377', change: '+12%' },
    { value: `${availableUnits.length}`, label: 'Units Available', icon: Key, color: '#F4A261', change: '+18%' },
    { value: `${activeAuctions.length}`, label: 'Live Auctions', icon: TrendingUp, color: '#E76F51', change: '+0.3' },
    { value: '24/7', label: 'Support Available', icon: Clock, color: '#0D7377', change: 'Always' },
  ];

  const categories = [
    { id: 'all', label: 'All Properties', count: mockProperties.length },
    { id: 'downtown', label: 'Downtown', count: mockProperties.length },
    { id: 'waterfront', label: 'Waterfront', count: 1 },
    { id: 'historic', label: 'Historic', count: 1 },
  ];

  const features = [
    {
      icon: <Shield className="w-12 h-12 text-[#0D7377]" />,
      title: 'Verified Properties',
      description: 'All properties verified and scored for quality and safety',
    },
    {
      icon: <DollarSign className="w-12 h-12 text-[#F4A261]" />,
      title: 'Fair Pricing',
      description: 'Market-driven auction bidding ensures fair rental prices',
    },
    {
      icon: <Star className="w-12 h-12 text-[#E76F51]" />,
      title: 'Score-Based Matching',
      description: 'Your O\'Key score qualifies you for premium properties',
    },
    {
      icon: <Zap className="w-12 h-12 text-[#0D7377]" />,
      title: 'Instant Approval',
      description: 'Fast-track rental process with automated approvals',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0D7377] to-[#14FFEC] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Perfect Home
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Bid on premium rentals. Build your O'Key score. Secure your future.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-4 shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Montreal, Quebec"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12 text-gray-900"
                  />
                </div>
                <Select defaultValue="rent">
                  <SelectTrigger className="md:w-[180px] h-12 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="buy">For Sale</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="lg"
                  className="bg-[#0D7377] hover:bg-[#0a5a5d] h-12"
                  onClick={() => onNavigate('search')}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </motion.div>

            {/* Quick Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedCategory === cat.id ? 'secondary' : 'outline'}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 transition-all duration-300"
                  >
                    {cat.label}
                    <Badge variant="secondary" className="ml-2 bg-white/20">
                      {cat.count}
                    </Badge>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center cursor-pointer"
              >
                <div className="flex justify-center mb-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon className="w-8 h-8 transition-transform duration-300 hover:scale-110" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium mt-1">{stat.change}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
              <p className="text-gray-600">Explore our top-rated buildings with available units</p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('search')}>
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="h-full"
              >
                <Card
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
                  onClick={() => onNavigate('property', property.id)}
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden group">
                    <img
                      src={property.images[0]}
                      alt={property.buildingName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {property.verified && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                    {property.availableUnits > 0 && (
                      <div className="absolute bottom-4 left-4 bg-[#0D7377] text-white px-3 py-1 rounded-full text-xs font-medium">
                        {property.availableUnits} units available
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{property.buildingName}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.city}, {property.province}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{(property.buildingScore / 100).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-[#0D7377]">{property.priceRange}</div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.amenities.slice(0, 3).map((amenity, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full bg-[#0D7377] hover:bg-[#0a5a5d]">
                      View Property
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose O'Key?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing real estate with transparency, fairness, and trust
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:bg-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#0D7377] to-[#14FFEC] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Home?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of renters building their future with O'Key
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#0D7377] hover:bg-gray-100"
              onClick={() => onNavigate('search')}
            >
              Browse Properties
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => onNavigate('score')}
            >
              Check Your Score
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
