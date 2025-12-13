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
      <aside className="bg-background fixed left-0 top-0 z-20 flex h-screen w-14 flex-col items-center border-r border-border pt-16 pb-8">
        <nav className="flex flex-1 flex-col items-center gap-3">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
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

        {/* Settings at bottom */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                isSettingsActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>

        {/* Profile Picture with Sign Out */}
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-3 flex h-10 w-10 items-center justify-center rounded-full hover:opacity-80 transition-opacity">
                <ProfilePicture id={session.user.id || ""} name={session.user.name || "User"} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end">
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
      </aside>
    </TooltipProvider>
  );
}

