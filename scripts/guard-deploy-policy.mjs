#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const RUNTIME_PATTERNS = [
  /^src\//,
  /^app\//,
  /^components\//,
  /^generated\/schemas\//,
  /^public\//,
  /^functions\//,
  /^middleware\.ts$/,
  /^middleware\.js$/,
  /^next\.config\./,
  /^firebase\.json$/,
  /^firestore\.rules$/,
  /^storage\.rules$/,
  /^vercel\.json$/,
];

const NON_RUNTIME_PATTERNS = [
  /^scripts\//,
  /^tests\//,
  /^docs\//,
  /^README/i,
  /^CHANGELOG/i,
  /^\.github\//,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /^yarn\.lock$/,
];

function runGit(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function getArgValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  return value && !value.startsWith("--") ? value : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function fail(message) {
  console.error("DEPLOY_POLICY_GUARD=FAIL");
  console.error(message);
  process.exit(1);
}

function classifyFile(file) {
  if (RUNTIME_PATTERNS.some((pattern) => pattern.test(file))) {
    return "runtime";
  }

  if (NON_RUNTIME_PATTERNS.some((pattern) => pattern.test(file))) {
    return "non_runtime";
  }

  return "review";
}

function getChangedFiles(commit) {
  const output = runGit([
    "diff-tree",
    "--no-commit-id",
    "--name-only",
    "-r",
    commit,
  ]);

  if (!output) return [];
  return output.split("\n").map((line) => line.trim()).filter(Boolean);
}

function assertWorkingTreeClean() {
  const status = runGit(["status", "--short"]);

  if (status.length > 0) {
    fail(`Working tree is not clean. Untracked/modified files exist:\n${status}`);
  }
}

function main() {
  const commit = getArgValue("--commit", "HEAD");
  const requireClean = hasFlag("--require-clean");
  const assertNoDeployNeeded = hasFlag("--assert-no-deploy-needed");
  const assertDeployRequired = hasFlag("--assert-deploy-required");

  if (requireClean) {
    assertWorkingTreeClean();
  }

  const changedFiles = getChangedFiles(commit);

  const runtimeFiles = [];
  const nonRuntimeFiles = [];
  const reviewFiles = [];

  for (const file of changedFiles) {
    const classification = classifyFile(file);

    if (classification === "runtime") {
      runtimeFiles.push(file);
    } else if (classification === "non_runtime") {
      nonRuntimeFiles.push(file);
    } else {
      reviewFiles.push(file);
    }
  }

  const deployRequired = runtimeFiles.length > 0 || reviewFiles.length > 0;

  if (assertNoDeployNeeded && deployRequired) {
    fail(
      [
        "Commit changes runtime or review-required files, so deploy cannot be skipped.",
        "",
        `commit: ${commit}`,
        "",
        "RUNTIME FILES:",
        runtimeFiles.length ? runtimeFiles.map((file) => `- ${file}`).join("\n") : "- NONE",
        "",
        "REVIEW FILES:",
        reviewFiles.length ? reviewFiles.map((file) => `- ${file}`).join("\n") : "- NONE",
      ].join("\n"),
    );
  }

  if (assertDeployRequired && !deployRequired) {
    fail(
      [
        "Commit does not contain runtime or review-required files.",
        "Deploy is not required by policy.",
        "",
        `commit: ${commit}`,
      ].join("\n"),
    );
  }

  console.log("DEPLOY_POLICY_GUARD=PASS");
  console.log(`commit=${commit}`);
  console.log(`changed_files=${changedFiles.length}`);
  console.log(`runtime_files=${runtimeFiles.length}`);
  console.log(`non_runtime_files=${nonRuntimeFiles.length}`);
  console.log(`review_files=${reviewFiles.length}`);
  console.log(`DEPLOY_REQUIRED=${deployRequired ? "YES" : "NO"}`);

  if (runtimeFiles.length > 0) {
    console.log("");
    console.log("RUNTIME_FILES:");
    for (const file of runtimeFiles) console.log(`- ${file}`);
  }

  if (reviewFiles.length > 0) {
    console.log("");
    console.log("REVIEW_FILES:");
    for (const file of reviewFiles) console.log(`- ${file}`);
  }

  if (!deployRequired) {
    console.log("");
    console.log("DEPLOY_DECISION=NO_DEPLOY_NEEDED");
  } else {
    console.log("");
    console.log("DEPLOY_DECISION=DEPLOY_REQUIRED");
  }
}

main();
