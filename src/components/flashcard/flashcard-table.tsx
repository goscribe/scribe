"use client";

import { useState } from "react";
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
        <div className="text-sm max-w-md truncate">{row.original.front}</div>
      ),
    },
    {
      accessorKey: "back",
      header: "Answer",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground/80 max-w-md truncate">{row.original.back}</div>
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
          <div className="flex items-center gap-2.5">
            {/* Mastery Level Dots */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    level <= masteryLevel
                      ? masteryLevel >= 4
                        ? "bg-green-500"
                        : masteryLevel >= 2
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                      : "bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
            
            {/* Study Count */}
            {timesStudied > 0 && (
              <span className="text-[10px] text-muted-foreground/60">
                {timesStudied}x
              </span>
            )}
            
            {/* Warning for consecutive incorrect */}
            {consecutiveIncorrect >= 2 && (
              <span className="text-[10px] text-orange-500/70">
                ⚠
              </span>
            )}
          </div>
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
        <Card className="border border-border">
          <CardContent className="p-0">
            <EmptyState
              icon={Search}
              title="No flashcards found"
              description={`No results for "${globalFilter}"`}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border/50 rounded-lg overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider px-6 py-3 bg-muted/30"
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
                      "cursor-pointer transition-colors duration-150 border-b border-border/30",
                      selectedCard?.id === row.original.id 
                        ? "bg-primary/5" 
                        : "hover:bg-muted/30"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-3.5">
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
            <div className="flex items-center justify-between px-6 py-3 border-t border-border/50 bg-muted/20">
              <div className="text-xs text-muted-foreground">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  filteredRows.length
                )}{" "}
                of {filteredRows.length} cards
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-7 hover:bg-muted/50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-muted-foreground px-3">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-7 hover:bg-muted/50"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
