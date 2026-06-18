#!/usr/bin/env node
import { chmodSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const BIN = join(ROOT, "bin");
const CLI = join(BIN, "lokalise2");

const ASSET =
  process.platform === "darwin" && process.arch === "arm64"
    ? "lokalise2_darwin_arm64.tar.gz"
    : process.platform === "darwin"
      ? "lokalise2_darwin_x86_64.tar.gz"
      : process.arch === "arm64"
        ? "lokalise2_linux_arm64.tar.gz"
        : "lokalise2_linux_x86_64.tar.gz";

if (existsSync(CLI)) {
  console.log(`✅ ${spawnSync(CLI, ["--version"], { encoding: "utf8" }).stdout.trim()}`);
  process.exit(0);
}

mkdirSync(BIN, { recursive: true });
const archive = join(BIN, ASSET);
const url = `https://github.com/lokalise/lokalise-cli-2-go/releases/latest/download/${ASSET}`;
spawnSync("curl", ["-sfL", url, "-o", archive], { stdio: "inherit" });
spawnSync("tar", ["xzf", archive, "-C", BIN], { stdio: "inherit" });
chmodSync(CLI, 0o755);
console.log(`✅ ${spawnSync(CLI, ["--version"], { encoding: "utf8" }).stdout.trim()}`);
