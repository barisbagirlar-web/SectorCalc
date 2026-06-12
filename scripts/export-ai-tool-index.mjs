#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");

mkdirSync(PUBLIC_DIR, { recursive: true });
execSync("npx tsx scripts/run-export-ai-tool-index.ts", { cwd: ROOT, stdio: "inherit" });

if (!existsSync(join(PUBLIC_DIR, "ai-tool-index.json"))) {
  console.error("FAIL — ai-tool-index.json was not created");
  process.exit(1);
}

console.log("export:ai-tool-index PASS");
