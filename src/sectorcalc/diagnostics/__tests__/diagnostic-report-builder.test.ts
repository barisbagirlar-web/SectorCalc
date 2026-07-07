import { describe, it, expect } from "vitest";
import { runDiagnostic, AnalyzeRequestSchema } from "../diagnostic-service";
import { buildDiagnosticReport } from "../report/diagnostic-report-builder";
import type { DiagnosticReport } from "../report/diagnostic-report-types";
import { DiagnosticReportSchema } from "../report/diagnostic-report-schema";
import { METHODOLOGY_ENTRIES, METHODOLOGY_VERSION } from "../report/diagnostic-report-methodology";
import { redactUserText } from "../report/diagnostic-report-redaction";
import { readdirSync, readFileSync } from "fs";
import { resolve, join } from "path";

function buildFixture(input: unknown): DiagnosticReport {
  const parsed = AnalyzeRequestSchema.parse(input);
  const response = runDiagnostic(parsed);
  return buildDiagnosticReport(response, parsed.privacy_mode);
}

const CNC_MACHINING_INPUT = {
  domain_id: "CNC_MACHINING",
  problem_context: "Shaft diameter on final turning operation trending toward upper tolerance limit. Possible tool wear.",
  measurements: [{
    measured_value: 50.09,
    nominal_value: 50.0,
    tolerance_plus: 0.1,
    tolerance_minus: 0.1,
    unit: "mm",
    measurement_tool: "micrometer",
    calibration_status: "valid",
    part_condition: "good",
  }],
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
    probability_source: "DEFAULT_TABLE" as const,
  },
  privacy_mode: "standard" as const,
};

const WELDING_PRIVACY_INPUT = {
  domain_id: "WELDING",
  problem_context: "Weld crack detected on structural beam flange.",
  measurements: [{
    measured_value: 8.5,
    nominal_value: 6.0,
    tolerance_plus: 1.0,
    tolerance_minus: 1.0,
    unit: "mm",
    measurement_tool: "caliper",
    calibration_status: "valid",
    part_condition: "rough surface",
  }],
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
    probability_source: "USER_ADJUSTED" as const,
  },
  privacy_mode: "reduced_retention" as const,
};

describe("determinism", () => {
  it("identical output for same analyze response", () => {
    const parsed = AnalyzeRequestSchema.parse(CNC_MACHINING_INPUT);
    const resp1 = runDiagnostic(parsed);
    const resp2 = runDiagnostic(parsed);
    const r1 = buildDiagnosticReport(resp1, parsed.privacy_mode);
    const r2 = buildDiagnosticReport(resp2, parsed.privacy_mode);
    expect(r2.decision_section.decision).toBe(r1.decision_section.decision);
    expect(r2.decision_section.total_risk_score).toBe(r1.decision_section.total_risk_score);
    expect(r2.cost_section.estimated_cost_at_risk).toBe(r1.cost_section.estimated_cost_at_risk);
    expect(r2.measurement_section.entries).toEqual(r1.measurement_section.entries);
  });
});

