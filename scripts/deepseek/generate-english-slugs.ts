#!/usr/bin/env npx tsx
/**
 * Generate proper English slugs for all 358 free tools using DeepSeek.
 * Input: current Turkish slug + English description (de) from section definitions.
 * Output: mapping file scripts/data/english-slug-map.json
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal } from "../ai/load-env-local.mjs";

loadEnvLocal();

const PROJECT_ROOT = process.cwd();
const OUT_PATH = path.join(PROJECT_ROOT, "scripts", "data", "english-slug-map.json");

import { section1 } from "./lib/359-section1";
import { section2 } from "./lib/359-section2";
import { section3 } from "./lib/359-section3";
import { section4 } from "./lib/359-section4";
import { section5 } from "./lib/359-section5";
import { section6 } from "./lib/359-section6";
import { section7 } from "./lib/359-section7";
import { section8 } from "./lib/359-section8";
import { section9 } from "./lib/359-section9";
import { section10 } from "./lib/359-section10";
import { section11 } from "./lib/359-section11";
import { section12 } from "./lib/359-section12";
import { section13 } from "./lib/359-section13";
import { section14 } from "./lib/359-section14";
import { section15 } from "./lib/359-section15";
import { section16 } from "./lib/359-section16";
import { section17 } from "./lib/359-section17";
import { section18 } from "./lib/359-section18";
import { section19 } from "./lib/359-section19";
import { section20 } from "./lib/359-section20";
import { section21 } from "./lib/359-section21";
import { section22 } from "./lib/359-section22";

const ALL_DEFS = [
  ...section1, ...section2, ...section3, ...section4,
  ...section5, ...section6, ...section7, ...section8,
  ...section9, ...section10, ...section11, ...section12,
  ...section13, ...section14, ...section15, ...section16,
  ...section17, ...section18, ...section19, ...section20,
  ...section21, ...section22,
];

// Load existing DeepSeek English titles as reference
const titlesBundle = JSON.parse(
  fs.readFileSync(
    path.join(PROJECT_ROOT, "src/data/generated-tool-titles-i18n.generated.json"),
    "utf-8",
  ),
);

const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
if (!apiKey) {
  console.error("DEEPSEEK_API_KEY required in .env.local");
  process.exit(1);
}

interface ToolEntry {
  slug: string;
  enDesc: string;
  category: string;
  enTitle: string;
}

const items: ToolEntry[] = ALL_DEFS.map((def) => {
  const titleEntry = titlesBundle[def.slug] || titlesBundle[`${def.slug}-calculator`] || {};
  return {
    slug: def.slug,
    enDesc: def.de,
    category: def.cat,
    enTitle: titleEntry.en || def.slug,
  };
});

const BATCH_SIZE = 50;
const LOCALE_NAMES: Record<string, string> = {
  tr: "Turkish",
  de: "German",
  fr: "French", 
  es: "Spanish",
  ar: "Arabic",
};

async function translateBatch(
  batch: ToolEntry[],
  batchIndex: number,
): Promise<Record<string, string>> {
  const payload = Object.fromEntries(
    batch.map((item, i) => [`k${i}`, { slug: item.slug, desc: item.enDesc }]),
  );
  const reverse: Record<string, string> = {};
  for (let i = 0; i < batch.length; i++) {
    reverse[`k${i}`] = batch[i].slug;
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.05,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a slug generator for a global industrial calculator platform. " +
            "For each tool, generate an English kebab-case URL slug (lowercase, hyphens, no special chars). " +
            "Rules: (1) Use standard English industrial/engineering terms. (2) End with '-calculator'. " +
            "(3) Maximum 6 words before '-calculator'. (4) No Turkish words. (5) Be precise to the tool function. " +
            'Return JSON like: {"k0":"torque-calculator","k1":"bearing-life-calculator",...}',
        },
        {
          role: "user",
          content: JSON.stringify(
            Object.fromEntries(
              batch.map((item, i) => [
                `k${i}`,
                `Current slug: ${item.slug}\nDescription: ${item.enDesc}\nCategory: ${item.category}`,
              ]),
            ),
          ),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 400)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = json.choices?.[0]?.message?.content ?? "{}";
  
  // Parse JSON
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  }

  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(parsed)) {
    const oldSlug = reverse[key];
    if (oldSlug && typeof value === "string" && value.trim()) {
      result[oldSlug] = value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
    }
  }

  console.log(`  batch ${batchIndex}/${Math.ceil(items.length / BATCH_SIZE)}: ${Object.keys(result).length} slugs`);
  return result;
}

async function main() {
  console.log(`Generating English slugs for ${items.length} tools...`);
  
  const slugMap: Record<string, string> = {};
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const result = await translateBatch(batch, batchNum);
    Object.assign(slugMap, result);
    await new Promise((r) => setTimeout(r, 500));
  }

  // Validate coverage
  const missing = items.filter((item) => !slugMap[item.slug]);
  if (missing.length > 0) {
    console.warn(`Missing slugs for ${missing.length} tools. Using fallback...`);
    for (const item of missing) {
      // Fallback: derive from description
      const words = item.enDesc
        .replace(/[^a-zA-Z\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !["the", "and", "for", "from", "with", "using", "based", "this", "that", "are", "was"].includes(w.toLowerCase()))
        .slice(0, 5)
        .map((w) => w.toLowerCase());
      slugMap[item.slug] = words.join("-") + "-calculator";
    }
  }

  // Ensure all end with -calculator
  for (const [oldSlug, newSlug] of Object.entries(slugMap)) {
    if (!newSlug.endsWith("-calculator")) {
      slugMap[oldSlug] = newSlug + "-calculator";
    }
  }

  // Validate uniqueness
  const newSlugs = Object.values(slugMap);
  const dupes = newSlugs.filter((s, i) => newSlugs.indexOf(s) !== i);
  if (dupes.length > 0) {
    console.error(`DUPLICATE slugs: ${[...new Set(dupes)].join(", ")}`);
    // Deduplicate by appending -2, -3 etc
    const count = new Map<string, number>();
    for (const [oldSlug, newSlug] of Object.entries(slugMap)) {
      count.set(newSlug, (count.get(newSlug) || 0) + 1);
      if (count.get(newSlug)! > 1) {
        slugMap[oldSlug] = newSlug.replace(/-calculator$/, "") + `-${count.get(newSlug)}-calculator`;
      }
    }
  }

  // Write output
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(slugMap, null, 2), "utf-8");
  
  console.log(`\n=== SONUÇ ===`);
  console.log(`Mapped ${Object.keys(slugMap).length}/${items.length} tools`);
  console.log(`Output: ${OUT_PATH}`);
  
  // Show sample
  const keys = Object.keys(slugMap).slice(0, 10);
  for (const k of keys) {
    console.log(`  ${k} → ${slugMap[k]}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
