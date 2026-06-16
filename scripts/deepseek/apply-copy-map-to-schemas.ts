#!/usr/bin/env npx tsx
/** Merge scripts/data/generated-schema-copy-i18n.json into schema label_i18n / businessContext_i18n. */
import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./load-env";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const COPY_MAP_PATH = path.join(PROJECT_ROOT, "scripts/data/generated-schema-copy-i18n.json");
const TITLES_PATH = path.join(PROJECT_ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"] as const;

type LocaleMap = Partial<Record<(typeof LOCALES)[number], string>>;

function loadJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function mergeLocaleMap(en: string, bucket: Record<string, LocaleMap> | undefined): LocaleMap {
  const map: LocaleMap = { en };
  if (!bucket?.[en]) return map;
  for (const locale of LOCALES) {
    if (locale === "en") continue;
    const value = bucket[en][locale]?.trim();
    if (value) map[locale] = value;
  }
  return map;
}

function main(): void {
  const copyMap = loadJson<{ labels?: Record<string, LocaleMap>; helpers?: Record<string, LocaleMap> }>(
    COPY_MAP_PATH,
    {},
  );
  const titles = loadJson<Record<string, LocaleMap>>(TITLES_PATH, {});
  let patched = 0;

  for (const file of fs.readdirSync(SCHEMAS_DIR)) {
    if (!file.endsWith("-schema.json")) continue;
    const slug = file.replace(/-schema\.json$/, "");
    const filePath = path.join(SCHEMAS_DIR, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
      inputs?: {
        label?: string;
        label_i18n?: LocaleMap;
        businessContext?: string;
        businessContext_i18n?: LocaleMap;
      }[];
      meta?: { name?: string };
      toolName?: string;
    };
    let changed = false;

    const titleEntry = titles[slug];
    if (titleEntry && raw.meta) {
      const nextName = titleEntry.en ?? raw.meta.name;
      if (nextName && raw.meta.name !== nextName) {
        raw.meta.name = nextName;
        changed = true;
      }
    }

    for (const input of raw.inputs ?? []) {
      const labelEn = input.label?.trim() ?? "";
      const helperEn = input.businessContext?.trim() ?? "";
      if (labelEn) {
        const merged = mergeLocaleMap(labelEn, copyMap.labels);
        if (JSON.stringify(input.label_i18n) !== JSON.stringify(merged)) {
          input.label_i18n = merged;
          changed = true;
        }
      }
      if (helperEn) {
        const merged = mergeLocaleMap(helperEn, copyMap.helpers);
        if (JSON.stringify(input.businessContext_i18n) !== JSON.stringify(merged)) {
          input.businessContext_i18n = merged;
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`);
      patched += 1;
    }
  }
  console.log(`apply-copy-map-to-schemas: patched ${patched} schemas`);
}

main();
