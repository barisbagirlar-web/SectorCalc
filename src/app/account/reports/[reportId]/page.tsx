export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SavedReportDetailContent } from "@/components/reports/SavedReportDetailContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";

interface SavedReportPageParams {
  reportId: string;
  }

export async function generateMetadata({
  params,
}: {
  params: Promise<SavedReportPageParams>;
}): Promise<Metadata> {
  const { reportId } = await params;
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "accountReportDetailPage" });

  return {
    ...createPageMetadata({
      title: t("meta.title"),
      description: t("meta.description"),
      path: `/account/reports/${reportId}`,
      locale: locale as AppLocale,
    }),
    robots: { index: false, follow: false } as const,
  };
}

export default async function SavedReportPage({
  params,
}: {
  params: Promise<SavedReportPageParams>;
}) {
  const { reportId } = await params;
  const locale = "en";
  setRequestLocale(locale);
  return <SavedReportDetailContent reportId={reportId} />;
}
