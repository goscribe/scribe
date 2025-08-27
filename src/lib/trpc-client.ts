import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@goscribe/server';
import superjson from 'superjson';

const getBaseUrl = (): string => {
  // Always use environment variable if set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default to your separate TRPC server
  return 'http://localhost:3001';
};

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      transformer: superjson,
      fetch(input, init) {
        return fetch(input, { ...init, credentials: 'include' });
      },
    }),
  ],
});