// Test: Evidence state management

import { describe, it, expect } from "vitest";
import {
  createEmptyEvidenceState,
  toggleEvidence,
  validateEvidenceRequirements,
  verifySource,
} from "../evidence-state";

describe("Evidence state", () => {
  it("creates empty evidence state", () => {
    const state = createEmptyEvidenceState();
    expect(state.toggles).toEqual({});
    expect(state.sourceVerified).toEqual({});
    expect(state.userVerified).toEqual({});
  });

  it("toggleEvidence flips verified state", () => {
    const state = createEmptyEvidenceState();
    const next = toggleEvidence(state, "a", true);
    expect(next.toggles.a).toBe(true);
    const next2 = toggleEvidence(next, "a", false);
    expect(next2.toggles.a).toBe(false);
  });

  it("verifySource marks source as verified", () => {
    const state = createEmptyEvidenceState();
    const next = verifySource(state, "a", true);
    expect(next.sourceVerified.a).toBe(true);
    expect(next.userVerified.a).toBe(true);
  });

  it("validateEvidenceRequirements returns blockers for missing required evidence", () => {
    const state = createEmptyEvidenceState();
    const inputs = [
      { id: "a", evidence_requirement: "Required for calculation", source_status: "NEEDS_SOURCE_VERIFICATION" as const, criticality: "CRITICAL" },
    ];
    const result = validateEvidenceRequirements(inputs, state);
    expect(result.blockers.length).toBeGreaterThan(0);
    expect(result.blockers.some((b) => b.includes("a"))).toBe(true);
  });

  it("validateEvidenceRequirements returns no blockers when required evidence is verified", () => {
    let state = createEmptyEvidenceState();
    state = toggleEvidence(state, "a", true);
    state = verifySource(state, "a", true);
    const inputs = [
      { id: "a", evidence_requirement: "Required for calculation", source_status: "NEEDS_SOURCE_VERIFICATION" as const, criticality: "NORMAL" },
    ];
    const result = validateEvidenceRequirements(inputs, state);
    expect(result.blockers.some((b) => b.includes("a"))).toBe(false);
  });
});
