import type { IndustryCategory } from "@/lib/tools/industry-registry";

/** Bilingual category labels for homepage / industries showcase */
export const INDUSTRY_CATEGORY_DISPLAY: Record<
  IndustryCategory,
  { en: string; tr: string }
> = {
  "heavy-industry": {
    en: "Heavy Industry & Manufacturing",
    tr: "Ağır Sanayi & İmalat",
  },
  "building-trades": {
    en: "Building Trades",
    tr: "İnşaat & Yapı",
  },
  "field-services": {
    en: "Field Services",
    tr: "Saha Hizmetleri",
  },
  "food-retail": {
    en: "Food & Retail",
    tr: "Gıda & Perakende",
  },
  "custom-manufacturing": {
    en: "Custom Manufacturing",
    tr: "Özel Üretim",
  },
  "logistics-transport": {
    en: "Logistics & Transport",
    tr: "Lojistik & Nakliye",
  },
  "agriculture-livestock": {
    en: "Agriculture & Livestock",
    tr: "Tarım & Hayvancılık",
  },
  "energy-environment": {
    en: "Energy & Environment",
    tr: "Enerji & Çevre",
  },
  "daily-life": {
    en: "Daily Life",
    tr: "Günlük Yaşam",
  },
};
