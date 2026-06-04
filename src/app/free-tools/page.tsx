import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ToolCard } from "@/components/cards/ToolCard";
import { CTASection } from "@/components/sections/CTASection";
import { FREE_TOOLS } from "@/data/tools";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Free Tools",
  description:
    "Free sector estimators for Construction, Cleaning, Restaurant, E-commerce and CNC & Manufacturing. Quick directional numbers with a clear path to premium decision tools.",
  path: "/free-tools",
});

const FREE_INCLUDES = [
  "Basic structured inputs",
  "Immediate estimate output",
  "Short interpretation note",
  "Link to matching premium decision tool",
] as const;

const FREE_EXCLUDES = [
  "Full decision report package",
  "Scenario comparison package",
  "Saved calculation history",
  "PDF / Excel / Word export",
  "Professional review or certification",
] as const;

export default function FreeToolsPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Free Tools"
        title="Free tools for quick business estimates"
        subtitle="Use these tools to get fast directional numbers. When the result affects pricing, margin or operational risk, continue into the matching premium decision tool."
      />
      <section className="border-t border-slate/10 bg-white py-10 md:py-12">
        <Container size="wide">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-deep-navy">What free tools include</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate">
                {FREE_INCLUDES.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-deep-navy">What free tools do not include</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate">
                {FREE_EXCLUDES.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden>○</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
      <section className="border-t border-slate/10 bg-[#f4f6f8] py-12 md:py-16 lg:py-20">
        <Container size="wide">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FREE_TOOLS.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </Container>
      </section>
      <CTASection
        title="Need a decision report?"
        subtitle="Premium sector tools add scenarios, risk signals and packaged recommendations — payment and export are preview-only in the MVP."
        primaryLabel="Explore premium tools"
        primaryHref="/industries"
        secondaryLabel="View sample report"
        secondaryHref="/reports/sample-decision-report"
      />
    </PageLayout>
  );
}
