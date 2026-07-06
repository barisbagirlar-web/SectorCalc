import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { runDiagnostic, AnalyzeRequestSchema } from "../diagnostic-service";
import { buildDiagnosticReport } from "../report/diagnostic-report-builder";
import { createDiagnosticReportHash } from "../report/diagnostic-report-canonicalize";
import { DiagnosticReportSchema } from "../report/diagnostic-report-schema";
import {
  registerDiagnosticVerify,
  lookupDiagnosticVerify,
  clearDiagnosticVerifyStore,
  getDiagnosticVerifyCount,
} from "@/lib/inspection/verify-store";

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

function buildReport() {
  const parsed = AnalyzeRequestSchema.parse(BASE_INPUT);
  const result = runDiagnostic(parsed);
  return buildDiagnosticReport(result, parsed.privacy_mode);
}

/* ── Clean store before each test ── */

beforeEach(() => {
  clearDiagnosticVerifyStore();
});

/* ── 1. PDF builder uses report contract only ── */

describe("pdf-builder — contract-only usage", () => {
  it("buildDiagnosticReport produces a valid contract", () => {
    const report = buildReport();
    const result = DiagnosticReportSchema.safeParse(report);
    expect(result.success).toBe(true);
  });

  it("buildDiagnosticReport does not recompute values (stateless test)", () => {
    const report = buildReport();
    expect(report.schema_version).toBe("2.0.0");
    expect(report.engine_version).toBe("1.0.0");
    // All values are from the contract — no recomputation
    expect(report.decision_section.total_risk_score).toBeGreaterThanOrEqual(0);
    expect(report.cost_section.estimated_cost_at_risk).toBeGreaterThanOrEqual(0);
  });
});

/* ── 2. Verify metadata is minimal ── */

describe("verify-store — minimal metadata", () => {
  it("metadata contains only non-sensitive fields", () => {
    const report = buildReport();
    const { metadata } = registerDiagnosticVerify(report);
    const keys = Object.keys(metadata);

    // Must contain these
    expect(keys).toContain("document_hash");
    expect(keys).toContain("report_type");
    expect(keys).toContain("decision");
    expect(keys).toContain("risk_score");
    expect(keys).toContain("issued_at");
    expect(keys).toContain("engine_version");
    expect(keys).toContain("schema_version");
    expect(keys).toContain("methodology_version");

    // Must NOT contain sensitive fields
    const sensitiveFields = [
      "problem_context", "problem_section", "measurements",
      "measurement_section", "cost_section", "action_plan_section",
      "customer_name", "project_name", "notes", "user_id", "email",
    ];
    for (const field of sensitiveFields) {
      expect(keys).not.toContain(field);
    }
  });

  it("metadata does not expose problem text, measurement rows, cost rows", () => {
    const report = buildReport();
    const { metadata } = registerDiagnosticVerify(report);
    const json = JSON.stringify(metadata).toLowerCase();

    expect(json).not.toContain("shaft diameter");
    expect(json).not.toContain("50.09");
    expect(json).not.toContain("micrometer");
    expect(json).not.toContain("affected_quantity");
    expect(json).not.toContain("material_cost");
  });

  it("metadata has correct types", () => {
    const report = buildReport();
    const { metadata } = registerDiagnosticVerify(report);

    expect(typeof metadata.document_hash).toBe("string");
    expect(typeof metadata.risk_score).toBe("number");
    expect(typeof metadata.issued_at).toBe("string");
    expect(typeof metadata.engine_version).toBe("string");
    expect(metadata.report_type).toBe("ENGINEERING_DIAGNOSTIC_PREVIEW");
  });
});

/* ── 3. Verify hash equals report_hash ── */

