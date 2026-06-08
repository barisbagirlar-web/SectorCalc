/**
 * Smart form contract adapter tests — ADIM 2.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import {
  FULL_LOOP_RUNTIME_SLUGS,
  resolveFullLoopContractSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  buildSmartFormFieldSpecsFromContract,
  buildSmartFormInitialValues,
  getSmartFormEditableFieldKeys,
  validateSmartFormFieldValues,
} from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";

describe("smart form contract adapter", () => {
  test("builds field specs from rent-vs-buy contract", () => {
    const slug = "rent-vs-buy-calculator";
    const plan = buildSmartFormFieldSpecsFromContract(slug);

    expect(plan).not.toBeNull();
    expect(plan?.slug).toBe(slug);
    expect(plan?.contractSlug).toBe(slug);
    expect(plan?.fields.length).toBeGreaterThan(0);
    expect(plan?.fields.every((field) => field.key === field.canonicalKey)).toBe(true);
    expect(plan?.fields.some((field) => field.group === "required")).toBe(true);
    expect(plan?.decisionGoal.length).toBeGreaterThan(0);
  });

  test("resolves premium alias slug to contract slug", () => {
    const slug = "electrical-labor-estimator";
    const plan = buildSmartFormFieldSpecsFromContract(slug);

    expect(plan?.contractSlug).toBe(resolveFullLoopContractSlug(slug));
    expect(plan?.contractSlug).toBe("panel-shop-margin-verdict");
    expect(plan?.fields.length).toBeGreaterThan(0);
  });

  test("includes optional and advanced groups when controlled patch exists", () => {
    const plan = buildSmartFormFieldSpecsFromContract("3d-print-cost-check");

    expect(plan?.fields.some((field) => field.group === "required")).toBe(true);
    expect(plan?.fields.some((field) => field.group === "optional")).toBe(true);
    expect(plan?.fields.some((field) => field.group === "advanced")).toBe(true);
  });

  test("every full_loop_runtime slug resolves to non-empty editable fields", () => {
    for (const slug of FULL_LOOP_RUNTIME_SLUGS) {
      const contractSlug = resolveFullLoopContractSlug(slug);
      const plan = buildSmartFormFieldSpecsFromContract(slug);
      expect(plan, `missing smart form plan for ${slug}`).not.toBeNull();
      expect(plan?.fields.length, `no fields for ${slug}`).toBeGreaterThan(0);
      expect(getSmartFormEditableFieldKeys(slug).length).toBeGreaterThan(0);
      expect(buildSmartFormInitialValues(slug)).toBeTypeOf("object");
      expect(FORMULA_CONTRACTS.some((contract) => contract.slug === contractSlug)).toBe(true);
    }
  });

  test("validateSmartFormFieldValues flags empty required inputs", () => {
    const slug = "profit-margin-calculator";
    const errors = validateSmartFormFieldValues(slug, buildSmartFormInitialValues(slug));

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  test("field specs expose governance metadata shape", () => {
    const field = buildSmartFormFieldSpecsFromContract("welding-bid-risk-analyzer")?.fields[0];

    expect(field).toBeDefined();
    expect(field?.label.length).toBeGreaterThan(0);
    expect(["number", "currency", "percent"]).toContain(field?.type);
    expect(typeof field?.required).toBe("boolean");
    expect(["required", "optional", "advanced"]).toContain(field?.group);
  });
});
