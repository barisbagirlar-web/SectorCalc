#!/usr/bin/env npx tsx
import {
  formatSmartFormRolloutExpansionReport,
  runSmartFormRolloutExpansionAudit,
} from "../src/components/tools/smart-form/rollout-expansion/smart-form-rollout-batch-audit";

console.log(formatSmartFormRolloutExpansionReport(runSmartFormRolloutExpansionAudit()));
process.exit(0);
