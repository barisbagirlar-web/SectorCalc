// SectorCalc Universal Result Perspectives Layer — V5.4
// Category-based multi-perspective result enrichment.
// Transforms raw formula outputs into labeled, prioritized result cards.
// Free + Pro tools share this adapter; Pro tools may add confidential cards server-side.

import type {
  SuperV4Schema,
  ServerOutput,
  UniversalCalculationResult,
  UniversalResultCard,
  ResultPerspective,
  DecisionStateCard,
  ResultProfileId,
} from "@/sectorcalc/pro-form/contract-types";

// ── Category → result profile mapping ──────────────────────────────────────

export const RESULT_PROFILE_BY_CATEGORY: Record<string, ResultProfileId> = {
  "Machining & CNC": "cost_plus_margin",
  "Welding & Steel": "technical_limit_with_cost",
  "Construction & Field": "pass_fail_with_safety_margin",
  "Energy & HVAC": "savings_roi",
  "Logistics & Routing": "cost_capacity_efficiency",
  "Finance & Costing": "commercial_decision",
  "Quality & SPC": "risk_quality_decision",
  "CBAM": "compliance_audit_package",
  "Carbon & CBAM": "compliance_audit_package",
  "Production Operations": "cost_capacity_efficiency",
  "Quote & SME Finance": "commercial_decision",
  "Industrial Decision Support": "commercial_decision",
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function getOutput(
  outputs: ServerOutput[],
  id: string,
): { value: number; unit?: string } | null {
  const o = outputs.find((x) => x.id === id);
  if (o && typeof o.value === "number" && Number.isFinite(o.value)) {
    return { value: o.value, unit: o.unit ?? undefined };
  }
  return null;
}

function firstOutputValue(outputs: ServerOutput[]): number | null {
  for (const o of outputs) {
    if (typeof o.value === "number" && Number.isFinite(o.value)) {
      return o.value;
    }
  }
  return null;
}

function getInput(rawInputs: Record<string, unknown>, id: string): number | null {
  const v = rawInputs[id];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

// ── Profile enrichment functions ────────────────────────────────────────────

function enrichCostPlusMargin(
  outputs: ServerOutput[],
  rawInputs: Record<string, unknown>,
  schema: SuperV4Schema,
): { cards: UniversalResultCard[]; decision: DecisionStateCard } {
  const cards: UniversalResultCard[] = [];
  const costPerPart = getOutput(outputs, "cost_per_part");
  const scrapLoss = getOutput(outputs, "scrap_loss");
  const toolCostPerPart = getOutput(outputs, "tool_cost_per_part");
  const totalSetupCost = getOutput(outputs, "total_setup_cost");
  const cycleCost = getOutput(outputs, "cycle_cost_per_part");

  const targetMargin = getInput(rawInputs, "target_margin_percent");
  const batchQty = getInput(rawInputs, "batch_quantity");
  const setupMinutes = getInput(rawInputs, "setup_minutes");
  const laborRate = getInput(rawInputs, "labor_hourly_rate");
  const machineRate = getInput(rawInputs, "machine_hourly_rate");
  const scrapPct = getInput(rawInputs, "scrap_percent");
  const overheadPct = getInput(rawInputs, "overhead_percent");

  // Primary: cost per part
  if (costPerPart) {
    cards.push({
      id: "unit_cost_per_part",
      label: "Unit Cost per Part",
      value: round2(costPerPart.value),
      unit: costPerPart.unit ?? "Currency",
      perspective: "cost_basis",
      priority: 10,
      severity: "info",
    });
  }

  // Commercial: gross margin price
  if (costPerPart && targetMargin !== null && targetMargin > 0) {
    const marginPrice = round2(costPerPart.value / (1 - targetMargin / 100));
    cards.push({
      id: "quote_price_gross_margin",
      label: `Quote Price at ${targetMargin}% Gross Margin`,
      value: marginPrice,
      unit: costPerPart.unit ?? "Currency",
      perspective: "commercial_price",
      priority: 20,
      formula: `cost / (1 - margin / 100)`,
      explanation: `Price to achieve ${targetMargin}% gross margin on cost of ${round2(costPerPart.value)}`,
      severity: "info",
    });
  }

  // Commercial: markup price
  if (costPerPart && targetMargin !== null && targetMargin > 0) {
    const markupPrice = round2(costPerPart.value * (1 + targetMargin / 100));
    cards.push({
      id: "quote_price_markup",
      label: `Quote Price at ${targetMargin}% Markup`,
      value: markupPrice,
      unit: costPerPart.unit ?? "Currency",
      perspective: "commercial_price",
      priority: 21,
      formula: `cost × (1 + markup / 100)`,
      explanation: `Price with ${targetMargin}% markup on cost of ${round2(costPerPart.value)}`,
      severity: "info",
    });
  }

  // Cost breakdown
  if (setupMinutes !== null && batchQty !== null && laborRate !== null) {
    const setupCostPerPart = round2((setupMinutes / 60) * laborRate / batchQty);
    cards.push({
      id: "setup_cost_per_part",
      label: "Setup Cost per Part",
      value: setupCostPerPart,
      unit: "Currency",
      perspective: "cost_basis",
      priority: 30,
      formula: `(setup_minutes / 60) × labor_rate / batch_qty`,
      explanation: `Labor cost of ${setupMinutes} min setup amortized over ${batchQty} parts`,
      severity: "info",
    });
  }

  if (toolCostPerPart) {
    cards.push({
      id: "tooling_cost_per_part",
      label: "Tooling Cost per Part",
      value: round2(toolCostPerPart.value),
      unit: toolCostPerPart.unit ?? "Currency",
      perspective: "cost_basis",
      priority: 31,
      severity: "info",
    });
  }

  // Scrap-adjusted cost
  if (costPerPart && scrapPct !== null && scrapPct > 0) {
    const scrapAdj = round2(costPerPart.value / (1 - scrapPct / 100));
    cards.push({
      id: "scrap_adjusted_cost",
      label: `Scrap-Adjusted Cost (${scrapPct}% scrap)`,
      value: scrapAdj,
      unit: costPerPart.unit ?? "Currency",
      perspective: "risk_sensitivity",
      priority: 40,
      formula: `cost / (1 - scrap / 100)`,
      explanation: `Cost per good part including ${scrapPct}% scrap allowance`,
      severity: "warning",
    });
  }

  if (overheadPct !== null && costPerPart) {
    const overheadCost = round2(costPerPart.value * overheadPct / 100);
    cards.push({
      id: "overhead_portion",
      label: `Overhead Portion (${overheadPct}%)`,
      value: overheadCost,
      unit: costPerPart.unit ?? "Currency",
      perspective: "cost_basis",
      priority: 32,
      severity: "info",
    });
  }

  // Decision state
  const hasMargin = targetMargin !== null;
  let decision: DecisionStateCard;
  if (hasMargin && costPerPart) {
    decision = {
      label: "Cost calculated. Margin-adjusted quote price required before commercial offer.",
      severity: "pass",
      reason: `Unit cost ${round2(costPerPart.value)} with ${targetMargin}% target margin.`,
    };
  } else if (costPerPart) {
    decision = {
      label: "Cost calculated. Add target margin for commercial pricing.",
      severity: "warning",
      reason: `Unit cost ${round2(costPerPart.value)}. No margin target set.`,
    };
  } else {
    decision = {
      label: "Calculation incomplete. Review inputs and re-calculate.",
      severity: "danger",
      reason: "Primary cost could not be computed from inputs.",
    };
  }

  return { cards, decision };
}

function enrichCommercialDecision(
  outputs: ServerOutput[],
  rawInputs: Record<string, unknown>,
): { cards: UniversalResultCard[]; decision: DecisionStateCard } {
  const cards: UniversalResultCard[] = [];
  const primaryVal = firstOutputValue(outputs);
  const primaryOutput = outputs.find((o) => typeof o.value === "number" && Number.isFinite(o.value));

  if (primaryOutput) {
    const prefix = primaryOutput.name ?? "Result";
    const pv = typeof primaryOutput.value === "number" ? round2(primaryOutput.value) : String(primaryOutput.value ?? "");
    cards.push({
      id: primaryOutput.id,
      label: prefix,
      value: pv,
      unit: primaryOutput.unit ?? undefined,
      perspective: "primary",
      priority: 10,
      severity: "info",
    });
  }

  // Add other numeric outputs as supplementary cards
  for (const o of outputs) {
    if (o === primaryOutput) continue;
    if (typeof o.value !== "number" || !Number.isFinite(o.value)) continue;
    if (o.id.includes("decision") || o.id.includes("status")) continue;
    cards.push({
      id: o.id,
      label: o.name ?? o.id,
      value: round2(o.value),
      unit: o.unit ?? undefined,
      perspective: "cost_basis",
      priority: 20,
      severity: "info",
    });
  }

  const decision: DecisionStateCard = primaryVal !== null
    ? { label: "Calculation completed. Review outputs for decision guidance.", severity: "pass", reason: `Primary result: ${round2(primaryVal)}` }
    : { label: "Unable to determine result. Review inputs and re-calculate.", severity: "danger", reason: "No valid output computed." };

  return { cards, decision };
}

function enrichTechnicalLimitWithCost(
  outputs: ServerOutput[],
): { cards: UniversalResultCard[]; decision: DecisionStateCard } {
  return enrichCommercialDecision(outputs, {}); // fallback
}

function enrichPassFailWithSafetyMargin(
  outputs: ServerOutput[],
): { cards: UniversalResultCard[]; decision: DecisionStateCard } {
  const cards: UniversalResultCard[] = [];
  const utilization = outputs.find((o) =>
    o.id.includes("utilization") || o.id.includes("safety") || o.id.includes("stress"),
  );
  const passFail = outputs.find((o) =>
    o.id.includes("pass") || o.id.includes("status") || o.id.includes("decision"),
  );

  if (utilization && typeof utilization.value === "number") {
    const status: "pass" | "warning" | "danger" = utilization.value < 0.8
      ? "pass" : utilization.value < 1.0
        ? "warning" : "danger";
    const uv = typeof utilization.value === "number" ? utilization.value : 0;
    cards.push({
      id: utilization.id,
      label: utilization.name ?? "Utilization",
      value: round2(uv),
      unit: utilization.unit ?? undefined,
      perspective: "technical_limit",
      priority: 10,
      severity: status,
    });
  }

  // Add remaining numerical outputs
  for (const o of outputs) {
    if (o === utilization || o === passFail) continue;
    if (typeof o.value !== "number" || !Number.isFinite(o.value)) continue;
    cards.push({
      id: o.id,
      label: o.name ?? o.id,
      value: round2(o.value),
      unit: o.unit ?? undefined,
      perspective: "technical_limit",
      priority: 20,
      severity: "info",
    });
  }

  const decision: DecisionStateCard = utilization
    ? (() => {
        const uv = typeof utilization.value === "number" ? utilization.value : 0;
        return {
          label: uv < 1.0 ? "Within limit. Design is safe." : "Limit exceeded. Review required.",
          severity: uv < 1.0 ? "pass" : "danger",
          reason: `Utilization: ${round2(uv)}${utilization.unit ? " " + utilization.unit : ""}`,
        };
      })()
    : { label: "Calculation completed.", severity: "pass", reason: "Technical result computed." };

  return { cards, decision };
}

// ── Main adapter ────────────────────────────────────────────────────────────

export function buildUniversalResult(
  schema: SuperV4Schema,
  rawInputs: Record<string, number> | Record<string, unknown>,
  outputs: ServerOutput[],
): UniversalCalculationResult | null {
  if (!outputs || outputs.length === 0) return null;
  if (outputs.every((o) => o.value === null || o.value === undefined)) return null;

  const category = schema.category ?? "";
  const profile = RESULT_PROFILE_BY_CATEGORY[category] ?? "commercial_decision";

  let enriched: { cards: UniversalResultCard[]; decision: DecisionStateCard };

  switch (profile) {
    case "cost_plus_margin":
      enriched = enrichCostPlusMargin(outputs, rawInputs, schema);
      break;
    case "technical_limit_with_cost":
      enriched = enrichTechnicalLimitWithCost(outputs);
      break;
    case "pass_fail_with_safety_margin":
      enriched = enrichPassFailWithSafetyMargin(outputs);
      break;
    case "savings_roi":
    case "cost_capacity_efficiency":
    case "commercial_decision":
    case "risk_quality_decision":
    case "compliance_audit_package":
    default:
      enriched = enrichCommercialDecision(outputs, rawInputs);
      break;
  }

  // Sort cards by priority
  enriched.cards.sort((a, b) => a.priority - b.priority);

  // Primary is the first (highest priority) card
  const primary = enriched.cards[0] ?? {
    id: "result",
    label: "Result",
    value: "",
    perspective: "primary" as ResultPerspective,
    priority: 0,
  };

  // Build assumptions
  const assumptions: string[] = [];
  for (const o of outputs) {
    if (o.formula_source && typeof o.formula_source === "string") {
      assumptions.push(o.formula_source);
    }
  }
  if (assumptions.length === 0) {
    assumptions.push("Calculation performed with provided input values.");
  }

  // Collect warnings from outputs with REVIEW status
  const warnings: string[] = [];
  for (const o of outputs) {
    if (o.status === "REVIEW" && o.public_explanation) {
      warnings.push(o.public_explanation);
    }
  }

  return {
    primary,
    cards: enriched.cards,
    decisionState: enriched.decision,
    assumptions,
    warnings,
  };
}

/**
 * Test whether a tool profile has commercial price outputs.
 * Used by build-time guard.
 */
export function hasCommercialPrice(
  result: UniversalCalculationResult | null,
): boolean {
  if (!result) return false;
  return result.cards.some((c) => c.perspective === "commercial_price");
}

/**
 * Test whether a tool's decision state is populated (not empty/dash).
 * Used by build-time guard.
 */
export function hasValidDecisionState(
  result: UniversalCalculationResult | null,
): boolean {
  if (!result) return true; // no result = no violation
  const label = result.decisionState.label;
  return label !== "" && label !== "—" && label !== "-";
}

/**
 * Resolve the result profile ID for a given tool category.
 */
export function getProfileForCategory(category: string): ResultProfileId {
  return RESULT_PROFILE_BY_CATEGORY[category] ?? "commercial_decision";
}
