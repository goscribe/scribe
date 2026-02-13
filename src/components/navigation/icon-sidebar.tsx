"use client";

import { FileText, Settings, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/useSession";
import ProfilePicture from "@/components/profilePicture";
import { trpc } from "@/lib/trpc";

const sidebarItems = [
  {
    name: "Files",
    icon: FileText,
    href: "/storage",
  },
  {
    name: "Shared",
    icon: Users,
    href: "/shared",
  },
];

export function IconSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const signOutMutation = trpc.auth.logout.useMutation();

  const isSettingsActive = pathname.startsWith("/settings");

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="bg-background fixed left-0 top-0 z-20 flex h-full w-14 flex-col items-center border-r border-border pt-16 pb-4">
        <nav className="flex flex-1 flex-col items-center gap-1 px-2">
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
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={6}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-1 px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                  isSettingsActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={6}>
              Settings
            </TooltipContent>
          </Tooltip>

          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="mt-1 flex h-8 w-8 items-center justify-center rounded-full overflow-hidden ring-1 ring-border hover:ring-ring transition-colors">
                  <ProfilePicture id={session.user.id || ""} name={session.user.name || "User"} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" sideOffset={6}>
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive" 
                  onClick={async () => {
                    await signOutMutation.mutateAsync();
                    router.push('/');
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

