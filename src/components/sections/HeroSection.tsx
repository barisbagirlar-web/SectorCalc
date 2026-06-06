import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { HomeTrustStrip } from "@/components/sections/HomeConversionSections";
import { HeroDeviceMockup } from "@/components/home/HeroDeviceMockup";

export function HeroSection() {
  return (
    <section className="first-tab">
      <PageHero
        variant="home"
        title="Her sektör için ÖZEL ölç, kaybı tespit et, güvenle karar ver."
        subtitle="SectorCalc helps businesses and professionals calculate costs, measure efficiency, detect losses, and optimize operations — without expensive ERP systems."
      >
        <div className="mc-hero-actions">
          <Link href="/free-tools" className="mc-btn-hero-primary">
            Run a Free Margin Check
          </Link>
          <Link href="/reports/sample-decision-report" className="mc-btn-hero-secondary">
            View Sample Verdict Report
          </Link>
        </div>
        <HomeTrustStrip />
      </PageHero>
      <HeroDeviceMockup />
    </section>
  );
}
