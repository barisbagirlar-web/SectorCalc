import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAiToolIndex, buildAiToolIndexTxt } from "../src/lib/semantic/build-ai-tool-index";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const json = buildAiToolIndex("en");

writeFileSync(join(root, "public/ai-tool-index.json"), `${JSON.stringify(json, null, 2)}\n`, "utf8");
writeFileSync(join(root, "public/ai-tool-index.txt"), buildAiToolIndexTxt("en"), "utf8");

console.log(`export:ai-tool-index — ${json.length} public tools`);
