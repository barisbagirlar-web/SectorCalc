import { describe, it, expect } from "vitest";
import { evaluateDecision, scoreToDecision } from "../engines/decision-engine";
import type { DecisionEngineInput } from "../diagnostic-types";

/* ── Golden Fixtures ── */

const LOW_RISK_INPUT: DecisionEngineInput = {
  measurement_risk: 3,
  confidence_risk: 2,
  exposure_risk: 2,
  cost_risk: 1,
  manual_check_risk: 0,
  // visual_advisory_risk omitted on purpose (optional)
};

const PROCEED_WITH_CAUTION_INPUT: DecisionEngineInput = {
  measurement_risk: 12,
  confidence_risk: 5,
  visual_advisory_risk: 8,
  exposure_risk: 4,
  cost_risk: 3,
  manual_check_risk: 1,
};

const STOP_AND_INSPECT_INPUT: DecisionEngineInput = {
  measurement_risk: 20,
  confidence_risk: 8,
  visual_advisory_risk: 15,
  exposure_risk: 8,
  cost_risk: 5,
  manual_check_risk: 3,
};

const QC_REQUIRED_INPUT: DecisionEngineInput = {
  measurement_risk: 25,
  confidence_risk: 12,
  visual_advisory_risk: 22,
  exposure_risk: 12,
  cost_risk: 8,
  manual_check_risk: 4,
};

const HIGH_SCRAP_INPUT: DecisionEngineInput = {
  measurement_risk: 25,
  confidence_risk: 15,
  visual_advisory_risk: 30,
  exposure_risk: 15,
  cost_risk: 10,
  manual_check_risk: 5,
};

const FLOOR_OVERRIDE_INPUT: DecisionEngineInput = {
  measurement_risk: 3,
  confidence_risk: 2,
  exposure_risk: 2,
  cost_risk: 1,
  manual_check_risk: 0,
  mandatory_decision_floor: "STOP_AND_INSPECT",
};

const CLAMPED_OVER_MAX_INPUT: DecisionEngineInput = {
  measurement_risk: 999,
  confidence_risk: 999,
  visual_advisory_risk: 999,
  exposure_risk: 999,
  cost_risk: 999,
  manual_check_risk: 999,
};

describe("scoreToDecision", () => {
  it("0-25 → LOW_RISK", () => {
    expect(scoreToDecision(0)).toBe("LOW_RISK");
    expect(scoreToDecision(25)).toBe("LOW_RISK");
  });

  it("26-50 → PROCEED_WITH_CAUTION", () => {
    expect(scoreToDecision(26)).toBe("PROCEED_WITH_CAUTION");
    expect(scoreToDecision(50)).toBe("PROCEED_WITH_CAUTION");
  });

  it("51-75 → STOP_AND_INSPECT", () => {
    expect(scoreToDecision(51)).toBe("STOP_AND_INSPECT");
    expect(scoreToDecision(75)).toBe("STOP_AND_INSPECT");
  });

  it("76-90 → QC_REQUIRED", () => {
    expect(scoreToDecision(76)).toBe("QC_REQUIRED");
    expect(scoreToDecision(90)).toBe("QC_REQUIRED");
  });

  it("91-100 → HIGH_SCRAP_RISK", () => {
    expect(scoreToDecision(91)).toBe("HIGH_SCRAP_RISK");
    expect(scoreToDecision(100)).toBe("HIGH_SCRAP_RISK");
  });

  it("above 100 → HIGH_SCRAP_RISK", () => {
    expect(scoreToDecision(150)).toBe("HIGH_SCRAP_RISK");
  });
});

describe("evaluateDecision — LOW_RISK_INPUT", () => {
  const result = evaluateDecision(LOW_RISK_INPUT);

  it("total score is sum of components (clamped)", () => {
    expect(result.total_risk_score).toBe(8); // 3+2+0+2+1+0
  });

  it("decision is LOW_RISK", () => {
    expect(result.decision).toBe("LOW_RISK");
  });

  it("mandatory_floor_applied is false", () => {
    expect(result.mandatory_floor_applied).toBe(false);
  });

  it("visual_advisory_risk defaults to 0 when absent", () => {
    expect(result.breakdown.visual_advisory_risk).toBe(0);
  });
});

describe("evaluateDecision — PROCEED_WITH_CAUTION_INPUT", () => {
  const result = evaluateDecision(PROCEED_WITH_CAUTION_INPUT);

  it("total score is 33", () => {
    expect(result.total_risk_score).toBe(33); // 12+5+8+4+3+1
  });

  it("decision is PROCEED_WITH_CAUTION", () => {
    expect(result.decision).toBe("PROCEED_WITH_CAUTION");
  });
});

describe("evaluateDecision — STOP_AND_INSPECT_INPUT", () => {
  const result = evaluateDecision(STOP_AND_INSPECT_INPUT);

  it("total score is 59", () => {
    expect(result.total_risk_score).toBe(59); // 20+8+15+8+5+3
  });

  it("decision is STOP_AND_INSPECT", () => {
    expect(result.decision).toBe("STOP_AND_INSPECT");
  });
});

describe("evaluateDecision — QC_REQUIRED_INPUT", () => {
  const result = evaluateDecision(QC_REQUIRED_INPUT);

  it("total score is 83", () => {
    expect(result.total_risk_score).toBe(83); // 25+12+22+12+8+4
  });

  it("decision is QC_REQUIRED", () => {
    expect(result.decision).toBe("QC_REQUIRED");
  });
});

describe("evaluateDecision — HIGH_SCRAP_INPUT", () => {
  const result = evaluateDecision(HIGH_SCRAP_INPUT);

  it("total score is 100 (capped)", () => {
    expect(result.total_risk_score).toBe(100);
  });

  it("decision is HIGH_SCRAP_RISK", () => {
    expect(result.decision).toBe("HIGH_SCRAP_RISK");
  });
});

describe("evaluateDecision — FLOOR_OVERRIDE", () => {
  const result = evaluateDecision(FLOOR_OVERRIDE_INPUT);

  it("total_risk_score is 8 (LOW_RISK territory)", () => {
    expect(result.total_risk_score).toBe(8);
  });

  it("decision is forced to STOP_AND_INSPECT by mandatory floor", () => {
    expect(result.decision).toBe("STOP_AND_INSPECT");
  });

  it("mandatory_floor_applied is true", () => {
    expect(result.mandatory_floor_applied).toBe(true);
  });
});

describe("evaluateDecision — CLAMPED_OVER_MAX", () => {
  const result = evaluateDecision(CLAMPED_OVER_MAX_INPUT);

  it("breakdown values are clamped to caps", () => {
    expect(result.breakdown.measurement_risk).toBe(25);
    expect(result.breakdown.confidence_risk).toBe(15);
    expect(result.breakdown.visual_advisory_risk).toBe(30);
    expect(result.breakdown.exposure_risk).toBe(15);
    expect(result.breakdown.cost_risk).toBe(10);
    expect(result.breakdown.manual_check_risk).toBe(5);
  });

  it("total score is capped at 100", () => {
    expect(result.total_risk_score).toBe(100);
  });

  it("decision is HIGH_SCRAP_RISK", () => {
    expect(result.decision).toBe("HIGH_SCRAP_RISK");
  });
});

describe("evaluateDecision — determinism test", () => {
  it("produces identical result on repeated calls", () => {
    const first = evaluateDecision(STOP_AND_INSPECT_INPUT);
    const second = evaluateDecision(STOP_AND_INSPECT_INPUT);
    expect(second).toEqual(first);
  });
});
