import fs from "node:fs";
import path from "node:path";
import { callDeepSeekJson, getDeepSeekClientConfig } from "@/lib/features/ai/deepseek/deepseek-client";
import type { JsonGuardResult } from "@/lib/features/ai/deepseek/deepseek-json-guard";
import { PREMIUM_SCHEMA_SLUG_MAP } from "@/lib/features/premium-schema/schema-registry";
import { ERT_PROBLEM_SLUG } from "@/lib/features/tools/runtime-trust-engine";
import { resolveToolFormInputKeys } from "@/lib/features/tool-guides/resolve-tool-form-input-keys";
import type { ToolGuideType } from "@/lib/features/tools/guide/tool-guide-types";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "scripts/.cache/deepseek/guide-spec-suggestions.json");
const CONTROL_PLANE_PATH = path.join(ROOT, "scripts/.cache/tool-quality-control-plane.json");
const KNOWLEDGE_GRAPH_PATH = path.join(ROOT, "scripts/.cache/formula-knowledge-graph.json");
const INPUT_GUIDE_AUDIT_PATH = path.join(ROOT, "scripts/.cache/input-guide-audit-report.json");

type GuideSpecSuggestionItem = {
  readonly slug: string;
  readonly guideType: ToolGuideType;
  readonly inputMap: Array<{
    readonly inputKey: string;
    readonly labelKey?: string;
    readonly unit?: string;
    readonly visualRole: string;
  }>;
  readonly visualRoleNotes: string[];
  readonly warningSuggestions: string[];
  readonly localeKeySuggestions: string[];
  readonly mustNotAutoApply: true;
};

type GuideSpecSuggestionEnvelope = {
  readonly taskType: "guide_spec";
  readonly generatedAt: string;
  readonly mustNotAutoApply: true;
  readonly status: "ok" | "unavailable" | "api_error";
  readonly suggestionUnavailable?: boolean;
  readonly errorCode?: string;
  readonly message?: string;
  readonly items: GuideSpecSuggestionItem[];
};

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

function validateGuideSpecEnvelope(parsed: unknown): JsonGuardResult<GuideSpecSuggestionEnvelope> {
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, reason: "missing_keys", message: "Envelope must be an object." };
  }

  const record = parsed as Record<string, unknown>;
  if (record.mustNotAutoApply !== true) {
    return { ok: false, reason: "must_not_auto_apply", message: "mustNotAutoApply must be true." };
  }

  const items = Array.isArray(record.items) ? record.items : [];
  const normalized: GuideSpecSuggestionItem[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const row = item as Record<string, unknown>;
    if (typeof row.slug !== "string" || typeof row.guideType !== "string") {
      continue;
    }
    normalized.push({
      slug: row.slug,
      guideType: row.guideType as ToolGuideType,
      inputMap: Array.isArray(row.inputMap)
        ? (row.inputMap as GuideSpecSuggestionItem["inputMap"])
        : [],
      visualRoleNotes: Array.isArray(row.visualRoleNotes)
        ? row.visualRoleNotes.filter((v): v is string => typeof v === "string")
        : [],
      warningSuggestions: Array.isArray(row.warningSuggestions)
        ? row.warningSuggestions.filter((v): v is string => typeof v === "string")
        : [],
      localeKeySuggestions: Array.isArray(row.localeKeySuggestions)
        ? row.localeKeySuggestions.filter((v): v is string => typeof v === "string")
        : [],
      mustNotAutoApply: true,
    });
  }

  return {
    ok: true,
    data: {
      taskType: "guide_spec",
      generatedAt: new Date().toISOString(),
      mustNotAutoApply: true,
      status: "ok",
      items: normalized,
    },
  };
}

function selectGuideSpecSlugs(limit: number): string[] {
  const audit = readJson<{
    items?: Array<{ slug: string; decision: string; hasGuideSpec: boolean }>;
  }>(INPUT_GUIDE_AUDIT_PATH);

  const controlPlane = readJson<{
    tools?: Array<{ slug: string; revenuePotential?: string; qualityStatus?: string }>;
  }>(CONTROL_PLANE_PATH);

  const revenueHigh = new Set(
    (controlPlane?.tools ?? [])
      .filter((tool) => tool.revenuePotential === "high")
      .map((tool) => tool.slug),
  );

  const candidates = (audit?.items ?? [])
    .filter((item) => item.slug !== ERT_PROBLEM_SLUG)
    .filter((item) => !item.hasGuideSpec)
    .filter((item) => item.decision === "needs_spec" || item.decision === "hide_guide")
    .sort((a, b) => {
      const aScore = revenueHigh.has(a.slug) ? 2 : 1;
      const bScore = revenueHigh.has(b.slug) ? 2 : 1;
      return bScore - aScore || a.slug.localeCompare(b.slug);
    })
    .slice(0, limit)
    .map((item) => item.slug);

  return candidates;
}

