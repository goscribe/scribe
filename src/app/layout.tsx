import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";
import { Providers } from "@/components/providers";
import { ConditionalNav } from "@/components/conditional-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scribe – The next generation AI study partner",
  description: "Transform your learning experience with intelligent flashcards, AI-generated podcasts, and collaborative study tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>  
      <meta name="apple-mobile-web-app-title" content="Scribe" />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background/70`}>
        <Providers>
          <ConditionalNav>
            {children}
          </ConditionalNav>
        </Providers>
      </body>
    </html>
  );
}