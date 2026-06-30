import fs from "node:fs";
import path from "node:path";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { PREMIUM_SCHEMA_SLUG_MAP } from "@/lib/features/premium-schema/schema-registry";
import { ERT_PROBLEM_SLUG } from "@/lib/features/ai/deepseek/formula-audit-collector";
import type {
  ControlPlaneTool,
  ExtendedAuditCounts,
  P24ToolRow,
  SelectionDiagnostics,
} from "@/lib/features/ai/deepseek/bulk-tool-repair-types";

const ROOT = process.cwd();
const P24_REPORT_PATH = path.join(ROOT, "scripts/.cache/p24-tool-quality-report.json");
const ERT_REPORT_PATH = path.join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");
const CONTROL_PLANE_REPORT_PATH = path.join(ROOT, "scripts/.cache/tool-quality-control-plane.json");
const LOCALE_FILES = ["en", "tr", "de", "fr", "es", "ar"] as const;

const PROTECTED_SLUGS = new Set([ERT_PROBLEM_SLUG]);

const HIGH_RISK_PATTERNS = [
  /pressure-vessel/i,
  /welded-bolted/i,
  /structural/i,
  /electrical-panel/i,
  /fire-system/i,
  /legal-interest/i,
  /cbam-compliance/i,
];

const APPLICABLE_REPAIR_PATTERNS = [
  /missing validation/i,
  /validation-module/i,
  /validation:/i,
  /no schema/i,
  /missing schema/i,
  /schema:/i,
  /result renderer/i,
  /submit handler/i,
  /localekeys/i,
  /arrtl/i,
  /canonicalunit/i,
  /unitmapping/i,
  /generic.*guide/i,
  /freepremiumsplit/i,
  /formulacontractalignment/i,
  /contract alignment/i,
  /boundarytests/i,
  /globalsanitytests/i,
  /requiredinputs/i,
  /unit issue/i,
];

function readJson<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function loadP24Tools(): P24ToolRow[] {
  const report = readJson<{ tools?: P24ToolRow[] }>(P24_REPORT_PATH);
  return report?.tools ?? [];
}

function loadControlPlaneTools(): ControlPlaneTool[] {
  const report = readJson<{ tools?: ControlPlaneTool[] }>(CONTROL_PLANE_REPORT_PATH);
  return report?.tools ?? [];
}

export function loadControlPlaneMap(): Map<string, ControlPlaneTool> {
  return new Map(loadControlPlaneTools().map((tool) => [tool.slug, tool]));
}

function loadErtStatusMap(): Map<string, string> {
  const report = readJson<{ items?: Array<{ slug: string; status?: string }> }>(ERT_REPORT_PATH);
  const map = new Map<string, string>();
  for (const row of report?.items ?? []) {
    if (row.slug) {
      map.set(row.slug, row.status ?? "unknown");
    }
  }
  return map;
}

function loadPaymentEligibleSlugs(): Set<string> {
  const report = readJson<{ items?: Array<{ slug: string; paymentEligible?: boolean }> }>(
    ERT_REPORT_PATH,
  );
  return new Set(
    (report?.items ?? []).filter((item) => item.paymentEligible).map((item) => item.slug),
  );
}

function hasLocaleKey(slug: string, locale: string): boolean {
  const filePath = path.join(ROOT, `messages/${locale}.json`);
  if (!fs.existsSync(filePath)) {
    return false;
  }
  const payload = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
    freeToolInputs?: Record<string, unknown>;
  };
  return Boolean(payload.freeToolInputs?.[slug]);
}

export function hasPremiumSchemaI18nEntry(slug: string): boolean {
  const content = fs.readFileSync(path.join(ROOT, "src/data/premium-schema-i18n.ts"), "utf8");
  return new RegExp(`"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{`).test(content);
}

