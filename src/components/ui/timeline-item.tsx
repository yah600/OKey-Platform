import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { StatusPill, StatusType } from '@/components/ui/status-pill';

export interface TimelineItemData {
  id: string;
  icon: React.ReactNode;
  title: string;
  date: string;
  time?: string;
  actor: string; // "Jean Tremblay" or "Agent IA"
  actorType: 'human' | 'agent';
  status?: StatusType;
  metadata?: Array<{ label: string; value: string }>;
  body?: string;
  expandable?: boolean;
}

interface TimelineItemProps {
  item: TimelineItemData;
  isLast?: boolean;
}

export function TimelineItem({ item, isLast = false }: TimelineItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          item.actorType === 'agent' ? 'bg-purple-100 text-purple-600' : 'bg-[#0D7377]/10 text-[#0D7377]'
        }`}>
          {item.icon}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gray-200 mt-2" style={{ minHeight: '20px' }} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h4 className="font-semibold text-sm">{item.title}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>{item.date}</span>
              {item.time && <span>• {item.time}</span>}
              <span>• par {item.actor}</span>
              {item.actorType === 'agent' && (
                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                  Agent IA
                </span>
              )}
            </div>
          </div>
          {item.status && <StatusPill status={item.status} />}
        </div>

        {/* Metadata */}
        {item.metadata && item.metadata.length > 0 && (
          <div className="mt-2 space-y-1">
            {item.metadata.map((meta, idx) => (
              <div key={idx} className="text-xs">
                <span className="text-muted-foreground">{meta.label}:</span>{' '}
                <span className="font-medium">{meta.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Expandable body */}
        {item.expandable && item.body && (
          <div className="mt-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-[#0D7377] hover:underline flex items-center gap-1"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3 h-3" /> Réduire
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> Voir détails
                </>
              )}
            </button>
            {expanded && (
              <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {item.body}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Timeline({ items }: { items: TimelineItemData[] }) {
  return (
    <div className="space-y-0">
      {items.map((item, idx) => (
        <TimelineItem key={item.id} item={item} isLast={idx === items.length - 1} />
      ))}
    </div>
  );
}
