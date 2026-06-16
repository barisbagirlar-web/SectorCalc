import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { PremiumCatalogSearch } from "@/components/catalog/PremiumCatalogSearch";
import type {
  SearchablePremiumTool,
  SearchablePremiumCategory,
} from "@/components/catalog/PremiumCatalogSearch";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { listPremiumCatalogCategories } from "@/lib/premium/premium-category-resolver";
import { buildPremiumCatalogTools } from "@/lib/catalog/premium-catalog-source";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "premiumCategoryCatalog" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/premium-tools",
    locale: locale as AppLocale,
  });
}

export default async function PremiumToolsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const rawCategories = listPremiumCatalogCategories(locale);
  const premiumCatalogTools = buildPremiumCatalogTools(locale);

  const searchableTools: SearchablePremiumTool[] = premiumCatalogTools.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    categorySlug: item.categoryId,
    categoryLabel: item.categoryLabel,
    routePath: item.routePath,
    isActive: item.isActive,
    searchTerms: item.searchTerms,
    aliases: item.aliases,
    keywords: item.keywords,
  }));

  const searchableCategories: SearchablePremiumCategory[] = rawCategories
    .filter((c) => c.premiumToolCount > 0)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      iconKey: c.iconKey,
      count: c.premiumToolCount,
    }));

  const t = await getTranslations("premiumCategoryCatalog");
  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "premiumTools", path: "/premium-tools" },
      ],
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <Suspense fallback={<div className="min-h-[12rem]" aria-hidden="true" />}>
            <PremiumCatalogSearch tools={searchableTools} categories={searchableCategories} />
          </Suspense>
        </Container>
      </section>
    </PageLayout>
  );
}
