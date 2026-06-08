#!/usr/bin/env npx tsx
import {
  formatFixtureExpansionReport,
  runFixtureExpansionAudit,
} from "../src/lib/formula-governance/calculation-ontology/fixture-expansion/fixture-expansion-audit";

console.log(formatFixtureExpansionReport(runFixtureExpansionAudit()));
process.exit(0);
