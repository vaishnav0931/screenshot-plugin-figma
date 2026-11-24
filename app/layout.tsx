import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixel UI — React Component Library",
  description:
    "Copy-paste React components with interactive playgrounds and Figma export."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
