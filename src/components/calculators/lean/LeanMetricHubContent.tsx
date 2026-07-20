"use client";

import { useState } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { SITE, siteUrl } from "@/config/site";
import {
  type LeanMetricHubDefinition,
  type LeanMetricHubSlug,
  LEAN_METRIC_HUBS,
  LEAN_METRIC_HUB_SLUGS,
} from "@/lib/features/tools/lean-metric-hubs";
import { LeanMetricCalculatorPanel } from "@/components/calculators/lean/LeanMetricCalculatorPanel";

function SectionCard({ id, title, children }: { id: string; title?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 lg:mb-24">
      {title ? (
        <h2 className="mb-8 text-2xl lg:text-3xl font-semibold text-[var(--sc-text)] font-heading heading-serif">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

function CopyCitationButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative mb-6">
      <p className="text-sm font-semibold text-[var(--sc-text)] mb-2 uppercase tracking-wider">{label}</p>
      <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-4 relative">
        <pre className="text-sm font-mono text-[var(--sc-muted)] whitespace-pre-wrap">{text}</pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-[var(--sc-surface)] border border-[var(--sc-border)] px-3 py-1 text-xs font-semibold uppercase hover:bg-[var(--sc-accent-soft)] hover:text-[var(--sc-accent)] transition-colors focus-visible min-h-[44px] min-w-[44px]"
          aria-label={`Copy ${label} citation`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function buildLeanMetricJsonLd(hub: LeanMetricHubDefinition): Record<string, unknown> {
  const canonical = `${siteUrl}${hub.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: hub.h1,
        description: hub.metaDescription,
        datePublished: "2026-07-20",
        dateModified: "2026-07-20",
        publisher: { "@id": `${siteUrl}/#organization` },
        about: { "@id": `${canonical}#definedterm` },
        mainEntity: [
          { "@id": `${canonical}#faq` },
          { "@id": `${canonical}#howto` },
          { "@id": `${canonical}#softwareapplication` },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${canonical}#softwareapplication`,
        name: hub.h1,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: canonical,
        description: hub.lead,
        publisher: { "@id": `${siteUrl}/#organization` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        citation: {
          "@type": "CreativeWork",
          name: "Lean Thinking & Practice Principles",
          url: "https://www.lean.org/",
        },
        mentions: [{ "@id": `${canonical}#definedterm` }],
      },
      {
        "@type": "DefinedTerm",
        "@id": `${canonical}#definedterm`,
        name: hub.definedTerm,
        description: hub.definedTermDescription,
        inDefinedTermSet: "ISO 22400-2 / Lean Manufacturing KPI",
      },
      {
        "@type": "HowTo",
        "@id": `${canonical}#howto`,
        name: `How to calculate ${hub.definedTerm}`,
        step: hub.howToSteps.map((step) => ({
          "@type": "HowToStep",
          name: step.name,
          text: step.text,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: hub.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Lean Manufacturing", item: `${siteUrl}/lean` },
          { "@type": "ListItem", position: 3, name: hub.definedTerm, item: canonical },
        ],
      },
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: SITE.siteName, url: siteUrl },
    ],
  };
}

export function LeanMetricHubContent({ slug }: { slug: LeanMetricHubSlug }) {
  const hub = LEAN_METRIC_HUBS[slug];
  const related = LEAN_METRIC_HUB_SLUGS.filter((s) => s !== slug);

  return (
    <>
      <SemanticJsonLd data={buildLeanMetricJsonLd(hub)} />

        <SectionCard id="calculator">
          <LeanMetricCalculatorPanel
            slug={slug}
            freeToolPath={hub.freeToolPath}
            freeToolLabel={hub.freeToolLabel}
          />
        </SectionCard>

        <SectionCard id="quick-decision" title="Quick Decision Summary">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--sc-border)] text-sm">
              <thead className="bg-[var(--sc-surface-strong)] text-left">
                <tr>
                  <th className="p-3 border-b border-[var(--sc-border)]">Question</th>
                  <th className="p-3 border-b border-[var(--sc-border)]">Short Answer</th>
                </tr>
              </thead>
              <tbody>
                {hub.quickDecision.map((row) => (
                  <tr key={row.question}>
                    <td className="p-3 border-b border-[var(--sc-border)]">{row.question}</td>
                    <td className="p-3 border-b border-[var(--sc-border)]">{row.answer}</td>
                  </tr>
                ))}
                <tr>
                  <td className="p-3">World-class target</td>
                  <td className="p-3">{hub.worldClassTarget}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard id="methodology" title="Calculation Methodology">
          <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm rounded-sm mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-2">
              {hub.definedTerm} Formula
            </h3>
            <p className="text-2xl font-mono font-bold text-[var(--sc-text)] mb-4">{hub.formulaDisplay}</p>
            <p className="text-sm text-[var(--sc-muted)]">{hub.formulaCaption}</p>
          </div>
          <h3 className="text-lg font-semibold text-[var(--sc-text)] mb-3 font-heading heading-serif">
            Method Assumptions
          </h3>
          <ul className="list-disc list-inside space-y-2 text-[var(--sc-muted)] mb-6">
            {hub.methodAssumptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="border border-[var(--sc-border)] p-4 text-sm text-[var(--sc-muted)]" data-testid="method-evidence-repeat">
            <p>
              <strong className="text-[var(--sc-text)]">Source verification:</strong> {hub.evidence.sourceVerification}
            </p>
            <p className="mt-2">
              <strong className="text-[var(--sc-text)]">Reference:</strong> {hub.evidence.reference}
            </p>
            <p className="mt-2">
              <strong className="text-[var(--sc-text)]">Declared span:</strong> {hub.evidence.declaredSpan}
            </p>
          </div>
        </SectionCard>

        <SectionCard id="behavior" title={`${hub.definedTerm} Behavior Intelligence`}>
          <div className="grid md:grid-cols-2 gap-4">
            {hub.behavior.map((card) => (
              <div key={card.title} className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 rounded-sm">
                <h3 className="font-semibold text-[var(--sc-text)] mb-2">{card.title}</h3>
                <p className="text-sm text-[var(--sc-muted)]">{card.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard id="framework-context" title="Framework Context">
          <p className="text-[var(--sc-muted)] mb-6">
            Former /lean/&#123;framework&#125;/{hub.slug} pages consolidated here. Framework context lives on the
            canonical metric hub — not as near-duplicate indexable spokes.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {hub.frameworkContext.map((note) => (
              <article key={note.framework} className="border border-[var(--sc-border)] bg-[var(--sc-surface-strong)] p-5 rounded-sm">
                <h3 className="font-semibold text-[var(--sc-text)] mb-2">{hub.definedTerm} in {note.framework}</h3>
                <p className="text-sm text-[var(--sc-muted)]">{note.body}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard id="scenarios" title="Scenario Library">
          <p className="text-[var(--sc-muted)] mb-6">
            Industrial scenarios computed with the same Big.js screening formulas used in the calculator panel.
          </p>
          <div className="space-y-8">
            {hub.scenarios.map((scenario) => (
              <article key={scenario.id} className="border border-[var(--sc-border)] bg-[var(--sc-surface-strong)] p-6 rounded-sm">
                <h3 className="text-xl font-semibold text-[var(--sc-text)] font-heading heading-serif mb-2">
                  {scenario.title}
                </h3>
                <p className="text-sm text-[var(--sc-muted)] mb-4">{scenario.summary}</p>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-[var(--sc-border)] text-sm">
                    <thead className="bg-[var(--sc-surface)]">
                      <tr>
                        <th className="p-2 border-b border-[var(--sc-border)] text-left">Input</th>
                        <th className="p-2 border-b border-[var(--sc-border)] text-left">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenario.inputRows.map((input) => (
                        <tr key={`${scenario.id}-${input.label}`}>
                          <td className="p-2 border-b border-[var(--sc-border)]">{input.label}</td>
                          <td className="p-2 border-b border-[var(--sc-border)]">{input.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm mb-2">
                  <strong className="text-[var(--sc-text)]">{scenario.outputLabel}:</strong>{" "}
                  <span className="font-mono">{scenario.outputValue}</span>
                </p>
                <p className="text-sm text-[var(--sc-muted)]">{scenario.interpretation}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard id="citation" title="Cite This Calculator">
          <CopyCitationButton label="APA" text={hub.citations.apa} />
          <CopyCitationButton label="MLA" text={hub.citations.mla} />
          <CopyCitationButton label="Chicago" text={hub.citations.chicago} />
          <CopyCitationButton label="BibTeX" text={hub.citations.bibtex} />
          <CopyCitationButton label="RIS" text={hub.citations.ris} />
        </SectionCard>

        <SectionCard id="references" title="References and Standards Context">
          <ul className="space-y-4 text-[var(--sc-muted)]">
            <li>
              <strong className="text-[var(--sc-text)]">ISO 22400-2 — Manufacturing operations management KPIs:</strong>{" "}
              Primary industrial KPI framing for OEE, takt/cycle time context, and resource utilization.
            </li>
            <li>
              <strong className="text-[var(--sc-text)]">Lean Enterprise Institute — Lean Thinking &amp; Practice:</strong>{" "}
              Lean Thinking and Practice Principles are the intellectual property of the{" "}
              <a href="https://www.lean.org/" className="underline text-[var(--sc-text)]" target="_blank" rel="noopener noreferrer">
                Lean Enterprise Institute
              </a>
              .
            </li>
            <li>
              <strong className="text-[var(--sc-text)]">Ohno, Taiichi — Toyota Production System:</strong> Foundational
              waste and flow framing for takt, scrap, and capacity decisions (title citation; no fabricated URL).
            </li>
            <li>
              <strong className="text-[var(--sc-text)]">Shingo, Shigeo — A Study of the Toyota Production System:</strong>{" "}
              Process improvement and non-stock production concepts (title citation).
            </li>
            <li>
              <strong className="text-[var(--sc-text)]">Womack &amp; Jones — Lean Thinking:</strong> Value, value stream,
              flow, pull, and perfection as the five Lean principles (title citation).
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-[var(--sc-text)] mt-8 mb-3 font-heading heading-serif">
            What This Page Is / Is Not
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--sc-border)] text-sm">
              <thead className="bg-[var(--sc-surface-strong)] text-left">
                <tr>
                  <th className="p-3 border-b border-[var(--sc-border)]">This page is</th>
                  <th className="p-3 border-b border-[var(--sc-border)]">This page is not</th>
                </tr>
              </thead>
              <tbody>
                {hub.isIsNot.map((row) => (
                  <tr key={row.is}>
                    <td className="p-3 border-b border-[var(--sc-border)]">{row.is}</td>
                    <td className="p-3 border-b border-[var(--sc-border)]">{row.isNot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-[var(--sc-muted)]">
            Technical simulation for education and operational screening. Not financial, legal, or engineering advice.
            Verify all inputs and decisions against plant standards before business action.
          </p>
        </SectionCard>

        <SectionCard id="related" title="Related Lean Metric Hubs">
          <ul className="grid sm:grid-cols-2 gap-3">
            {related.map((relatedSlug) => {
              const relatedHub = LEAN_METRIC_HUBS[relatedSlug];
              return (
                <li key={relatedSlug}>
                  <Link
                    href={relatedHub.path}
                    className="block border border-[var(--sc-border)] bg-[var(--sc-surface-strong)] p-4 hover:border-[var(--sc-accent)] focus-visible min-h-[48px]"
                  >
                    <span className="font-semibold text-[var(--sc-text)]">{relatedHub.definedTerm}</span>
                    <span className="block text-xs text-[var(--sc-muted)] mt-1">{relatedHub.path}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard id="faq" title="FAQ">
          <div className="space-y-6">
            {hub.faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-[var(--sc-text)] mb-2">{faq.q}</h3>
                <p className="text-[var(--sc-muted)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </SectionCard>
    </>
  );
}
