// SectorCalc PRO V5.3.1 — Orphan Formula Audit Test
// Verifies the audit script runs and reports correctly.
import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

describe("Baris Orphan Formula Audit", () => {
  it("audit script should run without errors", () => {
    const auditScript = resolve(__dirname, "../../scripts/audit-pro-v531-orphan-formulas.mjs");
    expect(existsSync(auditScript)).toBe(true);

    // Run the audit script and capture JSON output
    const output = execSync(`node ${auditScript}`, { encoding: "utf-8" });
    const result = JSON.parse(output);

    expect(result).toBeDefined();
    expect(typeof result.total_formula_files).toBe("number");
    expect(typeof result.baris_live).toBe("number");
    expect(typeof result.orphan_unreferenced).toBe("number");
  });

  it("should report baris_live count matching expected", () => {
    const auditScript = resolve(__dirname, "../../scripts/audit-pro-v531-orphan-formulas.mjs");
    const output = execSync(`node ${auditScript}`, { encoding: "utf-8" });
    const result = JSON.parse(output);

    // Baris live should be 30 (Batch 1 + Batch 2)
    expect(result.baris_live).toBe(30);
  });

  it("should report total_formula_files > 20 (includes sc_* files)", () => {
    const auditScript = resolve(__dirname, "../../scripts/audit-pro-v531-orphan-formulas.mjs");
    const output = execSync(`node ${auditScript}`, { encoding: "utf-8" });
    const result = JSON.parse(output);

    expect(result.total_formula_files).toBeGreaterThan(20);
  });
});
