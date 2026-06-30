import crypto from "node:crypto";
import type { RepairRequestPayload } from "./repair-types";

/**
 * Repair fingerprint is intentionally NOT a unique request id.
 *
 * It represents an error-family / repair-pattern hash.
 * Different files or slightly different logs may produce the same fingerprint
 * if they normalize to the same underlying failure pattern.
 *
 * Use repairId for unique request tracking.
 * Use fingerprint for escalation memory:
 * - repeated Flash failure -> Pro
 * - repeated Pro failure -> human review
 */
function normalizeOutput(output: string) {
  return output
    .replace(/\/Users\/[^/\s]+/g, "/Users/<user>")
    .replace(/sk-proj-[A-Za-z0-9_-]+/g, "<api-key>")
    .replace(/sk-[A-Za-z0-9_-]+/g, "<api-key>")
    .replace(/[A-Fa-f0-9]{8,}/g, "<hash>")
    .replace(/[A-Za-z0-9_-]{32,}/g, "<token>")
    .replace(/\d+:\d+/g, "<line-col>")
    .replace(/\s+/g, " ")
    .slice(0, 2000)
    .toLowerCase()
    .trim();
}

export function createRepairFingerprint(payload: RepairRequestPayload) {
  const base = [
    String(payload.scope || "unknown").toLowerCase(),
    String(payload.command || "").toLowerCase(),
    normalizeOutput(String(payload.output || "")),
    (payload.changedFiles || []).sort().join("|"),
  ].join("\n");

  return crypto.createHash("sha256").update(base).digest("hex").slice(0, 24);
}

/** Unique id for a single repair API call. Not used for escalation grouping. */
export function createRepairId() {
  return crypto.randomUUID();
}
