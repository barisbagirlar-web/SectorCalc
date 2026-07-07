// Prebuild stub for Next.js 15.x Cloud Build compatibility.
// Next.js 15.x expects pages-manifest.json and next-font-manifest.json
// after compilation even for App Router-only projects.
// These stubs prevent build failures in Firebase Cloud Build.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const serverDir = join(process.cwd(), ".next", "server");

if (!existsSync(serverDir)) {
  mkdirSync(serverDir, { recursive: true });
}

const stubs = [
  ["pages-manifest.json", JSON.stringify({})],
  ["next-font-manifest.json", JSON.stringify({})],
  ["middleware-manifest.json", JSON.stringify({})],
  ["app-build-manifest.json", JSON.stringify({ version: 1, pages: {} })],
  ["build-manifest.json", JSON.stringify({ 
    pages: { "/_app": [] }, 
    devFiles: [], 
    ampDevFiles: [],
    polyfillFiles: [], 
    lowPriorityFiles: [], 
    rootMainFiles: [] 
  })],
];

for (const [name, content] of stubs) {
  const filePath = join(serverDir, name);
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content, "utf8");
  }
}
