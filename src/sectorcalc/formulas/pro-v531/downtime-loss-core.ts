import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const DOWNTIME_LOSS_FORMULA_VERSION = "2.0.0";
export const DOWNTIME_LOSS_SCHEMA_VERSION = "5.3.1-pro-downtime-loss.1";
export const DOWNTIME_LOSS_MODEL_ID = "PRO_DOWNTIME_SCRAP_REWORK_LOSS_V2";
export const DOWNTIME_LOSS_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface DowntimeLossInputs {
  productiveSeconds: string | number;
  actualSeconds: string | number;
  hourlyRate: string | number;
  scrapQuantity: string | number;
  unitCost: string | number;
  reworkSeconds: string | number;
  reworkRate: string | number;
  materialCost: string | number;
  defectRateRatio: string | number;
  sourceConfidenceRatio: string | number;
}

export interface DowntimeLossResult {
  downtimeHours: Decimal;
  downtimeCost: Decimal;
  scrapCost: Decimal;
  reworkCost: Decimal;
  totalLoss: Decimal;
  lossToMaterialCostRatio: Decimal;
  uptimeRatio: Decimal;
  defectRateRatio: Decimal;
  sourceConfidenceRatio: Decimal;
  uncertaintyAmount: Decimal;
  lossLowerBound: Decimal;
  lossUpperBound: Decimal;
  primaryLossDriver: 0 | 1 | 2;
  decisionState: 0 | 1 | 2;
}

type Constraint = "NON_NEGATIVE" | "POSITIVE" | "RATIO" | "NON_NEGATIVE_INTEGER";

export function evaluateDowntimeLoss(
  inputs: DowntimeLossInputs,
): DomainResult<DowntimeLossResult> {
  const context = createDecimalContext();
  const read = (
    value: string | number,
    field: string,
    constraint: Constraint,
  ): DomainResult<Decimal> => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if (constraint === "POSITIVE" && parsed.value.lte("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    }
    if ((constraint === "NON_NEGATIVE" || constraint === "NON_NEGATIVE_INTEGER") && parsed.value.lt("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if (constraint === "NON_NEGATIVE_INTEGER" && !parsed.value.round(0, 0).eq(parsed.value)) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be an integer count.` });
    }
    if (constraint === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    return parsed;
  };

  const productive = read(inputs.productiveSeconds, "productive_seconds", "POSITIVE");
  if (!productive.ok) return productive;
  const actual = read(inputs.actualSeconds, "actual_seconds", "NON_NEGATIVE");
  if (!actual.ok) return actual;
  if (actual.value.gt(productive.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "actual_seconds", message: "Actual productive time cannot exceed planned productive time." });
  }
  const hourlyRate = read(inputs.hourlyRate, "hourly_rate", "NON_NEGATIVE");
  if (!hourlyRate.ok) return hourlyRate;
  const scrapQuantity = read(inputs.scrapQuantity, "scrap_quantity", "NON_NEGATIVE_INTEGER");
  if (!scrapQuantity.ok) return scrapQuantity;
  const unitCost = read(inputs.unitCost, "unit_cost", "NON_NEGATIVE");
  if (!unitCost.ok) return unitCost;
  const rework = read(inputs.reworkSeconds, "rework_seconds", "NON_NEGATIVE");
  if (!rework.ok) return rework;
  const reworkRate = read(inputs.reworkRate, "rework_rate", "NON_NEGATIVE");
  if (!reworkRate.ok) return reworkRate;
  const materialCost = read(inputs.materialCost, "material_cost", "POSITIVE");
  if (!materialCost.ok) return materialCost;
  const defectRate = read(inputs.defectRateRatio, "defect_rate_ratio", "RATIO");
  if (!defectRate.ok) return defectRate;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const downtimeHours = productive.value.minus(actual.value).div("3600");
  const downtimeCost = downtimeHours.times(hourlyRate.value);
  const scrapCost = scrapQuantity.value.times(unitCost.value);
  const reworkCost = rework.value.div("3600").times(reworkRate.value);
  const totalLoss = downtimeCost.plus(scrapCost).plus(reworkCost);
  const lossToMaterialCostRatio = totalLoss.div(materialCost.value);
  const uptimeRatio = actual.value.div(productive.value);
  const uncertaintyAmount = totalLoss.times(confidence.value.minus("1").abs());
  const lossLowerBound = totalLoss.minus(uncertaintyAmount);
  const lossUpperBound = totalLoss.plus(uncertaintyAmount);

  let primaryLossDriver: 0 | 1 | 2 = 0;
  if (scrapCost.gt(downtimeCost) && scrapCost.gte(reworkCost)) primaryLossDriver = 1;
  if (reworkCost.gt(downtimeCost) && reworkCost.gt(scrapCost)) primaryLossDriver = 2;

  const hold = lossToMaterialCostRatio.gt("0.10") || defectRate.value.gt("0.10") || confidence.value.lt("0.50");
  const review = lossToMaterialCostRatio.gt("0.05") || defectRate.value.gt("0.05") || confidence.value.lt("0.80");

  return ok({
    downtimeHours,
    downtimeCost,
    scrapCost,
    reworkCost,
    totalLoss,
    lossToMaterialCostRatio,
    uptimeRatio,
    defectRateRatio: defectRate.value,
    sourceConfidenceRatio: confidence.value,
    uncertaintyAmount,
    lossLowerBound,
    lossUpperBound,
    primaryLossDriver,
    decisionState: hold ? 2 : review ? 1 : 0,
  });
}
