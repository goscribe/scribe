This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Auth (NextAuth + Google + Credentials)

Create a `.env.local` with:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-random-32-char-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Then start the dev server and visit `/login` to sign in with Google OAuth or use demo credentials (demo@example.com / demo).

### tRPC Setup

The app is configured to connect to `@goscribe/server` via tRPC. Set the server URL in your `.env.local`:

```
GOSCRIBE_SERVER_URL=http://localhost:3001
```

### Pusher Setup (Real-time Updates)

For real-time AI analysis progress tracking, configure Pusher in your `.env.local`:

```
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key-here
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

You can get these values from your [Pusher dashboard](https://dashboard.pusher.com/).

The tRPC client is automatically configured and available throughout the app. Use the `trpc` hook in your components:

```tsx
import { trpc } from '@/lib/trpc';

// Query example
const { data, isLoading } = trpc.yourProcedure.useQuery();

// Mutation example
const mutation = trpc.yourMutation.useMutation();
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# scribe
