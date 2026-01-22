import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Building2, Users, DollarSign, Wrench, FileText, Calendar, TrendingUp, Settings, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const tenantCommands = [
    { icon: Home, label: 'Dashboard', path: '/tenant/dashboard', category: 'Navigation' },
    { icon: DollarSign, label: 'Payments', path: '/tenant/payments', category: 'Navigation' },
    { icon: Wrench, label: 'Maintenance', path: '/tenant/maintenance', category: 'Navigation' },
    { icon: FileText, label: 'Documents', path: '/tenant/documents', category: 'Navigation' },
    { icon: Mail, label: 'Messages', path: '/tenant/messages', category: 'Navigation' },
  ];

  const ownerCommands = [
    { icon: Home, label: 'Dashboard', path: '/owner/dashboard', category: 'Navigation' },
    { icon: Building2, label: 'Properties', path: '/owner/properties', category: 'Navigation' },
    { icon: Users, label: 'Residents', path: '/owner/residents', category: 'Navigation' },
    { icon: DollarSign, label: 'Financials', path: '/owner/financials', category: 'Navigation' },
    { icon: Wrench, label: 'Maintenance', path: '/owner/maintenance', category: 'Navigation' },
    { icon: FileText, label: 'Documents', path: '/owner/documents', category: 'Navigation' },
    { icon: Calendar, label: 'Meetings', path: '/owner/meetings', category: 'Navigation' },
    { icon: TrendingUp, label: 'Analytics', path: '/owner/analytics', category: 'Navigation' },
    { icon: Settings, label: 'Settings', path: '/owner/settings', category: 'Navigation' },
  ];

  const marketplaceCommands = [
    { icon: Home, label: 'Marketplace Home', path: '/', category: 'Marketplace' },
    { icon: Search, label: 'Search Properties', path: '/marketplace/search', category: 'Marketplace' },
    { icon: TrendingUp, label: 'My Bids', path: '/marketplace/my-bids', category: 'Marketplace' },
  ];

  const allCommands = [
    ...marketplaceCommands,
    ...(user?.role === 'tenant' ? tenantCommands : ownerCommands),
  ];

  const filteredCommands = search
    ? allCommands.filter((cmd) =>
        cmd.label.toLowerCase().includes(search.toLowerCase())
      )
    : allCommands;

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof allCommands>);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setSearch('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh]">
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200">
            <Search className="w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs bg-neutral-100 rounded border border-neutral-200">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-semibold text-neutral-500 bg-neutral-50">
                  {category}
                </div>
                {commands.map((cmd, index) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(cmd.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-900">{cmd.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-neutral-500">
                No results found for "{search}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200">↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200">↵</kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200">K</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
