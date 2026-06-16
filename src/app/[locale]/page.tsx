import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { AudienceGrid } from "@/components/home/AudienceGrid";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CompareCards } from "@/components/home/CompareCards";
import { CTASection } from "@/components/home/CTASection";
import { TraceIntroSection } from "@/components/trace/TraceIntroSection";
import { HeroSection } from "@/components/home/HeroSection";
import { LimitsGrid } from "@/components/home/LimitsGrid";
import { LossGrid } from "@/components/home/LossGrid";
import { PopularTools } from "@/components/home/PopularTools";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildHomeJsonLd } from "@/lib/semantic/build-home-jsonld";
import { createPageMetadata } from "@/lib/metadata";
import { buildHomepageSearchEntries } from "@/lib/home/homepage-search-entries";
import type { AppLocale } from "@/i18n/routing";
import type { FreeTrafficCategoryMeta } from "@/lib/tools/free-traffic-categories";

export const revalidate = 3600;
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepageHybrid" });

  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/",
    locale: locale as AppLocale,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCatalog = await getTranslations("freeTrafficCatalog");
  const searchEntries = buildHomepageSearchEntries(
    locale,
    (meta: FreeTrafficCategoryMeta) => ({
      label: tCatalog(meta.labelKey),
      description: tCatalog(meta.descriptionKey),
    }),
    tCatalog("openCalculator")
  );

  return (
    <PageLayout>
      <SemanticJsonLd data={buildHomeJsonLd(locale)} />
      <div className="sc-home-omni">
        <HeroSection searchEntries={searchEntries} />
        <TraceIntroSection />
        <CategoryGrid />
        <LossGrid />
        <CompareCards />
        <PopularTools />
        <AudienceGrid />
        <LimitsGrid />
        <CTASection />
      </div>
    </PageLayout>
  );
}
