import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, User, LogIn, UserPlus, Building2, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

interface MarketplaceLayoutProps {
  children: ReactNode;
}

export default function MarketplaceLayout({ children }: MarketplaceLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-neutral-900" />
              <span className="text-xl font-semibold text-neutral-900">O'Key Platform</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </div>
              </Link>
              <Link
                to="/marketplace/search"
                className={`text-sm font-medium transition-colors ${
                  isActive('/marketplace/search')
                    ? 'text-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Properties
                </div>
              </Link>
              {isAuthenticated && (
                <Link
                  to="/marketplace/my-bids"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/marketplace/my-bids')
                      ? 'text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  My Bids
                </Link>
              )}
            </nav>

            {/* Auth & Portal Access */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Quick Portal Access */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (user?.role === 'tenant') {
                        navigate('/tenant/dashboard');
                      } else if (user?.role === 'owner') {
                        navigate('/owner/dashboard');
                      }
                    }}
                  >
                    <Users className="w-4 h-4" />
                    {user?.role === 'tenant' ? 'Tenant Portal' : 'Owner Portal'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    <User className="w-4 h-4" />
                    {user?.name}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">O'Key Platform</h3>
              <p className="text-sm text-neutral-400">
                Modern rental marketplace connecting tenants with quality properties.
              </p>
            </div>

            {/* For Tenants */}
            <div>
              <h4 className="font-medium mb-4 text-sm">For Tenants</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link to="/marketplace/search" className="hover:text-white">
                    Search Properties
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Owners */}
            <div>
              <h4 className="font-medium mb-4 text-sm">For Owners</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link to="/signup" className="hover:text-white">
                    List Property
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white">
                    Owner Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-medium mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link to="/compliance/owner-responsibilities" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/compliance/owner-responsibilities" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-500">
            © 2026 O'Key Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
