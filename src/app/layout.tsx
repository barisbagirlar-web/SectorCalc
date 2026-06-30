import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { THEME_COLOR } from "@/config/organization-trust";
import { metadataRobots } from "@/lib/infrastructure/seo/seo-indexing-control";
import "./globals.css";

export const metadata: Metadata = {
  robots: metadataRobots(),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: THEME_COLOR,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  
  // Strip server-only free tool inputs dictionary to prevent massive client payload injection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { freeToolInputs, ...clientMessages } = messages as any;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
