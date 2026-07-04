#!/usr/bin/env node
/**
 * DEPRECATED — mutates TR field labels in messages.freeToolInputs (hybrid garbage risk).
 * Field copy SSOT: src/data/free-tool-inputs-i18n.generated.json
 * Use: npm run sync:free-tool-inputs
 */
console.error(
  "polish-tr-field-label-residue: DEPRECATED — skipped (use sync:free-tool-inputs + generate:calculator-i18n)",
);
process.exit(0);

/** One-shot TR field label residue polish. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { loadEnvLocal } from "./ai/load-env-local.mjs";

const ROOT = join(import.meta.dirname, "..");
loadEnvLocal(ROOT);

const en = JSON.parse(readFileSync(join(ROOT, "messages/en.json"), "utf8"));
const tr = JSON.parse(readFileSync(join(ROOT, "messages/tr.json"), "utf8"));
const mapPath = join(ROOT, "archive/migration-only/scripts/data/calculator-field-labels-i18n.json");
const map = JSON.parse(readFileSync(mapPath, "utf8"));
if (!map.tr) {
  map.tr = {};
}

const COGNATES = new Set(["Minimum", "Maximum", "Total", "Base A", "Base B", "OEE", "DPMO"]);
const seen = new Set();
const leaks = [];

for (const [slug, fields] of Object.entries(tr.freeToolInputs ?? {})) {
  const enFields = en.freeToolInputs?.[slug] ?? {};
  for (const [fieldKey, copy] of Object.entries(fields ?? {})) {
    const enLabel = enFields[fieldKey]?.label ?? "";
    const label = copy?.label ?? "";
    if (!enLabel || label !== enLabel || seen.has(enLabel)) {
      continue;
    }
    if (enLabel.length <= 3 || COGNATES.has(enLabel)) {
      continue;
    }
    seen.add(enLabel);
    leaks.push(enLabel);
  }
}

console.log(`tr field label leaks: ${leaks.length}`);

async function translateBatch(entries) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const payload = Object.fromEntries(entries.map((value, index) => [`k${index}`, value]));
  const reverse = Object.fromEntries(entries.map((value, index) => [`k${index}`, value]));

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
          content:
            "Translate industrial calculator field labels to Turkish. Return JSON only with identical keys. Preserve units in parentheses, symbols, and brand tokens.",
        },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });

  const json = await response.json();
  const raw = json?.choices?.[0]?.message?.content ?? "{}";
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  const parsed = JSON.parse(cleaned);

  for (const [key, value] of Object.entries(parsed)) {
    const source = reverse[key];
    if (source && typeof value === "string" && value.trim() && value !== source) {
      map.tr[source] = value.trim();
    }
  }
}

for (let i = 0; i < leaks.length; i += 45) {
  const chunk = leaks.slice(i, i + 45);
  console.log(`batch ${Math.floor(i / 45) + 1} (${chunk.length})`);
  await translateBatch(chunk);
}

const SAFETY_TARGET = {
  tr: "Hedef güvenlik faktörü (SF)",
  de: "Sollwert Sicherheitsfaktor (SF)",
  fr: "Cible du facteur de sécurité (SF)",
  es: "Objetivo del factor de seguridad (SF)",
  ar: "هدف معامل الأمان (SF)",
};

for (const [locale, label] of Object.entries(SAFETY_TARGET)) {
  if (!map[locale]) {
    map[locale] = {};
  }
  map[locale]["Target Safety Factor (SF)"] = label;
}

writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`, "utf8");
console.log(`tr map size: ${Object.keys(map.tr).length}`);

execSync("npm run generate:calculator-i18n", { cwd: ROOT, stdio: "inherit" });
