// hooks/useSession.ts
import { useQuery } from "@tanstack/react-query";
import { fetchSession } from "@/lib/auth-client";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 5, // 5 minutes - don't refetch too often
    gcTime: 1000 * 60 * 10,    // Keep in cache for 10 minutes (formerly cacheTime)
    retry: false,               // don't hammer if logged out
    refetchOnWindowFocus: false, // Don't refetch on tab focus
    refetchOnMount: false,      // Use cache if available
  });
}
