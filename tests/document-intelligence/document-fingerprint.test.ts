import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { computeFingerprint, fingerprintsMatch } from "@/lib/document-intelligence/contracts/document-fingerprint";
import type { DocumentFingerprint } from "@/lib/document-intelligence/contracts/document-fingerprint";

const HELLO = Buffer.from("hello", "utf-8");
const HELLO_SHA = createHash("sha256").update(HELLO).digest("hex");

describe("computeFingerprint", () => {
  it("returns correct SHA-256 for known input", () => {
    const fp = computeFingerprint(HELLO, 1, "application/pdf");
    expect(fp.sourceDocumentSha256).toBe(HELLO_SHA);
  });

  it("records page count", () => {
    const fp = computeFingerprint(Buffer.from("test", "utf-8"), 5, "application/pdf");
    expect(fp.sourcePageCount).toBe(5);
  });

  it("records file size", () => {
    const buf = Buffer.from("test", "utf-8");
    const fp = computeFingerprint(buf, 1, "application/pdf");
    expect(fp.sourceDocumentSize).toBe(4);
  });

  it("validates MIME type", () => {
    const fp = computeFingerprint(HELLO, 1, "application/pdf");
    expect(fp.sourceMimeValidated).toBe(true);
  });

  it("rejects invalid MIME", () => {
    const fp = computeFingerprint(HELLO, 1, "text/plain");
    expect(fp.sourceMimeValidated).toBe(false);
  });

  it("throws on empty buffer", () => {
    expect(() => computeFingerprint(Buffer.alloc(0), 1, "application/pdf")).toThrow();
  });

  it("throws on invalid page count", () => {
    expect(() => computeFingerprint(HELLO, 0, "application/pdf")).toThrow();
  });
});

describe("fingerprintsMatch", () => {
  const fp1: DocumentFingerprint = {
    sourceDocumentSha256: "a".repeat(64),
    sourceDocumentSize: 100,
    sourcePageCount: 5,
    sourceMimeValidated: true,
    sourceFingerprintVersion: "1.0.0",
  };

  const fp2: DocumentFingerprint = { ...fp1 };
  const fpDiff: DocumentFingerprint = { ...fp1, sourceDocumentSha256: "b".repeat(64) };

  it("returns true for identical", () => {
    expect(fingerprintsMatch(fp1, fp2)).toBe(true);
  });

  it("returns false when SHA differs", () => {
    expect(fingerprintsMatch(fp1, fpDiff)).toBe(false);
  });

  it("returns false for null first argument", () => {
    expect(fingerprintsMatch(null as unknown as DocumentFingerprint, fp1)).toBe(false);
  });

  it("returns false for null second argument", () => {
    expect(fingerprintsMatch(fp1, null as unknown as DocumentFingerprint)).toBe(false);
  });
});
