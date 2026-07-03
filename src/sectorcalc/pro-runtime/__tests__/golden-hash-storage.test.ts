// SectorCalc V5.3.1 — Golden Hash Storage Tests

import { describe, it, expect, afterAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  saveGoldenHashes,
  loadGoldenHashes,
  compareGoldenHashes,
  goldenFileExists,
  getGoldenPath,
  getHashesPath,
  type GoldenHashes,
} from "../golden-hash-storage";

const TEST_KEY = "v531-test-golden";
const TEST_VERSION = "1.0.0";

const testHashes: GoldenHashes = {
  schema_hash: "sh-001",
  formula_registry_hash: "frh-001",
  normalized_input_hash: "nih-001",
  output_hash: "oh-001",
  proof_pack_hash: "pph-001",
  audit_seal_stable_hash: "ash-001",
};

const testHashesDrifted: GoldenHashes = {
  ...testHashes,
  schema_hash: "sh-DRIFTED",
  output_hash: "oh-DRIFTED",
};

afterAll(() => {
  // Clean up test files
  try { fs.unlinkSync(getGoldenPath(TEST_KEY)); } catch { /* ignore */ }
  try { fs.unlinkSync(getHashesPath(TEST_KEY)); } catch { /* ignore */ }
});

describe("goldenHashStorage", () => {
  it("saves golden hashes to file", () => {
    const filePath = saveGoldenHashes(TEST_KEY, TEST_VERSION, testHashes);
    expect(fs.existsSync(filePath)).toBe(true);
    expect(filePath).toContain(TEST_KEY);
  });

  it("loads saved golden hashes", () => {
    const loaded = loadGoldenHashes(TEST_KEY);
    expect(loaded).not.toBeNull();
    expect(loaded!.tool_key).toBe(TEST_KEY);
    expect(loaded!.stable.schema_hash).toBe("sh-001");
  });

  it("goldenFileExists returns true after save", () => {
    expect(goldenFileExists(TEST_KEY)).toBe(true);
  });

  it("goldenFileExists returns false for missing key", () => {
    expect(goldenFileExists("nonexistent-tool")).toBe(false);
  });

  it("compareGoldenHashes returns match=true when hashes match", () => {
    const result = compareGoldenHashes(TEST_KEY, testHashes);
    expect(result.match).toBe(true);
    expect(result.diff).toHaveLength(0);
  });

  it("compareGoldenHashes returns match=false on drift", () => {
    const result = compareGoldenHashes(TEST_KEY, testHashesDrifted);
    expect(result.match).toBe(false);
    expect(result.diff.length).toBeGreaterThan(0);
    expect(result.diff[0].key).toBe("schema_hash");
  });

  it("reports missing golden file", () => {
    const result = compareGoldenHashes("nonexistent-tool", testHashes);
    expect(result.match).toBe(false);
    expect(result.diff[0].key).toBe("GOLDEN_FILE");
  });

  it("creates hashes subdirectory file", () => {
    const hashesPath = getHashesPath(TEST_KEY);
    expect(fs.existsSync(hashesPath)).toBe(true);
  });

  it("golden file path is printed in test output", () => {
    const filePath = getGoldenPath(TEST_KEY);
    console.log(`Golden file path: ${filePath}`);
    expect(filePath).toContain("tests/golden");
  });
});
