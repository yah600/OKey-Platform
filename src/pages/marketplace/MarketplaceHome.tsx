import { motion } from 'motion/react';
import { Building2, DollarSign, Users } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function MarketplaceHome() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-md border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-ios-blue to-ios-purple bg-clip-text text-transparent">
            O'Key Platform
          </h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-neutral-600">
                  Welcome, {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-4">Find Your Perfect Property</h2>
          <p className="text-xl text-neutral-600">Revolutionary all-in-one real estate platform</p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Building2, title: 'Properties', count: '1,234', color: 'ios-blue' },
            { icon: DollarSign, title: 'Avg. Rent', count: '$2,500', color: 'ios-green' },
            { icon: Users, title: 'Happy Tenants', count: '5,678', color: 'ios-purple' },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" hover>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-ios bg-${stat.color}/10`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.count}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Card variant="glass" padding="lg" className="inline-block">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-neutral-600 mb-6">
              Join thousands of property owners and tenants using O'Key
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary">Browse Properties</Button>
              <Button variant="secondary">List Your Property</Button>
            </div>
          </Card>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ios-green/20 backdrop-blur-sm rounded-full border border-ios-green/30">
            <div className="w-2 h-2 rounded-full bg-ios-green animate-pulse" />
            <span className="text-sm font-medium text-ios-green">
              ✨ New Liquid Glass Design • Rebuilt from Scratch
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
