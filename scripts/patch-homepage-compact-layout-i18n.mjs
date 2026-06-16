#!/usr/bin/env node
/** Merges compact homepage layout i18n keys into all locale message files. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const PATCH = JSON.parse(
  readFileSync(join(import.meta.dirname, "data/homepage-compact-layout-i18n.json"), "utf8")
);

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      target[key] = deepMerge(target[key] ?? {}, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

const NAMESPACE_KEYS = ["home", "catalogExplorer", "homepageHybrid"];

for (const locale of Object.keys(PATCH)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  const localePatch = PATCH[locale];

  for (const namespace of NAMESPACE_KEYS) {
    if (localePatch[namespace]) {
      data[namespace] = deepMerge(data[namespace] ?? {}, localePatch[namespace]);
    }
  }

  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Patched compact layout i18n: messages/${locale}.json`);
}
