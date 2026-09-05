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
    default: "PUSAKA – Pusat Pengadaan & Akreditasi Supplier Nusantara",
    template: "%s | PUSAKA",
  },
  description:
    "Platform AI-powered B2B pertama di Indonesia yang menghubungkan perusahaan dengan UMKM lokal terpercaya melalui Pusat Pengadaan & Akreditasi Supplier Nusantara.",
  keywords: ["B2B", "UMKM", "supplier", "pengadaan", "procurement", "Indonesia", "PUSAKA"],
  authors: [{ name: "PUSAKA Team" }],
  creator: "PUSAKA",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "PUSAKA – Pusat Pengadaan & Akreditasi Supplier Nusantara",
    description: "Platform AI-powered B2B pertama di Indonesia yang menghubungkan perusahaan dengan UMKM lokal terpercaya.",
    siteName: "PUSAKA",
  },
  twitter: {
    card: "summary_large_image",
    title: "PUSAKA – Pusat Pengadaan & Akreditasi Supplier Nusantara",
    description: "Platform AI-powered B2B pertama di Indonesia yang menghubungkan perusahaan dengan UMKM lokal terpercaya.",
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
