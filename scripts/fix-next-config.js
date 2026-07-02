const fs = require('fs');
let content = fs.readFileSync('next.config.ts', 'utf8');

content = content.replace(/\{ source: "\/free-tools", destination: "\/en\/free-tools" \},\n/, '');
content = content.replace(/\{ source: "\/pro-tools", destination: "\/en\/pro-tools" \},\n/, '');
content = content.replace(/\{ source: "\/industries", destination: "\/en\/industries" \},\n/, '');
content = content.replace(/\{ source: "\/pricing", destination: "\/en\/pricing" \},\n/, '');
content = content.replace(/\{ source: "\/calculators\/:path\*", destination: "\/en\/calculators\/:path\*" \},\n/, '');
content = content.replace(/\{ source: "\/tools\/:path\*", destination: "\/en\/tools\/:path\*" \},\n/, '');

fs.writeFileSync('next.config.ts', content);
