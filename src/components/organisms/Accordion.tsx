import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export default function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    items.filter((item) => item.defaultOpen).map((item) => item.id)
  );

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      }
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className={cn('divide-y divide-neutral-200 border border-neutral-200 rounded-lg', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div key={item.id} className="group">
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-neutral-900">{item.title}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-neutral-500 transition-transform',
                  isOpen && 'transform rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 py-3 text-sm text-neutral-600 border-t border-neutral-200 bg-neutral-50">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
