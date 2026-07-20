import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { SITE, siteUrl } from "@/config/site";
import { LEAN_CONCEPTS_PUBLIC, LEAN_METRICS_PUBLIC } from "@/lib/features/tools/lean-calc-registry";
import { LEAN_METRIC_HUBS, LEAN_METRIC_HUB_SLUGS } from "@/lib/features/tools/lean-metric-hubs";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildEntityGraph } from "@/lib/infrastructure/seo/entity-graph";

export const metadata: Metadata = {
  title: "Lean Manufacturing Methodology Hub | SectorCalc",
  description:
    "Deep Lean methodology hub for PDCA, Gemba, A3, and Muda — linked to canonical KPI calculators for takt time, OEE, scrap rate, cycle time, and capacity utilization.",
  metadataBase: new URL(SITE.url),
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE.url}/lean`,
    languages: {
      en: `${SITE.url}/en/lean`,
      "en-us": `${SITE.url}/en/lean`,
      "en-gb": `${SITE.url}/en/lean`,
      "x-default": `${SITE.url}/lean`,
    },
  },
};

const FRAMEWORK_DEPTH: Record<
  string,
  { when: string; metricRelation: string; example: string; leiContext: string }
> = {
  pdca: {
    when: "Use PDCA when you need a repeatable improvement loop with explicit Plan, Do, Check, and Act gates — especially after a KPI signals a gap.",
    metricRelation:
      "Each of the five canonical metrics feeds PDCA: Plan with the target (takt, OEE world-class band, scrap ceiling); Do a timed trial; Check the calculator output; Act via standardized work or A3 countermeasures.",
    example:
      "A packaging cell Plan sets OEE ≥ 75%. Do runs a two-shift observation. Check shows Availability at 68%. Act launches SMED on changeovers before buying a faster filler.",
    leiContext:
      "Lean Enterprise Institute frames PDCA as the scientific method of Lean practice — experiments over opinions, with metrics as the Check step.",
  },
  gemba: {
    when: "Use Gemba when office data and floor reality diverge — micro-stops, informal buffers, and scrap classification rarely survive spreadsheet averages.",
    metricRelation:
      "Gemba validates the inputs behind takt (true available minutes), OEE (stop codes), scrap (bin contents), cycle (stopwatch), and utilization (the real bottleneck machine).",
    example:
      "An ERP reports 90% utilization on a CNC group. Gemba shows one machine at 98% with a queue while two sit waiting for fixtures — pooled capacity utilization lied.",
    leiContext:
      "Go to the actual place, look at the actual process, talk with the actual people — LEI Gemba practice before trusting any KPI dashboard.",
  },
  a3: {
    when: "Use A3 when the problem needs a single-page story: background, current condition, target, root cause, countermeasures, and follow-up.",
    metricRelation:
      "Canonical metric hubs supply the current-condition numbers. The A3 report template at /lean/a3-report turns a KPI gap into a structured countermeasure sheet.",
    example:
      "Missed shipments map to cycle time above takt. The A3 target condition is cycle ≤ takt; countermeasures split station work content; follow-up rechecks the cycle-time hub weekly.",
    leiContext:
      "A3 thinking is Lean problem-solving discipline — one page, one owner, evidence over anecdote — as taught in LEI practice communities.",
  },
  muda: {
    when: "Use Muda framing when waste types (defects, waiting, overproduction, inventory, motion, overprocessing, transport) must be named before solutions are funded.",
    metricRelation:
      "Scrap rate quantifies defects. Takt vs cycle exposes overproduction and waiting. OEE loss pillars map to waiting, speed loss, and defects. Utilization extremes reveal overburden and unused capacity.",
    example:
      "A 6% scrap rate after changeover is defects muda. Fixing it with more inspection adds overprocessing muda — the hub scenarios push first-article and SMED instead.",
    leiContext:
      "Ohno's seven wastes remain the vocabulary for seeing muda; LEI Lean Thinking keeps value and waste as the primary lens.",
  },
};

function buildLeanHubJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/lean#webpage`,
        url: `${siteUrl}/lean`,
        name: "Lean Manufacturing Methodology Hub",
        description:
          "PDCA, Gemba, A3, and Muda methodology hub linked to canonical Lean KPI calculators.",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Lean Manufacturing", item: `${siteUrl}/lean` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Canonical Lean Metric Calculators",
        itemListElement: LEAN_METRIC_HUB_SLUGS.map((slug, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: LEAN_METRIC_HUBS[slug].definedTerm,
          url: `${siteUrl}${LEAN_METRIC_HUBS[slug].path}`,
        })),
      },
    ],
  };
}

