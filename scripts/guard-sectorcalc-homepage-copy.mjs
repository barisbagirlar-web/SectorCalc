#!/usr/bin/env node
/**
 * guard-sectorcalc-homepage-copy.mjs
 *
 * Fails if:
 * - homepage still contains "16 standards-backed models"
 * - homepage or footer contains "audit-proof"
 * - homepage or footer contains "engineering authority"
 * - homepage or footer contains "certified compliance"
 * - homepage does not mention Free Tools
 * - homepage does not mention Pro Tools
 * - homepage does not mention Engineering Diagnostics
 * - homepage does not mention Case Studies
 * - homepage does not mention FMEA RPN
 * - homepage lacks /free-tools CTA
 * - homepage lacks /pro-tools CTA
 * - homepage lacks /engineering-diagnostics CTA
 * - homepage lacks /case-studies CTA
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const files = [
  resolve(root, "src/components/landing/LandingPageContent.tsx"),
  resolve(root, "src/components/layout/EnterpriseFooter.tsx"),
];

let errors = [];

for (const f of files) {
  let content;
  try {
    content = readFileSync(f, "utf8");
  } catch {
    errors.push(`FILE_NOT_FOUND: ${f}`);
    continue;
  }

  if (content.includes("16 standards-backed models")) {
    errors.push(`FORBIDDEN_PHRASE: "16 standards-backed models" in ${f}`);
  }

  if (content.includes("audit-proof")) {
    errors.push(`FORBIDDEN_PHRASE: "audit-proof" in ${f}`);
  }

  if (content.includes("engineering authority")) {
    errors.push(`FORBIDDEN_PHRASE: "engineering authority" in ${f}`);
  }

  if (content.includes("certified compliance")) {
    errors.push(`FORBIDDEN_PHRASE: "certified compliance" in ${f}`);
  }
}

// Homepage specific checks
const homepage = resolve(root, "src/components/landing/LandingPageContent.tsx");
let hpContent;
try {
  hpContent = readFileSync(homepage, "utf8");
} catch {
  errors.push("FILE_NOT_FOUND: homepage component");
}

if (hpContent) {
  const checks = [
    { label: "Free Tools", pattern: "Free Tools" },
    { label: "Pro Tools", pattern: "Pro Tools" },
    { label: "Engineering Diagnostics", pattern: "Engineering Diagnostics" },
    { label: "Case Studies", pattern: "Case Studies" },
    { label: "FMEA RPN", pattern: "FMEA RPN" },
    { label: "/free-tools CTA", pattern: '/free-tools"' },
    { label: "/pro-tools CTA", pattern: '/pro-tools"' },
    { label: "/engineering-diagnostics CTA", pattern: '/engineering-diagnostics"' },
    { label: "/case-studies CTA", pattern: '/case-studies"' },
  ];

  for (const c of checks) {
    if (!hpContent.includes(c.pattern)) {
      errors.push(`MISSING: "${c.label}" not found in homepage`);
    }
  }
}

if (errors.length > 0) {
  console.error("HOMEPAGE COPY GUARD FAILED:");
  for (const e of errors) {
    console.error(`  ❌ ${e}`);
  }
  process.exit(1);
} else {
  console.log("✅ HOMEPAGE COPY GUARD PASSED");
}
