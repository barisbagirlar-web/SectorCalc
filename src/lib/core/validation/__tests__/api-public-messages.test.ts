import { describe, expect, test } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";
import {
  API_PUBLIC_MESSAGES,
  formatApiPublicMessage,
  resolveApiPublicLocale,
  type ApiPublicMessageKey,
} from "@/lib/core/validation/api-public-messages";

describe("api-public-messages", () => {
  test("every message key includes all supported locales", () => {
    const keys = Object.keys(API_PUBLIC_MESSAGES) as ApiPublicMessageKey[];

    for (const key of keys) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(API_PUBLIC_MESSAGES[key][locale].trim().length).toBeGreaterThan(0);
      }
    }
  });

  test("resolveApiPublicLocale honors query, body, and Accept-Language", () => {
    expect(
      resolveApiPublicLocale({
        queryLocale: "de",
        acceptLanguage: "fr-FR,fr;q=0.9",
      }),
    ).toBe("de");

    expect(
      resolveApiPublicLocale({
        bodyLocale: "ar",
        queryLocale: "en",
      }),
    ).toBe("ar");

    expect(
      resolveApiPublicLocale({
        acceptLanguage: "es-ES,es;q=0.9,en;q=0.8",
      }),
    ).toBe("es");

    expect(
      resolveApiPublicLocale({
        acceptLanguage: "zh-CN,zh;q=0.9",
      }),
    ).toBe("en");
  });

  test("formatApiPublicMessage replaces slug placeholders in all locales", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const message = formatApiPublicMessage(locale, "toolNotFoundMessage", {
        slug: "z-score-calculator",
      });
      expect(message).toContain("z-score-calculator");
    }
  });

  test("unknownInputFieldMessage is localized for every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const message = formatApiPublicMessage(locale, "unknownInputFieldMessage", {
        field: "total_work_content",
        slug: "oee-downtime-calculator",
      });
      expect(message).toContain("total_work_content");
      expect(message).toContain("oee-downtime-calculator");
    }
  });
});
