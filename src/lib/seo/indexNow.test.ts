import { describe, expect, test, vi } from "vitest";
import { pingIndexNow } from "@/lib/seo/indexNow";
import { buildIndustrialRegistryIndexUrls } from "@/lib/seo/registry-indexing";

describe("IndexNow SEO", () => {
  test("buildIndustrialRegistryIndexUrls includes hubs and sectors", () => {
    const urls = buildIndustrialRegistryIndexUrls();
    expect(urls.some((u) => u.includes("/en/audit"))).toBe(true);
    expect(urls.some((u) => u.includes("/en/benchmarks"))).toBe(true);
    expect(urls.some((u) => u.includes("/en/sustainability"))).toBe(true);
    expect(urls.some((u) => u.includes("/en/audit/cnc"))).toBe(true);
    expect(urls.length).toBeGreaterThan(100);
  });

  test("pingIndexNow skips without INDEXNOW_KEY", async () => {
    vi.stubEnv("INDEXNOW_KEY", "");
    const result = await pingIndexNow(["https://sectorcalc.com/en/audit"]);
    expect(result.ok).toBe(false);
    vi.unstubAllEnvs();
  });
});
