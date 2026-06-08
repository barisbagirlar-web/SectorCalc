#!/usr/bin/env npx tsx
import {
  formatProductionReadinessReport,
  runProductionReadinessAudit,
} from "../src/lib/formula-governance/production-readiness/production-readiness-report";

console.log(formatProductionReadinessReport(runProductionReadinessAudit()));
process.exit(0);
