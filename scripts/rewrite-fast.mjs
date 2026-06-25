import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONFIG = {
  model: "deepseek-chat",
  max_tokens: 4000,
  concurrency: 20 // 20 eşzamanlı istek
};

const MASTER_PROMPT = `
Sen SectorCalc için kıdemli endüstriyel mühendislik uzmanısın.
Görevin: Verilen hesap aracı JSON'unu endüstriyel otorite standardına yükseltmek.

HEDEF KİTLE: Mühendisler, teknisyenler, CNC operatörleri, tesis yöneticileri,
kalite mühendisleri, kaynak ustası, tamirci, tadilatçı — saha kararı veren profesyoneller.
Bu kişiler para ödüyor. Hatalı hesap kabul edilemez. Güvenli aralık dışı değerlerde sistem uyarmalı.

ÇIKTI KURALI: SADECE geçerli JSON döndür. Markdown yok, açıklama yok, \`\`\`json yok.
İlk karakter { olmalı, son karakter } olmalı.

KURAL 1 — INPUT TAMAMLAMA
Mevcut inputları KORU, eksik kritik inputları EKLE.
{
  "id": "snake_case_id",
  "name": "Türkçe Etiket",
  "unit": "Birim",
  "type": "number",
  "required": true,
  "confidence_label": "KESİN",
  "absolute_min": 0,
  "absolute_max": 99999
}

KURAL 2 — FORMÜLLER (EN KRİTİK)
- Çıktı: "SonucDegiskeni = IF(a > b, 1, 0) * MAX(1, Degisken) // Yorum" formatında matematiksel.
- Çıktı hesapları Javascript'in new Function parametresine uygun olmalı.
- Matematik fonksiyonları olarak sadece şunları kullan: MAX, MIN, POW, SQRT, ABS, LN, EXP, SIN, COS, TAN, PI, IF.
- Girdiler (inputs) ile formüllerdeki değişken isimleri (id'ler) KESİNLİKLE eşleşmelidir.

KURAL 3 — SMART WARNING (MİN 3 ADET)
{
  "condition": "input_1 > 100",
  "severity": "WARNING",
  "source": "ISO Standardı",
  "message": "Türkçe uyarı mesajı"
}

KURAL 4 — VALIDATION
{ "negatif_hata": { "absolute_min": 0, "error_msg": "Hata" } }

KURAL 5 — STANDARTLAR
"standards": ["ISO XXXX"]
`;

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.DEEPSEEK_API_KEY });

async function rewriteTool(tool) {
  const toolStr = tool._raw;
  const prompt = MASTER_PROMPT + "\n" + toolStr;

  try {
    const response = await client.chat.completions.create({
      model: CONFIG.model,
      max_tokens: CONFIG.max_tokens,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0]?.message?.content?.trim() || "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("JSON bulunamadı");
    
    return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
  } catch (err) {
    console.error(`[${tool.tool_id}] Hata:`, err.message);
    return null;
  }
}

async function main() {
  const tools = JSON.parse(fs.readFileSync("input_for_pipeline.json", "utf-8"));
  const outputDir = path.join(process.cwd(), "data", "pro-tools-fast");
  fs.mkdirSync(outputDir, { recursive: true });

  const merged = [];
  const chunkSize = CONFIG.concurrency;

  for (let i = 0; i < tools.length; i += chunkSize) {
    const chunk = tools.slice(i, i + chunkSize);
    console.log(`İşleniyor: ${i} - ${i + chunk.length} / ${tools.length}`);
    
    const promises = chunk.map(async (tool) => {
      const outPath = path.join(outputDir, `${tool.tool_id}.json`);
      if (fs.existsSync(outPath)) {
        merged.push(JSON.parse(fs.readFileSync(outPath, "utf-8")));
        return;
      }
      const result = await rewriteTool(tool);
      if (result) {
        fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
        merged.push(result);
      }
    });

    await Promise.all(promises);
  }

  fs.writeFileSync(path.join(outputDir, "_merged.json"), JSON.stringify(merged, null, 2));
  console.log("Bitti! Tüm JSON'lar data/pro-tools-fast dizinine kaydedildi.");
}

main();
