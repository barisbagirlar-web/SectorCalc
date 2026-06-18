#!/usr/bin/env node
/**
 * Translates seven-muda-rev5 label blocks to DE/FR/ES/AR via DeepSeek.
 * Reads the EN_LABELS from the TS source and produces TS code blocks.
 *
 * Usage: node scripts/translate-muda-labels.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:dirname";
import { loadEnvLocal } from "./ai/load-env-local.mjs";

const ROOT = join(import.meta.dirname, "..");
const TS_PATH = join(ROOT, "src/lib/i18n/seven-muda-rev5-labels.ts");
loadEnvLocal(ROOT);

const TARGET_LOCALES = ["de", "fr", "es", "ar"];
const LOCALE_NAMES = { de: "German", fr: "French", es: "Spanish", ar: "Arabic" };

// Extract EN label strings from the TS file
const source = readFileSync(TS_PATH, "utf8");
const enMatch = source.match(/const EN_LABELS: SevenMudaRev5LabelCore = \{([^}]+)\};/);
if (!enMatch) { console.error("Could not find EN_LABELS"); process.exit(1); }

const labelLines = enMatch[1].split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("categoryName") && !l.startsWith("summaryLevelText") && !l.startsWith("confidenceText"));
const labels = {};
for (const line of labelLines) {
  const m = line.match(/^\s*(\w+):\s*"([^"]+)"/);
  if (m) labels[m[1]] = m[2];
}

// Also categories, summary levels, confidence levels
const catMatch = source.match(/const EN_CATEGORY_NAMES.*?= \{([^}]+)\};/s);
const sumMatch = source.match(/const EN_SUMMARY_LEVELS.*?= \{([^}]+)\};/s);
const confMatch = source.match(/const EN_CONFIDENCE.*?= \{([^}]+)\};/s);

function extractMap(text, match) {
  const map = {};
  if (!match) return map;
  const lines = match[1].split("\n").map(l => l.trim()).filter(l => l);
  for (const line of lines) {
    const m = line.match(/^\s*(\w+):\s*"([^"]+)"/);
    if (m) map[m[1]] = m[2];
  }
  return map;
}

const categories = extractMap(source, catMatch);
const summaryLevels = extractMap(source, sumMatch);
const confidence = extractMap(source, confMatch);

async function translateBlock(items, label, locale) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const localeName = LOCALE_NAMES[locale];

  const payload = {};
  let i = 0;
  for (const [key, value] of Object.entries(items)) {
    payload[`k${i}`] = value;
    i++;
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You translate industrial engineering labels to ${localeName} (${locale}). Return JSON only. Each key maps to a translated string. Translate naturally for manufacturing/quality context. Preserve technical abbreviations.`,
        },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });

  const json = await response.json();
  const raw = json?.choices?.[0]?.message?.content ?? "{}";
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  const parsed = JSON.parse(cleaned);

  const result = {};
  let idx = 0;
  for (const key of Object.keys(items)) {
    const val = parsed[`k${idx}`];
    if (typeof val === "string" && val.trim() && val.trim() !== items[key]) {
      result[key] = val.trim();
    }
    idx++;
  }
  return result;
}

function capitalizeCode(key) {
  return key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase().replace(/^_/, "");
}

async function main() {
  for (const locale of TARGET_LOCALES) {
    console.log(`\n--- Translating ${LOCALE_NAMES[locale]} (${locale}) labels ---`);
    
    const translatedLabels = await translateBlock(labels, "labels", locale);
    const translatedCategories = await translateBlock(categories, "categories", locale);
    const translatedSummaryLevels = await translateBlock(summaryLevels, "summary levels", locale);
    const translatedConfidence = await translateBlock(confidence, "confidence", locale);

    const localeUpper = locale.toUpperCase();
    
    console.log(`\nconst ${localeUpper}_LABELS: SevenMudaRev5LabelCore = {`);
    for (const [key, val] of Object.entries(translatedLabels)) {
      console.log(`  ${key}: "${val}",`);
    }
    console.log(`  categoryName: (key) => ${localeUpper}_CATEGORY_NAMES[key],`);
    console.log(`  summaryLevelText: (level) => ${localeUpper}_SUMMARY_LEVELS[level],`);
    console.log(`  confidenceText: (level) => ${localeUpper}_CONFIDENCE[level],`);
    console.log(`};`);

    console.log(`\nconst ${localeUpper}_CATEGORY_NAMES: Record<SevenMudaWasteCategoryKey | "none", string> = {`);
    for (const [key, val] of Object.entries(translatedCategories)) {
      console.log(`  ${key}: "${val}",`);
    }
    console.log(`};`);

    console.log(`\nconst ${localeUpper}_SUMMARY_LEVELS: Record<`);
    console.log(`  SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],`);
    console.log(`  string`);
    console.log(`> = {`);
    for (const [key, val] of Object.entries(translatedSummaryLevels)) {
      console.log(`  ${key}: "${val}",`);
    }
    console.log(`};`);

    console.log(`\nconst ${localeUpper}_CONFIDENCE: Record<SevenMudaEngineeringResult["confidenceLevel"], string> = {`);
    for (const [key, val] of Object.entries(translatedConfidence)) {
      console.log(`  ${key}: "${val}",`);
    }
    console.log(`};`);
  }
}

main().catch(console.error);
