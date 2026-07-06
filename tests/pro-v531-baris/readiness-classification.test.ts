import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { LIVE_ENGINE_READY_TOOLS, BLOCKED_SOURCE_REQUIRED_TOOLS, BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS, ALL_BARIS_TOOLS } from "../../src/sectorcalc/formulas/pro-v531/baris-readiness-data";

const MANIFEST_PATH = path.resolve(__dirname, "../../pro_tools_baris_/manifest.json");

describe("pro-v531-baris: readiness classification", () => {
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

  it("should have consistent classification counts", () => {
    const live = LIVE_ENGINE_READY_TOOLS.length;
    const sourceBlocked = BLOCKED_SOURCE_REQUIRED_TOOLS.length;
    const contractBlocked = BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS.length;
    expect(live + sourceBlocked + contractBlocked).toBe(45);
  });

  it("LIVE_ENGINE_READY tools should exist in the schemas directory", () => {
    const schemasDir = path.resolve(__dirname, "../../src/sectorcalc/schemas/pro-v531");
    const files = fs.readdirSync(schemasDir);
    for (const tool of LIVE_ENGINE_READY_TOOLS) {
      expect(files).toContain(`${tool.tool_key}.schema.json`);
    }
  });

  it("BLOCKED_SOURCE_REQUIRED tools should also exist in the schemas directory", () => {
    const schemasDir = path.resolve(__dirname, "../../src/sectorcalc/schemas/pro-v531");
    const files = fs.readdirSync(schemasDir);
    for (const tool of BLOCKED_SOURCE_REQUIRED_TOOLS) {
      expect(files).toContain(`${tool.tool_key}.schema.json`);
    }
  });

  it("should have at least 10 LIVE_ENGINE_READY tools", () => {
    expect(LIVE_ENGINE_READY_TOOLS.length).toBeGreaterThanOrEqual(10);
  });

  it("should have at least 5 BLOCKED_SOURCE_REQUIRED tools", () => {
    expect(BLOCKED_SOURCE_REQUIRED_TOOLS.length).toBeGreaterThanOrEqual(5);
  });
});
