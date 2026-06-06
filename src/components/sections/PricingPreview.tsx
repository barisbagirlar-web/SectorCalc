import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";

/** Homepage pricing teaser */
export function PricingPreview() {
  return (
    <section className="seventh-tab seventh-tab--muted">
      <div className="container">
        <h2>Pricing</h2>
        <p className="mc-home-pricing-roi">
          One avoided bad quote can pay for a full year of Pro.
        </p>
        <p>Start with a free margin check. Upgrade when you need full verdicts, saved reports and PDF export.</p>
        <PricingPlansGrid showHeader={false} compact embedded featuredOnly />
      </div>
    </section>
  );
}
