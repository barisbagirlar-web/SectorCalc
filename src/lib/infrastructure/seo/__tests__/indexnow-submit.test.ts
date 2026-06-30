import { describe, expect, test } from "vitest";
import {
  INDEXNOW_MAX_URLS_PER_BATCH,
  getIndexNowSubmissionUrls,
  resolveIndexNowKeyLocation,
  resolveIndexNowSubmitMode,
} from "@/lib/infrastructure/seo/indexnow-submit";

describe("indexnow-submit", () => {
  test("default mode is all six locales", () => {
    expect(resolveIndexNowSubmitMode(undefined)).toBe("all");
    expect(resolveIndexNowSubmitMode("")).toBe("all");
  });

  test("all mode includes every supported locale", () => {
    const urls = getIndexNowSubmissionUrls("sectorcalc.com", "all");
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.every((url) => !url.match(/\/(tr|de|fr|es|ar)\//))).toBe(true);
  });

  test("en-tr mode stays under IndexNow single-request limit", () => {
    const urls = getIndexNowSubmissionUrls("sectorcalc.com", "en-tr");
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.length).toBeLessThan(INDEXNOW_MAX_URLS_PER_BATCH);
    expect(urls.every((url) => !url.match(/\/(tr|de|fr|es|ar)\//))).toBe(true);
  });

  test("priority mode returns a compact Tier-1 set across locales", () => {
    const urls = getIndexNowSubmissionUrls("sectorcalc.com", "priority");
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.length).toBeLessThan(1000);
    expect(urls.every((url) => !url.match(/\/(tr|de|fr|es|ar)\//))).toBe(true);
  });

  test("all mode exceeds single batch and requires chunking", () => {
    const urls = getIndexNowSubmissionUrls("sectorcalc.com", "all");
    expect(urls.length).toBeLessThanOrEqual(INDEXNOW_MAX_URLS_PER_BATCH);
  });

  test("resolveIndexNowKeyLocation uses host key txt path", () => {
    expect(resolveIndexNowKeyLocation("www.sectorcalc.com", "abc-123")).toBe(
      "https://www.sectorcalc.com/abc-123.txt",
    );
  });
});
