"use client";

import { useSession } from "@/lib/useSession";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { IconSidebar } from "@/components/icon-sidebar";
import { LandingHeader } from "@/components/landing-header";

const PUBLIC_PATHS = ["/", "/landing", "/about", "/pricing", "/press", "/login", "/signup"];

export function ConditionalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we're on a public page first to avoid unnecessary session checks
  const isPublicPage = PUBLIC_PATHS.includes(pathname);
  
  // Only check session if we might need it (not on login/signup pages)
  const shouldCheckSession = pathname !== "/login" && pathname !== "/signup";
  const { data: session, isLoading } = useSession();
  
  // Determine if user is authenticated
  const isAuthenticated = !!session?.user;
  
  // Don't show loading state for public pages
  if (isLoading && shouldCheckSession && !isPublicPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // For public pages, show landing header
  if (isPublicPage && !isAuthenticated) {
    return (
      <>
        <LandingHeader />
        <main>{children}</main>
      </>
    );
  }
  
  // For authenticated users, show the regular navbar and sidebar
  if (isAuthenticated) {
    return (
      <>
        <Navbar />
        <IconSidebar />
        <div className="pl-14">
          {children}
        </div>
      </>
    );
  }
  
  // For non-public pages when not authenticated, show landing header
  // (They'll be redirected by the page itself)
  return (
    <>
      <LandingHeader />
      <main>{children}</main>
    </>
  );
}
