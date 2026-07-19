import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormaNest | Modern furniture for every room",
  description: "A minimal furniture store with smart recommendations, detailed products, and a smooth checkout experience."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
