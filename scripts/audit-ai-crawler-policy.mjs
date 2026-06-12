#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
let failures = 0;
let passes = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

const robots = readFileSync(join(ROOT, "src/app/robots.ts"), "utf8");
const aiFiles = [
  "/llms.txt",
  "/ai.txt",
  "/ai-tool-index.json",
  "/ai-tool-index.txt",
  "/ai-categories.json",
  "/ai-tool-routes.json",
  "/ai-search-manifest.json",
  "/ai-embedding-source.jsonl",
  "/sectorcalc-index.txt",
  "/services-products.txt",
  "/faq-knowledge.txt",
  "/sitemap.xml",
];

for (const file of aiFiles) {
  if (robots.includes(file)) pass(`robots allows ${file}`);
  else fail(`robots missing allow for ${file}`);
}

for (const file of aiFiles) {
  if (new RegExp(`Disallow:\\s*["']${file.replace(/\./g, "\\.")}`).test(robots)) {
    fail(`robots disallows ${file}`);
  }
}

for (const agent of [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
]) {
  if (robots.includes(agent)) pass(`robots policy includes ${agent}`);
  else fail(`robots missing ${agent}`);
}

for (const path of ["/api/", "/admin/", "/checkout/", "/account/", "/login/", "/signup/"]) {
  if (robots.includes(path)) pass(`robots disallows private path ${path}`);
  else fail(`robots missing private disallow ${path}`);
}

console.log(`\naudit:ai-crawler-policy — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
