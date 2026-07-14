import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const EMPLOYEE_COST_FORMULA_VERSION = "2.0.0";
export const EMPLOYEE_COST_SCHEMA_VERSION = "5.3.1-pro-employee-cost.1";
export const EMPLOYEE_COST_MODEL_ID = "PRO_TRUE_EMPLOYEE_PRODUCTIVE_HOUR_COST_V2";
export const EMPLOYEE_COST_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface EmployeeCostInputs {
  baseHourlyWage: string | number;
  annualPaidHours: string | number;
  productiveTimeRatio: string | number;
  employerPayrollTaxRatio: string | number;
  annualBenefitsCost: string | number;
  annualTrainingCost: string | number;
  annualEquipmentItCost: string | number;
  annualWorkspaceFacilityCost: string | number;
  sourceConfidenceRatio: string | number;
}

export interface EmployeeCostResult {
  baseAnnualCompensation: Decimal;
  employerPayrollTaxes: Decimal;
  annualBenefitsCost: Decimal;
  paidNonProductiveHours: Decimal;
  paidNonProductiveCost: Decimal;
  annualTrainingCost: Decimal;
  annualEquipmentItCost: Decimal;
  annualWorkspaceFacilityCost: Decimal;
  fullyLoadedAnnualCost: Decimal;
  monthlyEmployerCost: Decimal;
  productiveHoursAnnual: Decimal;
  productiveHourlyCost: Decimal;
  baseToLoadedMultiplier: Decimal;
  sourceConfidenceRatio: Decimal;
  annualCostUncertainty: Decimal;
  annualCostLowerBound: Decimal;
  annualCostUpperBound: Decimal;
  primaryAdditiveCostDriver: 0 | 1 | 2 | 3 | 4 | 5;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO";

export function evaluateEmployeeCost(
  inputs: EmployeeCostInputs,
): DomainResult<EmployeeCostResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: Kind): DomainResult<Decimal> => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if (kind === "POSITIVE" && parsed.value.lte("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    }
    if (kind === "NON_NEGATIVE" && parsed.value.lt("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if (kind === "POSITIVE_INTEGER" && (parsed.value.lte("0") || !parsed.value.round(0, 0).eq(parsed.value))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer hour count.` });
    }
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    return parsed;
  };

  const wage = read(inputs.baseHourlyWage, "base_hourly_wage", "POSITIVE");
  if (!wage.ok) return wage;
  const paidHours = read(inputs.annualPaidHours, "annual_paid_hours", "POSITIVE_INTEGER");
  if (!paidHours.ok) return paidHours;
  if (paidHours.value.gt("8784")) {
    return err({ code: "DOMAIN_VIOLATION", field: "annual_paid_hours", message: "Annual paid hours for one employee cannot exceed 8,784." });
  }
  const productiveRatio = read(inputs.productiveTimeRatio, "productive_time_ratio", "RATIO");
  if (!productiveRatio.ok) return productiveRatio;
  if (productiveRatio.value.eq("0")) {
    return err({ code: "DOMAIN_VIOLATION", field: "productive_time_ratio", message: "Productive-time ratio must be greater than zero." });
  }
  const taxRatio = read(inputs.employerPayrollTaxRatio, "employer_payroll_tax_ratio", "RATIO");
  if (!taxRatio.ok) return taxRatio;
  const benefits = read(inputs.annualBenefitsCost, "annual_benefits_cost", "NON_NEGATIVE");
  if (!benefits.ok) return benefits;
  const training = read(inputs.annualTrainingCost, "annual_training_cost", "NON_NEGATIVE");
  if (!training.ok) return training;
  const equipment = read(inputs.annualEquipmentItCost, "annual_equipment_it_cost", "NON_NEGATIVE");
  if (!equipment.ok) return equipment;
  const workspace = read(inputs.annualWorkspaceFacilityCost, "annual_workspace_facility_cost", "NON_NEGATIVE");
  if (!workspace.ok) return workspace;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const baseAnnualCompensation = wage.value.times(paidHours.value);
  const employerPayrollTaxes = baseAnnualCompensation.times(taxRatio.value);
  const productiveHoursAnnual = paidHours.value.times(productiveRatio.value);
  const paidNonProductiveHours = paidHours.value.minus(productiveHoursAnnual);
  const paidNonProductiveCost = paidNonProductiveHours.times(wage.value);
  const fullyLoadedAnnualCost = baseAnnualCompensation
    .plus(employerPayrollTaxes)
    .plus(benefits.value)
    .plus(training.value)
    .plus(equipment.value)
    .plus(workspace.value);
  const monthlyEmployerCost = fullyLoadedAnnualCost.div("12");
  const productiveHourlyCost = fullyLoadedAnnualCost.div(productiveHoursAnnual);
  const baseToLoadedMultiplier = fullyLoadedAnnualCost.div(baseAnnualCompensation);
  const annualCostUncertainty = fullyLoadedAnnualCost.times(context.DecimalConstructor("1").minus(confidence.value));
  const annualCostLowerBound = fullyLoadedAnnualCost.minus(annualCostUncertainty);
  const annualCostUpperBound = fullyLoadedAnnualCost.plus(annualCostUncertainty);
  const drivers = [baseAnnualCompensation, employerPayrollTaxes, benefits.value, training.value, equipment.value, workspace.value] as const;
  let primaryAdditiveCostDriver: 0 | 1 | 2 | 3 | 4 | 5 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primaryAdditiveCostDriver])) {
      primaryAdditiveCostDriver = index as 1 | 2 | 3 | 4 | 5;
    }
  }
  const decisionState: 0 | 1 | 2 = confidence.value.gte("0.90")
    ? 0
    : confidence.value.gte("0.75") ? 1 : 2;

  return ok({
    baseAnnualCompensation,
    employerPayrollTaxes,
    annualBenefitsCost: benefits.value,
    paidNonProductiveHours,
    paidNonProductiveCost,
    annualTrainingCost: training.value,
    annualEquipmentItCost: equipment.value,
    annualWorkspaceFacilityCost: workspace.value,
    fullyLoadedAnnualCost,
    monthlyEmployerCost,
    productiveHoursAnnual,
    productiveHourlyCost,
    baseToLoadedMultiplier,
    sourceConfidenceRatio: confidence.value,
    annualCostUncertainty,
    annualCostLowerBound,
    annualCostUpperBound,
    primaryAdditiveCostDriver,
    decisionState,
  });
}
