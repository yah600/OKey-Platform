import { useState, useEffect, useRef } from 'react';
import { Search, Home, DollarSign, Wrench, FileText, Users, Building, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'page' | 'property' | 'tenant' | 'document' | 'transaction' | 'action';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pages/Navigation
  const pages: SearchResult[] = [
    {
      id: 'dashboard',
      type: 'page',
      title: 'Dashboard',
      subtitle: 'Go to dashboard',
      icon: <Home className="w-5 h-5" />,
      action: () => navigate('/dashboard'),
    },
    {
      id: 'finances',
      type: 'page',
      title: 'Finances',
      subtitle: 'Manage finances',
      icon: <DollarSign className="w-5 h-5" />,
      action: () => navigate('/finances'),
    },
    {
      id: 'maintenance',
      type: 'page',
      title: 'Maintenance',
      subtitle: 'View maintenance requests',
      icon: <Wrench className="w-5 h-5" />,
      action: () => navigate('/maintenance'),
    },
    {
      id: 'documents',
      type: 'page',
      title: 'Documents',
      subtitle: 'Manage documents',
      icon: <FileText className="w-5 h-5" />,
      action: () => navigate('/documents'),
    },
    {
      id: 'residents',
      type: 'page',
      title: 'Residents',
      subtitle: 'Manage tenants',
      icon: <Users className="w-5 h-5" />,
      action: () => navigate('/residents'),
    },
    {
      id: 'properties',
      type: 'page',
      title: 'Properties',
      subtitle: 'Manage properties',
      icon: <Building className="w-5 h-5" />,
      action: () => navigate('/properties'),
    },
  ];

  // Quick Actions
  const actions: SearchResult[] = [
    {
      id: 'record-expense',
      type: 'action',
      title: 'Record Expense',
      subtitle: 'Add a new expense',
      icon: <DollarSign className="w-5 h-5" />,
      action: () => {
        navigate('/finances');
        onClose();
      },
    },
    {
      id: 'schedule-maintenance',
      type: 'action',
      title: 'Schedule Maintenance',
      subtitle: 'Schedule a maintenance task',
      icon: <Wrench className="w-5 h-5" />,
      action: () => {
        navigate('/maintenance');
        onClose();
      },
    },
  ];

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      // Show recent/suggested when empty
      setResults([...actions.slice(0, 3), ...pages.slice(0, 5)]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const allResults = [...pages, ...actions];

    const filtered = allResults.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.subtitle?.toLowerCase().includes(lowerQuery)
    );

    setResults(filtered.slice(0, 8));
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        // Open with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          // Will be handled by parent
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            results[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getCategoryLabel = (type: string) => {
    const labels: Record<string, string> = {
      page: 'Pages',
      action: 'Quick Actions',
      property: 'Properties',
      tenant: 'Tenants',
      document: 'Documents',
      transaction: 'Transactions',
    };
    return labels[type] || type;
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties, tenants, documents..."
              className="flex-1 outline-none text-gray-900 placeholder-gray-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <span className="text-xs text-gray-400">⌘K</span>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">
                  {query ? `No results found for "${query}"` : 'Start typing to search...'}
                </p>
              </div>
            ) : (
              <div>
                {Object.entries(groupedResults).map(([type, items]) => (
                  <div key={type}>
                    <div className="px-4 py-2 bg-gray-50 border-b">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        {getCategoryLabel(type)}
                      </p>
                    </div>
                    {items.map((result, index) => {
                      const globalIndex = results.indexOf(result);
                      return (
                        <button
                          key={result.id}
                          onClick={() => {
                            result.action();
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                            selectedIndex === globalIndex ? 'bg-gray-100' : ''
                          }`}
                        >
                          <div className={`flex-shrink-0 ${
                            selectedIndex === globalIndex ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {result.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">{result.title}</p>
                            {result.subtitle && (
                              <p className="text-xs text-gray-500">{result.subtitle}</p>
                            )}
                          </div>
                          {selectedIndex === globalIndex && (
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span><kbd className="px-1.5 py-0.5 bg-white border rounded">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-white border rounded">↵</kbd> Select</span>
              <span><kbd className="px-1.5 py-0.5 bg-white border rounded">Esc</kbd> Close</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
