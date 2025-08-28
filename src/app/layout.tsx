import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const generateMetadata = (): Metadata => {
    return {
        title: `Scribe`,

    };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js"></script>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"/>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mdgaziur/EditorJS-LaTeX@1.0.5/dist/editorjs-latex.bundle.css"/>
          <script defer src="https://cdn.jsdelivr.net/gh/mdgaziur/EditorJS-LaTeX@1.0.5/dist/editorjs-latex.bundle-min.js"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
