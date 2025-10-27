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
      header: "Term",
      cell: ({ row }) => (
        <div className="font-medium text-sm max-w-md truncate">{row.original.front}</div>
      ),
    },
    {
      accessorKey: "back",
      header: "Definition",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-md truncate">{row.original.back}</div>
      ),
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
        <Card className="border-border">
          <CardContent className="p-0">
            <EmptyState
              icon={Search}
              title="No flashcards found"
              description={`No results for "${globalFilter}"`}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left text-xs font-semibold text-muted-foreground px-4 py-3"
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
                      "cursor-pointer transition-colors border-b border-border group",
                      selectedCard?.id === row.original.id ? "bg-muted" : "hover:bg-muted/50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
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
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
              <div className="text-sm text-muted-foreground">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  filteredRows.length
                )}{" "}
                of {filteredRows.length} cards
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-7"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <div className="text-sm text-muted-foreground px-2">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-7"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
};
