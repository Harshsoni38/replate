import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Replate — Surplus Food Coordination",
  description: "Connecting mess kitchens with NGOs to eliminate food waste through intelligent priority matching.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
