#!/usr/bin/env node
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const API_SERVER_DIR = join(ROOT, ".next/server/app/api");

function listRouteJsFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listRouteJsFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name === "route.js") {
      files.push(fullPath);
    }
  }
  return files;
}

for (const routeJsPath of listRouteJsFiles(API_SERVER_DIR)) {
  const nftPath = `${routeJsPath}.nft.json`;
  if (!existsSync(nftPath)) {
    writeFileSync(nftPath, JSON.stringify({ version: 1, files: [] }), "utf8");
  }
}
