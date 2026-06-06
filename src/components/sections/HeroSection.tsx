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
            {t("primaryCta")}
          </Link>
          <Link href="/reports/sample-decision-report" className="mc-btn-hero-secondary">
            {t("secondaryCta")}
          </Link>
        </div>
        <HomeTrustStrip />
      </PageHero>
      <HeroDeviceMockup />
    </section>
  );
}
