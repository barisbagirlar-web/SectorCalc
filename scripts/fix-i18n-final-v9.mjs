/**
 * fix-i18n-final-v9.mjs — Fix ALL remaining real inversions
 */
import { readFileSync, writeFileSync } from "fs";

const D = "/Users/macair1/projects/SectorCalc/src/lib/premium-schema/schemas";

// label_i18n: Turkish→English (for where en===tr)
const LABEL = {
  "Installation Cost":"Installation Cost","Yıllık İşletme Cost":"Annual Operating Cost",
  "Project Ömrü":"Project Life","İskonto Ratioı":"Discount Rate",
  "Teşvik / Sübvansiyon":"Incentive / Subsidy",
  "Satış Priceı":"Selling Price","Unit Değişken Cost":"Unit Variable Cost",
  "Sabit Cost":"Fixed Cost","Müşteri Sayısı":"Customer Count",
  "Demand Quantityı":"Demand Quantity","Price Değişimi (%)":"Price Change (%)",
  "Esneklik Katsayısı":"Elasticity Coefficient",
  "Average Sipariş Bedeli":"Average Order Value",
  "Bina Çevresi":"Building Perimeter","Bina Yüksekliği":"Building Height",
  "m² Leasing Bedeli":"Rental Rate per m²","Leasing Süresi":"Rental Duration",
  "Nakliye Cost":"Transportation Cost","Süre Aşımı Cost":"Overrun Cost",
  "İskele Areaı":"Scaffold Area","Leasing Cost":"Rental Cost",
  "Total İskele Cost":"Total Scaffold Cost",
  "Material Waste Ratioı":"Material Waste Rate",
  "Otel Oda Sayısı":"Number of Hotel Rooms","Doluluk Ratioı":"Occupancy Rate",
  "Average Oda Priceı":"Average Room Rate",
  "Yiyecek Cost (%)":"Food Cost (%)","İşçilik Cost (%)":"Labor Cost (%)",
  "SO2 Emisyonu (ton/yıl)":"SO2 Emissions (ton/year)",
  "NOx Emisyonu (ton/yıl)":"NOx Emissions (ton/year)",
  "CO2 Emisyonu (ton/yıl)":"CO2 Emissions (ton/year)",
  "Partikül Madde (ton/yıl)":"Particulate Matter (ton/year)",
  "Aylık Emisyon Azaltma Hedefi (%)":"Monthly Emission Reduction Target (%)",
  "Emisyon Vergisi (USD/ton)":"Emission Tax (USD/ton)",
  "Motor Gücü":"Engine Power",
  "SMV Süreleri (virgülle ayır)":"SMV Times (comma-separated)",
  "Planlı Duruş":"Planned Downtime","Günlük Hedef Count":"Daily Target Quantity",
  "Hedef Efficiency":"Target Efficiency","Teorik Operatör":"Theoretical Operator",
  "Gerçek Operatör":"Actual Operator","Hat Verimliliği":"Line Efficiency",
  "Total SMV":"Total SMV","Total SMV (Tüm Operasyonlar)":"Total SMV (All Operations)",
  "Gelir":"Revenue","Tahmini Waste":"Estimated Waste",
  "Hırsızlık / Zaiyat":"Theft / Shrinkage","Mutfak Sapması":"Kitchen Variance",
  "Deviation Ratioı":"Variance Rate","Waste Cost":"Waste Cost",
  "Zaiyat Cost":"Shrinkage Cost","İdeal Margin":"Ideal Margin",
  "Gerçekleşen Cost":"Actual Cost","Teklif Edilen Tutar":"Quoted Amount",
  "Sözleşme Marginı":"Contract Margin","Total Taşeron Bütçesi":"Total Subcontractor Budget",
  "Teklif Marginı":"Quoted Margin","Gerçekleşen Margin":"Actual Margin",
  "Margin Kaçağı":"Margin Leak","Kaçak Ratioı":"Leakage Rate",
  "Total Fatura Tutarı (Döviz)":"Total Invoice (Foreign Currency)",
  "Güncel Kur":"Current Rate","Expected Kur Değişimi":"Expected Rate Shift",
  "Kur Volatilitesi":"Currency Volatility","Korunma Cost":"Hedging Cost",
  "Sözleşme Klausül Tasarrufu":"Contract Clause Savings",
  "Döviz Pozisyonu":"FX Position","Expected Kur Lossı":"Expected FX Loss",
  "Net Risk Cost":"Net Risk Cost","Klausül Tasarrufu":"Clause Savings",
  "Montaj İşçilik (m² başına)":"Erection Labor (per m²)",
  "Söküm İşçilik (m² başına)":"Dismantle Labor (per m²)",
  "Çatı Uzunluğu":"Roof Length","Çatı Genişliği":"Roof Width",
  "Eğim Açısı":"Pitch Angle","Saçak Shareı":"Eaves Overhang",
  "Material Ağırlığı":"Material Weight",
};

// expertMeaning_i18n.tr: English→Turkish
const EXPERT = {
  "Total installation cost":"Total installation cost",
  "Annual O&M cost":"Yıllık işletme ve bakım cost",
  "Project economic life":"Project economic ömrü",
  "Discount rate for NPV":"NPV için discount ratioı",
  "Fixed costs":"Sabit maliyetler",
  "Overhead cost":"Genel expense cost",
  "Material waste factor":"Material waste faktörü",
  "Theoretical (ideal) food cost":"Teorik (ideal) yiyecek cost",
  "Total food revenue":"Total yiyecek geliri",
  "Estimated waste cost":"Tahmini waste cost",
  "Quoted subcontractor amount":"Teklif edilen taşeron tutarı",
  "Unit price":"Unit price",
  "Cost of hedging":"Korunma cost",
  "Currency volatility rate":"Kur volatility ratioı",
};

