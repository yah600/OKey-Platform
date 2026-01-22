import { useState, useEffect } from 'react';
import { Search, Building2, FileText, Key, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

export default function MarketplaceHome() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const featuredProperties = [
    {
      id: 1,
      name: 'Sunset Apartments',
      address: '123 Main St, Montreal, QC',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      units: 3,
      priceFrom: 1800,
      type: 'Apartment',
    },
    {
      id: 2,
      name: 'Downtown Plaza',
      address: '456 King St, Montreal, QC',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      units: 5,
      priceFrom: 2200,
      type: 'Condo',
    },
    {
      id: 3,
      name: 'Riverside Complex',
      address: '789 River Rd, Laval, QC',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      units: 2,
      priceFrom: 2500,
      type: 'House',
    },
  ];

  const howItWorks = [
    {
      icon: Search,
      title: 'Search Properties',
      description: 'Browse available properties and units that match your preferences.',
    },
    {
      icon: FileText,
      title: 'Submit Application',
      description: 'Apply with your O\'Key score and submit your bid for the unit.',
    },
    {
      icon: Key,
      title: 'Move In',
      description: 'Once approved, sign your lease digitally and move into your new home.',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-semibold mb-4">Find Your Next Home</h1>
            <p className="text-lg text-neutral-300 mb-8">
              Discover available properties, bid on units, and manage your rental—all in one place.
            </p>
            <Link to="/marketplace/search">
              <Button variant="primary" className="bg-white text-neutral-900 hover:bg-neutral-100">
                <Search className="w-4 h-4" />
                Start Searching
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Properties */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900">Featured Properties</h2>
              <p className="text-sm text-neutral-600 mt-1">Popular rentals in your area</p>
            </div>
            <Link to="/marketplace/search">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProperties.map((property) => (
              <Link key={property.id} to={`/marketplace/property/${property.id}`}>
                <Card padding="none" className="hover:border-neutral-300 transition-colors cursor-pointer overflow-hidden">
                  <div className="aspect-video bg-neutral-200 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-neutral-900">{property.name}</h3>
                        <p className="text-xs text-neutral-600">{property.address}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded">
                        {property.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                      <span className="text-sm text-neutral-600">{property.units} units available</span>
                      <span className="text-lg font-semibold text-neutral-900">
                        ${property.priceFrom}
                        <span className="text-xs text-neutral-500 font-normal">/mo</span>
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">How It Works</h2>
            <p className="text-sm text-neutral-600">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="text-center">
                <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-neutral-900 text-white text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          <h2 className="text-xl font-semibold mb-2">Ready to Find Your Home?</h2>
          <p className="text-neutral-300 mb-6">
            Browse hundreds of available units and start your application today.
          </p>
          <Link to="/marketplace/search">
            <Button variant="primary" className="bg-white text-neutral-900 hover:bg-neutral-100">
              Browse All Properties
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
