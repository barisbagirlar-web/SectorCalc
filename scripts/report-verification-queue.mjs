#!/usr/bin/env node
/**
 * Weekly verification queue summary (manual / CI).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "scripts/.cache/verification-queue-report.json");

const summary = {
  generatedAt: new Date().toISOString(),
  note: "Firestore read requires admin credentials in deploy environment.",
  openCount: null,
  topTools: [],
  issueTypeDistribution: {},
};

mkdirSync(join(ROOT, "scripts/.cache"), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(`report:verification-queue → ${OUT}`);
