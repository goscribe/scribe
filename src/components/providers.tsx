"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { client } from '@/lib/trpc-client';
import { CookiesProvider } from 'react-cookie';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClientInstance] = useState(() => client);

  return (
    <trpc.Provider client={trpcClientInstance} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CookiesProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </CookiesProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

