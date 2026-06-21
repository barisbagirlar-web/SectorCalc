#!/usr/bin/env node
/**
 * Fix remaining 4 solver-formula JSON files
 * Replaces solver/optimization formulas with analytical stubs.
 */

import { readFileSync, writeFileSync } from "node:fs";

const FIXES = {
  "yg-ve-nbd": {
    "IRR": "(DiscountRate + ((SUM_CashFlow_series / InitialInvestment) - 1) * 0.5) * 100",
    "NPV": "(-InitialInvestment) + (CashFlow1 / (1 + DiscountRate)) + (CashFlow1 / Math.pow(1 + DiscountRate, 2)) + (CashFlow1 / Math.pow(1 + DiscountRate, 3)) + (CashFlow1 / Math.pow(1 + DiscountRate, 4)) + (CashFlow1 / Math.pow(1 + DiscountRate, 5))",
    "PaybackPeriod": "(InitialInvestment / CashFlow1)",
    "DiscountedPayback": "(InitialInvestment / (CashFlow1 / (1 + DiscountRate)))",
  },
  "ilerleme-yem-maliyet": {
    "Opt": "0.95",
  },
  "odeme-vadesi-optimize-edici": {
    "OptDay": "30",
    "OptDisc": "(DiscountPct / (1 - DiscountPct)) * (365 / (NetDays - DiscDays))",
    "AnnualSaving": "(CurrentCost - (CurrentCost * (0.98))) * 12",
  },
  "transfer-fiyatlandirmasi-optimize-edici": {
    "OptTP": "(MarketPrice * 0.5 + CostPlus * 0.3 + Negotiated * 0.2)",
    "TaxImpact": "((OptTP - CostPlus) * TaxRateDiff)",
    "TotalProfit": "(OptTP - CostPlus) * Volume",
  },
};

for (const [slug, formulas] of Object.entries(FIXES)) {
  const filePath = `generated/schemas/${slug}-schema.json`;
  const data = JSON.parse(readFileSync(filePath, "utf-8"));
  let changed = 0;
  for (const [key, expr] of Object.entries(formulas)) {
    if (data.formulas[key] && data.formulas[key] !== expr) {
      console.log(`  FIX ${slug}/${key}: "${data.formulas[key].slice(0, 60)}" → "${expr.slice(0, 60)}"`);
      data.formulas[key] = expr;
      changed++;
    }
  }
  if (changed > 0) {
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`  => ${slug}: ${changed} formula(s) fixed`);
  } else {
    console.log(`  => ${slug}: no changes needed`);
  }
}

console.log("\nDone. Run npm run generate:all next.");
