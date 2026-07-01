/**
 * One-shot merge: adds canonical locale copy sections to messages/en.json
 * Run: npx tsx scripts/merge-locale-copy-v1.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALE_CTA } from "../src/lib/i18n/locale-cta";
import { LOCALE_GLOSSARY } from "../src/lib/i18n/locale-glossary";
import type { SupportedLocale } from "../src/lib/i18n/locale-config";

const PREMIUM_REPORT_SECTIONS = {
  executiveSummary: "Executive summary",
  mainExposure: "Main exposure",
  hiddenDrivers: "Hidden drivers",
  thresholdCheck: "Threshold check",
  suggestedActions: "Suggested actions",
  assumptions: "Assumptions",
  exportReady: "Export-ready report",
  legalNote: "Legal note",
};

const LEGAL = {
  disclaimer:
    "This result is a technical estimate based on your inputs. It does not replace financial, legal, medical or engineering advice.",
  premiumDisclaimer:
    "This report is a decision-support simulation. It does not replace financial, legal, medical or engineering advice.",
  reportNote:
    "For operational reference only — verify assumptions before committing to pricing or contracts.",
};

const ERRORS = {
  calculationFailed: "We could not calculate this result. Check the inputs and try again.",
  invalidInput: "One or more values are invalid. Please review the highlighted fields.",
  networkError: "Connection failed. Check your network and try again.",
  accessDenied: "You need premium access for this report.",
  notFound: "This page or tool could not be found.",
  generic: "Something went wrong. Please try again.",
};

const SEO = {
  homeTitle: "SectorCalc — Sector calculators and decision reports",
  homeDescription:
    "Measure hidden loss, margin exposure and operational risk with sector-specific calculators — without ERP complexity.",
  freeToolsTitle: "Free Sector Calculators | SectorCalc",
  freeToolsDescription:
    "Free browser calculators for cost, measurement, energy and business decisions. No sign-up required.",
  pricingTitle: "Pricing | SectorCalc",
  pricingDescription:
    "Free calculators and premium decision reports — single reports from $9, Pro from $19/month.",
  premiumToolsTitle: "Premium Analyzers | SectorCalc",
  premiumToolsDescription:
    "Hidden-loss diagnostics, threshold checks and export-ready decision reports for operational teams.",
};

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof target[key] === "object" &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      deepMerge(
        target[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      target[key] = value;
    }
  }
}

function buildSections(): Record<string, unknown> {
  const g = LOCALE_GLOSSARY;
  return {
    navigation: {
      tools: "Tools",
      pricing: g.pricing["en"],
      account: "Account",
      freeTools: g.freeCalculator["en"],
      premiumTools: g.premiumAnalyzer["en"],
      reports: g.decisionReport["en"],
    },
    homepage: {
      headline: "Measure hidden loss across your sector",
      primaryCta: LOCALE_CTA["en"].startFree,
      secondaryCta: LOCALE_CTA["en"].viewFreeTools,
    },
    freeTools: {
      title: SEO.freeToolsTitle.replace(" | SectorCalc", ""),
      metaTitle: SEO.freeToolsTitle,
      calculate: LOCALE_CTA["en"].calculateNow,
    },
    premiumTools: {
      title: g.premiumAnalyzer["en"],
      openAnalyzer: LOCALE_CTA["en"].openPremiumAnalyzer,
    },
    categories: {
      title: "Browse by category",
      viewAll: "View all categories",
    },
    industries: {
      title: "Explore by industry",
      viewAll: LOCALE_CTA["en"].chooseSector,
    },
    calculator: {
      calculate: LOCALE_CTA["en"].calculateNow,
      awaiting: "Enter values to see your result",
      validationRequired: "Please select a value.",
      validationNumber: "Enter a valid number.",
    },
    premiumReport: PREMIUM_REPORT_SECTIONS,
    export: {
      downloadCsv: LOCALE_CTA["en"].downloadCsv,
      printReport: LOCALE_CTA["en"].printReport,
      copySummary: LOCALE_CTA["en"].copySummary,
    },
    legal: LEGAL,
    errors: ERRORS,
    seo: SEO,
    cta: LOCALE_CTA["en"],
  };
}

const root = join(process.cwd(), "messages");

const filePath = join(root, `en.json`);
const data = JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;

deepMerge(data, buildSections());

writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Updated messages/en.json with canonical sections`);
