#!/usr/bin/env node
/**
 * Pre-commit secret leak scanner — checks staged + unstaged diffs and tracked sensitive filenames.
 * Exit 1 if likely secret material is detected.
 */

import { execSync } from "node:child_process";

const SENSITIVE_FILE_PATTERN =
  /(?:^|\/)(?:\.env\.local|\.env(?:\..+)?$|.*service-account.*\.json|.*firebase-adminsdk.*\.json|credentials\.json|.*\.pem|.*\.key)$/i;

/** Public template only — not a runtime secret file. */
const SENSITIVE_FILENAME_ALLOWLIST = new Set([".env.example"]);

const ENV_EXAMPLE_PUBLIC_FLAG_LINE =
  /^\s*#?\s*NEXT_PUBLIC_[A-Z0-9_]+\s*=\s*(?:true|false)\s*$/;

/** Public canonical origin in .env.example — not a secret. */
const ENV_EXAMPLE_PUBLIC_SITE_URL_LINE =
  /^\s*#?\s*NEXT_PUBLIC_SITE_URL\s*=\s*https:\/\/[^\s#]+\s*$/;

/** Public calculate API rate-limit template (no secrets). */
const ENV_EXAMPLE_PUBLIC_CALCULATE_LINE =
  /^\s*#?\s*PUBLIC_CALCULATE_[A-Z0-9_]+\s*=/;

/** Upstash REST template placeholders (empty in .env.example). */
const ENV_EXAMPLE_UPSTASH_LINE =
  /^\s*#?\s*UPSTASH_REDIS_REST_[A-Z0-9_]+\s*=/;

/** AI customer model names — not secrets, just model identifiers. */
const ENV_EXAMPLE_AI_MODEL_LINE =
  /^\s*#?\s*AI_CUSTOMER_(FLASH|PRO)_MODEL\s*=\s*"deepseek-(chat|reasoner)"\s*$/;

/** Lokalise TMS template lines — empty values or public flags. */
const ENV_EXAMPLE_LOKALISE_LINE =
  /^\s*#?\s*LOKALISE_[A-Z_]+(?:_TOKEN|_ID|_PULL|_VERSION|_ENABLED)?\s*=\s*(?:"[^"]*"|true|false|\d+\.\d+\.\d+)?\s*$/;

/** NEXT_PUBLIC Lokalise OTA token template — empty in example. */
const ENV_EXAMPLE_NEXT_PUBLIC_LOKALISE_LINE =
  /^\s*#?\s*NEXT_PUBLIC_LOKALISE_[A-Z_]+\s*=\s*(?:"[^"]*")?\s*$/;

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
  const hits = names.filter(
    (name) => SENSITIVE_FILE_PATTERN.test(name) && !SENSITIVE_FILENAME_ALLOWLIST.has(name),
  );
  return hits;
}

function getAddedDiffLines(path) {
  const stagedDiff = run(`git diff --cached -- ${path}`);
  const unstagedDiff = run(`git diff -- ${path}`);
  const combined = `${stagedDiff}\n${unstagedDiff}`;

  return combined
    .split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .map((line) => line.slice(1));
}

function checkEnvExampleDiff() {
  const staged = run("git diff --cached --name-only");
  const unstaged = run("git diff --name-only");
  const names = [...new Set([...staged.split("\n"), ...unstaged.split("\n")].filter(Boolean))];

  if (!names.includes(".env.example")) {
    return [];
  }

  const violations = [];
  for (const line of getAddedDiffLines(".env.example")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    if (
      !ENV_EXAMPLE_PUBLIC_FLAG_LINE.test(trimmed) &&
      !ENV_EXAMPLE_PUBLIC_SITE_URL_LINE.test(trimmed) &&
      !ENV_EXAMPLE_PUBLIC_CALCULATE_LINE.test(trimmed) &&
      !ENV_EXAMPLE_UPSTASH_LINE.test(trimmed) &&
      !ENV_EXAMPLE_AI_MODEL_LINE.test(trimmed) &&
      !ENV_EXAMPLE_LOKALISE_LINE.test(trimmed) &&
      !ENV_EXAMPLE_NEXT_PUBLIC_LOKALISE_LINE.test(trimmed)
    ) {
      violations.push(trimmed);
    }
  }

  return violations;
}

const SELF_SCAN_EXCLUDE_PATH = "scripts/check-commit-secrets.mjs";

function checkDiffContent() {
  const stagedDiff = run(`git diff --cached -- . ':!${SELF_SCAN_EXCLUDE_PATH}'`);
  const unstagedDiff = run(`git diff -- . ':!${SELF_SCAN_EXCLUDE_PATH}'`);
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
  const envExampleHits = checkEnvExampleDiff();
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

  if (envExampleHits.length > 0) {
    failed = true;
    console.error("✗ .env.example diff contains non-allowlisted uncommented lines:");
    for (const hit of envExampleHits) {
      console.error(`  - ${hit}`);
    }
    console.error("");
  } else if (run("git diff --name-only") || run("git diff --cached --name-only")) {
    const names = [
      ...new Set(
        [
          ...run("git diff --cached --name-only").split("\n"),
          ...run("git diff --name-only").split("\n"),
        ].filter(Boolean),
      ),
    ];
    if (names.includes(".env.example")) {
      console.log("✓ .env.example diff limited to comments or public NEXT_PUBLIC_* flags");
    }
  }

  if (failed) {
    console.error("Secret scan FAILED. Remove secrets before commit.");
    process.exit(1);
  }

  console.log("\nSecret scan passed.");
}

main();
