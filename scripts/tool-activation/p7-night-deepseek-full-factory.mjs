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
  loadSchemaRegistryAliases,
  resolveSchemaForSlug,
} from "./lib/p6b-formula-factory-lib.mjs";
import { loadFactoryInputs } from "./lib/premium-backfill-factory-lib.mjs";
import { redactSecretsLiteDeep } from "./lib/deepseek-redaction-lite.mjs";
import { CHIEF_ENGINEER_SYSTEM_PROMPT } from "./p7-chief-engineer-system-prompt.mjs";
import { buildDeepSeekMessages } from "./p7-night-prompt-builder.mjs";
import {
  rejectP7Response,
  validateP7ResponseShape,
  runRejectGateSelfTests,
  P7_REQUIRED_TOP_LEVEL_FIELDS,
} from "./p7-night-response-schema.mjs";

const CACHE_DIR = path.join(ROOT, "scripts/.cache");
const P7_AUDIT_PATH = path.join(CACHE_DIR, "p7-night-factory-audit.json");
const P7_DOC_PATH = path.join(ROOT, "docs/p7-chief-engineer-quality-gate.md");

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
  const systemMessage = messages.find((m) => m.role === "system");
  if (!systemMessage || systemMessage.content !== CHIEF_ENGINEER_SYSTEM_PROMPT) {
    return {
      ok: false,
      reason: "prompt_wiring",
      message: "Chief Engineer system prompt not wired correctly.",
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

    const parsed = JSON.parse(jsonText);
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
  const system = messages[0];
  const user = messages[1];
  const checks = {
    messageCount: messages.length === 2,
    systemRole: system?.role === "system",
    userRole: user?.role === "user",
    systemPromptMatch: system?.content === CHIEF_ENGINEER_SYSTEM_PROMPT,
    userContainsSlug: typeof user?.content === "string" && user.content.includes("wiring-check"),
    systemPromptLength: CHIEF_ENGINEER_SYSTEM_PROMPT.trim().length > 500,
  };
  const pass = Object.values(checks).every(Boolean);
  return { pass, checks };
}

function buildAuditReport({ tools, deepseekResults, wiring, selfTests }) {
  const approved = deepseekResults.filter((r) => r.patchEligible);
  const rejected = deepseekResults.filter((r) => r.response && !r.patchEligible);
  const errors = deepseekResults.filter((r) => !r.ok);

  return {
    generatedAt: new Date().toISOString(),
    auditId: "P7-chief-engineer-night-factory",
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
      deepseekAttempted: deepseekResults.length,
      patchEligible: approved.length,
      gateRejected: rejected.length,
      apiErrors: errors.length,
      riskClassCounts: tools.reduce((acc, t) => {
        acc[t.riskClass] = (acc[t.riskClass] ?? 0) + 1;
        return acc;
      }, {}),
    },
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
  ];
  fs.writeFileSync(P7_DOC_PATH, lines.join("\n"), "utf8");
}

async function runAudit() {
  loadEnvLocal();

  const wiring = verifyPromptWiring();
  const selfTests = runRejectGateSelfTests();

  if (!wiring.pass) {
    console.error("BLOCKER: Chief Engineer prompt wiring failed");
    console.error(JSON.stringify(wiring.checks, null, 2));
    process.exit(1);
  }

  if (!selfTests.allPass) {
    console.error("BLOCKER: Reject gate self-tests failed");
    for (const test of selfTests.results) {
      if (!test.pass) console.error(`  FAIL ${test.name}: ${test.reasons?.join(", ")}`);
    }
    process.exit(1);
  }

  const index = readToolIndex();
  const { schemas: schemaIndex } = loadFactoryInputs();
  const aliases = loadSchemaRegistryAliases();

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

  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const model = process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.DEEPSEEK_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  const sampleLimit = Number(process.env.P7_NIGHT_SAMPLE_LIMIT || 0);

  const deepseekResults = [];

  if (!apiKey) {
    console.log("DEEPSEEK_API_KEY missing — deterministic wiring audit only (no API calls).");
  } else {
    const eligible = tools.filter(
      (t) => t.riskClass === "LOW_GENERAL_CALC" || t.riskClass === "MEDIUM_BUSINESS_CALC",
    );
    const sample =
      sampleLimit > 0 ? eligible.slice(0, sampleLimit) : eligible.slice(0, 3);

    console.log(`DeepSeek Chief Engineer audit sample: ${sample.length} tools`);

    for (const tool of sample) {
      const result = await callDeepSeekForTool(tool.context, apiKey, model, timeoutMs);
      deepseekResults.push({
        slug: tool.slug,
        ok: result.ok,
        reason: result.reason ?? null,
        message: result.message ?? null,
        patchEligible: result.patchEligible ?? false,
        gateReasons: result.gate?.reasons ?? [],
        response: result.response
          ? {
              status: result.response.status,
              overallDecision: result.response.overallDecision,
              canGenerateCalculator: result.response.canGenerateCalculator,
              riskClass: result.response.riskClass,
            }
          : null,
      });
      process.stdout.write(
        `  ${tool.slug}: ${result.ok ? (result.patchEligible ? "GATE_PASS" : "GATE_REJECT") : result.reason}\n`,
      );
    }
  }

  const report = buildAuditReport({ tools, deepseekResults, wiring, selfTests });
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(P7_AUDIT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  writeDoc(report);

  console.log("\n=== audit:p7-night ===");
  console.log(`totalTools: ${report.summary.totalTools}`);
  console.log(`chiefEngineerWiring: PASS`);
  console.log(`rejectGateSelfTests: PASS`);
  console.log(`deepseekAttempted: ${report.summary.deepseekAttempted}`);
  console.log(`patchEligible: ${report.summary.patchEligible}`);
  console.log(`output: ${path.relative(ROOT, P7_AUDIT_PATH)}`);
  console.log(`doc: ${path.relative(ROOT, P7_DOC_PATH)}`);
  console.log("\naudit:p7-night PASS");
}

function runVerify() {
  const wiring = verifyPromptWiring();
  const selfTests = runRejectGateSelfTests();

  console.log("=== verify:p7-night ===\n");
  console.log(`chiefEngineerWiring: ${wiring.pass ? "PASS" : "FAIL"}`);
  console.log(`rejectGateSelfTests: ${selfTests.allPass ? "PASS" : "FAIL"}`);
  console.log(`systemPromptLength: ${CHIEF_ENGINEER_SYSTEM_PROMPT.trim().length}`);

  if (!wiring.pass) {
    console.error("\nverify:p7-night FAIL — prompt wiring");
    console.error(JSON.stringify(wiring.checks, null, 2));
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
