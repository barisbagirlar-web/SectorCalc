import { describe, expect, test } from "vitest";
import { absoluteLocalizedUrl } from "@/lib/semantic/site-url";

describe("absoluteLocalizedUrl", () => {
  test("English homepage uses root path without /en prefix", () => {
    expect(absoluteLocalizedUrl("en", "/")).toBe("https://www.sectorcalc.com/");
  });

  test("prefixed locales keep locale segment", () => {
    expect(absoluteLocalizedUrl("tr", "/")).toBe("https://www.sectorcalc.com/tr");
    expect(absoluteLocalizedUrl("de", "/free-tools")).toBe(
      "https://www.sectorcalc.com/de/free-tools",
    );
    expect(absoluteLocalizedUrl("ar", "/pro-tools")).toBe(
      "https://www.sectorcalc.com/ar/pro-tools",
    );
  });

  test("English nested paths omit locale prefix", () => {
    expect(absoluteLocalizedUrl("en", "/free-tools")).toBe("https://www.sectorcalc.com/free-tools");
  });
});
