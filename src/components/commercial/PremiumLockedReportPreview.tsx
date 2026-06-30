import Link from "@/lib/ui-shared/navigation/next-link";
import { Container } from "@/components/ui/Container";
import { getSampleReportHref } from "@/lib/features/tools/tool-links";

const LOCKED_SECTIONS = [
  "Minimum safe price floor",
  "Margin leak drivers",
  "Scenario comparison rows",
  "Calculation summary appendix",
  "PDF / Excel / Word export",
] as const;

export function PremiumLockedReportPreview() {
  return (
    <section className="sc-pro-section sc-pro-section--alt">
      <Container className="sc-pro-container">
        <p className="sc-pro-eyebrow">Report preview</p>
        <h2 className="sc-pro-title sc-pro-title--compact">Premium locked report preview</h2>
        <p className="sc-pro-lead mt-3 max-w-2xl">
          Users see structure and value — locked fields stay blurred until checkout. Full sample
          available on the public sample report page.
        </p>
        <div className="relative mt-8 overflow-hidden rounded-xl border border-border-subtle bg-white p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Executive summary
              </p>
              <p className="mt-2 text-sm text-deep-navy">
                Verdict headline and risk classification — visible in sample.
              </p>
            </div>
            {LOCKED_SECTIONS.map((section) => (
              <div key={section} className="relative rounded-lg bg-bg-secondary px-4 py-3">
                <p className="text-sm font-medium text-deep-navy/40 blur-[2px] select-none">{section}</p>
                <p className="absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-wide text-deep-navy/70">
                  Premium locked
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-sm">
          <Link href={getSampleReportHref()} className="font-semibold text-deep-navy hover:underline">
            View full sample verdict report →
          </Link>
        </p>
      </Container>
    </section>
  );
}
