import { describe, expect, test } from "vitest";
import { checkPublicCalculateRateLimit } from "@/lib/core/validation/public-calculate-rate-limit";

describe("public-calculate-rate-limit", () => {
  test("falls back to in-memory limiter when Upstash is not configured", async () => {
    const key = `test-${Date.now()}`;

    for (let index = 0; index < 5; index += 1) {
      const result = await checkPublicCalculateRateLimit(key);
      expect(result.ok).toBe(true);
    }
  });
});
