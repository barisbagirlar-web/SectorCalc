import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { LIVE_ENGINE_READY_TOOLS, BLOCKED_SOURCE_REQUIRED_TOOLS, BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS, ALL_BARIS_TOOLS, barisClassificationSummary } from "../../src/sectorcalc/formulas/pro-v531/baris-readiness-data";

const MANIFEST_PATH = path.resolve(__dirname, "../../pro_tools_baris_/manifest.json");

describe("pro-v531-baris: readiness classification (fail-closed)", () => {
  it("should cover all 45 manifest tool keys", () => {
    const manifest: {schemas: Array<{tool_key: string}>} = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    const manifestKeys = new Set(manifest.schemas.map(s => s.tool_key));
    const classifiedKeys = new Set(ALL_BARIS_TOOLS.map(t => t.tool_key));
    expect(classifiedKeys.size).toBe(45);
    for (const key of manifestKeys) {
      expect(classifiedKeys.has(key)).toBe(true);
    }
  });

  it("should have no duplicate tool keys across categories", () => {
    const allKeys = ALL_BARIS_TOOLS.map(t => t.tool_key);
    const uniqueKeys = new Set(allKeys);
    expect(uniqueKeys.size).toBe(allKeys.length);
  });

  it("should have LIVE_ENGINE_READY = 0 (fail-closed quarantine)", () => {
    expect(LIVE_ENGINE_READY_TOOLS.length).toBe(0);
  });

  it("should have BLOCKED_SOURCE_REQUIRED = 15", () => {
    expect(BLOCKED_SOURCE_REQUIRED_TOOLS.length).toBe(15);
  });

  it("should have BLOCKED_RUNTIME_CONTRACT_MISMATCH = 30", () => {
    expect(BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS.length).toBe(30);
  });

  it("all 45 tools should be classified (0 + 15 + 30 = 45)", () => {
    const summary = barisClassificationSummary();
    expect(summary.total).toBe(45);
    expect(summary.live + summary.blockedSource + summary.blockedContract).toBe(45);
  });

  it("all BLOCKED tools should exist in the schemas directory", () => {
    const schemasDir = path.resolve(__dirname, "../../src/sectorcalc/schemas/pro-v531");
    const files = fs.readdirSync(schemasDir);
    for (const tool of ALL_BARIS_TOOLS) {
      expect(files).toContain(`${tool.tool_key}.schema.json`);
    }
  });

  it("no LIVE tool should have a .formula.ts file (since LIVE=0)", () => {
    const formulaDir = path.resolve(__dirname, "../../src/sectorcalc/formulas/pro-v531");
    for (const tool of LIVE_ENGINE_READY_TOOLS) {
      const formulaFile = path.join(formulaDir, `${tool.tool_key}.formula.ts`);
      expect(fs.existsSync(formulaFile)).toBe(false);
    }
  });
});
