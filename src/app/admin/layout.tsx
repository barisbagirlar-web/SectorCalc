import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "@/lib/i18n-stub";
import { AdminLocaleProvider } from "@/lib/features/admin/admin-locale-context";
import { LOCALE_COOKIE, isSupportedLocale, ROOT_LOCALE, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import "../site-styles";
import "../globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SectorCalc Admin",
  robots: { index: false, follow: false },
};

async function resolveAdminLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies();
  const candidates = [
    cookieStore.get("N_EXT_LOCALE")?.value,
    cookieStore.get(LOCALE_COOKIE)?.value,
  ];
  for (const candidate of candidates) {
    if (candidate && isSupportedLocale(candidate)) {
      return candidate;
    }
  }
  return ROOT_LOCALE;
}

export default async function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await resolveAdminLocale();
  const messages = {};

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="min-w-0 overflow-x-hidden bg-white font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AdminLocaleProvider initialLocale={locale}>{children}</AdminLocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
