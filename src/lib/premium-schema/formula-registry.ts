/**
 * Safe Formula Registry — typed, testable functions only.
 * Organized under 10 locked industrial formula families.
 * Schemas reference formulaId; never expression strings.
 */

import {
  FORMULA_FAMILIES,
  FORMULA_FAMILY_LABELS,
  type FormulaFamilyId,
} from "@/lib/premium-schema/formula-families";
import {
  getPrimedSevenMudaEngineeringResult,
  resolveHighestWasteCategoryIndex,
} from "@/lib/premium-schema/calculators/seven-muda-waste-cost";
import type { PremiumOutputFormat } from "@/lib/premium-schema/premium-calculator-schema";

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
    fn: () => getPrimedSevenMudaEngineeringResult().overproductionCost,
  },
  {
    id: "lean.muda_waiting_cost",
    family: "cost",
    label: "Waiting waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().waitingCost,
  },
  {
    id: "lean.muda_transport_cost",
    family: "cost",
    label: "Transport waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().transportCost,
  },
  {
    id: "lean.muda_inventory_cost",
    family: "cost",
    label: "Excess inventory holding waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().inventoryCost,
  },
  {
    id: "lean.muda_motion_cost",
    family: "cost",
    label: "Unnecessary motion waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().motionCost,
  },
  {
    id: "lean.muda_overprocessing_cost",
    family: "cost",
    label: "Overprocessing waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().overprocessingCost,
  },
  {
    id: "lean.muda_defect_cost",
    family: "cost",
    label: "Defect waste cost from scrap and rework",
    fn: () => getPrimedSevenMudaEngineeringResult().defectCost,
  },
  {
    id: "lean.muda_total_waste_cost",
    family: "cost",
    label: "Seven muda total waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().totalWasteCost,
  },
  {
    id: "lean.muda_highest_waste_index",
    family: "cost",
    label: "Highest muda waste category rank",
    fn: () =>
      resolveHighestWasteCategoryIndex({
        overproductionCost: getPrimedSevenMudaEngineeringResult().overproductionCost,
        waitingCost: getPrimedSevenMudaEngineeringResult().waitingCost,
        transportCost: getPrimedSevenMudaEngineeringResult().transportCost,
        inventoryCost: getPrimedSevenMudaEngineeringResult().inventoryCost,
        motionCost: getPrimedSevenMudaEngineeringResult().motionCost,
        overprocessingCost: getPrimedSevenMudaEngineeringResult().overprocessingCost,
        defectCost: getPrimedSevenMudaEngineeringResult().defectCost,
      }),
  },
  {
    id: "lean.muda_annualized_waste_cost",
    family: "cost",
    label: "Annualized waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().annualizedWasteCost,
  },
  {
    id: "lean.muda_waste_cost_per_unit",
    family: "cost",
    label: "Waste cost per unit",
    fn: () => getPrimedSevenMudaEngineeringResult().wasteCostPerUnit,
  },
  {
    id: "lean.muda_period_revenue",
    family: "cost",
    label: "Period revenue",
    fn: () => getPrimedSevenMudaEngineeringResult().periodRevenue,
  },
  {
    id: "lean.muda_period_gross_margin_value",
    family: "cost",
    label: "Period gross margin value",
    fn: () => getPrimedSevenMudaEngineeringResult().periodGrossMarginValue,
  },
  {
    id: "lean.muda_waste_to_revenue_ratio_pct",
    family: "cost",
    label: "Waste to revenue ratio",
    fn: () => getPrimedSevenMudaEngineeringResult().wasteToRevenueRatioPct,
  },
  {
    id: "lean.muda_waste_to_gross_margin_ratio_pct",
    family: "cost",
    label: "Waste to gross margin ratio",
    fn: () => getPrimedSevenMudaEngineeringResult().wasteToGrossMarginRatioPct,
  },
  {
    id: "lean.muda_highest_waste_cost",
    family: "cost",
    label: "Highest waste category cost",
    fn: () => getPrimedSevenMudaEngineeringResult().highestWasteCost,
  },
  {
    id: "lean.muda_risk_adjusted_priority_score",
    family: "cost",
    label: "Risk-adjusted priority score",
    fn: () => getPrimedSevenMudaEngineeringResult().riskAdjustedPriorityScore,
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
      const investment = Math.abs(num(inputs, "initialInvestment"));
      const annual = num(inputs, "annualCashFlow");
      const rate = num(inputs, "discountRatePercent") / 100;
      const years = Math.max(1, Math.round(num(inputs, "horizonYears", 5)));
      let pv = -investment;
      for (let year = 1; year <= years; year += 1) {
        pv += annual / (1 + rate) ** year;
      }
      return assertFinite(pv);
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
};

function buildFormulaRegistryMeta(): FormulaRegistryMeta[] {
  return listRegisteredFormulaIds().map((formulaId) => {
    const canonicalId = LEGACY_ALIASES[formulaId] ?? formulaId;
    const meta = FORMULA_META[formulaId];
    const details = FORMULA_META_DETAILS[canonicalId];
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
