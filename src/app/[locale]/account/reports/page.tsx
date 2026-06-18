import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AccountReportsPageContent } from "@/components/reports/AccountReportsPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
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
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={null}>
      <AccountReportsPageContent />
    </Suspense>
  );
}
