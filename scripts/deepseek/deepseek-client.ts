/**
 * DeepSeek script-grade client — batch scanning, schema generation, industrial tools.
 *
 * Wraps deepseek-core for all API calls.
 * Core handles: adaptive timeout, exponential backoff+jitter, rate-limit detection,
 * circuit breaker, model fallback, max_tokens, token bucket rate limiting.
 */
import type { DeepSeekToolScanPayload, IndustrialToolSchema } from "./types";
import { normalizeGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import { callDeepSeekCore } from "@/lib/ai/deepseek/deepseek-core";

/* ── Shared helpers ── */

type DeepSeekApiResponse = {
  choices?: Array<{
    message?: { content?: string | null };
  }>;
  error?: { message?: string };
};

function stripMarkdownFences(raw: string): string {
  let cleaned = raw.trim();
  const full = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i);
  if (full?.[1]) {
    return full[1].trim();
  }
  return cleaned;
}

function isRiskLevel(value: unknown): value is DeepSeekToolScanPayload["audit"]["riskLevel"] {
  return value === "low" || value === "medium" || value === "high" || value === "critical";
}

function parseToolScanPayload(raw: string, expectedSlug: string): DeepSeekToolScanPayload {
  const parsed = JSON.parse(stripMarkdownFences(raw)) as unknown;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("DeepSeek response must be a JSON object.");
  }

  const record = parsed as Record<string, unknown>;
  if (record.slug !== expectedSlug) {
    throw new Error(`DeepSeek slug mismatch: expected ${expectedSlug}, got ${String(record.slug)}`);
  }

  const schema = record.schema;
  const audit = record.audit;
  if (!schema || typeof schema !== "object" || !audit || typeof audit !== "object") {
    throw new Error("DeepSeek response missing schema or audit.");
  }

  const schemaRecord = schema as Record<string, unknown>;
  const auditRecord = audit as Record<string, unknown>;

  if (typeof schemaRecord.formulaSummary !== "string") {
    throw new Error("schema.formulaSummary must be a string.");
  }

  if (!Array.isArray(schemaRecord.inputs) || !Array.isArray(schemaRecord.outputs)) {
    throw new Error("schema.inputs and schema.outputs must be arrays.");
  }

  if (!isRiskLevel(auditRecord.riskLevel)) {
    throw new Error("audit.riskLevel must be low|medium|high|critical.");
  }

  if (typeof auditRecord.formulaConsistent !== "boolean") {
    throw new Error("audit.formulaConsistent must be boolean.");
  }

  if (typeof auditRecord.safeForCalculation !== "boolean") {
    throw new Error("audit.safeForCalculation must be boolean.");
  }

  return record as DeepSeekToolScanPayload;
}

/* ── scanToolWithDeepSeek ── */

export async function scanToolWithDeepSeek(input: {
  readonly systemPrompt: string;
  readonly userPrompt: string;
  readonly slug: string;
}): Promise<DeepSeekToolScanPayload> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing in environment (.env.local).");
  }

  const coreResult = await callDeepSeekCore({
    taskType: "batch_scan",
    messages: [
      { role: "system", content: input.systemPrompt },
      { role: "user", content: input.userPrompt },
    ],
  });

  if (!coreResult.ok) {
    throw new Error(`DeepSeek scan failed: ${coreResult.message} (attempts: ${coreResult.attempts})`);
  }

  return parseToolScanPayload(coreResult.data.content, input.slug);
}

/* ── fetchIndustrialToolSchema ── */

export async function fetchIndustrialToolSchema(input: {
  readonly prompt: string;
  readonly slug: string;
}): Promise<IndustrialToolSchema> {
  const raw = await deepseekClient(input.prompt);
  return parseIndustrialToolSchema(raw, input.slug);
}

/* ── deepseekClient (raw string output) ── */

export async function deepseekClient(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing in environment (.env.local).");
  }

  const coreResult = await callDeepSeekCore({
    taskType: "batch_scan",
    messages: [{ role: "user", content: prompt }],
  });

  if (!coreResult.ok) {
    throw new Error(`DeepSeek request failed: ${coreResult.message} (attempts: ${coreResult.attempts})`);
  }

  return coreResult.data.content.trim();
}

/* ── IndustrialToolSchema parsing ── */

function isInputType(value: unknown): value is IndustrialToolSchema["inputs"][number]["type"] {
  return value === "number" || value === "select" || value === "boolean";
}

function normalizeToolSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toolNamesMatch(expectedSlug: string, toolName: string): boolean {
  const normalizedExpected = normalizeToolSlug(expectedSlug);
  const normalizedActual = normalizeToolSlug(toolName);
  if (!normalizedExpected || !normalizedActual) {
    return false;
  }
  return (
    normalizedActual === normalizedExpected ||
    normalizedActual.includes(normalizedExpected) ||
    normalizedExpected.includes(normalizedActual)
  );
}

