import type { AppLocale } from "@/i18n/routing";

/**
 * Locale-aware overrides for premium calculator schemas.
 *
 * Schema definitions live in `src/lib/premium-schema/schemas/*` with English
 * `name` and `painStatement`. This module layers natural Turkish copy on top,
 * keyed by schema id. When an override is missing the catalog falls back to
 * the schema's English source, so adding a locale is purely additive.
 *
 * Only fields shown to end users on `/tr` industry hubs and analyzer vitrines
 * are localized: title (schema name) and painStatement.
 */

export interface LocalizedPremiumSchema {
  title?: string;
  painStatement?: string;
}

const TR_SCHEMAS: Record<string, LocalizedPremiumSchema> = {
  "logistics-route-loss": {
    title: "Lojistik Rota ve Boş Dönüş Kayıp Raporu",
    painStatement:
      "Boş dönüş kilometresi, yakıt sapması ve gecikmeler; yük kabul edilmeden önce nakliye marjını eritir.",
  },
  "logistics-fuel-route-drift": {
    title: "Yakıt ve Rota Sapma Analizi",
    painStatement:
      "Yakıt sapması, rölanti süresi ve rota kayması normal maliyet sayıldığında lojistik kârı sessizce erir.",
  },
  "energy-peak-cost": {
    title: "Enerji Tepe Yükü ve Verimlilik Kayıp Raporu",
    painStatement:
      "Tepe talep, fazla kWh ve tarife sapması; sayaç değerinin ötesinde faturayı şişirir.",
  },
  "energy-compressor-leak-cost": {
    title: "Kompresör Hava Kaçağı Maliyet Analizi",
    painStatement:
      "Sürekli kompresör kaçakları, görünür sebep olmadan kWh tüketimini ve enerji maliyetini artırır.",
  },
  "cnc-oee-loss": {
    title: "CNC OEE ve Süre Kaybı Raporu",
    painStatement:
      "Makine duruşu, fire ve çevrim süresi sapması; teklif kabul edilmeden önce kâr marjını siler.",
  },
  "cnc-tool-wear-cost": {
    title: "CNC Takım Aşınması Maliyet Analizi",
    painStatement:
      "Takım aşınması, takım değişim süresi ve soğutma sıvısı maliyeti; CNC iş kârını sessizce eritir.",
  },
  "calibration-drift-risk": {
    title: "Kalibrasyon Sapma Riski Analizi",
    painStatement:
      "Ölçüm sapması; sorun üretimde görünmeden önce fire, ret ve uyumsuzluk riski oluşturur.",
  },
  "sheet-metal-scrap-risk": {
    title: "Sac Metal Fire Riski Analizi",
    painStatement:
      "Sac metal işlerinde kesim firesi, büküm hatası ve finiş yeniden işlemi teklif öncesi fiyatlanmazsa kâr erir.",
  },
  "construction-project-overrun": {
    title: "İnşaat Proje Aşımı Analizi",
    painStatement:
      "İşçilik kayması, gecikme günleri ve malzeme aşımı uygulama öncesi fiyatlanmazsa inşaat projesi kârı kaybeder.",
  },
  "construction-subcontractor-margin-leak": {
    title: "Taşeron Marj Kaçağı Analizi",
    painStatement:
      "Taşeron tekliflerindeki sıkışma, ana yüklenicinin marjını sessizce daraltır ve sözleşme öncesi fark edilmez.",
  },
  "food-waste-margin-loss": {
    title: "Gıda Fire Marj Kaybı Hesaplayıcı",
    painStatement:
      "Fire, fazla porsiyon ve bozulma; satış raporlarına yansımadan önce gıda işletmesinin marjını eritebilir.",
  },
  "restaurant-menu-margin-leak": {
    title: "Restoran Menü Marj Kaçağı Analizi",
    painStatement:
      "Yüksek malzeme oranı, teslimat komisyonu ve fire; menü fiyatları doğru görünse bile restoran kârını eritir.",
  },
  "retail-inventory-turnover-risk": {
    title: "Perakende Stok Devir Riski Analizi",
    painStatement:
      "Yavaş stok, indirimler ve taşıma maliyeti birlikte ölçülmediğinde perakendeci nakit akışını kaybeder.",
  },
  "cloud-api-cost-overrun": {
    title: "Bulut API Maliyet Aşımı Analizi",
    painStatement:
      "Bulut ve API ürünleri; çağrı, token, depolama ve işlem gücü gelirden hızlı büyüdüğünde marj kaybeder.",
  },
  "plumbing-leak-callback-cost": {
    title: "Tesisat Geri Çağrı Maliyet Analizi",
    painStatement:
      "Sızıntı geri çağrıları, malzeme seferleri ve garanti ziyaretleri fiyatlanmazsa tesisat işi kârını kaybeder.",
  },
  "electrical-panel-rework-cost": {
    title: "Elektrik Pano Yeniden İşçilik Maliyet Analizi",
    painStatement:
      "Pano kablo işçiliği, test ve denetim ret kaynaklı yeniden çalışma saatleri fiyatlanmazsa elektrikçi kâr kaybeder.",
  },
  "warehouse-space-cost-leak": {
    title: "Depo Alan Maliyet Kaçağı Analizi",
    painStatement:
      "Kullanılmayan alan, yavaş paletler ve elleçleme sapması normal genel gider sayıldığında depo operasyonu kâr kaybeder.",
  },
  "dairy-feed-efficiency-loss": {
    title: "Süt Üretimi Yem Verimliliği Kayıp Analizi",
    painStatement:
      "Yem maliyeti, süt veriminden daha hızlı arttığında süt çiftliği kâr marjını kaybeder.",
  },
  "agriculture-irrigation-yield-loss": {
    title: "Sulama Verim Kaybı Analizi",
    painStatement:
      "Sulama kararları üretim öncesinde nem ve hava verisiyle modellenmediğinde tarla verim kaybı yaşar.",
  },
  "printing-reprint-margin-leak": {
    title: "Baskı Yeniden Üretim Marj Kaçağı Analizi",
    painStatement:
      "Yeniden baskı, tasarım revizyonu, mürekkep sapması ve montaj yeniden işçiliği baskı ve tabela işlerinde kâr kaybına yol açar.",
  },
  "textile-fabric-waste-risk": {
    title: "Tekstil Kumaş Fire Riski Analizi",
    painStatement:
      "Tekstil üretimi; kesim firesi, çekme, boya kaybı ve kumaş tüketim sapması üzerinden marj kaybeder.",
  },
  "auto-repair-comeback-cost": {
    title: "Oto Servis Geri Dönen İş Maliyet Analizi",
    painStatement:
      "Oto servisi; teşhis süresi, geri dönen iş oranı ve parça elleçleme maliyeti birlikte fiyatlanmazsa kârını kaybeder.",
  },
  "hvac-callback-margin-risk": {
    title: "HVAC Geri Çağrı Marj Riski Analizi",
    painStatement:
      "HVAC projelerinde devreye alma süresi ve geri çağrı riski fiyatlanmazsa proje marjı hızla daralır.",
  },
  "roofing-weather-delay-risk": {
    title: "Çatı İşi Hava Koşulu Gecikme Riski Analizi",
    painStatement:
      "Hava koşulu gecikmeleri, döküm ücretleri ve garanti rezervleri çatı sözleşme tekliflerinde marjı zorlar.",
  },
  "painting-rework-coverage-risk": {
    title: "Boya İşi Yeniden İşçilik ve Kaplama Riski Analizi",
    painStatement:
      "Boya işlerinde hazırlık yeniden işçiliği, iskele maliyeti ve kaplama sapması fiyatlanmazsa marj kaybedilir.",
  },
  "carbon-footprint-compliance-risk": {
    title: "Karbon Ayak İzi Uyum Riski Analizi",
    painStatement:
      "Süreç, enerji ve taşımacılıktan gelen karbon maliyeti uyum öncesi modellenmezse ihracat marjı kaybedilir.",
  },
  "legal-interest-fee-calculator-pro": {
    title: "Hukuki Faiz ve Masraf Maruziyet Analizi",
    painStatement:
      "Faiz, gecikme ve masraf maruziyeti birlikte özetlenmediğinde hukuki ve tahsilat dosyalarında karar netliği kaybolur.",
  },
};

const PREMIUM_SCHEMA_I18N: Partial<Record<AppLocale, Record<string, LocalizedPremiumSchema>>> = {
  tr: TR_SCHEMAS,
};

export function getLocalizedPremiumSchema(
  schemaId: string,
  locale: string,
): LocalizedPremiumSchema | undefined {
  return PREMIUM_SCHEMA_I18N[locale as AppLocale]?.[schemaId];
}
