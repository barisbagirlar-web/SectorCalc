import type { IndustryCategory } from "@/lib/features/tools/industry-registry";
import { INDUSTRY_CATEGORY_LABELS } from "@/lib/features/tools/industry-registry";
import type { PremiumSchemaCatalogGroupId } from "@/lib/features/premium-schema/premium-schema-catalog";
import {
  PREMIUM_SCHEMA_CATALOG_GROUP_DESCRIPTIONS,
  PREMIUM_SCHEMA_CATALOG_GROUP_LABELS,
} from "@/lib/features/premium-schema/premium-schema-catalog";

const EN_INDUSTRY_CATEGORY_DESCRIPTIONS: Record<IndustryCategory, string> = {
  "heavy-industry":
    "Machine time, scrap, tolerance and shop-floor margin on production work.",
  "building-trades":
    "Quote risk, labor burden and material loss across construction trades.",
  "field-services":
    "Route time, crew utilization and job profitability in the field.",
  "food-retail":
    "Food cost, waste, margin and service-floor efficiency checks.",
  "custom-manufacturing":
    "Prototype, batch and custom job costing before you commit.",
  "logistics-transport":
    "Route loss, fuel exposure and delivery margin on every run.",
  "agriculture-livestock":
    "Crop, feed, irrigation and livestock efficiency on the farm.",
  "energy-environment":
    "Peak load, carbon exposure and utility cost on the floor.",
  "daily-life":
    "Everyday renovation, fuel and household decision checks.",
};

const TR_INDUSTRY_CATEGORY_LABELS: Record<IndustryCategory, string> = {
  "heavy-industry": "Ağır Sanayi",
  "building-trades": "İnşaat ve Yapı İşleri",
  "field-services": "Saha Hizmetleri",
  "food-retail": "Gıda ve Perakende",
  "custom-manufacturing": "Özel İmalat",
  "logistics-transport": "Lojistik ve Taşıma",
  "agriculture-livestock": "Tarım ve Hayvancılık",
  "energy-environment": "Enerji ve Çevre",
  "daily-life": "Günlük Hayat",
};

const TR_INDUSTRY_CATEGORY_DESCRIPTIONS: Record<IndustryCategory, string> = {
  "heavy-industry":
    "Makine süresi, fire, tolerans ve üretim hattı marjı.",
  "building-trades":
    "Teklif riski, işçilik yükü ve malzeme kaybı.",
  "field-services":
    "Rota süresi, ekip kullanımı ve saha kârlılığı.",
  "food-retail":
    "Gıda maliyeti, fire, marj ve servis verimliliği.",
  "custom-manufacturing":
    "Prototip, parti ve özel iş maliyetlendirme.",
  "logistics-transport":
    "Rota kaybı, yakıt maruziyeti ve teslimat marjı.",
  "agriculture-livestock":
    "Mahsul, yem, sulama ve hayvancılık verimliliği.",
  "energy-environment":
    "Pik yük, karbon maruziyeti ve enerji maliyeti.",
  "daily-life":
    "Günlük tadilat, yakıt ve ev bütçesi hesapları.",
};

const TR_PREMIUM_GROUP_LABELS: Record<PremiumSchemaCatalogGroupId, string> = {
  measurement_calibration: "Ölçüm ve Kalibrasyon",
  scrap_waste: "Fire ve Atık",
  oee_productivity: "OEE ve Verimlilik",
  time_delay: "Süre ve Gecikme",
  route_logistics: "Rota ve Lojistik",
  cost_margin: "Maliyet ve Marj",
  energy_carbon: "Enerji ve Karbon",
  benchmark_health: "Kıyaslama ve Sağlık",
};

const TR_PREMIUM_GROUP_DESCRIPTIONS: Record<PremiumSchemaCatalogGroupId, string> = {
  measurement_calibration:
    "Tolerans sapması, kalibrasyon baskısı ve ölçüm doğruluğu.",
  scrap_waste: "Fire, yeniden iş ve malzeme kaybı.",
  oee_productivity: "OEE, setup kaybı ve atölye verimliliği.",
  time_delay: "Gecikme, yeniden iş süresi ve takvim kayması.",
  route_logistics: "Rota kaybı, yakıt sapması ve nakliye marjı.",
  cost_margin: "Maliyet yığını, marj baskısı ve fiyat kararları.",
  energy_carbon: "Pik yük, enerji maliyeti ve karbon uyumu.",
  benchmark_health: "Kıyaslama sapması, stok baskısı ve sağlık sinyalleri.",
};

