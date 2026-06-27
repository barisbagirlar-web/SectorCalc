import fs from 'fs';
import path from 'path';

const locales = ['en', 'tr', 'de', 'fr', 'es', 'ar'];

const additions = {
  en: {
    "card": {
      "calculationCredits": "{count} pro calculations",
      "currency": "USD",
      "perCredit": "{currency}{price} per credit",
      "loading": "Loading..."
    },
    "plans": {
      "starter": { "name": "Try it" },
      "essentials": { "name": "Essentials" },
      "popular": { "name": "Most popular" },
      "department": { "name": "Department" },
      "enterprise": { "name": "Best value" }
    }
  },
  tr: {
    "card": {
      "calculationCredits": "{count} pro hesaplama",
      "currency": "USD",
      "perCredit": "kredi başı {currency}{price}",
      "loading": "Yükleniyor..."
    },
    "plans": {
      "starter": { "name": "Deneyin" },
      "essentials": { "name": "Temel" },
      "popular": { "name": "En popüler" },
      "department": { "name": "Departman" },
      "enterprise": { "name": "En iyi değer" }
    }
  },
  de: {
    "card": {
      "calculationCredits": "{count} pro Berechnungen",
      "currency": "USD",
      "perCredit": "{currency}{price} pro Credit",
      "loading": "Wird geladen..."
    },
    "plans": {
      "starter": { "name": "Ausprobieren" },
      "essentials": { "name": "Grundlagen" },
      "popular": { "name": "Am beliebtesten" },
      "department": { "name": "Abteilung" },
      "enterprise": { "name": "Bester Wert" }
    }
  },
  fr: {
    "card": {
      "calculationCredits": "{count} calculs pro",
      "currency": "USD",
      "perCredit": "{currency}{price} par crédit",
      "loading": "Chargement..."
    },
    "plans": {
      "starter": { "name": "Essayer" },
      "essentials": { "name": "Essentiels" },
      "popular": { "name": "Le plus populaire" },
      "department": { "name": "Département" },
      "enterprise": { "name": "Meilleure valeur" }
    }
  },
  es: {
    "card": {
      "calculationCredits": "{count} cálculos pro",
      "currency": "USD",
      "perCredit": "{currency}{price} por crédito",
      "loading": "Cargando..."
    },
    "plans": {
      "starter": { "name": "Pruébalo" },
      "essentials": { "name": "Esenciales" },
      "popular": { "name": "Más popular" },
      "department": { "name": "Departamento" },
      "enterprise": { "name": "Mejor valor" }
    }
  },
  ar: {
    "card": {
      "currency": "USD",
    },
    "plans": {
    }
  }
};

for (const loc of locales) {
  const p = path.join('messages', `${loc}.json`);
  if (!fs.existsSync(p)) continue;
  let data = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  if (data.pricing_v2) {
    if (!data.pricing_v2.card) data.pricing_v2.card = {};
    Object.assign(data.pricing_v2.card, additions[loc].card);
    
    if (data.pricing_v2.plans) {
      for (const [planId, planData] of Object.entries(additions[loc].plans)) {
        if (!data.pricing_v2.plans[planId]) data.pricing_v2.plans[planId] = {};
        data.pricing_v2.plans[planId].name = planData.name;
      }
    }
  }
  
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
  console.log(`Updated ${loc}.json`);
}
