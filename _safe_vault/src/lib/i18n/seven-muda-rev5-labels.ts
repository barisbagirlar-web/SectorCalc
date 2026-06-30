import { normalizeLocale } from "@/lib/format/localization";
import type { SevenMudaEngineeringResult } from "@/lib/premium-schema/calculators/seven-muda-waste-cost";
import type { SevenMudaWasteCategoryKey } from "@/lib/premium-schema/calculators/seven-muda-waste-decision";

export type SevenMudaRev5Labels = {
  readonly quickSummaryTitle: string;
  readonly executiveSummary: string;
  readonly totalWasteCost: string;
  readonly annualizedWasteCost: string;
  readonly wasteCostPerUnit: string;
  readonly periodRevenue: string;
  readonly periodGrossMarginValue: string;
  readonly wasteToRevenueRatio: string;
  readonly wasteToGrossMarginRatio: string;
  readonly highestWasteCategory: string;
  readonly firstActionCategory: string;
  readonly confidenceLevel: string;
  readonly riskAdjustedPriorityScore: string;
  readonly doubleCountRisk: string;
  readonly doubleCountDetected: string;
  readonly doubleCountNone: string;
  readonly decisionVerdict: string;
  readonly summaryLevel: string;
  readonly biggestCostCategory: string;
  readonly dataConfidence: string;
  readonly wasteBreakdown: string;
  readonly category: string;
  readonly cost: string;
  readonly share: string;
  readonly actionPriority: string;
  readonly recommendedActionOrder: string;
  readonly recoveryScenarios: string;
  readonly reduction: string;
  readonly periodSavings: string;
  readonly annualSavings: string;
  readonly warnings: string;
  readonly noWarnings: string;
  readonly categoryName: (key: SevenMudaWasteCategoryKey | "none") => string;
  readonly summaryLevelText: (
    level: SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],
  ) => string;
  readonly confidenceText: (level: SevenMudaEngineeringResult["confidenceLevel"]) => string;
  readonly resolveWarningMessage: (rawWarning: string) => string;
};

type SevenMudaRev5LabelCore = Omit<SevenMudaRev5Labels, "resolveWarningMessage">;

const EN_LABELS: SevenMudaRev5LabelCore = {
  quickSummaryTitle: "Decision summary",
  executiveSummary: "Executive summary",
  totalWasteCost: "Total waste cost",
  annualizedWasteCost: "Annualized waste cost",
  wasteCostPerUnit: "Waste cost per unit",
  periodRevenue: "Period revenue",
  periodGrossMarginValue: "Period gross margin value",
  wasteToRevenueRatio: "Waste to revenue ratio",
  wasteToGrossMarginRatio: "Waste to gross margin ratio",
  highestWasteCategory: "Biggest waste category",
  firstActionCategory: "First action category",
  confidenceLevel: "Data confidence level",
  riskAdjustedPriorityScore: "Risk-adjusted priority score",
  doubleCountRisk: "Double-count risk",
  doubleCountDetected: "Detected",
  doubleCountNone: "None detected",
  decisionVerdict: "Decision verdict",
  summaryLevel: "Summary level",
  biggestCostCategory: "Biggest cost category",
  dataConfidence: "Data confidence",
  wasteBreakdown: "Waste breakdown",
  category: "Category",
  cost: "Cost",
  share: "Share",
  actionPriority: "Action priority",
  recommendedActionOrder: "Recommended action order",
  recoveryScenarios: "Recovery scenarios",
  reduction: "Reduction",
  periodSavings: "Period savings",
  annualSavings: "Annual savings",
  warnings: "Warnings",
  noWarnings: "No warnings",
  categoryName: (key) => EN_CATEGORY_NAMES[key],
  summaryLevelText: (level) => EN_SUMMARY_LEVELS[level],
  confidenceText: (level) => EN_CONFIDENCE[level],
};

