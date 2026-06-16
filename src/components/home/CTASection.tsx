import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

export async function CTASection() {
  const t = await getTranslations("homepageHybrid");

  return (
    <section className="sc-home-omni__mission" aria-labelledby="home-final-cta-heading">
      <Container className="sc-pro-container">
        <h2 id="home-final-cta-heading" className="sc-home-omni__mission-title">
          {t("finalCta.title")}
        </h2>
        <div className="sc-home-omni__hero-actions sc-home-omni__hero-actions--center sc-home-omni__mission-cta">
          <Link href="/free-tools" className="sc-cta-primary">
            {t("finalCta.ctaPrimary")}
          </Link>
          <Link href="/premium-tools" className="sc-cta-secondary">
            {t("finalCta.ctaSecondary")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
