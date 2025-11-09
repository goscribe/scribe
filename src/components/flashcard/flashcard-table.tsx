"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@goscribe/server";
import FlashcardDotsIndicator from "./widgets/flashcard-dots-indicator";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

/**
 * Props for the FlashcardTable component
 */
interface FlashcardTableProps {
  /** Array of flashcards */
  cards: Flashcard[];
  /** Current search filter */
  globalFilter: string;
  /** Callback when search filter changes */
  onGlobalFilterChange: (value: string) => void;
  /** Currently selected card */
  selectedCard: Flashcard | null;
  /** Callback when card is selected */
  onCardSelect: (card: Flashcard | null) => void;
}

/**
 * Flashcard table component for list view
 * 
 * Features:
 * - Sortable and filterable table
 * - Pagination controls
 * - Row selection with highlighting
 * - Empty state for no results
 * 
 * @param props - FlashcardTableProps
 * @returns JSX element containing the flashcard table
 */
export const FlashcardTable = ({
  cards,
  globalFilter,
  onGlobalFilterChange,
  selectedCard,
  onCardSelect
}: FlashcardTableProps) => {
  // Define table columns
  const columns: ColumnDef<Flashcard>[] = [
    {
      accessorKey: "front",
      header: "Question",
      cell: ({ row }) => (
        <div className="text-sm font-medium max-w-xs truncate">{row.original.front}</div>
      ),
    },
    {
      accessorKey: "back",
      header: "Answer",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground/70 max-w-xs truncate">{row.original.back}</div>
      ),
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        // Get progress data from the first element of progress array
        const progress = row.original.progress?.[0];
        const masteryLevel = progress?.masteryLevel || 0;
        const timesStudied = progress?.timesStudied || 0;
        const consecutiveIncorrect = progress?.timesIncorrectConsecutive || 0;
        
        return (
          <FlashcardDotsIndicator masteryLevel={masteryLevel} timesStudied={timesStudied} consecutiveIncorrect={consecutiveIncorrect} />
        );
      },
    },
  ];

  const table = useReactTable({
    data: cards,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const filteredRows = table.getFilteredRowModel().rows;

  return (
    <>
      {/* No results state */}
      {filteredRows.length === 0 && globalFilter ? (
        <Card className="border border-border shadow-sm">
          <CardContent className="p-0">
            <EmptyState
              icon={Search}
              title="No flashcards found"
              description={`No results for "${globalFilter}"`}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border shadow-sm overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-border/50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-6 py-4 bg-muted/30"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onCardSelect(row.original)}
                    className={cn(
                      "cursor-pointer transition-colors duration-200 border-b border-border/30 last:border-0",
                      selectedCard?.id === row.original.id 
                        ? "bg-primary/10 border-l-2 border-l-primary" 
                        : "hover:bg-muted/40"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/20">
              <div className="text-xs text-muted-foreground/80">
                Showing <span className="font-medium text-foreground">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    filteredRows.length
                  )}
                </span>{" "}
                of <span className="font-medium text-foreground">{filteredRows.length}</span> cards
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-8 px-3 hover:bg-muted/60 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground/80 px-3 min-w-[80px] text-center">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-8 px-3 hover:bg-muted/60 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
};
