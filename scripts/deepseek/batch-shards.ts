import fs from "node:fs";
import path from "node:path";
import { resolveShardCount } from "./deepseek-key-pool";
import { PROJECT_ROOT } from "./load-env";

export type ShardRange = {
  readonly id: number;
  readonly start: number;
  readonly end: number;
  readonly screen: string;
  readonly log: string;
};

/** Aktif shard sayısı = key pool boyutu (varsayılan 10) */
export function getBatchShardCount(): number {
  return resolveShardCount();
}

/** @deprecated use getBatchShardCount() */
export const BATCH_SHARD_COUNT = getBatchShardCount();

export function buildShardRanges(total: number, count: number): ShardRange[] {
  const base = Math.floor(total / count);
  const extra = total % count;
  const ranges: ShardRange[] = [];
  let cursor = 0;

  for (let i = 0; i < count; i += 1) {
    const size = base + (i < extra ? 1 : 0);
    const start = cursor;
    const end = cursor + size;
    const id = i + 1;
    ranges.push({
      id,
      start,
      end,
      screen: `batch-${id}`,
      log: `/tmp/batch-${id}.log`,
    });
    cursor = end;
  }

  return ranges;
}

export function parseFullList(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[•\-*0-9]/.test(l) && !l.includes("(") && !l.includes(")"))
    .map((l) => l.replace(/\([^)]*\)/g, "").replace(/^[•\-*\d.]+/, "").trim())
    .filter((l) => l.length > 3);
}

export function shardProgressPath(start: number, end: number): string {
  return path.join(PROJECT_ROOT, `.batch-progress-${start}-${end}.json`);
}
