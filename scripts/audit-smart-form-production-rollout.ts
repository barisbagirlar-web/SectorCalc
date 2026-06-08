#!/usr/bin/env npx tsx
import {
  formatProductionRolloutGovernanceReport,
  runProductionRolloutGovernanceAudit,
} from "../src/components/tools/smart-form/production-rollout-governance/production-rollout-audit";

console.log(formatProductionRolloutGovernanceReport(runProductionRolloutGovernanceAudit()));
process.exit(0);
