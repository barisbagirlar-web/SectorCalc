import { describe, expect, it } from "vitest";

import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const EXPECTED_BASES: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "break-even-survival-cash-calculator": {
    monthly_fixed_cash_cost: "currency_unit_per_month",
    monthly_debt_service: "currency_unit_per_month",
    current_monthly_revenue: "currency_unit_per_month",
    unrestricted_cash_balance: "currency_unit",
    minimum_cash_buffer: "currency_unit",
  },
  "machine-hourly-rate-proof-report": {
    machine_rate: "currency_unit_per_h",
    material_cost: "currency_unit_per_unit",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit_per_h",
    defect_or_loss_cost: "currency_unit_per_unit",
  },
  "loss-making-job-detector": {
    machine_rate: "currency_unit_per_unit",
    material_cost: "currency_unit_per_batch",
    labor_rate: "currency_unit_per_unit",
    overhead_rate: "currency_unit_per_unit",
    defect_or_loss_cost: "currency_unit_per_unit",
  },
  "receivables-cost-payment-term-addendum": {
    machine_rate: "currency_unit_per_invoice",
    overhead_rate: "currency_unit_per_invoice",
    defect_or_loss_cost: "currency_unit_per_invoice",
  },
  "setup-time-reduction-roi-smed": {
    machine_rate: "currency_unit_per_h",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit",
  },
  "product-sku-margin-ranker": {
    machine_rate: "currency_unit_per_unit",
    material_cost: "currency_unit_per_unit",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit_per_year",
    defect_or_loss_cost: "currency_unit_per_year",
  },
  "true-employee-cost-statement": {
    labor_rate: "currency_unit_per_year",
    overhead_rate: "currency_unit_per_year",
  },
  "job-quote-builder-pro-pack": {
    machine_rate: "currency_unit_per_h",
    material_cost: "currency_unit_per_unit",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit_per_h",
    defect_or_loss_cost: "currency_unit_per_unit",
  },
  "machine-investment-feasibility-buy-lease-keep": {
    initial_investment: "currency_unit",
    annual_net_cash_flow: "currency_unit_per_year",
    residual_value: "currency_unit",
    annual_volume: "currency_unit",
    labor_rate: "currency_unit_per_year",
    overhead_rate: "currency_unit",
    defect_or_loss_cost: "currency_unit_per_year",
  },
  "capital-equipment-investment-appraisal-npv-irr": {
    initial_investment: "currency_unit",
    annual_net_cash_flow: "currency_unit_per_year",
    residual_value: "currency_unit",
    defect_or_loss_cost: "currency_unit",
  },
  "customer-sku-profitability-forensics": {
    unit_price: "currency_unit_per_unit",
    unit_variable_cost: "currency_unit_per_unit",
  },
  "downtime-scrap-loss-statement": {
    hourly_rate: "currency_unit_per_h",
    unit_cost: "currency_unit_per_unit",
    rework_rate: "currency_unit_per_h",
    material_cost: "currency_unit",
  },
  "oee-loss-monetization-improvement-business-case": {
    hourly_contribution: "currency_unit_per_h",
    improvement_cost: "currency_unit",
  },
  "scrap-rework-cost-tracker": {
    unit_material_cost: "currency_unit_per_unit",
    unit_labor_cost: "currency_unit_per_unit",
    rework_labor_rate: "currency_unit_per_h",
  },
  "outsource-vs-in-house-analyzer": {
    in_house_material_cost: "currency_unit_per_unit",
    in_house_labor_cost: "currency_unit_per_unit",
    in_house_overhead: "currency_unit_per_unit",
    in_house_setup_cost: "currency_unit",
    outsource_unit_price: "currency_unit_per_unit",
    outsource_logistics_cost: "currency_unit_per_unit",
  },
  "plant-wide-shop-rate-cost-structure-audit": {
    total_annual_cost: "currency_unit_per_year",
    machine_group_cost: "currency_unit_per_year",
    overhead_pool: "currency_unit_per_year",
    current_shop_rate: "currency_unit_per_h",
  },
  "fx-commodity-pass-through-pricer": {
    base_price: "currency_unit_per_unit",
  },
  "energy-efficiency-grant-incentive-feasibility-pack": {
    avg_kwh_rate: "currency_unit_per_kWh",
    implementation_cost: "currency_unit",
    maintenance_cost_saving: "currency_unit_per_year",
  },
  "motor-compressor-replacement-roi": {
    avg_kwh_rate: "currency_unit_per_kWh",
    replacement_cost: "currency_unit",
    installation_cost: "currency_unit",
    maintenance_saving_per_year: "currency_unit_per_year",
  },
  "weld-procedure-cost-consumable-estimation-suite": {
    wire_cost_per_kg: "currency_unit_per_kg",
    gas_cost_per_min: "currency_unit_per_min",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit_per_h",
  },
};

const DISPLAY_ALIAS: Readonly<Record<string, string>> = {
  currency_unit: "Currency",
  currency_unit_per_h: "Currency/h",
  currency_unit_per_unit: "Currency/unit",
  currency_unit_per_batch: "Currency/batch",
  currency_unit_per_invoice: "Currency/invoice",
  currency_unit_per_month: "Currency/month",
  currency_unit_per_year: "Currency/year",
  currency_unit_per_kWh: "Currency/kWh",
  currency_unit_per_kg: "Currency/kg",
  currency_unit_per_min: "Currency/min",
};

describe("all LIVE PRO monetary inputs declare an exact economic basis", () => {
  expect(Object.keys(EXPECTED_BASES)).toHaveLength(20);

  for (const [toolKey, expectedInputs] of Object.entries(EXPECTED_BASES)) {
    it(toolKey, () => {
      const resolved = resolveApprovedToolSchema(toolKey);
      expect(resolved.ok).toBe(true);
      if (!resolved.ok) return;
      const byId = new Map(resolved.schema.inputs.map((input) => [input.id, input]));

      for (const [inputId, expectedBase] of Object.entries(expectedInputs)) {
        const input = byId.get(inputId);
        const expectedAlias = DISPLAY_ALIAS[expectedBase];
        expect(expectedAlias, `${expectedBase} needs a display alias`).toBeDefined();
        expect(input, `${toolKey}:${inputId} is missing`).toBeDefined();
        expect(input?.base_unit, `${toolKey}:${inputId}`).toBe(expectedBase);
        expect(input?.allowed_display_units, `${toolKey}:${inputId}`).toEqual([
          expectedAlias,
        ]);
        expect(input?.unit_selectable, `${toolKey}:${inputId}`).toBe(false);
        expect(
          (input?.ui_binding as { semantic_tag?: string } | undefined)?.semantic_tag,
          `${toolKey}:${inputId}`,
        ).toBe("monetary");

        const registryItem =
          resolved.schema.unit_conversion_contract.conversion_registry[
            input?.quantity_kind ?? ""
          ];
        expect(registryItem, `${toolKey}:${inputId} registry`).toBeDefined();
        expect(
          registryItem?.units.some(
            (entry) => entry.unit === expectedBase && entry.factor === 1,
          ),
          `${toolKey}:${inputId} base identity conversion`,
        ).toBe(true);
        expect(
          registryItem?.units.some(
            (entry) => entry.unit === expectedAlias && entry.factor === 1,
          ),
          `${toolKey}:${inputId} display identity conversion`,
        ).toBe(true);
      }
    });
  }
});
