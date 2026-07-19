/**
 * SectorCalc — AI Overview & Passage Ranking Optimization
 * ========================================================
 *
 * Mandate requirement: Every tool page's H2 sections must contain a
 * "self-sufficient paragraph" (40-60 words) that can be isolated and
 * quoted by AI Overview / passage ranking algorithms.
 *
 * Each paragraph is:
 *   - Self-contained (makes sense without surrounding context)
 *   - 40-60 words
 *   - Contains formula, benchmark data, or actionable insight
 *   - SEO-optimized for featured snippets
 *
 * Also generates SpeakableSpecification schema for voice assistants.
 */

import type React from "react";
import { sanitizeJsonLd } from "@/lib/infrastructure/seo/schema-mesh";

export interface AiOverviewParagraph {
  /** CSS selector targeting the element (for Speakable schema). */
  cssSelector: string;
  /** The self-sufficient paragraph text. */
  text: string;
  /** The H2 heading this paragraph belongs under. */
  heading: string;
}

/**
 * Generate SpeakableSpecification JSON-LD for voice assistant optimization.
 * Targets .ai-overview-paragraph and .key-stat CSS classes.
 */
export function buildSpeakableJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    cssSelector: [".ai-overview-paragraph", ".key-stat"],
  };
}

/**
 * React component that renders a self-sufficient AI overview paragraph
 * and surrounds it with the Speakable-compatible CSS class.
 */
export function AiOverviewParagraph({
  text,
  className,
}: {
  text: string;
  className?: string;
}): React.ReactElement {
  return (
    <p
      className={`ai-overview-paragraph ${className ?? ""}`.trim()}
      style={{
        fontSize: "1rem",
        lineHeight: 1.65,
        color: "#3A3835",
        maxWidth: "720px",
      }}
    >
      {text}
    </p>
  );
}

/**
 * Pre-built self-sufficient paragraphs for key SectorCalc topics.
 * Each paragraph is 40-60 words and designed to be AI Overview-quotable.
 */
export const AI_OVERVIEW_PARAGRAPHS: Record<string, AiOverviewParagraph> = {
  "manufacturing-capex": {
    cssSelector: "#how-to-calculate-capex",
    heading: "How to calculate CAPEX for manufacturing",
    text:
      "CAPEX (Capital Expenditure) for manufacturing is calculated by summing " +
      "land acquisition, facility construction, machinery purchase, and installation " +
      "costs. For a mid-sized plant (5,000 m\u00B2) in Turkey, typical CAPEX ranges " +
      "between $2.4M-$3.8M according to 2026 ECMI benchmarks. The formula: " +
      "CAPEX = Land + Building + Equipment + Installation + Permits.",
  },
  "break-even-analysis": {
    cssSelector: "#how-to-calculate-break-even",
    heading: "How to calculate break-even point",
    text:
      "The break-even point is calculated by dividing total fixed costs by the " +
      "contribution margin per unit (selling price minus variable cost). For a " +
      "multi-product business, break-even uses the weighted average contribution " +
      "margin. A typical manufacturing shop with $50K monthly fixed costs and 40% " +
      "margin needs $125K monthly revenue to break even.",
  },
  "irr-npv": {
    cssSelector: "#how-to-calculate-irr-npv",
    heading: "How to calculate IRR and NPV",
    text:
      "Net Present Value (NPV) discounts future cash flows to today's dollars " +
      "using a discount rate. Internal Rate of Return (IRR) is the discount rate " +
      "where NPV equals zero. For a $100K investment returning $30K/year for 5 " +
      "years, IRR is approximately 15.2%. Monte Carlo simulation adds probability " +
      "distributions for sensitivity analysis in SectorCalc's premium tools.",
  },
  "oee-calculation": {
    cssSelector: "#how-to-calculate-oee",
    heading: "How to calculate Overall Equipment Effectiveness (OEE)",
    text:
      "OEE combines three factors: Availability (actual run time / planned production " +
      "time), Performance (actual output / theoretical output at ideal cycle time), " +
      "and Quality (good parts / total parts produced). A world-class OEE target is " +
      "85%. Each 1% OEE loss in a $500K/year machine line represents approximately " +
      "$5,000 in hidden annual cost according to ISO 22400-2 methodology.",
  },
  "scrap-rate": {
    cssSelector: "#how-to-calculate-scrap-rate",
    heading: "How to calculate scrap rate and its cost impact",
    text:
      "Scrap rate is the percentage of production that must be discarded or reworked, " +
      "calculated as (scrapped units / total units produced) \u00D7 100. A 3% scrap rate " +
      "on a line producing 100,000 units/month at $15/unit material cost represents " +
      "$45,000/month in material loss alone. Adding labor, machine time and disposal " +
      "costs, the true hidden loss is often 2-3x the material value.",
  },
};

/**
 * Generate a Key Stat element for the page — used alongside AI overview
 * paragraphs to strengthen passage ranking signals.
 */
export function KeyStat({
  value,
  label,
  source,
}: {
  value: string;
  label: string;
  source: string;
}): React.ReactElement {
  return (
    <div
      className="key-stat"
      style={{
        padding: "1rem 1.25rem",
        backgroundColor: "#F0EEE6",
        borderLeft: "3px solid #BD5D3A",
        marginBottom: "1rem",
      }}
    >
      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1A1915" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.875rem", color: "#3A3835", marginTop: "0.25rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#6B6860", fontStyle: "italic", marginTop: "0.25rem" }}>
        Source: {source}
      </div>
    </div>
  );
}
