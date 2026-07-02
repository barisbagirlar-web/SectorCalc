export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations } from "@/lib/i18n-stub";
import { AccountCreditsPageContent } from "@/components/account/AccountCreditsPageContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
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
  const locale = "en";
  return <AccountCreditsPageContent />;
}
