import { COMMERCIAL_TIERS } from "@/lib/commercial/commercial-model";
import { Container } from "@/components/ui/Container";

export function CommercialTiersOverview() {
  return (
    <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
      <Container className="sc-pro-container">
        <p className="sc-pro-eyebrow">Commercial model</p>
        <h2 className="sc-pro-title sc-pro-title--compact">How SectorCalc monetizes</h2>
        <p className="sc-pro-lead mt-3 max-w-3xl">
          Free checks build trust and SEO. Premium reports, sector packs, and Pro workspace capture
          decision value. Enterprise is inquiry-led — no fake customer claims.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {COMMERCIAL_TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`sc-pro-panel flex flex-col p-5 ${tier.id === "pro_workspace" ? "ring-2 ring-deep-navy/15" : ""}`}
            >
              <div className="public-demo-tier-header">
                <h3 className="font-semibold text-deep-navy">{tier.name}</h3>
                <p className="text-sm font-semibold text-deep-navy">
                  {tier.priceLabel}
                  <span className="ml-1 font-normal text-text-secondary">/ {tier.period}</span>
                </p>
              </div>
              <p className="mt-3 text-sm text-text-secondary">{tier.summary}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-text-secondary">
                {tier.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-deep-navy" aria-hidden>
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-text-secondary">
                {tier.checkoutLive
                  ? "Early access / request CTA — Stripe checkout reserved for live phase"
                  : "Inquiry-led or free tier"}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
