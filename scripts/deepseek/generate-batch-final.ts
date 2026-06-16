#!/usr/bin/env npx tsx
/**
 * Final batch generation — deepseek-v4-pro (range + parallel shard support).
 *
 * Usage:
 *   npx tsx scripts/deepseek/generate-batch-final.ts
 *   npx tsx scripts/deepseek/generate-batch-final.ts --start=0 --end=1017
 *   npx tsx scripts/deepseek/generate-batch-final.ts --start 1017 --end 2034
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";
import { resolveDeepSeekApiKey } from "./deepseek-key-pool";
import { repairJsonText } from "./schema-json-utils";

loadEnvLocal();

const LIST_FILE = path.join(PROJECT_ROOT, "input_calculators.txt");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const FAILED_LOG = "/tmp/batch-failed-tools.log";
const DEEPSEEK_API_KEY = resolveDeepSeekApiKey();
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

// En güvenli ayarlar — kesik JSON / rate limit azaltma
const MAX_RETRIES = 5;
const CONCURRENCY = 3;
const RETRY_DELAY_MS = 8000;
const FETCH_TIMEOUT_MS = 300_000;
const MAX_TOKENS = 4000;

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

type CliRange = {
  startIndex: number;
  endIndex: number | null;
};

type CliOptions = CliRange & {
  retryFailed: boolean;
};

function parseCliOptions(argv: readonly string[]): CliOptions {
  let startIndex = 0;
  let endIndex: number | null = null;
  let retryFailed = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--retry-failed") {
      retryFailed = true;
    } else if (arg === "--start" && argv[i + 1]) {
      startIndex = Number(argv[i + 1]) || 0;
      i += 1;
    } else if (arg.startsWith("--start=")) {
      startIndex = Number(arg.slice(8)) || 0;
    } else if (arg === "--end" && argv[i + 1]) {
      endIndex = Number(argv[i + 1]) || null;
      i += 1;
    } else if (arg.startsWith("--end=")) {
      endIndex = Number(arg.slice(6)) || null;
    }
  }

  return {
    startIndex: Math.max(0, startIndex),
    endIndex: endIndex !== null && Number.isFinite(endIndex) ? endIndex : null,
    retryFailed,
  };
}

function resolveProgressFile(range: CliRange): string {
  if (range.endIndex === null && range.startIndex === 0) {
    return path.join(PROJECT_ROOT, ".batch-progress.json");
  }
  const endLabel = range.endIndex ?? "all";
  return path.join(PROJECT_ROOT, `.batch-progress-${range.startIndex}-${endLabel}.json`);
}

function sliceToolRange(allTools: readonly string[], range: CliRange): string[] {
  const end = range.endIndex ?? allTools.length;
  return allTools.slice(range.startIndex, end);
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

function parseModelJson(raw: string, toolName: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Empty model response");
  }
  const repaired = repairJsonText(trimmed);
  try {
    return JSON.parse(repaired) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${message} (raw=${trimmed.length} chars, repaired=${repaired.length} chars)`);
  }
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

async function generateSchema(toolName: string, retry = 0): Promise<CalculatorSchema | null> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY missing");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let lastContentLength = 0;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-v4-pro",
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
    const schema = parseModelJson(content, toolName);

    if (!isValidSchema(schema)) {
      throw new Error(`Schema validation failed (content_len=${content.trim().length})`);
    }
    return schema;
  } catch (error) {
    if (retry < MAX_RETRIES) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`   🔄 ${toolName} yeniden deneniyor... (${retry + 1}/${MAX_RETRIES}) — ${message}`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return generateSchema(toolName, retry + 1);
    }
    const message = error instanceof Error ? error.message : String(error);
    logFailedTool(toolName, message, lastContentLength);
    console.error(`   ❌ ${toolName} başarısız: ${message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function parseFullList(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[•\-*0-9]/.test(l) && !l.includes("(") && !l.includes(")"))
    .map((l) => l.replace(/\([^)]*\)/g, "").replace(/^[•\-*\d.]+/, "").trim())
    .filter((l) => l.length > 3);
}

async function main(): Promise<void> {
  if (!DEEPSEEK_API_KEY) {
    console.error("❌ DEEPSEEK_API_KEY eksik");
    process.exit(1);
  }

  const options = parseCliOptions(process.argv.slice(2));
  const range: CliRange = options;
  const progressFile = resolveProgressFile(range);
  const fullList = parseFullList(LIST_FILE);
  const allTools = sliceToolRange(fullList, range);
  const rangeLabel =
    range.endIndex === null
      ? `${range.startIndex} → son (${allTools.length} araç)`
      : `${range.startIndex} → ${range.endIndex} (${allTools.length} araç)`;

  console.log("\n🏭 TÜV-CERTIFIABLE BATCH GENERATION");
  console.log("   Model: deepseek-v4-pro (EN ÜST)");
  console.log(`   Aralık: ${rangeLabel}`);
  console.log(`   Progress: ${path.basename(progressFile)}`);
  console.log(`   Paralel: ${CONCURRENCY}  │  max_tokens: ${MAX_TOKENS}  │  timeout: ${FETCH_TIMEOUT_MS / 1000}sn`);
  console.log(`   Retry: ${MAX_RETRIES}x / ${RETRY_DELAY_MS / 1000}sn bekleme`);
  if (options.retryFailed) {
    console.log("   Mod: --retry-failed (başarısız araçlar yeniden denenir)");
  }
  console.log("   Standart: ISO 9001, ECMI, ASME, IEC\n");

  console.log(`📖 Bu parçada ${allTools.length} araç (liste toplam: ${fullList.length}).`);

  const progress = loadProgress(progressFile);
  let { completed, failed } = progress;
  if (options.retryFailed && failed.length > 0) {
    console.log(`🔁 ${failed.length} başarısız araç yeniden kuyruğa alınıyor.`);
    failed = [];
    saveProgress(progressFile, completed, failed);
  }
  const pending = allTools.filter((t) => !completed.includes(t) && !failed.includes(t));
  console.log(
    `📊 Kalan: ${pending.length}, Tamamlanan: ${completed.length}, Başarısız: ${failed.length}\n`,
  );

  if (pending.length === 0) {
    console.log("✅ Bu aralıktaki tüm araçlar işlendi.");
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let index = 0;
  while (index < pending.length) {
    const batch = pending.slice(index, index + CONCURRENCY);
    console.log(`📡 ${index + 1}-${Math.min(index + batch.length, pending.length)}/${pending.length}`);

    const results = await Promise.all(
      batch.map(async (toolName) => {
        console.log(`   🔧 ${toolName}...`);
        const schema = await generateSchema(toolName);
        return { toolName, schema };
      }),
    );

    for (const { toolName, schema } of results) {
      if (schema) {
        const fileName = `${schema.toolName}-schema.json`;
        const filePath = path.join(OUTPUT_DIR, fileName);
        fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));
        completed.push(toolName);
        console.log(`   ✅ ${toolName} (${completed.length}/${allTools.length})`);
      } else {
        failed.push(toolName);
        console.log(`   ❌ ${toolName} başarısız (${failed.length} hata)`);
      }
    }
    saveProgress(progressFile, completed, failed);

    index += CONCURRENCY;
  }

  console.log(`\n✅ TAMAMLANDI. Başarılı: ${completed.length}, Başarısız: ${failed.length}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
