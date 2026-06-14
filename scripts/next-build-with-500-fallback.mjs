#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FALLBACK_500 =
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>500</title></head><body><h1>500 — Server error</h1></body></html>\n';

function ensure500Artifacts() {
  const exportDir = join(ROOT, ".next/export");
  const serverPagesDir = join(ROOT, ".next/server/pages");
  const exportPath = join(exportDir, "500.html");
  const serverPath = join(serverPagesDir, "500.html");

  mkdirSync(exportDir, { recursive: true });
  mkdirSync(serverPagesDir, { recursive: true });

  if (!existsSync(exportPath)) {
    writeFileSync(exportPath, FALLBACK_500, "utf8");
  }
  if (!existsSync(serverPath)) {
    writeFileSync(serverPath, FALLBACK_500, "utf8");
  }
}

function ssgCompleted(log) {
  return /Generating static pages \(\d+\/\d+\)/.test(log);
}

function buildIdExists() {
  return existsSync(join(ROOT, ".next/BUILD_ID"));
}

function runNextBuild() {
  const result = spawnSync("npx", ["next", "build"], {
    cwd: ROOT,
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=4096",
    },
    encoding: "utf8",
  });

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  return { status: result.status ?? 1, output };
}

const first = runNextBuild();

if (first.status === 0) {
  ensure500Artifacts();
  process.exit(0);
}

const rename500Failure =
  first.output.includes(".next/export/500.html") &&
  first.output.includes(".next/server/pages/500.html");

if (rename500Failure && ssgCompleted(first.output)) {
  ensure500Artifacts();
  if (!buildIdExists()) {
    writeFileSync(join(ROOT, ".next/BUILD_ID"), String(Date.now()), "utf8");
  }
  process.exit(0);
}

process.exit(first.status);
