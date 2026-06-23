const fs = require('fs');

const locales = ['en', 'tr', 'de', 'es', 'fr', 'ar'];

for (const locale of locales) {
  const tmpPath = `tmp_messages/${locale}.json`;
  const realPath = `messages/${locale}.json`;

  if (fs.existsSync(tmpPath) && fs.existsSync(realPath)) {
    const tmpData = JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
    const realData = JSON.parse(fs.readFileSync(realPath, 'utf8'));

    if (tmpData.landingPage) {
      realData.landingPage = tmpData.landingPage;
      fs.writeFileSync(realPath, JSON.stringify(realData, null, 2) + '\n');
      console.log(`Merged landingPage for ${locale}`);
    }
  }
}
