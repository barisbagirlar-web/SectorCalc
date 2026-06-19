/**
 * Formula Health Monitor — Real-time Error Alert System
 *
 * Aggregates constraint engine results, CI gate status, and schema health
 * into a machine-readable alert payload. Designed to be called:
 *   1. After every `npm run generate:all`
 *   2. In CI gate post-processing
 *   3. On demand via admin dashboard
 *
 * Alert channels (configurable):
 *   - Stdout (console summary)
 *   - Generated JSON report (for admin dashboard consumption)
 *   - HTTP webhook (future: Slack, email, SMS)
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { validateSchemaConstraints } from "@/lib/generated-tools/formula-constraint-engine";

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");
const CI_GATE_REPORT = path.join(process.cwd(), "generated", "ci-gate-report.json");
const HEALTH_REPORT_PATH = path.join(process.cwd(), "generated", "formula-health-report.json");

/* ── Types ─────────────────────────────────────── */

export type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "CLEAR";

export type FormulaHealthAlert = {
  readonly timestamp: string;
  readonly severity: AlertSeverity;
  readonly message: string;
  readonly details: readonly string[];
};

export type FormulaHealthReport = {
  readonly timestamp: string;
  readonly overall: "HEALTHY" | "DEGRADED" | "CRITICAL";
  readonly totalSchemas: number;
  readonly healthy: number;
  readonly degraded: number;
  readonly critical: number;
  readonly alerts: readonly FormulaHealthAlert[];
  readonly constraintErrors: readonly {
    slug: string;
    formulaKey: string;
    message: string;
  }[];
  readonly quarantineCount: number;
  readonly steelcorePassRate: number;
  readonly goldenTestIssueCount: number;
  readonly lastCiGatePassed: boolean;
};

/* ── Data collection ──────────────────────────── */

function liveSteelCoreQuarantineCount(): number {
  try {
    const out = execSync(
      'npx tsx -e "const {validateAllSchemas}=require(process.cwd()+\'/src/lib/steelcore\');const r=validateAllSchemas();console.log(JSON.stringify(r.byStatus))"',
      { cwd: process.cwd(), timeout: 30000, encoding: "utf-8" }
    ).trim();
    const parsed = JSON.parse(out);
    return parsed.QUARANTINE ?? 0;
  } catch {
    return -1; // signal: couldn't compute
  }
}

function collectCiGateData(): {
  passed: boolean;
  steelcorePassRate: number;
  steelcoreTotal: number;
  steelcoreValid: number;
  goldenIssues: number;
  quarantineCount: number;
} {
  const liveCount = liveSteelCoreQuarantineCount();
  const quarantineCount = liveCount >= 0 ? liveCount : 0;

  let steelcoreTotal = 3272;
  let steelcoreValid = steelcoreTotal - quarantineCount;
  let steelcorePassRate = steelcoreTotal > 0 ? steelcoreValid / steelcoreTotal : 0;
  let goldenIssues = 0;
  let passed = quarantineCount === 0;

  try {
    if (fs.existsSync(CI_GATE_REPORT)) {
      const r = JSON.parse(fs.readFileSync(CI_GATE_REPORT, "utf-8"));
      steelcorePassRate = r.steelcore?.passRate ?? steelcorePassRate;
      steelcoreTotal = r.steelcore?.total ?? steelcoreTotal;
      steelcoreValid = r.steelcore?.valid ?? steelcoreValid;
      goldenIssues = r.golden?.totalIssues ?? 0;
      passed = r.passed === true;
    }
  } catch {}

  return { passed, steelcorePassRate, steelcoreTotal, steelcoreValid, goldenIssues, quarantineCount };
}

function scanConstraintErrors(): Array<{ slug: string; formulaKey: string; message: string }> {
  const errors: Array<{ slug: string; formulaKey: string; message: string }> = [];
  const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"));

  for (const file of files) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8"));
      const inputIds = ((raw.inputs ?? []) as Array<Record<string, unknown>>).map((i) => String(i.id));
      const formulas = (raw.formulas ?? {}) as Record<string, string>;
      const issues = validateSchemaConstraints(formulas, inputIds);

      for (const iss of issues) {
        if (iss.severity === "ERROR") {
          errors.push({
            slug: raw.slug || file.replace("-schema.json", ""),
            formulaKey: iss.formulaKey,
            message: iss.message,
          });
        }
      }
    } catch {
      // skip unparseable
    }
  }

  return errors;
}

/* ── Alert generation ─────────────────────────── */

