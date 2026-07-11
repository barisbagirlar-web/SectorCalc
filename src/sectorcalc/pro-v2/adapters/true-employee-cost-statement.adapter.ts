// SectorCalc PRO V2 — True Employee Cost Statement Adapter

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

export const employeeCostBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState: Record<string, { value: string; unit: string }>,
) => {
  function n(key: string): number {
    const v = fieldState[key];
    if (!v) return 0;
    const parsed = parseFloat(v.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const raw_inputs: Record<string, number> = {
    annual_base_salary: n("annual_base_salary"),
    payroll_tax_rate: n("payroll_tax_rate"),
    health_insurance_annual: n("health_insurance_annual"),
    pension_contribution_rate: n("pension_contribution_rate"),
    bonus_target_rate: n("bonus_target_rate"),
    paid_leave_weeks: n("paid_leave_weeks"),
    training_budget_annual: n("training_budget_annual"),
    equipment_it_annual: n("equipment_it_annual"),
    workspace_facility_annual: n("workspace_facility_annual"),
    recruitment_allocation_rate: n("recruitment_allocation_rate"),
    other_benefits_annual: n("other_benefits_annual"),
    productive_hours_per_year: n("productive_hours_per_year"),
  };

  const selected_units: Record<string, string> = {};
  for (const key of Object.keys(fieldState)) {
    selected_units[key] = fieldState[key].unit;
  }

  return { raw_inputs, selected_units };
};
