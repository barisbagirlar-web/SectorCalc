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
}> = [
  {
    en: "Analiz dönemi yıllık çalışma gününden büyük. Yıllıklandırılmış sonuç ters ölçeklenebilir.",
    tr: "Analiz dönemi yıllık çalışma gününden büyük. Yıllıklandırılmış sonuç ters ölçeklenebilir.",
  },
  {
    en: "Manuel fırsat maliyeti modu seçildi ancak saatlik fırsat maliyeti sıfır. Bekleme maliyeti sıfır kabul edilir.",
    tr: "Manuel fırsat maliyeti modu seçildi ancak saatlik fırsat maliyeti sıfır. Bekleme maliyeti sıfır kabul edilir.",
  },
];

const WARNING_EN_TO_TR = new Map(
  SEVEN_MUDA_WARNING_MESSAGES.map((message) => [message.en, message.tr] as const),
);

function createResolveWarningMessage(locale: string): (rawWarning: string) => string {
  if (normalizeLocale(locale) !== "tr") {
    return (rawWarning) => rawWarning;
  }
  return (rawWarning) => WARNING_EN_TO_TR.get(rawWarning) ?? rawWarning;
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

export function resolveSevenMudaRev5Labels(locale: string): SevenMudaRev5Labels {
  return normalizeLocale(locale) === "tr"
    ? withWarningResolver(TR_LABELS, locale)
    : withWarningResolver(EN_LABELS, locale);
}
