import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SCHEMAS_DIR = path.resolve(__dirname, "../../src/sectorcalc/schemas/pro-v531");
const SOURCE_SCHEMAS_DIR = path.resolve(__dirname, "../../pro_tools_baris_/schemas");
const MANIFEST_PATH = path.resolve(__dirname, "../../pro_tools_baris_/manifest.json");
const SHA256_PATH = path.resolve(__dirname, "../../pro_tools_baris_/SHA256SUMS.txt");

describe("pro-v531-baris: schema count and integrity", () => {
  it("should have exactly 45 schema files on disk (target)", () => {
    const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".schema.json"));
    expect(files).toHaveLength(45);
  });

  it("should have exactly 45 schema files on disk (source)", () => {
    if (fs.existsSync(SOURCE_SCHEMAS_DIR)) {
      const files = fs.readdirSync(SOURCE_SCHEMAS_DIR).filter(f => f.endsWith(".schema.json"));
      expect(files).toHaveLength(45);
    } else {
      // Source directory may be absent; this is a quarantine state issue
      expect(fs.existsSync(SOURCE_SCHEMAS_DIR)).toBe(true);
    }
  });

  it("should have 45 entries in manifest", () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    expect(manifest.schemas).toHaveLength(45);
  });

  it("schema file names should match manifest tool_keys", () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".schema.json"));
    for (const entry of manifest.schemas) {
      const expectedFile = `${entry.tool_key}.schema.json`;
      expect(files).toContain(expectedFile);
    }
  });

  it("SHA256SUMS.txt should have 45 entries", () => {
    if (fs.existsSync(SHA256_PATH)) {
      const lines = fs.readFileSync(SHA256_PATH, "utf-8").trim().split("\n").filter(Boolean);
      expect(lines).toHaveLength(45);
    }
  });
});
