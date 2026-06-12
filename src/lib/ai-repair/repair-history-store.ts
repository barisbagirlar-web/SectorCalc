import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { RepairHistoryEntry, RepairHistorySummary } from "./repair-types";

/**
 * JSONL history store is intentionally file-based and synchronous.
 *
 * AI repair is a low-frequency developer/support workflow, not a high-throughput
 * user-facing runtime path. Reading the file per decision is acceptable.
 *
 * The store must never contain API keys, raw env values, full logs or secrets.
 */
const HISTORY_DIR = path.join(process.cwd(), ".sectorcalc");
const HISTORY_FILE = path.join(HISTORY_DIR, "ai-repair-history.jsonl");

function historyEnabled() {
  return process.env.AI_REPAIR_HISTORY_ENABLED !== "false";
}

function ensureHistoryDir() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

export function appendRepairHistory(entry: RepairHistoryEntry) {
  if (!historyEnabled()) return;

  ensureHistoryDir();

  fs.appendFileSync(HISTORY_FILE, `${JSON.stringify(entry)}\n`, "utf8");
}

export function readRepairHistory(): RepairHistoryEntry[] {
  if (!historyEnabled()) return [];
  if (!fs.existsSync(HISTORY_FILE)) return [];

  const maxDays = Number(process.env.AI_REPAIR_HISTORY_MAX_DAYS || 30);
  const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;

  return fs
    .readFileSync(HISTORY_FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as RepairHistoryEntry;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is RepairHistoryEntry => Boolean(entry))
    .filter((entry) => new Date(entry.createdAt).getTime() >= cutoff);
}

export function summarizeRepairHistory(fingerprint: string): RepairHistorySummary {
  const entries = readRepairHistory().filter((entry) => entry.fingerprint === fingerprint);

  const summary: RepairHistorySummary = {
    fingerprint,
    flashAttempts: 0,
    flashFailures: 0,
    flashSuccesses: 0,
    proAttempts: 0,
    proFailures: 0,
    proSuccesses: 0,
    humanReviewCount: 0,
    lastOutcome: entries.at(-1)?.outcome,
  };

  for (const entry of entries) {
    if (entry.modelTier === "flash") {
      summary.flashAttempts += 1;
      if (entry.outcome === "failure") summary.flashFailures += 1;
      if (entry.outcome === "success") summary.flashSuccesses += 1;
    }

    if (entry.modelTier === "pro") {
      summary.proAttempts += 1;
      if (entry.outcome === "failure") summary.proFailures += 1;
      if (entry.outcome === "success") summary.proSuccesses += 1;
    }

    if (entry.modelTier === "human-review") {
      summary.humanReviewCount += 1;
    }
  }

  return summary;
}
