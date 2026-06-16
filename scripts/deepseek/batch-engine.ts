import fs from "node:fs";
import path from "node:path";
import { normalizeRawGeneratedSchema } from "@/lib/generated-tools/normalize-schema";
import { buildFreeOmniSchemaPrompt } from "./free-omni-prompt";
import { isStubSchemaContent, isStubSchemaFile } from "./is-stub-schema";
import { INDUSTRIAL_STANDARDS } from "./industrial-standards";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";
import {
  repairJsonText,
  schemaHasFullI18n,
  validateIndustrialSchema,
} from "./schema-json-utils";
import {
  defaultListFilePath,
  parseCalculatorListEntries,
  resolveSectionCategory,
  type CalculatorListEntry,
} from "./parse-calculator-list";
import { CATALOG_CATEGORY_TO_SECTOR_SLUG } from "@/lib/catalog/catalog-category-mappings";

export const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
export const PROGRESS_PATH = path.join(PROJECT_ROOT, "scripts/data/omni-batch-progress.json");
export const PID_PATH = path.join(PROJECT_ROOT, "scripts/data/omni-batch.pid");
export const LEGACY_PROGRESS_PATH = path.join(PROJECT_ROOT, ".batch-progress.json");

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export type RawSchema = Record<string, unknown>;

export type ProgressState = {
  completed: string[];
  failed: string[];
  lastUpdated?: string;
  stats?: { ok: number; fail: number };
};

export type BatchEngineOptions = {
  readonly argv: readonly string[];
  readonly concurrency: number;
  readonly delayMs: number;
  readonly maxRetries: number;
  readonly fetchTimeoutMs: number;
  readonly onProgress?: (line: string) => void;
  readonly shouldStop?: () => boolean;
};

function log(options: BatchEngineOptions, line: string): void {
  console.log(line);
  options.onProgress?.(line);
}

export function parseCliLimit(argv: readonly string[]): number | null {
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--limit") return Number(argv[i + 1]);
    if (argv[i]?.startsWith("--limit=")) return Number(argv[i].slice(8));
  }
  return null;
}

function migrateLegacyProgress(): void {
  if (!fs.existsSync(LEGACY_PROGRESS_PATH) || fs.existsSync(PROGRESS_PATH)) {
    return;
  }
  try {
    const legacy = JSON.parse(fs.readFileSync(LEGACY_PROGRESS_PATH, "utf-8")) as {
      completed?: string[];
      failed?: string[];
    };
    saveProgress({
      completed: legacy.completed ?? [],
      failed: legacy.failed ?? [],
    });
  } catch {
    // ignore corrupt legacy file
  }
}

export function loadProgress(): ProgressState {
  migrateLegacyProgress();
  if (!fs.existsSync(PROGRESS_PATH)) {
    return { completed: [], failed: [] };
  }
  const raw = JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf-8")) as ProgressState;
  return {
    completed: raw.completed ?? [],
    failed: raw.failed ?? [],
    lastUpdated: raw.lastUpdated,
    stats: raw.stats,
  };
}

export function saveProgress(state: ProgressState): void {
  fs.mkdirSync(path.dirname(PROGRESS_PATH), { recursive: true });
  const payload: ProgressState = {
    ...state,
    lastUpdated: new Date().toISOString(),
  };
  const tmp = `${PROGRESS_PATH}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(payload, null, 2)}\n`);
  fs.renameSync(tmp, PROGRESS_PATH);
  fs.writeFileSync(LEGACY_PROGRESS_PATH, `${JSON.stringify(payload, null, 2)}\n`);
}

export function writePidFile(): void {
  fs.mkdirSync(path.dirname(PID_PATH), { recursive: true });
  fs.writeFileSync(PID_PATH, `${process.pid}\n`);
}

export function removePidFile(): void {
  try {
    fs.unlinkSync(PID_PATH);
  } catch {
    // already removed
  }
}

function enrichSchema(raw: RawSchema, entry: CalculatorListEntry): RawSchema {
  const formulas = (raw.formulas as Record<string, string>) ?? {};
  const keys = Object.keys(formulas);
  const primary = keys[0] ?? "result";
  const breakdown: Record<string, string> = {};
  for (const k of keys) breakdown[k] = k.replace(/_/g, " ");
  const catalogCategory =
    (typeof raw.catalogCategory === "string" && raw.catalogCategory.trim()) ||
    resolveSectionCategory(entry.section);
  const sectorSlug =
    (typeof raw.sectorSlug === "string" && raw.sectorSlug.trim()) ||
    CATALOG_CATEGORY_TO_SECTOR_SLUG[catalogCategory as keyof typeof CATALOG_CATEGORY_TO_SECTOR_SLUG];
  return {
    ...raw,
    slug: entry.slug,
    toolName: entry.slug,
    catalogCategory,
    sectorSlug,
    premiumRequired: false,
    premiumFeatures: [],
    validation: raw.validation ?? { rules: [], thresholds: {} },
    formulas,
    outputs: {
      primary,
      breakdown,
      hiddenLossDrivers: [],
      suggestedActions: ["Verify inputs before decisions."],
      dataConfidenceAdjusted: primary,
      ...(raw.outputs as Record<string, unknown>),
    },
    meta: {
      name: entry.name,
      version: "1.0.0",
      description: `Free ${entry.name} calculator — technical estimate only.`,
      premiumRequired: false,
      premiumFeatures: [],
      ...(raw.meta as Record<string, unknown>),
    },
  };
}

