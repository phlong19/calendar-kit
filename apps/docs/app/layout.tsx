import type { ReactNode } from "react";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shadcn-calendar.dev"),
  title: "shadcn-calendar docs | date picker and date range picker",
  description:
    "shadcn-calendar docs for shadcn-style React calendar components, date picker, date range picker, presets, localization, and form integration.",
  keywords: [
    "shadcn-calendar",
    "shadcn date picker",
    "shadcn date range picker",
    "react calendar component",
    "date range picker",
    "react date picker",
    "date-fns calendar",
    "react hook form date picker",
    "next.js date picker",
    "calendar registry"
  ],
  openGraph: {
    title: "shadcn-calendar docs | date picker and date range picker",
    description:
      "Open-source shadcn-style calendar docs with single date picker and date range picker for React and Next.js.",
    type: "website",
    siteName: "shadcn-calendar docs"
  },
  twitter: {
    card: "summary_large_image",
    title: "shadcn-calendar docs",
    description:
      "shadcn-style date picker and date range picker docs for React and Next.js."
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
