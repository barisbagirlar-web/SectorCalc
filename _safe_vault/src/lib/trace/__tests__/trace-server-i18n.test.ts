import { describe, expect, test } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { buildTraceLocaleHint } from "@/lib/trace/locale-hints";
import { resolveTraceErrorMessage } from "@/lib/trace/trace-server-i18n";

describe("trace locale coverage", () => {
  test("buildTraceLocaleHint covers every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const hint = buildTraceLocaleHint(locale);
      expect(hint.length).toBeGreaterThan(10);
      expect(hint).toMatch(/Respond in /);
    }
  });

  test("resolveTraceErrorMessage returns localized copy for all locales", () => {
    const keys = ["authRequired", "connection", "noCredits", "premiumOnly"] as const;

    for (const locale of SUPPORTED_LOCALES) {
      for (const key of keys) {
        const message = resolveTraceErrorMessage(locale, key);
        expect(message.trim().length).toBeGreaterThan(5);
        expect(message).not.toMatch(/TODO|undefined|null/i);
      }
    }
  });

  test("unknown locale falls back to English errors", () => {
    expect(resolveTraceErrorMessage("xx", "noCredits")).toBe(
      resolveTraceErrorMessage("en", "noCredits"),
    );
  });
});
