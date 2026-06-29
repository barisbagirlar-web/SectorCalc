const fs = require('fs');

const glossary = JSON.parse(fs.readFileSync('src/data/calculator-phrase-glossary.json', 'utf8'));

const text = "Engine integration is in progress for this calculator.";

glossary.tr[text] = "Bu hesaplayıcı için motor entegrasyonu devam etmektedir.";
glossary.de[text] = "Die Engine-Integration für diesen Rechner ist in Arbeit.";
glossary.fr[text] = "L'intégration du moteur est en cours pour ce calculateur.";
glossary.es[text] = "La integración del motor está en curso para esta calculadora.";

fs.writeFileSync('src/data/calculator-phrase-glossary.json', JSON.stringify(glossary, null, 2));
console.log('Fixed engine msg.');
