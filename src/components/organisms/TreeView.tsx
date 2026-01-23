import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: 'folder' | 'file';
}

interface TreeViewProps {
  data: TreeNode[];
  onSelect?: (nodeId: string) => void;
  selectedIds?: string[];
  className?: string;
}

function TreeNodeComponent({
  node,
  level = 0,
  onSelect,
  selectedIds = []
}: {
  node: TreeNode;
  level?: number;
  onSelect?: (nodeId: string) => void;
  selectedIds?: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedIds.includes(node.id);
  const Icon = node.icon === 'file' ? File : Folder;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-neutral-100',
          isSelected && 'bg-primary-50 hover:bg-primary-100'
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => {
          if (hasChildren) setIsExpanded(!isExpanded);
          onSelect?.(node.id);
        }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          )
        ) : (
          <span className="w-4" />
        )}
        <Icon className={cn('w-4 h-4', isSelected ? 'text-primary-600' : 'text-neutral-400')} />
        <span className={cn('text-sm', isSelected ? 'text-primary-900 font-medium' : 'text-neutral-700')}>
          {node.label}
        </span>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedIds={selectedIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * TreeView Component
 * Expandable/collapsible tree structure with keyboard navigation
 */
export function TreeView({ data, onSelect, selectedIds, className }: TreeViewProps) {
  return (
    <div className={cn('border border-neutral-200 rounded-lg p-2 bg-white', className)}>
      {data.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          onSelect={onSelect}
          selectedIds={selectedIds}
        />
      ))}
    </div>
  );
}
