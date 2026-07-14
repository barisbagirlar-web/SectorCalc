/**
 * Unit Tests: Server Timestamp Enforcer
 *
 * Validates that serverNow(), isValidUtcIso(), computeRetentionDeadline(),
 * and isSuspiciousClientTimestamp() behave correctly.
 */

import { describe, it, expect } from "vitest";
import {
  serverNow,
  isValidUtcIso,
  computeRetentionDeadline,
  isSuspiciousClientTimestamp,
} from "@/lib/document-intelligence/security/timestamp-enforcer";

describe("serverNow", () => {
  it('returns valid ISO string ending in "Z"', () => {
    const ts = serverNow();
    expect(ts.utcIso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });

  it("returns positive epochMs", () => {
    const ts = serverNow();
    expect(ts.epochMs).toBeGreaterThan(0);
  });

  it("utcIso and epochMs represent the same moment", () => {
    const ts = serverNow();
    const parsedEpoch = new Date(ts.utcIso).getTime();
    // Allow small delta because both calls happen sequentially
    expect(Math.abs(parsedEpoch - ts.epochMs)).toBeLessThan(10);
  });
});

describe("isValidUtcIso", () => {
  it("accepts valid ISO string with Z", () => {
    expect(isValidUtcIso("2026-07-14T12:00:00.000Z")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidUtcIso("")).toBe(false);
  });

  it("rejects garbage string", () => {
    expect(isValidUtcIso("not-a-date")).toBe(false);
  });

  it("rejects non-UTC string (no Z suffix)", () => {
    expect(isValidUtcIso("2026-07-14T12:00:00.000")).toBe(false);
  });

  it("rejects string with timezone offset", () => {
    expect(isValidUtcIso("2026-07-14T12:00:00.000+03:00")).toBe(false);
  });

  it("rejects NaN date (malformed)", () => {
    expect(isValidUtcIso("2026-13-01T00:00:00.000Z")).toBe(false);
  });
});

describe("computeRetentionDeadline", () => {
  it("returns date exactly retentionDays later", () => {
    const completionTime = "2026-07-14T12:00:00.000Z";
    const deadline = computeRetentionDeadline(completionTime, 7);
    const expected = "2026-07-21T12:00:00.000Z";
    expect(deadline).toBe(expected);
  });

  it("handles 1-day retention", () => {
    const completionTime = "2026-07-14T00:00:00.000Z";
    const deadline = computeRetentionDeadline(completionTime, 1);
    const expected = "2026-07-15T00:00:00.000Z";
    expect(deadline).toBe(expected);
  });

  it("handles 0-day retention (immediate expiry)", () => {
    const completionTime = "2026-07-14T12:00:00.000Z";
    const deadline = computeRetentionDeadline(completionTime, 0);
    expect(deadline).toBe(completionTime);
  });

  it("handles large retention periods", () => {
    const completionTime = "2026-01-01T00:00:00.000Z";
    const deadline = computeRetentionDeadline(completionTime, 365);
    const expected = "2027-01-01T00:00:00.000Z";
    expect(deadline).toBe(expected);
  });

  it("preserves milliseconds in output", () => {
    const completionTime = "2026-07-14T12:00:00.123Z";
    const deadline = computeRetentionDeadline(completionTime, 7);
    expect(deadline).toBe("2026-07-21T12:00:00.123Z");
  });
});

describe("isSuspiciousClientTimestamp", () => {
  it("flags non-Z timestamps (missing UTC suffix)", () => {
    expect(isSuspiciousClientTimestamp("2026-07-14T12:00:00.000")).toBe(true);
  });

  it("does not flag valid server timestamps", () => {
    expect(isSuspiciousClientTimestamp("2026-07-14T12:00:00.000Z")).toBe(false);
  });

  it("accepts +00:00 offset as valid UTC", () => {
    expect(isSuspiciousClientTimestamp("2026-07-14T12:00:00.000+00:00")).toBe(false);
  });

  it("flags future timestamps more than 1 hour ahead", () => {
    const farFuture = new Date(Date.now() + 2 * 3600000).toISOString();
    expect(isSuspiciousClientTimestamp(farFuture)).toBe(true);
  });

  it("does not flag timestamps slightly in the future (within 1 hour)", () => {
    const nearFuture = new Date(Date.now() + 30 * 60000).toISOString();
    expect(isSuspiciousClientTimestamp(nearFuture)).toBe(false);
  });

  it("flags timestamps with non-UTC offsets", () => {
    expect(isSuspiciousClientTimestamp("2026-07-14T12:00:00.000+05:30")).toBe(true);
  });

  it("flags empty string as suspicious", () => {
    expect(isSuspiciousClientTimestamp("")).toBe(true);
  });
});
