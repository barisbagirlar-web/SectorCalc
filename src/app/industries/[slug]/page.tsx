type AppLocale = "en";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustryPageContent } from "@/components/pages/IndustryPageContent";
import { getIndustryBySlug } from "@/data/industries";
import { getLocalizedIndustryHub } from "@/data/industry-hub-i18n";
import { industryRegistry, type IndustrySlug } from "@/lib/features/tools/industry-registry";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

interface IndustryPageParams {
  slug: IndustrySlug;
}

/**
 * Hard-404 for unknown industry slugs (SSOT with free/pro tool routes).
 * Only the 27 registry slugs are statically generated; all others 404.
 * Do NOT use limitStaticParamsForPreview here — Firebase preview mode would
 * shrink the set to 4 and re-open soft-404 holes for the remaining 23.
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: IndustrySlug }[] {
  return industryRegistry.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<IndustryPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = "en";
  const industry = getIndustryBySlug(slug);
  if (!industry) {
    return { robots: { index: false, follow: false } };
  }

  const t = await getTranslations({ locale, namespace: "industriesSlugPage" });
  const localizedHub = getLocalizedIndustryHub(slug, locale);
  const title = localizedHub?.hubTitle ?? t("metaTitleFallback", { name: industry.name });
  const description =
    localizedHub?.painStatement ??
    t("metaDescriptionFallback", { name: industry.name });

  return createPageMetadata({
    title,
    description,
    path: industry.href,
    locale: locale as AppLocale,
  });
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<IndustryPageParams>;
}) {
  const { slug } = await params;
  const locale = "en";
  setRequestLocale(locale);
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  return (
    <PageLayout>
      <IndustryPageContent industry={industry} locale={locale} />
    </PageLayout>
  );
}
