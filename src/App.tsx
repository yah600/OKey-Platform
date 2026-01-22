import { useState } from 'react';
import { motion } from 'motion/react';

function App() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-ios-blue/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-ios-purple/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl w-full"
        >
          {/* Liquid Glass Card */}
          <div className="relative">
            {/* Glassmorphism effect */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/20 shadow-glass-lg" />

            {/* Content */}
            <div className="relative p-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-ios-blue via-ios-purple to-ios-pink bg-clip-text text-transparent">
                  O'Key Platform
                </h1>
                <p className="text-2xl text-neutral-700">
                  Real Estate Reimagined
                </p>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: '🏠', title: 'Properties', desc: 'Manage your portfolio' },
                  { icon: '💰', title: 'Finances', desc: 'Track revenue & expenses' },
                  { icon: '👥', title: 'Tenants', desc: 'Resident management' },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    className="bg-white/50 backdrop-blur-md rounded-card p-6 border border-white/30 hover:bg-white/60 transition-all duration-300 hover:scale-105 hover:shadow-ios-lg"
                  >
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-neutral-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-ios-blue text-white rounded-button font-semibold shadow-ios hover:shadow-ios-lg transition-all duration-200"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/50 backdrop-blur-md text-neutral-900 rounded-button font-semibold border border-white/30 hover:bg-white/70 transition-all duration-200"
                >
                  Learn More
                </motion.button>
              </div>

              {/* Status */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-12 text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-ios-green/20 backdrop-blur-sm rounded-full border border-ios-green/30">
                  <div className="w-2 h-2 rounded-full bg-ios-green animate-pulse" />
                  <span className="text-sm font-medium text-ios-green">
                    New Liquid Glass Design • Built with Headless UI + Zustand
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center mt-8 text-neutral-600"
          >
            Powered by Headless UI + Tailwind CSS + Zustand + Motion
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
