import { describe, expect, test, vi } from "vitest";
import { pingIndexNow } from "@/lib/infrastructure/seo/indexNow";
import { buildIndustrialRegistryIndexUrls } from "@/lib/infrastructure/seo/registry-indexing";

describe("IndexNow SEO", () => {
  test("buildIndustrialRegistryIndexUrls includes hubs and sectors", () => {
    const urls = buildIndustrialRegistryIndexUrls();
    expect(urls.some((u) => u.includes("/audit") && !u.includes("/en/"))).toBe(true);
    expect(urls.some((u) => u.includes("/benchmarks"))).toBe(true);
    expect(urls.some((u) => u.includes("/sustainability"))).toBe(true);
    expect(urls.some((u) => u.includes("/audit/cnc"))).toBe(true);
    expect(urls.some((u) => u.includes("/tr/audit"))).toBe(true);
    expect(urls.length).toBeGreaterThan(50);
  });

  test("pingIndexNow skips without INDEXNOW_KEY", async () => {
    vi.stubEnv("INDEXNOW_KEY", "");
    const result = await pingIndexNow(["https://sectorcalc.com/audit"]);
    expect(result.ok).toBe(false);
    vi.unstubAllEnvs();
  });
});
