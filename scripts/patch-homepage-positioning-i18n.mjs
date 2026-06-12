#!/usr/bin/env node
/** Applies homepage positioning i18n + spec overrides to all 6 locale message files. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const PATCH = JSON.parse(
  readFileSync(join(import.meta.dirname, "data/homepage-positioning-i18n.json"), "utf8")
);

const META_OVERRIDES = {
  tr: {
    title: "SectorCalc | Üretim, Sanayi ve İşletmeler İçin Sektörel Hesap Makineleri",
    description:
      "SectorCalc; üretim, imalat, sanayi, atölye, teknik ekipler ve işletmeler için maliyet, fire, marj, enerji, stok, rota, işçilik ve operasyon hesapları sunan ücretsiz ve premium sektörel hesap makinesi platformudur.",
  },
  en: {
    title: "SectorCalc | Industry, Manufacturing and Business Calculators",
    description:
      "SectorCalc offers free and premium industry calculators for manufacturing, workshops, engineering, business costs, waste, margin, energy, inventory, routing, labor and operational losses.",
  },
  de: {
    title: "SectorCalc | Branchen-, Produktions- und Unternehmensrechner",
    description:
      "SectorCalc bietet kostenlose und Premium-Branchenrechner für Produktion, Werkstätten, Technik, Geschäftskosten, Ausschuss, Marge, Energie, Lager, Routen, Personal und operative Verluste.",
  },
  fr: {
    title: "SectorCalc | Calculateurs sectoriels pour industrie, production et entreprises",
    description:
      "SectorCalc propose des calculateurs sectoriels gratuits et premium pour la production, les ateliers, l'ingénierie, les coûts, le rebut, la marge, l'énergie, les stocks, les routes, la main-d'œuvre et les pertes opérationnelles.",
  },
  es: {
    title: "SectorCalc | Calculadoras sectoriales para industria, producción y empresas",
    description:
      "SectorCalc ofrece calculadoras sectoriales gratuitas y premium para fabricación, talleres, ingeniería, costes, merma, margen, energía, inventario, rutas, mano de obra y pérdidas operativas.",
  },
  ar: {
    title: "SectorCalc | حاسبات قطاعية للصناعة والإنتاج والأعمال",
    description:
      "SectorCalc يقدّم حاسبات قطاعية مجانية ومميزة للتصنيع والورش والهندسة وتكاليف الأعمال والهدر والهامش والطاقة والمخزون والمسارات والعمالة والخسائر التشغيلية.",
  },
};

const HERO_OVERRIDES = {
  tr: {
    subtitle:
      "SectorCalc; üretim, imalat, sanayi, atölye, mühendislik, inşaat, lojistik, enerji, finans ve operasyon ekipleri için hazırlanmış ücretsiz ve premium sektörel hesap makineleri sunar. Maliyet, fire, marj, stok, rota, işçilik, enerji ve teknik hesapları daha görünür, ölçülebilir ve karşılaştırılabilir hale getirir.",
    supporting:
      "Basit ölçüm ve dönüşüm hesapları ücretsizdir. Teklif, fire, shop rate, OEE, karbon, stok, personel, duruş ve operasyon kaybı gibi kritik hesaplarda premium hesaplayıcılar daha fazla girdi ve karar özeti sunar.",
    ctaPrimary: "Ücretsiz Sektör Hesaplayıcılarını Aç",
    ctaSecondary: "Premium Hesaplayıcıları İncele",
    panelTitle: "Sektörel hesaplama alanları",
    panelItems: {
      production: "Üretim ve imalat",
      industrial: "Sanayi ve atölyeler",
      technical: "Teknik ve mühendislik hesapları",
      construction: "İnşaat ve saha",
      logistics: "Lojistik ve sevkiyat",
      energy: "Enerji ve karbon",
      finance: "Finans ve İK",
      scrapMargin: "Fire, marj ve operasyon kaybı",
    },
  },
  en: {
    highlight: "INDUSTRY CALCULATOR PLATFORM",
    headline: "See critical business, manufacturing and technical calculations in one place",
    subtitle:
      "SectorCalc provides free and premium industry calculators for manufacturing, workshops, engineering, construction, logistics, energy, finance and operations. It helps make cost, waste, margin, inventory, routing, labor, energy and technical calculations more visible and comparable.",
    supporting:
      "Basic measurement and conversion calculators are free. For quotes, scrap, shop rate, OEE, carbon, inventory, payroll, downtime and operational loss, premium industry calculators add more inputs and a decision summary.",
    ctaPrimary: "Open free industry calculators",
    ctaSecondary: "Browse premium calculators",
    panelTitle: "Industry calculation domains",
    panelItems: {
      production: "Production and manufacturing",
      industrial: "Industry and workshops",
      technical: "Technical and engineering calculations",
      construction: "Construction and field work",
      logistics: "Logistics and shipping",
      energy: "Energy and carbon",
      finance: "Finance and HR",
      scrapMargin: "Scrap, margin and operational loss",
    },
  },
  de: {
    headline: "Kritische Produktions-, Unternehmens- und Technikberechnungen an einem Ort",
  },
  fr: {
    headline:
      "Visualisez les calculs critiques de production, d'entreprise et techniques au même endroit",
  },
  es: {
    headline: "Vea los cálculos críticos de producción, empresa y técnica en un solo lugar",
  },
  ar: {
    headline: "اعرض حسابات الإنتاج والأعمال والحسابات الفنية المهمة في مكان واحد",
  },
};

const SECTION_OVERRIDES = {
  tr: {
    coverage: {
      title: "Sektörel hesap makineleri hangi alanları kapsar?",
      subtitle:
        "SectorCalc, sadece tekil hesap makineleri sunmaz. Sahadaki üretim, teknik ekip, finans, enerji, lojistik ve operasyon hesaplarını sektörlere göre ayırır.",
      items: {
        production: {
          title: "Üretim ve İmalat Hesaplayıcıları",
          description:
            "CNC, torna, freze, sac metal, kaynak, plastik enjeksiyon, kesme hızı, makine saati, fire ve OEE hesapları.",
        },
        industrial: {
          title: "Sanayi ve Atölye Hesaplayıcıları",
          description:
            "Teklif fiyatı, shop rate, setup süresi, takım aşınması, kompresör kaçağı, duruş maliyeti ve bakım etkisi.",
        },
        technical: {
          title: "Teknik ve Mühendislik Hesaplayıcıları",
          description:
            "Civata torku, kaynak ve bulon bağlantısı, tolerans yığılma, hidrolik/pnömatik silindir, basınçlı kap, kayış-kasnak ve teknik ön hesaplar.",
        },
        construction: {
          title: "İnşaat ve Saha Hesaplayıcıları",
          description:
            "Beton, çatı, boya, sıva, tuğla, merdiven, hafriyat, profil ağırlığı, boru ağırlığı ve metraj hesapları.",
        },
        logistics: {
          title: "Lojistik ve Sevkiyat Hesaplayıcıları",
          description:
            "Yakıt, rota, desi, navlun, araç km maliyeti, boş dönüş, depo alanı ve sevkiyat marjı hesapları.",
        },
        energy: {
          title: "Enerji ve Karbon Hesaplayıcıları",
          description:
            "kWh maliyeti, LED tasarrufu, motor, kompresör, karbon ayak izi, SKDM/CBAM etkisi ve enerji verimliliği hesapları.",
        },
        finance: {
          title: "Finans, Muhasebe ve İK Hesaplayıcıları",
          description:
            "KDV, kredi taksiti, personel tam maliyeti, kıdem/ihbar, amortisman, vade farkı, başabaş ve nakit hesapları.",
        },
        foodRetail: {
          title: "Gıda, Servis ve Perakende Hesaplayıcıları",
          description:
            "Fire, porsiyon, stok devir, müşteri kârlılığı, iade, yeniden işçilik ve marj kaybı hesapları.",
        },
      },
    },
    differentiation: {
      title: "Genel hesap makinesi değil, sektörlere göre hazırlanmış hesaplama araçları",
      subtitle:
        "Bir CNC teklif hesabı ile beton metraj hesabı aynı mantıkla kurulamaz. Bir kompresör kaçağı ile bir personel maliyeti de aynı veriyle ölçülemez. SectorCalc hesapları sektör, maliyet türü, teknik ihtiyaç ve karar seviyesine göre ayırır.",
      columns: {
        bySector: {
          title: "Sektöre göre",
          text: "Üretim, imalat, sanayi, atölye, inşaat, lojistik, enerji, finans ve teknik ekip ihtiyaçlarına göre.",
        },
        byType: {
          title: "Hesap türüne göre",
          text: "Maliyet, fire, marj, ölçüm, dönüşüm, kapasite, enerji, stok, işçilik, rota ve teknik ön hesaplara göre.",
        },
        byDecision: {
          title: "Karar seviyesine göre",
          text: "Basit hesaplar ücretsiz; daha detaylı girdi, senaryo ve karar özeti gerektiren işler premium.",
        },
      },
    },
    losses: {
      title: "Görünmeyen kayıpları hesaplanabilir hale getirin",
      items: {
        monetary: {
          title: "Parasal Kayıp",
          text: "Yanlış teklif, eksik maliyet, düşük marj, vade farkı, başabaş noktasının bilinmemesi.",
        },
        material: {
          title: "Malzeme ve Fire Kaybı",
          text: "Hurda, fazla sarf, kalite kaybı, yeniden işleme, stokta bekleme ve miad kaybı.",
        },
        time: {
          title: "Zaman ve Operasyon Kaybı",
          text: "Setup süresi, makine duruşu, bekleme, rota sapması, tekrar işçilik ve kapasite kaybı.",
        },
        energy: {
          title: "Enerji ve Karbon Kaybı",
          text: "kWh maliyeti, pik tüketim, kompresör kaçakları, karbon ayak izi ve enerji verimsizliği.",
        },
      },
    },
    freePremium: {
      title: "Ücretsiz hesaplayıcıdan premium karar özetine",
      freeTitle: "Ücretsiz Sektör Hesaplayıcıları",
      freeText:
        "Ölçü, alan, hacim, dönüşüm, KDV, kredi, yakıt, beton, boya, enerji ve temel işletme hesaplarında hızlı sonuç verir.",
      freeItems: {
        basic: "Temel formüller",
        fast: "Hızlı sonuç",
        category: "Kategoriye göre keşif",
        noSignup: "Kayıt gerektirmeden kullanım",
      },
      freeCta: "Ücretsiz hesaplayıcıları aç",
      premiumTitle: "Premium Sektör Hesaplayıcıları",
      premiumText:
        "Teklif fiyatı, kâr marjı, shop rate, OEE, fire, karbon, stok, personel, duruş ve teknik ön kararlar gibi daha fazla girdi isteyen hesaplarda kullanılır.",
      premiumItems: {
        inputs: "Daha fazla girdi",
        scenario: "Senaryo karşılaştırması",
        summary: "Karar özeti",
        export: "Profesyonel çıktı akışı",
      },
      premiumCta: "Premium hesaplayıcıları incele",
    },
    criticalTools: {
      title: "En kritik sektör hesapları",
      subtitle:
        "Ana sayfada sadece çok aranan hesaplar değil; işletmenin kârını, üretimini, teknik kararını ve operasyonunu doğrudan etkileyen hesaplar öne çıkarılır.",
      badgeSoon: "Yakında",
    },
    audiences: {
      title: "SectorCalc kimler için?",
      items: {
        production: {
          title: "Üretim işletmeleri",
          text: "Makine, fire, OEE, setup, shop rate ve teklif hesapları.",
        },
        industrial: {
          title: "Sanayi ve atölyeler",
          text: "Usta, teknisyen, mühendis ve işletme sahiplerinin günlük teknik ve ticari hesapları.",
        },
        engineering: {
          title: "Mühendislik ve teknik ekipler",
          text: "Bağlantı, tolerans, tork, silindir, basınçlı kap ve mekanik ön hesaplar.",
        },
        construction: {
          title: "İnşaat ve uygulama ekipleri",
          text: "Metraj, hacim, alan, kaplama, çatı, beton ve saha miktar hesapları.",
        },
        logistics: {
          title: "Lojistik ve servis ekipleri",
          text: "Yakıt, rota, desi, navlun, araç maliyeti, servis ve boş dönüş hesapları.",
        },
        finance: {
          title: "Finans, muhasebe ve İK ekipleri",
          text: "Kredi, vergi, maaş, personel maliyeti, amortisman, başabaş ve nakit hesapları.",
        },
      },
    },
    whyNotExcel: {
      title: "Excel, defter ve dağınık dosyalar neden yetmez?",
      items: {
        formula: {
          title: "Formül unutulur",
          text: "Fire, enerji, vade, setup, işçilik veya sevkiyat kalemi sonraki teklifte atlanabilir.",
        },
        sector: {
          title: "Sektör farkı kaybolur",
          text: "CNC, beton, kompresör, lojistik ve personel maliyeti aynı şablonla doğru ölçülemez.",
        },
        decision: {
          title: "Karar geç alınır",
          text: "Zarar, fire, duruş, stok maliyeti veya enerji kaçağı ay sonunda fark edildiğinde geç kalınmış olabilir.",
        },
      },
      closing:
        "SectorCalc, hesapları sektörlere göre düzenler; üretimden finansa, teknik hesaptan saha maliyetine kadar kararları daha ölçülebilir hale getirir.",
    },
    finalCta: {
      title: "Bugün hangi sektörel hesabı netleştirmek istiyorsunuz?",
      subtitle:
        "Ücretsiz hesaplayıcılarla başlayın. Hesap üretim, teklif, fire, enerji, teknik ön karar veya operasyon için kritikleştiğinde premium sektör hesaplayıcılarıyla daha detaylı karar özeti alın.",
      ctaPrimary: "Ücretsiz Hesaplayıcıları Aç",
      ctaSecondary: "Premium Hesaplayıcıları İncele",
    },
  },
};

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      target[key] = deepMerge(target[key] ?? {}, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

for (const locale of Object.keys(PATCH)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  const block = structuredClone(PATCH[locale].homepageHybrid);

  block.meta = { ...block.meta, ...META_OVERRIDES[locale] };
  if (HERO_OVERRIDES[locale]) {
    block.hero = deepMerge(block.hero, HERO_OVERRIDES[locale]);
  }
  if (SECTION_OVERRIDES[locale]) {
    deepMerge(block, SECTION_OVERRIDES[locale]);
  }

  data.homepageHybrid = block;
  data.catalogExplorer.search.placeholder.homepage = PATCH[locale].searchPlaceholder;

  const footerTaglines = {
    tr: "Üretim, sanayi, atölye ve teknik ekipler için ücretsiz ve premium sektörel hesap makineleri platformu.",
    en: "Free and premium industry calculators for manufacturing, workshops, engineering and business operations.",
    de: "Kostenlose und Premium-Branchenrechner für Produktion, Werkstätten, Technik und Unternehmensabläufe.",
    fr: "Calculateurs sectoriels gratuits et premium pour l'industrie, les ateliers, l'ingénierie et les opérations.",
    es: "Calculadoras sectoriales gratuitas y premium para fabricación, talleres, ingeniería y operaciones.",
    ar: "حاسبات قطاعية مجانية ومميزة للتصنيع والورش والهندسة وعمليات الأعمال.",
  };
  if (footerTaglines[locale]) {
    data.enterpriseFooter.tagline = footerTaglines[locale];
  }

  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Patched messages/${locale}.json`);
}
