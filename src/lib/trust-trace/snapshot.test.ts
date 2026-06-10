/**
 * Tests for the snapshot sanitizer
 */
import { describe, it, expect } from "vitest";
import { sanitizeSnapshot, isSafeSnapshotValue, isSecretLikeKey } from "./snapshot";

describe("isSecretLikeKey", () => {
  it("detects secret-like keys", () => {
    expect(isSecretLikeKey("apiKey")).toBe(true);
    expect(isSecretLikeKey("password")).toBe(true);
    expect(isSecretLikeKey("stripeSecret")).toBe(true);
    expect(isSecretLikeKey("authToken")).toBe(true);
    expect(isSecretLikeKey("bearer")).toBe(true);
    expect(isSecretLikeKey("brevoApiKey")).toBe(true);
  });

  it("allows safe keys", () => {
    expect(isSecretLikeKey("depth")).toBe(false);
    expect(isSecretLikeKey("cost")).toBe(false);
    expect(isSecretLikeKey("result")).toBe(false);
    expect(isSecretLikeKey("toolSlug")).toBe(false);
  });
});

describe("isSafeSnapshotValue", () => {
  it("accepts null", () => expect(isSafeSnapshotValue(null)).toBe(true));
  it("accepts boolean", () => expect(isSafeSnapshotValue(true)).toBe(true));
  it("accepts string", () => expect(isSafeSnapshotValue("hello")).toBe(true));
  it("accepts finite number", () => expect(isSafeSnapshotValue(42)).toBe(true));
  it("rejects NaN", () => expect(isSafeSnapshotValue(NaN)).toBe(false));
  it("rejects Infinity", () => expect(isSafeSnapshotValue(Infinity)).toBe(false));
  it("rejects function", () => expect(isSafeSnapshotValue(() => {})).toBe(false));
  it("rejects undefined", () => expect(isSafeSnapshotValue(undefined)).toBe(false));
  it("rejects object (needs explicit handling)", () => expect(isSafeSnapshotValue({})).toBe(false));
});

describe("sanitizeSnapshot", () => {
  it("keeps safe values", () => {
    const input = { cost: 100, label: "CNC", active: true, nothing: null };
    const result = sanitizeSnapshot(input);
    expect(result.cost).toBe(100);
    expect(result.label).toBe("CNC");
    expect(result.active).toBe(true);
    expect(result.nothing).toBeNull();
  });

  it("drops secret-like keys", () => {
    const input = { cost: 100, apiKey: "secret123", stripeToken: "tok_xxx" };
    const result = sanitizeSnapshot(input);
    expect(result.cost).toBe(100);
    expect("apiKey" in result).toBe(false);
    expect("stripeToken" in result).toBe(false);
  });

  it("drops NaN and Infinity", () => {
    const input = { nanVal: NaN, infVal: Infinity, good: 42 };
    const result = sanitizeSnapshot(input);
    expect("nanVal" in result).toBe(false);
    expect("infVal" in result).toBe(false);
    expect(result.good).toBe(42);
  });

  it("drops undefined values", () => {
    const input = { a: undefined, b: "ok" };
    const result = sanitizeSnapshot(input);
    expect("a" in result).toBe(false);
    expect(result.b).toBe("ok");
  });

  it("truncates long strings", () => {
    const longStr = "x".repeat(1000);
    const result = sanitizeSnapshot({ longKey: longStr });
    expect((result.longKey as string).length).toBeLessThan(1000);
    expect((result.longKey as string).endsWith("…")).toBe(true);
  });

  it("respects maxKeys limit", () => {
    const input: Record<string, number> = {};
    for (let i = 0; i < 60; i++) {
      input[`key${i}`] = i;
    }
    const result = sanitizeSnapshot(input, 10);
    expect(Object.keys(result).length).toBeLessThanOrEqual(10);
  });

  it("returns empty object for non-object input", () => {
    expect(sanitizeSnapshot(null as unknown as Record<string, unknown>)).toEqual({});
    expect(sanitizeSnapshot([] as unknown as Record<string, unknown>)).toEqual({});
  });
});