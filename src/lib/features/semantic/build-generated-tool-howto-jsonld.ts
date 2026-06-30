import type { ResolvedToolAboutContent } from "@/lib/features/generated-tools/resolve-tool-about";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

function buildHowToName(toolName: string, locale: string): string {
  const normalized = toolName.toLowerCase();
  switch (locale) {
    case "tr":
      return `${normalized} nasıl hesaplanır?`;
    case "de":
      return `Wie berechnet man ${normalized}?`;
    case "fr":
      return `Comment calculer ${normalized} ?`;
    case "es":
      return `Cómo calcular ${normalized}`;
    case "ar":
      return `كيفية حساب ${normalized}؟`;
    default:
      return `How to calculate ${normalized}`;
  }
}

export function buildGeneratedToolHowToJsonLd(input: {
  readonly toolName: string;
  readonly aboutContent: ResolvedToolAboutContent;
  readonly locale: string;
}): JsonLdRecord | null {
  const { toolName, aboutContent, locale } = input;
  const example = aboutContent.example;

  if (!example || example.steps.length === 0) {
    return null;
  }

  const description = example.scenario || aboutContent.description.long;

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: buildHowToName(toolName, locale),
    description,
    inLanguage: locale,
    step: example.steps.map((stepText, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: stepText,
      text: stepText,
    })),
    tool: {
      "@type": "HowToTool",
      name: toolName,
    },
  }) as JsonLdRecord;
}