const TR_LABELS: SevenMudaRev5LabelCore = {
  quickSummaryTitle: "Karar özeti",
  executiveSummary: "Yönetici özeti",
  totalWasteCost: "Toplam israf maliyeti",
  annualizedWasteCost: "Yıllıklandırılmış kayıp",
  wasteCostPerUnit: "Birim israf maliyeti",
  periodRevenue: "Dönem cirosu",
  periodGrossMarginValue: "Dönem brüt marj tutarı",
  wasteToRevenueRatio: "Ciroya göre israf oranı",
  wasteToGrossMarginRatio: "Brüt marja göre israf oranı",
  highestWasteCategory: "En büyük israf alanı",
  firstActionCategory: "İlk müdahale alanı",
  confidenceLevel: "Veri güven seviyesi",
  riskAdjustedPriorityScore: "Risk ayarlı öncelik skoru",
  doubleCountRisk: "Çift sayım riski",
  doubleCountDetected: "Tespit edildi",
  doubleCountNone: "Tespit edilmedi",
  decisionVerdict: "Karar özeti",
  summaryLevel: "Özet seviye",
  biggestCostCategory: "En büyük maliyet alanı",
  dataConfidence: "Veri güven seviyesi",
  wasteBreakdown: "İsraf kırılımı",
  category: "Kategori",
  cost: "Maliyet",
  share: "Pay",
  actionPriority: "Aksiyon önceliği",
  recommendedActionOrder: "Önerilen aksiyon sırası",
  recoveryScenarios: "Geri kazanım senaryoları",
  reduction: "Azaltım",
  periodSavings: "Dönem tasarrufu",
  annualSavings: "Yıllık tasarruf",
  warnings: "Uyarılar",
  noWarnings: "Uyarı yok",
  categoryName: (key) => TR_CATEGORY_NAMES[key],
  summaryLevelText: (level) => TR_SUMMARY_LEVELS[level],
  confidenceText: (level) => TR_CONFIDENCE[level],
};


const DE_LABELS: SevenMudaRev5LabelCore = {
  quickSummaryTitle: "Entscheidungsübersicht",
  executiveSummary: "Managementübersicht",
  totalWasteCost: "Gesamtverschwendungskosten",
  annualizedWasteCost: "Jährliche Verschwendungskosten",
  wasteCostPerUnit: "Verschwendungskosten pro Einheit",
  periodRevenue: "Periodenumsatz",
  periodGrossMarginValue: "Periodenbruttomarge",
  wasteToRevenueRatio: "Verschwendungs-Umsatz-Verhältnis",
  wasteToGrossMarginRatio: "Verschwendungs-Bruttomarge-Verhältnis",
  highestWasteCategory: "Größte Verschwendungskategorie",
  firstActionCategory: "Erste Aktionskategorie",
  confidenceLevel: "Datenvertrauensniveau",
  riskAdjustedPriorityScore: "Risikobereinigter Prioritätsscore",
  doubleCountRisk: "Doppelzählungsrisiko",
  doubleCountDetected: "Erkannt",
  doubleCountNone: "Keine erkannt",
  decisionVerdict: "Entscheidungsurteil",
  summaryLevel: "Zusammenfassungsstufe",
  biggestCostCategory: "Größte Kostenkategorie",
  dataConfidence: "Datenvertrauen",
  wasteBreakdown: "Verschwendungsaufschlüsselung",
  category: "Kategorie",
  cost: "Kosten",
  share: "Anteil",
  actionPriority: "Aktionspriorität",
  recommendedActionOrder: "Empfohlene Aktionsreihenfolge",
  recoveryScenarios: "Rückgewinnungsszenarien",
  reduction: "Reduzierung",
  periodSavings: "Periodeneinsparungen",
  annualSavings: "Jährliche Einsparungen",
  warnings: "Warnungen",
  noWarnings: "Keine Warnungen",
  categoryName: (key) => DE_CATEGORY_NAMES[key],
  summaryLevelText: (level) => DE_SUMMARY_LEVELS[level],
  confidenceText: (level) => DE_CONFIDENCE[level],
};

const DE_CATEGORY_NAMES: Record<SevenMudaWasteCategoryKey | "none", string> = {
  none: "Keine Daten eingegeben",
  overproduction: "Überproduktion",
  waiting: "Warten",
  transport: "Transport",
  inventory: "Bestand",
  motion: "Bewegung",
  overprocessing: "Überbearbeitung",
  defects: "Ausschuss",
};

const DE_SUMMARY_LEVELS: Record<
  SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],
  string
> = {
  no_detected_waste: "Keine Verschwendung erkannt",
  low: "Niedrige Exposition",
  medium: "Mittlere Exposition",
  high: "Hohe Exposition",
  critical: "Kritische Exposition",
};

const DE_CONFIDENCE: Record<SevenMudaEngineeringResult["confidenceLevel"], string> = {
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
};

