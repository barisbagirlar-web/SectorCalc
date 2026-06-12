#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const HISTORY_DIR = path.join(process.cwd(), ".sectorcalc");
const HISTORY_FILE = path.join(HISTORY_DIR, "ai-repair-history.jsonl");

const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{10,}/,
  /BEGIN PRIVATE KEY/,
  /firebase-adminsdk/,
  /service[_-]?account/i,
];

function sanitizeReason(value) {
  return String(value || "")
    .replace(/sk-proj-[A-Za-z0-9_-]+/g, "<api-key>")
    .replace(/sk-[A-Za-z0-9_-]+/g, "<api-key>")
    .replace(/[A-Za-z0-9_-]{32,}/g, "<token>")
    .slice(0, 500);
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function requiredArg(args, name) {
  const value = args[name];

  if (!value) {
    throw new Error(`Missing required argument: --${name}`);
  }

  return value;
}

function assertNoSecrets(values) {
  for (const value of values) {
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(value)) {
        throw new Error("Refusing to write secret-like content to repair history.");
      }
    }
  }
}

function ensureHistoryDir() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const repairId = requiredArg(args, "repair-id");
  const fingerprint = requiredArg(args, "fingerprint");
  const scope = requiredArg(args, "scope");
  const command = requiredArg(args, "command");
  const modelTier = requiredArg(args, "model-tier");
  const modelName = args["model-name"] ?? null;
  const outcome = requiredArg(args, "outcome");
  const deterministicGate = requiredArg(args, "deterministic-gate");
  const sanitizedFailureReason = args["failure-reason"]
    ? sanitizeReason(args["failure-reason"])
    : undefined;

  if (outcome !== "success" && outcome !== "failure") {
    throw new Error('--outcome must be "success" or "failure"');
  }

  if (!["flash", "pro", "human-review"].includes(modelTier)) {
    throw new Error('--model-tier must be "flash", "pro", or "human-review"');
  }

  if (!["pass", "fail", "not-run"].includes(deterministicGate)) {
    throw new Error('--deterministic-gate must be "pass", "fail", or "not-run"');
  }

  const entry = {
    repairId,
    fingerprint,
    scope,
    command,
    modelTier,
    modelName,
    outcome,
    deterministicGate,
    ...(sanitizedFailureReason ? { failureReason: sanitizedFailureReason } : {}),
    createdAt: new Date().toISOString(),
  };

  assertNoSecrets([
    repairId,
    fingerprint,
    scope,
    command,
    modelTier,
    modelName ?? "",
    outcome,
    deterministicGate,
    sanitizedFailureReason ?? "",
  ]);

  ensureHistoryDir();
  fs.appendFileSync(HISTORY_FILE, `${JSON.stringify(entry)}\n`, "utf8");

  console.log(`Recorded repair outcome for fingerprint ${fingerprint} (${outcome}).`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
