#!/usr/bin/env node
/**
 * Formula Knowledge Graph — tool → route → schema → contract → validation → result chain.
 */
import fs from "node:fs";
import path from "node:path";
import {
  FORMULA_KNOWLEDGE_GRAPH_PATH,
  buildFormulaKnowledgeGraph,
  formatKnowledgeGraphStdout,
} from "./lib/p25-control-plane-lib.mjs";

function main() {
  let graph;
  try {
    graph = buildFormulaKnowledgeGraph();
  } catch (error) {
    console.error("build:formula-knowledge-graph ERROR");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(FORMULA_KNOWLEDGE_GRAPH_PATH), { recursive: true });
  fs.writeFileSync(FORMULA_KNOWLEDGE_GRAPH_PATH, `${JSON.stringify(graph, null, 2)}\n`, "utf8");

  console.log(formatKnowledgeGraphStdout(graph));
}

main();
