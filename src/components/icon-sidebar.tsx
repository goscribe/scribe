"use client";

import { FileText, CheckSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarItems = [
  {
    name: "Files",
    icon: FileText,
    href: "/storage",
  },
  {
    name: "Todo",
    icon: CheckSquare,
    href: "/todo",
  },
];

export function IconSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="bg-muted/40 fixed left-0 top-0 z-20 flex h-screen w-14 flex-col items-center border-r border-border pt-14 pb-8">
        <nav className="flex flex-1 flex-col items-center gap-2">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}

