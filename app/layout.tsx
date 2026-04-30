import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShadeSeason",
  description:
    "An image-free 16-season color analysis studio with a customizable virtual model."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
