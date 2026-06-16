import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildShardRanges,
  getBatchShardCount,
  parseFullList,
  shardProgressPath,
} from "./batch-shards";
import { PROJECT_ROOT } from "./load-env";

type ProgressState = { completed: string[]; failed: string[] };

function loadAllLegacyProgress(): ProgressState {
  const merged: ProgressState = { completed: [], failed: [] };
  const files = fs.readdirSync(PROJECT_ROOT).filter(
    (f) =>
      f.startsWith(".batch-progress-") &&
      f.endsWith(".json") &&
      !f.includes("backup"),
  );

  for (const file of files) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, file), "utf-8")) as ProgressState;
      for (const name of raw.completed ?? []) {
        if (!merged.completed.includes(name)) merged.completed.push(name);
      }
      for (const name of raw.failed ?? []) {
        if (!merged.failed.includes(name) && !merged.completed.includes(name)) {
          merged.failed.push(name);
        }
      }
    } catch {
      // skip corrupt
    }
  }
  return merged;
}

/** 3→6 shard geçişinde tamamlanan/başarısız araçları yeni parçalara dağıt. */
export function migrateProgressToShards(totalTools: number, shardCount: number): void {
  const listFile = path.join(PROJECT_ROOT, "input_calculators.txt");
  const allTools = parseFullList(listFile);
  const global = loadAllLegacyProgress();
  const ranges = buildShardRanges(totalTools, shardCount);

  for (const shard of ranges) {
    const slice = allTools.slice(shard.start, shard.end);
    const sliceSet = new Set(slice);
    const completed = global.completed.filter((t) => sliceSet.has(t));
    const failed = global.failed.filter((t) => sliceSet.has(t) && !completed.includes(t));
    const out = shardProgressPath(shard.start, shard.end);
    fs.writeFileSync(out, JSON.stringify({ completed, failed }, null, 2));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const listFile = path.join(PROJECT_ROOT, "input_calculators.txt");
  const total = parseFullList(listFile).length;
  migrateProgressToShards(total, getBatchShardCount());
  console.log(`✅ Progress ${getBatchShardCount()} shard'a migrate edildi (${total} araç).`);
}
