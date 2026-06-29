export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { PremiumToolGrid } from "@/components/catalog/PremiumToolGrid";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { limitStaticParamsForPreview } from "@/lib/build/preview-static-params";
import {
  getPremiumCatalogCategoryDetail,
  listPremiumCatalogCategorySlugs,
} from "@/lib/premium/premium-category-resolver";
import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string; categorySlug: string }>;
};

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ categorySlug: string }>> {
  const params = listPremiumCatalogCategorySlugs().map((categorySlug) => ({ categorySlug }));
  return limitStaticParamsForPreview(params, {
    family: "premium-tools-category",
    slugKey: "categorySlug",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const detail = getPremiumCatalogCategoryDetail(categorySlug as GlobalToolCategorySlug, locale);
  if (!detail) {
    return {};
  }

  return createPageMetadata({
    title: `${detail.title} | SectorCalc`,
    description: detail.summary,
    path: `/pro-tools/${categorySlug}`,
    locale: locale as AppLocale,
  });
}

export default async function ProToolsCategoryPage({ params }: PageProps) {
  const { locale, categorySlug } = await params;
  setRequestLocale(locale);
  const detail = getPremiumCatalogCategoryDetail(categorySlug as GlobalToolCategorySlug, locale);
  if (!detail) {
    notFound();
  }

  const t = await getTranslations("premiumCategoryCatalog");
  const freeTools = detail.relatedFreeTools
    .filter((tool) => tool.routePath)
    .map((tool) => ({
      slug: tool.slug,
      name: tool.title[locale] ?? tool.title.en ?? tool.slug,
      shortDescription: tool.description[locale] ?? tool.description.en ?? "",
      description: tool.description[locale] ?? tool.description.en ?? "",
      tier: "free" as const,
      industrySlug: detail.slug,
      href: tool.routePath!,
    }));

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "premiumTools", path: "/pro-tools" },
        { name: detail.title, path: `/pro-tools/${categorySlug}` },
      ],
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-body-charcoal">
            <Link href="/pro-tools" prefetch={false} className="hover:underline">
              {t("breadcrumbPremiumTools")}
            </Link>
            <span className="mx-2">/</span>
            <span>{detail.title}</span>
          </nav>
          <header className="mb-8 max-w-3xl">
            <h1 className="text-2xl font-semibold text-premium-velvet sm:text-3xl">{detail.title}</h1>
            <p className="mt-3 text-sm text-body-charcoal sm:text-base">{detail.summary}</p>
          </header>

          <div className="sc-premium-category-section">
            <section className="sc-premium-category-section__block">
              <h2 className="sc-premium-category-section__heading">{t("premiumSection")}</h2>
              <PremiumToolGrid
                tools={detail.premiumTools}
                locale={locale}
                openLabel={t("openCalculator")}
              />
            </section>

            {freeTools.length > 0 ? (
              <section className="sc-premium-category-section__block">
                <h2 className="sc-premium-category-section__heading">{t("relatedFreeSection")}</h2>
                <ToolsTileGrid tools={freeTools} />
              </section>
            ) : null}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
