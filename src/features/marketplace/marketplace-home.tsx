import { useState } from 'react';
import {
  Search, TrendingUp, Key, MapPin, DollarSign, Home,
  Star, Shield, Clock, CheckCircle, ArrowRight, BedDouble, Bath,
  MessageCircle, Eye, FileCheck, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { getAvailableUnits, getPropertyById } from '@/lib/data/mockData';

interface MarketplaceHomeProps {
  onNavigate: (route: string, id?: string) => void;
}

export function MarketplaceHome({ onNavigate }: MarketplaceHomeProps) {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('any');
  const [propertyType, setPropertyType] = useState('any');

  const availableUnits = getAvailableUnits().slice(0, 8); // Get first 8 units

  const handleSearch = () => {
    // Build query string with search parameters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (priceRange && priceRange !== 'any') params.append('price', priceRange);
    if (propertyType && propertyType !== 'any') params.append('type', propertyType);

    const queryString = params.toString();
    onNavigate('search', queryString ? `?${queryString}` : '');
  };

  // How It Works steps
  const steps = [
    {
      number: '1',
      icon: Search,
      title: 'Search & Discover',
      description: 'Browse through hundreds of verified properties. Filter by location, price, amenities, and more.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '2',
      icon: DollarSign,
      title: 'Place Your Bid',
      description: 'Found your dream place? Submit your bid along with your O\'Key score to stand out from other applicants.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      number: '3',
      icon: Key,
      title: 'Move In',
      description: 'Once accepted, sign your lease digitally and coordinate your move-in date. It\'s that simple!',
      color: 'from-green-500 to-green-600'
    }
  ];

  // Benefits
  const benefits = [
    {
      icon: Eye,
      title: 'Know Where You Stand',
      description: 'See current bids and your ranking. No more waiting in the dark wondering if your application was seen.',
      color: 'blue'
    },
    {
      icon: Star,
      title: 'One Score, Multiple Applications',
      description: 'Build your tenant profile once. Your O\'Key score works for every application, saving you time and paperwork.',
      color: 'purple'
    },
    {
      icon: FileCheck,
      title: '100% Digital Process',
      description: 'From search to lease signing, everything happens online. No need for in-person visits or paper forms.',
      color: 'green'
    },
    {
      icon: MessageCircle,
      title: 'Connect Directly',
      description: 'Message property managers directly. Get answers fast without middlemen or agents.',
      color: 'orange'
    }
  ];

  // Statistics
  const stats = [
    { value: '500+', label: 'Properties Available' },
    { value: '2,000+', label: 'Active Bidders' },
    { value: '10,000+', label: 'Successful Placements' },
    { value: '7 days', label: 'Average Time to Lease' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Perfect Home with O'Key
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-white/90">
                Search, bid, and secure your next rental — all in one platform
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Where do you want to live?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-11 h-12 text-gray-900 border-gray-200"
                  />
                </div>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="md:w-[180px] h-12 text-gray-900">
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any price</SelectItem>
                    <SelectItem value="1000-1500">$1,000 - $1,500</SelectItem>
                    <SelectItem value="1500-2000">$1,500 - $2,000</SelectItem>
                    <SelectItem value="2000-2500">$2,000 - $2,500</SelectItem>
                    <SelectItem value="2500+">$2,500+</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="md:w-[180px] h-12 text-gray-900">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any type</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: '500+ Properties', icon: Home },
                { label: '10,000+ Happy Tenants', icon: Star },
                { label: 'Average Score: 78', icon: TrendingUp },
                { label: '98% Satisfaction', icon: CheckCircle }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <stat.icon className="w-6 h-6 mb-2 mx-auto" />
                  <p className="text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How O'Key Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your journey to a new home in 3 simple steps
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative"
              >
                <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
                  <div className="text-center">
                    {/* Number Badge */}
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-2xl font-bold shadow-lg`}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-gray-700" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </Card>

                {/* Arrow between steps (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Properties</h2>
              <p className="text-xl text-gray-600">Hand-picked properties available for bidding now</p>
            </motion.div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('search')}
              className="hidden md:flex"
            >
              View All Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableUnits.map((unit, index) => {
              const property = getPropertyById(unit.property_id);
              if (!property) return null;

              return (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Card
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full group"
                    onClick={() => onNavigate('unit', unit.id)}
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={unit.photos?.[0] || property.photos[0]}
                        alt={`${property.name} - Unit ${unit.unit_number}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {unit.pet_friendly && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Pet Friendly
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-5">
                      {/* Price */}
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-blue-600">
                          ${unit.monthly_rent.toLocaleString()}
                          <span className="text-sm font-normal text-gray-500">/month</span>
                        </div>
                      </div>

                      {/* Property Info */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{property.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {property.address.city}, {property.address.province}
                      </p>

                      {/* Unit Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <BedDouble className="w-4 h-4" />
                          <span>{unit.bedrooms} BR</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{unit.bathrooms} BA</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          <span>{unit.square_feet} ft²</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {unit.utilities_included?.slice(0, 2).map((utility, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {utility}
                          </Badge>
                        ))}
                        {unit.parking_spaces > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Parking
                          </Badge>
                        )}
                      </div>

                      {/* View Button */}
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-10 text-center md:hidden">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('search')}
              className="w-full"
            >
              View All Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose O'Key?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of rental housing with transparency and trust
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className={`w-20 h-20 rounded-full bg-${benefit.color}-100 flex items-center justify-center`}>
                    <benefit.icon className={`w-10 h-10 text-${benefit.color}-600`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Find Your Next Home?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Start browsing available properties and place your first bid today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6"
                onClick={() => onNavigate('search')}
              >
                Start Searching
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