const FR_LABELS: SevenMudaRev5LabelCore = {
  quickSummaryTitle: "Résumé rapide",
  executiveSummary: "Synthèse",
  totalWasteCost: "Coût total des déchets",
  annualizedWasteCost: "Coût annualisé des déchets",
  wasteCostPerUnit: "Coût des déchets par unité",
  periodRevenue: "Chiffre d'affaires de la période",
  periodGrossMarginValue: "Marge brute de la période",
  wasteToRevenueRatio: "Ratio déchets/chiffre d'affaires",
  wasteToGrossMarginRatio: "Ratio déchets/marge brute",
  highestWasteCategory: "Catégorie de déchets la plus importante",
  firstActionCategory: "Première catégorie d'action",
  confidenceLevel: "Niveau de confiance des données",
  riskAdjustedPriorityScore: "Score de priorité ajusté au risque",
  doubleCountRisk: "Risque de double comptage",
  doubleCountDetected: "Détecté",
  doubleCountNone: "Aucun détecté",
  decisionVerdict: "Verdict de décision",
  summaryLevel: "Niveau de résumé",
  biggestCostCategory: "Catégorie de coût la plus élevée",
  dataConfidence: "Confiance des données",
  wasteBreakdown: "Répartition des déchets",
  category: "Catégorie",
  cost: "Coût",
  share: "Part",
  actionPriority: "Priorité d'action",
  recommendedActionOrder: "Ordre d'action recommandé",
  recoveryScenarios: "Scénarios de récupération",
  reduction: "Réduction",
  periodSavings: "Économies de la période",
  annualSavings: "Économies annualisées",
  warnings: "Avertissements",
  noWarnings: "Aucun avertissement",
  categoryName: (key) => FR_CATEGORY_NAMES[key],
  summaryLevelText: (level) => FR_SUMMARY_LEVELS[level],
  confidenceText: (level) => FR_CONFIDENCE[level],
};

const FR_CATEGORY_NAMES: Record<SevenMudaWasteCategoryKey | "none", string> = {
  none: "Aucune donnée saisie",
  overproduction: "Surproduction",
  waiting: "Attente",
  transport: "Transport",
  inventory: "Stock",
  motion: "Mouvement",
  overprocessing: "Traitement excessif",
  defects: "Défauts",
};

const FR_SUMMARY_LEVELS: Record<
  SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],
  string
> = {
  no_detected_waste: "Aucun déchet détecté",
  low: "Exposition faible",
  medium: "Exposition moyenne",
  high: "Exposition élevée",
  critical: "Exposition critique",
};

const FR_CONFIDENCE: Record<SevenMudaEngineeringResult["confidenceLevel"], string> = {
  high: "Élevée",
  medium: "Moyenne",
  low: "Faible",
};

const ES_LABELS: SevenMudaRev5LabelCore = {
  quickSummaryTitle: "Resumen rápido",
  executiveSummary: "Resumen ejecutivo",
  totalWasteCost: "Costo total de desperdicio",
  annualizedWasteCost: "Costo anualizado de desperdicio",
  wasteCostPerUnit: "Costo de desperdicio por unidad",
  periodRevenue: "Ingresos del período",
  periodGrossMarginValue: "Margen bruto del período",
  wasteToRevenueRatio: "Relación desperdicio/ingresos",
  wasteToGrossMarginRatio: "Relación desperdicio/margen bruto",
  highestWasteCategory: "Categoría de mayor desperdicio",
  firstActionCategory: "Primera categoría de acción",
  confidenceLevel: "Nivel de confianza de datos",
  riskAdjustedPriorityScore: "Puntaje de prioridad ajustado por riesgo",
  doubleCountRisk: "Riesgo de doble conteo",
  doubleCountDetected: "Detectado",
  doubleCountNone: "Ninguno detectado",
  decisionVerdict: "Veredicto de decisión",
  summaryLevel: "Nivel de resumen",
  biggestCostCategory: "Categoría de mayor costo",
  dataConfidence: "Confianza de datos",
  wasteBreakdown: "Desglose de desperdicio",
  category: "Categoría",
  cost: "Costo",
  share: "Participación",
  actionPriority: "Prioridad de acción",
  recommendedActionOrder: "Orden de acción recomendado",
  recoveryScenarios: "Escenarios de recuperación",
  reduction: "Reducción",
  periodSavings: "Ahorros del período",
  annualSavings: "Ahorros anuales",
  warnings: "Advertencias",
  noWarnings: "Sin advertencias",
  categoryName: (key) => ES_CATEGORY_NAMES[key],
  summaryLevelText: (level) => ES_SUMMARY_LEVELS[level],
  confidenceText: (level) => ES_CONFIDENCE[level],
};

