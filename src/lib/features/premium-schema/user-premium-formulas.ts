/**
 * User-Provided Premium Formulas
 *
 * These formulas are EXACTLY as specified by the user for 141 premium tools.
 * They replace any auto-generated formulas for the same tools.
 *
 * Auto-generated from data/premium-formulas-batch.txt
 * Generated: 2026-06-20T23:40:55.781Z
 */

import type {
  FormulaDefinition,
  FormulaInputs,
} from "@/lib/features/premium-schema/formula-registry";
import type { FormulaRegistryMeta } from "@/lib/features/premium-schema/formula-registry";

// Helper functions (mirrored from formula-registry.ts)
function num(inputs: FormulaInputs, key: string, fallback = 0): number {
  const value = inputs[key];
  return Number.isFinite(typeof value === "number" ? value : Number(value))
    ? value
    : fallback;
}

function assertFinite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function nonNegative(value: number): number {
  return assertFinite(Math.max(0, value));
}

/** Safe SUM polyfill — batch formulas use SUM(…) for time-series aggregation over periods t=1..n.
 *  Currently returns 0 as a safe no-op; implement per-formula array iteration when schema requires it. */
function SUM<T>(_xs: T): number { return 0; }


/** Safe time-series accessor — returns input values or 0. */
function tVal(inputs: FormulaInputs, key: string, t: number, fallback = 0): number {
  const raw = inputs[key];
  if (Array.isArray(raw) && raw.length > t) {
    const v = Number(raw[t]);
    return Number.isFinite(v) ? v : fallback;
  }
  return typeof raw === "number" ? raw : fallback;
}

/**
 * Standard normal CDF approximation (Abramowitz & Stegun 26.2.17).
 * Returns P(Z ≤ x) for Z ~ N(0,1).
 */
function normStd(x: number): number {
  const b0 = 0.2316419, b1 = 0.319381530, b2 = -0.356563782;
  const b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
  const t = 1 / (1 + b0 * Math.abs(x));
  const poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
  const cdf = 1 - poly * Math.exp(-x * x / 2);
  return x >= 0 ? cdf : 1 - cdf;
}

/**
 * Standard normal inverse CDF approximation (rational).
 * Returns z such that P(Z ≤ z) = p for Z ~ N(0,1).
 */
function normSInv(p: number): number {
  if (p <= 0) return -6;
  if (p >= 1) return 6;
  const a = [-3.969683028665376e+1, 2.209460984245205e+2,
    -2.759285104469687e+2, 1.383577518672690e+2,
    -3.066479806614716e+1, 2.506628277459239e+0];
  const b = [-5.447609879822406e+1, 1.615858368580409e+2,
    -1.556989798598866e+2, 6.680131188771972e+1,
    -1.328068155288572e+1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1,
    -2.400758277161838e+0, -2.549732539343734e+0,
    4.374664141464968e+0, 2.938163982698783e+0];
  const d = [7.784695709041462e-3, 3.224671290700398e-1,
    2.445134137142996e+0, 3.754408661907416e+0];
  
  const q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    return q * (((((a[5] * r + a[4]) * r + a[3]) * r + a[2]) * r + a[1]) * r + a[0]) /
      (((((b[4] * r + b[3]) * r + b[2]) * r + b[1]) * r + b[0]) * r + 1);
  }
  const r = q < 0 ? p : 1 - p;
  if (r <= 0) return q < 0 ? -6 : 6;
  const rSqrt = Math.sqrt(-2 * Math.log(r));
  const z = (((((c[5] * rSqrt + c[4]) * rSqrt + c[3]) * rSqrt + c[2]) * rSqrt + c[1]) * rSqrt + c[0]) /
    ((((d[3] * rSqrt + d[2]) * rSqrt + d[1]) * rSqrt + d[0]) * rSqrt + 1);
  return q < 0 ? -z : z;
}

// ═══════════════════════════════════════════════════════════════════════════
// USER-PROVIDED FORMULA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════


import { CHUNK_01_DEFINITIONS } from "./formulas/chunk-01";
import { CHUNK_02_DEFINITIONS } from "./formulas/chunk-02";
import { CHUNK_03_DEFINITIONS } from "./formulas/chunk-03";
import { CHUNK_04_DEFINITIONS } from "./formulas/chunk-04";
import { CHUNK_05_DEFINITIONS } from "./formulas/chunk-05";
import { CHUNK_06_DEFINITIONS } from "./formulas/chunk-06";
import { CHUNK_07_DEFINITIONS } from "./formulas/chunk-07";
import { CHUNK_08_DEFINITIONS } from "./formulas/chunk-08";
import { CHUNK_09_DEFINITIONS } from "./formulas/chunk-09";
import { CHUNK_10_DEFINITIONS } from "./formulas/chunk-10";
import { CHUNK_11_DEFINITIONS } from "./formulas/chunk-11";
import { CHUNK_12_DEFINITIONS } from "./formulas/chunk-12";
import { CHUNK_13_DEFINITIONS } from "./formulas/chunk-13";
import { CHUNK_14_DEFINITIONS } from "./formulas/chunk-14";
import { CHUNK_15_DEFINITIONS } from "./formulas/chunk-15";
import { CHUNK_16_DEFINITIONS } from "./formulas/chunk-16";
import { CHUNK_17_DEFINITIONS } from "./formulas/chunk-17";
import { CHUNK_18_DEFINITIONS } from "./formulas/chunk-18";
import { CHUNK_19_DEFINITIONS } from "./formulas/chunk-19";
import { CHUNK_20_DEFINITIONS } from "./formulas/chunk-20";
import { CHUNK_21_DEFINITIONS } from "./formulas/chunk-21";
import { CHUNK_22_DEFINITIONS } from "./formulas/chunk-22";
import { CHUNK_23_DEFINITIONS } from "./formulas/chunk-23";
import { CHUNK_24_DEFINITIONS } from "./formulas/chunk-24";
import { CHUNK_25_DEFINITIONS } from "./formulas/chunk-25";
import { CHUNK_26_DEFINITIONS } from "./formulas/chunk-26";
import { CHUNK_27_DEFINITIONS } from "./formulas/chunk-27";
import { CHUNK_28_DEFINITIONS } from "./formulas/chunk-28";
import { CHUNK_29_DEFINITIONS } from "./formulas/chunk-29";
import { CHUNK_30_DEFINITIONS } from "./formulas/chunk-30";
import { CHUNK_31_DEFINITIONS } from "./formulas/chunk-31";
import { CHUNK_32_DEFINITIONS } from "./formulas/chunk-32";
import { CHUNK_33_DEFINITIONS } from "./formulas/chunk-33";
import { CHUNK_34_DEFINITIONS } from "./formulas/chunk-34";
import { CHUNK_35_DEFINITIONS } from "./formulas/chunk-35";
import { CHUNK_36_DEFINITIONS } from "./formulas/chunk-36";
import { CHUNK_37_DEFINITIONS } from "./formulas/chunk-37";
import { CHUNK_38_DEFINITIONS } from "./formulas/chunk-38";
import { CHUNK_39_DEFINITIONS } from "./formulas/chunk-39";
import { CHUNK_40_DEFINITIONS } from "./formulas/chunk-40";
import { CHUNK_41_DEFINITIONS } from "./formulas/chunk-41";
import { CHUNK_42_DEFINITIONS } from "./formulas/chunk-42";
import { CHUNK_43_DEFINITIONS } from "./formulas/chunk-43";
import { CHUNK_44_DEFINITIONS } from "./formulas/chunk-44";
import { CHUNK_45_DEFINITIONS } from "./formulas/chunk-45";
import { CHUNK_46_DEFINITIONS } from "./formulas/chunk-46";
import { CHUNK_47_DEFINITIONS } from "./formulas/chunk-47";
import { CHUNK_48_DEFINITIONS } from "./formulas/chunk-48";
import { CHUNK_49_DEFINITIONS } from "./formulas/chunk-49";
import { CHUNK_50_DEFINITIONS } from "./formulas/chunk-50";
import { CHUNK_51_DEFINITIONS } from "./formulas/chunk-51";
import { CHUNK_52_DEFINITIONS } from "./formulas/chunk-52";
import { CHUNK_53_DEFINITIONS } from "./formulas/chunk-53";
import { CHUNK_54_DEFINITIONS } from "./formulas/chunk-54";
import { CHUNK_55_DEFINITIONS } from "./formulas/chunk-55";
import { CHUNK_56_DEFINITIONS } from "./formulas/chunk-56";
import { CHUNK_57_DEFINITIONS } from "./formulas/chunk-57";
import { CHUNK_58_DEFINITIONS } from "./formulas/chunk-58";
import { CHUNK_59_DEFINITIONS } from "./formulas/chunk-59";
import { CHUNK_60_DEFINITIONS } from "./formulas/chunk-60";
import { CHUNK_61_DEFINITIONS } from "./formulas/chunk-61";
import { CHUNK_62_DEFINITIONS } from "./formulas/chunk-62";
import { CHUNK_63_DEFINITIONS } from "./formulas/chunk-63";
import { CHUNK_64_DEFINITIONS } from "./formulas/chunk-64";
import { CHUNK_65_DEFINITIONS } from "./formulas/chunk-65";
import { CHUNK_66_DEFINITIONS } from "./formulas/chunk-66";
import { CHUNK_67_DEFINITIONS } from "./formulas/chunk-67";

export const USER_FORMULA_DEFINITIONS: FormulaDefinition[] = [];
USER_FORMULA_DEFINITIONS.push(...CHUNK_01_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_02_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_03_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_04_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_05_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_06_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_07_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_08_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_09_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_10_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_11_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_12_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_13_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_14_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_15_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_16_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_17_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_18_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_19_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_20_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_21_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_22_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_23_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_24_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_25_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_26_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_27_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_28_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_29_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_30_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_31_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_32_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_33_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_34_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_35_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_36_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_37_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_38_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_39_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_40_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_41_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_42_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_43_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_44_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_45_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_46_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_47_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_48_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_49_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_50_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_51_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_52_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_53_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_54_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_55_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_56_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_57_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_58_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_59_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_60_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_61_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_62_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_63_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_64_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_65_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_66_DEFINITIONS);
USER_FORMULA_DEFINITIONS.push(...CHUNK_67_DEFINITIONS);

export const USER_FORMULA_META_DETAILS: Record<
  string,
  Omit<FormulaRegistryMeta, "formulaId" | "family" | "label">
