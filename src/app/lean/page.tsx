import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { SITE } from "@/config/site";
import { LEAN_CALC_MATRIX } from "@/lib/features/tools/lean-calc-registry";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lean Manufacturing Calculators | SectorCalc",
  description: "Fast operational checks for Lean Manufacturing metrics. Structured inputs, immediate results, clear next actions. PDCA, Gemba, A3, and Muda methodology calculators.",
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

export default function LeanHubPage() {
  // Group entries by concept for organized display
  const conceptMap = new Map<string, Array<(typeof LEAN_CALC_MATRIX)[number]>>();
  for (const entry of LEAN_CALC_MATRIX) {
    const key = entry.concept.slug;
    if (!conceptMap.has(key)) {
      conceptMap.set(key, []);
    }
    conceptMap.get(key)!.push(entry);
  }

  const conceptGroups = Array.from(conceptMap.entries());

  return (
    <div
      className="mx-auto max-w-4xl px-4 py-10"
      style={{ fontFamily: "Barlow, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#BD5D3A] mb-1">
          Lean Manufacturing · Operational Excellence
        </p>
        <h1 className="text-3xl font-bold text-[#1A1915] mb-3">
          Lean Manufacturing Calculators
        </h1>
        <p className="text-sm text-[#1A1915]/70 leading-relaxed max-w-2xl">
          Fast operational checks aligned with Lean Thinking principles.
          Structured inputs, immediate deterministic results, and clear next actions
          following the PDCA cycle. Create more value with fewer resources.
        </p>
      </div>

      {/* Concept groups */}
      <div className="space-y-10">
        {conceptGroups.map(([conceptSlug, entries]) => {
          const concept = entries[0]!.concept;
          return (
            <section key={conceptSlug}>
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center rounded bg-[#1A1915] px-3 py-1 text-xs text-white font-mono uppercase">
                  {conceptSlug}
                </span>
                <h2 className="text-lg font-bold text-[#1A1915]">
                  {concept.name}
                </h2>
              </div>
              <p className="text-xs text-[#1A1915]/50 mb-4">
                {concept.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {entries.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={entry.path}
                    className="block border border-[#1A1915]/10 bg-[#F0EEE6] p-4 hover:border-[#BD5D3A]/30 transition-colors"
                  >
                    <h3 className="text-sm font-semibold text-[#1A1915] mb-1">
                      {entry.metric.name}
                    </h3>
                    <p className="text-[10px] text-[#1A1915]/40 uppercase font-mono mb-2">
                      {entry.metric.unit} · {entry.metric.formula}
                    </p>
                    <p className="text-xs text-[#1A1915]/60 line-clamp-2">
                      {entry.description.slice(0, 120)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Citation footer */}
      <div className="mt-10 pt-6 border-t border-[#1A1915]/10">
        <p className="text-[10px] text-[#1A1915]/30 leading-relaxed">
          Lean Thinking and Practice Principles are the intellectual property of the{" "}
          <a
            href="https://www.lean.org/"
            className="underline hover:text-[#BD5D3A]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lean Enterprise Institute
          </a>
          . SectorCalc provides deterministic engineering simulations based on
          international manufacturing standards. Not financial or engineering advice.
        </p>
      </div>
    </div>
  );
}
