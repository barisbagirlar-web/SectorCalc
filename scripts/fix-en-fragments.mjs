/**
 * Fix English fragments in non-English locale files for inputGuide section.
 * Targets only title/summary values. Does NOT modify JSON keys.
 *
 * Usage: node scripts/fix-en-fragments.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, '..', 'messages');

// ---------- Translation dictionaries ----------

const trToolNames = new Map([
  // s2Activation - English tool name fragments in "girdi haritası" titles
  ['3d Print Job Margin Tool', '3B Baskı İş Marj Aracı'],
  ['Agriculture Irrigation Yield Loss', 'Tarımsal Sulama Verim Kaybı'],
  ['Belt Pulley Speed Length Calculator', 'Kayış Kasnak Hız Uzunluk Hesaplayıcı'],
  ['Calibration Drift Risk', 'Kalibrasyon Sürüklenme Riski'],
  ['Cloud Api Cost Overrun', 'Bulut API Maliyet Aşımı'],
  ['Cnc Oee Loss', 'CNC OEE Kaybı'],
  ['Cnc Tool Wear Cost', 'CNC Takım Aşınma Maliyeti'],
  ['Compressor Leak Cost Calculator', 'Kompresör Kaçak Maliyet Hesaplayıcı'],
  ['Construction Project Overrun', 'İnşaat Proje Aşımı'],
  ['Construction Subcontractor Margin Leak', 'İnşaat Taşeron Marj Kaçağı'],
  ['Dairy Feed Efficiency Loss', 'Süt Yem Verimlilik Kaybı'],
  ['Downtime Minute Cost Calculator', 'Dakika Başına Durma Maliyet Hesaplayıcı'],
  ['Employee Total Cost Calculator', 'Çalışan Toplam Maliyet Hesaplayıcı'],
  ['Feed Efficiency Analyzer', 'Yem Verimlilik Analizi'],
  ['Food Waste Margin Loss', 'Gıda Atık Marj Kaybı'],
  ['Inventory Carrying Cost Eoq Calculator', 'Envanter Taşıma Maliyeti EOQ Hesaplayıcı'],
  ['Investment Payback Npv Calculator', 'Yatırım Geri Ödeme NPV Hesaplayıcı'],
  ['Oee Equipment Effectiveness Calculator', 'OEE Ekipman Etkinlik Hesaplayıcı'],
  ['Painting Rework Coverage Risk', 'Boya Rötuş Kapsam Riski'],
  ['Plumbing Leak Callback Cost', 'Sıhhi Tesisat Kaçak Geri Çağırma Maliyeti'],
  ['Printing Reprint Margin Leak', 'Matbaa Yeniden Baskı Marj Kaçağı'],
  ['Product Customer Profitability Calculator', 'Ürün Müşteri Karlılık Hesaplayıcı'],
  ['Quality Cost Paf Calculator', 'Kalite Maliyeti PAF Hesaplayıcı'],
  ['Restaurant Menu Margin Leak', 'Restoran Menü Marj Kaçağı'],
  ['Retail Inventory Turnover Risk', 'Perakende Envanter Devir Riski'],
  ['Roofing Weather Delay Risk', 'Çatı Hava Gecikme Riski'],
  ['Sheet Metal Scrap Risk', 'Sac Metal Fire Riski'],
  ['Shop Rate Hourly Cost Calculator', 'Atölye Saatlik Ücret Maliyet Hesaplayıcı'],
  ['Textile Fabric Waste Risk', 'Tekstil Kumaş Atık Riski'],
  ['Tolerance Stack Up Calculator', 'Tolerans Yığılma Hesaplayıcı'],
  // s3Activation - English tool name fragments
  ['Warehouse Space Cost Leak', 'Depo Alan Maliyet Kaçağı'],
  ['Auto Shop Margin Leak Detector', 'Oto Servis Marj Kaçak Dedektörü'],
  ['Crop Yield Loss Analyzer', 'Mahsul Verim Kaybı Analizi'],
  ['Dairy Profit Detector', 'Süt Kâr Dedektörü'],
  ['Landscaping Contract Profit Tool', 'Peyzaj Sözleşme Kâr Aracı'],
  ['Meal Planning Verdict', 'Yemek Planlama Kararı'],
  ['Menu Profit Leak Detector', 'Menü Kâr Kaçak Dedektörü'],
  ['Millwork Bid Risk Analyzer', 'Doğrama İşi Teklif Risk Analizi'],
  ['Painting Job Profit Verdict', 'Boya İşi Kâr Kararı'],
  ['Panel Shop Margin Verdict', 'Panel Atölyesi Marj Kararı'],
  ['Plumbing Job Margin Verdict', 'Sıhhi Tesisat İş Marj Kararı'],
  ['Roofing Contract Margin Guard', 'Çatı Sözleşme Marj Koruyucusu'],
  ['Welding Bid Risk Analyzer', 'Kaynak İşi Teklif Risk Analizi'],
]);

const trP6bReplacements = new Map([
  // p6bFormulaFactory - mixed TR/EN names
  ['3d Print Job Marj Tool', '3B Baskı İş Marj Aracı'],
  ['Auto Shop Marj Kaçak Detector', 'Oto Servis Marj Kaçak Dedektörü'],
  ['Change sipariş Impact Analyzer', 'Değişiklik Emri Etki Analizi'],
  ['Cnc Quote risk Analyzer', 'CNC Teklif Risk Analizi'],
  ['Mahsul Verim kayıp Analyzer', 'Mahsul Verim Kaybı Analizi'],
  ['Dairy Kâr Detector', 'Süt Kâr Dedektörü'],
  ['Isı kaybı Calculator', 'Isı Kaybı Hesaplayıcı'],
  ['Hvac Project Marj Guard', 'HVAC Proje Marj Koruyucusu'],
  ['Landscaping Contract Kâr Tool', 'Peyzaj Sözleşme Kâr Aracı'],
  ['Malzeme Fire Calculator', 'Malzeme Fire Hesaplayıcı'],
  ['Menü Kâr Kaçak Detector', 'Menü Kâr Kaçak Dedektörü'],
  ['Millwork Bid risk Analyzer', 'Doğrama İşi Teklif Risk Analizi'],
  ['Boyaing Job Kâr Verdict', 'Boya İşi Kâr Kararı'],
  ['Pano Shop Marj Verdict', 'Panel Atölyesi Marj Kararı'],
  ['Plumbing Job Marj Verdict', 'Sıhhi Tesisat İş Marj Kararı'],
  ['Kâr Marj Calculator', 'Kâr Marj Hesaplayıcı'],
  ['Quote Fiyat Kâr Marj Calculator', 'Teklif Fiyatı Kâr Marj Hesaplayıcı'],
  ['Return Kâr Erosion Tool', 'İade Kâr Aşınma Aracı'],
  ['Çatıing Contract Marj Guard', 'Çatı Sözleşme Marj Koruyucusu'],
  ['Rota Optimization Analyzer', 'Rota Optimizasyon Analizi'],
  ['Fire Oran Calculator', 'Fire Oran Hesaplayıcı'],
  ['Sac metal Quote risk Tool', 'Sac Metal Teklif Risk Aracı'],
  ['Signage Bid Safe Fiyat Tool', 'Tabela Teklif Güvenli Fiyat Aracı'],
  ['su Optimization Verdict', 'Su Optimizasyon Kararı'],
  ['Kaynaking Bid risk Analyzer', 'Kaynak İşi Teklif Risk Analizi'],
  ['Enerji Verimlilik Report', 'Enerji Verimlilik Raporu'],
  ['Yenileme bütçesi Optimizer', 'Yenileme Bütçe Optimizasyonu'],
  ['Sefer Bütçe Optimizer', 'Sefer Bütçe Optimizasyonu'],
  ['parçai Verim Calculator', 'Parti Verim Hesaplayıcı'],
  ['Boiler Verimlilik Calculator', 'Kazan Verimlilik Hesaplayıcı'],
  ['başabaş Calculator', 'Başabaş Hesaplayıcı'],
  ['Tuğla Calculator', 'Tuğla Hesaplayıcı'],
  ['Cash Debi fark Calculator', 'Nakit Akış Fark Hesaplayıcı'],
  ['Cleaning Maliyet Calculator', 'Temizlik Maliyet Hesaplayıcı'],
  ['Cnc Çevrim süresi Calculator', 'CNC Çevrim Süresi Hesaplayıcı'],
  ['Kompresör Enerji Maliyet Calculator', 'Kompresör Enerji Maliyet Hesaplayıcı'],
  ['Beton Bag Calculator', 'Beton Torba Hesaplayıcı'],
  ['Beton Hacim Calculator', 'Beton Hacim Hesaplayıcı'],
  ['Mahsul Verim Calculator', 'Mahsul Verim Hesaplayıcı'],
  ['Kesim Hız Calculator', 'Kesme Hız Hesaplayıcı'],
  ['Teslimat Maliyet Calculator', 'Teslimat Maliyet Hesaplayıcı'],
  ['Amortisman Calculator', 'Amortisman Hesaplayıcı'],
  ['DryDuvar Calculator', 'Alçıpan Hesaplayıcı'],
  ['Elektrik faturası Calculator', 'Elektrik Faturası Hesaplayıcı'],
  ['Enerji Tüketim Check', 'Enerji Tüketim Kontrolü'],
  ['Kazı hacmi Calculator', 'Kazı Hacim Hesaplayıcı'],
  ['Gübre Dozaj Calculator', 'Gübre Dozaj Hesaplayıcı'],
  ['Zemining Calculator', 'Zemin Kaplama Hesaplayıcı'],
  ['Gıda maliyeti Calculator', 'Gıda Maliyet Hesaplayıcı'],
  ['Freight Maliyet Calculator', 'Navlun Maliyet Hesaplayıcı'],
  ['Yakıt Maliyet Calculator', 'Yakıt Maliyet Hesaplayıcı'],
  ['Yakıt Travel Calculator', 'Yakıt Seyahat Hesaplayıcı'],
  ['saatlik Oran Calculator', 'Saatlik Ücret Hesaplayıcı'],
  ['Sulama Maliyet Check', 'Sulama Maliyet Kontrolü'],
  ['Kwh Tüketim Check', 'kWh Tüketim Kontrolü'],
  ['Kwh Maliyet Calculator', 'kWh Maliyet Hesaplayıcı'],
  ['makine saat Oran Calculator', 'Makine Saat Ücret Hesaplayıcı'],
  ['Milk Verim Check', 'Süt Verim Kontrolü'],
  ['Boya Kaplama Calculator', 'Boya Kaplama Hesaplayıcı'],
  ['kısım Maliyet Calculator', 'Porsiyon Maliyet Hesaplayıcı'],
  ['Print Job Maliyet Check', 'Baskı İş Maliyet Kontrolü'],
  ['Project Maliyet Calculator', 'Proje Maliyet Hesaplayıcı'],
  ['İnşaat demiri ağırlığı Calculator', 'İnşaat Demiri Ağırlık Hesaplayıcı'],
  ['Recipe Maliyet Check', 'Tarif Maliyet Kontrolü'],
  ['Çatıing Kare Maliyet Check', 'Çatı Kare Maliyet Kontrolü'],
  ['Rota Maliyet Calculator', 'Rota Maliyet Hesaplayıcı'],
  ['Maaş Maliyet Calculator', 'Maaş Maliyet Hesaplayıcı'],
  ['Seed Oran Calculator', 'Tohum Oran Hesaplayıcı'],
  ['Sac metal Ağırlık Calculator', 'Sac Metal Ağırlık Hesaplayıcı'],
  ['güneş Pano çıktı Calculator', 'Güneş Panel Çıktı Hesaplayıcı'],
  ['Kare Footage Calculator', 'Kare Alan Hesaplayıcı'],
  ['Tolerans sapma Calculator', 'Tolerans Sapma Hesaplayıcı'],
  ['Takım ömrü Calculator', 'Takım Ömrü Hesaplayıcı'],
  ['Birim maliyet Calculator', 'Birim Maliyet Hesaplayıcı'],
  ['birim Fiyat Calculator', 'Birim Fiyat Hesaplayıcı'],
  ['Hacimtric Ağırlık Calculator', 'Hacimsel Ağırlık Hesaplayıcı'],
  ['Warehouse Storage Maliyet Calculator', 'Depo Depolama Maliyet Hesaplayıcı'],
  ['Su kullanımı Calculator', 'Su Kullanım Hesaplayıcı'],
  ['Yakıt Tüketim Calculator', 'Yakıt Tüketim Hesaplayıcı'],
  ['Cabinet Maliyet Estimator', 'Dolap Maliyet Tahminleyici'],
  ['lazer Kesim Time Check', 'Lazer Kesim Süre Kontrolü'],
  ['Kare Meter Calculator', 'Metrekare Hesaplayıcı'],
  ['Araç amortismanı Calculator', 'Araç Amortisman Hesaplayıcı'],
  ['Kaynaking Maliyet Estimator', 'Kaynak Maliyet Tahminleyici'],
  ['Ogrenme Egrisi Ve parçai Sure Tahmin Calculator', 'Öğrenme Eğrisi ve Parti Süre Tahmin Hesaplayıcı'],
  ['başınasonel Devamsizlik Maliyeti Hesaplama', 'Personel Devamsızlık Maliyeti Hesaplama'],
  ['Ambaşına Kilowatt Kw Cevirici', 'Amper Kilowatt kW Çevirici'],
  ['Arac Bakim başınaiyodu Takip Hesaplama', 'Araç Bakım Periyodu Takip Hesaplama'],
  ['Titresim Frekans başınaiyot Hesaplama', 'Titresim Frekans Periyot Hesaplama'],
  ['Sofor Obaşınaator Gunluk Yevmiye Maliyeti', 'Şoför Operatör Günlük Yevmiye Maliyeti'],
  ['Lastik Omru Degisim km Hesaplama', 'Lastik Ömrü Değişim km Hesaplama'],
  ['işçilikatuvar Analiz Maliyeti Ve Numune Alma Optimizasyon Calculator', 'Laboratuvar Analiz Maliyeti ve Numune Alma Optimizasyon Hesaplayıcı'],
  ['Smed Hazırlık Suresi Ve Ekonomik parçai Calculator', 'SMED Hazırlık Süresi ve Ekonomik Parti Hesaplayıcı'],
  ['Takim Tutucu Ve Baglama Aparati Hazırlık Suresi Calculator', 'Takım Tutucu ve Bağlama Aparatı Hazırlık Süresi Hesaplayıcı'],
  ['Yedek Parca Stok Seviyesi Ve Durus riski Optimizasyon Calculator', 'Yedek Parça Stok Seviyesi ve Durma Riski Optimizasyon Hesaplayıcı'],
  ['Aql Kabul Orneklemesi risk Ve Maliyet Calculator', 'AQL Kabul Örneklemesi Risk ve Maliyet Hesaplayıcı'],
  ['Kritiklik risk Matrisi Ve Bakim StOranjisi Secim Calculator', 'Kritiklik Risk Matrisi ve Bakım Stratejisi Seçim Hesaplayıcı'],
  ['Urun Karmasi Karmasiklik Maliyeti Hidden Faktöry Calculator', 'Ürün Karması Karmaşıklık Maliyeti Gizli Fabrika Hesaplayıcı'],
  ['Tesis Yerlesimi Ve Malzeme Akis Mesafe Optimizasyon Calculator', 'Tesis Yerleşimi ve Malzeme Akış Mesafe Optimizasyon Hesaplayıcı'],
]);

// German replacements
const deReplacements = new Map([
  ['Änderungsauftrags-Folgen-Analyzer', 'Änderungsauftrags-Folgen-Analysator'],
  ['CNC-Angebotsrisiko-Analyzer', 'CNC-Angebotsrisiko-Analysator'],
  ['Ernteverlust-Analyzer', 'Ernteverlust-Analysator'],
  ['Ausbau-Angebotsrisiko-Analyzer', 'Ausbau-Angebotsrisiko-Analysator'],
  ['Routenoptimierungs-Analyzer', 'Routenoptimierungs-Analysator'],
  ['Schweiß-Angebotsrisiko-Analyzer', 'Schweiß-Angebotsrisiko-Analysator'],
  ['Molkerrei-Gewinn-Detektor', 'Milch-Gewinn-Detektor'],
]);

// French replacements
const frReplacements = new Map([
  // fr.json looks well translated, no EN fragments found
]);

// Spanish replacements
const esReplacements = new Map([
  // es.json looks well translated, no EN fragments found
]);

/**
 * Find ALL "title" and "summary" values within the inputGuide JSON section
 * and apply replacements using a Map of old->new strings.
 * Uses string-based replacement to avoid modifying JSON keys.
 */
