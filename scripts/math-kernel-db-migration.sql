-- ═══════════════════════════════════════════════════════════════════════════
-- SectorCalc Math Kernel — Database Migration Script
-- ═══════════════════════════════════════════════════════════════════════════
--
-- This migration adds the ulp_error_margin column to Firestore calculation
-- result documents. For Firestore native mode, this is done via schema
-- enforcement in the application layer, not raw SQL.
--
-- However, this file documents the expected schema contract.
--
-- ═══════════════════════════════════════════════════════════════════════════

/*

SCHEMA CONTRACT: Calculation Result Document

Every calculation result stored in Firestore MUST include:

{
  // ... existing fields ...
  
  "ulp_error_margin": <number>,       // NEVER NULL. Must be >= 0.
  "lower_bound": <number>,             // REQUIRED. Guaranteed minimum.
  "upper_bound": <number>,             // REQUIRED. Guaranteed maximum.
  "interval_status": <string>,        // "VERIFIED" | "WIDE_INTERVAL" | "ERROR: ..."
  
  "schema_version": "math-kernel-v1"  // Migration version marker
}

ENFORCEMENT:

1. Application layer (TypeScript):
   - src/lib/core/math/bounded-result-types.ts defines the BoundedMetric contract
   - Every result must include lower_bound, upper_bound, ulp_error_margin
   - ulp_error_margin must be >= 0 (enforced by type system)

2. Firestore rules:
   - See firestore.rules for the write validation rule

3. CI/CD gate:
   - npm run guard:math-kernel-schema verifies the contract at build time

*/

-- Example Firestore rule (applied in firestore.rules):
--   match /calculations/{docId} {
--     allow write: if request.resource.data.keys().hasAll(['ulp_error_margin', 'lower_bound', 'upper_bound']);
--     allow write: if request.resource.data.ulp_error_margin is number && request.resource.data.ulp_error_margin >= 0;
--   }
