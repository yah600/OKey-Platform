import React, { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { useTranslation } from '../../lib/i18n/i18n-context';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// Logo will be inline SVG

export function LoginPage() {
  const { signIn, loading, error, clearError } = useAuth();
  const { t, language } = useTranslation();
  const [email, setEmail] = useState('admin@immolink.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoAccounts = [
    { email: 'admin@immolink.com', password: 'admin123', role: language === 'fr' ? 'Super Admin' : 'Super Admin' },
    { email: 'manager@immolink.com', password: 'manager123', role: language === 'fr' ? 'Gestionnaire' : 'Property Manager' },
    { email: 'owner@immolink.com', password: 'owner123', role: language === 'fr' ? 'Propriétaire' : 'Owner' },
    { email: 'tenant@immolink.com', password: 'tenant123', role: language === 'fr' ? 'Locataire' : 'Tenant' },
  ];

  const handleDemoLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  useEffect(() => {
    // Clear error when inputs change
    if (error) {
      clearError();
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ 
        background: 'var(--color-background)',
        padding: 'var(--spacing-6)',
      }}
    >
      {/* Animated liquid glass background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
            opacity: 0.08,
            top: '-400px',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
            opacity: 0.06,
            bottom: '-300px',
            right: '10%',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.06, 0.1, 0.06],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main content container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-8)',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/logos/immolink-wordmark.svg"
            alt="Immolink Logo"
            style={{
              width: '180px',
              height: 'auto',
              filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.1))',
            }}
          />
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
          style={{ 
            background: 'var(--color-card)',
            backdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--spacing-10)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Title and Description */}
          <div 
            style={{ 
              textAlign: 'center',
              marginBottom: 'var(--spacing-8)',
            }}
          >
            <h2 style={{ 
              fontFamily: 'var(--font-family-inter)',
              color: 'var(--color-foreground)',
              marginBottom: 'var(--spacing-2)',
            }}>
              {language === 'fr' ? 'Bienvenue' : 'Welcome Back'}
            </h2>
            <p style={{ 
              color: 'var(--color-muted-foreground)',
              fontSize: 'var(--text-base)',
              fontFamily: 'var(--font-family-asta-sans)',
            }}>
              {language === 'fr' 
                ? 'Connectez-vous à votre portail de gestion'
                : 'Sign in to your management portal'}
            </p>
          </div>

          {/* Error Alert */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 'var(--spacing-6)' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--spacing-4)',
                }}
              >
                <p style={{ 
                  color: 'var(--color-destructive)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-family-asta-sans)',
                  textAlign: 'center',
                }}>
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
              {/* Email Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label 
                  htmlFor="email" 
                  style={{ 
                    fontFamily: 'var(--font-family-inter)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {language === 'fr' ? 'Adresse courriel' : 'Email Address'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'fr' ? 'vous@exemple.com' : 'you@example.com'}
                  required
                  disabled={isSubmitting}
                  style={{ 
                    fontFamily: 'var(--font-family-asta-sans)',
                    height: '48px',
                    backgroundColor: 'var(--color-input-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                  }}
                />
              </div>

              {/* Password Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label 
                  htmlFor="password" 
                  style={{ 
                    fontFamily: 'var(--font-family-inter)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {language === 'fr' ? 'Mot de passe' : 'Password'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isSubmitting}
                    style={{ 
                      fontFamily: 'var(--font-family-asta-sans)',
                      height: '48px',
                      paddingRight: '48px',
                      backgroundColor: 'var(--color-input-background)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{
                      color: 'var(--color-muted-foreground)',
                    }}
                    disabled={isSubmitting}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-foreground)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted-foreground)'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isSubmitting || !email || !password}
                style={{ 
                  fontFamily: 'var(--font-family-asta-sans)',
                  height: '48px',
                  marginTop: 'var(--spacing-2)',
                  borderRadius: 'var(--radius-button)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                    <span style={{ fontFamily: 'var(--font-family-asta-sans)' }}>
                      {language === 'fr' ? 'Connexion...' : 'Signing in...'}
                    </span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span style={{ fontFamily: 'var(--font-family-asta-sans)' }}>
                      {language === 'fr' ? 'Se connecter' : 'Sign In'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Forgot Password Link */}
          <div
            style={{
              marginTop: 'var(--spacing-6)',
              textAlign: 'center',
            }}
          >
            <button
              type="button"
              className="transition-all"
              onClick={() => {
                window.history.pushState({}, '', '/forgot-password');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              style={{
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-family-asta-sans)',
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              {language === 'fr' ? 'Mot de passe oublié ?' : 'Forgot Password?'}
            </button>
          </div>

          {/* Demo Accounts */}
          <div 
            style={{ 
              marginTop: 'var(--spacing-6)',
              textAlign: 'center',
            }}
          >
            <p style={{ 
              fontSize: 'var(--text-sm)',
              color: 'var(--color-muted-foreground)',
              fontFamily: 'var(--font-family-asta-sans)',
            }}>
              {language === 'fr' ? 'Comptes démo disponibles' : 'Demo Accounts Available'}
            </p>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)',
            }}>
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  type="button"
                  className="transition-all"
                  style={{ 
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-family-asta-sans)',
                    color: 'var(--color-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  onClick={() => handleDemoLogin(account.email, account.password)}
                >
                  {account.role}: {account.email}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-2)',
          }}
        >
          <p style={{ 
            fontSize: 'var(--text-sm)',
            color: 'var(--color-muted-foreground)',
            fontFamily: 'var(--font-family-asta-sans)',
          }}>
            © 2025 Immolink
          </p>
          <p style={{ 
            fontSize: 'var(--text-sm)',
            color: 'var(--color-muted-foreground)',
            fontFamily: 'var(--font-family-asta-sans)',
          }}>
            {language === 'fr' ? 'Système de gestion de copropriété du Québec' : 'Quebec Condominium Management System'}
          </p>
          <p style={{ 
            fontSize: 'var(--text-xs)',
            color: 'var(--color-muted-foreground)',
            fontFamily: 'var(--font-family-asta-sans)',
            opacity: 0.7,
          }}>
            Powered by{' '}
            <a 
              href="https://synergair.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Synergair
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}