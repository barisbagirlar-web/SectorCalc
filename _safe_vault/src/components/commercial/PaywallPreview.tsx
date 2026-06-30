import { PAYWALL_LOCKED_FEATURES } from "@/lib/commercial/commercial-model";
import { Container } from "@/components/ui/Container";

export function PaywallPreview() {
  return (
    <section className="sc-pro-section sc-pro-section--border">
      <Container className="sc-pro-container">
        <p className="sc-pro-eyebrow">Paywall boundary</p>
        <h2 className="sc-pro-title sc-pro-title--compact">Free vs premium visibility</h2>
        <p className="sc-pro-lead mt-3 max-w-2xl">
          Free tier shows risk signal and directional summary. Premium insight, calculation summary preview,
          exports, and recommendation layers stay locked until purchase or subscription.
        </p>
        <div className="public-demo-table-wrap mt-8 rounded-xl border border-border-subtle bg-white">
          <table className="public-demo-table text-left text-sm">
            <thead className="bg-bg-secondary text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">Capability</th>
                <th className="px-4 py-3 font-semibold">Free</th>
                <th className="px-4 py-3 font-semibold">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border-subtle">
                <td className="px-4 py-3">Risk signal + summary</td>
                <td className="px-4 py-3 text-deep-navy">Visible</td>
                <td className="px-4 py-3 text-deep-navy">Visible</td>
              </tr>
              {PAYWALL_LOCKED_FEATURES.map((feature) => (
                <tr key={feature.id} className="border-t border-border-subtle">
                  <td className="px-4 py-3">{feature.label}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {feature.freeVisible ? "Visible" : "Locked"}
                  </td>
                  <td className="px-4 py-3 text-deep-navy">Unlocked</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
