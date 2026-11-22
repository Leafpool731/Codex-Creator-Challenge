import type { Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f3ef"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const locale = headerList.get("x-next-intl-locale") ?? "en";

  return (
    <html lang={locale} className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-dvh overflow-x-hidden bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
