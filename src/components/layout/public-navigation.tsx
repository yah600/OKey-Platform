import { Home, Search, TrendingUp, User, Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/types';

interface PublicNavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  user: UserType | null;
}

export function PublicNavigation({ currentRoute, onNavigate, user }: PublicNavigationProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('marketplace')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="text-xl font-bold">O'Key Platform</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant={currentRoute === 'marketplace' ? 'default' : 'ghost'}
                onClick={() => onNavigate('marketplace')}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                variant={currentRoute === 'search' ? 'default' : 'ghost'}
                onClick={() => onNavigate('search')}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              {user && (
                <>
                  <Button
                    variant={currentRoute === 'my-bids' ? 'default' : 'ghost'}
                    onClick={() => onNavigate('my-bids')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    My Bids
                  </Button>
                  <Button
                    variant={currentRoute === 'score' ? 'default' : 'ghost'}
                    onClick={() => onNavigate('score')}
                  >
                    Score
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (user.role === 'tenant') onNavigate('tenant-dashboard');
                    else if (user.role === 'owner' || user.role === 'property_manager') onNavigate('owner-dashboard');
                  }}
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => onNavigate('login')}>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
