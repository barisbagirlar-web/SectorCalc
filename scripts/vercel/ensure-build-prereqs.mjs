#!/usr/bin/env node
/**
 * Vercel / CI build gate — ensures clean-slate clones have required dirs
 * before test:generated and next build (generated/ is gitignored).
 */
import * as fs from "node:fs";
import * as path from "node:path";

const root = process.cwd();
const generatedDir = path.join(root, "generated");
const schemasDir = path.join(generatedDir, "schemas");
const publicDiagramsDir = path.join(root, "public", "generated", "schemas");

for (const dir of [generatedDir, schemasDir, publicDiagramsDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

console.log("ensure-build-prereqs: generated/schemas + public/generated/schemas ready");
