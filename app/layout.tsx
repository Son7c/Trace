import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import { LenisProvider } from "@/components/providers/lenis-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trace",
  description:
    "Lock algorithm patterns into permanent memory. Trace automates spaced repetition calculations so you walk into technical interviews with zero solution decay.",
  keywords: [
    "spaced repetition",
    "active recall",
    "leetcode memory engine",
    "algorithm retention",
    "supermemo-2",
    "technical interview prep",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020507] text-white selection:bg-[#a6e795]/20 selection:text-[#a6e795]`}
      >
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
