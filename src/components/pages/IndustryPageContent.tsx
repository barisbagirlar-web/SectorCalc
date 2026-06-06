import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Industry } from "@/data/industries";
import { getIndustryHubContent } from "@/data/industry-hub-content";
import { revenueLegalDisclaimer } from "@/lib/tools/revenue-tools";
import { getIndustryRegistryEntry } from "@/lib/tools/industry-registry";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";
import {
  getAccountHref,
  getFreeToolHref,
  getPremiumToolHref,
  getPricingHref,
} from "@/lib/tools/tool-links";

interface IndustryPageContentProps {
  industry: Industry;
}

export function IndustryPageContent({ industry }: IndustryPageContentProps) {
  const hub = getIndustryHubContent(industry.slug);
  const registryEntry = getIndustryRegistryEntry(industry.slug);
  const tool = getRevenueToolBySector(industry.slug);

  return (
    <>
      <PageHero
        eyebrow={industry.name}
        title={hub.hubTitle}
        description={hub.painStatement}
        align="left"
      />

      <section className="border-b border-border-subtle bg-white py-10 sm:py-12">
        <Container size="narrow">
          <p className="text-sm leading-relaxed text-slate">
            <strong className="text-text-primary">Who it is for:</strong> {hub.whoItsFor}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate">
            <strong className="text-text-primary">What decision it helps with:</strong>{" "}
            {hub.decisionHelp}
          </p>
        </Container>
      </section>

      {tool ? (
        <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-12">
          <Container>
            <h2 className="text-2xl font-bold text-text-primary">Free calculator</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
              {hub.freeToolExplanation}
            </p>
            <p className="mt-2 text-xs text-slate">
              Quick check only — no minimum safe price or accept/reject verdict.
            </p>
            <Button href={getFreeToolHref(tool)} size="lg" className="mt-6">
              Open {tool.freeTitle}
            </Button>
          </Container>
        </section>
      ) : null}

      {tool ? (
        <section className="border-b border-border-subtle bg-white py-10 sm:py-12">
          <Container>
            <h2 className="text-2xl font-bold text-text-primary">Premium analyzer</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
              {hub.premiumToolExplanation}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href={getPremiumToolHref(tool)} size="lg">
                Open {tool.paidTitle}
              </Button>
              <Button href={getPricingHref(tool)} variant="outline" size="lg">
                Start SectorCalc Pro
              </Button>
            </div>
          </Container>
        </section>
      ) : null}

      {registryEntry?.additionalAnalyzers &&
      registryEntry.additionalAnalyzers.length > 0 ? (
        <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-12">
          <Container>
            <h2 className="text-2xl font-bold text-text-primary">Additional analyzers</h2>
            <p className="mt-2 text-sm text-slate">
              Related decision tools on the SectorCalc roadmap for this sector.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {registryEntry.additionalAnalyzers.map((analyzer) => (
                <li
                  key={analyzer.title}
                  className="rounded-xl border border-border-subtle bg-white px-5 py-4"
                >
                  <p className="font-semibold text-text-primary">{analyzer.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    {analyzer.description}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="bg-bg-subtle py-10 sm:py-12">
        <Container size="narrow">
          <p className="text-sm leading-relaxed text-slate">{revenueLegalDisclaimer}</p>
          <nav className="mt-6 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-4">
            <Link href="/industries" className="font-medium text-accent-teal hover:underline">
              All industries
            </Link>
            {tool ? (
              <>
                <Link
                  href={getFreeToolHref(tool)}
                  className="font-medium text-accent-teal hover:underline"
                >
                  Free calculator
                </Link>
                <Link
                  href={getPremiumToolHref(tool)}
                  className="font-medium text-accent-teal hover:underline"
                >
                  Premium analyzer
                </Link>
                <Link
                  href={getPricingHref(tool)}
                  className="font-medium text-accent-teal hover:underline"
                >
                  SectorCalc Pro pricing
                </Link>
              </>
            ) : null}
            <Link
              href={getAccountHref()}
              className="font-medium text-accent-teal hover:underline"
            >
              Account
            </Link>
          </nav>
        </Container>
      </section>
    </>
  );
}
