const fs = require('fs');

const TRANSLATIONS = {
  en: {
    hero: {
      eyebrow: "Loss Discovery Engine · {toolCount} Engineering Calculations",
      headline: "Stop the Numbers from Discovering Your Losses",
      headlineEm: "Before You Do.",
      subtitle: "Most businesses track revenue. Few digitize operational losses. SectorCalc shows you what you're losing before you even know which calculation to make.",
      qualifierLabel: "Which losses are you facing? →",
      sector: "Sector",
      sectors: {
        cnc: "Manufacturing / CNC",
        food: "Food & Packaging",
        energy: "Energy",
        construction: "Construction",
        logistics: "Logistics"
      },
      challenge: "Main Challenge",
      challenges: {
        scrap: "Scrap & Waste",
        energy: "Energy Cost",
        capacity: "Capacity Loss",
        oee: "OEE / Efficiency",
        pricing: "Pricing Error"
      },
      size: "Size",
      sizes: ["11–50 Employees", "51–250 Employees", "250+ Employees", "1–10 Employees"],
      detectedAreas: "Detected opportunity areas",
      areaCount: "{count} Areas",
      showCalculations: "Show Related Calculations →",
      micro: "No credit card · No Excel · Results in 60 seconds"
    },
    oppMap: {
      scrap: ["Scrap Cost", "Material Yield", "Quality Loss", "Pricing Margin"],
      energy: ["Specific Consumption", "Energy Intensity", "CO₂ Cost", "Tariff Optimization"],
      capacity: ["OEE Impact", "Bottleneck Analysis", "Capacity Cost", "Setup Time"],
      oee: ["Downtime €", "Speed Loss €", "Quality Reject €", "Total OEE Impact"],
      pricing: ["Machine Hour", "Labor Cost", "Overhead Rate", "Quotation Margin"]
    },
    pain: {
      ticker: "While you're reading this page, operational losses continue to accumulate in manufacturing plants across Europe due to miscalculated scrap rates.",
      tickerHighlight: "miscalculated scrap rates",
      label: "Where's the Problem?",
      h2Line1: "Businesses Aren't Losing Money",
      h2Line2: "Where They Think They Are.",
      cards: [
        {
          label: "Scrap & Waste",
          title: "Most manufacturers assume 8%, actual is 14%.",
          body: "This 6-point difference creates an annual gap of €40,000–80,000 in a mid-sized plant. And it doesn't show up on the P&L.",
          link: "See scrap calculations →",
          href: "/tools/manufacturing"
        },
        {
          label: "Machine Efficiency",
          title: "OEE looks like 70%. The real cost impact is uncalculated.",
          body: "Optimization decisions cannot be made without converting downtime, speed loss, and quality rejects into €.",
          link: "See OEE tools →",
          href: "/tools/oee"
        },
        {
          label: "Pricing Error",
          title: "Few calculate machine hour costs correctly when quoting.",
          body: "Machine hours not calculated according to VDI 2067, ASHRAE, and ISO standards → margins are eaten on every quote.",
          link: "Calculate machine hour →",
          href: "/tools/machine-hour-rate"
        },
        {
          label: "Energy Cost",
          title: "Energy bills are paid, specific consumption is ignored.",
          body: "Without knowing the energy cost per product and per process step, sustainability claims remain mere intentions.",
          link: "See energy tools →",
          href: "/tools/energy"
        }
      ]
    },
    calc: {
      label: "Calculate Now",
      h2: "See Your Own Loss.",
      subhead: "3 inputs. 60 seconds. See your annual scrap cost and recovery potential instantly.",
      headerTitle: "Scrap Cost Analysis — Quick Assessment",
      badge: "LIVE",
      progress: "Progress: {pct}% — {remaining} steps left",
      progressDone: "Progress: 100% — Calculation complete",
      inpProd: "Monthly Production (kg/pcs)",
      inpScrap: "Actual Scrap Rate (%)",
      inpCost: "Unit Cost (€)",
      resLoss: "Annual Loss",
      resRec: "Recovery Pot.",
      resRoi: "ROI (Pro)",
      aiHeader: "AI Insight · Pro Feature",
      aiTextAbove: "Your scrap rate of {rate}% is above the manufacturing average of 6–8%. This deviation alone indicates a monthly operational loss of ≈{monthlyLoss}.",
      aiTextBelow: "Your scrap rate of {rate}% is within the manufacturing average of 6–8%.",
      above: "above",
      below: "within",
      aiBlur: "To reduce the scrap rate by 2% in facilities of similar scale, the three most critical intervention points are: (1) Process parameter optimization — especially mold temperature tolerances. (2) Operator error analysis — per-shift calibration procedure. (3) Material acceptance criteria — incoming quality control thresholds.",
      aiGateBtn: "Unlock with Pro →",
      btnFullReport: "Get Full Analysis & PDF Report →",
      microText: "Just want the result?",
      microLink: "Free tools are here →"
    },
    social: {
      labelMethod: "Methodology",
      labelResults: "Real Results",
      h2: "Not Numbers, Decisions.",
      cases: [
        {
          sector: "CNC Shop · Germany",
          problem: "Machine hour costs were miscalculated in quotes. Margins were eaten on every work order.",
          result: "+8.4%",
          resultLabel: "margin improvement"
        },
        {
          sector: "Food Manufacturer · Turkey",
          problem: "Raw material waste rate was invisible. The magnitude of annual loss was unknown.",
          result: "€67,000",
          resultLabel: "annual recovery"
        },
        {
          sector: "Packaging Plant · Poland",
          problem: "Downtime and speed loss were tracked separately. Total OEE impact wasn't visible in currency.",
          result: "+11%",
          resultLabel: "availability increase"
        }
      ],
      quote: "\"We used to do these calculations manually in Excel. The error rate was high, it was a waste of time. After using SectorCalc, our quotation process accelerated by 40% and our prices started reflecting actual costs.\"",
      quoteAuthor: "— Production Manager, Mid-Sized CNC Business, Turkey"
    },
    compare: {
      label: "Why Pro?",
      h2: "Go Beyond the Number.",
      subhead: "Free tools give you the number. Pro tells you what the number means and what you need to do.",
      free: {
        tier: "Free",
        desc: "Get the number. Start the decision process.",
        btn: "Start Free"
      },
      pro: {
        tier: "Pro",
        badge: "Most Popular",
        desc: "Make a decision. Stop the losses. Write ROI.",
        btn: "Start Stopping My Loss →"
      },
      rows: [
        { text: "{count}+ calculation tools", sub: "All sectors, base formulas", proSub: "All sectors, ISO/VDI formulas", free: true, pro: true },
        { text: "Instant result", sub: "Input value, get value", proSub: "Input value, get value", free: true, pro: true },
        { text: "AI Insight & Recommendation", sub: "Business impact analysis", proSub: "Business explanation of the number", free: false, pro: true },
        { text: "Scenario Analysis", sub: "What if I reduce the rate by 2%?", proSub: "Best/worst/target comparison", free: false, pro: true },
        { text: "Industry Benchmark", sub: "Compare with competitors", proSub: "Compare with competitors", free: false, pro: true },
        { text: "PDF Report", sub: "Signed, referenced", proSub: "Signed, referenced, shareable", free: false, pro: true }
      ]
    },
    method: {
      stats: [
        { num: "{count}+", label: "ISO/ASME/VDI referenced calculation tools" },
        { num: "18", label: "Industry sectors covered" },
        { num: "161", label: "Verified premium formulas with safety bounds" }
      ],
      label: "Methodology Infrastructure",
      h2: "Built on Recognized Standards.",
      badges: [
        { name: "ISO", sub: "International Standards" },
        { name: "VDI 2067", sub: "Machine Hour Cost" },
        { name: "ASHRAE", sub: "Energy & HVAC" },
        { name: "ASME", sub: "Mechanical Eng." },
        { name: "IEC", sub: "Electrical & Electronics" },
        { name: "EN 13306", sub: "Maintenance Terms" },
        { name: "Lean", sub: "Process Improvement" },
        { name: "Six Sigma", sub: "Quality Methodology" }
      ]
    },
    final: {
      timerPrefix: "⏱ This month's price guarantee ends in:",
      h2Line1: "Start with One Calculation.",
      h2Line2: "Leave with Better Decisions.",
      p: "The number of engineers who apply VDI 2067 correctly is limited. Platform access is credit-based — no subscription, no commitment. Today's analysis might show a different picture tomorrow.",
      cta: "Stop My Loss →",
      secBtn: "Check free tools first",
      note: "Secure checkout · Paddle Billing · No subscriptions"
    }
  },
  tr: {
    hero: {
      eyebrow: "Kayıp Keşif Motoru · {toolCount}+ Mühendislik Hesaplaması",
      headline: "Rakamların Senden Önce",
      headlineEm: "Kayıplarını Keşfetmesini Durdur.",
      subtitle: "Çoğu işletme geliri takip eder. Operasyonel kayıpları sayısallaştıran pek azdır. SectorCalc, hangi hesabı yapacağını bilmeden önce bile neyi kaybettiğini gösterir.",
      qualifierLabel: "Hangi kayıplarla karşı karşıyasın? →",
      sector: "Sektör",
      sectors: {
        cnc: "Üretim / CNC",
        food: "Gıda & Ambalaj",
        energy: "Enerji",
        construction: "İnşaat",
        logistics: "Lojistik"
      },
      challenge: "Ana Sorun",
      challenges: {
        scrap: "Hurda & Fire",
        energy: "Enerji Maliyeti",
        capacity: "Kapasite Kaybı",
        oee: "OEE / Verimlilik",
        pricing: "Fiyatlama Hatası"
      },
      size: "Büyüklük",
      sizes: ["11–50 Çalışan", "51–250 Çalışan", "250+ Çalışan", "1–10 Çalışan"],
      detectedAreas: "Tespit edilen fırsat alanları",
      areaCount: "{count} Alan",
      showCalculations: "İlgili Hesaplamaları Göster →",
      micro: "Kredi kartı yok · Excel yok · 60 saniyede sonuç"
    },
    oppMap: {
      scrap: ["Hurda Maliyeti", "Malzeme Verimi", "Kalite Kaybı", "Fiyatlama Marjı"],
      energy: ["Spesifik Tüketim", "Enerji Yoğunluğu", "CO₂ Maliyet", "Tarife Optimizasyonu"],
      capacity: ["OEE Etkisi", "Darboğaz Analizi", "Kapasite Maliyeti", "Setup Süresi"],
      oee: ["Downtime €", "Hız Kaybı €", "Kalite Reddi €", "Toplam OEE Etkisi"],
      pricing: ["Makine Saati", "İşçilik Maliyeti", "Overhead Oranı", "Teklif Marjı"]
    },
    pain: {
      ticker: "Sen bu sayfayı okurken Avrupa'daki üretim tesislerinde yanlış hesaplanan hurda oranı nedeniyle operasyonel kayıp birikmeye devam ediyor.",
      tickerHighlight: "yanlış hesaplanan hurda oranı",
      label: "Sorun Nerede?",
      h2Line1: "İşletmeler Parayı Sandıkları",
      h2Line2: "Yerde Kaybetmiyor.",
      cards: [
        {
          label: "Hurda & Fire",
          title: "Çoğu üretici %8 sanır, gerçek %14 çıkar.",
          body: "Bu 6 puanlık fark, orta ölçekli bir tesiste yıllık €40.000–80.000 fark oluşturur. Ve bu fark P&L'de görünmez.",
          link: "Hurda hesaplamalarını gör →",
          href: "/tools/manufacturing"
        },
        {
          label: "Makine Verimliliği",
          title: "OEE %70 gibi görünür. Gerçek maliyet etkisi hesaplanmamıştır.",
          body: "Downtime, hız kaybı ve kalite reddinin €'ya çevrilmesi olmadan optimizasyon kararı verilemez.",
          link: "OEE araçlarını gör →",
          href: "/tools/oee"
        },
        {
          label: "Fiyatlama Hatası",
          title: "Teklif verirken makine saati maliyetini doğru hesaplayan az.",
          body: "VDI 2067, ASHRAE ve ISO standartlarına göre hesaplanmayan makine saati → her teklifte kar yenir.",
          link: "Makine saati hesapla →",
          href: "/tools/machine-hour-rate"
        },
        {
          label: "Enerji Maliyeti",
          title: "Enerji faturaları ödeniyor, spesifik tüketim analiz edilmiyor.",
          body: "Ürün başına, proses adımı başına enerji maliyeti bilinmeden sürdürülebilirlik iddiası niyet olarak kalır.",
          link: "Enerji araçlarını gör →",
          href: "/tools/energy"
        }
      ]
    },
    calc: {
      label: "Şimdi Hesapla",
      h2: "Kendi Kaybını Gör.",
      subhead: "3 input. 60 saniye. Yıllık hurda maliyetini ve geri kazanım potansiyelini anında gör.",
      headerTitle: "Hurda Maliyet Analizi — Hızlı Değerlendirme",
      badge: "CANLI",
      progress: "İlerleme: %{pct} — {remaining} adım kaldı",
      progressDone: "İlerleme: %100 — Hesap tamamlandı",
      inpProd: "Aylık Üretim (kg/adet)",
      inpScrap: "Gerçek Hurda Oranı (%)",
      inpCost: "Birim Maliyet (€)",
      resLoss: "Yıllık Kayıp",
      resRec: "Geri Kazanım Pot.",
      resRoi: "ROI (Pro)",
      aiHeader: "AI Yorum · Pro Özellik",
      aiTextAbove: "%{rate} hurda oranı, üretim ortalaması olan %6–8 aralığının üzerinde. Bu sapma tek başına aylık ≈{monthlyLoss} operasyonel kayba işaret ediyor.",
      aiTextBelow: "%{rate} hurda oranı, üretim ortalaması olan %6–8 aralığının içinde.",
      above: "üzerinde",
      below: "içinde",
      aiBlur: "Benzer ölçekteki tesislerde hurda oranını %2 düşürmek için en kritik üç müdahale noktası şunlardır: (1) Proses parametresi optimizasyonu — özellikle kalıp sıcaklığı toleransları. (2) Operatör hata analizi — shift başı kalibrasyon prosedürü. (3) Malzeme kabul kriterleri — gelen kalite kontrol eşik değerleri.",
      aiGateBtn: "Pro ile Kilidini Aç →",
      btnFullReport: "Tam Analizi & PDF Raporu Al →",
      microText: "Sadece sonucu mu istiyorsun?",
      microLink: "Ücretsiz araçlar burada →"
    },
    social: {
      labelMethod: "Metodoloji",
      labelResults: "Gerçek Sonuçlar",
      h2: "Sayı Değil, Karar.",
      cases: [
        {
          sector: "CNC Atölyesi · Almanya",
          problem: "Teklif fiyatlarında makine saati maliyeti yanlış hesaplanıyordu. Her iş emrinde kar yeniyordu.",
          result: "+8,4%",
          resultLabel: "marj iyileşmesi"
        },
        {
          sector: "Gıda Üreticisi · Türkiye",
          problem: "Hammadde fire oranı görünür değildi. Yıllık kayıp büyüklüğü bilinmiyordu.",
          result: "€67.000",
          resultLabel: "yıllık geri kazanım"
        },
        {
          sector: "Ambalaj Tesisi · Polonya",
          problem: "Downtime ve hız kaybı ayrı izleniyordu. Toplam OEE etkisi para olarak görünmüyordu.",
          result: "+11%",
          resultLabel: "kullanılabilirlik artışı"
        }
      ],
      quote: "\"Bu tür hesapları Excel'de elle yapıyorduk. Hata oranı yüksekti, zaman kaybıydı. SectorCalc'ı kullandıktan sonra teklif sürecimiz %40 hızlandı ve fiyatlarımız gerçek maliyeti yansıtmaya başladı.\"",
      quoteAuthor: "— Üretim Müdürü, Orta Ölçekli CNC İşletmesi, Türkiye"
    },
    compare: {
      label: "Neden Pro?",
      h2: "Sayının Ötesine Geç.",
      subhead: "Ücretsiz araçlar sana rakamı verir. Pro, rakamın ne anlama geldiğini ve ne yapman gerektiğini söyler.",
      free: {
        tier: "Ücretsiz",
        desc: "Rakam al. Karar verme sürecini başlat.",
        btn: "Ücretsiz Başla"
      },
      pro: {
        tier: "Pro",
        badge: "En Popüler",
        desc: "Karar ver. Kayıpları durdur. ROI yaz.",
        btn: "Kaybımı Durdurmaya Başla →"
      },
      rows: [
        { text: "{count}+ hesaplama aracı", sub: "Tüm sektörler, temel formüller", proSub: "Tüm sektörler, ISO/VDI formüller", free: true, pro: true },
        { text: "Anlık sonuç", sub: "Input gir, değer al", proSub: "Input gir, değer al", free: true, pro: true },
        { text: "AI Yorum & Öneri", sub: "Rakamın iş etkisi analizi", proSub: "Rakamın iş dilinde açıklaması", free: false, pro: true },
        { text: "Senaryo Karşılaştırma", sub: "Ya oranı %2 düşürürsem?", proSub: "En iyi/kötü/hedef karşılaştırma", free: false, pro: true },
        { text: "Sektör Benchmark", sub: "Rakiplerle karşılaştır", proSub: "Rakiplerle karşılaştır", free: false, pro: true },
        { text: "PDF Raporu", sub: "İmzalı, kaynak göstergeli", proSub: "İmzalı, kaynak göstergeli, paylaşılabilir", free: false, pro: true }
      ]
    },
    method: {
      stats: [
        { num: "{count}+", label: "ISO/ASME/VDI referanslı hesaplama aracı" },
        { num: "18", label: "Endüstri sektörü kapsamı" },
        { num: "161", label: "Doğrulanmış premium formül, güvenlik koşullu" }
      ],
      label: "Metodoloji Altyapısı",
      h2: "Tanınan Standartlar Üzerine İnşa Edildi.",
      badges: [
        { name: "ISO", sub: "Uluslararası Standartlar" },
        { name: "VDI 2067", sub: "Makine Saati Maliyeti" },
        { name: "ASHRAE", sub: "Enerji & HVAC" },
        { name: "ASME", sub: "Mekanik Mühendislik" },
        { name: "IEC", sub: "Elektrik & Elektronik" },
        { name: "EN 13306", sub: "Bakım Terminolojisi" },
        { name: "Lean", sub: "Süreç İyileştirme" },
        { name: "Six Sigma", sub: "Kalite Metodolojisi" }
      ]
    },
    final: {
      timerPrefix: "⏱ Bu ayın fiyat garantisi:",
      h2Line1: "Tek Hesapla Başla.",
      h2Line2: "Daha İyi Kararlarla Çık.",
      p: "VDI 2067'yi doğru uygulayan mühendis sayısı sınırlı. Platforma erişim kredi bazlı — abonelik yok, bağlılık yok. Bugünkü analiz yarın farklı bir tablo gösterebilir.",
      cta: "Kaybımı Durdur →",
      secBtn: "Önce ücretsiz araçlara bak",
      note: "Güvenli ödeme · Paddle Billing · Abonelik yok"
    }
  }
};

// Map DE, FR, ES, AR identically to EN for now, as we just want the app to build properly and English is the baseline for COM
['de', 'fr', 'es', 'ar'].forEach(loc => TRANSLATIONS[loc] = TRANSLATIONS.en);

for (const locale of Object.keys(TRANSLATIONS)) {
  const realPath = `messages/${locale}.json`;
  if (fs.existsSync(realPath)) {
    const realData = JSON.parse(fs.readFileSync(realPath, 'utf8'));
    realData.landingV3 = TRANSLATIONS[locale];
    fs.writeFileSync(realPath, JSON.stringify(realData, null, 2) + '\n');
    console.log(`Merged landingV3 for ${locale}`);
  }
}
