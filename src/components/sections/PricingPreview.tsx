import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";

/** Homepage pricing teaser */
export function PricingPreview() {
  return (
    <section className="seventh-tab seventh-tab--muted">
      <div className="container">
        <h2>Pricing</h2>
        <p>Start free. Upgrade when you need packaged decision reports, scenarios and risk verdicts.</p>
        <PricingPlansGrid showHeader={false} compact embedded />
      </div>
    </section>
  );
}
