const fs = require('fs');

function wipe(path, regex) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(regex, '');
  fs.writeFileSync(path, content);
}

wipe('src/components/reports/PremiumPrintableReport.tsx', /\s*tr:\s*{[\s\S]*?},/);
wipe('src/components/reports/PremiumPrintableReport.tsx', /const labels = PRINT_LABELS\[formatLocale === "en"\s*\?\s*"en"\s*:\s*"en"\];/g);
