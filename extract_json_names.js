const fs = require('fs');
const path = require('path');

const dir = 'data/pro-tools/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let found = false;
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const data = JSON.parse(content);
  
  if (data.name_i18n && data.name_i18n.en) {
    if (/(Analizi|Maliyet|Verim|Hata|Tasarrufu|Kayip|Dozaj|Agirlik|Tasima|Hesaplama)/i.test(data.name_i18n.en)) {
      console.log(`Found Turkish in ${file}: ${data.name_i18n.en}`);
      found = true;
    }
  } else if (data.name) {
    if (/(Analizi|Maliyet|Verim|Hata|Tasarrufu|Kayip|Dozaj|Agirlik|Tasima|Hesaplama)/i.test(data.name)) {
      console.log(`Found Turkish in ${file} (name): ${data.name}`);
      found = true;
    }
  }
}

if (!found) console.log('No Turkish names found in data/pro-tools/ en translations');
