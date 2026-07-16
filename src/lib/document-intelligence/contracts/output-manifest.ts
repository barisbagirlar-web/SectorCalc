/**
 * Output Manifest — Generation & Validation
 *
 * The manifest is the cryptographic integrity contract between the extraction
 * pipeline and downstream consumers (storage, download, audit). Every output
 * file gets a SHA-256 hash recorded in the manifest. Consumers MUST call
 * validateManifest before trusting or forwarding any output file.
 *
 * SHA-256 is computed server-side via Node's native crypto module.
 * This module is NOT intended for browser/client execution.
 */

import { createHash } from "node:crypto";
import type {
  OutputManifest,
  OutputFileEntry,
  ProcessingSummary,
} from "@/types/document-intelligence";

/* ── Helpers ───────────────────────────────────────────────────── */

/**
 * Compute SHA-256 hex digest of a Buffer.
 */
function sha256Digest(content: Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Derive a storage path for a given job + filename.
 *
 * Convention: outputs/{jobId}/{filename}
 * This keeps all outputs for a single job collocated in storage.
 */
function storagePath(jobId: string, filename: string): string {
  return `outputs/${jobId}/${filename}`;
}

/**
 * Current output schema version.
 * Increment when the manifest schema contract changes.
 */
const OUTPUT_SCHEMA_VERSION = "1.0.0";

/* ── Public API ────────────────────────────────────────────────── */

/**
 * Generate an OutputManifest with SHA-256 hashes for every file.
 *
 * @param jobId               Unique job identifier.
 * @param outputGenerationId  Unique generation run identifier.
 * @param files               Array of output files with filename, content, and MIME type.
 * @param summary             ProcessingSummary from the validation pipeline.
 * @returns                   A fully populated OutputManifest.
 */
export function generateManifest(
  jobId: string,
  outputGenerationId: string,
  files: Array<{ filename: string; content: Buffer; contentType: string }>,
  summary: ProcessingSummary,
): OutputManifest {
  const fileEntries: OutputFileEntry[] = files.map((f) => {
    const hash = sha256Digest(f.content);

    return {
      filename: f.filename,
      contentType: f.contentType,
      sizeBytes: f.content.byteLength,
      sha256: hash,
      storagePath: storagePath(jobId, f.filename),
    };
  });

  return {
    jobId,
    outputGenerationId,
    files: fileEntries,
    summary: {
      ...summary,
      schemaVersion: OUTPUT_SCHEMA_VERSION,
    },
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Validate that every file in the manifest exists in actualFiles,
 * and that each file's SHA-256 hash matches the manifest entry.
 *
 * @param manifest     The manifest to validate against.
 * @param actualFiles  The actual file buffers keyed by filename.
 * @returns            true when all files match; false on mismatch or missing file.
 */
export function validateManifest(
  manifest: OutputManifest,
  actualFiles: Array<{ filename: string; content: Buffer }>,
): boolean {
  const fileMap = new Map<string, Buffer>();
  for (const f of actualFiles) {
    fileMap.set(f.filename, f.content);
  }

  for (const entry of manifest.files) {
    const actualContent = fileMap.get(entry.filename);

    // File not supplied
    if (actualContent === undefined) {
      return false;
    }

    // Size mismatch (fast-fail before hashing)
    if (actualContent.byteLength !== entry.sizeBytes) {
      return false;
    }

    // Hash mismatch
    const actualHash = sha256Digest(actualContent);
    if (actualHash !== entry.sha256) {
      return false;
    }
  }

  return true;
}
