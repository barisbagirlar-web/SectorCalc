#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TARGET_FILE = "src/sectorcalc/runtime/pro-schema-loader.ts";
const SAFE_VAULT_DIR = ".sectorcalc-safe-vault";
const ALLOWED_MODES = new Set(["stash", "revert", "inspect"]);

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: options.stdio || ["ignore", "pipe", "pipe"],
  }).trim();
}

function fail(message) {
  console.error("PRO_SCHEMA_LOADER_DIRTY_RESOLVER=FAIL");
  console.error(message);
  process.exit(1);
}

function getArgValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;

  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) return fallback;

  return value;
}

function getStatusLines() {
  const output = run("git", ["status", "--short"]);
  if (!output) return [];
  return output.split("\n").map((line) => line.trim()).filter(Boolean);
}

function isTargetDirty(statusLine) {
  return statusLine.endsWith(TARGET_FILE) || statusLine.includes(` ${TARGET_FILE}`);
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function ensureSafeVault() {
  mkdirSync(SAFE_VAULT_DIR, { recursive: true });
}

function writePatchBackup() {
  ensureSafeVault();

  const diff = run("git", ["diff", "--", TARGET_FILE]);

  if (!diff) {
    return null;
  }

  const patchPath = join(
    SAFE_VAULT_DIR,
    `pro-schema-loader-${timestamp()}.patch`,
  );

  writeFileSync(patchPath, diff, "utf8");
  return patchPath;
}

function assertOnlyTargetDirty(statusLines) {
  const nonTarget = statusLines.filter((line) => !isTargetDirty(line));

  if (nonTarget.length > 0) {
    fail(
      [
        "Working tree has dirty files outside the allowed target.",
        "This resolver is allowed to handle only:",
        TARGET_FILE,
        "",
        "Other dirty files:",
        ...nonTarget.map((line) => `- ${line}`),
      ].join("\n"),
    );
  }
}

function inspect() {
  const statusLines = getStatusLines();
  const targetLines = statusLines.filter(isTargetDirty);

  console.log("PRO_SCHEMA_LOADER_DIRTY_RESOLVER=INSPECT");
  console.log(`target_file=${TARGET_FILE}`);
  console.log(`working_tree_entries=${statusLines.length}`);
  console.log(`target_dirty=${targetLines.length > 0 ? "YES" : "NO"}`);

  if (statusLines.length > 0) {
    console.log("");
    console.log("GIT_STATUS_SHORT:");
    for (const line of statusLines) console.log(line);
  }

  if (targetLines.length > 0) {
    const diff = run("git", ["diff", "--stat", "--", TARGET_FILE]);
    console.log("");
    console.log("TARGET_DIFF_STAT:");
    console.log(diff || "NO_DIFF_STAT");
  }
}

function revertTarget() {
  const statusLines = getStatusLines();

  if (statusLines.length === 0) {
    console.log("PRO_SCHEMA_LOADER_DIRTY_RESOLVER=PASS");
    console.log("action=NONE_ALREADY_CLEAN");
    return;
  }

  assertOnlyTargetDirty(statusLines);

  const patchPath = writePatchBackup();

  run("git", ["restore", "--", TARGET_FILE], { stdio: ["ignore", "pipe", "pipe"] });

  const finalStatus = getStatusLines();

  if (finalStatus.length > 0) {
    fail(
      [
        "Working tree is still dirty after revert.",
        "",
        "git status --short:",
        ...finalStatus,
      ].join("\n"),
    );
  }

  console.log("PRO_SCHEMA_LOADER_DIRTY_RESOLVER=PASS");
  console.log("action=REVERTED");
  console.log(`target_file=${TARGET_FILE}`);
  console.log(`patch_backup=${patchPath || "NO_DIFF_TO_BACKUP"}`);
  console.log("working_tree=CLEAN");
}

function stashTarget() {
  const statusLines = getStatusLines();

  if (statusLines.length === 0) {
    console.log("PRO_SCHEMA_LOADER_DIRTY_RESOLVER=PASS");
    console.log("action=NONE_ALREADY_CLEAN");
    return;
  }

  assertOnlyTargetDirty(statusLines);

  const patchPath = writePatchBackup();

  run(
    "git",
    [
      "stash",
      "push",
      "-m",
      "wip: preserve pro schema loader prior work",
      "--",
      TARGET_FILE,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  const finalStatus = getStatusLines();

  if (finalStatus.length > 0) {
    fail(
      [
        "Working tree is still dirty after stash.",
        "",
        "git status --short:",
        ...finalStatus,
      ].join("\n"),
    );
  }

  console.log("PRO_SCHEMA_LOADER_DIRTY_RESOLVER=PASS");
  console.log("action=STASHED");
  console.log(`target_file=${TARGET_FILE}`);
  console.log(`patch_backup=${patchPath || "NO_DIFF_TO_BACKUP"}`);
  console.log("working_tree=CLEAN");
}

function main() {
  const mode = getArgValue("--mode", "inspect");

  if (!ALLOWED_MODES.has(mode)) {
    fail(`Invalid --mode value: ${mode}. Allowed: ${Array.from(ALLOWED_MODES).join(", ")}`);
  }

  if (!existsSync(TARGET_FILE)) {
    fail(`Target file does not exist: ${TARGET_FILE}`);
  }

  if (mode === "inspect") {
    inspect();
    return;
  }

  if (mode === "revert") {
    revertTarget();
    return;
  }

  if (mode === "stash") {
    stashTarget();
  }
}

main();
