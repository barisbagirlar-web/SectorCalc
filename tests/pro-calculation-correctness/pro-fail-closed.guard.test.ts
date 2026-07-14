import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const FORMULA_DIR = join(ROOT, "src/sectorcalc/formulas/pro-v531");

describe("Pro calculation fail-closed guards", () => {
  it("never converts a non-finite rounded result into zero", () => {
    const formulaFiles = readdirSync(FORMULA_DIR)
      .filter((file) => file.endsWith(".formula.ts"))
      .filter((file) => file !== "compressed-air-leak-cost-calculator.formula.ts");

    expect(formulaFiles.length).toBe(20);
    for (const file of formulaFiles) {
      const source = readFileSync(join(FORMULA_DIR, file), "utf8");
      expect(source).not.toMatch(/if\s*\(!isFiniteNumber\(v\)\)\s*return\s+0/);
    }
  });

  it("blocks invalid formula output and records the executed version", () => {
    const route = readFileSync(
      join(ROOT, "src/app/api/pro-calculator/execute/route.ts"),
      "utf8",
    );

    expect(route).toContain("FORMULA_NON_FINITE_OUTPUT");
    expect(route).toContain("FORMULA_OUTPUT_NOT_IN_SCHEMA");
    expect(route).toContain("FORMULA_OUTPUT_KEY_MISMATCH");
    expect(route).toContain("FORMULA_DECIMAL_AUDIT_MISMATCH");
    expect(route).toContain("FORMULA_VERIFICATION_REQUIRED");
    expect(route).toContain("DERATING_ENGINE_UNVERIFIED");
    expect(route).toContain("exactOutputMap");
    expect(route).toContain("formulaVersion: pass2Result.formulaVersion");
    expect(route).not.toContain('formulaVersion: "stub"');
    expect(route).not.toContain("schema-fallback-unverified");
    expect(route).not.toContain("getFreeToolSchema(");
    expect(route).not.toContain("minimalSchema");
    expect(route).not.toContain("schema derived from formula registry");
    expect(route).not.toMatch(/Number\(o\.value\)\s*\|\|\s*0/);
    expect(route).not.toContain("session decrement failure should not block");
  });

  it("keeps the optional interval kernel server-only and fail-closed", () => {
    const proxy = readFileSync(
      join(ROOT, "src/app/api/math-kernel/calculate/route.ts"),
      "utf8",
    );
    const rules = readFileSync(join(ROOT, "firestore.rules"), "utf8");

    expect(proxy).toContain("MATH_KERNEL_PROXY_ENABLED");
    expect(proxy).toContain("KERNEL_AUTH_SECRET");
    expect(proxy).not.toContain("Falling back to client-side estimation");
    expect(rules).toMatch(
      /match \/calculations\/\{calcId\}[\s\S]*?allow read, write: if false;/,
    );
  });

  it("keeps the central Free route on certified Decimal or interval execution only", () => {
    const route = readFileSync(join(ROOT, "src/app/api/tool-execute/route.ts"), "utf8");
    expect(route).toContain("executeCertifiedFreeCalculation");
    expect(route).toContain("executeCertifiedFreeIntervalCalculation");
    expect(route).toContain("isCertifiedIntervalFreeTool");
    expect(route).toContain("FORMULA_DOMAIN_REJECTED");
    expect(route).toContain("UPSTREAM_PROTOCOL_ERROR");
    expect(route).toMatch(/Authorization:\s*request\.headers\.get\("authorization"\)/);
    expect(route).not.toMatch(/internalResponse\.json\(\)\.catch/);
    expect(route).not.toMatch(/buildUniversalResult[\s\S]{0,300}catch\s*\{/);
    expect(route).not.toContain("freeV531FormulaRegistry");
    expect(route).not.toContain("directFree");
    expect(route).not.toContain("ran with empty defaults");
    expect(route).not.toContain('formulaVersion: "stub"');
  });
});
