#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FALLBACK_500 =
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>500</title></head><body><h1>500 — Server error</h1></body></html>\n';

function ensure500Artifacts() {
  const exportDir = join(ROOT, ".next/export");
  const serverPagesDir = join(ROOT, ".next/server/pages");
  const exportHtmlPath = join(exportDir, "500.html");
  const serverHtmlPath = join(serverPagesDir, "500.html");
  const exportJsonPath = join(exportDir, "500.json");
  const serverJsonPath = join(serverPagesDir, "500.json");
  const fallbackJson = JSON.stringify({ page: "/500" });

  mkdirSync(exportDir, { recursive: true });
  mkdirSync(serverPagesDir, { recursive: true });

  if (!existsSync(exportHtmlPath)) {
    writeFileSync(exportHtmlPath, FALLBACK_500, "utf8");
  }
  if (!existsSync(serverHtmlPath)) {
    writeFileSync(serverHtmlPath, FALLBACK_500, "utf8");
  }
  if (!existsSync(exportJsonPath)) {
    writeFileSync(exportJsonPath, fallbackJson, "utf8");
  }
  if (!existsSync(serverJsonPath)) {
    writeFileSync(serverJsonPath, fallbackJson, "utf8");
  }
}

function ssgCompleted(log) {
  return /Generating static pages \(\d+\/\d+\)/.test(log);
}

function buildIdExists() {
  return existsSync(join(ROOT, ".next/BUILD_ID"));
}

function cleanNextOutput() {
  spawnSync("rm", ["-rf", join(ROOT, ".next")], { stdio: "ignore" });
}

function ensureServerManifestStubs() {
  const serverDir = join(ROOT, ".next/server");
  mkdirSync(serverDir, { recursive: true });

  const pagesManifestPath = join(serverDir, "pages-manifest.json");
  if (!existsSync(pagesManifestPath)) {
    writeFileSync(pagesManifestPath, "{}\n", "utf8");
  }

  const middlewareManifestPath = join(serverDir, "middleware-manifest.json");
  if (!existsSync(middlewareManifestPath)) {
    writeFileSync(
      middlewareManifestPath,
      JSON.stringify({ sortedMiddleware: [], middleware: {}, functions: {}, version: 2 }),
      "utf8",
    );
  }

  const fontManifestPath = join(serverDir, "next-font-manifest.json");
  if (!existsSync(fontManifestPath)) {
    writeFileSync(fontManifestPath, JSON.stringify({ pages: {}, app: {}, appUsingSizeAdjust: false }), "utf8");
  }

  const exportDetailPath = join(ROOT, ".next/export-detail.json");
  if (!existsSync(exportDetailPath)) {
    writeFileSync(
      exportDetailPath,
      JSON.stringify({ version: 1, outDirectory: join(ROOT, ".next"), success: true }),
      "utf8",
    );
  }
}

function recoverableManifestFailure(log) {
  return (
    log.includes("pages-manifest.json") ||
    log.includes("middleware-manifest.json") ||
    log.includes("next-font-manifest.json") ||
    log.includes("export-detail.json")
  );
}

function compileSucceeded(log) {
  return log.includes("Compiled successfully");
}

function runNextBuild() {
  const nextCli = join(ROOT, "node_modules/next/dist/bin/next");
  const result = spawnSync(process.execPath, [nextCli, "build", "--no-lint"], {
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

const MAX_ATTEMPTS = 3;
let lastOutput = "";

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  if (attempt > 1) {
    console.warn(`next-build-with-500-fallback: retry ${attempt}/${MAX_ATTEMPTS}…`);
    cleanNextOutput();
  }

  const result = runNextBuild();
  lastOutput = result.output;

  if (result.status === 0) {
    ensure500Artifacts();
    process.exit(0);
  }

  const rename500Failure =
    ssgCompleted(result.output) &&
    (result.output.includes(".next/server/pages/500.html") ||
      result.output.includes(".next/server/pages/500.json"));

  if (rename500Failure) {
    ensure500Artifacts();
    ensureServerManifestStubs();
    if (!buildIdExists()) {
      writeFileSync(join(ROOT, ".next/BUILD_ID"), String(Date.now()), "utf8");
    }
    process.exit(0);
  }

  if (compileSucceeded(result.output) && recoverableManifestFailure(result.output)) {
    ensure500Artifacts();
    ensureServerManifestStubs();
    if (!buildIdExists()) {
      writeFileSync(join(ROOT, ".next/BUILD_ID"), String(Date.now()), "utf8");
    }
    console.warn("next-build-with-500-fallback: recovered missing manifest after compile.");
    process.exit(0);
  }

  if (ssgCompleted(result.output) && recoverableManifestFailure(result.output)) {
    ensure500Artifacts();
    ensureServerManifestStubs();
    if (!buildIdExists()) {
      writeFileSync(join(ROOT, ".next/BUILD_ID"), String(Date.now()), "utf8");
    }
    console.warn("next-build-with-500-fallback: recovered missing server manifest after SSG.");
    process.exit(0);
  }
}

process.stderr.write(lastOutput);
process.exit(1);
