import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const QUALITY_LOSS_FORMULA_VERSION = "2.0.0";
export const QUALITY_LOSS_SCHEMA_VERSION = "5.3.1-pro-quality-loss.1";
export const QUALITY_LOSS_MODEL_ID = "PRO_SCRAP_REWORK_QUALITY_LOSS_V2";
export const QUALITY_LOSS_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface QualityLossInputs {
  totalProduced: string | number;
  scrapQuantity: string | number;
  reworkQuantity: string | number;
  unitMaterialCost: string | number;
  unitLaborCost: string | number;
  reworkLaborRate: string | number;
  reworkSecondsPerUnit: string | number;
  defectRateTargetRatio: string | number;
  monthlyVolume: string | number;
  sourceConfidenceRatio: string | number;
}

export interface QualityLossResult {
  scrapCost: Decimal;
  reworkCost: Decimal;
  totalQualityLoss: Decimal;
  totalDefectUnits: Decimal;
  defectRateRatio: Decimal;
  defectRateTargetRatio: Decimal;
  lossPerProducedUnit: Decimal;
  projectedMonthlyQualityLoss: Decimal;
  sourceConfidenceRatio: Decimal;
  uncertaintyAmount: Decimal;
  lossLowerBound: Decimal;
  lossUpperBound: Decimal;
  primaryLossDriver: 0 | 1;
  decisionState: 0 | 1 | 2;
}

export function evaluateQualityLoss(inputs: QualityLossInputs): DomainResult<QualityLossResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: "NON_NEGATIVE" | "POSITIVE_INTEGER" | "NON_NEGATIVE_INTEGER" | "RATIO") => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if (kind === "NON_NEGATIVE" && parsed.value.lt("0")) {
      return err<Decimal>({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if ((kind === "POSITIVE_INTEGER" || kind === "NON_NEGATIVE_INTEGER") && !parsed.value.round(0, 0).eq(parsed.value)) {
      return err<Decimal>({ code: "DOMAIN_VIOLATION", field, message: `${field} must be an integer count.` });
    }
    if (kind === "POSITIVE_INTEGER" && parsed.value.lte("0")) {
      return err<Decimal>({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    }
    if (kind === "NON_NEGATIVE_INTEGER" && parsed.value.lt("0")) {
      return err<Decimal>({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err<Decimal>({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    return parsed;
  };

  const total = read(inputs.totalProduced, "total_produced", "POSITIVE_INTEGER");
  if (!total.ok) return total;
  const scrap = read(inputs.scrapQuantity, "scrap_quantity", "NON_NEGATIVE_INTEGER");
  if (!scrap.ok) return scrap;
  const rework = read(inputs.reworkQuantity, "rework_quantity", "NON_NEGATIVE_INTEGER");
  if (!rework.ok) return rework;
  const totalDefectUnits = scrap.value.plus(rework.value);
  if (totalDefectUnits.gt(total.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "scrap_and_rework_quantity", message: "Scrap plus rework quantity cannot exceed total produced quantity." });
  }
  const material = read(inputs.unitMaterialCost, "unit_material_cost", "NON_NEGATIVE");
  if (!material.ok) return material;
  const labor = read(inputs.unitLaborCost, "unit_labor_cost", "NON_NEGATIVE");
  if (!labor.ok) return labor;
  const rate = read(inputs.reworkLaborRate, "rework_labor_rate", "NON_NEGATIVE");
  if (!rate.ok) return rate;
  const seconds = read(inputs.reworkSecondsPerUnit, "rework_seconds_per_unit", "NON_NEGATIVE");
  if (!seconds.ok) return seconds;
  const target = read(inputs.defectRateTargetRatio, "defect_rate_target_ratio", "RATIO");
  if (!target.ok) return target;
  const monthly = read(inputs.monthlyVolume, "monthly_volume", "NON_NEGATIVE_INTEGER");
  if (!monthly.ok) return monthly;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const scrapCost = scrap.value.times(material.value.plus(labor.value));
  const reworkCost = rework.value.times(rate.value).times(seconds.value).div("3600");
  const totalQualityLoss = scrapCost.plus(reworkCost);
  const defectRateRatio = totalDefectUnits.div(total.value);
  const lossPerProducedUnit = totalQualityLoss.div(total.value);
  const projectedMonthlyQualityLoss = lossPerProducedUnit.times(monthly.value);
  const uncertaintyAmount = projectedMonthlyQualityLoss.times(confidence.value.minus("1").abs());
  const lossLowerBound = projectedMonthlyQualityLoss.minus(uncertaintyAmount);
  const lossUpperBound = projectedMonthlyQualityLoss.plus(uncertaintyAmount);
  const exceedsTarget = defectRateRatio.gt(target.value);
  const severe = target.value.eq("0")
    ? defectRateRatio.gt("0")
    : defectRateRatio.gt(target.value.times("1.5"));
  const hold = severe || confidence.value.lt("0.50");
  const review = exceedsTarget || confidence.value.lt("0.80");

  return ok({
    scrapCost,
    reworkCost,
    totalQualityLoss,
    totalDefectUnits,
    defectRateRatio,
    defectRateTargetRatio: target.value,
    lossPerProducedUnit,
    projectedMonthlyQualityLoss,
    sourceConfidenceRatio: confidence.value,
    uncertaintyAmount,
    lossLowerBound,
    lossUpperBound,
    primaryLossDriver: scrapCost.gte(reworkCost) ? 0 : 1,
    decisionState: hold ? 2 : review ? 1 : 0,
  });
}
