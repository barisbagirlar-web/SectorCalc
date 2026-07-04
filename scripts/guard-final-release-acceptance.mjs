#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";

function run(command) {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr) : "";
    const stdout = error.stdout ? String(error.stdout) : "";
    throw new Error(`${command}\n${stdout}\n${stderr}`.trim());
  }
}

function fail(message) {
  console.error(`FINAL_RELEASE_ACCEPTANCE_GUARD=FAIL`);
  console.error(message);
  process.exit(1);
}

function pass(message) {
  console.log(`FINAL_RELEASE_ACCEPTANCE_GUARD=PASS`);
  console.log(message);
}

const status = run("git status --short");

if (status.length > 0) {
  fail(`Working tree is not clean:\n${status}`);
}

const branch = run("git branch --show-current");
const head = run("git rev-parse HEAD");
const remote = run(`git ls-remote origin ${branch} | awk '{print $1}'`);

if (!remote) {
  fail(`Branch is not pushed to origin: ${branch}`);
}

if (head !== remote) {
  fail(`Local HEAD does not equal remote branch.\nlocal:  ${head}\nremote: ${remote}`);
}

const requiredScripts = [
  "scripts/guard-single-tool-form-runtime.mjs",
  "scripts/guard-public-tool-render-contracts.mjs",
  "scripts/guard-tool-access-policy.mjs",
  "scripts/smoke-single-form-runtime.mjs",
  "scripts/smoke-tool-access-policy.mjs",
  "scripts/smoke-page-runtime.mjs",
  "scripts/smoke-sitemap-tools-release.mjs",
];

const missing = requiredScripts.filter((file) => !fs.existsSync(file));
if (missing.length > 0) {
  fail(`Required release scripts are missing:\n${missing.join("\n")}`);
}

pass(`branch=${branch}\nhead=${head}\nremote=${remote}`);
