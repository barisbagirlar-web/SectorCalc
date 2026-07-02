import { PageLayout } from "@/components/layout/PageLayout";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PremiumGeneratedToolPrintContent } from "@/components/reports/PremiumGeneratedToolPrintContent";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { getGeneratedToolSchema } from "@/lib/features/generated-tools/schema-loader";
import { resolveGeneratedToolTitle } from "@/lib/features/generated-tools/resolve-tool-display";

interface PrintRouteParams {
  slug: string;
  }

export const maxDuration = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<PrintRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "generatedTool.reportSummary" });
  const schema = getGeneratedToolSchema(slug);
  if (!schema) {
    return {};
  }

  const displayName = resolveGeneratedToolTitle(slug, schema, locale);

  return {
    ...createPageMetadata({
      title: `${displayName} — ${t("metaTitle")} | SectorCalc`,
      description: `${displayName} ${t("metaDescription")}`,
      path: `/tools/generated/${slug}/print`,
      locale: locale as AppLocale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function GeneratedToolPrintPage({
  params,
}: {
  params: Promise<PrintRouteParams>;
}) {
  const { slug } = await params;
  const locale = "en";
  setRequestLocale(locale);

  const schema = getGeneratedToolSchema(slug);
  if (!schema) {
    notFound();
  }

  return (
    <PageLayout>
      <div className="sc-print-full-page">
        <PremiumGeneratedToolPrintContent slug={slug} />
        <style>{PRINT_PAGE_GLOBAL_OVERRIDES}</style>
      </div>
    </PageLayout>
  );
}

/**
 * Override the main site layout so the print page fills the viewport
 * with the industrial theme instead of the site's default white background.
 */
const PRINT_PAGE_GLOBAL_OVERRIDES = `
  .sc-print-full-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: #1A1915;
    z-index: 9999;
    padding: 0;
    margin: 0;
  }
  .sc-print-full-page body {
    background: #1A1915;
  }
  @media print {
    .sc-print-full-page {
      position: static;
      background: #1A1915;
    }
  }
`;
