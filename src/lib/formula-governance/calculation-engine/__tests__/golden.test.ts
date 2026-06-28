/**
 * GOLDEN TESTS — real verification, hand-checked expected values.
 * Source: claude_pro_tasarim_/engine-golden.test.ts (verified engine design)
 *
 * 28 individual assertions across 6 test groups.
 */
import { describe, expect, it } from "vitest";
import type { ToolSchema } from "../types";
import { prepare, compute } from "../engine";
import { AuditService } from "../audit";

function near(a: number, b: number, tol = 1e-3) {
  return Math.abs(a - b) <= tol;
}

const rcBeam: ToolSchema = {
  id: "PRO_117_EC2",
  version: "1.0.0",
  name: "RC Beam EC2 Flexure",
  industry: "Civil",
  riskLevel: "CRITICAL",
  inputs: [
    {
      id: "b_w",
      label: "Web width",
      symbol: "b_w",
      unit: "mm",
      type: "number",
      confidence: "KESIN",
      required: true,
      min: 75,
      uncertainty: { value: 0.02, relative: true, type: "B", distribution: "normal" },
    },
    {
      id: "d",
      label: "Effective depth",
      symbol: "d",
      unit: "mm",
      type: "number",
      confidence: "KESIN",
      required: true,
      min: 50,
      uncertainty: { value: 0.02, relative: true, type: "B", distribution: "normal" },
    },
    {
      id: "A_s",
      label: "Tension steel area",
      symbol: "A_s",
      unit: "mm2",
      type: "number",
      confidence: "KESIN",
      required: true,
      min: 50,
      uncertainty: { value: 0.01, relative: true, type: "B", distribution: "normal" },
    },
    {
      id: "f_ck",
      label: "Concrete strength",
      symbol: "f_ck",
      unit: "MPa",
      type: "number",
      confidence: "KESIN",
      required: true,
      min: 12,
      uncertainty: { value: 0.03, relative: true, type: "B", distribution: "normal" },
    },
    {
      id: "f_yk",
      label: "Steel yield",
      symbol: "f_yk",
      unit: "MPa",
      type: "number",
      confidence: "KESIN",
      required: true,
      defaultValue: 500,
    },
    {
      id: "gamma_c",
      label: "γc",
      symbol: "γ_c",
      unit: "-",
      type: "number",
      confidence: "KESIN",
      required: true,
      defaultValue: 1.5,
    },
    {
      id: "gamma_s",
      label: "γs",
      symbol: "γ_s",
      unit: "-",
      type: "number",
      confidence: "KESIN",
      required: true,
      defaultValue: 1.15,
    },
    {
      id: "alpha_cc",
      label: "αcc",
      symbol: "α_cc",
      unit: "-",
      type: "number",
      confidence: "GUCLU",
      required: true,
      defaultValue: 0.85,
    },
    {
      id: "M_Ed",
      label: "Design moment",
      symbol: "M_Ed",
      unit: "kNm",
      type: "number",
      confidence: "KESIN",
      required: true,
      min: 0,
      uncertainty: { value: 0.02, relative: true, type: "B", distribution: "normal" },
    },
  ],
  // Deliberately scrambled order — engine must topo-sort.
  formulas: [
    { id: "F8", outputVar: "M_Rd", expression: "A_s * f_yd * z / 1e6", unit: "kNm" },
    { id: "F36", outputVar: "UC_M", expression: "M_Ed / M_Rd", unit: "-" },
    {
      id: "F6",
      outputVar: "x",
      expression: "A_s * f_yd / (eta * f_cd * b_w * lambda)",
      unit: "mm",
      domainGuard: {
        condition: "x < d",
        errorMessage: "Over-reinforced: x >= d. Increase section or reduce A_s.",
      },
    },
    { id: "F2", outputVar: "f_cd", expression: "alpha_cc * f_ck / gamma_c", unit: "MPa" },
    { id: "F3", outputVar: "f_yd", expression: "f_yk / gamma_s", unit: "MPa" },
    { id: "F7", outputVar: "z", expression: "min(d - 0.5 * lambda * x, 0.95 * d)", unit: "mm" },
    {
      id: "F4",
      outputVar: "lambda",
      expression: "f_ck <= 50 ? 0.80 : 0.80 - (f_ck - 50) / 400",
      unit: "-",
    },
    {
      id: "F5",
      outputVar: "eta",
      expression: "f_ck <= 50 ? 1.0 : 1.0 - (f_ck - 50) / 200",
      unit: "-",
    },
    { id: "Fk", outputVar: "k_size", expression: "min(1 + sqrt(200 / d), 2.0)", unit: "-" },
    {
      id: "Fv",
      outputVar: "v_min",
      expression: "0.035 * k_size^1.5 * sqrt(f_ck)",
      unit: "MPa",
    },
  ],
  validationRules: [
    { id: "V_d", action: "BLOCK", condition: "d >= 50", message: "d must be >= 50mm" },
  ],
  gum: { measurand: "M_Rd", coverageFactor: 2 },
  auditConfig: { requirePeerReview: true, retentionDays: 3650 },
};

