#!/usr/bin/env node
/**
 * P25 — patch TR calculator surface glossary + revenue free-tool input labels.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const glossaryPath = join(ROOT, "src/data/calculator-phrase-glossary.json");
const messagesPath = (locale) => join(ROOT, "messages", `${locale}.json`);

// TR_GLOSSARY_PATCH removed — Turkish content has been cleaned

// REVENUE_TR_INPUTS removed — Turkish content has been cleaned

console.log("patch-calculator-surface-p25: TR content removed — script preserves other locales");
