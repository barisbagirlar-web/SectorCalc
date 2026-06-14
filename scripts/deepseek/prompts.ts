export const INDUSTRIAL_DEEP_RESEARCH_PROMPT = (toolName: string, toolDescription: string) => `
Sen bir endüstri mühendisliği ve finansal analiz uzmanısın. Senden istenen: Aşağıda adı ve açıklaması verilen hesaplama aracını **sıfırdan** endüstriyel/mühendislik seviyesinde modellemen.

Araç slug (toolName alanına AYNEN yaz, değiştirme): "${toolName}"
Araç açıklaması: "${toolDescription}"

Görevin:
1. Bu aracın dünyada kabul görmüş mühendislik prensiplerine göre hangi **input parametrelerine** ihtiyaç duyduğunu araştır.
   - Her input için: id, label (İngilizce kanonik), label_i18n (en/tr/de/fr/es/ar — 6 dil zorunlu), type (number/select/boolean), unit (SI veya sektörel birim), default değer, min, max, businessContext (İngilizce kanonik), businessContext_i18n (en/tr/de/fr/es/ar — 6 dil zorunlu)
   - label ve label_i18n.en aynı olmalı; businessContext ve businessContext_i18n.en aynı olmalı.
   - Eğer sektörel bir standart varsa (ISO, ASTM, Lean, Six Sigma, WERC, vs.), bunu businessContext ve businessContext_i18n içinde belirt.
   - Select tipinde ise olası seçenekleri ver.

2. Validasyon kurallarını belirle:
   - Basit min/max dışında, koşullu kurallar (örnek: "Eğer mode='manual' ise hourlyCost > 0").
   - Eşik değer bazlı uyarılar (thresholds): örneğin "defectRate > 0.05 → 'KRITIK uyarısı'".

3. Formülleri oluştur:
   - Ara çıktılar ve nihai sonuç için matematiksel formüller.
   - Değişken isimleri input id'leriyle birebir aynı olacak (camelCase).
   - Zaman oranlamaları (gün/ay/yıl) mutlaka dikkate al.
   - Koşullu ifadeler (ternary) kullanılabilir.

4. Çıktı şemasını belirle:
   - primary: ana sonuç (para, oran, vb.)
   - breakdown: alt bileşenler (nesne olarak)
   - hiddenLossDrivers: threshold'ları aşan durumlar (string[])
   - suggestedActions: mühendislik aksiyon önerileri (string[])
   - dataConfidenceAdjusted: eğer dataConfidence input'u varsa onunla düzeltilmiş sonuç

5. Premium özellikler:
   - Bu araç için hangi özellikler premium'a tabi olmalı? (PDF/CSV export, trend analizi, karşılaştırma, detaylı rapor)
   - premiumRequired: boolean (genellikle true)

**Önemli:** Araştırma yaparken aşağıdaki kaynakları referans al (zihinsel olarak):
- Endüstri mühendisliği el kitapları (Maynard, Salvendy)
- Lean ve Six Sigma araçları (VSM, JIT, SMED, Poka-Yoke)
- Finansal oranlar ve yatırım değerleme standartları (CAPM, NPV, IRR)
- ISO 50001 (enerji), ISO 14000 (çevre), ISO 9001 (kalite)
- Sektörel benchmarklar (WERC, APICS, vb.)

**Çıktı formatı:** SADECE JSON. Aşağıdaki şemaya harfiyen uy:

{
  "toolName": "${toolName}",
  "inputs": [ {
    "id": "string",
    "label": "string",
    "label_i18n": { "en": "string", "tr": "string", "de": "string", "fr": "string", "es": "string", "ar": "string" },
    "type": "number|select|boolean",
    "unit": "string",
    "default": number|string|boolean,
    "min": number|null,
    "max": number|null,
    "options": ["string"] | null,
    "businessContext": "string",
    "businessContext_i18n": { "en": "string", "tr": "string", "de": "string", "fr": "string", "es": "string", "ar": "string" }
  } ],
  "validation": { "rules": ["string"], "thresholds": { "key": "string" } },
  "formulas": { "formulaName": "string" },
  "outputs": { "primary": "string", "breakdown": {}, "hiddenLossDrivers": ["string"], "suggestedActions": ["string"], "dataConfidenceAdjusted": "string" },
  "premiumFeatures": ["string"],
  "premiumRequired": true/false
}

Hiçbir açıklama yazma, sadece JSON.
`;

