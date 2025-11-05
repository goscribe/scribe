"use client";

import { useSession } from "@/lib/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "./landing/page";

export default function Home() {
  const { data: session, isLoading, error } = useSession();
  const router = useRouter();
  
  // Determine status based on @auth session
  const status = isLoading ? "loading" : session?.user ? "authenticated" : "unauthenticated";

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/storage");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (status === "unauthenticated") {
    return <LandingPage />;
  }

  return null;
}