function validationExists(slug: string): boolean {
  const canonical = PREMIUM_SCHEMA_SLUG_MAP[slug] ?? slug;
  const candidates = [
    path.join(ROOT, `src/lib/premium-schema/calculators/${canonical}-validation.ts`),
    path.join(ROOT, `src/lib/premium-schema/calculators/${slug}-validation.ts`),
  ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

function hasPaymentSecurityBlocker(tool: ControlPlaneTool, paymentEligible: Set<string>): boolean {
  if (!tool.slug || PROTECTED_SLUGS.has(tool.slug)) {
    return true;
  }
  if (paymentEligible.has(tool.slug)) {
    return true;
  }
  if (tool.tier === "free" && tool.eligible?.paymentEligible) {
    return true;
  }
  if (HIGH_RISK_PATTERNS.some((pattern) => pattern.test(tool.slug))) {
    return true;
  }
  const findingsText = (tool.findings ?? []).join(" ").toLowerCase();
  if (/safety-critical|certification|legal claim|payment mismatch/i.test(findingsText)) {
    return true;
  }
  return false;
}

function hasApplicableRepairReason(tool: ControlPlaneTool): boolean {
  const findingsText = (tool.findings ?? []).join(" ").toLowerCase();

  const structural =
    (tool.tier === "premium-schema" || tool.tier === "premium") &&
    (!tool.validation?.exists ||
      !tool.schema?.exists ||
      !tool.resultRenderer?.exists ||
      !tool.submitHandler?.exists);

  const i18nGap = tool.i18n?.complete === false || tool.i18n?.mixedLabel === true;
  const unitGap = (tool.formulaContract?.unitIssues?.length ?? 0) > 0;
  const contractGap = tool.formulaContract?.aligned === false;
  const guideGap = tool.guide?.genericGuideBlocked === true || tool.guide?.hasSpec === false;

  if (structural || i18nGap || unitGap || contractGap || guideGap) {
    return true;
  }

  return APPLICABLE_REPAIR_PATTERNS.some((pattern) => pattern.test(findingsText));
}

function rankControlPlaneTool(tool: ControlPlaneTool): number {
  let score = 0;
  if (tool.repairDifficulty === "low") {
    score += 100;
  } else if (tool.repairDifficulty === "medium") {
    score += 50;
  }
  if (tool.revenuePotential === "high") {
    score += 30;
  } else if (tool.revenuePotential === "medium") {
    score += 15;
  }
  score -= tool.severityScore ?? 0;
  return score;
}

function buildSelectionDiagnostics(
  selected: ControlPlaneTool[],
): SelectionDiagnostics {
  return {
    selectedCount: selected.length,
    selectedAutoRepair: selected.filter((t) => t.recommendedAction === "auto_repair").length,
    selectedLow: selected.filter((t) => t.repairDifficulty === "low").length,
    selectedMedium: selected.filter((t) => t.repairDifficulty === "medium").length,
    selectedQuarantine: selected.filter((t) => t.runtimeStatus === "quarantine").length,
    selectedManualReview: selected.filter((t) => t.recommendedAction === "manual_review").length,
  };
}

function controlPlaneFindingToP24(finding: string): {
  checkId: string;
  severity: string;
  message?: string;
} {
  const colon = finding.indexOf(":");
  if (colon === -1) {
    return { checkId: "controlPlane", severity: "warn", message: finding };
  }
  return {
    checkId: finding.slice(0, colon).trim(),
    severity: "warn",
    message: finding.slice(colon + 1).trim(),
  };
}

function synthesizeP24RowFromControlPlane(tool: ControlPlaneTool): P24ToolRow {
  return {
    slug: tool.slug,
    tier: tool.tier,
    verdict: tool.qualityStatus,
    routePath: tool.route,
    findings: (tool.findings ?? []).map(controlPlaneFindingToP24),
  };
}
function isAutoRepairSelectionCandidate(
  tool: ControlPlaneTool,
  paymentEligible: Set<string>,
): boolean {
  if (tool.recommendedAction !== "auto_repair") {
    return false;
  }
  if (tool.repairDifficulty !== "low" && tool.repairDifficulty !== "medium") {
    return false;
  }
  if (tool.runtimeStatus === "quarantine") {
    return false;
  }
  if (tool.qualityStatus === "PASS") {
    return false;
  }
  if (hasPaymentSecurityBlocker(tool, paymentEligible)) {
    return false;
  }
  if (!hasApplicableRepairReason(tool)) {
    return false;
  }
  return true;
}

export function selectBulkRepairBatch(limit: number): {
  rows: P24ToolRow[];
  selectionDiagnostics: SelectionDiagnostics;
} {
  const paymentEligible = loadPaymentEligibleSlugs();
  const controlPlaneTools = loadControlPlaneTools();
  const p24BySlug = new Map(loadP24Tools().map((row) => [row.slug, row]));

  const candidates = controlPlaneTools
    .filter((tool) => isAutoRepairSelectionCandidate(tool, paymentEligible))
    .sort((a, b) => rankControlPlaneTool(b) - rankControlPlaneTool(a) || a.slug.localeCompare(b.slug));

  const seen = new Set<string>();
  const selectedTools: ControlPlaneTool[] = [];
  for (const tool of candidates) {
    if (seen.has(tool.slug)) {
      continue;
    }
    seen.add(tool.slug);
    selectedTools.push(tool);
    if (selectedTools.length >= limit) {
      break;
    }
  }

  const rows: P24ToolRow[] = [];
  for (const tool of selectedTools) {
    const p24Row = p24BySlug.get(tool.slug) ?? synthesizeP24RowFromControlPlane(tool);
    rows.push(p24Row);
  }

  return {
    rows,
    selectionDiagnostics: buildSelectionDiagnostics(selectedTools),
  };
}

export function selectBulkRepairSlugs(limit: number): P24ToolRow[] {
  return selectBulkRepairBatch(limit).rows;
}

export function buildBulkRepairContext(row: P24ToolRow): {
  slug: string;
  tier: string;
  route: string;
  p24Status: string;
  runtimeTrustStatus: string | null;
  findings: string[];
  formulaContractExists: boolean;
  validationExists: boolean;
  formSchemaExists: boolean;
  submitHandlerExists: boolean;
  resultRendererExists: boolean;
  localeCoverage: Record<string, boolean>;
  unitIssues: string[];
  guideStatus: string;
  knownFormulaAuditFindings: string[];
  schemaPath: string | null;
  dedicatedTests: string[];
  schemaId: string;
  paidSlug: string | null;
} {
  const ertMap = loadErtStatusMap();
  const controlPlane = loadControlPlaneMap().get(row.slug);
  const findings = (row.findings ?? [])
    .filter((f) => f.severity === "warn" || f.severity === "fail")
    .map((f) => `${f.checkId}: ${f.message ?? ""}`);

  const unitFinding = (row.findings ?? []).find((f) => f.checkId === "canonicalUnit");
  const unitIssuesFromFinding =
    unitFinding?.message?.match(/[\w.]+:[^,\s]+/g)?.map((token) => token.trim()) ?? [];
  const unitIssuesFromControlPlane = controlPlane?.formulaContract?.unitIssues ?? [];
  const unitIssues = unitIssuesFromFinding.length > 0 ? unitIssuesFromFinding : unitIssuesFromControlPlane;

  const localeCoverage = Object.fromEntries(
    LOCALE_FILES.map((locale) => [locale, hasLocaleKey(row.slug, locale)]),
  ) as Record<string, boolean>;

  const paidSlug =
    Object.entries(PREMIUM_SCHEMA_SLUG_MAP).find(([, schemaId]) => schemaId === row.slug)?.[0] ??
    (PREMIUM_SCHEMA_SLUG_MAP[row.slug] ? row.slug : null);
  const schemaId = PREMIUM_SCHEMA_SLUG_MAP[row.slug] ?? row.slug;

  const validationFromControlPlane = controlPlane?.validation?.exists ?? false;
  const schemaFromControlPlane = controlPlane?.schema?.exists ?? false;

  return {
    slug: row.slug,
    tier: row.tier ?? "unknown",
    route: row.routePath ?? controlPlane?.route ?? "",
    p24Status: row.verdict ?? "UNKNOWN",
    runtimeTrustStatus: ertMap.get(row.slug) ?? controlPlane?.runtimeStatus ?? null,
    findings,
    formulaContractExists: Boolean(getFormulaContractBySlug(row.slug)) || Boolean(controlPlane?.formulaContract?.exists),
    validationExists: validationExists(row.slug) || validationFromControlPlane,
    formSchemaExists: Boolean(row.evidence?.schemaPath) || schemaFromControlPlane,
    submitHandlerExists: controlPlane
      ? Boolean(controlPlane.submitHandler?.exists)
      : row.tier !== "premium" && row.tier !== "premium-schema",
    resultRendererExists: controlPlane
      ? Boolean(controlPlane.resultRenderer?.exists)
      : row.tier !== "premium" && row.tier !== "premium-schema",
    localeCoverage,
    unitIssues,
    guideStatus:
      controlPlane?.guide?.genericGuideBlocked ||
      findings.some((f) => f.startsWith("generic_input_guide"))
        ? "generic"
        : "ok",
    knownFormulaAuditFindings: findings.filter((f) => /formula|validation|contract|boundary/i.test(f)),
    schemaPath: row.evidence?.schemaPath ?? null,
    dedicatedTests: row.evidence?.dedicatedTests ?? [],
    schemaId,
    paidSlug,
  };
}

export function readAuditCounts(): ExtendedAuditCounts {
  const tools = loadP24Tools();
  const report = readJson<{
    summary?: { paymentEligible?: number; formulaGateEligible?: number; freePaymentEligible?: number };
  }>(ERT_REPORT_PATH);

  return {
    PASS: tools.filter((t) => t.verdict === "PASS").length,
    WARN: tools.filter((t) => t.verdict === "WARN").length,
    FAIL: tools.filter((t) => t.verdict === "FAIL").length,
    QUARANTINE: tools.filter((t) => t.verdict === "QUARANTINE").length,
    paymentEligible: report?.summary?.paymentEligible ?? loadPaymentEligibleSlugs().size,
    formulaGateEligible: report?.summary?.formulaGateEligible ?? 0,
    freePaymentEligible: report?.summary?.freePaymentEligible ?? 0,
  };
}
