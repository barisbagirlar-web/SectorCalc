import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountCreditsPageContent } from "@/components/account/AccountCreditsPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "accountCreditsPage" });
  return {
    ...createPageMetadata({
      title: t("meta.title"),
      description: t("meta.description"),
      path: "/account/credits",
      locale: locale as AppLocale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function AccountCreditsPage({ params }: PageProps) {
  const { locale } = await params;
  return <AccountCreditsPageContent />;
}
