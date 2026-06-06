import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../../messages/en.json";
import "../globals.css";
import "@/styles/magiclick-product.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SectorCalc Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-w-0 overflow-x-hidden bg-white font-sans antialiased">
        <NextIntlClientProvider locale="en" messages={enMessages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
