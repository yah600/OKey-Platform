import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Home, Search, TrendingUp, Briefcase, Building2 } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from '@/components/global/ThemeToggle';

export function MainLayout() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    signOut();
    navigate('/auth/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">O'Key Platform</span>
                <div className="text-xs text-gray-500 -mt-1">Property Management</div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {/* Main Navigation Links */}
              <div className="flex gap-2">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    isActive('/')
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Marketplace</span>
                </Link>
                <Link
                  to="/search"
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    isActive('/search')
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      to="/score"
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                        isActive('/score')
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>My Score</span>
                    </Link>
                    <Link
                      to="/my-bids"
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                        isActive('/my-bids')
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>My Bids</span>
                    </Link>
                  </>
                )}
              </div>

              {isAuthenticated && (
                <>
                  <div className="h-8 w-px bg-gray-300"></div>

                  {/* Role-based Portal Links */}
                  <div className="flex gap-2">
                    {user?.role === 'tenant' && (
                      <Link
                        to="/tenant"
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          location.pathname.startsWith('/tenant')
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        Tenant Portal
                      </Link>
                    )}
                    {['owner', 'property_manager', 'super_admin'].includes(user?.role || '') && (
                      <Link
                        to="/dashboard"
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                          location.pathname.startsWith('/dashboard') ||
                          location.pathname.startsWith('/properties') ||
                          location.pathname.startsWith('/finances') ||
                          location.pathname.startsWith('/maintenance') ||
                          location.pathname.startsWith('/residents') ||
                          location.pathname.startsWith('/documents')
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Owner Portal</span>
                      </Link>
                    )}
                  </div>

                  <div className="h-8 w-px bg-gray-300"></div>

                  {/* Theme Toggle */}
                  <ThemeToggle />

                  <div className="h-8 w-px bg-gray-300"></div>

                  {/* User Menu */}
                  <div className="flex items-center gap-3">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-900">
                          {user?.full_name}
                        </div>
                        <div className="text-xs text-gray-600 capitalize">
                          {user?.role?.replace('_', ' ')}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <Link
                  to="/auth/login"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
