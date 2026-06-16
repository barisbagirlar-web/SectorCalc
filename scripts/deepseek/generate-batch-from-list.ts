#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";
import {
  defaultListFilePath,
  parseCalculatorListEntries,
  resolveSectionCategory,
  type CalculatorListEntry,
} from "./parse-calculator-list";

const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const BATCH_SIZE = Number(process.env.BATCH_SIZE ?? 5);
const DELAY_MS = Number(process.env.BATCH_DELAY_MS ?? 1000);
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

type RawSchema = Record<string, unknown>;

function parseCliLimit(argv: readonly string[]): number | null {
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--limit") return Number(argv[i + 1]);
    if (argv[i]?.startsWith("--limit=")) return Number(argv[i].slice(8));
  }
  const n = Number(argv.find((a) => a.startsWith("--limit="))?.slice(8));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function buildPrompt(entry: CalculatorListEntry): string {
  return `Generate JSON schema for "${entry.name}". toolName slug: "${entry.slug}". catalogCategory: "${resolveSectionCategory(entry.section)}".
Each input needs label, label_i18n (en,tr,de,fr,es,ar), businessContext, businessContext_i18n (6 locales), type number, unit, default.
formulas: only + - * / ** Math.* and input ids. premiumRequired: false. outputs.breakdown object. JSON only.`;
}

function enrichSchema(raw: RawSchema, entry: CalculatorListEntry): RawSchema {
  const formulas = (raw.formulas as Record<string, string>) ?? {};
  const keys = Object.keys(formulas);
  const primary = keys[0] ?? "result";
  const breakdown: Record<string, string> = {};
  for (const k of keys) breakdown[k] = k.replace(/_/g, " ");
  return {
    ...raw,
    toolName: entry.slug,
    catalogCategory: resolveSectionCategory(entry.section),
    premiumRequired: false,
    premiumFeatures: [],
    validation: { rules: [], thresholds: {} },
    formulas,
    outputs: {
      primary,
      breakdown,
      hiddenLossDrivers: [],
      suggestedActions: ["Verify inputs before decisions."],
      dataConfidenceAdjusted: primary,
    },
  };
}

async function generateSchema(entry: CalculatorListEntry): Promise<RawSchema | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing");
  const res = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat",
      temperature: 0.2,
      max_tokens: 2400,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Output valid JSON only. All 6 locales required in i18n fields." },
        { role: "user", content: buildPrompt(entry) },
      ],
    }),
  });
  const payload = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  if (!res.ok) return null;
  return enrichSchema(JSON.parse(payload.choices?.[0]?.message?.content ?? "{}") as RawSchema, entry);
}

async function main(): Promise<void> {
  loadEnvLocal();
  const argv = process.argv.slice(2);
  const limit = parseCliLimit(argv);
  const force = argv.includes("--force");
  let entries = parseCalculatorListEntries(defaultListFilePath());
  if (limit) entries = entries.slice(0, limit);
  console.log(`Queued ${entries.length} calculators`);
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  let ok = 0;
  let fail = 0;
  let skip = 0;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (entry) => {
        const out = path.join(OUTPUT_DIR, `${entry.slug}-schema.json`);
        if (!force && fs.existsSync(out)) {
          skip += 1;
          return;
        }
        const schema = await generateSchema(entry);
        if (!schema) {
          fail += 1;
          return;
        }
        fs.writeFileSync(out, `${JSON.stringify(schema, null, 2)}\n`);
        ok += 1;
        console.log(`✅ ${entry.slug}`);
      }),
    );
    if (i + BATCH_SIZE < entries.length) await new Promise((r) => setTimeout(r, DELAY_MS));
  }
  console.log(`Done ok=${ok} skip=${skip} fail=${fail}`);
  if (fail > 0) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
