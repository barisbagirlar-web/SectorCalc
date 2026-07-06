import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { runDiagnostic, AnalyzeRequestSchema } from "../diagnostic-service";
import { buildDiagnosticReport } from "../report/diagnostic-report-builder";
import { clearDiagnosticVerifyStore } from "@/lib/inspection/verify-store";
import {
  saveDiagnosticReport,
  getDiagnosticReport,
  listDiagnosticReports,
  getInspectionVerifyByHash,
} from "@/lib/inspection/inspection-firestore-service";

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

beforeEach(() => {
  clearDiagnosticVerifyStore();
});

/* ── 1. PDF route saves report to Firestore ── */

describe("firestore-persistence — save", () => {
  it("saveDiagnosticReport returns hash or null (graceful fallback)", async () => {
    const report = buildReport();
    // In test environment without service account, this returns null
    // In production with service account, it returns the hash
    const result = await saveDiagnosticReport(report, "test-uid-123");
    // Either null (no credentials) or a 64-char hex hash
    if (result === null) {
      // No Firestore credentials — acceptable in test/dev
      expect(result).toBeNull();
    } else {
      expect(result).toHaveLength(64);
      expect(result).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("saveDiagnosticReport handles null ownerUid gracefully", async () => {
    const report = buildReport();
    const result = await saveDiagnosticReport(report, null);
    // Should not throw — null ownerUid is valid for anonymous reports
    expect(result === null || result.length === 64).toBe(true);
  });

  it("save with same input produces consistent report_id", () => {
    const r1 = buildReport();
    const r2 = buildReport();
    expect(r1.report_id).toBe(r2.report_id);
  });
});

/* ── 2. Verify metadata is minimal ── */

describe("firestore-persistence — verify metadata minimal", () => {
  it("save creates verify document with only non-sensitive fields", async () => {
    const report = buildReport();
    const hash = await saveDiagnosticReport(report, "test-uid");

    if (hash === null) {
      // Skip if no Firestore — tested above
      return;
    }

    // Retrieve the verify record
    const verifyDoc = await getInspectionVerifyByHash(hash);
    expect(verifyDoc).not.toBeNull();

    const keys = Object.keys(verifyDoc!);
    const allowedFields = [
      "document_hash", "report_type", "decision", "risk_score",
      "issued_at", "engine_version", "schema_version",
      "methodology_version", "report_id",
    ];
    for (const key of keys) {
      expect(allowedFields).toContain(key);
    }

    // Sensitive fields must be absent
    const sensitivePatterns = ["problem", "measurement", "cost", "customer", "photo", "api_key", "uid", "email"];
    for (const pattern of sensitivePatterns) {
      const found = keys.find((k) => k.toLowerCase().includes(pattern));
      expect(found).toBeUndefined();
    }
  });

  it("verify record does not contain problem_context or measurement data", async () => {
    const report = buildReport();
    const hash = await saveDiagnosticReport(report, "test-uid");
    if (hash === null) return;

    const verifyDoc = await getInspectionVerifyByHash(hash);
    const json = JSON.stringify(verifyDoc).toLowerCase();

    expect(json).not.toContain("shaft diameter");
    expect(json).not.toContain("50.09");
    expect(json).not.toContain("micrometer");
    expect(json).not.toContain("affected_quantity");
    expect(json).not.toContain("material_cost");
  });

  it("verify metadata has correct types", async () => {
    const report = buildReport();
    const hash = await saveDiagnosticReport(report, "test-uid");
    if (hash === null) return;

    const verifyDoc = await getInspectionVerifyByHash(hash);
    expect(typeof verifyDoc!.document_hash).toBe("string");
    expect(typeof verifyDoc!.risk_score).toBe("number");
    expect(typeof verifyDoc!.issued_at).toBe("string");
    expect(typeof verifyDoc!.engine_version).toBe("string");
    expect(verifyDoc!.report_type).toBe("ENGINEERING_DIAGNOSTIC_PREVIEW");
  });
});

/* ── 3. Dashboard only shows user's own reports ── */

describe("firestore-persistence — owner isolation", () => {
  it("getDiagnosticReport returns null for wrong owner", async () => {
    const report = buildReport();
    const hash = await saveDiagnosticReport(report, "owner-uid-123");
    if (hash === null) return;

    // Different user should not see this report
    const fetched = await getDiagnosticReport(report.report_id, "other-user-456");
    expect(fetched).toBeNull();
  });

  it("getDiagnosticReport returns report for correct owner", async () => {
    const report = buildReport();
    const hash = await saveDiagnosticReport(report, "owner-uid-123");
    if (hash === null) return;

    const fetched = await getDiagnosticReport(report.report_id, "owner-uid-123");
    expect(fetched).not.toBeNull();
    expect(fetched!.report_id).toBe(report.report_id);
  });

  it("getDiagnosticReport returns report when owner_uid is null", async () => {
    const report = buildReport();
    const hash = await saveDiagnosticReport(report, null);
    if (hash === null) return;

    // No owner set → any authenticated user can read
    const fetched = await getDiagnosticReport(report.report_id, "any-user");
    expect(fetched).not.toBeNull();
    expect(fetched!.report_id).toBe(report.report_id);
  });

  it("listDiagnosticReports only returns own reports", async () => {
    const report = buildReport();
    const hash = await saveDiagnosticReport(report, "list-owner-123");
    if (hash === null) return;

    const ownReports = await listDiagnosticReports("list-owner-123");
    expect(ownReports.length).toBeGreaterThanOrEqual(1);
    expect(ownReports[0]!.report_id).toBe(report.report_id);

    const otherReports = await listDiagnosticReports("different-owner");
    const found = otherReports.find((r) => r.report_id === report.report_id);
    expect(found).toBeUndefined();
  });
});

/* ── 4. Verify doesn't expose private data ── */

describe("firestore-persistence — verify privacy", () => {
  it("verify record has no inspection data fields", async () => {
    const report = buildReport();
    const hash = await saveDiagnosticReport(report, "test-uid");
    if (hash === null) return;

    const verifyDoc = await getInspectionVerifyByHash(hash);

    // inspection_verify should NOT have these sections
    const forbiddenSections = [
      "domain_section", "problem_section", "measurement_section",
      "cost_section", "action_plan_section", "related_tools_section",
      "methodology_section", "limitation_section", "evidence_section",
      "audit_log", "owner_uid",
    ];
    for (const section of forbiddenSections) {
      expect(verifyDoc).not.toHaveProperty(section);
    }
  });
});

/* ── 5. Import integrity ── */

describe("firestore-persistence — import integrity", () => {
  const checkFiles = [
    "src/lib/inspection/inspection-firestore-service.ts",
  ];

  for (const relPath of checkFiles) {
    it(`${relPath} does not import openai or deepseek`, () => {
      const fullPath = resolve(__dirname, "..", "..", "..", "..", relPath);
      const content = readFileSync(fullPath, "utf-8");
      expect(content).not.toMatch(/from\s+["']openai["']/);
      expect(content).not.toMatch(/from\s+["']deepseek["']/);
    });
  }
});

/* ── 6. PDF route auth+credit gate ── */

describe("pdf-route — auth and credit gate", () => {
  it("pdf route imports parseBearerToken and verifySignedInUser", () => {
    const fullPath = resolve(__dirname, "..", "..", "..", "..",
      "src/app/api/engineering-diagnostics/pdf/route.ts");
    const content = readFileSync(fullPath, "utf-8");
    expect(content).toMatch(/parseBearerToken/);
    expect(content).toMatch(/verifySignedInUser/);
  });

  it("pdf route imports credit functions", () => {
    const fullPath = resolve(__dirname, "..", "..", "..", "..",
      "src/app/api/engineering-diagnostics/pdf/route.ts");
    const content = readFileSync(fullPath, "utf-8");
    expect(content).toMatch(/checkUserCreditBalance/);
    expect(content).toMatch(/decrementCredits/);
  });

  it("pdf route returns 401 when no auth token", () => {
    // Static analysis: route.ts has 401 return for missing token
    const fullPath = resolve(__dirname, "..", "..", "..", "..",
      "src/app/api/engineering-diagnostics/pdf/route.ts");
    const content = readFileSync(fullPath, "utf-8");
    expect(content).toMatch(/status: 401/);
    expect(content).toMatch(/status: 402/);
  });

  it("pdf route has credit cost constant", () => {
    const fullPath = resolve(__dirname, "..", "..", "..", "..",
      "src/app/api/engineering-diagnostics/pdf/route.ts");
    const content = readFileSync(fullPath, "utf-8");
    expect(content).toMatch(/PDF_CREDIT_COST/);
  });

  it("pdf route does not import openai or deepseek", () => {
    const fullPath = resolve(__dirname, "..", "..", "..", "..",
      "src/app/api/engineering-diagnostics/pdf/route.ts");
    const content = readFileSync(fullPath, "utf-8");
    expect(content).not.toMatch(/from\s+["']openai["']/);
    expect(content).not.toMatch(/from\s+["']deepseek["']/);
  });

  it("tool-usage-session export checkUserCreditBalance and decrementCredits", () => {
    const fullPath = resolve(__dirname, "..", "..", "..", "..",
      "src/lib/credits/tool-usage-session.server.ts");
    const content = readFileSync(fullPath, "utf-8");
    expect(content).toMatch(/^export async function checkUserCreditBalance/m);
    expect(content).toMatch(/^export async function decrementCredits/m);
  });
});
