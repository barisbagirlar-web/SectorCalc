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
  "waste-hydrant-flow-analyzer.ts",
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
  ['label_i18n: {"en":"Başarısız Teslimat Cost","tr":"Başarısız Teslimat Cost"}',
   'label_i18n: {"en":"Failed Delivery Cost","tr":"Başarısız Teslimat Cost"}'],
  // demand-forecast
  ['label_i18n: {"en":"Prediction Hatası","tr":"Prediction Hatası"}',
   'label_i18n: {"en":"Forecast Error","tr":"Prediction Hatası"}'],
  ['label_i18n: {"en":"Prediction Bazlı Güvenlik Stoğu","tr":"Prediction Bazlı Güvenlik Stoğu"}',
   'label_i18n: {"en":"Forecast-Based Safety Stock","tr":"Prediction Bazlı Güvenlik Stoğu"}'],
  ['label_i18n: {"en":"Taşıma Cost (Deviation)","tr":"Taşıma Cost (Deviation)"}',
   'label_i18n: {"en":"Carrying Cost (Deviation)","tr":"Taşıma Cost (Deviation)"}'],
  ['label_i18n: {"en":"Inventory Dışı Cost","tr":"Inventory Dışı Cost"}',
   'label_i18n: {"en":"Stockout Cost","tr":"Inventory Dışı Cost"}'],
  ['label_i18n: {"en":"Total Prediction Kaynaklı Cost","tr":"Total Prediction Kaynaklı Cost"}',
   'label_i18n: {"en":"Total Forecast-Related Cost","tr":"Total Prediction Kaynaklı Cost"}'],
  // digital-twin
  ['label_i18n: {"en":"Geri Ödeme Süresi","tr":"Geri Ödeme Süresi"}',
   'label_i18n: {"en":"Payback Period","tr":"Geri Ödeme Süresi"}'],
  // downtime
  ['label_i18n: {"en":"Direkt İşçilik Kaybı","tr":"Direkt İşçilik Kaybı"}',
   'label_i18n: {"en":"Direct Labor Loss","tr":"Direkt İşçilik Kaybı"}'],
  ['label_i18n: {"en":"Üduction Kaybı","tr":"Üduction Kaybı"}',
   'label_i18n: {"en":"Production Loss","tr":"Üduction Kaybı"}'],
  ['label_i18n: {"en":"Energy İsrafı","tr":"Energy İsrafı"}',
   'label_i18n: {"en":"Energy Waste","tr":"Energy İsrafı"}'],
  ['label_i18n: {"en":"Quality Kaybı","tr":"Quality Kaybı"}',
   'label_i18n: {"en":"Quality Loss","tr":"Quality Kaybı"}'],
  ['label_i18n: {"en":"Total Duruş Cost","tr":"Total Duruş Cost"}',
   'label_i18n: {"en":"Total Downtime Cost","tr":"Total Duruş Cost"}'],
  // dye-recipe
  ['label_i18n: {"en":"Kg Başına Cost","tr":"Kg Başına Cost"}',
   'label_i18n: {"en":"Cost Per Kg","tr":"Kg Başına Cost"}'],
  // employee-turnover
  ['label_i18n: {"en":"Ayrılma Cost","tr":"Ayrılma Cost"}',
   'label_i18n: {"en":"Separation Cost","tr":"Ayrılma Cost"}'],
  ['label_i18n: {"en":"Pozisyon Boşluk Cost","tr":"Pozisyon Boşluk Cost"}',
   'label_i18n: {"en":"Vacancy Cost","tr":"Pozisyon Boşluk Cost"}'],
  ['label_i18n: {"en":"Eğitim Cost","tr":"Eğitim Cost"}',
   'label_i18n: {"en":"Training Cost","tr":"Eğitim Cost"}'],
  ['label_i18n: {"en":"Productivity Kaybı","tr":"Productivity Kaybı"}',
   'label_i18n: {"en":"Productivity Loss","tr":"Productivity Kaybı"}'],
  // energy-consumption
  ['label_i18n: {"en":"Güç Faktörü (PF)","tr":"Güç Faktörü (PF)"}',
   'label_i18n: {"en":"Power Factor (PF)","tr":"Güç Faktörü (PF)"}'],
  // environmental-waste
  ['label_i18n: {"en":"Total Çevre Cost","tr":"Total Çevre Cost"}',
   'label_i18n: {"en":"Total Environmental Cost","tr":"Total Çevre Cost"}'],
  // eoq
  ['label_i18n: {"en":"EOQ (Optimal Sipariş)","tr":"EOQ (Optimal Sipariş)"}',
   'label_i18n: {"en":"EOQ (Optimal Order)","tr":"EOQ (Optimal Sipariş)"}'],
  ['label_i18n: {"en":"Güvenlik Stoğu","tr":"Güvenlik Stoğu"}',
   'label_i18n: {"en":"Safety Stock","tr":"Güvenlik Stoğu"}'],
  ['label_i18n: {"en":"Yeniden Sipariş Noktası (ROP)","tr":"Yeniden Sipariş Noktası (ROP)"}',
   'label_i18n: {"en":"Reorder Point (ROP)","tr":"Yeniden Sipariş Noktası (ROP)"}'],
  ['label_i18n: {"en":"Inventory Devir Hızı","tr":"Inventory Devir Hızı"}',
   'label_i18n: {"en":"Inventory Turnover","tr":"Inventory Devir Hızı"}'],
  // fabric-cutting
  ['label_i18n: {"en":"Gerekli Kumaş","tr":"Gerekli Kumaş"}',
   'label_i18n: {"en":"Fabric Required","tr":"Gerekli Kumaş"}'],
  ['label_i18n: {"en":"Kumaş Cost","tr":"Kumaş Cost"}',
   'label_i18n: {"en":"Fabric Cost","tr":"Kumaş Cost"}'],
  ['label_i18n: {"en":"Efficiency İyileştirme Kazancı","tr":"Efficiency İyileştirme Kazancı"}',
   'label_i18n: {"en":"Yield Improvement Gain","tr":"Efficiency İyileştirme Kazancı"}'],
  // factory-layout
  ['label_i18n: {"en":"Total Akış Cost","tr":"Total Akış Cost"}',
   'label_i18n: {"en":"Total Flow Cost","tr":"Total Akış Cost"}'],
  ['label_i18n: {"en":"Area Useım Ratioı","tr":"Area Useım Ratioı"}',
   'label_i18n: {"en":"Space Utilization Rate","tr":"Area Useım Ratioı"}'],
  ['label_i18n: {"en":"Total Yerleşim Cost","tr":"Total Yerleşim Cost"}',
   'label_i18n: {"en":"Total Layout Cost","tr":"Total Yerleşim Cost"}'],
  // feed-cost
  ['label_i18n: {"en":"FCR (Yem Dönüşüm Ratioı)","tr":"FCR (Yem Dönüşüm Ratioı)"}',
   'label_i18n: {"en":"FCR (Feed Conversion Ratio)","tr":"FCR (Yem Dönüşüm Ratioı)"}'],
  ['label_i18n: {"en":"kg Kazanç Cost","tr":"kg Kazanç Cost"}',
   'label_i18n: {"en":"Cost Per kg Gain","tr":"kg Kazanç Cost"}'],
  // fertilizer
  ['label_i18n: {"en":"Gübre İhtiyacı (Saf N)","tr":"Gübre İhtiyacı (Saf N)"}',
   'label_i18n: {"en":"Fertilizer Need (Pure N)","tr":"Gübre İhtiyacı (Saf N)"}'],
  ['label_i18n: {"en":"Uygulama Quantityı","tr":"Uygulama Quantityı"}',
   'label_i18n: {"en":"Application Rate","tr":"Uygulama Quantityı"}'],
  ['label_i18n: {"en":"Total Gübre Cost","tr":"Total Gübre Cost"}',
   'label_i18n: {"en":"Total Fertilizer Cost","tr":"Total Gübre Cost"}'],
  // filament
  ['label_i18n: {"en":"Geri Dönüşüm Cost","tr":"Geri Dönüşüm Cost"}',
   'label_i18n: {"en":"Recycling Cost","tr":"Geri Dönüşüm Cost"}'],
  ['label_i18n: {"en":"Geri Dönüşüm ROI","tr":"Geri Dönüşüm ROI"}',
   'label_i18n: {"en":"Recycling ROI","tr":"Geri Dönüşüm ROI"}'],
  // waste-hydrant
  ['label_i18n: {"en":"Useılabilir Akış","tr":"Useılabilir Akış"}',
   'label_i18n: {"en":"Available Flow","tr":"Useılabilir Akış"}'],
];

