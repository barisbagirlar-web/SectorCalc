/**
 * DeepSeek API key pool — .env.batch.keys.local (gitignore).
 */
import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./load-env";

export const BATCH_KEYS_FILE = path.join(PROJECT_ROOT, ".env.batch.keys.local");

export type BatchKeysConfig = {
  keys: string[];
  shardCount: number | null;
};

export function parseBatchKeysFile(): BatchKeysConfig {
  const keys: string[] = [];
  let shardCount: number | null = null;

  if (!fs.existsSync(BATCH_KEYS_FILE)) {
    return { keys, shardCount };
  }

  for (const line of fs.readFileSync(BATCH_KEYS_FILE, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const name = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (name === "BATCH_SHARD_COUNT") {
      const n = Number(value);
      if (Number.isFinite(n) && n > 0) shardCount = n;
    } else if (value.startsWith("sk-")) {
      keys.push(value);
    }
  }

  return { keys, shardCount };
}

export function loadBatchKeyPool(): string[] {
  return parseBatchKeysFile().keys;
}

export function resolveShardCount(): number {
  const fromEnv = Number(process.env.BATCH_SHARD_COUNT ?? 0);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;

  const { keys, shardCount } = parseBatchKeysFile();
  if (shardCount !== null) return shardCount;
  if (keys.length > 0) return keys.length;
  return 6;
}

export function getBatchKeyForShard(shardId: number): string {
  const pool = loadBatchKeyPool();
  const index = shardId - 1;
  if (index < 0 || index >= pool.length) {
    throw new Error(`BATCH_KEY_${shardId} missing (pool size: ${pool.length})`);
  }
  return pool[index];
}

export function resolveDeepSeekApiKey(shardId?: number): string | undefined {
  const direct = process.env.DEEPSEEK_API_KEY?.trim();
  if (direct) return direct;
  const pool = loadBatchKeyPool();
  if (pool.length === 0) return undefined;
  if (shardId !== undefined && shardId >= 1 && shardId <= pool.length) {
    return pool[shardId - 1];
  }
  const idx = Number(process.env.DEEPSEEK_KEY_INDEX ?? 0) % pool.length;
  return pool[idx];
}
