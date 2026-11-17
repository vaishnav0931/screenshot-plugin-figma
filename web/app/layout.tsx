import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Site screenshots",
  description: "Capture full-page website screenshots onto a Figma-style canvas."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
