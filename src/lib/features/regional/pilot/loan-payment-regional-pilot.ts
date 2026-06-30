import type { SmartFormContractFieldPlan } from "@/lib/features/formula-governance/runtime-validation/smart-form-contract-adapter";
import { resolveRegionalCalculationContext } from "@/lib/features/regional/regional-engine";
import { resolveSmartFormRegionalMetadata } from "@/lib/features/regional/smart-form-regional-adapter";

export const LOAN_PAYMENT_PILOT_SLUG = "loan-payment-calculator" as const;

export function enrichLoanPaymentRegionalDisplay(plan: SmartFormContractFieldPlan, locale?: string): SmartFormContractFieldPlan {
  if (!locale || plan.slug !== LOAN_PAYMENT_PILOT_SLUG) return plan;
  const context = resolveRegionalCalculationContext({ locale, toolSlug: LOAN_PAYMENT_PILOT_SLUG });
  const fields = plan.fields.map((field) => {
    const regional = resolveSmartFormRegionalMetadata({
      fieldKey: field.key,
      dimension: field.type === "currency" ? "currency" : field.type === "percent" ? "percent" : "value",
      fieldType: (field.type ?? "number") as "number" | "currency" | "percent",
      locale,
      toolSlug: LOAN_PAYMENT_PILOT_SLUG,
    });
    return { ...field, unit: field.type === "currency" ? context.currency : field.unit, displayUnit: field.type === "currency" ? context.currency : field.displayUnit ?? field.unit, unitOptions: regional.unitOptions, quantityType: regional.quantityType, defaultUnit: regional.defaultUnit, selectedUnit: regional.selectedUnit, regionalSource: regional.regionalSource, displayFormat: regional.displayFormat };
  });
  return { ...plan, fields };
}
