// Test: FMEA engine

import { describe, it, expect } from "vitest";
import { evaluateFmea, buildFmeaSummary } from "../fmea-engine";
import type { FmeaItem } from "../../pro-form/contract-types";

describe("FMEA engine", () => {
  it("evaluateFmea returns null for empty config", () => {
    const result = evaluateFmea({ rpnThreshold: 50, severityThreshold: 5 }, {});
    expect(result).toBeNull();
  });

  it("buildFmeaSummary builds summary from items", () => {
    const items: FmeaItem[] = [{
      failure_mode: "Bearing seizure",
      effect: "Motor stops",
      severity: 8,
      occurrence: 4,
      detection: 3,
      rpn: 96,
      control_measure: "Thermal protection",
    }];
    const summary = buildFmeaSummary(items, 50);
    expect(summary.triggered).toBe(true);
    expect(summary.items.length).toBe(1);
    expect(summary.total_rpn).toBe(96);
    expect(summary.highest_rpn).toBe(96);
    expect(summary.threshold_exceeded).toBe(true);
  });

  it("buildFmeaSummary classifies thresholds correctly", () => {
    const items: FmeaItem[] = [
      { failure_mode: "Critical", effect: "Break", severity: 9, occurrence: 9, detection: 9, rpn: 729, control_measure: "" },
      { failure_mode: "Medium", effect: "Degrade", severity: 3, occurrence: 3, detection: 3, rpn: 27, control_measure: "" },
      { failure_mode: "Low", effect: "Minor", severity: 1, occurrence: 1, detection: 1, rpn: 1, control_measure: "" },
    ];
    const summary = buildFmeaSummary(items, 50);
    expect(summary.triggered).toBe(true);
    expect(summary.total_rpn).toBe(757);
    expect(summary.highest_rpn).toBe(729);
    expect(summary.threshold_exceeded).toBe(true);
  });

  it("buildFmeaSummary returns untriggered for empty items", () => {
    const summary = buildFmeaSummary([], 50);
    expect(summary.triggered).toBe(false);
    expect(summary.total_rpn).toBe(0);
    expect(summary.highest_rpn).toBe(0);
  });
});
