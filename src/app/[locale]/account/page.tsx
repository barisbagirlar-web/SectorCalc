import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "accountPage" });
  return {
    ...createPageMetadata({
      title: t("meta.title"),
      description: t("meta.description"),
      path: "/account",
      locale: locale as AppLocale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function AccountPage({ params }: PageProps) {
  const { locale } = await params;
  return <AccountDashboard />;
}
