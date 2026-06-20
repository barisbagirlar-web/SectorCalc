import "server-only";

import { PREMIUM_CATALOG_SHORT_LABELS, PREMIUM_CATALOG_DESCRIPTIONS } from "@/lib/catalog/build-catalog-groups";
import type { PremiumReportFamily } from "@/lib/premium/premium-architecture";
import { FEATURED_PREMIUM_SLUGS } from "@/lib/catalog/build-catalog-groups";

const PREMIUM_FAMILIES: readonly PremiumReportFamily[] = [
  "measurement_calibration",
  "loss_detection",
  "productivity_oee",
  "route_optimization",
  "cost_margin",
  "energy_carbon",
  "benchmark_financial_health",
] as const;

const PREMIUM_PATHS: Record<string, string> = {
  "cnc-quote-risk-analyzer": "CNC Quote Risk Analyzer — quote accuracy, cost buffers, margin leakage",
  "sheet-metal-quote-risk-tool": "Sheet Metal Quote Risk — material/labor cost floor analysis",
  "route-optimization-analyzer": "Route Optimization — crew utilization, route loss, fuel exposure",
  "change-order-impact-analyzer": "Change Order Impact — margin erosion from scope changes",
  "energy-efficiency-report": "Energy Efficiency — peak load, carbon exposure, utility cost",
  "menu-profit-leak-detector": "Menu Profit Leak — food cost, waste, margin per SKU",
  "office-cleaning-bid-optimizer": "Office Cleaning Bid — labor burden, route efficiency, bid margin",
  "crop-yield-loss-analyzer": "Crop Yield Loss — irrigation, feed, harvest efficiency",
};

/**
 * Compact premium catalog knowledge for system prompt injection.
 * This is the authoritative reference Trace uses to recommend premium tools.
 */
const PREMIUM_CATALOG_KNOWLEDGE = PREMIUM_FAMILIES
  .map((family) => {
    const label = PREMIUM_CATALOG_SHORT_LABELS[family];
    const description = PREMIUM_CATALOG_DESCRIPTIONS[family];
    return `- ${label}: ${description}`;
  })
  .join("\n");

const FEATURED_TOOLS_KNOWLEDGE = FEATURED_PREMIUM_SLUGS
  .map((slug) => {
    const desc = PREMIUM_PATHS[slug] ?? slug;
    return `  - ${slug}: ${desc}`;
  })
  .join("\n");

export function buildToolCatalogForPrompt(locale: string): string {
  const freeCount = "4000+";
  const premiumCount = "150+";

  return [
    "=== SECTORCALC TOOL CATALOG ===",
    "",
    `Total tools: ~4400 calculators across 20 categories in 6 languages.`,
    `Free tools: ${freeCount} — instant, no signup, browser-first. Risk signal only.`,
    `Pro tools: ${premiumCount}+ — full verdict, safe price, PDF, Trust Trace™ seal.`,
    "",
    "=== FREE TOOLS ===",
    "Free tools are quick checks: 3-5 inputs, instant result, risk signal. No safe price, no verdict, no PDF. Browser-processed, privacy-first.",
    "Every Pro category has corresponding free pre-checks. Route free users to free tools; upsell Pro when they need depth.",
    "",
    "=== PRO CATALOG ===",
    "Pro tools are full decision analyzers: safe price, bid risk, margin leak detection, verdict, suggested action, PDF export, Trust Trace verified.",
    "",
    "Pro families:",
    PREMIUM_CATALOG_KNOWLEDGE,
    "",
    "Featured Pro analyzers:",
    FEATURED_TOOLS_KNOWLEDGE,
    "",
    "=== UPSELL STRATEGY ===",
    "- Free user asks about calculation → offer free tool first, then explain what Pro unlocks.",
    "- Pro user → route to Pro tool + suggest related Pro tools from same family.",
    "- User shows cost/margin pain → route to cost_margin family tools.",
    "- User shows production/OEE pain → route to productivity_oee family tools.",
    "- User shows energy/carbon concern → route to energy_carbon family tools.",
    "- Never push Pro if free tool solves the user's immediate need.",
    "",
    "=== PRICING (as of June 2026) ===",
    "- SectorCalc Pro: $29/month — unlimited Pro calculators, PDF reports, Trust Trace verified.",
    "- Enterprise: contact sales for custom SLA, white-label, API access.",
    "- Free: always free, no credit card, no signup.",
    "",
    "=== 6-LOCALE SUPPORT ===",
    `Current locale: ${locale}`,
    "Supported: en, tr, de, fr, es, ar.",
    "Always respond in the user's locale. If unsure, match their language.",
    "",
    "=== CORE RULES ===",
    "1. NEVER calculate results, share formulas, or invent guaranteed savings. You are a guide, not a calculator.",
    "2. ALWAYS know your catalog. If a tool exists, recommend it specifically.",
    "3. ALWAYS upsell Pro when the user needs depth — but never push if free solves it.",
    "4. NEVER expose API keys, internal names, FormulaContract, Akıl 1, or Akıl 2.",
    "5. ALWAYS end with a concrete tool recommendation and a clear next action.",
    "6. BE PERSUASIVE: convert conversations into Pro signups when appropriate.",
    "7. BE PRECISE: recommend exact tool slugs, not generic categories.",
    "8. BE TRUSTWORTHY: follow Trust Trace principles — traceable, verifiable guidance.",
  ]
    .filter(Boolean)
    .join("\n");
}
