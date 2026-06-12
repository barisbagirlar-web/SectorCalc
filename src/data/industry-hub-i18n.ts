import type { AppLocale } from "@/i18n/routing";
import type { IndustrySlug } from "@/lib/tools/industry-registry";

/**
 * Locale-aware overrides for industry hub content.
 *
 * The shared catalog registries (industry-registry, revenue-tools) store the
 * canonical English copy. This module layers natural, human-written localized
 * copy on top of it per locale + slug. When an override is missing the page
 * falls back to the English registry content, so adding a locale or industry
 * here is purely additive and never breaks existing routes.
 *
 * Only fields that should change per locale are optional overrides.
 */
export interface LocalizedIndustryHub {
  /** Hero eyebrow — replaces the English industry name when present. */
  eyebrow?: string;
  /** H1 — replaces "<name> Cost & Margin Tools". */
  hubTitle?: string;
  painStatement?: string;
  whoItsFor?: string;
  decisionHelp?: string;
  freeToolExplanation?: string;
  premiumToolExplanation?: string;
}

const TR_HUBS: Partial<Record<IndustrySlug, LocalizedIndustryHub>> = {
  "welding-fabrication": {
    eyebrow: "KAYNAK VE METAL İMALAT",
    hubTitle: "Kaynak ve Metal İmalat İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Hazırlık süresi, fire ve yeniden işçilik riski; yoğun bir imalat atölyesinde verilen teklifin kârını sessizce eritebilir.",
    whoItsFor:
      "Kaynak ve metal imalat işletmeleri, teklif hazırlayan ekipler, saha operatörleri ve proje maliyeti hesaplayan danışmanlar.",
    decisionHelp:
      "İşi kabul etmeden önce teklifi güncellemek, fiyatı yeniden değerlendirmek veya kapsamı değiştirmek gerekip gerekmediğini gösterir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile kaynak işi maliyetinizdeki görünür risk sinyallerini saniyeler içinde görün.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli teklif, kâr marjı ve net bir kabul/ret kararı sunar.",
  },
  "cnc-manufacturing": {
    eyebrow: "CNC VE TALAŞLI İMALAT",
    hubTitle: "CNC ve Talaşlı İmalat İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Çevrim süresi sapması, yeniden işleme ve makine duruşu; sıkı fiyatlı CNC işlerinde kârı hızla aşağı çekebilir.",
    whoItsFor:
      "CNC atölyeleri, talaşlı imalat işletmeleri, teklif hazırlayan ekipler ve üretim maliyeti hesaplayan danışmanlar.",
    decisionHelp:
      "Bir CNC işini kabul etmeden önce fiyatı korumak, yeniden hesaplamak veya kapsamı daraltmak gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile CNC iş maliyetinizdeki görünür risk sinyallerini anında değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli teklif, kâr marjı ve kabul/ret kararını ortaya koyar.",
  },
  hvac: {
    eyebrow: "HVAC, İKLİMLENDİRME VE MEKANİK TESİSAT",
    hubTitle: "HVAC ve Mekanik Tesisat İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Yanlış ölçülen enerji tüketimi, eksik kalan iş kalemleri ve servis maliyetleri; HVAC tekliflerinin kârını eritebilir.",
    whoItsFor:
      "HVAC yüklenicileri, tesisat ekipleri, servis işletmeleri ve proje maliyeti hesaplayan danışmanlar.",
    decisionHelp:
      "İşi üstlenmeden önce fiyatı güncellemek, teklifi yeniden değerlendirmek veya kapsamı düzenlemek gerekip gerekmediğini gösterir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile HVAC işinizdeki görünür maliyet risklerini hızla görün.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli fiyat, kâr marjı ve net karar sağlar.",
  },
  restaurant: {
    eyebrow: "RESTORAN VE GIDA İŞLETMELERİ",
    hubTitle: "Restoran ve Gıda İşletmeleri İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Yüksek gıda maliyeti, porsiyon kaybı ve fire; menü fiyatları doğru görünse bile kârı sessizce düşürebilir.",
    whoItsFor:
      "Restoran sahipleri, mutfak ve işletme yöneticileri, menü fiyatlandıran ekipler ve gıda maliyeti hesaplayan danışmanlar.",
    decisionHelp:
      "Menü fiyatını güncellemek, porsiyonu gözden geçirmek veya maliyetleri düşürmek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile gıda maliyeti ve kâr riskindeki görünür sinyalleri anında görün.",
    premiumToolExplanation:
      "Premium analiz aracı; güvenli menü fiyatı, kâr marjı ve net bir aksiyon önerisi sunar.",
  },
  cleaning: {
    eyebrow: "TEMİZLİK VE TESİS HİZMETLERİ",
    hubTitle: "Temizlik ve Tesis Hizmetleri İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Saha süresi, sarf malzeme ve düzensiz vardiya yükü; aylık temizlik sözleşmelerinde kârı sessizce aşındırabilir.",
    whoItsFor:
      "Temizlik şirketleri, tesis yönetim firmaları, ofis hizmet ekipleri ve teklif hazırlayan saha sorumluları.",
    decisionHelp:
      "Sözleşme fiyatını güncellemek, ziyaret sıklığını değiştirmek veya sarf maliyetini yeniden hesaplamak gerekip gerekmediğini gösterir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile temizlik işi maliyetindeki görünür kayıp sinyallerini saniyeler içinde görün.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli aylık fiyat, kâr marjı ve sözleşme kararı sunar.",
  },
  ecommerce: {
    eyebrow: "E-TİCARET VE ONLINE SATIŞ",
    hubTitle: "E-Ticaret ve Online Satış İçin Kâr ve Marj Araçları",
    painStatement:
      "Reklam, kargo, iade ve komisyon kalemleri; cironun büyüdüğü dönemlerde bile net kârı sessizce eritebilir.",
    whoItsFor:
      "Online satıcılar, marketplace mağazaları, e-ticaret operasyon ekipleri ve ürün fiyatlandıran yöneticiler.",
    decisionHelp:
      "Ürün fiyatını yeniden ayarlamak, reklam bütçesini gözden geçirmek veya iade sürecini iyileştirmek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile ürün marjı ve iade riskindeki görünür sinyalleri anında görün.",
    premiumToolExplanation:
      "Premium analiz aracı; net kâr, iade kaynaklı erozyon ve düzeltici aksiyon önerisi sunar.",
  },
  construction: {
    eyebrow: "İNŞAAT VE TAAHHÜT",
    hubTitle: "İnşaat ve Taahhüt İşleri İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Eksik hesaplanan işçilik, malzeme artışı ve değişiklik talepleri; sabit fiyatlı inşaat işlerinde kârı eritebilir.",
    whoItsFor:
      "İnşaat yüklenicileri, taşeronlar, teklif hazırlayan ekipler ve proje maliyeti hesaplayan danışmanlar.",
    decisionHelp:
      "İşi kabul etmeden önce teklifi güncellemek, fiyatı yeniden değerlendirmek veya kapsamı netleştirmek gerekip gerekmediğini gösterir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile inşaat işinizin maliyetindeki görünür riskleri hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli teklif, kâr marjı ve kabul/ret kararını verir.",
  },
  "electrical-contracting": {
    eyebrow: "ELEKTRİK TAAHHÜT VE PANO İMALAT",
    hubTitle: "Elektrik İşleri ve Pano İmalatı İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Test süresi, denetim gecikmesi ve eksik fiyatlanan malzeme; pano ve elektrik tesisat işlerinde kârı zorlayabilir.",
    whoItsFor:
      "Elektrik taahhüt firmaları, pano atölyeleri, saha ekipleri ve teklif hazırlayan mühendisler.",
    decisionHelp:
      "Teklifi yeniden hesaplamak, test süresini ayarlamak veya denetim riskine tampon eklemek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile elektrik işçilik ve malzeme yükündeki görünür riskleri hızla görün.",
    premiumToolExplanation:
      "Premium analiz aracı; güvenli pano fiyatı, kâr marjı ve teklif kararı sağlar.",
  },
  "landscaping-lawn-care": {
    eyebrow: "PEYZAJ VE SAHA UYGULAMALARI",
    hubTitle: "Peyzaj ve Bahçe Bakım Hizmetleri İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Yakıt, ekip saatleri ve ekipman aşınması; aylık peyzaj sözleşmelerinde kâr beklenenden hızlı erir.",
    whoItsFor:
      "Peyzaj firmaları, bahçe bakım ekipleri, site yönetimleri ve sözleşme fiyatlandıran saha sorumluları.",
    decisionHelp:
      "Aylık fiyatı güncellemek, ziyaret planını gözden geçirmek veya ekipman maliyetini sözleşmeye eklemek gerekip gerekmediğini gösterir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile ziyaret başı maliyet ve ekipman yükündeki görünür sinyalleri görün.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli aylık fiyat, kâr marjı ve sözleşme kararı verir.",
  },
  "auto-repair-shop": {
    eyebrow: "OTO SERVİS VE BAKIM İŞLETMELERİ",
    hubTitle: "Oto Servis ve Bakım İşletmeleri İçin Kârlılık Araçları",
    painStatement:
      "Teşhis süresi, yeniden gelen müşteri ve eksik fiyatlanan parça; servis kârını sessizce aşındırabilir.",
    whoItsFor:
      "Oto servis sahipleri, bakım atölyeleri, lift sorumluları ve fiyat teklifi hazırlayan ekipler.",
    decisionHelp:
      "Verilen fiyatı yeniden değerlendirmek, parça kâr oranını ayarlamak veya işi reddetmek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile teklif edilen fiyat ile gerçek işçilik-parça yükünü hızla karşılaştırın.",
    premiumToolExplanation:
      "Premium analiz aracı; gerçek iş kârı, kâr kaçağı ve servis kararı sunar.",
  },
  "printing-signage": {
    eyebrow: "BASKI VE TABELA İMALATI",
    hubTitle: "Baskı ve Tabela İmalatı İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Tasarım süresi, montaj saati ve yeniden baskı riski; tabela ve baskı işlerinde kârı sessizce eritebilir.",
    whoItsFor:
      "Tabela imalatçıları, dijital baskı atölyeleri, reklam firmaları ve teklif hazırlayan tasarım ekipleri.",
    decisionHelp:
      "Teklifi güncellemek, baskı yeniden işlem riskine tampon eklemek veya kapsamı netleştirmek gerekip gerekmediğini gösterir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile baskı malzemesi ve tasarım süresindeki görünür yükü hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli teklif fiyatı, kâr marjı ve teklif kararı sağlar.",
  },
  plumbing: {
    eyebrow: "SIHHİ TESİSAT VE MEKANİK İŞLER",
    hubTitle: "Sıhhi Tesisat İşleri İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Parça temin süresi, geri çağrı riski ve karmaşık armatür işleri; tesisat tekliflerinde kârı zorlayabilir.",
    whoItsFor:
      "Tesisat ustaları, sıhhi tesisat firmaları, servis ekipleri ve fiyat teklifi hazırlayan saha sorumluları.",
    decisionHelp:
      "İş fiyatını güncellemek, geri çağrı riskine tampon eklemek veya kapsamı netleştirmek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile parça ve işçilik yükündeki görünür riskleri hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; güvenli iş fiyatı, kâr marjı ve teklif kararı sunar.",
  },
  "carpentry-millwork": {
    eyebrow: "AHŞAP İMALAT VE İÇ MEKÂN UYGULAMALARI",
    hubTitle: "Ahşap İmalat ve Mobilya İşleri İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Fire, finiş süresi ve montaj saatleri; özel ahşap imalat tekliflerinde kârı sessizce aşındırabilir.",
    whoItsFor:
      "Ahşap imalat atölyeleri, özel mobilya üreticileri, ticari iç mekân uygulayıcıları ve teklif hazırlayan tasarımcılar.",
    decisionHelp:
      "Teklifi güncellemek, fire payını yeniden hesaplamak veya montaj süresini ayarlamak gerekip gerekmediğini gösterir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile levha ve işçilik yükündeki görünür riskleri hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli teklif, fire ayarlı kâr marjı ve teklif kararı sağlar.",
  },
  roofing: {
    eyebrow: "ÇATI VE KAPLAMA İŞLERİ",
    hubTitle: "Çatı ve Kaplama İşleri İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Söküm maliyeti, döküm bedelleri ve hava koşullu gecikmeler; çatı işleri sözleşmelerinde kârı eritebilir.",
    whoItsFor:
      "Çatı yüklenicileri, kaplama firmaları, taşeron ekipler ve teklif hazırlayan saha sorumluları.",
    decisionHelp:
      "Sözleşme fiyatını güncellemek, hava koşulu riskine tampon eklemek veya söküm bedelini ayarlamak gerekip gerekmediğini gösterir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile malzeme ve işçilik yükündeki görünür sinyalleri hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli sözleşme fiyatı, kâr marjı ve sözleşme kararı sunar.",
  },
  painting: {
    eyebrow: "BOYA VE UYGULAMA İŞLERİ",
    hubTitle: "Boya ve Uygulama İşleri İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Hazırlık süresi, iskele maliyeti ve rötuş riski; boya işlerinde kârı sessizce eritebilir.",
    whoItsFor:
      "Boya ustaları, uygulama firmaları, dış cephe ekipleri ve teklif hazırlayan saha sorumluları.",
    decisionHelp:
      "Teklifi güncellemek, hazırlık süresini ayarlamak veya rötuş riskine tampon eklemek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile boya ve hazırlık süresindeki görünür yükü hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli boya fiyatı, kâr marjı ve iş kararı sağlar.",
  },
  "sheet-metal": {
    eyebrow: "SAC METAL İMALATI",
    hubTitle: "Sac Metal İmalatı İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Programlama, hazırlık süresi, fire, malzeme, enerji, makine saati ve teklif marjı sac metal işlerinde kârlılığı doğrudan etkiler.",
    whoItsFor:
      "Sac metal atölyeleri, lazer kesim firmaları, büküm operasyonları ve teklif hazırlayan üretim ekipleri.",
    decisionHelp:
      "Teklifi güncellemek, fire oranını yeniden hesaplamak veya programlama süresine tampon eklemek gerekip gerekmediğini gösterir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile kesim süresi ve hazırlık yükündeki görünür sinyalleri hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli teklif, fire ayarlı kâr marjı ve teklif kararı sunar.",
  },
  "3d-printing-service": {
    eyebrow: "3D BASKI VE ÜRETİM HİZMETLERİ",
    hubTitle: "3D Baskı Hizmetleri İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Baskı başarısızlığı ve son işlem süresi; özel 3D baskı işlerinde kârı sessizce aşındırabilir.",
    whoItsFor:
      "3D baskı atölyeleri, prototip üreten ekipler, parça hizmeti veren stüdyolar ve teklif hazırlayan tasarımcılar.",
    decisionHelp:
      "Baskı fiyatını güncellemek, başarısızlık riskine tampon eklemek veya son işlem süresini ayarlamak gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile malzeme ve baskı süresindeki görünür yükü hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; minimum güvenli baskı fiyatı, kâr marjı ve iş kararı sağlar.",
  },
  "logistics-transport": {
    eyebrow: "LOJİSTİK VE ROTA OPERASYONLARI",
    hubTitle: "Lojistik ve Taşımacılık İçin Maliyet ve Kâr Kaçağı Araçları",
    painStatement:
      "Hatalı desi, boş dönüş kilometresi ve gecikme cezaları; nakliye marjını sessizce eritebilir.",
    whoItsFor:
      "Filo operatörleri, nakliyeciler, lojistik koordinatörleri ve fiyat teklifi hazırlayan operasyon ekipleri.",
    decisionHelp:
      "Teklifi güncellemek, boş dönüş riskine tampon eklemek veya rotayı yeniden değerlendirmek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile desi ve hacimsel ağırlık riskindeki görünür sinyalleri hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; gerçek rota maliyeti, kâr kaçağı etkenleri ve kabul/yeniden fiyat kararı sunar.",
  },
  "agriculture-crops": {
    eyebrow: "TARIM VE ÜRÜN VERİMLİLİĞİ",
    hubTitle: "Bitkisel Üretim İçin Maliyet ve Verim Araçları",
    painStatement:
      "Aşırı gübreleme, hava boşlukları ve düşük verim; bitkisel üretimde kârı hasattan önce eritebilir.",
    whoItsFor:
      "Çiftçiler, tarım işletmeleri, kooperatifler ve üretim maliyeti hesaplayan tarım danışmanları.",
    decisionHelp:
      "Ekim planını güncellemek, gübre dozajını ayarlamak veya hava riskine tampon eklemek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile dönüm başına verim ve gübre yükündeki görünür sinyalleri görün.",
    premiumToolExplanation:
      "Premium analiz aracı; gerçek kâr tabanı, hava tamponu ve hasat kararı sağlar.",
  },
  "agriculture-irrigation": {
    eyebrow: "SULAMA VE SU VERİMLİLİĞİ",
    hubTitle: "Sulama ve Su Verimliliği İçin Maliyet ve Kârlılık Araçları",
    painStatement:
      "Eksik hesaplanan pompa süresi ve su hakları bedelleri; sulamalı tarım işletmesinde kârı sessizce aşındırabilir.",
    whoItsFor:
      "Çiftçiler, tarımsal sulama operatörleri, kooperatifler ve su verimliliği hesaplayan ziraat mühendisleri.",
    decisionHelp:
      "Sulama planını güncellemek, pompa süresini gözden geçirmek veya buharlaşma riskine tampon eklemek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile pompa süresi ve su maliyetindeki görünür sinyalleri hızla görün.",
    premiumToolExplanation:
      "Premium analiz aracı; optimize edilmiş su harcaması, verimlilik kararı ve aksiyon önerisi sunar.",
  },
  "agriculture-feed": {
    eyebrow: "HAYVANCILIK VE YEM VERİMLİLİĞİ",
    hubTitle: "Yem Verimliliği İçin Maliyet ve Performans Araçları",
    painStatement:
      "Yem firesi ve depolama kaybı; süt veya et gelirini sessizce aşabilir, sürü kârlılığını eritebilir.",
    whoItsFor:
      "Hayvancılık işletmeleri, süt ve besi çiftlikleri, yem yöneticileri ve verim hesaplayan ziraat danışmanları.",
    decisionHelp:
      "Yem rasyonunu güncellemek, fire payını ayarlamak veya su kalitesi etkisini ölçmek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile sürü büyüklüğü ve günlük yem yükündeki görünür maliyeti hızla görün.",
    premiumToolExplanation:
      "Premium analiz aracı; gerçek verim oranı, fire kaynaklı kayıp ve revizyon kararı sağlar.",
  },
  "agriculture-dairy": {
    eyebrow: "SÜT ÜRETİMİ VE ÇİFTLİK KÂRLILIĞI",
    hubTitle: "Süt Üretimi İçin Maliyet ve Kâr Kaçağı Araçları",
    painStatement:
      "Düşük inek başı verim ve yükselen yem fiyatları; süt üreticisinin kârını sessizce eritebilir.",
    whoItsFor:
      "Süt çiftlikleri, hayvancılık işletmeleri, kooperatif yöneticileri ve süt üretim maliyeti hesaplayan danışmanlar.",
    decisionHelp:
      "Sürüyü büyütmek, yemi yeniden değerlendirmek veya işçilik tahsisini gözden geçirmek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile süt geliri ile görünür yem maliyeti baskısını hızla karşılaştırın.",
    premiumToolExplanation:
      "Premium analiz aracı; net süt marjı, kâr kaçağı ve devam/genişletme kararı sunar.",
  },
  "energy-consumption": {
    eyebrow: "ENERJİ VERİMLİLİĞİ",
    hubTitle: "Enerji Tüketimi ve Verimlilik İçin Maliyet ve Karar Araçları",
    painStatement:
      "Yönetilmeyen kWh artışları ve talep cezaları; işletme bütçesini aniden zorlayabilir.",
    whoItsFor:
      "Üretim tesisleri, fabrika enerji yöneticileri, sürdürülebilirlik ekipleri ve enerji optimizasyonu yapan danışmanlar.",
    decisionHelp:
      "Tarifeyi yeniden müzakere etmek, talep yükünü dağıtmak veya verimlilik yatırımı yapmak gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile aylık kWh tüketimi ve görünür enerji maliyetindeki riski hızla görün.",
    premiumToolExplanation:
      "Premium analiz aracı; verimlilik açığı, retrofit önceliği ve aksiyon kararı sağlar.",
  },
  "energy-carbon": {
    eyebrow: "KARBON VE CBAM UYUMU",
    hubTitle: "Karbon Ayak İzi ve CBAM İçin Maliyet ve Uyum Araçları",
    painStatement:
      "Sınır karbon maliyetleri ve süreç emisyonları; AB ihracat marjını önceden modellenmediğinde silebilir.",
    whoItsFor:
      "İhracatçı üreticiler, sürdürülebilirlik ekipleri, uyum yöneticileri ve CBAM hesaplayan dış ticaret danışmanları.",
    decisionHelp:
      "Üretim sürecini güncellemek, enerji kaynağını değiştirmek veya CBAM tamponunu fiyata yansıtmak gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile üretim hacmi ve enerji kaynağına göre görünür CO₂ yükünü hızla görün.",
    premiumToolExplanation:
      "Premium analiz aracı; CBAM maliyet tahmini, ithalat değer yüzdesi ve uyum kararı sunar.",
  },
  "daily-renovation": {
    eyebrow: "TADİLAT VE YENİLEME İŞLERİ",
    hubTitle: "Tadilat ve Yenileme İşleri İçin Bütçe ve Karar Araçları",
    painStatement:
      "Hava koşulu gecikmeleri ve şehir farkı; tadilat bütçelerini öngörü olmadan kolayca aşar.",
    whoItsFor:
      "Ev sahipleri, müteahhitler, tadilat firmaları ve bütçe planlayan iç mimarlar.",
    decisionHelp:
      "Bütçeyi gözden geçirmek, mevsim tamponu eklemek veya kalite tercihini ayarlamak gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile metrekare başına malzeme ve işçilik maliyetini hızla görün.",
    premiumToolExplanation:
      "Premium analiz aracı; gerçekçi toplam bütçe, beklenmedik durum payı ve plan kararı sağlar.",
  },
  "daily-fuel": {
    eyebrow: "SEYAHAT VE BÜTÇE PLANLAMA",
    hubTitle: "Akaryakıt ve Yolculuk Bütçesi İçin Karar Araçları",
    painStatement:
      "Geçiş ücretleri, dönüş seferi ve beklenmedik yakıt zamları; uzun yolculuk bütçesini hızla aşağıya çekebilir.",
    whoItsFor:
      "Bireysel sürücüler, küçük filo operatörleri, saha hizmet ekipleri ve seyahat planlayan koordinatörler.",
    decisionHelp:
      "Bütçeye tampon eklemek, dönüş seferini değerlendirmek veya tüketim varsayımını güncellemek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile mesafe, tüketim ve yakıt fiyatına göre görünür maliyeti hızla görün.",
    premiumToolExplanation:
      "Premium analiz aracı; tampon dahil toplam yolculuk bütçesi ve plan kararı sunar.",
  },
  "daily-meals": {
    eyebrow: "MENÜ VE YEMEK PLANLAMA",
    hubTitle: "Yemek Planlama ve Market Bütçesi İçin Karar Araçları",
    painStatement:
      "Gıda firesi ve fiyat artışı; haftalık market bütçesini öngörü olmadan kolayca aşar.",
    whoItsFor:
      "Aileler, küçük işletme mutfakları, ev ekonomisi planlayanlar ve menü maliyeti hesaplayan operatörler.",
    decisionHelp:
      "Haftalık planı güncellemek, fire payını ayarlamak veya enflasyon tamponu eklemek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile porsiyon başı maliyeti ve görünür gıda yükünü hızla değerlendirin.",
    premiumToolExplanation:
      "Premium analiz aracı; ayarlanmış haftalık bütçe, alışveriş kararı ve tasarruf önerisi sağlar.",
  },
};

const INDUSTRY_HUB_I18N: Partial<
  Record<AppLocale, Partial<Record<IndustrySlug, LocalizedIndustryHub>>>
> = {
  tr: TR_HUBS,
};

export function getLocalizedIndustryHub(
  slug: IndustrySlug,
  locale: string,
): LocalizedIndustryHub | undefined {
  return INDUSTRY_HUB_I18N[locale as AppLocale]?.[slug];
}
