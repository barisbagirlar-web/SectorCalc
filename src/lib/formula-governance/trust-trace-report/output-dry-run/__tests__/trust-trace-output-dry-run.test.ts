/**
 * Trust trace output dry-run tests — Phase 5I-M.
 */

import { describe, expect, test } from "vitest";
import { runTrustTraceOutputDryRunAudit } from "@/lib/formula-governance/trust-trace-report/output-dry-run/trust-trace-output-audit";

describe("trust trace output dry-run — Phase 5I-M", () => {
  test("audit produces structured outputs", () => {
    const result = runTrustTraceOutputDryRunAudit();
    expect(result.totalOutputs).toBeGreaterThan(0);
    expect(result.outputs.every((o) => o.fileOutputGenerated === false)).toBe(true);
  });

  test("no file output generated", () => {
    const result = runTrustTraceOutputDryRunAudit();
    expect(result.outputs.every((o) => o.fileOutputGenerated === false)).toBe(true);
  });

  test("audit is deterministic", () => {
    const first = runTrustTraceOutputDryRunAudit();
    const second = runTrustTraceOutputDryRunAudit();
    expect(first.totalOutputs).toBe(second.totalOutputs);
    expect(first.outputDryRunReady).toBe(second.outputDryRunReady);
  });
});
