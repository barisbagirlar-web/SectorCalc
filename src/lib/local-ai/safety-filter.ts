import type { SectorcalcAiKnowledgeItem } from "./types";

const FORBIDDEN_TERMS = [
  "analyzer",
  "analysis",
  "analyze",
  "analiz",
  "analizi",
  "sihirbaz",
  "premium analiz",
  "total premium tools 23",
  "all premium calculators 23",
  "financial advice",
  "legal advice",
  "engineering advice",
  "replace your accountant",
  "replace your engineer",
];

export function containsForbiddenClaim(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_TERMS.some((term) => lower.includes(term));
}

export function sanitizeKnowledgeItem(item: SectorcalcAiKnowledgeItem): SectorcalcAiKnowledgeItem {
  let safeAnswer = item.safeAnswer;
  let modified = item.forbiddenClaimRemoved;

  for (const term of FORBIDDEN_TERMS) {
    const regex = new RegExp(term, "gi");
    if (regex.test(safeAnswer)) {
      safeAnswer = safeAnswer.replace(regex, "");
      modified = true;
    }
  }

  return {
    ...item,
    safeAnswer: safeAnswer.trim(),
    forbiddenClaimRemoved: modified,
  };
}

export function buildDisclaimer(locale: string): string {
  const disclaimers: Record<string, string> = {
    en: "This is a technical simulation. Verify all results before making business decisions.",
    tr: "Bu bir teknik simülasyondur. İş kararları almadan önce tüm sonuçları doğrulayın.",
    de: "Dies ist eine technische Simulation. Prüfen Sie alle Ergebnisse vor Geschäftsentscheidungen.",
    fr: "Ceci est une simulation technique. Vérifiez tous les résultats avant de prendre des décisions.",
    es: "Esta es una simulación técnica. Verifique todos los resultados antes de tomar decisiones.",
    ar: "هذا محاكاة فنية. تحقق من جميع النتائج قبل اتخاذ قرارات العمل.",
  };

  return disclaimers[locale] ?? disclaimers.en;
}
