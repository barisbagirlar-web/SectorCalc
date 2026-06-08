#!/usr/bin/env npx tsx
/**
 * Remediation batch 1 audit CLI — Phase 5I-D (read-only).
 */

import {
  formatRemediationBatch1Report,
  runRemediationBatch1Audit,
} from "../src/lib/formula-governance/full-tool-audit/remediation/remediation-audit";

const batch = runRemediationBatch1Audit();
console.log(formatRemediationBatch1Report(batch));
process.exit(0);