function fixInputGuideTitles(content, replacements) {
  let result = content;
  
  // Find the inputGuide section and only work within it
  const inputGuideStart = result.indexOf('"inputGuide"');
  if (inputGuideStart === -1) return content;
  
  // For each replacement, find it only in title/summary values
  for (const [oldStr, newStr] of replacements) {
    // Only replace in value context: "title": "..." or "summary": "..."
    // We search for the exact string in the context of a value
    const escapedOld = oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`("(?:title|summary)"\\s*:\\s*")([^"]*${escapedOld}[^"]*)(")`, 'g');
    result = result.replace(regex, (match, prefix, value, suffix) => {
      const newValue = value.replace(oldStr, newStr);
      return prefix + newValue + suffix;
    });
  }
  
  return result;
}

function countMatches(content, patterns) {
  let count = 0;
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

console.log('=== Fixing English fragments in locale inputGuide sections ===\n');

// Process tr.json
console.log('Processing tr.json...');
let trContent = readFileSync(join(messagesDir, 'tr.json'), 'utf-8');
const trPatterns = [...trToolNames.keys(), ...trP6bReplacements.keys()];
const trBefore = countMatches(trContent, trPatterns);
trContent = fixInputGuideTitles(trContent, trToolNames);
trContent = fixInputGuideTitles(trContent, trP6bReplacements);
writeFileSync(join(messagesDir, 'tr.json'), trContent, 'utf-8');
const trAfter = countMatches(trContent, trPatterns);
console.log(`  EN fragments before: ${trBefore}, after: ${trAfter}, fixed: ${trBefore - trAfter}`);

// Process de.json
console.log('Processing de.json...');
let deContent = readFileSync(join(messagesDir, 'de.json'), 'utf-8');
const dePatterns = [...deReplacements.keys()];
const deBefore = countMatches(deContent, dePatterns);
deContent = fixInputGuideTitles(deContent, deReplacements);
writeFileSync(join(messagesDir, 'de.json'), deContent, 'utf-8');
const deAfter = countMatches(deContent, dePatterns);
console.log(`  EN fragments before: ${deBefore}, after: ${deAfter}, fixed: ${deBefore - deAfter}`);

// Process fr.json
console.log('Processing fr.json...');
let frContent = readFileSync(join(messagesDir, 'fr.json'), 'utf-8');
if (frReplacements.size > 0) {
  frContent = fixInputGuideTitles(frContent, frReplacements);
  writeFileSync(join(messagesDir, 'fr.json'), frContent, 'utf-8');
}
console.log('  No EN fragments found to fix in fr.json');

// Process es.json
console.log('Processing es.json...');
let esContent = readFileSync(join(messagesDir, 'es.json'), 'utf-8');
if (esReplacements.size > 0) {
  esContent = fixInputGuideTitles(esContent, esReplacements);
  writeFileSync(join(messagesDir, 'es.json'), esContent, 'utf-8');
}
console.log('  No EN fragments found to fix in es.json');

console.log('\n=== Fix complete ===\n');
