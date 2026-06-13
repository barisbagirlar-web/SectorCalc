import fs from "node:fs";
import path from "node:path";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { PREMIUM_SCHEMA_SLUG_MAP } from "@/lib/premium-schema/schema-registry";
import { ERT_PROBLEM_SLUG } from "@/lib/ai/deepseek/formula-audit-collector";
import type { P24ToolRow, ExtendedAuditCounts } from "@/lib/ai/deepseek/bulk-tool-repair-types";

const ROOT = process.cwd();
const P24_REPORT_PATH = path.join(ROOT, "scripts/.cache/p24-tool-quality-report.json");
const ERT_REPORT_PATH = path.join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");
const QUARANTINE_RECOVERY_PATH = path.join(ROOT, "scripts/.cache/quarantine-recovery-report.json");
const INPUT_GUIDE_AUDIT_PATH = path.join(ROOT, "scripts/.cache/input-guide-audit-report.json");
const BULK_REPAIR_REPORT_PATH = path.join(ROOT, "scripts/.cache/deepseek/bulk-tool-repair-report.json");
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

function loadQuarantineRecoverySlugs(): Set<string> {
  const report = readJson<{
    items?: Array<{ slug: string; recommendedAction?: string; repairDifficulty?: string }>;
  }>(QUARANTINE_RECOVERY_PATH);
  return new Set(
    (report?.items ?? [])
      .filter(
        (item) =>
          (item.recommendedAction === "recover_now" ||
            item.recommendedAction === "send_to_batch") &&
          item.repairDifficulty !== "critical",
      )
      .map((item) => item.slug),
  );
}

function loadGuideBlockedSlugs(): Set<string> {
  const report = readJson<{
    items?: Array<{ slug: string; decision?: string }>;
  }>(INPUT_GUIDE_AUDIT_PATH);
  return new Set(
    (report?.items ?? [])
      .filter(
        (item) =>
          item.decision === "needs_spec" ||
          item.decision === "generic_blocked" ||
          item.decision === "manual_design_review",
      )
      .map((item) => item.slug),
  );
}

function loadBatch1RemainingSlugs(): Set<string> {
  const report = readJson<{
    items?: Array<{ slug: string; repairDecision?: string; riskLevel?: string }>;
  }>(BULK_REPAIR_REPORT_PATH);
  return new Set(
    (report?.items ?? [])
      .filter(
        (item) =>
          item.repairDecision === "auto_apply" &&
          item.riskLevel !== "high" &&
          item.riskLevel !== "critical",
      )
      .map((item) => item.slug),
  );
}

function scoreTool(row: P24ToolRow, quarantineRecovery: Set<string>, guideBlocked: Set<string>): number {
  if (row.verdict === "PASS") {
    return -1;
  }

  const findings = row.findings ?? [];
  const failIds = findings.filter((f) => f.severity === "fail").map((f) => f.checkId);
  const warnIds = findings.filter((f) => f.severity === "warn").map((f) => f.checkId);

  if (failIds.includes("requiredInputs")) {
    const msg = findings.find((f) => f.checkId === "requiredInputs")?.message ?? "";
    if (/no calculator/i.test(msg)) {
      return -1;
    }
  }

  if (failIds.includes("formulaContractAlignment")) {
    return 10;
  }

  let score = 0;

  if (quarantineRecovery.has(row.slug)) {
    score += 45;
  }
  if (
    guideBlocked.has(row.slug) &&
    (row.tier === "premium-schema" || row.tier === "premium") &&
    row.verdict !== "QUARANTINE"
  ) {
    score += 25;
  }
  if (row.verdict === "QUARANTINE" && quarantineRecovery.has(row.slug)) {
    score += 35;
  } else if (row.verdict === "QUARANTINE") {
    return -1;
  }

  if (row.tier === "premium-schema" && row.routePath) {
    score += 40;
  }
  if (row.verdict === "WARN") {
    score += 30;
  }
  if (row.verdict === "FAIL" && failIds.length === 1 && failIds[0] === "validation") {
    score += 35;
  }

  for (const id of ["localeKeys", "arRtl", "canonicalUnit", "globalSanityTests"]) {
    if (warnIds.includes(id) || failIds.includes(id)) {
      score += 15;
    }
  }

  if (failIds.includes("validation") && !failIds.includes("formulaContractAlignment")) {
    score += 20;
  }

  return score;
}

export function selectBulkRepairSlugs(limit: number): P24ToolRow[] {
  const paymentEligible = loadPaymentEligibleSlugs();
  const quarantineRecovery = loadQuarantineRecoverySlugs();
  const guideBlocked = loadGuideBlockedSlugs();
  const batch1Remaining = loadBatch1RemainingSlugs();

  const rows = loadP24Tools()
    .filter((row) => {
      if (!row.slug || PROTECTED_SLUGS.has(row.slug)) {
        return false;
      }
      if (paymentEligible.has(row.slug)) {
        return false;
      }
      if (HIGH_RISK_PATTERNS.some((pattern) => pattern.test(row.slug))) {
        return false;
      }

      const score = scoreTool(row, quarantineRecovery, guideBlocked);
      const batch1Candidate = batch1Remaining.has(row.slug);
      return score > 0 || batch1Candidate;
    })
    .sort((a, b) => {
      const scoreA =
        scoreTool(a, quarantineRecovery, guideBlocked) + (batch1Remaining.has(a.slug) ? 20 : 0);
      const scoreB =
        scoreTool(b, quarantineRecovery, guideBlocked) + (batch1Remaining.has(b.slug) ? 20 : 0);
      return scoreB - scoreA || a.slug.localeCompare(b.slug);
    });

  return rows.slice(0, limit);
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
  const findings = (row.findings ?? [])
    .filter((f) => f.severity === "warn" || f.severity === "fail")
    .map((f) => `${f.checkId}: ${f.message ?? ""}`);

  const unitFinding = (row.findings ?? []).find((f) => f.checkId === "canonicalUnit");
  const unitIssues =
    unitFinding?.message?.match(/[\w.]+:[^,\s]+/g)?.map((token) => token.trim()) ?? [];

  const localeCoverage = Object.fromEntries(
    LOCALE_FILES.map((locale) => [locale, hasLocaleKey(row.slug, locale)]),
  ) as Record<string, boolean>;

  const paidSlug =
    Object.entries(PREMIUM_SCHEMA_SLUG_MAP).find(([, schemaId]) => schemaId === row.slug)?.[0] ??
    (PREMIUM_SCHEMA_SLUG_MAP[row.slug] ? row.slug : null);
  const schemaId = PREMIUM_SCHEMA_SLUG_MAP[row.slug] ?? row.slug;

  return {
    slug: row.slug,
    tier: row.tier ?? "unknown",
    route: row.routePath ?? "",
    p24Status: row.verdict ?? "UNKNOWN",
    runtimeTrustStatus: ertMap.get(row.slug) ?? null,
    findings,
    formulaContractExists: Boolean(getFormulaContractBySlug(row.slug)),
    validationExists: validationExists(row.slug),
    formSchemaExists: Boolean(row.evidence?.schemaPath),
    submitHandlerExists: row.tier === "premium-schema" || row.tier === "premium",
    resultRendererExists: row.tier === "premium-schema" || row.tier === "premium",
    localeCoverage,
    unitIssues,
    guideStatus: findings.some((f) => f.startsWith("generic_input_guide")) ? "generic" : "ok",
    knownFormulaAuditFindings: findings.filter((f) => /formula|validation|contract/i.test(f)),
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
