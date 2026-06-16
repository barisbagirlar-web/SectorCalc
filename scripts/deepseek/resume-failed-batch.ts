#!/usr/bin/env npx tsx
/**
 * Retry failed tools that still lack a schema file.
 * Merges .batch-progress.json + .batch-progress-*.json failed lists.
 *
 * Usage:
 *   npx tsx scripts/deepseek/resume-failed-batch.ts
 *   npx tsx scripts/deepseek/resume-failed-batch.ts --shard-id=1 --shard-count=10
 *   bash scripts/deepseek/start-resume-failed-batch.sh
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildShardRanges } from "./batch-shards";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";
import { resolveDeepSeekApiKey } from "./deepseek-key-pool";
import { repairJsonText } from "./schema-json-utils";

loadEnvLocal();

const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const FAILED_LOG = "/tmp/batch-failed-tools.log";
export const RESUME_QUEUE_MANIFEST = path.join(
  PROJECT_ROOT,
  ".batch-progress-failed-retry-queue.json",
);
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000;
const FETCH_TIMEOUT_MS = 120_000;
const MAX_TOKENS = 4000;
const MODEL_CHAIN = ["deepseek-chat", "deepseek-v4-pro"] as const;

type DeepSeekModel = (typeof MODEL_CHAIN)[number];

function resolveConcurrency(shardCount: number | null): number {
  if (shardCount !== null && shardCount > 1) return 1;
  return 3;
}

type CalculatorSchema = {
  toolName: string;
  inputs: unknown;
  formulas: Record<string, string>;
  outputs: { primary: string; breakdown: string[] };
  category: string;
  sector: string;
  premiumRequired: boolean;
};

type ProgressState = {
  completed: string[];
  failed: string[];
};

type DeepSeekResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
};

type CliOptions = {
  shardId: number | null;
  shardCount: number | null;
};

function parseCliOptions(argv: readonly string[]): CliOptions {
  let shardId: number | null = null;
  let shardCount: number | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--shard-id" && argv[i + 1]) {
      shardId = Number(argv[i + 1]) || null;
      i += 1;
    } else if (arg.startsWith("--shard-id=")) {
      shardId = Number(arg.slice(11)) || null;
    } else if (arg === "--shard-count" && argv[i + 1]) {
      shardCount = Number(argv[i + 1]) || null;
      i += 1;
    } else if (arg.startsWith("--shard-count=")) {
      shardCount = Number(arg.slice(14)) || null;
    }
  }

  return { shardId, shardCount };
}

function resolveProgressFile(shardId: number | null): string {
  if (shardId === null) {
    return path.join(PROJECT_ROOT, ".batch-progress-failed-retry.json");
  }
  return path.join(PROJECT_ROOT, `.batch-progress-failed-retry-shard-${shardId}.json`);
}

export function loadAllFailed(): string[] {
  const failed = new Set<string>();
  const files = fs
    .readdirSync(PROJECT_ROOT)
    .filter(
      (f) =>
        (f === ".batch-progress.json" || f.startsWith(".batch-progress-")) &&
        f.endsWith(".json") &&
        !f.includes("backup") &&
        !f.includes("failed-retry"),
    );

  for (const file of files) {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(PROJECT_ROOT, file), "utf-8"),
      ) as ProgressState;
      for (const name of raw.failed ?? []) {
        failed.add(name);
      }
    } catch {
      // skip corrupt
    }
  }
  return [...failed];
}

export function schemaExists(toolName: string): boolean {
  if (!fs.existsSync(OUTPUT_DIR)) return false;
  const slug = toolName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return fs.existsSync(path.join(OUTPUT_DIR, `${slug}-schema.json`));
}

export function loadResumeProgressMerged(): ProgressState {
  const merged: ProgressState = { completed: [], failed: [] };
  for (const file of fs.readdirSync(PROJECT_ROOT)) {
    if (!file.startsWith(".batch-progress-failed-retry") || !file.endsWith(".json")) continue;
    if (file === path.basename(RESUME_QUEUE_MANIFEST)) continue;
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(PROJECT_ROOT, file), "utf-8"),
      ) as ProgressState;
      for (const name of raw.completed ?? []) {
        if (!merged.completed.includes(name)) merged.completed.push(name);
      }
      for (const name of raw.failed ?? []) {
        if (!merged.failed.includes(name) && !merged.completed.includes(name)) {
          merged.failed.push(name);
        }
      }
    } catch {
      // skip
    }
  }
  return merged;
}

export function loadResumeQueueTools(): string[] {
  if (fs.existsSync(RESUME_QUEUE_MANIFEST)) {
    try {
      const raw = JSON.parse(fs.readFileSync(RESUME_QUEUE_MANIFEST, "utf-8")) as {
        tools?: string[];
      };
      if (Array.isArray(raw.tools) && raw.tools.length > 0) {
        return raw.tools;
      }
    } catch {
      // fall through
    }
  }
  return collectPendingTools();
}

export function writeResumeQueueManifest(tools: readonly string[]): void {
  fs.writeFileSync(
    RESUME_QUEUE_MANIFEST,
    JSON.stringify(
      {
        total: tools.length,
        tools: [...tools],
        startedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
}

export function collectPendingTools(): string[] {
  const merged = loadResumeProgressMerged();
  const completedSet = new Set(merged.completed);
  return loadAllFailed().filter((name) => !schemaExists(name) && !completedSet.has(name));
}

function loadProgress(progressFile: string): ProgressState {
  if (fs.existsSync(progressFile)) {
    return JSON.parse(fs.readFileSync(progressFile, "utf-8")) as ProgressState;
  }
  return { completed: [], failed: [] };
}

function saveProgress(progressFile: string, completed: string[], failed: string[]): void {
  fs.writeFileSync(progressFile, JSON.stringify({ completed, failed }, null, 2));
}

function logFailedTool(toolName: string, reason: string, contentLength: number): void {
  const line = `${new Date().toISOString()}\t${toolName}\t${reason}\tcontent_len=${contentLength}\n`;
  fs.appendFileSync(FAILED_LOG, line);
}

function parseModelJson(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Empty model response");
  const repaired = repairJsonText(trimmed);
  return JSON.parse(repaired) as unknown;
}

function buildPrompt(toolName: string): string {
  return `
You are an ISO 9001-certified, TÜV-qualified industrial mathematics engineer.

Generate a PRODUCTION-GRADE, TÜV-CERTIFIABLE calculator schema for "${toolName}".

MANDATORY (ISO 9001 – 8.3.5):
- toolName: lowercase hyphen-separated
- inputs: 4–8 fields with id, label, type:"number", unit, default, businessContext
- formulas: valid JS (+, -, *, /, **, Math.sin, Math.cos, Math.sqrt, Math.log, Math.exp)
- outputs: { primary: "...", breakdown: ["...", "..."] }
- premiumRequired: false
- category: one of ["Maliyet & Marj", "Malzeme, Fire & OEE", "Enerji & Karbon", "Rota & Lojistik", "İnşaat & Saha", "Finans & Kredi", "Teknik & Mühendislik", "Ölçüm & Dönüşüm"]
- sector: one of ["Üretim & İmalat", "İnşaat & Saha", "Lojistik & Sevkiyat", "Enerji & Karbon", "Finans & İK", "Perakende & Gıda", "Teknik & Mühendislik", "Atölye & Tamir"]

OUTPUT ONLY VALID JSON. NO MARKDOWN. NO EXPLANATIONS.

{
  "toolName": "...",
  "inputs": [...],
  "formulas": {...},
  "outputs": {...},
  "category": "...",
  "sector": "...",
  "premiumRequired": false
}`;
}

function isValidSchema(schema: unknown): schema is CalculatorSchema {
  if (!schema || typeof schema !== "object") return false;
  const record = schema as Record<string, unknown>;
  return Boolean(
    record.toolName &&
      record.inputs &&
      record.formulas &&
      record.outputs &&
      record.category &&
      record.sector,
  );
}

async function generateSchema(
  toolName: string,
  apiKey: string,
  retry = 0,
  modelIndex = 0,
): Promise<CalculatorSchema | null> {
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing");

  const model: DeepSeekModel = MODEL_CHAIN[modelIndex] ?? MODEL_CHAIN[MODEL_CHAIN.length - 1];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let lastContentLength = 0;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a TÜV-qualified, ISO 9001-certified industrial engineer. Output ONLY valid JSON.",
          },
          { role: "user", content: buildPrompt(toolName) },
        ],
        temperature: 0.05,
        max_tokens: MAX_TOKENS,
        response_format: { type: "json_object" },
      }),
    });

    const payload = (await response.json()) as DeepSeekResponse;
    if (!response.ok) {
      throw new Error(payload.error?.message ?? `HTTP ${response.status}`);
    }

    const content = payload.choices?.[0]?.message?.content ?? "";
    lastContentLength = content.trim().length;
    const schema = parseModelJson(content);

    if (!isValidSchema(schema)) {
      throw new Error(`Schema validation failed (content_len=${content.trim().length})`);
    }
    return schema;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const emptyResponse = message.includes("Empty model response");

    if (emptyResponse && modelIndex < MODEL_CHAIN.length - 1) {
      const nextModel = MODEL_CHAIN[modelIndex + 1];
      console.log(`   ↪ ${toolName} → ${nextModel} (boş yanıt)`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return generateSchema(toolName, apiKey, 0, modelIndex + 1);
    }

    if (retry < MAX_RETRIES - 1) {
      console.log(`   🔄 ${toolName} [${model}] (${retry + 1}/${MAX_RETRIES}) — ${message}`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return generateSchema(toolName, apiKey, retry + 1, modelIndex);
    }
    if (modelIndex < MODEL_CHAIN.length - 1) {
      const nextModel = MODEL_CHAIN[modelIndex + 1];
      console.log(`   ↪ ${toolName} → ${nextModel} modeline geçiliyor`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return generateSchema(toolName, apiKey, 0, modelIndex + 1);
    }
    logFailedTool(toolName, message, lastContentLength);
    console.error(`   ❌ ${toolName} başarısız: ${message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function acquireShardLock(shardId: number): void {
  const lockFile = `/tmp/resume-shard-${shardId}.lock`;
  if (fs.existsSync(lockFile)) {
    const raw = fs.readFileSync(lockFile, "utf-8").trim();
    const existingPid = Number(raw);
    if (Number.isFinite(existingPid) && existingPid > 0) {
      try {
        process.kill(existingPid, 0);
        console.log(`⚠️  Shard ${shardId} zaten çalışıyor (pid ${existingPid}). Çıkılıyor.`);
        process.exit(0);
      } catch {
        // stale lock
      }
    }
  }
  fs.writeFileSync(lockFile, String(process.pid));
  const release = (): void => {
    try {
      if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
    } catch {
      // ignore
    }
  };
  process.on("exit", release);
  process.on("SIGINT", () => {
    release();
    process.exit(0);
  });
}

async function main(): Promise<void> {
  const cli = parseCliOptions(process.argv.slice(2));
  const shardId = cli.shardId;
  const shardCount = cli.shardCount;
  const apiKey = resolveDeepSeekApiKey(shardId ?? undefined);

  if (!apiKey) {
    console.error("❌ DEEPSEEK_API_KEY eksik");
    process.exit(1);
  }

  if ((shardId === null) !== (shardCount === null)) {
    console.error("❌ --shard-id ve --shard-count birlikte verilmeli");
    process.exit(1);
  }

  if (shardId !== null) {
    acquireShardLock(shardId);
  }

  const progressFile = resolveProgressFile(shardId);
  const concurrency = resolveConcurrency(shardCount);
  const queueTools = loadResumeQueueTools();
  let pending = queueTools.filter((name) => !schemaExists(name));

  if (shardId !== null && shardCount !== null) {
    const ranges = buildShardRanges(queueTools.length, shardCount);
    const range = ranges[shardId - 1];
    if (!range) {
      console.error(`❌ Geçersiz shard: ${shardId}/${shardCount}`);
      process.exit(1);
    }
    pending = queueTools.slice(range.start, range.end).filter((name) => !schemaExists(name));
  }

  const progress = loadProgress(progressFile);
  const merged = loadResumeProgressMerged();
  const doneGlobal = new Set([...merged.completed, ...progress.completed]);
  pending = pending.filter((name) => !doneGlobal.has(name));

  const shardLabel =
    shardId !== null && shardCount !== null ? `shard ${shardId}/${shardCount}` : "tek süreç";

  console.log("\n🔁 FAILED TOOLS RESUME BATCH");
  console.log(`   Mod: ${shardLabel}`);
  console.log(`   Toplam failed kayıt: ${loadAllFailed().length}`);
  console.log(`   Kuyruk manifest: ${queueTools.length}`);
  console.log(`   Global schema eksik: ${collectPendingTools().length}`);
  console.log(`   Bu parçada kuyruk: ${pending.length}`);
  console.log(`   Paralel: ${concurrency}  │  Progress: ${path.basename(progressFile)}\n`);

  if (pending.length === 0) {
    console.log("✅ Bu parçadaki tüm araçların schema dosyası mevcut.");
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let { completed, failed } = progress;
  failed = failed.filter((name) => pending.includes(name) || !schemaExists(name));

  let index = 0;
  while (index < pending.length) {
    const batch = pending.slice(index, index + concurrency);
    console.log(`📡 ${index + 1}-${Math.min(index + batch.length, pending.length)}/${pending.length}`);

    const results = await Promise.all(
      batch.map(async (toolName) => {
        if (schemaExists(toolName)) {
          console.log(`   ⏭️  ${toolName} (schema mevcut)`);
          return { toolName, schema: null, skipped: true as const };
        }
        console.log(`   🔧 ${toolName}...`);
        const schema = await generateSchema(toolName, apiKey);
        return { toolName, schema, skipped: false as const };
      }),
    );

    for (const { toolName, schema, skipped } of results) {
      if (skipped) {
        if (!completed.includes(toolName)) completed.push(toolName);
        failed = failed.filter((name) => name !== toolName);
        continue;
      }
      if (schema) {
        const filePath = path.join(OUTPUT_DIR, `${schema.toolName}-schema.json`);
        fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));
        if (!completed.includes(toolName)) completed.push(toolName);
        failed = failed.filter((name) => name !== toolName);
        console.log(`   ✅ ${toolName}`);
      } else if (!failed.includes(toolName)) {
        failed.push(toolName);
        console.log(`   ❌ ${toolName}`);
      }
    }
    saveProgress(progressFile, completed, failed);
    index += concurrency;
  }

  console.log(`\n✅ RESUME TAMAMLANDI (${shardLabel}). Başarılı: ${completed.length}, Başarısız: ${failed.length}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