export function parseIndustrialToolSchema(raw: string, expectedSlug: string): IndustrialToolSchema {
  const parsed = JSON.parse(stripMarkdownFences(raw)) as unknown;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("DeepSeek response must be a JSON object.");
  }

  const record = parsed as Record<string, unknown>;
  const toolName = typeof record.toolName === "string" ? record.toolName.trim() : "";
  if (!toolName) {
    throw new Error("DeepSeek response missing toolName.");
  }

  if (!toolNamesMatch(expectedSlug, toolName)) {
    throw new Error(
      `DeepSeek toolName mismatch: expected ${expectedSlug}, got ${toolName}`,
    );
  }

  if (!Array.isArray(record.inputs) || record.inputs.length === 0) {
    throw new Error("inputs must be a non-empty array.");
  }

  const inputs = record.inputs.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      throw new Error(`inputs[${index}] must be an object.`);
    }
    const input = entry as Record<string, unknown>;
    if (typeof input.id !== "string" || typeof input.label !== "string") {
      throw new Error(`inputs[${index}] missing id or label.`);
    }
    if (!isInputType(input.type)) {
      throw new Error(`inputs[${index}].type must be number|select|boolean.`);
    }
    if (typeof input.unit !== "string") {
      throw new Error(`inputs[${index}].unit must be a string.`);
    }
    if (typeof input.businessContext !== "string") {
      throw new Error(`inputs[${index}].businessContext must be a string.`);
    }

    const label = input.label.trim();
    const businessContext = input.businessContext.trim();
    const label_i18n = normalizeGeneratedI18nText(input.label_i18n, label);
    const businessContext_i18n = normalizeGeneratedI18nText(
      input.businessContext_i18n,
      businessContext,
    );

    return {
      ...input,
      label,
      businessContext,
      label_i18n,
      businessContext_i18n,
    } as IndustrialToolSchema["inputs"][number];
  });

  const validation = record.validation;
  if (!validation || typeof validation !== "object") {
    throw new Error("validation must be an object.");
  }
  const validationRecord = validation as Record<string, unknown>;
  if (!Array.isArray(validationRecord.rules)) {
    throw new Error("validation.rules must be an array.");
  }
  if (!validationRecord.thresholds || typeof validationRecord.thresholds !== "object") {
    throw new Error("validation.thresholds must be an object.");
  }

  const formulas = record.formulas;
  if (!formulas || typeof formulas !== "object" || Object.keys(formulas).length === 0) {
    throw new Error("formulas must be a non-empty object.");
  }

  const outputs = record.outputs;
  if (!outputs || typeof outputs !== "object") {
    throw new Error("outputs must be an object.");
  }
  const outputsRecord = outputs as Record<string, unknown>;
  if (typeof outputsRecord.primary !== "string") {
    throw new Error("outputs.primary must be a string.");
  }
  if (!outputsRecord.breakdown || typeof outputsRecord.breakdown !== "object") {
    throw new Error("outputs.breakdown must be an object.");
  }
  if (!Array.isArray(outputsRecord.hiddenLossDrivers)) {
    throw new Error("outputs.hiddenLossDrivers must be an array.");
  }
  if (!Array.isArray(outputsRecord.suggestedActions)) {
    throw new Error("outputs.suggestedActions must be an array.");
  }
  if (typeof outputsRecord.dataConfidenceAdjusted !== "string") {
    throw new Error("outputs.dataConfidenceAdjusted must be a string.");
  }

  if (!Array.isArray(record.premiumFeatures)) {
    throw new Error("premiumFeatures must be an array.");
  }
  if (typeof record.premiumRequired !== "boolean") {
    throw new Error("premiumRequired must be boolean.");
  }

  return {
    toolName,
    inputs,
    validation: {
      rules: validationRecord.rules as string[],
      thresholds: validationRecord.thresholds as Record<string, string>,
    },
    formulas: formulas as Record<string, string>,
    outputs: {
      primary: outputsRecord.primary,
      breakdown: outputsRecord.breakdown as Record<string, string>,
      hiddenLossDrivers: outputsRecord.hiddenLossDrivers as string[],
      suggestedActions: outputsRecord.suggestedActions as string[],
      dataConfidenceAdjusted: outputsRecord.dataConfidenceAdjusted,
    },
    premiumFeatures: record.premiumFeatures as string[],
    premiumRequired: record.premiumRequired,
  };
}

/** @deprecated Use getDeepSeekModelName from env config */
export function getDeepSeekModelName(): string {
  return process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";
}
