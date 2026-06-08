#!/usr/bin/env npx tsx
import {
  formatRoadmapDebtReport,
  runRoadmapDebtAudit,
} from "../src/lib/formula-governance/roadmap-debt-register/roadmap-debt-audit";

console.log(formatRoadmapDebtReport(runRoadmapDebtAudit()));
process.exit(0);
