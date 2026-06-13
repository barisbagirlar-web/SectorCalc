#!/usr/bin/env node
/**
 * P5B — DeepSeek full tool scan + premium readiness segmentation.
 * Advisory only — no auto-patch, no payment/formula gate unlock.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "./load-env-local.mjs";
import {
  CONTROL_PLANE_REPORT_PATH,
  FORMULA_KNOWLEDGE_GRAPH_PATH,
  RUNTIME_TRUST_REPORT_PATH,
  DEEPSEEK_TOOL_CONTEXT_PATH,
  PROBLEM_SLUG,
} from "../tool-activation/lib/p25-control-plane-lib.mjs";
import { P24_REPORT_PATH } from "../tool-activation/lib/p24-tool-quality-lib.mjs";
import { redactSecretsLiteDeep } from "../tool-activation/lib/deepseek-redaction-lite.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CACHE_DIR = path.join(ROOT, "scripts/.cache");
const DEEPSEEK_CACHE_DIR = path.join(CACHE_DIR, "deepseek");
const OUTPUT_PATH = path.join(DEEPSEEK_CACHE_DIR, "p5b-full-tool-scan-report.json");
const DOC_PATH = path.join(ROOT, "docs/p5b-deepseek-full-tool-scan.md");

const QUARANTINE_REPORT_PATH = path.join(CACHE_DIR, "quarantine-recovery-report.json");
const INPUT_GUIDE_REPORT_PATH = path.join(CACHE_DIR, "input-guide-audit-report.json");
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";
const DEFAULT_TIMEOUT_MS = 60_000;

const SEGMENTS = [
  "premium_ready",
  "near_premium",
  "premium_schema_fail_manual",
  "free_active_missing_backing",
  "category_only_quarantine",
  "guide_oracle_missing",
  "payment_locked_safe",
  "deepseek_auto_repair_candidate",
];

const AUTO_REPAIR_TAGS = [
  "i18n_fix",
  "unit_fix",
  "validation_scaffold",
  "route_wiring_scaffold",
  "guide_hide",
  "guide_spec_draft",
];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function stripMarkdownFences(raw) {
  let cleaned = raw.trim();
  const full = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i);
  if (full?.[1]) return full[1].trim();
  const inline = [...cleaned.matchAll(/```(?:json)?\s*\n?([\s\S]*?)\n?```/gi)];
  if (inline.length > 0) {
    const last = inline[inline.length - 1];
    if (last?.[1]) return last[1].trim();
  }
  return cleaned;
}

function extractFirstJsonObject(raw) {
  const cleaned = stripMarkdownFences(raw);
  const start = cleaned.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < cleaned.length; i += 1) {
    const ch = cleaned[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return cleaned.slice(start, i + 1);
    }
  }
  return null;
}

function validateP5bEnvelope(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, reason: "invalid_json", message: "Envelope must be object." };
  }
  if (!Array.isArray(parsed.items)) {
    return { ok: false, reason: "invalid_json", message: "items must be array." };
  }
  const items = [];
  for (const item of parsed.items) {
    if (!item || typeof item !== "object") {
      return { ok: false, reason: "invalid_json", message: "Item must be object." };
    }
    if (typeof item.slug !== "string" || !item.slug) {
      return { ok: false, reason: "invalid_json", message: "slug required." };
    }
    items.push({
      slug: item.slug,
      segment: typeof item.segment === "string" ? item.segment : "near_premium",
      currentVerdict: typeof item.currentVerdict === "string" ? item.currentVerdict : "unknown",
      missing: Array.isArray(item.missing) ? item.missing.map(String) : [],
      riskLevel: ["low", "medium", "high", "critical"].includes(item.riskLevel)
        ? item.riskLevel
        : "medium",
      autoRepairAllowed: item.autoRepairAllowed === true,
      manualReviewRequired: item.manualReviewRequired !== false,
      recommendedBatch: typeof item.recommendedBatch === "string" ? item.recommendedBatch : "P8",
      nextAction: typeof item.nextAction === "string" ? item.nextAction : "",
      doNotTouch: Array.isArray(item.doNotTouch) ? item.doNotTouch.map(String) : ["payment", "formulaGate"],
    });
  }
  return { ok: true, data: { items } };
}

async function callDeepSeekChunk(toolContexts, apiKey, model, timeoutMs) {
  const systemPrompt = [
    "You are SectorCalc P5B premium readiness advisor. JSON only.",
    "Never recommend payment or formula gate unlock. Default: payment/formulaGate unsafe.",
    "Classify each tool for premium readiness. Use deterministic findings provided.",
    "Response format:",
    '{"items":[{"slug":"...","segment":"premium_ready|near_premium|premium_schema_fail_manual|free_active_missing_backing|category_only_quarantine|guide_oracle_missing|payment_locked_safe|deepseek_auto_repair_candidate","currentVerdict":"PASS|WARN|FAIL|QUARANTINE","missing":["schema"],"riskLevel":"low|medium|high|critical","autoRepairAllowed":false,"manualReviewRequired":true,"recommendedBatch":"P6|P7|P8|P10","nextAction":"...","doNotTouch":["payment","formulaGate"]}]}',
  ].join("\n");

  const userPrompt = [
    "For each tool: what is missing for premium level? Where in deterministic reports? Safe auto-patch? Human review? Formula risk? Payment unlock safe (default no)? Smallest safe next step?",
    JSON.stringify({ tools: toolContexts }, null, 0),
  ].join("\n");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: redactSecretsLiteDeep(systemPrompt) },
          { role: "user", content: redactSecretsLiteDeep(userPrompt) },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text();
      return { ok: false, reason: "api_error", message: errText.slice(0, 500) };
    }

    const body = await response.json();
    const content = body?.choices?.[0]?.message?.content ?? "";
    const jsonText = extractFirstJsonObject(content);
    if (!jsonText) {
      return { ok: false, reason: "invalid_json", message: "No JSON object in response." };
    }
    try {
      const parsed = JSON.parse(jsonText);
      const validated = validateP5bEnvelope(parsed);
      if (!validated.ok) return validated;
      return { ok: true, items: validated.data.items };
    } catch (error) {
      return {
        ok: false,
        reason: "invalid_json",
        message: error instanceof Error ? error.message : String(error),
      };
    }
  } catch (error) {
    clearTimeout(timer);
    return {
      ok: false,
      reason: "api_error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

async function deepseekAdvisoryOverlay(toolRows, chunkSize) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const model = process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.DEEPSEEK_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);

  if (!apiKey) {
    return {
      status: "deterministic_only",
      message: "DEEPSEEK_API_KEY missing — deterministic segmentation only.",
      items: [],
      chunkErrors: [],
    };
  }

  const contextBySlug = new Map();
  const toolContext = readJson(DEEPSEEK_TOOL_CONTEXT_PATH);
  if (toolContext?.tools) {
    for (const t of toolContext.tools) contextBySlug.set(t.slug, t);
  }

  const allItems = [];
  const chunkErrors = [];
  const chunks = [];
  for (let i = 0; i < toolRows.length; i += chunkSize) {
    chunks.push(toolRows.slice(i, i + chunkSize));
  }

  async function processChunk(chunk, sizeLabel) {
    const contexts = chunk.map((row) => {
      const ctx = contextBySlug.get(row.slug);
      return {
        slug: row.slug,
        tier: row.tier,
        qualityStatus: row.qualityStatus,
        runtimeStatus: row.runtimeStatus,
        primarySegment: row.primarySegment,
        findings: row.findings?.slice(0, 8) ?? [],
        missingLinks: row.missingLinks ?? [],
        eligible: row.eligible,
        recommendedAction: row.recommendedAction,
      };
    });

    const result = await callDeepSeekChunk(contexts, apiKey, model, timeoutMs);
    if (result.ok) {
      return { ok: true, items: result.items };
    }

    if (result.reason === "invalid_json" && chunk.length > 1) {
      const half = Math.ceil(chunk.length / 2);
      const left = await processChunk(chunk.slice(0, half), `${sizeLabel}-L`);
      const right = await processChunk(chunk.slice(half), `${sizeLabel}-R`);
      if (left.ok && right.ok) {
        return { ok: true, items: [...left.items, ...right.items] };
      }
    }

    if (result.reason === "invalid_json" && chunk.length === 1) {
      chunkErrors.push({
        chunk: sizeLabel,
        slug: chunk[0]?.slug,
        reason: "invalid_json",
        message: result.message,
      });
      return { ok: true, items: [] };
    }

    chunkErrors.push({ chunk: sizeLabel, reason: result.reason, message: result.message });
    return { ok: true, items: [] };
  }

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const label = `chunk-${i + 1}`;
    const result = await processChunk(chunk, label);
    if (result.ok) allItems.push(...result.items);
    process.stdout.write(`DeepSeek chunk ${i + 1}/${chunks.length}: ${result.ok ? result.items.length : 0} items\n`);
  }

  return {
    status: chunkErrors.length > 0 ? "partial" : "ok",
    message: chunkErrors.length > 0 ? "Some chunks failed or recovered empty." : "Full advisory overlay complete.",
    items: allItems,
    chunkErrors,
  };
}

function hasFinding(tool, patterns) {
  const findings = tool.findings ?? [];
  return patterns.some((p) =>
    findings.some((f) => (typeof p === "string" ? f.includes(p) : p.test(f))),
  );
}

function classifyTool(tool, graphTool, quarantineItem, runtimeItem) {
  const missingLinks = graphTool?.missingLinks ?? [];
  const flags = {
    premium_ready: false,
    near_premium: false,
    premium_schema_fail_manual: false,
    free_active_missing_backing: false,
    category_only_quarantine: false,
    guide_oracle_missing: false,
    payment_locked_safe: false,
    deepseek_auto_repair_candidate: false,
  };

  const autoRepairTags = [];

  const isPaymentSafe =
    tool.eligible?.paymentEligible === true && tool.eligible?.formulaGateEligible === true;
  const isRuntimeReady = tool.runtimeStatus === "ready";
  const isPass = tool.qualityStatus === "PASS";

  if (isPass && isRuntimeReady && isPaymentSafe) {
    flags.premium_ready = true;
  }

  if (
    tool.tier === "premium-schema" &&
    (tool.qualityStatus === "FAIL" ||
      hasFinding(tool, ["formulaContractAlignment", "validation: Missing premium-schema"]))
  ) {
    flags.premium_schema_fail_manual = true;
  } else if (
    hasFinding(tool, ["formulaContractAlignment"]) ||
    (tool.validation?.exists === false && tool.schema?.exists === true)
  ) {
    flags.premium_schema_fail_manual = true;
  }

  if (
    tool.qualityStatus === "QUARANTINE" ||
    tool.routeStatus === "category_stub" ||
    quarantineItem?.recoveryClass === "category_stub"
  ) {
    flags.category_only_quarantine = true;
  }

  if (
    tool.tier === "free" &&
    tool.routeStatus === "active" &&
    (!tool.schema?.exists || !tool.formulaContract?.exists || !tool.validation?.exists)
  ) {
    flags.free_active_missing_backing = true;
  }

  const guideMissing = !tool.guide?.hasSpec || tool.guide?.eligible === false;
  const oracleMissing =
    missingLinks.includes("oracle") ||
    tool.goldenOracle?.coverage !== "complete" ||
    hasFinding(tool, ["oracleTests", "oracle"]);
  if (guideMissing || oracleMissing) {
    flags.guide_oracle_missing = true;
  }

  if (!isPaymentSafe || tool.slug === PROBLEM_SLUG) {
    flags.payment_locked_safe = true;
  }

  if (
    tool.route &&
    tool.routeStatus === "active" &&
    !flags.category_only_quarantine &&
    !flags.premium_ready
  ) {
    const partialSchema = tool.schema?.exists || tool.validation?.exists;
    if (partialSchema || tool.qualityStatus === "WARN") {
      flags.near_premium = true;
    }
  }

  if (hasFinding(tool, ["localeKeys", "longLabels", "mobile375", "arRtl"])) {
    autoRepairTags.push("i18n_fix");
  }
  if (hasFinding(tool, ["canonicalUnit", "unitMapping"])) {
    autoRepairTags.push("unit_fix");
  }
  if (!tool.validation?.exists && tool.schema?.exists) {
    autoRepairTags.push("validation_scaffold");
  }
  if (flags.category_only_quarantine && tool.revenuePotential === "high") {
    autoRepairTags.push("route_wiring_scaffold");
  }
  if (tool.guide?.genericGuideBlocked) {
    autoRepairTags.push("guide_hide");
  }
  if (guideMissing && tool.eligible?.guideEligible !== false) {
    autoRepairTags.push("guide_spec_draft");
  }

  if (autoRepairTags.length > 0 && tool.deepSeekRepairConfidence !== "low") {
    flags.deepseek_auto_repair_candidate = true;
  }

  let primarySegment = "near_premium";
  const priority = [
    "premium_ready",
    "premium_schema_fail_manual",
    "category_only_quarantine",
    "free_active_missing_backing",
    "guide_oracle_missing",
    "deepseek_auto_repair_candidate",
    "payment_locked_safe",
    "near_premium",
  ];
  for (const seg of priority) {
    if (flags[seg]) {
      primarySegment = seg;
      break;
    }
  }

  let recommendedBatch = "P8";
  if (flags.premium_schema_fail_manual) recommendedBatch = "P6";
  else if (flags.category_only_quarantine) recommendedBatch = "P7";
  else if (flags.guide_oracle_missing) recommendedBatch = "P8";
  else if (autoRepairTags.includes("i18n_fix")) recommendedBatch = "P10";

  const riskLevel =
    tool.repairDifficulty === "critical"
      ? "critical"
      : tool.repairDifficulty === "high"
        ? "high"
        : tool.repairDifficulty === "medium"
          ? "medium"
          : "low";

  return {
    slug: tool.slug,
    tier: tool.tier,
    route: tool.route,
    routeStatus: tool.routeStatus,
    qualityStatus: tool.qualityStatus,
    runtimeStatus: tool.runtimeStatus,
    severityScore: tool.severityScore,
    repairDifficulty: tool.repairDifficulty,
    revenuePotential: tool.revenuePotential,
    eligible: tool.eligible,
    findings: tool.findings ?? [],
    missingLinks,
    recommendedAction: tool.recommendedAction,
    primarySegment,
    flags,
    autoRepairTags,
    recommendedBatch,
    riskLevel,
    runtimeTrust: runtimeItem
      ? {
          status: runtimeItem.status,
          formulaGateEligible: runtimeItem.formulaGateEligible,
          paymentEligible: runtimeItem.paymentEligible,
        }
      : null,
  };
}

function buildPriorityBatches(segments, toolRows) {
  const p6 = toolRows
    .filter((t) => t.flags.premium_schema_fail_manual)
    .sort((a, b) => b.severityScore - a.severityScore);
  const p7 = toolRows.filter((t) => t.flags.category_only_quarantine);
  const p8 = toolRows
    .filter((t) => t.flags.guide_oracle_missing && !t.flags.category_only_quarantine)
    .sort((a, b) => b.severityScore - a.severityScore);
  const p10 = toolRows
    .filter(
      (t) =>
        t.autoRepairTags.includes("i18n_fix") ||
        hasFinding(
          { findings: t.findings },
          ["localeKeys", "longLabels", "mobile375", "arRtl"],
        ),
    )
    .sort((a, b) => b.severityScore - a.severityScore);

  return {
    P6: {
      label: "Premium-schema FAIL + formula contract alignment",
      count: p6.length,
      slugs: p6.map((t) => t.slug),
      goal: "Formula contract + validation alignment — manual review required",
      autoPatch: false,
    },
    P7: {
      label: "Quarantine / category-only (151)",
      count: p7.length,
      slugs: p7.map((t) => t.slug),
      goal: "Decide route wiring vs category stub retention",
      autoPatch: false,
    },
    P8: {
      label: "Guide spec + oracle gaps",
      count: p8.length,
      slugs: p8.slice(0, 50).map((t) => t.slug),
      goal: "Premium UX + reliable test surface",
      autoPatch: false,
    },
    P9: {
      label: "Payment / Billing",
      count: 0,
      slugs: [],
      goal: "Separate safe phase — not touched in P5B",
      autoPatch: false,
      deferred: true,
    },
    P10: {
      label: "i18n / mobile / RTL / long label cleanup",
      count: p10.length,
      slugs: p10.slice(0, 50).map((t) => t.slug),
      goal: "Locale and mobile label quality",
      autoPatch: true,
    },
  };
}

function buildMarkdownDoc(report) {
  const lines = [
    "# P5B — DeepSeek Full Tool Scan + Premium Readiness",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Total tools: ${report.totalTools}`,
    `- Active routes: ${report.activeRoutes}`,
    `- Category-only: ${report.categoryOnly}`,
    `- PASS / WARN / FAIL / QUARANTINE: ${report.passWarnFailQuarantine.PASS}/${report.passWarnFailQuarantine.WARN}/${report.passWarnFailQuarantine.FAIL}/${report.passWarnFailQuarantine.QUARANTINE}`,
    `- paymentEligible: ${report.paymentEligible}`,
    `- formulaGateEligible: ${report.formulaGateEligible}`,
    `- free paymentEligible: ${report.freePaymentEligible}`,
    `- DeepSeek status: ${report.deepseekStatus.status}`,
    "",
    "## Premium transition map",
    "",
    "| Segment | Count |",
    "|---------|-------|",
  ];

  for (const seg of SEGMENTS) {
    lines.push(`| ${seg} | ${report.segments[seg]?.count ?? 0} |`);
  }

  lines.push("", "## Priority batches", "");
  for (const [key, batch] of Object.entries(report.priorityBatches)) {
    lines.push(`### ${key}: ${batch.label}`);
    lines.push(`- Tools: ${batch.count}`);
    lines.push(`- Goal: ${batch.goal}`);
    if (batch.deferred) lines.push("- Status: deferred (P5B does not touch payment)");
    lines.push("");
  }

  lines.push("## First 25 priority tools", "");
  for (const item of report.nextActions.top25) {
    lines.push(`- **${item.slug}** (${item.segment}) — ${item.nextAction}`);
  }

  lines.push("", "## First 10 low-risk auto repair candidates", "");
  for (const item of report.nextActions.autoRepairTop10) {
    lines.push(`- ${item.slug}: ${item.autoRepairTags?.join(", ") ?? "—"}`);
  }

  lines.push("", "## First 10 manual review candidates", "");
  for (const item of report.nextActions.manualReviewTop10) {
    lines.push(`- ${item.slug} (${item.riskLevel}): ${item.nextAction}`);
  }

  lines.push("", "## Quarantine summary", "");
  lines.push(
    `- Category-only quarantine: ${report.segments.category_only_quarantine?.count ?? 0}`,
  );
  lines.push(`- Recover-now (quarantine report): ${report.quarantineSummary?.recoverNow ?? 0}`);

  lines.push("", "## Payment safety", "");
  lines.push(`- paymentEligible (control plane): ${report.paymentEligible}`);
  lines.push(`- formulaGateEligible: ${report.formulaGateEligible}`);
  lines.push(`- free paymentEligible: ${report.freePaymentEligible}`);

  lines.push("", "## Problem slug safety", "");
  lines.push(`- Slug: ${report.problemSlugSafe.slug}`);
  lines.push(
    `- paymentEligible: ${report.problemSlugSafe.paymentEligible} (must stay false)`,
  );
  lines.push(
    `- formulaGateEligible: ${report.problemSlugSafe.formulaGateEligible} (must stay false)`,
  );

  lines.push("", "## P6 recommendation (premium-schema FAIL)", "");
  for (const slug of report.priorityBatches.P6?.slugs ?? []) {
    lines.push(`- ${slug}`);
  }

  if (report.deepseekStatus.chunkErrors?.length) {
    lines.push("", "## DeepSeek chunk errors", "");
    for (const err of report.deepseekStatus.chunkErrors) {
      lines.push(`- ${err.chunk}: ${err.reason} — ${err.message ?? ""}`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

async function main() {
  loadEnvLocal();

  const sources = {
    p24: readJson(P24_REPORT_PATH),
    runtimeTrust: readJson(RUNTIME_TRUST_REPORT_PATH),
    controlPlane: readJson(CONTROL_PLANE_REPORT_PATH),
    quarantine: readJson(QUARANTINE_REPORT_PATH),
    inputGuides: readJson(INPUT_GUIDE_REPORT_PATH),
    knowledgeGraph: readJson(FORMULA_KNOWLEDGE_GRAPH_PATH),
    toolContext: readJson(DEEPSEEK_TOOL_CONTEXT_PATH),
  };

  const missing = [];
  if (!sources.controlPlane) missing.push("tool-quality-control-plane.json");
  if (!sources.p24) missing.push("p24-tool-quality-report.json");
  if (missing.length > 0) {
    console.error("BLOCKER: Missing required cache reports:", missing.join(", "));
    console.error("Run pre-audits first.");
    process.exit(1);
  }

  const controlPlane = sources.controlPlane;
  const graphBySlug = new Map((sources.knowledgeGraph?.tools ?? []).map((t) => [t.slug, t]));
  const quarantineBySlug = new Map((sources.quarantine?.items ?? []).map((t) => [t.slug, t]));
  const runtimeBySlug = new Map((sources.runtimeTrust?.items ?? []).map((t) => [t.slug, t]));

  const toolRows = controlPlane.tools.map((tool) =>
    classifyTool(
      tool,
      graphBySlug.get(tool.slug),
      quarantineBySlug.get(tool.slug),
      runtimeBySlug.get(tool.slug),
    ),
  );

  const segments = {};
  for (const seg of SEGMENTS) {
    const slugs = toolRows.filter((t) => t.flags[seg]).map((t) => t.slug);
    segments[seg] = { count: slugs.length, slugs };
  }

  const chunkSize = Number(process.env.P5B_DEEPSEEK_CHUNK_SIZE || 25);
  const deepseekOverlay = await deepseekAdvisoryOverlay(toolRows, chunkSize);

  const overlayBySlug = new Map(deepseekOverlay.items.map((i) => [i.slug, i]));

  const mergedItems = toolRows.map((row) => {
    const overlay = overlayBySlug.get(row.slug);
    return {
      slug: row.slug,
      segment: overlay?.segment ?? row.primarySegment,
      currentVerdict: overlay?.currentVerdict ?? row.qualityStatus,
      missing: overlay?.missing ?? row.missingLinks,
      riskLevel: overlay?.riskLevel ?? row.riskLevel,
      autoRepairAllowed: overlay?.autoRepairAllowed ?? false,
      manualReviewRequired: overlay?.manualReviewRequired ?? true,
      recommendedBatch: overlay?.recommendedBatch ?? row.recommendedBatch,
      nextAction:
        overlay?.nextAction ||
        row.recommendedAction ||
        `Review ${row.primarySegment} gaps`,
      doNotTouch: overlay?.doNotTouch ?? ["payment", "formulaGate"],
      autoRepairTags: row.autoRepairTags,
      tier: row.tier,
      runtimeStatus: row.runtimeStatus,
      severityScore: row.severityScore,
    };
  });

  const summary = controlPlane.summary;
  const activeRoutes = toolRows.filter((t) => t.routeStatus === "active").length;
  const categoryOnly = toolRows.filter((t) => t.routeStatus === "category_stub").length;

  const autoRepairCandidates = mergedItems
    .filter((i) => i.autoRepairTags?.length > 0 && i.riskLevel === "low")
    .sort((a, b) => a.severityScore - b.severityScore);
  const manualReviewCandidates = mergedItems
    .filter((i) => i.manualReviewRequired && ["high", "critical"].includes(i.riskLevel))
    .sort((a, b) => (b.severityScore ?? 0) - (a.severityScore ?? 0));

  const top25 = [...mergedItems]
    .sort((a, b) => {
      const score = (item) => {
        let s = item.riskLevel === "critical" ? 100 : item.riskLevel === "high" ? 80 : 50;
        if (item.recommendedBatch === "P6") s += 50;
        if (item.recommendedBatch === "P7") s += 20;
        if (item.segment === "near_premium") s += 25;
        return s + (item.severityScore ?? 0) / 10;
      };
      return score(b) - score(a);
    })
    .slice(0, 25);

  const problemSlugTool = controlPlane.tools.find((t) => t.slug === PROBLEM_SLUG);

  const report = {
    generatedAt: new Date().toISOString(),
    totalTools: summary.totalTools,
    activeRoutes,
    categoryOnly,
    passWarnFailQuarantine: summary.byQuality,
    paymentEligible: summary.paymentEligible,
    formulaGateEligible: summary.formulaGateEligible,
    freePaymentEligible: summary.freePaymentEligible,
    problemSlugSafe: {
      slug: PROBLEM_SLUG,
      paymentEligible: problemSlugTool?.eligible?.paymentEligible ?? false,
      formulaGateEligible: problemSlugTool?.eligible?.formulaGateEligible ?? false,
      qualityStatus: problemSlugTool?.qualityStatus,
      runtimeStatus: problemSlugTool?.runtimeStatus,
      safe: !problemSlugTool?.eligible?.paymentEligible && !problemSlugTool?.eligible?.formulaGateEligible,
    },
    deepseekStatus: {
      status: deepseekOverlay.status,
      message: deepseekOverlay.message,
      advisoryItemCount: deepseekOverlay.items.length,
      chunkErrors: deepseekOverlay.chunkErrors,
    },
    segments,
    priorityBatches: buildPriorityBatches(segments, toolRows),
    blockers: missing,
    warnings: [],
    nextActions: {
      top25,
      autoRepairTop10: autoRepairCandidates.slice(0, 10),
      manualReviewTop10: manualReviewCandidates.slice(0, 10),
    },
    quarantineSummary: sources.quarantine?.summary ?? null,
    items: mergedItems,
    sources: {
      p24: path.relative(ROOT, P24_REPORT_PATH),
      runtimeTrust: path.relative(ROOT, RUNTIME_TRUST_REPORT_PATH),
      controlPlane: path.relative(ROOT, CONTROL_PLANE_REPORT_PATH),
      quarantine: path.relative(ROOT, QUARANTINE_REPORT_PATH),
      inputGuides: path.relative(ROOT, INPUT_GUIDE_REPORT_PATH),
      knowledgeGraph: path.relative(ROOT, FORMULA_KNOWLEDGE_GRAPH_PATH),
      toolContext: path.relative(ROOT, DEEPSEEK_TOOL_CONTEXT_PATH),
    },
  };

  if (deepseekOverlay.status === "deterministic_only") {
    report.warnings.push(deepseekOverlay.message);
  }

  fs.mkdirSync(DEEPSEEK_CACHE_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(DOC_PATH, buildMarkdownDoc(report), "utf8");

  console.log("=== P5B DeepSeek Full Tool Scan ===");
  console.log(`totalTools: ${report.totalTools}`);
  console.log(`activeRoutes: ${report.activeRoutes}`);
  console.log(`categoryOnly: ${report.categoryOnly}`);
  console.log(
    `PASS/WARN/FAIL/QUARANTINE: ${report.passWarnFailQuarantine.PASS}/${report.passWarnFailQuarantine.WARN}/${report.passWarnFailQuarantine.FAIL}/${report.passWarnFailQuarantine.QUARANTINE}`,
  );
  console.log(`paymentEligible: ${report.paymentEligible}`);
  console.log(`formulaGateEligible: ${report.formulaGateEligible}`);
  console.log(`deepseekStatus: ${report.deepseekStatus.status}`);
  for (const seg of SEGMENTS) {
    console.log(`segment ${seg}: ${report.segments[seg].count}`);
  }
  console.log(`P6 candidates: ${report.priorityBatches.P6.count}`);
  console.log(`P7 candidates: ${report.priorityBatches.P7.count}`);
  console.log(`P8 candidates: ${report.priorityBatches.P8.count}`);
  console.log(`output: ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log(`doc: ${path.relative(ROOT, DOC_PATH)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
