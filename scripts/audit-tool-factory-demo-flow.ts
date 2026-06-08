#!/usr/bin/env npx tsx
import {
  formatToolFactoryDemoFlowReport,
  runToolFactoryDemoFlowAudit,
} from "../src/lib/formula-governance/tool-factory-orchestrator/demo-flow/demo-flow-audit";

console.log(formatToolFactoryDemoFlowReport(runToolFactoryDemoFlowAudit()));
process.exit(0);
