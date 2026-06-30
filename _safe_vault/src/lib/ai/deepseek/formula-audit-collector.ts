import fs from "node:fs";
import path from "node:path";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumSchemaForPaidSlug } from "@/lib/premium-schema/schema-registry";
import { ROADMAP_FREE_BATCH2_SPECS } from "@/lib/tools/roadmap-free-batch2-specs.generated";
import {
  getP24VerdictForSlug,
  P24_NON_PASS_VERDICTS,
  type P24AuditVerdict,
} from "@/lib/tools/runtime-readiness-p24-verdicts";
import { ERT_PROBLEM_SLUG, evaluateRuntimeTrust } from "@/lib/tools/runtime-trust-engine";
import type { FormulaAuditToolContext } from "@/lib/ai/deepseek/deepseek-types";

const ROOT = process.cwd();
const P24_REPORT_PATH = path.join(ROOT, "scripts/.cache/p24-tool-quality-report.json");
const ERT_REPORT_PATH = path.join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");

const P24_PRIORITY: Record<P24AuditVerdict, number> = {
  FAIL: 0,
  QUARANTINE: 1,
  WARN: 2,
  PASS: 99,
};

type P24ReportRow = {
  slug: string;
  verdict?: string;
  findings?: string[];
  issues?: string[];
};

type ErtReportRow = {
  slug: string;
  status?: string;
  findings?: string[];
};

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function loadP24FindingsMap(): Map<string, string[]> {
  const report = readJsonFile<{ tools?: P24ReportRow[]; items?: P24ReportRow[] }>(P24_REPORT_PATH);
  const map = new Map<string, string[]>();

  for (const row of report?.tools ?? report?.items ?? []) {
    if (!row.slug) {
      continue;
    }
    const findings = [...(row.findings ?? []), ...(row.issues ?? [])].filter(Boolean);
    if (findings.length > 0) {
      map.set(row.slug, findings);
    }
  }

  return map;
}

function loadErtReportMap(): Map<string, ErtReportRow> {
  const report = readJsonFile<{ items?: ErtReportRow[] }>(ERT_REPORT_PATH);
  const map = new Map<string, ErtReportRow>();

  for (const row of report?.items ?? []) {
    if (row.slug) {
      map.set(row.slug, row);
    }
  }

  return map;
}

function summarizeContract(slug: string): Record<string, unknown> | null {
  const contract = getFormulaContractBySlug(slug);
  if (!contract) {
    return null;
  }

  return {
    toolId: contract.toolId,
    slug: contract.slug,
    formulaSummary: contract.formulaSummary,
    requiredInputs: contract.requiredInputs,
    criticalInputs: contract.criticalInputs,
    outputs: contract.outputs,
    assumptions: contract.assumptions,
    validationRules: contract.validationRules,
  };
}

function summarizeInputSchema(slug: string): Record<string, unknown> | null {
  const premiumSchema = getPremiumSchemaForPaidSlug(slug);
  if (premiumSchema) {
    return {
      source: "premium-schema",
      id: premiumSchema.id,
      category: premiumSchema.category,
      inputs: premiumSchema.inputs.map((input) => ({
        id: input.id,
        label: input.label,
        unit: input.unit,
        min: input.validation?.min,
        max: input.validation?.max,
        required: input.required,
      })),
    };
  }

  const freeSpec = ROADMAP_FREE_BATCH2_SPECS[slug];
  if (freeSpec) {
    return {
      source: "roadmap-free-batch2",
      kind: freeSpec.kind,
      keys: freeSpec.keys,
      numerator: freeSpec.numerator,
      denominator: freeSpec.denominator,
      explanation: freeSpec.explanation,
    };
  }

  return null;
}

function rankP24Slugs(limit: number): string[] {
  return Object.entries(P24_NON_PASS_VERDICTS)
    .filter(([, verdict]) => verdict !== "PASS")
    .sort(([slugA, verdictA], [slugB, verdictB]) => {
      const priorityDiff = P24_PRIORITY[verdictA] - P24_PRIORITY[verdictB];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return slugA.localeCompare(slugB);
    })
    .slice(0, limit)
    .map(([slug]) => slug);
}

function rankErtSlugs(limit: number, ertMap: Map<string, ErtReportRow>): string[] {
  const fromReport = [...ertMap.values()]
    .filter((row) => row.status === "review" || row.status === "blocked")
    .sort((a, b) => {
      const weight = (status?: string) => (status === "blocked" ? 0 : 1);
      const diff = weight(a.status) - weight(b.status);
      if (diff !== 0) {
        return diff;
      }
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, limit)
    .map((row) => row.slug);

  if (fromReport.length >= limit) {
    return fromReport;
  }

  const fallback = [ERT_PROBLEM_SLUG];
  return [...new Set([...fromReport, ...fallback])].slice(0, limit);
}

export function selectFormulaAuditSlugs(maxTools = 10): string[] {
  const ertMap = loadErtReportMap();
  const selected: string[] = [ERT_PROBLEM_SLUG];

  for (const slug of rankP24Slugs(10)) {
    if (selected.length >= maxTools) {
      break;
    }
    if (!selected.includes(slug)) {
      selected.push(slug);
    }
  }

  for (const slug of rankErtSlugs(10, ertMap)) {
    if (selected.length >= maxTools) {
      break;
    }
    if (!selected.includes(slug)) {
      selected.push(slug);
    }
  }

  return selected.slice(0, maxTools);
}

export function buildFormulaAuditToolContexts(slugs: string[]): FormulaAuditToolContext[] {
  const p24FindingsMap = loadP24FindingsMap();
  const ertMap = loadErtReportMap();

  return slugs.map((slug) => {
    const ertReport = ertMap.get(slug);
    const ertDecision = evaluateRuntimeTrust({ slug, locale: "tr", surface: "premium" });

    return {
      slug,
      p24Verdict: getP24VerdictForSlug(slug),
      p24Findings: p24FindingsMap.get(slug) ?? [],
      ertStatus: ertReport?.status ?? ertDecision.status,
      ertFindings: [...(ertReport?.findings ?? []), ...ertDecision.findings],
      formulaContract: summarizeContract(slug),
      inputSchema: summarizeInputSchema(slug),
    };
  });
}

export { ERT_PROBLEM_SLUG };