async function fetchSchemaFromDeepSeek(
  entry: CalculatorListEntry,
  attempt: number,
  options: BatchEngineOptions,
): Promise<RawSchema | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.fetchTimeoutMs);

  try {
    const res = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat",
        temperature: 0.15,
        max_tokens: 3200,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an ISO 9001-certified industrial mathematics engineer (ECMI). Output valid JSON only. Use domain-correct, compilable formulas. All 6 locales (en,tr,de,fr,es,ar) required in every label_i18n and businessContext_i18n object.",
          },
          { role: "user", content: buildFreeOmniSchemaPrompt(entry) },
        ],
      }),
    });

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
    };

    if (!res.ok) {
      log(options, `❌ ${entry.slug} HTTP ${res.status} attempt ${attempt}: ${payload.error?.message ?? "unknown"}`);
      return null;
    }

    const content = payload.choices?.[0]?.message?.content ?? "{}";
    const cleaned = repairJsonText(content);
    const enriched = enrichSchema(JSON.parse(cleaned) as RawSchema, entry);
    const normalized = normalizeRawGeneratedSchema(enriched, entry.slug);
    if (!normalized) {
      log(options, `❌ ${entry.slug} normalize failed attempt ${attempt}`);
      return null;
    }
    if (isStubSchemaContent(normalized)) {
      log(options, `❌ ${entry.slug} stub-like attempt ${attempt}`);
      return null;
    }
    if (!schemaHasFullI18n(enriched)) {
      log(options, `❌ ${entry.slug} missing 6-locale i18n attempt ${attempt}`);
      return null;
    }
    const industrial = validateIndustrialSchema(enriched);
    if (!industrial.valid) {
      log(options, `❌ ${entry.slug} validation failed attempt ${attempt}: ${industrial.errors.join("; ")}`);
      return null;
    }
    return enriched;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(options, `❌ ${entry.slug} fetch error attempt ${attempt}: ${message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function shouldProcessEntry(
  entry: CalculatorListEntry,
  argv: readonly string[],
  progress: ProgressState,
): boolean {
  const force = argv.includes("--force");
  const stubsOnly = !argv.includes("--all");
  const retryFailed = argv.includes("--retry-failed");
  const out = path.join(OUTPUT_DIR, `${entry.slug}-schema.json`);

  if (progress.failed.includes(entry.slug) && !force && !retryFailed) {
    return false;
  }

  if (progress.completed.includes(entry.slug) && !force) {
    if (fs.existsSync(out) && !isStubSchemaFile(out)) {
      return false;
    }
    progress.completed = progress.completed.filter((slug) => slug !== entry.slug);
    saveProgress(progress);
  }

  if (!force && fs.existsSync(out) && (!stubsOnly || !isStubSchemaFile(out))) {
    return false;
  }

  return true;
}

export async function processEntry(
  entry: CalculatorListEntry,
  progress: ProgressState,
  options: BatchEngineOptions,
): Promise<"ok" | "fail"> {
  const out = path.join(OUTPUT_DIR, `${entry.slug}-schema.json`);

  for (let attempt = 1; attempt <= options.maxRetries; attempt += 1) {
    if (options.shouldStop?.()) {
      return "fail";
    }
    const schema = await fetchSchemaFromDeepSeek(entry, attempt, options);
    if (!schema) {
      if (attempt < options.maxRetries) {
        await new Promise((r) => setTimeout(r, options.delayMs * attempt));
        continue;
      }
      progress.failed = [...new Set([...progress.failed, entry.slug])];
      progress.stats = { ok: progress.completed.length, fail: progress.failed.length };
      saveProgress(progress);
      return "fail";
    }
    const tmp = `${out}.tmp`;
    fs.writeFileSync(tmp, `${JSON.stringify(schema, null, 2)}\n`);
    fs.renameSync(tmp, out);
    progress.completed = [...new Set([...progress.completed, entry.slug])];
    progress.failed = progress.failed.filter((slug) => slug !== entry.slug);
    progress.stats = { ok: progress.completed.length, fail: progress.failed.length };
    saveProgress(progress);
    log(options, `✅ ${entry.slug}`);
    return "ok";
  }
  return "fail";
}

export async function runBatchEngine(options: BatchEngineOptions): Promise<{
  ok: number;
  fail: number;
  stopped: boolean;
}> {
  loadEnvLocal();
  const limit = parseCliLimit(options.argv);
  const progress = loadProgress();

  let entries = parseCalculatorListEntries(defaultListFilePath());
  entries = entries.filter((entry) => shouldProcessEntry(entry, options.argv, progress));
  if (limit) entries = entries.slice(0, limit);

  log(
    options,
    `Queued ${entries.length} calculators (concurrency=${options.concurrency}, stubs-only=${!options.argv.includes("--all")}, ${INDUSTRIAL_STANDARDS.quality})`,
  );

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let ok = 0;
  let fail = 0;
  let cursor = 0;
  let stopped = false;

  async function worker(workerId: number): Promise<void> {
    while (!options.shouldStop?.()) {
      const index = cursor;
      cursor += 1;
      if (index >= entries.length) {
        return;
      }
      const entry = entries[index];
      log(options, `🔧 [w${workerId}] ${entry.slug}`);
      const result = await processEntry(entry, progress, options);
      if (result === "ok") ok += 1;
      else fail += 1;

      if ((ok + fail) % options.concurrency === 0 || index + 1 === entries.length) {
        log(
          options,
          `progress ${Math.min(index + 1, entries.length)}/${entries.length} ok=${ok} fail=${fail} completed=${progress.completed.length}`,
        );
      }

      if (index + 1 < entries.length && options.delayMs > 0) {
        await new Promise((r) => setTimeout(r, options.delayMs));
      }
    }
    stopped = true;
  }

  const workers = Array.from({ length: Math.max(1, options.concurrency) }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  log(options, `Done ok=${ok} fail=${fail} stopped=${stopped || Boolean(options.shouldStop?.())}`);
  return { ok, fail, stopped: stopped || Boolean(options.shouldStop?.()) };
}
