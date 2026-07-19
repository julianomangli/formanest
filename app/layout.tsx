import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormaNest | Modern furniture at smart margins",
  description: "A minimal furniture commerce experience with profit-aware pricing and recommendation analytics."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
