import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { IconSidebar } from "@/components/icon-sidebar";

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
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background`}>
        <Providers>
          <Navbar />
          <IconSidebar />
          <div className="pl-14">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
