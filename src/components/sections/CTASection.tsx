import Link from "next/link";
import { SITE } from "@/config/site";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  title = "Move from operational inputs to structured decisions",
  subtitle = `${SITE.siteName} helps operators and advisors evaluate cost, margin and pricing risk — with sector tools and decision reports built for real commercial outcomes.`,
  primaryLabel = "Explore sector tools",
  primaryHref = "/industries",
  secondaryLabel = "View sample report",
  secondaryHref = "/reports/sample-decision-report",
}: CTASectionProps) {
  return (
    <section className="mc-cta-tab">
      <div className="container">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="mc-hero-actions" style={{ justifyContent: "flex-start" }}>
          <Link href={primaryHref} className="mc-btn-hero-primary">
            {primaryLabel}
          </Link>
          <Link href={secondaryHref} className="mc-btn-hero-secondary">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
