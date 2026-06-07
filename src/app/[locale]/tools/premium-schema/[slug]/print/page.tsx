import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PremiumPrintReportShell } from "@/components/reports/PremiumPrintReportShell";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { buildPremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";
import {
  getPremiumSchemaBySlug,
  listPremiumSchemaSlugs,
} from "@/lib/premium-schema/schemas/index";

interface PrintPageParams {
  slug: string;
}

interface PrintRouteParams extends PrintPageParams {
  locale: string;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<PrintPageParams[]> {
  return listPremiumSchemaSlugs().map((slug) => ({ slug }));
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

  return {
    ...createPageMetadata({
      title: `${schema.name} — Print Report | SectorCalc`,
      description: `Print-ready premium decision report for ${schema.name}.`,
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

  const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
  const payload = buildPremiumReportExportPayload(schema, result, locale);

  return (
    <PremiumPrintReportShell
      payload={payload}
      locale={locale}
      backHref={`/tools/premium-schema/${schema.id}`}
    />
  );
}
