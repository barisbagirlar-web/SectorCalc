import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("Certified formula manifest break-even binding", () => {
  it("binds the Exact Decimal module, schema versions, and property evidence", async () => {
    const formula = await import(
      "../break-even-survival-cash-calculator.formula"
    );
    const {
      getFormulaVerificationRecord,
      verifyFormulaModuleCertification,
    } = await import("../pro-formula-verification-manifest");
    const { resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );

    const resolved = resolveApprovedToolSchema(formula.toolKey);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) throw new Error(resolved.errors.join(" | "));

    const record = getFormulaVerificationRecord(formula.toolKey);
    expect(record).not.toBeNull();
    expect(record).toMatchObject({
      toolKey: formula.toolKey,
      formulaVersion: formula.formulaVersion,
      modelId: formula.modelId,
      arithmeticMode: formula.arithmeticMode,
      schemaContractVersion: resolved.schema.metadata.schema_version,
      propertyEvidenceId: formula.verificationEvidenceId,
      status: "CERTIFIED_FOR_EXECUTION",
    });

    const certification = verifyFormulaModuleCertification(
      formula,
      resolved.schema.metadata.formula_version,
      resolved.schema.metadata.schema_version,
    );
    expect(certification).toEqual({ ok: true, record });
    expect(formula.formulaVersion).toBe("2.0.0");
    expect(formula.arithmeticMode).toBe("DECIMAL_BIGJS_50_HALF_EVEN");
    expect(formula.verificationEvidenceId).toBe(
      "tests/pro-calculation-correctness/cash-survival.property.test.ts",
    );
  });
});
