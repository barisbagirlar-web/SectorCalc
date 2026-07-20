import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { SITE } from "@/config/site";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildEntityGraph } from "@/lib/infrastructure/seo/entity-graph";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ metric?: string; result?: string; concept?: string; unit?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const metric = params.metric ?? "Metric";
  return {
    title: `A3 Countermeasure Report — ${metric} | SectorCalc Lean`,
    description: `Download an A3 Problem Solving template for ${metric}. Fill in root cause analysis, countermeasure, and follow-up. PDCA structured problem-solving.`,
    metadataBase: new URL(SITE.url),
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE.url}/lean/a3-report`,
      languages: {
        en: `${SITE.url}/en/lean/a3-report`,
        "en-us": `${SITE.url}/en/lean/a3-report`,
        "en-gb": `${SITE.url}/en/lean/a3-report`,
        "x-default": `${SITE.url}/lean/a3-report`,
      },
    },
  };
}

export default async function A3ReportTemplatePage({
  searchParams,
}: {
  searchParams: Promise<{ metric?: string; result?: string; concept?: string; unit?: string }>;
}) {
  const params = await searchParams;
  const metric = params.metric ?? "OEE";
  const result = params.result ?? "—";
  const concept = params.concept ?? null;
  const unit = params.unit ?? null;
  const displayValue = unit ? `${result} ${unit}` : result;

  return (
    <>
      <SemanticJsonLd data={buildEntityGraph("en")} />
      <div
        className="mx-auto max-w-3xl px-4 py-10"
        style={{ fontFamily: "Barlow, sans-serif" }}
      >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#BD5D3A] mb-1">
          Lean Manufacturing · A3 Problem Solving{concept ? ` · ${concept.toUpperCase()}` : ""}
        </p>
        <h1 className="text-2xl font-bold text-[#1A1915] mb-3">
          A3 Countermeasure Template
        </h1>
        <p className="text-sm text-[#1A1915]/70 leading-relaxed">
          Download an A3 Problem Solving template pre-filled for your {metric} analysis.
          Use this structured one-page format to define the gap, perform root cause
          analysis, implement countermeasures, and verify sustainment.
        </p>
      </div>

      <div className="bg-[#F0EEE6] p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {concept && (
            <div>
              <span className="font-semibold text-[#1A1915] block">Methodology</span>
              <span className="text-[#1A1915]/70 uppercase">{concept}</span>
            </div>
          )}
          <div>
            <span className="font-semibold text-[#1A1915] block">Metric</span>
            <span className="text-[#1A1915]/70">{metric}</span>
          </div>
          <div>
            <span className="font-semibold text-[#1A1915] block">Current Value</span>
            <span className="text-[#1A1915]/70">{displayValue}</span>
          </div>
          <div>
            <span className="font-semibold text-[#1A1915] block">Date</span>
            <span className="text-[#1A1915]/70">{new Date().toISOString().split("T")[0]}</span>
          </div>
          <div>
            <span className="font-semibold text-[#1A1915] block">Template Format</span>
            <span className="text-[#1A1915]/70">PDF / A3 Printable</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1A1915]/10">
          <p className="text-xs text-[#1A1915]/50 mb-4">
            The A3 template covers: Background → Current Condition → Target →
            Root Cause Analysis (5 Whys / Ishikawa) → Countermeasures →
            Implementation Plan → Follow-up & Verification.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/lean"
          className="inline-flex items-center h-12 px-6 text-sm font-semibold text-[#1A1915] border border-[#1A1915]/20 hover:border-[#BD5D3A]"
        >
          ← Back to Lean calculators
        </Link>
      </div>

      <p className="mt-6 text-[10px] text-[#1A1915]/30 uppercase tracking-widest">
        ISO 22400-2 manufacturing KPI context · A3 problem-solving template. Not financial advice.
      </p>
      </div>
    </>
  );
}
