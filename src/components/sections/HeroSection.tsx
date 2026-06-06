import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { HomeTrustStrip } from "@/components/sections/HomeConversionSections";
import { HeroDeviceMockup } from "@/components/home/HeroDeviceMockup";

export async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section className="first-tab">
      <PageHero variant="home" title={t("title")} subtitle={t("subtitle")}>
        <div className="mc-hero-actions">
          <Link href="/free-tools" className="mc-btn-hero-primary">
            {t("exploreFreeCta")}
          </Link>
          <Link href="/premium-tools" className="mc-btn-hero-secondary">
            {t("viewPremiumCta")}
          </Link>
        </div>
        <HomeTrustStrip />
      </PageHero>
      <HeroDeviceMockup />
    </section>
  );
}
