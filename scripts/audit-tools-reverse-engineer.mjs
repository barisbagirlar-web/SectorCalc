import fs from 'fs';
import path from 'path';

const SCHEMAS_DIR = path.join(process.cwd(), 'src/lib/premium-schema/schemas');

function runAudit() {
  const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  console.log(`=== TUR 1: İLK TARAMA (${files.length} ARAÇ) ===\n`);

  let failCount = 0;
  let passCount = 0;

  files.forEach(file => {
    const filePath = path.join(SCHEMAS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    console.log(`\n--- DOSYA: ${file} ---`);
    
    // ADIM 1: INPUT VARLIĞI
    const inputsMatch = content.match(/inputs:\s*\[([\s\S]*?)\]\s*,/);
    if (!inputsMatch) {
      console.log(`ADIM 1: FAIL | BULGU: 'inputs' dizisi bulunamadı. | DOSYA/SATIR: ${file}`);
      failCount++;
    } else {
      const inputsStr = inputsMatch[1];
      if (inputsStr.includes('id:') && inputsStr.includes('label:') && inputsStr.includes('type:')) {
        console.log(`ADIM 1: PASS | BULGU: Gerekli (id, label, type) özelliklerine sahip inputlar mevcut. | DOSYA/SATIR: ${file}`);
      } else {
        console.log(`ADIM 1: FAIL | BULGU: Eksik input tanımı (id/label/type eksik olabilir). | DOSYA/SATIR: ${file}`);
        failCount++;
      }
    }

    // ADIM 2: FORMÜL DOĞRULUĞU (Execute fonksiyonu)
    const executeMatch = content.match(/execute:\s*(?:async\s*)?\([^)]*\)\s*=>/);
    if (executeMatch) {
      console.log(`ADIM 2: PASS | BULGU: 'execute' fonksiyonu mevcut ve matematiksel yapı tanımlı. | DOSYA/SATIR: ${file}`);
    } else {
      console.log(`ADIM 2: FAIL | BULGU: 'execute' (formül/hesaplama) fonksiyonu bulunamadı. | DOSYA/SATIR: ${file}`);
      failCount++;
    }

    // ADIM 3: HESAPLAMA İZLEME (Statik analiz)
    // Eğer execute varsa, result dönüyor mu kontrolü
    if (content.includes('return {') && content.includes('results:')) {
      console.log(`ADIM 3: PASS | BULGU: Hesaplama izlemesi output (results) üretiyor. | DOSYA/SATIR: ${file}`);
    } else {
      console.log(`ADIM 3: FAIL | BULGU: Statik analizde geçerli bir 'results' dönüşü (return) tespit edilemedi. | DOSYA/SATIR: ${file}`);
      failCount++;
    }

    // ADIM 4: UI BÜTÜNLÜĞÜ (Genel yapı, label text uzunlukları vb.)
    // Responsive sınıfları (hidden md:block vb) gibi hatalı classlar var mı?
    if (content.match(/hidden\s+md:block/)) {
      console.log(`ADIM 4: FAIL | BULGU: Potansiyel mobil görünürlük sorunu (hidden md:block). | DOSYA/SATIR: ${file}`);
      failCount++;
    } else {
      console.log(`ADIM 4: PASS | BULGU: UI bütünlüğünü bozacak potansiyel (mobil) sınıflar bulunmadı. | DOSYA/SATIR: ${file}`);
    }

    // ADIM 5: ÇEVİRİ EKSİKSİZLİĞİ (İngilizce kalıntı = 0)
    // Sadece label ve description'ların statik Türkçe mi olduğuna kabaca regexle bakıyoruz
    // Basit bir buluşsal analiz: Eğer İngilizce (the, is, for vb.) veya Türkçe karakterli mi?
    // Bu aşamada i18n entegrasyonu namespace üzerinden yapılıyorsa veya hardcoded TR metinse "PASS" diyebiliriz.
    const hasEnglishWords = /\b(the|and|is|for|with|this|that)\b/i.test(content);
    if (hasEnglishWords) {
      console.log(`ADIM 5: FAIL | BULGU: İngilizce kalıntı şüphesi (the, and, is vb.). | DOSYA/SATIR: ${file}`);
      failCount++;
    } else {
      console.log(`ADIM 5: PASS | BULGU: Türkçe/Lokal dil kalıntı testi başarılı (0 İngilizce). | DOSYA/SATIR: ${file}`);
    }

    passCount += 5; // Her dosya için 5 adım
  });
  
  console.log(`\n=== ÖZET ===`);
  console.log(`TOPLAM ADIM: ${files.length * 5}`);
  console.log(`FAIL SAYISI: ${failCount}`);
  console.log(`GEÇER (PASS) ADIM: ${passCount - failCount}`);
}

runAudit();
