import type { AppLocale } from "@/i18n/routing";
import {
  AR_SCHEMAS,
  DE_SCHEMAS,
  ES_SCHEMAS,
  FR_SCHEMAS,
} from "@/data/premium-schema-i18n-locales";

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
    title: "Yakıt ve Rota Sapma Hesaplayıcısı",
    painStatement:
      "Yakıt sapması, rölanti süresi ve rota kayması normal maliyet sayıldığında lojistik kârı sessizce erir.",
  },
  "energy-peak-cost": {
    title: "Enerji Tepe Yükü ve Verimlilik Kayıp Raporu",
    painStatement:
      "Tepe talep, fazla kWh ve tarife sapması; sayaç değerinin ötesinde faturayı şişirir.",
  },
  "energy-compressor-leak-cost": {
    title: "Kompresör Hava Kaçağı Maliyet Hesaplayıcısı",
    painStatement:
      "Sürekli kompresör kaçakları, görünür sebep olmadan kWh tüketimini ve enerji maliyetini artırır.",
  },
  "cnc-oee-loss": {
    title: "CNC OEE ve Süre Kaybı Raporu",
    painStatement:
      "Makine duruşu, fire ve çevrim süresi sapması; teklif kabul edilmeden önce kâr marjını siler.",
  },
  "cnc-tool-wear-cost": {
    title: "CNC Takım Aşınması Maliyet Hesaplayıcısı",
    painStatement:
      "Takım aşınması, takım değişim süresi ve soğutma sıvısı maliyeti; CNC iş kârını sessizce eritir.",
  },
  "calibration-drift-risk": {
    title: "Kalibrasyon Sapma Riski Hesaplayıcısı",
    painStatement:
      "Ölçüm sapması; sorun üretimde görünmeden önce fire, ret ve uyumsuzluk riski oluşturur.",
  },
  "sheet-metal-scrap-risk": {
    title: "Sac Metal Fire Riski Hesaplayıcısı",
    painStatement:
      "Sac metal işlerinde kesim firesi, büküm hatası ve finiş yeniden işlemi teklif öncesi fiyatlanmazsa kâr erir.",
  },
  "construction-project-overrun": {
    title: "İnşaat Proje Aşımı Hesaplayıcısı",
    painStatement:
      "İşçilik kayması, gecikme günleri ve malzeme aşımı uygulama öncesi fiyatlanmazsa inşaat projesi kârı kaybeder.",
  },
  "construction-subcontractor-margin-leak": {
    title: "Taşeron Marj Kaçağı Hesaplayıcısı",
    painStatement:
      "Taşeron tekliflerindeki sıkışma, ana yüklenicinin marjını sessizce daraltır ve sözleşme öncesi fark edilmez.",
  },
  "food-waste-margin-loss": {
    title: "Gıda Fire Marj Kaybı Hesaplayıcı",
    painStatement:
      "Fire, fazla porsiyon ve bozulma; satış raporlarına yansımadan önce gıda işletmesinin marjını eritebilir.",
  },
  "restaurant-menu-margin-leak": {
    title: "Restoran Menü Marj Kaçağı Hesaplayıcısı",
    painStatement:
      "Yüksek malzeme oranı, teslimat komisyonu ve fire; menü fiyatları doğru görünse bile restoran kârını eritir.",
  },
  "retail-inventory-turnover-risk": {
    title: "Perakende Stok Devir Riski Hesaplayıcısı",
    painStatement:
      "Yavaş stok, indirimler ve taşıma maliyeti birlikte ölçülmediğinde perakendeci nakit akışını kaybeder.",
  },
  "cloud-api-cost-overrun": {
    title: "Bulut API Maliyet Aşımı Hesaplayıcısı",
    painStatement:
      "Bulut ve API ürünleri; çağrı, token, depolama ve işlem gücü gelirden hızlı büyüdüğünde marj kaybeder.",
  },
  "plumbing-leak-callback-cost": {
    title: "Tesisat Geri Çağrı Maliyet Hesaplayıcısı",
    painStatement:
      "Sızıntı geri çağrıları, malzeme seferleri ve garanti ziyaretleri fiyatlanmazsa tesisat işi kârını kaybeder.",
  },
  "electrical-panel-rework-cost": {
    title: "Elektrik Pano Yeniden İşçilik Maliyet Hesaplayıcısı",
    painStatement:
      "Pano kablo işçiliği, test ve denetim ret kaynaklı yeniden çalışma saatleri fiyatlanmazsa elektrikçi kâr kaybeder.",
  },
  "warehouse-space-cost-leak": {
    title: "Depo Alan Maliyet Kaçağı Hesaplayıcısı",
    painStatement:
      "Kullanılmayan alan, yavaş paletler ve elleçleme sapması normal genel gider sayıldığında depo operasyonu kâr kaybeder.",
  },
  "dairy-feed-efficiency-loss": {
    title: "Süt Üretimi Yem Verimliliği Kayıp Hesaplayıcısı",
    painStatement:
      "Yem maliyeti, süt veriminden daha hızlı arttığında süt çiftliği kâr marjını kaybeder.",
  },
  "agriculture-irrigation-yield-loss": {
    title: "Sulama Verim Kaybı Hesaplayıcısı",
    painStatement:
      "Sulama kararları üretim öncesinde nem ve hava verisiyle modellenmediğinde tarla verim kaybı yaşar.",
  },
  "printing-reprint-margin-leak": {
    title: "Baskı Yeniden Üretim Marj Kaçağı Hesaplayıcısı",
    painStatement:
      "Yeniden baskı, tasarım revizyonu, mürekkep sapması ve montaj yeniden işçiliği baskı ve tabela işlerinde kâr kaybına yol açar.",
  },
  "textile-fabric-waste-risk": {
    title: "Tekstil Kumaş Fire Riski Hesaplayıcısı",
    painStatement:
      "Tekstil üretimi; kesim firesi, çekme, boya kaybı ve kumaş tüketim sapması üzerinden marj kaybeder.",
  },
  "auto-repair-comeback-cost": {
    title: "Oto Servis Geri Dönen İş Maliyet Hesaplayıcısı",
    painStatement:
      "Oto servisi; teşhis süresi, geri dönen iş oranı ve parça elleçleme maliyeti birlikte fiyatlanmazsa kârını kaybeder.",
  },
  "hvac-callback-margin-risk": {
    title: "HVAC Geri Çağrı Marj Riski Hesaplayıcısı",
    painStatement:
      "HVAC projelerinde devreye alma süresi ve geri çağrı riski fiyatlanmazsa proje marjı hızla daralır.",
  },
  "roofing-weather-delay-risk": {
    title: "Çatı İşi Hava Koşulu Gecikme Riski Hesaplayıcısı",
    painStatement:
      "Hava koşulu gecikmeleri, döküm ücretleri ve garanti rezervleri çatı sözleşme tekliflerinde marjı zorlar.",
  },
  "painting-rework-coverage-risk": {
    title: "Boya İşi Yeniden İşçilik ve Kaplama Riski Hesaplayıcısı",
    painStatement:
      "Boya işlerinde hazırlık yeniden işçiliği, iskele maliyeti ve kaplama sapması fiyatlanmazsa marj kaybedilir.",
  },
  "carbon-footprint-compliance-risk": {
    title: "Karbon Ayak İzi Uyum Riski Hesaplayıcısı",
    painStatement:
      "Süreç, enerji ve taşımacılıktan gelen karbon maliyeti uyum öncesi modellenmezse ihracat marjı kaybedilir.",
  },
  "legal-interest-fee-calculator-pro": {
    title: "Hukuki Faiz ve Masraf Maruziyet Hesaplayıcısı",
    painStatement:
      "Faiz, gecikme ve masraf maruziyeti birlikte özetlenmediğinde hukuki ve tahsilat dosyalarında karar netliği kaybolur.",
  },
  "quote-price-profit-margin-calculator": {
    title: "Fiyat Teklif Sihirbazı",
    painStatement:
      "Tekliflerde fire, kurulum süresi, vade maliyeti ve enerji yükü sıkça atlanır; marj buna göre incelir.",
  },
  "shop-rate-hourly-cost-calculator": {
    title: "Makine Saat Ücreti Hesaplayıcı",
    painStatement:
      "Atölyelerin çoğu shop rate'i yalnızca işçilik ve elektrikle hesaplar; gerçek yük eksik kalır.",
  },
  "break-even-safety-margin-calculator": {
    title: "Başabaş Noktası ve Güvenlik Marjı Hesaplayıcı",
    painStatement:
      "İşletmeler kâr/zararı çoğu zaman ay sonu tabloları gelince öğrenir.",
  },
  "auto-repair-parts-labor-quote-calculator": {
    title: "Tamirhane Parça ve İşçilik Teklif Hesaplayıcı",
    painStatement:
      "Tamir teklifleri ustaya göre değişir; fiyat tutarlılığı zorlaşır.",
  },
  "cbam-unit-product-carbon-footprint-calculator": {
    title: "SKDM Birim Ürün Karbon Ayak İzi Hesaplayıcı",
    painStatement:
      "İhracatçılar ürün bazlı karbon kanıtına ihtiyaç duyar; uygun araç azdır.",
  },
  "cbam-exposure-quick-check": {
    title: "CBAM Maruziyet Hızlı Kontrol",
    painStatement:
      "Gömülü emisyon, sertifika fiyatı ve kur birleştirilmezse CBAM maliyeti eksik kalır.",
  },
  "cbam-compliance-verdict": {
    title: "CBAM Uyum Hazırlık Değerlendirmesi",
    painStatement:
      "Beyan edilen emisyon, sertifika kapsamı ve veri tamlığı birlikte ölçülmezse CBAM hazırlık riski geç fark edilir.",
  },
  "oee-equipment-effectiveness-calculator": {
    title: "OEE Hesaplayıcı",
    painStatement:
      "OEE takibi olmadan kronik duruş ve kalite kaybı görünmez kalır.",
  },
  "compressor-leak-cost-calculator": {
    title: "Kompresör Kaçağı Maliyet Hesaplayıcı",
    painStatement:
      "Basınçlı hava kaçakları elektriği görünmez üretim maliyetine çevirir.",
  },
  "employee-total-cost-calculator": {
    title: "Personel Tam Maliyet Hesaplayıcı",
    painStatement:
      "İşe alım ve fiyatlama kararlarında net maaş kullanılır; tam maliyet eksik kalır.",
  },
  "downtime-minute-cost-calculator": {
    title: "Duruş Dakika Maliyeti Hesaplayıcı",
    painStatement:
      "Bakım bütçeleri makinenin üretmediği fırsat maliyetini yok sayar.",
  },
  "product-customer-profitability-calculator": {
    title: "Ürün ve Müşteri Kârlılığı Hesaplayıcı",
    painStatement:
      "Yüksek cirolu müşteriler iade, gecikme ve rework ile marjı eritebilir.",
  },
  "inventory-carrying-cost-eoq-calculator": {
    title: "Stok Taşıma Maliyeti ve EOQ Hesaplayıcı",
    painStatement:
      "Stok maliyeti yalnızca depo kirası sayıldığında eksik kalır.",
  },
  "welded-bolted-connection-calculator": {
    title: "Kaynaklı ve Bulonlu Bağlantı Hesaplayıcı",
    painStatement:
      "Bağlantı boyutlandırması hızlı kontrol olmadan sezgiye kalır.",
  },
  "tolerance-stack-up-calculator": {
    title: "Tolerans Yığılma Hesaplayıcı",
    painStatement:
      "Uyumsuzluklar çoğu zaman belgelenmiş zincir kontrolü olmadan birikir.",
  },
  "bolt-tightening-torque-calculator": {
    title: "Civata Sıkma Torku Hesaplayıcı",
    painStatement:
      "Montaj ekipleri belgelenmiş sıkma yöntemi olmadan tork tahmin eder.",
  },
  "fire-system-flow-hydrant-calculator": {
    title: "Yangın Tesisatı Debi ve Hidrant Hesaplayıcı",
    painStatement:
      "Yangın koruma tekliflerinde debi ihtiyacı hidrant boyutlandırmadan önce atlanır.",
  },
  "hydraulic-pneumatic-cylinder-force-calculator": {
    title: "Hidrolik ve Pnömatik Silindir Kuvvet Hesaplayıcı",
    painStatement:
      "Silindir seçimi basınç ve alan hesabı olmadan yapıldığında kapasite riski oluşur.",
  },
  "quality-cost-paf-calculator": {
    title: "Kalite Maliyeti PAF Hesaplayıcı",
    painStatement:
      "Kalite bütçeleri hata maliyetleri yükselene kadar önleme ve değerlendirme kalemlerini gizler.",
  },
  "pressure-vessel-wall-thickness-calculator": {
    title: "Basınçlı Kap Cidar Kalınlığı Hesaplayıcı",
    painStatement:
      "Basınçlı kap tasarım taraması basınç ve çap verisi olmadan ilerler.",
  },
  "value-stream-map-vsm-calculator": {
    title: "Değer Akış Haritası VSM Hesaplayıcı",
    painStatement:
      "Lead time ve bekleme süreleri birlikte ölçülmediğinde VSM iyileştirmesi eksik kalır.",
  },
  "energy-savings-package-calculator": {
    title: "Enerji Tasarruf Hesaplayıcı",
    painStatement:
      "Verimlilik projeleri tasarruf ve geri ödeme tabanı olmadan onaylanır.",
  },
  "investment-payback-npv-calculator": {
    title: "Yatırım Geri Dönüş ve NPV Hesaplayıcı",
    painStatement:
      "Yatırım talepleri iskonto oranı ve ufuk olmadan yalnızca geri ödeme gösterir.",
  },
  "annual-leave-severance-notice-calculator": {
    title: "Yıllık İzin, Kıdem ve İhbar Tazminatı Hesaplayıcı",
    painStatement:
      "İşten çıkış maliyetleri bordro ve hukuk incelemesine gelene kadar eksik kalır.",
  },
  "belt-pulley-speed-length-calculator": {
    title: "Kayış Kasnak Devir ve Uzunluk Hesaplayıcı",
    painStatement:
      "Tahrik değişiklikleri belgelenmiş hız ve kayış uzunluğu olmadan yapılır.",
  },
  "3d-print-job-margin-tool": {
    title: "Route & Freight Loss Hesaplayıcı",
    painStatement:
      "Ölçüm sapması; sorun üretimde görünmeden önce fire, ret ve uyumsuzluk riski oluşturur.",
  },
  "auto-shop-margin-leak-detector": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Oto servisi; teşhis süresi, geri dönen iş oranı ve parça elleçleme maliyeti birlikte fiyatlanmazsa kârını kaybeder.",
  },
  "change-order-impact-analyzer": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "İşçilik kayması, gecikme günleri ve malzeme aşımı uygulama öncesi fiyatlanmazsa inşaat projesi kârı kaybeder.",
  },
  "cnc-quote-risk-analyzer": {
    title: "Loan Payment Hesaplayıcı",
    painStatement:
      "Makine duruşu, fire ve çevrim süresi sapması; teklif kabul edilmeden önce kâr marjını siler.",
  },
  "crop-yield-loss-analyzer": {
    title: "Route & Freight Loss Hesaplayıcı",
    painStatement:
      "Sulama kararları üretim öncesinde nem ve hava verisiyle modellenmediğinde tarla verim kaybı yaşar.",
  },
  "dairy-profit-detector": {
    title: "Route & Freight Loss Hesaplayıcı",
    painStatement:
      "Yem maliyeti, süt veriminden daha hızlı arttığında süt çiftliği kâr marjını kaybeder.",
  },
  "doviz-pozisyonu-kur-farki-riski-hesabi": {
    title: "Amper — Kilowatt (KW) Converter",
    painStatement:
      "Yakıt sapması, rölanti süresi ve rota kayması normal maliyet sayıldığında lojistik kârı sessizce erir.",
  },
  "feed-efficiency-analyzer": {
    title: "Route & Freight Loss Hesaplayıcı",
    painStatement:
      "Yem maliyeti, süt veriminden daha hızlı arttığında süt çiftliği kâr marjını kaybeder.",
  },
  "heat-loss-calculator": {
    title: "Age Hesaplayıcı",
    painStatement:
      "Tepe talep, fazla kWh ve tarife sapması; sayaç değerinin ötesinde faturayı şişirir.",
  },
  "hvac-project-margin-guard": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "HVAC projelerinde devreye alma süresi ve geri çağrı riski fiyatlanmazsa proje marjı hızla daralır.",
  },
  "landscaping-contract-profit-tool": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Hava koşulu gecikmeleri, döküm ücretleri ve garanti rezervleri çatı sözleşme tekliflerinde marjı zorlar.",
  },
  "material-waste-calculator": {
    title: "Age Hesaplayıcı",
    painStatement:
      "Fire, fazla porsiyon ve bozulma; satış raporlarına yansımadan önce gıda işletmesinin marjını eritebilir.",
  },
  "meal-planning-verdict": {
    title: "Route & Freight Loss Hesaplayıcı",
    painStatement:
      "Fire, fazla porsiyon ve bozulma; satış raporlarına yansımadan önce gıda işletmesinin marjını eritebilir.",
  },
  "menu-profit-leak-detector": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Yüksek malzeme oranı, teslimat komisyonu ve fire; menü fiyatları doğru görünse bile restoran kârını eritir.",
  },
  "millwork-bid-risk-analyzer": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Tekstil üretimi; kesim firesi, çekme, boya kaybı ve kumaş tüketim sapması üzerinden marj kaybeder.",
  },
  "office-cleaning-bid-optimizer": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Kullanılmayan alan, yavaş paletler ve elleçleme sapması normal genel gider sayıldığında depo operasyonu kâr kaybeder.",
  },
  "painting-job-profit-verdict": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Boya işlerinde hazırlık yeniden işçiliği, iskele maliyeti ve kaplama sapması fiyatlanmazsa marj kaybedilir.",
  },
  "panel-shop-margin-verdict": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Pano kablo işçiliği, test ve denetim ret kaynaklı yeniden çalışma saatleri fiyatlanmazsa elektrikçi kâr kaybeder.",
  },
  "plumbing-job-margin-verdict": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Sızıntı geri çağrıları, malzeme seferleri ve garanti ziyaretleri fiyatlanmazsa tesisat işi kârını kaybeder.",
  },
  "profit-margin-calculator": {
    title: "Loan Payment Hesaplayıcı",
    painStatement:
      "Tekliflerde fire, kurulum süresi, vade maliyeti ve enerji yükü sıkça atlanır; marj buna göre incelir.",
  },
  "return-profit-erosion-tool": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Bulut ve API ürünleri; çağrı, token, depolama ve işlem gücü gelirden hızlı büyüdüğünde marj kaybeder.",
  },
  "roofing-contract-margin-guard": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Taşeron tekliflerindeki sıkışma, ana yüklenicinin marjını sessizce daraltır ve sözleşme öncesi fark edilmez.",
  },
  "route-optimization-analyzer": {
    title: "Route & Freight Loss Hesaplayıcı",
    painStatement:
      "Boş dönüş kilometresi, yakıt sapması ve gecikmeler; yük kabul edilmeden önce nakliye marjını eritir.",
  },
  "scrap-rate-calculator": {
    title: "Age Hesaplayıcı",
    painStatement:
      "Sac metal işlerinde kesim firesi, büküm hatası ve finiş yeniden işlemi teklif öncesi fiyatlanmazsa kâr erir.",
  },
  "sheet-metal-quote-risk-tool": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Sac metal işlerinde kesim firesi, büküm hatası ve finiş yeniden işlemi teklif öncesi fiyatlanmazsa kâr erir.",
  },
  "signage-bid-safe-price-tool": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Yeniden baskı, tasarım revizyonu, mürekkep sapması ve montaj yeniden işçiliği baskı ve tabela işlerinde kâr kaybına yol açar.",
  },
  "water-optimization-verdict": {
    title: "Route & Freight Loss Hesaplayıcı",
    painStatement:
      "Yavaş stok, indirimler ve taşıma maliyeti birlikte ölçülmediğinde perakendeci nakit akışını kaybeder.",
  },
  "welding-bid-risk-analyzer": {
    title: "Concrete / Project Cost Hesaplayıcı",
    painStatement:
      "Takım aşınması, takım değişim süresi ve soğutma sıvısı maliyeti; CNC iş kârını sessizce eritir.",
  },
  "7-israf-muda-avcisi-parasal-karsilik-calculator": {
    title: "7 İsraf (Muda) Avcısı Parasal Karşılık Hesaplayıcı",
    painStatement:
      "Üretim, bekleme, taşıma, stok, hareket, hata ve fazla işlem kaynaklı kayıpların dönemsel parasal etkisini hesaplar.",
  },
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": {
    title: "5S Denetim Skoru - Verimlilik Kaybı Maliyet Dönüştürücü",
    painStatement:
      "5S puanının parasal karşılığı bilinmez; iyileştirme önceliği verilemez ve kayıp görünmez kalır.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "3B Baskı Destek Yapısı ve Post-Proses Maliyet Hesaplayıcı",
    painStatement:
      "Destek malzemesi ve temizleme işçiliği maliyete eklenmez; teklif marjı sessizce erir.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "3B Baskı Parti Optimizasyonu ve Yuvalama Hesaplayıcı",
    painStatement:
      "Tablaya kaç parça sığacağı optimize edilmez; makine kapasitesi boşa harcanır.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "3B Baskı vs. Talaşlı İmalat Başabaş Noktası Hesaplayıcı",
    painStatement:
      "Hangi adette hangi yöntemin ekonomik olduğu bilinmez; yanlış üretim yöntemi seçilir.",
  },
};

const PREMIUM_SCHEMA_I18N: Partial<Record<AppLocale, Record<string, LocalizedPremiumSchema>>> = {
  tr: TR_SCHEMAS,
  de: DE_SCHEMAS,
  fr: FR_SCHEMAS,
  es: ES_SCHEMAS,
  ar: AR_SCHEMAS,
};

/** Slugs with localized premium-schema vitrine copy (live premium-schema routes). */
export const PREMIUM_SCHEMA_LOCALIZED_SLUGS: ReadonlySet<string> = new Set(Object.keys(TR_SCHEMAS));

export function getLocalizedPremiumSchema(
  schemaId: string,
  locale: string,
): LocalizedPremiumSchema | undefined {
  return PREMIUM_SCHEMA_I18N[locale as AppLocale]?.[schemaId];
}
