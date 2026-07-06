import { describe, it, expect } from "vitest";
import type { DiagnosticReport } from "../report/diagnostic-report-types";
import {
  buildDiagnosticReportCanonicalPayload,
  createDiagnosticReportHash,
  createShortInputHash,
} from "../report/diagnostic-report-canonicalize";

function makeReport(overrides?: Partial<DiagnosticReport>): DiagnosticReport {
  const base: DiagnosticReport = {
    report_id: "preview_test123",
    report_type: "ENGINEERING_DIAGNOSTIC_PREVIEW",
    schema_version: "2.0.0",
    engine_version: "1.0.0",
    methodology_version: "1.0.0",
    created_at: "2026-01-01T00:00:00.000Z",
    domain_section: {
      domain_id: "CNC_MACHINING",
      label: "CNC Machining",
      description: "Precision machining",
      category: "core",
      process_description: "CNC turning and milling",
      typical_tolerances: "±0.05 mm",
      common_defect_modes: ["Tool wear", "Runout"],
    },
    problem_section: { problem_context: "Shaft diameter trending high" },
    measurement_section: {
      entries: [{
        index: 0,
        measured_value: 50.05,
        nominal_value: 50.0,
        tolerance_plus: 0.1,
        tolerance_minus: 0.1,
        unit: "mm",
        measurement_tool: "micrometer",
        calibration_status: "valid",
        part_condition: "good",
        expanded_uncertainty_k2: 0.008,
        confidence_class: "HIGH",
        tolerance_status: "NEAR_LIMIT",
        mandatory_decision_floor: null,
      }],
      worst_case_tolerance_status: "NEAR_LIMIT",
    },
    cost_section: {
      affected_quantity: 100, material_cost_per_unit: 25, rework_hours_per_unit: 0.5,
      blended_hourly_rate: 45, downtime_hours: 8, machine_hourly_rate: 120,
      expedite_or_delay_cost: 500, scrap_probability: 0.05, rework_probability: 0.15,
      probability_source: "DEFAULT_TABLE", estimated_cost_at_risk: 1234.56, assumptions: ["A1"],
    },
    decision_section: {
      total_risk_score: 30, decision: "PROCEED_WITH_CAUTION", mandatory_floor_applied: false,
      measurement_risk: 10, confidence_risk: 0, visual_advisory_risk: 0,
      exposure_risk: 5, cost_risk: 3, manual_check_risk: 0,
    },
    action_plan_section: {
      containment: [], temporary_fix: [], permanent_corrective_action: [], required_manual_checks: [],
    },
    evidence_section: { photo_status: "NOT_ATTACHED", image_hash: null, privacy_mode: "standard" },
    related_tools_section: {
      tools: [{ slug: "cnc-machining-cost-analyzer", label: "CNC Cost", status: "ACTIVE", reason: "Confirmed" }],
    },
    methodology_section: {
      entries: [{ name: "EU", description: "U = 2 x u x k", formula: "U = 2 x u_tool x k_cal" }],
      note: "Note",
    },
    limitation_section: {
      disclaimer: "Manual verification required.", llm_limitation: "No LLM.", manual_verification_required: true,
    },
    audit_log: [{ event: "Started", at: "2026-01-01T00:00:00.000Z", source: "server", engine_version: "1.0.0" }],
  };
  return { ...base, ...overrides };
}

describe("Canonical payload", () => {
  it("returns sorted top-level keys", () => {
    const c = buildDiagnosticReportCanonicalPayload(makeReport());
    const keys = Object.keys(c);
    expect(keys).toEqual([...keys].sort());
  });

  it("removes undefined values", () => {
    const dirty = JSON.parse(JSON.stringify(makeReport()));
    dirty.extra = undefined;
    dirty.domain_section.extra = undefined;
    const c = buildDiagnosticReportCanonicalPayload(dirty as DiagnosticReport);
    expect((c as Record<string, unknown>).extra).toBeUndefined();
  });

  it("preserves array order", () => {
    const r = makeReport();
    const values = r.measurement_section.entries.map((e) => e.measured_value);
    const c = buildDiagnosticReportCanonicalPayload(r);
    const entries = (c.measurement_section as Record<string, unknown>).entries as Array<Record<string, unknown>>;
    expect(entries.map((e) => e.measured_value)).toEqual(values);
  });
});

describe("Report hash", () => {
  it("deterministic", () => {
    const r = makeReport();
    expect(createDiagnosticReportHash(r)).toBe(createDiagnosticReportHash(r));
  });
  it("64-char hex", () => {
    expect(createDiagnosticReportHash(makeReport())).toMatch(/^[0-9a-f]{64}$/);
  });
  it("changes when data changes", () => {
    expect(createDiagnosticReportHash(makeReport())).not.toBe(
      createDiagnosticReportHash(makeReport({ report_id: "preview_other" }))
    );
  });
  it("stable across key insertion order", () => {
    const r = makeReport();
    const keys = Object.keys(r);
    const reversed: Record<string, unknown> = {};
    for (let i = keys.length - 1; i >= 0; i--) reversed[keys[i]] = (r as unknown as Record<string, unknown>)[keys[i]];
    expect(createDiagnosticReportHash(r)).toBe(
      createDiagnosticReportHash(reversed as unknown as DiagnosticReport)
    );
  });
});

describe("Short input hash", () => {
  it("12-char hex", () => { expect(createShortInputHash({ a: 1 })).toMatch(/^[0-9a-f]{12}$/); });
  it("deterministic", () => { expect(createShortInputHash({ x: 1 })).toBe(createShortInputHash({ x: 1 })); });
  it("stable across key order", () => {
    expect(createShortInputHash({ a: 1, b: 2 })).toBe(createShortInputHash({ b: 2, a: 1 }));
  });
  it("changes when data changes", () => {
    expect(createShortInputHash({ a: 1 })).not.toBe(createShortInputHash({ a: 2 }));
  });
});
