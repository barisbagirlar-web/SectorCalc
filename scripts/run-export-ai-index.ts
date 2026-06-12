import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAiEmbeddingSourceJsonl } from "../src/lib/ai/build-embedding-source";
import {
  buildAiCategoriesDocument,
  buildAiSearchManifestDocument,
  buildAiToolIndexDocument,
  buildAiToolIndexTxt,
  buildAiToolRoutesDocument,
} from "../src/lib/ai/build-ai-index-export";
import { buildLlmsTxt } from "../src/lib/ai/build-llms-txt";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

const index = buildAiToolIndexDocument();
const routes = buildAiToolRoutesDocument(index);
const categories = buildAiCategoriesDocument(index);
const manifest = buildAiSearchManifestDocument();
const llms = buildLlmsTxt(index);
const embedding = buildAiEmbeddingSourceJsonl(index);

writeFileSync(join(publicDir, "ai-tool-index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");
writeFileSync(join(publicDir, "ai-categories.json"), `${JSON.stringify(categories, null, 2)}\n`, "utf8");
writeFileSync(join(publicDir, "ai-tool-routes.json"), `${JSON.stringify(routes, null, 2)}\n`, "utf8");
writeFileSync(join(publicDir, "ai-search-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
writeFileSync(join(publicDir, "ai-embedding-source.jsonl"), embedding, "utf8");
writeFileSync(join(publicDir, "llms.txt"), llms, "utf8");
writeFileSync(join(publicDir, "ai-tool-index.txt"), buildAiToolIndexTxt(index, "en"), "utf8");

console.log(
  `export:ai-index — tools=${index.totalTools} active=${index.totalActiveRoutes} categoryOnly=${index.totalCategoryOnly} categories=${index.categories.length} jsonlLines=${embedding.split("\n").filter(Boolean).length}`,
);
