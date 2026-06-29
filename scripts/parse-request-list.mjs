import fs from "node:fs";
import path from "node:path";

const requestPath = path.resolve("docs/full_user_request.txt");
const content = fs.readFileSync(requestPath, "utf8");

const lines = content.split("\n");
const tools = [];

let currentSection = "";

for (const line of lines) {
  const secMatch = line.match(/^(\d+)\.\s+SECTION:\s+(.+)/);
  if (secMatch) {
    currentSection = secMatch[2].trim();
    continue;
  }

  const toolMatch = line.match(/^(\d+)\.\s+([^|]+)\|\s+Inputs:\s+([^|]+)\|\s+Formula:\s+([^|]+)(?:\|\s+Output:\s+(.+))?$/);
  if (toolMatch) {
    const id = parseInt(toolMatch[1], 10);
    const title = toolMatch[2].trim();
    const inputsStr = toolMatch[3].trim();
    const formulaStr = toolMatch[4].trim();
    const outputStr = toolMatch[5] ? toolMatch[5].trim() : "";

    tools.push({
      id,
      section: currentSection,
      title,
      inputsStr,
      formulaStr,
      outputStr
    });
  }
}

console.log(`Parsed ${tools.length} tools.`);
if (tools.length > 0) {
  console.log("First tool:", JSON.stringify(tools[0], null, 2));
  console.log("Last tool:", JSON.stringify(tools[tools.length - 1], null, 2));
}
