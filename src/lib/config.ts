/**
 * Application Configuration
 * Typed configuration object from environment variables
 */

export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || "O'Key Platform",
    version: import.meta.env.VITE_APP_VERSION || '2.0.0',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  },
  features: {
    darkMode: import.meta.env.VITE_FEATURE_FLAG_DARK_MODE === 'true',
    i18n: import.meta.env.VITE_FEATURE_FLAG_I18N === 'true',
    onboarding: import.meta.env.VITE_FEATURE_FLAG_ONBOARDING === 'true',
    analytics: import.meta.env.VITE_FEATURE_FLAG_ANALYTICS === 'true',
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
} as const;

// Type-safe config access
export type Config = typeof config;
