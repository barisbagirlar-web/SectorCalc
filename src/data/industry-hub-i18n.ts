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
    eyebrow: "CNC İMALAT",
    hubTitle: "CNC İmalat İçin Maliyet ve Kârlılık Araçları",
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
    eyebrow: "HVAC VE TESİSAT",
    hubTitle: "HVAC İşleri İçin Maliyet ve Kârlılık Araçları",
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
    eyebrow: "RESTORAN VE YEME-İÇME",
    hubTitle: "Restoran ve Yeme-İçme İçin Maliyet ve Kârlılık Araçları",
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
  construction: {
    eyebrow: "İNŞAAT VE TAAHHÜT",
    hubTitle: "İnşaat İşleri İçin Maliyet ve Kârlılık Araçları",
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
  "agriculture-crops": {
    eyebrow: "TARIM VE BİTKİSEL ÜRETİM",
    hubTitle: "Bitkisel Üretim İçin Maliyet ve Verim Araçları",
    painStatement:
      "Düşük verim, artan girdi maliyetleri ve hatalı planlama; tarımsal üretimde kârı beklenmedik şekilde azaltabilir.",
    whoItsFor:
      "Çiftçiler, tarım işletmeleri, kooperatifler ve üretim maliyeti hesaplayan tarım danışmanları.",
    decisionHelp:
      "Ekim planını güncellemek, girdi maliyetlerini gözden geçirmek veya fiyat beklentisini değiştirmek gerekip gerekmediğini netleştirir.",
    freeToolExplanation:
      "Ücretsiz hızlı kontrol ile dönüm başına verim ve maliyet riskindeki görünür sinyalleri görün.",
    premiumToolExplanation:
      "Premium analiz aracı; hedef verim, maliyet sapması ve net karar desteği sağlar.",
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
