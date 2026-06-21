#!/usr/bin/env node
/**
 * Merge copy map translations into the generated-tool-titles-i18n bundle.
 * For each bundle entry, if the copy map has a better (different, non-English) TR/DE/FR/ES/AR translation,
 * update the bundle. Skips tools not in the copy map.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const TITLES_PATH = join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const COPY_MAP_PATH = join(ROOT, "scripts/data/generated-schema-copy-i18n.json");

const LOCALES = ["tr", "de", "fr", "es", "ar"];

function main() {
  const bundle = JSON.parse(readFileSync(TITLES_PATH, "utf8"));
  const copyMap = JSON.parse(readFileSync(COPY_MAP_PATH, "utf8"));
  const copyTitles = copyMap.toolTitles || {};

  let updated = 0;
  let skipped = 0;

  for (const [slug, bundleEntry] of Object.entries(bundle)) {
    const copyEntry = copyTitles[slug];
    if (!copyEntry) {
      skipped++;
      continue;
    }

    let changed = false;

    for (const locale of LOCALES) {
      const copyVal = (copyEntry[locale] || "").trim();
      const bundleVal = (bundleEntry[locale] || "").trim();
      const enVal = (bundleEntry.en || "").trim();

      if (copyVal && copyVal !== bundleVal) {
        // Copy map has a different value — prefer it if it's not just English + suffix
        if (!copyVal.startsWith(enVal) || copyVal === enVal) {
          bundleEntry[locale] = copyVal;
          changed = true;
        }
      }
    }

    if (changed) {
      updated++;
    }
  }

  if (updated > 0) {
    writeFileSync(TITLES_PATH, JSON.stringify(bundle, null, 2), "utf8");
    console.log(`Bundle updated: ${updated} entries merged from copy map`);
  } else {
    console.log("No updates needed — bundle already matches copy map");
  }

  console.log(`Skipped (no copy map entry): ${skipped}`);
  console.log(`Total bundle entries: ${Object.keys(bundle).length}`);
}

main();
