const fs = require('fs');

const path = 'messages/en.json';
let data = fs.readFileSync(path, 'utf8');
let json = JSON.parse(data);

if (json.landingV3 && json.landingV3.method) {
  json.landingV3.method.subtitle = "All calculations are strictly verified against these global engineering standards to ensure audit-proof accuracy.";
} else {
  // If the key is not "method", maybe it's just inside landingV3 but mixed with stats?
  // Let's check the structure
  const statsIndex = data.indexOf('"Methodology Infrastructure"');
  if (statsIndex > -1) {
    // We can just add it via regex or replace
  }
}

fs.writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8');
console.log("Updated en.json method subtitle");
