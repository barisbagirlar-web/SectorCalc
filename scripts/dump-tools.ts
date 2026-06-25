import { buildCategorizedToolIndex } from "../src/lib/catalog/build-categorized-tool-index";

const tools = buildCategorizedToolIndex();
tools.forEach(t => {
  console.log(`${t.slug} || ${t.title.en} || ${t.description.en}`);
});
