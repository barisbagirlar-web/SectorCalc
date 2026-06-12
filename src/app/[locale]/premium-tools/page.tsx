import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { PremiumSectorGrid } from "@/components/catalog/PremiumSectorGrid";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { listPremiumCatalogCategories } from "@/lib/premium/premium-category-resolver";
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
  const t = await getTranslations("premiumCategoryCatalog");
  const categories = listPremiumCatalogCategories(locale).map((category) => ({
    slug: category.slug,
    title: category.title,
    summary: category.summary,
    iconKey: category.iconKey,
    premiumToolCount: category.premiumToolCount,
    relatedFreeToolCount: category.relatedFreeToolCount,
    premiumCountLabel: t("premiumCount", { count: category.premiumToolCount }),
    relatedFreeCountLabel: t("relatedFreeCount", { count: category.relatedFreeToolCount }),
    viewCategoryLabel: t("viewCategory"),
  }));

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
          <PremiumSectorGrid categories={categories} />
        </Container>
      </section>
    </PageLayout>
  );
}
