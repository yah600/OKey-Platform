import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPageNumbers = true,
  className,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + first + current + last
    const totalBlocks = totalNumbers + 2; // + 2 ellipsis

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
      return [...leftRange, 'ellipsis', totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = Array.from(
        { length: 3 + siblingCount * 2 },
        (_, i) => totalPages - (3 + siblingCount * 2) + i + 1
      );
      return [1, 'ellipsis', ...rightRange];
    }

    if (showLeftEllipsis && showRightEllipsis) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
    }

    return [];
  };

  const pages = getPageNumbers();

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {/* First Page */}
      {showFirstLast && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
      )}

      {/* Previous Page */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-neutral-500 select-none"
                >
                  ...
                </div>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                disabled={isActive}
                className={cn(
                  'min-w-[2.5rem] h-10 px-3 rounded-lg text-sm font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                  isActive
                    ? 'bg-primary-600 text-white cursor-default'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                )}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}

      {/* Next Page */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        aria-label="Go to next page"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Last Page */}
      {showFirstLast && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Go to last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      )}

      {/* Page Info */}
      <div className="ml-4 text-sm text-neutral-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