const DE_PREMIUM_GROUP_LABELS: Record<PremiumSchemaCatalogGroupId, string> = {
  measurement_calibration: "Messung & Kalibrierung",
  scrap_waste: "Ausschuss & Abfall",
  oee_productivity: "OEE & Produktivität",
  time_delay: "Zeit & Verzögerung",
  route_logistics: "Route & Logistik",
  cost_margin: "Kosten & Marge",
  energy_carbon: "Energie & CO₂",
  benchmark_health: "Benchmark & Gesundheit",
};

const FR_PREMIUM_GROUP_LABELS: Record<PremiumSchemaCatalogGroupId, string> = {
  measurement_calibration: "Mesure et calibration",
  scrap_waste: "Rebut et gaspillage",
  oee_productivity: "OEE et productivité",
  time_delay: "Temps et retard",
  route_logistics: "Route et logistique",
  cost_margin: "Coût et marge",
  energy_carbon: "Énergie et carbone",
  benchmark_health: "Benchmark et santé",
};

const ES_PREMIUM_GROUP_LABELS: Record<PremiumSchemaCatalogGroupId, string> = {
  measurement_calibration: "Medición y calibración",
  scrap_waste: "Scrap y desperdicio",
  oee_productivity: "OEE y productividad",
  time_delay: "Tiempo y retraso",
  route_logistics: "Ruta y logística",
  cost_margin: "Coste y margen",
  energy_carbon: "Energía y carbono",
  benchmark_health: "Benchmark y salud",
};

const AR_PREMIUM_GROUP_LABELS: Record<PremiumSchemaCatalogGroupId, string> = {
  measurement_calibration: "القياس والمعايرة",
  scrap_waste: "الهدر والخردة",
  oee_productivity: "OEE والإنتاجية",
  time_delay: "الوقت والتأخير",
  route_logistics: "المسار واللوجستيات",
  cost_margin: "التكلفة والهامش",
  energy_carbon: "الطاقة والكربون",
  benchmark_health: "المقارنة المرجعية والصحة",
};

const PREMIUM_GROUP_LABELS_BY_LOCALE: Readonly<
  Record<string, Record<PremiumSchemaCatalogGroupId, string>>
> = {
  tr: TR_PREMIUM_GROUP_LABELS,
  de: DE_PREMIUM_GROUP_LABELS,
  fr: FR_PREMIUM_GROUP_LABELS,
  es: ES_PREMIUM_GROUP_LABELS,
  ar: AR_PREMIUM_GROUP_LABELS,
};

export type CatalogCtaLabels = {
  readonly openIndustry: string;
  readonly viewAnalyzer: string;
  readonly viewCalculator: string;
  readonly openCalculator: string;
  readonly premiumBadge: string;
};

const TR_CATALOG_CTA: CatalogCtaLabels = {
  openIndustry: "Sektörü aç →",
  viewAnalyzer: "Hesaplayıcıyı aç →",
  viewCalculator: "Hesaplayıcıyı aç →",
  openCalculator: "Hesaplayıcıyı aç →",
  premiumBadge: "Premium",
};

const EN_CATALOG_CTA: CatalogCtaLabels = {
  openIndustry: "Open industry →",
  viewAnalyzer: "View calculator →",
  viewCalculator: "Open calculator →",
  openCalculator: "Open calculator →",
  premiumBadge: "Premium",
};

const DE_CATALOG_CTA: CatalogCtaLabels = {
  openIndustry: "Branche öffnen →",
  viewAnalyzer: "Rechner öffnen →",
  viewCalculator: "Rechner öffnen →",
  openCalculator: "Rechner öffnen →",
  premiumBadge: "Premium",
};

const FR_CATALOG_CTA: CatalogCtaLabels = {
  openIndustry: "Ouvrir le secteur →",
  viewAnalyzer: "Ouvrir le calculateur →",
  viewCalculator: "Ouvrir le calculateur →",
  openCalculator: "Ouvrir le calculateur →",
  premiumBadge: "Premium",
};

const ES_CATALOG_CTA: CatalogCtaLabels = {
  openIndustry: "Abrir sector →",
  viewAnalyzer: "Abrir calculadora →",
  viewCalculator: "Abrir calculadora →",
  openCalculator: "Abrir calculadora →",
  premiumBadge: "Premium",
};

const AR_CATALOG_CTA: CatalogCtaLabels = {
  openIndustry: "فتح القطاع →",
  viewAnalyzer: "فتح الحاسبة →",
  viewCalculator: "فتح الحاسبة →",
  openCalculator: "فتح الحاسبة →",
  premiumBadge: "بريميوم",
};

