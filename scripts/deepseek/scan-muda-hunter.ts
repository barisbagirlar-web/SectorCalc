import { deepseekClient } from './deepseek-client';
import { loadEnv } from './load-env';
import * as fs from 'fs';

loadEnv();

const MUDA_HUNTER_INPUTS = `
- Analysis period length (days, default 30)
- Annual working days (days/year, default 250)
- Production units in period (units, default 1000)
- Currency (USD, EUR, etc.)
- Unit variable cost (currency/unit)
- Unit selling price (currency/unit)
- Gross margin percent (%)
- Excess production units (units)
- Waiting / downtime hours (hours)
- Waiting opportunity cost mode (manual or derive)
- Hourly opportunity cost (currency/hour)
- Unnecessary transport cost (currency)
- Excess inventory value (currency)
- Inventory carrying rate (%)
- Unnecessary motion hours (hours)
- Motion hourly cost (currency/hour)
- Defect / scrap units (units)
- Rework cost per defect (currency/unit)
- Overprocessing hours (hours)
- Overprocessing hourly cost (currency/hour)
- Data confidence (%)
- Implementation difficulty (1-5)
`;

const PROMPT = `
Sen bir endüstriyel mühendislik asistanısın. Aşağıda "7 Waste (Muda) Hunter Monetary Impact Calculator" için input alanları verilmiştir.

Görev: Bu aracın tam bir mühendislik şemasını oluştur.

Çıktıda aşağıdakileri JSON olarak dön (başka metin yok):

{
  "toolName": "7-waste-muda-hunter",
  "inputs": [
    {
      "id": "analysisPeriodDays",
      "label": "Analysis period length",
      "label_i18n": {
        "en": "Analysis period length",
        "tr": "Analiz dönemi uzunluğu",
        "de": "Länge des Analysezeitraums",
        "fr": "Durée de la période d'analyse",
        "es": "Duración del período de análisis",
        "ar": "طول فترة التحليل"
      },
      "type": "number",
      "unit": "days",
      "default": 30,
      "min": 1,
      "max": 365,
      "businessContext": "The period the user wants to analyze. Waste calculations apply to this window.",
      "businessContext_i18n": {
        "en": "The period the user wants to analyze. Waste calculations apply to this window.",
        "tr": "Kullanıcının analiz yapmak istediği dönem. Atık hesaplamaları bu dönem için yapılır.",
        "de": "Der Zeitraum, den der Nutzer analysieren möchte. Verschwendungsberechnungen gelten für dieses Fenster.",
        "fr": "La période que l'utilisateur souhaite analyser. Les calculs de gaspillage s'appliquent à cette fenêtre.",
        "es": "El período que el usuario desea analizar. Los cálculos de desperdicio se aplican a esta ventana.",
        "ar": "الفترة التي يريد المستخدم تحليلها. تُطبَّق حسابات الهدر على هذه النافذة."
      }
    },
    // ... tüm input'lar bu şekilde
  ],
  "validation": {
    "rules": [
      "Eğer Waiting opportunity cost mode 'manual' ise Hourly opportunity cost > 0 olmalı",
      "Data confidence 0-100 arasında",
      "Implementation difficulty 1-5 arasında tamsayı"
    ],
    "thresholds": {
      "defectRate": "defectUnits / productionUnits > 0.05 → 'KRITIK' uyarısı",
      "inventoryCarryingCost": "excessInventoryValue * (inventoryCarryingRate/100) > revenue*0.1 → yüksek stok maliyeti"
    }
  },
  "formulas": {
    "totalWasteCost": "excessProductionWaste + waitingWaste + transportWaste + inventoryWaste + motionWaste + defectWaste + overprocessingWaste",
    "excessProductionWaste": "excessProductionUnits * unitVariableCost",
    "waitingWaste": "waitingOpportunityCostMode === 'manual' ? waitingHours * hourlyOpportunityCost : waitingHours * (unitSellingPrice - unitVariableCost)",
    // ... diğer formüller
  },
  "outputs": {
    "primary": "totalWasteCost (currency, format: currency)",
    "breakdown": {
      "overproduction": "number",
      "waiting": "number",
      "transport": "number",
      "inventory": "number",
      "motion": "number",
      "defects": "number",
      "overprocessing": "number"
    },
    "hiddenLossDrivers": ["string"], // hangi atık türleri threshold'u aştı
    "suggestedActions": ["string"], // öneriler
    "dataConfidenceAdjusted": "totalWasteCost * (dataConfidence/100)"
  },
  "premiumFeatures": [
    "PDF export",
    "CSV export",
    "Historical trend analysis (paid plans)",
    "Benchmarking against industry averages"
  ],
  "premiumRequired": true
}

Şimdi bu JSON'u doldur. Input listesindeki HER alan için input şeması oluştur. Formülleri gerçekçi hesapla. Çıktıda sadece JSON.
`;

async function main() {
  console.log('🔍 Muda Hunter aracı taranıyor...');
  const response = await deepseekClient(PROMPT);
  console.log('✅ Sonuç:\n', response);

  // Kaydet
  fs.writeFileSync('generated/muda-hunter-schema.json', response);
  console.log('📁 generated/muda-hunter-schema.json kaydedildi.');
}

main();
