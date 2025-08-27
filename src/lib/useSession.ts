// hooks/useSession.ts
import { useQuery } from "@tanstack/react-query";
import { fetchSession } from "@/lib/auth-client";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 1000 * 60, // 1 min
    retry: false,         // don't hammer if logged out
  });
}
