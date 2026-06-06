import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { ToolCatalogByCategory } from "@/components/tools/ToolCatalogByCategory";
import { FreeToolPrivacyNote } from "@/components/tools/FreeToolPrivacyNote";
import { Container } from "@/components/ui/Container";
import { IconListItem } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import { Button } from "@/components/ui/Button";
import { FREE_TOOLS } from "@/data/tools";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumToolsHref } from "@/lib/tools/tool-links";

export const metadata: Metadata = createPageMetadata({
  title: "Free Sector Calculators",
  description:
    "Free sector calculators for quick visible risk checks across seventeen industries. Browser-side processing with a clear path to premium decision analyzers.",
  path: "/free-tools",
});

const FREE_INCLUDES = [
  "Basic structured inputs (3–5 fields)",
  "Immediate risk signal output",
  "Short interpretation note",
  "Link to matching premium analyzer",
] as const;

const FREE_EXCLUDES = [
  "Minimum safe price verdict",
  "Full decision report package",
  "PDF / export",
  "Saved report history",
] as const;

export default function FreeToolsPage() {
  return (
    <PageLayout headerTheme="light">
      <section className="border-b border-slate/10 bg-off-white py-10 sm:py-12">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-professional-blue">
            Free tools
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
            Quick sector checks
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            Directional risk signals for cost, margin and pricing questions — free, fast and
            built to lead into premium verdict analyzers when you need a real decision.
          </p>
        </Container>
      </section>

      <section className="border-b border-slate/10 bg-white py-10 sm:py-12">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-deep-navy">What free tools include</h2>
              <ul className="mt-4 space-y-2.5">
                {FREE_INCLUDES.map((item) => (
                  <IconListItem key={item} icon={UI_ICON.check} iconClassName="text-emerald">
                    {item}
                  </IconListItem>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-deep-navy">What free tools do not include</h2>
              <ul className="mt-4 space-y-2.5">
                {FREE_EXCLUDES.map((item) => (
                  <IconListItem key={item} icon={UI_ICON.exclude} iconClassName="text-slate">
                    {item}
                  </IconListItem>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <FreeToolPrivacyNote />
          </div>
        </Container>
      </section>

      <section className="border-b border-slate/10 bg-off-white py-10 sm:py-14">
        <Container size="wide">
          <h2 className="text-xl font-bold text-deep-navy">Free tools catalog</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate">
            {FREE_TOOLS.length} free calculators across seventeen active sectors.
          </p>
          <div className="mt-8">
            <ToolCatalogByCategory tools={FREE_TOOLS} />
          </div>
        </Container>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <Container>
          <div className="rounded-2xl border border-slate/15 bg-off-white/50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-deep-navy">Need a verdict, not just a check?</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">
              Premium analyzers add safe price floors, margin leak detection and accept / reprice
              verdicts — included with SectorCalc Pro.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={getPremiumToolsHref()} variant="primary" size="lg">
                Explore premium analyzers
              </Button>
              <Link
                href="/industries"
                className="inline-flex min-h-[44px] items-center justify-center text-sm font-semibold text-slate hover:text-professional-blue"
              >
                Browse by industry →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
