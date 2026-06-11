import type { IndustryCategory } from "@/lib/tools/industry-registry";
import { INDUSTRY_CATEGORY_LABELS } from "@/lib/tools/industry-registry";
import type { PremiumSchemaCatalogGroupId } from "@/lib/premium-schema/premium-schema-catalog";
import {
  PREMIUM_SCHEMA_CATALOG_GROUP_DESCRIPTIONS,
  PREMIUM_SCHEMA_CATALOG_GROUP_LABELS,
} from "@/lib/premium-schema/premium-schema-catalog";

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

export type CatalogCtaLabels = {
  readonly openIndustry: string;
  readonly viewAnalyzer: string;
  readonly openCalculator: string;
  readonly premiumBadge: string;
};

const TR_CATALOG_CTA: CatalogCtaLabels = {
  openIndustry: "Sektörü aç →",
  viewAnalyzer: "Analizörü gör →",
  openCalculator: "Hesaplayıcıyı aç →",
  premiumBadge: "Premium",
};

const EN_CATALOG_CTA: CatalogCtaLabels = {
  openIndustry: "Open industry →",
  viewAnalyzer: "View calculator →",
  openCalculator: "Open calculator →",
  premiumBadge: "Premium analyzer",
};

export function resolveIndustryCategoryLabel(
  category: IndustryCategory,
  locale: string
): string {
  if (locale === "tr") {
    return TR_INDUSTRY_CATEGORY_LABELS[category];
  }
  return INDUSTRY_CATEGORY_LABELS[category];
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
  if (locale === "tr") {
    return TR_PREMIUM_GROUP_LABELS[groupId];
  }
  return PREMIUM_SCHEMA_CATALOG_GROUP_LABELS[groupId];
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
  return locale === "tr" ? TR_CATALOG_CTA : EN_CATALOG_CTA;
}

export function shouldRenderCrawlIndexForLocale(locale: string): boolean {
  return locale !== "tr";
}
