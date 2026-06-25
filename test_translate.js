const { readFileSync } = require('fs');
const PHRASE_GLOSSARY = JSON.parse(readFileSync('src/data/calculator-phrase-glossary.json', 'utf8'));
const FIELD_LABEL_MAP = JSON.parse(readFileSync('scripts/data/calculator-field-labels-i18n.json', 'utf8'));
const PREMIUM_MANUAL_TR = {};
const PREMIUM_MANUAL = {};

function translatePhrase(text, locale) {
  if (!text || locale === "en") {
    return text;
  }
  const fieldLabel = FIELD_LABEL_MAP[locale]?.[text];
  if (fieldLabel) {
    return fieldLabel;
  }
  const manual =
    locale === "tr" ? PREMIUM_MANUAL_TR[text] : PREMIUM_MANUAL[locale]?.[text];
  if (manual) {
    return manual;
  }
  if (PHRASE_GLOSSARY[locale]?.[text]) {
    return PHRASE_GLOSSARY[locale][text];
  }
  return text;
}

console.log('Result:', translatePhrase("Unit selling price", "tr"));
