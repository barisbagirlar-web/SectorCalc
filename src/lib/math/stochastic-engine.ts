/**
 * MarginCore Stochastic Risk Engine — Pure Mathematical Module
 *
 * Architecture: Pure functions, explicit type guards, zero client-side
 * dependencies. No Firebase, Stripe, React, or Next.js imports.
 *
 * Core methodology:
 *   P90 Confidence Interval via standard Z-score calculation.
 *   Safe = Expected + (Z × σ)
 *
 * Output constraint:
 *   All engine outputs are serialized into clean, structured string blocks
 *   compatible with Big Four audit-report aesthetics. No loose nested objects
 *   returned to the UI layer.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/** Standard Z-score lookup table for common confidence levels (one-tailed) */
const Z_SCORE_TABLE: ReadonlyMap<number, number> = new Map([
  [50, 0.0],
  [75, 0.6745],
  [80, 0.8416],
  [85, 1.0364],
  [90, 1.2816],
  [95, 1.6449],
  [99, 2.3263],
]);

/** Default P90 Z-score constant */
const Z_P90 = 1.2816;

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * P90 safe-cost calculation result.
 */
export interface P90SafeCostResult {
  /** Original expected (naive) cost */
  readonly expected: number;
  /** P90 safe cost (expected + Z × σ) */
  readonly safe: number;
  /** Risk buffer amount (safe − expected) */
  readonly buffer: number;
}

/**
 * CBAM (Carbon Border Adjustment Mechanism) shock result.
 */
export interface CBAMShockResult {
  /** Original base cost */
  readonly baseCost: number;
  /** Carbon liability surcharge amount */
  readonly carbonLiability: number;
  /** Total cost after CBAM adjustment */
  readonly totalWithCBAM: number;
}

/**
 * A single sensitivity scenario row.
 */
export interface SensitivityScenario {
  readonly label: string;
  readonly deltaPercent: number;
  readonly adjustedCost: number;
  readonly deltaAmount: number;
}

/**
 * Full engine output — the top-level result returned to the server action.
 */
