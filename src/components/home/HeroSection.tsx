import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { HomepageCatalogSearch } from "@/components/home/HomepageCatalogSearch";
import { HeroMathematicalSymbols } from "@/components/home/HeroMathematicalSymbols";
import type { CatalogSearchEntry } from "@/lib/catalog/catalog-search";

type HeroSectionProps = {
  searchEntries: readonly CatalogSearchEntry[];
};

export async function HeroSection({ searchEntries }: HeroSectionProps) {
  const t = await getTranslations("homepageHybrid");
  const tHome = await getTranslations("home");

  return (
    <section className="sc-home-omni__hero" aria-labelledby="home-hero-heading">
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <div className="sc-home-omni__hero-grid">
          <div className="sc-home-omni__hero-main">
            <h1 id="home-hero-heading" className="sc-home-omni__headline sc-home-omni__headline--wide">
              {tHome("heroTitle")}
            </h1>
            <p className="sc-home-omni__subtitle">
              {tHome("heroSub1")}
              <br />
              {tHome("heroSub2")}
            </p>
            <div className="sc-home-omni__search">
              <HomepageCatalogSearch entries={searchEntries} />
            </div>
            <div className="sc-home-omni__hero-actions">
              <Link href="/free-tools" className="sc-cta-primary">
                {t("hero.ctaPrimary")}
              </Link>
              <Link href="/premium-tools" className="sc-cta-secondary">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
              <span>Verileriniz saklanmaz. Her hesaplama anlık, iz bırakmaz.</span>
            </div>
          </div>
          <HeroMathematicalSymbols />
        </div>
      </Container>
    </section>
  );
}
