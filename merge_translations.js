const fs = require('fs');

const glossary = JSON.parse(fs.readFileSync('src/data/calculator-phrase-glossary.json', 'utf8'));

// Initialize if missing
['tr', 'de', 'fr', 'es', 'ar'].forEach(lang => {
  if (!glossary[lang]) glossary[lang] = {};
});

for (let i = 0; i < 6; i++) {
  try {
    const chunk = JSON.parse(fs.readFileSync(`translated_${i}.json`, 'utf8'));
    for (const [enString, translations] of Object.entries(chunk)) {
      if (translations.tr) glossary.tr[enString] = translations.tr;
      if (translations.de) glossary.de[enString] = translations.de;
      if (translations.fr) glossary.fr[enString] = translations.fr;
      if (translations.es) glossary.es[enString] = translations.es;
      if (translations.ar) glossary.ar[enString] = translations.ar;
    }
    console.log(`Merged translated_${i}.json`);
  } catch (e) {
    console.log(`Waiting for translated_${i}.json`);
  }
}

fs.writeFileSync('src/data/calculator-phrase-glossary.json', JSON.stringify(glossary, null, 2));
console.log('Saved glossary.');