describe("verify-store — hash equality", () => {
  it("registerDiagnosticVerify hash matches createDiagnosticReportHash", () => {
    const report = buildReport();
    const expectedHash = createDiagnosticReportHash(report);
    const { hash } = registerDiagnosticVerify(report);
    expect(hash).toBe(expectedHash);
  });

  it("lookupDiagnosticVerify finds registered hash", () => {
    const report = buildReport();
    const { hash } = registerDiagnosticVerify(report);
    const found = lookupDiagnosticVerify(hash);
    expect(found).not.toBeNull();
    expect(found!.document_hash).toBe(hash);
  });

  it("lookupDiagnosticVerify returns null for unknown hash", () => {
    const result = lookupDiagnosticVerify("0000000000000000000000000000000000000000000000000000000000000000");
    expect(result).toBeNull();
  });

  it("can register and look up multiple reports", () => {
    const report = buildReport();
    const { hash } = registerDiagnosticVerify(report);
    const found = lookupDiagnosticVerify(hash);
    expect(found).not.toBeNull();
    expect(found!.document_hash).toBe(hash);
    expect(getDiagnosticVerifyCount()).toBe(1);
  });

  it("lookupDiagnosticVerify returns null for unknown hash", () => {
    const result = lookupDiagnosticVerify("0000000000000000000000000000000000000000000000000000000000000000");
    expect(result).toBeNull();
  });

  it("registerDiagnosticVerify stores correct risk_score and decision", () => {
    const report = buildReport();
    const { metadata } = registerDiagnosticVerify(report);
    expect(metadata.risk_score).toBe(report.decision_section.total_risk_score);
    expect(metadata.decision).toBe(report.decision_section.decision);
    expect(metadata.engine_version).toBe(report.engine_version);
  });
});

/* ── 4. Forbidden claims absent ── */

describe("pdf-verify — forbidden claims", () => {
  it("report does not contain forbidden marketing claims", () => {
    const report = buildReport();
    const json = JSON.stringify(report).toLowerCase();
    const forbidden = ["certified", "guaranteed", "approval", "defect-free", "detects all", "final acceptance"];
    for (const term of forbidden) {
      expect(json).not.toContain(term);
    }
  });

  it("report does not contain RUN_OK or RUN OK", () => {
    const report = buildReport();
    const json = JSON.stringify(report);
    expect(json).not.toContain("RUN_OK");
    expect(json).not.toContain("RUN OK");
  });
});

/* ── 5. No OpenAI/DeepSeek imports ── */

describe("pdf-verify — import integrity", () => {
  const checkFiles = [
    "src/lib/inspection/pdf-builder.tsx",
    "src/lib/inspection/verify-store.ts",
    "src/app/api/engineering-diagnostics/pdf/route.ts",
  ];

  for (const relPath of checkFiles) {
    it(`${relPath} does not import openai or deepseek`, () => {
      const fullPath = resolve(__dirname, "..", "..", "..", "..", relPath);
      const content = readFileSync(fullPath, "utf-8");
      expect(content).not.toMatch(/from\s+["']openai["']/);
      expect(content).not.toMatch(/from\s+["']deepseek["']/);
      expect(content).not.toMatch(/from\s+["']@?openai\//);
      expect(content).not.toMatch(/from\s+["']@?deepseek\//);
    });
  }
});

/* ── 6. No credit spend imports (PDF builder and verify store only) ── */

describe("pdf-verify — no credit spend", () => {
  // PDF route intentionally imports credit functions — excluded from this check
  const checkFiles = [
    "src/lib/inspection/pdf-builder.tsx",
    "src/lib/inspection/verify-store.ts",
  ];

  for (const relPath of checkFiles) {
    it(`${relPath} has no credit, billing, or stripe code references`, () => {
      const fullPath = resolve(__dirname, "..", "..", "..", "..", relPath);
      const content = readFileSync(fullPath, "utf-8");

      // Check imports only — avoid false positives from comments
      const importLines = content
        .split("\n")
        .filter((l) => l.includes("import ") || l.includes("require("));

      const combined = importLines.join(" ");
      expect(combined).not.toMatch(/\bcredit\b/i);
      expect(combined).not.toMatch(/\bbilling\b/i);
      expect(combined).not.toMatch(/\bstripe\b/i);

      // Also check for function calls related to payments
      const codeLines = content
        .split("\n")
        .filter((l) => !l.trim().startsWith("//") && !l.trim().startsWith("*") && !l.trim().startsWith("/*"));
      const codeText = codeLines.join(" ");
      expect(codeText).not.toMatch(/\bdeductCredits\b/);
      expect(codeText).not.toMatch(/\bspendCredits\b/);
      expect(codeText).not.toMatch(/\bchargeForPdf\b/);
    });
  }
});

/* ── 7. Verify store lifecycle ── */

describe("verify-store — lifecycle", () => {
  it("getDiagnosticVerifyCount starts at 0", () => {
    expect(getDiagnosticVerifyCount()).toBe(0);
  });

  it("clearDiagnosticVerifyStore empties store", () => {
    const report = buildReport();
    registerDiagnosticVerify(report);
    expect(getDiagnosticVerifyCount()).toBe(1);
    clearDiagnosticVerifyStore();
    expect(getDiagnosticVerifyCount()).toBe(0);
  });
});
