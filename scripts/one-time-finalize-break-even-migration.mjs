#!/usr/bin/env node

import { existsSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const ciPath = resolve(root, ".github/workflows/ci.yml");

const cleanCi = `name: CI

on:
  push:
    branches: [main, "feature/*"]
  pull_request:
    branches: [main]

jobs:
  industrial-pipeline:
    runs-on: ubuntu-24.04
    timeout-minutes: 60
    env:
      NEXT_PUBLIC_SITE_URL: https://sectorcalc.com
      NODE_OPTIONS: --max-old-space-size=8192

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install locked dependencies
        run: npm ci --no-audit --no-fund

      - name: V5.3.1 form architecture lock
        run: npm run guard:v531-form-architecture

      - name: Schema and formula binding lock
        run: npm run guard:v531-schema-formula-binding

      - name: PRO V2 cross-tool and report isolation
        run: npm run guard:pro-v2-all-extended

      - name: PRO catalog contract
        run: npm run guard:pro-tools-catalog

      - name: PRO result rendering contract
        run: npm run guard:pro-result-render-contract

      - name: PRO runtime registry import lock
        run: npm run guard:baris-v531-runtime-registration

      - name: Universal form state-machine tests
        run: npm run test:v5-form

      - name: Runtime decision and normalization tests
        run: npm run test:v5-runtime

      - name: Break-even domain contract tests
        run: >-
          npx vitest run
          src/sectorcalc/formulas/pro-v531/__tests__/break-even-survival-cash-calculator.test.ts
          src/sectorcalc/formulas/pro-v531/__tests__/baris-formula-registry-break-even.test.ts
          src/sectorcalc/formulas/pro-v531/__tests__/break-even-contract-isolation.test.ts
          src/sectorcalc/pro-form/__tests__/form-state-machine-unit-init.test.ts
          src/sectorcalc/pro-report/__tests__/pro-report-break-even.test.ts
          src/sectorcalc/pro-runtime/__tests__/decision-engine-formula-status.test.ts

      - name: TypeScript contract check
        run: npm run typecheck

      - name: Lint errors only
        run: npm run lint:errors

      - name: V5.3.1 form UX static smoke
        run: npm run smoke:v531-form-ux

      - name: Stale result DOM guard
        run: npm run guard:pro-no-stale-dom

      - name: Production build
        run: npm run build

      - name: Root-only routing guard
        run: npm run guard:root-only
`;

writeFileSync(ciPath, cleanCi, "utf8");

const removePaths = [
  "scripts/one-time-fix-break-even-cross-wire.mjs",
  "scripts/one-time-fix-break-even-test-contracts.mjs",
  "scripts/one-time-restore-form-state-audit-export.mjs",
  "scripts/one-time-harden-v531-form-ux.mjs",
  "scripts/one-time-enable-diagnostic-profile.mjs",
  "scripts/one-time-finalize-break-even-migration.mjs",
  ".github/workflows/apply-break-even-cross-wire-fix.yml",
  ".github/workflows/finalize-break-even-migration.yml",
  ".cross-wire-migration-error.txt",
  ".pro-v2-contract-error.txt",
  ".v5-form-test-error.txt",
  ".typecheck-error.txt",
  ".v531-form-ux-error.txt",
];

for (const relativePath of removePaths) {
  const absolutePath = resolve(root, relativePath);
  if (existsSync(absolutePath)) rmSync(absolutePath);
}

console.log("BREAK_EVEN_MIGRATION_FINALIZED=YES");
