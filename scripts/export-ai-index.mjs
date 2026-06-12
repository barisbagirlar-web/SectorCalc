#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const PUBLIC = join(ROOT, "public");

const required = [
  "ai-tool-index.json",
  "ai-tool-index.txt",
  "ai-categories.json",
  "ai-tool-routes.json",
  "ai-search-manifest.json",
  "ai-embedding-source.jsonl",
  "llms.txt",
];

execSync("npx tsx scripts/run-export-ai-index.ts", { cwd: ROOT, stdio: "inherit" });

for (const file of required) {
  if (!existsSync(join(PUBLIC, file))) {
    console.error(`FAIL — missing public/${file}`);
    process.exit(1);
  }
}

console.log("export:ai-index PASS");
