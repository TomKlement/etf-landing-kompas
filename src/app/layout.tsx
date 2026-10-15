import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ETF Kompas – VOO, VT, QQQ: co si z Česka opravdu koupíte",
  description:
    "Srovnání poplatků amerických ETF a jejich evropských (UCITS) verzí, které jdou koupit z Česka. Každé číslo s odkazem na oficiální factsheet.",
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${jakarta.variable} antialiased`}>{children}</body>
    </html>
  );
}
