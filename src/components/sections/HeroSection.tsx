import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { HeroPlatformIllustration, TrustedIndustriesStrip } from "@/components/ui/MagiClickIllustrations";
import { SITE } from "@/config/site";

const HERO_BULLETS = [
  "Quick estimates for common business questions",
  "Premium reports for margin, pricing and risk decisions",
  "Sector-specific tools for operators, consultants and teams",
] as const;

export function HeroSection() {
  return (
    <section className="first-tab">
      <PageHero
        title={SITE.tagline}
        subtitle="SectorCalc turns cost, margin, capacity and pricing inputs into structured decision reports, risk signals and actionable recommendations across industries."
      >
        <ul className="mc-hero-bullets">
          {HERO_BULLETS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mc-hero-actions">
          <Link href="/industries" className="mc-btn-hero-primary">
            Explore Sector Tools
          </Link>
          <Link href="/reports/sample-decision-report" className="mc-btn-hero-secondary">
            View Sample Report
          </Link>
        </div>
        <p className="mc-hero-microcopy">
          <Link href="/free-tools">Start with free estimators</Link> if you only need a quick
          number.
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
