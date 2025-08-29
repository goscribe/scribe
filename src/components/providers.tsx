"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { client } from '@/lib/trpc-client';
import { CookiesProvider } from 'react-cookie';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClientInstance] = useState(() => client);

  return (
    <trpc.Provider client={trpcClientInstance} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          {children}
          <Toaster position="bottom-right" richColors theme="light" />
        </CookiesProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

