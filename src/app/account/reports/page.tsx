type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { AccountReportsPageContent } from "@/components/reports/AccountReportsPageContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "accountReportsPage" });
  return {
    ...createPageMetadata({
      title: t("meta.title"),
      description: t("meta.description"),
      path: "/account/reports",
      locale: locale as AppLocale,
    }),
    robots: { index: false, follow: false } as const,
  };
}

export default async function AccountReportsPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  return (
    <Suspense fallback={null}>
      <AccountReportsPageContent />
    </Suspense>
  );
}
