/**
 * Premium claim copy — public sales language for analyzers and reports.
 * No schema/migration/pilot/debug terms in output.
 */

import type { ClaimReadiness } from "@/lib/benchmarks/benchmark-types";
import type { FormulaFamilyId } from "@/lib/premium-schema/formula-families";
import {
  getPremiumCalculatorSchema,
  listPremiumSchemaIds,
} from "@/lib/premium-schema/schema-registry";

export type PremiumClaimCopy = {
  slug: string;
  claimType: "sample_scenario" | "benchmark_model" | "potential_exposure";
  headline: string;
  valueStatement: string;
  exampleExposure?: string;
  decisionValue: string;
  upgradeReason: string;
};

const DEFAULT_CLAIM: Omit<PremiumClaimCopy, "slug"> = {
  claimType: "sample_scenario",
  headline: "Measure the hidden loss before it becomes cash damage.",
  valueStatement:
    "This analyzer estimates the main exposure, threshold pressure and decision risk behind the current inputs.",
  decisionValue:
    "Use the report to compare drivers, decide the next action and export the result.",
  upgradeReason:
    "Unlock the full decision report to see hidden drivers, thresholds, suggested actions and export-ready output.",
};

const SPECIFIC_CLAIMS: Readonly<
  Record<string, Partial<Omit<PremiumClaimCopy, "slug">>>
> = {
  "cnc-oee-loss": {
    claimType: "potential_exposure",
    headline: "Low OEE does not look expensive until you price the lost machine hours.",
    valueStatement:
      "This analyzer turns availability, performance and quality into a monthly capacity loss you can act on.",
    exampleExposure:
      "A few lost machine hours per week can become thousands in monthly capacity loss.",
    decisionValue: "See whether setup, quality or performance is driving the loss.",
    upgradeReason:
      "Unlock the full decision report to compare OEE drivers, threshold pressure and export-ready output.",
  },
  "logistics-route-loss": {
    claimType: "potential_exposure",
    headline: "Empty return trips can turn a profitable route into a margin leak.",
    valueStatement:
      "This analyzer prices deadhead, fuel drift and route margin exposure from your current inputs.",
    exampleExposure:
      "Deadhead cost compounds when fuel, driver hours and tolls are measured together.",
    decisionValue: "Decide whether to reprice, re-route or reject low-margin loads.",
    upgradeReason:
      "Unlock the full decision report to see route drivers, threshold checks and export-ready output.",
  },
  "logistics-fuel-route-drift": {
    claimType: "potential_exposure",
    headline: "Fuel drift hides inside average trip cost until you split loaded vs empty miles.",
    valueStatement:
      "This analyzer compares quoted route margin against fuel, toll and deadhead pressure.",
    exampleExposure:
      "A small per-mile drift can erase freight margin before dispatch sees it.",
    decisionValue: "See which legs and cost drivers are eroding route profitability.",
    upgradeReason:
      "Unlock the full decision report for threshold interpretation and export-ready route output.",
  },
  "energy-peak-cost": {
    claimType: "potential_exposure",
    headline: "Peak energy cost can hide inside the average kWh number.",
    valueStatement:
      "This analyzer separates peak-hour load from blended unit cost and flags threshold pressure.",
    exampleExposure: "A small peak-hour shift can change true unit cost.",
    decisionValue: "Decide whether to shift load, renegotiate tariff or invest in peak control.",
    upgradeReason:
      "Unlock the full decision report to compare peak vs average drivers and export the result.",
  },
  "energy-compressor-leak-cost": {
    claimType: "potential_exposure",
    headline: "Compressed-air leaks look minor until you price continuous kWh waste.",
    valueStatement:
      "This analyzer converts leak rate and runtime into monthly utility exposure and threshold risk.",
    exampleExposure: "One persistent leak can run like a machine left on overnight.",
    decisionValue: "Prioritize maintenance against the highest-cost leak drivers.",
    upgradeReason:
      "Unlock the full decision report for leak breakdown, thresholds and export-ready output.",
  },
  "food-waste-margin-loss": {
    claimType: "potential_exposure",
    headline: "Food waste is not only spoiled inventory; it is lost menu margin.",
    valueStatement:
      "This analyzer links waste, overportioning and platform fees to true menu profitability.",
    exampleExposure: "Waste, overportioning and platform fees can erase menu profitability.",
    decisionValue: "See which menu lines and waste drivers need repricing or portion control.",
    upgradeReason:
      "Unlock the full decision report for margin drivers, thresholds and export-ready output.",
  },
  "restaurant-menu-margin-leak": {
    claimType: "potential_exposure",
    headline: "Menu margin leaks hide in fees, waste and portion drift—not just food cost.",
    valueStatement:
      "This analyzer surfaces hidden margin pressure across ingredients, labor and platform fees.",
    exampleExposure: "A few high-volume items can subsidize loss-makers without a clear signal.",
    decisionValue: "Decide which items to reprice, rework or remove from the menu.",
    upgradeReason:
      "Unlock the full decision report for item-level drivers, thresholds and export-ready output.",
  },
  "construction-project-overrun": {
    claimType: "potential_exposure",
    headline:
      "Project margin disappears when delay, labor drift and material variance are separated.",
    valueStatement:
      "This analyzer splits delay days, labor overrun and material variance into decision-ready exposure.",
    exampleExposure: "A few delay days can consume the contingency before management sees it.",
    decisionValue: "See whether schedule, labor or materials is consuming project margin first.",
    upgradeReason:
      "Unlock the full decision report for overrun drivers, thresholds and export-ready output.",
  },
  "construction-subcontractor-margin-leak": {
    claimType: "potential_exposure",
    headline: "Subcontractor margin can leak through change orders before the job closes.",
    valueStatement:
      "This analyzer compares quoted margin against delay, rework and scope drift exposure.",
    exampleExposure: "Unpriced change-order hours can erase contingency on fixed-price work.",
    decisionValue: "Decide whether to reprice scope, add buffer or pause acceptance.",
    upgradeReason:
      "Unlock the full decision report for margin drivers, thresholds and export-ready output.",
  },
  "carbon-footprint-compliance-risk": {
    claimType: "benchmark_model",
    headline: "Carbon exposure is a pricing decision—not only a compliance checkbox.",
    valueStatement:
      "This analyzer estimates compliance cost pressure and threshold risk from your current inputs.",
    exampleExposure: "A small emissions drift can change landed cost on export-heavy jobs.",
    decisionValue: "Compare compliance drivers and decide where to reduce exposure first.",
    upgradeReason:
      "Unlock the full decision report for carbon drivers, thresholds and export-ready output.",
  },
  "calibration-drift-risk": {
    claimType: "benchmark_model",
    headline: "Tolerance drift looks small until scrap and rework are priced together.",
    valueStatement:
      "This analyzer links measurement drift to scrap risk and calibration decision pressure.",
    exampleExposure: "Minor drift can compound into rework hours and material loss.",
    decisionValue: "Decide whether to recalibrate, adjust process or hold shipment.",
    upgradeReason:
      "Unlock the full decision report for drift drivers, thresholds and export-ready output.",
  },
};

