import { describe, it, expect } from "vitest";
import { BLOCKED_SOURCE_REQUIRED_TOOLS, BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS, LIVE_ENGINE_READY_TOOLS } from "../../src/sectorcalc/formulas/pro-v531/baris-readiness-data";
import { isBarisToolLiveExecutable } from "../../src/sectorcalc/formulas/pro-v531/baris-formula-registry";

const BLOCKED_TOOLS = [...BLOCKED_SOURCE_REQUIRED_TOOLS, ...BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS];

describe("pro-v531-baris: assisted sale lock", () => {
  it("should have 25 blocked tools", () => expect(BLOCKED_TOOLS.length).toBe(25));
  it("should have 20 live tools (Batches 1-3)", () => expect(LIVE_ENGINE_READY_TOOLS.length).toBe(20));
  it("20+25=45", () => expect(LIVE_ENGINE_READY_TOOLS.length + BLOCKED_TOOLS.length).toBe(45));
  it("each blocked tool should NOT be live-executable", () => {
    for (const t of BLOCKED_TOOLS) expect(isBarisToolLiveExecutable(t.tool_key)).toBe(false);
  });
  it("each live tool should be live-executable", () => {
    for (const t of LIVE_ENGINE_READY_TOOLS) expect(isBarisToolLiveExecutable(t.tool_key)).toBe(true);
  });
  it("no overlap between live and blocked", () => {
    const lk = new Set(LIVE_ENGINE_READY_TOOLS.map(t => t.tool_key));
    for (const t of BLOCKED_TOOLS) expect(lk.has(t.tool_key)).toBe(false);
  });
});
