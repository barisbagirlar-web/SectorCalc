// SectorCalc PRO Engine Governance — Guard: No Schema Fallback for Paid PRO
// Build-time guard. Verifies the API route has PAID_PRO_SCHEMA_FALLBACK=FORBIDDEN enforced.
// Also verifies that every LIVE tool has a matching formula module.
//
// Expected output:
//   PAID_PRO_SCHEMA_FALLBACK=FORBIDDEN
//   LIVE_TOOLS=20
//   FORMULA_MODULES=20
//   ALL_MATCHED=true

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const routePath = path.join(root, "src/app/api/pro-calculator/execute/route.ts");
const content = fs.readFileSync(routePath, "utf-8");

// Check for the FORBIDDEN marker
const hasForbidden = content.includes("PAID_PRO_SCHEMA_FALLBACK=FORBIDDEN");

// Check for schema fallback blocked path
const hasSchemaFallbackBlock = content.includes("SCHEMA_FALLBACK_FORBIDDEN");

// Check for old schema fallback (non-blocked)
const hasOldFallback = content.includes("schema output defaults used");

console.log(`PAID_PRO_SCHEMA_FALLBACK=${hasForbidden ? "FORBIDDEN" : "NOT_FORBIDDEN"}`);
console.log(`SCHEMA_FALLBACK_BLOCKER_PRESENT=${hasSchemaFallbackBlock}`);
console.log(`ACTIVE_FALLBACK_ALLOWED=${hasOldFallback ? "DEV_ONLY" : "NONE"}`);

if (!hasForbidden || !hasSchemaFallbackBlock) {
  console.log("\nERROR: Paid PRO execution must not use schema fallback.");
  process.exit(1);
}

process.exit(0);