const CATEGORY_CLAIM_TEMPLATES: Readonly<
  Record<FormulaFamilyId, Partial<Omit<PremiumClaimCopy, "slug">>>
> = {
  measurement: {
    claimType: "sample_scenario",
    headline: "Measurement error looks cheap until scrap and rework are priced together.",
    valueStatement:
      "This analyzer estimates tolerance pressure, hidden loss and threshold risk from current inputs.",
    decisionValue: "Identify whether measurement drift or process variance is driving exposure.",
  },
  calibration: {
    claimType: "benchmark_model",
    headline: "Calibration drift hides inside average yield until tolerance bands are checked.",
    valueStatement:
      "This analyzer links drift, scrap risk and threshold pressure into one decision view.",
    decisionValue: "Decide whether to recalibrate, adjust setup or hold production.",
  },
  scrap: {
    claimType: "potential_exposure",
    headline: "Scrap rate looks acceptable until you price material and rework together.",
    valueStatement:
      "This analyzer converts scrap, rework and yield gaps into margin exposure you can act on.",
    decisionValue: "See which material and process drivers are eroding quoted margin.",
  },
  oee: {
    claimType: "potential_exposure",
    headline: "Shop-floor loss hides in minutes that never reach the invoice.",
    valueStatement:
      "This analyzer turns downtime, setup and quality loss into decision-ready capacity exposure.",
    decisionValue: "Compare productivity drivers and decide the next operational fix.",
  },
  time: {
    claimType: "potential_exposure",
    headline: "Delay cost compounds quietly before it hits the project P&L.",
    valueStatement:
      "This analyzer prices schedule slip, rework hours and labor drift from your inputs.",
    decisionValue: "See whether time, rework or labor is the main margin driver.",
  },
  route: {
    claimType: "potential_exposure",
    headline: "Route margin leaks when empty miles and fuel drift stay blended.",
    valueStatement:
      "This analyzer separates loaded vs empty exposure and flags threshold pressure.",
    decisionValue: "Decide whether to reprice, re-route or reject low-margin trips.",
  },
  cost: {
    claimType: "potential_exposure",
    headline: "Quoted margin can look safe until hidden cost stacks are separated.",
    valueStatement:
      "This analyzer surfaces cost drivers, threshold pressure and decision risk behind the quote.",
    decisionValue: "Compare cost stacks and decide a safe price or scope change.",
  },
  energy: {
    claimType: "potential_exposure",
    headline: "Utility cost averages can hide peak-hour margin pressure.",
    valueStatement:
      "This analyzer splits peak load from blended kWh and flags threshold risk.",
    decisionValue: "Decide whether to shift load, fix leaks or renegotiate tariff.",
  },
  carbon: {
    claimType: "benchmark_model",
    headline: "Carbon cost belongs in the quote—not only in the compliance folder.",
    valueStatement:
      "This analyzer estimates emissions exposure and compliance pressure from current inputs.",
    decisionValue: "Compare carbon drivers and prioritize the highest-cost reduction path.",
  },
  benchmark: {
    claimType: "benchmark_model",
    headline: "Benchmark variance signals margin pressure before inventory turns red.",
    valueStatement:
      "This analyzer compares your inputs against benchmark pressure and threshold bands.",
    decisionValue: "See which benchmark drivers need action before margin erodes further.",
  },
};