// painStatement_i18n.en: Turkish→English
const PAIN = {
  "Yüksek ürün çeşitliliği ve karmaşık tasarımlar, operasyonel gizli maliyetleri artırır. Her bir SKU'nun gerçek kârlılığı bilinmezse resource wasteı kaçınılmazdır.":"High product variety and complex designs increase hidden operational costs. Without knowing each SKU's true profitability, resource waste is inevitable.",
  "Çatı areaı ve yük hesabı yapılmadan material siparişi ve statik analysis hatalı olur.":"Without calculating roof area and load, material orders and structural analysis will be incorrect.",
  "İskele leasing süresi ve areaı optimize edilmezse gereksiz rent, işçilik ve nakliye cost oluşur.":"If scaffold rental duration and area are not optimized, unnecessary rent, labor, and transportation costs occur.",
  "Dikiş hattında SMV dağılımı dengelenmezse hat verimliliği düşer, WIP birikir ve teslimat gecikir.":"If SMV distribution is not balanced on the sewing line, line efficiency drops, WIP accumulates, and delivery is delayed.",
  "Taşeron teklif marginı ile gerçekleşen margin arasındaki fark control edilmezse project kârlılığı sessizce erir.":"If the difference between quoted subcontractor margin and actual margin is not monitored, project profitability silently erodes.",
  "Yabancı para supplyçilerinde kur dalgalanması cost hesaplanmazsa beklenmedik zararlar oluşur.":"If the cost of exchange rate fluctuations is not calculated for foreign currency suppliers, unexpected losses occur.",
  "Yenilenebilir energy yatırımlarında IRR, NPV ve LCOE hesaplanmazsa yatırımın gerçek getirisi ve fizibilitesi bilinemez. Yanlış kararlar büyük sermaye kaybına yol açar.":"Without calculating IRR, NPV, and LCOE for renewable energy investments, the true return and feasibility remain unknown. Wrong decisions lead to significant capital loss.",
};

// title_i18n.en: Turkish→English
const TITLE = {
  "Ürün Karmaşıklığı Gizli Cost Report":"Product Complexity Hidden Cost Report",
};

const batchD = [
  "portion-cost-analyzer.ts","price-elasticity-analyzer.ts",
  "product-complexity-hidden-cost-analyzer.ts","recurring-cost-analyzer.ts",
  "recipe-cost-check-analyzer.ts","renewable-energy-irr-analyzer.ts",
  "renovation-budget-optimizer-analyzer.ts","repair-shop-quote-analyzer.ts",
  "restaurant-menu-margin-leak-analyzer.ts","robot-vs-manual-analyzer.ts",
  "roi-npv-analyzer.ts","roof-area-load-analyzer.ts",
  "route-cost-analyzer.ts","route-optimization-analyzer.ts",
  "saas-shelfware-analyzer.ts","sample-size-industrial-analyzer.ts",
  "scaffold-rental-cost-analyzer.ts","seed-rate-analyzer.ts",
  "sewing-line-balance-analyzer-pro.ts","shift-cost-efficiency-analyzer.ts",
  "shop-hourly-rate-analyzer.ts","spc-limit-control-analyzer.ts",
  "spc-signal-delay-analyzer.ts","steam-trap-energy-loss-analyzer.ts",
  "subcontractor-margin-leak-analyzer.ts","supplier-currency-risk-analyzer.ts",
  "supplier-performance-tco-analyzer.ts","supply-chain-disruption-analyzer.ts",
  "taguchi-quality-loss-analyzer.ts","takt-time-flexibility-analyzer.ts",
];

let totalChanges = 0, fileCount = 0;

for (const fn of batchD) {
  const fp = D + "/" + fn;
  let content = readFileSync(fp, "utf-8");
  let changes = 0;

  // 1. Fix label_i18n.en (Turkish→English) where en===tr
  for (const [tr, en] of Object.entries(LABEL)) {
    const oldP = `"en":"${tr}","tr":"${tr}"`;
    const newP = `"en":"${en}","tr":"${tr}"`;
    if (content.includes(oldP)) {
      content = content.replace(oldP, newP);
      changes++;
    }
  }

  // 2. Fix expertMeaning_i18n.tr (English→Turkish) where tr is English
  for (const [en, tr] of Object.entries(EXPERT)) {
    const oldP = `"en":"${en}","tr":"${en}"`;
    const newP = `"en":"${en}","tr":"${tr}"`;
    if (content.includes(oldP)) {
      content = content.replace(oldP, newP);
      changes++;
    }
  }

  // 3. Fix painStatement_i18n.en (Turkish→English) where en===tr
  for (const [tr, en] of Object.entries(PAIN)) {
    const oldP = `"en":"${tr}","tr":"${tr}"`;
    const newP = `"en":"${en}","tr":"${tr}"`;
    if (content.includes(oldP)) {
      content = content.replace(oldP, newP);
      changes++;
    }
  }

  // 4. Fix title_i18n.en (Turkish→English) where en===tr
  for (const [tr, en] of Object.entries(TITLE)) {
    const oldP = `"en":"${tr}","tr":"${tr}"`;
    const newP = `"en":"${en}","tr":"${tr}"`;
    if (content.includes(oldP)) {
      content = content.replace(oldP, newP);
      changes++;
    }
  }

  if (changes > 0) {
    writeFileSync(fp, content, "utf-8");
    totalChanges += changes;
    fileCount++;
    console.log(`  ✓ ${fn}: ${changes} changes`);
  } else if (false) {
    // silent for files with no changes
  }
}

console.log(`\nDone. ${fileCount} files modified, ${totalChanges} total changes.`);
