import type { AppLocale } from "@/i18n/locales";
import type {
  SectorcalcAiIntent,
  SectorcalcAiKnowledgeItem,
  SectorcalcIntentRouterResult,
} from "./types";

const INTENT_PATTERNS: Array<{ intent: SectorcalcAiIntent; patterns: RegExp[] }> = [
  { intent: 'free_tool_lookup', patterns: [ /\b(free|ücretsiz|kostenlos|gratuit|gratis|مجاني)\b/i, /\b(calculate|hesapla|berechnen|calcular|calculer|احسب)\b/i ] },
  { intent: 'premium_tool_lookup', patterns: [ /\b(premium|pro|paid|ücretli|bezahlt|pago|payant|مدفوع)\b/i, /\b(verdict|karar|entscheidung|veredicto|verdict|حكم)\b/i ] },
  { intent: 'pricing_question', patterns: [ /\b(price|fiyat|preis|precio|prix|سعر)\b/i, /\b(cost|maliyet|kosten|costo|coût|تكلفة)\b/i, /\b(quote|teklif|angebot|cotización|devis|عرض سعر)\b/i ] },
  { intent: 'legal_or_compliance_question', patterns: [ /\b(legal|yasal|rechtlich|legal|jurídico|قانوني)\b/i, /\b(compliance|uyum|conformité|cumplimiento|امتثال)\b/i, /\b(cbam|skdm|karbon|carbon|emission|emisyon)\b/i ] },
  { intent: 'energy_carbon_question', patterns: [ /\b(energy|enerji|energie|energía|énergie|طاقة)\b/i, /\b(carbon|karbon|co2|emission|emisyon)\b/i, /\b(efficiency|verimlilik|effizienz|eficiencia|efficacité|كفاءة)\b/i ] },
  { intent: 'technical_engineering_question', patterns: [ /\b(tolerance|tolerans|tolerancia|tolérance|تفاوت)\b/i, /\b(weld|kaynak|schweißen|soldadura|soudure|لحام)\b/i, /\b(oee|overall equipment effectiveness|genel ekipman etkinliği)\b/i ] },
  { intent: 'sector_specific_question', patterns: [ /\b(industry|sektör|branche|industria|secteur|قطاع)\b/i, /\b(manufacturing|üretim|fertigung|fabricación|fabrication|تصنيع)\b/i ] },
  { intent: 'account_question', patterns: [ /\b(account|hesap|konto|cuenta|compte|حساب)\b/i, /\b(login|giriş|anmelden|iniciar sesión|connexion|تسجيل دخول)\b/i, /\b(subscription|abonelik|abonnement|suscripción|اشتراك)\b/i ] },
  { intent: 'general_platform_question', patterns: [ /\b(sectorcalc|sector calc)\b/i, /\b(what is|nedir|was ist|qué es|qu'est-ce que|ما هو)\b/i, /\b(platform|site|website)\b/i ] },
];

export function routeIntent(
  input: string,
  knowledgeItems: SectorcalcAiKnowledgeItem[],
  locale: AppLocale,
): SectorcalcIntentRouterResult {
  const lower = input.toLowerCase();
  const scores: Record<string, number> = {};
  for (const { intent, patterns } of INTENT_PATTERNS) {
    let score = 0;
    for (const pattern of patterns) { if (pattern.test(lower)) score += 1; }
    scores[intent] = score || 0;
  }
  let bestIntent: SectorcalcAiIntent = 'unknown';
  let bestScore = 0;
  for (const [intent, score] of Object.entries(scores)) { if (score > bestScore) { bestScore = score; bestIntent = intent as SectorcalcAiIntent; } }
  const matchedItems = knowledgeItems.filter(item => {
    if (item.locale !== locale) return false;
    const q = item.normalizedQuestion.toLowerCase();
    const words = lower.split(/\s+/).filter(w => w.length > 2);
    const matchCount = words.filter(w => q.includes(w)).length;
    return matchCount >= Math.min(2, words.length);
  });
  const matchedToolSlugs = [...new Set(matchedItems.flatMap(i => i.relatedToolSlugs))];
  const matchedKnowledgeIds = matchedItems.map(i => i.id);
  const accessTypes = matchedItems.map(i => i.accessType);
  const accessType = accessTypes.includes('free') ? 'free' : accessTypes.includes('premium') ? 'premium' : accessTypes.includes('roadmap') ? 'roadmap' : 'unknown';
  const confidence = bestScore > 0 ? Math.min(0.5 + bestScore * 0.15, 0.95) : 0.1;
  let recommendedAction: 'answer_directly' | 'route_to_tool' | 'ask_clarification' | 'decline';
  if (confidence < 0.3) recommendedAction = 'ask_clarification';
  else if (accessType === 'free' && matchedToolSlugs.length > 0) recommendedAction = 'route_to_tool';
  else if (accessType === 'premium') recommendedAction = 'answer_directly';
  else if (bestIntent === 'legal_or_compliance_question' || bestIntent === 'account_question') recommendedAction = 'answer_directly';
  else recommendedAction = 'answer_directly';
  return { intent: bestIntent, confidence, matchedKnowledgeIds, matchedToolSlugs, accessType, recommendedAction };
}