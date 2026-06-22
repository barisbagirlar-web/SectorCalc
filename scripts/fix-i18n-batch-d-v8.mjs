/**
 * fix-i18n-batch-d-v8.mjs — Complete comprehensive fix for ALL remaining inversions
 * Uses complete maps for every remaining inverted field.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const D = "/Users/macair1/projects/SectorCalc/src/lib/premium-schema/schemas";

const BATCH = [
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

// LABEL_TR: Turkish → English translation for label_i18n.en
const LABEL = {
  "Bina Çevresi":"Building Perimeter","Bina Yüksekliği":"Building Height",
  "m² Kiralama Bedeli":"Rental Rate per m²","Kiralama Süresi":"Rental Duration",
  "Montaj İşçilik (m² başına)":"Erection Labor (per m²)","Söküm İşçilik (m² başına)":"Dismantle Labor (per m²)",
  "Nakliye Maliyeti":"Transportation Cost","Süre Aşımı Maliyeti":"Overrun Cost",
  "İskele Alanı":"Scaffold Area","Kiralama Maliyeti":"Rental Cost",
  "Toplam İskele Maliyeti":"Total Scaffold Cost",
  "SMV Süreleri (virgülle ayır)":"SMV Times (comma-separated)","Planlı Duruş":"Planned Downtime",
  "Günlük Hedef Adet":"Daily Target Quantity","Hedef Verim":"Target Efficiency",
  "Toplam SMV (Tüm Operasyonlar)":"Total SMV (All Operations)","Teorik Operatör":"Theoretical Operator",
  "Gerçek Operatör":"Actual Operator","Hat Verimliliği":"Line Efficiency",
  "Teklif Edilen Tutar":"Quoted Amount","Gerçekleşen Maliyet":"Actual Cost",
  "Sözleşme Marjı":"Contract Margin","Toplam Taşeron Bütçesi":"Total Subcontractor Budget",
  "Teklif Marjı":"Quoted Margin","Gerçekleşen Marj":"Actual Margin",
  "Marj Kaçağı":"Margin Leak","Kaçak Oranı":"Leakage Rate",
  "Toplam Fatura Tutarı (Döviz)":"Total Invoice (Foreign Currency)","Güncel Kur":"Current Rate",
  "Beklenen Kur Değişimi":"Expected Rate Shift","Kur Volatilitesi":"Currency Volatility",
  "Korunma Maliyeti":"Hedging Cost","Sözleşme Klausül Tasarrufu":"Contract Clause Savings",
  "Döviz Pozisyonu":"FX Position","Beklenen Kur Zararı":"Expected FX Loss",
  "Net Risk Maliyeti":"Net Risk Cost","Klausül Tasarrufu":"Clause Savings",
  "Value at Risk (VAR)":"Value at Risk (VAR)",
};

// EXPERT_TR: English → Turkish for expertMeaning_i18n.tr
const EXPERT = {
  "Building perimeter":"Bina çevresi","Building height":"Bina yüksekliği",
  "Monthly rental rate per m²":"Aylık m² kiralama bedeli","Rental duration":"Kiralama süresi",
  "Erection labor rate per m²":"m² başına montaj işçilik","Dismantle labor rate per m²":"m² başına söküm işçilik",
  "Transport cost":"Nakliye maliyeti","Overrun extension cost":"Süre aşımı maliyeti",
  "Array of SMV times per operation":"Operasyon başına SMV süreleri",
  "Available shift minutes":"Kullanılabilir vardiya dakikası","Planned breaks & meetings":"Planlı molalar ve toplantılar",
  "Daily production target":"Günlük üretim hedefi","Number of operators":"Operatör sayısı",
  "Defect rate":"Hata oranı","Sum of all SMV times":"Tüm SMV sürelerinin toplamı",
  "Quoted subcontractor amount":"Teklif edilen taşeron tutarı",
  "Actual subcontractor cost":"Gerçekleşen taşeron maliyeti",
  "Contractual margin percentage":"Sözleşmeye bağlı marj yüzdesi",
  "Total subcontractor budget":"Toplam taşeron bütçesi",
  "Total invoice in foreign currency":"Yabancı para toplam fatura",
  "Current exchange rate":"Güncel döviz kuru","Expected exchange rate shift":"Beklenen kur değişimi",
  "Currency volatility rate":"Kur volatilite oranı","Cost of hedging":"Korunma maliyeti",
  "Savings from FX clauses":"Döviz klausül tasarrufu",
  "Lower specification limit":"Alt spesifikasyon limiti",
  "Upper specification limit":"Üst spesifikasyon limiti",
};

let totalChanges = 0;

for (const fn of BATCH) {
  const fp = join(D, fn);
  let content = readFileSync(fp, "utf-8");
  const orig = content;
  let changes = 0;

  // Fix label_i18n where en===tr (both Turkish)
  const labelRe = /label_i18n:\s*\{\s*"en":"([^"]*)","tr":"([^"]*)"\s*\}/g;
  let m;
  while ((m = labelRe.exec(content)) !== null) {
    if (m[1] === m[2] && LABEL[m[1]]) {
      const oldStr = `"en":"${m[1]}","tr":"${m[2]}"`;
      const newStr = `"en":"${LABEL[m[1]]}","tr":"${m[2]}"`;
      if (content.includes(oldStr)) {
        content = content.replace(oldStr, newStr);
        changes++;
        // Reset regex state since content changed
        labelRe.lastIndex = 0;
      }
    }
  }

  // Fix expertMeaning_i18n where en===tr (both English)
  const expRe = /expertMeaning_i18n:\s*\{\s*"en":"([^"]*)","tr":"([^"]*)"\s*\}/g;
  while ((m = expRe.exec(content)) !== null) {
    if (m[1] === m[2] && EXPERT[m[1]]) {
      const oldStr = `"en":"${m[1]}","tr":"${m[2]}"`;
      const newStr = `"en":"${m[1]}","tr":"${EXPERT[m[1]]}"`;
      if (content.includes(oldStr)) {
        content = content.replace(oldStr, newStr);
        changes++;
        expRe.lastIndex = 0;
      }
    }
  }

  if (content !== orig) {
    writeFileSync(fp, content, "utf-8");
    totalChanges += changes;
    console.log(`  ✓ ${fn}: ${changes} changes`);
  } else {
    console.log(`  - ${fn}: no changes`);
  }
}

console.log(`\nDone. ${totalChanges} total changes.`);