// title_i18n.en fixes (Turkish → English)
const TITLE_FIXES = [
  // waste-hydrant
  ['title_i18n: {"en":"Yangın Hidrantı Akış Analysis Report","tr":"Yangın Hidrantı Akış Analysis Report"}',
   'title_i18n: {"en":"Waste Hydrant Flow Analysis Report","tr":"Yangın Hidrantı Akış Analysis Report"}'],
  // fabric-cutting
  ['title_i18n: {"en":"Kumaş Kesim Report","tr":"Kumaş Kesim Report"}',
   'title_i18n: {"en":"Fabric Cutting Report","tr":"Kumaş Kesim Report"}'],
];

// assumptionNotes_i18n[x].en fixes (Turkish → English)
const ASSUMPTION_FIXES = [
  // freight-cost
  ['{"en":"Taşınabilir ağırlık = max(brüt ağırlık, volume × 167).","tr":"Taşınabilir ağırlık = max(brüt ağırlık, volume × 167)."}',
   '{"en":"Chargeable weight = max(gross weight, volume × 167).","tr":"Taşınabilir ağırlık = max(brüt ağırlık, volume × 167)."}'],
  ['{"en":"Bunker = baz navlun × bunker yüzdesi.","tr":"Bunker = baz navlun × bunker yüzdesi."}',
   '{"en":"Bunker = base freight × bunker percentage.","tr":"Bunker = baz navlun × bunker yüzdesi."}'],
  ['{"en":"Total = baz + bunker + terminal + gümrük.","tr":"Total = baz + bunker + terminal + gümrük."}',
   '{"en":"Total = base + bunker + terminal + customs.","tr":"Total = baz + bunker + terminal + gümrük."}'],
  // waste-hydrant
  ['{"en":"Hidrant debisi çap ve basınç düşümüne göre hesaplanır.","tr":"Hidrant debisi çap ve basınç düşümüne göre hesaplanır."}',
   '{"en":"Hydrant flow rate is calculated based on diameter and pressure drop.","tr":"Hidrant debisi çap ve basınç düşümüne göre hesaplanır."}'],
  ['{"en":"Useılabilir akış statik ve rezidüel basınç farkına dayanır.","tr":"Useılabilir akış statik ve rezidüel basınç farkına dayanır."}',
   '{"en":"Available flow is based on the difference between static and residual pressure.","tr":"Useılabilir akış statik ve rezidüel basınç farkına dayanır."}'],
  ['{"en":"Uyumluluk skoru NFPA standardı reference alınarak belirlenir.","tr":"Uyumluluk skoru NFPA standardı reference alınarak belirlenir."}',
   '{"en":"Compliance score is determined with reference to NFPA standards.","tr":"Uyumluluk skoru NFPA standardı reference alınarak belirlenir."}'],
  // fabric-cutting
  ['{"en":"Efficiency = Total Parça Areaı / (Pastal × En).","tr":"Efficiency = Total Parça Areaı / (Pastal × En)."}',
   '{"en":"Yield = Total Part Area / (Marker × Width).","tr":"Efficiency = Total Parça Areaı / (Pastal × En)."}'],
  ['{"en":"Gerekli kumaş = Area / Efficiency × (1+Waste).","tr":"Gerekli kumaş = Area / Efficiency × (1+Waste)."}',
   '{"en":"Fabric required = Area / Yield × (1+Waste).","tr":"Gerekli kumaş = Area / Efficiency × (1+Waste)."}'],
  ['{"en":"İyileştirme = (Yeni - Eski) × Kumaş × Price.","tr":"İyileştirme = (Yeni - Eski) × Kumaş × Price."}',
   '{"en":"Improvement = (New - Old) × Fabric × Price.","tr":"İyileştirme = (Yeni - Eski) × Kumaş × Price."}'],
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
