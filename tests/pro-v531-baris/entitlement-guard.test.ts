// SectorCalc PRO V5.3.1 — Entitlement Guard Test (Key-Pool Model)
// Verifies entitlement guard blocks correctly for all product types.
import { describe, it, expect, vi } from "vitest";
import { checkBarisExecutionEntitlement, getBarisExecutionBlockReason } from "../../src/sectorcalc/pro-commerce/baris-entitlement-guard";

vi.mock("@/lib/infrastructure/firebase/admin", () => ({
  getAdminFirestore: () => null,
}));

describe("Baris Entitlement Guard", () => {
  // ── ASSISTED DOSSIER PRODUCTS ──

  it("should block assisted dossier products with ASSISTED_DOSSIER_ONLY", () => {
    const result = getBarisExecutionBlockReason("pressure-vessel-wall-thickness-mawp-hydrotest-package");
    expect(result).toBe("ASSISTED_DOSSIER_ONLY");
  });

  it("should block all 15 source-required tools from instant execution", async () => {
    const sourceTools = [
      "pressure-vessel-wall-thickness-mawp-hydrotest-package",
      "pressure-relief-valve-sizing-sheet-api-520",
      "fillet-weld-sizing-verification-sheet-ec3-aws-d11",
      "structural-connection-verification-dossier-ec3-aisc",
      "bolted-connection-verifier",
      "bolt-torque-preload-spec-card-vdi-2230",
      "lifting-rigging-crane-plan-suite",
      "gdt-fit-clearance-calculator-iso-286",
      "tolerance-stack-up-root-cause-report-wc-rss",
      "measurement-uncertainty-budget-gum-iso-17025",
      "first-article-inspection-report-builder-as9102-lite",
      "compressed-air-leak-energy-audit-report-iso-11011",
      "cbam-definitive-period-compliance-package",
      "cbam-cost-exposure-hedging-forecaster",
      "cbam-supplier-emissions-data-sheet",
    ];
    for (const tk of sourceTools) {
      expect(getBarisExecutionBlockReason(tk)).toBe("ASSISTED_DOSSIER_ONLY");
      const entitlement = await checkBarisExecutionEntitlement({ toolKey: tk, userId: "test-user", userEmail: "test@test.com" });
      expect(entitlement.ok).toBe(false);
      expect(entitlement.reason).toBe("ASSISTED_DOSSIER_ONLY");
    }
  });

  it("should block all 10 contract-blocked tools from instant execution", async () => {
    const contractTools = [
      "machining-cycle-time-part-cost-sheet",
      "sealed-job-quote-certificate-fire-setup-vade",
      "steel-structure-weight-cost-takeoff",
      "compressed-air-pipe-sizing-pressure-drop",
      "hydraulic-cylinder-pump-sizing",
      "pump-system-curve-npsh-verifier",
      "shaft-deflection-critical-speed-check",
      "scope-1-2-3-splitter-for-smes",
      "bank-grade-financial-projection-covenant-model",
      "ppap-gauge-rr-cpk-ppk-quality-submission-bundle",
    ];
    for (const tk of contractTools) {
      expect(getBarisExecutionBlockReason(tk)).toBe("ASSISTED_DOSSIER_ONLY");
      const entitlement = await checkBarisExecutionEntitlement({ toolKey: tk, userId: "test-user", userEmail: "test@test.com" });
      expect(entitlement.ok).toBe(false);
      expect(entitlement.reason).toBe("ASSISTED_DOSSIER_ONLY");
    }
  });

  // ── INSTANT CALCULATOR PRODUCTS ──

  it("should allow only certified instant calculators through block reason check", () => {
    expect(
      getBarisExecutionBlockReason(
        "capital-equipment-investment-appraisal-npv-irr",
      ),
    ).toBeNull();
    expect(
      getBarisExecutionBlockReason("break-even-survival-cash-calculator"),
    ).toBeNull();
  });

  it("should require entitlement for instant calculators when user has no userId", async () => {
    const entitlement = await checkBarisExecutionEntitlement({
      toolKey: "capital-equipment-investment-appraisal-npv-irr",
      userId: null,
      userEmail: null,
    });
    expect(entitlement.ok).toBe(false);
    expect(entitlement.reason).toBe("PRO_ENTITLEMENT_REQUIRED");
  });

  it("should require entitlement for instant calculators with no keys (no Firestore doc)", async () => {
    // User has userId but no Firestore doc (or doc without barisProKeys)
    // In test env, Firestore is unavailable, so it returns BLOCKED_PAYMENT_INFRASTRUCTURE_NOT_BOUND
    const entitlement = await checkBarisExecutionEntitlement({
      toolKey: "capital-equipment-investment-appraisal-npv-irr",
      userId: "nonexistent-user-id",
      userEmail: "regular@user.com",
    });
    expect(entitlement.ok).toBe(false);
    // In production with Firestore, this would be PRO_ENTITLEMENT_REQUIRED
    // In test env without Firestore, it's BLOCKED_PAYMENT_INFRASTRUCTURE_NOT_BOUND
    expect(["PRO_ENTITLEMENT_REQUIRED", "BLOCKED_PAYMENT_INFRASTRUCTURE_NOT_BOUND"]).toContain(entitlement.reason);
  });

  it("should allow execution for unknown (non-Baris) tools", () => {
    const result = getBarisExecutionBlockReason("some-free-tool");
    expect(result).toBeNull();
  });

  it("should return PRODUCT_NOT_FOUND for nonexistent tool", async () => {
    const result = await checkBarisExecutionEntitlement({
      toolKey: "clearly-nonexistent-tool-that-does-not-exist-in-registry",
      userId: "test-user",
      userEmail: "test@test.com",
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("PRODUCT_NOT_FOUND");
  });
});
