import { describe, expect, it } from "vitest";
import {
  ADMIN_CASE_STUDY_EDITOR_MESSAGES,
  getAdminCaseStudyEditorMessages,
  listAdminCaseStudyEditorLocales,
} from "@/lib/i18n/admin-case-study-editor-messages";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";

describe("admin-case-study-editor-messages", () => {
  it("defines all six locales", () => {
    expect(listAdminCaseStudyEditorLocales()).toEqual(SUPPORTED_LOCALES);
    for (const locale of SUPPORTED_LOCALES) {
      const messages = ADMIN_CASE_STUDY_EDITOR_MESSAGES[locale];
      expect(messages.pageTitle.length).toBeGreaterThan(3);
      expect(messages.parseButton.length).toBeGreaterThan(3);
      expect(messages.apiError.PARSE_FAILED.length).toBeGreaterThan(5);
    }
  });

  it("falls back to English for unknown locale", () => {
    expect(getAdminCaseStudyEditorMessages("xx").pageTitle).toBe(
      ADMIN_CASE_STUDY_EDITOR_MESSAGES.en.pageTitle,
    );
  });
});
