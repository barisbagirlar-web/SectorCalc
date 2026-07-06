import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  LIVE_ENGINE_READY_TOOLS, BLOCKED_SOURCE_REQUIRED_TOOLS,
  BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS, ALL_BARIS_TOOLS, barisClassificationSummary
} from "../../src/sectorcalc/formulas/pro-v531/baris-readiness-data";

const MANIFEST_PATH = path.resolve(__dirname, "../../pro_tools_baris_/manifest.json");

describe("pro-v531-baris: readiness classification (Batches 1+2 LIVE)", () => {
  it("should cover all 45 manifest tool keys", () => {
    const manifest: {schemas: Array<{tool_key: string}>} = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    const manifestKeys = new Set(manifest.schemas.map(s => s.tool_key));
    const classifiedKeys = new Set(ALL_BARIS_TOOLS.map(t => t.tool_key));
    expect(classifiedKeys.size).toBe(45);
    for (const key of manifestKeys) expect(classifiedKeys.has(key)).toBe(true);
  });
  it("should have no duplicate tool keys", () => {
    const allKeys = ALL_BARIS_TOOLS.map(t => t.tool_key);
    expect(new Set(allKeys).size).toBe(allKeys.length);
  });
  it("should have LIVE_ENGINE_READY = 20 (Batches 1+2 activated)", () => expect(LIVE_ENGINE_READY_TOOLS.length).toBe(20));
  it("should have BLOCKED_SOURCE_REQUIRED = 15", () => expect(BLOCKED_SOURCE_REQUIRED_TOOLS.length).toBe(15));
  it("should have BLOCKED_RUNTIME_CONTRACT_MISMATCH = 10", () => expect(BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS.length).toBe(10));
  it("all 45 tools classified (20+15+10=45)", () => {
    const s = barisClassificationSummary();
    expect(s.total).toBe(45);
    expect(s.live + s.blockedSource + s.blockedContract).toBe(45);
  });
  it("each LIVE tool should have a .formula.ts file", () => {
    const fd = path.resolve(__dirname, "../../src/sectorcalc/formulas/pro-v531");
    for (const tool of LIVE_ENGINE_READY_TOOLS) {
      const fp = path.join(fd, `${tool.tool_key}.formula.ts`);
      expect(fs.existsSync(fp)).toBe(true);
      expect(fs.readFileSync(fp, "utf-8")).toContain("server-only");
    }
  });
  it("each LIVE tool should have a golden fixture", () => {
    const gd = path.resolve(__dirname, "../golden/pro-v531-baris");
    for (const tool of LIVE_ENGINE_READY_TOOLS) {
      expect(fs.existsSync(path.join(gd, `${tool.tool_key}.golden.json`))).toBe(true);
    }
  });
  it("BLOCKED tools should not have individual .formula.ts files", () => {
    const fd = path.resolve(__dirname, "../../src/sectorcalc/formulas/pro-v531");
    for (const tool of [...BLOCKED_SOURCE_REQUIRED_TOOLS, ...BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS]) {
      expect(fs.existsSync(path.join(fd, `${tool.tool_key}.formula.ts`))).toBe(false);
    }
  });
});
