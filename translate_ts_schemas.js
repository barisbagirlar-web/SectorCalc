const fs = require('fs');
const path = require('path');

const dir = 'src/lib/features/premium-schema/schemas/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const translations = {
  "Chatter Yuzey Kalite Kaybi Analizi": "Chatter Surface Quality Loss Analyzer",
  "Cloud API Overrun Maliyet Analizi": "Cloud API Overrun Cost Analyzer",
  "Cloud israf Temizligi (Waste Elimination) Analizi": "Cloud Waste Elimination Analyzer",
  "CLV / CAC Orani Analizi": "CLV to CAC Ratio Analyzer",
  "Basincli Hava Sistemi Enerji Maliyet Analizi": "Compressed Air System Energy Cost Analyzer",
  "Kompresor Kacagi Maliyet": "Compressor Leak Cost Analyzer",
  "Beton Hacmi & Maliyet Analizi": "Concrete Volume & Cost Analyzer",
  "CPM Gecikme Cezasi & EOT Talep Analizi": "CPM Delay Penalty & EOT Claim Analyzer",
  "Mahsul Verim Kaybi Analizoru": "Crop Yield Loss Analyzer",
  "Kur Riski Analizi": "Currency Risk Analyzer",
  "Kesme-Dolgu Denge Analizi": "Cut and Fill Balance Analyzer",
  "Teslimat Maliyet Analizi": "Delivery Cost Analyzer",
  "Talep Tahmini Stok Maliyeti": "Demand Forecast Stock Cost Analyzer",
  "Digital Twin Maliyet & ROI Analizi": "Digital Twin Cost & ROI Analyzer",
  "Ariza Suresi Maliyet Analizi": "Downtime Cost Analyzer",
  "Dye Recete Maliyet Analizi": "Dye Recipe Cost Analyzer",
  "calisan Ciro (Turnover) Maliyet Analizi": "Employee Turnover Cost Analyzer",
  "Enerji Tuketim Raporu & PF Analizi": "Energy Consumption Report & PF Analyzer",
  "cevre Atik Maliyet & Dongusellik Analizi": "Environmental Waste Cost & Circularity Analyzer",
  "Fabrika Yerlesim Mesafe & Akis Analizi": "Factory Layout Distance & Flow Analyzer",
  "ilerleme Yem Maliyeti & FCR Analizi": "Feed Cost Formulation & FCR Analyzer",
  "Gubre Dozaj & Verim Optimizasyonu": "Fertilizer Dosage & Yield Optimization",
  "Filament Geri Donusum Ekonomisi Analizi": "Filament Recycling Economy Analyzer",
  "Yangin Hidranti Akis Analizi": "Fire Hydrant Flow Analyzer",
  "Esnek imalat (FMS) ROI Analizi": "Flexible Manufacturing (FMS) ROI Analyzer",
  "Gida Fire Marj & Verim Analizi": "Food Waste Margin & Yield Analyzer",
  "Navlun Maliyeti Analizi": "Freight Cost Analyzer",
  "Yakit Rota Sapma Maliyeti": "Fuel Route Drift Cost Analyzer",
  "Gage R&R & olcum Hata Maliyet Analizi": "Gage R&R & Measurement Error Cost Analyzer",
  "HACCP Sapma Maliyet & RPN Analizi": "HACCP Deviation Cost & RPN Analyzer",
  "Isi Degistirici Fouling & Enerji Kaybi Analizi": "Heat Exchanger Fouling & Energy Loss Analyzer",
  "Saatlik ucret Analizi": "Hourly Rate Analyzer",
  "HVAC Kapasite & Enerji Maliyet Analizi": "HVAC Capacity & Energy Cost Analyzer",
  "Hidrolik Sistem Kayip & Verim Analizi": "Hydraulic System Loss & Efficiency Analyzer",
  "Enflasyon Eskalasyon & NPV Analizi": "Inflation Escalation & NPV Analyzer",
  "Faiz Orani Riski & Hedge Analizi": "Interest Rate Risk & Hedge Analyzer",
  "Stok Devir Hizi ve Risk Analizi": "Inventory Turnover Risk Analyzer",
  "ic Verim Orani (IRR) & Yatirim Analizi": "Internal Rate of Return (IRR) & Investment Analyzer",
  "Sulama Maliyet Kontrolu": "Irrigation Cost Check Analyzer",
  "ISO 50001 Enerji Baz cizgisi & CUSUM Analizi": "ISO 50001 Energy Baseline & CUSUM Analyzer",
  "Kaizen Tasarruf Takipcisi & ROI Analizi": "Kaizen Savings Tracker & ROI Analyzer",
  "KWh Maliyet Analizi": "KWh Cost Analyzer",
  "ogrenme Egrisi ile Sure Analizi": "Learning Curve Time Analyzer",
  "Hafifletme Maliyet Tasarrufu Analizi": "Lightweight Cost Savings Analyzer",
  "Makine Ekonomik omru Analizi": "Machine Economic Life Analyzer",
  "Malzeme Replacement Maliyet Analizi": "Material Replacement Cost Analyzer",
  "MOQ Stok Denge Analizi": "MOQ Stock Balance Analyzer",
  "MTBF/MTTR Finansal Etki Analizi": "MTBF/MTTR Financial Impact Analyzer",
  "Noise & Vibration Maliyet Analizi": "Noise & Vibration Cost Analyzer",
  "Ofis Malzemeleri Maliyet Analizi": "Office Supplies Cost Analyzer",
  "Yenilenebilir Enerji IRR Analizi": "Renewable Energy IRR Analyzer",
  "SMED Degisim Matrisi & EBQ Analizi": "SMED Changeover Matrix & EBQ Analyzer",
  "Tekstil Atigi Risk Analizi": "Textile Waste Risk Analyzer",
  "Toplam calisan Maliyeti Analizi": "Total Employee Cost Analyzer",
  "Tasima Modu Risk ve Maliyet Analizi": "Transport Mode Risk and Cost Analyzer",
  "Vakum Kacagi Enerji Maliyeti": "Vacuum Leak Energy Cost Analyzer",
  "Arac Amortismani & TCO Analizi": "Vehicle Depreciation & TCO Analyzer",
  "Hacimsel Agirlik & Tasima Maliyet Analizi": "Volumetric Weight & Transport Cost Analyzer",
  "Depo Yerlesimi & Verimlilik Analizi": "Warehouse Layout & Efficiency Analyzer",
  "Su Kullanimi Optimizasyon Analizi": "Water Usage Optimization Analyzer",
  "Kaynak Maliyeti Detay Analizi": "Weld Cost Detail Analyzer",
  "Kaynak Mukavemeti Analizi": "Weld Strength Analyzer",
  "Kaynak Hacmi ve Maliyeti": "Weld Volume & Cost Analyzer",
  "Ruzgar Turbini Yatirim Analizi": "Wind Turbine Investment Analyzer",
  "WPS on Isitma Sicaklik Analizi": "WPS Preheat Temperature Analyzer"
};

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [tr, en] of Object.entries(translations)) {
    if (content.includes(`"${tr}"`)) {
      content = content.replace(new RegExp(`"${tr}"`, 'g'), `"${en}"`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
  }
}

console.log('Translated schema names in TS files.');
