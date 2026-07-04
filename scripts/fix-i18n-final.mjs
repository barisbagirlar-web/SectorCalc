/**
 * fix-i18n-final.mjs — Fix the last 10 remaining expertMeaning_i18n issues
 */
import { readFileSync, writeFileSync } from "fs";

const D = "/Users/macair1/projects/SectorCalc/src/lib/premium-schema/schemas";
const FIXES = {
  "scaffold-rental-cost-analyzer.ts": [
    [`"en":"Monthly rental rate per m²","tr":"Monthly rental rate per m²"`, `"en":"Monthly rental rate per m²","tr":"Aylık m² leasing bedeli"`],
    [`"en":"Transport cost","tr":"Transport cost"`, `"en":"Transport cost","tr":"Nakliye cost"`],
  ],
  "sewing-line-balance-analyzer-pro.ts": [
    [`"en":"Available shift minutes","tr":"Available shift minutes"`, `"en":"Available shift minutes","tr":"Useılabilir vardiya dakikası"`],
    [`"en":"Number of operators","tr":"Number of operators"`, `"en":"Number of operators","tr":"Operatör sayısı"`],
    [`"en":"Defect rate","tr":"Defect rate"`, `"en":"Defect rate","tr":"Error ratioı"`],
  ],
  "subcontractor-margin-leak-analyzer.ts": [
    [`"en":"Quoted subcontractor amount","tr":"Quoted subcontractor amount"`, `"en":"Quoted subcontractor amount","tr":"Teklif edilen taşeron tutarı"`],
  ],
  "supplier-currency-risk-analyzer.ts": [
    [`"en":"Currency volatility rate","tr":"Currency volatility rate"`, `"en":"Currency volatility rate","tr":"Kur volatility ratioı"`],
    [`"en":"Cost of hedging","tr":"Cost of hedging"`, `"en":"Cost of hedging","tr":"Korunma cost"`],
  ],
  "taguchi-quality-loss-analyzer.ts": [
    [`"en":"Lower specification limit","tr":"Lower specification limit"`, `"en":"Lower specification limit","tr":"Alt spesifikasyon limiti"`],
    [`"en":"Upper specification limit","tr":"Upper specification limit"`, `"en":"Upper specification limit","tr":"Üst spesifikasyon limiti"`],
  ],
};

let total = 0;
for (const [fn, fixes] of Object.entries(FIXES)) {
  const fp = D + "/" + fn;
  let content = readFileSync(fp, "utf-8");
  let ch = 0;
  for (const [oldStr, newStr] of fixes) {
    if (content.includes(oldStr) && !content.includes(newStr)) {
      content = content.replace(oldStr, newStr);
      ch++;
    }
  }
  if (ch > 0) {
    writeFileSync(fp, content, "utf-8");
    total += ch;
    console.log(`  ✓ ${fn}: ${ch} changes`);
  } else {
    console.log(`  - ${fn}: no changes`);
  }
}
console.log(`\nTotal: ${total} changes`);
