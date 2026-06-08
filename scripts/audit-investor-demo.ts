#!/usr/bin/env npx tsx
import {
  formatInvestorDemoReport,
  runInvestorDemoAudit,
} from "../src/lib/formula-governance/investor-demo/investor-demo-audit";

console.log(formatInvestorDemoReport(runInvestorDemoAudit()));
process.exit(0);
