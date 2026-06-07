#!/usr/bin/env npx tsx
/**
 * SectorCalc Formula Governance — audit CLI.
 * Use --strict to fail on critical blockers (Phase 4 deploy gate preview).
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  formatGovernanceAuditReport,
  runGovernanceAudit,
  shouldFailStrictAudit,
} from "../src/lib/formula-governance/audit-runner";

const strict = process.argv.includes("--strict");
const report = runGovernanceAudit({ strict });
const formatted = formatGovernanceAuditReport(report);

console.log(formatted);

const cacheDir = join(process.cwd(), "scripts/.cache");
mkdirSync(cacheDir, { recursive: true });
writeFileSync(join(cacheDir, "formula-governance-audit.json"), JSON.stringify(report, null, 2));

if (strict && shouldFailStrictAudit(report)) {
  console.error("\nStrict audit failed — critical blockers remain.");
  process.exit(1);
}

process.exit(0);
