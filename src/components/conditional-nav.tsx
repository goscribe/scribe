"use client";

import { useSession } from "@/lib/useSession";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { IconSidebar } from "@/components/navigation/icon-sidebar";
import { LandingHeader } from "@/components/navigation/landing-header";
import { ScribeLoader } from "@/components/branding/scribe-loader";

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
        <ScribeLoader />
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
      <div className="h-full overflow-hidden">
        <Navbar />
        <IconSidebar />
        <div className="h-full overflow-scroll pt-14">
          {children}
        </div>
      </div>
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
