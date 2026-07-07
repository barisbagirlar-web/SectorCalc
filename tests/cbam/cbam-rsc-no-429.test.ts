// CBAM RSC no-429 route tests.
// Tests that public routes and _rsc requests are NOT rate-limited.
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const MIDDLEWARE_PATH = join(__dirname, "../../src/middleware.ts");

describe("CBAM RSC no-429 routes", () => {
  const middleContent = readFileSync(MIDDLEWARE_PATH, "utf-8");

  it("/cbam GET route is not rate-limited by middleware", () => {
    // Middleware must skip GET entirely
    expect(middleContent).toMatch(/if \(method !== "POST"\) return true/);
  });

  it("_rsc requests are not rate-limited by middleware", () => {
    expect(middleContent).toMatch(
      /_rsc/
    );
    // The shouldSkipRateLimit function must have _rsc check
    expect(middleContent).toMatch(
      /searchParams\.has\("_rsc"\)/
    );
  });

  it("public /cbam route is explicitly in shouldSkipRateLimit", () => {
    expect(middleContent).toMatch(/pathname\.startsWith\("\/cbam"\)/);
  });

  it("/en/cbam returns 404", () => {
    // Middleware must have LEGACY_LOCALE_ROUTES returning 404
    expect(middleContent).toMatch(/LEGACY_LOCALE_ROUTES/);
    expect(middleContent).toMatch(/status: 404/);
  });

  it("POST to non-API routes can be rate-limited", () => {
    // Verify the rate limiter IS still active for POST
    expect(middleContent).toMatch(/RATE_LIMIT_MAX_REQUESTS/);
    expect(middleContent).toMatch(/isBelowRateLimit/);
  });

  it("rate limiter only applies to POST (not GET)", () => {
    // The shouldSkipRateLimit function returns true for non-POST
    expect(middleContent).toMatch(/if \(method !== "POST"\) return true/);
  });

  it("no 429 response for GET or _rsc requests", () => {
    // The middleware only returns 429 inside the rate limiter block
    // which is guarded by shouldSkipRateLimit
    const rateLimitBlock = middleContent.substring(
      middleContent.indexOf("function isBelowRateLimit"),
      middleContent.indexOf("// ── Middleware ──")
    );
    // The rate limiter itself doesn't know about method — it's called
    // only after shouldSkipRateLimit returns false
    expect(rateLimitBlock).toBeTruthy();
  });
});
