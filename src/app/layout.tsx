import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font: no runtime request to Google, nothing to allow
// in the CSP font-src, and no layout shift while the font loads.
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotelierre — A quiet address in the city",
  description:
    "Hotelierre is a hotel in Lagos, Nigeria. Reserve rooms and suites with real-time pricing for your stay.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-white text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
