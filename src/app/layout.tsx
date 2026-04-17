import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Suspense } from 'react';
import { AuthBootstrapProvider } from '@/components/auth/AuthBootstrapContext';
import { AuthRefreshBoundary } from '@/components/auth/AuthRefreshBoundary';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cluverse",
  description: "Campus communities, clubs, and conversations in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${geistMono.variable}`}>
        <Suspense fallback={children}>
          <AuthBootstrapProvider>
            <AuthRefreshBoundary>{children}</AuthRefreshBoundary>
          </AuthBootstrapProvider>
        </Suspense>
      </body>
    </html>
  );
}
