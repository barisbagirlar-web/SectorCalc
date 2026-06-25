import fs from 'fs';
import path from 'path';

const dir = 'src/lib/premium-schema/calculators';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const replacements = [
  { tr: 'Lütfen geçerli bir değer giriniz.', en: 'Please enter a valid value.' },
  { tr: 'Endüstriyel hesaplama standartlarına uygun parametre değeri.', en: 'Parameter value complies with industrial calculation standards.' },
  { tr: 'Gürültü ve Titreşim Maruziyet Risk Maliyet Hesaplayıcı', en: 'Noise & Vibration Exposure Risk Cost Calculator' },
  { tr: 'Yüksek gürültü seviyesinin çalışan verimliliği ve sağlık maliyetine etkisi ölçülemez.', en: 'Evaluate the unmeasurable effects of high noise levels on employee productivity and health costs.' },
  { tr: 'Gürültü Seviyesi', en: 'Noise Level' },
  { tr: 'Günlük Maruziyet Süresi', en: 'Daily Exposure Duration' },
  { tr: 'İşitme Kaybı & Sağlık Maliyeti', en: 'Hearing Loss & Health Cost' },
  { tr: 'Verimlilik Kaybı Maliyeti', en: 'Productivity Loss Cost' },
  { tr: 'Hata ve Kaza Maliyeti', en: 'Error and Accident Cost' },
  { tr: 'KKD & Önlem Maliyeti', en: 'PPE & Prevention Cost' },
  { tr: 'Gürültü Maruziyet Endeksi', en: 'Noise Exposure Index' },
  { tr: 'Toplam Gürültü & Risk Maliyeti', en: 'Total Noise & Risk Cost' },
  { tr: 'Maruziyet seviyesi sınıra yakın. KKD kullanımı ve rotasyon önerilir.', en: 'Exposure level is close to the limit. PPE usage and rotation are recommended.' },
  { tr: 'Kritik gürültü maruziyeti! Acil mühendislik kontrolü ve kulak koruması gerekir.', en: 'Critical noise exposure! Immediate engineering controls and hearing protection required.' },
  { tr: 'Gürültü ve Titreşim Maruziyet Risk Analiz Raporu', en: 'Noise and Vibration Exposure Risk Analysis Report' },
];

let changedCount = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const {tr, en} of replacements) {
    if (content.includes(tr)) {
      content = content.split(tr).join(en);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedCount++;
  }
}

console.log(`Cleansed ${changedCount} files with targeted replacements.`);