export interface MarginCoreEngineOutput {
  readonly p90: P90SafeCostResult;
  readonly cbam: CBAMShockResult;
  readonly scenarios: readonly SensitivityScenario[];
  readonly verdict: "accept" | "caution" | "reject";
  readonly verdictReason: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. Z-SCORE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Return the Z-score for a given confidence level percentage.
 *
 * Uses a lookup table for standard levels; falls back to an
 * Abramowitz & Stegun approximation for non-standard levels.
 *
 * @param confidenceLevel — confidence percentage (e.g. 90 for P90)
 * @returns Z-score (e.g. 1.28 for 90%)
 */
export function calculateZScore(confidenceLevel: number): number {
  if (!Number.isFinite(confidenceLevel) || confidenceLevel <= 0 || confidenceLevel >= 100) {
    return 0;
  }

  // Check lookup table first
  const rounded = Math.round(confidenceLevel);
  const lookup = Z_SCORE_TABLE.get(rounded);
  if (lookup !== undefined) {
    return lookup;
  }

  // Fallback: rational approximation of the inverse normal CDF
  // (Beasley–Springer–Moro algorithm, simplified)
  const p = confidenceLevel / 100;
  const a = Math.log(1 - p * p);
  const b = (2.515517 + 0.802853 * Math.sqrt(-a) + 0.010328 * (-a)) /
            (1 + 1.432788 * Math.sqrt(-a) + 0.189269 * (-a) + 0.001308 * (-a) * Math.sqrt(-a));
  return p >= 0.5 ? b : -b;
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. P90 SAFE COST
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate the P90 safe cost using standard Z-score methodology.
 *
 * Formula:
 *   σ    = expectedCost × (volatilityPercent / 100)
 *   Safe = Expected + (Z_90 × σ)
 *
 * @param expectedCost — naive (base) cost estimate
 * @param volatilityPercent — cost volatility as a percentage (e.g. 18 for 18%)
 * @returns { expected, safe, buffer }
 */
export function calculateP90SafeCost(
  expectedCost: number,
  volatilityPercent: number,
): P90SafeCostResult {
  if (!Number.isFinite(expectedCost) || expectedCost < 0) {
    return { expected: 0, safe: 0, buffer: 0 };
  }
  if (!Number.isFinite(volatilityPercent) || volatilityPercent < 0) {
    return { expected: round2(expectedCost), safe: round2(expectedCost), buffer: 0 };
  }

  const sigma = expectedCost * (volatilityPercent / 100);
  const z = calculateZScore(90); // 1.2816
  const safe = expectedCost + z * sigma;
  const buffer = safe - expectedCost;

  return {
    expected: round2(expectedCost),
    safe: round2(safe),
    buffer: round2(buffer),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. CBAM SHOCK (Carbon Border Adjustment Mechanism)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute hidden carbon liabilities using a CBAM-style model.
 *
 * Formula:
 *   carbonLiability = baseCost × emissionFactor × carbonPriceRatio
 *
 * Where carbonPriceRatio models the EU ETS carbon price as a fraction
 * of the base material/energy cost (default 8% = 0.08).
 *
 * @param baseCost — pre-carbon base cost
 * @param emissionFactor — sector emission intensity (0.0 = clean, 1.0 = max dirty)
 * @returns { baseCost, carbonLiability, totalWithCBAM }
 */
export function applyCBAMShock(
  baseCost: number,
  emissionFactor: number,
): CBAMShockResult {
  if (!Number.isFinite(baseCost) || baseCost < 0) {
    return { baseCost: 0, carbonLiability: 0, totalWithCBAM: 0 };
  }
  if (!Number.isFinite(emissionFactor) || emissionFactor < 0) {
    return { baseCost: round2(baseCost), carbonLiability: 0, totalWithCBAM: round2(baseCost) };
  }

  const CARBON_PRICE_RATIO = 0.08; // 8% EU ETS proxy
  const clampedEmission = Math.min(emissionFactor, 2.0); // cap at 2.0
  const carbonLiability = baseCost * clampedEmission * CARBON_PRICE_RATIO;
  const totalWithCBAM = baseCost + carbonLiability;

  return {
    baseCost: round2(baseCost),
    carbonLiability: round2(carbonLiability),
    totalWithCBAM: round2(totalWithCBAM),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SENSITIVITY MATRIX (3-scenario TXT output)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a structured plain-text sensitivity matrix simulating
 * three pricing scenarios:
 *
 *   Scenario A: +5% material cost increase
 *   Scenario B: +10% labor cost increase
 *   Scenario C: +3 days delay (carrying cost)
 *
 * @param baseCost — base project cost
 * @param iv — implied volatility (as decimal, e.g. 0.18 for 18%)
 * @returns structured plain-text matrix string
 */
export function generateSensitivityMatrixText(
  baseCost: number,
  iv: number,
): string {
  if (!Number.isFinite(baseCost) || baseCost < 0) {
    return "  [No data — invalid base cost]";
  }

  const sigma = baseCost * (Number.isFinite(iv) && iv > 0 ? iv : 0.18);

  const scenarioA: SensitivityScenario = {
    label: "Material +5%",
    deltaPercent: 5,
    deltaAmount: round2(baseCost * 0.05),
    adjustedCost: round2(baseCost * 1.05 + Z_P90 * sigma * 1.05),
  };

  const scenarioB: SensitivityScenario = {
    label: "Labor +10%",
    deltaPercent: 10,
    deltaAmount: round2(baseCost * 0.10),
    adjustedCost: round2(baseCost * 1.10 + Z_P90 * sigma * 1.10),
  };

  // +3 days delay = carrying cost ≈ 0.8% per day × 3 = 2.4%
  const DELAY_DAYS = 3;
  const CARRYING_COST_PER_DAY = 0.008;
  const delayImpact = DELAY_DAYS * CARRYING_COST_PER_DAY;

  const scenarioC: SensitivityScenario = {
    label: `Delay +${DELAY_DAYS}d`,
    deltaPercent: round2(delayImpact * 100),
    deltaAmount: round2(baseCost * delayImpact),
    adjustedCost: round2(baseCost * (1 + delayImpact) + Z_P90 * sigma * (1 + delayImpact)),
  };

  const scenarios = [scenarioA, scenarioB, scenarioC];

  const lines: string[] = [
    "┌────────────────────┬───────────┬─────────────┬──────────────────┐",
    "│ Scenario           │ Δ Cost %  │ Δ Amount    │ P90 Adjusted     │",
    "├────────────────────┼───────────┼─────────────┼──────────────────┤",
  ];

  for (const s of scenarios) {
    const label = padRight(s.label, 18);
    const delta = padLeft(`+${s.deltaPercent.toFixed(1)}%`, 9);
    const amount = padLeft(`+$${s.deltaAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 11);
    const adjusted = padLeft(`$${s.adjustedCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 16);
    lines.push(`│ ${label} │ ${delta} │ ${amount} │ ${adjusted} │`);
  }

  lines.push("└────────────────────┴───────────┴─────────────┴──────────────────┘");

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. FULL ENGINE PIPELINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Run the complete MarginCore stochastic calculation.
 *
 * @param expectedCost — naive base cost
 * @param volatilityPercent — cost volatility as percentage (e.g. 18)
 * @param emissionFactor — CBAM emission intensity (0–1)
 * @returns MarginCoreEngineOutput
 */
export function runEngine(
  expectedCost: number,
  volatilityPercent: number,
  emissionFactor: number = 0,
): MarginCoreEngineOutput {
  const p90 = calculateP90SafeCost(expectedCost, volatilityPercent);
  const cbam = applyCBAMShock(p90.safe, emissionFactor);

  const scenarios = buildScenarios(expectedCost, volatilityPercent);

  // Verdict logic
  const bufferPercent = p90.expected > 0
    ? (p90.buffer / p90.expected) * 100
    : 0;

  let verdict: "accept" | "caution" | "reject";
  let verdictReason: string;

  if (bufferPercent > 50) {
    verdict = "reject";
    verdictReason = "Risk buffer exceeds 50% of expected cost. Margin erosion is critical — do not proceed without repricing.";
  } else if (bufferPercent > 25) {
    verdict = "caution";
    verdictReason = "Risk buffer is elevated (25–50%). Recommend upward price adjustment before commitment.";
  } else {
    verdict = "accept";
    verdictReason = "Risk buffer is within acceptable range (<25%). P90 exposure is adequately covered.";
  }

  return { p90, cbam, scenarios, verdict, verdictReason };
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. BIG FOUR REPORT TXT FORMATTER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Serialize the full engine output into a Big Four–style audit report
 * string. This is the canonical output for server → client transfer.
 *
 * @param output — MarginCoreEngineOutput from runEngine()
 * @param currency — ISO currency code (USD, EUR, TRY)
 * @returns structured plain-text report
 */
export function formatEngineReport(
  output: MarginCoreEngineOutput,
  currency: string = "USD",
): string {
  const sym = currencySymbol(currency);
  const fmt = (n: number) =>
    `${sym}${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const divider = "════════════════════════════════════════════════════════════════";
  const subDivider = "────────────────────────────────────────────────────────────────";

  const lines: string[] = [
    divider,
    "  MARGINCORE STOCHASTIC RISK ASSESSMENT",
    "  Confidence Level: P90 (Z = 1.28)",
    `  Generated: ${new Date().toISOString()}`,
    `  Currency: ${currency}`,
    divider,
    "",
    "  §1  P90 SAFE COST ANALYSIS",
    subDivider,
    `    Expected (Base) Cost:     ${fmt(output.p90.expected)}`,
    `    P90 Safe Cost:            ${fmt(output.p90.safe)}`,
    `    Risk Buffer:              ${fmt(output.p90.buffer)}`,
    "",
    "  §2  CBAM CARBON LIABILITY",
    subDivider,
    `    Pre-CBAM Cost:            ${fmt(output.cbam.baseCost)}`,
    `    Carbon Surcharge:         ${fmt(output.cbam.carbonLiability)}`,
    `    Total with CBAM:          ${fmt(output.cbam.totalWithCBAM)}`,
    "",
    "  §3  SENSITIVITY MATRIX",
    subDivider,
    indentBlock(generateSensitivityMatrixText(output.p90.expected, output.p90.buffer / Math.max(output.p90.expected, 1)), 4),
    "",
    "  §4  VERDICT",
    subDivider,
    `    Decision:                 ${output.verdict.toUpperCase()}`,
    `    Rationale:                ${output.verdictReason}`,
    "",
    divider,
    "  DISCLAIMER: This output is a technical simulation. It does not",
    "  constitute financial, legal, or engineering advice. Verify all",
    "  outputs before making business decisions.",
    divider,
  ];

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERNAL HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function currencySymbol(currency: string): string {
  switch (currency.toUpperCase()) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    case "TRY": return "₺";
    default: return `${currency} `;
  }
}

function padRight(s: string, len: number): string {
  return s.length >= len ? s.slice(0, len) : s + " ".repeat(len - s.length);
}

function padLeft(s: string, len: number): string {
  return s.length >= len ? s.slice(0, len) : " ".repeat(len - s.length) + s;
}

function indentBlock(text: string, spaces: number): string {
  const indent = " ".repeat(spaces);
  return text.split("\n").map((line) => indent + line).join("\n");
}

function buildScenarios(baseCost: number, volatilityPercent: number): SensitivityScenario[] {
  const iv = volatilityPercent / 100;
  const sigma = baseCost * iv;

  return [
    {
      label: "Material +5%",
      deltaPercent: 5,
      deltaAmount: round2(baseCost * 0.05),
      adjustedCost: round2(baseCost * 1.05 + Z_P90 * sigma * 1.05),
    },
    {
      label: "Labor +10%",
      deltaPercent: 10,
      deltaAmount: round2(baseCost * 0.10),
      adjustedCost: round2(baseCost * 1.10 + Z_P90 * sigma * 1.10),
    },
    {
      label: "Delay +3d",
      deltaPercent: 2.4,
      deltaAmount: round2(baseCost * 0.024),
      adjustedCost: round2(baseCost * 1.024 + Z_P90 * sigma * 1.024),
    },
  ];
}