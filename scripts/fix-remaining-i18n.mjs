/**
 * Fix remaining i18n issues in 30 premium schema files.
 * Handles: output label_i18n.en, title_i18n.en, assumptionNotes_i18n.en
 * Uses split/join for $ safety.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("src/lib/premium-schema/schemas");

const FILES = [
  "delivery-cost-analyzer.ts",
  "demand-forecast-stock-analyzer.ts",
  "digital-twin-cost-analyzer.ts",
  "downtime-cost-analyzer.ts",
  "dye-recipe-cost-analyzer.ts",
  "employee-turnover-cost-analyzer.ts",
  "energy-consumption-report-analyzer.ts",
  "environmental-waste-cost-analyzer.ts",
  "eoq-inventory-optimizer-analyzer.ts",
  "fabric-cutting-optimizer-analyzer.ts",
  "factory-layout-distance-analyzer.ts",
  "feed-cost-formulation-analyzer.ts",
  "fertilizer-dosage-analyzer.ts",
  "filament-recycling-analyzer.ts",
  "fire-hydrant-flow-analyzer.ts",
  "flexible-manufacturing-roi-analyzer.ts",
  "food-waste-margin-analyzer.ts",
  "freight-cost-analyzer.ts",
  "fuel-route-drift-analyzer.ts",
  "gage-rnr-cost-analyzer.ts",
  "haccp-deviation-cost-analyzer.ts",
  "heat-exchanger-fouling-analyzer.ts",
  "hourly-rate-analyzer.ts",
  "hvac-capacity-analyzer.ts",
  "hydraulic-system-loss-analyzer.ts",
  "inflation-escalation-analyzer.ts",
  "interest-rate-risk-analyzer.ts",
  "inventory-turnover-risk-analyzer.ts",
  "irr-investment-analyzer.ts",
  "irrigation-cost-check-analyzer.ts",
];

// Output label_i18n.en fixes (Turkish → English)
const OUTPUT_LABEL_FIXES = [
  // delivery-cost
  ['label_i18n: {"en":"Teslimat Verimliliği","tr":"Teslimat Verimliliği"}',
   'label_i18n: {"en":"Delivery Efficiency","tr":"Teslimat Verimliliği"}'],
  ['label_i18n: {"en":"Başarısız Teslimat Maliyeti","tr":"Başarısız Teslimat Maliyeti"}',
   'label_i18n: {"en":"Failed Delivery Cost","tr":"Başarısız Teslimat Maliyeti"}'],
  // demand-forecast
  ['label_i18n: {"en":"Tahmin Hatası","tr":"Tahmin Hatası"}',
   'label_i18n: {"en":"Forecast Error","tr":"Tahmin Hatası"}'],
  ['label_i18n: {"en":"Tahmin Bazlı Güvenlik Stoğu","tr":"Tahmin Bazlı Güvenlik Stoğu"}',
   'label_i18n: {"en":"Forecast-Based Safety Stock","tr":"Tahmin Bazlı Güvenlik Stoğu"}'],
  ['label_i18n: {"en":"Taşıma Maliyeti (Sapma)","tr":"Taşıma Maliyeti (Sapma)"}',
   'label_i18n: {"en":"Carrying Cost (Deviation)","tr":"Taşıma Maliyeti (Sapma)"}'],
  ['label_i18n: {"en":"Stok Dışı Maliyeti","tr":"Stok Dışı Maliyeti"}',
   'label_i18n: {"en":"Stockout Cost","tr":"Stok Dışı Maliyeti"}'],
  ['label_i18n: {"en":"Toplam Tahmin Kaynaklı Maliyet","tr":"Toplam Tahmin Kaynaklı Maliyet"}',
   'label_i18n: {"en":"Total Forecast-Related Cost","tr":"Toplam Tahmin Kaynaklı Maliyet"}'],
  // digital-twin
  ['label_i18n: {"en":"Geri Ödeme Süresi","tr":"Geri Ödeme Süresi"}',
   'label_i18n: {"en":"Payback Period","tr":"Geri Ödeme Süresi"}'],
  // downtime
  ['label_i18n: {"en":"Direkt İşçilik Kaybı","tr":"Direkt İşçilik Kaybı"}',
   'label_i18n: {"en":"Direct Labor Loss","tr":"Direkt İşçilik Kaybı"}'],
  ['label_i18n: {"en":"Üretim Kaybı","tr":"Üretim Kaybı"}',
   'label_i18n: {"en":"Production Loss","tr":"Üretim Kaybı"}'],
  ['label_i18n: {"en":"Enerji İsrafı","tr":"Enerji İsrafı"}',
   'label_i18n: {"en":"Energy Waste","tr":"Enerji İsrafı"}'],
  ['label_i18n: {"en":"Kalite Kaybı","tr":"Kalite Kaybı"}',
   'label_i18n: {"en":"Quality Loss","tr":"Kalite Kaybı"}'],
  ['label_i18n: {"en":"Toplam Duruş Maliyeti","tr":"Toplam Duruş Maliyeti"}',
   'label_i18n: {"en":"Total Downtime Cost","tr":"Toplam Duruş Maliyeti"}'],
  // dye-recipe
  ['label_i18n: {"en":"Kg Başına Maliyet","tr":"Kg Başına Maliyet"}',
   'label_i18n: {"en":"Cost Per Kg","tr":"Kg Başına Maliyet"}'],
  // employee-turnover
  ['label_i18n: {"en":"Ayrılma Maliyeti","tr":"Ayrılma Maliyeti"}',
   'label_i18n: {"en":"Separation Cost","tr":"Ayrılma Maliyeti"}'],
  ['label_i18n: {"en":"Pozisyon Boşluk Maliyeti","tr":"Pozisyon Boşluk Maliyeti"}',
   'label_i18n: {"en":"Vacancy Cost","tr":"Pozisyon Boşluk Maliyeti"}'],
  ['label_i18n: {"en":"Eğitim Maliyeti","tr":"Eğitim Maliyeti"}',
   'label_i18n: {"en":"Training Cost","tr":"Eğitim Maliyeti"}'],
  ['label_i18n: {"en":"Verimlilik Kaybı","tr":"Verimlilik Kaybı"}',
   'label_i18n: {"en":"Productivity Loss","tr":"Verimlilik Kaybı"}'],
  // energy-consumption
  ['label_i18n: {"en":"Güç Faktörü (PF)","tr":"Güç Faktörü (PF)"}',
   'label_i18n: {"en":"Power Factor (PF)","tr":"Güç Faktörü (PF)"}'],
  // environmental-waste
  ['label_i18n: {"en":"Toplam Çevre Maliyeti","tr":"Toplam Çevre Maliyeti"}',
   'label_i18n: {"en":"Total Environmental Cost","tr":"Toplam Çevre Maliyeti"}'],
  // eoq
  ['label_i18n: {"en":"EOQ (Optimum Sipariş)","tr":"EOQ (Optimum Sipariş)"}',
   'label_i18n: {"en":"EOQ (Optimum Order)","tr":"EOQ (Optimum Sipariş)"}'],
  ['label_i18n: {"en":"Güvenlik Stoğu","tr":"Güvenlik Stoğu"}',
   'label_i18n: {"en":"Safety Stock","tr":"Güvenlik Stoğu"}'],
  ['label_i18n: {"en":"Yeniden Sipariş Noktası (ROP)","tr":"Yeniden Sipariş Noktası (ROP)"}',
   'label_i18n: {"en":"Reorder Point (ROP)","tr":"Yeniden Sipariş Noktası (ROP)"}'],
  ['label_i18n: {"en":"Stok Devir Hızı","tr":"Stok Devir Hızı"}',
   'label_i18n: {"en":"Inventory Turnover","tr":"Stok Devir Hızı"}'],
  // fabric-cutting
  ['label_i18n: {"en":"Gerekli Kumaş","tr":"Gerekli Kumaş"}',
   'label_i18n: {"en":"Fabric Required","tr":"Gerekli Kumaş"}'],
  ['label_i18n: {"en":"Kumaş Maliyeti","tr":"Kumaş Maliyeti"}',
   'label_i18n: {"en":"Fabric Cost","tr":"Kumaş Maliyeti"}'],
  ['label_i18n: {"en":"Verim İyileştirme Kazancı","tr":"Verim İyileştirme Kazancı"}',
   'label_i18n: {"en":"Yield Improvement Gain","tr":"Verim İyileştirme Kazancı"}'],
  // factory-layout
  ['label_i18n: {"en":"Toplam Akış Maliyeti","tr":"Toplam Akış Maliyeti"}',
   'label_i18n: {"en":"Total Flow Cost","tr":"Toplam Akış Maliyeti"}'],
  ['label_i18n: {"en":"Alan Kullanım Oranı","tr":"Alan Kullanım Oranı"}',
   'label_i18n: {"en":"Space Utilization Rate","tr":"Alan Kullanım Oranı"}'],
  ['label_i18n: {"en":"Toplam Yerleşim Maliyeti","tr":"Toplam Yerleşim Maliyeti"}',
   'label_i18n: {"en":"Total Layout Cost","tr":"Toplam Yerleşim Maliyeti"}'],
  // feed-cost
  ['label_i18n: {"en":"FCR (Yem Dönüşüm Oranı)","tr":"FCR (Yem Dönüşüm Oranı)"}',
   'label_i18n: {"en":"FCR (Feed Conversion Ratio)","tr":"FCR (Yem Dönüşüm Oranı)"}'],
  ['label_i18n: {"en":"kg Kazanç Maliyeti","tr":"kg Kazanç Maliyeti"}',
   'label_i18n: {"en":"Cost Per kg Gain","tr":"kg Kazanç Maliyeti"}'],
  // fertilizer
  ['label_i18n: {"en":"Gübre İhtiyacı (Saf N)","tr":"Gübre İhtiyacı (Saf N)"}',
   'label_i18n: {"en":"Fertilizer Need (Pure N)","tr":"Gübre İhtiyacı (Saf N)"}'],
  ['label_i18n: {"en":"Uygulama Miktarı","tr":"Uygulama Miktarı"}',
   'label_i18n: {"en":"Application Rate","tr":"Uygulama Miktarı"}'],
  ['label_i18n: {"en":"Toplam Gübre Maliyeti","tr":"Toplam Gübre Maliyeti"}',
   'label_i18n: {"en":"Total Fertilizer Cost","tr":"Toplam Gübre Maliyeti"}'],
  // filament
  ['label_i18n: {"en":"Geri Dönüşüm Maliyeti","tr":"Geri Dönüşüm Maliyeti"}',
   'label_i18n: {"en":"Recycling Cost","tr":"Geri Dönüşüm Maliyeti"}'],
  ['label_i18n: {"en":"Geri Dönüşüm ROI","tr":"Geri Dönüşüm ROI"}',
   'label_i18n: {"en":"Recycling ROI","tr":"Geri Dönüşüm ROI"}'],
  // fire-hydrant
  ['label_i18n: {"en":"Kullanılabilir Akış","tr":"Kullanılabilir Akış"}',
   'label_i18n: {"en":"Available Flow","tr":"Kullanılabilir Akış"}'],
];

// title_i18n.en fixes (Turkish → English)
const TITLE_FIXES = [
  // fire-hydrant
  ['title_i18n: {"en":"Yangın Hidrantı Akış Analiz Raporu","tr":"Yangın Hidrantı Akış Analiz Raporu"}',
   'title_i18n: {"en":"Fire Hydrant Flow Analysis Report","tr":"Yangın Hidrantı Akış Analiz Raporu"}'],
  // fabric-cutting
  ['title_i18n: {"en":"Kumaş Kesim Raporu","tr":"Kumaş Kesim Raporu"}',
   'title_i18n: {"en":"Fabric Cutting Report","tr":"Kumaş Kesim Raporu"}'],
];

// assumptionNotes_i18n[x].en fixes (Turkish → English)
const ASSUMPTION_FIXES = [
  // freight-cost
  ['{"en":"Taşınabilir ağırlık = max(brüt ağırlık, hacim × 167).","tr":"Taşınabilir ağırlık = max(brüt ağırlık, hacim × 167)."}',
   '{"en":"Chargeable weight = max(gross weight, volume × 167).","tr":"Taşınabilir ağırlık = max(brüt ağırlık, hacim × 167)."}'],
  ['{"en":"Bunker = baz navlun × bunker yüzdesi.","tr":"Bunker = baz navlun × bunker yüzdesi."}',
   '{"en":"Bunker = base freight × bunker percentage.","tr":"Bunker = baz navlun × bunker yüzdesi."}'],
  ['{"en":"Toplam = baz + bunker + terminal + gümrük.","tr":"Toplam = baz + bunker + terminal + gümrük."}',
   '{"en":"Total = base + bunker + terminal + customs.","tr":"Toplam = baz + bunker + terminal + gümrük."}'],
  // fire-hydrant
  ['{"en":"Hidrant debisi çap ve basınç düşümüne göre hesaplanır.","tr":"Hidrant debisi çap ve basınç düşümüne göre hesaplanır."}',
   '{"en":"Hydrant flow rate is calculated based on diameter and pressure drop.","tr":"Hidrant debisi çap ve basınç düşümüne göre hesaplanır."}'],
  ['{"en":"Kullanılabilir akış statik ve rezidüel basınç farkına dayanır.","tr":"Kullanılabilir akış statik ve rezidüel basınç farkına dayanır."}',
   '{"en":"Available flow is based on the difference between static and residual pressure.","tr":"Kullanılabilir akış statik ve rezidüel basınç farkına dayanır."}'],
  ['{"en":"Uyumluluk skoru NFPA standardı referans alınarak belirlenir.","tr":"Uyumluluk skoru NFPA standardı referans alınarak belirlenir."}',
   '{"en":"Compliance score is determined with reference to NFPA standards.","tr":"Uyumluluk skoru NFPA standardı referans alınarak belirlenir."}'],
  // fabric-cutting
  ['{"en":"Verim = Toplam Parça Alanı / (Pastal × En).","tr":"Verim = Toplam Parça Alanı / (Pastal × En)."}',
   '{"en":"Yield = Total Part Area / (Marker × Width).","tr":"Verim = Toplam Parça Alanı / (Pastal × En)."}'],
  ['{"en":"Gerekli kumaş = Alan / Verim × (1+Fire).","tr":"Gerekli kumaş = Alan / Verim × (1+Fire)."}',
   '{"en":"Fabric required = Area / Yield × (1+Waste).","tr":"Gerekli kumaş = Alan / Verim × (1+Fire)."}'],
  ['{"en":"İyileştirme = (Yeni - Eski) × Kumaş × Fiyat.","tr":"İyileştirme = (Yeni - Eski) × Kumaş × Fiyat."}',
   '{"en":"Improvement = (New - Old) × Fabric × Price.","tr":"İyileştirme = (Yeni - Eski) × Kumaş × Fiyat."}'],
];

let totalChanges = 0;
let filesChanged = 0;

for (const file of FILES) {
  const fpath = path.join(DIR, file);
  let content = fs.readFileSync(fpath, "utf-8");
  let fileChanged = false;

  // Apply output label fixes
  for (const [oldStr, newStr] of OUTPUT_LABEL_FIXES) {
    if (content.includes(oldStr)) {
      content = content.split(oldStr).join(newStr);
      fileChanged = true;
      totalChanges++;
    }
  }

  // Apply title fixes
  for (const [oldStr, newStr] of TITLE_FIXES) {
    if (content.includes(oldStr)) {
      content = content.split(oldStr).join(newStr);
      fileChanged = true;
      totalChanges++;
    }
  }

  // Apply assumption note fixes
  for (const [oldStr, newStr] of ASSUMPTION_FIXES) {
    if (content.includes(oldStr)) {
      content = content.split(oldStr).join(newStr);
      fileChanged = true;
      totalChanges++;
    }
  }

  if (fileChanged) {
    fs.writeFileSync(fpath, content, "utf-8");
    filesChanged++;
    console.log(`  ✓ ${file}`);
  }
}

console.log(`\n=== Fixed ${totalChanges} i18n values across ${filesChanged} files ===`);
