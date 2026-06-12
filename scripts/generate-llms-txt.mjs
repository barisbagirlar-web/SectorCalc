#!/usr/bin/env node
/**
 * Deprecated legacy llms.txt generator.
 * P38 canonical output is produced only by export:ai-index.
 */
import { execSync } from "node:child_process";
import { join } from "node:path";

console.error(
  "generate-llms-txt.mjs is deprecated. Use npm run export:ai-index for canonical llms.txt.",
);
execSync("node scripts/export-ai-index.mjs", {
  cwd: join(import.meta.dirname, ".."),
  stdio: "inherit",
});
