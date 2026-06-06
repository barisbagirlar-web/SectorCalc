#!/usr/bin/env node
/**
 * Pre-commit secret leak scanner — checks staged + unstaged diffs and tracked sensitive filenames.
 * Exit 1 if likely secret material is detected.
 */

import { execSync } from "node:child_process";

const SENSITIVE_FILE_PATTERN =
  /(?:^|\/)(?:\.env\.local|\.env(?:\..+)?$|.*service-account.*\.json|.*firebase-adminsdk.*\.json|credentials\.json|.*\.pem|.*\.key)$/i;

const DIFF_SECRET_PATTERNS = [
  /BEGIN PRIVATE KEY/,
  /BEGIN RSA PRIVATE KEY/,
  /"private_key"\s*:/,
  /"client_email"\s*:\s*"[^"]+@[^"]+\.iam\.gserviceaccount\.com"/,
  /sk_live_[A-Za-z0-9]+/,
  /sk_test_[A-Za-z0-9]{20,}/,
  /whsec_[A-Za-z0-9]+/,
  /STRIPE_SECRET_KEY\s*=\s*sk_/,
  /STRIPE_WEBHOOK_SECRET\s*=\s*whsec_/,
  /ADMIN_LEAD_UPDATE_SECRET\s*=\s*\S+/,
];

function run(command) {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

function checkSensitiveFilenames() {
  const staged = run("git diff --cached --name-only");
  const unstaged = run("git diff --name-only");
  const names = [...new Set([...staged.split("\n"), ...unstaged.split("\n")].filter(Boolean))];
  const hits = names.filter((name) => SENSITIVE_FILE_PATTERN.test(name));
  return hits;
}

function checkDiffContent() {
  const stagedDiff = run("git diff --cached");
  const unstagedDiff = run("git diff");
  const combined = `${stagedDiff}\n${unstagedDiff}`;
  const hits = [];

  for (const pattern of DIFF_SECRET_PATTERNS) {
    if (pattern.test(combined)) {
      hits.push(pattern.toString());
    }
  }

  return hits;
}

function main() {
  console.log("=== SectorCalc secret scan ===\n");

  const fileHits = checkSensitiveFilenames();
  const diffHits = checkDiffContent();
  let failed = false;

  if (fileHits.length > 0) {
    failed = true;
    console.error("✗ Sensitive filenames in git diff:");
    for (const file of fileHits) {
      console.error(`  - ${file}`);
    }
    console.error("");
  } else {
    console.log("✓ No sensitive filenames in staged/unstaged changes");
  }

  if (diffHits.length > 0) {
    failed = true;
    console.error("✗ Possible secret material in diff (patterns matched):");
    for (const hit of diffHits) {
      console.error(`  - ${hit}`);
    }
    console.error("");
  } else {
    console.log("✓ No secret patterns in diff content");
  }

  if (failed) {
    console.error("Secret scan FAILED. Remove secrets before commit.");
    process.exit(1);
  }

  console.log("\nSecret scan passed.");
}

main();
