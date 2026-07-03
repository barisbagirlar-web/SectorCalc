// SectorCalc SuperV4 V5.3.1 — Golden Hash Storage
// Persistent deterministic hash storage for regression detection.
// Golden files stored at tests/golden/<tool_key>.golden.json

import fs from "node:fs";
import path from "node:path";

export interface GoldenHashes {
  schema_hash: string;
  formula_registry_hash: string;
  normalized_input_hash: string;
  output_hash: string;
  proof_pack_hash: string;
  audit_seal_stable_hash: string;
  // Volatile fields excluded: executed_at, signature, request_id, duration_ms, runtime_timestamp, environment metadata
}

export interface GoldenRecord {
  tool_key: string;
  tool_version: string;
  stable: GoldenHashes;
  volatile_excluded: {
    executed_at: string;
    generated_at: string;
  };
}

const GOLDEN_DIR = path.join(process.cwd(), "tests", "golden");

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getGoldenPath(toolKey: string): string {
  return path.join(GOLDEN_DIR, `${toolKey}.golden.json`);
}

export function getHashesPath(toolKey: string): string {
  return path.join(GOLDEN_DIR, "hashes", `${toolKey}.hashes.json`);
}

export function loadGoldenHashes(toolKey: string): GoldenRecord | null {
  const filePath = getGoldenPath(toolKey);
  if (!fs.existsSync(filePath)) return null;
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as GoldenRecord;
  } catch {
    return null;
  }
}

export function saveGoldenHashes(
  toolKey: string,
  toolVersion: string,
  hashes: GoldenHashes,
): string {
  ensureDir(GOLDEN_DIR);

  const record: GoldenRecord = {
    tool_key: toolKey,
    tool_version: toolVersion,
    stable: hashes,
    volatile_excluded: {
      executed_at: new Date().toISOString(),
      generated_at: new Date().toISOString(),
    },
  };

  const filePath = getGoldenPath(toolKey);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf-8");

  // Also save to hashes subdirectory
  const hashesDir = path.join(GOLDEN_DIR, "hashes");
  ensureDir(hashesDir);
  const hashesPath = getHashesPath(toolKey);
  fs.writeFileSync(hashesPath, JSON.stringify(hashes, null, 2), "utf-8");

  return filePath;
}

export function compareGoldenHashes(
  toolKey: string,
  actualHashes: GoldenHashes,
): { match: boolean; diff: Array<{ key: string; expected: string; actual: string }> } {
  const expected = loadGoldenHashes(toolKey);
  if (!expected) {
    return { match: false, diff: [{ key: "GOLDEN_FILE", expected: "EXISTS", actual: "MISSING" }] };
  }

  const diff: Array<{ key: string; expected: string; actual: string }> = [];
  const stableKeys: (keyof GoldenHashes)[] = [
    "schema_hash",
    "formula_registry_hash",
    "normalized_input_hash",
    "output_hash",
    "proof_pack_hash",
    "audit_seal_stable_hash",
  ];

  for (const key of stableKeys) {
    if (expected.stable[key] !== actualHashes[key]) {
      diff.push({
        key,
        expected: expected.stable[key],
        actual: actualHashes[key],
      });
    }
  }

  return { match: diff.length === 0, diff };
}

export function goldenFileExists(toolKey: string): boolean {
  return fs.existsSync(getGoldenPath(toolKey));
}
