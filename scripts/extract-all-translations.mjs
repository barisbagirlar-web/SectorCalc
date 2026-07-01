#!/usr/bin/env node
import fs from "node:fs";

const SUBAGENTS_DIR =
  "/Users/macair1/.cursor/projects/Users-macair1-projects-SectorCalc-p5a/agent-transcripts/ef557e20-50e4-484e-9945-7d0e1013cbb9/subagents";

// These are the 8 batch translation subagents (batch 0-7)
const batchIds = [
  "80bac606-00ed-4edf-9da0-9d8bdc04ef18", // batch 0
  "7663a21b-693d-4b76-856f-a89c6d6a9a9a", // batch 1
  "c5feccbd-861a-4ddc-92c4-7e1f448311f2", // batch 2
  "368729b8-0748-486f-ba1e-be35dae6d953", // batch 3
  "66211302-44e4-4298-ba22-417a88212fdd", // batch 4
  "eda16a8a-bd3e-4b9d-913d-cd87aa852f69", // batch 5
  "8d45a9cc-67e9-4cd0-9164-e83e19939f87", // batch 6
  "a557e254-a2c7-4d0c-8bf4-d664cd9351ed", // batch 7
];

function extractJSON(content) {
  const lines = content.trim().split("\n");
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.role === "assistant" && entry.message?.content) {
        for (const block of entry.message.content) {
          if (block.type === "text") {
            const match = block.text.match(/```json\n([\s\S]*?)```/);
            if (match) return JSON.parse(match[1].trim());
            // Also try to find bare JSON object
            const bareMatch = block.text.match(/\{[\s\S]*"en":"[^"]*"\}/);
            if (bareMatch) {
              try { return JSON.parse(bareMatch[0]); } catch {}
            }
          }
        }
      }
    } catch {}
  }
  return {};
}

const merged = {};

for (const id of batchIds) {
  const fp = `${SUBAGENTS_DIR}/${id}.jsonl`;
  if (!fs.existsSync(fp)) {
    console.log(`MISSING: ${id}`);
    continue;
  }
  const content = fs.readFileSync(fp, "utf-8");
  const batch = extractJSON(content);
  const len = Object.keys(batch).length;
  Object.assign(merged, batch);
  console.log(`Batch ${id.slice(0,8)}: ${len} entries`);
}

console.log(`\nTotal merged: ${Object.keys(merged).length} unique strings`);
fs.writeFileSync("/tmp/full-translation-map.json", JSON.stringify(merged, null, 2));
console.log("Saved to /tmp/full-translation-map.json");