export default function LeanHubPage() {
  return (
    <>
      <SemanticJsonLd data={buildEntityGraph("en")} />
      <SemanticJsonLd data={buildLeanHubJsonLd()} />
      <div className="mx-auto max-w-4xl px-4 py-10" style={{ fontFamily: "Barlow, sans-serif" }}>
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-[#BD5D3A] mb-1">
            Lean Manufacturing · Operational Excellence
          </p>
          <h1 className="text-3xl font-bold text-[#1A1915] mb-3">Lean Manufacturing Methodology Hub</h1>
          <p className="text-sm text-[#1A1915]/70 leading-relaxed max-w-2xl">
            Deep methodology for PDCA, Gemba, A3, and Muda — each linked to five canonical KPI
            reference hubs. Former framework×metric URL combinations permanently redirect to those
            hubs so search equity consolidates on unique authority pages.
          </p>
        </div>

        <section className="mb-12" id="canonical-metrics">
          <h2 className="text-xl font-bold text-[#1A1915] mb-2">Canonical Lean Metric Hubs</h2>
          <p className="text-sm text-[#1A1915]/60 mb-4">
            One hub per metric. Framework context lives inside each hub — not as twenty near-duplicate
            pages.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEAN_METRIC_HUB_SLUGS.map((slug) => {
              const hub = LEAN_METRIC_HUBS[slug];
              const metricMeta = LEAN_METRICS_PUBLIC.find((m) => m.slug === slug);
              return (
                <Link
                  key={slug}
                  href={hub.path}
                  className="block border border-[#1A1915]/10 bg-[#F0EEE6] p-4 hover:border-[#BD5D3A]/40 transition-colors min-h-[48px]"
                >
                  <h3 className="text-sm font-semibold text-[#1A1915] mb-1">{hub.definedTerm}</h3>
                  <p className="text-[10px] text-[#1A1915]/40 uppercase font-mono mb-2">
                    {hub.path}
                    {metricMeta ? ` · ${metricMeta.formula}` : ""}
                  </p>
                  <p className="text-xs text-[#1A1915]/60 line-clamp-3">{hub.lead}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="space-y-12">
          {LEAN_CONCEPTS_PUBLIC.map((concept) => {
            const depth = FRAMEWORK_DEPTH[concept.slug];
            return (
              <section key={concept.slug} id={concept.slug}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex items-center rounded bg-[#1A1915] px-3 py-1 text-xs text-white font-mono uppercase">
                    {concept.slug}
                  </span>
                  <h2 className="text-lg font-bold text-[#1A1915]">{concept.name}</h2>
                </div>
                <p className="text-sm text-[#1A1915]/70 mb-4 leading-relaxed">{concept.description}</p>
                {depth ? (
                  <div className="space-y-3 text-sm text-[#1A1915]/70 border border-[#1A1915]/10 bg-[#F0EEE6] p-5">
                    <p>
                      <strong className="text-[#1A1915]">What it is / when to use: </strong>
                      {depth.when}
                    </p>
                    <p>
                      <strong className="text-[#1A1915]">Relation to the five metrics: </strong>
                      {depth.metricRelation}
                    </p>
                    <p>
                      <strong className="text-[#1A1915]">Worked example: </strong>
                      {depth.example}
                    </p>
                    <p>
                      <strong className="text-[#1A1915]">Lean Enterprise Institute context: </strong>
                      {depth.leiContext}
                    </p>
                    {concept.slug === "a3" ? (
                      <p className="pt-2">
                        <Link href="/lean/a3-report" className="underline text-[#BD5D3A] font-semibold">
                          Open A3 countermeasure template →
                        </Link>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        <div className="mt-12 pt-6 border-t border-[#1A1915]/10">
          <p className="text-[10px] text-[#1A1915]/40 leading-relaxed">
            Lean Thinking and Practice Principles are the intellectual property of the{" "}
            <a
              href="https://www.lean.org/"
              className="underline hover:text-[#BD5D3A]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lean Enterprise Institute
            </a>
            . SectorCalc provides deterministic engineering simulations for education and operational
            screening. Not financial, legal, or engineering advice. Primary manufacturing KPI framing:{" "}
            ISO 22400-2. Classical references (title citations): Ohno — Toyota Production System;
            Shingo — A Study of the Toyota Production System; Womack &amp; Jones — Lean Thinking.
          </p>
        </div>
      </div>
    </>
  );
}
