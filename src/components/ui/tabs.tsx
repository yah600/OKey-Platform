import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  showCount?: boolean;
}

export default function Tabs({ tabs, activeTab, onChange, showCount, className, ...props }: TabsProps) {
  return (
    <div className={cn('border-b border-neutral-200', className)} {...props}>
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'pb-3 text-sm font-medium transition-colors relative',
              activeTab === tab.id
                ? 'text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            {tab.label}
            {showCount && tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1.5 px-1.5 py-0.5 text-xs rounded',
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                )}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
