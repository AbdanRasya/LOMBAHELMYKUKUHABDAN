import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SourceHub – Platform Pengadaan B2B Indonesia",
    template: "%s | SourceHub",
  },
  description:
    "Platform AI-powered B2B yang menghubungkan perusahaan Indonesia dengan UMKM lokal terpercaya. Temukan supplier terbaik dengan teknologi AI.",
  keywords: ["B2B", "UMKM", "supplier", "pengadaan", "procurement", "Indonesia", "SourceHub"],
  authors: [{ name: "SourceHub Team" }],
  creator: "SourceHub",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "SourceHub – Platform Pengadaan B2B Indonesia",
    description: "Platform AI-powered B2B yang menghubungkan perusahaan Indonesia dengan UMKM lokal terpercaya.",
    siteName: "SourceHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "SourceHub – Platform Pengadaan B2B Indonesia",
    description: "Platform AI-powered B2B yang menghubungkan perusahaan Indonesia dengan UMKM lokal terpercaya.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider session={session}>
          <TooltipProvider>
              {children}
              <Toaster richColors position="top-right" />
            </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