const FORBIDDEN_PUBLIC_TERMS = /\b(schema|migration|pilot|debug)\b/i;

function mergeClaim(slug: string, partial: Partial<Omit<PremiumClaimCopy, "slug">>): PremiumClaimCopy {
  return {
    slug,
    claimType: partial.claimType ?? DEFAULT_CLAIM.claimType,
    headline: partial.headline ?? DEFAULT_CLAIM.headline,
    valueStatement: partial.valueStatement ?? DEFAULT_CLAIM.valueStatement,
    exampleExposure: partial.exampleExposure,
    decisionValue: partial.decisionValue ?? DEFAULT_CLAIM.decisionValue,
    upgradeReason: partial.upgradeReason ?? DEFAULT_CLAIM.upgradeReason,
  };
}

function buildClaimForSlug(slug: string): PremiumClaimCopy {
  const specific = SPECIFIC_CLAIMS[slug];
  if (specific) {
    return mergeClaim(slug, { ...DEFAULT_CLAIM, ...specific });
  }

  const schema = getPremiumCalculatorSchema(slug);
  if (schema) {
    const categoryTemplate = CATEGORY_CLAIM_TEMPLATES[schema.category];
    return mergeClaim(slug, { ...DEFAULT_CLAIM, ...categoryTemplate });
  }

  return mergeClaim(slug, DEFAULT_CLAIM);
}

/** Adjust claim type when benchmark data loop reaches readiness thresholds. */
export function applyClaimReadiness(
  copy: PremiumClaimCopy,
  readiness: ClaimReadiness = "sample_only"
): PremiumClaimCopy {
  if (readiness === "sample_only") {
    return copy;
  }

  if (readiness === "benchmark_ready" && copy.claimType === "sample_scenario") {
    return {
      ...copy,
      claimType: "benchmark_model",
      valueStatement: copy.valueStatement.replace(
        /sample scenario/gi,
        "benchmark model"
      ),
    };
  }

  if (readiness === "case_study_ready") {
    return {
      ...copy,
      claimType: copy.claimType === "sample_scenario" ? "benchmark_model" : copy.claimType,
    };
  }

  return copy;
}

export function getPremiumClaimCopy(
  slug: string,
  readiness: ClaimReadiness = "sample_only"
): PremiumClaimCopy {
  const base = buildClaimForSlug(slug.trim());
  return applyClaimReadiness(base, readiness);
}

export function getPremiumClaimTypeLabel(
  claimType: PremiumClaimCopy["claimType"]
): string {
  switch (claimType) {
    case "benchmark_model":
      return "Benchmark model";
    case "potential_exposure":
      return "Hidden-loss diagnostic";
    case "sample_scenario":
    default:
      return "Sample scenario";
  }
}

export function claimCopyIsPublicSafe(copy: PremiumClaimCopy): boolean {
  const fields = [
    copy.headline,
    copy.valueStatement,
    copy.exampleExposure ?? "",
    copy.decisionValue,
    copy.upgradeReason,
  ];
  return fields.every((field) => !FORBIDDEN_PUBLIC_TERMS.test(field));
}

export function listPremiumClaimSlugs(): readonly string[] {
  return listPremiumSchemaIds();
}

/** Static pricing copy assertions for tests — mirrors messages/en.json pricing keys. */
export const PRICING_COPY_ASSERTIONS = {
  proPrice: "$19",
  teamPrice: "$49",
  forbiddenRange: "$9–29",
  singleReportNote: "Single decision reports from $9",
} as const;
