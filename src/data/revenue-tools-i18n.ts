import type { AppLocale } from "@/i18n/routing";

/**
 * Locale-aware overrides for revenue tool titles.
 *
 * The canonical revenue-tools registry stores English titles. This module
 * layers natural Turkish (and future locale) names on top, keyed by the
 * tool's free or paid slug. When an override is missing the registry's
 * English title is returned, so adding a locale is purely additive.
 */

type ToolKind = "free" | "paid";

const TR_PAID_TITLES: Record<string, string> = {
  "cnc-quote-risk-analyzer": "CNC Teklif Riski Analizi",
  "change-order-impact-analyzer": "İş Değişikliği Etki Analizi",
  "office-cleaning-bid-optimizer": "Ofis Temizliği Teklif Optimizasyonu",
  "menu-profit-leak-detector": "Menü Kâr Kaçağı Analizi",
  "return-profit-erosion-tool": "İade Kaynaklı Kâr Erozyonu Analizi",
  "welding-bid-risk-analyzer": "Kaynak Teklifi Risk Analizi",
  "hvac-project-margin-guard": "HVAC Proje Kârlılık Kontrolü",
  "panel-shop-margin-verdict": "Pano İmalatı Kârlılık Değerlendirmesi",
  "landscaping-contract-profit-tool": "Peyzaj Sözleşmesi Kâr Analizi",
  "auto-shop-margin-leak-detector": "Oto Servis Kâr Kaçağı Analizi",
  "signage-bid-safe-price-tool": "Tabela Teklifi Güvenli Fiyat Analizi",
  "plumbing-job-margin-verdict": "Tesisat İşi Kâr Marjı Değerlendirmesi",
  "millwork-bid-risk-analyzer": "Ahşap İmalat Teklif Riski Analizi",
  "roofing-contract-margin-guard": "Çatı İşi Sözleşme Kârlılık Kontrolü",
  "painting-job-profit-verdict": "Boya İşi Kâr Değerlendirmesi",
  "sheet-metal-quote-risk-tool": "Sac Metal Teklif Riski Analizi",
  "3d-print-job-margin-tool": "3D Baskı İşi Kâr Marjı Analizi",
  "route-optimization-analyzer": "Rota ve Yük Kayıp Analizi",
  "crop-yield-loss-analyzer": "Ürün Verim Kaybı Analizi",
  "water-optimization-verdict": "Su Verimliliği Değerlendirmesi",
  "feed-efficiency-analyzer": "Yem Verimliliği Analizi",
  "dairy-profit-detector": "Süt Üretimi Kâr Kaçağı Analizi",
  "energy-efficiency-report": "Enerji Verimliliği Raporu",
  "cbam-compliance-verdict": "CBAM Uyum Değerlendirmesi",
  "renovation-budget-optimizer": "Tadilat Bütçesi Optimizasyonu",
  "trip-budget-optimizer": "Yolculuk Bütçesi Optimizasyonu",
  "meal-planning-verdict": "Haftalık Yemek Planlama Değerlendirmesi",
};

const TR_FREE_TITLES: Record<string, string> = {
  "machine-time-calculator": "Makine Süresi Hesaplama Aracı",
  "project-cost-calculator": "Proje Maliyeti Hesaplama Aracı",
  "cleaning-cost-calculator": "Temizlik Maliyeti Hesaplama Aracı",
  "food-cost-calculator": "Gıda Maliyeti Hesaplama Aracı",
  "product-margin-calculator": "Ürün Marjı Hesaplama Aracı",
  "welding-cost-estimator": "Kaynak Maliyeti Tahmin Aracı",
  "hvac-tonnage-rule-check": "HVAC Tonaj Kontrolü",
  "electrical-labor-estimator": "Elektrik İşçilik Tahmin Aracı",
  "lawn-care-cost-check": "Bahçe Bakımı Maliyet Kontrolü",
  "repair-time-vs-price-check": "Servis Süresi ve Fiyat Karşılaştırması",
  "print-job-cost-check": "Baskı İşi Maliyet Kontrolü",
  "plumbing-fixture-cost-check": "Tesisat Armatür Maliyet Kontrolü",
  "cabinet-cost-estimator": "Mobilya Maliyeti Tahmin Aracı",
  "roofing-square-cost-check": "Çatı Metrekare Maliyet Kontrolü",
  "paint-coverage-cost-check": "Boya Kapsam Maliyet Kontrolü",
  "laser-cutting-time-check": "Lazer Kesim Süresi Kontrolü",
  "3d-print-cost-check": "3D Baskı Maliyet Kontrolü",
  "desi-calculator": "Desi ve Hacimsel Ağırlık Hesaplama Aracı",
  "fertilizer-dosage-calculator": "Gübre Dozaj Hesaplama Aracı",
  "irrigation-cost-check": "Sulama Maliyet Kontrolü",
  "feed-cost-estimator": "Yem Maliyeti Tahmin Aracı",
  "milk-yield-check": "Süt Verimi Kontrolü",
  "kwh-consumption-check": "kWh Tüketim Kontrolü",
  "carbon-footprint-quick": "Hızlı Karbon Ayak İzi Tahmini",
  "home-renovation-m2": "Tadilat m² Maliyet Hesaplama Aracı",
  "fuel-consumption-check": "Yakıt Tüketim Kontrolü",
  "recipe-cost-check": "Tarif Maliyeti Kontrolü",
};

const REVENUE_TOOL_TITLES: Partial<
  Record<AppLocale, { paid: Record<string, string>; free: Record<string, string> }>
> = {
  tr: { paid: TR_PAID_TITLES, free: TR_FREE_TITLES },
};

export function getLocalizedRevenueToolTitle(
  slug: string,
  kind: ToolKind,
  locale: string,
  fallback: string,
): string {
  const map = REVENUE_TOOL_TITLES[locale as AppLocale];
  if (!map) return fallback;
  return map[kind][slug] ?? fallback;
}
