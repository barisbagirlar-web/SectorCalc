import { describe, it, expect } from "vitest";
import {
  evaluateMeasurementConfidence,
  computeExpandedUncertainty,
  determineConfidenceClass,
} from "../engines/measurement-confidence-engine";
import type { MeasurementConfidenceInput } from "../diagnostic-types";

/* ── Golden Fixtures ── */

const CALIPER_OK: MeasurementConfidenceInput = {
  measured_value: 50.00,
  nominal_value: 50.00,
  tolerance_plus: 0.10,
  tolerance_minus: 0.10,
  unit: "mm",
  measurement_tool: "caliper",
  calibration_status: "valid",
  part_condition: "good",
};

const MICROMETER_NEAR_LIMIT: MeasurementConfidenceInput = {
  measured_value: 50.09,
  nominal_value: 50.00,
  tolerance_plus: 0.10,
  tolerance_minus: 0.10,
  unit: "mm",
  measurement_tool: "micrometer",
  calibration_status: "valid",
  part_condition: "good",
};

const BORE_GAUGE_BREACH: MeasurementConfidenceInput = {
  measured_value: 50.15,
  nominal_value: 50.00,
  tolerance_plus: 0.10,
  tolerance_minus: 0.10,
  unit: "mm",
  measurement_tool: "bore_gauge",
  calibration_status: "valid",
  part_condition: "worn",
};

const CMM_EXPIRED_UNCERTAIN: MeasurementConfidenceInput = {
  measured_value: 50.095,
  nominal_value: 50.00,
  tolerance_plus: 0.10,
  tolerance_minus: 0.10,
  unit: "mm",
  measurement_tool: "cmm",
  calibration_status: "expired",
  part_condition: "good",
};

const UNKNOWN_TOOL_LOW_CONFIDENCE: MeasurementConfidenceInput = {
  measured_value: 100.00,
  nominal_value: 100.00,
  tolerance_plus: 0.01,
  tolerance_minus: 0.01,
  unit: "mm",
  measurement_tool: "unknown",
  calibration_status: "unknown",
  part_condition: "unknown",
};

describe("computeExpandedUncertainty", () => {
  it("returns 0.04 mm for caliper with valid calibration", () => {
    const result = computeExpandedUncertainty("caliper", "valid");
    expect(result).toBeCloseTo(0.04, 5);
  });

  it("returns 0.008 mm for micrometer with valid calibration", () => {
    const result = computeExpandedUncertainty("micrometer", "valid");
    expect(result).toBeCloseTo(0.008, 5);
  });

  it("applies 2.0 multiplier for expired calibration", () => {
    const valid = computeExpandedUncertainty("cmm", "valid");
    const expired = computeExpandedUncertainty("cmm", "expired");
    expect(expired).toBeCloseTo(valid * 2.0, 5);
  });

  it("applies 1.5 multiplier for unknown calibration", () => {
    const valid = computeExpandedUncertainty("cmm", "valid");
    const unknown = computeExpandedUncertainty("cmm", "unknown");
    expect(unknown).toBeCloseTo(valid * 1.5, 5);
  });

  it("returns 0.1 mm for unknown tool", () => {
    const result = computeExpandedUncertainty("unknown", "valid");
    expect(result).toBeCloseTo(0.1, 5);
  });
});

describe("determineConfidenceClass", () => {
  it("returns HIGH when uncertainty is <= 50% of tolerance span", () => {
    const result = determineConfidenceClass(0.04, 0.1, 0.1);
    expect(result).toBe("HIGH");
  });

  it("returns MEDIUM when uncertainty is between 50% and 100% of tolerance span", () => {
    const result = determineConfidenceClass(0.12, 0.1, 0.1);
    expect(result).toBe("MEDIUM");
  });

  it("returns LOW when uncertainty exceeds tolerance span", () => {
    const result = determineConfidenceClass(0.25, 0.1, 0.1);
    expect(result).toBe("LOW");
  });

  it("returns LOW when tolerance span is zero or negative", () => {
    const result = determineConfidenceClass(0.1, 0, 0);
    expect(result).toBe("LOW");
  });
});

describe("evaluateMeasurementConfidence — CALIPER_OK", () => {
  const result = evaluateMeasurementConfidence(CALIPER_OK);

  it("expanded_uncertainty_k2 is 0.04 mm", () => {
    expect(result.expanded_uncertainty_k2).toBeCloseTo(0.04, 5);
  });

  it("confidence_class is HIGH", () => {
    expect(result.confidence_class).toBe("HIGH");
  });

  it("tolerance_status is INSIDE", () => {
    expect(result.tolerance_status).toBe("INSIDE");
  });

  it("mandatory_decision_floor is null", () => {
    expect(result.mandatory_decision_floor).toBeNull();
  });
});

describe("evaluateMeasurementConfidence — MICROMETER_NEAR_LIMIT", () => {
  const result = evaluateMeasurementConfidence(MICROMETER_NEAR_LIMIT);

  it("expanded_uncertainty_k2 is 0.008 mm", () => {
    expect(result.expanded_uncertainty_k2).toBeCloseTo(0.008, 5);
  });

  it("tolerance_status is NEAR_LIMIT", () => {
    expect(result.tolerance_status).toBe("NEAR_LIMIT");
  });
});

describe("evaluateMeasurementConfidence — BORE_GAUGE_BREACH", () => {
  const result = evaluateMeasurementConfidence(BORE_GAUGE_BREACH);

  it("tolerance_status is BREACH", () => {
    expect(result.tolerance_status).toBe("BREACH");
  });
});

describe("evaluateMeasurementConfidence — CMM_EXPIRED → UNCERTAIN + STOP_AND_INSPECT", () => {
  const result = evaluateMeasurementConfidence(CMM_EXPIRED_UNCERTAIN);

  it("tolerance_status is UNCERTAIN (distance < expanded_uncertainty_k2)", () => {
    expect(result.tolerance_status).toBe("UNCERTAIN");
  });

  it("mandatory_decision_floor is STOP_AND_INSPECT", () => {
    expect(result.mandatory_decision_floor).toBe("STOP_AND_INSPECT");
  });
});

describe("evaluateMeasurementConfidence — UNKNOWN_TOOL_LOW_CONFIDENCE", () => {
  const result = evaluateMeasurementConfidence(UNKNOWN_TOOL_LOW_CONFIDENCE);

  it("expanded_uncertainty_k2 is 0.15 mm (0.05*2*1.5)", () => {
    expect(result.expanded_uncertainty_k2).toBeCloseTo(0.15, 5);
  });

  it("confidence_class is LOW", () => {
    expect(result.confidence_class).toBe("LOW");
  });

  it("tolerance_status is UNCERTAIN", () => {
    expect(result.tolerance_status).toBe("UNCERTAIN");
  });

  it("mandatory_decision_floor is STOP_AND_INSPECT", () => {
    expect(result.mandatory_decision_floor).toBe("STOP_AND_INSPECT");
  });
});
