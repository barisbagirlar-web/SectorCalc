#!/usr/bin/env npx tsx
/**
 * SectorCalc Formula Governance — smart form architecture plan CLI (Phase 5H-G-A).
 * Read-only report; exit code 0; no file writes; no production calculator execution.
 */

import {
  buildBatchSmartFormArchitecturePlan,
  formatSmartFormArchitectureReport,
} from "../src/lib/formula-governance/input-design-audit/smart-form-architecture/smart-form-architecture-builder";
import { SMART_FORM_ARCHITECTURE_SOURCE_SLUGS } from "../src/lib/formula-governance/input-design-audit/smart-form-architecture/smart-form-architecture-status";

const jsonExport = process.argv.includes("--json");

const plan = buildBatchSmartFormArchitecturePlan(SMART_FORM_ARCHITECTURE_SOURCE_SLUGS);

console.log(formatSmartFormArchitectureReport(plan));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(plan, null, 2));
}

process.exit(0);