/** @deprecated Use INDUSTRIAL_DEEP_RESEARCH_PROMPT for full catalog scans. */
export const INDUSTRIAL_ENGINEERING_PROMPT = (
  toolName: string,
  toolDescription: string,
  existingContext?: string,
) => `
Sen dünya standartlarında bir endüstri mühendisliği ve finansal analiz uzmanısın.
Sana verilen hesaplama aracının adı: "${toolName}"
Açıklaması: "${toolDescription}"
${existingContext ? `Ek bağlam: ${existingContext}` : ""}

Görevin: Bu aracın **endüstriyel/mühendislik seviyesinde** tam bir şemasını çıkarmak.
Aşağıdaki gereksinimlere eksiksiz uy.

1. **Input alanları** (sadece kullanıcıdan toplanması gerekenler):
   - Her input için: id, label (İngilizce kanonik), label_i18n (en/tr/de/fr/es/ar — 6 dil zorunlu), type (number/select/boolean), unit (SI veya sektörel birim), default, min, max, businessContext (İngilizce kanonik), businessContext_i18n (en/tr/de/fr/es/ar — 6 dil zorunlu)
   - label ve label_i18n.en aynı olmalı; businessContext ve businessContext_i18n.en aynı olmalı.
   - Select tipinde ise olası değerleri listele.
   - Birim mutlaka belirt (örnek: "hours", "USD", "kg", "m²", "%", "units/year").
   - Mühendislik bağlamında tipik aralıkları (min/max) öner.

2. **Validasyon kuralları**:
   - Basit min/max dışında, koşullu kurallar da ekle (örnek: "Eğer mode='manual' ise hourlyCost > 0").
   - Eşik değer bazlı uyarılar (thresholds): örneğin "defectRate > 0.05 → KRITIK uyarısı", "inventoryWaste > revenue*0.1 → yüksek stok maliyeti".

3. **Formüller**:
   - Tüm ara çıktılar ve nihai sonuç için matematiksel formüller.
   - Değişken isimleri input id'leriyle birebir aynı olacak (camelCase).
   - Zaman oranlamaları (gün/ay/yıl) mutlaka dikkate al (örn: inventoryWaste = value * rate * (periodDays/365)).
   - Koşullu ifadeler (ternary) kullanılabilir.

4. **Çıktılar**:
   - primary: ana sonuç (para, oran, vb.)
   - breakdown: alt bileşenler (nesne olarak)
   - hiddenLossDrivers: threshold'ları aşan durumlar (string[])
   - suggestedActions: mühendislik aksiyon önerileri (string[])
   - dataConfidenceAdjusted: eğer dataConfidence input'u varsa onunla düzeltilmiş sonuç

5. **Premium özellikler**:
   - Bu araç için hangi özellikler premium'a tabi olmalı? (PDF/CSV export, trend analizi, karşılaştırma, detaylı rapor, vs.)
   - premiumRequired: boolean (genellikle true)

6. **Ek gereksinim**:
   - Her input için businessContext ve businessContext_i18n (6 dil) — neden bu alan kullanılır? hangi kaynak/standart esas alınır?
   - Eğer sektörel bir standart varsa (ISO, ASTM, Lean, Six Sigma, WERC, vb.), dipnot olarak belirt.

Çıktıyı **sadece JSON** olarak ver. Aşağıdaki formata harfiyen uy:

{
  "toolName": "string",
  "inputs": [ {
    "id": "string",
    "label": "string",
    "label_i18n": { "en": "string", "tr": "string", "de": "string", "fr": "string", "es": "string", "ar": "string" },
    "type": "number|select|boolean",
    "unit": "string",
    "default": number|string|boolean,
    "min": number|null,
    "max": number|null,
    "options": ["string"] | null,
    "businessContext": "string",
    "businessContext_i18n": { "en": "string", "tr": "string", "de": "string", "fr": "string", "es": "string", "ar": "string" }
  } ],
  "validation": { "rules": ["string"], "thresholds": { "key": "string" } },
  "formulas": { "formulaName": "string" },
  "outputs": { "primary": "string", "breakdown": {}, "hiddenLossDrivers": ["string"], "suggestedActions": ["string"], "dataConfidenceAdjusted": "string" },
  "premiumFeatures": ["string"],
  "premiumRequired": true/false
}

Hiçbir açıklama yazma, sadece JSON.
`;

export const SCHEMA_I18N_BACKFILL_PROMPT = (
  toolName: string,
  payloadJson: string,
) => `
Sen bir endüstriyel çeviri ve UX uzmanısın. Aşağıdaki hesaplama aracı input alanları için çok dilli etiket ve yardım metni üreteceksin.

Araç: "${toolName}"

Kaynak JSON (yalnızca çevrilmesi gereken alanlar):
${payloadJson}

Görev:
1. Her input için label_i18n ve businessContext_i18n objelerini üret.
2. Zorunlu diller: en, tr, de, fr, es, ar — hepsi dolu olmalı.
3. label_i18n.en kaynak label ile aynı olmalı.
4. businessContext_i18n.en kaynak businessContext ile aynı olmalı.
5. Çeviriler kısa, teknik ve endüstriyel hesap makinesi formu için uygun olmalı.
6. Birim kısaltmalarını (mm, RPM, USD, %) değiştirme; yalnızca açıklayıcı metni çevir.
7. id alanlarını değiştirme; yanıtta aynı id'leri koru.

Çıktı formatı — SADECE JSON:
{
  "inputs": [
    {
      "id": "string",
      "label_i18n": { "en": "string", "tr": "string", "de": "string", "fr": "string", "es": "string", "ar": "string" },
      "businessContext_i18n": { "en": "string", "tr": "string", "de": "string", "fr": "string", "es": "string", "ar": "string" }
    }
  ]
}

Hiçbir açıklama yazma, sadece JSON.
`;