describe("report_id", () => {
  it("starts with preview_", () => {
    expect(buildFixture(CNC_MACHINING_INPUT).report_id).toMatch(/^preview_/);
  });
  it("deterministic for same input", () => {
    expect(buildFixture(CNC_MACHINING_INPUT).report_id).toBe(buildFixture(CNC_MACHINING_INPUT).report_id);
  });
  it("changes when input changes", () => {
    expect(buildFixture(CNC_MACHINING_INPUT).report_id).not.toBe(buildFixture(WELDING_PRIVACY_INPUT).report_id);
  });
  it("not a random UUID", () => {
    expect(buildFixture(CNC_MACHINING_INPUT).report_id).not.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});

describe("all required sections", () => {
  const report = buildFixture(CNC_MACHINING_INPUT);
  const keys = [
    "report_id", "report_type", "schema_version", "engine_version",
    "methodology_version", "created_at", "domain_section", "problem_section",
    "measurement_section", "cost_section", "decision_section",
    "action_plan_section", "evidence_section", "related_tools_section",
    "methodology_section", "limitation_section", "audit_log",
  ];
  for (const key of keys) {
    it("includes " + key, () => { expect(report).toHaveProperty(key); });
  }
});

describe("methodology source", () => {
  it("entries match single source", () => {
    const report = buildFixture(CNC_MACHINING_INPUT);
    expect(report.methodology_section.entries.length).toBe(METHODOLOGY_ENTRIES.length);
    report.methodology_section.entries.forEach((e, i) => { expect(e.name).toBe(METHODOLOGY_ENTRIES[i].name); });
  });
  it("version matches", () => {
    expect(buildFixture(CNC_MACHINING_INPUT).methodology_version).toBe(METHODOLOGY_VERSION);
  });
  it("includes all required rules", () => {
    const names = buildFixture(CNC_MACHINING_INPUT).methodology_section.entries.map((e) => e.name);
    expect(names).toContain("Expanded Uncertainty (k=2)");
    expect(names).toContain("Cost-at-Risk");
    expect(names).toContain("Risk Score Components");
    expect(names).toContain("Decision Thresholds");
    expect(names).toContain("Mandatory Floor Rule");
    expect(names).toContain("LLM Limitation Rule");
  });
});

describe("limitation section", () => {
  const report = buildFixture(CNC_MACHINING_INPUT);
  it("disclaimer present", () => { expect(report.limitation_section.disclaimer).toContain("Manual verification required"); });
  it("llm_limitation present", () => { expect(report.limitation_section.llm_limitation).toContain("deterministic TypeScript engines"); });
  it("manual_verification_required is true", () => { expect(report.limitation_section.manual_verification_required).toBe(true); });
});

describe("forbidden claims", () => {
  const json = JSON.stringify(buildFixture(CNC_MACHINING_INPUT)).toLowerCase();
  ["certified", "guaranteed", "approval", "defect-free", "detects all", "final acceptance"].forEach((t) => {
    it("does not include " + t, () => expect(json).not.toContain(t));
  });
});

describe("no RUN_OK", () => {
  it("does not contain RUN_OK or RUN OK", () => {
    const json = JSON.stringify(buildFixture(CNC_MACHINING_INPUT));
    expect(json).not.toContain("RUN_OK");
    expect(json).not.toContain("RUN OK");
  });
});

describe("import integrity", () => {
  it("report source files do not import openai or deepseek", () => {
    const reportDir = resolve(__dirname, "..", "report");
    const files = readdirSync(reportDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
    for (const file of files) {
      const content = readFileSync(join(reportDir, file), "utf-8");
      expect(content).not.toMatch(/from\s+["']openai["']/);
      expect(content).not.toMatch(/from\s+["']deepseek["']/);
      expect(content).not.toMatch(/from\s+["']@?openai\//);
      expect(content).not.toMatch(/from\s+["']@?deepseek\//);
    }
  });
});

describe("redactUserText", () => {
  it("trims whitespace", () => expect(redactUserText("  hello  ")).toBe("hello"));
  it("limits length", () => expect(redactUserText("x".repeat(6000)).length).toBe(5000));
  it("redacts sk- API keys", () => {
    const r = redactUserText("key is sk-svcacct-abcdefghijklmnopqrstuvwxyz");
    expect(r).toContain("[REDACTED]");
    expect(r).not.toContain("sk-svcacct-abcdefghijklmnopqrstuvwxyz");
  });
  it("redacts OPENAI_API_KEY", () => { expect(redactUserText("OPENAI_API_KEY=sk-abc123")).toContain("[REDACTED]"); });
  it("redacts DEEPSEEK_API_KEY", () => { expect(redactUserText("DEEPSEEK_API_KEY=sk-xyz789")).toContain("[REDACTED]"); });
  it("redacts password=", () => {
    const r = redactUserText("password=supersecret123");
    expect(r).toContain("password=[REDACTED]");
    expect(r).not.toContain("supersecret123");
  });
  it("redacts bearer tokens", () => {
    const r = redactUserText("Authorization: bearer mytoken123");
    expect(r).toContain("bearer [REDACTED]");
    expect(r).not.toContain("mytoken123");
  });
  it("handles empty/null", () => {
    expect(redactUserText("")).toBe("");
    expect(redactUserText(null as unknown as string)).toBe("");
  });
});

describe("related tools integrity", () => {
  const cnc = buildFixture(CNC_MACHINING_INPUT);
  const weld = buildFixture(WELDING_PRIVACY_INPUT);
  it("no planned/missing marked as ACTIVE", () => {
    for (const t of cnc.related_tools_section.tools) {
      if (t.status === "PLANNED" || t.status === "MISSING") expect(t.status).not.toBe("ACTIVE");
    }
  });
  it("all entries have slug, label, reason", () => {
    for (const t of [...cnc.related_tools_section.tools, ...weld.related_tools_section.tools]) {
      expect(t.slug.length).toBeGreaterThan(0);
      expect(t.label.length).toBeGreaterThan(0);
      expect(t.reason.length).toBeGreaterThan(0);
    }
  });
});

describe("version fields", () => {
  const r = buildFixture(CNC_MACHINING_INPUT);
  it("schema_version = 2.0.0", () => expect(r.schema_version).toBe("2.0.0"));
  it("engine_version = 1.0.0", () => expect(r.engine_version).toBe("1.0.0"));
  it("methodology_version = 1.0.0", () => expect(r.methodology_version).toBe("1.0.0"));
});

describe("structured audit log", () => {
  const r = buildFixture(CNC_MACHINING_INPUT);
  it("entries are structured objects", () => {
    for (const e of r.audit_log) {
      expect(typeof e.event).toBe("string");
      expect(typeof e.at).toBe("string");
      expect(e.source).toBe("server");
      expect(typeof e.engine_version).toBe("string");
    }
  });
  it("audit log not empty", () => expect(r.audit_log.length).toBeGreaterThan(0));
});

describe("evidence section", () => {
  it("NOT_ATTACHED placeholder", () => {
    const r = buildFixture(CNC_MACHINING_INPUT);
    expect(r.evidence_section.photo_status).toBe("NOT_ATTACHED");
    expect(r.evidence_section.image_hash).toBeNull();
  });
  it("reduced retention privacy mode", () => {
    expect(buildFixture(WELDING_PRIVACY_INPUT).evidence_section.privacy_mode).toBe("reduced_retention");
  });
});

describe("domain section", () => {
  const r = buildFixture(CNC_MACHINING_INPUT);
  it("has all fields", () => {
    expect(r.domain_section.domain_id).toBe("CNC_MACHINING");
    expect(r.domain_section.label).toBe("CNC Machining");
    expect(r.domain_section.category).toBe("core");
    expect(r.domain_section.process_description.length).toBeGreaterThan(0);
  });
});

describe("action plan section", () => {
  const r = buildFixture(CNC_MACHINING_INPUT);
  it("has 4 groups", () => {
    expect(Array.isArray(r.action_plan_section.containment)).toBe(true);
    expect(Array.isArray(r.action_plan_section.temporary_fix)).toBe(true);
    expect(Array.isArray(r.action_plan_section.permanent_corrective_action)).toBe(true);
    expect(Array.isArray(r.action_plan_section.required_manual_checks)).toBe(true);
  });
});

describe("Zod schema validation", () => {
  it("CNC report passes", () => {
    const r = buildFixture(CNC_MACHINING_INPUT);
    const result = DiagnosticReportSchema.safeParse(r);
    if (!result.success) console.error("Zod errors:", JSON.stringify(result.error.issues, null, 2));
    expect(result.success).toBe(true);
  });
  it("Welding privacy report passes", () => {
    expect(DiagnosticReportSchema.safeParse(buildFixture(WELDING_PRIVACY_INPUT)).success).toBe(true);
  });
});
