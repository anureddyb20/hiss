import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SYNAPSE v2.4 PRO — AICTE Institution Intelligence & Regulatory Coordination",
  description: "AICTE Centralized 360° Institution Intelligence, Cross-Bureau Case Registry & Explainable Overlap Detection Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F7F8FA] text-[#171923] flex flex-col font-sans selection:bg-[#F0ECFF] selection:text-[#6246EA]">
        {children}
      </body>
    </html>
  );
}