const CATALOG_CTA_BY_LOCALE: Readonly<Record<string, CatalogCtaLabels>> = {
  tr: TR_CATALOG_CTA,
  en: EN_CATALOG_CTA,
  de: DE_CATALOG_CTA,
  fr: FR_CATALOG_CTA,
  es: ES_CATALOG_CTA,
  ar: AR_CATALOG_CTA,
};

const DE_INDUSTRY_CATEGORY_LABELS: Record<IndustryCategory, string> = {
  "heavy-industry": "Schwerindustrie",
  "building-trades": "Baugewerbe",
  "field-services": "Außendienst",
  "food-retail": "Lebensmittel & Einzelhandel",
  "custom-manufacturing": "Einzel- und Sonderfertigung",
  "logistics-transport": "Logistik & Transport",
  "agriculture-livestock": "Landwirtschaft & Viehzucht",
  "energy-environment": "Energie & Umwelt",
  "daily-life": "Alltag",
};

const FR_INDUSTRY_CATEGORY_LABELS: Record<IndustryCategory, string> = {
  "heavy-industry": "Industrie lourde",
  "building-trades": "Bâtiment et travaux",
  "field-services": "Services sur site",
  "food-retail": "Alimentation et retail",
  "custom-manufacturing": "Fabrication sur mesure",
  "logistics-transport": "Logistique et transport",
  "agriculture-livestock": "Agriculture et élevage",
  "energy-environment": "Énergie et environnement",
  "daily-life": "Vie quotidienne",
};

const ES_INDUSTRY_CATEGORY_LABELS: Record<IndustryCategory, string> = {
  "heavy-industry": "Industria pesada",
  "building-trades": "Construcción y oficios",
  "field-services": "Servicios de campo",
  "food-retail": "Alimentación y retail",
  "custom-manufacturing": "Fabricación personalizada",
  "logistics-transport": "Logística y transporte",
  "agriculture-livestock": "Agricultura y ganadería",
  "energy-environment": "Energía y medio ambiente",
  "daily-life": "Vida diaria",
};

const AR_INDUSTRY_CATEGORY_LABELS: Record<IndustryCategory, string> = {
  "heavy-industry": "الصناعة الثقيلة",
  "building-trades": "البناء والحرف",
  "field-services": "خدمات ميدانية",
  "food-retail": "الغذاء والتجزئة",
  "custom-manufacturing": "تصنيع مخصص",
  "logistics-transport": "اللوجستيات والنقل",
  "agriculture-livestock": "الزراعة والثروة الحيوانية",
  "energy-environment": "الطاقة والبيئة",
  "daily-life": "الحياة اليومية",
};

const INDUSTRY_LABELS_BY_LOCALE: Readonly<Record<string, Record<IndustryCategory, string>>> = {
  tr: TR_INDUSTRY_CATEGORY_LABELS,
  de: DE_INDUSTRY_CATEGORY_LABELS,
  fr: FR_INDUSTRY_CATEGORY_LABELS,
  es: ES_INDUSTRY_CATEGORY_LABELS,
  ar: AR_INDUSTRY_CATEGORY_LABELS,
};

export function resolveIndustryCategoryLabel(
  category: IndustryCategory,
  locale: string
): string {
  return INDUSTRY_LABELS_BY_LOCALE[locale]?.[category] ?? INDUSTRY_CATEGORY_LABELS[category];
}

export function resolveIndustryCategoryDescription(
  category: IndustryCategory,
  locale: string
): string {
  if (locale === "tr") {
    return TR_INDUSTRY_CATEGORY_DESCRIPTIONS[category];
  }
  return EN_INDUSTRY_CATEGORY_DESCRIPTIONS[category];
}

export function resolvePremiumCatalogGroupLabel(
  groupId: PremiumSchemaCatalogGroupId,
  locale: string
): string {
  return (
    PREMIUM_GROUP_LABELS_BY_LOCALE[locale]?.[groupId] ??
    (locale === "tr" ? TR_PREMIUM_GROUP_LABELS[groupId] : PREMIUM_SCHEMA_CATALOG_GROUP_LABELS[groupId])
  );
}

export function resolvePremiumCatalogGroupDescription(
  groupId: PremiumSchemaCatalogGroupId,
  locale: string
): string {
  if (locale === "tr") {
    return TR_PREMIUM_GROUP_DESCRIPTIONS[groupId];
  }
  return PREMIUM_SCHEMA_CATALOG_GROUP_DESCRIPTIONS[groupId];
}

export function resolveCatalogCtaLabels(locale: string): CatalogCtaLabels {
  return CATALOG_CTA_BY_LOCALE[locale] ?? EN_CATALOG_CTA;
}

export function shouldRenderCrawlIndexForLocale(locale: string): boolean {
  return locale !== "tr";
}
