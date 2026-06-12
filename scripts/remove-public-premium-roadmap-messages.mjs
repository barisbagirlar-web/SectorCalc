#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

for (const locale of ["en", "tr", "de", "fr", "es", "ar"]) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  if (messages.catalogExplorer?.premiumRoadmap) {
    delete messages.catalogExplorer.premiumRoadmap;
    writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
    console.log(`removed catalogExplorer.premiumRoadmap from ${locale}`);
  }
}
