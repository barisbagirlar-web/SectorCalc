import { describe, it, expect } from "vitest";
import { runDiagnostic, AnalyzeRequestSchema } from "../diagnostic-service";
import type { AnalyzeRequest } from "../diagnostic-service";

/**
 * Build a typed request fixture by running through Zod validation.
 * Mirrors what the real API route does — ensures test data is always valid.
 */
function fixture(input: unknown): AnalyzeRequest {
  return AnalyzeRequestSchema.parse(input);
}

/* ── Fixtures ── */

const CNC_NEAR_LIMIT_REQUEST = fixture({
  domain_id: "CNC_MACHINING",
  problem_context:
    "Shaft diameter on final turning operation trending toward upper tolerance limit. Possible tool wear.",
  measurements: [
    {
      measured_value: 50.09,
      nominal_value: 50.0,
      tolerance_plus: 0.1,
      tolerance_minus: 0.1,
      unit: "mm",
      measurement_tool: "micrometer",
      calibration_status: "valid",
      part_condition: "good",
    },
  ],
  costs: {
    affected_quantity: 100,
    material_cost_per_unit: 25.0,
    rework_hours_per_unit: 0.5,
    blended_hourly_rate: 45.0,
    downtime_hours: 8,
    machine_hourly_rate: 120.0,
    expedite_or_delay_cost: 500.0,
    scrap_probability: 0.05,
    rework_probability: 0.15,
    probability_source: "DEFAULT_TABLE",
  },
  privacy_mode: "standard",
});

const WELDING_BREACH_REQUEST = fixture({
  domain_id: "WELDING",
  problem_context:
    "Weld leg length exceeds tolerance on critical structural joint. Visual crack suspected.",
  measurements: [
    {
      measured_value: 8.5,
      nominal_value: 6.0,
      tolerance_plus: 1.0,
      tolerance_minus: 1.0,
      unit: "mm",
      measurement_tool: "caliper",
      calibration_status: "valid",
      part_condition: "rough surface",
    },
  ],
  costs: {
    affected_quantity: 25,
    material_cost_per_unit: 120.0,
    rework_hours_per_unit: 2.0,
    blended_hourly_rate: 65.0,
    downtime_hours: 16,
    machine_hourly_rate: 80.0,
    expedite_or_delay_cost: 2000.0,
    scrap_probability: 0.15,
    rework_probability: 0.40,
    probability_source: "USER_ADJUSTED",
  },
  visual_observations: [
    {
      description: "Visible crack initiation at weld toe",
      severity_hint: "HIGH",
      confidence: 0.85,
      manual_verification_required: true,
    },
  ],
  privacy_mode: "standard",
});

const CMM_UNCERTAIN_REQUEST = fixture({
  domain_id: "CNC_MACHINING",
  problem_context:
    "Expired CMM calibration causing measurement uncertainty near tolerance limit.",
  measurements: [
    {
      measured_value: 50.095,
      nominal_value: 50.0,
      tolerance_plus: 0.1,
      tolerance_minus: 0.1,
      unit: "mm",
      measurement_tool: "cmm",
      calibration_status: "expired",
      part_condition: "good",
    },
  ],
  costs: {
    affected_quantity: 500,
    material_cost_per_unit: 85.0,
    rework_hours_per_unit: 1.5,
    blended_hourly_rate: 55.0,
    downtime_hours: 24,
    machine_hourly_rate: 200.0,
    expedite_or_delay_cost: 2500.0,
    scrap_probability: 0.3,
    rework_probability: 0.5,
    probability_source: "USER_ADJUSTED",
  },
  privacy_mode: "standard",
});

/* ── Schema Tests ── */

