import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  RECEIVABLES_COST_FORMULA_VERSION,
  RECEIVABLES_COST_MODEL_ID,
  RECEIVABLES_COST_SCHEMA_VERSION,
  evaluateReceivablesCost,
} from "@/sectorcalc/formulas/pro-v531/receivables-cost-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function close(a: Big, b: Big): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-45");
}

function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateReceivablesCost({
    invoicePrincipal: "10000", standardPaymentDays: "30", proposedPaymentDays: "90",
    annualFinancingRate: "0.12", incrementalCreditLossRatio: "0.005",
    administrationCostPerInvoice: "25", quotedTermUpliftPerInvoice: "300",
    annualInvoiceCount: "120", sourceConfidenceRatio: "0.9",
    uncertaintyCoverageMultiplier: "2", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("receivables payment-term Decimal properties", () => {
  it("proves ACT/365 financing, addendum, invoice, and annual exposure identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 1_000_000_000 }), fc.integer({ min: 0, max: 999 }),
      fc.integer({ min: 0, max: 3620 }), fc.integer({ min: 1, max: 1_000_000 }),
      (principalCents, rateBp, extraDays, invoices) => {
        const principal = Decimal(String(principalCents)).div("100");
        const rate = Decimal(String(rateBp)).div("1000");
        const result = evaluate({
          invoicePrincipal: principal.toString(), annualFinancingRate: rate.toString(),
          proposedPaymentDays: String(30 + extraDays), annualInvoiceCount: String(invoices),
        });
        const expectedFinancing = principal.times(rate).times(String(extraDays)).div("365");
        expect(result.financingCostPerInvoice.eq(expectedFinancing)).toBe(true);
        expect(result.requiredAddendumPerInvoice.eq(result.financingCostPerInvoice.plus(result.creditLossAllowancePerInvoice).plus(result.administrationCostPerInvoice))).toBe(true);
        expect(result.adjustedInvoiceAmount.eq(principal.plus(result.requiredAddendumPerInvoice))).toBe(true);
        expect(close(result.requiredAddendumRatio.times(principal), result.requiredAddendumPerInvoice)).toBe(true);
        expect(result.annualRequiredAddendum.eq(result.requiredAddendumPerInvoice.times(String(invoices)))).toBe(true);
      },
    ), { numRuns: 500, seed: 535_001 });
  });

  it("is homogeneous in all monetary inputs while preserving ratios and decisions", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        invoicePrincipal: Decimal("10000").times(scale).toString(),
        administrationCostPerInvoice: Decimal("25").times(scale).toString(),
        quotedTermUpliftPerInvoice: Decimal("300").times(scale).toString(),
      });
      expect(close(scaled.requiredAddendumPerInvoice, base.requiredAddendumPerInvoice.times(scale))).toBe(true);
      expect(close(scaled.addendumUpperBoundPerInvoice, base.addendumUpperBoundPerInvoice.times(scale))).toBe(true);
      expect(close(scaled.annualMoneyAtRisk, base.annualMoneyAtRisk.times(scale))).toBe(true);
      expect(scaled.requiredAddendumRatio.eq(base.requiredAddendumRatio)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 535_002 });
  });

  it("increases financing cost monotonically with extension days and annual rate", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 3619 }), fc.integer({ min: 0, max: 999 }), (days, rateBp) => {
      const rate = Decimal(String(rateBp)).div("1000");
      const lowDays = evaluate({ proposedPaymentDays: String(30 + days) });
      const highDays = evaluate({ proposedPaymentDays: String(31 + days) });
      expect(highDays.financingCostPerInvoice.gt(lowDays.financingCostPerInvoice)).toBe(true);
      const lowRate = evaluate({ annualFinancingRate: rate.toString() });
      const highRate = evaluate({ annualFinancingRate: rate.plus("0.001").toString() });
      expect(highRate.financingCostPerInvoice.gt(lowRate.financingCostPerInvoice)).toBe(true);
      expect(highRate.requiredAddendumPerInvoice.gt(lowRate.requiredAddendumPerInvoice)).toBe(true);
    }), { numRuns: 500, seed: 535_003 });
  });

  it("encloses required addendum and narrows monotonically with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.addendumLowerBoundPerInvoice.gte("0")).toBe(true);
      expect(low.addendumLowerBoundPerInvoice.lte(low.requiredAddendumPerInvoice)).toBe(true);
      expect(low.addendumUpperBoundPerInvoice.gte(low.requiredAddendumPerInvoice)).toBe(true);
      expect(high.addendumUncertaintyPerInvoice.lte(low.addendumUncertaintyPerInvoice)).toBe(true);
      expect(high.addendumLowerBoundPerInvoice.gte(low.addendumLowerBoundPerInvoice)).toBe(true);
      expect(high.addendumUpperBoundPerInvoice.lte(low.addendumUpperBoundPerInvoice)).toBe(true);
    }), { numRuns: 500, seed: 535_004 });
  });

  it("fails closed for invalid principal, reversed/fractional terms, ratios, counts, NaN, and infinity", () => {
    const base = {
      invoicePrincipal: "10000", standardPaymentDays: "30", proposedPaymentDays: "90",
      annualFinancingRate: "0.12", incrementalCreditLossRatio: "0.005",
      administrationCostPerInvoice: "25", quotedTermUpliftPerInvoice: "300",
      annualInvoiceCount: "120", sourceConfidenceRatio: "0.9", uncertaintyCoverageMultiplier: "2",
    };
    expect(evaluateReceivablesCost({ ...base, invoicePrincipal: "0" }).ok).toBe(false);
    expect(evaluateReceivablesCost({ ...base, proposedPaymentDays: "29" }).ok).toBe(false);
    expect(evaluateReceivablesCost({ ...base, proposedPaymentDays: "90.5" }).ok).toBe(false);
    expect(evaluateReceivablesCost({ ...base, annualFinancingRate: "1.1" }).ok).toBe(false);
    expect(evaluateReceivablesCost({ ...base, annualInvoiceCount: "0" }).ok).toBe(false);
    expect(evaluateReceivablesCost({ ...base, annualInvoiceCount: "1.5" }).ok).toBe(false);
    expect(evaluateReceivablesCost({ ...base, quotedTermUpliftPerInvoice: "-1" }).ok).toBe(false);
    expect(evaluateReceivablesCost({ ...base, administrationCostPerInvoice: Number.NaN }).ok).toBe(false);
    expect(evaluateReceivablesCost({ ...base, invoicePrincipal: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds explicit commercial terms, reduced form, semantic units, and exact audit outputs", () => {
    const schema = resolveApprovedToolSchema("receivables-cost-payment-term-addendum");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(RECEIVABLES_COST_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(RECEIVABLES_COST_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(RECEIVABLES_COST_MODEL_ID);
    expect(schema.schema.calculation_basis.day_count_convention).toBe("ACT_365_FIXED");
    expect(schema.schema.inputs.some((input) => input.id === "batch_quantity")).toBe(false);
    expect(schema.schema.inputs.some((input) => input.id === "overhead_rate")).toBe(false);
    expect(schema.schema.inputs.find((input) => input.id === "setup_time")).toMatchObject({ type: "integer", base_unit: "day" });
    expect(schema.schema.inputs.find((input) => input.id === "defect_or_loss_cost")).toMatchObject({ name: "Incremental Credit-Loss Ratio", base_unit: "ratio" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