// Shared fixtures for tests 2 & 4
const areaTool: ToolSchema = {
  id: "AREA",
  version: "1",
  name: "Area",
  industry: "x",
  riskLevel: "LOW",
  inputs: [
    { id: "w", label: "w", symbol: "w", unit: "mm", type: "number", confidence: "KESIN", required: true },
    { id: "h", label: "h", symbol: "h", unit: "mm", type: "number", confidence: "KESIN", required: true },
  ],
  formulas: [{ id: "A", outputVar: "area", expression: "w * h", unit: "mm2" }],
  validationRules: [],
  auditConfig: { requirePeerReview: false, retentionDays: 1 },
};

const SCOPE = { b_w: 300, d: 500, A_s: 1500, f_ck: 30, f_yk: 500, gamma_c: 1.5, gamma_s: 1.15, alpha_cc: 0.85, M_Ed: 200 };

describe("golden tests — engine verification", () => {
  describe("TEST 1: RC beam flexure — hand-verified values + topo-sort + functions", () => {
    const prep = prepare(rcBeam);
    const r = compute(prep, SCOPE);

    it("compute ok", () => {
      expect(r.ok).toBe(true);
    });
    it("f_cd = 17.000 MPa", () => {
      expect(near(r.results.f_cd, 17.0)).toBe(true);
    });
    it("f_yd = 434.783 MPa", () => {
      expect(near(r.results.f_yd, 434.78261, 1e-3)).toBe(true);
    });
    it("x = 159.847 mm", () => {
      expect(near(r.results.x, 159.84655, 1e-3)).toBe(true);
    });
    it("z = 436.061 mm", () => {
      expect(near(r.results.z, 436.06138, 1e-3)).toBe(true);
    });
    it("M_Rd ≈ 284.39 kN·m (hand-calc)", () => {
      expect(near(r.results.M_Rd, 284.388, 0.05)).toBe(true);
    });
    it("UC_M ≈ 0.7033", () => {
      expect(near(r.results.UC_M, 0.70327, 1e-3)).toBe(true);
    });
    it("k_size ≈ 1.63246 (sqrt works)", () => {
      expect(near(r.results.k_size, 1.63246, 1e-4)).toBe(true);
    });
    it("v_min ≈ 0.39987 (^ + sqrt work)", () => {
      expect(near(r.results.v_min, 0.39987, 1e-4)).toBe(true);
    });
  });

  describe("TEST 2: Unit conversion (mm vs m) — same physical input, same result", () => {
    it("1000mm×2000mm = 2,000,000 mm²", () => {
      const pa = prepare(areaTool);
      const inMm = compute(pa, { w: 1000, h: 2000 });
      expect(near(inMm.results.area, 2_000_000, 1e-6)).toBe(true);
    });
    it("1m×2m converts to SAME 2,000,000 mm²", () => {
      const areaToolM = { ...areaTool, inputs: areaTool.inputs.map((i: any) => ({ ...i, unit: "m" })) };
      const inM = compute(prepare(areaToolM as ToolSchema), { w: 1, h: 2 });
      expect(near(inM.results.area, 2_000_000, 1e-6)).toBe(true);
    });
  });

  describe("TEST 3: Fail-closed — over-reinforced triggers domain guard, NO results", () => {
    it("ok === false (blocked)", () => {
      const guardSchema: ToolSchema = { ...rcBeam, validationRules: [] };
      const pg = prepare(guardSchema);
      const blocked = compute(pg, { b_w: 100, d: 100, A_s: 5000, f_ck: 20, f_yk: 500, gamma_c: 1.5, gamma_s: 1.15, alpha_cc: 0.85, M_Ed: 50 });
      expect(blocked.ok).toBe(false);
    });
    it("results empty (no silent NaN)", () => {
      const guardSchema: ToolSchema = { ...rcBeam, validationRules: [] };
      const pg = prepare(guardSchema);
      const blocked = compute(pg, { b_w: 100, d: 100, A_s: 5000, f_ck: 20, f_yk: 500, gamma_c: 1.5, gamma_s: 1.15, alpha_cc: 0.85, M_Ed: 50 });
      expect(Object.keys(blocked.results).length).toBe(0);
    });
    it("error is the domain-guard message", () => {
      const guardSchema: ToolSchema = { ...rcBeam, validationRules: [] };
      const pg = prepare(guardSchema);
      const blocked = compute(pg, { b_w: 100, d: 100, A_s: 5000, f_ck: 20, f_yk: 500, gamma_c: 1.5, gamma_s: 1.15, alpha_cc: 0.85, M_Ed: 50 });
      expect(blocked.errors.some((e: any) => /Over-reinforced/.test(e.message))).toBe(true);
    });
  });

  describe("TEST 4: Security — no eval; malicious / invalid expressions rejected", () => {
    const tryReject = (expr: string) => {
      try {
        prepare({ ...areaTool, formulas: [{ id: "X", outputVar: "area", expression: expr, unit: "-" }] } as ToolSchema);
        return false;
      } catch {
        return true;
      }
    };

    it('allows simple assignment "a = 5"', () => {
      expect(tryReject("a = 5")).toBe(false);
    });
    it('rejects disallowed fn "parse(1)"', () => {
      expect(tryReject("parse(1)")).toBe(true);
    });
    it('rejects unknown symbol "evilVar + 1"', () => {
      expect(tryReject("evilVar + 1")).toBe(true);
    });
    it('rejects member access "w.constructor"', () => {
      expect(tryReject("w.constructor")).toBe(true);
    });
    it('accepts legitimate "w * h"', () => {
      expect(tryReject("w * h")).toBe(false);
    });
  });

  describe("TEST 5: GUM uncertainty — finite-diff matches analytic on y = a·b", () => {
    const gumTool: ToolSchema = {
      id: "GUM",
      version: "1",
      name: "gum",
      industry: "x",
      riskLevel: "LOW",
      inputs: [
        { id: "a", label: "a", symbol: "a", unit: "-", type: "number", confidence: "KESIN", required: true, uncertainty: { value: 0.1, type: "B", distribution: "normal" } },
        { id: "b", label: "b", symbol: "b", unit: "-", type: "number", confidence: "KESIN", required: true, uncertainty: { value: 0.2, type: "B", distribution: "normal" } },
      ],
      formulas: [{ id: "Y", outputVar: "y", expression: "a * b", unit: "-" }],
      validationRules: [],
      gum: { measurand: "y", coverageFactor: 2 },
      auditConfig: { requirePeerReview: false, retentionDays: 1 },
    };
    const rg = compute(prepare(gumTool), { a: 10, b: 20 });
    const uc = rg.uncertainty!;

    it("y = 200", () => {
      expect(near(uc.value, 200, 1e-9)).toBe(true);
    });
    it("u_c = 2.828427 (matches analytic)", () => {
      expect(near(uc.u_c, 2.8284271, 1e-5)).toBe(true);
    });
    it("U = 5.656854 (k=2)", () => {
      expect(near(uc.U, 5.6568542, 1e-5)).toBe(true);
    });
    it("each contributes 50% (computed)", () => {
      expect(uc.contributions.every((c: any) => near(c.percent, 50, 1e-3))).toBe(true);
    });
  });

  describe("TEST 6: Audit — real SHA-256, full payload, tamper-evident chain", () => {
    it("hash is 64 hex chars (real SHA-256), record verifies, chain verifies, tampered fails", async () => {
      const audit = new AuditService();
      const rec1 = await audit.release({
        toolId: "PRO_117",
        schemaVersion: "1.0.0",
        inputs: { b_w: 300, d: 500 },
        results: { M_Rd: 284.388 },
      });
      const rec2 = await audit.release({
        toolId: "PRO_117",
        schemaVersion: "1.0.0",
        inputs: { b_w: 300, d: 500 },
        results: { M_Rd: 284.388 },
        prevHash: rec1.recordHash,
      });

      expect(/^[0-9a-f]{64}$/.test(rec1.recordHash)).toBe(true);
      expect(await audit.verify(rec1)).toBe(true);
      expect(await audit.verifyChain([rec1, rec2])).toBe(true);

      const tampered = { ...rec1, results: { M_Rd: 999 } };
      expect(await audit.verify(tampered as any)).toBe(false);
      expect(await audit.verifyChain([rec1, { ...rec2, prevHash: "wrong" }])).toBe(false);
    });
  });
});
