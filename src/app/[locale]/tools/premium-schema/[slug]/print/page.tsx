export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PremiumPrintReportShell } from "@/components/reports/PremiumPrintReportShell";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { buildPremiumReportExportPayload } from "@/lib/features/premium-schema/premium-report-export";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/features/premium-schema/premium-schema-engine";
import { getPremiumSchemaBySlug } from "@/lib/features/premium-schema/schemas/index";

interface PrintRouteParams {
  slug: string;
  locale: string;
}


export async function generateMetadata({
  params,
}: {
  params: Promise<PrintRouteParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const schema = getPremiumSchemaBySlug(slug);
  if (!schema) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "premiumSchemaPrintPage" });

  return {
    ...createPageMetadata({
      title: t("meta.title", { name: schema.name }),
      description: t("meta.description", { name: schema.name }),
      path: `/tools/premium-schema/${schema.id}/print`,
      locale: locale as AppLocale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function PremiumSchemaPrintPage({
  params,
}: {
  params: Promise<PrintRouteParams>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const schema = getPremiumSchemaBySlug(slug);
  if (!schema) {
    notFound();
  }

  const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema), locale);
  const payload = buildPremiumReportExportPayload(schema, result, locale);

  return (
    <PremiumPrintReportShell
      payload={payload}
      locale={locale}
      backHref={`/tools/premium-schema/${schema.id}`}
      legacyPaidSlug={schema.legacyPaidSlug}
    />
  );
}
