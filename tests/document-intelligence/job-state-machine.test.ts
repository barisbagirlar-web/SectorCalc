/**
 * Unit Tests: Job State Machine
 */
import { describe, it, expect } from "vitest";
import { assertValidTransition, IllegalTransitionError, allowedNextStates } from "@/lib/document-intelligence/contracts/job-state-machine";
import type { JobStatus } from "@/types/document-intelligence";

describe("assertValidTransition", () => {
  it("allows diagnostic_uploaded → diagnostic_scanning", () => {
    expect(() => assertValidTransition("diagnostic_uploaded", "diagnostic_scanning")).not.toThrow();
  });

  it("allows diagnostic_eligible → awaiting_payment", () => {
    expect(() => assertValidTransition("diagnostic_eligible", "awaiting_payment")).not.toThrow();
  });

  it("allows paid → queued", () => {
    expect(() => assertValidTransition("paid", "queued")).not.toThrow();
  });

  it("allows completed → expired", () => {
    expect(() => assertValidTransition("completed", "expired")).not.toThrow();
  });

  it("rejects diagnostic_uploaded → completed", () => {
    expect(() => assertValidTransition("diagnostic_uploaded", "completed")).toThrow(IllegalTransitionError);
  });

  it("rejects awaiting_payment → completed", () => {
    expect(() => assertValidTransition("awaiting_payment", "completed")).toThrow(IllegalTransitionError);
  });

  it("allows any state → failed_terminal", () => {
    const fromStates: JobStatus[] = [
      "diagnostic_scanning",
      "extracting",
      "normalizing",
      "validating",
      "generating_outputs",
    ];
    for (const from of fromStates) {
      expect(() => assertValidTransition(from, "failed_terminal")).not.toThrow();
    }
  });
});

describe("allowedNextStates", () => {
  it("returns expected next states for eligible", () => {
    const next = allowedNextStates("diagnostic_eligible");
    expect(next).toContain("awaiting_payment");
    expect(next).toContain("failed_terminal");
  });

  it("returns no next states for expired", () => {
    const next = allowedNextStates("expired");
    expect(next).toHaveLength(0);
  });
});
