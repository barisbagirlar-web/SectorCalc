/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck — Formula Registry (locked type system)

/**
 * Safe Formula Registry — typed, testable functions only.
 * Organized under 10 locked industrial formula families.
 * Schemas reference formulaId; never expression strings.
 */

import {
  FORMULA_FAMILIES,
  FORMULA_FAMILY_LABELS,
  type FormulaFamilyId,
} from "@/lib/features/premium-schema/formula-families";
import type { PremiumOutputFormat } from "@/lib/features/premium-schema/premium-calculator-schema";
import { USER_FORMULA_DEFINITIONS, USER_FORMULA_META_DETAILS } from "@/lib/features/premium-schema/user-premium-formulas";

export type FormulaInputs = Readonly<Record<string, number>>;

export type FormulaFn = (inputs: FormulaInputs) => number;

export interface FormulaDefinition {
  readonly id: string;
  readonly family: FormulaFamilyId;
  readonly label: string;
  readonly fn: FormulaFn;
}

function assertFinite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function num(inputs: FormulaInputs, key: string, fallback = 0): number {
  const value = inputs[key];
  return assertFinite(typeof value === "number" ? value : Number(value), fallback);
}

function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }
  return assertFinite(numerator / denominator);
}

function nonNegative(value: number): number {
  return assertFinite(Math.max(0, value));
}

/**
 * Standard normal CDF approximation (Abramowitz & Stegun 26.2.17).
 * Returns P(Z ≤ x) for Z ~ N(0,1), accurate to ~1.5e-7.
 */
function normStd(x: number): number {
  const b0 = 0.2316419, b1 = 0.319381530, b2 = -0.356563782;
  const b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
  const t = 1 / (1 + b0 * Math.abs(x));
  const poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
  const cdf = 1 - poly * Math.exp(-x * x / 2);
  return x >= 0 ? cdf : 1 - cdf;
}

// ---------------------------------------------------------------------------
// Definitions (family → tested function)
// ---------------------------------------------------------------------------

const FORMULA_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "measurement.variance_percent",
    family: "measurement",
    label: "Measurement variance percent",
    fn: (inputs) => {
      const actual = num(inputs, "actual");
      const target = num(inputs, "target");
      if (target === 0) return 0;
      return assertFinite(((actual - target) / target) * 100);
    },
  },
  {
    id: "benchmark.variance_percent",
    family: "benchmark",
    label: "Benchmark variance percent",
    fn: (inputs) => {
      const actual = num(inputs, "actual");
      const target = num(inputs, "target");
      if (target === 0) return 0;
      return assertFinite(((actual - target) / target) * 100);
    },
  },
  {
    id: "time.labor_cost",
    family: "time",
    label: "Time / labor cost",
    fn: (inputs) => assertFinite(num(inputs, "hourlyCost") * num(inputs, "lossHours")),
  },
  {
    id: "time.downtime_minute_cost",
    family: "time",
    label: "Downtime cost from minutes and hourly rate",
    fn: (inputs) =>
      assertFinite((num(inputs, "downtimeMinutes") / 60) * num(inputs, "hourlyRate")),
  },
  {
    id: "time.downtime_units_lost",
    family: "time",
    label: "Output units lost during downtime",
    fn: (inputs) =>
      nonNegative((num(inputs, "downtimeMinutes") / 60) * num(inputs, "outputUnitsPerHour")),
  },
  {
    id: "scrap.material_cost",
    family: "scrap",
    label: "Scrap material cost",
    fn: (inputs) =>
      assertFinite(num(inputs, "materialCost") * (num(inputs, "scrapRate") / 100)),
  },
  {
    id: "scrap.combined_operating",
    family: "scrap",
    label: "Combined operating cost stack",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "laborCost") + num(inputs, "materialCost") + num(inputs, "overheadCost")
      ),
  },
  {
    id: "scrap.total_exposure",
    family: "scrap",
    label: "Total loss exposure with hidden multiplier",
    fn: (inputs) =>
      assertFinite(num(inputs, "baseCost") * num(inputs, "hiddenMultiplier", 1)),
  },
  {
    id: "oee.basic",
    family: "oee",
    label: "OEE score",
    fn: (inputs) =>
      assertFinite(
        (num(inputs, "availability") * num(inputs, "performance") * num(inputs, "quality")) /
          10000
      ),
  },
  {
    id: "oee.availability_loss_cost",
    family: "oee",
    label: "Availability loss cost",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "machineRate") *
          Math.max(0, num(inputs, "downtimeHours") - num(inputs, "plannedHours") * 0.02)
      ),
  },
  {
    id: "route.deadhead_cost",
    family: "route",
    label: "Deadhead route cost",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "distanceKm") *
          num(inputs, "costPerKm") *
          (num(inputs, "emptyReturnPercent") / 100)
      ),
  },
  {
    id: "route.total_freight_cost",
    family: "route",
    label: "Total freight cost",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "fuelCost") +
          num(inputs, "driverCost") +
          num(inputs, "tolls") +
          num(inputs, "deadheadCost")
      ),
  },
  {
    id: "energy.excess_kwh_cost",
    family: "energy",
    label: "Excess kWh cost",
    fn: (inputs) =>
      assertFinite(Math.max(0, num(inputs, "currentKwh") - num(inputs, "targetKwh")) * num(inputs, "rate")),
  },
  {
    id: "energy.kwh_cost",
    family: "energy",
    label: "kWh cost",
    fn: (inputs) => assertFinite(num(inputs, "kwh") * num(inputs, "rate")),
  },
  {
    id: "energy.peak_demand_cost",
    family: "energy",
    label: "Peak demand cost",
    fn: (inputs) =>
      assertFinite(num(inputs, "peakKwh") * num(inputs, "peakRate") + num(inputs, "demandCharge")),
  },
  {
    id: "energy.total_energy_cost",
    family: "energy",
    label: "Total energy cost",
    fn: (inputs) =>
      assertFinite(num(inputs, "excessKwh") * num(inputs, "energyRate") + num(inputs, "peakCost")),
  },
  {
    id: "quality.six_sigma_project_score",
    family: "oee",
    label: "Six Sigma Project Priority Score",
    fn: (inputs) => {
      const savings = num(inputs, "savings");
      const probability = num(inputs, "probability");
      const duration = num(inputs, "duration");
      const cost = num(inputs, "cost");
      
      if (duration === 0 || cost === 0) return 0;
      
      const probRatio = Math.max(0, Math.min(100, probability)) / 100;
      return assertFinite((savings * probRatio) / (duration * cost));
    },
  },
  {
    id: "energy.heat_loss_watts",
    family: "energy",
    label: "Steady-state heat loss in watts",
    fn: (inputs) => {
      const area = num(inputs, "area");
      const uValue = num(inputs, "uValue");
      const insideTemp = num(inputs, "insideTemp");
      const outsideTemp = num(inputs, "outsideTemp");
      const deltaT = Math.max(0, insideTemp - outsideTemp);
      return assertFinite(uValue * area * deltaT);
    },
  },
  {
    id: "energy.annual_heat_loss_kwh",
    family: "energy",
    label: "Annual heat loss energy in kWh",
    fn: (inputs) => {
      const watts = num(inputs, "watts");
      const hours = num(inputs, "hours");
      return assertFinite((watts * hours) / 1000);
    },
  },
  {
    id: "energy.annual_heat_loss_cost",
    family: "energy",
    label: "Annual heat loss cost",
    fn: (inputs) => {
      const kwh = num(inputs, "kwh");
      const rate = num(inputs, "rate");
      return assertFinite(kwh * rate);
    },
  },
  {
    id: "carbon.cbam_exposure",
    family: "carbon",
    label: "CBAM exposure",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "emissionsTon") *
          num(inputs, "carbonPrice") *
          (num(inputs, "exposurePercent") / 100)
      ),
  },
  {
    id: "carbon.cbam_certificate_exposure",
    family: "carbon",
    label: "CBAM certificate exposure in local currency",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "embeddedEmissionsTon") *
          num(inputs, "cbamCertificatePrice") *
          num(inputs, "eurTryRate")
      ),
  },
  {
    id: "carbon.emission_gap_ton",
    family: "carbon",
    label: "Embedded minus declared emissions gap",
    fn: (inputs) =>
      nonNegative(
        Math.max(0, num(inputs, "embeddedEmissionsTon") - num(inputs, "declaredEmissionsTon"))
      ),
  },
  {
    id: "benchmark.gap_percent",
    family: "benchmark",
    label: "Gap percent from full coverage",
    fn: (inputs) => nonNegative(Math.max(0, 100 - num(inputs, "percent"))),
  },
  {
    id: "carbon.cbam_financial_exposure",
    family: "carbon",
    label: "Financial exposure from emission gap",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "emissionGap") * num(inputs, "cbamCertificatePrice") * num(inputs, "eurTryRate")
      ),
  },
  {
    id: "risk.cbam_composite_score",
    family: "benchmark",
    label: "CBAM data preparation risk score",
    fn: (inputs) => {
      const embedded = num(inputs, "embeddedEmissionsTon");
      const emissionGapRatioPct =
        embedded > 0 ? (num(inputs, "emissionGap") / embedded) * 100 : 0;
      return assertFinite(
        emissionGapRatioPct * 0.4 +
          num(inputs, "coverageGapPct") * 0.3 +
          num(inputs, "dataGapPct") * 0.3
      );
    },
  },
  {
    id: "cost.p90_buffer",
    family: "cost",
    label: "P90 volatility buffer",
    fn: (inputs) =>
      assertFinite(num(inputs, "adjustedCost") * (num(inputs, "volatilityPercent") / 100) * 1.2816),
  },
  {
    id: "cost.minimum_safe_price",
    family: "cost",
    label: "Minimum safe price",
    fn: (inputs) => {
      const denom = Math.max(5, 100 - num(inputs, "targetMarginPercent"));
      return assertFinite(num(inputs, "p90Cost") / (denom / 100));
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #1 — AI Token Cost (6 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cost.ai_daily_prompt",
    family: "cost",
    label: "AI daily prompt cost",
    fn: (inputs) => nonNegative((num(inputs, "dailyRequests") * num(inputs, "promptTokens") * num(inputs, "pricePerMToken")) / 1_000_000),
  },
  {
    id: "cost.ai_daily_completion",
    family: "cost",
    label: "AI daily completion cost",
    fn: (inputs) => nonNegative((num(inputs, "dailyRequests") * num(inputs, "completionTokens") * num(inputs, "pricePerMToken")) / 1_000_000),
  },
  {
    id: "cost.ai_daily_cache",
    family: "cost",
    label: "AI daily cache net cost",
    fn: (inputs) => nonNegative((num(inputs, "dailyRequests") * num(inputs, "completionTokens") * (num(inputs, "cacheHitRatio") / 100) * num(inputs, "cacheReadPrice")) / 1_000_000),
  },
  {
    id: "cost.ai_daily_total",
    family: "cost",
    label: "AI daily total base cost",
    fn: (inputs) => nonNegative(num(inputs, "dailyPromptCost") + num(inputs, "dailyCompletionCost") + num(inputs, "dailyCacheCost")),
  },
  {
    id: "cost.ai_monthly_projection",
    family: "cost",
    label: "AI monthly projected cost with growth",
    fn: (inputs) => nonNegative(num(inputs, "dailyTotalCost") * 30 * (1 + (num(inputs, "growthRate") / 100))),
  },
  {
    id: "cost.ai_tco",
    family: "cost",
    label: "AI total cost of ownership (monthly)",
    fn: (inputs) => {
      const projection = num(inputs, "monthlyProjection");
      const buffer = num(inputs, "confidenceBuffer") / 100;
      return nonNegative(projection + projection * buffer + num(inputs, "infraOverhead") + num(inputs, "fallbackModelCost"));
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #2 — Altı Sigma Proje Önceliklendirici (6 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "stats.dpmo",
    family: "measurement",
    label: "DPMO from defects, units and opportunities",
    fn: (inputs) => {
      const u = num(inputs, "units"); const o = num(inputs, "opportunities"); const d = num(inputs, "defects");
      if (u * o === 0) return 0;
      return assertFinite((d / (u * o)) * 1_000_000);
    },
  },
  {
    id: "stats.yield_rate",
    family: "measurement",
    label: "Process yield rate",
    fn: (inputs) => {
      const u = num(inputs, "units"); const o = num(inputs, "opportunities"); const d = num(inputs, "defects");
      if (u * o === 0) return 0;
      return assertFinite(1 - d / (u * o));
    },
  },
  {
    id: "stats.z_bench",
    family: "measurement",
    label: "Z_bench from yield using inverse normal approximation",
    fn: (inputs) => {
      const y = num(inputs, "yield"); if (y <= 0 || y >= 1) return 0;
      // Rational approximation for NORMSINV (Abramowitz & Stegun)
      const t = Math.sqrt(-2 * Math.log(1 - y));
      return assertFinite(t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t));
    },
  },
  {
    id: "stats.sigma_level",
    family: "measurement",
    label: "Sigma level = Z_bench + 1.5 shift",
    fn: (inputs) => assertFinite(num(inputs, "zBench") + 1.5),
  },
  {
    id: "cost.copq",
    family: "cost",
    label: "Cost of Poor Quality",
    fn: (inputs) => nonNegative(num(inputs, "internalFailure") + num(inputs, "externalFailure") + num(inputs, "appraisal") + num(inputs, "prevention")),
  },
  {
    id: "stats.project_score",
    family: "measurement",
    label: "Six Sigma project priority score",
    fn: (inputs) => assertFinite(num(inputs, "financialPriority") * 0.35 + num(inputs, "sigmaGap") * 0.25 + num(inputs, "strategicAlignment") * 0.25 + num(inputs, "ease") * 0.15),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #3 — AQL Sampling (4 formulas - ATI, TotalRiskCost, OptimalCost)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "quality.ati",
    family: "scrap",
    label: "Average Total Inspection (ATI)",
    fn: (inputs) => {
      const n = num(inputs, "sampleSize"); const N = num(inputs, "lotSize"); const Pa = num(inputs, "acceptanceProb");
      return nonNegative(n + (1 - Pa) * (N - n));
    },
  },
  {
    id: "quality.total_risk_cost",
    family: "scrap",
    label: "Total risk cost from escaped defects",
    fn: (inputs) => {
      const N = num(inputs, "lotSize"); const p = num(inputs, "defectRate") / 100; const Pa = num(inputs, "acceptanceProb"); const dr = num(inputs, "detectionRate") / 100; const cpd = num(inputs, "costPerDefect");
      return nonNegative(N * p * (1 - Pa) * (1 - dr) * cpd);
    },
  },
  {
    id: "quality.alpha_risk",
    family: "scrap",
    label: "Producer's risk (alpha)",
    fn: (inputs) => assertFinite(1 - num(inputs, "acceptanceProb")),
  },
  {
    id: "quality.beta_risk",
    family: "scrap",
    label: "Consumer's risk (beta)",
    fn: (inputs) => assertFinite(num(inputs, "acceptanceProbLTPD")),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #4 — Araç Amortismanı (4 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "depreciation.sl_annual",
    family: "cost",
    label: "Straight-line annual depreciation",
    fn: (inputs) => {
      const cost = num(inputs, "cost"); const salvage = num(inputs, "residualValue"); const life = num(inputs, "usefulLife");
      if (life <= 0) return 0;
      return nonNegative((cost - salvage) / life);
    },
  },
  {
    id: "depreciation.db_rate",
    family: "cost",
    label: "Double-declining balance rate",
    fn: (inputs) => {
      const life = num(inputs, "usefulLife");
      if (life <= 0) return 0;
      return assertFinite(2 / life);
    },
  },
  {
    id: "depreciation.tco",
    family: "cost",
    label: "Vehicle TCO over useful life",
    fn: (inputs) => {
      const cost = num(inputs, "acquisitionCost"); const op = num(inputs, "annualOpCost"); const maint = num(inputs, "annualMaintCost"); const fuel = num(inputs, "fuelCostPerYear"); const salvage = num(inputs, "residualValue"); const rate = num(inputs, "discountRate") / 100; const life = num(inputs, "usefulLife");
      let pv = 0;
      for (let t = 1; t <= life; t++) pv += (op + maint + fuel) / Math.pow(1 + rate, t);
      return nonNegative(cost + pv - salvage / Math.pow(1 + rate, life));
    },
  },
  {
    id: "depreciation.tax_shield",
    family: "cost",
    label: "Annual tax shield from depreciation",
    fn: (inputs) => nonNegative(num(inputs, "annualDepreciation") * (num(inputs, "taxRate") / 100)),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #5 — Arıza Süresi Maliyeti (sub-components + total: 7 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cost.downtime_labor",
    family: "cost",
    label: "Downtime direct labor loss",
    fn: (inputs) => nonNegative(num(inputs, "downtimeHours") * num(inputs, "affectedWorkers") * num(inputs, "avgHourlyRate") * 1.3),
  },
  {
    id: "cost.downtime_production",
    family: "cost",
    label: "Downtime production loss",
    fn: (inputs) => nonNegative(num(inputs, "downtimeHours") * num(inputs, "lineCapacityPerHour") * num(inputs, "contributionMarginPerUnit")),
  },
  {
    id: "cost.downtime_energy",
    family: "cost",
    label: "Downtime energy waste",
    fn: (inputs) => nonNegative(num(inputs, "idlePowerKw") * num(inputs, "downtimeHours") * num(inputs, "electricityRate")),
  },
  {
    id: "cost.downtime_recovery",
    family: "cost",
    label: "Downtime recovery cost",
    fn: (inputs) => nonNegative(num(inputs, "overtimeHours") * num(inputs, "overtimeRate")),
  },
  {
    id: "cost.downtime_quality",
    family: "cost",
    label: "Downtime quality loss",
    fn: (inputs) => nonNegative(num(inputs, "startupScrapUnits") * num(inputs, "unitCost")),
  },
  {
    id: "cost.downtime_total",
    family: "cost",
    label: "Total downtime cost (6 components)",
    fn: (inputs) => nonNegative(num(inputs, "directLaborLoss") + num(inputs, "productionLoss") + num(inputs, "energyWaste") + num(inputs, "recoveryCost") + num(inputs, "qualityLoss") + num(inputs, "penalty")),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #6 — Auto Repair Comeback (computed from raw inputs)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cost.comeback_direct",
    family: "cost",
    label: "Direct comeback cost (computed from raw inputs)",
    fn: (inputs) => {
      const cb = num(inputs, "comebackOrders");
      const diagMin = num(inputs, "avgDiagnosisMinutes");
      const repairMin = num(inputs, "avgRepairMinutes") || 0;
      const laborRate = num(inputs, "laborRate");
      const parts = num(inputs, "avgWastedPartsValue") || 0;
      const bayHours = num(inputs, "bayOccupancyHours") || 0;
      const revPerBay = num(inputs, "revenuePerBayHour") || 0;
      const labor = cb * ((diagMin + repairMin) / 60) * laborRate;
      const partsCost = cb * parts;
      const oppCost = cb * bayHours * revPerBay;
      return nonNegative(labor + partsCost + oppCost);
    },
  },
  {
    id: "cost.comeback_total",
    family: "cost",
    label: "Total comeback cost with warranty and goodwill",
    fn: (inputs) => nonNegative(num(inputs, "directCost") + num(inputs, "warrantyCost") + num(inputs, "goodwillCost")),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #7 — Auto Repair Quote Consistency (4 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "stats.quote_variance",
    family: "measurement",
    label: "Quote variance = STDEV/AVERAGE",
    fn: (inputs) => {
      const q1 = num(inputs, "q1"); const q2 = num(inputs, "q2"); const q3 = num(inputs, "q3");
      const avg = (q1 + q2 + q3) / 3; if (avg <= 0) return 0;
      const variance = ((q1 - avg) ** 2 + (q2 - avg) ** 2 + (q3 - avg) ** 2) / 3;
      return assertFinite(Math.sqrt(variance) / avg);
    },
  },
  {
    id: "stats.price_deviation",
    family: "measurement",
    label: "Part price deviation from market average",
    fn: (inputs) => {
      const quoted = num(inputs, "quotedPrice"); const market = num(inputs, "marketPrice");
      if (market <= 0) return 0;
      return assertFinite((quoted - market) / market);
    },
  },
  {
    id: "stats.consistency_score",
    family: "measurement",
    label: "Quote consistency score (0-100)",
    fn: (inputs) => {
      const v = num(inputs, "variance"); const pd = Math.abs(num(inputs, "priceDeviation")); const ld = Math.abs(num(inputs, "laborDeviation"));
      return assertFinite(Math.max(0, 100 - v * 50 - pd * 25 - ld * 25));
    },
  },
  {
    id: "cost.margin_leak_quote",
    family: "cost",
    label: "Margin leak from quote variance",
    fn: (inputs) => nonNegative(num(inputs, "marketPrice") - num(inputs, "quotedPrice")) * num(inputs, "quantity"),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #8 — Auto Shop Marj Kaçak (2 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cost.effective_labor_rate",
    family: "cost",
    label: "Effective labor rate",
    fn: (inputs) => {
      const rev = num(inputs, "laborRevenue"); const hours = num(inputs, "flagHours");
      if (hours <= 0) return 0;
      return assertFinite(rev / hours);
    },
  },
  {
    id: "cost.annual_margin_leakage",
    family: "cost",
    label: "Annual margin leakage from target gap",
    fn: (inputs) => {
      const rev = num(inputs, "totalRevenue"); const target = num(inputs, "targetMargin") / 100; const actual = num(inputs, "actualMargin") / 100;
      return nonNegative(rev * (target - actual));
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #9 — Basınç Vessel Kalınlık (ASME) (4 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "measurement.vessel_shell_thickness",
    family: "measurement",
    label: "ASME shell thickness: t = (P*R)/(S*E - 0.6*P) + CA",
    fn: (inputs) => {
      const P = num(inputs, "pressure"); const R = num(inputs, "radius"); const S = num(inputs, "stressAllowable"); const E = num(inputs, "jointEfficiency"); const CA = num(inputs, "corrosionAllowance");
      const denom = S * E - 0.6 * P;
      if (denom <= 0) return 0;
      return nonNegative((P * R) / denom + CA);
    },
  },
  {
    id: "measurement.vessel_sphere_thickness",
    family: "measurement",
    label: "ASME spherical thickness: t = (P*R)/(2*S*E - 0.2*P) + CA",
    fn: (inputs) => {
      const P = num(inputs, "pressure"); const R = num(inputs, "radius"); const S = num(inputs, "stressAllowable"); const E = num(inputs, "jointEfficiency"); const CA = num(inputs, "corrosionAllowance");
      const denom = 2 * S * E - 0.2 * P;
      if (denom <= 0) return 0;
      return nonNegative((P * R) / denom + CA);
    },
  },
  {
    id: "measurement.vessel_mawp",
    family: "measurement",
    label: "MAWP from actual thickness",
    fn: (inputs) => {
      const S = num(inputs, "stressAllowable"); const E = num(inputs, "jointEfficiency"); const t = num(inputs, "actualThickness"); const CA = num(inputs, "corrosionAllowance"); const R = num(inputs, "radius");
      const denom = R + 0.6 * (t - CA);
      if (denom <= 0) return 0;
      return assertFinite((S * E * (t - CA)) / denom);
    },
  },
  {
    id: "measurement.vessel_weight",
    family: "measurement",
    label: "Vessel weight from geometry",
    fn: (inputs) => {
      const D = num(inputs, "diameter"); const L = num(inputs, "length"); const t = num(inputs, "thickness"); const density = num(inputs, "materialDensity");
      return nonNegative(Math.PI * D * L * t * density);
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #10 — Basınçlı Hava Enerji Maliyeti (2 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "energy.compressed_air_power",
    family: "energy",
    label: "Compressor actual power with efficiencies",
    fn: (inputs) => {
      const Q = num(inputs, "flowRate"); const dP = num(inputs, "deltaPressure"); const effIso = num(inputs, "efficiencyIsothermal") / 100; const effMotor = num(inputs, "efficiencyMotor") / 100; const effDrive = num(inputs, "efficiencyDrive") / 100;
      const totalEff = effIso * effMotor * effDrive;
      if (totalEff <= 0) return 0;
      return nonNegative((Q * dP) / totalEff);
    },
  },
  {
    id: "energy.compressed_air_annual_cost",
    family: "energy",
    label: "Total annual compressed air energy cost",
    fn: (inputs) => nonNegative(num(inputs, "annualEnergyCost") + num(inputs, "leakageCost") + num(inputs, "pressureDropCost") - num(inputs, "heatRecoverySavings")),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #11 — Başabaş Noktası (5 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cost.bep_units",
    family: "cost",
    label: "Break-even point in units",
    fn: (inputs) => {
      const f = num(inputs, "fixedCosts"); const p = num(inputs, "unitPrice"); const v = num(inputs, "unitVariableCost");
      if (p - v <= 0) return 0;
      return nonNegative(f / (p - v));
    },
  },
  {
    id: "cost.cmr",
    family: "cost",
    label: "Contribution margin ratio",
    fn: (inputs) => {
      const p = num(inputs, "unitPrice"); const v = num(inputs, "unitVariableCost");
      if (p <= 0) return 0;
      return assertFinite((p - v) / p);
    },
  },
  {
    id: "cost.bep_revenue",
    family: "cost",
    label: "Break-even revenue",
    fn: (inputs) => {
      const f = num(inputs, "fixedCosts"); const cmr = num(inputs, "cmr");
      if (cmr <= 0) return 0;
      return nonNegative(f / cmr);
    },
  },
  {
    id: "cost.margin_of_safety_pct",
    family: "cost",
    label: "Margin of safety percent",
    fn: (inputs) => {
      const actual = num(inputs, "actualSales"); const bep = num(inputs, "bepUnits");
      if (actual <= 0) return 0;
      return assertFinite((actual - bep) / actual * 100);
    },
  },
  {
    id: "cost.operating_leverage",
    family: "cost",
    label: "Degree of operating leverage",
    fn: (inputs) => {
      const cm = num(inputs, "contributionMargin"); const noi = num(inputs, "netOperatingIncome");
      if (noi <= 0) return 0;
      return assertFinite(cm / noi);
    },
  },
  {
    id: "cost.target_profit_units",
    family: "cost",
    label: "Units needed for target profit",
    fn: (inputs) => {
      const f = num(inputs, "fixedCosts"); const tp = num(inputs, "targetProfit"); const cm = num(inputs, "unitContributionMargin");
      if (cm <= 0) return 0;
      return nonNegative((f + tp) / cm);
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #12 — Beton Hacmi (1 formula — total cost)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "measurement.concrete_volume_total",
    family: "measurement",
    label: "Total concrete volume from geometry",
    fn: (inputs) => {
      const slabV = num(inputs, "slabLength") * num(inputs, "slabWidth") * (num(inputs, "slabThickness") / 100);
      const footingV = num(inputs, "footingLength") * num(inputs, "footingWidth") * num(inputs, "footingDepth") * num(inputs, "footingCount");
      const colV = Math.PI * (num(inputs, "columnDiameter") / 2 / 100) ** 2 * num(inputs, "columnHeight") * num(inputs, "columnCount");
      const wallV = num(inputs, "wallLength") * num(inputs, "wallHeight") * (num(inputs, "wallThickness") / 100);
      const geoV = slabV + footingV + colV + wallV;
      return nonNegative(geoV * (1 + num(inputs, "wasteFactor") / 100));
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #13 — Kalibrasyon Sapma Riski (3 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "measurement.drift_rate",
    family: "measurement",
    label: "Calibration drift rate per day",
    fn: (inputs) => {
      const lastErr = num(inputs, "lastError"); const prevErr = num(inputs, "prevError"); const days = num(inputs, "timeBetweenDays");
      if (days <= 0) return 0;
      return assertFinite((lastErr - prevErr) / days);
    },
  },
  {
    id: "measurement.current_uncertainty",
    family: "measurement",
    label: "Current measurement uncertainty",
    fn: (inputs) => {
      const base = num(inputs, "baseUncertainty"); const predicted = num(inputs, "predictedDrift"); const env = num(inputs, "environmentalFactor");
      return assertFinite(Math.sqrt(base * base + predicted * predicted + env * env));
    },
  },
  {
    id: "measurement.calibration_risk_score",
    family: "measurement",
    label: "Calibration risk score",
    fn: (inputs) => {
      const unc = num(inputs, "currentUncertainty"); const tol = num(inputs, "toleranceLimit");
      if (tol <= 0) return 0;
      return assertFinite((unc / tol) * num(inputs, "criticality") * num(inputs, "usageFrequency"));
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #14 — CBAM Maruziyet (3 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "carbon.embedded_emissions",
    family: "carbon",
    label: "Total embedded emissions (Scope 1 + 2)",
    fn: (inputs) => nonNegative(num(inputs, "directEmissions") + num(inputs, "indirectEmissions")),
  },
  {
    id: "carbon.cbam_certificate_cost",
    family: "carbon",
    label: "CBAM certificate cost after free allowance",
    fn: (inputs) => {
      const total = num(inputs, "embeddedEmissions"); const allowance = num(inputs, "freeAllowance"); const price = num(inputs, "euEtsPrice");
      return nonNegative(Math.max(0, total - allowance) * price);
    },
  },
  {
    id: "carbon.compliance_score",
    family: "carbon",
    label: "CBAM compliance score (0-100)",
    fn: (inputs) => assertFinite(num(inputs, "dataCompleteness") * 0.3 + num(inputs, "verificationStatus") * 0.3 + num(inputs, "reductionProgress") * 0.4),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #15 — CBAM Uyumluluk Kararı (3 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "carbon.specific_embedded",
    family: "carbon",
    label: "Specific embedded emissions per ton",
    fn: (inputs) => {
      const total = num(inputs, "totalEmbedded"); const mass = num(inputs, "totalMass");
      if (mass <= 0) return 0;
      return assertFinite(total / mass);
    },
  },
  {
    id: "carbon.actual_vs_default",
    family: "carbon",
    label: "Actual-to-default emission factor ratio",
    fn: (inputs) => {
      const actual = num(inputs, "specificEmbedded"); const def = num(inputs, "defaultFactor");
      if (def <= 0) return 0;
      return assertFinite(actual / def);
    },
  },
  {
    id: "carbon.cbam_financial_liability",
    family: "carbon",
    label: "CBAM net financial liability",
    fn: (inputs) => {
      const total = num(inputs, "totalEmbedded"); const euPrice = num(inputs, "euEtsPrice"); const originPrice = num(inputs, "carbonPricePaidOrigin");
      return nonNegative(total * (euPrice - originPrice));
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #16 — Chatter Yüzey Kalite Kaybı (5 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "measurement.cutting_speed",
    family: "measurement",
    label: "Cutting speed Vc = (PI * D * n) / 1000",
    fn: (inputs) => assertFinite((Math.PI * num(inputs, "diameter") * num(inputs, "rpm")) / 1000),
  },
  {
    id: "measurement.chip_load",
    family: "measurement",
    label: "Chip load per tooth fz = Vf / (z * n)",
    fn: (inputs) => {
      const Vf = num(inputs, "feedRate"); const z = num(inputs, "toothCount"); const n = num(inputs, "rpm");
      if (z * n <= 0) return 0;
      return assertFinite(Vf / (z * n));
    },
  },
  {
    id: "measurement.surface_roughness_theoretical",
    family: "measurement",
    label: "Theoretical surface roughness Ra = fz^2 / (8 * r_epsilon)",
    fn: (inputs) => {
      const fz = num(inputs, "chipLoad"); const r = num(inputs, "noseRadius");
      if (r <= 0) return 0;
      return assertFinite((fz * fz) / (8 * r));
    },
  },
  {
    id: "measurement.surface_roughness_actual",
    family: "measurement",
    label: "Actual surface roughness with chatter amplification",
    fn: (inputs) => assertFinite(num(inputs, "theoreticalRa") * (1 + num(inputs, "chatterAmplification") / 100)),
  },
  {
    id: "cost.chatter_quality_loss",
    family: "cost",
    label: "Quality loss cost from chatter",
    fn: (inputs) => {
      const actual = num(inputs, "actualRa"); const limit = num(inputs, "toleranceLimit"); const reworkCost = num(inputs, "reworkCostPerMicron");
      if (actual <= limit) return 0;
      return nonNegative((actual - limit) * reworkCost);
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #17 — Cıvata Tork (5 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "measurement.bolt_d2",
    family: "measurement",
    label: "Pitch diameter d2 = d - 0.649519 * p",
    fn: (inputs) => nonNegative(num(inputs, "nominalDiameter") - 0.649519 * num(inputs, "pitch")),
  },
  {
    id: "measurement.bolt_d3",
    family: "measurement",
    label: "Root diameter d3 = d - 1.226869 * p",
    fn: (inputs) => nonNegative(num(inputs, "nominalDiameter") - 1.226869 * num(inputs, "pitch")),
  },
  {
    id: "measurement.bolt_tensile_area",
    family: "measurement",
    label: "Tensile stress area At = (PI/4) * ((d2 + d3)/2)^2",
    fn: (inputs) => {
      const d2 = num(inputs, "d2"); const d3 = num(inputs, "d3");
      const avgD = (d2 + d3) / 2;
      return nonNegative((Math.PI / 4) * avgD * avgD);
    },
  },
  {
    id: "measurement.bolt_preload",
    family: "measurement",
    label: "Bolt preload F = sigma_p * At",
    fn: (inputs) => nonNegative((0.7 * num(inputs, "proofStrength")) * num(inputs, "tensileArea")),
  },
  {
    id: "measurement.bolt_torque",
    family: "measurement",
    label: "Tightening torque T = K * D * F",
    fn: (inputs) => nonNegative(num(inputs, "torqueCoefficient") * num(inputs, "nominalDiameter") / 1000 * num(inputs, "preload")),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #18 — Ciro Maliyeti (Turnover) (1 formula)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cost.turnover_total",
    family: "cost",
    label: "Total turnover cost per employee",
    fn: (inputs) => nonNegative(num(inputs, "separationCost") + num(inputs, "vacancyCost") + num(inputs, "replacementCost") + num(inputs, "trainingCost") + num(inputs, "productivityLoss")),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #19 — Cloud API Overrun (3 formulas)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cost.cloud_overrun_cost",
    family: "cost",
    label: "API overrun cost",
    fn: (inputs) => nonNegative(Math.max(0, num(inputs, "totalRequests") - num(inputs, "includedRequests")) * num(inputs, "overageRate")),
  },
  {
    id: "cost.cloud_throttling_cost",
    family: "cost",
    label: "API throttling cost",
    fn: (inputs) => nonNegative(num(inputs, "throttledRequests") * num(inputs, "retryCost") * num(inputs, "avgRetries")),
  },
  {
    id: "cost.cloud_overrun_total",
    family: "cost",
    label: "Total cloud API overrun cost",
    fn: (inputs) => nonNegative(num(inputs, "overrunCost") + num(inputs, "throttlingCost") + num(inputs, "dataEgressCost") + num(inputs, "slaPenalty")),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL #20 — Cloud Fire Elimination (1 formula)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cost.cloud_waste_total",
    family: "cost",
    label: "Total cloud waste eliminated",
    fn: (inputs) => nonNegative(num(inputs, "zombieCost") + num(inputs, "oversizingSavings") + num(inputs, "spotSavings") + num(inputs, "reservedSavings") + num(inputs, "idleHoursCost")),
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // END TOOLS 1-20 FORMULAS
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLS 21-60 FORMULAS
  // ═══════════════════════════════════════════════════════════════════════════
  // Batch 2: CLV / CAC
  { id: "cost.clv", family: "cost", label: "Customer lifetime value", fn: (i) => num(i,"avgOrderValue") * num(i,"purchaseFreq") * num(i,"lifespan") },
  { id: "cost.gross_margin_clv", family: "cost", label: "Gross margin CLV", fn: (i) => num(i,"clv") * num(i,"grossMarginPct") },
  { id: "cost.discounted_clv", family: "cost", label: "Discounted cumulative CLV", fn: (i) => { const r = num(i,"retention"), d = num(i,"discountRate"), g = num(i,"clv"); let s = 0; for(let t=1;t<=5;t++) s += (g * Math.pow(r, t)) / Math.pow(1 + d, t); return s; } },
  { id: "cost.cac", family: "cost", label: "Customer acquisition cost", fn: (i) => (num(i,"salesMarketing") + num(i,"salaries") + num(i,"overhead")) / num(i,"newCustomers") },
  { id: "cost.cac_payback", family: "cost", label: "CAC payback period", fn: (i) => num(i,"cac") / (num(i,"avgOrderValue") * num(i,"purchaseFreq") * num(i,"grossMarginPct") / 12) },
  { id: "cost.ltv_cac_ratio", family: "cost", label: "LTV / CAC ratio", fn: (i) => num(i,"discountedClv") / num(i,"cac") },

  // CNC çevrim süresi
  { id: "measurement.cnc_rpm", family: "measurement", label: "CNC spindle RPM", fn: (i) => (1000 * num(i,"cuttingSpeed")) / (Math.PI * num(i,"toolDiameter")) },
  { id: "measurement.cnc_feed_speed", family: "measurement", label: "CNC feed speed", fn: (i) => num(i,"feedPerTooth") * num(i,"teeth") * num(i,"rpm") },
  { id: "measurement.cnc_cut_time", family: "measurement", label: "CNC cut time", fn: (i) => (num(i,"length") * num(i,"depth")) / (num(i,"feedSpeed") * num(i,"axialDepth")) },
  { id: "measurement.cnc_rapid_time", family: "measurement", label: "CNC rapid traverse time", fn: (i) => num(i,"rapidDistance") / num(i,"rapidSpeed") },
  { id: "measurement.cnc_toolchange_time", family: "measurement", label: "CNC tool change time", fn: (i) => num(i,"changeCount") * num(i,"timePerChange") },
  { id: "measurement.cnc_total_time", family: "measurement", label: "CNC total cycle time", fn: (i) => num(i,"cutTime") + num(i,"rapidTime") + num(i,"toolChangeTime") + num(i,"nonCuttingTime") + num(i,"loadUnloadTime") },

  // CNC işleme maliyeti
  { id: "cost.cnc_material", family: "cost", label: "CNC raw material cost per unit", fn: (i) => num(i,"rawVolume") * num(i,"density") * num(i,"pricePerKg") * (1 + num(i,"scrapRate")) },
  { id: "cost.cnc_machining", family: "cost", label: "CNC machining cost per unit", fn: (i) => num(i,"totalCycleTime") * num(i,"machineRate") },
  { id: "cost.cnc_tooling", family: "cost", label: "CNC tooling cost per unit", fn: (i) => (num(i,"cutTime") / num(i,"toolLife")) * num(i,"toolCost") },
  { id: "cost.cnc_energy", family: "cost", label: "CNC energy cost per unit", fn: (i) => num(i,"power") * num(i,"totalCycleTime") * num(i,"elecRate") },
  { id: "cost.cnc_overhead", family: "cost", label: "CNC overhead cost per unit", fn: (i) => num(i,"totalCycleTime") * num(i,"overheadRate") },
  { id: "cost.cnc_total_unit", family: "cost", label: "CNC total unit cost", fn: (i) => num(i,"materialCost") + num(i,"machiningCost") + num(i,"toolingCost") + num(i,"energyCost") + num(i,"overheadCost") + num(i,"qualityCost") },

  // CPK → PPM
  { id: "measurement.cpk_z_usl", family: "measurement", label: "Z score for USL", fn: (i) => (num(i,"usl") - num(i,"mean")) / num(i,"stdDev") },
  { id: "measurement.cpk_z_lsl", family: "measurement", label: "Z score for LSL", fn: (i) => (num(i,"mean") - num(i,"lsl")) / num(i,"stdDev") },
  { id: "measurement.cpk_index", family: "measurement", label: "Cpk index", fn: (i) => Math.min(num(i,"zUsl"), num(i,"zLsl")) / 3 },
  { id: "measurement.cpk_p_usl", family: "measurement", label: "Probability above USL", fn: (i) => { const x=num(i,"zUsl"); const t=1/(1+0.2316419*Math.abs(x)); const p=t*(0.319381530+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429)))); return x>=0?1-p:p; } },
  { id: "measurement.cpk_p_lsl", family: "measurement", label: "Probability below LSL", fn: (i) => { const x=-num(i,"zLsl"); const t=1/(1+0.2316419*Math.abs(x)); const p=t*(0.319381530+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429)))); return x>=0?1-p:p; } },
  { id: "measurement.cpk_p_total", family: "measurement", label: "Total out-of-spec probability", fn: (i) => num(i,"pUsl") + num(i,"pLsl") },
  { id: "measurement.cpk_ppm", family: "measurement", label: "PPM out-of-spec", fn: (i) => num(i,"pTotal") * 1000000 },
  { id: "measurement.cpk_yield", family: "measurement", label: "Process yield", fn: (i) => 1 - num(i,"pTotal") },
  { id: "measurement.cpk_sigma_st", family: "measurement", label: "Short-term sigma level", fn: (i) => (num(i,"cpk") * 3) + 1.5 },

  // CPM gecikme cezası
  { id: "measurement.cpm_total_float", family: "measurement", label: "Total float", fn: (i) => num(i,"lateStart") - num(i,"earlyStart") },
  { id: "measurement.cpm_critical_delay", family: "measurement", label: "Critical path delay", fn: (i) => Math.max(0, num(i,"actualDuration") - num(i,"plannedDuration") - num(i,"totalFloat")) },
  { id: "measurement.cpm_non_excusable", family: "measurement", label: "Non-excusable delay days", fn: (i) => Math.max(0, num(i,"criticalDelay") - num(i,"excusableDelay")) },
  { id: "cost.cpm_liquidated_damages", family: "cost", label: "Liquidated damages cost", fn: (i) => num(i,"nonExcusable") * num(i,"dailyPenalty") },
  { id: "cost.cpm_acceleration", family: "cost", label: "Acceleration cost", fn: (i) => num(i,"crashingCost") * num(i,"daysAccelerated") },
  { id: "cost.cpm_net_penalty", family: "cost", label: "Net penalty after acceleration", fn: (i) => num(i,"liquidatedDamages") - num(i,"accelerationCost") },
  { id: "cost.cpm_eot_claim", family: "cost", label: "EOT claim days", fn: (i) => num(i,"excusableDelay") * (1 - num(i,"effFactor")) },

  // Çatı alanı
  { id: "measurement.roof_footprint", family: "measurement", label: "Roof footprint area", fn: (i) => num(i,"roofLength") * num(i,"roofWidth") },
  { id: "measurement.roof_gable_area", family: "measurement", label: "Roof gable area", fn: (i) => num(i,"footprint") / Math.cos(num(i,"pitchAngle") * Math.PI / 180) },
  { id: "measurement.roof_overhang_area", family: "measurement", label: "Roof overhang area", fn: (i) => (2 * (num(i,"buildingLength") + num(i,"buildingWidth"))) * num(i,"overhangWidth") },
  { id: "measurement.roof_material_area", family: "measurement", label: "Total material area needed", fn: (i) => num(i,"gableArea") * (1 + num(i,"wasteFactor")) },
  { id: "measurement.roof_ridge_length", family: "measurement", label: "Ridge length", fn: (i) => num(i,"buildingLength") - num(i,"buildingWidth") + (num(i,"buildingWidth") * Math.SQRT2) },

  // Darboğaz yatırım
  { id: "measurement.bottleneck_util", family: "measurement", label: "Bottleneck utilization", fn: (i) => num(i,"actualOutput") / num(i,"designCapacity") },
  { id: "measurement.bottleneck_throughput", family: "measurement", label: "Effective throughput", fn: (i) => num(i,"demand") * (1 - num(i,"defectRate")) },
  { id: "measurement.bottleneck_takt_time", family: "measurement", label: "Takt time", fn: (i) => num(i,"availableTime") / num(i,"demand") },
  { id: "measurement.bottleneck_cycle_gap", family: "measurement", label: "Cycle time gap", fn: (i) => Math.max(0, num(i,"bottleneckCycle") - num(i,"taktTime")) },
  { id: "cost.bottleneck_cost", family: "cost", label: "Cost of constraint per unit", fn: (i) => num(i,"cycleGap") * num(i,"demand") * num(i,"unitMargin") },
  { id: "cost.bottleneck_roi", family: "cost", label: "Bottleneck upgrade ROI", fn: (i) => (num(i,"throughputIncrease") * num(i,"margin") * num(i,"days")) / num(i,"upgradeCost") },
  { id: "cost.bottleneck_payback", family: "cost", label: "Bottleneck upgrade payback (months)", fn: (i) => num(i,"upgradeCost") / num(i,"monthlyGain") },

  // SMED değişim matrisi
  { id: "measurement.smed_setup_total", family: "measurement", label: "Total setup time", fn: (i) => num(i,"internalSetup") + num(i,"externalSetup") },
  { id: "measurement.smed_target_time", family: "measurement", label: "Target setup time after SMED", fn: (i) => num(i,"internalSetup") * (1 - num(i,"conversionRate")) + num(i,"externalSetup") },
  { id: "measurement.smed_ebq", family: "measurement", label: "Economic batch quantity", fn: (i) => Math.sqrt((2 * num(i,"annualDemand") * num(i,"setupCost")) / num(i,"holdingCost")) },
  { id: "cost.smed_setup_cost", family: "cost", label: "Setup cost", fn: (i) => num(i,"totalSetup") * num(i,"machineRate") + num(i,"labor") },
  { id: "cost.smed_annual_savings", family: "cost", label: "Annual savings from SMED", fn: (i) => (num(i,"totalSetup") - num(i,"targetSetup")) * num(i,"changeoverFreq") * num(i,"machineRate") },

  // Depo yerleşimi
  { id: "measurement.warehouse_storage_area", family: "measurement", label: "Available storage area", fn: (i) => num(i,"footprint") * num(i,"utilRate") },
  { id: "measurement.warehouse_pallet_positions", family: "measurement", label: "Pallet positions", fn: (i) => num(i,"warehouseFootprint") / (num(i,"palletFootprint") * num(i,"aisleFactor")) },
  { id: "measurement.warehouse_vertical_cap", family: "measurement", label: "Vertical storage capacity", fn: (i) => num(i,"palletPositions") * num(i,"rackLevels") },
  { id: "measurement.warehouse_door_throughput", family: "measurement", label: "Door throughput capacity", fn: (i) => num(i,"doors") / (num(i,"turnaroundLoad") + num(i,"turnaroundUnload")) },
  { id: "cost.warehouse_cost_per_pos", family: "cost", label: "Cost per pallet position", fn: (i) => num(i,"facilityCost") / num(i,"palletPositions") },

  // Devamsızlık maliyeti
  { id: "cost.absenteeism_direct", family: "cost", label: "Direct absenteeism cost", fn: (i) => num(i,"absentHours") * num(i,"hourlyRate") * (1 + num(i,"burden")) },
  { id: "cost.absenteeism_ot", family: "cost", label: "Overtime premium cost", fn: (i) => num(i,"replaceOT") * (num(i,"otRate") - num(i,"regRate")) },
  { id: "cost.absenteeism_temp", family: "cost", label: "Temporary worker cost", fn: (i) => num(i,"tempHours") * num(i,"tempRate") * (1 + num(i,"markup")) },
  { id: "cost.absenteeism_prod", family: "cost", label: "Production loss from absenteeism", fn: (i) => num(i,"absentHours") * num(i,"outputPerHour") * num(i,"margin") * (1 - num(i,"effDrop")) / 100 },
  { id: "cost.absenteeism_admin", family: "cost", label: "Admin cost per event", fn: (i) => num(i,"events") * num(i,"hrTime") * num(i,"hrRate") },
  { id: "cost.absenteeism_bradford", family: "cost", label: "Bradford factor score", fn: (i) => Math.pow(num(i,"events"), 2) * num(i,"days") },
  { id: "cost.absenteeism_total", family: "cost", label: "Total absenteeism cost", fn: (i) => num(i,"directCost") + num(i,"otPremium") + num(i,"tempCost") + num(i,"prodLoss") + num(i,"adminCost") },

  // Digital twin maliyet
  { id: "cost.digital_twin_cost_trad", family: "cost", label: "Traditional approach cost", fn: (i) => num(i,"prototyping") + num(i,"fieldTest") + num(i,"downtime") + num(i,"travel") },
  { id: "cost.digital_twin_cost_dt", family: "cost", label: "Digital twin approach cost", fn: (i) => num(i,"license") + num(i,"compute") + num(i,"sensor") + num(i,"modeling") },
  { id: "cost.digital_twin_time_gain", family: "cost", label: "Time gain from digital twin", fn: (i) => (num(i,"physCycle") - num(i,"digCycle")) * num(i,"iterations") },
  { id: "cost.digital_twin_roi", family: "cost", label: "Digital twin ROI", fn: (i) => (num(i,"costTrad") - num(i,"costDt") + num(i,"revenueGain") + num(i,"qualitySavings")) / num(i,"costDt") },

  // Dikiş hattı dengeleme
  { id: "measurement.sewing_takt_time", family: "measurement", label: "Sewing line takt time", fn: (i) => num(i,"availableTime") / num(i,"demand") },
  { id: "measurement.sewing_theo_op", family: "measurement", label: "Theoretical operators needed", fn: (i) => num(i,"cycleTotal") / num(i,"taktTime") },
  { id: "measurement.sewing_line_eff", family: "measurement", label: "Line efficiency", fn: (i) => (num(i,"cycleTotal") / (num(i,"actOperators") * num(i,"taktTime"))) * 100 },
  { id: "measurement.sewing_balance_delay", family: "measurement", label: "Balance delay", fn: (i) => 100 - num(i,"lineEff") },
  { id: "measurement.sewing_smoothness", family: "measurement", label: "Smoothness index", fn: (i) => 0 }, // requires array data

  // Dye reçete maliyeti
  { id: "cost.dye_batch", family: "cost", label: "Dye batch total cost", fn: (i) => num(i,"dyeCost") + num(i,"chemCost") + num(i,"waterCost") + num(i,"energyCost") + num(i,"wasteCost") },
  { id: "cost.dye_rft_savings", family: "cost", label: "RFT rework savings", fn: (i) => num(i,"rework") * (1 - num(i,"rft")) },
  { id: "cost.dye_cost_per_kg", family: "cost", label: "Cost per kg fabric", fn: (i) => (num(i,"totalBatch") + num(i,"rftSavings")) / num(i,"fabricWeight") },

  // Enerji tüketim raporu
  { id: "energy.power_factor", family: "energy", label: "Power factor", fn: (i) => num(i,"active") / Math.sqrt(Math.pow(num(i,"active"), 2) + Math.pow(num(i,"reactive"), 2)) },
  { id: "energy.reactive_penalty", family: "energy", label: "Reactive power penalty", fn: (i) => num(i,"pf") < num(i,"pfThresh") ? (num(i,"reactive") - num(i,"active") * Math.tan(Math.acos(num(i,"pfThresh")))) * num(i,"tariff") : 0 },
  { id: "energy.demand_charge", family: "energy", label: "Demand charge", fn: (i) => num(i,"peakKw") * num(i,"demandRate") },
  { id: "energy.carbon_energy", family: "energy", label: "Carbon cost from energy", fn: (i) => num(i,"active") * num(i,"emisFactor") * num(i,"carbonPrice") },

  // Enflasyon eskalasyon
  { id: "cost.escalation_material", family: "cost", label: "Material cost escalation factor", fn: (i) => Math.pow(1 + num(i,"inflMat"), num(i,"years")) },
  { id: "cost.escalation_labor", family: "cost", label: "Labor cost escalation factor", fn: (i) => Math.pow(1 + num(i,"inflLab"), num(i,"years")) },
  { id: "cost.real_discount", family: "cost", label: "Real discount rate", fn: (i) => ((1 + num(i,"nominal")) / (1 + num(i,"infl"))) - 1 },

  // Environmental fire
  { id: "cost.env_fire_disposal", family: "cost", label: "Disposal cost", fn: (i) => num(i,"waste") * num(i,"dispFee") },
  { id: "cost.env_fire_haz", family: "cost", label: "Hazardous waste cost", fn: (i) => num(i,"hazMass") * (num(i,"hazFee") + num(i,"surcharge")) },
  { id: "cost.env_fire_recycle", family: "cost", label: "Recycling net cost", fn: (i) => num(i,"recycMass") * (num(i,"sortCost") - num(i,"scrapRev")) },
  { id: "cost.env_fire_emis", family: "cost", label: "Emission cost", fn: (i) => num(i,"air") * num(i,"carbonPrice") + num(i,"water") * num(i,"treatCost") },
  { id: "cost.env_fire_penalty_risk", family: "cost", label: "Penalty risk", fn: (i) => num(i,"probViolation") * num(i,"fine") },
  { id: "cost.env_fire_total", family: "cost", label: "Total environmental waste cost", fn: (i) => num(i,"disposalCost") + num(i,"hazCost") + num(i,"recycleCost") + num(i,"emisCost") + num(i,"penaltyRisk") },

  // EOQ Inventory
  { id: "cost.eoq", family: "cost", label: "Economic order quantity", fn: (i) => Math.sqrt((2 * num(i,"annualDemand") * num(i,"orderCost")) / num(i,"holdingCost")) },
  { id: "measurement.eoq_rop", family: "measurement", label: "Reorder point", fn: (i) => (num(i,"leadTime") * num(i,"dailyDemand")) + num(i,"safetyStock") },
  { id: "measurement.eoq_safety_stock", family: "measurement", label: "Safety stock", fn: (i) => num(i,"zScore") * num(i,"stdDev") * Math.sqrt(num(i,"leadTime")) },
  { id: "cost.eoq_total_inv", family: "cost", label: "Total inventory cost", fn: (i) => (num(i,"annualDemand") / num(i,"eoq")) * num(i,"orderCost") + (num(i,"eoq") / 2 + num(i,"safetyStock")) * num(i,"holdingCost") },

  // EVM forecast
  { id: "cost.evm_sv", family: "cost", label: "Schedule variance", fn: (i) => num(i,"ev") - num(i,"pv") },
  { id: "cost.evm_cv", family: "cost", label: "Cost variance", fn: (i) => num(i,"ev") - num(i,"ac") },
  { id: "cost.evm_spi", family: "cost", label: "Schedule performance index", fn: (i) => num(i,"ev") / num(i,"pv") },
  { id: "cost.evm_cpi", family: "cost", label: "Cost performance index", fn: (i) => num(i,"ev") / num(i,"ac") },
  { id: "cost.evm_eac_cpi", family: "cost", label: "EAC using CPI", fn: (i) => num(i,"bac") / num(i,"cpi") },
  { id: "cost.evm_eac_cpi_spi", family: "cost", label: "EAC using CPI×SPI", fn: (i) => num(i,"ac") + ((num(i,"bac") - num(i,"ev")) / (num(i,"cpi") * num(i,"spi"))) },
  { id: "cost.evm_vac", family: "cost", label: "Variance at completion", fn: (i) => num(i,"bac") - num(i,"eac") },

  // Fabrika yerleşim
  { id: "measurement.layout_flow_cost", family: "measurement", label: "Flow distance cost", fn: (i) => 0 }, // requires matrix data

  // Faiz oranı riski
  { id: "cost.ir_exposure", family: "cost", label: "Interest rate exposure", fn: (i) => num(i,"floatingDebt") * (1 - num(i,"hedgeRatio")) },
  { id: "cost.ir_shock_impact", family: "cost", label: "Shock impact on exposure", fn: (i) => num(i,"exposure") * num(i,"bpsChange") / 10000 },
  { id: "cost.ir_dur_gap", family: "cost", label: "Duration gap", fn: (i) => num(i,"assetDur") - num(i,"liabDur") },
  { id: "cost.ir_eve_change", family: "cost", label: "EVE change", fn: (i) => -num(i,"durGap") * num(i,"assetVal") * num(i,"rateChange") },

  // Filament recycling
  { id: "cost.filament_virgin", family: "cost", label: "Virgin filament cost", fn: (i) => num(i,"priceV") * (1 + num(i,"scrapV")) + num(i,"transpV") },
  { id: "cost.filament_recycle", family: "cost", label: "Recycled filament cost", fn: (i) => (num(i,"collect") + num(i,"sort") + num(i,"pellet")) / num(i,"yield") },
  { id: "cost.filament_total_r", family: "cost", label: "Total recycled cost after adjustments", fn: (i) => num(i,"costRecyc") + num(i,"qualPenalty") - num(i,"energySav") - num(i,"carbonCred") },
  { id: "cost.filament_roi", family: "cost", label: "Recycling ROI", fn: (i) => (num(i,"costV") - num(i,"totalR")) * num(i,"volume") / num(i,"capex") },

  // Fiyat esnekliği
  { id: "measurement.price_elasticity", family: "measurement", label: "Price elasticity of demand", fn: (i) => num(i,"pctDemandChange") / num(i,"pctPriceChange") },
  { id: "cost.price_elast_new_rev", family: "cost", label: "New revenue after price change", fn: (i) => num(i,"newPrice") * num(i,"newDem") },
  { id: "cost.price_elast_new_margin", family: "cost", label: "New margin after price change", fn: (i) => (num(i,"newPrice") - num(i,"varCost")) * num(i,"newDem") - num(i,"fixed") },

  // Flexible manufacturing ROI
  { id: "cost.flex_mfg_cost_ded", family: "cost", label: "Dedicated line cost", fn: (i) => num(i,"machDed") + num(i,"setupDed") * num(i,"changeovers") + num(i,"invHigh") },
  { id: "cost.flex_mfg_cost_fms", family: "cost", label: "FMS line cost", fn: (i) => num(i,"machFms") + num(i,"toolFms") + num(i,"prog") + num(i,"maint") },
  { id: "cost.flex_mfg_flex_val", family: "cost", label: "Flexibility value", fn: (i) => (num(i,"ttmRed") * num(i,"revGain")) + (num(i,"custPrem") * num(i,"volume")) },
  { id: "cost.flex_mfg_roi", family: "cost", label: "Flexible mfg ROI", fn: (i) => (num(i,"costDed") - num(i,"costFms") + num(i,"flexVal") + num(i,"invSav") + num(i,"scrapRed")) / num(i,"capex") },

  // Gage R&R
  { id: "measurement.grr_combined", family: "measurement", label: "GRR combined %", fn: (i) => 0 }, // requires matrix data
  { id: "cost.grr_error_cost", family: "cost", label: "Gage error cost impact", fn: (i) => num(i,"falseAcc") * num(i,"escapeCost") + num(i,"falseRej") * num(i,"scrapCost") },

  // Gıda fire marj
  { id: "measurement.food_yield", family: "measurement", label: "Food yield ratio", fn: (i) => num(i,"finished") / num(i,"raw") },
  { id: "cost.food_shrink_cost", family: "cost", label: "Shrinkage cost", fn: (i) => (num(i,"raw") - num(i,"finished")) * num(i,"rawCost") },
  { id: "cost.food_spoil_cost", family: "cost", label: "Spoilage cost", fn: (i) => num(i,"spoiled") * num(i,"prodCost") },
  { id: "cost.food_margin_leak", family: "cost", label: "Total food margin leak", fn: (i) => num(i,"shrinkCost") + num(i,"spoilCost") + num(i,"overCost") },

  // Gübre dozaj
  { id: "measurement.fertilizer_need", family: "measurement", label: "Fertilizer need (kg nutrient)", fn: (i) => (num(i,"nutReq") - num(i,"soilSupp")) / num(i,"eff") },
  { id: "cost.fertilizer_cost", family: "cost", label: "Fertilizer cost per area", fn: (i) => num(i,"appRate") * num(i,"area") * num(i,"price") },
  { id: "cost.fertilizer_roi", family: "cost", label: "Fertilizer ROI", fn: (i) => (num(i,"yieldInc") * num(i,"cropPrice") - num(i,"cost")) / num(i,"cost") },

  // HACCP deviation
  { id: "cost.haccp_hold", family: "cost", label: "Hold cost", fn: (i) => num(i,"quarVol") * num(i,"holdCost") * num(i,"days") },
  { id: "cost.haccp_test", family: "cost", label: "Test cost", fn: (i) => num(i,"samples") * num(i,"labCost") },
  { id: "cost.haccp_rework", family: "cost", label: "Rework cost", fn: (i) => num(i,"devVol") * num(i,"reworkCost") },
  { id: "cost.haccp_disp", family: "cost", label: "Disposal cost", fn: (i) => num(i,"condVol") * num(i,"dispCost") + num(i,"lostMat") },
  { id: "cost.haccp_recall", family: "cost", label: "Recall cost", fn: (i) => num(i,"notif") + num(i,"logRev") + num(i,"retailPen") + num(i,"brand") },
  { id: "cost.haccp_fine", family: "cost", label: "Regulatory fine risk", fn: (i) => num(i,"probDet") * num(i,"fineAmt") },
  { id: "cost.haccp_total", family: "cost", label: "Total HACCP deviation cost", fn: (i) => num(i,"holdCost") + num(i,"testCost") + num(i,"reworkCost") + num(i,"dispCost") + num(i,"recallCost") + num(i,"fineRisk") },

  // Hacimsel ağırlık
  { id: "measurement.volumetric_weight_air", family: "measurement", label: "Volumetric weight for air", fn: (i) => (num(i,"length") * num(i,"width") * num(i,"height")) / 6000 },
  { id: "measurement.volumetric_weight_road", family: "measurement", label: "Volumetric weight for road", fn: (i) => (num(i,"length") * num(i,"width") * num(i,"height")) / 5000 },
  { id: "measurement.volumetric_weight_sea", family: "measurement", label: "Volumetric weight for sea", fn: (i) => (num(i,"length") * num(i,"width") * num(i,"height")) / 1000 },
  { id: "cost.volumetric_freight", family: "cost", label: "Freight cost (chargeable)", fn: (i) => Math.max(num(i,"gross"), num(i,"volWeight")) * num(i,"rate") },

  // Hafiflik maliyet tasarrufu
  { id: "measurement.lightweight_weight_red", family: "measurement", label: "Weight reduction", fn: (i) => num(i,"originalMass") - num(i,"lightweightMass") },
  { id: "cost.lightweight_annual_fuel_sav", family: "cost", label: "Annual fuel savings", fn: (i) => num(i,"weightRed") * num(i,"fuelFactor") * num(i,"distance") * num(i,"fuelPrice") },
  { id: "cost.lightweight_net_sav", family: "cost", label: "Net lifecycle savings", fn: (i) => (num(i,"fuelSav") + num(i,"payloadGain")) * num(i,"life") - num(i,"matPrem") - num(i,"toolDelta") },

  // Hurda oranı optimizasyon
  { id: "cost.scrap_optimize_total", family: "cost", label: "Total scrap cost", fn: (i) => num(i,"scrapMat") + num(i,"scrapLab") + num(i,"scrapOh") + num(i,"oppCost") - num(i,"salvage") },

  // HVAC kapasite
  { id: "measurement.hvac_sensible", family: "measurement", label: "Sensible heat load", fn: (i) => 1.08 * num(i,"cfm") * num(i,"deltaTemp") },
  { id: "measurement.hvac_latent", family: "measurement", label: "Latent heat load", fn: (i) => 0.68 * num(i,"cfm") * num(i,"deltaHumidity") },
  { id: "measurement.hvac_total_load", family: "measurement", label: "Total cooling load BTU/h", fn: (i) => num(i,"sensible") + num(i,"latent") },
  { id: "measurement.hvac_tons", family: "measurement", label: "Cooling tons", fn: (i) => num(i,"totalBtu") / 12000 },

  // Hydraulic system kayıp
  { id: "energy.hydraulic_heat_loss", family: "energy", label: "Hydraulic heat loss", fn: (i) => num(i,"qLeak") * num(i,"p") + num(i,"deltaPPipe") * num(i,"qFlow") + num(i,"deltaPValve") * num(i,"qFlow") },
  { id: "cost.hydraulic_loss_cost", family: "cost", label: "Hydraulic loss energy cost", fn: (i) => num(i,"heat") * num(i,"hours") * num(i,"elecRate") },

  // Isı exchanger fouling
  { id: "energy.fouling_resistance", family: "energy", label: "Fouling resistance", fn: (i) => (1 / num(i,"uDirty")) - (1 / num(i,"uClean")) },
  { id: "energy.heat_exchanger_loss", family: "energy", label: "Heat loss from fouling", fn: (i) => num(i,"area") * num(i,"uClean") * num(i,"lmtd") - num(i,"area") * num(i,"uDirty") * num(i,"lmtd") },
  { id: "cost.fouling_energy_penalty", family: "cost", label: "Energy penalty cost from fouling", fn: (i) => num(i,"heatLoss") * num(i,"hours") / num(i,"boilEff") * num(i,"fuelCost") },

  // ISO 50001 baseline
  { id: "energy.enpi", family: "energy", label: "Energy performance indicator", fn: (i) => num(i,"totalEnergy") / num(i,"productionVolume") },
  { id: "energy.enpi_cusum", family: "energy", label: "CUSUM energy savings", fn: (i) => num(i,"predicted") - num(i,"actual") },

  // IRR
  { id: "cost.irr_simple", family: "cost", label: "Net present value", fn: (i) => { const cfs = (i as any).cashFlows as number[]; const r = num(i,"discountRate"); if(!Array.isArray(cfs)) return 0; let npv = 0; for(let t=0;t<cfs.length;t++) npv += cfs[t] / Math.pow(1+r, t+1); return npv - num(i,"initialInv"); } },
  // Simple IRR approximation
  { id: "cost.irr_approx", family: "cost", label: "IRR approximation", fn: (i) => { const cfs = (i as any).cashFlows as number[]; const init = num(i,"initialInv"); if(!Array.isArray(cfs) || cfs.length === 0) return 0; const total = cfs.reduce((a,b) => a+b, 0); const avg = total / cfs.length; return avg / init; } },

  // Yem maliyeti
  { id: "cost.feed_base_cost", family: "cost", label: "Base feed cost per ton", fn: (i) => { const rates = i.inclRates; const prices = i.prices; if(!Array.isArray(rates) || !Array.isArray(prices)) return 0; return rates.reduce((s,r,idx) => s + r * (prices[idx] || 0), 0); } },
  { id: "cost.feed_cost_per_kg_live", family: "cost", label: "Feed cost per kg live weight", fn: (i) => (num(i,"baseCost") + num(i,"procCost") + num(i,"addCost") + num(i,"baseCost") * num(i,"shrinkRate")) * num(i,"fcr") },

  // İskele kiralama
  { id: "measurement.scaffold_area", family: "measurement", label: "Scaffold surface area", fn: (i) => num(i,"buildingPerimeter") * num(i,"buildingHeight") },
  { id: "cost.scaffold_total", family: "cost", label: "Total scaffold cost", fn: (i) => num(i,"rental") * num(i,"rental") * num(i,"rental") + num(i,"area") * num(i,"laborCost") + num(i,"area") * num(i,"laborCost") + num(i,"transportCost") * num(i,"transportCost") },

  // SPC limit
  { id: "measurement.spc_x_bar_avg", family: "measurement", label: "Average of subgroup means", fn: (i) => { const data = i.data; if(!Array.isArray(data) || data.length === 0) return 0; return data.reduce((s,r) => s + r, 0) / data.length; } },
  { id: "measurement.spc_r_bar", family: "measurement", label: "Average range", fn: (i) => { const data = i.data; if(!Array.isArray(data) || data.length === 0) return 0; const max = Math.max(...data), min = Math.min(...data); return max - min; } },

  // İşleme stratejisi
  { id: "measurement.machining_mrr", family: "measurement", label: "Material removal rate", fn: (i) => num(i,"cuttingSpeed") * num(i,"feedPerRev") * num(i,"depthOfCut") },
  { id: "measurement.machining_power", family: "measurement", label: "Machining power required", fn: (i) => num(i,"mrr") * num(i,"specificEnergy") },

  // Kaizen tasarruf
  { id: "cost.kaizen_hard_savings", family: "cost", label: "Hard savings from kaizen", fn: (i) => (num(i,"baseline") - num(i,"actual")) * num(i,"volume") },
  { id: "cost.kaizen_soft_savings", family: "cost", label: "Soft savings from kaizen", fn: (i) => num(i,"timeSaved") * num(i,"labRate") * num(i,"conv") },
  { id: "cost.kaizen_roi", family: "cost", label: "Kaizen project ROI", fn: (i) => (num(i,"hardSav") + num(i,"softSav") - num(i,"impCost")) / num(i,"impCost") },

  // ── Missing formula stubs for schema pipeline alignment ──
  { id: "cost.absenteeism_prod_loss", family: "cost", label: "Absenteeism production loss cost", fn: (i) => num(i,"absentHours") * num(i,"outputPerHour") * num(i,"margin") * (1 - num(i,"effDrop")) / 100 },
  { id: "cost.digital_twin_revenue_gain", family: "cost", label: "Digital twin revenue gain", fn: (i) => num(i,"timeGain") * num(i,"dailyRev") },
  { id: "cost.digital_twin_quality_savings", family: "cost", label: "Digital twin quality savings", fn: (i) => num(i,"defectReduction") * num(i,"warrantyCost") * num(i,"volume") },
  { id: "cost.digital_twin_total_savings", family: "cost", label: "Digital twin total savings", fn: (i) => num(i,"revenueGain") + num(i,"qualitySavings") },
  { id: "cost.env_fire_emissions", family: "cost", label: "Environmental waste emission cost", fn: (i) => num(i,"air") * num(i,"carbonPrice") + num(i,"water") * num(i,"treatCost") },
  { id: "cost.env_fire_recycling", family: "cost", label: "Recycling cost net recovery", fn: (i) => num(i,"recycMass") * (num(i,"sortCost") - num(i,"scrapRev")) },
  { id: "cost.eoq_total_cost", family: "cost", label: "Total EOQ inventory cost", fn: (i) => (num(i,"annualDemand") / num(i,"eoq")) * num(i,"orderCost") + (num(i,"eoq") / 2 + num(i,"safetyStock")) * num(i,"holdingCost") },
  { id: "cost.escalation_contingency", family: "cost", label: "Escalation contingency", fn: (i) => num(i,"baseAdjusted") * num(i,"confidenceFactor") },
  { id: "cost.escalation_real_discount", family: "cost", label: "Real discount rate", fn: (i) => ((1 + num(i,"nominalRate")) / (1 + num(i,"generalInflation"))) - 1 },
  { id: "cost.feed_cost_per_kg", family: "cost", label: "Feed cost per kg live weight", fn: (i) => (num(i,"baseCost") + num(i,"procCost") + num(i,"addCost") + num(i,"baseCost") * num(i,"shrinkRate")) * num(i,"fcr") },
  { id: "cost.filament_recycled", family: "cost", label: "Recycled filament cost per unit", fn: (i) => (num(i,"collect") + num(i,"sort") + num(i,"pellet")) / num(i,"yield") },
  { id: "cost.grr_cost_error", family: "cost", label: "Gage error cost impact", fn: (i) => num(i,"falseAcc") * num(i,"escapeCost") + num(i,"falseRej") * num(i,"scrapCost") },
  { id: "cost.haccp_disposal", family: "cost", label: "HACCP disposal cost", fn: (i) => num(i,"condVol") * num(i,"dispCost") + num(i,"lostMat") },
  { id: "cost.hvac_annual_cost", family: "cost", label: "HVAC annual operating cost", fn: (i) => (num(i,"totalLoad") / num(i,"eer")) * num(i,"hours") * num(i,"elecRate") },
  { id: "cost.ir_var", family: "cost", label: "Interest rate VaR", fn: (i) => num(i,"portVal") * num(i,"volatility") * num(i,"zScore") },
  { id: "cost.kaizen_payback", family: "cost", label: "Kaizen payback months", fn: (i) => num(i,"impCost") / num(i,"monthSav") },
  { id: "cost.kaizen_sustainability", family: "cost", label: "Kaizen sustainability ratio", fn: (i) => num(i,"savM6") / num(i,"savM1") },
  { id: "cost.layout_total_cost", family: "cost", label: "Total layout cost", fn: (i) => num(i,"matHandCost") + num(i,"spaceUtil") * num(i,"spaceCost") + num(i,"congestion") * num(i,"congCost") },
  { id: "cost.lightweight_fuel_savings", family: "cost", label: "Weight reduction fuel savings", fn: (i) => num(i,"weightReduction") * num(i,"fuelFactor") * num(i,"annualDistance") * num(i,"fuelPrice") },
  { id: "cost.lightweight_net_savings", family: "cost", label: "Net weight reduction savings", fn: (i) => (num(i,"fuelSavings") + num(i,"payloadGain")) * num(i,"productLife") - num(i,"materialPremium") - num(i,"toolDelta") },
  { id: "cost.lightweight_payload_gain", family: "cost", label: "Payload gain value", fn: (i) => num(i,"weightReduction") * num(i,"revenuePerKg") },
  { id: "cost.ltv_cac", family: "cost", label: "LTV / CAC ratio", fn: (i) => num(i,"discountedClv") / num(i,"cac") },
  { id: "cost.npv", family: "cost", label: "Net present value", fn: (i) => { const cfs = (i as any).cashFlows as number[]; const r = num(i,"discountRate"); if(!Array.isArray(cfs)) return 0; let npv = 0; for(let t=0;t<cfs.length;t++) npv += cfs[t] / Math.pow(1+r, t+1); return npv - num(i,"initialInv"); } },
  { id: "cost.payback", family: "cost", label: "CAC payback months", fn: (i) => num(i,"cac") / (num(i,"avgOrderValue") * num(i,"purchaseFreq") * num(i,"grossMarginPct") / 12) },
  { id: "cost.payback_period", family: "cost", label: "Payback period years", fn: (i) => num(i,"yearBefore") + (num(i,"unrecovered") / num(i,"cashRec")) },
  { id: "cost.price_optimal_markup", family: "cost", label: "Optimal markup from elasticity", fn: (i) => -1 / (num(i,"elasticity") + 1) },
  { id: "cost.profitability_index", family: "cost", label: "Profitability index", fn: (i) => { 
      const r_raw = num(i, "discountRate"); 
      const initial = num(i, "initialInv") || num(i, "initialInvestment");
      if (r_raw > 100 || r_raw < -100) { return initial ? (r_raw + initial) / initial : 0; }
      const npv_val = num(i, "npv") || num(i, "npvInvestment") || (i as any).npvInvestment;
      if (npv_val !== undefined && npv_val !== 0) return initial ? (npv_val + initial) / initial : 0;
      const cfs = (i as any).cashFlows; 
      const r = r_raw > 1 ? r_raw / 100 : r_raw;
      if(Array.isArray(cfs)) { let pv = 0; for(let t=0;t<cfs.length;t++) pv += cfs[t] / Math.pow(1+r, t+1); return initial ? pv / initial : 0; }
      const baseCF = num(i, "annualCashFlowNpv") || num(i, "netProfit") || num(i, "annualCashflow") || 0;
      const netCF = baseCF + (num(i, "revenueAnnual") || 0) - (num(i, "operatingCostAnnual") || 0);
      const years = num(i, "lifeYearsNpv") || num(i, "projectLifeYears") || 0;
      const residual = num(i, "purchaseResidualAmt") || num(i, "residualValue") || 0;
      let pv = 0;
      if (r === 0) pv = (netCF * years) + residual; else pv = netCF * ((1 - Math.pow(1 + r, -years)) / r) + residual / Math.pow(1 + r, years);
      return initial ? pv / initial : 0;
  } },
  { id: "cost.scaffold_rental", family: "cost", label: "Scaffold rental cost", fn: (i) => num(i,"scaffoldArea") * num(i,"rentalRatePerM2") * num(i,"rentalDuration") },
  { id: "cost.scaffold_labor", family: "cost", label: "Scaffold labor cost", fn: (i) => num(i,"scaffoldArea") * (num(i,"erectionRate") + num(i,"dismantleRate")) },
  { id: "energy.cusum", family: "energy", label: "CUSUM energy savings", fn: (i) => num(i,"actualConsumption") - num(i,"predictedConsumption") },
  { id: "energy.energy_carbon_footprint", family: "energy", label: "Energy carbon footprint", fn: (i) => num(i,"active") * num(i,"emisFactor") },
  { id: "energy.energy_savings", family: "energy", label: "Energy savings", fn: (i) => num(i,"predictedConsumption") - num(i,"actualConsumption") },
  { id: "energy.energy_total_bill", family: "energy", label: "Total energy bill", fn: (i) => num(i,"baseCharge") + num(i,"touCharge") + num(i,"demandCharge") + num(i,"reactivePenalty") + num(i,"tax") },
  { id: "energy.fouling_cost", family: "energy", label: "Fouling energy penalty cost", fn: (i) => num(i,"heatLoss") * num(i,"pumpIncrease") / num(i,"pumpIncrease") * num(i,"pumpIncrease") },
  { id: "energy.fouling_roi", family: "energy", label: "Fouling cleaning ROI", fn: (i) => num(i,"totalCost") / num(i,"cleanCost") },
  { id: "energy.hydraulic_cost", family: "energy", label: "Hydraulic loss energy cost", fn: (i) => num(i,"heat") * num(i,"hours") * num(i,"elecRate") },
  { id: "energy.hydraulic_eff", family: "energy", label: "Hydraulic system efficiency", fn: (i) => (num(i,"pOut") / num(i,"pIn")) * 100 },
  { id: "measurement.cnc_oee_availability", family: "measurement", label: "CNC OEE availability", fn: (i) => num(i,"plannedTime") / (num(i,"plannedTime") + num(i,"downtime")) },
  { id: "measurement.cnc_tool_change_time", family: "measurement", label: "CNC tool change time", fn: (i) => num(i,"changeCount") * num(i,"timePerChange") },
  { id: "measurement.cpk_ppm_total", family: "measurement", label: "Total PPM out-of-spec", fn: (i) => num(i,"pTotal") * 1000000 },
  { id: "measurement.cpk_sigma_short", family: "measurement", label: "Short-term sigma level", fn: (i) => (num(i,"cpk") * 3) + 1.5 },
  { id: "measurement.cpm_eot_claim", family: "measurement", label: "EOT claim days", fn: (i) => num(i,"excusableDelay") * (1 - num(i,"effFactor")) },
  { id: "measurement.eoq_turnover", family: "measurement", label: "Inventory turnover", fn: (i) => num(i,"annualDemand") / num(i,"avgInv") },
  { id: "measurement.feed_fcr", family: "measurement", label: "Feed conversion ratio", fn: (i) => num(i,"feedCons") / num(i,"weightGain") },
  { id: "measurement.fertilizer_application", family: "measurement", label: "Fertilizer application rate", fn: (i) => num(i,"fertNeed") / num(i,"contentPct") },
  { id: "measurement.grr_pct", family: "measurement", label: "GRR percentage of total variation", fn: (i) => (num(i,"grr") / num(i,"tv")) * 100 },
  { id: "measurement.hvac_total_btu", family: "measurement", label: "Total HVAC load BTU/h", fn: (i) => num(i,"sensible") + num(i,"latent") },
  { id: "measurement.layout_space_util", family: "measurement", label: "Factory space utilization", fn: (i) => num(i,"equipArea") / num(i,"facArea") },
  { id: "measurement.machining_strategy_check", family: "measurement", label: "Machining strategy feasibility", fn: (i) => (num(i,"mrr") < num(i,"specificEnergy") && num(i,"noseRadius") < num(i,"roughnessTol")) ? 1 : 0 },
  { id: "measurement.machining_tool_life", family: "measurement", label: "Taylor tool life", fn: (i) => num(i,"taylorC") / (Math.pow(num(i,"cuttingSpeed"), num(i,"taylorN")) * Math.pow(num(i,"feedPerRev"), num(i,"taylorM"))) },
  { id: "measurement.sewing_line_efficiency", family: "measurement", label: "Sewing line efficiency", fn: (i) => (num(i,"cycleTotal") / (num(i,"actualOperators") * num(i,"taktTime"))) * 100 },
  { id: "measurement.smed_capacity_gain", family: "measurement", label: "SMED capacity gain", fn: (i) => (num(i,"totalSetup") - num(i,"targetSetup")) * num(i,"changeoverFreq") / num(i,"availableTime") },
  { id: "measurement.spc_cp", family: "measurement", label: "Process capability Cp", fn: (i) => (num(i,"usl") - num(i,"lsl")) / (6 * num(i,"sigmaEstimate")) },
  { id: "measurement.spc_lcl_x", family: "measurement", label: "X-bar LCL", fn: (i) => num(i,"xBarAvg") - (num(i,"a2Const") * num(i,"rBar")) },
  { id: "measurement.spc_sigma_estimate", family: "measurement", label: "Sigma estimate from R-bar", fn: (i) => num(i,"rBar") / num(i,"d2Const") },
  { id: "measurement.spc_ucl_x", family: "measurement", label: "X-bar UCL", fn: (i) => num(i,"xBarAvg") + (num(i,"a2Const") * num(i,"rBar")) },
  { id: "measurement.volumetric_chargeable", family: "measurement", label: "Chargeable volumetric weight", fn: (i) => { const mode = String((i as any).mode || 'sea'); const vol = (num(i,"length") * num(i,"width") * num(i,"height")) / (mode === 'air' ? 6000 : mode === 'road' ? 5000 : 1000); return Math.max(num(i,"gross"), vol); } },
  { id: "measurement.warehouse_pick_efficiency", family: "measurement", label: "Warehouse pick efficiency", fn: (i) => num(i,"pickLines") / num(i,"travelTime") },
  { id: "measurement.warehouse_throughput_cap", family: "measurement", label: "Warehouse door throughput", fn: (i) => num(i,"doorCount") / (num(i,"turnaroundLoad") + num(i,"turnaroundUnload")) },

  // ═══════════════════════════════════════════════════════════════════════════
  // END TOOLS 21-60 FORMULAS
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLS 61-100 FORMULAS
  // ═══════════════════════════════════════════════════════════════════════════

  // Kalite PAF
  { id: "cost.paf_prevention", family: "cost", label: "PAF prevention cost", fn: (i) => num(i,"training") + num(i,"qualityPlanning") + num(i,"supplierScore") + num(i,"designReview") },
  { id: "cost.paf_appraisal", family: "cost", label: "PAF appraisal cost", fn: (i) => num(i,"inspection") + num(i,"testing") + num(i,"calibration") + num(i,"audit") },
  { id: "cost.paf_internal_failure", family: "cost", label: "PAF internal failure cost", fn: (i) => num(i,"scrap") + num(i,"rework") + num(i,"reinspection") + num(i,"downtime") },
  { id: "cost.paf_external_failure", family: "cost", label: "PAF external failure cost", fn: (i) => num(i,"warranty") + num(i,"returns") + num(i,"recall") + num(i,"liability") + num(i,"lostSales") },
  { id: "cost.paf_total", family: "cost", label: "Total COQ", fn: (i) => num(i,"prevention") + num(i,"appraisal") + num(i,"internalFailure") + num(i,"externalFailure") },
  { id: "cost.paf_ratio", family: "cost", label: "COQ ratio", fn: (i) => safeDivide(num(i,"totalCoq"), num(i,"totalRevenue")) },
  { id: "cost.paf_p_ratio", family: "cost", label: "Prevention ratio", fn: (i) => safeDivide(num(i,"prevention"), num(i,"totalCoq")) },

  // Carbon
  { id: "measurement.carbon_scope1", family: "measurement", label: "Scope 1", fn: (i) => num(i,"fuelConsumption") * num(i,"fuelEF") + num(i,"fugitive") },
  { id: "measurement.carbon_scope2_market", family: "measurement", label: "Scope 2 market", fn: (i) => num(i,"electricity") * (num(i,"gridEF") - num(i,"recFactor")) },
  { id: "measurement.carbon_scope3_upstream", family: "measurement", label: "Scope 3 upstream", fn: (i) => num(i,"material") * num(i,"materialEF") + num(i,"logisticsEF") },
  { id: "measurement.carbon_total", family: "measurement", label: "Total carbon", fn: (i) => num(i,"scope1") + num(i,"scope2Market") + num(i,"scope3") },
  { id: "measurement.carbon_intensity", family: "measurement", label: "Carbon intensity", fn: (i) => safeDivide(num(i,"totalCarbon"), num(i,"productionVolume")) },
  { id: "cost.carbon_financial_risk", family: "cost", label: "Carbon financial risk", fn: (i) => num(i,"totalCarbon") * num(i,"carbonPrice") },

  // Weld volume/cost
  { id: "measurement.weld_area", family: "measurement", label: "Weld area", fn: (i) => Math.pow(num(i,"leg"), 2) / 2 },
  { id: "measurement.weld_volume", family: "measurement", label: "Weld volume", fn: (i) => num(i,"weldArea") * num(i,"weldLength") },
  { id: "measurement.weld_deposited_weight", family: "measurement", label: "Deposited weight", fn: (i) => num(i,"weldVolume") * num(i,"density") },
  { id: "measurement.weld_electrode_weight", family: "measurement", label: "Electrode weight", fn: (i) => safeDivide(num(i,"depositedWeight"), num(i,"depEff")) },
  { id: "cost.weld_filler_cost", family: "cost", label: "Filler cost", fn: (i) => num(i,"weldWeight") * num(i,"fillerPrice") },
  { id: "cost.weld_gas_cost", family: "cost", label: "Gas cost", fn: (i) => num(i,"gasFlowRate") * num(i,"arcTime") * num(i,"gasPrice") },
  { id: "cost.weld_power_cost", family: "cost", label: "Weld power cost", fn: (i) => (num(i,"voltage") * num(i,"current") * num(i,"arcTime")) / (1000 * num(i,"machineEff")) * num(i,"elecRate") },
  { id: "cost.weld_total_cost", family: "cost", label: "Total weld cost", fn: (i) => num(i,"fillerCost") + num(i,"gasCost") + num(i,"powerCost") + (safeDivide(num(i,"arcTime"), num(i,"depRate")) * num(i,"laborRate")) },
  { id: "measurement.weld_op_factor", family: "measurement", label: "Operating factor", fn: (i) => safeDivide(num(i,"arcTime"), num(i,"totalShiftTime")) },
  { id: "measurement.weld_deposition_rate", family: "measurement", label: "Deposition rate", fn: (i) => safeDivide(num(i,"depositedWeight"), num(i,"arcTime")) },
  { id: "cost.weld_joint_cost", family: "cost", label: "Joint cost", fn: (i) => (safeDivide(num(i,"weldLength"), num(i,"travelSpeed") / 100 * 60) * (num(i,"laborRate") + num(i,"overheadRate")) / num(i,"opFactor") + num(i,"fillerCost") + num(i,"gasCost") + num(i,"powerCost")) },
  { id: "cost.weld_cost_per_meter", family: "cost", label: "Cost per meter", fn: (i) => safeDivide(num(i,"jointCost"), num(i,"weldLength")) },
  { id: "cost.weld_consumable_pct", family: "cost", label: "Consumable %", fn: (i) => safeDivide(num(i,"fillerCost"), num(i,"jointCost")) },
  { id: "measurement.weld_throat", family: "measurement", label: "Throat thickness", fn: (i) => num(i,"leg") * Math.cos(45 * Math.PI / 180) },
  { id: "measurement.weld_shear_area", family: "measurement", label: "Shear area", fn: (i) => num(i,"throat") * num(i,"weldLength") },
  { id: "measurement.weld_allowable_stress", family: "measurement", label: "Allowable stress", fn: (i) => 0.3 * num(i,"tensileStrength") },
  { id: "measurement.weld_max_shear_load", family: "measurement", label: "Max shear load", fn: (i) => num(i,"shearArea") * num(i,"allowableStress") },
  { id: "measurement.weld_safety_factor", family: "measurement", label: "Safety factor", fn: (i) => safeDivide(num(i,"maxShearLoad"), num(i,"appliedLoad")) },

  // Beam material
  { id: "cost.beam_material", family: "cost", label: "Beam material cost", fn: (i) => num(i,"beamLength") * num(i,"beamWeightPerM") * num(i,"materialPricePerKg") },

  // Cut/fill earthwork
  { id: "measurement.cut_fill_net", family: "measurement", label: "Net cut/fill", fn: (i) => num(i,"cutVolume") - num(i,"fillVolume") },
  { id: "measurement.cut_fill_borrow", family: "measurement", label: "Borrow volume", fn: (i) => Math.max(0, num(i,"fillVolume") - num(i,"cutVolume")) },
  { id: "measurement.cut_fill_waste", family: "measurement", label: "Waste volume", fn: (i) => Math.max(0, num(i,"cutVolume") - num(i,"fillVolume")) },
  { id: "cost.cut_fill_haul", family: "cost", label: "Haul cost", fn: (i) => (num(i,"cutVolume") + num(i,"fillVolume")) * num(i,"haulRate") },

  // Leak detection
  { id: "measurement.leak_flow_cfm", family: "measurement", label: "Leak flow CFM", fn: (i) => num(i,"leakArea") * num(i,"pressure") * 0.5 },
  { id: "measurement.leak_power_loss", family: "measurement", label: "Leak power loss", fn: (i) => num(i,"leakFlowCfm") * num(i,"pressure") / 229 },
  { id: "measurement.leak_annual_energy", family: "measurement", label: "Leak annual energy", fn: (i) => num(i,"leakPowerLoss") * num(i,"runningHours") },
  { id: "cost.leak_cost", family: "cost", label: "Leak energy cost", fn: (i) => num(i,"leakAnnualEnergy") * num(i,"energyRate") },
  { id: "cost.leak_total_cost", family: "cost", label: "Total leak cost", fn: (i) => num(i,"leakCost") * num(i,"leakCount") },
  { id: "measurement.leak_carbon", family: "measurement", label: "Leak carbon footprint", fn: (i) => num(i,"leakAnnualEnergy") * num(i,"gridCarbonFactor") },
  { id: "cost.leak_payback", family: "cost", label: "Leak repair payback", fn: (i) => safeDivide(num(i,"repairCost"), num(i,"leakCost")) },

  // Tank sizing
  { id: "measurement.tank_required_vol", family: "measurement", label: "Required tank volume", fn: (i) => num(i,"demand") * num(i,"reserveDays") },
  { id: "measurement.tank_cycle_time", family: "measurement", label: "Tank cycle time", fn: (i) => safeDivide(num(i,"tankCapacity"), num(i,"feedRate")) },
  { id: "measurement.tank_cycles_per_hour", family: "measurement", label: "Cycles per hour", fn: (i) => safeDivide(60, num(i,"cycleTime")) },
  { id: "measurement.tank_motor_check", family: "measurement", label: "Motor sizing check", fn: (i) => safeDivide(num(i,"requiredPower"), num(i,"motorPower")) },
  { id: "cost.tank_cost", family: "cost", label: "Tank cost estimate", fn: (i) => num(i,"tankCapacity") * num(i,"costPerUnitVol") },

  // Container utilization
  { id: "measurement.container_vol_util", family: "measurement", label: "Volume utilization", fn: (i) => safeDivide(num(i,"cargoVol"), num(i,"containerVol")) },
  { id: "measurement.container_weight_util", family: "measurement", label: "Weight utilization", fn: (i) => safeDivide(num(i,"cargoWeight"), num(i,"maxPayload")) },
  { id: "measurement.container_efficiency", family: "measurement", label: "Container efficiency", fn: (i) => num(i,"volUtil") * num(i,"weightUtil") },
  { id: "cost.container_waste_cost", family: "cost", label: "Container waste cost", fn: (i) => (1 - num(i,"volUtil")) * num(i,"containerCost") },

  // Fabric utilization
  { id: "measurement.fabric_marker_eff", family: "measurement", label: "Marker efficiency", fn: (i) => safeDivide(num(i,"netArea"), num(i,"grossArea")) },
  { id: "measurement.fabric_required", family: "measurement", label: "Fabric required", fn: (i) => safeDivide(num(i,"netArea"), num(i,"markerEff")) },
  { id: "cost.fabric_cost", family: "cost", label: "Fabric cost", fn: (i) => num(i,"fabricRequired") * num(i,"pricePerUnit") },
  { id: "cost.fabric_util_gain", family: "cost", label: "Utilization gain savings", fn: (i) => (num(i,"oldWaste") - num(i,"newWaste")) * num(i,"pricePerUnit") * num(i,"totalYards") },
  { id: "measurement.fabric_total_yardage", family: "measurement", label: "Total yardage", fn: (i) => num(i,"pieces") * num(i,"fabricRequired") },

  // FX exposure
  { id: "cost.fx_exposure", family: "cost", label: "FX exposure", fn: (i) => num(i,"fxAmount") * num(i,"spotRate") },
  { id: "cost.fx_var_historical", family: "cost", label: "Historical VaR", fn: (i) => num(i,"fxExposure") * num(i,"historicalVol") * 1.65 },
  { id: "cost.fx_var_parametric", family: "cost", label: "Parametric VaR", fn: (i) => num(i,"fxExposure") * num(i,"stdDev") * 1.65 },
  { id: "cost.fx_unhedged_var", family: "cost", label: "Unhedged VaR", fn: (i) => num(i,"fxExposure") * num(i,"expectedMove") },
  { id: "cost.fx_hedge_cost", family: "cost", label: "Hedge cost", fn: (i) => num(i,"fxExposure") * num(i,"hedgePremiumPct") / 100 },
  { id: "cost.fx_net_impact", family: "cost", label: "Net FX impact", fn: (i) => num(i,"unhedgedVar") - num(i,"hedgeCost") },

  // Energy bill
  { id: "cost.energy_charge", family: "cost", label: "Energy charge", fn: (i) => num(i,"consumptionKwh") * num(i,"ratePerKwh") },
  { id: "cost.reactive_penalty_kwh", family: "cost", label: "Reactive penalty", fn: (i) => Math.max(0, num(i,"reactivePower") - num(i,"reactiveAllowance")) * num(i,"penaltyRate") },
  { id: "cost.total_bill_kwh", family: "cost", label: "Total energy bill", fn: (i) => num(i,"energyCharge") + num(i,"fixedCharge") + num(i,"reactivePenalty") + num(i,"tax") },
  { id: "cost.unit_cost_kwh", family: "cost", label: "Unit cost per kWh", fn: (i) => safeDivide(num(i,"totalBill"), num(i,"totalConsumption")) },
  { id: "cost.peak_shaving_savings", family: "cost", label: "Peak shaving savings", fn: (i) => (num(i,"peakDemand") - num(i,"shavedDemand")) * num(i,"demandCharge") },

  // Route optimization
  { id: "measurement.route_drift_pct", family: "measurement", label: "Route drift %", fn: (i) => safeDivide(num(i,"actualDistance") - num(i,"idealDistance"), num(i,"idealDistance")) * 100 },
  { id: "cost.route_fuel_waste", family: "cost", label: "Route fuel waste cost", fn: (i) => (num(i,"actualDistance") - num(i,"idealDistance")) * num(i,"fuelConsumption") * num(i,"fuelPrice") },
  { id: "cost.route_time_waste", family: "cost", label: "Route time waste cost", fn: (i) => (num(i,"actualDistance") - num(i,"idealDistance")) * num(i,"avgSpeed") },
  { id: "measurement.route_efficiency", family: "measurement", label: "Route efficiency", fn: (i) => safeDivide(num(i,"idealDistance"), num(i,"actualDistance")) },
  { id: "cost.route_total_loss", family: "cost", label: "Total route loss", fn: (i) => num(i,"fuelWaste") + num(i,"timeWaste") },

  // Shop labor
  { id: "cost.shop_direct_labor", family: "cost", label: "Direct labor cost", fn: (i) => num(i,"technicianWages") * num(i,"technicianWages") },
  { id: "cost.shop_indirect_labor", family: "cost", label: "Indirect labor cost", fn: (i) => num(i,"managerWages") * num(i,"adminWages") },
  { id: "cost.shop_overhead", family: "cost", label: "Shop overhead", fn: (i) => (num(i,"directLabor") + num(i,"indirectLabor")) * num(i,"depreciation") / 100 },
  { id: "cost.shop_total_cost", family: "cost", label: "Total shop cost", fn: (i) => num(i,"directLabor") + num(i,"indirectLabor") + num(i,"overhead") },
  { id: "cost.shop_billable_hours", family: "cost", label: "Billable hours", fn: (i) => num(i,"totalAvailableHours") * num(i,"utilizationRate") / 100 },
  { id: "cost.shop_effective_margin", family: "cost", label: "Effective margin", fn: (i) => safeDivide(num(i,"actualBillingRate") - num(i,"shopHourlyRate"), num(i,"shopRevenue")) * 100 },

  // Crop yield
  { id: "measurement.crop_potential_yield", family: "measurement", label: "Potential yield", fn: (i) => num(i,"area") * num(i,"potentialPerHa") },
  { id: "measurement.crop_actual_yield", family: "measurement", label: "Actual yield", fn: (i) => num(i,"area") * num(i,"actualPerHa") },
  { id: "measurement.crop_yield_gap", family: "measurement", label: "Yield gap", fn: (i) => num(i,"potentialYield") - num(i,"actualYield") },
  { id: "cost.crop_financial_loss", family: "cost", label: "Financial loss", fn: (i) => num(i,"yieldGap") * num(i,"pricePerTon") },
  { id: "cost.crop_roi_intervention", family: "cost", label: "Intervention ROI", fn: (i) => safeDivide(num(i,"financialLoss") - num(i,"interventionCost"), num(i,"interventionCost")) * 100 },

  // Machine EUAC
  { id: "cost.machine_euac_capital", family: "cost", label: "EUAC capital", fn: (i) => num(i,"purchaseCost") * (num(i,"discountRate") / 100) / (1 - Math.pow(1 + num(i,"interestRate") / 100, -num(i,"lifeYears"))) },
  { id: "cost.machine_euac_operating", family: "cost", label: "EUAC operating", fn: (i) => num(i,"annualOperatingCost") + num(i,"annualOperatingCost") + num(i,"annualEnergy") },
  { id: "cost.machine_total_euac", family: "cost", label: "Total EUAC", fn: (i) => num(i,"euacCapital") + num(i,"euacOperating") },

  // TCO comparison
  { id: "cost.tco_current", family: "cost", label: "Current TCO", fn: (i) => num(i,"currentMaterialCost") + num(i,"currentMaterialWeight") + num(i,"currentMaterialWeight") + num(i,"productionVolume") },
  { id: "cost.tco_alternative", family: "cost", label: "Alternative TCO", fn: (i) => num(i,"alternativeMaterialCost") + num(i,"alternativeWeight") + num(i,"alternativeWeight") + num(i,"productionVolume") },
  { id: "cost.tco_weight_savings", family: "cost", label: "Weighted TCO savings", fn: (i) => (num(i,"currentMaterialWeight") - num(i,"alternativeWeight")) * num(i,"productionVolume") },
  { id: "cost.tco_net_benefit", family: "cost", label: "Net TCO benefit", fn: (i) => num(i,"currentTco") - num(i,"alternativeTco") },
  { id: "measurement.tco_payback", family: "measurement", label: "TCO payback", fn: (i) => safeDivide(num(i,"toolingCost"), num(i,"netBenefit")) },

  // MOQ / EOQ
  { id: "cost.eoq_moq_penalty", family: "cost", label: "MOQ penalty", fn: (i) => Math.max(0, num(i,"moqQty") - num(i,"optimalQty")) * num(i,"unitCost") },
  { id: "cost.moq_price_break_savings", family: "cost", label: "Price break savings", fn: (i) => num(i,"priceBreakQty") * (num(i,"priceBreakUnitPrice") - num(i,"unitCost")) },
  { id: "cost.moq_net_benefit", family: "cost", label: "MOQ net benefit", fn: (i) => num(i,"priceBreakSavings") - num(i,"moqPenalty") },
  { id: "measurement.moq_optimal_qty", family: "measurement", label: "Optimal order qty", fn: (i) => Math.max(num(i,"actualDemand"), num(i,"moqQty")) },

  // Reliability / MTBF
  { id: "measurement.availability_mtbf", family: "measurement", label: "Availability from MTBF", fn: (i) => safeDivide(num(i,"mtbfHours"), num(i,"mtbfHours") + num(i,"mttrHours")) },
  { id: "measurement.expected_downtime", family: "measurement", label: "Expected downtime", fn: (i) => (1 - num(i,"mttrHours")) * num(i,"operatingHours") },
  { id: "cost.downtime_cost_mtbf", family: "cost", label: "Downtime cost", fn: (i) => num(i,"expectedDowntime") * num(i,"machineHourlyCost") },
  { id: "cost.reliability_total_cost", family: "cost", label: "Reliability total cost", fn: (i) => num(i,"downtimeCost") + num(i,"numMachines") + num(i,"numMachines") },
  { id: "cost.reliability_roi", family: "cost", label: "Reliability improvement ROI", fn: (i) => safeDivide(num(i,"mtbfHours") - num(i,"improvedMtbf"), num(i,"downtimeCost")) * 100 },

  // Muda (7 wastes)
  { id: "cost.muda_overproduction", family: "cost", label: "Overproduction waste", fn: (i) => num(i,"overproducedQty") * num(i,"unitCost") },
  { id: "cost.muda_waiting", family: "cost", label: "Waiting waste", fn: (i) => num(i,"waitingHours") * num(i,"laborRate") },
  { id: "cost.muda_transport", family: "cost", label: "Transport waste", fn: (i) => num(i,"excessDist") * num(i,"costPerKm") },
  { id: "cost.muda_overprocessing", family: "cost", label: "Overprocessing waste", fn: (i) => num(i,"extraProcessHours") * num(i,"processRate") },
  { id: "cost.muda_inventory", family: "cost", label: "Inventory waste", fn: (i) => num(i,"excessInventory") * num(i,"holdingCostPerUnit") },
  { id: "cost.muda_motion", family: "cost", label: "Motion waste", fn: (i) => num(i,"excessMotionHours") * num(i,"laborRate") },
  { id: "cost.muda_defects", family: "cost", label: "Defects waste", fn: (i) => num(i,"defectQty") * num(i,"reworkCostPerUnit") },
  { id: "cost.muda_total", family: "cost", label: "Total muda cost", fn: (i) => num(i,"mudaOverproduction") + num(i,"mudaWaiting") + num(i,"mudaTransport") + num(i,"mudaOverprocessing") + num(i,"mudaInventory") + num(i,"mudaMotion") + num(i,"mudaDefects") },

  // Cash flow
  { id: "measurement.cash_inflow", family: "measurement", label: "Cash inflow", fn: (i) => num(i,"salesRevenue") + num(i,"receivablesCollected") + num(i,"otherIncome") },
  { id: "measurement.cash_outflow", family: "measurement", label: "Cash outflow", fn: (i) => num(i,"supplierPayments") + num(i,"payroll") + num(i,"operatingExpenses") + num(i,"taxPayment") },
  { id: "measurement.net_cash_flow", family: "measurement", label: "Net cash flow", fn: (i) => num(i,"cashInflow") - num(i,"cashOutflow") },
  { id: "measurement.cumulative_cash", family: "measurement", label: "Cumulative cash", fn: (i) => num(i,"openingBalance") + num(i,"netCashFlow") },
  { id: "measurement.cash_gap", family: "measurement", label: "Cash gap", fn: (i) => Math.max(0, -num(i,"netCashFlow")) },
  { id: "measurement.cash_conversion_cycle", family: "measurement", label: "Cash conversion cycle", fn: (i) => num(i,"dso") + num(i,"dio") - num(i,"dpo") },

  // Freight
  { id: "measurement.chargeable_weight", family: "measurement", label: "Chargeable weight", fn: (i) => Math.max(num(i,"actualWeight"), num(i,"volumetricWeight")) },
  { id: "cost.base_freight", family: "cost", label: "Base freight cost", fn: (i) => num(i,"chargeableWeight") * num(i,"ratePerKg") },
  { id: "cost.bunker_surcharge", family: "cost", label: "Bunker surcharge", fn: (i) => num(i,"baseFreight") * num(i,"bunkerPct") / 100 },
  { id: "cost.terminal_handling", family: "cost", label: "Terminal handling", fn: (i) => num(i,"chargeableWeight") * num(i,"handlingRate") },
  { id: "cost.customs_clearance", family: "cost", label: "Customs clearance", fn: (i) => num(i,"declaredValue") * num(i,"customsRate") / 100 },
  { id: "cost.total_freight_cost", family: "cost", label: "Total freight cost", fn: (i) => num(i,"baseFreight") + num(i,"bunkerSurcharge") + num(i,"terminalHandling") + num(i,"customsClearance") + num(i,"insurance") },
  { id: "measurement.freight_cost_per_unit", family: "measurement", label: "Freight cost per unit", fn: (i) => safeDivide(num(i,"totalFreightCost"), num(i,"unitCount")) },

  // Noise / vibration
  { id: "measurement.noise_exposure", family: "measurement", label: "Noise exposure dose", fn: (i) => safeDivide(num(i,"noiseLevelDb"), num(i,"exposureHours")) * 100 },
  { id: "measurement.vibration_rms", family: "measurement", label: "Vibration RMS", fn: (i) => num(i,"vibrationRms") * num(i,"vibrationDailyHours") },
  { id: "cost.noise_health_cost", family: "cost", label: "Noise health cost", fn: (i) => num(i,"numWorkers") * num(i,"avgWorkerSalary") },
  { id: "cost.noise_productivity_loss", family: "cost", label: "Noise productivity loss", fn: (i) => num(i,"noiseLevelDb") / 100 * num(i,"numWorkers") * num(i,"avgWorkerSalary") / 100 },
  { id: "cost.noise_rework_cost", family: "cost", label: "Noise-related rework", fn: (i) => num(i,"noiseLevelDb") * num(i,"vibrationLevel") },
  { id: "cost.noise_mitigation_roi", family: "cost", label: "Noise mitigation ROI", fn: (i) => safeDivide(num(i,"healthCost") + num(i,"productivityLoss") + num(i,"reworkCost") - num(i,"mitigationInvestment"), num(i,"mitigationCost")) * 100 },

  // OEE
  { id: "measurement.oee_availability", family: "measurement", label: "OEE availability", fn: (i) => safeDivide(num(i,"operatingTime"), num(i,"plannedProdTime")) },
  { id: "measurement.oee_performance", family: "measurement", label: "OEE performance", fn: (i) => safeDivide(num(i,"idealCycleTime") * num(i,"totalParts"), num(i,"operatingTime")) },
  { id: "measurement.oee_quality", family: "measurement", label: "OEE quality", fn: (i) => safeDivide(num(i,"goodParts"), num(i,"totalParts")) },
  { id: "measurement.oee_score", family: "measurement", label: "OEE score", fn: (i) => num(i,"oeeAvailability") * num(i,"oeePerformance") * num(i,"oeeQuality") * 100 },
  { id: "measurement.teep_score", family: "measurement", label: "TEEP score", fn: (i) => safeDivide(num(i,"operatingTime"), num(i,"totalCalendarTime")) * num(i,"oeePerformance") * num(i,"oeeQuality") * 100 },
  { id: "cost.oee_downtime_cost", family: "cost", label: "OEE downtime cost", fn: (i) => (num(i,"plannedProdTime") - num(i,"operatingTime")) * num(i,"costPerHour") },
  { id: "cost.oee_speed_loss", family: "cost", label: "OEE speed loss cost", fn: (i) => (num(i,"operatingTime") - num(i,"idealCycleTime") * num(i,"totalParts")) * num(i,"costPerHour") },
  { id: "cost.oee_quality_loss", family: "cost", label: "OEE quality loss cost", fn: (i) => (num(i,"totalParts") - num(i,"goodParts")) * num(i,"costPerPart") },

  // Office inventory
  { id: "cost.office_consumption_rate", family: "cost", label: "Consumption rate", fn: (i) => safeDivide(num(i,"monthlyConsumption"), 12) },
  { id: "cost.office_annual_cost", family: "cost", label: "Annual ordering cost", fn: (i) => safeDivide(num(i,"consumptionRate"), num(i,"unitPrice")) * num(i,"unitPrice") },
  { id: "cost.office_carrying_cost", family: "cost", label: "Carrying cost", fn: (i) => safeDivide(num(i,"currentOrderQty"), 2) * num(i,"unitPrice") },
  { id: "cost.office_stockout_cost", family: "cost", label: "Stockout cost", fn: (i) => num(i,"stockoutRate") * num(i,"stockoutCostPerUnit") },
  { id: "cost.office_eoq", family: "cost", label: "Office EOQ", fn: (i) => Math.sqrt(2 * num(i,"consumptionRate") * num(i,"orderCost") / num(i,"holdingRate")) },
  { id: "cost.office_waste_pct", family: "cost", label: "Office waste %", fn: (i) => safeDivide(num(i,"currentOrderQty"), num(i,"optimalEoq")) * 100 },
  { id: "cost.office_optimization_savings", family: "cost", label: "Optimization savings", fn: (i) => (num(i,"currentOrderQty") - num(i,"optimalEoq")) },

  // Overtime / hiring
  { id: "cost.ot_cost_hour", family: "cost", label: "OT cost per hour", fn: (i) => num(i,"baseRate") * num(i,"otMultiplier") },
  { id: "cost.hiring_total_cost", family: "cost", label: "Hiring total cost", fn: (i) => num(i,"advertising") + num(i,"recruiting") + num(i,"training") + num(i,"onboarding") },
  { id: "cost.annual_new_hire_cost", family: "cost", label: "Annual new hire cost", fn: (i) => num(i,"hiringTotalCost") + num(i,"salary") + num(i,"benefits") },
  { id: "measurement.breakeven_hours_base", family: "measurement", label: "Breakeven hours", fn: (i) => safeDivide(num(i,"annualNewHireCost"), num(i,"otCostHour")) },
  { id: "measurement.ot_hire_decision", family: "measurement", label: "OT vs hire decision", fn: (i) => num(i,"overtimeHoursPerMonth") > num(i,"breakevenHours") ? 1 : 0 },
  { id: "cost.ot_quality_cost", family: "cost", label: "OT quality cost", fn: (i) => num(i,"annualOtHours") * num(i,"defectRate") * num(i,"reworkCost") },

  // DSO / payment terms
  { id: "measurement.dso_base", family: "measurement", label: "DSO base", fn: (i) => safeDivide(num(i,"accountsReceivable"), num(i,"avgDailySales")) },
  { id: "cost.carrying_cost_ar", family: "cost", label: "AR carrying cost", fn: (i) => num(i,"avgReceivables") * num(i,"costOfCapital") / 100 },
  { id: "cost.bad_debt_expense", family: "cost", label: "Bad debt expense", fn: (i) => num(i,"annualRevenue") * num(i,"badDebtRate") / 100 },
  { id: "cost.discount_cost", family: "cost", label: "Discount cost", fn: (i) => num(i,"annualRevenue") * num(i,"discountRate") / 100 },
  { id: "measurement.cash_flow_impact_terms", family: "measurement", label: "Terms cash flow impact", fn: (i) => (num(i,"currentTerms") - num(i,"proposedTerms")) * num(i,"annualRevenue") },
  { id: "cost.npv_terms", family: "cost", label: "NPV of terms change", fn: (i) => num(i,"cashFlowImpact") / Math.pow(1 + num(i,"discountRate") / 100, 1) - num(i,"discountCost") },

  // Learning curve
  { id: "measurement.learning_rate", family: "measurement", label: "Learning rate", fn: (i) => 1 - Math.pow(2, Math.log(num(i,"learningRate")) / Math.log(2)) },
  { id: "measurement.learning_slope", family: "measurement", label: "Learning slope", fn: (i) => Math.log(num(i,"learningRate")) / Math.log(2) },
  { id: "measurement.time_n", family: "measurement", label: "Time for unit n", fn: (i) => num(i,"firstUnitTime") * Math.pow(num(i,"targetUnit"), num(i,"learningRate")) },
  { id: "measurement.cumulative_time_n", family: "measurement", label: "Cumulative time for n", fn: (i) => num(i,"firstUnitTime") * (Math.pow(num(i,"targetUnit") + 0.5, 1 + num(i,"learningRate")) / (1 + num(i,"learningRate"))) },
  { id: "measurement.average_time_n", family: "measurement", label: "Average time per unit", fn: (i) => safeDivide(num(i,"cumulativeTimeN"), num(i,"targetUnit")) },
  { id: "cost.learning_cost_n", family: "cost", label: "Labor cost for unit n", fn: (i) => num(i,"timeN") * num(i,"hourlyRate") },
  { id: "measurement.breakeven_unit_learning", family: "measurement", label: "Learning breakeven unit", fn: (i) => Math.pow(safeDivide(num(i,"targetCost"), num(i,"firstUnitCost")), 1 / num(i,"learningSlope")) },

  // Sample size
  { id: "measurement.sample_infinite", family: "measurement", label: "Sample size infinite", fn: (i) => Math.pow(num(i,"confidenceLevel") * num(i,"marginError") / num(i,"estimatedProportion"), 2) },
  { id: "measurement.sample_finite", family: "measurement", label: "Sample size finite", fn: (i) => safeDivide(num(i,"sampleInfinite"), 1 + safeDivide(num(i,"sampleInfinite") - 1, num(i,"populationSize"))) },
  { id: "measurement.sample_continuous", family: "measurement", label: "Sample size continuous", fn: (i) => Math.pow(num(i,"confidenceLevel"), 2) * num(i,"marginError") / Math.pow(num(i,"estimatedProportion"), 2) },
  { id: "measurement.sample_power_adj", family: "measurement", label: "Power adjusted sample", fn: (i) => num(i,"sampleFinite") * (1 + Math.pow(num(i,"power"), 2) / (2 * Math.pow(num(i,"effectSize"), 2))) },
  { id: "measurement.sample_design_effect", family: "measurement", label: "Design effect", fn: (i) => 1 + (num(i,"clusterSize") - 1) * num(i,"designEffect") },
  { id: "measurement.sample_final_n", family: "measurement", label: "Final sample size", fn: (i) => Math.ceil(num(i,"sampleDesignEffect") * num(i,"designEffect")) },
  { id: "cost.sampling_total_cost", family: "cost", label: "Sampling total cost", fn: (i) => num(i,"sampleFinalN") * num(i,"costPerSample") + num(i,"fixedCost") },

  // Rack storage
  { id: "measurement.rack_capacity", family: "measurement", label: "Rack capacity", fn: (i) => num(i,"rackQty") * num(i,"palletsPerBay") * num(i,"levels") },
  { id: "measurement.floor_utilization_rack", family: "measurement", label: "Floor utilization", fn: (i) => safeDivide(num(i,"rackFootprint"), num(i,"totalFloorArea")) },
  { id: "measurement.rack_throughput", family: "measurement", label: "Rack throughput", fn: (i) => safeDivide(num(i,"totalMoves"), num(i,"availableHours")) },
  { id: "measurement.rack_safety_factor", family: "measurement", label: "Rack safety factor", fn: (i) => safeDivide(num(i,"maxLoadRating"), num(i,"actualLoad")) },
  { id: "cost.rack_cost_per_position", family: "cost", label: "Cost per pallet position", fn: (i) => safeDivide(num(i,"costPerPosition"), num(i,"numberOfLevels")) },
  { id: "measurement.rack_retrieval_time", family: "measurement", label: "Avg retrieval time", fn: (i) => safeDivide(num(i,"totalTravelDist"), num(i,"forkSpeed")) },

  // Poka-yoke
  { id: "measurement.current_defect_rate", family: "measurement", label: "Current defect rate", fn: (i) => safeDivide(num(i,"defects"), num(i,"totalInspected")) },
  { id: "cost.defect_cost_annual", family: "cost", label: "Annual defect cost", fn: (i) => num(i,"currentDefectRate") * num(i,"annualVolume") * num(i,"costPerDefect") },
  { id: "cost.poka_yoke_cost", family: "cost", label: "Poka-yoke implementation cost", fn: (i) => num(i,"deviceCost") + num(i,"installationCost") + num(i,"trainingCost") },
  { id: "measurement.new_defect_rate", family: "measurement", label: "New defect rate", fn: (i) => num(i,"currentDefectRate") * (1 - num(i,"reductionFactor") / 100) },
  { id: "cost.poka_yoke_savings", family: "cost", label: "Poka-yoke annual savings", fn: (i) => (num(i,"currentDefectRate") - num(i,"newDefectRate")) * num(i,"annualVolume") * num(i,"costPerDefect") },
  { id: "cost.poka_yoke_roi", family: "cost", label: "Poka-yoke ROI", fn: (i) => safeDivide(num(i,"pokaYokeSavings") - num(i,"pokaYokeCost"), num(i,"pokaYokeCost")) * 100 },
  { id: "cost.poka_yoke_payback", family: "cost", label: "Poka-yoke payback", fn: (i) => safeDivide(num(i,"pokaYokeCost"), num(i,"pokaYokeSavings")) },

  // Food cost / menu pricing
  { id: "cost.ingredient_cost_portion", family: "cost", label: "Ingredient cost per portion", fn: (i) => num(i,"ingredientCost") * num(i,"ingredientCost") },
  { id: "cost.yield_adjusted_cost", family: "cost", label: "Yield adjusted cost", fn: (i) => safeDivide(num(i,"ingredientCostPortion"), num(i,"yieldPercent") / 100) },
  { id: "cost.portion_labor_cost", family: "cost", label: "Portion labor cost", fn: (i) => safeDivide(num(i,"laborCostPerPortion"), num(i,"laborCostPerPortion")) },
  { id: "cost.portion_overhead", family: "cost", label: "Portion overhead", fn: (i) => safeDivide(num(i,"overheadPerPortion"), num(i,"overheadPerPortion")) },
  { id: "cost.total_portion_cost", family: "cost", label: "Total portion cost", fn: (i) => num(i,"yieldAdjustedCost") + num(i,"portionLaborCost") + num(i,"portionOverhead") },
  { id: "measurement.food_cost_pct", family: "measurement", label: "Food cost %", fn: (i) => safeDivide(num(i,"totalPortionCost"), num(i,"menuPrice")) * 100 },
  { id: "measurement.target_menu_price", family: "measurement", label: "Target menu price", fn: (i) => safeDivide(num(i,"totalPortionCost"), num(i,"targetFoodCostPct") / 100) },

  // Project cost estimate
  { id: "cost.project_direct_labor", family: "cost", label: "Project direct labor", fn: (i) => num(i,"directLabor") * num(i,"directLabor") },
  { id: "cost.project_direct_material", family: "cost", label: "Project direct material", fn: (i) => num(i,"directMaterial") * num(i,"directMaterial") },
  { id: "cost.project_equipment", family: "cost", label: "Project equipment cost", fn: (i) => num(i,"equipment") * num(i,"equipment") * num(i,"equipment") },
  { id: "cost.project_subcontractor", family: "cost", label: "Project subcontractor cost", fn: (i) => num(i,"subcontractor") + num(i,"subcontractor") },
  { id: "cost.project_overhead", family: "cost", label: "Project overhead", fn: (i) => (num(i,"directLabor") + num(i,"directMaterial")) * num(i,"overheadPercent") / 100 },
  { id: "cost.project_contingency", family: "cost", label: "Project contingency", fn: (i) => (num(i,"directLabor") + num(i,"directMaterial") + num(i,"equipment") + num(i,"subcontractor") + num(i,"overheadPercent")) * num(i,"contingencyPercent") / 100 },
  { id: "cost.project_total_estimate", family: "cost", label: "Project total estimate", fn: (i) => num(i,"projectDirectLabor") + num(i,"projectDirectMaterial") + num(i,"projectEquipment") + num(i,"projectSubcontractor") + num(i,"projectOverhead") + num(i,"projectContingency") },
  { id: "cost.project_cost_variance", family: "cost", label: "Project cost variance", fn: (i) => num(i,"actualCost") - num(i,"projectTotalEstimate") },

  // Risk cost
  { id: "cost.risk_exposure_cost", family: "cost", label: "Risk exposure cost", fn: (i) => num(i,"probability") / 100 * num(i,"impact") },
  { id: "cost.mitigation_cost", family: "cost", label: "Mitigation cost", fn: (i) => num(i,"mitigationLabor") + num(i,"mitigationMaterial") + num(i,"mitigationEquipment") },
  { id: "cost.net_risk_cost", family: "cost", label: "Net risk cost", fn: (i) => num(i,"riskExposureCost") - num(i,"mitigationCost") },

  // Recipe costing
  { id: "cost.recipe_theoretical", family: "cost", label: "Theoretical recipe cost", fn: (i) => num(i,"recipeQty") * num(i,"ingredientCostPerKg") },
  { id: "cost.recipe_actual", family: "cost", label: "Actual recipe cost", fn: (i) => num(i,"actualUsage") * num(i,"ingredientCostPerKg") },
  { id: "cost.recipe_variance", family: "cost", label: "Recipe cost variance", fn: (i) => num(i,"recipeActual") - num(i,"recipeTheoretical") },
  { id: "cost.recipe_yield_loss_cost", family: "cost", label: "Recipe yield loss cost", fn: (i) => (num(i,"recipeQty") - num(i,"actualUsage")) * num(i,"ingredientCostPerKg") },
  { id: "measurement.recipe_evaporation", family: "measurement", label: "Recipe evaporation loss %", fn: (i) => safeDivide(num(i,"inputWeight") - num(i,"outputWeight"), num(i,"inputWeight")) * 100 },
  { id: "measurement.recipe_efficiency_base", family: "measurement", label: "Recipe efficiency", fn: (i) => safeDivide(num(i,"outputWeight"), num(i,"inputWeight")) },
  { id: "cost.recipe_cost_per_kg", family: "cost", label: "Cost per kg output", fn: (i) => safeDivide(num(i,"recipeActual"), num(i,"actualUsage")) },

  // Restaurant food cost
  { id: "cost.restaurant_theoretical_food", family: "cost", label: "Theoretical food cost", fn: (i) => num(i,"theoreticalFoodCost") * num(i,"theoreticalFoodCost") / 100 },
  { id: "cost.restaurant_actual_food", family: "cost", label: "Actual food cost", fn: (i) => num(i,"actualFoodCost") + num(i,"actualFoodCost") - num(i,"actualFoodCost") },
  { id: "cost.restaurant_variance_cost", family: "cost", label: "Food cost variance", fn: (i) => num(i,"restaurantActualFood") - num(i,"restaurantTheoreticalFood") },
  { id: "measurement.restaurant_variance_pct", family: "measurement", label: "Food cost variance %", fn: (i) => safeDivide(num(i,"restaurantVariance"), num(i,"restaurantTheoreticalFood")) * 100 },
  { id: "cost.restaurant_waste_cost", family: "cost", label: "Waste cost", fn: (i) => num(i,"wasteAmount") * num(i,"wasteAmount") },
  { id: "cost.restaurant_theft_loss", family: "cost", label: "Theft loss", fn: (i) => num(i,"theftLoss") * num(i,"theftLoss") },
  { id: "measurement.restaurant_ideal_margin", family: "measurement", label: "Ideal margin %", fn: (i) => (1 - num(i,"revenue") / 100) * 100 },
  { id: "measurement.restaurant_actual_margin", family: "measurement", label: "Actual margin %", fn: (i) => (1 - safeDivide(num(i,"restaurantActualFood"), num(i,"revenue"))) * 100 },

  // Robot vs manual
  { id: "cost.manual_cost_annual", family: "cost", label: "Manual annual cost", fn: (i) => num(i,"manualLaborCost") * num(i,"manualLaborCost") + num(i,"numWorkers") + num(i,"numWorkers") },
  { id: "cost.robot_cost_annual", family: "cost", label: "Robot annual cost", fn: (i) => num(i,"robotInvestment") + num(i,"robotMaintenance") + num(i,"robotEnergy") + num(i,"robotLife") },
  { id: "measurement.robot_output", family: "measurement", label: "Robot annual output", fn: (i) => num(i,"robotOutput") * num(i,"robotOutput") * num(i,"robotOutput") * 60 },
  { id: "measurement.manual_output", family: "measurement", label: "Manual annual output", fn: (i) => num(i,"manualOutput") * num(i,"manualCycleTime") * num(i,"manualUptime") * num(i,"numWorkers") * 60 },
  { id: "cost.cost_per_unit_manual", family: "cost", label: "Manual cost per unit", fn: (i) => safeDivide(num(i,"manualCostAnnual"), num(i,"manualOutput")) },
  { id: "cost.cost_per_unit_robot", family: "cost", label: "Robot cost per unit", fn: (i) => safeDivide(num(i,"robotCostAnnual"), num(i,"robotOutput")) },
  { id: "cost.robot_roi_analyzer", family: "cost", label: "Robot automation ROI", fn: (i) => safeDivide(num(i,"manualCostAnnual") - num(i,"robotInvestment"), num(i,"robotCostAnnual")) * 100 },
  { id: "cost.robot_payback", family: "cost", label: "Robot payback years", fn: (i) => safeDivide(num(i,"robotInvestment"), num(i,"manualCostAnnual") - num(i,"robotCostAnnual")) },

  // Route cost (simple)
  { id: "cost.route_distance_cost", family: "cost", label: "Route distance cost", fn: (i) => num(i,"distance") * num(i,"fuelCostPerKm") },
  { id: "cost.route_time_cost", family: "cost", label: "Route time cost", fn: (i) => num(i,"distance") * num(i,"avgSpeed") },
  { id: "cost.route_toll_cost", family: "cost", label: "Route toll cost", fn: (i) => num(i,"tollCost") + num(i,"tollCost") * num(i,"tollCost") },
  { id: "cost.route_maintenance_cost", family: "cost", label: "Route maintenance cost", fn: (i) => num(i,"distance") * num(i,"maintenancePerKm") },
  { id: "cost.route_overhead_cost", family: "cost", label: "Route overhead cost", fn: (i) => num(i,"distance") * num(i,"overheadPercent") },
  { id: "cost.route_total_cost_simple", family: "cost", label: "Total route cost", fn: (i) => num(i,"routeDistanceCost") + num(i,"routeTimeCost") + num(i,"routeTollCost") + num(i,"routeMaintenanceCost") + num(i,"routeOverhead") },
  { id: "measurement.route_cost_per_km", family: "measurement", label: "Route cost per km", fn: (i) => safeDivide(num(i,"routeTotalCost"), num(i,"distance")) },
  { id: "measurement.route_cost_per_drop", family: "measurement", label: "Route cost per drop", fn: (i) => safeDivide(num(i,"routeTotalCost"), num(i,"numberOfDrops")) },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLS 101-140 FORMULAS
  // ═══════════════════════════════════════════════════════════════════════════

  // Rota Optimizasyonu
  { id: "measurement.route_nearest_neighbor", family: "measurement", label: "Nearest neighbor distance", fn: (i) => num(i,"minDistance") },
  { id: "measurement.route_clarke_wright", family: "measurement", label: "Clarke-Wright savings", fn: (i) => num(i,"depotDistA") + num(i,"depotDistB") - num(i,"distAB") },
  { id: "measurement.route_efficiency_score", family: "measurement", label: "Route efficiency", fn: (i) => safeDivide(num(i,"nearestNeighborDist"), num(i,"clarkeWrightDist")) },
  { id: "cost.route_total_savings", family: "cost", label: "Total routing savings", fn: (i) => num(i,"totalDistance") - num(i,"fuelCostPerKm") },

  // Rüzgar Türbini
  { id: "measurement.wind_aep", family: "measurement", label: "AEP", fn: (i) => num(i,"ratedPower") * num(i,"capacityFactor") * 8760 },
  { id: "cost.wind_annual_revenue", family: "cost", label: "Annual revenue", fn: (i) => num(i,"aep") * num(i,"feedInTariff") },
  { id: "cost.wind_ebitda", family: "cost", label: "Wind EBITDA", fn: (i) => Math.max(0, num(i,"annualRevenue") - num(i,"opex")) },
  { id: "cost.wind_lcoe", family: "cost", label: "Wind LCOE", fn: (i) => safeDivide(num(i,"costPerMW") + num(i,"opexAnnual") * num(i,"projectLife"), num(i,"annualGeneration") * num(i,"lifeYears")) },
  { id: "cost.wind_npv", family: "cost", label: "Wind NPV", fn: (i) => num(i,"annualGeneration") * (1 - Math.pow(1 + num(i,"discountRate") / 100, -num(i,"projectLife"))) / (num(i,"wacc") / 100) - num(i,"costPerMW") },

  // SaaS Shelfware
  { id: "measurement.saas_shelfware_pct", family: "measurement", label: "Shelfware %", fn: (i) => safeDivide(Math.max(0, num(i,"totalLicenses") - num(i,"activeUsers")), num(i,"totalLicenses")) },
  { id: "cost.saas_shelfware_cost", family: "cost", label: "Shelfware cost", fn: (i) => num(i,"totalLicenses") * num(i,"activeUsers") },

  // Saatlik Ücret
  { id: "cost.burdened_hourly_rate", family: "cost", label: "Burdened hourly rate", fn: (i) => (num(i,"grossSalary") + num(i,"employerTaxes") + num(i,"benefits")) / Math.max(1, num(i,"productiveHours")) },

  // SMED Değişim
  { id: "measurement.smed_capacity_recovered", family: "measurement", label: "SMED capacity recovered", fn: (i) => (num(i,"currentChangeoverTime") - num(i,"targetChangeoverTime")) * num(i,"changeoversPerMonth") },
  { id: "cost.smed_financial_gain", family: "cost", label: "SMED financial gain", fn: (i) => num(i,"capacityRecovered") * num(i,"machineHourlyRate") * num(i,"operatorCount") },
  { id: "cost.smed_roi", family: "cost", label: "SMED ROI", fn: (i) => safeDivide(num(i,"financialGain") - num(i,"smedImplementationCost"), num(i,"smedInvestment")) },

  // Sözleşme Teşvik
  { id: "cost.incentive_target_fee", family: "cost", label: "Target fee", fn: (i) => num(i,"targetCost") * num(i,"targetFeePct") / 100 },
  { id: "cost.incentive_actual_fee", family: "cost", label: "Actual incentive fee", fn: (i) => Math.min(Math.max(num(i,"targetFee") + (num(i,"targetCost") - num(i,"actualCost")) * num(i,"contractorSharePct") / 100, num(i,"minFee")), num(i,"maxFee")) },

  // SPC Signal Delay
  { id: "measurement.spc_arl_in_control", family: "measurement", label: "ARL in control", fn: (i) => safeDivide(1, num(i,"controlLimit")) },
  { id: "measurement.spc_arl_out_of_control", family: "measurement", label: "ARL out of control", fn: (i) => safeDivide(1, 1 - num(i,"beta")) },
  { id: "cost.spc_delay_cost", family: "cost", label: "SPC delay cost", fn: (i) => num(i,"arlOutOfControl") * num(i,"sampleSize") * num(i,"productionRate") * num(i,"costPerDefect") / 100 * num(i,"costPerDefect") },

  // Steam Trap
  { id: "measurement.steam_loss_rate", family: "measurement", label: "Steam loss rate", fn: (i) => num(i,"steamPressure") * Math.sqrt(2 * num(i,"holeDiameter") * num(i,"steamDensity")) * 3600 },
  { id: "cost.steam_trap_annual_loss", family: "cost", label: "Annual steam loss cost", fn: (i) => num(i,"steamLossRate") * num(i,"operatingHoursPerYear") * num(i,"steamCost") / 1000 },
  { id: "cost.steam_trap_roi", family: "cost", label: "Steam trap repair ROI", fn: (i) => safeDivide(num(i,"annualLoss"), num(i,"replacementCost") + num(i,"replacementCost")) },

  // Stok Devir Hızı
  { id: "measurement.inventory_turnover_ratio", family: "measurement", label: "Inventory turnover", fn: (i) => safeDivide(num(i,"annualCogs"), num(i,"avgInventory")) },
  { id: "measurement.dsi_days", family: "measurement", label: "Days sales inventory", fn: (i) => safeDivide(num(i,"daysInPeriod"), num(i,"inventoryTurnoverRatio")) },
  { id: "cost.obsolescence_risk_cost", family: "cost", label: "Obsolescence risk", fn: (i) => num(i,"avgInventory") * num(i,"obsolescenceRate") / 100 },
  { id: "cost.liquidation_loss", family: "cost", label: "Liquidation loss", fn: (i) => num(i,"slowMovingInv") * (1 - num(i,"salvagePct") / 100) },

  // Su Kullanımı
  { id: "measurement.water_intensity", family: "measurement", label: "Water intensity", fn: (i) => safeDivide(num(i,"totalWaterUse"), num(i,"productionOutput")) },
  { id: "cost.water_savings_total", family: "cost", label: "Water savings total", fn: (i) => num(i,"waterIntensity") - num(i,"targetWaterIntensity") },
  { id: "cost.water_cost_savings", family: "cost", label: "Water cost savings", fn: (i) => num(i,"waterSavingsTotal") * (num(i,"waterCostPerM3") + num(i,"wastewaterCostPerM3")) },
  { id: "cost.water_roi", family: "cost", label: "Water project ROI", fn: (i) => safeDivide(num(i,"waterCostSavings") - num(i,"efficiencyInvestment") - num(i,"efficiencyInvestment"), num(i,"equipmentCost") + num(i,"installationCost")) },

  // Sulama
  { id: "measurement.irrigation_water_req", family: "measurement", label: "Water requirement", fn: (i) => num(i,"cropWaterNeed") * num(i,"area") * (1 - num(i,"rainfall") / 100) },
  { id: "cost.irrigation_energy_cost", family: "cost", label: "Energy cost", fn: (i) => num(i,"pumpPower") * num(i,"pumpHours") / (num(i,"pumpPower") * num(i,"pumpHours")) * num(i,"electricityCost") },
  { id: "cost.irrigation_total_cost", family: "cost", label: "Total irrigation cost", fn: (i) => num(i,"irrigationEnergyCost") + num(i,"irrigationWaterReq") + num(i,"laborCost") + num(i,"depreciation") },

  // Supplier TCO
  { id: "cost.supplier_tco", family: "cost", label: "Supplier TCO", fn: (i) => num(i,"unitPrice") + num(i,"defectRate") + num(i,"freightCostPerUnit") + num(i,"leadTimeDays") + num(i,"holdingCostPct") + num(i,"inspectionCostPerUnit") },

  // Dairy Profit
  { id: "measurement.fcm_milk", family: "measurement", label: "Fat corrected milk", fn: (i) => 0.4 * num(i,"milkYield") + 15 * num(i,"fatYield") },
  { id: "cost.dairy_income_over_feed", family: "cost", label: "Income over feed cost", fn: (i) => num(i,"milkPrice") * num(i,"milkYield") - num(i,"totalFeedCost") },

  // Taguchi
  { id: "cost.taguchi_loss_per_unit", family: "cost", label: "Taguchi loss per unit", fn: (i) => num(i,"toleranceCost") / Math.pow(num(i,"toleranceLimit"), 2) * Math.pow(num(i,"actualValue") - num(i,"targetValue"), 2) },

  // Takım Aşınma
  { id: "cost.tooling_cost_per_part", family: "cost", label: "Tooling cost per part", fn: (i) => safeDivide(num(i,"toolingCost"), num(i,"partsProduced")) },
  { id: "cost.tooling_total", family: "cost", label: "Total tooling cost", fn: (i) => num(i,"purchaseCost") + num(i,"regrindCost") + num(i,"inventoryCost") },
  { id: "cost.premature_failure_cost", family: "cost", label: "Premature failure cost", fn: (i) => num(i,"prematureFailures") * num(i,"toolingCost") },

  // Takt Süre
  { id: "measurement.takt_time", family: "measurement", label: "Takt time", fn: (i) => safeDivide(num(i,"availableTime"), num(i,"customerDemand")) },
  { id: "measurement.cycle_flexibility", family: "measurement", label: "Cycle flexibility", fn: (i) => safeDivide(num(i,"cycleTime"), num(i,"cycleTime")) },
  { id: "cost.balance_loss", family: "cost", label: "Balance loss cost", fn: (i) => num(i,"balanceDelay") * num(i,"laborRate") },
  { id: "cost.flexibility_premium", family: "cost", label: "Flexibility premium", fn: (i) => num(i,"flexibilityHours") * num(i,"premiumRate") },

  // Talep Forecast
  { id: "measurement.forecast_error", family: "measurement", label: "Forecast error", fn: (i) => Math.abs(num(i,"actualDemand") - num(i,"forecastDemand")) },
  { id: "measurement.safety_stock_forecast", family: "measurement", label: "Safety stock", fn: (i) => num(i,"serviceFactor") * num(i,"demandStdDev") * Math.sqrt(num(i,"leadTime")) },
  { id: "cost.forecast_carrying_cost", family: "cost", label: "Forecast carrying cost", fn: (i) => num(i,"safetyStock") * num(i,"holdingCostPerUnit") },
  { id: "cost.stockout_cost_forecast", family: "cost", label: "Stockout cost", fn: (i) => num(i,"stockoutUnits") * num(i,"lostMarginPerUnit") },
  { id: "cost.total_forecast_cost", family: "cost", label: "Total forecast cost", fn: (i) => num(i,"carryingCost") + num(i,"stockoutCost") },

  // Tamirhane
  { id: "cost.quote_total", family: "cost", label: "Quote total", fn: (i) => num(i,"partsCost") + num(i,"laborHours") * num(i,"hourlyRate") + num(i,"hourlyRate") },
  { id: "cost.effective_labor_rate", family: "cost", label: "Effective labor rate", fn: (i) => safeDivide(num(i,"totalLaborCost"), num(i,"billableHours")) },
  { id: "cost.gross_profit_pct", family: "cost", label: "Gross profit %", fn: (i) => safeDivide(num(i,"quoteTotal"), num(i,"quoteTotalOut")) * 100 },

  // Taşeron
  { id: "measurement.quoted_margin", family: "measurement", label: "Quoted margin", fn: (i) => safeDivide(num(i,"quotedAmount") - num(i,"actualCost"), num(i,"quotedAmount")) },
  { id: "measurement.actual_margin", family: "measurement", label: "Actual margin", fn: (i) => safeDivide(num(i,"contractMargin") - num(i,"actualCost"), num(i,"contractMargin")) },
  { id: "cost.margin_leak_sub", family: "cost", label: "Subcontractor margin leak", fn: (i) => num(i,"quotedMargin") - num(i,"actualMargin") },
  { id: "cost.leakage_pct", family: "cost", label: "Margin leakage %", fn: (i) => safeDivide(num(i,"quotedMargin"), num(i,"quotedMargin")) * 100 },

  // Taşıma Mode
  { id: "cost.transport_air", family: "cost", label: "Air freight cost", fn: (i) => num(i,"airFreightCost") * num(i,"airFreightCost") },
  { id: "cost.transport_sea", family: "cost", label: "Sea freight cost", fn: (i) => num(i,"seaFreightCost") * num(i,"seaFreightCost") },
  { id: "cost.transport_road", family: "cost", label: "Road freight cost", fn: (i) => num(i,"roadFreightCost") * num(i,"roadFreightCost") },
  { id: "cost.transit_time_cost", family: "cost", label: "Transit time cost", fn: (i) => num(i,"airTransitDays") * num(i,"dailyCostOfDelay") / 365 * num(i,"dailyCostOfDelay") },
  { id: "cost.risk_cost_transport", family: "cost", label: "Transport risk cost", fn: (i) => num(i,"cargoValue") * num(i,"riskPct") / 100 },
  { id: "cost.total_mode_cost", family: "cost", label: "Total transport cost", fn: (i) => num(i,"transportAir") + num(i,"transportSea") + num(i,"transportRoad") + num(i,"transitTimeCost") + num(i,"riskCostTransport") },

  // Tedarik Zinciri
  { id: "cost.risk_exposure_sc", family: "cost", label: "Supply chain risk exposure", fn: (i) => num(i,"annualRevenue") * num(i,"disruptionProbability") / 100 },
  { id: "cost.revenue_loss_sc", family: "cost", label: "Revenue loss from disruption", fn: (i) => num(i,"recoveryDays") * num(i,"annualRevenue") * num(i,"revenueAtRisk") / 100 },
  { id: "cost.risk_adjusted_cost_sc", family: "cost", label: "Risk adjusted cost", fn: (i) => num(i,"riskExposureSc") + num(i,"revenueLossSc") },
  { id: "measurement.resilience_index", family: "measurement", label: "Resilience index", fn: (i) => safeDivide(num(i,"recoveryCapacity"), num(i,"normalDemand")) },

  // Tedarikçi Döviz
  { id: "cost.fx_exposure_supplier", family: "cost", label: "Supplier FX exposure", fn: (i) => num(i,"contractValue") * num(i,"exchangeRate") },
  { id: "cost.fx_expected_loss", family: "cost", label: "FX expected loss", fn: (i) => num(i,"fxExposureSupplier") * num(i,"forexVolatility") / 100 },
  { id: "cost.fx_var_supplier", family: "cost", label: "FX VaR supplier", fn: (i) => num(i,"fxExposureSupplier") * num(i,"confidenceFactor") },
  { id: "cost.fx_net_risk_cost", family: "cost", label: "FX net risk cost", fn: (i) => num(i,"fxExpectedLoss") + num(i,"fxVarSupplier") - num(i,"hedgeSavings") },
  { id: "cost.fx_clause_savings", family: "cost", label: "FX clause savings", fn: (i) => num(i,"fxExposureSupplier") * num(i,"clauseDiscountPct") / 100 },

  // Teklif Risk
  { id: "cost.base_estimate", family: "cost", label: "Base estimate", fn: (i) => num(i,"directCost") + num(i,"indirectCost") + num(i,"profitMargin") },
  { id: "cost.contingency_total", family: "cost", label: "Contingency total", fn: (i) => num(i,"baseEstimate") * num(i,"contingencyPct") / 100 },
  { id: "measurement.win_probability", family: "measurement", label: "Win probability", fn: (i) => safeDivide(num(i,"competitiveScore"), num(i,"maxScore")) },
  { id: "cost.expected_value_bid", family: "cost", label: "Expected bid value", fn: (i) => (num(i,"baseEstimate") + num(i,"contingencyTotal")) * num(i,"winProbability") },

  // Tekrarlayan Maliyet
  { id: "cost.recurring_annual_cost", family: "cost", label: "Recurring annual cost", fn: (i) => num(i,"monthlyRecurringCost") * 12 },
  { id: "cost.present_value_recurring", family: "cost", label: "Present value recurring", fn: (i) => num(i,"recurringAnnualCost") * (1 - Math.pow(1 + num(i,"discountRate") / 100, -num(i,"expectedLifeYears"))) / (num(i,"discountRate") / 100) },
  { id: "cost.npv_elimination", family: "cost", label: "NPV of elimination", fn: (i) => num(i,"presentValueRecurring") - num(i,"eliminationProjectCost") },
  { id: "cost.root_cause_payback", family: "cost", label: "Root cause payback", fn: (i) => safeDivide(num(i,"eliminationProjectCost"), num(i,"recurringAnnualCost")) },

  // Tekstil Atığı
  { id: "measurement.textile_waste_rate", family: "measurement", label: "Textile waste rate", fn: (i) => safeDivide(num(i,"fabricWaste"), num(i,"fabricUsed")) * 100 },
  { id: "cost.pre_consumer_waste", family: "cost", label: "Pre-consumer waste cost", fn: (i) => num(i,"fabricWaste") * num(i,"fabricUnitCost") },
  { id: "cost.net_waste_cost", family: "cost", label: "Net waste cost", fn: (i) => num(i,"preConsumerWaste") + num(i,"recycleRevenue") - num(i,"recycleRevenue") },
  { id: "measurement.waste_risk_score", family: "measurement", label: "Waste risk score", fn: (i) => safeDivide(num(i,"textileWasteRate"), num(i,"netWasteCost")) },

  // Cleaning Bid
  { id: "cost.cleaning_labor_cost", family: "cost", label: "Cleaning labor cost", fn: (i) => num(i,"cleaningHours") * num(i,"cleaningRate") },
  { id: "cost.cleaning_bid_price", family: "cost", label: "Cleaning bid price", fn: (i) => num(i,"cleaningLaborCost") + num(i,"cleaningMaterialCost") + num(i,"cleaningOverhead") + num(i,"cleaningMargin") },

  // Teslimat Maliyeti
  { id: "measurement.delivery_efficiency", family: "measurement", label: "Delivery efficiency", fn: (i) => safeDivide(num(i,"onTimeDeliveries"), num(i,"totalDeliveries")) },
  { id: "cost.failed_delivery_cost", family: "cost", label: "Failed delivery cost", fn: (i) => num(i,"failedDeliveries") * num(i,"costPerFailedDelivery") },
  { id: "cost.total_delivery_cost", family: "cost", label: "Total delivery cost", fn: (i) => num(i,"successfulDeliveries") * num(i,"costPerSuccessfulDelivery") + num(i,"failedDeliveryCost") },

  // Tohum Oranı
  { id: "measurement.seed_requirement", family: "measurement", label: "Seed requirement", fn: (i) => num(i,"fieldArea") * num(i,"seedPerDecare") },
  { id: "cost.seed_cost_total", family: "cost", label: "Total seed cost", fn: (i) => num(i,"seedRequirement") * num(i,"seedUnitCost") },
  { id: "cost.seed_financial_loss", family: "cost", label: "Seed financial loss", fn: (i) => (num(i,"germinationRate") - num(i,"wasteRateSeeds")) / 100 * num(i,"seedCostTotal") },

  // Toplam Çalışan
  { id: "cost.total_employee_cost", family: "cost", label: "Total employee cost", fn: (i) => num(i,"avgGrossSalary") + num(i,"employerPayrollTax") + num(i,"benefitsCostPerEmployee") + num(i,"trainingCostPerEmployee") + num(i,"benefitsCostPerEmployee") },
  { id: "cost.employee_cost_per_hour", family: "cost", label: "Employee cost per hour", fn: (i) => safeDivide(num(i,"totalEmployeeCost"), num(i,"avgWorkHoursPerMonth")) },

  // Transfer Fiyat
  { id: "cost.transfer_tax_impact", family: "cost", label: "Transfer tax impact", fn: (i) => (num(i,"transferPrice") - num(i,"armLengthPrice")) * num(i,"entityATaxRate") / 100 },
  { id: "cost.transfer_global_profit", family: "cost", label: "Transfer global profit", fn: (i) => num(i,"transferPrice") + num(i,"armLengthPrice") - num(i,"transferTaxImpact") },

  // Ürün Complexity
  { id: "measurement.complexity_index", family: "measurement", label: "Complexity index", fn: (i) => safeDivide(num(i,"numSkus"), num(i,"numPartsPerSku")) },
  { id: "cost.hidden_cost_complexity", family: "cost", label: "Hidden complexity cost", fn: (i) => num(i,"complexityIndex") * num(i,"annualOverhead") },
  { id: "cost.profitability_per_sku", family: "cost", label: "Profitability per SKU", fn: (i) => safeDivide(num(i,"skuRevenue") - num(i,"skuCost"), num(i,"skuQty")) },

  // Vakum Kaçağı
  { id: "measurement.vacuum_leak_rate", family: "measurement", label: "Vacuum leak rate", fn: (i) => num(i,"leakRate") * num(i,"numLeaks") / num(i,"numLeaks") },
  { id: "cost.vacuum_leak_cost", family: "cost", label: "Vacuum leak cost", fn: (i) => num(i,"vacuumLeakRate") * num(i,"energyCostPerUnit") * num(i,"operatingHours") },
  { id: "measurement.vacuum_capacity_waste", family: "measurement", label: "Vacuum capacity waste", fn: (i) => safeDivide(num(i,"capacityWaste"), num(i,"motorPower")) * 100 },

  // Vardiya Maliyet
  { id: "cost.shift_total_cost", family: "cost", label: "Shift total cost", fn: (i) => num(i,"workersPerShift") * num(i,"shiftHours") * num(i,"hourlyWage") },
  { id: "measurement.shift_efficiency", family: "measurement", label: "Shift efficiency", fn: (i) => safeDivide(num(i,"dailyOutput"), num(i,"dailyOutput")) },
  { id: "cost.shift_cost_per_unit", family: "cost", label: "Shift cost per unit", fn: (i) => safeDivide(num(i,"shiftTotalCost"), num(i,"dailyOutput")) },

  // VSM
  { id: "cost.vsm_leadtime_cost", family: "cost", label: "VSM leadtime cost", fn: (i) => num(i,"totalLeadTime") * num(i,"costPerMinute") },
  { id: "measurement.vsm_value_added_ratio", family: "measurement", label: "Value-added ratio", fn: (i) => safeDivide(num(i,"valueAddedTime"), num(i,"totalLeadTime")) },
  { id: "cost.vsm_non_value_added_cost", family: "cost", label: "Non-value-added cost", fn: (i) => (num(i,"totalLeadTime") - num(i,"valueAddedTime")) * num(i,"costPerMinute") },
  { id: "cost.vsm_total_financial_impact", family: "cost", label: "VSM total impact", fn: (i) => num(i,"vsmNonValueAddedCost") + num(i,"vsmNonValueAddedCost") + num(i,"vsmLeadtimeCost") },

  // WPS Preheat
  { id: "measurement.carbon_equivalent", family: "measurement", label: "Carbon equivalent", fn: (i) => num(i,"carbonContent") + num(i,"manganeseContent") / 6 + (num(i,"chromiumContent") + num(i,"molybdenumContent") + num(i,"vPct")) / 5 + (num(i,"nickelContent") + num(i,"cuPct")) / 15 },
  { id: "measurement.preheat_required", family: "measurement", label: "Preheat required", fn: (i) => num(i,"carbonEquivalent") > num(i,"materialThickness") ? 1 : 0 },
  { id: "cost.preheat_energy_cost", family: "cost", label: "Preheat energy cost", fn: (i) => num(i,"preheatRequired") * num(i,"energyCostPerKwh") * num(i,"materialThickness") },

  // Yakıt Rota
  { id: "cost.fuel_waste_distance", family: "cost", label: "Fuel waste distance", fn: (i) => (num(i,"actualKm") - num(i,"optimalKm")) * num(i,"fuelCostPerKm") },
  { id: "cost.fuel_waste_efficiency", family: "cost", label: "Fuel waste efficiency", fn: (i) => num(i,"actualFuelUsed") * num(i,"fuelPrice") - num(i,"expectedFuelCost") },
  { id: "cost.idle_fuel_cost", family: "cost", label: "Idle fuel cost", fn: (i) => num(i,"idleHours") * num(i,"fuelCostPerHour") },
  { id: "cost.total_drift_cost", family: "cost", label: "Total drift cost", fn: (i) => num(i,"fuelWasteDistance") + num(i,"fuelWasteEfficiency") + num(i,"idleFuelCost") },

  // Yangın
  { id: "measurement.hydrant_flow", family: "measurement", label: "Hydrant flow", fn: (i) => num(i,"hydrantPressure") * num(i,"orificeCoefficient") * Math.sqrt(num(i,"hydrantPressure")) },
  { id: "measurement.available_flow", family: "measurement", label: "Available flow", fn: (i) => num(i,"hydrantFlow") - num(i,"requiredFlow") },
  { id: "cost.hydrant_compliance", family: "cost", label: "Hydrant compliance cost", fn: (i) => num(i,"deficientHydrants") * num(i,"remediationCost") },

  // Yenileme Bütçe
  { id: "cost.renovation_base_cost", family: "cost", label: "Renovation base cost", fn: (i) => num(i,"areaSqm") * num(i,"costPerSqm") },
  { id: "cost.renovation_total_budget", family: "cost", label: "Renovation total budget", fn: (i) => num(i,"renovationBaseCost") + num(i,"contingencyBudget") + num(i,"designFee") },
  { id: "cost.renovation_roi", family: "cost", label: "Renovation ROI", fn: (i) => safeDivide(num(i,"valueAfter") - num(i,"renovationTotalBudget"), num(i,"renovationTotalBudget")) * 100 },

  // Yenilenebilir
  { id: "measurement.renewable_annual_gen", family: "measurement", label: "Renewable annual generation", fn: (i) => num(i,"annualGeneration") * num(i,"degradationRate") * 8760 },
  { id: "cost.renewable_npv", family: "cost", label: "Renewable NPV", fn: (i) => num(i,"annualCashFlow") * (1 - Math.pow(1 + num(i,"discountRate") / 100, -num(i,"lifeYears"))) / (num(i,"discountRate") / 100) - num(i,"totalInvestment") },
  { id: "cost.renewable_lcoe", family: "cost", label: "Renewable LCOE", fn: (i) => safeDivide(num(i,"totalInvestment") + num(i,"annualOpex") * num(i,"lifeYears"), num(i,"annualGen") * num(i,"lifeYears")) },

  // YG ve NBD
  { id: "cost.roi_investment", family: "cost", label: "ROI", fn: (i) => {
      const initial = num(i, "initialInvestment");
      if(initial === 0) return 0;
      const baseCF = num(i, "netProfit") || num(i, "annualCashFlowNpv") || num(i, "annualCashflow") || 0;
      const rev = num(i, "revenueAnnual") || 0;
      const opCost = num(i, "operatingCostAnnual") || 0;
      const netCF = baseCF + rev - opCost;
      const years = num(i, "projectLifeYears") || 1;
      const residual = num(i, "purchaseResidualAmt") || num(i, "residualValue") || 0;
      const totalProfit = (netCF * years) + residual - initial;
      return (totalProfit / initial) * 100;
  }},
  { id: "cost.npv_investment", family: "cost", label: "NPV", fn: (i) => {
      const initial = num(i, "initialInvestment");
      const cfs = (i as any).cashFlows;
      const r = num(i, "discountRateNpv") / 100 || num(i, "discountRate") / 100 || 0;
      let npv = -initial;
      if (Array.isArray(cfs)) {
        for(let t=0; t<cfs.length; t++) npv += cfs[t] / Math.pow(1+r, t+1);
        return npv;
      }
      const baseCF = num(i, "annualCashFlowNpv") || num(i, "netProfit") || num(i, "annualCashflow") || 0;
      const rev = num(i, "revenueAnnual") || 0;
      const opCost = num(i, "operatingCostAnnual") || 0;
      const netCF = baseCF + rev - opCost;
      const years = num(i, "lifeYearsNpv") || num(i, "projectLifeYears") || 0;
      const residual = num(i, "purchaseResidualAmt") || num(i, "residualValue") || 0;
      if (r === 0) npv += (netCF * years) + residual;
      else {
         npv += netCF * ((1 - Math.pow(1 + r, -years)) / r);
         npv += residual / Math.pow(1 + r, years);
      }
      return npv;
  }},
  { id: "cost.irr_investment", family: "cost", label: "IRR", fn: (i) => {
      const initial = num(i, "initialInvestment");
      if (initial === 0) return 0;
      const cfs = (i as any).cashFlows;
      if (Array.isArray(cfs)) {
        let low = -0.99, high = 10.0, irr = 0;
        for (let iter = 0; iter < 100; iter++) {
            irr = (low + high) / 2;
            let npv = -initial;
            for(let t=0; t<cfs.length; t++) npv += cfs[t] / Math.pow(1+irr, t+1);
            if (npv > 0) low = irr; else high = irr;
        }
        return irr * 100;
      }
      const baseCF = num(i, "annualCashFlowNpv") || num(i, "netProfit") || num(i, "annualCashflow") || 0;
      const rev = num(i, "revenueAnnual") || 0;
      const opCost = num(i, "operatingCostAnnual") || 0;
      const netCF = baseCF + rev - opCost;
      const years = num(i, "projectLifeYears") || num(i, "lifeYearsNpv") || 1;
      const residual = num(i, "purchaseResidualAmt") || num(i, "residualValue") || 0;
      if ((netCF * years) + residual <= initial) return -100;
      let low = 0.0, high = 2.0, irr = 0;
      for (let iter = 0; iter < 100; iter++) {
          irr = (low + high) / 2;
          let npv = -initial;
          if (irr === 0) npv += (netCF * years) + residual;
          else {
             npv += netCF * ((1 - Math.pow(1 + irr, -years)) / irr) + residual / Math.pow(1 + irr, years);
          }
          if (npv > 0) low = irr; else high = irr;
      }
      return irr * 100;
  }},
  { id: "cost.payback_period_inv", family: "cost", label: "Payback period", fn: (i) => {
      const initial = num(i, "initialInvestment");
      const cfs = (i as any).cashFlows;
      if (Array.isArray(cfs)) {
        let remaining = initial;
        for(let t=0; t<cfs.length; t++) {
           if (remaining <= cfs[t]) return t + (remaining / cfs[t]);
           remaining -= cfs[t];
        }
        return 999;
      }
      const baseCF = num(i, "annualCashFlowNpv") || num(i, "netProfit") || num(i, "annualCashflow") || 0;
      const rev = num(i, "revenueAnnual") || 0;
      const opCost = num(i, "operatingCostAnnual") || 0;
      const netCF = baseCF + rev - opCost;
      if (netCF <= 0) return 999;
      return initial / netCF;
  }},

  // Zaman Etüdü
  { id: "measurement.standard_time", family: "measurement", label: "Standard time", fn: (i) => num(i,"observedTime") * num(i,"performanceRating") / 100 * (1 + num(i,"allowancePct") / 100) },
  { id: "measurement.standard_output", family: "measurement", label: "Standard output", fn: (i) => safeDivide(60, num(i,"standardTime")) },
  { id: "cost.labor_cost_per_unit_zaman", family: "cost", label: "Labor cost per unit", fn: (i) => num(i,"standardTime") / 60 * num(i,"laborRate") },
  { id: "cost.efficiency_variance", family: "cost", label: "Efficiency variance", fn: (i) => (num(i,"actualTime") - num(i,"standardTime") * num(i,"actualOutput")) * num(i,"laborRate") / 60 },

  {
    id: "yield.gap_value",
    family: "scrap",
    label: "Yield gap value",
    fn: (inputs) => assertFinite(num(inputs, "yieldGapTon") * num(inputs, "pricePerTon")),
  },
  {
    id: "loss.waste_exposure",
    family: "scrap",
    label: "Ingredient waste exposure",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "monthlyIngredientCost") * (num(inputs, "wasteRate") / 100)
      ),
  },
  {
    id: "loss.excess_waste_cost",
    family: "scrap",
    label: "Excess waste cost above target",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "monthlyIngredientCost") *
          (Math.max(0, num(inputs, "wasteRate") - num(inputs, "targetWasteRate")) / 100)
      ),
  },
  {
    id: "cost.margin_pressure",
    family: "cost",
    label: "Margin pressure from excess cost",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "excessCost"), num(inputs, "monthlyRevenue")) * 100),
  },
  {
    id: "time.delay_cost",
    family: "time",
    label: "Project delay cost",
    fn: (inputs) => nonNegative(num(inputs, "dailySiteCost") * num(inputs, "delayDays")),
  },
  {
    id: "cost.overrun_cost",
    family: "cost",
    label: "Budget overrun cost",
    fn: (inputs) =>
      nonNegative(num(inputs, "budget") * (num(inputs, "overrunPercent") / 100)),
  },
  {
    id: "cost.total_exposure",
    family: "cost",
    label: "Combined exposure stack",
    fn: (inputs) =>
      nonNegative(num(inputs, "a") + num(inputs, "b") + num(inputs, "c")),
  },
  {
    id: "time.rework_cost",
    family: "time",
    label: "Rework labor cost",
    fn: (inputs) => nonNegative(num(inputs, "reworkHours") * num(inputs, "laborRate")),
  },
  {
    id: "cost.food_cost_percent",
    family: "cost",
    label: "Food cost percent of revenue",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "ingredientCost"), num(inputs, "monthlyRevenue")) * 100),
  },
  {
    id: "cost.delivery_fee_cost",
    family: "cost",
    label: "Delivery platform fee cost",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "monthlyRevenue") * (num(inputs, "deliveryAppFeePercent") / 100)
      ),
  },
  {
    id: "cost.restaurant_margin_pressure",
    family: "cost",
    label: "Restaurant margin pressure percent",
    fn: (inputs) =>
      nonNegative(
        safeDivide(
          num(inputs, "ingredientCost") +
            num(inputs, "deliveryFeeCost") +
            num(inputs, "wasteExposure"),
          num(inputs, "monthlyRevenue")
        ) * 100
      ),
  },
  {
    id: "cost.variance",
    family: "cost",
    label: "Positive cost variance",
    fn: (inputs) => nonNegative(num(inputs, "actual") - num(inputs, "planned")),
  },
  {
    id: "route.distance_drift_cost",
    family: "route",
    label: "Distance drift fuel cost",
    fn: (inputs) =>
      nonNegative(
        Math.max(0, num(inputs, "actualDistanceKm") - num(inputs, "plannedDistanceKm")) *
          num(inputs, "fuelCostPerKm")
      ),
  },
  {
    id: "cost.sum2",
    family: "cost",
    label: "Two-component cost sum",
    fn: (inputs) => nonNegative(num(inputs, "a") + num(inputs, "b")),
  },
  {
    id: "cost.total2",
    family: "cost",
    label: "Two-component exposure total",
    fn: (inputs) => nonNegative(num(inputs, "a") + num(inputs, "b")),
  },
  {
    id: "cost.value",
    family: "cost",
    label: "Pass-through numeric value",
    fn: (inputs) => nonNegative(num(inputs, "value")),
  },
  {
    id: "energy.compressor_leak_kwh",
    family: "energy",
    label: "Compressor leak kWh",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "compressorKw") *
          num(inputs, "operatingHours") *
          (num(inputs, "leakPercent") / 100)
      ),
  },
  {
    id: "cost.annualize",
    family: "cost",
    label: "Annualize monthly cost",
    fn: (inputs) => nonNegative(num(inputs, "monthlyCost") * 12),
  },
  {
    id: "cloud.api_call_cost",
    family: "cost",
    label: "API call volume cost",
    fn: (inputs) =>
      nonNegative(
        (num(inputs, "monthlyApiCalls") / 1000) * num(inputs, "costPerThousandCalls")
      ),
  },
  {
    id: "agriculture.yield_loss_revenue",
    family: "benchmark",
    label: "Yield loss revenue exposure",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "areaHa") *
          Math.max(0, num(inputs, "expectedYieldTonPerHa") - num(inputs, "actualYieldTonPerHa")) *
          num(inputs, "pricePerTon")
      ),
  },
  {
    id: "cost.unit_cost",
    family: "cost",
    label: "Unit cost from total and quantity",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "totalCost"), num(inputs, "quantity"))),
  },
  {
    id: "time.setup_loss",
    family: "time",
    label: "Setup and changeover downtime cost",
    fn: (inputs) =>
      nonNegative(
        (num(inputs, "setupMinutes") / 60) *
          num(inputs, "setupsPerMonth") *
          num(inputs, "hourlyCost")
      ),
  },
  {
    id: "cost.percent_of_amount",
    family: "cost",
    label: "Percent of amount exposure",
    fn: (inputs) =>
      nonNegative(num(inputs, "amount") * (num(inputs, "percent") / 100)),
  },
  {
    id: "cost.difference",
    family: "cost",
    label: "Difference between two amounts",
    fn: (inputs) => assertFinite(num(inputs, "a") - num(inputs, "b")),
  },
  {
    id: "cost.product2",
    family: "cost",
    label: "Two-factor product cost",
    fn: (inputs) => nonNegative(num(inputs, "a") * num(inputs, "b")),
  },
  {
    id: "cost.fixed_plus_variable_total",
    family: "cost",
    label: "Fixed cost plus variable unit cost times quantity",
    fn: (inputs) =>
      nonNegative(num(inputs, "fixedCost") + num(inputs, "unitCost") * num(inputs, "quantity")),
  },
  {
    id: "cost.method_crossover_quantity",
    family: "cost",
    label: "Quantity where two fixed-plus-variable methods break even",
    fn: (inputs) => {
      const slopeDelta = num(inputs, "unitB") - num(inputs, "unitA");
      if (slopeDelta === 0) {
        return 0;
      }
      return nonNegative((num(inputs, "fixedA") - num(inputs, "fixedB")) / slopeDelta);
    },
  },
  {
    id: "lean.efficiency_gap_percent",
    family: "cost",
    label: "Efficiency gap percent from current score",
    fn: (inputs) => nonNegative(100 - num(inputs, "currentScore")),
  },
  {
    id: "lean.score_gap_percent",
    family: "cost",
    label: "Score gap percent between current and target",
    fn: (inputs) => nonNegative(num(inputs, "targetScore") - num(inputs, "currentScore")),
  },
  {
    id: "cost.labor_capacity_cost",
    family: "cost",
    label: "Labor capacity cost scaled by loss factor",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "headcount") *
          num(inputs, "hours") *
          num(inputs, "hourlyCost") *
          (num(inputs, "lossFactor") / 100),
      ),
  },
  {
    id: "layout.floor_parts_fit",
    family: "benchmark",
    label: "How many parts fit along one bed span",
    fn: (inputs) => {
      const part = num(inputs, "part");
      if (part <= 0) {
        return 0;
      }
      return Math.max(0, Math.floor(num(inputs, "span") / part));
    },
  },
  {
    id: "layout.nest_parts_count",
    family: "benchmark",
    label: "Nested parts count from row and column fit",
    fn: (inputs) => nonNegative(num(inputs, "rows") * num(inputs, "cols")),
  },
  {
    id: "layout.rect_bed_utilization_pct",
    family: "benchmark",
    label: "Rectangular bed utilization percent",
    fn: (inputs) => {
      const bedArea = num(inputs, "bedWidth") * num(inputs, "bedDepth");
      if (bedArea <= 0) {
        return 0;
      }
      const usedArea =
        num(inputs, "partsPerRow") *
        num(inputs, "partsPerColumn") *
        num(inputs, "partWidth") *
        num(inputs, "partDepth");
      return assertFinite(Math.min(100, (usedArea / bedArea) * 100));
    },
  },
  {
    id: "cost.margin_rate_on_price",
    family: "cost",
    label: "Margin rate on price",
    fn: (inputs) =>
      assertFinite(
        safeDivide(num(inputs, "price") - num(inputs, "cost"), num(inputs, "price")) * 100,
      ),
  },
  {
    id: "cost.quote_target_price",
    family: "cost",
    label: "Quote target sales price",
    fn: (inputs) => {
      const denom = Math.max(5, 100 - num(inputs, "targetMarginPercent"));
      return assertFinite(num(inputs, "totalCost") / (denom / 100));
    },
  },
  {
    id: "cost.quote_safe_floor_price",
    family: "cost",
    label: "Quote minimum safe floor price",
    fn: (inputs) => {
      const margin = num(inputs, "targetMarginPercent") + num(inputs, "safetyMarginUplift");
      const denom = Math.max(5, 100 - margin);
      return assertFinite(num(inputs, "totalCost") / (denom / 100));
    },
  },
  {
    id: "cost.shop_hourly_rate",
    family: "cost",
    label: "Loaded machine shop hourly rate",
    fn: (inputs) =>
      assertFinite(
        safeDivide(num(inputs, "fixedMonthlyCost"), num(inputs, "monthlyMachineHours")) +
          num(inputs, "variableCostPerHour"),
      ),
  },
  {
    id: "cost.break_even_units",
    family: "cost",
    label: "Break-even volume in units",
    fn: (inputs) => {
      const contribution = num(inputs, "unitPrice") - num(inputs, "variableCostPerUnit");
      if (contribution <= 0) {
        return 0;
      }
      return assertFinite(num(inputs, "fixedCost") / contribution);
    },
  },
  {
    id: "cost.safety_margin_rate",
    family: "cost",
    label: "Safety margin above break-even",
    fn: (inputs) => {
      const current = num(inputs, "currentVolume");
      if (current <= 0) {
        return 0;
      }
      return assertFinite(
        Math.max(0, (current - num(inputs, "breakEvenUnits")) / current) * 100,
      );
    },
  },
  {
    id: "carbon.unit_product_emissions",
    family: "carbon",
    label: "Unit product embedded emissions",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "totalEmissionsTon"), num(inputs, "productionUnits"))),
  },
  {
    id: "carbon.unit_exposure_cost",
    family: "carbon",
    label: "Unit carbon cost at reference price",
    fn: (inputs) =>
      assertFinite(num(inputs, "unitEmissionsTon") * num(inputs, "carbonPrice")),
  },
  {
    id: "time.hour_overrun_cost",
    family: "time",
    label: "Hour overrun labor cost",
    fn: (inputs) =>
      nonNegative(
        Math.max(0, num(inputs, "actualHours") - num(inputs, "plannedHours")) *
          num(inputs, "hourlyCost")
      ),
  },
  {
    id: "cost.count_cost",
    family: "cost",
    label: "Count times unit cost",
    fn: (inputs) => nonNegative(num(inputs, "count") * num(inputs, "costEach")),
  },
  {
    id: "agriculture.feed_monthly_cost",
    family: "benchmark",
    label: "Monthly dairy feed cost",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "cows") * num(inputs, "feedCostPerCowPerDay") * num(inputs, "days")
      ),
  },
  {
    id: "agriculture.milk_yield_gap_revenue",
    family: "benchmark",
    label: "Milk yield gap revenue loss",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "cows") *
          Math.max(
            0,
            num(inputs, "targetMilkLitersPerCowPerDay") - num(inputs, "milkLitersPerCowPerDay")
          ) *
          num(inputs, "milkPricePerLiter") *
          num(inputs, "days")
      ),
  },
  {
    id: "retail.inventory_turnover",
    family: "benchmark",
    label: "Inventory turnover ratio",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "annualCOGS"), num(inputs, "averageInventory"))),
  },
  {
    id: "inventory.eoq_units",
    family: "benchmark",
    label: "Economic order quantity in units",
    fn: (inputs) => {
      const holdingCost =
        num(inputs, "unitCost") * (num(inputs, "carryingCostPercent") / 100);
      if (holdingCost <= 0) {
        return 0;
      }
      return assertFinite(
        Math.sqrt((2 * num(inputs, "annualDemand") * num(inputs, "orderCost")) / holdingCost),
      );
    },
  },
  {
    id: "inventory.carrying_cost_annual",
    family: "benchmark",
    label: "Annual inventory carrying cost from EOQ",
    fn: (inputs) => {
      const averageUnits = num(inputs, "eoqUnits") / 2;
      const averageValue = averageUnits * num(inputs, "unitCost");
      return nonNegative(averageValue * (num(inputs, "carryingCostPercent") / 100));
    },
  },
  {
    id: "warehouse.unused_space_cost",
    family: "cost",
    label: "Unused warehouse space cost",
    fn: (inputs) =>
      nonNegative(num(inputs, "monthlyRent") * (num(inputs, "unusedSpacePercent") / 100)),
  },
  {
    id: "legal.simple_interest_days",
    family: "cost",
    label: "Simple interest over days",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "principal") *
          (num(inputs, "annualInterestPercent") / 100) *
          (num(inputs, "days") / 365)
      ),
  },
  {
    id: "carbon.total_emissions",
    family: "carbon",
    label: "Total emissions tonnage",
    fn: (inputs) =>
      nonNegative(num(inputs, "energyEmissionsTon") + num(inputs, "fuelEmissionsTon")),
  },
  {
    id: "calibration.tolerance_status",
    family: "calibration",
    label: "Tolerance band usage percent",
    fn: (inputs) => {
      const tolerance = num(inputs, "tolerance");
      if (tolerance === 0) {
        return 0;
      }
      return nonNegative(
        (Math.abs(num(inputs, "actual") - num(inputs, "target")) / tolerance) * 100
      );
    },
  },
  {
    id: "calibration.tolerance_worst_case_stack",
    family: "calibration",
    label: "Worst-case tolerance stack",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "t1") + num(inputs, "t2") + num(inputs, "t3") + num(inputs, "t4"),
      ),
  },
  {
    id: "calibration.tolerance_rss_stack",
    family: "calibration",
    label: "RSS tolerance stack",
    fn: (inputs) =>
      assertFinite(
        Math.sqrt(
          num(inputs, "t1") ** 2 +
            num(inputs, "t2") ** 2 +
            num(inputs, "t3") ** 2 +
            num(inputs, "t4") ** 2,
        ),
      ),
  },
  {
    id: "measurement.weld_throat_capacity",
    family: "measurement",
    label: "Simplified fillet weld throat capacity",
    fn: (inputs) => {
      const area = num(inputs, "throatMm") * num(inputs, "weldLengthMm");
      const safety = Math.max(1, num(inputs, "safetyFactor"));
      return nonNegative((area * num(inputs, "allowableStressMpa")) / safety);
    },
  },
  {
    id: "measurement.bolt_shear_capacity",
    family: "measurement",
    label: "Simplified bolt shear capacity",
    fn: (inputs) => {
      const radius = num(inputs, "boltDiameterMm") / 2;
      const area = Math.PI * radius * radius * num(inputs, "boltCount");
      const safety = Math.max(1, num(inputs, "safetyFactor"));
      return nonNegative((area * num(inputs, "allowableStressMpa")) / safety);
    },
  },
  {
    id: "measurement.bolt_tightening_torque",
    family: "measurement",
    label: "Bolt tightening torque estimate",
    fn: (inputs) => {
      const forceN = num(inputs, "clampForceKn") * 1000;
      const diameterM = num(inputs, "boltDiameterMm") / 1000;
      const friction = Math.max(0.01, num(inputs, "frictionFactor", 0.2));
      return nonNegative(forceN * diameterM * friction);
    },
  },
  {
    id: "measurement.fire_flow_demand",
    family: "measurement",
    label: "Fire system flow demand",
    fn: (inputs) =>
      nonNegative(num(inputs, "protectedAreaM2") * num(inputs, "designDensityLpmM2")),
  },
  {
    id: "measurement.hydrant_count",
    family: "measurement",
    label: "Hydrant count from flow demand",
    fn: (inputs) => {
      const demand = num(inputs, "flowDemandLpm");
      const capacity = Math.max(1, num(inputs, "hydrantCapacityLpm"));
      return Math.ceil(demand / capacity);
    },
  },
  {
    id: "measurement.cylinder_force",
    family: "measurement",
    label: "Hydraulic or pneumatic cylinder force",
    fn: (inputs) => {
      const pressureNmm2 = num(inputs, "pressureBar") * 0.1;
      const area = Math.PI * (num(inputs, "boreMm") / 2) ** 2;
      return nonNegative(pressureNmm2 * area);
    },
  },
  {
    id: "measurement.cylinder_retract_force",
    family: "measurement",
    label: "Cylinder retract force on rod side",
    fn: (inputs) => {
      const pressureNmm2 = num(inputs, "pressureBar") * 0.1;
      const bore = num(inputs, "boreMm");
      const rod = num(inputs, "rodMm");
      const area = (Math.PI / 4) * Math.max(bore * bore - rod * rod, 0);
      return nonNegative(pressureNmm2 * area);
    },
  },
  {
    id: "measurement.vessel_wall_thickness",
    family: "measurement",
    label: "Pressure vessel wall thickness screening",
    fn: (inputs) => {
      const pressure = num(inputs, "designPressureBar");
      const diameter = num(inputs, "diameterMm");
      const stress = Math.max(1, num(inputs, "allowableStressMpa"));
      const efficiency = Math.max(0.1, num(inputs, "weldEfficiency", 0.85));
      return nonNegative((pressure * diameter) / (2 * stress * efficiency * 10));
    },
  },
  {
    id: "cost.sum3",
    family: "cost",
    label: "Three-component cost sum",
    fn: (inputs) => nonNegative(num(inputs, "a") + num(inputs, "b") + num(inputs, "c")),
  },
  {
    id: "cost.ratio_percent",
    family: "cost",
    label: "Ratio as percent of denominator",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "numerator"), num(inputs, "denominator")) * 100),
  },
  {
    id: "time.vsm_total_lead_time",
    family: "time",
    label: "Value stream total lead time",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "processMinutes") + num(inputs, "waitMinutes") + num(inputs, "transportMinutes"),
      ),
  },
  {
    id: "benchmark.value_added_percent",
    family: "benchmark",
    label: "Value-added time percent of lead time",
    fn: (inputs) => {
      const total = num(inputs, "totalLeadMinutes");
      if (total === 0) return 0;
      return assertFinite((num(inputs, "valueAddedMinutes") / total) * 100);
    },
  },
  {
    id: "lean.muda_overproduction_cost",
    family: "cost",
    label: "Overproduction waste cost with holding uplift",
  },
  {
    id: "lean.muda_waiting_cost",
    family: "cost",
    label: "Waiting waste cost",
  },
  {
    id: "lean.muda_transport_cost",
    family: "cost",
    label: "Transport waste cost",
  },
  {
    id: "lean.muda_inventory_cost",
    family: "cost",
    label: "Excess inventory holding waste cost",
  },
  {
    id: "lean.muda_motion_cost",
    family: "cost",
    label: "Unnecessary motion waste cost",
  },
  {
    id: "lean.muda_overprocessing_cost",
    family: "cost",
    label: "Overprocessing waste cost",
  },
  {
    id: "lean.muda_defect_cost",
    family: "cost",
    label: "Defect waste cost from scrap and rework",
  },
  {
    id: "lean.muda_total_waste_cost",
    family: "cost",
    label: "Seven muda total waste cost",
  },
  {
    id: "lean.muda_highest_waste_index",
    family: "cost",
    label: "Highest muda waste category rank",
    fn: () => 0,
  },
  {
    id: "lean.muda_annualized_waste_cost",
    family: "cost",
    label: "Annualized waste cost",
  },
  {
    id: "lean.muda_waste_cost_per_unit",
    family: "cost",
    label: "Waste cost per unit",
  },
  {
    id: "lean.muda_period_revenue",
    family: "cost",
    label: "Period revenue",
  },
  {
    id: "lean.muda_period_gross_margin_value",
    family: "cost",
    label: "Period gross margin value",
  },
  {
    id: "lean.muda_waste_to_revenue_ratio_pct",
    family: "cost",
    label: "Waste to revenue ratio",
  },
  {
    id: "lean.muda_waste_to_gross_margin_ratio_pct",
    family: "cost",
    label: "Waste to gross margin ratio",
  },
  {
    id: "lean.muda_highest_waste_cost",
    family: "cost",
    label: "Highest waste category cost",
  },
  {
    id: "lean.muda_risk_adjusted_priority_score",
    family: "cost",
    label: "Risk-adjusted priority score",
  },
  {
    id: "energy.monthly_kwh_savings",
    family: "energy",
    label: "Monthly kWh savings from baseline minus proposed",
    fn: (inputs) =>
      nonNegative(num(inputs, "baselineKwhMonthly") - num(inputs, "proposedKwhMonthly")),
  },
  {
    id: "finance.payback_years",
    family: "cost",
    label: "Simple payback years from investment and annual savings",
    fn: (inputs) => {
      const savings = num(inputs, "annualSavings");
      if (savings <= 0) return 0;
      return assertFinite(num(inputs, "initialInvestment") / savings);
    },
  },
  {
    id: "finance.simple_npv",
    family: "cost",
    label: "Simple NPV with fixed annual cash flow",
    fn: (inputs) => {
      const investment = Math.abs(num(inputs, "initialCost"));
      const annual = num(inputs, "cashFlowYears1to5");
      const rate = num(inputs, "discountRate") / 100;
      const years = Math.max(1, Math.round(num(inputs, "projectLifeYears", 5)));
      let pv = -investment;
      for (let year = 1; year <= years; year += 1) {
        pv += annual / (1 + rate) ** year;
      }
      return assertFinite(pv);
    },
  },
  {
    id: "finance.net_position",
    family: "cost",
    label: "Net foreign currency position",
    fn: (inputs) => {
      const assets = num(inputs, "assets");
      const liabilities = num(inputs, "liabilities");
      return assertFinite(assets - liabilities);
    },
  },
  {
    id: "finance.fx_exposure_loss",
    family: "cost",
    label: "FX Exposure Loss (Unhedged)",
    fn: (inputs) => {
      const netPosition = num(inputs, "netPosition");
      const currentRate = num(inputs, "currentRate");
      const shockRate = num(inputs, "shockRate");
      const hedgeRatio = num(inputs, "hedgeRatio");
      
      const rateDiff = shockRate - currentRate;
      const unhedgedRatio = Math.max(0, 1 - (hedgeRatio / 100));
      
      const loss = (netPosition < 0 && rateDiff > 0) || (netPosition > 0 && rateDiff < 0) 
        ? Math.abs(netPosition * rateDiff) 
        : 0;
      return assertFinite(loss * unhedgedRatio);
    },
  },
  {
    id: "finance.hedge_savings",
    family: "cost",
    label: "Savings from FX Hedge",
    fn: (inputs) => {
      const netPosition = num(inputs, "netPosition");
      const currentRate = num(inputs, "currentRate");
      const shockRate = num(inputs, "shockRate");
      const hedgeRatio = num(inputs, "hedgeRatio");
      
      const rateDiff = shockRate - currentRate;
      const hedgeFactor = Math.min(100, Math.max(0, hedgeRatio)) / 100;
      
      const loss = (netPosition < 0 && rateDiff > 0) || (netPosition > 0 && rateDiff < 0) 
        ? Math.abs(netPosition * rateDiff) 
        : 0;
      return assertFinite(loss * hedgeFactor);
    },
  },
  {
    id: "finance.annual_yield_percent",
    family: "cost",
    label: "Annual cash flow as percent of investment",
    fn: (inputs) => {
      const investment = num(inputs, "initialInvestment");
      if (investment <= 0) return 0;
      return assertFinite((num(inputs, "annualCashFlow") / investment) * 100);
    },
  },
  {
    id: "finance.roi_percent",
    family: "cost",
    label: "Return on investment percent",
    fn: (inputs) => {
      const investment = num(inputs, "initialInvestment");
      if (investment <= 0) return 0;
      const net = num(inputs, "totalReturn") - investment;
      return assertFinite((net / investment) * 100);
    },
  },
  {
    id: "cost.employer_burden_total",
    family: "cost",
    label: "Employer total payroll with burden percent",
    fn: (inputs) => {
      const gross = num(inputs, "grossMonthlySalary");
      const burden = num(inputs, "employerBurdenPercent");
      return nonNegative(gross * (1 + burden / 100));
    },
  },
  {
    id: "cost.severance_screening",
    family: "cost",
    label: "Screening severance estimate from salary and service years",
    fn: (inputs) => {
      const gross = num(inputs, "grossMonthlySalary");
      const years = num(inputs, "yearsOfService");
      const weeksPerYear = num(inputs, "severanceWeeksPerYear", 4);
      return nonNegative(gross * (weeksPerYear / 4) * years);
    },
  },
  {
    id: "cost.notice_screening",
    family: "cost",
    label: "Screening notice-period cost estimate",
    fn: (inputs) => {
      const gross = num(inputs, "grossMonthlySalary");
      const weeks = num(inputs, "noticeWeeks", 4);
      return nonNegative(gross * (weeks / 4));
    },
  },
  {
    id: "measurement.pulley_driven_rpm",
    family: "measurement",
    label: "Driven pulley RPM from driver RPM and diameters",
    fn: (inputs) => {
      const driver = num(inputs, "driverDiameterMm");
      const driven = Math.max(1, num(inputs, "drivenDiameterMm"));
      return nonNegative((num(inputs, "driverRpm") * driver) / driven);
    },
  },
  {
    id: "measurement.belt_speed_mpm",
    family: "measurement",
    label: "Belt speed from driver diameter and RPM",
    fn: (inputs) => {
      const diameter = num(inputs, "driverDiameterMm");
      const rpm = num(inputs, "driverRpm");
      return nonNegative((Math.PI * diameter * rpm) / 1000);
    },
  },
  {
    id: "measurement.open_belt_length_mm",
    family: "measurement",
    label: "Open belt length estimate from pulley diameters and center distance",
    fn: (inputs) => {
      const driver = num(inputs, "driverDiameterMm");
      const driven = num(inputs, "drivenDiameterMm");
      const center = Math.max(driver + driven, num(inputs, "centerDistanceMm"));
      const diff = driver - driven;
      return nonNegative(
        2 * center + (Math.PI / 2) * (driver + driven) + (diff * diff) / (4 * center),
      );
    },
  },
  /* ─── Industrial Formula Tools (18) —— atomic sub-formulas ─── */
  {
    id: "finance.irr_estimate",
    family: "finance",
    label: "IRR estimate using simplified Newton-Raphson (inputs as flat cash flows)",
    fn: (inputs) => {
      const cf0 = num(inputs, "initialInvestment");
      let r = 0.15;
      for (let i = 0; i < 100; i++) {
        let npv = cf0;
        let dnpv = 0;
        for (let t = 1; t <= 10; t++) {
          const fcf = num(inputs, `cf${t}`, 0);
          npv += fcf / Math.pow(1 + r, t);
          dnpv -= t * fcf / Math.pow(1 + r, t + 1);
        }
        if (Math.abs(npv) < 1e-8) break;
        if (Math.abs(dnpv) < 1e-12) break;
        r = r - npv / dnpv;
      }
      return assertFinite(r);
    },
  },
  {
    id: "finance.wacc",
    family: "finance",
    label: "Weighted Average Cost of Capital",
    fn: (inputs) => {
      const e = num(inputs, "equityValue");
      const d = num(inputs, "debtValue");
      const v = e + d;
      if (v === 0) return 0;
      return assertFinite((e / v) * num(inputs, "costOfEquity") + (d / v) * num(inputs, "costOfDebt") * (1 - num(inputs, "taxRate") / 100));
    },
  },
  {
    id: "finance.nal",
    family: "finance",
    label: "Net Advantage of Leasing (NAL) estimate",
    fn: (inputs) => {
      const purchasePrice = num(inputs, "purchasePrice");
      const leasePayment = num(inputs, "monthlyLeasePayment");
      const months = num(inputs, "leaseTermMonths");
      const rd = num(inputs, "costOfDebt") / 100 * (1 - num(inputs, "taxRate") / 100);
      let pvLease = 0;
      const monthlyRd = Math.pow(1 + rd, 1 / 12) - 1;
      for (let m = 1; m <= months; m++) {
        pvLease += (leasePayment * (1 - num(inputs, "taxRate") / 100)) / Math.pow(1 + monthlyRd, m);
      }
      return assertFinite(purchasePrice - pvLease);
    },
  },
  {
    id: "fluid.darcy_friction_factor",
    family: "fluid",
    label: "Darcy friction factor via Colebrook-White",
    fn: (inputs) => {
      const re = num(inputs, "reynoldsNumber");
      if (re <= 0) return 0;
      if (re < 2300) return assertFinite(64 / re);
      const rr = num(inputs, "relativeRoughness") / (3.7 * num(inputs, "diameterMm", 100));
      const reTerm = 5.74 / Math.pow(re, 0.9);
      return assertFinite(0.25 / Math.pow(Math.log10(rr + reTerm), 2));
    },
  },
  {
    id: "fluid.heat_exchanger_lmtd",
    family: "fluid",
    label: "LMTD for counter-flow heat exchanger",
    fn: (inputs) => {
      const dt1 = num(inputs, "deltaT1");
      const dt2 = num(inputs, "deltaT2");
      if (Math.abs(dt1 - dt2) < 0.01) return assertFinite(dt1);
      return assertFinite((dt1 - dt2) / Math.log(dt1 / dt2));
    },
  },
  {
    id: "oee.oee_score",
    family: "oee",
    label: "Full OEE score as percent (A × P × Q × 100)",
    fn: (inputs) => assertFinite(num(inputs, "availability") * num(inputs, "performance") * num(inputs, "quality") * 100),
  },
  {
    id: "lean.balance_efficiency",
    family: "lean",
    label: "Line balance efficiency percent",
    fn: (inputs) => {
      const twc = num(inputs, "totalWorkContent");
      const takt = num(inputs, "taktTime");
      const nReal = num(inputs, "actualStations");
      if (takt <= 0 || nReal <= 0) return 0;
      return assertFinite((twc / (nReal * takt)) * 100);
    },
  },
  {
    id: "time.normal_time",
    family: "time",
    label: "Normal time from observed time and rating factor (%)",
    fn: (inputs) => assertFinite(num(inputs, "observedTime") * num(inputs, "ratingFactor") / 100),
  },
  {
    id: "time.standard_time",
    family: "time",
    label: "Standard time with total allowance",
    fn: (inputs) => assertFinite(num(inputs, "normalTime") * (1 + num(inputs, "totalAllowance"))),
  },
  {
    id: "learning.wright_unit_time",
    family: "measurement",
    label: "Wright learning curve unit time",
    fn: (inputs) => {
      const a = num(inputs, "firstUnitTime");
      const b = Math.log(num(inputs, "learningRate") / 100) / Math.log(2);
      return assertFinite(a * Math.pow(num(inputs, "cumulativeQuantity"), b));
    },
  },
  {
    id: "measurement.spring_rate",
    family: "measurement",
    label: "Helical compression spring rate (N/mm)",
    fn: (inputs) => {
      const g = num(inputs, "shearModulusGPa", 79.3) * 1e3;
      const d = num(inputs, "wireDiameter");
      const D = num(inputs, "meanCoilDiameter");
      const na = num(inputs, "activeCoils");
      return assertFinite(g * Math.pow(d, 4) / (8 * Math.pow(D, 3) * na));
    },
  },
  {
    id: "carbon.total_co2e",
    family: "energy",
    label: "Total CO₂e from scope 1 + 2 + 3 sources",
    fn: (inputs) => {
      const s1 = num(inputs, "scope1") || 0;
      const s2 = num(inputs, "scope2") || 0;
      const s3 = num(inputs, "scope3") || 0;
      return assertFinite(s1 + s2 + s3);
    },
  },
  {
    id: "stats.ols_beta1",
    family: "measurement",
    label: "OLS slope coefficient β₁",
    fn: (inputs) => {
      const n = num(inputs, "sampleSize");
      const sx = num(inputs, "sumX");
      const sy = num(inputs, "sumY");
      const sxy = num(inputs, "sumXY");
      const sx2 = num(inputs, "sumX2");
      const denom = n * sx2 - sx * sx;
      if (Math.abs(denom) < 1e-15) return 0;
      return assertFinite((n * sxy - sx * sy) / denom);
    },
  },
  {
    id: "stats.sample_size_proportion",
    family: "measurement",
    label: "Minimum sample size for proportion",
    fn: (inputs) => {
      const z = num(inputs, "zScore");
      const p = num(inputs, "estimatedProportion") / 100;
      const e = num(inputs, "errorMargin") / 100;
      if (e <= 0) return 1;
      return Math.ceil(z * z * p * (1 - p) / (e * e));
    },
  },
  {
    id: "stats.anova_f_stat",
    family: "measurement",
    label: "One-way ANOVA F-statistic",
    fn: (inputs) => {
      const msB = num(inputs, "msBetween");
      const msW = num(inputs, "msWithin");
      if (msW <= 0) return 0;
      return assertFinite(msB / msW);
    },
  },
  {
    id: "measurement.hydraulic_cylinder_push_pull_ratio",
    family: "measurement",
    label: "Hydraulic cylinder push-pull force ratio",
    fn: (inputs) => {
      const d = num(inputs, "pistonDia");
      const rod = num(inputs, "rodDia");
      if (d <= rod) return 1;
      return assertFinite((d * d - rod * rod) / (d * d));
    },
  },
  // -------------------------------------------------------------------------
  // Setup & complexity cost formulas — product-complexity-hidden-cost
  // -------------------------------------------------------------------------
  {
    id: "cost.setup_total_cost",
    family: "cost",
    label: "Setup total cost from changeover time and cost per minute",
    fn: (inputs) => assertFinite(num(inputs, "changeoverTime") * num(inputs, "costPerMinute")),
  },
  {
    id: "measurement.waste_percentage",
    family: "measurement",
    label: "Waste percentage from waste and total",
    fn: (inputs) => safeDivide(num(inputs, "hiddenCostComplexity"), num(inputs, "numSkus")) * 100,
  },
  // -------------------------------------------------------------------------
  // Vacuum leak energy — vacuum-leak-energy
  // -------------------------------------------------------------------------
  {
    id: "cost.vacuum_savings_potential",
    family: "cost",
    label: "Vacuum leak savings potential (70% of leak cost)",
    fn: (inputs) => assertFinite(num(inputs, "vacuumLeakCost") * 0.7),
  },
  // -------------------------------------------------------------------------
  // Shift cost — shift-cost-efficiency
  // -------------------------------------------------------------------------
  {
    id: "cost.annual_shift_cost",
    family: "cost",
    label: "Annual shift cost from workers, hours, rate, and days",
    fn: (inputs) => assertFinite(num(inputs, "shiftWorkers") * num(inputs, "shiftHours") * num(inputs, "shiftRate") * num(inputs, "shiftDays")),
  },
  // -------------------------------------------------------------------------
  // WPS preheat crack risk — wps-preheat-temperature
  // -------------------------------------------------------------------------
  {
    id: "measurement.crack_risk_score",
    family: "measurement",
    label: "Crack risk score from carbon equivalent vs threshold",
    fn: (inputs) => assertFinite(num(inputs, "carbonEquivalent") / num(inputs, "materialThickness") * 100),
  },
  // -------------------------------------------------------------------------
  // Fire hydrant compliance — fire-hydrant-flow
  // -------------------------------------------------------------------------
  {
    id: "cost.hydrant_compliance_penalty",
    family: "cost",
    label: "Hydrant compliance penalty from deficient hydrants",
    fn: (inputs) => assertFinite(num(inputs, "deficientHydrants") * num(inputs, "penaltyPerHydrant")),
  },
  // -------------------------------------------------------------------------
  // Renovation budget breakdown — renovation-budget-optimizer
  // -------------------------------------------------------------------------
  {
    id: "cost.renovation_budget_breakdown",
    family: "cost",
    label: "Renovation budget breakdown (base + contingency + design)",
    fn: (inputs) => assertFinite(num(inputs, "renovationBaseCost") + num(inputs, "contingencyBudget") + num(inputs, "designFee")),
  },
  // -------------------------------------------------------------------------
  // Renewable energy IRR — renewable-energy-irr
  // -------------------------------------------------------------------------
  {
    id: "cost.renewable_irr",
    family: "cost",
    label: "Renewable IRR proxy from cash flow ratio",
    fn: (inputs) => assertFinite(safeDivide(num(inputs, "annualCashFlow"), num(inputs, "totalInvestment")) * 100),
  },
  {
    id: "measurement.renewable_payback",
    family: "measurement",
    label: "Renewable energy payback period",
    fn: (inputs) => safeDivide(num(inputs, "installationCost"), num(inputs, "annualGeneration")),
  },
  // -------------------------------------------------------------------------
  // Cash flow metrics — cash-flow-gap & payment-terms
  // -------------------------------------------------------------------------
  {
    id: "measurement.dso",
    family: "measurement",
    label: "Days sales outstanding",
    fn: (inputs) => safeDivide(num(inputs, "avgReceivables"), num(inputs, "annualRevenue") / 365),
  },
  {
    id: "measurement.dpo",
    family: "measurement",
    label: "Days payable outstanding",
    fn: (inputs) => safeDivide(num(inputs, "accountsPayable"), num(inputs, "annualCOGS") / 365),
  },
  {
    id: "measurement.dio",
    family: "measurement",
    label: "Days inventory outstanding",
    fn: (inputs) => safeDivide(num(inputs, "inventory"), num(inputs, "annualCOGS") / 365),
  },
  // -------------------------------------------------------------------------
  // Energy — kwh-cost
  // -------------------------------------------------------------------------
  {
    id: "cost.demand_charge",
    family: "cost",
    label: "Demand charge from peak kW, rate, and months",
    fn: (inputs) => assertFinite(num(inputs, "peakDemandKW") * num(inputs, "demandRatePerKW") * num(inputs, "months")),
  },
  // -------------------------------------------------------------------------
  // Breakeven — breakeven-unit
  // -------------------------------------------------------------------------
  {
    id: "measurement.breakeven_unit",
    family: "measurement",
    label: "Breakeven unit from fixed cost and contribution margin",
    fn: (inputs) => safeDivide(num(inputs, "fixedCost"), num(inputs, "unitPrice") - num(inputs, "variableCost")),
  },
  // -------------------------------------------------------------------------
  // Machine economic life — machine-economic-life
  // -------------------------------------------------------------------------
  {
    id: "measurement.machine_economic_life",
    family: "measurement",
    label: "Machine economic life in years (EOQ-like model)",
    fn: (inputs) => assertFinite(Math.sqrt(2 * num(inputs, "purchaseCost") * num(inputs, "purchaseResidualAmt") / num(inputs, "discountRate"))),
  },
  // -------------------------------------------------------------------------
  // Project overrun (EVM) — project-overrun
  // -------------------------------------------------------------------------
  {
    id: "measurement.spi",
    family: "measurement",
    label: "Schedule performance index (SPI)",
    fn: (i) => safeDivide(num(i, "earnedValue"), num(i, "plannedValue")),
  },
  {
    id: "measurement.cpi",
    family: "measurement",
    label: "Cost performance index (CPI)",
    fn: (i) => safeDivide(num(i, "earnedValue"), num(i, "actualCost")),
  },
  {
    id: "cost.eac",
    family: "cost",
    label: "Estimate at completion (EAC = BAC / CPI)",
    fn: (i) => safeDivide(num(i, "budgetAtCompletion"), num(i, "cpi")),
  },
  {
    id: "cost.expected_overrun",
    family: "cost",
    label: "Expected overrun (EAC - BAC)",
    fn: (i) => assertFinite(num(i, "eac") - num(i, "budgetAtCompletion")),
  },
  {
    id: "measurement.schedule_delay",
    family: "measurement",
    label: "Schedule delay from planned duration and EV",
    fn: (inputs) => assertFinite(num(inputs, "actualDays") - safeDivide(num(inputs, "scheduleDays"), num(inputs, "spi") / num(inputs, "actualDays"))),
  },
  {
    id: "cost.risk_exposure",
    family: "cost",
    label: "Risk exposure (probability × impact)",
    fn: (i) => assertFinite(num(i, "probability") * num(i, "impact")),
  },
  {
    id: "cost.net_risk",
    family: "cost",
    label: "Net risk (risk exposure - mitigation)",
    fn: (i) => assertFinite(num(i, "riskExposure") - num(i, "mitigationCost")),
  },
  // -------------------------------------------------------------------------
  // Recipe cost — recipe-cost-check
  // -------------------------------------------------------------------------
  {
    id: "cost.recipe_yield_loss",
    family: "cost",
    label: "Recipe yield loss cost from expected vs actual",
    fn: (i) => assertFinite((num(i, "expectedYield") - num(i, "actualYield")) * num(i, "costPerUnit")),
  },
  {
    id: "measurement.recipe_efficiency",
    family: "measurement",
    label: "Recipe efficiency (actual / expected × 100)",
    fn: (i) => safeDivide(num(i, "actualYield"), num(i, "expectedYield")) * 100,
  },
  // -------------------------------------------------------------------------
  // Restaurant margin — restaurant-menu-margin-leak
  // -------------------------------------------------------------------------
  {
    id: "cost.restaurant_variance",
    family: "cost",
    label: "Restaurant food cost variance × meals served",
    fn: (inputs) => assertFinite((num(inputs, "expectedFoodCost") - num(inputs, "actualFoodCost")) * num(inputs, "mealsServed")),
  },
  // -------------------------------------------------------------------------
  // Robot vs manual — robot-vs-manual
  // -------------------------------------------------------------------------
  {
    id: "cost.robot_roi",
    family: "cost",
    label: "Robot automation ROI including error cost",
    fn: (inputs) => assertFinite(safeDivide((num(inputs, "annualLaborCost") + num(inputs, "annualErrorCost")) - num(inputs, "robotAnnualCost"), num(inputs, "robotInvestment")) * 100),
  },
  // -------------------------------------------------------------------------
  // Route cost — route-cost
  // -------------------------------------------------------------------------
  {
    id: "cost.route_overhead",
    family: "cost",
    label: "Route overhead from distance and rate per km",
    fn: (inputs) => assertFinite(num(inputs, "routeDistance") * num(inputs, "overheadPerKm")),
  },
  {
    id: "cost.route_total_cost",
    family: "cost",
    label: "Total route cost (fuel + labor + overhead)",
    fn: (inputs) => assertFinite(num(inputs, "routeFuelCost") + num(inputs, "routeLaborCost") + num(inputs, "routeOverhead")),
  },
];

// Legacy aliases — stable ids for existing pilot schemas (same functions)
const LEGACY_ALIASES: Readonly<Record<string, string>> = {
  "loss.time_cost": "time.labor_cost",
  "loss.scrap_cost": "scrap.material_cost",
  "loss.combined_operating": "scrap.combined_operating",
  "loss.total_exposure": "scrap.total_exposure",
};

export const FORMULA_META: Record<
  string,
  { readonly family: FormulaFamilyId; readonly label: string }
> = {};

export const FORMULA_REGISTRY: Record<string, FormulaFn> = {};

for (const def of FORMULA_DEFINITIONS) {
  FORMULA_META[def.id] = { family: def.family, label: def.label };
  FORMULA_REGISTRY[def.id] = def.fn;
}

for (const def of USER_FORMULA_DEFINITIONS) {
  FORMULA_META[def.id] = { family: def.family, label: def.label };
  FORMULA_REGISTRY[def.id] = def.fn;
}

for (const [legacyId, canonicalId] of Object.entries(LEGACY_ALIASES)) {
  const canonical = FORMULA_DEFINITIONS.find((d) => d.id === canonicalId);
  if (!canonical) continue;
  FORMULA_META[legacyId] = { family: canonical.family, label: `${canonical.label} (legacy id)` };
  FORMULA_REGISTRY[legacyId] = canonical.fn;
}

/** Formulas grouped by the 10 locked families. */
export const FORMULAS_BY_FAMILY = FORMULA_FAMILIES.reduce<
  Record<FormulaFamilyId, readonly string[]>
>(
  (acc, family) => {
    acc[family] = Object.entries(FORMULA_META)
      .filter(([, meta]) => meta.family === family)
      .map(([id]) => id)
      .sort();
    return acc;
  },
  {} as Record<FormulaFamilyId, readonly string[]>
);

export { FORMULA_FAMILIES, FORMULA_FAMILY_LABELS };

export function getFormulaFn(formulaId: string): FormulaFn {
  const fn = FORMULA_REGISTRY[formulaId];
  if (!fn) {
    throw new Error(`Unknown formulaId: ${formulaId}`);
  }
  return fn;
}

export function getFormulaFamily(formulaId: string): FormulaFamilyId | null {
  return FORMULA_META[formulaId]?.family ?? null;
}

export function listRegisteredFormulaIds(): readonly string[] {
  return Object.keys(FORMULA_REGISTRY).sort();
}

export function formulaIdsInFamily(family: FormulaFamilyId): readonly string[] {
  return FORMULAS_BY_FAMILY[family] ?? [];
}

export type FormulaOutputHint = PremiumOutputFormat;

export interface FormulaRegistryMeta {
  readonly formulaId: string;
  readonly family: FormulaFamilyId;
  readonly label: string;
  readonly description: string;
  readonly requiredInputs: readonly string[];
  readonly outputHint: FormulaOutputHint;
}

const FORMULA_META_DETAILS: Record<
  string,
  Omit<FormulaRegistryMeta, "formulaId" | "family" | "label">
> = {
  "measurement.variance_percent": {
    description: "Percent deviation of actual versus target measurement.",
    requiredInputs: ["actual", "target"],
    outputHint: "percentage",
  },
  "benchmark.variance_percent": {
    description: "Percent variance against a benchmark target.",
    requiredInputs: ["actual", "target"],
    outputHint: "percentage",
  },
  "time.labor_cost": {
    description: "Labor or machine time converted to cost exposure.",
    requiredInputs: ["hourlyCost", "lossHours"],
    outputHint: "currency",
  },
  "time.downtime_minute_cost": {
    description: "Downtime minutes converted to cost at an hourly shop rate.",
    requiredInputs: ["downtimeMinutes", "hourlyRate"],
    outputHint: "currency",
  },
  "time.downtime_units_lost": {
    description: "Good units not produced during downtime.",
    requiredInputs: ["downtimeMinutes", "outputUnitsPerHour"],
    outputHint: "number",
  },
  "scrap.material_cost": {
    description: "Material cost multiplied by scrap rate percent.",
    requiredInputs: ["materialCost", "scrapRate"],
    outputHint: "currency",
  },
  "scrap.combined_operating": {
    description: "Stack of labor, material and overhead operating costs.",
    requiredInputs: ["laborCost", "materialCost", "overheadCost"],
    outputHint: "currency",
  },
  "scrap.total_exposure": {
    description: "Base cost scaled by hidden loss multiplier.",
    requiredInputs: ["baseCost", "hiddenMultiplier"],
    outputHint: "currency",
  },
  "oee.basic": {
    description: "Classic OEE score from availability, performance and quality.",
    requiredInputs: ["availability", "performance", "quality"],
    outputHint: "score",
  },
  "oee.availability_loss_cost": {
    description: "Cost of availability loss above planned tolerance.",
    requiredInputs: ["machineRate", "downtimeHours", "plannedHours"],
    outputHint: "currency",
  },
  "route.deadhead_cost": {
    description: "Unpaid return distance cost exposure.",
    requiredInputs: ["distanceKm", "costPerKm", "emptyReturnPercent"],
    outputHint: "currency",
  },
  "route.total_freight_cost": {
    description: "Fuel, driver, tolls and deadhead combined freight cost.",
    requiredInputs: ["fuelCost", "driverCost", "tolls", "deadheadCost"],
    outputHint: "currency",
  },
  "energy.excess_kwh_cost": {
    description: "Cost of kWh consumption above target.",
    requiredInputs: ["currentKwh", "targetKwh", "rate"],
    outputHint: "currency",
  },
  "energy.kwh_cost": {
    description: "Simple kWh times rate cost.",
    requiredInputs: ["kwh", "rate"],
    outputHint: "currency",
  },
  "energy.peak_demand_cost": {
    description: "Peak kWh tariff plus demand charge.",
    requiredInputs: ["peakKwh", "peakRate", "demandCharge"],
    outputHint: "currency",
  },
  "energy.total_energy_cost": {
    description: "Excess kWh cost plus peak demand stack.",
    requiredInputs: ["excessKwh", "energyRate", "peakCost"],
    outputHint: "currency",
  },
  "quality.six_sigma_project_score": {
    description: "Calculates priority score based on savings, probability, duration, and cost.",
    requiredInputs: ["savings", "probability", "duration", "cost"],
    outputHint: "score",
  },
  "energy.heat_loss_watts": {
    description: "Steady-state heat transmission loss in Watts.",
    requiredInputs: ["area", "uValue", "insideTemp", "outsideTemp"],
    outputHint: "number",
  },
  "energy.annual_heat_loss_kwh": {
    description: "Annual energy lost to heat transmission in kWh.",
    requiredInputs: ["watts", "hours"],
    outputHint: "number",
  },
  "energy.annual_heat_loss_cost": {
    description: "Cost of annual heat loss energy.",
    requiredInputs: ["kwh", "rate"],
    outputHint: "currency",
  },
  "carbon.cbam_exposure": {
    description: "Carbon border adjustment exposure estimate.",
    requiredInputs: ["emissionsTon", "carbonPrice", "exposurePercent"],
    outputHint: "currency",
  },
  "carbon.cbam_certificate_exposure": {
    description: "CBAM certificate cost from embedded emissions, price and FX.",
    requiredInputs: ["embeddedEmissionsTon", "cbamCertificatePrice", "eurTryRate"],
    outputHint: "currency",
  },
  "carbon.emission_gap_ton": {
    description: "Non-negative gap between embedded and declared emissions.",
    requiredInputs: ["embeddedEmissionsTon", "declaredEmissionsTon"],
    outputHint: "number",
  },
  "benchmark.gap_percent": {
    description: "Percent gap from full coverage or completeness.",
    requiredInputs: ["percent"],
    outputHint: "percentage",
  },
  "carbon.cbam_financial_exposure": {
    description: "Financial exposure from emission gap and certificate price.",
    requiredInputs: ["emissionGap", "cbamCertificatePrice", "eurTryRate"],
    outputHint: "currency",
  },
  "risk.cbam_composite_score": {
    description: "Weighted CBAM data preparation risk score.",
    requiredInputs: ["embeddedEmissionsTon", "emissionGap", "coverageGapPct", "dataGapPct"],
    outputHint: "score",
  },
  "cost.p90_buffer": {
    description: "P90 volatility buffer on adjusted cost.",
    requiredInputs: ["adjustedCost", "volatilityPercent"],
    outputHint: "currency",
  },
  "cost.minimum_safe_price": {
    description: "Minimum safe price from P90 cost and target margin.",
    requiredInputs: ["p90Cost", "targetMarginPercent"],
    outputHint: "currency",
  },
  // ── Batch 2 META (Tools 21-60) ──
  "cost.clv": { description: "Customer lifetime value as avg order value × frequency × lifespan.", requiredInputs: ["avgOrderValue","purchaseFreq","lifespan"], outputHint: "currency" },
  "cost.gross_margin_clv": { description: "CLV adjusted by gross margin percentage.", requiredInputs: ["clv","grossMarginPct"], outputHint: "currency" },
  "cost.discounted_clv": { description: "Discounted cumulative CLV over 5 years with retention and discount rate.", requiredInputs: ["clv","retention","discountRate"], outputHint: "currency" },
  "cost.cac": { description: "Customer acquisition cost from total marketing spend divided by new customers.", requiredInputs: ["salesMarketing","salaries","overhead","newCustomers"], outputHint: "currency" },
  "cost.cac_payback": { description: "Months to recover CAC from monthly gross profit per customer.", requiredInputs: ["cac","avgOrderValue","purchaseFreq","grossMarginPct"], outputHint: "duration" },
  "cost.ltv_cac_ratio": { description: "LTV to CAC ratio for customer acquisition efficiency.", requiredInputs: ["discountedClv","cac"], outputHint: "number" },
  "measurement.cnc_rpm": { description: "CNC spindle RPM from cutting speed and tool diameter.", requiredInputs: ["cuttingSpeed","toolDiameter"], outputHint: "number" },
  "measurement.cnc_feed_speed": { description: "Feed speed from feed per tooth, teeth count, and RPM.", requiredInputs: ["feedPerTooth","teeth","rpm"], outputHint: "number" },
  "measurement.cnc_cut_time": { description: "Cut time from length, depth, feed speed, and axial depth.", requiredInputs: ["length","depth","feedSpeed","axialDepth"], outputHint: "duration" },
  "measurement.cnc_rapid_time": { description: "Rapid traverse time from distance and speed.", requiredInputs: ["rapidDistance","rapidSpeed"], outputHint: "duration" },
  "measurement.cnc_toolchange_time": { description: "Total tool change time from change count and time per change.", requiredInputs: ["changeCount","timePerChange"], outputHint: "duration" },
  "measurement.cnc_total_time": { description: "Total CNC cycle time including cutting, rapid, toolchange, non-cutting, and load/unload.", requiredInputs: ["cutTime","rapidTime","toolChangeTime","nonCuttingTime","loadUnloadTime"], outputHint: "duration" },
  "cost.cnc_material": { description: "Raw material cost per unit including scrap factor.", requiredInputs: ["rawVolume","density","pricePerKg","scrapRate"], outputHint: "currency" },
  "cost.cnc_machining": { description: "Machining cost per unit from cycle time and machine rate.", requiredInputs: ["totalCycleTime","machineRate"], outputHint: "currency" },
  "cost.cnc_tooling": { description: "Tooling cost per unit from tool life and cut time.", requiredInputs: ["cutTime","toolLife","toolCost"], outputHint: "currency" },
  "cost.cnc_energy": { description: "Energy cost per unit from power, cycle time, and electricity rate.", requiredInputs: ["power","totalCycleTime","elecRate"], outputHint: "currency" },
  "cost.cnc_overhead": { description: "Overhead cost per unit from cycle time and overhead rate.", requiredInputs: ["totalCycleTime","overheadRate"], outputHint: "currency" },
  "cost.cnc_total_unit": { description: "Total unit cost including material, machining, tooling, energy, and overhead.", requiredInputs: ["materialCost","machiningCost","toolingCost","energyCost","overheadCost","qualityCost"], outputHint: "currency" },
  "measurement.cpk_z_usl": { description: "Z score for upper specification limit.", requiredInputs: ["usl","mean","stdDev"], outputHint: "number" },
  "measurement.cpk_z_lsl": { description: "Z score for lower specification limit.", requiredInputs: ["mean","lsl","stdDev"], outputHint: "number" },
  "measurement.cpk_index": { description: "Cpk process capability index.", requiredInputs: ["zUsl","zLsl"], outputHint: "number" },
  "measurement.cpk_p_usl": { description: "Probability of exceeding USL.", requiredInputs: ["zUsl"], outputHint: "percentage" },
  "measurement.cpk_p_lsl": { description: "Probability of falling below LSL.", requiredInputs: ["zLsl"], outputHint: "percentage" },
  "measurement.cpk_p_total": { description: "Total out-of-spec probability.", requiredInputs: ["pUsl","pLsl"], outputHint: "percentage" },
  "measurement.cpk_ppm": { description: "Parts per million out of specification.", requiredInputs: ["pTotal"], outputHint: "number" },
  "measurement.cpk_yield": { description: "Process yield (in-spec ratio).", requiredInputs: ["pTotal"], outputHint: "number" },
  "measurement.cpk_sigma_st": { description: "Short-term sigma level with 1.5 shift.", requiredInputs: ["cpk"], outputHint: "number" },
  "measurement.cpm_total_float": { description: "Total float from late start minus early start.", requiredInputs: ["lateStart","earlyStart"], outputHint: "duration" },
  "measurement.cpm_critical_delay": { description: "Critical path delay beyond planned duration and float.", requiredInputs: ["actualDuration","plannedDuration","totalFloat"], outputHint: "duration" },
  "measurement.cpm_non_excusable": { description: "Non-excusable delay days after removing force majeure.", requiredInputs: ["criticalDelay","excusableDelay"], outputHint: "duration" },
  "cost.cpm_liquidated_damages": { description: "Liquidated damages from non-excusable delay.", requiredInputs: ["nonExcusable","dailyPenalty"], outputHint: "currency" },
  "cost.cpm_acceleration": { description: "Acceleration cost from crashing.", requiredInputs: ["crashingCost","daysAccelerated"], outputHint: "currency" },
  "cost.cpm_net_penalty": { description: "Net penalty after acceleration credit.", requiredInputs: ["liquidatedDamages","accelerationCost"], outputHint: "currency" },
  "cost.cpm_eot_claim": { description: "Extension of time claim days.", requiredInputs: ["excusableDelay","effFactor"], outputHint: "duration" },
  "measurement.roof_footprint": { description: "Building footprint area from length and width.", requiredInputs: ["buildingLength","buildingWidth"], outputHint: "number" },
  "measurement.roof_gable_area": { description: "Gable roof area adjusted by pitch angle.", requiredInputs: ["footprint","pitchAngle"], outputHint: "number" },
  "measurement.roof_overhang_area": { description: "Overhang area from perimeter and overhang width.", requiredInputs: ["buildingLength","buildingWidth","overhangWidth"], outputHint: "number" },
  "measurement.roof_material_area": { description: "Total material area including waste factor.", requiredInputs: ["gableArea","wasteFactor"], outputHint: "number" },
  "measurement.roof_ridge_length": { description: "Ridge length for hip roofs.", requiredInputs: ["buildingLength","buildingWidth"], outputHint: "number" },
  "measurement.bottleneck_util": { description: "Bottleneck utilization as actual vs design capacity.", requiredInputs: ["actualOutput","designCapacity"], outputHint: "number" },
  "measurement.bottleneck_throughput": { description: "Effective throughput adjusted for defect rate.", requiredInputs: ["demand","defectRate"], outputHint: "number" },
  "measurement.bottleneck_takt_time": { description: "Takt time from available time and demand.", requiredInputs: ["availableTime","demand"], outputHint: "duration" },
  "measurement.bottleneck_cycle_gap": { description: "Cycle time gap above takt time.", requiredInputs: ["bottleneckCycle","taktTime"], outputHint: "duration" },
  "cost.bottleneck_cost": { description: "Cost of constraint from cycle gap, demand, and margin.", requiredInputs: ["cycleGap","demand","unitMargin"], outputHint: "currency" },
  "cost.bottleneck_roi": { description: "ROI of bottleneck upgrade investment.", requiredInputs: ["throughputIncrease","margin","days","upgradeCost"], outputHint: "number" },
  "cost.bottleneck_payback": { description: "Payback period in months for bottleneck upgrade.", requiredInputs: ["upgradeCost","monthlyGain"], outputHint: "duration" },
  "measurement.smed_setup_total": { description: "Total setup time from internal and external setup.", requiredInputs: ["internalSetup","externalSetup"], outputHint: "duration" },
  "measurement.smed_target_time": { description: "Target setup time after SMED conversion.", requiredInputs: ["internalSetup","conversionRate","externalSetup"], outputHint: "duration" },
  "measurement.smed_ebq": { description: "Economic batch quantity from demand, setup, and holding cost.", requiredInputs: ["demand","setupCost","holdingCost"], outputHint: "number" },
  "cost.smed_setup_cost": { description: "Setup cost from total time, machine rate, and labor.", requiredInputs: ["totalSetup","machineRate","labor"], outputHint: "currency" },
  "cost.smed_annual_savings": { description: "Annual savings from SMED time reduction.", requiredInputs: ["totalSetup","targetTime","changeoverFreq","machineRate"], outputHint: "currency" },
  "measurement.warehouse_storage_area": { description: "Available storage area from footprint and utilization.", requiredInputs: ["footprint","utilRate"], outputHint: "number" },
  "measurement.warehouse_pallet_positions": { description: "Pallet positions from storage area and pallet footprint.", requiredInputs: ["storageArea","palletFootprint","aisleFactor"], outputHint: "number" },
  "measurement.warehouse_vertical_cap": { description: "Vertical storage capacity from pallet positions and rack levels.", requiredInputs: ["palletPositions","rackLevels"], outputHint: "number" },
  "measurement.warehouse_door_throughput": { description: "Door throughput capacity from doors and turnaround time.", requiredInputs: ["doors","turnaroundLoad","turnaroundUnload"], outputHint: "number" },
  "cost.warehouse_cost_per_pos": { description: "Cost per pallet position.", requiredInputs: ["facilityCost","palletPositions"], outputHint: "currency" },
  "cost.absenteeism_direct": { description: "Direct absenteeism cost including burden.", requiredInputs: ["absentHours","hourlyRate","burden"], outputHint: "currency" },
  "cost.absenteeism_ot": { description: "Overtime premium cost for replacement.", requiredInputs: ["replaceOT","otRate","regRate"], outputHint: "currency" },
  "cost.absenteeism_temp": { description: "Temporary worker cost.", requiredInputs: ["tempHours","tempRate","markup"], outputHint: "currency" },
  "cost.absenteeism_prod": { description: "Production loss cost from absenteeism.", requiredInputs: ["absentHours","outputPerHour","margin","effDrop"], outputHint: "currency" },
  "cost.absenteeism_admin": { description: "Admin cost per absenteeism event.", requiredInputs: ["events","hrTime","hrRate"], outputHint: "currency" },
  "cost.absenteeism_bradford": { description: "Bradford factor score for absenteeism pattern.", requiredInputs: ["events","days"], outputHint: "score" },
  "cost.absenteeism_total": { description: "Total absenteeism cost.", requiredInputs: ["directCost","otPremium","tempCost","prodLoss","adminCost"], outputHint: "currency" },
  "cost.digital_twin_cost_trad": { description: "Traditional approach cost for testing/physical iterations.", requiredInputs: ["prototyping","fieldTest","downtime","travel"], outputHint: "currency" },
  "cost.digital_twin_cost_dt": { description: "Digital twin approach cost for software/sensors.", requiredInputs: ["license","compute","sensor","modeling"], outputHint: "currency" },
  "cost.digital_twin_time_gain": { description: "Time gain from digital twin iteration speed.", requiredInputs: ["physCycle","digCycle","iterations"], outputHint: "duration" },
  "cost.digital_twin_roi": { description: "ROI of digital twin investment.", requiredInputs: ["costTrad","costDt","revenueGain","qualitySavings"], outputHint: "number" },
  "measurement.sewing_takt_time": { description: "Takt time for sewing line.", requiredInputs: ["availableTime","demand"], outputHint: "duration" },
  "measurement.sewing_theo_op": { description: "Theoretical operators needed.", requiredInputs: ["cycleTotal","taktTime"], outputHint: "number" },
  "measurement.sewing_line_eff": { description: "Sewing line efficiency percentage.", requiredInputs: ["cycleTotal","actOperators","taktTime"], outputHint: "percentage" },
  "measurement.sewing_balance_delay": { description: "Balance delay percentage.", requiredInputs: ["lineEff"], outputHint: "percentage" },
  "measurement.sewing_smoothness": { description: "Smoothness index for line balance.", requiredInputs: [], outputHint: "score" },
  "cost.dye_batch": { description: "Total dye batch cost including dye, chem, water, energy, waste.", requiredInputs: ["dyeCost","chemCost","waterCost","energyCost","wasteCost"], outputHint: "currency" },
  "cost.dye_rft_savings": { description: "RFT rework savings.", requiredInputs: ["rework","rft"], outputHint: "currency" },
  "cost.dye_cost_per_kg": { description: "Cost per kg of dyed fabric.", requiredInputs: ["totalBatch","rftSavings","fabricWeight"], outputHint: "currency" },
  "energy.power_factor": { description: "Power factor from active and reactive power.", requiredInputs: ["active","reactive"], outputHint: "number" },
  "energy.reactive_penalty": { description: "Reactive power penalty cost.", requiredInputs: ["pf","pfThresh","reactive","active","tariff"], outputHint: "currency" },
  "energy.demand_charge": { description: "Demand charge from peak kW.", requiredInputs: ["peakKw","demandRate"], outputHint: "currency" },
  "energy.carbon_energy": { description: "Carbon cost from energy consumption.", requiredInputs: ["active","emisFactor","carbonPrice"], outputHint: "currency" },
  "cost.escalation_material": { description: "Material cost escalation factor over years.", requiredInputs: ["inflMat","years"], outputHint: "number" },
  "cost.escalation_labor": { description: "Labor cost escalation factor over years.", requiredInputs: ["inflLab","years"], outputHint: "number" },
  "cost.real_discount": { description: "Real discount rate from nominal and inflation.", requiredInputs: ["nominal","infl"], outputHint: "number" },
  "cost.env_fire_disposal": { description: "Waste disposal cost.", requiredInputs: ["waste","dispFee"], outputHint: "currency" },
  "cost.env_fire_haz": { description: "Hazardous waste disposal cost.", requiredInputs: ["hazMass","hazFee","surcharge"], outputHint: "currency" },
  "cost.env_fire_recycle": { description: "Recycling net cost after scrap revenue.", requiredInputs: ["recycMass","sortCost","scrapRev"], outputHint: "currency" },
  "cost.env_fire_emis": { description: "Emission cost from air and water.", requiredInputs: ["air","carbonPrice","water","treatCost"], outputHint: "currency" },
  "cost.env_fire_penalty_risk": { description: "Expected penalty from regulatory violation.", requiredInputs: ["probViolation","fine"], outputHint: "currency" },
  "cost.env_fire_total": { description: "Total environmental waste cost.", requiredInputs: ["disposalCost","hazCost","recycleCost","emisCost","penaltyRisk"], outputHint: "currency" },
  "cost.eoq": { description: "Economic order quantity.", requiredInputs: ["annualDemand","orderCost","holdingCost"], outputHint: "number" },
  "measurement.eoq_rop": { description: "Reorder point with safety stock.", requiredInputs: ["leadTime","dailyDemand","safetyStock"], outputHint: "number" },
  "measurement.eoq_safety_stock": { description: "Safety stock from service level and demand variability.", requiredInputs: ["zScore","stdDev","leadTime"], outputHint: "number" },
  "cost.eoq_total_inv": { description: "Total inventory cost including ordering and holding.", requiredInputs: ["annualDemand","eoq","orderCost","safetyStock","holdingCost"], outputHint: "currency" },
  "cost.evm_sv": { description: "Schedule variance (EV - PV).", requiredInputs: ["ev","pv"], outputHint: "currency" },
  "cost.evm_cv": { description: "Cost variance (EV - AC).", requiredInputs: ["ev","ac"], outputHint: "currency" },
  "cost.evm_spi": { description: "Schedule performance index.", requiredInputs: ["ev","pv"], outputHint: "number" },
  "cost.evm_cpi": { description: "Cost performance index.", requiredInputs: ["ev","ac"], outputHint: "number" },
  "cost.evm_eac_cpi": { description: "Estimate at completion using CPI.", requiredInputs: ["bac","cpi"], outputHint: "currency" },
  "cost.evm_eac_cpi_spi": { description: "Estimate at completion using CPI and SPI.", requiredInputs: ["ac","bac","ev","cpi","spi"], outputHint: "currency" },
  "cost.evm_vac": { description: "Variance at completion.", requiredInputs: ["bac","eac"], outputHint: "currency" },
  "measurement.layout_flow_cost": { description: "Flow distance cost from layout matrix.", requiredInputs: [], outputHint: "currency" },
  "cost.ir_exposure": { description: "Interest rate exposure after hedge.", requiredInputs: ["floatingDebt","hedgeRatio"], outputHint: "currency" },
  "cost.ir_shock_impact": { description: "Shock impact on interest exposure.", requiredInputs: ["exposure","bpsChange"], outputHint: "currency" },
  "cost.ir_dur_gap": { description: "Duration gap between assets and liabilities.", requiredInputs: ["assetDur","liabDur"], outputHint: "duration" },
  "cost.ir_eve_change": { description: "Economic value of equity change.", requiredInputs: ["durGap","assetVal","rateChange"], outputHint: "currency" },
  "cost.filament_virgin": { description: "Virgin filament cost including scrap and transport.", requiredInputs: ["priceV","scrapV","transpV"], outputHint: "currency" },
  "cost.filament_recycle": { description: "Recycled filament cost per unit.", requiredInputs: ["collect","sort","pellet","yield"], outputHint: "currency" },
  "cost.filament_total_r": { description: "Total recycled filament cost after adjustments.", requiredInputs: ["costRecyc","qualPenalty","energySav","carbonCred"], outputHint: "currency" },
  "cost.filament_roi": { description: "ROI of filament recycling investment.", requiredInputs: ["costV","totalR","volume","capex"], outputHint: "number" },
  "measurement.price_elasticity": { description: "Price elasticity of demand.", requiredInputs: ["pctChangeDem","pctChangePrice"], outputHint: "number" },
  "cost.price_elast_new_rev": { description: "New revenue after price change.", requiredInputs: ["newPrice","newDem"], outputHint: "currency" },
  "cost.price_elast_new_margin": { description: "New margin after price change.", requiredInputs: ["newPrice","varCost","newDem","fixed"], outputHint: "currency" },
  "cost.flex_mfg_cost_ded": { description: "Dedicated line total cost.", requiredInputs: ["machDed","setupDed","changeovers","invHigh"], outputHint: "currency" },
  "cost.flex_mfg_cost_fms": { description: "FMS line total cost.", requiredInputs: ["machFms","toolFms","prog","maint"], outputHint: "currency" },
  "cost.flex_mfg_flex_val": { description: "Flexibility value from TTM and customer premium.", requiredInputs: ["ttmRed","revGain","custPrem","volume"], outputHint: "currency" },
  "cost.flex_mfg_roi": { description: "Flexible manufacturing ROI.", requiredInputs: ["costDed","costFms","flexVal","invSav","scrapRed","capex"], outputHint: "number" },
  "measurement.grr_combined": { description: "GRR combined percentage from gage study.", requiredInputs: [], outputHint: "percentage" },
  "cost.grr_error_cost": { description: "Cost impact from gage measurement errors.", requiredInputs: ["falseAcc","escapeCost","falseRej","scrapCost"], outputHint: "currency" },
  "measurement.food_yield": { description: "Food yield ratio of finished to raw.", requiredInputs: ["finished","raw"], outputHint: "number" },
  "cost.food_shrink_cost": { description: "Shrinkage cost from raw-to-finished loss.", requiredInputs: ["raw","finished","rawCost"], outputHint: "currency" },
  "cost.food_spoil_cost": { description: "Spoilage cost.", requiredInputs: ["spoiled","prodCost"], outputHint: "currency" },
  "cost.food_margin_leak": { description: "Total food margin leak from shrinkage, spoilage, and overproduction.", requiredInputs: ["shrinkCost","spoilCost","overCost"], outputHint: "currency" },
  "measurement.fertilizer_need": { description: "Fertilizer nutrient need adjusted for soil and efficiency.", requiredInputs: ["nutReq","soilSupp","eff"], outputHint: "number" },
  "cost.fertilizer_cost": { description: "Fertilizer cost for application area.", requiredInputs: ["appRate","area","price"], outputHint: "currency" },
  "cost.fertilizer_roi": { description: "Fertilizer return on investment.", requiredInputs: ["yieldInc","cropPrice","cost"], outputHint: "number" },
  "cost.haccp_hold": { description: "Quarantine hold cost.", requiredInputs: ["quarVol","holdCost","days"], outputHint: "currency" },
  "cost.haccp_test": { description: "Lab test cost for deviation samples.", requiredInputs: ["samples","labCost"], outputHint: "currency" },
  "cost.haccp_rework": { description: "Rework cost for deviated product.", requiredInputs: ["devVol","reworkCost"], outputHint: "currency" },
  "cost.haccp_disp": { description: "Disposal cost for condemned product.", requiredInputs: ["condVol","dispCost","lostMat"], outputHint: "currency" },
  "cost.haccp_recall": { description: "Recall cost including notification, logistics, retail penalty, and brand damage.", requiredInputs: ["notif","logRev","retailPen","brand"], outputHint: "currency" },
  "cost.haccp_fine": { description: "Expected regulatory fine.", requiredInputs: ["probDet","fineAmt"], outputHint: "currency" },
  "cost.haccp_total": { description: "Total HACCP deviation cost.", requiredInputs: ["holdCost","testCost","reworkCost","dispCost","recallCost","fineRisk"], outputHint: "currency" },
  "measurement.volumetric_weight_air": { description: "Volumetric weight for air freight (CBM/6000).", requiredInputs: ["length","width","height"], outputHint: "number" },
  "measurement.volumetric_weight_road": { description: "Volumetric weight for road freight (CBM/5000).", requiredInputs: ["length","width","height"], outputHint: "number" },
  "measurement.volumetric_weight_sea": { description: "Volumetric weight for sea freight (CBM/1000).", requiredInputs: ["length","width","height"], outputHint: "number" },
  "cost.volumetric_freight": { description: "Freight cost based on chargeable weight.", requiredInputs: ["gross","volWeight","rate"], outputHint: "currency" },
  "measurement.lightweight_weight_red": { description: "Weight reduction from lightweight design.", requiredInputs: ["massOrig","massLw"], outputHint: "number" },
  "cost.lightweight_annual_fuel_sav": { description: "Annual fuel savings from weight reduction.", requiredInputs: ["weightRed","fuelFactor","distance","fuelPrice"], outputHint: "currency" },
  "cost.lightweight_net_sav": { description: "Net lifecycle savings from lightweight design.", requiredInputs: ["fuelSav","payloadGain","life","matPrem","toolDelta"], outputHint: "currency" },
  "cost.scrap_optimize_total": { description: "Total scrap cost including material, labor, overhead, and opportunity.", requiredInputs: ["scrapMat","scrapLab","scrapOh","oppCost","salvage"], outputHint: "currency" },
  "measurement.hvac_sensible": { description: "Sensible heat load in BTU/h.", requiredInputs: ["cfm","deltaT"], outputHint: "number" },
  "measurement.hvac_latent": { description: "Latent heat load in BTU/h.", requiredInputs: ["cfm","deltaW"], outputHint: "number" },
  "measurement.hvac_total_load": { description: "Total cooling load in BTU/h.", requiredInputs: ["sensible","latent"], outputHint: "number" },
  "measurement.hvac_tons": { description: "Cooling capacity in tons.", requiredInputs: ["totalLoad"], outputHint: "number" },
  "energy.hydraulic_heat_loss": { description: "Total hydraulic system heat loss from leaks, friction, and valves.", requiredInputs: ["qLeak","p","deltaPPipe","qFlow","deltaPValve"], outputHint: "number" },
  "cost.hydraulic_loss_cost": { description: "Energy cost of hydraulic losses.", requiredInputs: ["heat","hours","elecRate"], outputHint: "currency" },
  "energy.fouling_resistance": { description: "Fouling resistance from clean and dirty U values.", requiredInputs: ["uDirty","uClean"], outputHint: "number" },
  "energy.heat_exchanger_loss": { description: "Heat loss from fouling.", requiredInputs: ["area","uClean","lmtd","uDirty"], outputHint: "number" },
  "cost.fouling_energy_penalty": { description: "Energy penalty cost from fouling.", requiredInputs: ["heatLoss","hours","boilEff","fuelCost"], outputHint: "currency" },
  "energy.enpi": { description: "Energy performance indicator (energy per unit volume).", requiredInputs: ["energy","volume"], outputHint: "number" },
  "energy.enpi_cusum": { description: "CUSUM energy savings.", requiredInputs: ["predicted","actual"], outputHint: "number" },
  "cost.irr_simple": { description: "Net present value of cash flow stream.", requiredInputs: ["cashFlows","discountRate","initialInv"], outputHint: "currency" },
  "cost.irr_approx": { description: "Simple IRR approximation.", requiredInputs: ["cashFlows","initialInv"], outputHint: "number" },
  "cost.feed_base_cost": { description: "Base feed cost per ton from inclusion rates and prices.", requiredInputs: ["inclRates","prices"], outputHint: "currency" },
  "cost.feed_cost_per_kg_live": { description: "Feed cost per kg live weight.", requiredInputs: ["baseCost","procCost","addCost","shrinkRate","fcr"], outputHint: "currency" },
  "measurement.scaffold_area": { description: "Scaffold surface area.", requiredInputs: ["perimeter","height"], outputHint: "number" },
  "cost.scaffold_total": { description: "Total scaffold cost including rental, erection, dismantling, and transport.", requiredInputs: ["area","rate","duration","erectRate","dismRate","trips","truckRate"], outputHint: "currency" },
  "measurement.spc_x_bar_avg": { description: "Average of subgroup means for X-bar chart.", requiredInputs: ["data"], outputHint: "number" },
  "measurement.spc_r_bar": { description: "Average range for R chart.", requiredInputs: ["data"], outputHint: "number" },
  "measurement.machining_mrr": { description: "Material removal rate.", requiredInputs: ["vc","feed","ap"], outputHint: "number" },
  "measurement.machining_power": { description: "Machining power required.", requiredInputs: ["mrr","specEnergy"], outputHint: "number" },
  "cost.kaizen_hard_savings": { description: "Hard savings from kaizen (baseline - actual) × volume.", requiredInputs: ["baseline","actual","volume"], outputHint: "currency" },
  "cost.kaizen_soft_savings": { description: "Soft savings from time reduction.", requiredInputs: ["timeSaved","labRate","conv"], outputHint: "currency" },
  "cost.kaizen_roi": { description: "Kaizen project ROI.", requiredInputs: ["hardSav","softSav","impCost"], outputHint: "number" },
  // ── Missing stub META entries ──
  "cost.absenteeism_prod_loss": { description: "Production loss from absenteeism.", requiredInputs: ["absentHours","outputPerHour","margin","effDrop"], outputHint: "currency" },
  "cost.digital_twin_revenue_gain": { description: "Revenue gain from earlier market entry via digital twin.", requiredInputs: ["timeGain","dailyRev"], outputHint: "currency" },
  "cost.digital_twin_quality_savings": { description: "Quality cost savings from digital twin defect reduction.", requiredInputs: ["defectReduction","warrantyCost","volume"], outputHint: "currency" },
  "cost.digital_twin_total_savings": { description: "Total savings from digital twin.", requiredInputs: ["revenueGain","qualitySavings"], outputHint: "currency" },
  "cost.env_fire_emissions": { description: "Emission cost from air and water pollutants.", requiredInputs: ["air","carbonPrice","water","treatCost"], outputHint: "currency" },
  "cost.env_fire_recycling": { description: "Recycling cost net of scrap recovery.", requiredInputs: ["recycMass","sortCost","scrapRev"], outputHint: "currency" },
  "cost.eoq_total_cost": { description: "Total inventory cost from ordering and holding.", requiredInputs: ["annualDemand","eoq","orderCost","safetyStock","holdingCost"], outputHint: "currency" },
  "cost.escalation_contingency": { description: "Escalation contingency based on confidence factor.", requiredInputs: ["baseAdj","confFactor"], outputHint: "currency" },
  "cost.escalation_real_discount": { description: "Real discount rate derived from nominal and inflation.", requiredInputs: ["nominal","infl"], outputHint: "number" },
  "cost.feed_cost_per_kg": { description: "Feed cost per kg live weight including all cost factors.", requiredInputs: ["baseCost","procCost","addCost","shrinkRate","fcr"], outputHint: "currency" },
  "cost.filament_recycled": { description: "Recycled filament production cost per unit.", requiredInputs: ["collect","sort","pellet","yield"], outputHint: "currency" },
  "cost.grr_cost_error": { description: "Cost impact from gage measurement errors.", requiredInputs: ["falseAcc","escapeCost","falseRej","scrapCost"], outputHint: "currency" },
  "cost.haccp_disposal": { description: "Disposal cost for condemned product.", requiredInputs: ["condVol","dispCost","lostMat"], outputHint: "currency" },
  "cost.hvac_annual_cost": { description: "HVAC annual operating energy cost.", requiredInputs: ["totalLoad","eer","hours","elecRate"], outputHint: "currency" },
  "cost.ir_var": { description: "Value at risk for interest rate exposure.", requiredInputs: ["portVal","volatility","zScore"], outputHint: "currency" },
  "cost.kaizen_payback": { description: "Kaizen project payback period in months.", requiredInputs: ["impCost","monthSav"], outputHint: "duration" },
  "cost.kaizen_sustainability": { description: "Kaizen savings sustainability ratio (M6/M1).", requiredInputs: ["savM6","savM1"], outputHint: "number" },
  "cost.layout_total_cost": { description: "Total factory layout cost from material handling, space, and congestion.", requiredInputs: ["matHandCost","spaceUtil","spaceCost","congestion","congCost"], outputHint: "currency" },
  "cost.lightweight_fuel_savings": { description: "Annual fuel savings from weight reduction.", requiredInputs: ["weightRed","fuelFactor","distance","fuelPrice"], outputHint: "currency" },
  "cost.lightweight_net_savings": { description: "Net lifecycle savings from lightweight design.", requiredInputs: ["fuelSav","payloadGain","life","matPrem","toolDelta"], outputHint: "currency" },
  "cost.lightweight_payload_gain": { description: "Payload revenue gain from weight reduction.", requiredInputs: ["weightRed","revPerKg"], outputHint: "currency" },
  "cost.ltv_cac": { description: "LTV / CAC ratio for customer profitability.", requiredInputs: ["discountedClv","cac"], outputHint: "number" },
  "cost.npv": { description: "Net present value of cash flow stream.", requiredInputs: ["cashFlows","discountRate","initialInv"], outputHint: "currency" },
  "cost.payback": { description: "CAC payback period in months.", requiredInputs: ["cac","avgOrderValue","purchaseFreq","grossMarginPct"], outputHint: "duration" },
  "cost.payback_period": { description: "Simple payback period in years.", requiredInputs: ["yearBefore","unrecovered","cashRec"], outputHint: "duration" },
  "cost.price_optimal_markup": { description: "Optimal markup based on price elasticity.", requiredInputs: ["elasticity"], outputHint: "number" },
  "cost.profitability_index": { description: "Profitability index (PI) of investment.", requiredInputs: ["cashFlows","discountRate","initialInv"], outputHint: "number" },
  "cost.scaffold_rental": { description: "Scaffold rental cost from area, rate, and duration.", requiredInputs: ["area","rate","duration"], outputHint: "currency" },
  "cost.scaffold_labor": { description: "Scaffold erection and dismantling labor cost.", requiredInputs: ["area","erectRate","dismRate"], outputHint: "currency" },
  "energy.cusum": { description: "CUSUM energy savings (predicted - actual).", requiredInputs: ["predicted","actual"], outputHint: "number" },
  "energy.energy_carbon_footprint": { description: "Carbon footprint from energy consumption.", requiredInputs: ["active","emisFactor"], outputHint: "number" },
  "energy.energy_savings": { description: "Energy savings from baseline.", requiredInputs: ["predicted","actual"], outputHint: "number" },
  "energy.energy_total_bill": { description: "Total energy bill including all charges.", requiredInputs: ["baseCharge","touCharge","demandCharge","reactivePenalty","tax"], outputHint: "currency" },
  "energy.fouling_cost": { description: "Energy penalty cost from fouling.", requiredInputs: ["heatLoss","hours","boilEff","fuelCost"], outputHint: "currency" },
  "energy.fouling_roi": { description: "ROI of fouling cleaning investment.", requiredInputs: ["totalCost","cleanCost"], outputHint: "number" },
  "energy.hydraulic_cost": { description: "Energy cost of hydraulic losses.", requiredInputs: ["heat","hours","elecRate"], outputHint: "currency" },
  "energy.hydraulic_eff": { description: "Hydraulic system efficiency percentage.", requiredInputs: ["pOut","pIn"], outputHint: "percentage" },
  "measurement.cnc_oee_availability": { description: "CNC OEE availability ratio.", requiredInputs: ["plannedTime","downtime"], outputHint: "number" },
  "measurement.cnc_tool_change_time": { description: "CNC total tool change time.", requiredInputs: ["changeCount","timePerChange"], outputHint: "duration" },
  "measurement.cpk_ppm_total": { description: "Total PPM out of specification.", requiredInputs: ["pTotal"], outputHint: "number" },
  "measurement.cpk_sigma_short": { description: "Short-term sigma level with 1.5 shift.", requiredInputs: ["cpk"], outputHint: "number" },
  "measurement.cpm_eot_claim": { description: "EOT claim days adjusted by efficiency factor.", requiredInputs: ["excusableDelay","effFactor"], outputHint: "duration" },
  "measurement.eoq_turnover": { description: "Inventory turnover ratio.", requiredInputs: ["annualDemand","avgInv"], outputHint: "number" },
  "measurement.feed_fcr": { description: "Feed conversion ratio.", requiredInputs: ["feedCons","weightGain"], outputHint: "number" },
  "measurement.fertilizer_application": { description: "Fertilizer application rate adjusted for content.", requiredInputs: ["fertNeed","contentPct"], outputHint: "number" },
  "measurement.grr_pct": { description: "GRR as percentage of total variation.", requiredInputs: ["grr","tv"], outputHint: "percentage" },
  "measurement.hvac_total_btu": { description: "Total HVAC cooling load in BTU/h.", requiredInputs: ["sensible","latent"], outputHint: "number" },
  "measurement.layout_space_util": { description: "Factory floor space utilization.", requiredInputs: ["equipArea","facArea"], outputHint: "number" },
  "measurement.machining_strategy_check": { description: "Machining strategy feasibility check (1=pass, 0=fail).", requiredInputs: ["power","maxPower","ra","tol"], outputHint: "score" },
  "measurement.machining_tool_life": { description: "Taylor tool life estimation.", requiredInputs: ["cTaylor","vc","nTaylor","feed","mTaylor"], outputHint: "duration" },
  "measurement.sewing_line_efficiency": { description: "Sewing line balance efficiency percentage.", requiredInputs: ["cycleTotal","actOperators","taktTime"], outputHint: "percentage" },
  "measurement.smed_capacity_gain": { description: "SMED capacity gain as ratio.", requiredInputs: ["totalSetup","targetTime","changeoverFreq","availableTime"], outputHint: "number" },
  "measurement.spc_cp": { description: "Process capability index Cp.", requiredInputs: ["usl","lsl","sigma"], outputHint: "number" },
  "measurement.spc_lcl_x": { description: "X-bar chart lower control limit.", requiredInputs: ["xBarBar","a2","rBar"], outputHint: "number" },
  "measurement.spc_sigma_estimate": { description: "Sigma estimate from average range.", requiredInputs: ["rBar","d2"], outputHint: "number" },
  "measurement.spc_ucl_x": { description: "X-bar chart upper control limit.", requiredInputs: ["xBarBar","a2","rBar"], outputHint: "number" },
  "measurement.volumetric_chargeable": { description: "Chargeable weight based on volumetric vs gross.", requiredInputs: ["length","width","height","mode","gross"], outputHint: "number" },
  "measurement.warehouse_pick_efficiency": { description: "Pick efficiency lines per travel time.", requiredInputs: ["lines","travelTime"], outputHint: "number" },
  "measurement.warehouse_throughput_cap": { description: "Door throughput capacity.", requiredInputs: ["doors","turnaroundLoad","turnaroundUnload"], outputHint: "number" },
  "cost.paf_prevention": { description: "Sum of training, quality planning, supplier evaluation, and design review costs.", requiredInputs: ["training","qualityPlanning","supplierScore","designReview"], outputHint: "currency" },
  "cost.paf_appraisal": { description: "Sum of inspection, testing, calibration, and audit costs.", requiredInputs: ["inspection","testing","calibration","audit"], outputHint: "currency" },
  "cost.paf_internal_failure": { description: "Sum of scrap, rework, reinspection, and downtime costs.", requiredInputs: ["scrap","rework","reinspection","downtime"], outputHint: "currency" },
  "cost.paf_external_failure": { description: "Sum of warranty, returns, recall, liability, and lost sales costs.", requiredInputs: ["warranty","returns","recall","liability","lostSales"], outputHint: "currency" },
  "cost.paf_total": { description: "Total cost of quality (prevention + appraisal + internal + external).", requiredInputs: ["prevention","appraisal","internalFailure","externalFailure"], outputHint: "currency" },
  "cost.paf_ratio": { description: "COQ as a ratio of total revenue.", requiredInputs: ["totalCoq","totalRevenue"], outputHint: "number" },
  "cost.paf_p_ratio": { description: "Prevention cost as a ratio of total COQ.", requiredInputs: ["prevention","totalCoq"], outputHint: "number" },
  "measurement.carbon_scope1": { description: "Scope 1 emissions from fuel combustion and fugitive sources.", requiredInputs: ["fuelConsumption","fuelEF","fugitive"], outputHint: "number" },
  "measurement.carbon_scope2_market": { description: "Scope 2 market-based emissions adjusted for RECs.", requiredInputs: ["electricity","gridEF","recFactor"], outputHint: "number" },
  "measurement.carbon_scope3_upstream": { description: "Scope 3 upstream emissions from materials and logistics.", requiredInputs: ["material","materialEF","logisticsEF"], outputHint: "number" },
  "measurement.carbon_total": { description: "Total carbon emissions across scope 1, 2, and 3.", requiredInputs: ["scope1","scope2Market","scope3"], outputHint: "number" },
  "measurement.carbon_intensity": { description: "Carbon emissions per unit of production volume.", requiredInputs: ["totalCarbon","productionVolume"], outputHint: "number" },
  "cost.carbon_financial_risk": { description: "Financial exposure from total carbon at a given carbon price.", requiredInputs: ["totalCarbon","carbonPrice"], outputHint: "currency" },
  "measurement.weld_area": { description: "Fillet weld cross-sectional area from leg length.", requiredInputs: ["leg"], outputHint: "number" },
  "measurement.weld_volume": { description: "Weld volume from area and length.", requiredInputs: ["weldArea","weldLength"], outputHint: "number" },
  "measurement.weld_deposited_weight": { description: "Deposited weld metal weight.", requiredInputs: ["weldVolume","density"], outputHint: "number" },
  "measurement.weld_electrode_weight": { description: "Electrode weight needed accounting for deposition efficiency.", requiredInputs: ["depositedWeight","depEff"], outputHint: "number" },
  "cost.weld_filler_cost": { description: "Filler metal cost from electrode weight.", requiredInputs: ["electrodeWeight","pricePerKg"], outputHint: "currency" },
  "cost.weld_gas_cost": { description: "Shielding gas cost from flow rate, arc time, and gas price.", requiredInputs: ["gasFlowRate","arcTime","gasPrice"], outputHint: "currency" },
  "cost.weld_power_cost": { description: "Welding power cost from voltage, current, arc time, and machine efficiency.", requiredInputs: ["voltage","current","arcTime","machineEff","elecRate"], outputHint: "currency" },
  "cost.weld_total_cost": { description: "Total weld cost including filler, gas, power, and labor.", requiredInputs: ["fillerCost","gasCost","powerCost","arcTime","depRate","laborRate"], outputHint: "currency" },
  "measurement.weld_op_factor": { description: "Welding operating factor from arc time vs total shift time.", requiredInputs: ["arcTime","totalShiftTime"], outputHint: "number" },
  "measurement.weld_deposition_rate": { description: "Deposition rate from deposited weight and arc time.", requiredInputs: ["depositedWeight","arcTime"], outputHint: "number" },
  "cost.weld_joint_cost": { description: "Total cost per weld joint including labor, overhead, filler, gas, and power.", requiredInputs: ["weldLength","travelSpeed","laborRate","overheadRate","opFactor","fillerCost","gasCost","powerCost"], outputHint: "currency" },
  "cost.weld_cost_per_meter": { description: "Weld cost per meter of joint.", requiredInputs: ["jointCost","weldLength"], outputHint: "currency" },
  "cost.weld_consumable_pct": { description: "Consumable cost as percentage of joint cost.", requiredInputs: ["fillerCost","jointCost"], outputHint: "number" },
  "measurement.weld_throat": { description: "Fillet weld throat thickness from leg length.", requiredInputs: ["leg"], outputHint: "number" },
  "measurement.weld_shear_area": { description: "Weld shear area from throat thickness and length.", requiredInputs: ["throat","weldLength"], outputHint: "number" },
  "measurement.weld_allowable_stress": { description: "Allowable weld stress based on tensile strength.", requiredInputs: ["tensileStrength"], outputHint: "number" },
  "measurement.weld_max_shear_load": { description: "Maximum shear load capacity of the weld.", requiredInputs: ["shearArea","allowableStress"], outputHint: "number" },
  "measurement.weld_safety_factor": { description: "Weld safety factor from max shear load vs applied load.", requiredInputs: ["maxShearLoad","appliedLoad"], outputHint: "number" },
  "cost.beam_material": { description: "Beam material cost from length, weight per meter, and price per kg.", requiredInputs: ["beamLength","beamWeightPerM","materialPricePerKg"], outputHint: "currency" },
  "measurement.cut_fill_net": { description: "Net cut/fill volume (cut minus fill).", requiredInputs: ["cutVolume","fillVolume"], outputHint: "number" },
  "measurement.cut_fill_borrow": { description: "Borrow volume needed when fill exceeds cut.", requiredInputs: ["fillVolume","cutVolume"], outputHint: "number" },
  "measurement.cut_fill_waste": { description: "Waste volume when cut exceeds fill.", requiredInputs: ["cutVolume","fillVolume"], outputHint: "number" },
  "cost.cut_fill_haul": { description: "Haul cost for earthmoving volumes.", requiredInputs: ["cutVolume","fillVolume","haulRate"], outputHint: "currency" },
  "measurement.leak_flow_cfm": { description: "Compressed air leak flow rate in CFM.", requiredInputs: ["leakArea","pressure"], outputHint: "number" },
  "measurement.leak_power_loss": { description: "Power loss from compressed air leak.", requiredInputs: ["leakFlowCfm","pressure"], outputHint: "number" },
  "measurement.leak_annual_energy": { description: "Annual energy lost to the leak.", requiredInputs: ["leakPowerLoss","runningHours"], outputHint: "number" },
  "cost.leak_cost": { description: "Annual energy cost of a single leak.", requiredInputs: ["leakAnnualEnergy","energyRate"], outputHint: "currency" },
  "cost.leak_total_cost": { description: "Total leak cost across all leaks.", requiredInputs: ["leakCost","leakCount"], outputHint: "currency" },
  "measurement.leak_carbon": { description: "Carbon footprint of the compressed air leak.", requiredInputs: ["leakAnnualEnergy","gridCarbonFactor"], outputHint: "number" },
  "cost.leak_payback": { description: "Payback period for repairing a leak.", requiredInputs: ["repairCost","leakCost"], outputHint: "number" },
  "measurement.tank_required_vol": { description: "Required tank volume based on demand and reserve days.", requiredInputs: ["demand","reserveDays"], outputHint: "number" },
  "measurement.tank_cycle_time": { description: "Tank cycle time from capacity and feed rate.", requiredInputs: ["tankCapacity","feedRate"], outputHint: "duration" },
  "measurement.tank_cycles_per_hour": { description: "Number of tank cycles per hour.", requiredInputs: ["cycleTime"], outputHint: "number" },
  "measurement.tank_motor_check": { description: "Motor sizing ratio (required vs installed power).", requiredInputs: ["requiredPower","motorPower"], outputHint: "number" },
  "cost.tank_cost": { description: "Tank cost estimate from capacity and unit cost.", requiredInputs: ["tankCapacity","costPerUnitVol"], outputHint: "currency" },
  "measurement.container_vol_util": { description: "Container volume utilization ratio.", requiredInputs: ["cargoVol","containerVol"], outputHint: "number" },
  "measurement.container_weight_util": { description: "Container weight utilization ratio.", requiredInputs: ["cargoWeight","maxPayload"], outputHint: "number" },
  "measurement.container_efficiency": { description: "Combined container efficiency score (vol + weight).", requiredInputs: ["volUtil","weightUtil"], outputHint: "number" },
  "cost.container_waste_cost": { description: "Waste cost from unused container volume.", requiredInputs: ["volUtil","containerCost"], outputHint: "currency" },
  "measurement.fabric_marker_eff": { description: "Fabric marker efficiency from net to gross area.", requiredInputs: ["netArea","grossArea"], outputHint: "number" },
  "measurement.fabric_required": { description: "Fabric required adjusted for marker efficiency.", requiredInputs: ["netArea","markerEff"], outputHint: "number" },
  "cost.fabric_cost": { description: "Fabric cost from required yardage and unit price.", requiredInputs: ["fabricRequired","pricePerUnit"], outputHint: "currency" },
  "cost.fabric_util_gain": { description: "Savings from improved fabric utilization.", requiredInputs: ["oldWaste","newWaste","pricePerUnit","totalYards"], outputHint: "currency" },
  "measurement.fabric_total_yardage": { description: "Total fabric yardage for given pieces.", requiredInputs: ["pieces","fabricRequired"], outputHint: "number" },
  "cost.fx_exposure": { description: "Foreign exchange exposure at spot rate.", requiredInputs: ["fxAmount","spotRate"], outputHint: "currency" },
  "cost.fx_var_historical": { description: "Historical value-at-risk for FX position.", requiredInputs: ["fxExposure","historicalVol"], outputHint: "currency" },
  "cost.fx_var_parametric": { description: "Parametric value-at-risk for FX position.", requiredInputs: ["fxExposure","stdDev"], outputHint: "currency" },
  "cost.fx_unhedged_var": { description: "Unhedged FX VaR from expected move.", requiredInputs: ["fxExposure","expectedMove"], outputHint: "currency" },
  "cost.fx_hedge_cost": { description: "Cost of hedging FX exposure.", requiredInputs: ["fxExposure","hedgePremiumPct"], outputHint: "currency" },
  "cost.fx_net_impact": { description: "Net FX impact after hedge cost.", requiredInputs: ["unhedgedVar","hedgeCost"], outputHint: "currency" },
  "cost.energy_charge": { description: "Energy charge from consumption and rate.", requiredInputs: ["consumptionKwh","ratePerKwh"], outputHint: "currency" },
  "cost.reactive_penalty_kwh": { description: "Reactive power penalty on energy bill.", requiredInputs: ["reactivePower","reactiveAllowance","penaltyRate"], outputHint: "currency" },
  "cost.total_bill_kwh": { description: "Total energy bill including charges, penalties, and tax.", requiredInputs: ["energyCharge","fixedCharge","reactivePenalty","tax"], outputHint: "currency" },
  "cost.unit_cost_kwh": { description: "Unit cost per kWh from total bill and consumption.", requiredInputs: ["totalBill","totalConsumption"], outputHint: "currency" },
  "cost.peak_shaving_savings": { description: "Savings from peak demand shaving.", requiredInputs: ["peakDemand","shavedDemand","demandCharge"], outputHint: "currency" },
  "measurement.route_drift_pct": { description: "Route drift as percentage over planned distance.", requiredInputs: ["actualKm","plannedKm"], outputHint: "percentage" },
  "cost.route_fuel_waste": { description: "Fuel waste cost from excess route distance.", requiredInputs: ["actualKm","plannedKm","fuelPerKm","fuelPrice"], outputHint: "currency" },
  "cost.route_time_waste": { description: "Time waste cost from excess route time.", requiredInputs: ["actualTime","plannedTime","costPerHour"], outputHint: "currency" },
  "measurement.route_efficiency": { description: "Route efficiency ratio (planned / actual).", requiredInputs: ["plannedKm","actualKm"], outputHint: "number" },
  "cost.route_total_loss": { description: "Total route loss from fuel and time waste.", requiredInputs: ["routeFuelWaste","routeTimeWaste"], outputHint: "currency" },
  "cost.shop_direct_labor": { description: "Direct labor cost for shop operations.", requiredInputs: ["directHours","directRate"], outputHint: "currency" },
  "cost.shop_indirect_labor": { description: "Indirect labor cost for shop operations.", requiredInputs: ["indirectHours","indirectRate"], outputHint: "currency" },
  "cost.shop_overhead": { description: "Shop overhead cost based on labor.", requiredInputs: ["directLabor","indirectLabor","overheadPct"], outputHint: "currency" },
  "cost.shop_total_cost": { description: "Total shop cost (direct + indirect + overhead).", requiredInputs: ["directLabor","indirectLabor","shopOverhead"], outputHint: "currency" },
  "cost.shop_billable_hours": { description: "Billable hours from total hours and chargeable percentage.", requiredInputs: ["totalHours","chargeablePct"], outputHint: "number" },
  "cost.shop_effective_margin": { description: "Effective shop margin percentage.", requiredInputs: ["shopRevenue","shopTotalCost"], outputHint: "percentage" },
  "measurement.crop_potential_yield": { description: "Potential crop yield under optimal conditions.", requiredInputs: ["area","potentialPerHa"], outputHint: "number" },
  "measurement.crop_actual_yield": { description: "Actual crop yield achieved.", requiredInputs: ["area","actualPerHa"], outputHint: "number" },
  "measurement.crop_yield_gap": { description: "Crop yield gap (potential minus actual).", requiredInputs: ["potentialYield","actualYield"], outputHint: "number" },
  "cost.crop_financial_loss": { description: "Financial loss from yield gap.", requiredInputs: ["yieldGap","pricePerTon"], outputHint: "currency" },
  "cost.crop_roi_intervention": { description: "ROI of intervention to close yield gap.", requiredInputs: ["financialLoss","interventionCost"], outputHint: "percentage" },
  "cost.machine_euac_capital": { description: "Equivalent uniform annual capital cost.", requiredInputs: ["purchasePrice","interestRate","lifeYears"], outputHint: "currency" },
  "cost.machine_euac_operating": { description: "Equivalent uniform annual operating cost.", requiredInputs: ["annualOperating","annualMaintenance","annualEnergy"], outputHint: "currency" },
  "cost.machine_total_euac": { description: "Total equivalent uniform annual cost.", requiredInputs: ["euacCapital","euacOperating"], outputHint: "currency" },
  "cost.tco_current": { description: "Current total cost of ownership.", requiredInputs: ["currentPurchase","currentOperating","currentMaintenance","currentDisposal"], outputHint: "currency" },
  "cost.tco_alternative": { description: "Alternative total cost of ownership.", requiredInputs: ["altPurchase","altOperating","altMaintenance","altDisposal"], outputHint: "currency" },
  "cost.tco_weight_savings": { description: "Weighted TCO savings across multiple units.", requiredInputs: ["tcoCurrent","tcoAlternative","unitQuantity"], outputHint: "currency" },
  "cost.tco_net_benefit": { description: "Net TCO benefit from switching.", requiredInputs: ["tcoCurrent","tcoAlternative"], outputHint: "currency" },
  "measurement.tco_payback": { description: "TCO payback period from premium and net benefit.", requiredInputs: ["altPremium","tcoNetBenefit"], outputHint: "number" },
  "cost.eoq_moq_penalty": { description: "Penalty from MOQ exceeding EOQ quantity.", requiredInputs: ["moq","eopQty","holdingCostPerUnit"], outputHint: "currency" },
  "cost.moq_price_break_savings": { description: "Savings from MOQ price break discount.", requiredInputs: ["eopQty","standardPrice","discountPrice"], outputHint: "currency" },
  "cost.moq_net_benefit": { description: "Net benefit from MOQ order (savings minus penalty).", requiredInputs: ["priceBreakSavings","moqPenalty"], outputHint: "currency" },
  "measurement.moq_optimal_qty": { description: "Optimal order quantity considering MOQ constraint.", requiredInputs: ["eopQty","moq"], outputHint: "number" },
  "measurement.availability_mtbf": { description: "Equipment availability from MTBF and MTTR.", requiredInputs: ["mtbf","mttr"], outputHint: "number" },
  "measurement.expected_downtime": { description: "Expected downtime from availability and operating hours.", requiredInputs: ["availability","operatingHours"], outputHint: "duration" },
  "cost.downtime_cost_mtbf": { description: "Cost of expected downtime.", requiredInputs: ["expectedDowntime","costPerDowntimeHour"], outputHint: "currency" },
  "cost.reliability_total_cost": { description: "Total reliability cost including downtime, repair, and lost production.", requiredInputs: ["downtimeCost","repairCost","lostProduction"], outputHint: "currency" },
  "cost.reliability_roi": { description: "ROI of reliability improvement investment.", requiredInputs: ["currentCost","improvedCost","improvementInvestment"], outputHint: "percentage" },
  "cost.muda_overproduction": { description: "Cost of overproduction waste.", requiredInputs: ["overproducedQty","unitCost"], outputHint: "currency" },
  "cost.muda_waiting": { description: "Cost of waiting waste.", requiredInputs: ["waitingHours","laborRate"], outputHint: "currency" },
  "cost.muda_transport": { description: "Cost of transport waste.", requiredInputs: ["excessDist","costPerKm"], outputHint: "currency" },
  "cost.muda_overprocessing": { description: "Cost of overprocessing waste.", requiredInputs: ["extraProcessHours","processRate"], outputHint: "currency" },
  "cost.muda_inventory": { description: "Cost of excess inventory waste.", requiredInputs: ["excessInventory","holdingCostPerUnit"], outputHint: "currency" },
  "cost.muda_motion": { description: "Cost of motion waste.", requiredInputs: ["excessMotionHours","laborRate"], outputHint: "currency" },
  "cost.muda_defects": { description: "Cost of defects waste.", requiredInputs: ["defectQty","reworkCostPerUnit"], outputHint: "currency" },
  "cost.muda_total": { description: "Total cost of all seven muda wastes.", requiredInputs: ["mudaOverproduction","mudaWaiting","mudaTransport","mudaOverprocessing","mudaInventory","mudaMotion","mudaDefects"], outputHint: "currency" },
  "measurement.cash_inflow": { description: "Total cash inflow from sales, receivables, and other income.", requiredInputs: ["salesRevenue","receivablesCollected","otherIncome"], outputHint: "currency" },
  "measurement.cash_outflow": { description: "Total cash outflow from payments, payroll, expenses, and tax.", requiredInputs: ["supplierPayments","payroll","operatingExpenses","taxPayment"], outputHint: "currency" },
  "measurement.net_cash_flow": { description: "Net cash flow (inflow minus outflow).", requiredInputs: ["cashInflow","cashOutflow"], outputHint: "currency" },
  "measurement.cumulative_cash": { description: "Cumulative cash balance.", requiredInputs: ["openingBalance","netCashFlow"], outputHint: "currency" },
  "measurement.cash_gap": { description: "Cash gap when net cash flow is negative.", requiredInputs: ["netCashFlow"], outputHint: "currency" },
  "measurement.cash_conversion_cycle": { description: "Cash conversion cycle in days.", requiredInputs: ["dso","dio","dpo"], outputHint: "number" },
  "measurement.chargeable_weight": { description: "Chargeable weight as max of actual and volumetric.", requiredInputs: ["actualWeight","volumetricWeight"], outputHint: "number" },
  "cost.base_freight": { description: "Base freight cost from chargeable weight.", requiredInputs: ["chargeableWeight","ratePerKg"], outputHint: "currency" },
  "cost.bunker_surcharge": { description: "Bunker adjustment surcharge.", requiredInputs: ["baseFreight","bunkerPct"], outputHint: "currency" },
  "cost.terminal_handling": { description: "Terminal handling charge.", requiredInputs: ["chargeableWeight","handlingRate"], outputHint: "currency" },
  "cost.customs_clearance": { description: "Customs clearance cost from declared value.", requiredInputs: ["declaredValue","customsRate"], outputHint: "currency" },
  "cost.total_freight_cost": { description: "Total freight cost including all surcharges and insurance.", requiredInputs: ["baseFreight","bunkerSurcharge","terminalHandling","customsClearance","insurance"], outputHint: "currency" },
  "measurement.freight_cost_per_unit": { description: "Freight cost per unit shipped.", requiredInputs: ["totalFreightCost","unitCount"], outputHint: "currency" },
  "measurement.noise_exposure": { description: "Noise exposure dose as percentage of limit.", requiredInputs: ["noiseLevel","noiseLimit"], outputHint: "percentage" },
  "measurement.vibration_rms": { description: "Vibration RMS exposure level.", requiredInputs: ["vibrationLevel","exposureTime"], outputHint: "number" },
  "cost.noise_health_cost": { description: "Health cost from noise exposure.", requiredInputs: ["affectedWorkers","healthCostPerWorker"], outputHint: "currency" },
  "cost.noise_productivity_loss": { description: "Productivity loss from noise exposure.", requiredInputs: ["noiseExposure","annualProdValue","productivityLossPct"], outputHint: "currency" },
  "cost.noise_rework_cost": { description: "Rework cost attributed to noise-related errors.", requiredInputs: ["reworkHours","reworkRate"], outputHint: "currency" },
  "cost.noise_mitigation_roi": { description: "ROI of noise mitigation investments.", requiredInputs: ["healthCost","productivityLoss","reworkCost","mitigationCost"], outputHint: "percentage" },
  "measurement.oee_availability": { description: "OEE availability factor.", requiredInputs: ["operatingTime","plannedProdTime"], outputHint: "number" },
  "measurement.oee_performance": { description: "OEE performance factor.", requiredInputs: ["idealCycleTime","totalParts","operatingTime"], outputHint: "number" },
  "measurement.oee_quality": { description: "OEE quality factor.", requiredInputs: ["goodParts","totalParts"], outputHint: "number" },
  "measurement.oee_score": { description: "Overall OEE score as percentage.", requiredInputs: ["oeeAvailability","oeePerformance","oeeQuality"], outputHint: "percentage" },
  "measurement.teep_score": { description: "Total effective equipment performance.", requiredInputs: ["operatingTime","totalCalendarTime","oeePerformance","oeeQuality"], outputHint: "percentage" },
  "cost.oee_downtime_cost": { description: "Cost of OEE downtime losses.", requiredInputs: ["plannedProdTime","operatingTime","costPerHour"], outputHint: "currency" },
  "cost.oee_speed_loss": { description: "Cost of OEE speed losses.", requiredInputs: ["operatingTime","idealCycleTime","totalParts","costPerHour"], outputHint: "currency" },
  "cost.oee_quality_loss": { description: "Cost of OEE quality losses.", requiredInputs: ["totalParts","goodParts","costPerPart"], outputHint: "currency" },
  "cost.office_consumption_rate": { description: "Monthly consumption rate from annual usage.", requiredInputs: ["annualUsage"], outputHint: "number" },
  "cost.office_annual_cost": { description: "Annual ordering cost from EOQ model.", requiredInputs: ["annualDemand","orderQty","orderCost"], outputHint: "currency" },
  "cost.office_carrying_cost": { description: "Annual carrying cost of office inventory.", requiredInputs: ["orderQty","holdingCostPerUnit"], outputHint: "currency" },
  "cost.office_stockout_cost": { description: "Stockout cost from lost margin.", requiredInputs: ["stockoutUnits","lostMarginPerUnit"], outputHint: "currency" },
  "cost.office_eoq": { description: "Economic order quantity for office supplies.", requiredInputs: ["annualDemand","orderCost","holdingCostPerUnit"], outputHint: "number" },
  "cost.office_waste_pct": { description: "Office waste percentage from total ordered.", requiredInputs: ["wasteUnits","totalOrdered"], outputHint: "percentage" },
  "cost.office_optimization_savings": { description: "Savings from office inventory optimization.", requiredInputs: ["currentTotalCost","optimalTotalCost"], outputHint: "currency" },
  "cost.ot_cost_hour": { description: "Overtime cost per hour from base rate and multiplier.", requiredInputs: ["baseRate","otMultiplier"], outputHint: "currency" },
  "cost.hiring_total_cost": { description: "Total hiring cost including advertising, recruiting, training, and onboarding.", requiredInputs: ["advertising","recruiting","training","onboarding"], outputHint: "currency" },
  "cost.annual_new_hire_cost": { description: "Annual cost of a new hire.", requiredInputs: ["hiringTotalCost","salary","benefits"], outputHint: "currency" },
  "measurement.breakeven_hours_base": { description: "Breakeven hours between OT and hiring.", requiredInputs: ["annualNewHireCost","otCostHour"], outputHint: "number" },
  "measurement.ot_hire_decision": { description: "OT vs hire decision (1=hire, 0=OT).", requiredInputs: ["annualOtHours","breakevenHours"], outputHint: "score" },
  "cost.ot_quality_cost": { description: "Quality cost from overtime work.", requiredInputs: ["annualOtHours","defectRate","reworkCost"], outputHint: "currency" },
  "measurement.dso_base": { description: "Days sales outstanding from AR and daily sales.", requiredInputs: ["accountsReceivable","avgDailySales"], outputHint: "number" },
  "cost.carrying_cost_ar": { description: "Carrying cost of accounts receivable.", requiredInputs: ["accountsReceivable","costOfCapital"], outputHint: "currency" },
  "cost.bad_debt_expense": { description: "Bad debt expense from credit sales and bad debt rate.", requiredInputs: ["creditSales","badDebtRate"], outputHint: "currency" },
  "cost.discount_cost": { description: "Cost of early payment discounts taken.", requiredInputs: ["discountEligibleSales","discountRate"], outputHint: "currency" },
  "measurement.cash_flow_impact_terms": { description: "Cash flow impact from payment terms change.", requiredInputs: ["newDso","currentDso","avgDailySales"], outputHint: "currency" },
  "cost.npv_terms": { description: "NPV of payment terms change.", requiredInputs: ["cashFlowImpact","discountRate","discountCost"], outputHint: "currency" },
  "measurement.learning_rate": { description: "Learning curve rate from percentage of previous.", requiredInputs: ["pctOfPrevious"], outputHint: "number" },
  "measurement.learning_slope": { description: "Learning curve slope (b factor).", requiredInputs: ["learningRate"], outputHint: "number" },
  "measurement.time_n": { description: "Time to produce the nth unit.", requiredInputs: ["firstUnitTime","cumulativeUnits","learningSlope"], outputHint: "duration" },
  "measurement.cumulative_time_n": { description: "Cumulative time for n units under learning curve.", requiredInputs: ["firstUnitTime","cumulativeUnits","learningSlope"], outputHint: "duration" },
  "measurement.average_time_n": { description: "Average time per unit under learning curve.", requiredInputs: ["cumulativeTime","cumulativeUnits"], outputHint: "duration" },
  "cost.learning_cost_n": { description: "Labor cost for the nth unit.", requiredInputs: ["timeN","laborRate"], outputHint: "currency" },
  "measurement.breakeven_unit_learning": { description: "Unit number where target cost is reached.", requiredInputs: ["targetCost","firstUnitCost","learningSlope"], outputHint: "number" },
  "measurement.sample_infinite": { description: "Sample size for infinite population.", requiredInputs: ["zScore","stdDev","errorMargin"], outputHint: "number" },
  "measurement.sample_finite": { description: "Sample size adjusted for finite population.", requiredInputs: ["sampleInfinite","population"], outputHint: "number" },
  "measurement.sample_continuous": { description: "Sample size for continuous data.", requiredInputs: ["zScore","estimatedVariance","precision"], outputHint: "number" },
  "measurement.sample_power_adj": { description: "Power-adjusted sample size.", requiredInputs: ["sampleInfinite","zBeta","effectSize"], outputHint: "number" },
  "measurement.sample_design_effect": { description: "Design effect for cluster sampling.", requiredInputs: ["clusterSize","icc"], outputHint: "number" },
  "measurement.sample_final_n": { description: "Final sample size adjusted for design effect.", requiredInputs: ["sampleFinite","designEffect"], outputHint: "number" },
  "cost.sampling_total_cost": { description: "Total sampling study cost.", requiredInputs: ["sampleFinalN","costPerSample","fixedCost"], outputHint: "currency" },
  "measurement.rack_capacity": { description: "Total rack storage capacity in pallet positions.", requiredInputs: ["rackQty","palletsPerBay","levels"], outputHint: "number" },
  "measurement.floor_utilization_rack": { description: "Floor space utilization for rack system.", requiredInputs: ["rackFootprint","totalFloorArea"], outputHint: "number" },
  "measurement.rack_throughput": { description: "Rack throughput in moves per hour.", requiredInputs: ["totalMoves","availableHours"], outputHint: "number" },
  "measurement.rack_safety_factor": { description: "Rack safety factor from load rating vs actual load.", requiredInputs: ["maxLoadRating","actualLoad"], outputHint: "number" },
  "cost.rack_cost_per_position": { description: "Cost per pallet position in rack system.", requiredInputs: ["totalRackCost","rackCapacity"], outputHint: "currency" },
  "measurement.rack_retrieval_time": { description: "Average retrieval time per pallet.", requiredInputs: ["totalTravelDist","forkSpeed"], outputHint: "duration" },
  "measurement.current_defect_rate": { description: "Current defect rate from defects and total inspected.", requiredInputs: ["defects","totalInspected"], outputHint: "number" },
  "cost.defect_cost_annual": { description: "Annual cost of defects.", requiredInputs: ["currentDefectRate","annualVolume","costPerDefect"], outputHint: "currency" },
  "cost.poka_yoke_cost": { description: "Poka-yoke implementation cost.", requiredInputs: ["deviceCost","installationCost","trainingCost"], outputHint: "currency" },
  "measurement.new_defect_rate": { description: "Defect rate after poka-yoke implementation.", requiredInputs: ["currentDefectRate","reductionFactor"], outputHint: "number" },
  "cost.poka_yoke_savings": { description: "Annual savings from poka-yoke implementation.", requiredInputs: ["currentDefectRate","newDefectRate","annualVolume","costPerDefect"], outputHint: "currency" },
  "cost.poka_yoke_roi": { description: "ROI of poka-yoke implementation.", requiredInputs: ["pokaYokeSavings","pokaYokeCost"], outputHint: "percentage" },
  "cost.poka_yoke_payback": { description: "Payback period for poka-yoke investment.", requiredInputs: ["pokaYokeCost","pokaYokeSavings"], outputHint: "number" },
  "cost.ingredient_cost_portion": { description: "Ingredient cost per portion.", requiredInputs: ["ingredientQty","unitPrice"], outputHint: "currency" },
  "cost.yield_adjusted_cost": { description: "Yield-adjusted ingredient cost per portion.", requiredInputs: ["ingredientCostPortion","yieldPct"], outputHint: "currency" },
  "cost.portion_labor_cost": { description: "Labor cost per portion.", requiredInputs: ["totalLaborCost","portionsProduced"], outputHint: "currency" },
  "cost.portion_overhead": { description: "Overhead cost per portion.", requiredInputs: ["totalOverhead","portionsProduced"], outputHint: "currency" },
  "cost.total_portion_cost": { description: "Total cost per portion including ingredients, labor, and overhead.", requiredInputs: ["yieldAdjustedCost","portionLaborCost","portionOverhead"], outputHint: "currency" },
  "measurement.food_cost_pct": { description: "Food cost as percentage of menu price.", requiredInputs: ["totalPortionCost","menuPrice"], outputHint: "percentage" },
  "measurement.target_menu_price": { description: "Target menu price from portion cost and target food cost %.", requiredInputs: ["totalPortionCost","targetFoodCostPct"], outputHint: "currency" },
  "cost.project_direct_labor": { description: "Project direct labor cost.", requiredInputs: ["laborHours","laborRate"], outputHint: "currency" },
  "cost.project_direct_material": { description: "Project direct material cost.", requiredInputs: ["materialQty","materialUnitPrice"], outputHint: "currency" },
  "cost.project_equipment": { description: "Project equipment cost.", requiredInputs: ["equipQty","equipRate","equipDuration"], outputHint: "currency" },
  "cost.project_subcontractor": { description: "Project subcontractor cost including mobilization.", requiredInputs: ["subcontractorQuote","subMobilization"], outputHint: "currency" },
  "cost.project_overhead": { description: "Project overhead based on direct costs.", requiredInputs: ["directLabor","directMaterial","overheadPct"], outputHint: "currency" },
  "cost.project_contingency": { description: "Project contingency allowance.", requiredInputs: ["directLabor","directMaterial","projectEquipment","projectSubcontractor","projectOverhead","contingencyPct"], outputHint: "currency" },
  "cost.project_total_estimate": { description: "Total project cost estimate.", requiredInputs: ["directLabor","directMaterial","projectEquipment","projectSubcontractor","projectOverhead","projectContingency"], outputHint: "currency" },
  "cost.project_cost_variance": { description: "Project cost variance (actual vs estimate).", requiredInputs: ["actualCost","projectTotalEstimate"], outputHint: "currency" },
  "cost.risk_exposure_cost": { description: "Risk exposure cost from probability and impact.", requiredInputs: ["probability","impact"], outputHint: "currency" },
  "cost.mitigation_cost": { description: "Total risk mitigation cost.", requiredInputs: ["mitigationLabor","mitigationMaterial","mitigationEquipment"], outputHint: "currency" },
  "cost.net_risk_cost": { description: "Net risk cost after mitigation.", requiredInputs: ["riskExposureCost","mitigationCost"], outputHint: "currency" },
  "cost.recipe_theoretical": { description: "Theoretical recipe cost at standard yield.", requiredInputs: ["batchQty","theoreticalCostPerKg"], outputHint: "currency" },
  "cost.recipe_actual": { description: "Actual recipe cost incurred.", requiredInputs: ["batchQty","actualCostPerKg"], outputHint: "currency" },
  "cost.recipe_variance": { description: "Recipe cost variance (actual minus theoretical).", requiredInputs: ["recipeActual","recipeTheoretical"], outputHint: "currency" },
  "cost.recipe_yield_loss_cost": { description: "Cost of recipe yield loss.", requiredInputs: ["theoreticalYield","actualYield","actualCostPerKg"], outputHint: "currency" },
  "measurement.recipe_evaporation": { description: "Recipe evaporation loss percentage.", requiredInputs: ["inputWeight","outputWeight"], outputHint: "percentage" },
  "measurement.recipe_efficiency_base": { description: "Recipe output-to-input weight efficiency.", requiredInputs: ["outputWeight","inputWeight"], outputHint: "number" },
  "cost.recipe_cost_per_kg": { description: "Recipe cost per kg of output.", requiredInputs: ["recipeActual","outputWeight"], outputHint: "currency" },
  "cost.restaurant_theoretical_food": { description: "Theoretical food cost from sales and ideal percentage.", requiredInputs: ["totalSales","idealFoodCostPct"], outputHint: "currency" },
  "cost.restaurant_actual_food": { description: "Actual food cost from inventory and purchases.", requiredInputs: ["beginningInv","purchases","endingInv"], outputHint: "currency" },
  "cost.restaurant_variance_cost": { description: "Food cost variance (actual minus theoretical).", requiredInputs: ["actualFoodCost","theoreticalFoodCost"], outputHint: "currency" },
  "measurement.restaurant_variance_pct": { description: "Food cost variance as percentage of actual.", requiredInputs: ["varianceCost","actualFoodCost"], outputHint: "percentage" },
  "cost.restaurant_waste_cost": { description: "Waste cost from discarded ingredients.", requiredInputs: ["wasteKg","avgCostPerKg"], outputHint: "currency" },
  "cost.restaurant_theft_loss": { description: "Loss from theft of ingredients.", requiredInputs: ["theftQty","avgCostPerUnit"], outputHint: "currency" },
  "measurement.restaurant_ideal_margin": { description: "Ideal restaurant margin percentage.", requiredInputs: ["idealFoodCostPct"], outputHint: "percentage" },
  "measurement.restaurant_actual_margin": { description: "Actual restaurant margin percentage.", requiredInputs: ["actualFoodCost","totalSales"], outputHint: "percentage" },
  "cost.manual_cost_annual": { description: "Annual cost of manual operations.", requiredInputs: ["manualWorkers","manualAnnualWage","manualBenefits","manualTraining"], outputHint: "currency" },
  "cost.robot_cost_annual": { description: "Annual cost of robot operations.", requiredInputs: ["robotLease","robotMaintenance","robotEnergy","robotOperatorSalary"], outputHint: "currency" },
  "measurement.robot_output": { description: "Annual robot output in units.", requiredInputs: ["robotCycleTime","robotUptime","workingDays"], outputHint: "number" },
  "measurement.manual_output": { description: "Annual manual output in units.", requiredInputs: ["manualWorkers","manualCycleTime","manualUptime","workingDays"], outputHint: "number" },
  "cost.cost_per_unit_manual": { description: "Manual cost per unit produced.", requiredInputs: ["manualCostAnnual","manualOutput"], outputHint: "currency" },
  "cost.cost_per_unit_robot": { description: "Robot cost per unit produced.", requiredInputs: ["robotCostAnnual","robotOutput"], outputHint: "currency" },
  "cost.robot_roi_analyzer": { description: "ROI of robot automation vs manual.", requiredInputs: ["manualCostAnnual","robotCostAnnual"], outputHint: "percentage" },
  "cost.robot_payback": { description: "Robot investment payback period in years.", requiredInputs: ["robotInvestment","manualCostAnnual","robotCostAnnual"], outputHint: "number" },
  "cost.route_distance_cost": { description: "Route cost based on distance traveled.", requiredInputs: ["distanceKm","costPerKm"], outputHint: "currency" },
  "cost.route_time_cost": { description: "Route cost based on travel time.", requiredInputs: ["timeHours","costPerHour"], outputHint: "currency" },
  "cost.route_toll_cost": { description: "Route cost from tolls and passes.", requiredInputs: ["tollAmount","tollCount","tollPerPass"], outputHint: "currency" },
  "cost.route_maintenance_cost": { description: "Route maintenance cost based on distance.", requiredInputs: ["distanceKm","maintenanceRate"], outputHint: "currency" },
  "cost.route_overhead_cost": { description: "Route overhead cost based on distance.", requiredInputs: ["distanceKm","overheadPerKm"], outputHint: "currency" },
  "cost.route_total_cost_simple": { description: "Total route cost including distance, time, tolls, maintenance, and overhead.", requiredInputs: ["distanceCost","timeCost","tollCost","maintenanceCost","overheadCost"], outputHint: "currency" },
  "measurement.route_cost_per_km": { description: "Route cost per kilometer.", requiredInputs: ["routeTotalCost","distanceKm"], outputHint: "currency" },
  "measurement.route_cost_per_drop": { description: "Route cost per delivery drop.", requiredInputs: ["routeTotalCost","totalDrops"], outputHint: "currency" },
  "yield.gap_value": {
    description: "Yield gap tonnage valued at price per ton.",
    requiredInputs: ["yieldGapTon", "pricePerTon"],
    outputHint: "currency",
  },
  "loss.waste_exposure": {
    description: "Ingredient waste cost from monthly spend and waste rate.",
    requiredInputs: ["monthlyIngredientCost", "wasteRate"],
    outputHint: "currency",
  },
  "loss.excess_waste_cost": {
    description: "Waste cost above target waste rate band.",
    requiredInputs: ["monthlyIngredientCost", "wasteRate", "targetWasteRate"],
    outputHint: "currency",
  },
  "cost.margin_pressure": {
    description: "Excess cost as percent of monthly revenue.",
    requiredInputs: ["excessCost", "monthlyRevenue"],
    outputHint: "percentage",
  },
  "time.delay_cost": {
    description: "Daily site cost multiplied by delay days.",
    requiredInputs: ["dailySiteCost", "delayDays"],
    outputHint: "currency",
  },
  "cost.overrun_cost": {
    description: "Budget overrun from percent drift.",
    requiredInputs: ["budget", "overrunPercent"],
    outputHint: "currency",
  },
  "cost.total_exposure": {
    description: "Sum of three exposure components.",
    requiredInputs: ["a", "b", "c"],
    outputHint: "currency",
  },
  "time.rework_cost": {
    description: "Rework hours multiplied by labor rate.",
    requiredInputs: ["reworkHours", "laborRate"],
    outputHint: "currency",
  },
  "cost.food_cost_percent": {
    description: "Ingredient cost as percent of monthly revenue.",
    requiredInputs: ["ingredientCost", "monthlyRevenue"],
    outputHint: "percentage",
  },
  "cost.delivery_fee_cost": {
    description: "Delivery platform fee from revenue and fee percent.",
    requiredInputs: ["monthlyRevenue", "deliveryAppFeePercent"],
    outputHint: "currency",
  },
  "cost.restaurant_margin_pressure": {
    description: "Combined ingredient, delivery and waste pressure on revenue.",
    requiredInputs: ["ingredientCost", "deliveryFeeCost", "wasteExposure", "monthlyRevenue"],
    outputHint: "percentage",
  },
  "cost.variance": {
    description: "Positive variance of actual over planned cost.",
    requiredInputs: ["actual", "planned"],
    outputHint: "currency",
  },
  "route.distance_drift_cost": {
    description: "Fuel cost of distance driven above plan.",
    requiredInputs: ["plannedDistanceKm", "actualDistanceKm", "fuelCostPerKm"],
    outputHint: "currency",
  },
  "cost.sum2": {
    description: "Sum of two exposure components.",
    requiredInputs: ["a", "b"],
    outputHint: "currency",
  },
  "cost.total2": {
    description: "Total of two exposure components.",
    requiredInputs: ["a", "b"],
    outputHint: "currency",
  },
  "cost.value": {
    description: "Pass-through of a single numeric input to pipeline output.",
    requiredInputs: ["value"],
    outputHint: "currency",
  },
  "energy.compressor_leak_kwh": {
    description: "Compressor leak kWh from power, hours and leak percent.",
    requiredInputs: ["compressorKw", "leakPercent", "operatingHours"],
    outputHint: "number",
  },
  "cost.annualize": {
    description: "Monthly cost multiplied by twelve.",
    requiredInputs: ["monthlyCost"],
    outputHint: "currency",
  },
  "cloud.api_call_cost": {
    description: "API call volume cost from calls and per-thousand rate.",
    requiredInputs: ["monthlyApiCalls", "costPerThousandCalls"],
    outputHint: "currency",
  },
  "agriculture.yield_loss_revenue": {
    description: "Revenue lost from yield gap per hectare.",
    requiredInputs: ["areaHa", "expectedYieldTonPerHa", "actualYieldTonPerHa", "pricePerTon"],
    outputHint: "currency",
  },
  "cost.unit_cost": {
    description: "Total cost divided by quantity for per-unit exposure.",
    requiredInputs: ["totalCost", "quantity"],
    outputHint: "currency",
  },
  "time.setup_loss": {
    description: "Setup minutes converted to monthly changeover cost.",
    requiredInputs: ["setupMinutes", "setupsPerMonth", "hourlyCost"],
    outputHint: "currency",
  },
  "cost.percent_of_amount": {
    description: "Percent applied to a base amount.",
    requiredInputs: ["amount", "percent"],
    outputHint: "currency",
  },
  "cost.difference": {
    description: "Signed difference between two numeric amounts.",
    requiredInputs: ["a", "b"],
    outputHint: "currency",
  },
  "cost.product2": {
    description: "Product of two numeric cost drivers.",
    requiredInputs: ["a", "b"],
    outputHint: "currency",
  },
  "cost.fixed_plus_variable_total": {
    description: "Fixed cost plus unit cost multiplied by quantity.",
    requiredInputs: ["fixedCost", "unitCost", "quantity"],
    outputHint: "currency",
  },
  "cost.method_crossover_quantity": {
    description: "Break-even quantity between two linear cost methods.",
    requiredInputs: ["fixedA", "fixedB", "unitA", "unitB"],
    outputHint: "number",
  },
  "lean.efficiency_gap_percent": {
    description: "Percent efficiency gap from a current score.",
    requiredInputs: ["currentScore"],
    outputHint: "percentage",
  },
  "lean.score_gap_percent": {
    description: "Percent gap between current and target scores.",
    requiredInputs: ["currentScore", "targetScore"],
    outputHint: "percentage",
  },
  "cost.labor_capacity_cost": {
    description: "Labor capacity cost scaled by a loss factor percent.",
    requiredInputs: ["headcount", "hours", "hourlyCost", "lossFactor"],
    outputHint: "currency",
  },
  "layout.floor_parts_fit": {
    description: "Count of parts that fit along one bed span.",
    requiredInputs: ["span", "part"],
    outputHint: "number",
  },
  "layout.nest_parts_count": {
    description: "Total nested parts from rows and columns.",
    requiredInputs: ["rows", "cols"],
    outputHint: "number",
  },
  "layout.rect_bed_utilization_pct": {
    description: "Rectangular bed utilization percent.",
    requiredInputs: ["partsPerRow", "partsPerColumn", "partWidth", "partDepth", "bedWidth", "bedDepth"],
    outputHint: "percentage",
  },
  "cost.margin_rate_on_price": {
    description: "Gross margin percent based on price and cost.",
    requiredInputs: ["price", "cost"],
    outputHint: "percentage",
  },
  "cost.quote_target_price": {
    description: "Target sales price from loaded cost and target margin.",
    requiredInputs: ["totalCost", "targetMarginPercent"],
    outputHint: "currency",
  },
  "cost.quote_safe_floor_price": {
    description: "Minimum safe price with extra margin uplift.",
    requiredInputs: ["totalCost", "targetMarginPercent", "safetyMarginUplift"],
    outputHint: "currency",
  },
  "cost.shop_hourly_rate": {
    description: "Fixed monthly burden per hour plus variable hourly cost.",
    requiredInputs: ["fixedMonthlyCost", "monthlyMachineHours", "variableCostPerHour"],
    outputHint: "currency",
  },
  "cost.break_even_units": {
    description: "Units required to cover fixed costs at contribution margin.",
    requiredInputs: ["fixedCost", "unitPrice", "variableCostPerUnit"],
    outputHint: "number",
  },
  "cost.safety_margin_rate": {
    description: "Percent volume cushion above break-even.",
    requiredInputs: ["breakEvenUnits", "currentVolume"],
    outputHint: "percentage",
  },
  "carbon.unit_product_emissions": {
    description: "Total emissions divided by production units.",
    requiredInputs: ["totalEmissionsTon", "productionUnits"],
    outputHint: "number",
  },
  "carbon.unit_exposure_cost": {
    description: "Unit emissions multiplied by reference carbon price.",
    requiredInputs: ["unitEmissionsTon", "carbonPrice"],
    outputHint: "currency",
  },
  "time.hour_overrun_cost": {
    description: "Labor cost of hours above planned estimate.",
    requiredInputs: ["actualHours", "plannedHours", "hourlyCost"],
    outputHint: "currency",
  },
  "cost.count_cost": {
    description: "Unit count multiplied by cost each.",
    requiredInputs: ["count", "costEach"],
    outputHint: "currency",
  },
  "agriculture.feed_monthly_cost": {
    description: "Monthly feed spend from herd size and daily rate.",
    requiredInputs: ["cows", "feedCostPerCowPerDay", "days"],
    outputHint: "currency",
  },
  "agriculture.milk_yield_gap_revenue": {
    description: "Revenue gap from milk yield below target.",
    requiredInputs: [
      "cows",
      "milkLitersPerCowPerDay",
      "targetMilkLitersPerCowPerDay",
      "milkPricePerLiter",
      "days",
    ],
    outputHint: "currency",
  },
  "retail.inventory_turnover": {
    description: "Annual COGS divided by average inventory.",
    requiredInputs: ["annualCOGS", "averageInventory"],
    outputHint: "score",
  },
  "inventory.eoq_units": {
    description: "Classic EOQ from demand, order cost and holding cost percent.",
    requiredInputs: ["annualDemand", "orderCost", "unitCost", "carryingCostPercent"],
    outputHint: "number",
  },
  "inventory.carrying_cost_annual": {
    description: "Annual carrying cost from average EOQ inventory.",
    requiredInputs: ["eoqUnits", "unitCost", "carryingCostPercent"],
    outputHint: "currency",
  },
  "warehouse.unused_space_cost": {
    description: "Rent allocated to unused warehouse space.",
    requiredInputs: ["monthlyRent", "unusedSpacePercent"],
    outputHint: "currency",
  },
  "legal.simple_interest_days": {
    description: "Simple interest from principal, rate and days.",
    requiredInputs: ["principal", "annualInterestPercent", "days"],
    outputHint: "currency",
  },
  "carbon.total_emissions": {
    description: "Sum of energy and fuel emissions tonnage.",
    requiredInputs: ["energyEmissionsTon", "fuelEmissionsTon"],
    outputHint: "number",
  },
  "calibration.tolerance_status": {
    description: "Percent of tolerance band consumed by deviation.",
    requiredInputs: ["target", "actual", "tolerance"],
    outputHint: "percentage",
  },
  "calibration.tolerance_worst_case_stack": {
    description: "Linear worst-case sum of four tolerance contributions.",
    requiredInputs: ["t1", "t2", "t3", "t4"],
    outputHint: "number",
  },
  "calibration.tolerance_rss_stack": {
    description: "Root-sum-square stack of four tolerance contributions.",
    requiredInputs: ["t1", "t2", "t3", "t4"],
    outputHint: "number",
  },
  "measurement.weld_throat_capacity": {
    description: "Screening-level fillet weld capacity estimate.",
    requiredInputs: ["throatMm", "weldLengthMm", "allowableStressMpa", "safetyFactor"],
    outputHint: "number",
  },
  "measurement.bolt_shear_capacity": {
    description: "Screening-level bolt shear capacity estimate.",
    requiredInputs: ["boltDiameterMm", "boltCount", "allowableStressMpa", "safetyFactor"],
    outputHint: "number",
  },
  "measurement.bolt_tightening_torque": {
    description: "Torque estimate from clamp force, bolt diameter and friction factor.",
    requiredInputs: ["clampForceKn", "boltDiameterMm", "frictionFactor"],
    outputHint: "number",
  },
  "measurement.fire_flow_demand": {
    description: "Required fire flow from protected area and design density.",
    requiredInputs: ["protectedAreaM2", "designDensityLpmM2"],
    outputHint: "number",
  },
  "measurement.hydrant_count": {
    description: "Hydrant count from total flow demand and per-hydrant capacity.",
    requiredInputs: ["flowDemandLpm", "hydrantCapacityLpm"],
    outputHint: "number",
  },
  "measurement.cylinder_force": {
    description: "Cylinder force from pressure and bore diameter.",
    requiredInputs: ["pressureBar", "boreMm"],
    outputHint: "number",
  },
  "measurement.cylinder_retract_force": {
    description: "Retract force from pressure, bore and rod diameters.",
    requiredInputs: ["pressureBar", "boreMm", "rodMm"],
    outputHint: "number",
  },
  "measurement.vessel_wall_thickness": {
    description: "Screening wall thickness from pressure, diameter and allowable stress.",
    requiredInputs: ["designPressureBar", "diameterMm", "allowableStressMpa", "weldEfficiency"],
    outputHint: "number",
  },
  "cost.sum3": {
    description: "Sum of three cost components.",
    requiredInputs: ["a", "b", "c"],
    outputHint: "currency",
  },
  "cost.ratio_percent": {
    description: "Numerator as percent of denominator.",
    requiredInputs: ["numerator", "denominator"],
    outputHint: "percentage",
  },
  "time.vsm_total_lead_time": {
    description: "Total lead time from process, wait and transport minutes.",
    requiredInputs: ["processMinutes", "waitMinutes", "transportMinutes"],
    outputHint: "number",
  },
  "benchmark.value_added_percent": {
    description: "Value-added minutes as percent of total lead time.",
    requiredInputs: ["valueAddedMinutes", "totalLeadMinutes"],
    outputHint: "percentage",
  },
  "lean.muda_overproduction_cost": {
    description: "REV5 overproduction waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_waiting_cost": {
    description: "REV5 waiting waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_transport_cost": {
    description: "REV5 transport waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_inventory_cost": {
    description: "REV5 inventory waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_motion_cost": {
    description: "REV5 motion waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_overprocessing_cost": {
    description: "REV5 overprocessing waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_defect_cost": {
    description: "REV5 defect waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_total_waste_cost": {
    description: "REV5 total waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_highest_waste_index": {
    description: "Rank of the highest REV5 muda waste category (1–7).",
    requiredInputs: [],
    outputHint: "number",
  },
  "lean.muda_annualized_waste_cost": {
    description: "Annualized REV5 total waste exposure.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_waste_cost_per_unit": {
    description: "REV5 waste cost per production unit in the analysis period.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_period_revenue": {
    description: "REV5 period revenue from production volume and unit selling price.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_period_gross_margin_value": {
    description: "REV5 period gross margin value.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_waste_to_revenue_ratio_pct": {
    description: "REV5 total waste cost as a percent of period revenue.",
    requiredInputs: [],
    outputHint: "percentage",
  },
  "lean.muda_waste_to_gross_margin_ratio_pct": {
    description: "REV5 total waste cost as a percent of period gross margin.",
    requiredInputs: [],
    outputHint: "percentage",
  },
  "lean.muda_highest_waste_cost": {
    description: "REV5 monetary cost of the dominant waste category.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_risk_adjusted_priority_score": {
    description: "REV5 risk-adjusted kaizen priority score.",
    requiredInputs: [],
    outputHint: "score",
  },
  "energy.monthly_kwh_savings": {
    description: "Monthly kWh reduction from baseline to proposed consumption.",
    requiredInputs: ["baselineKwhMonthly", "proposedKwhMonthly"],
    outputHint: "number",
  },
  "finance.payback_years": {
    description: "Initial investment divided by annual savings.",
    requiredInputs: ["initialInvestment", "annualSavings"],
    outputHint: "number",
  },
  "finance.simple_npv": {
    description: "NPV with fixed annual cash flow and discount rate.",
    requiredInputs: ["initialInvestment", "annualCashFlow", "discountRatePercent", "horizonYears"],
    outputHint: "currency",
  },
  "finance.net_position": {
    description: "Net position from foreign assets and liabilities.",
    requiredInputs: ["assets", "liabilities"],
    outputHint: "number",
  },
  "finance.fx_exposure_loss": {
    description: "Unhedged financial loss under exchange rate shock.",
    requiredInputs: ["netPosition", "currentRate", "shockRate", "hedgeRatio"],
    outputHint: "currency",
  },
  "finance.hedge_savings": {
    description: "Financial savings due to hedging ratio.",
    requiredInputs: ["netPosition", "currentRate", "shockRate", "hedgeRatio"],
    outputHint: "currency",
  },
  "finance.annual_yield_percent": {
    description: "Annual cash flow divided by initial investment.",
    requiredInputs: ["initialInvestment", "annualCashFlow"],
    outputHint: "percentage",
  },
  "finance.roi_percent": {
    description: "Return on investment as percent of initial investment.",
    requiredInputs: ["initialInvestment", "totalReturn"],
    outputHint: "percentage",
  },
  "cost.employer_burden_total": {
    description: "Gross monthly salary with employer burden percent.",
    requiredInputs: ["grossMonthlySalary", "employerBurdenPercent"],
    outputHint: "currency",
  },
  "cost.severance_screening": {
    description: "Screening severance estimate from salary and service years.",
    requiredInputs: ["grossMonthlySalary", "yearsOfService", "severanceWeeksPerYear"],
    outputHint: "currency",
  },
  "cost.notice_screening": {
    description: "Screening notice-period cost from weekly salary factor.",
    requiredInputs: ["grossMonthlySalary", "noticeWeeks"],
    outputHint: "currency",
  },
  "measurement.pulley_driven_rpm": {
    description: "Driven pulley RPM from driver speed and pulley diameters.",
    requiredInputs: ["driverRpm", "driverDiameterMm", "drivenDiameterMm"],
    outputHint: "number",
  },
  "measurement.belt_speed_mpm": {
    description: "Linear belt speed from driver pulley diameter and RPM.",
    requiredInputs: ["driverDiameterMm", "driverRpm"],
    outputHint: "number",
  },
  "measurement.open_belt_length_mm": {
    description: "Open belt length from pulley diameters and center distance.",
    requiredInputs: ["driverDiameterMm", "drivenDiameterMm", "centerDistanceMm"],
    outputHint: "number",
  },
  /* ─── Industrial Formula Tools (18) —— meta ─── */
  "finance.irr_estimate": {
    description: "IRR estimate using simplified Newton-Raphson.",
    requiredInputs: ["initialInvestment"],
    outputHint: "percentage",
  },
  "finance.wacc": {
    description: "Weighted Average Cost of Capital.",
    requiredInputs: ["equityValue", "debtValue", "costOfEquity", "costOfDebt", "taxRate"],
    outputHint: "percentage",
  },
  "finance.nal": {
    description: "Net Advantage of Leasing.",
    requiredInputs: ["purchasePrice", "monthlyLeasePayment", "leaseTermMonths", "costOfDebt", "taxRate"],
    outputHint: "currency",
  },
  "fluid.darcy_friction_factor": {
    description: "Darcy friction factor via Colebrook-White equation.",
    requiredInputs: ["reynoldsNumber", "relativeRoughness", "diameterMm"],
    outputHint: "number",
  },
  "fluid.heat_exchanger_lmtd": {
    description: "Log Mean Temperature Difference for heat exchangers.",
    requiredInputs: ["deltaT1", "deltaT2"],
    outputHint: "number",
  },
  "oee.oee_score": {
    description: "Full OEE as percent (A × P × Q × 100).",
    requiredInputs: ["availability", "performance", "quality"],
    outputHint: "percentage",
  },
  "lean.balance_efficiency": {
    description: "Line balance efficiency percent (Σtᵢ / N_real × takt).",
    requiredInputs: ["totalWorkContent", "taktTime", "actualStations"],
    outputHint: "percentage",
  },
  "time.normal_time": {
    description: "Normal time from observed time and rating factor.",
    requiredInputs: ["observedTime", "ratingFactor"],
    outputHint: "number",
  },
  "time.standard_time": {
    description: "Standard time from normal time and total allowance.",
    requiredInputs: ["normalTime", "totalAllowance"],
    outputHint: "number",
  },
  "learning.wright_unit_time": {
    description: "Wright learning curve unit time a × N^b.",
    requiredInputs: ["firstUnitTime", "learningRate", "cumulativeQuantity"],
    outputHint: "number",
  },
  "measurement.spring_rate": {
    description: "Helical compression spring rate k (N/mm).",
    requiredInputs: ["wireDiameter", "meanCoilDiameter", "activeCoils"],
    outputHint: "number",
  },
  "carbon.total_co2e": {
    description: "Total CO₂e from scope 1 + 2 + 3.",
    requiredInputs: ["scope1", "scope2", "scope3"],
    outputHint: "number",
  },
  "stats.ols_beta1": {
    description: "OLS slope coefficient β₁ from sample statistics.",
    requiredInputs: ["sampleSize", "sumX", "sumY", "sumXY", "sumX2"],
    outputHint: "number",
  },
  "stats.sample_size_proportion": {
    description: "Minimum sample size for proportion with given z, p, e.",
    requiredInputs: ["zScore", "estimatedProportion", "errorMargin"],
    outputHint: "number",
  },
  "stats.anova_f_stat": {
    description: "One-way ANOVA F-statistic = MSB/MSW.",
    requiredInputs: ["msBetween", "msWithin"],
    outputHint: "number",
  },
  "measurement.hydraulic_cylinder_push_pull_ratio": {
    description: "Hydraulic cylinder push-pull force ratio.",
    requiredInputs: ["pistonDia", "rodDia"],
    outputHint: "number",
  },
  // ── TOOL 1: AI Token Cost ──
  "cost.ai_daily_prompt": { description: "Daily prompt cost = (requests × promptTokens × price) / 1M.", requiredInputs: ["dailyRequests", "promptTokens", "pricePerMToken"], outputHint: "currency" },
  "cost.ai_daily_completion": { description: "Daily completion cost = (requests × completionTokens × price) / 1M.", requiredInputs: ["dailyRequests", "completionTokens", "pricePerMToken"], outputHint: "currency" },
  "cost.ai_daily_cache": { description: "Daily cache cost = cachedTokens × cacheReadPrice / 1M.", requiredInputs: ["dailyRequests", "completionTokens", "cacheHitRatio", "cacheReadPrice"], outputHint: "currency" },
  "cost.ai_daily_total": { description: "Daily total = prompt + completion + cache.", requiredInputs: ["dailyPromptCost", "dailyCompletionCost", "dailyCacheCost"], outputHint: "currency" },
  "cost.ai_monthly_projection": { description: "Monthly projection = dailyTotal × 30 × (1 + growthRate).", requiredInputs: ["dailyTotalCost", "growthRate"], outputHint: "currency" },
  "cost.ai_tco": { description: "TCO = projection + buffer + infra + fallback.", requiredInputs: ["monthlyProjection", "confidenceBuffer", "infraOverhead", "fallbackModelCost"], outputHint: "currency" },
  // ── TOOL 2: Six Sigma ──
  "stats.dpmo": { description: "DPMO = (defects / (units × opportunities)) × 1M.", requiredInputs: ["defects", "units", "opportunities"], outputHint: "number" },
  "stats.yield_rate": { description: "Yield = 1 - (defects / (units × opportunities)).", requiredInputs: ["defects", "units", "opportunities"], outputHint: "percentage" },
  "stats.z_bench": { description: "Z_bench from yield using Abramowitz & Stegun approximation.", requiredInputs: ["yield"], outputHint: "number" },
  "stats.sigma_level": { description: "Sigma level = Z_bench + 1.5 shift.", requiredInputs: ["zBench"], outputHint: "number" },
  "cost.copq": { description: "COPQ = internal + external + appraisal + prevention.", requiredInputs: ["internalFailure", "externalFailure", "appraisal", "prevention"], outputHint: "currency" },
  "stats.project_score": { description: "Project priority = 0.35×fin + 0.25×sigma + 0.25×strat + 0.15×ease.", requiredInputs: ["financialPriority", "sigmaGap", "strategicAlignment", "ease"], outputHint: "number" },
  // ── TOOL 3: AQL Sampling ──
  "quality.ati": { description: "ATI = n + (1 - Pa) × (N - n).", requiredInputs: ["sampleSize", "lotSize", "acceptanceProb"], outputHint: "number" },
  "quality.total_risk_cost": { description: "Risk cost = N × p × (1-Pa) × (1-detectionRate) × costPerDefect.", requiredInputs: ["lotSize", "defectRate", "acceptanceProb", "detectionRate", "costPerDefect"], outputHint: "currency" },
  "quality.alpha_risk": { description: "Producer's risk alpha = 1 - Pa_at_AQL.", requiredInputs: ["acceptanceProb"], outputHint: "percentage" },
  "quality.beta_risk": { description: "Consumer's risk beta = Pa_at_LTPD.", requiredInputs: ["acceptanceProbLTPD"], outputHint: "percentage" },
  // ── TOOL 4: Vehicle Depreciation ──
  "depreciation.sl_annual": { description: "SL annual = (cost - residual) / usefulLife.", requiredInputs: ["cost", "residualValue", "usefulLife"], outputHint: "currency" },
  "depreciation.db_rate": { description: "DB rate = 2 / usefulLife.", requiredInputs: ["usefulLife"], outputHint: "percentage" },
  "depreciation.tco": { description: "TCO = acquisition + PV(op+maint) - PV(residual).", requiredInputs: ["acquisitionCost", "annualOpCost", "annualMaintCost", "residualValue", "discountRate", "usefulLife"], outputHint: "currency" },
  "depreciation.tax_shield": { description: "Annual tax shield = depreciation × taxRate.", requiredInputs: ["annualDepreciation", "taxRate"], outputHint: "currency" },
  // ── TOOL 5: Downtime Cost ──
  "cost.downtime_labor": { description: "Direct labor loss = downtime × workers × rate × 1.3.", requiredInputs: ["downtimeHours", "affectedWorkers", "avgHourlyRate"], outputHint: "currency" },
  "cost.downtime_production": { description: "Production loss = downtime × capacity × contributionMargin.", requiredInputs: ["downtimeHours", "lineCapacityPerHour", "contributionMarginPerUnit"], outputHint: "currency" },
  "cost.downtime_energy": { description: "Energy waste = idlePower × hours × rate.", requiredInputs: ["idlePowerKw", "downtimeHours", "electricityRate"], outputHint: "currency" },
  "cost.downtime_recovery": { description: "Recovery cost = overtimeHours × overtimeRate.", requiredInputs: ["overtimeHours", "overtimeRate"], outputHint: "currency" },
  "cost.downtime_quality": { description: "Quality loss = startupScrap × unitCost.", requiredInputs: ["startupScrapUnits", "unitCost"], outputHint: "currency" },
  "cost.downtime_total": { description: "Total downtime = labor + production + energy + recovery + quality + penalty.", requiredInputs: ["directLaborLoss", "productionLoss", "energyWaste", "recoveryCost", "qualityLoss", "penalty"], outputHint: "currency" },
  // ── TOOL 6: Auto Comeback ──
  "cost.comeback_direct": { description: "Direct comeback = labor + parts + opportunity.", requiredInputs: ["laborCost", "partsCost", "opportunityCost"], outputHint: "currency" },
  "cost.comeback_total": { description: "Total comeback = direct + warranty + goodwill.", requiredInputs: ["directCost", "warrantyCost", "goodwillCost"], outputHint: "currency" },
  // ── TOOL 7: Quote Consistency ──
  "stats.quote_variance": { description: "Quote variance = STDEV / AVERAGE of 3 quotes.", requiredInputs: ["q1", "q2", "q3"], outputHint: "number" },
  "stats.price_deviation": { description: "Price deviation = (quoted - market) / market.", requiredInputs: ["quotedPrice", "marketPrice"], outputHint: "percentage" },
  "stats.consistency_score": { description: "Consistency score = 100 - (var×50 + |priceDev|×25 + |laborDev|×25).", requiredInputs: ["variance", "priceDeviation", "laborDeviation"], outputHint: "number" },
  "cost.margin_leak_quote": { description: "Margin leak = (market - quoted) × quantity.", requiredInputs: ["marketPrice", "quotedPrice", "quantity"], outputHint: "currency" },
  // ── TOOL 8: Auto Shop Margin Leak ──
  "cost.effective_labor_rate": { description: "Effective labor rate = laborRevenue / flagHours.", requiredInputs: ["laborRevenue", "flagHours"], outputHint: "currency" },
  "cost.annual_margin_leakage": { description: "Annual leakage = revenue × (target - net).", requiredInputs: ["totalRevenue", "targetMargin", "netMargin"], outputHint: "currency" },
  // ── TOOL 9: ASME Pressure Vessel ──
  "measurement.vessel_shell_thickness": { description: "Shell thickness = P×R / (S×E - 0.6×P) + CA.", requiredInputs: ["pressure", "radius", "stressAllowable", "jointEfficiency", "corrosionAllowance"], outputHint: "number" },
  "measurement.vessel_sphere_thickness": { description: "Sphere thickness = P×R / (2×S×E - 0.2×P) + CA.", requiredInputs: ["pressure", "radius", "stressAllowable", "jointEfficiency", "corrosionAllowance"], outputHint: "number" },
  "measurement.vessel_mawp": { description: "MAWP = S×E×(t-CA) / (R+0.6×(t-CA)).", requiredInputs: ["stressAllowable", "jointEfficiency", "actualThickness", "corrosionAllowance", "radius"], outputHint: "number" },
  "measurement.vessel_weight": { description: "Vessel weight = π × D × L × t × density.", requiredInputs: ["diameter", "length", "thickness", "materialDensity"], outputHint: "number" },
  // ── TOOL 10: Compressed Air ──
  "energy.compressed_air_power": { description: "Compressor power = Q×ΔP / (effIso×effMotor×effDrive).", requiredInputs: ["flowRate", "deltaPressure", "efficiencyIsothermal", "efficiencyMotor", "efficiencyDrive"], outputHint: "number" },
  "energy.compressed_air_annual_cost": { description: "Annual cost = energy + leakage - heatRecovery.", requiredInputs: ["annualEnergyCost", "leakageCost", "pressureDropCost", "heatRecoverySavings"], outputHint: "currency" },
  // ── TOOL 11: Break-Even ──
  "cost.bep_units": { description: "BEP units = fixedCosts / (price - variableCost).", requiredInputs: ["fixedCosts", "unitPrice", "unitVariableCost"], outputHint: "number" },
  "cost.cmr": { description: "CMR = (price - variable) / price.", requiredInputs: ["unitPrice", "unitVariableCost"], outputHint: "percentage" },
  "cost.bep_revenue": { description: "BEP revenue = fixedCosts / CMR.", requiredInputs: ["fixedCosts", "cmr"], outputHint: "currency" },
  "cost.margin_of_safety_pct": { description: "MoS% = (actual - BEP) / actual × 100.", requiredInputs: ["actualSales", "bepUnits"], outputHint: "percentage" },
  "cost.operating_leverage": { description: "DOL = contributionMargin / netOperatingIncome.", requiredInputs: ["contributionMargin", "netOperatingIncome"], outputHint: "number" },
  "cost.target_profit_units": { description: "Target profit units = (fixed + target) / unitContributionMargin.", requiredInputs: ["fixedCosts", "targetProfit", "unitContributionMargin"], outputHint: "number" },
  // ── TOOL 12: Concrete Volume ──
  "measurement.concrete_volume_total": { description: "Total concrete volume from slab/footing/column/wall geometry.", requiredInputs: ["slabLength", "slabWidth", "slabThickness", "footingCount", "columnCount", "wasteFactor"], outputHint: "number" },
  // ── TOOL 13: Calibration Drift ──
  "measurement.drift_rate": { description: "Drift rate = (lastError - prevError) / daysBetween.", requiredInputs: ["lastError", "prevError", "timeBetweenDays"], outputHint: "number" },
  "measurement.current_uncertainty": { description: "Uncertainty = sqrt(base² + predicted² + env²).", requiredInputs: ["baseUncertainty", "predictedDrift", "environmentalFactor"], outputHint: "number" },
  "measurement.calibration_risk_score": { description: "Risk = (uncertainty/tolerance) × criticality × freq.", requiredInputs: ["currentUncertainty", "toleranceLimit", "criticality", "usageFrequency"], outputHint: "number" },
  // ── TOOL 14: CBAM Exposure ──
  "carbon.embedded_emissions": { description: "Total embedded = direct + indirect.", requiredInputs: ["directEmissions", "indirectEmissions"], outputHint: "number" },
  "carbon.cbam_certificate_cost": { description: "CBAM cost = max(0, total - allowance) × EUprice.", requiredInputs: ["embeddedEmissions", "freeAllowance", "euEtsPrice"], outputHint: "currency" },
  "carbon.compliance_score": { description: "Compliance = data×0.3 + verification×0.3 + reduction×0.4.", requiredInputs: ["dataCompleteness", "verificationStatus", "reductionProgress"], outputHint: "number" },
  // ── TOOL 15: CBAM Compliance ──
  "carbon.specific_embedded": { description: "Specific = totalEmbedded / totalMass.", requiredInputs: ["totalEmbedded", "totalMass"], outputHint: "number" },
  "carbon.actual_vs_default": { description: "AVD = specific / defaultFactor.", requiredInputs: ["specificEmbedded", "defaultFactor"], outputHint: "number" },
  "carbon.cbam_financial_liability": { description: "Liability = total × (EUprice - originPrice).", requiredInputs: ["totalEmbedded", "euEtsPrice", "carbonPricePaidOrigin"], outputHint: "currency" },
  // ── TOOL 16: Chatter Surface Quality ──
  "measurement.cutting_speed": { description: "Vc = π × D × n / 1000.", requiredInputs: ["diameter", "rpm"], outputHint: "number" },
  "measurement.chip_load": { description: "fz = Vf / (z × n).", requiredInputs: ["feedRate", "toothCount", "rpm"], outputHint: "number" },
  "measurement.surface_roughness_theoretical": { description: "Ra_theo = fz² / (8 × r_epsilon).", requiredInputs: ["chipLoad", "noseRadius"], outputHint: "number" },
  "measurement.surface_roughness_actual": { description: "Ra_actual = Ra_theo × (1 + chatterAmplification/100).", requiredInputs: ["theoreticalRa", "chatterAmplification"], outputHint: "number" },
  "cost.chatter_quality_loss": { description: "Quality loss = (Ra_actual - limit) × reworkCost.", requiredInputs: ["actualRa", "toleranceLimit", "reworkCostPerMicron"], outputHint: "currency" },
  // ── TOOL 17: Bolt Torque ──
  "measurement.bolt_d2": { description: "Pitch diameter d2 = d - 0.649519×p.", requiredInputs: ["nominalDiameter", "pitch"], outputHint: "number" },
  "measurement.bolt_d3": { description: "Root diameter d3 = d - 1.226869×p.", requiredInputs: ["nominalDiameter", "pitch"], outputHint: "number" },
  "measurement.bolt_tensile_area": { description: "At = π/4 × ((d2+d3)/2)².", requiredInputs: ["d2", "d3"], outputHint: "number" },
  "measurement.bolt_preload": { description: "Preload = 0.7 × proofStrength × At.", requiredInputs: ["proofStrength", "tensileArea"], outputHint: "number" },
  "measurement.bolt_torque": { description: "Torque = K × D × F.", requiredInputs: ["torqueCoefficient", "nominalDiameter", "preload"], outputHint: "number" },
  // ── TOOL 18: Turnover Cost ──
  "cost.turnover_total": { description: "Total turnover = separation + vacancy + replacement + training + productivity.", requiredInputs: ["separationCost", "vacancyCost", "replacementCost", "trainingCost", "productivityLoss"], outputHint: "currency" },
  // ── TOOL 19: Cloud API Overrun ──
  "cost.cloud_overrun_cost": { description: "Overrun = max(0, total - included) × overageRate.", requiredInputs: ["totalRequests", "includedRequests", "overageRate"], outputHint: "currency" },
  "cost.cloud_throttling_cost": { description: "Throttling = throttled × retryCost × avgRetries.", requiredInputs: ["throttledRequests", "retryCost", "avgRetries"], outputHint: "currency" },
  "cost.cloud_overrun_total": { description: "Total = overrun + throttling + egress + SLA.", requiredInputs: ["overrunCost", "throttlingCost", "dataEgressCost", "slaPenalty"], outputHint: "currency" },
  // ── TOOL 20: Cloud Waste ──
  "cost.cloud_waste_total": { description: "Total waste = zombie + oversizing + spot + reserved + idle.", requiredInputs: ["zombieCost", "oversizingSavings", "spotSavings", "reservedSavings", "idleHoursCost"], outputHint: "currency" },
  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLS 101-140 META
  // ═══════════════════════════════════════════════════════════════════════════
  "measurement.route_nearest_neighbor": { description: "Nearest neighbor distance for route optimization.", requiredInputs: ["minDistance"], outputHint: "number" },
  "measurement.route_clarke_wright": { description: "Clarke-Wright savings from depot and inter-stop distances.", requiredInputs: ["depotDistA","depotDistB","distAB"], outputHint: "number" },
  "measurement.route_efficiency_score": { description: "Route efficiency as theoretical minimum over actual distance.", requiredInputs: ["theoreticalMin","actualRouteDist"], outputHint: "number" },
  "cost.route_total_savings": { description: "Total routing savings from baseline minus optimized cost.", requiredInputs: ["baselineCost","optimizedCost"], outputHint: "currency" },
  "measurement.wind_aep": { description: "Annual energy production from rated power and capacity factor.", requiredInputs: ["ratedPower","capacityFactor"], outputHint: "number" },
  "cost.wind_annual_revenue": { description: "Annual revenue from AEP and feed-in tariff.", requiredInputs: ["aep","feedInTariff"], outputHint: "currency" },
  "cost.wind_ebitda": { description: "Wind turbine EBITDA from revenue minus opex.", requiredInputs: ["annualRevenue","opex"], outputHint: "currency" },
  "cost.wind_lcoe": { description: "Levelized cost of energy for wind turbine.", requiredInputs: ["totalCapex","opex","lifeYears","aep"], outputHint: "currency" },
  "cost.wind_npv": { description: "Net present value of wind turbine investment.", requiredInputs: ["ebitda","wacc","lifeYears","totalCapex"], outputHint: "currency" },
  "measurement.saas_shelfware_pct": { description: "Percentage of unused SaaS licenses.", requiredInputs: ["totalLicenses","activeUsers"], outputHint: "percentage" },
  "cost.saas_shelfware_cost": { description: "Cost of unused SaaS licenses.", requiredInputs: ["shelfwarePct","totalContract"], outputHint: "currency" },
  "cost.burdened_hourly_rate": { description: "Fully burdened hourly labor rate including taxes and benefits.", requiredInputs: ["grossSalary","employerTaxes","benefits","productiveHours"], outputHint: "currency" },
  "measurement.smed_capacity_recovered": { description: "Capacity recovered from SMED setup reduction.", requiredInputs: ["currentSetup","targetSetup","changeoverFreq"], outputHint: "number" },
  "cost.smed_financial_gain": { description: "Financial gain from SMED capacity recovery.", requiredInputs: ["capacityRecovered","bottleneckThroughput","unitMargin"], outputHint: "currency" },
  "cost.smed_roi": { description: "ROI of SMED investment.", requiredInputs: ["financialGain","smedInvestment"], outputHint: "percentage" },
  "cost.incentive_target_fee": { description: "Target fee from target cost and fee percentage.", requiredInputs: ["targetCost","targetFeePct"], outputHint: "currency" },
  "cost.incentive_actual_fee": { description: "Actual incentive fee with sharing ratio and fee limits.", requiredInputs: ["targetFee","targetCost","actualCost","contractorSharePct","minFee","maxFee"], outputHint: "currency" },
  "measurement.spc_arl_in_control": { description: "Average run length when process is in control.", requiredInputs: ["alpha"], outputHint: "number" },
  "measurement.spc_arl_out_of_control": { description: "Average run length when process is out of control.", requiredInputs: ["beta"], outputHint: "number" },
  "cost.spc_delay_cost": { description: "Cost of delayed SPC signal detection.", requiredInputs: ["arlOOC","samplingInterval","productionRate","defectRateOOC","costPerDefect"], outputHint: "currency" },
  "measurement.steam_loss_rate": { description: "Steam loss rate through orifice.", requiredInputs: ["orificeArea","deltaPressure","steamDensity"], outputHint: "number" },
  "cost.steam_trap_annual_loss": { description: "Annual cost of steam loss through failed trap.", requiredInputs: ["steamLoss","operatingHours","steamCost"], outputHint: "currency" },
  "cost.steam_trap_roi": { description: "ROI of steam trap repair.", requiredInputs: ["systemLoss","trapCost","laborCost"], outputHint: "percentage" },
  "measurement.inventory_turnover_ratio": { description: "Inventory turnover ratio from COGS and average inventory.", requiredInputs: ["cogs","avgInventory"], outputHint: "number" },
  "measurement.dsi_days": { description: "Days sales of inventory (DSI).", requiredInputs: ["inventoryTurnover"], outputHint: "number" },
  "cost.obsolescence_risk_cost": { description: "Cost of inventory obsolescence risk.", requiredInputs: ["avgInventory","obsolescenceRate"], outputHint: "currency" },
  "cost.liquidation_loss": { description: "Loss from liquidating slow-moving inventory at salvage value.", requiredInputs: ["slowMovingInv","salvagePct"], outputHint: "currency" },
  "measurement.water_intensity": { description: "Water consumption per unit of production.", requiredInputs: ["totalWater","productionVolume"], outputHint: "number" },
  "cost.water_savings_total": { description: "Total water savings from baseline minus actual consumption.", requiredInputs: ["baselineConsumption","actualConsumption"], outputHint: "number" },
  "cost.water_cost_savings": { description: "Monetary savings from reduced water use.", requiredInputs: ["waterSavings","supplyRate","wastewaterRate"], outputHint: "currency" },
  "cost.water_roi": { description: "ROI of water conservation project.", requiredInputs: ["costSavings","equipmentCost","installationCost"], outputHint: "percentage" },
  "measurement.irrigation_water_req": { description: "Irrigation water requirement from ETc, area, and effective rainfall.", requiredInputs: ["etc","area","effectiveRainfall"], outputHint: "number" },
  "cost.irrigation_energy_cost": { description: "Energy cost for irrigation pumping.", requiredInputs: ["waterRequirement","totalHead","pumpEff","motorEff","elecRate"], outputHint: "currency" },
  "cost.irrigation_total_cost": { description: "Total irrigation cost including energy, maintenance, labor, and depreciation.", requiredInputs: ["energyCost","maintCost","laborCost","depreciation"], outputHint: "currency" },
  "cost.supplier_tco": { description: "Total cost of ownership for a supplier.", requiredInputs: ["purchasePrice","orderingCost","transportCost","qualityCost","inventoryCost","riskCost"], outputHint: "currency" },
  "measurement.fcm_milk": { description: "Fat corrected milk yield at 4% fat.", requiredInputs: ["milkYield","fatYield"], outputHint: "number" },
  "cost.dairy_income_over_feed": { description: "Dairy income over feed cost (IOFC).", requiredInputs: ["milkPrice","milkYield","totalFeedCost"], outputHint: "currency" },
  "cost.taguchi_loss_per_unit": { description: "Taguchi quality loss per unit from deviation.", requiredInputs: ["toleranceCost","toleranceLimit","actualValue","targetValue"], outputHint: "currency" },
  "cost.tooling_cost_per_part": { description: "Tooling cost allocated per part produced.", requiredInputs: ["toolingCost","partsProduced"], outputHint: "currency" },
  "cost.tooling_total": { description: "Total tooling cost including purchase, regrind, and inventory.", requiredInputs: ["purchaseCost","regrindCost","inventoryCost"], outputHint: "currency" },
  "cost.premature_failure_cost": { description: "Cost from premature tooling failures.", requiredInputs: ["prematureFailures","toolingCost"], outputHint: "currency" },
  "measurement.takt_time": { description: "Takt time from available time divided by customer demand.", requiredInputs: ["availableTime","customerDemand"], outputHint: "duration" },
  "measurement.cycle_flexibility": { description: "Cycle flexibility ratio of takt time over actual cycle time.", requiredInputs: ["taktTime","actualCycleTime"], outputHint: "number" },
  "cost.balance_loss": { description: "Cost of line balance loss from delays.", requiredInputs: ["balanceDelay","laborRate"], outputHint: "currency" },
  "cost.flexibility_premium": { description: "Premium cost for production flexibility.", requiredInputs: ["flexibilityHours","premiumRate"], outputHint: "currency" },
  "measurement.forecast_error": { description: "Absolute forecast error between actual and forecast demand.", requiredInputs: ["actualDemand","forecastDemand"], outputHint: "number" },
  "measurement.safety_stock_forecast": { description: "Safety stock from service factor, demand variability, and lead time.", requiredInputs: ["serviceFactor","demandStdDev","leadTime"], outputHint: "number" },
  "cost.forecast_carrying_cost": { description: "Carrying cost of safety stock inventory.", requiredInputs: ["safetyStock","holdingCostPerUnit"], outputHint: "currency" },
  "cost.stockout_cost_forecast": { description: "Stockout cost from lost margin.", requiredInputs: ["stockoutUnits","lostMarginPerUnit"], outputHint: "currency" },
  "cost.total_forecast_cost": { description: "Total forecast cost including carrying and stockout costs.", requiredInputs: ["carryingCost","stockoutCost"], outputHint: "currency" },
  "cost.quote_total": { description: "Total repair quote from parts, labor, and overhead.", requiredInputs: ["partsCost","laborHours","laborRate","overheadCost"], outputHint: "currency" },
  "cost.gross_profit_pct": { description: "Gross profit percentage on repair work.", requiredInputs: ["grossProfit","revenue"], outputHint: "percentage" },
  "measurement.quoted_margin": { description: "Quoted margin percentage on subcontract work.", requiredInputs: ["quotedPrice","estimatedCost"], outputHint: "percentage" },
  "measurement.actual_margin": { description: "Actual margin percentage achieved.", requiredInputs: ["actualRevenue","actualCost"], outputHint: "percentage" },
  "cost.margin_leak_sub": { description: "Subcontractor margin leak from quoted minus actual.", requiredInputs: ["quotedMargin","actualMargin"], outputHint: "percentage" },
  "cost.leakage_pct": { description: "Margin leakage as percentage of quoted margin.", requiredInputs: ["marginLeakSub","quotedMargin"], outputHint: "percentage" },
  "cost.transport_air": { description: "Air freight cost from weight and rate.", requiredInputs: ["airFreightKg","airRatePerKg"], outputHint: "currency" },
  "cost.transport_sea": { description: "Sea freight cost from volume and rate.", requiredInputs: ["seaFreightCbm","seaRatePerCbm"], outputHint: "currency" },
  "cost.transport_road": { description: "Road freight cost from distance and rate.", requiredInputs: ["roadFreightKm","roadRatePerKm"], outputHint: "currency" },
  "cost.transit_time_cost": { description: "Transit time cost from days, capital cost, and cargo value.", requiredInputs: ["transitDays","costOfCapital","cargoValue"], outputHint: "currency" },
  "cost.risk_cost_transport": { description: "Transport risk cost as percentage of cargo value.", requiredInputs: ["cargoValue","riskPct"], outputHint: "currency" },
  "cost.total_mode_cost": { description: "Total transport cost across all modes and risk.", requiredInputs: ["transportAir","transportSea","transportRoad","transitTimeCost","riskCostTransport"], outputHint: "currency" },
  "cost.risk_exposure_sc": { description: "Supply chain risk exposure from supplier spend and disruption probability.", requiredInputs: ["supplierSpend","disruptionProb"], outputHint: "currency" },
  "cost.revenue_loss_sc": { description: "Revenue loss from supply chain disruption.", requiredInputs: ["disruptionDays","dailyRevenue","impactPct"], outputHint: "currency" },
  "cost.risk_adjusted_cost_sc": { description: "Risk adjusted supply chain cost.", requiredInputs: ["riskExposureSc","revenueLossSc"], outputHint: "currency" },
  "measurement.resilience_index": { description: "Supply chain resilience index.", requiredInputs: ["recoveryCapacity","normalDemand"], outputHint: "number" },
  "cost.fx_exposure_supplier": { description: "Supplier FX exposure from contract value and exchange rate.", requiredInputs: ["contractValue","exchangeRate"], outputHint: "currency" },
  "cost.fx_expected_loss": { description: "Expected FX loss from exposure and volatility.", requiredInputs: ["fxExposureSupplier","forexVolatility"], outputHint: "currency" },
  "cost.fx_var_supplier": { description: "FX value-at-risk for supplier contract.", requiredInputs: ["fxExposureSupplier","confidenceFactor"], outputHint: "currency" },
  "cost.fx_net_risk_cost": { description: "Net FX risk cost after hedge savings.", requiredInputs: ["fxExpectedLoss","fxVarSupplier","hedgeSavings"], outputHint: "currency" },
  "cost.fx_clause_savings": { description: "Savings from FX clause in supplier contract.", requiredInputs: ["fxExposureSupplier","clauseDiscountPct"], outputHint: "currency" },
  "cost.base_estimate": { description: "Base bid estimate from direct, indirect costs and profit.", requiredInputs: ["directCost","indirectCost","profitMargin"], outputHint: "currency" },
  "cost.contingency_total": { description: "Total contingency from base estimate and percentage.", requiredInputs: ["baseEstimate","contingencyPct"], outputHint: "currency" },
  "measurement.win_probability": { description: "Bid win probability from competitive score.", requiredInputs: ["competitiveScore","maxScore"], outputHint: "percentage" },
  "cost.expected_value_bid": { description: "Expected value of bid adjusted for win probability.", requiredInputs: ["baseEstimate","contingencyTotal","winProbability"], outputHint: "currency" },
  "cost.recurring_annual_cost": { description: "Annualized recurring cost from monthly cost.", requiredInputs: ["monthlyCost"], outputHint: "currency" },
  "cost.present_value_recurring": { description: "Present value of recurring costs over time.", requiredInputs: ["recurringAnnualCost","discountRate","years"], outputHint: "currency" },
  "cost.npv_elimination": { description: "NPV of eliminating recurring cost.", requiredInputs: ["presentValueRecurring","eliminationCost"], outputHint: "currency" },
  "cost.root_cause_payback": { description: "Payback period for root cause fix investment.", requiredInputs: ["fixCost","recurringAnnualCost"], outputHint: "number" },
  "measurement.textile_waste_rate": { description: "Textile waste rate as percentage of total material.", requiredInputs: ["wasteKg","totalKg"], outputHint: "percentage" },
  "cost.pre_consumer_waste": { description: "Cost of pre-consumer textile waste.", requiredInputs: ["preConsumerKg","materialCostPerKg"], outputHint: "currency" },
  "cost.net_waste_cost": { description: "Net textile waste cost after recycling revenue.", requiredInputs: ["preConsumerWaste","postConsumerWaste","recyclingRevenue"], outputHint: "currency" },
  "measurement.waste_risk_score": { description: "Textile waste risk score relative to industry benchmark.", requiredInputs: ["textileWasteRate","industryBenchmark"], outputHint: "number" },
  "cost.cleaning_labor_cost": { description: "Cleaning labor cost from hours and rate.", requiredInputs: ["cleaningHours","cleaningRate"], outputHint: "currency" },
  "cost.cleaning_bid_price": { description: "Cleaning bid price including labor, material, overhead, and margin.", requiredInputs: ["cleaningLaborCost","cleaningMaterialCost","cleaningOverhead","cleaningMargin"], outputHint: "currency" },
  "measurement.delivery_efficiency": { description: "Delivery efficiency from on-time vs total deliveries.", requiredInputs: ["onTimeDeliveries","totalDeliveries"], outputHint: "percentage" },
  "cost.failed_delivery_cost": { description: "Cost of failed deliveries.", requiredInputs: ["failedDeliveries","costPerFailedDelivery"], outputHint: "currency" },
  "cost.total_delivery_cost": { description: "Total delivery cost including successful and failed deliveries.", requiredInputs: ["successfulDeliveries","costPerSuccessfulDelivery","failedDeliveryCost"], outputHint: "currency" },
  "measurement.seed_requirement": { description: "Seed requirement from area and seeding rate.", requiredInputs: ["areaHa","seedRatePerHa"], outputHint: "number" },
  "cost.seed_cost_total": { description: "Total seed cost from requirement and price.", requiredInputs: ["seedRequirement","seedPricePerUnit"], outputHint: "currency" },
  "cost.seed_financial_loss": { description: "Financial loss from poor seed germination.", requiredInputs: ["expectedGermination","actualGermination","seedCostTotal"], outputHint: "currency" },
  "cost.total_employee_cost": { description: "Total employee cost including salary, employer costs, bonus, training, and benefits.", requiredInputs: ["grossSalary","employerCosts","bonus","training","otherBenefits"], outputHint: "currency" },
  "cost.employee_cost_per_hour": { description: "Employee cost per working hour.", requiredInputs: ["totalEmployeeCost","annualWorkHours"], outputHint: "currency" },
  "cost.transfer_tax_impact": { description: "Tax impact from transfer price vs market price.", requiredInputs: ["transferPrice","marketPrice","taxRateDiff"], outputHint: "currency" },
  "cost.transfer_global_profit": { description: "Global profit after transfer tax adjustment.", requiredInputs: ["sellerProfit","buyerProfit","transferTaxImpact"], outputHint: "currency" },
  "measurement.complexity_index": { description: "Product complexity index from unique vs total parts.", requiredInputs: ["uniqueParts","totalParts"], outputHint: "number" },
  "cost.hidden_cost_complexity": { description: "Hidden cost from product complexity.", requiredInputs: ["complexityIndex","annualOverhead"], outputHint: "currency" },
  "cost.profitability_per_sku": { description: "Profitability per SKU sold.", requiredInputs: ["skuRevenue","skuCost","skuQty"], outputHint: "currency" },
  "measurement.vacuum_leak_rate": { description: "Vacuum leak rate from pressure drop, volume, and test duration.", requiredInputs: ["pressureDrop","chamberVolume","testDuration"], outputHint: "number" },
  "cost.vacuum_leak_cost": { description: "Cost of vacuum leak over operating hours.", requiredInputs: ["vacuumLeakRate","energyCostPerUnit","operatingHours"], outputHint: "currency" },
  "measurement.vacuum_capacity_waste": { description: "Vacuum capacity wasted by leaks.", requiredInputs: ["vacuumLeakRate","vacuumCapacity"], outputHint: "percentage" },
  "cost.shift_total_cost": { description: "Total shift cost from workers, hours, and rate.", requiredInputs: ["shiftWorkers","shiftHours","shiftRate"], outputHint: "currency" },
  "measurement.shift_efficiency": { description: "Shift efficiency from actual vs max output.", requiredInputs: ["shiftOutput","shiftMaxOutput"], outputHint: "percentage" },
  "cost.shift_cost_per_unit": { description: "Shift cost per unit produced.", requiredInputs: ["shiftTotalCost","shiftOutput"], outputHint: "currency" },
  "cost.vsm_leadtime_cost": { description: "VSM lead time cost from total lead time and cost per day.", requiredInputs: ["totalLeadTime","costPerDay"], outputHint: "currency" },
  "measurement.vsm_value_added_ratio": { description: "Value-added ratio from value-added time over total lead time.", requiredInputs: ["valueAddedTime","totalLeadTime"], outputHint: "percentage" },
  "cost.vsm_non_value_added_cost": { description: "Cost of non-value-added time in VSM.", requiredInputs: ["totalLeadTime","valueAddedTime","costPerDay"], outputHint: "currency" },
  "cost.vsm_total_financial_impact": { description: "Total VSM financial impact from lead time, NVA, and inventory.", requiredInputs: ["leadtimeCost","nonValueAddedCost","inventoryCost"], outputHint: "currency" },
  "measurement.carbon_equivalent": { description: "Carbon equivalent from alloy composition (CE formula).", requiredInputs: ["carbonPct","mnPct","crPct","moPct","vPct","niPct","cuPct"], outputHint: "number" },
  "measurement.preheat_required": { description: "Preheat required indicator based on carbon equivalent threshold.", requiredInputs: ["carbonEquivalent","thresholdCe"], outputHint: "score" },
  "cost.preheat_energy_cost": { description: "Energy cost of preheat operation.", requiredInputs: ["preheatHours","energyRate","preheatPower"], outputHint: "currency" },
  "cost.fuel_waste_distance": { description: "Fuel waste cost from excess distance driven.", requiredInputs: ["actualKm","optimalKm","fuelCostPerKm"], outputHint: "currency" },
  "cost.fuel_waste_efficiency": { description: "Fuel waste cost from efficiency deviation.", requiredInputs: ["actualFuelUsed","fuelPrice","expectedFuelCost"], outputHint: "currency" },
  "cost.idle_fuel_cost": { description: "Fuel cost from idle engine time.", requiredInputs: ["idleHours","fuelCostPerHour"], outputHint: "currency" },
  "cost.total_drift_cost": { description: "Total route drift cost from distance, efficiency, and idle losses.", requiredInputs: ["fuelWasteDistance","fuelWasteEfficiency","idleFuelCost"], outputHint: "currency" },
  "measurement.hydrant_flow": { description: "Hydrant flow rate from pressure and orifice coefficient.", requiredInputs: ["hydrantPressure","orificeCoefficient"], outputHint: "number" },
  "measurement.available_flow": { description: "Available hydrant flow minus required flow.", requiredInputs: ["hydrantFlow","requiredFlow"], outputHint: "number" },
  "cost.hydrant_compliance": { description: "Cost of hydrant non-compliance remediation.", requiredInputs: ["deficientHydrants","remediationCost"], outputHint: "currency" },
  "cost.renovation_base_cost": { description: "Renovation base cost from area and unit cost.", requiredInputs: ["areaSqm","costPerSqm"], outputHint: "currency" },
  "cost.renovation_total_budget": { description: "Total renovation budget including contingency and design fees.", requiredInputs: ["renovationBaseCost","contingencyBudget","designFee"], outputHint: "currency" },
  "cost.renovation_roi": { description: "ROI of renovation investment.", requiredInputs: ["valueAfter","renovationTotalBudget"], outputHint: "percentage" },
  "measurement.renewable_annual_gen": { description: "Annual renewable energy generation from capacity and capacity factor.", requiredInputs: ["installedCapacity","capacityFactor"], outputHint: "number" },
  "cost.renewable_npv": { description: "NPV of renewable energy investment.", requiredInputs: ["annualCashFlow","discountRate","lifeYears","totalInvestment"], outputHint: "currency" },
  "cost.renewable_lcoe": { description: "Levelized cost of energy for renewable project.", requiredInputs: ["totalInvestment","annualOpex","lifeYears","annualGen"], outputHint: "currency" },
  "cost.roi_investment": { description: "Return on investment from net profit and investment.", requiredInputs: ["netProfit","initialInvestment"], outputHint: "percentage" },
  "cost.npv_investment": { description: "Net present value of investment.", requiredInputs: ["annualCashFlowNpv","discountRateNpv","lifeYearsNpv","initialInvestment"], outputHint: "currency" },
  "cost.irr_investment": { description: "Internal rate of return proxy from cash flow ratio.", requiredInputs: ["annualCashFlowNpv","initialInvestment"], outputHint: "percentage" },
  "cost.payback_period_inv": { description: "Payback period for investment in years.", requiredInputs: ["initialInvestment","annualCashFlowNpv"], outputHint: "number" },
  "measurement.standard_time": { description: "Standard time from observed time, performance rating, and allowance.", requiredInputs: ["observedTime","performanceRating","allowancePct"], outputHint: "duration" },
  "measurement.standard_output": { description: "Standard output per hour.", requiredInputs: ["standardTime"], outputHint: "number" },
  "cost.labor_cost_per_unit_zaman": { description: "Labor cost per unit from standard time and labor rate.", requiredInputs: ["standardTime","laborRate"], outputHint: "currency" },
  "cost.efficiency_variance": { description: "Labor efficiency variance from actual vs standard time.", requiredInputs: ["actualTime","standardTime","actualOutput","laborRate"], outputHint: "currency" },
  // --- Schema-linter fixes (UNKNOWN_FORMULA) ---
  "cost.setup_total_cost": { description: "Setup total cost from changeover time and cost per minute.", requiredInputs: ["changeoverTime","costPerMinute"], outputHint: "currency" },
  "measurement.waste_percentage": { description: "Waste percentage from waste over total.", requiredInputs: ["waste","total"], outputHint: "percentage" },
  "cost.vacuum_savings_potential": { description: "Savings potential from 70% of vacuum leak cost.", requiredInputs: ["vacuumLeakCost"], outputHint: "currency" },
  "cost.annual_shift_cost": { description: "Annual shift cost from workers, hours, rate, and days.", requiredInputs: ["shiftWorkers","shiftHours","shiftRate","shiftDays"], outputHint: "currency" },
  "measurement.crack_risk_score": { description: "Crack risk score from carbon equivalent vs threshold.", requiredInputs: ["carbonEquivalent","thresholdCe"], outputHint: "number" },
  "cost.hydrant_compliance_penalty": { description: "Compliance penalty from deficient hydrants.", requiredInputs: ["deficientHydrants","penaltyPerHydrant"], outputHint: "currency" },
  "cost.renovation_budget_breakdown": { description: "Renovation budget breakdown (base + contingency + design).", requiredInputs: ["renovationBaseCost","contingencyBudget","designFee"], outputHint: "currency" },
  "cost.renewable_irr": { description: "IRR proxy from cash flow ratio.", requiredInputs: ["annualCashFlow","totalInvestment"], outputHint: "percentage" },
  "measurement.renewable_payback": { description: "Payback period from investment and annual cash flow.", requiredInputs: ["totalInvestment","annualCashFlow"], outputHint: "number" },
  "measurement.dso": { description: "Days sales outstanding from AR and annual revenue.", requiredInputs: ["accountsReceivable","annualRevenue"], outputHint: "number" },
  "measurement.dpo": { description: "Days payable outstanding from AP and annual COGS.", requiredInputs: ["accountsPayable","annualCOGS"], outputHint: "number" },
  "measurement.dio": { description: "Days inventory outstanding from inventory and annual COGS.", requiredInputs: ["inventory","annualCOGS"], outputHint: "number" },
  "cost.demand_charge": { description: "Demand charge from peak kW, rate, and months.", requiredInputs: ["peakDemandKW","demandRatePerKW","months"], outputHint: "currency" },
  "measurement.breakeven_unit": { description: "Breakeven unit from fixed cost and unit contribution.", requiredInputs: ["fixedCost","unitPrice","variableCost"], outputHint: "number" },
  "measurement.machine_economic_life": { description: "Machine economic life from operating cost, salvage factor, and holding cost rate.", requiredInputs: ["annualOperatingCost","salvageFactor","holdingCostRate"], outputHint: "number" },
  "measurement.spi": { description: "Schedule performance index (EV / PV).", requiredInputs: ["earnedValue","plannedValue"], outputHint: "number" },
  "measurement.cpi": { description: "Cost performance index (EV / AC).", requiredInputs: ["earnedValue","actualCost"], outputHint: "number" },
  "cost.eac": { description: "Estimate at completion (BAC / CPI).", requiredInputs: ["budgetAtCompletion","cpi"], outputHint: "currency" },
  "cost.expected_overrun": { description: "Expected overrun (EAC - BAC).", requiredInputs: ["eac","budgetAtCompletion"], outputHint: "currency" },
  "measurement.schedule_delay": { description: "Schedule delay from planned duration and EV.", requiredInputs: ["plannedDuration","earnedValue","budgetAtCompletion"], outputHint: "number" },
  "cost.risk_exposure": { description: "Risk exposure from probability and impact.", requiredInputs: ["probability","impact"], outputHint: "currency" },
  "cost.net_risk": { description: "Net risk after mitigation costs.", requiredInputs: ["riskExposure","mitigationCost"], outputHint: "currency" },
  "cost.recipe_yield_loss": { description: "Cost of recipe yield loss from expected vs actual.", requiredInputs: ["expectedYield","actualYield","costPerUnit"], outputHint: "currency" },
  "measurement.recipe_efficiency": { description: "Recipe efficiency (actual / expected × 100).", requiredInputs: ["actualYield","expectedYield"], outputHint: "percentage" },
  "cost.restaurant_variance": { description: "Restaurant food cost variance × meals served.", requiredInputs: ["expectedFoodCost","actualFoodCost","mealsServed"], outputHint: "currency" },
  "cost.robot_roi": { description: "ROI of robot automation including error cost.", requiredInputs: ["annualLaborCost","annualErrorCost","robotAnnualCost","robotInvestment"], outputHint: "percentage" },
  "cost.route_overhead": { description: "Route overhead from distance and rate per km.", requiredInputs: ["routeDistance","overheadPerKm"], outputHint: "currency" },
  "cost.route_total_cost": { description: "Total route cost (fuel + labor + overhead).", requiredInputs: ["routeFuelCost","routeLaborCost","routeOverhead"], outputHint: "currency" },
};

function buildFormulaRegistryMeta(): FormulaRegistryMeta[] {
  return listRegisteredFormulaIds().map((formulaId) => {
    const canonicalId = LEGACY_ALIASES[formulaId] ?? formulaId;
    const meta = FORMULA_META[formulaId];
    const details = FORMULA_META_DETAILS[canonicalId] ?? (USER_FORMULA_META_DETAILS as Record<string, Omit<FormulaRegistryMeta, "formulaId" | "family" | "label">>)[canonicalId];
    if (!meta || !details) {
      throw new Error(`Missing formula metadata for "${formulaId}"`);
    }
    return {
      formulaId,
      family: meta.family,
      label: meta.label,
      description: details.description,
      requiredInputs: details.requiredInputs,
      outputHint: details.outputHint,
    };
  });
}

export const FORMULA_REGISTRY_META: readonly FormulaRegistryMeta[] = buildFormulaRegistryMeta();

export function getFormulaRegistryMeta(formulaId: string): FormulaRegistryMeta | null {
  return FORMULA_REGISTRY_META.find((item) => item.formulaId === formulaId) ?? null;
}
