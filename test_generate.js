const { readFileSync } = require('fs');
const PHRASE_GLOSSARY = JSON.parse(readFileSync('src/data/calculator-phrase-glossary.json', 'utf8'));
const FIELD_LABEL_MAP = JSON.parse(readFileSync('scripts/data/calculator-field-labels-i18n.json', 'utf8'));

console.log('FIELD_LABEL_MAP.tr["Unit selling price"]:', FIELD_LABEL_MAP.tr["Unit selling price"]);
console.log('PHRASE_GLOSSARY.tr["Unit selling price"]:', PHRASE_GLOSSARY.tr["Unit selling price"]);

