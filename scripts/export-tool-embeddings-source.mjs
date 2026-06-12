#!/usr/bin/env node
import { execSync } from "node:child_process";
import { join } from "node:path";

execSync("node scripts/export-ai-index.mjs", {
  cwd: join(import.meta.dirname, ".."),
  stdio: "inherit",
});