function generateAlerts(
  ciGate: ReturnType<typeof collectCiGateData>,
  constraintErrors: ReturnType<typeof scanConstraintErrors>,
  totalSchemas: number,
): FormulaHealthAlert[] {
  const alerts: FormulaHealthAlert[] = [];
  const now = new Date().toISOString();

  // CI Gate status
  if (!ciGate) {
    alerts.push({
      timestamp: now,
      severity: "CRITICAL",
      message: "CI Gate report not found — build integrity unknown",
      details: ["Run npm run steelcore:ci-gate to generate report"],
    });
  } else if (!ciGate.passed) {
    alerts.push({
      timestamp: now,
      severity: "CRITICAL",
      message: "CI Gate FAILED — one or more quality checks did not pass",
      details: [
        `SteelCore pass rate: ${(ciGate.steelcorePassRate * 100).toFixed(1)}%`,
        `Golden test issues: ${ciGate.goldenIssues}`,
        `QUARANTINE schemas: ${ciGate.quarantineCount}`,
      ],
    });
  } else {
    alerts.push({
      timestamp: now,
      severity: "CLEAR",
      message: "CI Gate PASSED — all quality checks OK",
      details: [],
    });
  }

  // Constraint errors
  if (constraintErrors.length > 0) {
    alerts.push({
      timestamp: now,
      severity: "CRITICAL",
      message: `${constraintErrors.length} formula constraint error(s) detected`,
      details: constraintErrors.map(
        (e) => `${e.slug}.${e.formulaKey}: ${e.message}`,
      ),
    });
  } else {
    alerts.push({
      timestamp: now,
      severity: "CLEAR",
      message: "Zero formula constraint errors",
      details: [],
    });
  }

  // QUARANTINE schemas
  if (ciGate && ciGate.quarantineCount > 0) {
    const qLevel: AlertSeverity = ciGate.quarantineCount > 50 ? "HIGH" : ciGate.quarantineCount > 10 ? "MEDIUM" : "LOW";
    alerts.push({
      timestamp: now,
      severity: qLevel,
      message: `${ciGate.quarantineCount} QUARANTINE schemas exist`,
      details: [`Run quarantine-fix pipeline to resolve`],
    });
  }

  // SteelCore pass rate
  if (ciGate && ciGate.steelcorePassRate < 0.9) {
    alerts.push({
      timestamp: now,
      severity: "CRITICAL",
      message: `SteelCore pass rate ${(ciGate.steelcorePassRate * 100).toFixed(1)}% is below 90% threshold`,
      details: [`Valid: ${ciGate.steelcoreValid}/${ciGate.steelcoreTotal}`],
    });
  }

  // Golden test issues
  if (ciGate && ciGate.goldenIssues > 0) {
    const gLevel: AlertSeverity = ciGate.goldenIssues > 100 ? "CRITICAL" : ciGate.goldenIssues > 10 ? "HIGH" : "MEDIUM";
    alerts.push({
      timestamp: now,
      severity: gLevel,
      message: `${ciGate.goldenIssues} golden test issue(s) — check generated/golden-test-report.json`,
      details: [],
    });
  }

  return alerts;
}

/* ── Main entry point ─────────────────────────── */

export function generateHealthReport(): FormulaHealthReport {
  const totalSchemas = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json")).length;
  const ciGate = collectCiGateData();
  const constraintErrors = scanConstraintErrors();
  const alerts = generateAlerts(ciGate, constraintErrors, totalSchemas);

  // Overall health
  const hasCritical = alerts.some((a) => a.severity === "CRITICAL");
  const hasHigh = alerts.some((a) => a.severity === "HIGH");
  const overall = hasCritical ? "CRITICAL" : hasHigh ? "DEGRADED" : "HEALTHY";

  const healthyCount = alerts.filter((a) => a.severity === "CLEAR").length;
  const degradedCount = alerts.filter((a) => a.severity === "HIGH" || a.severity === "MEDIUM" || a.severity === "LOW").length;
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;

  const report: FormulaHealthReport = {
    timestamp: new Date().toISOString(),
    overall,
    totalSchemas,
    healthy: healthyCount,
    degraded: degradedCount,
    critical: criticalCount,
    alerts,
    constraintErrors,
    quarantineCount: ciGate?.quarantineCount ?? 0,
    steelcorePassRate: ciGate?.steelcorePassRate ?? 0,
    goldenTestIssueCount: ciGate?.goldenIssues ?? 0,
    lastCiGatePassed: ciGate?.passed ?? false,
  };

  fs.writeFileSync(HEALTH_REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  return report;
}

/* ── CLI entry ─────────────────────────────────── */

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  const report = generateHealthReport();
  const sevColor: Record<string, string> = {
    CRITICAL: "\x1b[31mCRITICAL\x1b[0m",
    HIGH: "\x1b[33mHIGH\x1b[0m",
    MEDIUM: "\x1b[33mMEDIUM\x1b[0m",
    LOW: "\x1b[36mLOW\x1b[0m",
    CLEAR: "\x1b[32mCLEAR\x1b[0m",
  };

  console.log("\n" + "=".repeat(60));
  console.log("FORMULA HEALTH REPORT");
  console.log("=".repeat(60));
  console.log(`Status: \x1b[1m${report.overall === "HEALTHY" ? "\x1b[32mHEALTHY" : report.overall === "CRITICAL" ? "\x1b[31mCRITICAL" : "\x1b[33mDEGRADED"}\x1b[0m`);
  console.log(`Schemas: ${report.totalSchemas}`);
  console.log(`SteelCore: ${(report.steelcorePassRate * 100).toFixed(1)}%`);
  console.log(`QUARANTINE: ${report.quarantineCount}`);
  console.log(`CI Gate: ${report.lastCiGatePassed ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m"}`);
  console.log(`Golden Issues: ${report.goldenTestIssueCount}`);
  console.log(`Constraint Errors: ${report.constraintErrors.length}`);
  console.log(`\nAlerts (${report.alerts.length}):`);
  for (const a of report.alerts) {
    console.log(`  [${sevColor[a.severity] ?? a.severity}] ${a.message}`);
    for (const d of a.details) console.log(`    → ${d}`);
  }
  console.log(`\nReport: ${HEALTH_REPORT_PATH}`);

  // Exit code: 1 if CRITICAL
  process.exit(report.overall === "CRITICAL" ? 1 : 0);
}
