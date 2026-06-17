#!/usr/bin/env node
/**
 * Fail fast when `.next` is incomplete — blocks fake recovery / partial Firebase deploy.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const NEXT = join(ROOT, ".next");

const REQUIRED_FILES = [
  "BUILD_ID",
  "routes-manifest.json",
  "build-manifest.json",
  "prerender-manifest.json",
  "server/app-paths-manifest.json",
  "server/middleware-manifest.json",
  "server/pages-manifest.json",
  "server/next-font-manifest.json",
];

/** @param {string} rel */
function assertFile(rel) {
  const abs = join(NEXT, rel);
  if (!existsSync(abs)) {
    return `missing ${rel}`;
  }
  const size = statSync(abs).size;
  if (size < 2) {
    return `empty ${rel}`;
  }
  return null;
}

/** @param {string} rel */
function assertJsonObject(rel) {
  const abs = join(NEXT, rel);
  try {
    const parsed = JSON.parse(readFileSync(abs, "utf8"));
    if (parsed === null || typeof parsed !== "object") {
      return `invalid JSON object in ${rel}`;
    }
    if (Object.keys(parsed).length === 0 && rel.includes("app-paths-manifest")) {
      return `empty app-paths-manifest.json`;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `corrupt ${rel}: ${message}`;
  }
  return null;
}

function main() {
  const errors = [];

  for (const rel of REQUIRED_FILES) {
    const fileError = assertFile(rel);
    if (fileError) {
      errors.push(fileError);
    }
  }

  for (const rel of [
    "routes-manifest.json",
    "build-manifest.json",
    "prerender-manifest.json",
    "server/app-paths-manifest.json",
    "server/pages-manifest.json",
    "server/middleware-manifest.json",
  ]) {
    if (existsSync(join(NEXT, rel))) {
      const jsonError = assertJsonObject(rel);
      if (jsonError) {
        errors.push(jsonError);
      }
    }
  }

  if (errors.length > 0) {
    console.error("validate-next-build: FAIL");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log("validate-next-build: OK");
}

main();
