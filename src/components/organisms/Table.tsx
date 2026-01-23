import { useState, ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  stickyHeader?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
}

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data available',
  stickyHeader = false,
  striped = false,
  hoverable = true,
  bordered = true,
  compact = false,
  className,
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === bValue) return 0;

    let comparison = 0;
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-neutral-400" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-neutral-700" />
    ) : (
      <ChevronDown className="w-4 h-4 text-neutral-700" />
    );
  };

  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  if (data.length === 0) {
    return (
      <div className={cn('w-full border border-neutral-200 rounded-lg p-8', className)}>
        <div className="text-center text-neutral-500 text-sm">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table
        className={cn(
          'w-full border-collapse',
          bordered && 'border border-neutral-200 rounded-lg overflow-hidden'
        )}
      >
        <thead
          className={cn(
            'bg-neutral-50 border-b border-neutral-200',
            stickyHeader && 'sticky top-0 z-10'
          )}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'font-semibold text-neutral-700 border-b border-neutral-200',
                  compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
                  getAlignmentClass(column.align),
                  column.sortable && 'cursor-pointer select-none hover:bg-neutral-100 transition-colors'
                )}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2 justify-between">
                  <span>{column.label}</span>
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={keyExtractor(row, rowIndex)}
              className={cn(
                'border-b border-neutral-100 last:border-0',
                striped && rowIndex % 2 === 1 && 'bg-neutral-50',
                hoverable && 'hover:bg-neutral-100 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row, rowIndex)}
            >
              {columns.map((column) => {
                const value = row[column.key];
                const rendered = column.render ? column.render(value, row, rowIndex) : value;

                return (
                  <td
                    key={column.key}
                    className={cn(
                      'text-neutral-700',
                      compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
                      getAlignmentClass(column.align)
                    )}
                  >
                    {rendered}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
