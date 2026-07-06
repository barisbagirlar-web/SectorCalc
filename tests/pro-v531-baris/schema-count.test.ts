import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SCHEMAS_DIR = path.resolve(__dirname, "../../src/sectorcalc/schemas/pro-v531");
const MANIFEST_PATH = path.resolve(__dirname, "../../pro_tools_baris_/manifest.json");

describe("pro-v531-baris: schema count", () => {
  it("should have exactly 45 schema files on disk", () => {
    const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".schema.json"));
    expect(files).toHaveLength(45);
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
});
