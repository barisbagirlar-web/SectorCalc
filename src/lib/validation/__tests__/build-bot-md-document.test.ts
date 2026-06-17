import { describe, expect, test } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { getGeneratedToolSchema } from "@/lib/generated-tools/schema-loader";
import {
  buildBotMdDocument,
  buildBotMdNotFound,
} from "@/lib/validation/build-bot-md-document";
import { tApiPublic } from "@/lib/validation/api-public-messages";

describe("build-bot-md-document", () => {
  test("not found markdown is localized for every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const markdown = buildBotMdNotFound("missing-tool", locale);
      expect(markdown).toContain(tApiPublic(locale, "botNotFoundTitle"));
      expect(markdown).toContain("missing-tool");
    }
  });

  test("document includes localized section headings for z-score-calculator", () => {
    const schema = getGeneratedToolSchema("z-score-calculator");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    for (const locale of SUPPORTED_LOCALES) {
      const markdown = buildBotMdDocument({
        slug: "z-score-calculator",
        locale,
        schema,
      });

      expect(markdown).toContain(tApiPublic(locale, "botCanonicalPage"));
      expect(markdown).toContain(tApiPublic(locale, "botMachineApi"));
      expect(markdown).toContain(tApiPublic(locale, "botInputSchema"));
      expect(markdown).toContain(`locale=${locale}`);
      expect(markdown).toContain(`/tools/generated/z-score-calculator`);
    }
  });
});
