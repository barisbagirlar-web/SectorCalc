#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const exportPath = join(ROOT, ".next/export/500.html");
const serverPath = join(ROOT, ".next/server/pages/500.html");
const FALLBACK_500 =
  "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"/><title>500</title></head><body><h1>500 — Server error</h1></body></html>\n";

mkdirSync(join(ROOT, ".next/export"), { recursive: true });
mkdirSync(join(ROOT, ".next/server/pages"), { recursive: true });

if (existsSync(serverPath)) {
  copyFileSync(serverPath, exportPath);
} else {
  writeFileSync(exportPath, FALLBACK_500, "utf8");
  writeFileSync(serverPath, FALLBACK_500, "utf8");
}
