import { Barlow, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { PaddleProvider } from "@/lib/paddle-provider";
import { getMessages } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable} ${jetbrainsMono.variable}`}>
      <body className="min-w-0 overflow-x-hidden font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale="en">
          <PaddleProvider>{children}</PaddleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
