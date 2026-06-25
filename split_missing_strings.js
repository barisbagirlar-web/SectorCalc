const fs = require('fs');

const missingStrings = JSON.parse(fs.readFileSync('missing_strings.json', 'utf8'));
const chunkSize = Math.ceil(missingStrings.length / 6);

for (let i = 0; i < 6; i++) {
  const chunk = missingStrings.slice(i * chunkSize, (i + 1) * chunkSize);
  fs.writeFileSync(`chunk_${i}.json`, JSON.stringify(chunk, null, 2));
  console.log(`chunk_${i}.json written with ${chunk.length} strings`);
}
