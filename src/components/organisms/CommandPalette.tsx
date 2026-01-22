import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Hash, FileText, Home, DollarSign, Wrench, Mail, Building2, Users, BarChart3, Calendar, TrendingUp, Settings, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  category: string;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const commands: Command[] = useMemo(() => {
    const baseCommands: Command[] = [
      {
        id: 'marketplace-home',
        label: 'Browse Marketplace',
        description: 'Search for properties and units',
        icon: <Home className="w-5 h-5" />,
        category: 'Marketplace',
        action: () => navigate('/'),
        keywords: ['browse', 'search', 'properties', 'marketplace'],
      },
      {
        id: 'property-search',
        label: 'Property Search',
        description: 'Advanced property search',
        icon: <Building2 className="w-5 h-5" />,
        category: 'Marketplace',
        action: () => navigate('/marketplace/search'),
        keywords: ['search', 'find', 'properties'],
      },
    ];

    if (user?.role === 'tenant') {
      baseCommands.push(
        {
          id: 'tenant-dashboard',
          label: 'Dashboard',
          description: 'Go to tenant dashboard',
          icon: <Home className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/tenant/dashboard'),
          keywords: ['home', 'dashboard'],
        },
        {
          id: 'tenant-payments',
          label: 'Payments',
          description: 'View and make payments',
          icon: <DollarSign className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/tenant/payments'),
          keywords: ['pay', 'rent', 'bills'],
        },
        {
          id: 'tenant-maintenance',
          label: 'Maintenance Requests',
          description: 'Submit and track requests',
          icon: <Wrench className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/tenant/maintenance'),
          keywords: ['fix', 'repair', 'issue'],
        },
        {
          id: 'tenant-documents',
          label: 'Documents',
          description: 'Access your documents',
          icon: <FileText className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/tenant/documents'),
          keywords: ['files', 'lease', 'documents'],
        },
        {
          id: 'tenant-messages',
          label: 'Messages',
          description: 'View your messages',
          icon: <Mail className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/tenant/messages'),
          keywords: ['chat', 'messages', 'inbox'],
        },
        {
          id: 'tenant-profile',
          label: 'My Profile',
          description: 'View and edit your profile',
          icon: <Users className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/tenant/profile'),
          keywords: ['profile', 'settings', 'account'],
        },
        {
          id: 'my-bids',
          label: 'My Bids',
          description: 'Track your rental bids',
          icon: <TrendingUp className="w-5 h-5" />,
          category: 'Marketplace',
          action: () => navigate('/marketplace/my-bids'),
          keywords: ['bids', 'applications'],
        }
      );
    }

    if (user?.role === 'owner' || user?.role === 'admin') {
      baseCommands.push(
        {
          id: 'owner-dashboard',
          label: 'Dashboard',
          description: 'Go to owner dashboard',
          icon: <Home className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/owner/dashboard'),
          keywords: ['home', 'dashboard'],
        },
        {
          id: 'owner-properties',
          label: 'Properties',
          description: 'Manage your properties',
          icon: <Building2 className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/owner/properties'),
          keywords: ['properties', 'buildings'],
        },
        {
          id: 'owner-residents',
          label: 'Residents',
          description: 'Manage tenants and residents',
          icon: <Users className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/owner/residents'),
          keywords: ['tenants', 'residents', 'people'],
        },
        {
          id: 'owner-financials',
          label: 'Financials',
          description: 'View financial reports',
          icon: <BarChart3 className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/owner/financials'),
          keywords: ['money', 'finances', 'reports'],
        },
        {
          id: 'owner-maintenance',
          label: 'Maintenance',
          description: 'Manage maintenance requests',
          icon: <Wrench className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/owner/maintenance'),
          keywords: ['fix', 'repair', 'maintenance'],
        },
        {
          id: 'owner-documents',
          label: 'Documents',
          description: 'Manage documents',
          icon: <FileText className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/owner/documents'),
          keywords: ['files', 'documents'],
        },
        {
          id: 'owner-meetings',
          label: 'Meetings & Governance',
          description: 'Schedule meetings and votes',
          icon: <Calendar className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/owner/meetings'),
          keywords: ['meetings', 'votes', 'governance'],
        },
        {
          id: 'owner-analytics',
          label: 'Portfolio Analytics',
          description: 'View analytics and insights',
          icon: <TrendingUp className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/owner/analytics'),
          keywords: ['analytics', 'insights', 'performance'],
        },
        {
          id: 'owner-settings',
          label: 'Settings',
          description: 'Configure your account',
          icon: <Settings className="w-5 h-5" />,
          category: 'Navigation',
          action: () => navigate('/owner/settings'),
          keywords: ['settings', 'preferences'],
        }
      );
    }

    baseCommands.push({
      id: 'help',
      label: 'Help Center',
      description: 'Get help and support',
      icon: <HelpCircle className="w-5 h-5" />,
      category: 'Support',
      action: () => navigate('/help'),
      keywords: ['help', 'support', 'faq'],
    });

    return baseCommands;
  }, [user, navigate]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter((cmd) => {
      const labelMatch = cmd.label.toLowerCase().includes(searchLower);
      const descMatch = cmd.description?.toLowerCase().includes(searchLower);
      const keywordMatch = cmd.keywords?.some((k) => k.toLowerCase().includes(searchLower));
      return labelMatch || descMatch || keywordMatch;
    });
  }, [commands, search]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden animate-slideInUp">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 text-sm outline-none placeholder:text-neutral-400"
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-neutral-600">No commands found</p>
              <p className="text-xs text-neutral-500 mt-1">Try a different search term</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-semibold text-neutral-500 bg-neutral-50">
                  {category}
                </div>
                {cmds.map((cmd, idx) => {
                  const globalIndex = filteredCommands.indexOf(cmd);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                        isSelected ? 'bg-primary-50' : 'hover:bg-neutral-50'
                      )}
                    >
                      <div className={cn(
                        'flex-shrink-0',
                        isSelected ? 'text-primary-600' : 'text-neutral-400'
                      )}>
                        {cmd.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">{cmd.label}</p>
                        {cmd.description && (
                          <p className="text-xs text-neutral-500 truncate">{cmd.description}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 text-xs text-neutral-500 bg-neutral-50 border-t border-neutral-200">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-semibold bg-white border border-neutral-200 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 font-semibold bg-white border border-neutral-200 rounded">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-semibold bg-white border border-neutral-200 rounded">↵</kbd>
              to select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 font-semibold bg-white border border-neutral-200 rounded">ESC</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}