const ES_CATEGORY_NAMES: Record<SevenMudaWasteCategoryKey | "none", string> = {
  none: "Sin datos ingresados",
  overproduction: "Sobreproducción",
  waiting: "Espera",
  transport: "Transporte",
  inventory: "Inventario",
  motion: "Movimiento",
  overprocessing: "Sobreprocesamiento",
  defects: "Defectos",
};

const ES_SUMMARY_LEVELS: Record<
  SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],
  string
> = {
  no_detected_waste: "Sin desperdicio detectado",
  low: "Exposición baja",
  medium: "Exposición media",
  high: "Exposición alta",
  critical: "Exposición crítica",
};

const ES_CONFIDENCE: Record<SevenMudaEngineeringResult["confidenceLevel"], string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const AR_LABELS: SevenMudaRev5LabelCore = {
  quickSummaryTitle: "ملخص القرار",
  executiveSummary: "الملخص التنفيذي",
  totalWasteCost: "إجمالي تكلفة الهدر",
  annualizedWasteCost: "تكلفة الهدر السنوية",
  wasteCostPerUnit: "تكلفة الهدر لكل وحدة",
  periodRevenue: "إيرادات الفترة",
  periodGrossMarginValue: "قيمة هامش الربح الإجمالي للفترة",
  wasteToRevenueRatio: "نسبة الهدر إلى الإيرادات",
  wasteToGrossMarginRatio: "نسبة الهدر إلى هامش الربح الإجمالي",
  highestWasteCategory: "أكبر فئة هدر",
  firstActionCategory: "فئة الإجراء الأول",
  confidenceLevel: "مستوى الثقة في البيانات",
  riskAdjustedPriorityScore: "درجة الأولوية المعدلة حسب المخاطر",
  doubleCountRisk: "خطر الازدواج في العد",
  doubleCountDetected: "تم الكشف",
  doubleCountNone: "لم يتم الكشف",
  decisionVerdict: "حكم القرار",
  summaryLevel: "مستوى الملخص",
  biggestCostCategory: "أكبر فئة تكلفة",
  dataConfidence: "ثقة البيانات",
  wasteBreakdown: "تفصيل الهدر",
  category: "الفئة",
  cost: "التكلفة",
  share: "الحصة",
  actionPriority: "أولوية الإجراء",
  recommendedActionOrder: "ترتيب الإجراءات الموصى بها",
  recoveryScenarios: "سيناريوهات الاسترداد",
  reduction: "التخفيض",
  periodSavings: "توفير الفترة",
  annualSavings: "التوفير السنوي",
  warnings: "تحذيرات",
  noWarnings: "لا توجد تحذيرات",
  categoryName: (key) => AR_CATEGORY_NAMES[key],
  summaryLevelText: (level) => AR_SUMMARY_LEVELS[level],
  confidenceText: (level) => AR_CONFIDENCE[level],
};

const AR_CATEGORY_NAMES: Record<SevenMudaWasteCategoryKey | "none", string> = {
  none: "لم يتم إدخال بيانات",
  overproduction: "إنتاج زائد",
  waiting: "انتظار",
  transport: "نقل",
  inventory: "مخزون",
  motion: "حركة",
  overprocessing: "معالجة زائدة",
  defects: "عيوب",
};

const AR_SUMMARY_LEVELS: Record<
  SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],
  string
> = {
  no_detected_waste: "لا يوجد هدر مكتشف",
  low: "تعرض منخفض",
  medium: "تعرض متوسط",
  high: "تعرض عالي",
  critical: "تعرض حرج",
};

const AR_CONFIDENCE: Record<SevenMudaEngineeringResult["confidenceLevel"], string> = {
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
};

const EN_CATEGORY_NAMES: Record<SevenMudaWasteCategoryKey | "none", string> = {
  none: "No data entered",
  overproduction: "Overproduction",
  waiting: "Waiting",
  transport: "Transport",
  inventory: "Inventory",
  motion: "Motion",
  overprocessing: "Overprocessing",
  defects: "Defects",
};

const TR_CATEGORY_NAMES: Record<SevenMudaWasteCategoryKey | "none", string> = {
  none: "Veri girilmedi",
  overproduction: "Aşırı üretim",
  waiting: "Bekleme",
  transport: "Taşıma",
  inventory: "Stok",
  motion: "Gereksiz hareket",
  overprocessing: "Fazla işlem",
  defects: "Hatalar",
};

const EN_SUMMARY_LEVELS: Record<
  SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],
  string
