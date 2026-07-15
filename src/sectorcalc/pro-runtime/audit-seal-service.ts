import "server-only";

import type { AuditSeal } from "../pro-form/contract-types";
import { sha256Json, sha256String } from "./cryptographic-hash";

export interface AuditInput {
  toolId?: string;
  toolKey?: string;
  inputHash: string;
  normalizedInputHash?: string;
  outputHash: string;
  schemaHash: string;
  proofPackHash?: string;
  formulaVersion: string;
  schemaVersion: string;
  runtimeVersion: string;
}

function isSha256Digest(value: string | undefined): boolean {
  return typeof value === "string" && /^sha256:[a-f0-9]{64}$/.test(value);
}

/**
 * Produces an integrity seal backed by real SHA-256 digests. The seal is not a
 * digital signature; signature_status remains UNSIGNED and must not be marketed
 * as third-party certification or non-repudiation.
 */
export function createAuditSeal(input: AuditInput): AuditSeal {
  const hashes = [
    input.inputHash,
    input.normalizedInputHash,
    input.outputHash,
    input.schemaHash,
    input.proofPackHash,
  ].filter((value): value is string => value !== undefined);
  const valid = hashes.length >= 3 && hashes.every(isSha256Digest);

  return {
    seal_status: valid ? "SEALED" : "FAILED",
    hash_algorithm: "SHA-256",
    tool_id: input.toolId,
    tool_key: input.toolKey,
    input_hash: input.inputHash,
    normalized_input_hash: input.normalizedInputHash,
    output_hash: input.outputHash,
    schema_hash: input.schemaHash,
    proof_pack_hash: input.proofPackHash,
    formula_version: input.formulaVersion,
    schema_version: input.schemaVersion,
    runtime_version: input.runtimeVersion,
    executed_at: new Date().toISOString(),
    redaction_status: "PUBLIC_SAFE_REDACTED",
    signature_status: "UNSIGNED",
    tamper_warning: valid
      ? "Integrity hashes are sealed with SHA-256; this record is not digitally signed or externally certified."
      : "Audit seal creation failed because one or more integrity digests were invalid.",
  };
}

export function computeHash(data: string): string {
  return sha256String(data);
}

export function computeObjectHash(data: unknown): string {
  return sha256Json(data);
}
