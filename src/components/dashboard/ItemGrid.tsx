"use client";

import { ReactNode } from "react";

interface ItemGridProps {
  children: ReactNode;
  columns?: string; // tailwind grid-cols-*
}

export function ItemGrid({ children, columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" }: ItemGridProps) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {children}
    </div>
  );
}