> = {
  no_detected_waste: "No detected waste",
  low: "Low exposure",
  medium: "Medium exposure",
  high: "High exposure",
  critical: "Critical exposure",
};

const TR_SUMMARY_LEVELS: Record<
  SevenMudaEngineeringResult["decisionVerdict"]["summaryLevel"],
  string
> = {
  no_detected_waste: "Hesaplama için israf sürücüsü girilmeli",
  low: "Düşük maruziyet",
  medium: "Orta maruziyet",
  high: "Yüksek maruziyet",
  critical: "Kritik maruziyet",
};

const EN_CONFIDENCE: Record<SevenMudaEngineeringResult["confidenceLevel"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const TR_CONFIDENCE: Record<SevenMudaEngineeringResult["confidenceLevel"], string> = {
  high: "Yüksek",
  medium: "Orta",
  low: "Düşük",
};

const SEVEN_MUDA_WARNING_MESSAGES: ReadonlyArray<{
  readonly en: string;
  readonly tr: string;
  readonly de: string;
  readonly fr: string;
  readonly es: string;
  readonly ar: string;
}> = [
  {
    en: "Analysis period exceeds annual working days. Annualized result may be inversely scaled.",
    tr: "Analiz dönemi yıllık çalışma gününden büyük. Yıllıklandırılmış sonuç ters ölçeklenebilir.",
    de: "Analysezeitraum überschreitet Arbeitstage pro Jahr. Jahresergebnis kann umgekehrt skaliert sein.",
    fr: "La période d'analyse dépasse les jours ouvrables annuels. Le résultat annualisé peut être inversement proportionnel.",
    es: "El período de análisis supera los días laborables anuales. El resultado anualizado puede escalarse inversamente.",
    ar: "فترة التحليل تتجاوز أيام العمل السنوية. قد تكون النتيجة السنوية معكوسة.",
  },
  {
    en: "Manual opportunity cost mode selected but hourly opportunity cost is zero. Waiting cost assumed zero.",
    tr: "Manuel fırsat maliyeti modu seçildi ancak saatlik fırsat maliyeti sıfır. Bekleme maliyeti sıfır kabul edilir.",
    de: "Manueller Opportunitätskostenmodus gewählt, aber stündliche Opportunitätskosten sind null. Wartekosten werden als null angenommen.",
    fr: "Mode de coût d'opportunité manuel sélectionné mais le coût d'opportunité horaire est nul. Le coût d'attente est considéré comme nul.",
    es: "Modo de costo de oportunidad manual seleccionado pero el costo de oportunidad por hora es cero. El costo de espera se asume como cero.",
    ar: "تم تحديد وضع التكلفة البديلة اليدوية ولكن التكلفة البديلة للساعة صفر. تُفترض تكلفة الانتظار صفر.",
  },
];

const WARNING_MESSAGE_MAP: Record<string, Map<string, string>> = {
  en: new Map(),
  tr: new Map(),
  de: new Map(),
  fr: new Map(),
  es: new Map(),
  ar: new Map(),
};

for (const msg of SEVEN_MUDA_WARNING_MESSAGES) {
  for (const locale of ["en", "tr", "de", "fr", "es", "ar"] as const) {
    WARNING_MESSAGE_MAP[locale].set(msg.en, msg[locale]);
  }
}

function createResolveWarningMessage(locale: string): (rawWarning: string) => string {
  const normalized = normalizeLocale(locale);
  const map = WARNING_MESSAGE_MAP[normalized];
  if (map) {
    return (rawWarning) => map.get(rawWarning) ?? rawWarning;
  }
  return (rawWarning) => rawWarning;
}

function withWarningResolver(labels: SevenMudaRev5LabelCore, locale: string): SevenMudaRev5Labels {
  return {
    ...labels,
    resolveWarningMessage: createResolveWarningMessage(locale),
  };
}

export function resolveSevenMudaRev5WarningMessage(locale: string, rawWarning: string): string {
  return createResolveWarningMessage(locale)(rawWarning);
}

const LOCALE_LABEL_MAP: Record<string, SevenMudaRev5LabelCore> = {
  tr: TR_LABELS,
  de: DE_LABELS,
  fr: FR_LABELS,
  es: ES_LABELS,
  ar: AR_LABELS,
};

export function resolveSevenMudaRev5Labels(locale: string): SevenMudaRev5Labels {
  const base = LOCALE_LABEL_MAP[normalizeLocale(locale)] ?? EN_LABELS;
  return withWarningResolver(base, locale);
}
