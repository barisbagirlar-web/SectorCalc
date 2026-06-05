import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { HeroPlatformIllustration, TrustedIndustriesStrip } from "@/components/ui/MagiClickIllustrations";
import { HomeOperationsValueSection } from "@/components/sections/HomeOperationsValueSection";

export function HeroSection() {
  return (
    <section className="first-tab">
      <PageHero
        variant="home"
        title="Stop Pricing Work That Loses Money."
        subtitle="Sector-specific cost and risk reports for manufacturing, small industry and service businesses — without expensive ERP or consulting overhead."
      >
        <div className="mc-hero-actions">
          <Link href="/industries" className="mc-btn-hero-primary">
            Find Your Safe Price
          </Link>
          <Link href="/reports/sample-decision-report" className="mc-btn-hero-secondary">
            View Sample Report
          </Link>
        </div>
        <p className="mc-hero-microcopy">
          <Link href="/free-tools">Need a quick number? Try a free estimator →</Link>
        </p>
      </PageHero>
      <div className="container text-center">
        <div className="row">
          <div className="col-xs-12">
            <figure className="apple-image">
              <HeroPlatformIllustration className="mc-hero-visual" />
            </figure>
          </div>
        </div>
      </div>
      <HomeOperationsValueSection />
      <section className="second-tab" aria-label="Industries served">
        <div className="container text-center">
          <div className="row">
            <figure className="col-xs-12">
              <TrustedIndustriesStrip />
            </figure>
          </div>
        </div>
      </section>
    </section>
  );
}
