#!/usr/bin/env node
/**
 * P7-CHIEF-ENGINEER — DeepSeek night factory audit + verify.
 * Enforces Chief Engineer system prompt on every API call.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "../ai/load-env-local.mjs";
import { ROOT } from "./lib/activation-paths.mjs";
import { readToolIndex, hasFormulaContract } from "./lib/activation-scan-lib.mjs";
import {
  classifyRiskClass,
  loadRevenueBoundary,
  loadSchemaRegistryAliases,
  resolveSchemaForSlug,
} from "./lib/p6b-formula-factory-lib.mjs";
import {
  buildP7ToolUniverse,
  classifyP7ScanTargets,
  writeP7Outputs,
  P7_AUDIT_PATH,
  P7_QUALITY_GATE_DOC,
} from "./lib/p7-night-factory-lib.mjs";
import { loadFactoryInputs } from "./lib/premium-backfill-factory-lib.mjs";
import { redactSecretsLiteDeep } from "./lib/deepseek-redaction-lite.mjs";
import { CHIEF_ENGINEER_SYSTEM_PROMPT } from "./p7-chief-engineer-system-prompt.mjs";
import { buildDeepSeekMessages, getToolDomainMatch } from "./p7-night-prompt-builder.mjs";
import { runDomainDispatcherSelfTests } from "./p7-domain-prompt-dispatcher.mjs";
import {
  P7_DOMAIN_PROMPT_PACKS,
  runDomainPromptPackSelfTests,
} from "./p7-domain-prompt-packs.mjs";
import {
  rejectP7Response,
  validateP7ResponseShape,
  normalizeP7Response,
  runRejectGateSelfTests,
  P7_REQUIRED_TOP_LEVEL_FIELDS,
} from "./p7-night-response-schema.mjs";

const CACHE_DIR = path.join(ROOT, "scripts/.cache");
const P7_CHECKPOINT_PATH = path.join(CACHE_DIR, "p7-night-deepseek-checkpoint.json");
const P7_AUDIT_LOCK_PATH = path.join(CACHE_DIR, "p7-night-audit.lock");

const RETRYABLE_REASONS = new Set(["missing_field", "invalid_json", "api_error", "prompt_wiring"]);

const CONTRACTS_DIR = path.join(ROOT, "src/lib/formula-governance/contracts");
const GUIDE_SPECS_FILE = path.join(ROOT, "src/lib/tool-guides/premium-input-guide-specs.ts");

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";
const DEFAULT_TIMEOUT_MS = 90_000;

function readText(filePath) {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
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

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function readContractSummary(slug) {
  const criticalPath = path.join(CONTRACTS_DIR, `${slug}-critical.ts`);
  if (!fs.existsSync(criticalPath)) {
    return hasFormulaContract(slug) ? { exists: true, file: "contracts-registry" } : null;
  }
  const content = readText(criticalPath);
  const oracleCount = (content.match(/oracleCases/g) ?? []).length;
  return {
    exists: true,
    file: path.basename(criticalPath),
    hasOracleCases: oracleCount > 0,
    excerpt: content.slice(0, 400),
  };
}

function readGuideSummary(slug) {
  const content = readText(GUIDE_SPECS_FILE);
  if (!content.includes(`slug: "${slug}"`) && !content.includes(`"${slug}"`)) {
    return { exists: false };
  }
  return { exists: true, registry: "premium-input-guide-specs" };
}

export function buildToolContext(tool, schema, locale = "en") {
  const riskClass = classifyRiskClass(tool.slug);
  const existingInputs =
    schema?.inputs?.map((input) => ({
      id: input.id,
      type: input.type,
      unit: input.unit ?? "",
      required: input.required,
      min: input.min,
      max: input.max,
      smartDefault: input.smartDefault,
    })) ?? [];

  const existingFormula =
    schema?.formulaPipeline?.map((step) => ({
      formulaId: step.formulaId,
      outputId: step.outputId,
    })) ?? [];

  const existingOutputs =
    schema?.outputs?.map((output) => ({
      id: output.id,
      unit: output.unit ?? "",
      format: output.format ?? "",
    })) ?? [];

  return {
    slug: tool.slug,
    title: tool.title ?? slugToTitle(tool.slug),
    tier: tool.tier ?? "unknown",
    category: tool.category ?? schema?.sectorSlug ?? "unknown",
    locale,
    existingMetadata: {
      routeStatus: tool.routeStatus ?? "unknown",
      hasFormulaContract: hasFormulaContract(tool.slug),
      riskClass,
    },
    existingInputs,
    existingFormulaContract: {
      formulaPipeline: existingFormula,
      outputs: existingOutputs,
      contract: readContractSummary(tool.slug),
    },
    existingGuide: readGuideSummary(tool.slug),
    currentStatus: {
      inputStatus: existingInputs.length > 0 ? "present" : "missing",
      formulaStatus: existingFormula.length > 0 ? "present" : "missing",
      rendererStatus: existingOutputs.length > 0 ? "present" : "missing",
    },
  };
}

async function callDeepSeekForTool(toolContext, apiKey, model, timeoutMs) {
  const messages = buildDeepSeekMessages(toolContext);
  const chiefSystem = messages[0];
  const domainSystem = messages[1];
  const userMessage = messages[2];
  if (
    !chiefSystem ||
    chiefSystem.role !== "system" ||
    chiefSystem.content !== CHIEF_ENGINEER_SYSTEM_PROMPT
  ) {
    return {
      ok: false,
      reason: "prompt_wiring",
      message: "Chief Engineer system prompt not wired correctly.",
    };
  }
  if (
    !domainSystem ||
    domainSystem.role !== "system" ||
    !domainSystem.content.includes("=== P7 DOMAIN PROMPT PACK (single domain only) ===")
  ) {
    return {
      ok: false,
      reason: "prompt_wiring",
      message: "Domain prompt pack system message not wired correctly.",
    };
  }
  if (!userMessage || userMessage.role !== "user") {
    return {
      ok: false,
      reason: "prompt_wiring",
      message: "Tool user prompt not wired correctly.",
    };
  }

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
        messages: messages.map((m) => ({
          role: m.role,
          content: redactSecretsLiteDeep(m.content),
        })),
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

    const parsed = normalizeP7Response(JSON.parse(jsonText), toolContext.slug);
    const shape = validateP7ResponseShape(parsed);
    if (!shape.ok) {
      return { ok: false, reason: shape.reason, message: shape.message };
    }

    const gate = rejectP7Response(shape.data);
    return {
      ok: true,
      response: shape.data,
      gate,
      patchEligible: !gate.rejected,
    };
  } catch (error) {
    clearTimeout(timer);
    return {
      ok: false,
      reason: "api_error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

function verifyPromptWiring() {
  const sampleContext = {
    slug: "wiring-check",
    title: "Wiring Check",
    tier: "premium-schema",
    category: "cost",
    locale: "en",
    existingMetadata: {},
    existingInputs: [],
    existingFormulaContract: {},
    existingGuide: {},
    currentStatus: {},
  };
  const messages = buildDeepSeekMessages(sampleContext);
  const chiefSystem = messages[0];
  const domainSystem = messages[1];
  const user = messages[2];
  const domainMatch = getToolDomainMatch(sampleContext);
  const checks = {
    messageCount: messages.length === 3,
    chiefSystemRole: chiefSystem?.role === "system",
    domainSystemRole: domainSystem?.role === "system",
    userRole: user?.role === "user",
    systemPromptMatch: chiefSystem?.content === CHIEF_ENGINEER_SYSTEM_PROMPT,
    userContainsSlug: typeof user?.content === "string" && user.content.includes("wiring-check"),
    userHasNoDomainPack:
      typeof user?.content === "string" &&
      !user.content.includes("=== P7 DOMAIN PROMPT PACK (single domain only) ==="),
    systemPromptLength: CHIEF_ENGINEER_SYSTEM_PROMPT.trim().length > 500,
    domainPromptInjected:
      typeof domainSystem?.content === "string" &&
      domainSystem.content.includes("=== P7 DOMAIN PROMPT PACK (single domain only) ==="),
    domainIdPresent:
      typeof domainSystem?.content === "string" &&
      domainSystem.content.includes("domainId: COSTING_MARGIN_AND_PRICING"),
    singleDomainOnly:
      typeof domainSystem?.content === "string" &&
      (domainSystem.content.match(/=== P7 DOMAIN PROMPT PACK/g) ?? []).length === 1,
    domainMatchOk: domainMatch.domainId === "COSTING_MARGIN_AND_PRICING",
    domainPackCount: Object.keys(P7_DOMAIN_PROMPT_PACKS).length === 11,
  };
  const pass = Object.values(checks).every(Boolean);
  return { pass, checks, domainMatch };
}

function buildAuditReport({
  tools,
  p6bTools,
  scanTargets,
  deepseekResults,
  wiring,
  selfTests,
  domainDispatcher,
  domainPromptPacks,
  revenueBoundary,
}) {
  const approved = deepseekResults.filter((r) => r.patchEligible);
  const rejected = deepseekResults.filter((r) => r.response && !r.patchEligible);
  const errors = deepseekResults.filter((r) => !r.ok);

  const domainCounts = tools.reduce((acc, tool) => {
    const domainId = getToolDomainMatch(tool.context).domainId;
    acc[domainId] = (acc[domainId] ?? 0) + 1;
    return acc;
  }, {});

  return {
    generatedAt: new Date().toISOString(),
    auditId: "P7-chief-engineer-night-factory",
    domainPromptPacks: {
      enabled: true,
      packCount: domainPromptPacks.packCount,
      selfTestsPass: domainPromptPacks.allPass,
      selfTestResults: domainPromptPacks.results,
      wiringDomainMatch: wiring.domainMatch ?? null,
    },
    domainPromptDispatcher: {
      enabled: true,
      selfTestsPass: domainDispatcher.allPass,
      selfTestResults: domainDispatcher.results,
      wiringDomainMatch: wiring.domainMatch ?? null,
    },
    chiefEngineerSystemPrompt: {
      enforced: true,
      promptLength: CHIEF_ENGINEER_SYSTEM_PROMPT.trim().length,
      wiringPass: wiring.pass,
      wiringChecks: wiring.checks,
    },
    responseGate: {
      requiredFields: P7_REQUIRED_TOP_LEVEL_FIELDS,
      selfTestsPass: selfTests.allPass,
      selfTestResults: selfTests.results,
    },
    summary: {
      totalTools: tools.length,
      fullyWorkingBefore: scanTargets.fullyWorking.length,
      fullyWorkingAfter: scanTargets.fullyWorking.length,
      deepseekAttempted: deepseekResults.length,
      patchEligible: approved.length,
      gateRejected: rejected.length,
      apiErrors: errors.length,
      expertQueueCount: scanTargets.expertQueue.length,
      blockedUnknownCount: scanTargets.blockedUnknown.length,
      deepseekTargetCount: scanTargets.deepseekTargets.length,
      riskClassCounts: tools.reduce((acc, t) => {
        acc[t.riskClass] = (acc[t.riskClass] ?? 0) + 1;
        return acc;
      }, {}),
      domainCounts,
    },
    expertQueue: scanTargets.expertQueue,
    blockedUnknown: scanTargets.blockedUnknown,
    revenueBoundary,
    p6bTools,
    tools: tools.map((t) => ({
      slug: t.slug,
      tier: t.tier,
      riskClass: t.riskClass,
      routeStatus: t.routeStatus,
      hasSchema: t.hasSchema,
    })),
    deepseekResults,
    rejectRules: [
      "status !== PASS",
      "overallDecision !== APPROVED",
      "canGenerateCalculator !== true",
      "riskClass not LOW_GENERAL_CALC or MEDIUM_BUSINESS_CALC",
      "inputs.length < 3",
      "outputs.length < 2",
      "formulaMethod.references.length < 1",
      "formulaMethod.formulaSteps.length < 4",
      "oracleCases.length < 3",
      "assumptionsEn.length < 3",
      "assumptionsTr.length < 3",
      "limitationsEn/Tr.length < 1",
      "recommendedActionsEn/Tr.length < 1",
      "safeExportBaseName starts with digit",
      "generic input key",
      "mixed language label",
      "input unit missing",
      "validation boundary missing",
      "expected output not finite",
      "findings contain critical or major",
    ],
  };
}

function writeDoc(report) {
  const lines = [
    "# P7 Chief Engineer Quality Gate",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Domain Prompt Packs",
    "",
    `- Enabled: **${report.domainPromptPacks?.enabled ? "yes" : "no"}**`,
    `- Pack count: ${report.domainPromptPacks?.packCount ?? 0}`,
    `- Self-tests: **${report.domainPromptPacks?.selfTestsPass ? "PASS" : "FAIL"}**`,
    `- Wiring domain match: ${report.domainPromptPacks?.wiringDomainMatch?.domainId ?? "n/a"}`,
    `- Message layout: Chief Engineer system + domain system + tool user`,
    "",
    "## Domain Prompt Dispatcher",
    "",
    `- Enabled: **${report.domainPromptDispatcher?.enabled ? "yes" : "no"}**`,
    `- Self-tests: **${report.domainPromptDispatcher?.selfTestsPass ? "PASS" : "FAIL"}**`,
    "",
    "## DeepSeek System Prompt",
    "",
    `- Enforced on every API call: **${report.chiefEngineerSystemPrompt.enforced ? "yes" : "no"}**`,
    `- Prompt length: ${report.chiefEngineerSystemPrompt.promptLength} chars`,
    `- Wiring verification: **${report.chiefEngineerSystemPrompt.wiringPass ? "PASS" : "FAIL"}**`,
    "",
    "## Response Gate",
    "",
    `- Required top-level fields: ${report.responseGate.requiredFields.length}`,
    `- Reject gate self-tests: **${report.responseGate.selfTestsPass ? "PASS" : "FAIL"}**`,
    "",
    "## Reject Rules",
    "",
    ...report.rejectRules.map((rule) => `- ${rule}`),
    "",
    "## Scan Summary",
    "",
    `- Total tools: ${report.summary.totalTools}`,
    `- DeepSeek attempted: ${report.summary.deepseekAttempted}`,
    `- Patch eligible (gate passed): ${report.summary.patchEligible}`,
    `- Gate rejected: ${report.summary.gateRejected}`,
    `- API errors: ${report.summary.apiErrors}`,
    "",
    "## Risk Class Distribution",
    "",
    ...Object.entries(report.summary.riskClassCounts).map(([k, v]) => `- ${k}: ${v}`),
    "",
    "## Domain Distribution",
    "",
    ...Object.entries(report.summary.domainCounts ?? {}).map(([k, v]) => `- ${k}: ${v}`),
    "",
  ];
  fs.writeFileSync(P7_QUALITY_GATE_DOC, lines.join("\n"), "utf8");
}

function loadDeepseekCheckpoint() {
  if (process.env.P7_NIGHT_RESET_CHECKPOINT === "1" && fs.existsSync(P7_CHECKPOINT_PATH)) {
    fs.unlinkSync(P7_CHECKPOINT_PATH);
  }

  if (!fs.existsSync(P7_CHECKPOINT_PATH)) return new Map();
  const parsed = JSON.parse(fs.readFileSync(P7_CHECKPOINT_PATH, "utf8"));
  const map = new Map();
  for (const row of parsed.results ?? []) {
    if (RETRYABLE_REASONS.has(row.reason)) {
      continue;
    }
    map.set(row.slug, row);
  }
  return map;
}

function saveDeepseekCheckpoint(results) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(
    P7_CHECKPOINT_PATH,
    `${JSON.stringify({ updatedAt: new Date().toISOString(), results }, null, 2)}\n`,
    "utf8",
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function acquireAuditLock() {
  if (fs.existsSync(P7_AUDIT_LOCK_PATH)) {
    const existing = fs.readFileSync(P7_AUDIT_LOCK_PATH, "utf8").trim();
    try {
      process.kill(Number(existing), 0);
      console.error(`BLOCKER: audit already running (pid ${existing})`);
      process.exit(1);
    } catch {
      fs.unlinkSync(P7_AUDIT_LOCK_PATH);
    }
  }
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(P7_AUDIT_LOCK_PATH, `${process.pid}\n`, "utf8");
}

function releaseAuditLock() {
  if (fs.existsSync(P7_AUDIT_LOCK_PATH)) {
    fs.unlinkSync(P7_AUDIT_LOCK_PATH);
  }
}

async function runAudit() {
  loadEnvLocal();

  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    console.error("DEEPSEEK_API_KEY_MISSING");
    process.exit(1);
  }

  acquireAuditLock();
  try {
  const wiring = verifyPromptWiring();
  const selfTests = runRejectGateSelfTests();
  const domainDispatcher = runDomainDispatcherSelfTests();
  const domainPromptPacks = runDomainPromptPackSelfTests();

  if (!wiring.pass) {
    console.error("BLOCKER: Chief Engineer prompt wiring failed");
    console.error(JSON.stringify(wiring.checks, null, 2));
    process.exit(1);
  }

  if (!domainPromptPacks.allPass) {
    console.error("BLOCKER: Domain prompt pack self-tests failed");
    for (const test of domainPromptPacks.results) {
      if (!test.pass) console.error(`  FAIL ${test.name}: expected ${test.expected}, got ${test.actual}`);
    }
    process.exit(1);
  }

  if (!domainDispatcher.allPass) {
    console.error("BLOCKER: Domain prompt dispatcher self-tests failed");
    for (const test of domainDispatcher.results) {
      if (!test.pass) console.error(`  FAIL ${test.name}: expected ${test.expected}, got ${test.actual}`);
    }
    process.exit(1);
  }

  if (!selfTests.allPass) {
    console.error("BLOCKER: Reject gate self-tests failed");
    for (const test of selfTests.results) {
      if (!test.pass) console.error(`  FAIL ${test.name}: ${test.reasons?.join(", ")}`);
    }
    process.exit(1);
  }

  const { index, schemaIndex, aliases, p6bTools } = buildP7ToolUniverse();
  const scanTargets = classifyP7ScanTargets(p6bTools);
  const revenueBoundary = loadRevenueBoundary();

  const tools = index.tools.map((tool) => {
    const { schema } = resolveSchemaForSlug(tool.slug, schemaIndex, aliases);
    const riskClass = classifyRiskClass(tool.slug);
    return {
      ...tool,
      riskClass,
      hasSchema: Boolean(schema),
      schema,
      context: buildToolContext(tool, schema),
    };
  });

  const model = process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.DEEPSEEK_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  const sampleLimit = Number(process.env.P7_NIGHT_SAMPLE_LIMIT || 0);
  const apiDelayMs = Number(process.env.P7_NIGHT_API_DELAY_MS || 300);
  const checkpoint = loadDeepseekCheckpoint();
  const deepseekResults = [...checkpoint.values()];

  const targetTools = tools.filter((tool) =>
    scanTargets.deepseekTargets.some((target) => target.slug === tool.slug),
  );
  const sample =
    sampleLimit > 0 ? targetTools.slice(0, sampleLimit) : targetTools;

  console.log(`DeepSeek Chief Engineer full scan: ${sample.length}/${targetTools.length} tools`);
  console.log(`fullyWorking (skip): ${scanTargets.fullyWorking.length}`);
  console.log(`expertQueue: ${scanTargets.expertQueue.length}`);
  console.log(`blockedUnknown: ${scanTargets.blockedUnknown.length}`);

  let attempted = 0;
  const pending = sample.filter((tool) => !checkpoint.has(tool.slug));
  const concurrency = Math.max(1, Number(process.env.P7_NIGHT_CONCURRENCY || 2));

  for (let index = 0; index < sample.length; index += 1) {
    const tool = sample[index];
    if (checkpoint.has(tool.slug)) {
      process.stdout.write(`  ${tool.slug}: CACHED\n`);
    }
  }

  for (let index = 0; index < pending.length; index += concurrency) {
    const chunk = pending.slice(index, index + concurrency);
    attempted += chunk.length;

    const chunkResults = await Promise.all(
      chunk.map(async (tool) => {
        const result = await callDeepSeekForTool(tool.context, apiKey, model, timeoutMs);
        const row = {
          slug: tool.slug,
          ok: result.ok,
          reason: result.reason ?? null,
          message: result.message ?? null,
          patchEligible: result.patchEligible ?? false,
          gateReasons: result.gate?.reasons ?? [],
          response: result.response ?? null,
        };
        checkpoint.set(tool.slug, row);
        process.stdout.write(
          `  ${tool.slug}: ${result.ok ? (result.patchEligible ? "GATE_PASS" : "GATE_REJECT") : result.reason}\n`,
        );
        return row;
      }),
    );

    for (const row of chunkResults) {
      const existingIndex = deepseekResults.findIndex((entry) => entry.slug === row.slug);
      if (existingIndex >= 0) {
        deepseekResults[existingIndex] = row;
      } else {
        deepseekResults.push(row);
      }
    }

    saveDeepseekCheckpoint([...checkpoint.values()]);

    if (apiDelayMs > 0) {
      await sleep(apiDelayMs);
    }
  }

  const report = buildAuditReport({
    tools,
    p6bTools,
    scanTargets,
    deepseekResults,
    wiring,
    selfTests,
    domainDispatcher,
    domainPromptPacks,
    revenueBoundary,
  });
  writeP7Outputs(report, null, null);
  writeDoc(report);

  console.log("\n=== audit:p7-night ===");
  console.log(`totalTools: ${report.summary.totalTools}`);
  console.log(`fullyWorkingBefore: ${report.summary.fullyWorkingBefore}`);
  console.log(`chiefEngineerWiring: PASS`);
  console.log(`domainPromptPackSelfTests: PASS`);
  console.log(`domainDispatcherSelfTests: PASS`);
  console.log(`rejectGateSelfTests: PASS`);
  console.log(`deepseekAttempted: ${report.summary.deepseekAttempted}`);
  console.log(`deepseekNewCalls: ${attempted}`);
  console.log(`patchEligible: ${report.summary.patchEligible}`);
  console.log(`expertQueue: ${report.summary.expertQueueCount}`);
  console.log(`output: ${path.relative(ROOT, P7_AUDIT_PATH)}`);
  console.log(`doc: ${path.relative(ROOT, P7_QUALITY_GATE_DOC)}`);
  console.log("\naudit:p7-night PASS");
  } finally {
    releaseAuditLock();
  }
}

function runVerify() {
  const wiring = verifyPromptWiring();
  const selfTests = runRejectGateSelfTests();
  const domainDispatcher = runDomainDispatcherSelfTests();
  const domainPromptPacks = runDomainPromptPackSelfTests();

  console.log("=== verify:p7-night ===\n");
  console.log(`chiefEngineerWiring: ${wiring.pass ? "PASS" : "FAIL"}`);
  console.log(`domainPromptPackSelfTests: ${domainPromptPacks.allPass ? "PASS" : "FAIL"}`);
  console.log(`domainPromptPackCount: ${domainPromptPacks.packCount}`);
  console.log(`domainDispatcherSelfTests: ${domainDispatcher.allPass ? "PASS" : "FAIL"}`);
  console.log(`rejectGateSelfTests: ${selfTests.allPass ? "PASS" : "FAIL"}`);
  console.log(`systemPromptLength: ${CHIEF_ENGINEER_SYSTEM_PROMPT.trim().length}`);
  console.log(`wiringDomainMatch: ${wiring.domainMatch?.domainId ?? "n/a"}`);

  if (!wiring.pass) {
    console.error("\nverify:p7-night FAIL — prompt wiring");
    console.error(JSON.stringify(wiring.checks, null, 2));
    process.exit(1);
  }

  if (!domainPromptPacks.allPass) {
    console.error("\nverify:p7-night FAIL — domain prompt pack self-tests");
    for (const test of domainPromptPacks.results) {
      if (!test.pass) console.error(`  ${test.name}`);
    }
    process.exit(1);
  }

  if (!domainDispatcher.allPass) {
    console.error("\nverify:p7-night FAIL — domain dispatcher self-tests");
    for (const test of domainDispatcher.results) {
      if (!test.pass) console.error(`  ${test.name}`);
    }
    process.exit(1);
  }

  if (!selfTests.allPass) {
    console.error("\nverify:p7-night FAIL — reject gate self-tests");
    for (const test of selfTests.results) {
      if (!test.pass) console.error(`  ${test.name}`);
    }
    process.exit(1);
  }

  if (fs.existsSync(P7_AUDIT_PATH)) {
    const audit = JSON.parse(fs.readFileSync(P7_AUDIT_PATH, "utf8"));
    console.log(`cachedAudit: ${audit.generatedAt}`);
    console.log(`cachedWiringPass: ${audit.chiefEngineerSystemPrompt?.wiringPass}`);
  } else {
    console.log("cachedAudit: none (run audit:p7-night for full scan cache)");
  }

  console.log("\nverify:p7-night PASS");
}

const isVerify = process.argv.includes("--verify");

try {
  if (isVerify) {
    runVerify();
  } else {
    await runAudit();
  }
} catch (error) {
  console.error(isVerify ? "verify:p7-night FAIL" : "audit:p7-night FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
