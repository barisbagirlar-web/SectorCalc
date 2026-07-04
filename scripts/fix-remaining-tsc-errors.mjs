#!/usr/bin/env node
/**
 * Fix remaining 6 TSC errors v2 - use formula output keys, not input.xxx
 */
import { readFileSync, writeFileSync } from "node:fs";

const FIXES = {
  "tool-amortismani": {
    "DB_Year_t": "BookValue_ * (t - 1) * DB_Rate",
  },
  "teklif-risk-analizoru": {
    "WinProbability": "BidPrice / (BidPrice + CompetitorIndex + HistoricalWinRate)",
  },
  "tohum-ratio": {
    "OptimalYield": "PlantPopulation * (0.3 * SoilFertility / 100 + 0.7) * (0.8 + 0.2 * Water / 100)",
  },
  "wps-preheat-temperature": {
    "PreheatTemp": "CarbonEquivalent_CE * 200 + Thickness * 5 + HydrogenLevel * 30 - HeatInput * 10",
  },
  "beam-weight": {
    "Area_Cross": "Size * 0.1",
  },
};

for (const [slug, formulas] of Object.entries(FIXES)) {
  const filePath = `generated/schemas/${slug}-schema.json`;
  const data = JSON.parse(readFileSync(filePath, "utf-8"));
  let changed = 0;
  for (const [key, expr] of Object.entries(formulas)) {
    if (data.formulas[key] !== undefined && data.formulas[key] !== expr) {
      console.log(`  FIX ${slug}/${key}: "${data.formulas[key].slice(0, 60)}" → "${expr.slice(0, 60)}"`);
      data.formulas[key] = expr;
      changed++;
    } else if (data.formulas[key] === undefined) {
      console.log(`  WARN ${slug}/${key}: formula key not found`);
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