describe("AnalyzeRequestSchema", () => {
  it("validates a valid CNC request", () => {
    const result = AnalyzeRequestSchema.safeParse({
      ...CNC_NEAR_LIMIT_REQUEST,
      domain_id: "CNC_MACHINING",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing domain_id", () => {
    const { domain_id, ...rest } = CNC_NEAR_LIMIT_REQUEST as unknown as {
      domain_id: string;
      [key: string]: unknown;
    };
    const result = AnalyzeRequestSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects invalid domain_id", () => {
    const result = AnalyzeRequestSchema.safeParse({
      ...CNC_NEAR_LIMIT_REQUEST,
      domain_id: "INVALID_DOMAIN",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty measurements", () => {
    const result = AnalyzeRequestSchema.safeParse({
      ...CNC_NEAR_LIMIT_REQUEST,
      measurements: [],
    });
    expect(result.success).toBe(false);
  });

  it("defaults privacy_mode to standard", () => {
    const { privacy_mode, ...rest } = CNC_NEAR_LIMIT_REQUEST as unknown as {
      privacy_mode: string;
      [key: string]: unknown;
    };
    const result = AnalyzeRequestSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.privacy_mode).toBe("standard");
    }
  });
});

/* ── CNC_NEAR_LIMIT ── */

describe("runDiagnostic — CNC_NEAR_LIMIT", () => {
  const result = runDiagnostic(CNC_NEAR_LIMIT_REQUEST);

  it("returns ok: true", () => {
    expect(result.ok).toBe(true);
  });

  it("diagnostic_id is preview-only", () => {
    expect(result.diagnostic_id).toBe("preview-only");
  });

  it("resolves domain correctly", () => {
    expect(result.domain.id).toBe("CNC_MACHINING");
    expect(result.domain.category).toBe("core");
  });

  it("processes measurement as NEAR_LIMIT", () => {
    expect(result.measurement_results).toHaveLength(1);
    expect(result.measurement_results[0].tolerance_status).toBe("NEAR_LIMIT");
    expect(result.measurement_results[0].expanded_uncertainty_k2).toBeCloseTo(0.008, 5);
  });

  it("computes cost-at-risk deterministically", () => {
    expect(result.cost_at_risk.total).toBeGreaterThan(0);
    expect(result.cost_at_risk.probability_source).toBe("DEFAULT_TABLE");
    expect(result.cost_at_risk.assumptions).toHaveLength(4);
  });

  it("derives risk components server-side", () => {
    expect(result.decision.breakdown.measurement_risk).toBe(10); // NEAR_LIMIT
    expect(result.decision.breakdown.exposure_risk).toBe(5); // 100 qty
    expect(result.decision.breakdown.visual_advisory_risk).toBe(0); // no visual
    expect(result.decision.total_risk_score).toBeGreaterThan(0);
  });

  it("decision is a valid state", () => {
    const validStates = [
      "LOW_RISK",
      "PROCEED_WITH_CAUTION",
      "STOP_AND_INSPECT",
      "QC_REQUIRED",
      "HIGH_SCRAP_RISK",
    ] as const;
    expect(validStates).toContain(result.decision.decision);
  });

  it("builds action plan with containment items", () => {
    expect(Array.isArray(result.action_plan.containment)).toBe(true);
    expect(result.action_plan.containment.length).toBeGreaterThanOrEqual(1);
  });

  it("includes disclaimer", () => {
    expect(result.disclaimer).toContain("Manual verification required");
  });

  it("includes audit log", () => {
    expect(result.audit_log.length).toBeGreaterThanOrEqual(4);
    expect(result.audit_log[0]).toContain("Diagnostic started");
  });
});

/* ── WELDING_BREACH ── */

describe("runDiagnostic — WELDING_BREACH with visual observation", () => {
  const result = runDiagnostic(WELDING_BREACH_REQUEST);

  it("resolves welding domain", () => {
    expect(result.domain.id).toBe("WELDING");
  });

  it("measurement status is BREACH", () => {
    expect(result.measurement_results[0].tolerance_status).toBe("BREACH");
  });

  it("derives measurement_risk = 25 for BREACH", () => {
    expect(result.decision.breakdown.measurement_risk).toBe(25);
  });

  it("derives visual_advisory_risk = 30 for HIGH severity", () => {
    expect(result.decision.breakdown.visual_advisory_risk).toBe(30);
  });

  it("derives manual_check_risk = 5 (manual_verification_required=true)", () => {
    expect(result.decision.breakdown.manual_check_risk).toBe(5);
  });

  it("cost source is USER_ADJUSTED", () => {
    expect(result.cost_at_risk.probability_source).toBe("USER_ADJUSTED");
  });

  it("decision is elevated due to breach + visual + manual", () => {
    const highStates = ["STOP_AND_INSPECT", "QC_REQUIRED", "HIGH_SCRAP_RISK"] as const;
    expect(highStates).toContain(result.decision.decision);
  });
});

/* ── CMM_UNCERTAIN (mandatory floor) ── */

describe("runDiagnostic — CMM_UNCERTAIN (mandatory floor)", () => {
  const result = runDiagnostic(CMM_UNCERTAIN_REQUEST);

  it("measurement is UNCERTAIN", () => {
    expect(result.measurement_results[0].tolerance_status).toBe("UNCERTAIN");
  });

  it("mandatory_decision_floor is STOP_AND_INSPECT", () => {
    expect(result.measurement_results[0].mandatory_decision_floor).toBe("STOP_AND_INSPECT");
  });

  it("mandatory_floor_applied is true", () => {
    expect(result.decision.mandatory_floor_applied).toBe(true);
  });

  it("decision is at least STOP_AND_INSPECT", () => {
    const atOrAbove = ["STOP_AND_INSPECT", "QC_REQUIRED", "HIGH_SCRAP_RISK"] as const;
    expect(atOrAbove).toContain(result.decision.decision);
  });
});

/* ── Determinism ── */

describe("runDiagnostic — determinism", () => {
  it("produces identical results on repeated calls", () => {
    const first = runDiagnostic(CNC_NEAR_LIMIT_REQUEST);
    const second = runDiagnostic(CNC_NEAR_LIMIT_REQUEST);
    expect(second.decision.total_risk_score).toBe(first.decision.total_risk_score);
    expect(second.decision.decision).toBe(first.decision.decision);
    expect(second.cost_at_risk.total).toBe(first.cost_at_risk.total);
    expect(second.measurement_results[0].tolerance_status).toBe(
      first.measurement_results[0].tolerance_status
    );
  });
});

/* ── No LLM ── */

describe("runDiagnostic — no LLM references", () => {
  it("audit log contains no LLM references", () => {
    const result = runDiagnostic(CNC_NEAR_LIMIT_REQUEST);
    expect(result.audit_log.some((l) => l.includes("LLM") || l.includes("AI call"))).toBe(false);
  });
});
