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
  "irr-quick-check": {
    title: "İç Verim Oranı Hızlı Kontrol",
    painStatement: "Yatırım araçları, işaret değişiklikleriyle modelleme yapılmadığında nakit akışını gizlice tahrip edebilir.",
  },
  "npv-quick-check": {
    title: "NBD Hızlı Kontrol",
    painStatement: "Proje NBD'si risk olasılıkları ve terminal değeri dikkate alınmadığında yanıltıcı olabilir.",
  },
  "dcf-valuation-check": {
    title: "İNA Değerleme Hızlı Kontrol",
    painStatement: "Basit çarpanlarla işletme değerlemesi gerçek kurumsal değeri ıskalayabilir; WACC ile İNA altın standarttır.",
  },
  "lease-vs-buy-check": {
    title: "Kiralama vs Satın Alma Hızlı Kontrol",
    painStatement: "Vergi kalkanı ve hurda değeri dikkate alınmadan yapılan ekipman kiralama/satın alma kararları sermayeyi yanlış tahsis edebilir.",
  },
  "pressure-drop-quick": {
    title: "Boru Basınç Düşümü Hızlı Kontrol",
    painStatement: "Küçük boyutlandırılmış borular büyük pompa enerji kaybına ve debi yetersizliğine yol açar.",
  },
  "heat-exchanger-quick": {
    title: "Isı Değiştirici Hızlı Tahmin",
    painStatement: "Isı değiştirici küçük boyutlandırması proses darboğazlarına neden olur.",
  },
  "oee-quick-check": {
    title: "OEE Hızlı Kontrol",
    painStatement: "Gizli duruş ve hız kayıpları tek bir sayaçta görünmeden etkin kapasiteyi %40 oranında düşürebilir.",
  },
  "line-balancing-quick": {
    title: "Hat Dengeleme Hızlı Kontrol",
    painStatement: "Dengesiz montaj hatları, standart verimlilik metriklerinin gözden kaçırdığı YİP darboğazları ve bekleme israfı yaratır.",
  },
  "standard-time-quick": {
    title: "Standart Süre Hızlı Kontrol",
    painStatement: "Değerleme ve tolerans ayarlaması yapılmadan gözlemlenen sürelere güvenmek kronik eksik personel ve maliyet aşımlarına yol açar.",
  },
  "learning-curve-quick": {
    title: "Öğrenme Eğrisi Hızlı Kontrol",
    painStatement: "Öğrenme eğrisi modellenmeden uzun vadeli birim maliyet projeksiyonları gerçeğin %30-50 üzerinde olabilir.",
  },
  "spring-design-quick": {
    title: "Yay Tasarımı Hızlı Kontrol",
    painStatement: "Güvenlik kritik uygulamalarda yay arızası felaketle sonuçlanabilir; Wahl düzeltmesi ve burkulma kontrolü zorunludur.",
  },
  "carbon-footprint-scope123": {
    title: "Karbon Ayak İzi Hızlı Kontrol",
    painStatement: "Kapsam 3 olmadan karbon raporlaması gerçek maruziyeti %70-90 oranında eksik tahmin eder.",
  },
  "regression-quick-check": {
    title: "Regresyon Hızlı Kontrol",
    painStatement: "Basit ortalamalar proses trendlerini gizler; R², F-testi ve anlamlılık ile OLS regresyonu veri odaklı kararlar için minimum standarttır.",
  },
  "sample-size-quick": {
    title: "Örneklem Büyüklüğü Hızlı Kontrol",
    painStatement: "Düşük güçlü çalışmalar kaynak israf eder ve gerçek etkileri kaçırır; doğru güç analizi hem Tip I hem Tip II hataları önler.",
  },
  "anova-quick-check": {
    title: "ANOVA Hızlı Kontrol",
    painStatement: "Birden fazla grup ortalamasını ANOVA olmadan karşılaştırmak Tip I hatasını şişirir.",
  },
  "roi-quick-check": {
    title: "YG Hızlı Kontrol",
    painStatement: "Geri ödeme süresi, İVH ve NBD olmadan yalnızca YG'ye dayanmak sermaye yanlış tahsisine yol açabilir.",
  },
  "belt-pulley-quick": {
    title: "Kayış-Kasnak Hızlı Kontrol",
    painStatement: "Yanlış kasnak oranı veya kayış kayması motor aşırı yüklenmesine, makine ömrünün kısalmasına ve enerji israfına neden olabilir.",
  },
  "hydraulic-cylinder-quick": {
    title: "Hidrolik Silindir Hızlı Kontrol",
    painStatement: "Hidrolik silindir mili burkulması felaketle sonuçlanabilir; uzun stroklu tasarımlarda SF≥3,5 ile Euler burkulması zorunludur.",
  },
  "7-israf-muda-avcisi-parasal-karsilik-calculator": {
    title: "7 İsraf (Muda) Avcısı Parasal Karşılık Hesaplayıcı",
    painStatement:
      "7 temel Yalın israfın (Muda) parasal etkisini ölçer — fazla üretim, bekleme, taşıma, stok, gereksiz hareket, fazla işlem ve hatalar — operasyonel verimsizlikleri yönetimin harekete geçebileceği doğrudan finansal terimlere dönüştürür.\n\nGeleneksel israf takibi, kusur saymak veya duruş saatlerini ölçmekle sınırlı kalır. Bu araç her israf kategorisini dönemsel maliyete, yıllık kayba, gelire orana ve risk ayarlı öncelik puanına dönüştürür. Hangi Muda kategorisinin en pahalı olduğunu ve kaizenin en yüksek getiriyi nerede sağlayacağını sıralar.\n\nÖrnek: 50 fazla üretim birimi, 20 saat bekleme ve 15 hatalı ürünü olan bir fabrika, bekleme ve hataların 28.500$ toplam israf maliyetinin %62'sini oluşturduğunu keşfeder. Araç, 4.2/5 risk ayarlı puanla hata azaltmayı önceliklendirir ve 17.700$ yıllık tasarruf öngörür.\n\nÜretim müdürleri, Yalın koordinatörleri ve fabrika direktörleri, Muda'yı yönetim kurulu hazır finansal metriklerine dönüştürmek, iyileştirme yatırımlarını YG'ye göre önceliklendirmek ve ardışık dönemlerde israf-gelir oranı düşüşünü izlemek için bu analizörü kullanır.",
  },
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": {
    title: "5S Denetim Skoru - Verimlilik Kaybı Maliyet Dönüştürücü",
    painStatement:
      "5S denetim puanlarını, işyeri düzensizliği, arama süresi ve verimsiz iş akışlarından kaynaklanan gerçek dolar kayıplarına dönüştürür; işyeri organizasyonunun finansal gerekçesini yönetime görünür kılar.\n\nÇoğu fabrika 5S puanlarını takip eder ancak \"Düşük 5S puanı nedeniyle ne kadar para kaybediyoruz?\" sorusunu yanıtlayamaz. Bu araç, mevcut ve hedef 5S puanı arasındaki farka dayalı verimlilik kaybı yüzdesini modeller ve toplam işgücü kapasite maliyetiyle çarparak zayıf işyeri organizasyonunun aylık finansal yükünü ortaya çıkarır.\n\nÖrnek: 50 çalışanı, 38/100 mevcut 5S puanı, 87/100 hedefi ve saat başına 35$ işgücü maliyeti olan bir departman aylık 34.496$ verimlilik kaybı keşfeder. Hedef puana iyileştirme aylık 25.168$ geri kazandırır — 302.000$ yıllık fırsat.\n\nYalın yöneticileri, üretim amirleri ve sürekli iyileştirme ekipleri, 5S girişimlerinin YG'sini kanıtlamak, veri odaklı iyileştirme hedefleri belirlemek ve işyeri organizasyonu değerini yönetimin anladığı finansal terimlerle iletmek için bu dönüştürücüyü kullanır.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "3B Baskı Destek Yapısı ve Post-Proses Maliyet Hesaplayıcı",
    painStatement:
      "3B baskı parçalar için destek yapıları ve işlem sonrası işçiliğin toplam maliyetini hesaplar; eklemeli imalat tekliflerinde rutin olarak atlanan gizli giderleri ortaya çıkarır.\n\nEklemeli imalat maliyet tahminleri genellikle baskı süresi ve model malzemesine odaklanır, destek malzemesi tüketimini, çıkarma işçiliğini ve yüzey bitirmeyi göz ardı eder. Bu araç, destek hacmi maliyeti, çıkarma işçiliği ve parti işlem sonrası maliyetini toplar ve genellikle görünür parça maliyetine %30-60 ekler.\n\nÖrnek: 20 cm³ destek hacmi, 0,05$/cm³ malzeme maliyeti ve 15 dakika temizlik süresi olan bir parçanın toplam işlem sonrası maliyeti 12,25$'dır. 10 parçalık bir partide parça başı sadece 1,23$ eklenir. Ancak 60 cm³ destek ve 45 dakika temizlik ile tek parçalık bir parti 46,50$'a yükselir — genellikle baskı maliyetinin üzerinde.\n\nEklemeli imalat mühendisleri, atölye sahipleri ve teklif uzmanları, eksiksiz maliyet modelleri oluşturmak, minimum destek için parça yönlendirmesini optimize etmek ve her teklifin işlem sonrası tüm maliyetleri kapsamasını sağlamak için bu hesaplayıcıyı kullanır.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "3B Baskı Parti Optimizasyonu ve Yuvalama Hesaplayıcı",
    painStatement:
      "Sınırlayıcı kutu boyutları, tabla boyutu ve yuvalama verimliliğine dayalı olarak parti başına maksimum parça sayısını hesaplayarak 3B yazıcı tabla kullanımını optimize eder; kullanım yüzdelerini parça başı maliyete dönüştürür.\n\nTabla kullanımı, eklemeli imalat karlılığı için en büyük kaldıraçtır ancak çoğu operatör bunu göz kararıyla tahmin eder. Bu araç, tam dikdörtgen yuvalama uyumunu, kullanım yüzdesini ve parça başı makine saatini hesaplar; verimsiz tabla paketlemenin gerçek maliyet etkisini ortaya çıkarır.\n\nÖrnek: 200×200 mm tabla, 50×50 mm parçalarla 8 saat baskıda 12 parça sığdırarak %75 kullanım sağlar. Her parça 0,67 makine saati tüketir. Sadece 8 parça sığdıran zayıf yuvalama, makine saatini parça başı 1,0 saate çıkarır — marjı doğrudan azaltan %50 maliyet artışı.\n\nEklemeli imalat mühendisleri ve üretim planlamacıları, parti boyutunu maksimize etmek, parça başı makine maliyetlerini azaltmak ve baskı yönü ile çok parçalı yuvalama stratejisi hakkında veri odaklı kararlar almak için bu optimize ediciyi kullanır.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "3B Baskı vs. Talaşlı İmalat Başabaş Noktası Hesaplayıcı",
    painStatement:
      "Her iki üretim yöntemi için kurulum maliyetleri ve birim maliyetlerin başabaş analizini kullanarak, 3B baskının CNC işlemeye (veya tersi) hangi üretim miktarında daha ekonomik olduğunu belirler.\n\nEklemeli imalat ile talaşlı imalat arasında seçim yapmak, modern üretimdeki en yaygın kararlardan biridir. Veri odaklı karşılaştırma olmadan ekipler alışkanlığa göre hareket eder — yüksek hacimlerde eklemeli veya düşük hacimlerde talaşlı imalat için fazla ödeme yapar. Bu araç, geçiş miktarını, toplam maliyet eğrilerini ve belirtilen herhangi bir hacimdeki maliyet farkını hesaplar.\n\nÖrnek: 3B baskı 100$ kurulum ve parça başı 5$; işleme 500$ kurulum ve parça başı 2$ ile başabaş miktarı 134 parçadır. 134 birimin altında baskı daha ucuzdur; üstünde işleme kazanır. 100 birimde baskı 600$'a karşılık işleme 700$ tutar.\n\nİmalat mühendisleri, üretim planlamacıları ve tedarik yöneticileri, herhangi bir üretim miktarı için en uygun maliyetli üretim sürecini objektif olarak seçmek, tahminleri ortadan kaldırmak ve parça başı maliyetleri azaltmak için bu başabaş analizörünü kullanır.",
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
