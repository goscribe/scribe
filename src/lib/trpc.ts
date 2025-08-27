import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@goscribe/server';

export const trpc = createTRPCReact<AppRouter>();
