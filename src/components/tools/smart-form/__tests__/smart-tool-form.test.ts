/**
 * SmartToolForm contract tests — ADIM 2 (no DOM; node vitest environment).
 */

import { describe, expect, test } from "vitest";
import {
  buildSmartFormFieldSpecsFromContract,
  getSmartToolFormFieldCount,
} from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";

describe("SmartToolForm", () => {
  test("field count helper matches contract adapter", () => {
    const slug = "roofing-contract-margin-guard";
    const plan = buildSmartFormFieldSpecsFromContract(slug);

    expect(plan).not.toBeNull();
    expect(getSmartToolFormFieldCount(slug)).toBe(plan?.fields.length);
    expect(getSmartToolFormFieldCount(slug)).toBeGreaterThan(0);
  });

  test("free traffic slug exposes required field group for rendering", () => {
    const slug = "break-even-calculator";
    const plan = buildSmartFormFieldSpecsFromContract(slug);

    expect(plan?.fields.filter((field) => field.group === "required").length).toBeGreaterThan(0);
  });

  test("SmartToolForm module stays off payment/auth paths", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(new URL("../SmartToolForm.tsx", import.meta.url), "utf8"),
    );

    expect(source).not.toContain("stripe");
    expect(source).not.toContain("PremiumPaywall");
    expect(source).not.toContain("usePremiumToolAccess");
    expect(source).toContain("buildSmartFormFieldSpecsFromContract");
    expect(source).toContain("grid-cols-1 sm:grid-cols-2 xl:grid-cols-3");
  });

  test("component files export smart form building blocks", async () => {
    const fs = await import("node:fs/promises");
    const base = new URL("../", import.meta.url);

    const fieldSource = await fs.readFile(new URL("SmartFormField.tsx", base), "utf8");
    const sectionSource = await fs.readFile(new URL("SmartFormSection.tsx", base), "utf8");
    const validationSource = await fs.readFile(new URL("SmartFormValidationSummary.tsx", base), "utf8");
    const trustSource = await fs.readFile(new URL("SmartFormTrustSummary.tsx", base), "utf8");
    const formSource = await fs.readFile(new URL("SmartToolForm.tsx", base), "utf8");

    expect(fieldSource).toContain("export function SmartFormField");
    expect(sectionSource).toContain("export function SmartFormSection");
    expect(validationSource).toContain("export function SmartFormValidationSummary");
    expect(trustSource).toContain("export function SmartFormTrustSummary");
    expect(formSource).toContain("export function SmartToolForm");
  });
});
