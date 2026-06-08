#!/usr/bin/env npx tsx
/**
 * Global calculator inventory CLI — read-only report.
 */

import {
  formatGlobalCalculatorInventoryReport,
  runGlobalCalculatorInventoryAudit,
} from "../src/lib/formula-governance/global-calculator-inventory/global-calculator-inventory-audit";

const jsonExport = process.argv.includes("--json");
const result = runGlobalCalculatorInventoryAudit();

console.log(formatGlobalCalculatorInventoryReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(result, null, 2));
}

process.exit(0);
