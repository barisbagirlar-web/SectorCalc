import "server-only";

import { createHash } from "node:crypto";

import type { AuditSeal } from "../pro-form/contract-types";

const SHA256_PATTERN = /^sha256:[0-9a-f]{64}$/;

export interface AuditInput {
  inputHash: string;
  outputHash: string;
  schemaHash: string;
  formulaVersion: string;
  schemaVersion: string;
  runtimeVersion: string;
}

export function createAuditSeal(input: AuditInput): AuditSeal {
  const hashesAreValid = [input.inputHash, input.outputHash, input.schemaHash].every(
    (hash) => SHA256_PATTERN.test(hash),
  );

  return {
    seal_status: hashesAreValid ? "SEALED" : "FAILED",
    hash_algorithm: "SHA-256",
    input_hash: input.inputHash,
    output_hash: input.outputHash,
    schema_hash: input.schemaHash,
    formula_version: input.formulaVersion,
    schema_version: input.schemaVersion,
    runtime_version: input.runtimeVersion,
    executed_at: new Date().toISOString(),
    redaction_status: "PUBLIC_SAFE_REDACTED",
    signature_status: hashesAreValid ? "SERVER_SIGNATURE_OPTIONAL" : "FAILED",
    tamper_warning: hashesAreValid
      ? "SHA-256 provides tamper evidence; non-repudiation requires a separately managed signing key."
      : "Audit seal rejected because one or more hashes are not canonical SHA-256 values.",
  };
}

export function computeHash(data: string): string {
  return `sha256:${createHash("sha256").update(data, "utf8").digest("hex")}`;
}
