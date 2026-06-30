/**
 * Tests for the calculation hash service
 */
import { describe, it, expect } from "vitest";
import {
  canonicalizeReportPayload,
  createCalculationHash,
  verifyCalculationHash,
} from "./hash";

describe("canonicalizeReportPayload", () => {
  it("same payload produces same canonical string", () => {
    const a = { z: 1, a: 2 };
    const b = { a: 2, z: 1 };
    expect(canonicalizeReportPayload(a)).toBe(canonicalizeReportPayload(b));
  });

  it("canonical order is stable (keys sorted)", () => {
    const obj = { z: "last", a: "first", m: "middle" };
    expect(canonicalizeReportPayload(obj)).toBe('{"a":"first","m":"middle","z":"last"}');
  });

  it("handles null", () => {
    expect(canonicalizeReportPayload(null)).toBe("null");
  });

  it("handles undefined as null", () => {
    expect(canonicalizeReportPayload(undefined)).toBe("null");
  });

  it("handles arrays", () => {
    expect(canonicalizeReportPayload([1, 2, 3])).toBe("[1,2,3]");
  });

  it("handles nested objects", () => {
    const obj = { b: { x: 1 }, a: 2 };
    expect(canonicalizeReportPayload(obj)).toBe('{"a":2,"b":{"x":1}}');
  });
});

describe("createCalculationHash", () => {
  it("same payload produces same hash", async () => {
    const payload = {
      toolSlug: "cnc-quote-risk-analyzer",
      formulaVersion: "1.0.0",
      input: { depth: 10, width: 5 },
      result: { cost: 120 },
    };
    const h1 = await createCalculationHash(payload);
    const h2 = await createCalculationHash(payload);
    expect(h1).toBe(h2);
  });

  it("different input produces different hash", async () => {
    const base = { toolSlug: "test", formulaVersion: "1.0.0", input: { x: 1 }, result: { y: 10 } };
    const modified = { ...base, input: { x: 2 } };
    const h1 = await createCalculationHash(base);
    const h2 = await createCalculationHash(modified);
    expect(h1).not.toBe(h2);
  });

  it("different result produces different hash", async () => {
    const base = { toolSlug: "test", formulaVersion: "1.0.0", input: { x: 1 }, result: { y: 10 } };
    const modified = { ...base, result: { y: 99 } };
    const h1 = await createCalculationHash(base);
    const h2 = await createCalculationHash(modified);
    expect(h1).not.toBe(h2);
  });

  it("different formulaVersion produces different hash", async () => {
    const base = { toolSlug: "test", formulaVersion: "1.0.0", input: { x: 1 }, result: { y: 10 } };
    const modified = { ...base, formulaVersion: "2.0.0" };
    const h1 = await createCalculationHash(base);
    const h2 = await createCalculationHash(modified);
    expect(h1).not.toBe(h2);
  });

  it("produces 64-character hex string (SHA-256)", async () => {
    const hash = await createCalculationHash({ test: true });
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("verifyCalculationHash", () => {
  it("returns true for valid hash", async () => {
    const payload = { toolSlug: "test", result: { value: 42 } };
    const hash = await createCalculationHash(payload);
    expect(await verifyCalculationHash(payload, hash)).toBe(true);
  });

  it("returns false for invalid hash", async () => {
    const payload = { toolSlug: "test", result: { value: 42 } };
    expect(await verifyCalculationHash(payload, "deadbeef")).toBe(false);
  });

  it("returns false when payload is different from hashed payload", async () => {
    const original = { toolSlug: "test", result: { value: 42 } };
    const hash = await createCalculationHash(original);
    const modified = { toolSlug: "test", result: { value: 99 } };
    expect(await verifyCalculationHash(modified, hash)).toBe(false);
  });
});