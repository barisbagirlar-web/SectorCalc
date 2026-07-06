import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "fs";
import { resolve, join } from "path";
import { runDiagnostic, AnalyzeRequestSchema } from "../diagnostic-service";
import { buildDiagnosticReport } from "../report/diagnostic-report-builder";
import { createDiagnosticReportHash } from "../report/diagnostic-report-canonicalize";
import { redactUserText } from "../report/diagnostic-report-redaction";

const BASE_INPUT = {
  domain_id: "CNC_MACHINING",
  problem_context: "Shaft diameter trending high on final turning operation.",
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

/* ── Helper: simulate the API route's flow ── */

function buildPreviewResponse(input: unknown) {
  const parsed = AnalyzeRequestSchema.parse(input);
  const result = runDiagnostic(parsed);
  const report = buildDiagnosticReport(result, parsed.privacy_mode);
  report.problem_section.problem_context = redactUserText(
    report.problem_section.problem_context
  );
  const report_hash = createDiagnosticReportHash(report);
  return { ok: true, report, report_hash };
}

/* ── 1. Report contract ── */

describe("report preview — contract shape", () => {
  const { report, report_hash } = buildPreviewResponse(BASE_INPUT);

  it("returns a report object", () => {
    expect(report).toBeDefined();
    expect(typeof report).toBe("object");
  });

  it("returns report_hash", () => {
    expect(typeof report_hash).toBe("string");
  });

  it("includes all required top-level sections", () => {
    const keys = [
      "report_id", "report_type", "schema_version", "engine_version",
      "methodology_version", "created_at", "domain_section", "problem_section",
      "measurement_section", "cost_section", "decision_section",
      "action_plan_section", "evidence_section", "related_tools_section",
      "methodology_section", "limitation_section", "audit_log",
    ];
    for (const key of keys) {
      expect(report).toHaveProperty(key);
    }
  });
});

/* ── 2. Hash is 64-char SHA-256 ── */

describe("report preview — hash", () => {
  it("is a 64-character hex string", () => {
    const { report_hash } = buildPreviewResponse(BASE_INPUT);
    expect(report_hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic for same report object", () => {
    const { report, report_hash } = buildPreviewResponse(BASE_INPUT);
    const hash2 = createDiagnosticReportHash(report);
    expect(report_hash).toBe(hash2);
  });

  it("changes when input changes", () => {
    const differentInput = { ...BASE_INPUT, problem_context: "Different problem." };
    const h1 = buildPreviewResponse(BASE_INPUT).report_hash;
    const h2 = buildPreviewResponse(differentInput).report_hash;
    expect(h1).not.toBe(h2);
  });
});

/* ── 3. Redaction ── */

describe("report preview — redaction", () => {
  it("redacts sk- API keys from problem_context", () => {
    const input = {
      ...BASE_INPUT,
      problem_context: "Key is sk-svcacct-abcdefghijklmnopqrstuvwxyz and it is secret.",
    };
    const { report } = buildPreviewResponse(input);
    expect(report.problem_section.problem_context).not.toContain(
      "sk-svcacct-abcdefghijklmnopqrstuvwxyz"
    );
    expect(report.problem_section.problem_context).toContain("[REDACTED]");
  });

  it("redacts OPENAI_API_KEY", () => {
    const input = {
      ...BASE_INPUT,
      problem_context: "OPENAI_API_KEY=sk-abc123def456",
    };
    const { report } = buildPreviewResponse(input);
    expect(report.problem_section.problem_context).not.toContain("sk-abc123def456");
    expect(report.problem_section.problem_context).toContain("[REDACTED]");
  });

  it("redacts DEEPSEEK_API_KEY", () => {
    const input = {
      ...BASE_INPUT,
      problem_context: "DEEPSEEK_API_KEY=sk-xyz789",
    };
    const { report } = buildPreviewResponse(input);
    expect(report.problem_section.problem_context).not.toContain("sk-xyz789");
  });

  it("redacts passwords", () => {
    const input = {
      ...BASE_INPUT,
      problem_context: "password=supersecret123",
    };
    const { report } = buildPreviewResponse(input);
    expect(report.problem_section.problem_context).not.toContain("supersecret123");
    expect(report.problem_section.problem_context).toContain("[REDACTED]");
  });

  it("redacts bearer tokens", () => {
    const input = {
      ...BASE_INPUT,
      problem_context: "Authorization: bearer mytoken123",
    };
    const { report } = buildPreviewResponse(input);
    expect(report.problem_section.problem_context).not.toContain("mytoken123");
  });
});

/* ── 4. No forbidden claims ── */

describe("report preview — forbidden claims", () => {
  const json = JSON.stringify(buildPreviewResponse(BASE_INPUT).report).toLowerCase();

  const forbidden = [
    "certified",
    "guaranteed",
    "approval",
    "defect-free",
    "detects all",
    "final acceptance",
  ];

  for (const term of forbidden) {
    it(`does not include '${term}'`, () => {
      expect(json).not.toContain(term);
    });
  }

  it("does not contain RUN_OK or RUN OK", () => {
    expect(json).not.toContain("RUN_OK");
    expect(json).not.toContain("RUN OK");
  });
});

/* ── 5. No PDF/credit/OpenAI imports ── */

describe("report preview — import integrity", () => {
  it("report source files do not import openai or deepseek", () => {
    const reportDir = resolve(__dirname, "..", "report");
    const files = readdirSync(reportDir).filter(
      (f: string) => f.endsWith(".ts") && f !== "index.ts"
    );
    for (const file of files) {
      const content = readFileSync(join(reportDir, file), "utf-8");
      expect(content).not.toMatch(/from\s+["']openai["']/);
      expect(content).not.toMatch(/from\s+["']deepseek["']/);
      expect(content).not.toMatch(/from\s+["']@?openai\//);
      expect(content).not.toMatch(/from\s+["']@?deepseek\//);
    }
  });

  it("report preview API route does not import openai, deepseek, pdf, or credit", () => {
    const routePath = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "app",
      "api",
      "engineering-diagnostics",
      "report-preview",
      "route.ts"
    );
    const content = readFileSync(routePath, "utf-8");
    expect(content).not.toMatch(/from\s+["']openai["']/);
    expect(content).not.toMatch(/from\s+["']deepseek["']/);
    expect(content).not.toMatch(/from\s+["']@?openai\//);
    expect(content).not.toMatch(/from\s+["']@?deepseek\//);
    expect(content).not.toContain("pdf");
    expect(content).not.toContain("credit");
  });
});

/* ── Determinism ── */

describe("report preview — determinism", () => {
  it("produces same report_id and decision data for same input", () => {
    const r1 = buildPreviewResponse(BASE_INPUT);
    const r2 = buildPreviewResponse(BASE_INPUT);
    expect(r1.report.report_id).toBe(r2.report.report_id);
    expect(r1.report.decision_section.total_risk_score).toBe(
      r2.report.decision_section.total_risk_score
    );
    expect(r1.report.decision_section.decision).toBe(
      r2.report.decision_section.decision
    );
  });
});

/* ── Version fields ── */

describe("report preview — version fields", () => {
  const { report } = buildPreviewResponse(BASE_INPUT);
  it("schema_version = 2.0.0", () => expect(report.schema_version).toBe("2.0.0"));
  it("engine_version = 1.0.0", () => expect(report.engine_version).toBe("1.0.0"));
  it("methodology_version = 1.0.0", () => expect(report.methodology_version).toBe("1.0.0"));
});
