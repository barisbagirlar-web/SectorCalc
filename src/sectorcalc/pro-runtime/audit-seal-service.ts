// SectorCalc SuperV4 V5.3.1 Audit Seal Service
// Creates cryptographic audit seals for calculation results.

import { createHash } from "crypto";
import type { AuditSeal } from "../pro-form/contract-types";

export interface AuditInput {
  inputHash: string;
  outputHash: string;
  schemaHash: string;
  formulaVersion: string;
  schemaVersion: string;
  runtimeVersion: string;
}

/**
 * @param sealed Whether this seal represents a genuine, completed calculation
 *   (SEALED) or a blocked/failed request where no real computation occurred
 *   (FAILED). Defaults to true — callers building a seal for a blocked or
 *   error response must pass `false` explicitly.
 */
export function createAuditSeal(input: AuditInput, sealed: boolean = true): AuditSeal {
  return {
    seal_status: sealed ? "SEALED" : "FAILED",
    hash_algorithm: "SHA-256",
    input_hash: input.inputHash,
    output_hash: input.outputHash,
    schema_hash: input.schemaHash,
    formula_version: input.formulaVersion,
    schema_version: input.schemaVersion,
    runtime_version: input.runtimeVersion,
    executed_at: new Date().toISOString(),
    redaction_status: "PUBLIC_SAFE_REDACTED",
    signature_status: "UNSIGNED",
  };
}

/** Real SHA-256 (Node's built-in crypto, synchronous — this route runs in the Node.js runtime). */
export function computeHash(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

