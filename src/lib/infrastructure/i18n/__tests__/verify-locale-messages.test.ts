import { describe, expect, test } from "vitest";
import {
  collectBlockingLocaleMessageIssues,
  collectEmptyTranslationIssues,
  flattenMessageStrings,
} from "@/lib/infrastructure/i18n/verify-locale-messages";

describe("verify-locale-messages", () => {
  test("flattenMessageStrings collects nested paths", () => {
    expect(flattenMessageStrings({ nav: { home: "Home" }, title: "Root" })).toEqual({
      "nav.home": "Home",
      title: "Root",
    });
  });

  test("collectEmptyTranslationIssues flags empty values when EN is non-empty", () => {
    const issues = collectEmptyTranslationIssues(
      { cta: { title: "Start" } },
      { cta: { title: "" } },
      "tr",
    );
    expect(issues).toEqual([{ path: "cta.title", locale: "tr", reason: "empty" }]);
  });

  test("production messages directory has no blocking gaps", { timeout: 30_000 }, () => {
    const issues = collectBlockingLocaleMessageIssues(`${process.cwd()}/messages`);
    expect(issues).toEqual([]);
  });
});
