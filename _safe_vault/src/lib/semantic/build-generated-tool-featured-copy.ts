export function buildGeneratedToolFeaturedCopy(
  toolName: string,
  description: string,
  locale: string,
): { readonly question: string; readonly answer: string } {
  const question =
    locale === "tr"
      ? `${toolName} nedir?`
      : locale === "de"
        ? `Was ist ${toolName}?`
        : locale === "fr"
          ? `Qu'est-ce que ${toolName} ?`
          : locale === "es"
            ? `¿Qué es ${toolName}?`
            : locale === "ar"
              ? `ما هو ${toolName}؟`
              : `What is ${toolName}?`;

  return {
    question,
    answer: description.trim() || toolName,
  };
}