function buildGuideSpecContexts(slugs: string[]): Array<Record<string, unknown>> {
  const graph = readJson<{ tools?: Array<Record<string, unknown>> }>(KNOWLEDGE_GRAPH_PATH);
  const graphBySlug = new Map((graph?.tools ?? []).map((tool) => [tool.slug as string, tool]));

  return slugs.map((slug) => {
    const schemaId = PREMIUM_SCHEMA_SLUG_MAP[slug] ?? slug;
    const inputKeys = resolveToolFormInputKeys(slug);
    const graphEntry = graphBySlug.get(slug) ?? graphBySlug.get(schemaId);

    return {
      slug,
      schemaId,
      inputKeys,
      missingLinks: graphEntry?.missingLinks ?? [],
      schemaFile: graphEntry?.schemaFile ?? "",
      tier: graphEntry?.tier ?? "unknown",
    };
  });
}

function buildSystemPrompt(): string {
  return [
    "You are a SectorCalc premium input guide spec assistant.",
    "Produce JSON only. mustNotAutoApply must be true.",
    "Suggest guideType, inputMap, visualRole notes, warning text, and locale keys.",
    "Never mark guides as eligible, never output SVG, never decide payment/formula gate/deploy.",
    "Only tool-specific guides. No generic fallback diagrams.",
    "Allowed guideType values: shape_dimension, cost_breakdown, process_flow, quote_risk, carbon_flow, field_map, unit_conversion, margin_breakdown, loss_tree.",
  ].join(" ");
}

function buildUserPrompt(contexts: Array<Record<string, unknown>>): string {
  return JSON.stringify({
    task: "guide_spec_suggestion",
    mustNotAutoApply: true,
    tools: contexts,
    outputShape: {
      mustNotAutoApply: true,
      items: [
        {
          slug: "string",
          guideType: "string",
          inputMap: [{ inputKey: "string", labelKey: "string", unit: "string", visualRole: "string" }],
          visualRoleNotes: ["string"],
          warningSuggestions: ["string"],
          localeKeySuggestions: ["string"],
          mustNotAutoApply: true,
        },
      ],
    },
  });
}

function writeReport(report: GuideSpecSuggestionEnvelope): void {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

export async function runGuideSpecSuggestions(): Promise<{
  outputPath: string;
  exitCode: number;
  report: GuideSpecSuggestionEnvelope;
}> {
  const limit = Number(process.env.DEEPSEEK_GUIDE_SPEC_LIMIT || 25);
  const slugs = selectGuideSpecSlugs(limit);
  const contexts = buildGuideSpecContexts(slugs);
  const config = getDeepSeekClientConfig();

  if (!config.apiKey) {
    const report: GuideSpecSuggestionEnvelope = {
      taskType: "guide_spec",
      generatedAt: new Date().toISOString(),
      mustNotAutoApply: true,
      status: "unavailable",
      suggestionUnavailable: true,
      errorCode: "missing_api_key",
      message: "missing_api_key",
      items: [],
    };
    writeReport(report);
    return { outputPath: OUTPUT_PATH, exitCode: 0, report };
  }

  if (contexts.length === 0) {
    const report: GuideSpecSuggestionEnvelope = {
      taskType: "guide_spec",
      generatedAt: new Date().toISOString(),
      mustNotAutoApply: true,
      status: "ok",
      items: [],
      message: "no_candidates",
    };
    writeReport(report);
    return { outputPath: OUTPUT_PATH, exitCode: 0, report };
  }

  const result = await callDeepSeekJson(
    "guide_spec",
    [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(contexts) },
    ],
    (parsed) => validateGuideSpecEnvelope(parsed),
  );

  if (!result.ok) {
    const report: GuideSpecSuggestionEnvelope = {
      taskType: "guide_spec",
      generatedAt: new Date().toISOString(),
      mustNotAutoApply: true,
      status: "api_error",
      suggestionUnavailable: true,
      errorCode: result.errorCode,
      message: result.message || result.errorCode,
      items: [],
    };
    writeReport(report);
    return { outputPath: OUTPUT_PATH, exitCode: 0, report };
  }

  const report: GuideSpecSuggestionEnvelope = {
    ...result.data,
    generatedAt: new Date().toISOString(),
    status: "ok",
  };
  writeReport(report);
  return { outputPath: OUTPUT_PATH, exitCode: 0, report };
}

async function main(): Promise<void> {
  const { report, outputPath } = await runGuideSpecSuggestions();

  console.log("=== DeepSeek Guide Spec Suggestions ===");
  console.log(`status: ${report.status}`);
  console.log(`items: ${report.items.length}`);
  console.log(`mustNotAutoApply: ${report.mustNotAutoApply}`);
  console.log(`output: ${path.relative(ROOT, outputPath)}`);

  if (report.message) {
    console.log(`message: ${report.message}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
