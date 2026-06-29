const fs = require('fs');
const lines = fs.readFileSync('hesaplama kontrolu.txt', 'utf8').split('\n');
const tools = [];
let idCounter = 1;
for (const line of lines) {
  if (idCounter > 192) break;
  if (line.match(/^\d+\./)) {
    tools.push({
      tool_id: `PRO_${idCounter.toString().padStart(3, "0")}`,
      _raw: line.trim()
    });
    idCounter++;
  }
}
fs.writeFileSync('input_for_pipeline.json', JSON.stringify(tools, null, 2));
