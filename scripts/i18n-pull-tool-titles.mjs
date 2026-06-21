#!/usr/bin/env node
/**
 * Pull tool titles from Lokalise and merge back into generated-tool-titles-i18n.generated.json.
 * 
 * Tool titles are stored in Lokalise as flat keys (slug.title) per locale.
 * The existing i18n:pull downloads all project keys into messages/*.json.
 * This script extracts tool-title keys from messages/{locale}.json,
 * transforms them back into nested format, and merges into the titles file.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  resolveMessagesDir,
  TMS_LOCALES,
} from "./lib/i18n-lokalise.mjs";

const ROOT = process.cwd();
const MESSAGES_DIR = resolveMessagesDir(ROOT);
const TITLES_PATH = join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");

const TITLE_SUFFIX = ".title";

// Read existing titles (keep non-Lokalise-managed entries)
const existingTitles = JSON.parse(readFileSync(TITLES_PATH, "utf8"));

let totalMerged = 0;
let totalNew = 0;

for (const locale of TMS_LOCALES) {
  const msgPath = join(MESSAGES_DIR, `${locale}.json`);
  let messages;
  try {
    messages = JSON.parse(readFileSync(msgPath, "utf8"));
  } catch {
    console.log(`   ⤷ ${locale}: messages file not found, skipping`);
    continue;
  }

  let localeCount = 0;
  for (const [key, value] of Object.entries(messages)) {
    if (key.endsWith(TITLE_SUFFIX) && typeof value === "string") {
      const slug = key.slice(0, -TITLE_SUFFIX.length);
      if (!existingTitles[slug]) {
        existingTitles[slug] = {};
        totalNew++;
      }
      existingTitles[slug][locale] = value;
      localeCount++;
    }
  }

  if (localeCount > 0) {
    console.log(`   ← ${locale}: ${localeCount} titles merged`);
    totalMerged += localeCount;
  }
}

if (totalMerged > 0) {
  writeFileSync(TITLES_PATH, `${JSON.stringify(existingTitles, null, 2)}\n`, "utf8");
  console.log(`✅ Tool titles merged: ${totalMerged} entries (${totalNew} new) → ${TITLES_PATH}`);
} else {
  console.log("⚠  No tool title keys found in messages. Push first: npm run i18n:push-tool-titles");
}
