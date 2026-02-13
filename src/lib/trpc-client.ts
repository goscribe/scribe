import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@goscribe/server';
import superjson from 'superjson';
import { errorLink } from './api/errorLink';

const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fallback to localhost only in development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }

  throw new Error('NEXT_PUBLIC_API_URL environment variable is required in production');
};

export const client = createTRPCClient<AppRouter>({
  links: [
    errorLink(),
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      transformer: superjson,
      fetch(input, init) {
        return fetch(input, { ...init, credentials: 'include' });
      },
    }),
  ],
});