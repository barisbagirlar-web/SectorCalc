import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const OEE_LOSS_FORMULA_VERSION = "2.0.0";
export const OEE_LOSS_SCHEMA_VERSION = "5.3.1-pro-oee-loss.1";
export const OEE_LOSS_MODEL_ID = "PRO_OEE_TIME_LOSS_MONETIZATION_V2";
export const OEE_LOSS_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface OeeLossInputs {
  plannedSeconds: string | number;
  operatingSeconds: string | number;
  idealCycleSeconds: string | number;
  totalParts: string | number;
  goodParts: string | number;
  hourlyContribution: string | number;
  improvementCost: string | number;
  sourceConfidenceRatio: string | number;
}

export interface OeeLossResult {
  availability: Decimal;
  performance: Decimal;
  quality: Decimal;
  oee: Decimal;
  netOperatingSeconds: Decimal;
  valuableOperatingSeconds: Decimal;
  availabilityLoss: Decimal;
  performanceLoss: Decimal;
  qualityLoss: Decimal;
  totalOeeLoss: Decimal;
  sourceConfidenceRatio: Decimal;
  uncertaintyAmount: Decimal;
  lossLowerBound: Decimal;
  lossUpperBound: Decimal;
  primaryLossDriver: 0 | 1 | 2;
  decisionState: 0 | 1 | 2;
}

export function evaluateOeeLoss(inputs: OeeLossInputs): DomainResult<OeeLossResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "NON_NEGATIVE_INTEGER" | "RATIO") => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if ((kind === "POSITIVE" || kind === "POSITIVE_INTEGER") && parsed.value.lte("0")) {
      return err<Decimal>({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    }
    if ((kind === "NON_NEGATIVE" || kind === "NON_NEGATIVE_INTEGER") && parsed.value.lt("0")) {
      return err<Decimal>({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if ((kind === "POSITIVE_INTEGER" || kind === "NON_NEGATIVE_INTEGER") && !parsed.value.round(0, 0).eq(parsed.value)) {
      return err<Decimal>({ code: "DOMAIN_VIOLATION", field, message: `${field} must be an integer count.` });
    }
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err<Decimal>({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    return parsed;
  };

  const planned = read(inputs.plannedSeconds, "planned_seconds", "POSITIVE");
  if (!planned.ok) return planned;
  const operating = read(inputs.operatingSeconds, "operating_seconds", "POSITIVE");
  if (!operating.ok) return operating;
  if (operating.value.gt(planned.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "operating_seconds", message: "Operating time cannot exceed planned production time." });
  }
  const idealCycle = read(inputs.idealCycleSeconds, "ideal_cycle_seconds", "POSITIVE");
  if (!idealCycle.ok) return idealCycle;
  const total = read(inputs.totalParts, "total_parts", "POSITIVE_INTEGER");
  if (!total.ok) return total;
  const good = read(inputs.goodParts, "good_parts", "NON_NEGATIVE_INTEGER");
  if (!good.ok) return good;
  if (good.value.gt(total.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "good_parts", message: "Good-part count cannot exceed total-part count." });
  }
  const contribution = read(inputs.hourlyContribution, "hourly_contribution", "NON_NEGATIVE");
  if (!contribution.ok) return contribution;
  const improvementCost = read(inputs.improvementCost, "improvement_cost", "NON_NEGATIVE");
  if (!improvementCost.ok) return improvementCost;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const netOperatingSeconds = idealCycle.value.times(total.value);
  if (netOperatingSeconds.gt(operating.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "ideal_cycle_seconds", message: "Ideal cycle time multiplied by total count cannot exceed operating time; implied performance would exceed 1." });
  }
  const valuableOperatingSeconds = idealCycle.value.times(good.value);
  const availability = operating.value.div(planned.value);
  const performance = netOperatingSeconds.div(operating.value);
  const quality = good.value.div(total.value);
  // Use the algebraically reduced identity so intermediate Decimal division
  // rounding cannot accumulate across the three OEE factors.
  const oee = valuableOperatingSeconds.div(planned.value);
  const availabilityLossSeconds = planned.value.minus(operating.value);
  const performanceLossSeconds = operating.value.minus(netOperatingSeconds);
  const qualityLossSeconds = netOperatingSeconds.minus(valuableOperatingSeconds);
  const totalLossSeconds = planned.value.minus(valuableOperatingSeconds);
  const toMoney = (seconds: Decimal) => seconds.times(contribution.value).div("3600");
  const availabilityLoss = toMoney(availabilityLossSeconds);
  const performanceLoss = toMoney(performanceLossSeconds);
  const qualityLoss = toMoney(qualityLossSeconds);
  const totalOeeLoss = toMoney(totalLossSeconds);
  const uncertaintyAmount = totalOeeLoss.times(confidence.value.minus("1").abs());
  const lossLowerBound = totalOeeLoss.minus(uncertaintyAmount);
  const lossUpperBound = totalOeeLoss.plus(uncertaintyAmount);

  let primaryLossDriver: 0 | 1 | 2 = 0;
  if (performanceLoss.gt(availabilityLoss) && performanceLoss.gte(qualityLoss)) primaryLossDriver = 1;
  if (qualityLoss.gt(availabilityLoss) && qualityLoss.gt(performanceLoss)) primaryLossDriver = 2;
  const decisionState = lossLowerBound.gte(improvementCost.value)
    ? 0
    : lossUpperBound.gte(improvementCost.value) ? 1 : 2;

  return ok({ availability, performance, quality, oee, netOperatingSeconds, valuableOperatingSeconds,
    availabilityLoss, performanceLoss, qualityLoss, totalOeeLoss,
    sourceConfidenceRatio: confidence.value, uncertaintyAmount, lossLowerBound, lossUpperBound,
    primaryLossDriver, decisionState });
}
