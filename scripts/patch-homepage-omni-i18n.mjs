#!/usr/bin/env node
/** Patches homepageHybrid + enterpriseFooter + catalog search placeholder for Omni homepage rebuild. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const PATCH = JSON.parse(readFileSync(join(import.meta.dirname, "data/homepage-omni-i18n.json"), "utf8"));

for (const locale of Object.keys(PATCH)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  const block = PATCH[locale];

  data.homepageHybrid = block.homepageHybrid;
  Object.assign(data.enterpriseFooter, block.enterpriseFooter);
  data.catalogExplorer.search.placeholder.homepage = block.searchPlaceholder;

  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Patched messages/${locale}.json`);
}