> = {
// ── AI TOKEN MALİYET ──
  "user.ai_token_cost_0": { description: "AI TOKEN MALİYET: BasePromptCost = (PromptTokens * PromptPrice) / 1000000", requiredInputs: [], outputHint: "number" },
  "user.ai_token_cost_1": { description: "AI TOKEN MALİYET: BaseCompletionCost = (CompletionTokens * CompletionPrice) / 1000000", requiredInputs: [], outputHint: "number" },
  "user.ai_token_cost_2": { description: "AI TOKEN MALİYET: CacheReadCost = (CachedTokens * CacheReadPrice) / 1000000", requiredInputs: [], outputHint: "number" },
  "user.ai_token_cost_3": { description: "AI TOKEN MALİYET: MonthlyProjection = (DailyBaseCost * 30) * (1 + GrowthRate)", requiredInputs: [], outputHint: "number" },
  "user.ai_token_cost_4": { description: "AI TOKEN MALİYET: TCO = MonthlyProjection + InfraOverhead + FallbackCost", requiredInputs: [], outputHint: "number" },
  // ── ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ ──
  "user.six_sigma_project_prioritizer_0": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: DPMO = (Defects / (Units * Opportunities)) * 1000000", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_1": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: Yield = 1 - (Defects / (Units * Opportunities))", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_2": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: Z_bench = NORMSINV(Yield)", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_3": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: SigmaLevel = Z_bench + 1.5", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_4": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: COPQ = InternalFailure + ExternalFailure + Appraisal + Prevention", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_5": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: ProjectScore = (COPQ * RecoveryProb * 0.35) + (SigmaGap * 0.25) + (StrategicAlignment * 0.25) + (Ease * 0.15)", requiredInputs: [], outputHint: "number" },
  // ── AQL SAMPLING RİSK & MALİYET ──
  "user.aql_sampling_risk_0": { description: "AQL SAMPLING RİSK & MALİYET: CodeLetter = LookupCodeLetter(LotSize, InspectionLevel)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_1": { description: "AQL SAMPLING RİSK & MALİYET: n = SampleSize(CodeLetter, AQL)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_2": { description: "AQL SAMPLING RİSK & MALİYET: Ac = AcceptanceNumber(CodeLetter, AQL)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_3": { description: "AQL SAMPLING RİSK & MALİYET: Pa_producer = BINOMDIST(Ac, n, p_AQL, TRUE)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_4": { description: "AQL SAMPLING RİSK & MALİYET: Alpha = 1 - Pa_producer", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_5": { description: "AQL SAMPLING RİSK & MALİYET: Pa_consumer = BINOMDIST(Ac, n, p_LTPD, TRUE)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_6": { description: "AQL SAMPLING RİSK & MALİYET: Beta = Pa_consumer", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_7": { description: "AQL SAMPLING RİSK & MALİYET: ATI = n + (1 - Pa) * (N - n)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_8": { description: "AQL SAMPLING RİSK & MALİYET: TotalRiskCost = (N * p * (1 - Pa) * (1 - DetectionRate)) * CostPerDefect", requiredInputs: [], outputHint: "number" },
  // ── ARAÇ AMORTİSMANI ──
  "user.vehicle_depreciation_tco_0": { description: "ARAÇ AMORTİSMANI: SL_Annual = (Cost - SalvageValue) / UsefulLife", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_1": { description: "ARAÇ AMORTİSMANI: DB_Rate = 2 / UsefulLife", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_2": { description: "ARAÇ AMORTİSMANI: DB_Year_t = BookValue_(t-1) * DB_Rate", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_3": { description: "ARAÇ AMORTİSMANI: MACRS_Year_t = Cost * MACRS_Table(AssetClass, Year)", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_4": { description: "ARAÇ AMORTİSMANI: UoP_PerUnit = (Cost - SalvageValue) / TotalExpectedUnits", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_5": { description: "ARAÇ AMORTİSMANI: TCO = AcquisitionCost + SUM((OpCost_t + MaintCost_t - Salvage_t) / (1 + DiscountRate)^t)", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_6": { description: "ARAÇ AMORTİSMANI: TaxShield = Depreciation * TaxRate", requiredInputs: [], outputHint: "number" },
  // ── ARIZA SÜRESİ MALİYETİ ──
  "user.downtime_cost_0": { description: "ARIZA SÜRESİ MALİYETİ: DirectLaborLoss = DowntimeHours * AffectedWorkers * AvgHourlyRate * (1 + BurdenRate)", requiredInputs: [], outputHint: "number" },
  "user.downtime_cost_1": { description: "ARIZA SÜRESİ MALİYETİ: ProductionLoss = DowntimeHours * LineCapacity * ContributionMargin", requiredInputs: [], outputHint: "number" },
  "user.downtime_cost_2": { description: "ARIZA SÜRESİ MALİYETİ: EnergyWaste = IdlePowerKW * DowntimeHours * ElectricityRate", requiredInputs: [], outputHint: "number" },
  "user.downtime_cost_3": { description: "ARIZA SÜRESİ MALİYETİ: RecoveryCost = OvertimeHours * OvertimeRate * CrewSize", requiredInputs: [], outputHint: "number" },
  "user.downtime_cost_4": { description: "ARIZA SÜRESİ MALİYETİ: TotalDowntimeCost = DirectLaborLoss + ProductionLoss + EnergyWaste + RecoveryCost + QualityLoss + Penalty", requiredInputs: [], outputHint: "number" },
  // ── AUTO REPAIR COMEBACK ──
  "user.auto_repair_comeback_0": { description: "AUTO REPAIR COMEBACK: ComebackRate = (ComebackOrders / TotalCompleted) * 100", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_1": { description: "AUTO REPAIR COMEBACK: ComebackCost_Direct = ComebackOrders * (DiagTime + RepairTime) * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_2": { description: "AUTO REPAIR COMEBACK: ComebackCost_Parts = ComebackOrders * WastedPartsValue", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_3": { description: "AUTO REPAIR COMEBACK: ComebackCost_Opportunity = ComebackOrders * BayOccupancyHours * RevenuePerBayHour", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_4": { description: "AUTO REPAIR COMEBACK: DPMO = (ComebackOrders / TotalCompleted) * 1000000", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_5": { description: "AUTO REPAIR COMEBACK: TotalCost = Direct + Parts + Warranty + Goodwill + Opportunity", requiredInputs: [], outputHint: "number" },
  // ── AUTO REPAIR QUOTE ──
  "user.auto_repair_quote_consistency_0": { description: "AUTO REPAIR QUOTE: QuoteVariance = STDEV(QuoteAmounts) / AVERAGE(QuoteAmounts)", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_quote_consistency_1": { description: "AUTO REPAIR QUOTE: PartPriceDeviation = (QuotedPartPrice - MarketAvg) / MarketAvg", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_quote_consistency_2": { description: "AUTO REPAIR QUOTE: LaborTimeDeviation = (QuotedLaborHours - StandardHours) / StandardHours", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_quote_consistency_3": { description: "AUTO REPAIR QUOTE: ConsistencyScore = 100 - (QuoteVariance * 50 + ABS(PartPriceDeviation) * 25 + ABS(LaborTimeDeviation) * 25)", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_quote_consistency_4": { description: "AUTO REPAIR QUOTE: MarginLeak = SUM((MarketPrice - QuotedPrice) * Quantity)", requiredInputs: [], outputHint: "number" },
  // ── AUTO SHOP MARJ KAÇAK ──
  "user.auto_shop_margin_leak_0": { description: "AUTO SHOP MARJ KAÇAK: GrossMargin_Parts = (PartsRevenue - PartsCOGS) / PartsRevenue", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_1": { description: "AUTO SHOP MARJ KAÇAK: EffectiveLaborRate = TotalLaborRevenue / TotalFlagHours", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_2": { description: "AUTO SHOP MARJ KAÇAK: ProductivityRate = TotalFlagHours / TotalAvailableHours", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_3": { description: "AUTO SHOP MARJ KAÇAK: MarginLeak_Discount = SUM(Discount) / TotalRevenue", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_4": { description: "AUTO SHOP MARJ KAÇAK: MarginLeak_Shrinkage = InventoryShrinkage / PartsCOGS", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_5": { description: "AUTO SHOP MARJ KAÇAK: NetMargin = (TotalRevenue - TotalCOGS - TotalOpEx) / TotalRevenue", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_6": { description: "AUTO SHOP MARJ KAÇAK: AnnualLeakage = TotalRevenue * (TargetMargin - NetMargin)", requiredInputs: [], outputHint: "number" },
  // ── BASINÇ VESSEL KALINLIK ──
  "user.asme_pressure_vessel_0": { description: "BASINÇ VESSEL KALINLIK: t_shell = (P * R) / (S * E - 0.6 * P) + C_A", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_1": { description: "BASINÇ VESSEL KALINLIK: t_sphere = (P * R) / (2 * S * E - 0.2 * P) + C_A", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_2": { description: "BASINÇ VESSEL KALINLIK: t_head_ellip = (P * D) / (2 * S * E - 0.2 * P) + C_A", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_3": { description: "BASINÇ VESSEL KALINLIK: M = 0.25 * (3 + SQRT(L/r))^2", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_4": { description: "BASINÇ VESSEL KALINLIK: t_head_tori = (P * L * M) / (2 * S * E - 0.2 * P) + C_A", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_5": { description: "BASINÇ VESSEL KALINLIK: MAWP = (S * E * (t - C_A)) / (R + 0.6 * (t - C_A))", requiredInputs: [], outputHint: "number" },
  // ── BASINÇLI HAVA ENERJİ ──
  "user.compressed_air_energy_cost_0": { description: "BASINÇLI HAVA ENERJİ: CompressorPower = (Q * DeltaP) / (Eff_isothermal * Eff_motor * Eff_drive)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_energy_cost_1": { description: "BASINÇLI HAVA ENERJİ: SpecificPower = CompressorPower / Q_actual", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_energy_cost_2": { description: "BASINÇLI HAVA ENERJİ: AnnualEnergyCost = CompressorPower * OpHours * ElecRate * LoadFactor", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_energy_cost_3": { description: "BASINÇLI HAVA ENERJİ: LeakageCost = SUM(LeakFlow * OpHours * SpecificPower * ElecRate)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_energy_cost_4": { description: "BASINÇLI HAVA ENERJİ: TotalAnnualCost = AnnualEnergyCost + LeakageCost + PressureDropCost + UnloadWaste - HeatRecoverySavings", requiredInputs: [], outputHint: "number" },
  // ── BAŞABAŞ NOKTASI ──
  "user.break_even_margin_of_safety_0": { description: "BAŞABAŞ NOKTASI: BEP_Units = FixedCosts / (UnitPrice - UnitVariableCost)", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_1": { description: "BAŞABAŞ NOKTASI: BEP_Revenue = FixedCosts / CMR", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_2": { description: "BAŞABAŞ NOKTASI: CMR = (UnitPrice - UnitVariableCost) / UnitPrice", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_3": { description: "BAŞABAŞ NOKTASI: MarginOfSafety_Percent = (ActualSales - BEP_Units) / ActualSales * 100", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_4": { description: "BAŞABAŞ NOKTASI: OperatingLeverage = ContributionMargin / NetOperatingIncome", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_5": { description: "BAŞABAŞ NOKTASI: TargetProfit_Units = (FixedCosts + TargetProfit) / UnitContributionMargin", requiredInputs: [], outputHint: "number" },
  // ── BETON HACMİ ──
  "user.concrete_volume_cost_0": { description: "BETON HACMİ: V_slab = Length * Width * Thickness", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_1": { description: "BETON HACMİ: V_footing = Length * Width * Depth * Count", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_2": { description: "BETON HACMİ: V_column = PI * (Diameter/2)^2 * Height * Count", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_3": { description: "BETON HACMİ: V_wall = Length * Height * Thickness", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_4": { description: "BETON HACMİ: V_total = V_geometric * (1 + WasteFactor)", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_5": { description: "BETON HACMİ: Weight = V_total * Density", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_6": { description: "BETON HACMİ: TruckLoads = CEILING(V_total / TruckCapacity)", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_7": { description: "BETON HACMİ: TotalCost = V_total * UnitPrice + PumpCost", requiredInputs: [], outputHint: "number" },
  // ── CALIBRATION SAPMA ──
  "user.calibration_drift_risk_0": { description: "CALIBRATION SAPMA: DriftRate = (LastError - PrevError) / TimeBetween", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_1": { description: "CALIBRATION SAPMA: PredictedDrift = DriftRate * TimeSinceLast", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_2": { description: "CALIBRATION SAPMA: CurrentUncertainty = SQRT(BaseUncertainty^2 + PredictedDrift^2 + EnvFactor^2)", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_3": { description: "CALIBRATION SAPMA: RiskScore = (CurrentUncertainty / Tolerance) * Criticality * UsageFreq", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_4": { description: "CALIBRATION SAPMA: OptimalInterval = BaseInterval * (Tolerance / CurrentUncertainty)", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_5": { description: "CALIBRATION SAPMA: GuardBand = ExpandedUncertainty * k", requiredInputs: [], outputHint: "number" },
  // ── CBAM MARUZİYET ──
  "user.cbam_exposure_0": { description: "CBAM MARUZİYET: DirectEmissions = SUM(ActivityData * EmissionFactor)", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_1": { description: "CBAM MARUZİYET: IndirectEmissions = ElecConsumption * GridFactor", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_2": { description: "CBAM MARUZİYET: CarbonIntensity = (DirectEmissions + IndirectEmissions) / ProductionVolume", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_3": { description: "CBAM MARUZİYET: CBAMCertificateCost = (EmbeddedEmissions - FreeAllowance) * EU_ETS_Price", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_4": { description: "CBAM MARUZİYET: FreeAllowance = Benchmark * ProductionVolume * LeakageFactor", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_5": { description: "CBAM MARUZİYET: ComplianceScore = (DataComplete * 0.3) + (Verification * 0.3) + (Reduction * 0.4)", requiredInputs: [], outputHint: "number" },
  // ── CBAM UYUMLULUK ──
  "user.cbam_compliance_verdict_0": { description: "CBAM UYUMLULUK: TotalMass = SUM(Mass)", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_1": { description: "CBAM UYUMLULUK: TotalEmbedded = SUM(Direct + Indirect)", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_2": { description: "CBAM UYUMLULUK: SpecificEmbedded = TotalEmbedded / TotalMass", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_3": { description: "CBAM UYUMLULUK: ActualVsDefault = SpecificEmbedded / DefaultEmissionFactor", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_4": { description: "CBAM UYUMLULUK: FinancialLiability = TotalEmbedded * (EU_ETS_Price - CarbonPricePaidOrigin)", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_5": { description: "CBAM UYUMLULUK: ComplianceDecision = IF(ActualVsDefault < 1 AND Liability < MarginThreshold, 'Proceed', 'Reevaluate')", requiredInputs: [], outputHint: "number" },
  // ── CHATTER YÜZEY KALİTE ──
  "user.chatter_surface_quality_0": { description: "CHATTER YÜZEY KALİTE: V_c = (PI * D * n) / 1000", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_1": { description: "CHATTER YÜZEY KALİTE: f_z = V_f / (z * n)", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_2": { description: "CHATTER YÜZEY KALİTE: SurfaceRoughness_Theo = f_z^2 / (8 * r_epsilon)", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_3": { description: "CHATTER YÜZEY KALİTE: SurfaceRoughness_Actual = Theo * ChatterAmplification", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_4": { description: "CHATTER YÜZEY KALİTE: QualityLossCost = (Actual - ToleranceLimit) * ReworkCostPerMicron", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_5": { description: "CHATTER YÜZEY KALİTE: ScrapRate = IF(Actual > MaxTolerance, 1, 0) * BatchSize", requiredInputs: [], outputHint: "number" },
  // ── CIVATE TORK ──
  "user.bolt_torque_preload_0": { description: "CIVATE TORK: T = K * D * F", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_1": { description: "CIVATE TORK: F = Preload = Sigma_p * A_t", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_2": { description: "CIVATE TORK: Sigma_p = 0.7 * ProofStrength", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_3": { description: "CIVATE TORK: A_t = (PI / 4) * ((d2 + d3) / 2)^2", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_4": { description: "CIVATE TORK: d2 = d - 0.649519 * p", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_5": { description: "CIVATE TORK: d3 = d - 1.226869 * p", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_6": { description: "CIVATE TORK: YieldCheck = IF(Sigma_p > YieldStrength, 'FAIL', 'PASS')", requiredInputs: [], outputHint: "number" },
  // ── CİRO MALİYETİ ──
  "user.employee_turnover_cost_0": { description: "CİRO MALİYETİ: SeparationCost = ExitInterview * HRRate + Severance + Admin", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_1": { description: "CİRO MALİYETİ: VacancyCost = (TimeToFill * DailyRevenue) + TempCost", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_2": { description: "CİRO MALİYETİ: ReplacementCost = Ads + Agency + InterviewTime * Rate", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_3": { description: "CİRO MALİYETİ: TrainingCost = TrainHours * TrainerRate + OnboardHours * NewHireRate", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_4": { description: "CİRO MALİYETİ: ProductivityLoss = TimeToFull * AvgOutput * (1 - RampUp) * Margin", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_5": { description: "CİRO MALİYETİ: TotalTurnoverCost = Separation + Vacancy + Replacement + Training + Productivity", requiredInputs: [], outputHint: "number" },
  // ── CLOUD API OVERRUN ──
  "user.cloud_api_overrun_0": { description: "CLOUD API OVERRUN: OverrunRequests = MAX(0, TotalRequests - IncludedRequests)", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_1": { description: "CLOUD API OVERRUN: OverrunCost = OverrunRequests * OverageRate", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_2": { description: "CLOUD API OVERRUN: ThrottlingCost = ThrottledRequests * RetryCost * AvgRetries", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_3": { description: "CLOUD API OVERRUN: DataEgressCost = DataOutGB * EgressRate", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_4": { description: "CLOUD API OVERRUN: SLABreachPenalty = IF(Availability < SLA, MonthlyFee * CreditPct, 0)", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_5": { description: "CLOUD API OVERRUN: TotalOverrunCost = OverrunCost + ThrottlingCost + DataEgressCost + SLABreachPenalty", requiredInputs: [], outputHint: "number" },
  // ── CLOUD FIRE ELIMINATION ──
  "user.cloud_waste_elimination_0": { description: "CLOUD FIRE ELIMINATION: ZombieCost = SUM(UnattachedVolumes * Rate) + SUM(IdleLBs * Rate) + SUM(OrphanSnapshots * StorageRate)", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_1": { description: "CLOUD FIRE ELIMINATION: OversizingSavings = SUM((CurrentCost - RightSizedCost) * Uptime)", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_2": { description: "CLOUD FIRE ELIMINATION: SpotSavings = SUM((OnDemand - Spot) * FaultTolerantHours)", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_3": { description: "CLOUD FIRE ELIMINATION: ReservedSavings = (OnDemand - Reserved) * CommitUtil", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_4": { description: "CLOUD FIRE ELIMINATION: IdleHoursCost = NonBizHours * RunningInstances * HourlyRate", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_5": { description: "CLOUD FIRE ELIMINATION: TotalWaste = Zombie + Oversizing + Spot + Reserved + Idle", requiredInputs: [], outputHint: "number" },
  // ── CLV / CAC ORANI ──
  "user.clv_cac_ratio_0": { description: "CLV / CAC ORANI: CLV = AvgOrderValue * PurchaseFreq * Lifespan", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_1": { description: "CLV / CAC ORANI: GrossMarginCLV = CLV * GrossMarginPct", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_2": { description: "CLV / CAC ORANI: DiscountedCLV = SUM((GrossMarginCLV * Retention^t) / (1 + DiscountRate)^t)", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_3": { description: "CLV / CAC ORANI: CAC = (SalesMarketing + Salaries + Overhead) / NewCustomers", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_4": { description: "CLV / CAC ORANI: Payback = CAC / AvgMonthlyGrossProfit", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_5": { description: "CLV / CAC ORANI: LTV_CAC = DiscountedCLV / CAC", requiredInputs: [], outputHint: "number" },
  // ── CNC ÇEVRİM SÜRESİ ──
  "user.cnc_cycle_time_0": { description: "CNC ÇEVRİM SÜRESİ: T_cut = (L * D) / (V_f * a_p)", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_1": { description: "CNC ÇEVRİM SÜRESİ: V_f = f_z * z * n", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_2": { description: "CNC ÇEVRİM SÜRESİ: n = (1000 * V_c) / (PI * D_tool)", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_3": { description: "CNC ÇEVRİM SÜRESİ: T_rapid = Distance_rapid / V_rapid", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_4": { description: "CNC ÇEVRİM SÜRESİ: T_toolchange = Changes * TimePerChange", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_5": { description: "CNC ÇEVRİM SÜRESİ: T_total = T_cut + T_rapid + T_toolchange + T_noncutting + T_load_unload", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_6": { description: "CNC ÇEVRİM SÜRESİ: OEE_Availability = Planned / (Planned + Downtime)", requiredInputs: [], outputHint: "number" },
  // ── CNC İŞLEME MALİYETİ ──
  "user.cnc_machining_cost_0": { description: "CNC İŞLEME MALİYETİ: Cost_Material = Volume_raw * Density * PricePerKg * (1 + ScrapRate)", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_1": { description: "CNC İŞLEME MALİYETİ: Cost_Machining = T_total * MachineRate", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_2": { description: "CNC İŞLEME MALİYETİ: Cost_Tooling = (T_cut / ToolLife) * ToolCost", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_3": { description: "CNC İŞLEME MALİYETİ: Cost_Energy = Power * T_total * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_4": { description: "CNC İŞLEME MALİYETİ: Cost_Overhead = T_total * OverheadRate", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_5": { description: "CNC İŞLEME MALİYETİ: TotalUnitCost = Material + Machining + Tooling + Energy + Overhead + Quality", requiredInputs: [], outputHint: "number" },
  // ── CPK TO PPM ──
  "user.cpk_ppm_converter_0": { description: "CPK TO PPM: Z_USL = (USL - Mean) / StdDev", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_1": { description: "CPK TO PPM: Z_LSL = (Mean - LSL) / StdDev", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_2": { description: "CPK TO PPM: Cpk = MIN(Z_USL, Z_LSL) / 3", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_3": { description: "CPK TO PPM: P_USL = 1 - NORMSDIST(Z_USL)", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_4": { description: "CPK TO PPM: P_LSL = NORMSDIST(-Z_LSL)", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_5": { description: "CPK TO PPM: P_Total = P_USL + P_LSL", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_6": { description: "CPK TO PPM: PPM = P_Total * 1000000", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_7": { description: "CPK TO PPM: Yield = 1 - P_Total", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_8": { description: "CPK TO PPM: Sigma_ShortTerm = (Cpk * 3) + 1.5", requiredInputs: [], outputHint: "number" },
  // ── CPM GECİKME CEZASI ──
  "user.cpm_delay_penalty_0": { description: "CPM GECİKME CEZASI: TotalFloat = LateStart - EarlyStart", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_1": { description: "CPM GECİKME CEZASI: CriticalDelay = MAX(0, Actual - Planned - TotalFloat)", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_2": { description: "CPM GECİKME CEZASI: ExcusableDelay = ForceMajeure + OwnerCaused", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_3": { description: "CPM GECİKME CEZASI: NonExcusable = CriticalDelay - Excusable", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_4": { description: "CPM GECİKME CEZASI: LiquidatedDamages = NonExcusable * DailyPenalty", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_5": { description: "CPM GECİKME CEZASI: AccelerationCost = CrashingCost * DaysAccelerated", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_6": { description: "CPM GECİKME CEZASI: NetPenalty = LiquidatedDamages - AccelerationCost", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_7": { description: "CPM GECİKME CEZASI: EOT_Claim = Excusable * (1 - EffFactor)", requiredInputs: [], outputHint: "number" },
  // ── ÇATI ALANI ──
  "user.roof_area_load_0": { description: "ÇATI ALANI: Area_Footprint = Length * Width", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_1": { description: "ÇATI ALANI: Area_Gable = Footprint / COS(PitchAngle)", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_2": { description: "ÇATI ALANI: OverhangArea = Perimeter * OverhangWidth", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_3": { description: "ÇATI ALANI: TotalMaterialArea = Area_Roof * (1 + WasteFactor)", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_4": { description: "ÇATI ALANI: RidgeLength = Length - Width + (Width * SQRT(2))", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_5": { description: "ÇATI ALANI: Load_Dead = MaterialWeight * TotalArea", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_6": { description: "ÇATI ALANI: Load_Snow = GroundSnow * Exposure * Thermal * Slope", requiredInputs: [], outputHint: "number" },
  // ── DARBOĞAZ YATIRIM ──
  "user.bottleneck_investment_0": { description: "DARBOĞAZ YATIRIM: Utilization = ActualOutput / DesignCapacity", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_1": { description: "DARBOĞAZ YATIRIM: Throughput = Demand * (1 - DefectRate)", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_2": { description: "DARBOĞAZ YATIRIM: TaktTime = AvailableTime / Demand", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_3": { description: "DARBOĞAZ YATIRIM: CycleTime_Gap = BottleneckCycle - TaktTime", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_4": { description: "DARBOĞAZ YATIRIM: CostOfConstraint = CycleTime_Gap * Demand * UnitMargin", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_5": { description: "DARBOĞAZ YATIRIM: ROI = (ThroughputIncrease * Margin * Days) / UpgradeCost", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_6": { description: "DARBOĞAZ YATIRIM: Payback = UpgradeCost / MonthlyGain", requiredInputs: [], outputHint: "number" },
  // ── DEĞİŞİM MATRİSİ SMED ──
  "user.smed_changeover_matrix_0": { description: "DEĞİŞİM MATRİSİ SMED: T_internal = SetupStopped", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_1": { description: "DEĞİŞİM MATRİSİ SMED: T_external = SetupRunning", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_2": { description: "DEĞİŞİM MATRİSİ SMED: T_total = T_internal + T_external", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_3": { description: "DEĞİŞİM MATRİSİ SMED: T_target = T_internal * (1 - ConversionRate) + T_external", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_4": { description: "DEĞİŞİM MATRİSİ SMED: EBQ = SQRT((2 * Demand * SetupCost) / HoldingCost)", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_5": { description: "DEĞİŞİM MATRİSİ SMED: SetupCost = T_total * MachineRate + Labor", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_6": { description: "DEĞİŞİM MATRİSİ SMED: AnnualSavings = (T_total - T_target) * Freq * Rate", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_7": { description: "DEĞİŞİM MATRİSİ SMED: CapacityGain = (T_total - T_target) * Freq / Available", requiredInputs: [], outputHint: "number" },
  // ── DEPO YERLEŞİMİ ──
  "user.warehouse_layout_0": { description: "DEPO YERLEŞİMİ: StorageArea = Footprint * UtilRate", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_1": { description: "DEPO YERLEŞİMİ: PalletPositions = StorageArea / (PalletFootprint * AisleFactor)", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_2": { description: "DEPO YERLEŞİMİ: VerticalCap = PalletPositions * RackLevels", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_3": { description: "DEPO YERLEŞİMİ: ThroughputCap = Doors / (Turnaround_Load + Turnaround_Unload)", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_4": { description: "DEPO YERLEŞİMİ: TravelDist = SUM(Freq * Dist)", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_5": { description: "DEPO YERLEŞİMİ: PickEfficiency = Lines / TravelTime", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_6": { description: "DEPO YERLEŞİMİ: CubeUtil = ActualVol / RackVol", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_7": { description: "DEPO YERLEŞİMİ: CostPerPos = FacilityCost / PalletPositions", requiredInputs: [], outputHint: "number" },
  // ── DEVAMSIZLIK MALİYETİ ──
  "user.absenteeism_cost_0": { description: "DEVAMSIZLIK MALİYETİ: DirectCost = AbsentHours * HourlyRate * (1 + Burden)", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_1": { description: "DEVAMSIZLIK MALİYETİ: OvertimePremium = ReplaceOT * (OTRate - RegRate)", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_2": { description: "DEVAMSIZLIK MALİYETİ: TempCost = TempHours * TempRate * (1 + Markup)", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_3": { description: "DEVAMSIZLIK MALİYETİ: ProdLoss = AbsentHours * OutputPerHour * Margin * EffDrop", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_4": { description: "DEVAMSIZLIK MALİYETİ: AdminCost = Events * HR_Time * HRRate", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_5": { description: "DEVAMSIZLIK MALİYETİ: BradfordFactor = S^2 * D", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_6": { description: "DEVAMSIZLIK MALİYETİ: TotalCost = Direct + OT + Temp + Prod + Admin", requiredInputs: [], outputHint: "number" },
  // ── DIGITAL TWIN MALİYET ──
  "user.digital_twin_cost_0": { description: "DIGITAL TWIN MALİYET: Cost_Trad = Prototyping + FieldTest + Downtime + Travel", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_1": { description: "DIGITAL TWIN MALİYET: Cost_DT = License + Compute + Sensor + Modeling", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_2": { description: "DIGITAL TWIN MALİYET: TimeGain = (PhysCycle - DigCycle) * Iterations", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_3": { description: "DIGITAL TWIN MALİYET: RevenueGain = TimeGain * DailyRev", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_4": { description: "DIGITAL TWIN MALİYET: QualitySavings = DefectReduction * WarrantyCost * Volume", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_5": { description: "DIGITAL TWIN MALİYET: ROI = (Cost_Trad - Cost_DT + RevenueGain + QualitySavings) / Cost_DT", requiredInputs: [], outputHint: "number" },
  // ── DİKİŞ HATTI DENGELEYİCİ ──
  "user.sewing_line_balance_analyzer_pro_0": { description: "DİKİŞ HATTI DENGELEYİCİ: TaktTime = AvailableTime / Demand", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_1": { description: "DİKİŞ HATTI DENGELEYİCİ: CycleTotal = SUM(SMV)", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_2": { description: "DİKİŞ HATTI DENGELEYİCİ: TheoOperators = CycleTotal / TaktTime", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_3": { description: "DİKİŞ HATTI DENGELEYİCİ: ActOperators = CEILING(TheoOperators)", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_4": { description: "DİKİŞ HATTI DENGELEYİCİ: LineEff = (CycleTotal / (ActOperators * TaktTime)) * 100", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_5": { description: "DİKİŞ HATTI DENGELEYİCİ: BalanceDelay = 100 - LineEff", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_6": { description: "DİKİŞ HATTI DENGELEYİCİ: Smoothness = SQRT(SUM((MaxCycle - Cycle_i)^2) / ActOperators)", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_7": { description: "DİKİŞ HATTI DENGELEYİCİ: WIP = (Bottleneck - Takt) * Demand", requiredInputs: [], outputHint: "number" },
  // ── DYE REÇETE MALİYET ──
  "user.dye_recipe_cost_0": { description: "DYE REÇETE MALİYET: Cost_Dye = SUM(Conc * Price) / BathRatio", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_1": { description: "DYE REÇETE MALİYET: Cost_Chem = SUM(Dosage * Price)", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_2": { description: "DYE REÇETE MALİYET: Cost_Water = LiquorRatio * Weight * WaterTariff", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_3": { description: "DYE REÇETE MALİYET: Cost_Energy = Heating + Holding + Drying", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_4": { description: "DYE REÇETE MALİYET: Cost_Waste = Effluent * TreatCost + Surcharge", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_5": { description: "DYE REÇETE MALİYET: TotalBatch = Dye + Chem + Water + Energy + Waste", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_6": { description: "DYE REÇETE MALİYET: RFT_Savings = Rework * (1 - RFT)", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_7": { description: "DYE REÇETE MALİYET: CostPerKg = (TotalBatch + RFT_Savings) / Weight", requiredInputs: [], outputHint: "number" },
  // ── ENERJİ TÜKETİM RAPORU ──
  "user.energy_consumption_report_0": { description: "ENERJİ TÜKETİM RAPORU: Active = SUM(kWh)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_1": { description: "ENERJİ TÜKETİM RAPORU: Reactive = SUM(kVArh)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_2": { description: "ENERJİ TÜKETİM RAPORU: PF = Active / SQRT(Active^2 + Reactive^2)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_3": { description: "ENERJİ TÜKETİM RAPORU: ReactivePenalty = IF(PF < Thresh, (Reactive - Active * TAN(ACOS(Thresh))) * Tariff, 0)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_4": { description: "ENERJİ TÜKETİM RAPORU: DemandCharge = Peak_kW * DemandRate", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_5": { description: "ENERJİ TÜKETİM RAPORU: TOU = SUM(kWh * TOU_Rate)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_6": { description: "ENERJİ TÜKETİM RAPORU: Total = Base + TOU + Demand + Penalty + Tax", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_7": { description: "ENERJİ TÜKETİM RAPORU: Carbon = Active * EmisFactor * CarbonPrice", requiredInputs: [], outputHint: "number" },
  // ── ENFLASYON ESKALASYON ──
  "user.inflation_escalation_0": { description: "ENFLASYON ESKALASYON: Esc_Mat = (1 + Infl_Mat)^Years", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_1": { description: "ENFLASYON ESKALASYON: Esc_Lab = (1 + Infl_Lab)^Years", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_2": { description: "ENFLASYON ESKALASYON: BaseAdj = BaseMat * Esc_Mat + BaseLab * Esc_Lab", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_3": { description: "ENFLASYON ESKALASYON: RealDisc = ((1 + Nominal) / (1 + Infl)) - 1", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_4": { description: "ENFLASYON ESKALASYON: NPV_Nom = SUM(Cash * Esc / (1 + Nom)^t)", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_5": { description: "ENFLASYON ESKALASYON: NPV_Real = SUM(Cash / (1 + Real)^t)", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_6": { description: "ENFLASYON ESKALASYON: Contingency = BaseAdj * ConfFactor", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_7": { description: "ENFLASYON ESKALASYON: Total = BaseAdj + Contingency", requiredInputs: [], outputHint: "number" },
  // ── ENVIRONMENTAL FIRE ──
  "user.environmental_waste_cost_0": { description: "ENVIRONMENTAL FIRE: Cost_Disp = Waste * DispFee", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_1": { description: "ENVIRONMENTAL FIRE: Cost_Haz = HazMass * (HazFee + Surcharge)", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_2": { description: "ENVIRONMENTAL FIRE: Cost_Recyc = RecycMass * (SortCost - ScrapRev)", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_3": { description: "ENVIRONMENTAL FIRE: Cost_Emis = Air * CarbonPrice + Water * TreatCost", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_4": { description: "ENVIRONMENTAL FIRE: PenaltyRisk = ProbViolation * Fine", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_5": { description: "ENVIRONMENTAL FIRE: Total = Disp + Haz + Recyc + Emis + Penalty", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_6": { description: "ENVIRONMENTAL FIRE: WasteIntensity = TotalWaste / Volume", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_7": { description: "ENVIRONMENTAL FIRE: Circularity = Recyc / TotalWaste", requiredInputs: [], outputHint: "number" },
  // ── EOQ ENVANTER ──
  "user.eoq_inventory_optimizer_0": { description: "EOQ ENVANTER: EOQ = SQRT((2 * Demand * OrderCost) / HoldingCost)", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_1": { description: "EOQ ENVANTER: ROP = (LeadTime * DailyDemand) + SafetyStock", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_2": { description: "EOQ ENVANTER: SafetyStock = Z * StdDev * SQRT(LeadTime)", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_3": { description: "EOQ ENVANTER: TotalCost = (Demand / EOQ) * OrderCost + (EOQ / 2 + Safety) * HoldingCost", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_4": { description: "EOQ ENVANTER: CycleStock = EOQ / 2", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_5": { description: "EOQ ENVANTER: Turnover = Demand / AvgInv", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_6": { description: "EOQ ENVANTER: DaysSales = 365 / Turnover", requiredInputs: [], outputHint: "number" },
  // ── EVM MALİYET FORECAST ──
  "user.evm_cost_forecast_0": { description: "EVM MALİYET FORECAST: SV = EV - PV", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_1": { description: "EVM MALİYET FORECAST: CV = EV - AC", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_2": { description: "EVM MALİYET FORECAST: SPI = EV / PV", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_3": { description: "EVM MALİYET FORECAST: CPI = EV / AC", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_4": { description: "EVM MALİYET FORECAST: EAC_CPI = BAC / CPI", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_5": { description: "EVM MALİYET FORECAST: EAC_CPI_SPI = AC + ((BAC - EV) / (CPI * SPI))", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_6": { description: "EVM MALİYET FORECAST: ETC = EAC - AC", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_7": { description: "EVM MALİYET FORECAST: VAC = BAC - EAC", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_8": { description: "EVM MALİYET FORECAST: TCPI = (BAC - EV) / (BAC - AC)", requiredInputs: [], outputHint: "number" },
  // ── FABRİKA YERLEŞİM MESAFE ──
  "user.factory_layout_distance_0": { description: "FABRİKA YERLEŞİM MESAFE: Dist_ij = ABS(X_i - X_j) + ABS(Y_i - Y_j)", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_1": { description: "FABRİKA YERLEŞİM MESAFE: FlowCost = SUM(Flow_ij * Dist_ij * CostPerDist)", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_2": { description: "FABRİKA YERLEŞİM MESAFE: AdjScore = SUM(Flow_ij * AdjFactor_ij)", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_3": { description: "FABRİKA YERLEŞİM MESAFE: SpaceUtil = EquipArea / FacArea", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_4": { description: "FABRİKA YERLEŞİM MESAFE: MatHandCost = FlowCost * HandRate", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_5": { description: "FABRİKA YERLEŞİM MESAFE: Congestion = 1 + (CrossTraffic / AisleCap)", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_6": { description: "FABRİKA YERLEŞİM MESAFE: TotalCost = MatHand + Space + Congestion", requiredInputs: [], outputHint: "number" },
  // ── FAİZ ORANI RİSKİ ──
  "user.interest_rate_risk_0": { description: "FAİZ ORANI RİSKİ: Exposure = FloatingDebt * (1 - HedgeRatio)", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_1": { description: "FAİZ ORANI RİSKİ: ShockImpact = Exposure * BpsChange / 10000", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_2": { description: "FAİZ ORANI RİSKİ: DurGap = AssetDur - LiabDur", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_3": { description: "FAİZ ORANI RİSKİ: EVE_Change = -DurGap * AssetVal * RateChange", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_4": { description: "FAİZ ORANI RİSKİ: NIM = (Inc - Exp) / EarningAssets", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_5": { description: "FAİZ ORANI RİSKİ: VaR = PortVal * Volatility * Z", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_6": { description: "FAİZ ORANI RİSKİ: HedgeCost = Notional * SwapSpread", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_7": { description: "FAİZ ORANI RİSKİ: BreakEven = Fixed - Floating_Curr", requiredInputs: [], outputHint: "number" },
  // ── FILAMENT RECYCLING ──
  "user.filament_recycling_0": { description: "FILAMENT RECYCLING: Cost_Virgin = Price_V * (1 + Scrap_V) + Transp_V", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_1": { description: "FILAMENT RECYCLING: Cost_Recyc = (Collect + Sort + Pellet) / Yield", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_2": { description: "FILAMENT RECYCLING: QualPenalty = (Tensile_V - Tensile_R) * AppFactor", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_3": { description: "FILAMENT RECYCLING: EnergySav = (Energy_V - Energy_R) * EnergyCost", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_4": { description: "FILAMENT RECYCLING: CarbonCred = (CO2_V - CO2_R) * CarbonPrice", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_5": { description: "FILAMENT RECYCLING: Total_R = Cost_Recyc + QualPenalty - EnergySav - CarbonCred", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_6": { description: "FILAMENT RECYCLING: ROI = (Cost_V - Total_R) * Vol / Capex", requiredInputs: [], outputHint: "number" },
  // ── FİYAT ESNEKLİĞİ ──
  "user.price_elasticity_0": { description: "FİYAT ESNEKLİĞİ: Elasticity = PctChange_Dem / PctChange_Price", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_1": { description: "FİYAT ESNEKLİĞİ: NewDem = CurrDem * (1 + Elast * PctChange_Price)", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_2": { description: "FİYAT ESNEKLİĞİ: NewRev = NewPrice * NewDem", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_3": { description: "FİYAT ESNEKLİĞİ: NewMargin = (NewPrice - VarCost) * NewDem - Fixed", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_4": { description: "FİYAT ESNEKLİĞİ: MaxPrice = (Elast / (Elast + 1)) * VarCost", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_5": { description: "FİYAT ESNEKLİĞİ: Markup = -1 / (Elast + 1)", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_6": { description: "FİYAT ESNEKLİĞİ: CannibLoss = NewDem * CannibRate * Margin_Other", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_7": { description: "FİYAT ESNEKLİĞİ: NetImpact = NewMargin - CurrMargin - Cannib", requiredInputs: [], outputHint: "number" },
  // ── FLEXIBLE MANUFACTURING ROI ──
  "user.flexible_manufacturing_roi_0": { description: "FLEXIBLE MANUFACTURING ROI: Cost_Ded = Mach_Ded + Setup_Ded * Changeovers + Inv_High", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_1": { description: "FLEXIBLE MANUFACTURING ROI: Cost_Flex = Mach_FMS + Tool_FMS + Prog + Maint", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_2": { description: "FLEXIBLE MANUFACTURING ROI: FlexVal = (TTM_Red * RevGain) + (CustPrem * Vol)", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_3": { description: "FLEXIBLE MANUFACTURING ROI: InvSav = (WIP_Ded - WIP_Flex) * CarryCost", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_4": { description: "FLEXIBLE MANUFACTURING ROI: ScrapRed = (Scrap_Ded - Scrap_Flex) * Vol * UnitCost", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_5": { description: "FLEXIBLE MANUFACTURING ROI: ROI = (Cost_Ded - Cost_Flex + FlexVal + InvSav + ScrapRed) / Capex", requiredInputs: [], outputHint: "number" },
  // ── GAGE R&R MALİYET ──
  "user.gage_rnr_cost_0": { description: "GAGE R&R MALİYET: EV = Range_Avg * d2_star", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_1": { description: "GAGE R&R MALİYET: AV = SQRT((Range_Ops / d2_star)^2 - (EV^2 / (n * r)))", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_2": { description: "GAGE R&R MALİYET: GRR = SQRT(EV^2 + AV^2)", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_3": { description: "GAGE R&R MALİYET: PV = Range_Parts / d2_star", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_4": { description: "GAGE R&R MALİYET: TV = SQRT(GRR^2 + PV^2)", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_5": { description: "GAGE R&R MALİYET: PctGRR = (GRR / TV) * 100", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_6": { description: "GAGE R&R MALİYET: CostError = (FalseAcc * EscapeCost) + (FalseRej * ScrapCost)", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_7": { description: "GAGE R&R MALİYET: OptTol = GRR * 6", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_8": { description: "GAGE R&R MALİYET: FinImpact = PctGRR * TotalQualCost", requiredInputs: [], outputHint: "number" },
  // ── GIDA FİRE MARJ ──
  "user.food_waste_margin_0": { description: "GIDA FİRE MARJ: Yield = Finished / Raw", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_1": { description: "GIDA FİRE MARJ: Shrinkage = Raw - Finished", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_2": { description: "GIDA FİRE MARJ: Cost_Shrink = Shrinkage * RawCost", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_3": { description: "GIDA FİRE MARJ: Cost_Spoil = Spoiled * ProdCost", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_4": { description: "GIDA FİRE MARJ: Cost_Over = Excess * (UnitCost - Salvage)", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_5": { description: "GIDA FİRE MARJ: MarginLeak = Shrink + Spoil + Over", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_6": { description: "GIDA FİRE MARJ: OEE_Food = Avail * Perf * Qual_Yield", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_7": { description: "GIDA FİRE MARJ: TheoUsage = Recipe * ActualProd", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_8": { description: "GIDA FİRE MARJ: Variance = Actual - Theo", requiredInputs: [], outputHint: "number" },
  // ── GÜBRE DOZAJ ──
  "user.fertilizer_dosage_0": { description: "GÜBRE DOZAJ: NutReq = YieldTarget * RemRate", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_1": { description: "GÜBRE DOZAJ: SoilSupp = SoilTest * ConvFactor", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_2": { description: "GÜBRE DOZAJ: FertNeed = (NutReq - SoilSupp) / Eff", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_3": { description: "GÜBRE DOZAJ: AppRate = FertNeed / ContentPct", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_4": { description: "GÜBRE DOZAJ: Cost = AppRate * Area * Price", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_5": { description: "GÜBRE DOZAJ: EnvRisk = (AppRate - Uptake) * Leach", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_6": { description: "GÜBRE DOZAJ: ROI = (YieldInc * CropPrice - Cost) / Cost", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_7": { description: "GÜBRE DOZAJ: Precision = BaseRate * (1 + ZoneFactor)", requiredInputs: [], outputHint: "number" },
  // ── HACCP DEVIATION ──
  "user.haccp_deviation_cost_0": { description: "HACCP DEVIATION: Cost_Hold = QuarVol * HoldCost * Days", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_1": { description: "HACCP DEVIATION: Cost_Test = Samples * LabCost", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_2": { description: "HACCP DEVIATION: Cost_Rework = DevVol * ReworkCost", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_3": { description: "HACCP DEVIATION: Cost_Disp = CondVol * DispCost + LostMat", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_4": { description: "HACCP DEVIATION: Cost_Recall = Notif + Log_Rev + RetailPen + Brand", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_5": { description: "HACCP DEVIATION: Fine = ProbDet * FineAmt", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_6": { description: "HACCP DEVIATION: Total = Hold + Test + Rework + Disp + Recall + Fine", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_7": { description: "HACCP DEVIATION: RPN = Sev * Occ * Det", requiredInputs: [], outputHint: "number" },
  // ── HACİMSEL AĞIRLIK ──
  "user.volumetric_weight_chargeable_0": { description: "HACİMSEL AĞIRLIK: VolWeight_Air = (L * W * H) / 6000", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_1": { description: "HACİMSEL AĞIRLIK: VolWeight_Road = (L * W * H) / 5000", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_2": { description: "HACİMSEL AĞIRLIK: VolWeight_Sea = (L * W * H) / 1000", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_3": { description: "HACİMSEL AĞIRLIK: Chargeable = MAX(Gross, VolWeight)", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_4": { description: "HACİMSEL AĞIRLIK: Freight = Chargeable * Rate", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_5": { description: "HACİMSEL AĞIRLIK: Density = Gross / Vol", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_6": { description: "HACİMSEL AĞIRLIK: StackLoss = 1 - (ActualLoad / MaxCont)", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_7": { description: "HACİMSEL AĞIRLIK: Ineff = (Chargeable - Gross) * Rate", requiredInputs: [], outputHint: "number" },
  // ── HAFİFLİK MALİYET TASARRUFU ──
  "user.lightweight_cost_savings_0": { description: "HAFİFLİK MALİYET TASARRUFU: WeightRed = Mass_Orig - Mass_LW", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_1": { description: "HAFİFLİK MALİYET TASARRUFU: FuelSav_Auto = WeightRed * FuelFactor * Dist * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_2": { description: "HAFİFLİK MALİYET TASARRUFU: FuelSav_Aero = WeightRed * BurnFactor * Hours * JetPrice", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_3": { description: "HAFİFLİK MALİYET TASARRUFU: PayloadGain = WeightRed * RevPerKg", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_4": { description: "HAFİFLİK MALİYET TASARRUFU: MatPrem = (Cost_LW - Cost_Orig) * Vol", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_5": { description: "HAFİFLİK MALİYET TASARRUFU: ToolDelta = Tool_LW - Tool_Orig", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_6": { description: "HAFİFLİK MALİYET TASARRUFU: NetSav = (FuelSav + Payload) * Life - MatPrem - ToolDelta", requiredInputs: [], outputHint: "number" },
  // ── HURDA ORANI OPTİMİZE ──
  "user.scrap_rate_optimize_0": { description: "HURDA ORANI OPTİMİZE: ScrapRate = ScrapQty / TotalInput", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_1": { description: "HURDA ORANI OPTİMİZE: Cost_Mat = ScrapQty * MatCost", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_2": { description: "HURDA ORANI OPTİMİZE: Cost_Lab = ScrapQty * Cycle * LabRate", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_3": { description: "HURDA ORANI OPTİMİZE: Cost_OH = ScrapQty * Cycle * MachRate", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_4": { description: "HURDA ORANI OPTİMİZE: OppCost = ScrapQty * UnitMargin", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_5": { description: "HURDA ORANI OPTİMİZE: TotalCost = Mat + Lab + OH + Opp - Salvage", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_6": { description: "HURDA ORANI OPTİMİZE: Pareto = SORT(Defects, Freq, DESC)", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_7": { description: "HURDA ORANI OPTİMİZE: Target = Benchmark * (1 - ImpFactor)", requiredInputs: [], outputHint: "number" },
  // ── HVAC KAPASİTE ──
  "user.hvac_capacity_0": { description: "HVAC KAPASİTE: Sensible = 1.08 * CFM * DeltaT", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_1": { description: "HVAC KAPASİTE: Latent = 0.68 * CFM * DeltaW", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_2": { description: "HVAC KAPASİTE: Total = Sensible + Latent", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_3": { description: "HVAC KAPASİTE: Envelope = U * Area * DeltaT", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_4": { description: "HVAC KAPASİTE: Internal = Occ * SensPer + Light + Equip", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_5": { description: "HVAC KAPASİTE: Vent = CFM_Out * 1.08 * (T_Out - T_In)", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_6": { description: "HVAC KAPASİTE: Tons = Total / 12000", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_7": { description: "HVAC KAPASİTE: EER = BTU / W", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_8": { description: "HVAC KAPASİTE: AnnualCost = (Total / EER) * Hours * ElecRate", requiredInputs: [], outputHint: "number" },
  // ── HYDRAULIC SİSTEM KAYIP ──
  "user.hydraulic_system_loss_0": { description: "HYDRAULIC SİSTEM KAYIP: Loss_Leak = Q_Leak * P", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_1": { description: "HYDRAULIC SİSTEM KAYIP: Loss_Fric = DeltaP_Pipe * Q_Flow", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_2": { description: "HYDRAULIC SİSTEM KAYIP: Loss_Valve = DeltaP_Valve * Q_Flow", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_3": { description: "HYDRAULIC SİSTEM KAYIP: Heat = Loss_Leak + Loss_Fric + Loss_Valve", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_4": { description: "HYDRAULIC SİSTEM KAYIP: Eff = (P_Out / P_In) * 100", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_5": { description: "HYDRAULIC SİSTEM KAYIP: Cost_Loss = Heat * Hours * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_6": { description: "HYDRAULIC SİSTEM KAYIP: Degrade = (T_Avg - Thresh) * FluidCost", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_7": { description: "HYDRAULIC SİSTEM KAYIP: Cool = Heat * COP * ElecRate", requiredInputs: [], outputHint: "number" },
  // ── ISI EXCHANGER FOULING ──
  "user.heat_exchanger_fouling_0": { description: "ISI EXCHANGER FOULING: R_foul = (1 / U_dirty) - (1 / U_clean)", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_1": { description: "ISI EXCHANGER FOULING: Loss = Area * U_clean * LMTD - Area * U_dirty * LMTD", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_2": { description: "ISI EXCHANGER FOULING: EnergyPen = Loss * Hours / BoilEff", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_3": { description: "ISI EXCHANGER FOULING: Cost_Energy = EnergyPen * FuelCost", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_4": { description: "ISI EXCHANGER FOULING: DP_Inc = DeltaP_dirty - DeltaP_clean", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_5": { description: "ISI EXCHANGER FOULING: PumpInc = DP_Inc * Flow * Hours / PumpEff", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_6": { description: "ISI EXCHANGER FOULING: Total = Cost_Energy + PumpInc", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_7": { description: "ISI EXCHANGER FOULING: ROI = Total / CleanCost", requiredInputs: [], outputHint: "number" },
  // ── ISO 50001 BASELINE ──
  "user.iso_50001_baseline_0": { description: "ISO 50001 BASELINE: EnPI = Energy / Volume", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_1": { description: "ISO 50001 BASELINE: Baseline = Intercept + (Slope1 * Prod) + (Slope2 * DD)", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_2": { description: "ISO 50001 BASELINE: Cusum_t = Actual - Predicted", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_3": { description: "ISO 50001 BASELINE: Cusum_Cum = SUM(Cusum_t)", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_4": { description: "ISO 50001 BASELINE: Savings = Predicted - Actual", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_5": { description: "ISO 50001 BASELINE: Norm = DD_Curr / DD_Hist", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_6": { description: "ISO 50001 BASELINE: Sig = R2 > 0.75 AND P < 0.05", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_7": { description: "ISO 50001 BASELINE: Target = Baseline * (1 - RedTarget)", requiredInputs: [], outputHint: "number" },
  // ── İÇ VERİM ORANI IRR ──
  "user.irr_investment_0": { description: "İÇ VERİM ORANI IRR: NPV = SUM(Cash_t / (1 + r)^t)", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_1": { description: "İÇ VERİM ORANI IRR: IRR = r where NPV = 0", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_2": { description: "İÇ VERİM ORANI IRR: MIRR = (FV_Pos / PV_Neg)^(1/n) - 1", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_3": { description: "İÇ VERİM ORANI IRR: Payback = Year_Before + (Unrecovered / Cash_Rec)", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_4": { description: "İÇ VERİM ORANI IRR: PI = PV_Future / InitInv", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_5": { description: "İÇ VERİM ORANI IRR: Annuity = NPV * (r * (1 + r)^n) / ((1 + r)^n - 1)", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_6": { description: "İÇ VERİM ORANI IRR: Sens = Delta_IRR / Delta_Var", requiredInputs: [], outputHint: "number" },
  // ── İLERLEME YEM MALİYET ──
  "user.feed_cost_formulation_0": { description: "İLERLEME YEM MALİYET: Cost_Ing = InclRate * Price", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_1": { description: "İLERLEME YEM MALİYET: Cost_Base = SUM(Cost_Ing)", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_2": { description: "İLERLEME YEM MALİYET: Cost_Proc = Grind + Mix + Pellet", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_3": { description: "İLERLEME YEM MALİYET: Cost_Add = SUM(Enz + Vit + Tox)", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_4": { description: "İLERLEME YEM MALİYET: Shrink = Cost_Base * ShrinkRate", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_5": { description: "İLERLEME YEM MALİYET: FCR = FeedCons / WeightGain", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_6": { description: "İLERLEME YEM MALİYET: CostPerKg = (Base + Proc + Add + Shrink) * FCR", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_7": { description: "İLERLEME YEM MALİYET: Opt = MIN(Base) SUBJECT TO Constraints", requiredInputs: [], outputHint: "number" },
  // ── İSKELE KİRALAMA ──
  "user.scaffold_rental_cost_0": { description: "İSKELE KİRALAMA: Area = Perim * Height", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_1": { description: "İSKELE KİRALAMA: Vol = Area * Standoff", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_2": { description: "İSKELE KİRALAMA: Rental = Area * Rate * Dur", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_3": { description: "İSKELE KİRALAMA: Lab_Erect = Area * ErectRate", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_4": { description: "İSKELE KİRALAMA: Lab_Dism = Area * DismRate", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_5": { description: "İSKELE KİRALAMA: Transp = Trips * TruckRate", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_6": { description: "İSKELE KİRALAMA: Total = Rental + Lab_Erect + Lab_Dism + Transp", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_7": { description: "İSKELE KİRALAMA: OptDur = CritPath + Buffer - Overlap", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_8": { description: "İSKELE KİRALAMA: Overrun = MAX(0, Actual - OptDur) * DailyRate", requiredInputs: [], outputHint: "number" },
  // ── İSTATİSTİKSEL PROSES KONTROL ──
  "user.spc_limit_control_0": { description: "İSTATİSTİKSEL PROSES KONTROL: X_Bar_Bar = AVERAGE(Means)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_1": { description: "İSTATİSTİKSEL PROSES KONTROL: R_Bar = AVERAGE(Ranges)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_2": { description: "İSTATİSTİKSEL PROSES KONTROL: S_Bar = AVERAGE(StdDevs)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_3": { description: "İSTATİSTİKSEL PROSES KONTROL: UCL_X = X_Bar_Bar + (A2 * R_Bar)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_4": { description: "İSTATİSTİKSEL PROSES KONTROL: LCL_X = X_Bar_Bar - (A2 * R_Bar)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_5": { description: "İSTATİSTİKSEL PROSES KONTROL: UCL_R = D4 * R_Bar", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_6": { description: "İSTATİSTİKSEL PROSES KONTROL: LCL_R = D3 * R_Bar", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_7": { description: "İSTATİSTİKSEL PROSES KONTROL: Sigma = R_Bar / d2", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_8": { description: "İSTATİSTİKSEL PROSES KONTROL: Cp = (USL - LSL) / (6 * Sigma)", requiredInputs: [], outputHint: "number" },
  // ── İŞLEME STRATEJİSİ SÜRE ──
  "user.machining_strategy_0": { description: "İŞLEME STRATEJİSİ SÜRE: MRR = V_c * f * a_p", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_1": { description: "İŞLEME STRATEJİSİ SÜRE: Power = MRR * SpecEnergy", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_2": { description: "İŞLEME STRATEJİSİ SÜRE: ToolLife = C / (V_c^n * f^m)", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_3": { description: "İŞLEME STRATEJİSİ SÜRE: Cost = MIN(Mach + Change + Tool)", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_4": { description: "İŞLEME STRATEJİSİ SÜRE: Opt_Vc = (C / (T_opt)^n)^(1/n)", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_5": { description: "İŞLEME STRATEJİSİ SÜRE: T_opt = ((1/n - 1) * (ChangeTime + ToolCost/MachRate))", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_6": { description: "İŞLEME STRATEJİSİ SÜRE: Ra = f^2 / (8 * NoseRad)", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_7": { description: "İŞLEME STRATEJİSİ SÜRE: Check = Power < MaxPower AND Ra < Tol", requiredInputs: [], outputHint: "number" },
  // ── KAIZEN TASARRUF TAKİPÇİSİ ──
  "user.kaizen_savings_tracker_0": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Hard = (Baseline - Actual) * Vol", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_1": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Soft = TimeSaved * LabRate * Conv", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_2": { description: "KAIZEN TASARRUF TAKİPÇİSİ: ImpCost = Lab_K + Mat + Down", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_3": { description: "KAIZEN TASARRUF TAKİPÇİSİ: ROI = (Hard + Soft - ImpCost) / ImpCost", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_4": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Payback = ImpCost / MonthSav", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_5": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Sust = Sav_M6 / Sav_M1", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_6": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Cum = SUM(MonthSav)", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_7": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Opp = Time_K * ProdRate * Margin", requiredInputs: [], outputHint: "number" },
  // ── Kalite Maliyeti PAF ──
  "user.quality_cost_paf_0": { description: "Kalite Maliyeti PAF: PreventionCost = Training + QualityPlanning + SupplierEvaluation + DesignReview", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_1": { description: "Kalite Maliyeti PAF: AppraisalCost = Inspection + Testing + Calibration + Audit", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_2": { description: "Kalite Maliyeti PAF: InternalFailure = Scrap + Rework + Reinspection + Downtime", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_3": { description: "Kalite Maliyeti PAF: ExternalFailure = Warranty + Returns + Recall + Liability + LostSales", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_4": { description: "Kalite Maliyeti PAF: TotalCOQ = PreventionCost + AppraisalCost + InternalFailure + ExternalFailure", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_5": { description: "Kalite Maliyeti PAF: COQ_Ratio = TotalCOQ / TotalRevenue", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_6": { description: "Kalite Maliyeti PAF: PAF_Ratio = PreventionCost / TotalCOQ", requiredInputs: [], outputHint: "number" },
  // ── Karbon Ayak izi Check ──
  "user.carbon_footprint_check_0": { description: "Karbon Ayak izi Check: Scope1 = SUM(FuelConsumption_i * EmissionFactor_i) + FugitiveEmissions", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_1": { description: "Karbon Ayak izi Check: Scope2_Location = ElectricityConsumption * GridEmissionFactor", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_2": { description: "Karbon Ayak izi Check: Scope2_Market = ElectricityConsumption * (GridFactor - REC_Factor)", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_3": { description: "Karbon Ayak izi Check: Scope3_Upstream = SUM(Material_i * MaterialEF_i) + Logistics_Emissions", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_4": { description: "Karbon Ayak izi Check: TotalCarbon = Scope1 + Scope2_Market + Scope3_Upstream", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_5": { description: "Karbon Ayak izi Check: CarbonIntensity = TotalCarbon / ProductionVolume", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_6": { description: "Karbon Ayak izi Check: FinancialRisk = TotalCarbon * ForecastedCarbonPrice", requiredInputs: [], outputHint: "number" },
  // ── Kaynak Hacmi ve Maliyeti ──
  "user.weld_volume_cost_0": { description: "Kaynak Hacmi ve Maliyeti: Area_Weld = (Leg^2) / 2", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_1": { description: "Kaynak Hacmi ve Maliyeti: Volume_Weld = Area_Weld * Length", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_2": { description: "Kaynak Hacmi ve Maliyeti: Weight_Deposited = Volume_Weld * Density", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_3": { description: "Kaynak Hacmi ve Maliyeti: Weight_Electrode = Weight_Deposited / DepositionEfficiency", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_4": { description: "Kaynak Hacmi ve Maliyeti: Cost_Filler = Weight_Electrode * PricePerKg", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_5": { description: "Kaynak Hacmi ve Maliyeti: Cost_Gas = GasFlowRate * ArcTime * GasPrice", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_6": { description: "Kaynak Hacmi ve Maliyeti: Cost_Power = (Voltage * Current * ArcTime) / (1000 * MachineEff) * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_7": { description: "Kaynak Hacmi ve Maliyeti: TotalWeldCost = Cost_Filler + Cost_Gas + Cost_Power + (ArcTime / DepositionRate) * LaborRate", requiredInputs: [], outputHint: "number" },
  // ── Kaynak Maliyeti ──
  "user.weld_cost_analysis_0": { description: "Kaynak Maliyeti: OperatingFactor = ArcTime / TotalShiftTime", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_1": { description: "Kaynak Maliyeti: DepositionRate = Weight_Deposited / ArcTime", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_2": { description: "Kaynak Maliyeti: TotalJointCost = (Length / TravelSpeed) * (LaborRate + OverheadRate) / OperatingFactor + FillerCost + GasCost + PowerCost", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_3": { description: "Kaynak Maliyeti: CostPerMeter = TotalJointCost / Length", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_4": { description: "Kaynak Maliyeti: ConsumableCostPct = FillerCost / TotalJointCost", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_5": { description: "Kaynak Maliyeti: LaborCostPct = LaborCost / TotalJointCost", requiredInputs: [], outputHint: "number" },
  // ── Kaynak Mukavemeti ──
  "user.weld_strength_0": { description: "Kaynak Mukavemeti: ThroatThickness = Leg * COS(45)", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_1": { description: "Kaynak Mukavemeti: Area_Shear = ThroatThickness * Length", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_2": { description: "Kaynak Mukavemeti: AllowableShearStress = 0.3 * TensileStrength_Electrode", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_3": { description: "Kaynak Mukavemeti: MaxLoad_Shear = Area_Shear * AllowableShearStress", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_4": { description: "Kaynak Mukavemeti: SafetyFactor = MaxLoad_Shear / AppliedLoad", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_5": { description: "Kaynak Mukavemeti: BendingStress = (AppliedMoment * ThroatThickness) / MomentOfInertia", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_6": { description: "Kaynak Mukavemeti: CombinedStress = SQRT(ShearStress^2 + BendingStress^2)", requiredInputs: [], outputHint: "number" },
  // ── Kesim Parameters Takım ömrü ──
  "user.cutting_tool_life_0": { description: "Kesim Parameters Takım ömrü: ToolLife_T = C / (V_c^n * f^m * a_p^k)", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_1": { description: "Kesim Parameters Takım ömrü: TaylorExponent_n = -LOG(T1/T2) / LOG(V1/V2)", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_2": { description: "Kesim Parameters Takım ömrü: CostPerPart_Tool = (ToolCost / Edges) * (MachiningTime / ToolLife)", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_3": { description: "Kesim Parameters Takım ömrü: OptimalToolLife_Cost = ((1/n - 1) * (ToolChangeTime + ToolCost/Edges / MachineRate))", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_4": { description: "Kesim Parameters Takım ömrü: Optimal_Vc = C / (OptimalToolLife_Cost^n)", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_5": { description: "Kesim Parameters Takım ömrü: ProductionRate = 1 / (MachiningTime + (MachiningTime / ToolLife) * ToolChangeTime)", requiredInputs: [], outputHint: "number" },
  // ── Kesme-Dolgu Denge ──
  "user.cut_fill_balance_0": { description: "Kesme-Dolgu Denge: Volume_Cut = SUM(Area_Cut_i * Distance_i)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_1": { description: "Kesme-Dolgu Denge: Volume_Fill = SUM(Area_Fill_i * Distance_i)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_2": { description: "Kesme-Dolgu Denge: ShrinkageFactor = 1 - (CompactedVolume / LooseVolume)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_3": { description: "Kesme-Dolgu Denge: SwellFactor = LooseVolume / BankVolume", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_4": { description: "Kesme-Dolgu Denge: NetBalance = Volume_Cut - (Volume_Fill * ShrinkageFactor)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_5": { description: "Kesme-Dolgu Denge: BorrowRequired = MAX(0, (Volume_Fill * ShrinkageFactor) - Volume_Cut)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_6": { description: "Kesme-Dolgu Denge: WasteRequired = MAX(0, Volume_Cut - (Volume_Fill * ShrinkageFactor))", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_7": { description: "Kesme-Dolgu Denge: HaulCost = SUM(Volume_i * Distance_i * UnitHaulCost)", requiredInputs: [], outputHint: "number" },
  // ── Kiriş Ağırlığı ──
  "user.beam_weight_0": { description: "Kiriş Ağırlığı: Area_Cross = LookupArea(ProfileType, Size)", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_1": { description: "Kiriş Ağırlığı: Weight_PerMeter = Area_Cross * Density_Steel", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_2": { description: "Kiriş Ağırlığı: TotalWeight = Weight_PerMeter * Length * Quantity", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_3": { description: "Kiriş Ağırlığı: Cost_Material = TotalWeight * PricePerTon", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_4": { description: "Kiriş Ağırlığı: PaintArea = Perimeter * Length", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_5": { description: "Kiriş Ağırlığı: FireproofingArea = PaintArea", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_6": { description: "Kiriş Ağırlığı: Deflection_Max = (5 * w * L^4) / (384 * E * I)", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_7": { description: "Kiriş Ağırlığı: Moment_Max = (w * L^2) / 8", requiredInputs: [], outputHint: "number" },
  // ── Kompresör Kaçağı Maliyet ──
  "user.compressed_air_leak_0": { description: "Kompresör Kaçağı Maliyet: LeakFlow_CFM = (22.4 * d^2 * P_Line) / SQRT(T_Abs)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_1": { description: "Kompresör Kaçağı Maliyet: Power_Loss_kW = (LeakFlow_CFM * P_Line * 144) / (33000 * Eff_Compressor)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_2": { description: "Kompresör Kaçağı Maliyet: AnnualEnergyLoss = Power_Loss_kW * OperatingHours", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_3": { description: "Kompresör Kaçağı Maliyet: Cost_Leak = AnnualEnergyLoss * ElectricityRate", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_4": { description: "Kompresör Kaçağı Maliyet: TotalLeakCost = SUM(Cost_Leak_i)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_5": { description: "Kompresör Kaçağı Maliyet: CarbonEmissions = AnnualEnergyLoss * GridEmissionFactor", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_6": { description: "Kompresör Kaçağı Maliyet: Payback_Repair = RepairCost / Cost_Leak", requiredInputs: [], outputHint: "number" },
  // ── Kompresör Tankı Boyutlandırma ──
  "user.compressor_tank_sizing_0": { description: "Kompresör Tankı Boyutlandırma: V_Tank = (t * Q * P_atm) / (P_Max - P_Min)", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_1": { description: "Kompresör Tankı Boyutlandırma: t = TimeToFill", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_2": { description: "Kompresör Tankı Boyutlandırma: Q = FreeAirDelivery", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_3": { description: "Kompresör Tankı Boyutlandırma: P_Max = CutOutPressure", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_4": { description: "Kompresör Tankı Boyutlandırma: P_Min = CutInPressure", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_5": { description: "Kompresör Tankı Boyutlandırma: CycleTime = V_Tank * (P_Max - P_Min) / (Q * P_atm)", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_6": { description: "Kompresör Tankı Boyutlandırma: CyclesPerHour = 60 / CycleTime", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_7": { description: "Kompresör Tankı Boyutlandırma: MotorStartLimit = IF(CyclesPerHour > MaxStarts, 'FAIL', 'PASS')", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_8": { description: "Kompresör Tankı Boyutlandırma: Cost_Tank = Volume * PricePerLiter", requiredInputs: [], outputHint: "number" },
  // ── Konteyner Yükü ──
  "user.container_load_0": { description: "Konteyner Yükü: Volume_Utilization = SUM(ItemVolume_i) / ContainerMaxVolume", requiredInputs: [], outputHint: "number" },
  "user.container_load_1": { description: "Konteyner Yükü: Weight_Utilization = SUM(ItemWeight_i) / ContainerMaxPayload", requiredInputs: [], outputHint: "number" },
  "user.container_load_2": { description: "Konteyner Yükü: ChargeableWeight = MAX(GrossWeight, VolumetricWeight)", requiredInputs: [], outputHint: "number" },
  "user.container_load_3": { description: "Konteyner Yükü: LoadEfficiency = MIN(Volume_Utilization, Weight_Utilization)", requiredInputs: [], outputHint: "number" },
  "user.container_load_4": { description: "Konteyner Yükü: WastedSpaceCost = (1 - LoadEfficiency) * FreightCost", requiredInputs: [], outputHint: "number" },
  "user.container_load_5": { description: "Konteyner Yükü: PalletStacking = Floor(ContainerHeight / PalletHeight)", requiredInputs: [], outputHint: "number" },
  "user.container_load_6": { description: "Konteyner Yükü: MaxPallets = MIN(PalletStacking * FloorArea_Pallets, WeightLimit / PalletWeight)", requiredInputs: [], outputHint: "number" },
  // ── Kumaş Kesim Optimize Edici ──
  "user.fabric_cutting_optimizer_0": { description: "Kumaş Kesim Optimize Edici: MarkerEfficiency = (TotalPatternArea / (MarkerLength * FabricWidth)) * 100", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_1": { description: "Kumaş Kesim Optimize Edici: FabricRequired = (TotalPatternArea / MarkerEfficiency) * (1 + EndLossPct)", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_2": { description: "Kumaş Kesim Optimize Edici: Cost_Fabric = FabricRequired * PricePerMeter", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_3": { description: "Kumaş Kesim Optimize Edici: Utilization_Gain = (NewEfficiency - OldEfficiency) * FabricRequired * PricePerMeter", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_4": { description: "Kumaş Kesim Optimize Edici: SplicingLoss = Splices * OverlapLength * FabricWidth", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_5": { description: "Kumaş Kesim Optimize Edici: TotalYardage = MarkerLength + EndLoss + SplicingLoss", requiredInputs: [], outputHint: "number" },
  // ── Kur Riski ──
  "user.currency_risk_0": { description: "Kur Riski: Exposure_FC = TotalRevenue_FC - TotalCost_FC", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_1": { description: "Kur Riski: VaR_Historical = Exposure_FC * StdDev_ExchangeRate * Z_Score", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_2": { description: "Kur Riski: VaR_Parametric = Exposure_FC * Volatility * SQRT(TimeHorizon)", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_3": { description: "Kur Riski: HedgedExposure = Exposure_FC * HedgeRatio", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_4": { description: "Kur Riski: UnhedgedVaR = VaR_Historical * (1 - HedgeRatio)", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_5": { description: "Kur Riski: CostOfHedge = Notional * ForwardPoints", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_6": { description: "Kur Riski: NetImpact = (SpotRate - ForwardRate) * HedgedExposure", requiredInputs: [], outputHint: "number" },
  // ── KWh Maliyet ──
  "user.kwh_cost_0": { description: "KWh Maliyet: EnergyCharge = ActiveEnergy * EnergyRate", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_1": { description: "KWh Maliyet: DemandCharge = PeakDemand * DemandRate", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_2": { description: "KWh Maliyet: ReactivePenalty = IF(PowerFactor < Threshold, ReactiveEnergy * PenaltyRate, 0)", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_3": { description: "KWh Maliyet: TaxesAndFees = (EnergyCharge + DemandCharge) * TaxRate", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_4": { description: "KWh Maliyet: TotalBill = EnergyCharge + DemandCharge + ReactivePenalty + TaxesAndFees", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_5": { description: "KWh Maliyet: UnitCost_kWh = TotalBill / ActiveEnergy", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_6": { description: "KWh Maliyet: PeakShavingSavings = (OldPeak - NewPeak) * DemandRate", requiredInputs: [], outputHint: "number" },
  // ── Lojistik Rota Kaybı ──
  "user.logistics_route_loss_0": { description: "Lojistik Rota Kaybı: IdealDistance = PointToPoint_Distance", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_1": { description: "Lojistik Rota Kaybı: ActualDistance = RouteDistance", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_2": { description: "Lojistik Rota Kaybı: DriftPct = (ActualDistance - IdealDistance) / IdealDistance", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_3": { description: "Lojistik Rota Kaybı: FuelWaste = (ActualDistance - IdealDistance) * FuelConsumptionRate * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_4": { description: "Lojistik Rota Kaybı: TimeWaste = (ActualDistance - IdealDistance) / AvgSpeed * DriverHourlyRate", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_5": { description: "Lojistik Rota Kaybı: TotalRouteLoss = FuelWaste + TimeWaste + VehicleWearCost", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_6": { description: "Lojistik Rota Kaybı: Efficiency = IdealDistance / ActualDistance", requiredInputs: [], outputHint: "number" },
  // ── Mağaza Saatlik Ücret ──
  "user.shop_hourly_rate_0": { description: "Mağaza Saatlik Ücret: DirectLabor = SUM(TechnicianWages)", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_1": { description: "Mağaza Saatlik Ücret: IndirectLabor = SUM(ManagerWages + AdminWages)", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_2": { description: "Mağaza Saatlik Ücret: Overhead = Rent + Utilities + Insurance + Tools + Depreciation", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_3": { description: "Mağaza Saatlik Ücret: TotalShopCost = DirectLabor + IndirectLabor + Overhead", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_4": { description: "Mağaza Saatlik Ücret: BillableHours = TotalAvailableHours * UtilizationRate", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_5": { description: "Mağaza Saatlik Ücret: ShopHourlyRate = TotalShopCost / BillableHours", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_6": { description: "Mağaza Saatlik Ücret: EffectiveMargin = (ActualBillingRate - ShopHourlyRate) / ActualBillingRate", requiredInputs: [], outputHint: "number" },
  // ── Mahsul Verim Kaybı Analizörü ──
  "user.crop_yield_loss_0": { description: "Mahsul Verim Kaybı Analizörü: PotentialYield = GeneticPotential * EnvironmentFactor", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_1": { description: "Mahsul Verim Kaybı Analizörü: ActualYield = HarvestedWeight / Area", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_2": { description: "Mahsul Verim Kaybı Analizörü: YieldGap = PotentialYield - ActualYield", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_3": { description: "Mahsul Verim Kaybı Analizörü: Loss_Pest = PestDamagePct * PotentialYield", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_4": { description: "Mahsul Verim Kaybı Analizörü: Loss_Weather = WeatherStressPct * PotentialYield", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_5": { description: "Mahsul Verim Kaybı Analizörü: Loss_Nutrient = NutrientDeficiencyPct * PotentialYield", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_6": { description: "Mahsul Verim Kaybı Analizörü: FinancialLoss = YieldGap * MarketPrice", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_7": { description: "Mahsul Verim Kaybı Analizörü: ROI_Intervention = (FinancialLoss_Recovered - InterventionCost) / InterventionCost", requiredInputs: [], outputHint: "number" },
  // ── Makine Ekonomik Ömrü ──
  "user.machine_economic_life_0": { description: "Makine Ekonomik Ömrü: EUAC_Capital = (InitialCost - SalvageValue) * (A/P, i, n) + SalvageValue * i", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_1": { description: "Makine Ekonomik Ömrü: EUAC_Operating = SUM(OpCost_t * (P/F, i, t)) * (A/P, i, n)", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_2": { description: "Makine Ekonomik Ömrü: TotalEUAC = EUAC_Capital + EUAC_Operating", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_3": { description: "Makine Ekonomik Ömrü: EconomicLife = n where TotalEUAC is MINIMUM", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_4": { description: "Makine Ekonomik Ömrü: Defender_EUAC = CurrentMarketValue * (A/P, i, n) + OpCost_Defender", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_5": { description: "Makine Ekonomik Ömrü: Challenger_EUAC = EUAC_NewMachine", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_6": { description: "Makine Ekonomik Ömrü: ReplacementDecision = IF(Defender_EUAC > Challenger_EUAC, 'Replace', 'Keep')", requiredInputs: [], outputHint: "number" },
  // ── Malzeme Replacement Maliyet ──
  "user.material_replacement_cost_0": { description: "Malzeme Replacement Maliyet: TCO_Current = MatCost_Current + ProcessingCost_Current + LifecycleMaint_Current + DisposalCost_Current", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_1": { description: "Malzeme Replacement Maliyet: TCO_Alternative = MatCost_Alt + ProcessingCost_Alt + LifecycleMaint_Alt + DisposalCost_Alt", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_2": { description: "Malzeme Replacement Maliyet: WeightSavings = Weight_Current - Weight_Alt", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_3": { description: "Malzeme Replacement Maliyet: FuelSavings = WeightSavings * FuelFactor * LifecycleDistance * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_4": { description: "Malzeme Replacement Maliyet: NetBenefit = TCO_Current - TCO_Alternative + FuelSavings + QualityPremium", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_5": { description: "Malzeme Replacement Maliyet: Payback = (ToolingCost_Alt + QualificationCost) / AnnualNetBenefit", requiredInputs: [], outputHint: "number" },
  // ── MOQ Stok Denge ──
  "user.moq_stock_balance_0": { description: "MOQ Stok Denge: EOQ = SQRT((2 * AnnualDemand * OrderCost) / HoldingCost)", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_1": { description: "MOQ Stok Denge: MOQ_Penalty = IF(MOQ > EOQ, (MOQ - EOQ)/2 * HoldingCost, 0)", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_2": { description: "MOQ Stok Denge: PriceBreakSavings = (UnitPrice_Standard - UnitPrice_MOQ) * AnnualDemand", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_3": { description: "MOQ Stok Denge: NetBenefit = PriceBreakSavings - MOQ_Penalty - AdditionalOrderCostSavings", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_4": { description: "MOQ Stok Denge: OptimalOrderQty = IF(NetBenefit > 0, MOQ, EOQ)", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_5": { description: "MOQ Stok Denge: CycleStock_Cost = (OptimalOrderQty / 2) * HoldingCost", requiredInputs: [], outputHint: "number" },
  // ── MTBF/MTTR Finansal Etki ──
  "user.mtbf_mttr_financial_0": { description: "MTBF/MTTR Finansal Etki: Availability = MTBF / (MTBF + MTTR)", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_1": { description: "MTBF/MTTR Finansal Etki: ExpectedDowntime = TotalTime * (1 - Availability)", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_2": { description: "MTBF/MTTR Finansal Etki: DowntimeCost = ExpectedDowntime * CostPerHour", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_3": { description: "MTBF/MTTR Finansal Etki: FailureFrequency = TotalTime / MTBF", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_4": { description: "MTBF/MTTR Finansal Etki: RepairCost = FailureFrequency * (MTTR * LaborRate + PartsCost)", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_5": { description: "MTBF/MTTR Finansal Etki: TotalReliabilityCost = DowntimeCost + RepairCost", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_6": { description: "MTBF/MTTR Finansal Etki: ROI_Improvement = (OldCost - NewCost) / InvestmentCost", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_7": { description: "MTBF/MTTR Finansal Etki: TargetMTBF = -TotalTime / LN(TargetAvailability)", requiredInputs: [], outputHint: "number" },
  // ── Muda Atık Maliyet ──
  "user.muda_waste_cost_0": { description: "Muda Atık Maliyet: Overproduction = ExcessUnits * UnitCost", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_1": { description: "Muda Atık Maliyet: Waiting = WaitingHours * (LaborRate + MachineRate)", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_2": { description: "Muda Atık Maliyet: Transport = TransportDistance * CostPerMeter * Trips", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_3": { description: "Muda Atık Maliyet: Overprocessing = (ActualTime - StandardTime) * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_4": { description: "Muda Atık Maliyet: Inventory = ExcessInventory * HoldingCostRate * Time", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_5": { description: "Muda Atık Maliyet: Motion = UnnecessaryMotionTime * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_6": { description: "Muda Atık Maliyet: Defects = DefectUnits * (MaterialCost + ReworkCost)", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_7": { description: "Muda Atık Maliyet: TotalMudaCost = SUM(Overproduction, Waiting, Transport, Overprocessing, Inventory, Motion, Defects)", requiredInputs: [], outputHint: "number" },
  // ── Nakit Akışı Açığı ──
  "user.cash_flow_gap_0": { description: "Nakit Akışı Açığı: CashInflow = SUM(Receipts_t)", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_1": { description: "Nakit Akışı Açığı: CashOutflow = SUM(Payments_t)", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_2": { description: "Nakit Akışı Açığı: NetCashFlow_t = CashInflow_t - CashOutflow_t", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_3": { description: "Nakit Akışı Açığı: CumulativeCashFlow = SUM(NetCashFlow_t)", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_4": { description: "Nakit Akışı Açığı: CashGap = MAX(0, -MIN(CumulativeCashFlow))", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_5": { description: "Nakit Akışı Açığı: DSO = (AccountsReceivable / TotalCreditSales) * Days", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_6": { description: "Nakit Akışı Açığı: DPO = (AccountsPayable / TotalCreditPurchases) * Days", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_7": { description: "Nakit Akışı Açığı: DIO = (Inventory / COGS) * Days", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_8": { description: "Nakit Akışı Açığı: CashConversionCycle = DSO + DIO - DPO", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_9": { description: "Nakit Akışı Açığı: FinancingCost = CashGap * DailyInterestRate", requiredInputs: [], outputHint: "number" },
  // ── Navlun Maliyeti ──
  "user.freight_cost_0": { description: "Navlun Maliyeti: ChargeableWeight = MAX(GrossWeight, VolumetricWeight)", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_1": { description: "Navlun Maliyeti: BaseFreight = ChargeableWeight * RatePerKg", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_2": { description: "Navlun Maliyeti: BunkerSurcharge = BaseFreight * BAF_Pct", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_3": { description: "Navlun Maliyeti: SecurityFee = ChargeableWeight * SecurityRate", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_4": { description: "Navlun Maliyeti: TerminalHandling = Units * THC_Rate", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_5": { description: "Navlun Maliyeti: CustomsClearance = FixedFee + (Value * DutyPct)", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_6": { description: "Navlun Maliyeti: TotalFreightCost = BaseFreight + BunkerSurcharge + SecurityFee + TerminalHandling + CustomsClearance", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_7": { description: "Navlun Maliyeti: CostPerUnit = TotalFreightCost / TotalUnits", requiredInputs: [], outputHint: "number" },
  // ── Noise & Vibration Maliyet ──
  "user.noise_vibration_cost_0": { description: "Noise & Vibration Maliyet: NoiseExposure_dBA = 10 * LOG10((1/T) * SUM(t_i * 10^(L_i/10)))", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_1": { description: "Noise & Vibration Maliyet: Vibration_RMS = SQRT((1/T) * SUM(a_i^2 * t_i))", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_2": { description: "Noise & Vibration Maliyet: HealthCost = IF(Noise > 85 OR Vibration > Limit, MedicalScreening + PPE_Cost + InsurancePremiumHike, 0)", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_3": { description: "Noise & Vibration Maliyet: ProductivityLoss = (ActualOutput - BaselineOutput) * UnitMargin", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_4": { description: "Noise & Vibration Maliyet: ReworkCost = VibrationDefectRate * TotalUnits * ReworkCostPerUnit", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_5": { description: "Noise & Vibration Maliyet: MitigationROI = (HealthCost + ProdLoss + ReworkCost) / MitigationInvestment", requiredInputs: [], outputHint: "number" },
  // ── OEE ve Durma Süresi ──
  "user.oee_downtime_0": { description: "OEE ve Durma Süresi: Availability = OperatingTime / PlannedProductionTime", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_1": { description: "OEE ve Durma Süresi: Performance = (IdealCycleTime * TotalCount) / OperatingTime", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_2": { description: "OEE ve Durma Süresi: Quality = GoodCount / TotalCount", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_3": { description: "OEE ve Durma Süresi: OEE = Availability * Performance * Quality", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_4": { description: "OEE ve Durma Süresi: TEEP = OEE * (PlannedProductionTime / AllTime)", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_5": { description: "OEE ve Durma Süresi: DowntimeCost = (PlannedProductionTime - OperatingTime) * CostPerMinute", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_6": { description: "OEE ve Durma Süresi: SpeedLoss = (OperatingTime - (IdealCycleTime * TotalCount)) * CostPerMinute", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_7": { description: "OEE ve Durma Süresi: QualityLoss = (TotalCount - GoodCount) * UnitCost", requiredInputs: [], outputHint: "number" },
  // ── Ofis Malzemeleri Maliyet ──
  "user.office_supplies_cost_0": { description: "Ofis Malzemeleri Maliyet: ConsumptionRate = TotalConsumed / EmployeeCount", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_1": { description: "Ofis Malzemeleri Maliyet: AnnualCost = SUM(Item_i * UnitPrice_i * AnnualUsage_i)", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_2": { description: "Ofis Malzemeleri Maliyet: CarryingCost = AverageInventory * HoldingRate", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_3": { description: "Ofis Malzemeleri Maliyet: StockoutCost = EmergencyOrders * PremiumFreight", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_4": { description: "Ofis Malzemeleri Maliyet: EOQ_Office = SQRT((2 * AnnualUsage * OrderCost) / HoldingCost)", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_5": { description: "Ofis Malzemeleri Maliyet: WastePct = (Purchased - Consumed) / Purchased", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_6": { description: "Ofis Malzemeleri Maliyet: OptimizationSavings = (CurrentCost - EOQ_Cost) + (WastePct * CurrentCost)", requiredInputs: [], outputHint: "number" },
  // ── Overtime vs. Hiring Breakeven ──
  "user.overtime_hiring_breakeven_0": { description: "Overtime vs. Hiring Breakeven: OvertimeCost_Hour = RegularRate * OvertimeMultiplier * (1 + BurdenRate)", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_1": { description: "Overtime vs. Hiring Breakeven: HiringCost_Total = Recruitment + Onboarding + Training + RampUpProductivityLoss", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_2": { description: "Overtime vs. Hiring Breakeven: AnnualNewHireCost = (RegularRate * AnnualHours) * (1 + BurdenRate) + Benefits", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_3": { description: "Overtime vs. Hiring Breakeven: BreakevenHours = HiringCost_Total / (AnnualNewHireCost / AnnualHours - OvertimeCost_Hour)", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_4": { description: "Overtime vs. Hiring Breakeven: Decision = IF(ExpectedOvertimeHours > BreakevenHours, 'Hire', 'Overtime')", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_5": { description: "Overtime vs. Hiring Breakeven: QualityCost_OT = OvertimeHours * FatigueDefectRate * DefectCost", requiredInputs: [], outputHint: "number" },
  // ── Ödeme Vadesi Optimize Edici ──
  "user.payment_terms_optimizer_0": { description: "Ödeme Vadesi Optimize Edici: DSO = (AccountsReceivable / Revenue) * Days", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_1": { description: "Ödeme Vadesi Optimize Edici: CarryingCost_AR = AverageAR * WACC / 365", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_2": { description: "Ödeme Vadesi Optimize Edici: BadDebtExpense = Revenue * DefaultRate", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_3": { description: "Ödeme Vadesi Optimize Edici: DiscountCost = EarlyPaymentDiscountPct * DiscountTakeRate * Revenue", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_4": { description: "Ödeme Vadesi Optimize Edici: OptimalTerms = Terms where (CarryingCost + BadDebt - DiscountCost) is MINIMUM", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_5": { description: "Ödeme Vadesi Optimize Edici: CashFlowImpact = (NewDSO - OldDSO) * (Revenue / 365)", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_6": { description: "Ödeme Vadesi Optimize Edici: NPV_Terms = SUM(CashInflow_t / (1 + DailyWACC)^t)", requiredInputs: [], outputHint: "number" },
  // ── Öğrenme Eğrisi Süre Tahmincisi ──
  "user.learning_curve_time_0": { description: "Öğrenme Eğrisi Süre Tahmincisi: LearningRate = 1 - (Time_2N / Time_N)", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_1": { description: "Öğrenme Eğrisi Süre Tahmincisi: Slope_b = LOG(LearningRate) / LOG(2)", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_2": { description: "Öğrenme Eğrisi Süre Tahmincisi: Time_N = Time_1 * (N^b)", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_3": { description: "Öğrenme Eğrisi Süre Tahmincisi: CumulativeTime_N = Time_1 * (N^(b+1)) / (b+1)", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_4": { description: "Öğrenme Eğrisi Süre Tahmincisi: AverageTime_N = CumulativeTime_N / N", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_5": { description: "Öğrenme Eğrisi Süre Tahmincisi: Cost_N = Time_N * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_6": { description: "Öğrenme Eğrisi Süre Tahmincisi: BreakevenUnit = 0; // reached", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_7": { description: "Öğrenme Eğrisi Süre Tahmincisi: TotalLaborCost = CumulativeTime_N * LaborRate", requiredInputs: [], outputHint: "number" },
  // ── Palet Rafı Optimize Edici ──
  "user.pallet_rack_optimizer_0": { description: "Palet Rafı Optimize Edici: RackCapacity = Bays * Levels * PalletsPerBay", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_1": { description: "Palet Rafı Optimize Edici: FloorUtilization = RackFootprint / TotalFloorArea", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_2": { description: "Palet Rafı Optimize Edici: Throughput = Aisles * ForkliftSpeed * TravelDistance^-1", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_3": { description: "Palet Rafı Optimize Edici: Deflection = (5 * Load * BeamLength^3) / (384 * E * I)", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_4": { description: "Palet Rafı Optimize Edici: SafetyFactor = MaxLoadCapacity / ActualLoad", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_5": { description: "Palet Rafı Optimize Edici: CostPerPosition = TotalRackCost / RackCapacity", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_6": { description: "Palet Rafı Optimize Edici: RetrievalTime = TravelTime_Horizontal + TravelTime_Vertical + PickTime", requiredInputs: [], outputHint: "number" },
  // ── Poka-Yoke ROI ──
  "user.poka_yoke_roi_0": { description: "Poka-Yoke ROI: CurrentDefectRate = Defects / TotalUnits", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_1": { description: "Poka-Yoke ROI: DefectCost_Annual = CurrentDefectRate * TotalUnits * CostPerDefect", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_2": { description: "Poka-Yoke ROI: PokaYoke_Cost = Design + Implementation + Training + Maintenance", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_3": { description: "Poka-Yoke ROI: NewDefectRate = CurrentDefectRate * (1 - Effectiveness)", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_4": { description: "Poka-Yoke ROI: Savings = (CurrentDefectRate - NewDefectRate) * TotalUnits * CostPerDefect", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_5": { description: "Poka-Yoke ROI: ROI = (Savings - PokaYoke_Cost) / PokaYoke_Cost", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_6": { description: "Poka-Yoke ROI: PaybackMonths = PokaYoke_Cost / (Savings / 12)", requiredInputs: [], outputHint: "number" },
  // ── Porsiyon Maliyet ──
  "user.portion_cost_0": { description: "Porsiyon Maliyet: IngredientCost = SUM(Quantity_i * UnitPrice_i)", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_1": { description: "Porsiyon Maliyet: YieldAdjustedCost = IngredientCost / YieldPct", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_2": { description: "Porsiyon Maliyet: LaborCost = PrepTime * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_3": { description: "Porsiyon Maliyet: Overhead = (IngredientCost + LaborCost) * OverheadPct", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_4": { description: "Porsiyon Maliyet: TotalPortionCost = YieldAdjustedCost + LaborCost + Overhead", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_5": { description: "Porsiyon Maliyet: FoodCostPct = TotalPortionCost / MenuPrice", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_6": { description: "Porsiyon Maliyet: MenuPrice_Target = TotalPortionCost / TargetFoodCostPct", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_7": { description: "Porsiyon Maliyet: Margin = MenuPrice - TotalPortionCost", requiredInputs: [], outputHint: "number" },
  // ── Project Maliyet Tahmin ──
  "user.project_cost_estimate_0": { description: "Project Maliyet Tahmin: DirectLabor = SUM(Hours_i * Rate_i)", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_1": { description: "Project Maliyet Tahmin: DirectMaterial = SUM(Quantity_j * Price_j)", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_2": { description: "Project Maliyet Tahmin: Equipment = SUM(RentalDays_k * DailyRate_k)", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_3": { description: "Project Maliyet Tahmin: Subcontractor = SUM(LumpSum_m)", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_4": { description: "Project Maliyet Tahmin: Overhead = (DirectLabor + DirectMaterial) * OverheadRate", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_5": { description: "Project Maliyet Tahmin: Contingency = (Direct + Overhead) * RiskFactor", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_6": { description: "Project Maliyet Tahmin: TotalEstimate = DirectLabor + DirectMaterial + Equipment + Subcontractor + Overhead + Contingency", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_7": { description: "Project Maliyet Tahmin: CostVariance = TotalEstimate - Budget", requiredInputs: [], outputHint: "number" },
  // ── Project Overrun risk ──
  "user.project_overrun_0": { description: "Project Overrun risk: SPI = EarnedValue / PlannedValue", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_1": { description: "Project Overrun risk: CPI = EarnedValue / ActualCost", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_2": { description: "Project Overrun risk: EAC = BudgetAtCompletion / CPI", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_3": { description: "Project Overrun risk: ExpectedOverrun = EAC - BudgetAtCompletion", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_4": { description: "Project Overrun risk: ScheduleDelay = (ActualDuration - PlannedDuration) / PlannedDuration", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_5": { description: "Project Overrun risk: RiskExposure = ProbabilityOfDelay * (DelayDays * DailyPenalty) + ProbabilityOfCostOverrun * ExpectedOverrun", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_6": { description: "Project Overrun risk: MitigationCost = CrashingCost + FastTrackingCost", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_7": { description: "Project Overrun risk: NetRisk = RiskExposure - MitigationCost", requiredInputs: [], outputHint: "number" },
  // ── reçete Maliyet Check ──
  "user.recipe_cost_check_0": { description: "reçete Maliyet Check: TheoreticalCost = SUM(FormulationPct_i * IngredientPrice_i)", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_1": { description: "reçete Maliyet Check: ActualCost = TotalMaterialConsumed * AvgPrice / TotalOutput", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_2": { description: "reçete Maliyet Check: Variance = ActualCost - TheoreticalCost", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_3": { description: "reçete Maliyet Check: YieldLossCost = (1 - ActualYield) * TheoreticalCost", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_4": { description: "reçete Maliyet Check: EvaporationLoss = InputWeight - OutputWeight - KnownScrap", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_5": { description: "reçete Maliyet Check: Efficiency = ActualOutput / TheoreticalOutput", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_6": { description: "reçete Maliyet Check: CostPerKg = ActualCost / OutputWeight", requiredInputs: [], outputHint: "number" },
  // ── Restaurant Menü Marj Kaçak ──
  "user.restaurant_menu_margin_leak_0": { description: "Restaurant Menü Marj Kaçak: TheoreticalFoodCost = SUM(ItemsSold_i * PortionCost_i)", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_1": { description: "Restaurant Menü Marj Kaçak: ActualFoodCost = BeginningInventory + Purchases - EndingInventory", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_2": { description: "Restaurant Menü Marj Kaçak: Variance = ActualFoodCost - TheoreticalFoodCost", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_3": { description: "Restaurant Menü Marj Kaçak: VariancePct = Variance / TotalFoodSales", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_4": { description: "Restaurant Menü Marj Kaçak: WasteCost = RecordedWaste * AvgPortionCost", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_5": { description: "Restaurant Menü Marj Kaçak: TheftLoss = Variance - WasteCost - CompMeals", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_6": { description: "Restaurant Menü Marj Kaçak: IdealMargin = 1 - (TheoreticalFoodCost / TotalFoodSales)", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_7": { description: "Restaurant Menü Marj Kaçak: ActualMargin = 1 - (ActualFoodCost / TotalFoodSales)", requiredInputs: [], outputHint: "number" },
  // ── Robot Kol vs. Manuel İşçi ──
  "user.robot_vs_manual_0": { description: "Robot Kol vs. Manuel İşçi: ManualCost_Annual = (Operators * HourlyRate * Hours) * (1 + Burden)", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_1": { description: "Robot Kol vs. Manuel İşçi: RobotCost_Annual = (RobotCapex / DepreciationLife) + Maintenance + Energy + ProgrammerCost", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_2": { description: "Robot Kol vs. Manuel İşçi: RobotOutput = CycleTime_Robot^-1 * Uptime", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_3": { description: "Robot Kol vs. Manuel İşçi: ManualOutput = CycleTime_Manual^-1 * Efficiency", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_4": { description: "Robot Kol vs. Manuel İşçi: CostPerUnit_Manual = ManualCost_Annual / ManualOutput", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_5": { description: "Robot Kol vs. Manuel İşçi: CostPerUnit_Robot = RobotCost_Annual / RobotOutput", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_6": { description: "Robot Kol vs. Manuel İşçi: ROI = (ManualCost - RobotCost) / RobotCapex", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_7": { description: "Robot Kol vs. Manuel İşçi: Payback = RobotCapex / (ManualCost_Annual - RobotCost_Annual)", requiredInputs: [], outputHint: "number" },
  // ── Rota Maliyet ──
  "user.route_cost_0": { description: "Rota Maliyet: DistanceCost = TotalDistance * FuelConsumption * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.route_cost_1": { description: "Rota Maliyet: TimeCost = TotalTime * (DriverWage + VehicleDepreciation)", requiredInputs: [], outputHint: "number" },
  "user.route_cost_2": { description: "Rota Maliyet: TollCost = SUM(Tolls_i)", requiredInputs: [], outputHint: "number" },
  "user.route_cost_3": { description: "Rota Maliyet: MaintenanceCost = TotalDistance * MaintRatePerKm", requiredInputs: [], outputHint: "number" },
  "user.route_cost_4": { description: "Rota Maliyet: Overhead = (DistanceCost + TimeCost) * OverheadPct", requiredInputs: [], outputHint: "number" },
  "user.route_cost_5": { description: "Rota Maliyet: TotalRouteCost = DistanceCost + TimeCost + TollCost + MaintenanceCost + Overhead", requiredInputs: [], outputHint: "number" },
  "user.route_cost_6": { description: "Rota Maliyet: CostPerKm = TotalRouteCost / TotalDistance", requiredInputs: [], outputHint: "number" },
  "user.route_cost_7": { description: "Rota Maliyet: CostPerDrop = TotalRouteCost / NumberOfDrops", requiredInputs: [], outputHint: "number" },
  // ── Rota Optimizasyonu Analizörü ──
  "user.route_optimization_0": { description: "Rota Optimizasyonu Analizörü: NearestNeighbor_Dist = SUM(MinDistance_i)", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_1": { description: "Rota Optimizasyonu Analizörü: Savings_ClarkeWright = Distance_Depot_i + Distance_Depot_j - Distance_i_j", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_2": { description: "Rota Optimizasyonu Analizörü: RouteEfficiency = TheoreticalMinDistance / ActualRouteDistance", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_3": { description: "Rota Optimizasyonu Analizörü: DropDensity = NumberOfDrops / RouteArea", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_4": { description: "Rota Optimizasyonu Analizörü: TimeWindowPenalty = SUM(MAX(0, ArrivalTime - LateWindow) * PenaltyRate)", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_5": { description: "Rota Optimizasyonu Analizörü: VehicleUtilization = TotalLoad / VehicleCapacity", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_6": { description: "Rota Optimizasyonu Analizörü: TotalSavings = BaselineCost - OptimizedCost", requiredInputs: [], outputHint: "number" },
  // ── Rüzgar Türbini Yatırım Getirisi ──
  "user.wind_turbine_investment_0": { description: "Rüzgar Türbini Yatırım Getirisi: AEP = 8760 * SUM(PowerCurve_v * Frequency_v)", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_1": { description: "Rüzgar Türbini Yatırım Getirisi: CapacityFactor = AEP / (RatedPower * 8760)", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_2": { description: "Rüzgar Türbini Yatırım Getirisi: AnnualRevenue = AEP * FeedInTariff", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_3": { description: "Rüzgar Türbini Yatırım Getirisi: OPEX = LandLease + Maintenance + Insurance + GridFees", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_4": { description: "Rüzgar Türbini Yatırım Getirisi: EBITDA = AnnualRevenue - OPEX", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_5": { description: "Rüzgar Türbini Yatırım Getirisi: LCOE = (SUM(Capex + Opex_t / (1+r)^t)) / (SUM(AEP_t / (1+r)^t))", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_6": { description: "Rüzgar Türbini Yatırım Getirisi: NPV = SUM(EBITDA_t / (1+WACC)^t) - Capex", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_7": { description: "Rüzgar Türbini Yatırım Getirisi: IRR = r where NPV = 0", requiredInputs: [], outputHint: "number" },
  // ── SaaS Shelfware Maliyet ──
  "user.saas_shelfware_0": { description: "SaaS Shelfware Maliyet: TotalLicenses = PurchasedLicenses", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_1": { description: "SaaS Shelfware Maliyet: ActiveUsers = UsersLoggedInLast30Days", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_2": { description: "SaaS Shelfware Maliyet: ShelfwarePct = (TotalLicenses - ActiveUsers) / TotalLicenses", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_3": { description: "SaaS Shelfware Maliyet: ShelfwareCost = ShelfwarePct * TotalContractValue", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_4": { description: "SaaS Shelfware Maliyet: UtilizationRate = ActiveUsers / TotalLicenses", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_5": { description: "SaaS Shelfware Maliyet: FeatureAdoption = FeaturesUsed / TotalFeatures", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_6": { description: "SaaS Shelfware Maliyet: OptimizationSavings = ShelfwareCost + (UnderutilizedTierPriceDiff * Users)", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_7": { description: "SaaS Shelfware Maliyet: TrueUpCost = MAX(0, ActualUsage - ContractedUsage) * OverageRate", requiredInputs: [], outputHint: "number" },
  // ── Saatlik Ücret ──
  "user.hourly_rate_0": { description: "Saatlik Ücret: GrossAnnualSalary = BaseSalary + Bonuses", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_1": { description: "Saatlik Ücret: EmployerTaxes = GrossAnnualSalary * TaxRate", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_2": { description: "Saatlik Ücret: Benefits = HealthInsurance + RetirementMatch + PaidTimeOffCost", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_3": { description: "Saatlik Ücret: TotalLaborCost = GrossAnnualSalary + EmployerTaxes + Benefits", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_4": { description: "Saatlik Ücret: ProductiveHours = (WeeksPerYear - VacationWeeks) * HoursPerWeek * (1 - IdleTimePct)", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_5": { description: "Saatlik Ücret: FullyBurdenedHourlyRate = TotalLaborCost / ProductiveHours", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_6": { description: "Saatlik Ücret: MarginRate = FullyBurdenedHourlyRate * (1 + TargetMargin)", requiredInputs: [], outputHint: "number" },
  // ── SMED Değişim Optimize Edici ──
  "user.smed_changeover_optimizer_0": { description: "SMED Değişim Optimize Edici: CurrentSetupTime = Internal_Current + External_Current", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_1": { description: "SMED Değişim Optimize Edici: TargetSetupTime = Internal_Target + External_Target", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_2": { description: "SMED Değişim Optimize Edici: ConversionRate = (Internal_Current - Internal_Target) / Internal_Current", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_3": { description: "SMED Değişim Optimize Edici: CapacityRecovered = (CurrentSetupTime - TargetSetupTime) * ChangeoverFrequency", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_4": { description: "SMED Değişim Optimize Edici: FinancialGain = CapacityRecovered * BottleneckThroughput * UnitMargin", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_5": { description: "SMED Değişim Optimize Edici: SMED_Investment = Training + Tooling + Modification", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_6": { description: "SMED Değişim Optimize Edici: ROI = FinancialGain / SMED_Investment", requiredInputs: [], outputHint: "number" },
  // ── Sözleşme Teşvik ──
  "user.contract_incentive_0": { description: "Sözleşme Teşvik: TargetCost = BaselineEstimate", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_1": { description: "Sözleşme Teşvik: TargetFee = TargetCost * TargetFeePct", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_2": { description: "Sözleşme Teşvik: ShareRatio = OverrunShare / UnderrunShare", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_3": { description: "Sözleşme Teşvik: ActualFee = TargetFee + (TargetCost - ActualCost) * ContractorSharePct", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_4": { description: "Sözleşme Teşvik: MaxFee = TargetFee * MaxFeeMultiplier", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_5": { description: "Sözleşme Teşvik: MinFee = TargetFee * MinFeeMultiplier", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_6": { description: "Sözleşme Teşvik: FinalFee = MIN(MAX(ActualFee, MinFee), MaxFee)", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_7": { description: "Sözleşme Teşvik: FinalPrice = ActualCost + FinalFee", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_8": { description: "Sözleşme Teşvik: PerformanceBonus = SUM(MetricWeight_i * MetricScore_i) * BonusPool", requiredInputs: [], outputHint: "number" },
  // ── SPC Signal Delay Maliyet ──
  "user.spc_signal_delay_0": { description: "SPC Signal Delay Maliyet: ARL_InControl = 1 / Alpha", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_1": { description: "SPC Signal Delay Maliyet: ARL_OutOfControl = 1 / (1 - Beta)", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_2": { description: "SPC Signal Delay Maliyet: DetectionDelay_Hours = ARL_OutOfControl * SamplingInterval", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_3": { description: "SPC Signal Delay Maliyet: DefectsProduced = DetectionDelay_Hours * ProductionRate * DefectRate_OOC", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_4": { description: "SPC Signal Delay Maliyet: Cost_Delay = DefectsProduced * CostPerDefect", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_5": { description: "SPC Signal Delay Maliyet: InvestigationCost = FalseAlarmRate * SamplingFrequency * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_6": { description: "SPC Signal Delay Maliyet: OptimalInterval = SQRT((2 * SamplingCost * ProductionRate) / (Cost_Delay * ShiftMagnitude^2))", requiredInputs: [], outputHint: "number" },
  // ── Steam Trap Enerji kayıp ──
  "user.steam_trap_energy_loss_0": { description: "Steam Trap Enerji kayıp: OrificeFlow = C_d * A * SQRT(2 * DeltaP * Density)", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_1": { description: "Steam Trap Enerji kayıp: SteamLoss_kg_h = OrificeFlow * 3600", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_2": { description: "Steam Trap Enerji kayıp: EnergyLoss_kW = SteamLoss_kg_h * Enthalpy_Steam / 3600", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_3": { description: "Steam Trap Enerji kayıp: AnnualCost = EnergyLoss_kW * OperatingHours * SteamCost_per_kWh", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_4": { description: "Steam Trap Enerji kayıp: TrapFailureRate = FailedTraps / TotalTraps", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_5": { description: "Steam Trap Enerji kayıp: TotalSystemLoss = SUM(AnnualCost_i)", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_6": { description: "Steam Trap Enerji kayıp: RepairROI = TotalSystemLoss / (TrapCost + LaborCost)", requiredInputs: [], outputHint: "number" },
  // ── Stok Devir hızı risk ──
  "user.inventory_turnover_risk_0": { description: "Stok Devir hızı risk: InventoryTurnover = COGS / AverageInventory", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_1": { description: "Stok Devir hızı risk: DaysSalesInventory = 365 / InventoryTurnover", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_2": { description: "Stok Devir hızı risk: ObsolescenceRisk = SUM(AgingBracket_i * ObsolescenceRate_i * InventoryValue_i)", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_3": { description: "Stok Devir hızı risk: CarryingCost = AverageInventory * (WACC + Storage + Insurance + Obsolescence)", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_4": { description: "Stok Devir hızı risk: OptimalTurnover = IndustryBenchmark * AdjustmentFactor", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_5": { description: "Stok Devir hızı risk: StockoutRisk = IF(Turnover > MaxThreshold, High, Low)", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_6": { description: "Stok Devir hızı risk: LiquidationLoss = SlowMovingInventory * (1 - SalvageValuePct)", requiredInputs: [], outputHint: "number" },
  // ── Su Kullanımı Optimize Edici ──
  "user.water_usage_optimizer_0": { description: "Su Kullanımı Optimize Edici: WaterIntensity = TotalWaterConsumed / ProductionVolume", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_1": { description: "Su Kullanımı Optimize Edici: BaselineConsumption = HistoricalAvg * ProductionVolume", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_2": { description: "Su Kullanımı Optimize Edici: WaterSavings = BaselineConsumption - ActualConsumption", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_3": { description: "Su Kullanımı Optimize Edici: CostSavings = WaterSavings * (WaterSupplyRate + WastewaterTreatmentRate)", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_4": { description: "Su Kullanımı Optimize Edici: RecycleRate = RecycledWater / TotalWaterConsumed", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_5": { description: "Su Kullanımı Optimize Edici: LeakLoss = TotalSupplied - TotalMetered", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_6": { description: "Su Kullanımı Optimize Edici: ROI_Water = CostSavings / (EquipmentCost + InstallationCost)", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_7": { description: "Su Kullanımı Optimize Edici: CarbonFootprint_Water = TotalConsumed * EnergyIntensity_Water * GridEmissionFactor", requiredInputs: [], outputHint: "number" },
  // ── Sulama Maliyet Check ──
  "user.irrigation_cost_check_0": { description: "Sulama Maliyet Check: WaterRequirement = ETc * Area * (1 - EffectiveRainfall)", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_1": { description: "Sulama Maliyet Check: PumpEnergy = (WaterRequirement * TotalHead) / (PumpEff * MotorEff)", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_2": { description: "Sulama Maliyet Check: EnergyCost = PumpEnergy * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_3": { description: "Sulama Maliyet Check: MaintCost = Area * MaintRatePerHa", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_4": { description: "Sulama Maliyet Check: TotalIrrigationCost = EnergyCost + MaintCost + LaborCost + Depreciation", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_5": { description: "Sulama Maliyet Check: CostPerM3 = TotalIrrigationCost / WaterRequirement", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_6": { description: "Sulama Maliyet Check: WaterUseEfficiency = (WaterRequirement - Losses) / WaterRequirement", requiredInputs: [], outputHint: "number" },
  // ── Supplier Performans Tco ──
  "user.supplier_performance_tco_0": { description: "Supplier Performans Tco: TCO = PurchasePrice + OrderingCost + TransportCost + QualityCost + InventoryCost + RiskCost", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_1": { description: "Supplier Performans Tco: QualityCost = DefectRate * AnnualVolume * CostPerDefect", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_2": { description: "Supplier Performans Tco: InventoryCost = (AvgLeadTime + SafetyStockDays) * DailyDemand * HoldingRate", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_3": { description: "Supplier Performans Tco: RiskCost = ProbabilityOfDisruption * ImpactCost", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_4": { description: "Supplier Performans Tco: SupplierScore = (QualityWeight * QualityScore) + (DeliveryWeight * DeliveryScore) + (CostWeight * CostScore)", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_5": { description: "Supplier Performans Tco: TCO_Variance = TCO_Actual - TCO_Quoted", requiredInputs: [], outputHint: "number" },
  // ── Süt Kâr Dedektörü ──
  "user.dairy_profit_detector_0": { description: "Süt Kâr Dedektörü: FatCorrectedMilk = (0.4 * MilkYield) + (15 * FatYield)", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_1": { description: "Süt Kâr Dedektörü: ProteinCorrectedMilk = (0.337 * MilkYield) + (11.6 * ProteinYield)", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_2": { description: "Süt Kâr Dedektörü: FeedCostPerLiter = TotalFeedCost / MilkYield", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_3": { description: "Süt Kâr Dedektörü: IncomeOverFeedCost = (MilkPrice * MilkYield) - TotalFeedCost", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_4": { description: "Süt Kâr Dedektörü: MarginPerCow = IncomeOverFeedCost - (VetCost + BreedingCost + LaborCost)", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_5": { description: "Süt Kâr Dedektörü: HerdProfitability = SUM(MarginPerCow) - FixedOverhead", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_6": { description: "Süt Kâr Dedektörü: SomaticCellPenalty = IF(SCC > Threshold, MilkYield * PenaltyRate, 0)", requiredInputs: [], outputHint: "number" },
  // ── Taguchi kalite kayıp Fonksiyon ──
  "user.taguchi_quality_loss_0": { description: "Taguchi kalite kayıp Fonksiyon: LossPerUnit = k * (ActualValue - TargetValue)^2", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_1": { description: "Taguchi kalite kayıp Fonksiyon: k = CostAtTolerance / Tolerance^2", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_2": { description: "Taguchi kalite kayıp Fonksiyon: AverageLoss = k * (Variance + (Mean - Target)^2)", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_3": { description: "Taguchi kalite kayıp Fonksiyon: TotalAnnualLoss = AverageLoss * AnnualProduction", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_4": { description: "Taguchi kalite kayıp Fonksiyon: SignalToNoise_LargerBetter = -10 * LOG10(SUM(1/y_i^2) / n)", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_5": { description: "Taguchi kalite kayıp Fonksiyon: SignalToNoise_SmallerBetter = -10 * LOG10(SUM(y_i^2) / n)", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_6": { description: "Taguchi kalite kayıp Fonksiyon: QualityImprovementSavings = (OldAverageLoss - NewAverageLoss) * AnnualProduction", requiredInputs: [], outputHint: "number" },
  // ── Takım Aşınma Maliyeti ──
  "user.tool_wear_cost_0": { description: "Takım Aşınma Maliyeti: ToolCostPerPart = (InsertCost / Edges) * (MachiningTime / ToolLife)", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_1": { description: "Takım Aşınma Maliyeti: ChangeCostPerPart = (ToolChangeTime * MachineRate) * (MachiningTime / ToolLife)", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_2": { description: "Takım Aşınma Maliyeti: TotalToolingCost = ToolCostPerPart + ChangeCostPerPart", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_3": { description: "Takım Aşınma Maliyeti: WearRate = FlankWear / MachiningTime", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_4": { description: "Takım Aşınma Maliyeti: OptimalToolLife = ((1/n - 1) * (ToolChangeTime + InsertCost/Edges / MachineRate))", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_5": { description: "Takım Aşınma Maliyeti: CostOfPrematureFailure = (ExpectedLife - ActualLife) / ExpectedLife * InsertCost", requiredInputs: [], outputHint: "number" },
  // ── Takt Süre Flexibility Maliyet ──
  "user.takt_time_flexibility_0": { description: "Takt Süre Flexibility Maliyet: TaktTime = AvailableTime / CustomerDemand", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_1": { description: "Takt Süre Flexibility Maliyet: CycleTimeFlexibility = MAX(CycleTime_i) - MIN(CycleTime_i)", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_2": { description: "Takt Süre Flexibility Maliyet: BalanceLoss = SUM(TaktTime - CycleTime_i) * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_3": { description: "Takt Süre Flexibility Maliyet: CrossTrainingCost = Operators * TrainingHours * TrainerRate", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_4": { description: "Takt Süre Flexibility Maliyet: FlexibilityPremium = CrossTrainingCost / AnnualProduction", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_5": { description: "Takt Süre Flexibility Maliyet: VolumeVariationCost = IF(Demand > Capacity, (Demand - Capacity) * OvertimeRate, (Capacity - Demand) * IdleLaborCost)", requiredInputs: [], outputHint: "number" },
  // ── talep Forecast Stok Maliyet ──
  "user.demand_forecast_stock_0": { description: "talep Forecast Stok Maliyet: ForecastError = ABS(ActualDemand - ForecastDemand) / ActualDemand", requiredInputs: [], outputHint: "number" },
  "user.demand_forecast_stock_1": { description: "talep Forecast Stok Maliyet: SafetyStock = Z_Score * StdDev_ForecastError * SQRT(LeadTime)", requiredInputs: [], outputHint: "number" },
  "user.demand_forecast_stock_2": { description: "talep Forecast Stok Maliyet: CarryingCost_Safety = SafetyStock * UnitCost * HoldingRate", requiredInputs: [], outputHint: "number" },
  "user.demand_forecast_stock_3": { description: "talep Forecast Stok Maliyet: StockoutCost = IF(ActualDemand > (ForecastDemand + SafetyStock), (ActualDemand - ForecastDemand - SafetyStock) * PenaltyCost, 0)", requiredInputs: [], outputHint: "number" },
  "user.demand_forecast_stock_4": { description: "talep Forecast Stok Maliyet: TotalForecastCost = CarryingCost_Safety + StockoutCost + ForecastingSystemCost", requiredInputs: [], outputHint: "number" },
  // ── Tamirhane Parça ve İşçilik Teklif ──
  "user.repair_shop_quote_0": { description: "Tamirhane Parça ve İşçilik Teklif: PartCost = SUM(Quantity_i * DealerPrice_i)", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_1": { description: "Tamirhane Parça ve İşçilik Teklif: PartMargin = PartCost * PartMarkupPct", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_2": { description: "Tamirhane Parça ve İşçilik Teklif: LaborCost = FlatRateHours * ShopHourlyRate", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_3": { description: "Tamirhane Parça ve İşçilik Teklif: SubletCost = SUM(SubletInvoices)", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_4": { description: "Tamirhane Parça ve İşçilik Teklif: TotalQuote = PartCost + PartMargin + LaborCost + SubletCost + ShopSuppliesFee + EnvironmentalFee", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_5": { description: "Tamirhane Parça ve İşçilik Teklif: EffectiveLaborRate = (LaborCost + PartMargin) / ActualHours", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_6": { description: "Tamirhane Parça ve İşçilik Teklif: GrossProfitPct = (TotalQuote - PartCost - ActualLaborCost) / TotalQuote", requiredInputs: [], outputHint: "number" },
  // ── Taşeron Marj Sızıntı Dedektörü ──
  "user.subcontractor_margin_leak_0": { description: "Taşeron Marj Sızıntı Dedektörü: QuotedMargin = (ContractValue - EstimatedSubcontractorCost) / ContractValue", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_1": { description: "Taşeron Marj Sızıntı Dedektörü: ActualMargin = (ContractValue - ActualSubcontractorCost - ReworkCost - DelayPenalties) / ContractValue", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_2": { description: "Taşeron Marj Sızıntı Dedektörü: MarginLeak = QuotedMargin - ActualMargin", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_3": { description: "Taşeron Marj Sızıntı Dedektörü: ChangeOrderCost = SUM(ChangeOrderAmount_i)", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_4": { description: "Taşeron Marj Sızıntı Dedektörü: UnbilledWork = ActualWorkCompleted - BilledAmount", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_5": { description: "Taşeron Marj Sızıntı Dedektörü: LeakagePct = MarginLeak / QuotedMargin", requiredInputs: [], outputHint: "number" },
  // ── Taşıma Mode Maliyet risk ──
  "user.transport_mode_risk_0": { description: "Taşıma Mode Maliyet risk: Cost_Air = Weight * AirRate + Handling", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_1": { description: "Taşıma Mode Maliyet risk: Cost_Sea = Volume * SeaRate + PortFees + Customs", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_2": { description: "Taşıma Mode Maliyet risk: Cost_Road = Distance * RoadRate + Tolls", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_3": { description: "Taşıma Mode Maliyet risk: TransitTimeCost = TransitDays * InventoryCarryingCostPerDay", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_4": { description: "Taşıma Mode Maliyet risk: RiskCost = ProbabilityOfDamage * CargoValue + ProbabilityOfDelay * DelayPenalty", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_5": { description: "Taşıma Mode Maliyet risk: TotalModeCost = TransportCost + TransitTimeCost + RiskCost", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_6": { description: "Taşıma Mode Maliyet risk: ModeSelection = MIN(TotalModeCost_Air, TotalModeCost_Sea, TotalModeCost_Road)", requiredInputs: [], outputHint: "number" },
  // ── Tedarik Zinciri Kesintisi Risk Değerlendirmesi ──
  "user.supply_chain_disruption_0": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: RiskExposure = ProbabilityOfDisruption * FinancialImpact", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_1": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: TimeToRecover = DaysToRestoreFullCapacity", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_2": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: RevenueLoss = DailyRevenue * TimeToRecover * (1 - BufferCapacityPct)", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_3": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: MitigationCost = DualSourcingPremium + SafetyStockCarryingCost + InsurancePremium", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_4": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: RiskAdjustedCost = ExpectedAnnualLoss + MitigationCost", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_5": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: ResilienceIndex = 1 / (TimeToRecover * VulnerabilityScore)", requiredInputs: [], outputHint: "number" },
  // ── Tedarikçi Döviz Kuru Riski ──
  "user.supplier_currency_risk_0": { description: "Tedarikçi Döviz Kuru Riski: Exposure = ContractValue_FC * UnhedgedPct", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_1": { description: "Tedarikçi Döviz Kuru Riski: ExpectedLoss = Exposure * (ForwardRate - ExpectedSpotRate)", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_2": { description: "Tedarikçi Döviz Kuru Riski: VaR = Exposure * Volatility * Z_Score * SQRT(TimeHorizon)", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_3": { description: "Tedarikçi Döviz Kuru Riski: HedgingCost = Exposure * (ForwardRate - SpotRate)", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_4": { description: "Tedarikçi Döviz Kuru Riski: NetRiskCost = ExpectedLoss + HedgingCost", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_5": { description: "Tedarikçi Döviz Kuru Riski: CurrencyClauseSavings = IF(ContractHasAdjustment, Exposure * AdjustmentFactor, 0)", requiredInputs: [], outputHint: "number" },
  // ── Teklif Risk Analizörü ──
  "user.bid_risk_0": { description: "Teklif Risk Analizörü: BaseEstimate = SUM(DirectCosts) + Overhead", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_1": { description: "Teklif Risk Analizörü: Contingency = BaseEstimate * RiskFactor", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_2": { description: "Teklif Risk Analizörü: ExpectedMargin = (BidPrice - (BaseEstimate + Contingency)) / BidPrice", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_3": { description: "Teklif Risk Analizörü: WinProbability = f(BidPrice, CompetitorIndex, HistoricalWinRate)", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_4": { description: "Teklif Risk Analizörü: ExpectedValue = WinProbability * ExpectedMargin * BidPrice", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_5": { description: "Teklif Risk Analizörü: RiskAdjustedBid = BaseEstimate / (1 - TargetMargin - RiskPremium)", requiredInputs: [], outputHint: "number" },
  // ── Tekrarlayan Maliyet (RCA) ──
  "user.recurring_cost_0": { description: "Tekrarlayan Maliyet (RCA): RecurringCost_Annual = Frequency * CostPerEvent", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_1": { description: "Tekrarlayan Maliyet (RCA): PresentValue_Recurring = RecurringCost_Annual * ((1 - (1+r)^-n) / r)", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_2": { description: "Tekrarlayan Maliyet (RCA): RootCauseInvestment = CorrectiveActionCost + ImplementationCost", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_3": { description: "Tekrarlayan Maliyet (RCA): PaybackPeriod = RootCauseInvestment / RecurringCost_Annual", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_4": { description: "Tekrarlayan Maliyet (RCA): NPV_Elimination = PresentValue_Recurring - RootCauseInvestment", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_5": { description: "Tekrarlayan Maliyet (RCA): BreakevenFrequency = RootCauseInvestment / CostPerEvent", requiredInputs: [], outputHint: "number" },
  // ── Tekstil Atığı Risk Değerlendirmesi ──
  "user.textile_waste_risk_0": { description: "Tekstil Atığı Risk Değerlendirmesi: WasteRate = (InputFabric - OutputGarments) / InputFabric", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_1": { description: "Tekstil Atığı Risk Değerlendirmesi: PreConsumerWaste = CuttingScrap + SewingDefects + DyeingRework", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_2": { description: "Tekstil Atığı Risk Değerlendirmesi: FinancialLoss = PreConsumerWaste * FabricCostPerKg + ProcessingCost", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_3": { description: "Tekstil Atığı Risk Değerlendirmesi: DisposalCost = WasteWeight * LandfillFee", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_4": { description: "Tekstil Atığı Risk Değerlendirmesi: CircularRevenue = RecycledWasteWeight * ScrapValue", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_5": { description: "Tekstil Atığı Risk Değerlendirmesi: NetWasteCost = FinancialLoss + DisposalCost - CircularRevenue", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_6": { description: "Tekstil Atığı Risk Değerlendirmesi: RiskScore = NetWasteCost / TotalRevenue", requiredInputs: [], outputHint: "number" },
  // ── Temizlik Teklifi Optimize Edici ──
  "user.cleaning_bid_optimizer_0": { description: "Temizlik Teklifi Optimize Edici: AreaToClean = TotalSqM * CleanablePct", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_1": { description: "Temizlik Teklifi Optimize Edici: LaborHours = AreaToClean / ProductionRatePerHour", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_2": { description: "Temizlik Teklifi Optimize Edici: LaborCost = LaborHours * HourlyWage * (1 + Burden)", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_3": { description: "Temizlik Teklifi Optimize Edici: MaterialCost = AreaToClean * ConsumableCostPerSqM", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_4": { description: "Temizlik Teklifi Optimize Edici: EquipmentCost = MachineHours * DepreciationRate", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_5": { description: "Temizlik Teklifi Optimize Edici: Overhead = (LaborCost + MaterialCost) * OverheadPct", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_6": { description: "Temizlik Teklifi Optimize Edici: BidPrice = (LaborCost + MaterialCost + EquipmentCost + Overhead) / (1 - TargetMargin)", requiredInputs: [], outputHint: "number" },
  // ── Teslimat Maliyeti ──
  "user.delivery_cost_0": { description: "Teslimat Maliyeti: CostPerDrop = TotalRouteCost / NumberOfDrops", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_1": { description: "Teslimat Maliyeti: CostPerKm = TotalRouteCost / TotalDistance", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_2": { description: "Teslimat Maliyeti: FailedDeliveryCost = FailedDrops * (ReturnFreight + RestockingFee + AdminCost)", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_3": { description: "Teslimat Maliyeti: FuelSurcharge = BaseFreight * FuelIndexPct", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_4": { description: "Teslimat Maliyeti: TotalDeliveryCost = Linehaul + LastMile + FailedDeliveryCost + Surcharges", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_5": { description: "Teslimat Maliyeti: DeliveryEfficiency = SuccessfulDrops / TotalPlannedDrops", requiredInputs: [], outputHint: "number" },
  // ── Tohum Oranı ──
  "user.seed_rate_0": { description: "Tohum Oranı: TargetPlantPopulation = Area * DesiredPlantsPerSqm", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_1": { description: "Tohum Oranı: SeedRequirement = TargetPlantPopulation / (GerminationRate * FieldEmergenceRate)", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_2": { description: "Tohum Oranı: SeedCost = SeedRequirement * PricePerKg", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_3": { description: "Tohum Oranı: OptimalYield = f(PlantPopulation, SoilFertility, Water)", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_4": { description: "Tohum Oranı: FinancialLoss_Under = (TargetYield - ActualYield) * CropPrice", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_5": { description: "Tohum Oranı: FinancialLoss_Over = (ActualSeed - OptimalSeed) * SeedCost", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_6": { description: "Tohum Oranı: ROI_Seed = (OptimalYield * CropPrice - SeedCost) / SeedCost", requiredInputs: [], outputHint: "number" },
  // ── Toplam Çalışan Maliyeti ──
  "user.total_employee_cost_0": { description: "Toplam Çalışan Maliyeti: GrossSalary = BasePay + Bonuses + Overtime", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_1": { description: "Toplam Çalışan Maliyeti: StatutoryCosts = GrossSalary * (SocialSecurity + Unemployment + Taxes)", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_2": { description: "Toplam Çalışan Maliyeti: Benefits = HealthInsurance + Retirement + Meals + Transport", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_3": { description: "Toplam Çalışan Maliyeti: AbsenteeismCost = AbsentHours * FullyBurdenedRate", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_4": { description: "Toplam Çalışan Maliyeti: TurnoverCost = (Recruitment + Training) * TurnoverRate", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_5": { description: "Toplam Çalışan Maliyeti: TotalEmployeeCost = GrossSalary + StatutoryCosts + Benefits + AbsenteeismCost + TurnoverCost", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_6": { description: "Toplam Çalışan Maliyeti: CostPerHour = TotalEmployeeCost / ProductiveHours", requiredInputs: [], outputHint: "number" },
  // ── Transfer Fiyatlandırması Optimize Edici ──
  "user.transfer_pricing_optimizer_0": { description: "Transfer Fiyatlandırması Optimize Edici: CostPlusPrice = FullCost * (1 + MarkupPct)", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_1": { description: "Transfer Fiyatlandırması Optimize Edici: MarketBasedPrice = ComparableUncontrolledPrice", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_2": { description: "Transfer Fiyatlandırması Optimize Edici: MarginalCost = VariableCost + OpportunityCost", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_3": { description: "Transfer Fiyatlandırması Optimize Edici: TaxImpact = (TransferPrice - ArmLengthPrice) * (TaxRate_High - TaxRate_Low)", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_4": { description: "Transfer Fiyatlandırması Optimize Edici: GlobalProfit = Revenue_Final - (Cost_Origin + Cost_Transfer + TaxImpact)", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_5": { description: "Transfer Fiyatlandırması Optimize Edici: OptimalTransferPrice = Price that MAXIMIZES GlobalProfit subject to TaxRegulations", requiredInputs: [], outputHint: "number" },
  // ── ürün Complexity Hidden Maliyet ──
  "user.product_complexity_hidden_cost_0": { description: "ürün Complexity Hidden Maliyet: ComplexityIndex = NumberOfSKUs * AverageBOMDepth", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_1": { description: "ürün Complexity Hidden Maliyet: SetupCostComplexity = Changeovers * SetupCostPerChange", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_2": { description: "ürün Complexity Hidden Maliyet: InventoryCostComplexity = SafetyStock_AllSKUs * HoldingRate", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_3": { description: "ürün Complexity Hidden Maliyet: OverheadAllocation = TotalIndirectCosts * ComplexityDriverPct", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_4": { description: "ürün Complexity Hidden Maliyet: HiddenCost = SetupCostComplexity + InventoryCostComplexity + (OverheadAllocation - TraditionalOverhead)", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_5": { description: "ürün Complexity Hidden Maliyet: ProfitabilityPerSKU = (Revenue_SKU - DirectCost_SKU - HiddenCost_SKU)", requiredInputs: [], outputHint: "number" },
  // ── Vakum Kaçağı Enerji Kaybı ──
  "user.vacuum_leak_energy_0": { description: "Vakum Kaçağı Enerji Kaybı: LeakRate = Volume * DeltaP / DeltaT", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_1": { description: "Vakum Kaçağı Enerji Kaybı: PowerLoss_kW = (LeakRate * P_Atmospheric) / (PumpEff * 1000)", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_2": { description: "Vakum Kaçağı Enerji Kaybı: AnnualEnergyLoss = PowerLoss_kW * OperatingHours", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_3": { description: "Vakum Kaçağı Enerji Kaybı: CostOfLeak = AnnualEnergyLoss * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_4": { description: "Vakum Kaçağı Enerji Kaybı: PumpCapacityWaste = LeakRate / TotalPumpCapacity", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_5": { description: "Vakum Kaçağı Enerji Kaybı: CarbonEmissions = AnnualEnergyLoss * GridEmissionFactor", requiredInputs: [], outputHint: "number" },
  // ── Vardiya Maliyet Verimliliği ──
  "user.shift_cost_efficiency_0": { description: "Vardiya Maliyet Verimliliği: PlannedProductionTime = ShiftDuration - PlannedDowntime", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_1": { description: "Vardiya Maliyet Verimliliği: ActualRunTime = PlannedProductionTime - UnplannedDowntime", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_2": { description: "Vardiya Maliyet Verimliliği: LaborCost = Operators * ShiftHours * HourlyRate", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_3": { description: "Vardiya Maliyet Verimliliği: EnergyCost = MachinePower * ActualRunTime * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_4": { description: "Vardiya Maliyet Verimliliği: OutputValue = GoodUnits * UnitContributionMargin", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_5": { description: "Vardiya Maliyet Verimliliği: ShiftEfficiency = OutputValue / (LaborCost + EnergyCost + Overhead)", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_6": { description: "Vardiya Maliyet Verimliliği: CostPerUnit = (LaborCost + EnergyCost + Overhead) / GoodUnits", requiredInputs: [], outputHint: "number" },
  // ── Vsm finansal Dönüştürücü ──
  "user.vsm_financial_converter_0": { description: "Vsm finansal Dönüştürücü: LeadTimeCost = WIP_Inventory * DailyCarryingCost * TotalLeadTimeDays", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_1": { description: "Vsm finansal Dönüştürücü: ValueAddedRatio = ValueAddedTime / TotalLeadTime", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_2": { description: "Vsm finansal Dönüştürücü: NonValueAddedCost = (TotalLeadTime - ValueAddedTime) * CostPerMinute", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_3": { description: "Vsm finansal Dönüştürücü: InventoryReductionSavings = (OldWIP - NewWIP) * CarryingRate", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_4": { description: "Vsm finansal Dönüştürücü: ProductivityGain = (OldCycleTime - NewCycleTime) * AnnualVolume * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_5": { description: "Vsm finansal Dönüştürücü: TotalFinancialImpact = InventoryReductionSavings + ProductivityGain + QualityImprovementSavings", requiredInputs: [], outputHint: "number" },
  // ── WPS Preheat Sıcaklık ──
  "user.wps_preheat_temperature_0": { description: "WPS Preheat Sıcaklık: CarbonEquivalent_CE = C + (Mn/6) + ((Cr+Mo+V)/5) + ((Ni+Cu)/15)", requiredInputs: [], outputHint: "number" },
  "user.wps_preheat_temperature_1": { description: "WPS Preheat Sıcaklık: PreheatTemp = f(CE, Thickness, HydrogenLevel, HeatInput)", requiredInputs: [], outputHint: "number" },
  "user.wps_preheat_temperature_2": { description: "WPS Preheat Sıcaklık: CriticalCoolingTime = t_8_5 = (Thickness^2 / HeatInput) * Constant", requiredInputs: [], outputHint: "number" },
  "user.wps_preheat_temperature_3": { description: "WPS Preheat Sıcaklık: HydrogenCrackingRisk = IF(PreheatTemp < RequiredPreheat, 'HIGH', 'LOW')", requiredInputs: [], outputHint: "number" },
  "user.wps_preheat_temperature_4": { description: "WPS Preheat Sıcaklık: EnergyCost = Mass * SpecificHeat * (PreheatTemp - AmbientTemp) / HeaterEfficiency * EnergyPrice", requiredInputs: [], outputHint: "number" },
  // ── Yakıt Rota Sapma ──
  "user.fuel_route_drift_0": { description: "Yakıt Rota Sapma: PlannedFuel = PlannedDistance * FuelEfficiency", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_1": { description: "Yakıt Rota Sapma: ActualFuel = ActualDistance * ActualFuelEfficiency", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_2": { description: "Yakıt Rota Sapma: RouteDrift = ActualDistance - PlannedDistance", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_3": { description: "Yakıt Rota Sapma: FuelWaste_Distance = RouteDrift * FuelEfficiency * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_4": { description: "Yakıt Rota Sapma: FuelWaste_Efficiency = PlannedDistance * (ActualFuelEfficiency - FuelEfficiency) * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_5": { description: "Yakıt Rota Sapma: IdleFuelCost = IdleTime * IdleConsumptionRate * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_6": { description: "Yakıt Rota Sapma: TotalDriftCost = FuelWaste_Distance + FuelWaste_Efficiency + IdleFuelCost", requiredInputs: [], outputHint: "number" },
  // ── Yangın Hidrantı Akış ──
  "user.fire_hydrant_flow_0": { description: "Yangın Hidrantı Akış: FlowRate_Q = 29.83 * c_d * d^2 * SQRT(P_Pitot)", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_1": { description: "Yangın Hidrantı Akış: ResidualPressure = P_Static - (FlowRate_Q / Coefficient)^1.85", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_2": { description: "Yangın Hidrantı Akış: AvailableFlow_At20psi = FlowRate_Q * ((P_Static - 20) / (P_Static - P_Residual))^0.54", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_3": { description: "Yangın Hidrantı Akış: FrictionLoss = f * (Length / Diameter) * (Velocity^2 / 2g)", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_4": { description: "Yangın Hidrantı Akış: RequiredPumpHead = ElevationHead + FrictionLoss + NozzlePressure", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_5": { description: "Yangın Hidrantı Akış: Compliance = IF(AvailableFlow_At20psi > RequiredFlow, 'PASS', 'FAIL')", requiredInputs: [], outputHint: "number" },
  // ── Yenileme Bütçesi Optimize Edici ──
  "user.renovation_budget_optimizer_0": { description: "Yenileme Bütçesi Optimize Edici: BaseCost = Area * CostPerSqM_ByComplexity", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_1": { description: "Yenileme Bütçesi Optimize Edici: Escalation = BaseCost * ((1 + InflationRate)^ProjectDuration - 1)", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_2": { description: "Yenileme Bütçesi Optimize Edici: Contingency = (BaseCost + Escalation) * RiskFactor", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_3": { description: "Yenileme Bütçesi Optimize Edici: SoftCosts = (BaseCost + Escalation) * (DesignFeePct + PermitFeePct)", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_4": { description: "Yenileme Bütçesi Optimize Edici: TotalBudget = BaseCost + Escalation + Contingency + SoftCosts + FF_E", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_5": { description: "Yenileme Bütçesi Optimize Edici: ROI_Renovation = (NewPropertyValue - OldPropertyValue - TotalBudget) / TotalBudget", requiredInputs: [], outputHint: "number" },
  // ── Yenilenebilir Enerji YG ──
  "user.renewable_energy_irr_0": { description: "Yenilenebilir Enerji YG: AnnualGeneration = SystemCapacity * CapacityFactor * 8760", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_1": { description: "Yenilenebilir Enerji YG: AnnualSavings = AnnualGeneration * GridElectricityRate", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_2": { description: "Yenilenebilir Enerji YG: AnnualOPEX = Maintenance + Insurance + InverterReplacementFund", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_3": { description: "Yenilenebilir Enerji YG: NetCashFlow = AnnualSavings - AnnualOPEX + Incentives", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_4": { description: "Yenilenebilir Enerji YG: PaybackPeriod = TotalCapex / NetCashFlow", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_5": { description: "Yenilenebilir Enerji YG: LCOE = (TotalCapex + SUM(OPEX_t / (1+r)^t)) / SUM(Generation_t / (1+r)^t)", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_6": { description: "Yenilenebilir Enerji YG: NPV = SUM(NetCashFlow_t / (1+WACC)^t) - TotalCapex", requiredInputs: [], outputHint: "number" },
  // ── YG ve NBD ──
  "user.roi_npv_0": { description: "YG ve NBD: ROI = (TotalNetProfit / TotalInvestment) * 100", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_1": { description: "YG ve NBD: NPV = SUM(CashFlow_t / (1 + DiscountRate)^t) - InitialInvestment", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_2": { description: "YG ve NBD: IRR = Rate where NPV = 0", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_3": { description: "YG ve NBD: PaybackPeriod = Year before full recovery + (UnrecoveredCost / CashFlow_RecoveryYear)", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_4": { description: "YG ve NBD: ProfitabilityIndex = PV_FutureCashFlows / InitialInvestment", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_5": { description: "YG ve NBD: DiscountedPayback = Year where CumulativeDiscountedCashFlow > 0", requiredInputs: [], outputHint: "number" },
  // ── Zaman Etüdü Analizörü ──
  "user.standard_time_work_study_0": { description: "Zaman Etüdü Analizörü: ObservedTime = SUM(CycleTimes) / NumberOfCycles", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_1": { description: "Zaman Etüdü Analizörü: NormalTime = ObservedTime * PerformanceRating", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_2": { description: "Zaman Etüdü Analizörü: AllowancePct = Personal + Fatigue + Delay", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_3": { description: "Zaman Etüdü Analizörü: StandardTime = NormalTime * (1 + AllowancePct)", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_4": { description: "Zaman Etüdü Analizörü: StandardOutput = ShiftDuration / StandardTime", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_5": { description: "Zaman Etüdü Analizörü: LaborCostPerUnit = StandardTime * HourlyRate", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_6": { description: "Zaman Etüdü Analizörü: EfficiencyVariance = (StandardTime - ActualTime) * ActualProduction * HourlyRate", requiredInputs: [], outputHint: "number" },
  // ── #163 COMPRESSOR POWER ──
  "industrial.compressor_power_0": { description: "Compressor: izentropik güç = (n/(n-1)) * Q/60 * P1 * 10^5 * ((P2/P1)^((n-1)/(n*z)) - 1) / (η_is * 1000)", requiredInputs: [], outputHint: "number" },
  "industrial.compressor_power_1": { description: "Compressor: şaft gücü = izWork / η_m", requiredInputs: [], outputHint: "number" },
  "industrial.compressor_power_2": { description: "Compressor: motor gücü = shaftPower / η_el", requiredInputs: [], outputHint: "number" },
  "industrial.compressor_power_3": { description: "Compressor: özgül güç = totalPower / Q", requiredInputs: [], outputHint: "number" },
  "industrial.compressor_power_4": { description: "Compressor: çıkış sıcaklığı = T1 + (T2 - T1) / η_is", requiredInputs: [], outputHint: "number" },
  "industrial.compressor_power_5": { description: "Compressor: yıllık enerji = P * h", requiredInputs: [], outputHint: "number" },
  "industrial.compressor_power_6": { description: "Compressor: yıllık maliyet = kWh * rate", requiredInputs: [], outputHint: "number" },
  // ── #164 CUTTING PARAMETERS ──
  "industrial.cutting_power_0": { description: "Cutting: devir hızı n = 1000 * Vc / (π * Dc)", requiredInputs: [], outputHint: "number" },
  "industrial.cutting_power_1": { description: "Cutting: ilerleme hızı Vf = fz * z * n", requiredInputs: [], outputHint: "number" },
  "industrial.cutting_power_2": { description: "Cutting: kesme kuvveti Fc = kc * ap * fz * (ae/Dc) * z", requiredInputs: [], outputHint: "number" },
  "industrial.cutting_power_3": { description: "Cutting: tork Tc = Fc * Dc / 2000", requiredInputs: [], outputHint: "number" },
  "industrial.cutting_power_4": { description: "Cutting: kesme gücü Pc = Fc * Vc / 60000", requiredInputs: [], outputHint: "number" },
  "industrial.cutting_power_5": { description: "Cutting: motor gücü = Pc / η", requiredInputs: [], outputHint: "number" },
  "industrial.cutting_power_6": { description: "Cutting: MRR = ap * ae * Vf / 1000", requiredInputs: [], outputHint: "number" },
  "industrial.cutting_power_7": { description: "Cutting: Ra yüzey pürüzlülüğü = fz² / (8 * re) * 1000", requiredInputs: [], outputHint: "number" },
  // ── #165 EVAPORATIVE COOLING ──
  "industrial.evap_cooling_0": { description: "Evaporative: hacim = L * W * H", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_1": { description: "Evaporative: toplam debi = hacim * ACH", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_2": { description: "Evaporative: çıkış sıcaklığı = Tk - η * (Tk - Ty)", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_3": { description: "Evaporative: delta T = Tk - çıkış", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_4": { description: "Evaporative: cihaz sayısı = ceil(debi / tekDebi)", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_5": { description: "Evaporative: toplam güç FES = cihazSayisi * cihazGucu", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_6": { description: "Evaporative: yıllık enerji FES = toplamGuc * gun * saat", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_7": { description: "Evaporative: yıllık enerji konv = konvGuc * gun * saat", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_8": { description: "Evaporative: enerji tasarrufu kWh = konv - FES", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_9": { description: "Evaporative: enerji tasarrufu % = tasarruf / konv * 100", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_10": { description: "Evaporative: yıllık elk maliyeti FES = kWh * rate", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_11": { description: "Evaporative: yıllık su maliyeti = cihaz * su * saat * gun * tarife", requiredInputs: [], outputHint: "number" },
  "industrial.evap_cooling_12": { description: "Evaporative: toplam tasarruf = konvElk - fesElk - su", requiredInputs: [], outputHint: "number" },
  // ── #166 CONDENSER PRECOOLING ──
  "industrial.condenser_precool_0": { description: "Condenser: kapasite kW = chillerKapasitesi * (3.517 if ton)", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_1": { description: "Condenser: kondenser yeni sıcaklık = T_giris - η * (T_giris - T_yas)", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_2": { description: "Condenser: yeni COP = mevcutCOP * (1 + deltaT * 0.03)", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_3": { description: "Condenser: güç mevcut = kapasite / mevcutCOP", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_4": { description: "Condenser: güç yeni = kapasite / COP_yeni", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_5": { description: "Condenser: güç tasarrufu = gucMevcut - gucYeni", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_6": { description: "Condenser: yıllık tasarruf kWh = gucTasarrufu * calismaSaati", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_7": { description: "Condenser: yıllık tasarruf USD = kWh * rate", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_8": { description: "Condenser: net tasarruf = yillikTasarruf - isletmeMaliyeti", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_9": { description: "Condenser: geri ödeme (ay) = sistemMaliyeti / netTasarruf * 12", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_10": { description: "Condenser: ROI = netTasarruf / sistemMaliyeti * 100", requiredInputs: [], outputHint: "number" },
  "industrial.condenser_precool_11": { description: "Condenser: CO2 azaltma = yillikTasarruf_kWh * 0.00042", requiredInputs: [], outputHint: "number" },
  // ── #167 PAD MEDIA PSYCHROMETRIC ──
  "industrial.pad_media_0": { description: "Pad Media: verim η_sat = f(kalınlık, hava hızı)", requiredInputs: [], outputHint: "number" },
  "industrial.pad_media_1": { description: "Pad Media: çıkış kuru sıcaklık = Tk - η * (Tk - Ty)", requiredInputs: [], outputHint: "number" },
  "industrial.pad_media_2": { description: "Pad Media: delta T = giris - cikis", requiredInputs: [], outputHint: "number" },
  "industrial.pad_media_3": { description: "Pad Media: çıkış bağıl nem = girisRH + (100 - girisRH) * η * 0.8", requiredInputs: [], outputHint: "number" },
  "industrial.pad_media_4": { description: "Pad Media: hava debisi m³/h = V * A * 3600", requiredInputs: [], outputHint: "number" },
  "industrial.pad_media_5": { description: "Pad Media: soğutma kapasitesi kW = debi * 1.2 * deltaT / 3600", requiredInputs: [], outputHint: "number" },
  "industrial.pad_media_6": { description: "Pad Media: su tüketimi L/h = kapasite * 1.5", requiredInputs: [], outputHint: "number" },
  "industrial.pad_media_7": { description: "Pad Media: basınç düşüşü Pa = 15 * t/100 * (V/2)^1.5", requiredInputs: [], outputHint: "number" },
  // ── #168 F-GAS ──
  "industrial.fgas_0": { description: "F-Gas: toplam sarj = gazMiktari * cihazSayisi", requiredInputs: [], outputHint: "number" },
  "industrial.fgas_1": { description: "F-Gas: tCO2e per device = sarj * GWP / 1000", requiredInputs: [], outputHint: "number" },
  "industrial.fgas_2": { description: "F-Gas: tCO2e toplam = perDevice * cihazSayisi", requiredInputs: [], outputHint: "number" },
  "industrial.fgas_3": { description: "F-Gas: sızıntı testi yükümlülüğü (ay) = f(sarj miktarı)", requiredInputs: [], outputHint: "number" },
  "industrial.fgas_4": { description: "F-Gas: yıllık test maliyeti = frekans * cihaz / 12 * birimÜcret", requiredInputs: [], outputHint: "number" },
  "industrial.fgas_5": { description: "F-Gas: yıllık kaçak kg = toplamSarj * kaçakOranı / 100", requiredInputs: [], outputHint: "number" },
  "industrial.fgas_6": { description: "F-Gas: kaçak maliyeti = kaçak_kg * birimFiyat", requiredInputs: [], outputHint: "number" },
  "industrial.fgas_7": { description: "F-Gas: kaçak emisyon tCO2e = kaçak_kg * GWP / 1000", requiredInputs: [], outputHint: "number" },
  "industrial.fgas_8": { description: "F-Gas: toplam maliyet = testMaliyeti + kaçakMaliyeti", requiredInputs: [], outputHint: "number" },
  // ── #169 WATER FOOTPRINT ──
  "industrial.water_footprint_0": { description: "Water: toplam = mavi + yeşil + gri", requiredInputs: [], outputHint: "number" },
  "industrial.water_footprint_1": { description: "Water: birim ayak izi = toplam / üretim", requiredInputs: [], outputHint: "number" },
  "industrial.water_footprint_2": { description: "Water: mavi oranı % = mavi / toplam * 100", requiredInputs: [], outputHint: "number" },
  "industrial.water_footprint_3": { description: "Water: yeşil oranı % = yeşil / toplam * 100", requiredInputs: [], outputHint: "number" },
  "industrial.water_footprint_4": { description: "Water: gri oranı % = gri / toplam * 100", requiredInputs: [], outputHint: "number" },
  "industrial.water_footprint_5": { description: "Water: benchmark farkı = birimAyakIzi - benchmark", requiredInputs: [], outputHint: "number" },
  "industrial.water_footprint_6": { description: "Water: iyileştirme potansiyeli = fark * üretim", requiredInputs: [], outputHint: "number" },
  // ── #170 SMOKE EXHAUST ──
  "industrial.smoke_exhaust_0": { description: "Smoke: yangın çevresi = sqrt(A) * 4", requiredInputs: [], outputHint: "number" },
  "industrial.smoke_exhaust_1": { description: "Smoke: duman kütle debisi = 0.076 * P^1.5 * d^0.5", requiredInputs: [], outputHint: "number" },
  "industrial.smoke_exhaust_2": { description: "Smoke: gerekli havalandırma alanı = m / (Cd * sqrt(2*ρ*g*d)) * 10000", requiredInputs: [], outputHint: "number" },
  "industrial.smoke_exhaust_3": { description: "Smoke: etkin alan oranı = A_vent / A_tavan * 100", requiredInputs: [], outputHint: "number" },
  "industrial.smoke_exhaust_4": { description: "Smoke: kapak sayısı = ceil(A_vent / 1)", requiredInputs: [], outputHint: "number" },
  // ── #171 NATURAL VENTILATION ──
  "industrial.nat_vent_0": { description: "Nat Vent: hacim = L * W * H", requiredInputs: [], outputHint: "number" },
  "industrial.nat_vent_1": { description: "Nat Vent: gerekli debi m³/s = hacim * ACH / 3600", requiredInputs: [], outputHint: "number" },
  "industrial.nat_vent_2": { description: "Nat Vent: deltaT = Ti - To", requiredInputs: [], outputHint: "number" },
  "industrial.nat_vent_3": { description: "Nat Vent: gerekli menfez alanı = Q / (Cd * sqrt(2*g*dH*|dT|/Ti))", requiredInputs: [], outputHint: "number" },
  "industrial.nat_vent_4": { description: "Nat Vent: alt menfez alanı = toplam * 0.5", requiredInputs: [], outputHint: "number" },
  "industrial.nat_vent_5": { description: "Nat Vent: üst menfez alanı = toplam * 0.5", requiredInputs: [], outputHint: "number" },
  "industrial.nat_vent_6": { description: "Nat Vent: havalandırma debisi m³/h = Q_m3s * 3600", requiredInputs: [], outputHint: "number" },
  // ── #172 COMPOUND INTEREST ──
  "industrial.compound_interest_0": { description: "Compound: dönem sayısı = m * n", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_1": { description: "Compound: FV anapara = PV * (1 + r/m)^n", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_2": { description: "Compound: FV katkı = PMT * ((1 + i)^n - 1) / i", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_3": { description: "Compound: FV toplam = FV_anapara + FV_katkı", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_4": { description: "Compound: toplam yatırım = PV + PMT * n_yıl * 12", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_5": { description: "Compound: toplam faiz = FV_toplam - toplamYatırım", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_6": { description: "Compound: vergi sonrası faiz = faiz * (1 - t)", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_7": { description: "Compound: vergi sonrası toplam = yatırım + vergiSonrasıFaiz", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_8": { description: "Compound: reel getiri % = (1+nominal)/(1+enflasyon) - 1", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_9": { description: "Compound: satın alma gücü = FV / (1 + i)^n", requiredInputs: [], outputHint: "number" },
  "industrial.compound_interest_10": { description: "Compound: ikiye katlanma yıl = 72 / r", requiredInputs: [], outputHint: "number" },
  // ── #173 LIVING WAGE ──
  "industrial.living_wage_0": { description: "Living wage: brüt yıllık = brütAylık * 12", requiredInputs: [], outputHint: "number" },
  "industrial.living_wage_1": { description: "Living wage: SGK işveren = brütAylık * oran * 12", requiredInputs: [], outputHint: "number" },
  "industrial.living_wage_2": { description: "Living wage: işsizlik fonu = brütAylık * oran * 12", requiredInputs: [], outputHint: "number" },
  "industrial.living_wage_3": { description: "Living wage: damga vergisi = brütYıllık * oran / 100", requiredInputs: [], outputHint: "number" },
  "industrial.living_wage_4": { description: "Living wage: gelir vergisi yıllık = brütYıllık * dilim / 100", requiredInputs: [], outputHint: "number" },
  "industrial.living_wage_5": { description: "Living wage: kesinti toplamı = SGK + işsizlik + damga + gelirV + fazlaMesai", requiredInputs: [], outputHint: "number" },
  "industrial.living_wage_6": { description: "Living wage: net aylık = brüt + FM - SGKç - İşsizlikç + yemek + yol", requiredInputs: [], outputHint: "number" },
  "industrial.living_wage_7": { description: "Living wage: net yıllık = netAylık * 12", requiredInputs: [], outputHint: "number" },
  "industrial.living_wage_8": { description: "Living wage: işveren toplam maliyet = brütYıllık + SGK + işsizlik", requiredInputs: [], outputHint: "number" },
  "industrial.living_wage_9": { description: "Living wage: çalışana fayda % = netYıllık / işverenMaliyet * 100", requiredInputs: [], outputHint: "number" },
  // ── #174 PANEL RADIATOR ──
  "industrial.panel_radiator_0": { description: "Panel rad: oda hacmi = L * W * H", requiredInputs: [], outputHint: "number" },
  "industrial.panel_radiator_1": { description: "Panel rad: ısı ihtiyacı W = V * dT * U * cam + kişi + aydınlatma + camOranı", requiredInputs: [], outputHint: "number" },
  "industrial.panel_radiator_2": { description: "Panel rad: ısı ihtiyacı kcal/h = W * 0.86", requiredInputs: [], outputHint: "number" },
  "industrial.panel_radiator_3": { description: "Panel rad: panel gücü (75/65) = ihtiyaç * tipFaktörü", requiredInputs: [], outputHint: "number" },
  // ── #175 UNDERFLOOR HEATING ──
  "industrial.underfloor_0": { description: "Underfloor: ısıtma alanı = L * W", requiredInputs: [], outputHint: "number" },
  "industrial.underfloor_1": { description: "Underfloor: ortalama zemin sıcaklığı = (gidiş + dönüş) / 2", requiredInputs: [], outputHint: "number" },
  "industrial.underfloor_2": { description: "Underfloor: ısı akısı W/m² = (Tm - Ti) / R", requiredInputs: [], outputHint: "number" },
  "industrial.underfloor_3": { description: "Underfloor: toplam ısı gücü = akı * alan", requiredInputs: [], outputHint: "number" },
  "industrial.underfloor_4": { description: "Underfloor: boru boyu toplam = alan / aralık * 1.1", requiredInputs: [], outputHint: "number" },
  // ── #176 SOLAR TUBE ──
  "industrial.solar_tube_0": { description: "Solar: günlük sıcak su ihtiyacı = kişi * L/kişi", requiredInputs: [], outputHint: "number" },
  "industrial.solar_tube_1": { description: "Solar: günlük toplam enerji kWh = m * cp * dT", requiredInputs: [], outputHint: "number" },
  "industrial.solar_tube_2": { description: "Solar: kolektör alanı m² = Q * 1000 / (I * η * t)", requiredInputs: [], outputHint: "number" },
  "industrial.solar_tube_3": { description: "Solar: depolama hacmi L = ihtiyaç * saat / 24", requiredInputs: [], outputHint: "number" },
  "industrial.solar_tube_4": { description: "Solar: yardımcı kaynak enerjisi = günlük * 365 * (1-0.7) / η", requiredInputs: [], outputHint: "number" },
  // ── #177 EPQ ──
  "industrial.epq_0": { description: "EPQ: optimum miktar = sqrt(2*D*S / (H*(1-d/p)))", requiredInputs: [], outputHint: "number" },
  "industrial.epq_1": { description: "EPQ: envanter döngüsü gün = EPQ / d", requiredInputs: [], outputHint: "number" },
  "industrial.epq_2": { description: "EPQ: maksimum stok = EPQ * (1 - d/p)", requiredInputs: [], outputHint: "number" },
  "industrial.epq_3": { description: "EPQ: yıllık hazırlık maliyeti = D/EPQ * S", requiredInputs: [], outputHint: "number" },
  "industrial.epq_4": { description: "EPQ: yıllık stok maliyeti = H * Imax / 2", requiredInputs: [], outputHint: "number" },
  // ── #178 KANBAN ──
  "industrial.kanban_0": { description: "Kanban: kart sayısı = ceil(d * LT * (1+k) / q) + 1", requiredInputs: [], outputHint: "number" },
  "industrial.kanban_1": { description: "Kanban: emniyet stoğu = d * LT * k", requiredInputs: [], outputHint: "number" },
  // ── #179 LITTLE'S LAW ──
  "industrial.littles_law_0": { description: "Little: çevrim süresi = WIP / TH", requiredInputs: [], outputHint: "number" },
  "industrial.littles_law_1": { description: "Little: WIP hesaplanan = CT * TH", requiredInputs: [], outputHint: "number" },
  "industrial.littles_law_2": { description: "Little: çıkış hesaplanan = WIP / CT", requiredInputs: [], outputHint: "number" },
  "industrial.littles_law_3": { description: "Little: WIP maliyeti = WIP * birimMaliyet", requiredInputs: [], outputHint: "number" },
  // ── #180 MILK RUN ──
  "industrial.milk_run_0": { description: "Milk run: toplam mesafe = tedarikçi * mesafe * 2 * tur", requiredInputs: [], outputHint: "number" },
  "industrial.milk_run_1": { description: "Milk run: toplam süre dk = mesafe/hız*60 + yük + bekleme", requiredInputs: [], outputHint: "number" },
  "industrial.milk_run_2": { description: "Milk run: sürücü maliyeti = süre/60 * saatÜcret", requiredInputs: [], outputHint: "number" },
  "industrial.milk_run_3": { description: "Milk run: akaryakıt maliyeti = mesafe * kmMaliyet", requiredInputs: [], outputHint: "number" },
  // ── #181 CPM/PERT ──
  "industrial.cpm_pert_0": { description: "CPM: PERT expected time Te = (o + 4m + p) / 6", requiredInputs: [], outputHint: "number" },
  "industrial.cpm_pert_1": { description: "CPM: variance σ² = ((p - o)/6)²", requiredInputs: [], outputHint: "number" },
  "industrial.cpm_pert_2": { description: "CPM: kritik yol süresi = Te * aktiviteSayısı", requiredInputs: [], outputHint: "number" },
  "industrial.cpm_pert_3": { description: "CPM: toplam proje std sapma = sqrt(σ²_toplam)", requiredInputs: [], outputHint: "number" },
  "industrial.cpm_pert_4": { description: "CPM: z-skoru = (hedef - kritik) / sigma", requiredInputs: [], outputHint: "number" },
  // ── #182 QUEUING ──
  "industrial.queuing_0": { description: "Queuing: varış oranı λ = müşteri/saat", requiredInputs: [], outputHint: "number" },
  "industrial.queuing_1": { description: "Queuing: servis oranı μ = 60 / servisDk", requiredInputs: [], outputHint: "number" },
  "industrial.queuing_2": { description: "Queuing: kullanım oranı ρ = λ / μ (M/M/1)", requiredInputs: [], outputHint: "number" },
  "industrial.queuing_3": { description: "Queuing: Lq = ρ² / (1 - ρ) (M/M/1)", requiredInputs: [], outputHint: "number" },
  "industrial.queuing_4": { description: "Queuing: L = ρ / (1 - ρ) (M/M/1)", requiredInputs: [], outputHint: "number" },
  // ── #183 FMEA ──
  "industrial.fmea_0": { description: "FMEA: RPN = S * O * D", requiredInputs: [], outputHint: "number" },
  "industrial.fmea_1": { description: "FMEA: risk düzeyi = f(RPN)", requiredInputs: [], outputHint: "number" },
  "industrial.fmea_2": { description: "FMEA: fayda/maliyet oranı = failureCost / önlemMaliyeti", requiredInputs: [], outputHint: "number" },
  // ── #184 DOE ──
  "industrial.doe_0": { description: "DOE: toplam deney sayısı = base^k * r + merkez + blok", requiredInputs: [], outputHint: "number" },
  // ── #185 RELIABILITY BLOCK ──
  "industrial.reliability_0": { description: "Reliability: sistem MTBF (seri) = MTBF_bileşen / n", requiredInputs: [], outputHint: "number" },
  "industrial.reliability_1": { description: "Reliability: kullanılabilirlik A = MTBF / (MTBF + MTTR) * 100", requiredInputs: [], outputHint: "number" },
  "industrial.reliability_2": { description: "Reliability: R(t) seri = exp(-t/MTBF) * 100", requiredInputs: [], outputHint: "number" },
  "industrial.reliability_3": { description: "Reliability: R(t) paralel = (1 - (1-Ri)^n) * 100", requiredInputs: [], outputHint: "number" },
  // ── #186 NIOSH LIFTING ──
  "industrial.niosh_0": { description: "NIOSH: HM = 25 / H", requiredInputs: [], outputHint: "number" },
  "industrial.niosh_1": { description: "NIOSH: VM = 1 - 0.003 * |V - 75|", requiredInputs: [], outputHint: "number" },
  "industrial.niosh_2": { description: "NIOSH: DM = 0.82 + 4.5 / D", requiredInputs: [], outputHint: "number" },
  "industrial.niosh_3": { description: "NIOSH: FM = f(frekans, süre)", requiredInputs: [], outputHint: "number" },
  "industrial.niosh_4": { description: "NIOSH: RWL = 23 * HM * VM * DM * FM * CM * AM", requiredInputs: [], outputHint: "number" },
  "industrial.niosh_5": { description: "NIOSH: LI = L / RWL", requiredInputs: [], outputHint: "number" },
  // ── #187 REBA ──
  "industrial.reba_0": { description: "REBA: Grup A toplam = gövde + boyun + bacak", requiredInputs: [], outputHint: "number" },
  "industrial.reba_1": { description: "REBA: Grup A yük puanı = f(yük)", requiredInputs: [], outputHint: "number" },
  "industrial.reba_2": { description: "REBA: Grup B toplam = kolÜst + kolAlt + elBileği", requiredInputs: [], outputHint: "number" },
  "industrial.reba_3": { description: "REBA: Grup B kavrama puanı = f(tutmaTipi)", requiredInputs: [], outputHint: "number" },
  "industrial.reba_4": { description: "REBA: nihai skor = tableC(scoreA, scoreB) + aktivitePenaltı", requiredInputs: [], outputHint: "number" },
  // ── #188 RCM ──
  "industrial.rcm_0": { description: "RCM: plansız duruş sıklığı = 365 / MTBF", requiredInputs: [], outputHint: "number" },
  "industrial.rcm_1": { description: "RCM: plansız duruş maliyeti/yıl = sıklık * birimMaliyet", requiredInputs: [], outputHint: "number" },
  "industrial.rcm_2": { description: "RCM: koruyucu bakım maliyeti/yıl = 365/sıklık * birimMaliyet", requiredInputs: [], outputHint: "number" },
  "industrial.rcm_3": { description: "RCM: durumsal bakım maliyeti/yıl = 365/sıklık * birimMaliyet", requiredInputs: [], outputHint: "number" },
  // ── #189 PARETO / RCA ──
  "industrial.pareto_0": { description: "Pareto: kategori sayısı", requiredInputs: [], outputHint: "number" },
  "industrial.pareto_1": { description: "Pareto: total loss = maliyetler_toplam", requiredInputs: [], outputHint: "number" },
  // ── #190 VAP ──
  "industrial.vap_0": { description: "VAP: VAR (VA) % = VA / TCT * 100", requiredInputs: [], outputHint: "number" },
  "industrial.vap_1": { description: "VAP: VAR (NVA) % = NVA / TCT * 100", requiredInputs: [], outputHint: "number" },
  "industrial.vap_2": { description: "VAP: VAR (waste) % = W / TCT * 100", requiredInputs: [], outputHint: "number" },
  "industrial.vap_3": { description: "VAP: VA maliyet = maliyet * VAR_VA / 100", requiredInputs: [], outputHint: "number" },
  // ── #191 KAIZEN EVENT ──
  "industrial.kaizen_0": { description: "Kaizen: toplam event maliyeti = ekip + malzeme + danışman", requiredInputs: [], outputHint: "number" },
  "industrial.kaizen_1": { description: "Kaizen: döngü süresi iyileşme % = (mevcut - yeni) / mevcut * 100", requiredInputs: [], outputHint: "number" },
  "industrial.kaizen_2": { description: "Kaizen: toplam yıllık tasarruf = işçilik + malzeme + enerji", requiredInputs: [], outputHint: "number" },
  "industrial.kaizen_3": { description: "Kaizen: ROI = tasarruf / eventMaliyet * 100", requiredInputs: [], outputHint: "number" },
  // ── #192 VSM ──
  "industrial.vsm_0": { description: "VSM: PCT = VA + bekleme + taşıma + kontrol", requiredInputs: [], outputHint: "number" },
  "industrial.vsm_1": { description: "VSM: PCE % = VA / PCT * 100", requiredInputs: [], outputHint: "number" },
  "industrial.vsm_2": { description: "VSM: takt time = çalışmaSüresi / talep", requiredInputs: [], outputHint: "number" },
  // ── #193 5S AUDIT ──
  "industrial.fives_audit_0": { description: "5S: sort yüzde = sort_puan / max * 100", requiredInputs: [], outputHint: "number" },
  "industrial.fives_audit_1": { description: "5S: setInOrder yüzde = puan / max * 100", requiredInputs: [], outputHint: "number" },
  "industrial.fives_audit_2": { description: "5S: shine yüzde = puan / max * 100", requiredInputs: [], outputHint: "number" },
  "industrial.fives_audit_3": { description: "5S: standardize yüzde = puan / max * 100", requiredInputs: [], outputHint: "number" },
  "industrial.fives_audit_4": { description: "5S: sustain yüzde = puan / max * 100", requiredInputs: [], outputHint: "number" },
  "industrial.fives_audit_5": { description: "5S: toplam puan = sort + setInOrder + shine + standardize + sustain", requiredInputs: [], outputHint: "number" },
  "industrial.fives_audit_6": { description: "5S: genel skor % = toplamPuan / maxPuan * 100", requiredInputs: [], outputHint: "number" },
  "industrial.fives_audit_7": { description: "5S: not harf = f(skor%)", requiredInputs: [], outputHint: "number" },
  "industrial.fives_audit_8": { description: "5S: eğitim maliyeti = çalışan * saat * birimMaliyet", requiredInputs: [], outputHint: "number" },
  // ── TOOLS #183-#193: INDUSTRIAL FORMULAS (FMEA through 5S) ──
  "industrial.fmea_risk": { description: "FMEA: RPN = S \u00d7 O \u00d7 D, average across failure modes", requiredInputs: ["severityS","occurrenceO","detectionD"], outputHint: "number" },
  "industrial.fmea_max": { description: "FMEA: Max Possible RPN (1000)", requiredInputs: [], outputHint: "number" },
  "industrial.fmea_priority": { description: "FMEA: Priority Order", requiredInputs: ["severityS","occurrenceO","detectionD"], outputHint: "number" },
  "industrial.fmea_prevention_cost": { description: "FMEA: Total Prevention Cost", requiredInputs: ["maliyet_onlem", "prosesAdimiSayisi"], outputHint: "number" },
  "industrial.fmea_recommendation": { description: "FMEA: Resolution Recommendation", requiredInputs: ["severityS","occurrenceO","detectionD"], outputHint: "number" },
  "industrial.doe_factorial": { description: "DOE: total runs = 2^k \u00d7 r + center + blocks", requiredInputs: ["factorCount_k","replications","centerPoints","blockCount"], outputHint: "number" },
  "industrial.reliability_block": { description: "RBD: system MTBF = avg MTBF / n for series", requiredInputs: ["avgMTBF","componentCount"], outputHint: "number" },
  "industrial.niosh_lifting": { description: "NIOSH: RWL = LC \u00d7 HM \u00d7 VM \u00d7 DM \u00d7 FM \u00d7 AM \u00d7 CM (LC=23)", requiredInputs: ["loadWeight_kg","horizontal_cm","verticalStart_cm","frequency_liftsPerMin","couplingQuality"], outputHint: "number" },
  "industrial.reba_assessment": { description: "REBA: final score = Table A + Table B + activity score", requiredInputs: ["trunkScore","neckScore","legsScore","upperArmScore","lowerArmScore","wristScore"], outputHint: "number" },
  "industrial.rcm_decision": { description: "RCM: annual maintenance cost = reactive + planned + CBM", requiredInputs: ["MTBF_days","repairCost","pmCost","cbmCost","downtimeCost"], outputHint: "number" },
  "industrial.pareto_rca": { description: "Pareto: 80/20 vital few identification", requiredInputs: ["categoryCount","totalSum","costListText","thresholdPercent"], outputHint: "number" },
  "industrial.vap_ratio": { description: "VAP: VA ratio = VA/TCT \u00d7 100", requiredInputs: ["vaTime_min","totalCycleTime_min"], outputHint: "number" },
  "industrial.kaizen_event": { description: "Kaizen: total event investment cost", requiredInputs: ["teamCount","eventDays","hourlyCost","materialCost","consultantCost"], outputHint: "number" },
  "industrial.vsm_metrics": { description: "VSM: PCE = VA / Total Lead Time \u00d7 100", requiredInputs: ["vaTime_min","waitTime_min","transportTime_min","inspectionTime_min"], outputHint: "number" },
  "industrial.ss_audit": { description: "5S: overall score = total score / max total \u00d7 100", requiredInputs: ["sortScore","sortMax","seitonScore","seitonMax","seisoScore","seisoMax","seiketsuScore","seiketsuMax","shitsukeScore","shitsukeMax"], outputHint: "number" },
  // ── #163-182: NEW INDUSTRIAL FORMULAS ──
  "industrial.compressor_power": { description: "Compressor: combined power & air flow calculation", requiredInputs: ["airFlowRate","operatingPressure","inletTemperature","inletPressure","polytropicExponent","isentropicEfficiency","mechanicalEfficiency","motorEfficiency","stageCount","annualOperatingHours","electricityTariff"], outputHint: "number" },
  "industrial.cutting_power": { description: "Cutting: combined machining power calculation", requiredInputs: ["workpieceMaterial","toolDiameter","toothCount","cuttingSpeed","feedPerTooth","depthOfCut","cuttingWidth","specificCuttingForce","materialExponent","machineEfficiency"], outputHint: "number" },
  "industrial.evaporative_cooling": { description: "Evaporative Cooling: capacity & savings", requiredInputs: ["areaLength","areaWidth","ceilingHeight","achValue","outdoorDryBulb","outdoorWetBulb","padEfficiency","unitAirflow","unitPower","conventionalPower","unitWaterConsumption","electricityTariff","waterTariff","dailyOperatingHours","annualOperatingDays"], outputHint: "number" },
  "industrial.condenser_precooling": { description: "Condenser Precooling: energy savings & ROI", requiredInputs: ["chillerCapacity","capacityUnit","existingCOP","condenserInletTemp","wetBulbTemp","precoolEfficiency","annualOperatingHours","electricityTariff","precoolSystemCost","precoolOpex"], outputHint: "number" },
  "industrial.pad_media_psychrometric": { description: "Pad Media: psychrometric cooling capacity", requiredInputs: ["padType","padThickness","faceVelocity","padArea","inletDryBulb","inletWetBulb","inletRH","barometricPressure"], outputHint: "number" },
  "industrial.fgas_leak": { description: "F-Gas Leak: compliance cost & emissions", requiredInputs: ["refrigerantType","gwpValue","refrigerantCharge","unitCount","annualLeakRate","leakTestFrequency","testUnitCost","refrigerantUnitPrice"], outputHint: "number" },
  "industrial.water_footprint": { description: "Water Footprint: total & per-unit consumption", requiredInputs: ["blueWaterConsumption","greenWaterConsumption","greyWaterVolume","productionVolume","sectorBenchmark"], outputHint: "number" },
  "industrial.smoke_exhaust_shev": { description: "Smoke Exhaust SHEV: natural vent area required", requiredInputs: ["buildingType","ceilingArea","zoneLength","zoneWidth","ceilingHeight","smokeLayerDepth","fireArea","inletArea","ventFlowCoefficient","windSpeed"], outputHint: "number" },
  "industrial.natural_ventilation": { description: "Natural Ventilation: ACH-based vent area", requiredInputs: ["areaLength","areaWidth","ceilingHeight","indoorTemperature","outdoorTemperature","targetACH","ventDischargeCoefficient","stackHeight"], outputHint: "number" },
  "industrial.compound_interest": { description: "Compound Interest: future value with contributions", requiredInputs: ["currency","initialPrincipal","monthlyContribution","annualRate","compoundingFrequency","investmentPeriod","inflationRate","taxRate"], outputHint: "number" },
  "industrial.living_wage": { description: "Living Wage: net pay calculation after deductions", requiredInputs: ["calisanSayisi","brUcret_Aylik","fazlaMesaiSaat_Aylik","fazlaMesaiKatsayisi","SGK_isverenOrani","issizlikFonuOrani","damgaVergiOrani","gelirVergiDilimi","AGI_tutari","yemekYardimi_Gunluk","yolYardimi_Gunluk","calismaGunu_Ay"], outputHint: "number" },
  "industrial.panel_radiator": { description: "Panel Radiator: heating capacity & sizing", requiredInputs: ["odaUzunlugu","odaGenisligi","odaYuksekligi","hedefSicaklik_Ti","disSicaklik_To","izolasyonSeviyesi","camTipi","camAlani_Orani","kisiSayisi","aydinlatmaW_m2","panelTipi","isletimSicakligi","kazanVerimi_η"], outputHint: "number" },
  "industrial.underfloor_heating": { description: "Underfloor Heating: thermal output & pump sizing", requiredInputs: ["alanUzunlugu","alanGenisligi","odaSicakligi_Ti","serpantinAraligi_cm","zeminTipi","isletimSicakligi_gidis","donusSicakligi","boruDisCap_mm","b\u00f6lgeDebisi_Lmin","pompVerimi_η"], outputHint: "number" },
  "industrial.solar_collector": { description: "Solar Collector: collector area & savings", requiredInputs: ["kullaniciSayisi","gunlukKullanim_su_L_kisi","sogukSuSicakligi_Tc","sicakSuHedef_Tg","kolektorVerimi_η_kol","guneslenmeSuresi_saat","gunesIsinimiGunluk_Wm2"], outputHint: "number" },
  "industrial.epq": { description: "EPQ: economic production quantity", requiredInputs: ["yillikTalep_D","hazirlikMaliyeti_S","birimStokTutmaMaliyeti_H","gunlukUretimHizi_p","gunlukTalepHizi_d","calismaGunu_yil"], outputHint: "number" },
  "industrial.kanban": { description: "Kanban: required card count", requiredInputs: ["gunlukTalep_d","tedarikSuresi_LT","guvenlikStoguFaktoru_k","kutuKapasitesi_q"], outputHint: "number" },
  "industrial.littles_law": { description: "Little's Law: cycle time / WIP / throughput", requiredInputs: ["prosesTipi","wip_miktar","cikisHizi","cevrimSuresi_CT"], outputHint: "number" },
  "industrial.milk_run": { description: "Milk Run: daily route cost", requiredInputs: ["tedarikciSayisi","tedarikciMesafe_ortalama","turSayisi_gunluk","arabaMaliyeti_km","surucuSaatUcreti","yuklemeBosaltmaDk","beklemeSuresiDk","ortalamaHiz_kmh"], outputHint: "number" },
  // ── HYDRAULIC CYLINDER TONNAGE & POWER ──
  "industrial.hydraulic_cylinder_tonnage_0": { description: "Hydraulic Cylinder Tonnage: push force (ton-f) = (P × A_push × η_m × (1-f)) / 9806.65", requiredInputs: ["pistonDiameter_D","rodDiameter_d","systemPressure_P","cylinderCount_n","volumetricEfficiency_η_v","mechanicalEfficiency_η_m","frictionLossCoeff"], outputHint: "number" },
  "industrial.fmea_failure_cost": { description: "FMEA Failure Cost: cost estimation for failures", requiredInputs: ["maliyet_failure", "prosesAdimiSayisi", "ortalamaOlusma_O"], outputHint: "number" },
  "industrial.fmea_max": { description: "Dummy FMEA", requiredInputs: [], outputHint: "number" },
  "industrial.fmea_recommendation": { description: "Dummy FMEA", requiredInputs: [], outputHint: "number" },
  "industrial.fmea_priority": { description: "Dummy FMEA", requiredInputs: [], outputHint: "number" },
  "industrial.fmea_prevention_cost": { description: "Dummy FMEA", requiredInputs: [], outputHint: "number" },
};