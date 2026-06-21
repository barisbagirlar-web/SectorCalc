import type { ToolDef } from "./359-types";

const cat = "finance-sales-working-capital";
const st = "Finans";
const ld: string[] = [];
const sa: string[] = ["Verify inputs before making financial decisions.", "Consult a licensed financial advisor for personalized advice."];

export const section1: ToolDef[] = [
  // 1. Yüzde Kuralı
  {
    slug: "yuzde-kurali-kira-hesaplayici",
    dt: "Aylık kira gelirinin mülk değerine oranını hesaplar. Gayrimenkul yatırımının getiri potansiyelini değerlendirir.",
    de: "Calculate the ratio of monthly rent to property value for real estate investment evaluation.",
    cat, st, ld, sa,
    inputs: [
      { id: "aylikKira", lt: "Aylık Kira (₺)", le: "Monthly Rent (TRY)", u: "TRY", d: 10000, ct: "Mülkten elde edilen aylık brüt kira geliri.", ce: "Monthly gross rental income from the property." },
      { id: "mulkDegeri", lt: "Mülk Değeri (₺)", le: "Property Value (TRY)", u: "TRY", d: 1000000, ct: "Gayrimenkulün güncel piyasa değeri.", ce: "Current market value of the real estate property." },
    ],
    f: { sonuc: "(aylikKira / Math.max(1, mulkDegeri)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Kira / Değer Oranı" },
  },
  // 2. 1031 Vergi Erteleme
  {
    slug: "1031-vergi-ertelemeli-takas",
    dt: "Gayrimenkul satışında 1031 takasında vergiye tabi nakit çıkışını hesaplar.",
    de: "Calculate taxable cash-out amount in a 1031 like-kind exchange for real estate.",
    cat, st, ld, sa,
    inputs: [
      { id: "satisFiyati", lt: "Satış Fiyatı (₺)", le: "Sale Price (TRY)", u: "TRY", d: 2000000, ct: "Eski mülkün satış fiyatı.", ce: "Sale price of relinquished property." },
      { id: "kalanBorc", lt: "Kalan Borç (₺)", le: "Remaining Debt (TRY)", u: "TRY", d: 500000, ct: "Satılan mülkün kalan ipotek borcu.", ce: "Remaining mortgage balance." },
      { id: "yeniYatirim", lt: "Yeni Yatırım (₺)", le: "New Investment (TRY)", u: "TRY", d: 1800000, ct: "Yeni mülkün toplam maliyeti.", ce: "Total cost of replacement property." },
    ],
    f: { nakitCikis: "satisFiyati - kalanBorc", sonuc: "Math.max(0, (satisFiyati - kalanBorc) - yeniYatirim)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc", "nakitCikis"],
    ol: { sonuc: "Vergiye Tabi Tutar", nakitCikis: "Toplam Nakit Çıkış" },
  },
  // 3. 50/30/20
  {
    slug: "elli-otuz-yirmi-butce-hesaplama",
    dt: "Net gelirin %50'sini ihtiyaçlara, %30'unu isteklere, %20'sini birikime ayırır.",
    de: "Allocate 50% of income to needs, 30% to wants, and 20% to savings.",
    cat, st, ld, sa,
    inputs: [
      { id: "netGelir", lt: "Net Gelir (₺)", le: "Net Income (TRY)", u: "TRY", d: 30000, ct: "Vergi sonrası aylık net gelir.", ce: "Monthly net income after taxes." },
    ],
    f: { ihtiyac: "netGelir * 0.5", istek: "netGelir * 0.3", sonuc: "netGelir * 0.2" },
    op: "sonuc", ou: "TRY", ok: ["ihtiyac", "istek", "sonuc"],
    ol: { ihtiyac: "İhtiyaçlar (%50)", istek: "İstekler (%30)", sonuc: "Birikim (%20)" },
  },
  // 4. Amortisman
  {
    slug: "amortisman-dogrusal-azalan-hesaplama",
    dt: "Varlıkların yıllık amortisman giderini doğrusal, azalan bakiye veya SYD yöntemiyle hesaplar.",
    de: "Calculate annual depreciation using straight-line, declining balance, or sum-of-years-digits.",
    cat, st, ld, sa,
    inputs: [
      { id: "bedel", lt: "Varlık Bedeli (₺)", le: "Asset Cost (TRY)", u: "TRY", d: 50000, ct: "Varlığın satın alma maliyeti.", ce: "Purchase cost of asset." },
      { id: "kalinti", lt: "Kalıntı Değer (₺)", le: "Salvage Value (TRY)", u: "TRY", d: 5000, ct: "Varlığın ömür sonu tahmini değeri.", ce: "Estimated end-of-life value." },
      { id: "omur", lt: "Ekonomik Ömür (Yıl)", le: "Useful Life (Years)", u: "years", d: 5, mn: 1, ct: "Varlığın faydalı ömrü.", ce: "Useful economic life." },
    ],
    f: { dogrusal: "(bedel - kalinti) / Math.max(1, omur)", sonuc: "(bedel - kalinti) / Math.max(1, omur)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc", "dogrusal"],
    ol: { sonuc: "Yıllık Amortisman", dogrusal: "Doğrusal Gider" },
  },
  // 5. Yıllık Gelir (Annuity)
  {
    slug: "annuite-yillik-gelir-hesaplama",
    dt: "Birikmiş anaparanın belirli faiz oranında düzenli çekilebilecek sabit gelirini hesaplar.",
    de: "Calculate fixed periodic income from a principal amount at a given interest rate.",
    cat, st, ld, sa,
    inputs: [
      { id: "anapara", lt: "Anapara (₺)", le: "Principal (TRY)", u: "TRY", d: 500000, ct: "Anüiteye yatırılan toplam ana para.", ce: "Total principal invested." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 8, ct: "Yıllık faiz oranı.", ce: "Annual interest rate." },
      { id: "donem", lt: "Dönem (Ay)", le: "Period (Months)", u: "months", d: 120, mn: 1, ct: "Gelir çekilecek toplam ay.", ce: "Total income withdrawal months." },
    ],
    f: { aylikOran: "faiz / 12 / 100", sonuc: "anapara * ((faiz/12/100) / Math.max(0.0001, (1 - Math.pow(1 + faiz/12/100, -donem))))" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Aylık Anüite Geliri" },
  },
  // 6. Yıllık Ödeme (Annuity Payout)
  {
    slug: "annuite-odeme-emeklilik-hesaplama",
    dt: "Emeklilik birikiminin yıllık dağıtım tutarını hesaplar.",
    de: "Calculate the annual payout from a retirement savings pool.",
    cat, st, ld, sa,
    inputs: [
      { id: "birikim", lt: "Toplam Birikim (₺)", le: "Total Savings (TRY)", u: "TRY", d: 1000000, ct: "Emeklilikte biriken toplam fon.", ce: "Total accumulated retirement fund." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 6, ct: "Fonun yıllık getiri oranı.", ce: "Annual return rate of the fund." },
      { id: "sure", lt: "Ödeme Süresi (Yıl)", le: "Payout Period (Years)", u: "years", d: 20, mn: 1, ct: "Gelir dağıtılacak yıl sayısı.", ce: "Number of years for payout." },
    ],
    f: { sonuc: "birikim * ((faiz/100) / Math.max(0.0001, (1 - Math.pow(1 + faiz/100, -sure))))" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Yıllık Emeklilik Geliri" },
  },
  // 7. APR
  {
    slug: "apr-yillik-maliyet-orani-hesaplama",
    dt: "Masraflar dahil kredinin gerçek yıllık maliyet oranını hesaplar.",
    de: "Calculate the true annual percentage rate including all fees.",
    cat, st, ld, sa,
    inputs: [
      { id: "kredi", lt: "Kredi Tutarı (₺)", le: "Loan Amount (TRY)", u: "TRY", d: 50000, ct: "Çekilen toplam kredi anaparası.", ce: "Total loan principal." },
      { id: "faiz", lt: "Nominal Faiz (%)", le: "Nominal Interest (%)", u: "%", d: 12, ct: "Kredinin yıllık nominal faiz oranı.", ce: "Annual nominal interest rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 36, mn: 1, ct: "Kredinin toplam vadesi.", ce: "Total loan term." },
      { id: "masraf", lt: "Toplam Masraf (₺)", le: "Total Fees (TRY)", u: "TRY", d: 1500, ct: "Dosya, ekspertiz ve sigorta masrafları.", ce: "Origination, appraisal and insurance fees." },
    ],
    f: { netKredi: "kredi - masraf", aylikTaksit: "kredi * ((faiz/12/100) * Math.pow(1 + faiz/12/100, vade)) / (Math.pow(1 + faiz/12/100, vade) - 1)", sonuc: "((kredi - masraf) > 0) ? ((((kredi * ((faiz/12/100) * Math.pow(1 + faiz/12/100, vade)) / (Math.pow(1 + faiz/12/100, vade) - 1)) * vade) - kredi) / kredi) * 100 / (vade/12) : 0" },
    op: "sonuc", ou: "%", ok: ["sonuc", "aylikTaksit"],
    ol: { sonuc: "APR (Yıllık Maliyet Oranı)", aylikTaksit: "Aylık Taksit" },
  },
  // 8. Varlık Dağılımı
  {
    slug: "varlik-dagilimi-portfoy-hesaplama",
    dt: "Portföyün hedeflenen varlık sınıflarına bölünmesini hesaplar.",
    de: "Allocate portfolio across asset classes based on target percentages.",
    cat, st, ld, sa,
    inputs: [
      { id: "portfoy", lt: "Toplam Portföy (₺)", le: "Total Portfolio (TRY)", u: "TRY", d: 500000, ct: "Yatırım portföyünün toplam değeri.", ce: "Total investment portfolio value." },
      { id: "hisse", lt: "Hisse Senedi (%)", le: "Stocks (%)", u: "%", d: 60, mn: 0, mx: 100, ct: "Portföydeki hisse senedi hedef oranı.", ce: "Target stock allocation percentage." },
      { id: "tahvil", lt: "Tahvil/Bono (%)", le: "Bonds (%)", u: "%", d: 30, mn: 0, mx: 100, ct: "Portföydeki tahvil hedef oranı.", ce: "Target bond allocation percentage." },
      { id: "nakit", lt: "Nakit (%)", le: "Cash (%)", u: "%", d: 10, mn: 0, mx: 100, ct: "Portföydeki nakit hedef oranı.", ce: "Target cash allocation percentage." },
    ],
    f: { hisseTutar: "portfoy * (hisse / 100)", tahvilTutar: "portfoy * (tahvil / 100)", sonuc: "portfoy * (nakit / 100)" },
    op: "sonuc", ou: "TRY", ok: ["hisseTutar", "tahvilTutar", "sonuc"],
    ol: { hisseTutar: "Hisse Senedi Tutarı", tahvilTutar: "Tahvil Tutarı", sonuc: "Nakit Tutarı" },
  },
  // 9. Denetim Riski
  {
    slug: "denetim-riski-hesaplama",
    dt: "Mali tabloda maddi hata bulunamama olasılığını (denetim riski) hesaplar.",
    de: "Calculate audit risk — the probability of not detecting material misstatement.",
    cat, st, ld, sa,
    inputs: [
      { id: "dogustan", lt: "Doğuştan Risk (%)", le: "Inherent Risk (%)", u: "%", d: 50, mn: 0, mx: 100, ct: "İşletmenin yapısından kaynaklanan hata riski.", ce: "Risk inherent in the business operations." },
      { id: "kontrol", lt: "Kontrol Riski (%)", le: "Control Risk (%)", u: "%", d: 40, mn: 0, mx: 100, ct: "İç kontrollerin hatayı önleyememe riski.", ce: "Risk that internal controls fail to prevent errors." },
      { id: "tespit", lt: "Tespit Riski (%)", le: "Detection Risk (%)", u: "%", d: 20, mn: 0, mx: 100, ct: "Denetçinin hatayı bulamama riski.", ce: "Risk that the auditor fails to detect errors." },
    ],
    f: { sonuc: "(dogustan / 100) * (kontrol / 100) * (tespit / 100) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Toplam Denetim Riski" },
  },
  // 10. Basit Faiz
  {
    slug: "basit-faiz-hesaplama",
    dt: "Sadece anapara üzerinden hesaplanan basit faiz gelirini hesaplar.",
    de: "Calculate simple interest earned on principal only.",
    cat, st, ld, sa,
    inputs: [
      { id: "anapara", lt: "Anapara (₺)", le: "Principal (TRY)", u: "TRY", d: 10000, ct: "Faiz hesaplanacak ana para.", ce: "Principal amount for interest calculation." },
      { id: "faiz", lt: "Faiz Oranı (%)", le: "Interest Rate (%)", u: "%", d: 10, ct: "Yıllık faiz oranı.", ce: "Annual interest rate." },
      { id: "sure", lt: "Süre (Yıl)", le: "Time (Years)", u: "years", d: 3, mn: 0, ct: "Faiz uygulanacak yıl sayısı.", ce: "Number of years for interest accrual." },
    ],
    f: { sonuc: "anapara * (faiz / 100) * sure" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Basit Faiz Tutarı" },
  },
  // 11. Bileşik Faiz
  {
    slug: "bilesik-faiz-hesaplama",
    dt: "Faizin anaparaya eklendiği bileşik faizin vade sonu değerini hesaplar.",
    de: "Calculate compound interest future value with periodic compounding.",
    cat, st, ld, sa,
    inputs: [
      { id: "anapara", lt: "Anapara (₺)", le: "Principal (TRY)", u: "TRY", d: 10000, ct: "Başlangıç yatırım tutarı.", ce: "Initial investment amount." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 10, ct: "Yıllık nominal faiz oranı.", ce: "Annual nominal interest rate." },
      { id: "yil", lt: "Vade (Yıl)", le: "Term (Years)", u: "years", d: 5, mn: 0, ct: "Toplam yatırım süresi.", ce: "Total investment period." },
      { id: "siklik", lt: "Bileşim Sıklığı (Adet/Yıl)", le: "Compounding Frequency", u: "per year", d: 12, mn: 1, ct: "Faizin yılda kaç kez eklendiği (12: aylık).", ce: "Number of compounding periods per year (12=monthly)." },
    ],
    f: { sonuc: "anapara * Math.pow(1 + (faiz / 100) / Math.max(1, siklik), siklik * yil)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Vade Sonu Değer" },
  },
  // 12. Günlük/Aylık/Yıllık Bileşik
  {
    slug: "gunluk-bilesik-faiz-hesaplama",
    dt: "Günlük bazda bileşik getirinin vade sonu değerini hesaplar.",
    de: "Calculate daily compound interest future value.",
    cat, st, ld, sa,
    inputs: [
      { id: "anapara", lt: "Anapara (₺)", le: "Principal (TRY)", u: "TRY", d: 10000, ct: "Başlangıç yatırım tutarı.", ce: "Initial investment amount." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 10, ct: "Yıllık nominal faiz oranı.", ce: "Annual interest rate." },
      { id: "gun", lt: "Gün Sayısı", le: "Number of Days", u: "days", d: 365, mn: 1, ct: "Vadeye kalan gün sayısı.", ce: "Number of days for the term." },
    ],
    f: { sonuc: "anapara * Math.pow(1 + faiz / 36500, gun)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Günlük Bileşik Değer" },
  },
  // 13. Sürekli Bileşik
  {
    slug: "surekli-bilesik-faiz-hesaplama",
    dt: "Sonsuz frekansta bileşikleşen teorik maksimum vade sonu değerini hesaplar.",
    de: "Calculate continuous compounding future value — the theoretical maximum.",
    cat, st, ld, sa,
    inputs: [
      { id: "anapara", lt: "Anapara (₺)", le: "Principal (TRY)", u: "TRY", d: 10000, ct: "Başlangıç yatırım tutarı.", ce: "Initial investment." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 10, ct: "Sürekli bileşik faiz oranı.", ce: "Continuous compounding interest rate." },
      { id: "yil", lt: "Vade (Yıl)", le: "Term (Years)", u: "years", d: 5, mn: 0, ct: "Yatırım süresi.", ce: "Investment period." },
    ],
    f: { sonuc: "anapara * Math.exp((faiz / 100) * yil)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Sürekli Bileşik Değer" },
  },
  // 14. Nominal ve Efektif Faiz
  {
    slug: "nominal-efektif-faiz-hesaplama",
    dt: "Bileşim sıklığının etkisiyle oluşan gerçek yıllık getiriyi (efektif faiz) hesaplar.",
    de: "Convert nominal interest rate to effective annual rate based on compounding frequency.",
    cat, st, ld, sa,
    inputs: [
      { id: "nominal", lt: "Nominal Faiz (%)", le: "Nominal Rate (%)", u: "%", d: 12, ct: "Belirtilen yıllık nominal faiz.", ce: "Stated annual nominal interest rate." },
      { id: "siklik", lt: "Bileşim Sıklığı (Adet/Yıl)", le: "Compounding Frequency", u: "per year", d: 12, mn: 1, ct: "Faizin yılda kaç kez bileşikleştiği.", ce: "Number of compounding periods per year." },
    ],
    f: { sonuc: "(Math.pow(1 + (nominal / 100) / Math.max(1, siklik), siklik) - 1) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Efektif Yıllık Faiz" },
  },
  // 15. Tahvil Fiyat ve Getiri
  {
    slug: "tahvil-fiyat-getiri-hesaplama",
    dt: "Tahvilin piyasa faizine göre bugünkü adil fiyatını hesaplar.",
    de: "Calculate the fair price of a bond based on market interest rates.",
    cat, st, ld, sa,
    inputs: [
      { id: "nominal", lt: "Nominal Değer (₺)", le: "Face Value (TRY)", u: "TRY", d: 1000, ct: "Tahvilin vade sonu anapara değeri.", ce: "Bond's par value at maturity." },
      { id: "kupon", lt: "Kupon Oranı (%)", le: "Coupon Rate (%)", u: "%", d: 8, ct: "Tahvilin yıllık faiz ödeme oranı.", ce: "Annual coupon payment rate." },
      { id: "piyasaFaizi", lt: "Piyasa Faizi (%)", le: "Market Rate (%)", u: "%", d: 10, ct: "Benzer riskteki tahvillerin getirisi.", ce: "Yield on comparable bonds." },
      { id: "vade", lt: "Vade (Yıl)", le: "Maturity (Years)", u: "years", d: 5, mn: 1, ct: "Tahvilin vadesine kalan yıl.", ce: "Years to maturity." },
    ],
    f: { kuponOdeme: "nominal * (kupon / 100)", sonuc: "nominal / Math.pow(1 + piyasaFaizi / 100, vade) + (nominal * (kupon / 100)) * ((1 - Math.pow(1 / (1 + piyasaFaizi / 100), vade)) / (piyasaFaizi / 100))" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Tahvil Fiyatı (Bugünkü Değer)" },
  },
  // 16. Temettü Vergisi
  {
    slug: "temettu-vergisi-hesaplama",
    dt: "Stopaj kesintisi sonrası ele geçen net temettü tutarını hesaplar.",
    de: "Calculate net dividend after withholding tax deduction.",
    cat, st, ld, sa,
    inputs: [
      { id: "temettu", lt: "Brüt Temettü (₺)", le: "Gross Dividend (TRY)", u: "TRY", d: 10000, ct: "Vergi kesintisi öncesi temettü tutarı.", ce: "Dividend amount before tax." },
      { id: "stopaj", lt: "Stopaj Oranı (%)", le: "Withholding Rate (%)", u: "%", d: 15, mn: 0, mx: 100, ct: "Temettüye uygulanan stopaj vergisi.", ce: "Dividend withholding tax rate." },
    ],
    f: { sonuc: "temettu * (1 - stopaj / 100)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Net Temettü" },
  },
  // 17. DRIP
  {
    slug: "temettu-yeniden-yatirim-drip-hesaplama",
    dt: "Temettülerin hisseye dönüşmesiyle oluşan kartopu etkisini hesaplar.",
    de: "Calculate the compound growth effect of dividend reinvestment (DRIP).",
    cat, st, ld, sa,
    inputs: [
      { id: "hisse", lt: "Mevcut Hisse (Adet)", le: "Shares Held", u: "shares", d: 100, mn: 0, ct: "Sahip olunan hisse adedi.", ce: "Number of shares owned." },
      { id: "temettu", lt: "Hisse Başı Temettü (₺)", le: "Dividend Per Share (TRY)", u: "TRY", d: 2, ct: "Hisse başına ödenen yıllık temettü.", ce: "Annual dividend per share." },
      { id: "fiyat", lt: "Hisse Fiyatı (₺)", le: "Share Price (TRY)", u: "TRY", d: 50, ct: "Hisse senedinin güncel fiyatı.", ce: "Current share price." },
      { id: "yil", lt: "Yıl Sayısı", le: "Number of Years", u: "years", d: 10, mn: 0, ct: "DRIP stratejisinin uygulanacağı süre.", ce: "DRIP strategy duration." },
      { id: "getiri", lt: "Beklenen Yıllık Getiri (%)", le: "Expected Annual Return (%)", u: "%", d: 10, ct: "Hisse fiyatının yıllık büyüme beklentisi.", ce: "Expected annual price appreciation." },
    ],
    f: { yeniHisse: "hisse + ((temettu * hisse) / Math.max(1, fiyat))", sonuc: "(hisse + ((temettu * hisse) / Math.max(1, fiyat))) * Math.pow(1 + getiri / 100, yil) * fiyat" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "DRIP Portföy Değeri" },
  },
  // 18. Hisse Senedi Getirisi
  {
    slug: "hisse-senedi-getirisi-hesaplama",
    dt: "Sermaye kazancı ve temettü dahil toplam hisse getirisini hesaplar.",
    de: "Calculate total stock return including capital gains and dividends.",
    cat, st, ld, sa,
    inputs: [
      { id: "alis", lt: "Alış Fiyatı (₺)", le: "Buy Price (TRY)", u: "TRY", d: 50, ct: "Hisse senedinin satın alma fiyatı.", ce: "Purchase price per share." },
      { id: "satis", lt: "Satış Fiyatı (₺)", le: "Sell Price (TRY)", u: "TRY", d: 75, ct: "Hisse senedinin satış fiyatı.", ce: "Sale price per share." },
      { id: "temettu", lt: "Alınan Temettü (₺)", le: "Dividends Received (TRY)", u: "TRY", d: 5, ct: "Dönem boyunca alınan temettü.", ce: "Dividends received during holding period." },
    ],
    f: { sonuc: "((satis - alis) + temettu) / Math.max(1, alis) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Toplam Hisse Getirisi" },
  },
  // 19. Yıllık Getiri
  {
    slug: "yillik-getiri-hesaplama",
    dt: "Yatırımın yıllıklandırılmış ortalama büyüme hızını hesaplar.",
    de: "Calculate the annualized rate of return on an investment.",
    cat, st, ld, sa,
    inputs: [
      { id: "baslangic", lt: "Başlangıç Değeri (₺)", le: "Starting Value (TRY)", u: "TRY", d: 10000, ct: "Dönem başı yatırım değeri.", ce: "Investment value at start of period." },
      { id: "bitis", lt: "Bitiş Değeri (₺)", le: "Ending Value (TRY)", u: "TRY", d: 20000, ct: "Dönem sonu yatırım değeri.", ce: "Investment value at end of period." },
      { id: "yil", lt: "Süre (Yıl)", le: "Period (Years)", u: "years", d: 5, mn: 0, ct: "Toplam yatırım süresi.", ce: "Total investment period." },
    ],
    f: { sonuc: "(Math.pow(bitis / Math.max(1, baslangic), 1 / Math.max(1, yil)) - 1) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Yıllıklandırılmış Getiri" },
  },
  // 20. CAGR
  {
    slug: "cagr-bilesik-buyume-hesaplama",
    dt: "Zaman içindeki pürüzsüz yıllık bileşik büyüme oranını (CAGR) hesaplar.",
    de: "Calculate the compound annual growth rate (CAGR) over time.",
    cat, st, ld, sa,
    inputs: [
      { id: "ilkDeger", lt: "İlk Değer (₺)", le: "Initial Value (TRY)", u: "TRY", d: 10000, ct: "Dönem başındaki yatırım değeri.", ce: "Value at the beginning of the period." },
      { id: "sonDeger", lt: "Son Değer (₺)", le: "Final Value (TRY)", u: "TRY", d: 20000, ct: "Dönem sonundaki yatırım değeri.", ce: "Value at the end of the period." },
      { id: "yil", lt: "Dönem (Yıl)", le: "Period (Years)", u: "years", d: 5, mn: 0, ct: "Yatırımın toplam süresi.", ce: "Total investment period." },
    ],
    f: { sonuc: "(Math.pow(sonDeger / Math.max(1, ilkDeger), 1 / Math.max(1, yil)) - 1) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "CAGR (Bileşik Yıllık Büyüme)" },
  },
  // 21. ROI
  {
    slug: "yatirim-getirisi-roi-hesaplama",
    dt: "Yatırımın maliyetine göre ürettiği net verimi (ROI) hesaplar.",
    de: "Calculate return on investment (ROI) relative to cost.",
    cat, st, ld, sa,
    inputs: [
      { id: "netKar", lt: "Net Kâr (₺)", le: "Net Profit (TRY)", u: "TRY", d: 25000, ct: "Yatırımdan elde edilen toplam net kâr.", ce: "Total net profit from investment." },
      { id: "maliyet", lt: "Toplam Maliyet (₺)", le: "Total Cost (TRY)", u: "TRY", d: 100000, ct: "Yatırım için yapılan toplam harcama.", ce: "Total investment expenditure." },
    ],
    f: { sonuc: "(netKar / Math.max(1, maliyet)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "ROI (Yatırım Getirisi)" },
  },
  // 22. NPV
  {
    slug: "net-bugunku-deger-npv-hesaplama",
    dt: "Projenin bugünkü değer cinsinden net kârlılığını (NPV) hesaplar.",
    de: "Calculate net present value (NPV) of a series of cash flows.",
    cat, st, ld, sa,
    inputs: [
      { id: "nakit1", lt: "1. Yıl Nakit Akışı (₺)", le: "Year 1 Cash Flow (TRY)", u: "TRY", d: 30000, ct: "Projenin ilk yıl nakit akışı.", ce: "First year cash flow." },
      { id: "nakit2", lt: "2. Yıl Nakit Akışı (₺)", le: "Year 2 Cash Flow (TRY)", u: "TRY", d: 40000, ct: "Projenin ikinci yıl nakit akışı.", ce: "Second year cash flow." },
      { id: "nakit3", lt: "3. Yıl Nakit Akışı (₺)", le: "Year 3 Cash Flow (TRY)", u: "TRY", d: 50000, ct: "Projenin üçüncü yıl nakit akışı.", ce: "Third year cash flow." },
      { id: "nakit4", lt: "4. Yıl Nakit Akışı (₺)", le: "Year 4 Cash Flow (TRY)", u: "TRY", d: 35000, ct: "Projenin dördüncü yıl nakit akışı.", ce: "Fourth year cash flow." },
      { id: "nakit5", lt: "5. Yıl Nakit Akışı (₺)", le: "Year 5 Cash Flow (TRY)", u: "TRY", d: 30000, ct: "Projenin beşinci yıl nakit akışı.", ce: "Fifth year cash flow." },
      { id: "iskonto", lt: "İskonto Oranı (%)", le: "Discount Rate (%)", u: "%", d: 10, ct: "Sermaye maliyetini yansıtan iskonto oranı.", ce: "Discount rate reflecting cost of capital." },
      { id: "yatirim", lt: "Başlangıç Yatırımı (₺)", le: "Initial Investment (TRY)", u: "TRY", d: 100000, ct: "Projenin başlangıç yatırım tutarı.", ce: "Initial project investment." },
    ],
    f: { bugun1: "nakit1 / Math.pow(1 + iskonto / 100, 1)", bugun2: "nakit2 / Math.pow(1 + iskonto / 100, 2)", bugun3: "nakit3 / Math.pow(1 + iskonto / 100, 3)", bugun4: "nakit4 / Math.pow(1 + iskonto / 100, 4)", bugun5: "nakit5 / Math.pow(1 + iskonto / 100, 5)", sonuc: "(nakit1 / Math.pow(1 + iskonto / 100, 1) + nakit2 / Math.pow(1 + iskonto / 100, 2) + nakit3 / Math.pow(1 + iskonto / 100, 3) + nakit4 / Math.pow(1 + iskonto / 100, 4) + nakit5 / Math.pow(1 + iskonto / 100, 5)) - yatirim" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Net Bugünkü Değer (NPV)" },
  },
  // 23. IRR (simplified approximation)
  {
    slug: "ic-verim-orani-irr-hesaplama",
    dt: "NPV'yi sıfıra eşitleyen proje iç getiri oranını (IRR) tahmin eder.",
    de: "Estimate the internal rate of return (IRR) that zeroes NPV.",
    cat, st, ld, sa,
    inputs: [
      { id: "yatirim", lt: "Başlangıç Yatırımı (₺)", le: "Initial Investment (TRY)", u: "TRY", d: 100000, ct: "Projenin başlangıç yatırım maliyeti.", ce: "Initial project cost." },
      { id: "ortalamaNakit", lt: "Ortalama Yıllık Nakit Akışı (₺)", le: "Avg Annual Cash Flow (TRY)", u: "TRY", d: 35000, ct: "Projenin ortalama yıllık nakit girişi.", ce: "Average annual cash inflow." },
      { id: "yil", lt: "Proje Süresi (Yıl)", le: "Project Life (Years)", u: "years", d: 5, mn: 1, ct: "Projenin ekonomik ömrü.", ce: "Project's economic life." },
    ],
    f: { sonuc: "(ortalamaNakit / Math.max(1, yatirim)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "IRR (İç Verim Oranı - Yaklaşık)" },
  },
  // 24. İskontolu Geri Ödeme
  {
    slug: "iskontolu-geri-odeme-suresi-hesaplama",
    dt: "Yatırımın paranın zaman değeriyle geri kazanılma süresini hesaplar.",
    de: "Calculate the discounted payback period considering time value of money.",
    cat, st, ld, sa,
    inputs: [
      { id: "yatirim", lt: "Başlangıç Yatırımı (₺)", le: "Initial Investment (TRY)", u: "TRY", d: 100000, ct: "Toplam başlangıç yatırımı.", ce: "Total upfront investment." },
      { id: "nakit1", lt: "1. Yıl Nakit (₺)", le: "Year 1 Cash Flow (TRY)", u: "TRY", d: 30000, ct: "İlk yıl nakit girişi.", ce: "First year cash inflow." },
      { id: "nakit2", lt: "2. Yıl Nakit (₺)", le: "Year 2 Cash Flow (TRY)", u: "TRY", d: 30000, ct: "İkinci yıl nakit girişi.", ce: "Second year cash inflow." },
      { id: "nakit3", lt: "3. Yıl Nakit (₺)", le: "Year 3 Cash Flow (TRY)", u: "TRY", d: 30000, ct: "Üçüncü yıl nakit girişi.", ce: "Third year cash inflow." },
      { id: "iskonto", lt: "İskonto Oranı (%)", le: "Discount Rate (%)", u: "%", d: 10, ct: "Sermaye maliyeti.", ce: "Cost of capital." },
    ],
    f: { bd1: "nakit1 / Math.pow(1 + iskonto / 100, 1)", bd2: "nakit2 / Math.pow(1 + iskonto / 100, 2)", bd3: "nakit3 / Math.pow(1 + iskonto / 100, 3)", kum1: "nakit1 / Math.pow(1 + iskonto / 100, 1)", kum2: "nakit1 / Math.pow(1 + iskonto / 100, 1) + nakit2 / Math.pow(1 + iskonto / 100, 2)", kum3: "nakit1 / Math.pow(1 + iskonto / 100, 1) + nakit2 / Math.pow(1 + iskonto / 100, 2) + nakit3 / Math.pow(1 + iskonto / 100, 3)", sonuc: "yatirim > 0 ? (nakit1 / Math.pow(1 + iskonto/100, 1) + nakit2 / Math.pow(1 + iskonto/100, 2) + nakit3 / Math.pow(1 + iskonto/100, 3) >= yatirim ? (nakit1 / Math.pow(1 + iskonto/100, 1) >= yatirim ? 1 : nakit1 / Math.pow(1 + iskonto/100, 1) + nakit2 / Math.pow(1 + iskonto/100, 2) >= yatirim ? 2 : 3) : 99) : 0" },
    op: "sonuc", ou: "years", ok: ["sonuc"],
    ol: { sonuc: "İskontolu Geri Ödeme Süresi" },
  },
  // 25. PI
  {
    slug: "karlilik-endeksi-pi-hesaplama",
    dt: "1 birim yatırımın yarattığı bugünkü değeri (Kârlılık Endeksi) hesaplar.",
    de: "Calculate the profitability index (PI) — value created per unit invested.",
    cat, st, ld, sa,
    inputs: [
      { id: "gelecekNakitBD", lt: "Gelecek Nakit BD (₺)", le: "Future Cash Flows PV (TRY)", u: "TRY", d: 150000, ct: "Tüm gelecek nakit akışlarının bugünkü değeri.", ce: "Present value of all future cash flows." },
      { id: "yatirim", lt: "Başlangıç Yatırımı (₺)", le: "Initial Investment (TRY)", u: "TRY", d: 100000, ct: "Projenin başlangıç maliyeti.", ce: "Initial project cost." },
    ],
    f: { sonuc: "gelecekNakitBD / Math.max(1, yatirim)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "PI (Kârlılık Endeksi)" },
  },
  // 26. WACC
  {
    slug: "wacc-sermaye-maliyeti-hesaplama",
    dt: "Şirketin borç ve özsermaye ağırlıklı ortalama fon maliyetini (WACC) hesaplar.",
    de: "Calculate weighted average cost of capital (WACC).",
    cat, st, ld, sa,
    inputs: [
      { id: "E", lt: "Özsermaye (₺)", le: "Equity (TRY)", u: "TRY", d: 1000000, ct: "Şirketin toplam özsermayesi.", ce: "Total equity value." },
      { id: "D", lt: "Borç (₺)", le: "Debt (TRY)", u: "TRY", d: 500000, ct: "Şirketin toplam borcu.", ce: "Total debt." },
      { id: "Re", lt: "Özsermaye Maliyeti (%)", le: "Cost of Equity (%)", u: "%", d: 15, ct: "Hissedarların beklediği getiri.", ce: "Expected return for shareholders." },
      { id: "Rd", lt: "Borç Maliyeti (%)", le: "Cost of Debt (%)", u: "%", d: 10, ct: "Şirketin borçlanma maliyeti.", ce: "Company's borrowing cost." },
      { id: "vergi", lt: "Vergi Oranı (%)", le: "Tax Rate (%)", u: "%", d: 25, ct: "Kurumlar vergisi oranı.", ce: "Corporate tax rate." },
    ],
    f: { V: "E + D", sonuc: "(E / Math.max(1, E + D) * Re) + (D / Math.max(1, E + D) * Rd * (1 - vergi / 100))" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "WACC (Ağırlıklı Ortalama Sermaye Maliyeti)" },
  },
  // 27. CAPM
  {
    slug: "capm-ozsermaye-maliyeti-hesaplama",
    dt: "Hissedarların risk profiline göre beklediği minimum getiriyi (CAPM) hesaplar.",
    de: "Calculate the cost of equity using the Capital Asset Pricing Model (CAPM).",
    cat, st, ld, sa,
    inputs: [
      { id: "risksizFaiz", lt: "Risksiz Faiz (%)", le: "Risk-Free Rate (%)", u: "%", d: 8, ct: "Devlet tahvili gibi risksiz yatırım getirisi.", ce: "Return on risk-free assets (e.g., government bonds)." },
      { id: "beta", lt: "Beta (Sayı)", le: "Beta (Number)", u: "", d: 1.2, mn: 0, ct: "Hissenin piyasaya duyarlılık katsayısı.", ce: "Stock's sensitivity to market movements." },
      { id: "piyasaPrimi", lt: "Piyasa Risk Primi (%)", le: "Market Risk Premium (%)", u: "%", d: 6, ct: "Piyasanın risksiz faiz üzerindeki getiri fazlası.", ce: "Excess return of market over risk-free rate." },
    ],
    f: { sonuc: "risksizFaiz + beta * piyasaPrimi" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Özsermaye Maliyeti (CAPM)" },
  },
  // 28. DCF
  {
    slug: "dcf-isletme-degerleme-hesaplama",
    dt: "Şirketin nakit üretme kapasitesine dayalı işletme değerini (DCF) hesaplar.",
    de: "Calculate enterprise value using discounted cash flow (DCF) analysis.",
    cat, st, ld, sa,
    inputs: [
      { id: "fcf1", lt: "1. Yıl FCF (₺)", le: "Year 1 FCF (TRY)", u: "TRY", d: 100000, ct: "Birinci yıl serbest nakit akışı.", ce: "First year free cash flow." },
      { id: "fcf2", lt: "2. Yıl FCF (₺)", le: "Year 2 FCF (TRY)", u: "TRY", d: 110000, ct: "İkinci yıl serbest nakit akışı.", ce: "Second year free cash flow." },
      { id: "fcf3", lt: "3. Yıl FCF (₺)", le: "Year 3 FCF (TRY)", u: "TRY", d: 121000, ct: "Üçüncü yıl serbest nakit akışı.", ce: "Third year free cash flow." },
      { id: "fcf4", lt: "4. Yıl FCF (₺)", le: "Year 4 FCF (TRY)", u: "TRY", d: 133100, ct: "Dördüncü yıl serbest nakit akışı.", ce: "Fourth year free cash flow." },
      { id: "fcf5", lt: "5. Yıl FCF (₺)", le: "Year 5 FCF (TRY)", u: "TRY", d: 146410, ct: "Beşinci yıl serbest nakit akışı.", ce: "Fifth year free cash flow." },
      { id: "WACC", lt: "WACC (%)", le: "WACC (%)", u: "%", d: 12, ct: "Ağırlıklı ortalama sermaye maliyeti.", ce: "Weighted average cost of capital." },
      { id: "terminalBuyume", lt: "Terminal Büyüme (%)", le: "Terminal Growth (%)", u: "%", d: 3, ct: "Sonsuz büyüme varsayımı.", ce: "Perpetual growth rate assumption." },
    ],
    f: { fcf_bd1: "fcf1 / Math.pow(1 + WACC / 100, 1)", fcf_bd2: "fcf2 / Math.pow(1 + WACC / 100, 2)", fcf_bd3: "fcf3 / Math.pow(1 + WACC / 100, 3)", fcf_bd4: "fcf4 / Math.pow(1 + WACC / 100, 4)", fcf_bd5: "fcf5 / Math.pow(1 + WACC / 100, 5)", tv: "fcf5 * (1 + terminalBuyume / 100) / Math.max(0.0001, (WACC / 100 - terminalBuyume / 100))", tv_bd: "fcf5 * (1 + terminalBuyume / 100) / Math.max(0.0001, (WACC / 100 - terminalBuyume / 100)) / Math.pow(1 + WACC / 100, 5)", sonuc: "fcf1 / Math.pow(1 + WACC/100, 1) + fcf2 / Math.pow(1 + WACC/100, 2) + fcf3 / Math.pow(1 + WACC/100, 3) + fcf4 / Math.pow(1 + WACC/100, 4) + fcf5 / Math.pow(1 + WACC/100, 5) + (fcf5 * (1 + terminalBuyume/100) / Math.max(0.0001, (WACC/100 - terminalBuyume/100))) / Math.pow(1 + WACC/100, 5)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "İşletme Değeri (DCF)" },
  },
  // 29. FCFE/FCFF
  {
    slug: "fcff-fcfe-hesaplama",
    dt: "Firma ve hissedar serbest nakit akışlarını (FCFF/FCFE) hesaplar.",
    de: "Calculate free cash flow to firm (FCFF) and to equity (FCFE).",
    cat, st, ld, sa,
    inputs: [
      { id: "netKar", lt: "Net Kâr (₺)", le: "Net Income (TRY)", u: "TRY", d: 150000, ct: "Dönem net kârı.", ce: "Net profit for the period." },
      { id: "amortisman", lt: "Amortisman (₺)", le: "Depreciation (TRY)", u: "TRY", d: 30000, ct: "Dönem amortisman gideri.", ce: "Period depreciation expense." },
      { id: "isletmeSermayesi", lt: "İşletme Sermayesi Değişimi (₺)", le: "Working Capital Change (TRY)", u: "TRY", d: 10000, ct: "Net işletme sermayesindeki artış.", ce: "Increase in net working capital." },
      { id: "capex", lt: "Sermaye Harcaması (₺)", le: "CapEx (TRY)", u: "TRY", d: 40000, ct: "Duran varlık yatırımları.", ce: "Capital expenditures on fixed assets." },
      { id: "borc", lt: "Net Borç Değişimi (₺)", le: "Net Debt Change (TRY)", u: "TRY", d: 20000, ct: "Yeni borç - anapara ödemesi.", ce: "New debt issuance minus principal payments." },
    ],
    f: { fcff: "netKar + amortisman - isletmeSermayesi - capex", sonuc: "netKar + amortisman - isletmeSermayesi - capex + borc" },
    op: "sonuc", ou: "TRY", ok: ["fcff", "sonuc"],
    ol: { fcff: "FCFF (Firmaya)", sonuc: "FCFE (Hissedara)" },
  },
  // 30. EBITDA
  {
    slug: "ebitda-hesaplama",
    dt: "Finansman ve vergi öncesi operasyonel nakit kârı (EBITDA) hesaplar.",
    de: "Calculate earnings before interest, taxes, depreciation and amortization.",
    cat, st, ld, sa,
    inputs: [
      { id: "netKar", lt: "Net Kâr (₺)", le: "Net Income (TRY)", u: "TRY", d: 150000, ct: "Dönem net kârı.", ce: "Net profit for the period." },
      { id: "faiz", lt: "Faiz Gideri (₺)", le: "Interest Expense (TRY)", u: "TRY", d: 20000, ct: "Dönem faiz giderleri.", ce: "Period interest expenses." },
      { id: "vergi", lt: "Vergi Gideri (₺)", le: "Tax Expense (TRY)", u: "TRY", d: 45000, ct: "Dönem vergi gideri.", ce: "Period tax expense." },
      { id: "amortisman", lt: "Amortisman (₺)", le: "Depreciation (TRY)", u: "TRY", d: 30000, ct: "Dönem amortisman gideri.", ce: "Period depreciation expense." },
    ],
    f: { sonuc: "netKar + faiz + vergi + amortisman" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "EBITDA" },
  },
  // 31. P/E
  {
    slug: "fiyat-kazanc-pe-orani-hesaplama",
    dt: "Yatırımın kâr üzerinden kendini amorti etme süresini (F/K) hesaplar.",
    de: "Calculate the price-to-earnings (P/E) ratio.",
    cat, st, ld, sa,
    inputs: [
      { id: "hisseFiyati", lt: "Hisse Fiyatı (₺)", le: "Share Price (TRY)", u: "TRY", d: 100, ct: "Hisse senedinin güncel piyasa fiyatı.", ce: "Current market price per share." },
      { id: "hisseBasiKar", lt: "Hisse Başı Kâr (₺)", le: "Earnings Per Share (TRY)", u: "TRY", d: 5, ct: "Şirketin hisse başına düşen net kârı.", ce: "Net earnings per share." },
    ],
    f: { sonuc: "hisseFiyati / Math.max(0.0001, hisseBasiKar)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "F/K (P/E) Oranı" },
  },
  // 32. P/B
  {
    slug: "fiyat-defter-pb-orani-hesaplama",
    dt: "Piyasanın şirketin defter değerine biçtiği primi (PD/DD) hesaplar.",
    de: "Calculate the price-to-book (P/B) ratio.",
    cat, st, ld, sa,
    inputs: [
      { id: "piyasaDegeri", lt: "Piyasa Değeri (₺)", le: "Market Cap (TRY)", u: "TRY", d: 5000000, ct: "Şirketin toplam piyasa değeri.", ce: "Total market capitalization." },
      { id: "ozsermaye", lt: "Özsermaye (₺)", le: "Shareholders Equity (TRY)", u: "TRY", d: 3000000, ct: "Şirketin defter değeri.", ce: "Book value of shareholders equity." },
    ],
    f: { sonuc: "piyasaDegeri / Math.max(1, ozsermaye)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "PD/DD (P/B) Oranı" },
  },
  // 33. P/S
  {
    slug: "fiyat-satis-ps-orani-hesaplama",
    dt: "1 birimlik satış için ödenen piyasa bedelini (F/S) hesaplar.",
    de: "Calculate the price-to-sales (P/S) ratio.",
    cat, st, ld, sa,
    inputs: [
      { id: "piyasaDegeri", lt: "Piyasa Değeri (₺)", le: "Market Cap (TRY)", u: "TRY", d: 5000000, ct: "Şirketin toplam piyasa değeri.", ce: "Market capitalization." },
      { id: "toplamSatislar", lt: "Toplam Satışlar (₺)", le: "Total Revenue (TRY)", u: "TRY", d: 4000000, ct: "Şirketin yıllık toplam satış geliri.", ce: "Annual total revenue." },
    ],
    f: { sonuc: "piyasaDegeri / Math.max(1, toplamSatislar)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "F/S (P/S) Oranı" },
  },
  // 34. ROE DuPont
  {
    slug: "roe-dupont-analizi-hesaplama",
    dt: "Kârlılık, verimlilik ve kaldıracın özsermaye getirisine etkisini (DuPont ROE) hesaplar.",
    de: "Calculate DuPont ROE decomposition — profitability, efficiency, leverage.",
    cat, st, ld, sa,
    inputs: [
      { id: "netKar", lt: "Net Kâr (₺)", le: "Net Income (TRY)", u: "TRY", d: 150000, ct: "Dönem net kârı.", ce: "Net income for the period." },
      { id: "satislar", lt: "Satışlar (₺)", le: "Sales (TRY)", u: "TRY", d: 2000000, ct: "Toplam satış geliri.", ce: "Total sales revenue." },
      { id: "varliklar", lt: "Toplam Varlıklar (₺)", le: "Total Assets (TRY)", u: "TRY", d: 3000000, ct: "Şirketin toplam aktif büyüklüğü.", ce: "Total assets." },
      { id: "ozsermaye", lt: "Özsermaye (₺)", le: "Equity (TRY)", u: "TRY", d: 1500000, ct: "Toplam özsermaye.", ce: "Total shareholders equity." },
    ],
    f: { karMarji: "netKar / Math.max(1, satislar)", varlikDevri: "satislar / Math.max(1, varliklar)", kaldırac: "varliklar / Math.max(1, ozsermaye)", sonuc: "(netKar / Math.max(1, satislar)) * (satislar / Math.max(1, varliklar)) * (varliklar / Math.max(1, ozsermaye)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "DuPont ROE" },
  },
  // 35. ROIC
  {
    slug: "roic-yatirim-getirisi-hesaplama",
    dt: "Şirketin yatırdığı sermayeden ürettiği vergi sonrası verimi (ROIC) hesaplar.",
    de: "Calculate return on invested capital (ROIC) — post-tax efficiency.",
    cat, st, ld, sa,
    inputs: [
      { id: "nopat", lt: "NOPAT (₺)", le: "NOPAT (TRY)", u: "TRY", d: 200000, ct: "Vergi sonrası net faaliyet kârı.", ce: "Net operating profit after tax." },
      { id: "yatirilanSermaye", lt: "Yatırılan Sermaye (₺)", le: "Invested Capital (TRY)", u: "TRY", d: 1500000, ct: "Toplam yatırılmış sermaye.", ce: "Total invested capital." },
    ],
    f: { sonuc: "nopat / Math.max(1, yatirilanSermaye) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "ROIC (Yatırılan Sermaye Getirisi)" },
  },
  // 36. EVA
  {
    slug: "eva-ekonomik-katma-deger-hesaplama",
    dt: "Sermaye maliyeti düşüldükten sonra kalan reel ekonomik kârı (EVA) hesaplar.",
    de: "Calculate economic value added (EVA) — residual wealth after cost of capital.",
    cat, st, ld, sa,
    inputs: [
      { id: "nopat", lt: "NOPAT (₺)", le: "NOPAT (TRY)", u: "TRY", d: 200000, ct: "Vergi sonrası net faaliyet kârı.", ce: "Net operating profit after tax." },
      { id: "sermaye", lt: "Yatırılan Sermaye (₺)", le: "Invested Capital (TRY)", u: "TRY", d: 1500000, ct: "Toplam yatırılmış sermaye.", ce: "Total capital employed." },
      { id: "wacc", lt: "WACC (%)", le: "WACC (%)", u: "%", d: 12, ct: "Ağırlıklı ortalama sermaye maliyeti.", ce: "Weighted average cost of capital." },
    ],
    f: { sonuc: "nopat - (sermaye * wacc / 100)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "EVA (Ekonomik Katma Değer)" },
  },
  // 37. Sharpe
  {
    slug: "sharpe-orani-hesaplama",
    dt: "Toplam risk (volatilite) başına üretilen fazla getiriyi (Sharpe Oranı) hesaplar.",
    de: "Calculate the Sharpe ratio — excess return per unit of total risk.",
    cat, st, ld, sa,
    inputs: [
      { id: "portfoyGetirisi", lt: "Portföy Getirisi (%)", le: "Portfolio Return (%)", u: "%", d: 15, ct: "Portföyün dönemsel getirisi.", ce: "Portfolio's periodic return." },
      { id: "risksizFaiz", lt: "Risksiz Faiz (%)", le: "Risk-Free Rate (%)", u: "%", d: 8, ct: "Risksiz varlık getirisi.", ce: "Risk-free asset return." },
      { id: "volatilite", lt: "Volatilite (%)", le: "Volatility (%)", u: "%", d: 12, ct: "Portföyün standart sapması.", ce: "Portfolio standard deviation." },
    ],
    f: { sonuc: "(portfoyGetirisi - risksizFaiz) / Math.max(0.0001, volatilite)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "Sharpe Oranı" },
  },
  // 38. Sortino
  {
    slug: "sortino-orani-hesaplama",
    dt: "Sadece aşağı yönlü (zarar) risk başına üretilen getiriyi (Sortino) hesaplar.",
    de: "Calculate the Sortino ratio — return per unit of downside risk only.",
    cat, st, ld, sa,
    inputs: [
      { id: "portfoyGetirisi", lt: "Portföy Getirisi (%)", le: "Portfolio Return (%)", u: "%", d: 15, ct: "Portföyün dönemsel getirisi.", ce: "Portfolio return." },
      { id: "risksizFaiz", lt: "Risksiz Faiz (%)", le: "Risk-Free Rate (%)", u: "%", d: 8, ct: "Risksiz varlık getirisi.", ce: "Risk-free return." },
      { id: "asagiSapma", lt: "Aşağı Yönlü Sapma (%)", le: "Downside Deviation (%)", u: "%", d: 8, ct: "Negatif getirilerin standart sapması.", ce: "Standard deviation of negative returns." },
    ],
    f: { sonuc: "(portfoyGetirisi - risksizFaiz) / Math.max(0.0001, asagiSapma)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "Sortino Oranı" },
  },
  // 39. Treynor
  {
    slug: "treynor-orani-hesaplama",
    dt: "Sistematik risk (Beta) başına üretilen fazla getiriyi (Treynor) hesaplar.",
    de: "Calculate the Treynor ratio — excess return per unit of systematic risk (beta).",
    cat, st, ld, sa,
    inputs: [
      { id: "portfoyGetirisi", lt: "Portföy Getirisi (%)", le: "Portfolio Return (%)", u: "%", d: 15, ct: "Portföyün dönemsel getirisi.", ce: "Portfolio return." },
      { id: "risksizFaiz", lt: "Risksiz Faiz (%)", le: "Risk-Free Rate (%)", u: "%", d: 8, ct: "Risksiz varlık getirisi.", ce: "Risk-free rate." },
      { id: "beta", lt: "Beta (Sayı)", le: "Beta (Number)", u: "", d: 1.2, mn: 0, ct: "Portföyün piyasa duyarlılığı.", ce: "Portfolio market sensitivity." },
    ],
    f: { sonuc: "(portfoyGetirisi - risksizFaiz) / Math.max(0.0001, beta)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "Treynor Oranı" },
  },
  // 40. Max Drawdown
  {
    slug: "maksimum-dusus-mdd-hesaplama",
    dt: "Portföyün zirveden dibe yaşadığı en büyük yüzde kaybını (MDD) hesaplar.",
    de: "Calculate the maximum drawdown (MDD) from peak to trough.",
    cat, st, ld, sa,
    inputs: [
      { id: "zirveDeger", lt: "Zirve Değer (₺)", le: "Peak Value (TRY)", u: "TRY", d: 100000, ct: "Portföyün en yüksek değeri.", ce: "Highest portfolio value." },
      { id: "dipDeger", lt: "Dip Değer (₺)", le: "Trough Value (TRY)", u: "TRY", d: 70000, ct: "Portföyün en düşük değeri.", ce: "Lowest portfolio value." },
    ],
    f: { sonuc: "((zirveDeger - dipDeger) / Math.max(1, zirveDeger)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Maksimum Düşüş (MDD)" },
  },
  // 41. Portföy Optimizasyonu (simplified)
  {
    slug: "portfoy-optimizasyonu-hesaplama",
    dt: "Verimli sınır üzerinde basit portföy optimizasyonu yapar.",
    de: "Simple portfolio optimization along the efficient frontier.",
    cat, st, ld, sa,
    inputs: [
      { id: "beklenenGetiri", lt: "Beklenen Getiri (%)", le: "Expected Return (%)", u: "%", d: 12, ct: "Portföyün hedef getiri beklentisi.", ce: "Target portfolio return expectation." },
      { id: "beklenenRisk", lt: "Beklenen Risk (%)", le: "Expected Risk (%)", u: "%", d: 15, ct: "Portföyün tahmini volatilitesi.", ce: "Estimated portfolio risk/volatility." },
    ],
    f: { sonuc: "beklenenGetiri / Math.max(0.0001, beklenenRisk)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "Getiri/Risk Oranı" },
  },
  // 42. Yatırım Fonu Getirisi
  {
    slug: "fon-getirisi-hesaplama",
    dt: "Fonun dönemsel toplam yatırımcı getirisini hesaplar.",
    de: "Calculate total investor return of a mutual fund.",
    cat, st, ld, sa,
    inputs: [
      { id: "baslangicNAV", lt: "Dönem Başı NAV (₺)", le: "Start NAV (TRY)", u: "TRY", d: 10, ct: "Dönem başındaki fon pay fiyatı.", ce: "Fund unit price at period start." },
      { id: "bitisNAV", lt: "Dönem Sonu NAV (₺)", le: "End NAV (TRY)", u: "TRY", d: 12, ct: "Dönem sonundaki fon pay fiyatı.", ce: "Fund unit price at period end." },
      { id: "dagitim", lt: "Dağıtım (₺)", le: "Distribution (TRY)", u: "TRY", d: 0.5, ct: "Dönem boyunca dağıtılan temettü.", ce: "Dividend distributed during period." },
    ],
    f: { sonuc: "((bitisNAV + dagitim - baslangicNAV) / Math.max(1, baslangicNAV)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Fon Getirisi" },
  },
  // 43. ETF Getirisi
  {
    slug: "etf-getirisi-hesaplama",
    dt: "Yönetim ücreti düşülmüş net ETF getirisini hesaplar.",
    de: "Calculate net ETF return after management expense ratio.",
    cat, st, ld, sa,
    inputs: [
      { id: "alisFiyati", lt: "Alış Fiyatı (₺)", le: "Purchase Price (TRY)", u: "TRY", d: 100, ct: "ETF alış fiyatı.", ce: "ETF purchase price." },
      { id: "satisFiyati", lt: "Satış Fiyatı (₺)", le: "Sell Price (TRY)", u: "TRY", d: 115, ct: "ETF satış fiyatı.", ce: "ETF sell price." },
      { id: "temettu", lt: "Temettü (₺)", le: "Dividend (TRY)", u: "TRY", d: 2, ct: "Dönem boyunca dağıtılan temettü.", ce: "Dividend distributed." },
      { id: "giderOrani", lt: "Gider Oranı (%)", le: "Expense Ratio (%)", u: "%", d: 0.5, ct: "ETF'in yıllık yönetim ücreti.", ce: "Annual management fee." },
    ],
    f: { sonuc: "((satisFiyati + temettu - alisFiyati) / Math.max(1, alisFiyati) * 100) - giderOrani" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Net ETF Getirisi" },
  },
  // 44. Futures
  {
    slug: "vadeli-islem-futures-hesaplama",
    dt: "Vadeli kontratın fiyat hareketinden doğan nakit kâr/zararını hesaplar.",
    de: "Calculate profit/loss from futures contract price movement.",
    cat, st, ld, sa,
    inputs: [
      { id: "girisFiyati", lt: "Giriş Fiyatı (₺)", le: "Entry Price (TRY)", u: "TRY", d: 100, ct: "Kontratın açılış fiyatı.", ce: "Contract entry price." },
      { id: "cikisFiyati", lt: "Çıkış Fiyatı (₺)", le: "Exit Price (TRY)", u: "TRY", d: 105, ct: "Kontratın kapanış fiyatı.", ce: "Contract exit price." },
      { id: "carpan", lt: "Kontrat Çarpanı", le: "Contract Multiplier", u: "", d: 100, mn: 1, ct: "Kontratın büyüklük çarpanı.", ce: "Contract size multiplier." },
      { id: "lot", lt: "Lot (Adet)", le: "Lot (Number)", u: "lots", d: 1, mn: 1, ct: "İşlem miktarı.", ce: "Number of contracts traded." },
    ],
    f: { sonuc: "(cikisFiyati - girisFiyati) * carpan * lot" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Kâr / Zarar" },
  },
  // 45. Black-Scholes (simplified)
  {
    slug: "opsiyon-black-scholes-hesaplama",
    dt: "Avrupa tipi alım opsiyonunun teorik prim değerini (Black-Scholes) hesaplar.",
    de: "Calculate European call option theoretical price using Black-Scholes.",
    cat, st, ld, sa,
    inputs: [
      { id: "S", lt: "Spot Fiyat (₺)", le: "Spot Price (TRY)", u: "TRY", d: 100, ct: "Dayanak varlığın güncel fiyatı.", ce: "Current underlying asset price." },
      { id: "K", lt: "Kullanım Fiyatı (₺)", le: "Strike Price (TRY)", u: "TRY", d: 110, ct: "Opsiyonun kullanım fiyatı.", ce: "Option strike price." },
      { id: "r", lt: "Risksiz Faiz (%)", le: "Risk-Free Rate (%)", u: "%", d: 8, ct: "Risksiz faiz oranı.", ce: "Risk-free interest rate." },
      { id: "t", lt: "Vade (Yıl)", le: "Time to Maturity (Years)", u: "years", d: 1, mn: 0.0001, ct: "Vadeye kalan süre.", ce: "Time remaining to expiry." },
      { id: "v", lt: "Volatilite (%)", le: "Volatility (%)", u: "%", d: 30, ct: "Yıllık volatilite.", ce: "Annualized volatility." },
    ],
    f: { d1: "(Math.log(S / Math.max(1, K)) + (r / 100 + Math.pow(v / 100, 2) / 2) * t) / (Math.max(0.0001, v / 100) * Math.sqrt(Math.max(0.0001, t)))", sonuc: "S * 0.5 - K * Math.exp(-(r / 100) * t) * 0.5" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Opsiyon Primi (Call)" },
  },
  // 46. Forex
  {
    slug: "forex-kar-hesaplama",
    dt: "Parite hareketinin hesap para birimindeki kâr/zarar karşılığını hesaplar.",
    de: "Calculate forex profit/loss in account currency from pip movement.",
    cat, st, ld, sa,
    inputs: [
      { id: "lot", lt: "Lot (Adet)", le: "Lot (Number)", u: "lots", d: 1, mn: 0.01, ct: "İşlem büyüklüğü.", ce: "Trade size in lots." },
      { id: "pipDegeri", lt: "Pip Değeri (₺)", le: "Pip Value (TRY)", u: "TRY", d: 10, ct: "Her pip'in TL karşılığı.", ce: "TRY value per pip." },
      { id: "pipHareketi", lt: "Pip Hareketi", le: "Pip Movement", u: "pips", d: 50, ct: "Fiyatın hareket ettiği pip sayısı.", ce: "Number of pips the price moved." },
    ],
    f: { sonuc: "lot * pipDegeri * pipHareketi" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Forex Kâr/Zarar" },
  },
  // 47. Kripto Kârı
  {
    slug: "kripto-para-kar-hesaplama",
    dt: "Borsa kesintileri sonrası net kripto kârını hesaplar.",
    de: "Calculate net cryptocurrency profit after exchange fees.",
    cat, st, ld, sa,
    inputs: [
      { id: "alis", lt: "Alış Fiyatı (₺)", le: "Buy Price (TRY)", u: "TRY", d: 1000, ct: "Kripto paranın alış fiyatı.", ce: "Cryptocurrency buy price." },
      { id: "satis", lt: "Satış Fiyatı (₺)", le: "Sell Price (TRY)", u: "TRY", d: 1500, ct: "Kripto paranın satış fiyatı.", ce: "Cryptocurrency sell price." },
      { id: "miktar", lt: "Miktar (Adet)", le: "Quantity", u: "coins", d: 10, mn: 0, ct: "Alınıp satılan miktar.", ce: "Quantity bought and sold." },
      { id: "komisyon", lt: "Komisyon Oranı (%)", le: "Commission Rate (%)", u: "%", d: 0.5, mn: 0, ct: "Borsa işlem ücreti.", ce: "Exchange trading fee." },
    ],
    f: { sonuc: "(satis - alis) * miktar * (1 - komisyon / 100)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Net Kripto Kârı" },
  },
  // 48. NFT Kârı
  {
    slug: "nft-kar-hesaplama",
    dt: "Gas ve royalty kesintileri sonrası net NFT kârını hesaplar.",
    de: "Calculate net NFT profit after gas and royalty fees.",
    cat, st, ld, sa,
    inputs: [
      { id: "alis", lt: "Alış Fiyatı (ETH)", le: "Buy Price (ETH)", u: "ETH", d: 1, ct: "NFT'nin alış fiyatı (ETH).", ce: "NFT purchase price in ETH." },
      { id: "satis", lt: "Satış Fiyatı (ETH)", le: "Sell Price (ETH)", u: "ETH", d: 2.5, ct: "NFT'nin satış fiyatı (ETH).", ce: "NFT sell price in ETH." },
      { id: "gas", lt: "Gas Ücreti (ETH)", le: "Gas Fee (ETH)", u: "ETH", d: 0.05, ct: "İşlem için ödenen gas ücreti.", ce: "Gas fee paid for the transaction." },
      { id: "royalty", lt: "Royalty Oranı (%)", le: "Royalty Rate (%)", u: "%", d: 5, ct: "Platforma ödenen royalty.", ce: "Platform royalty percentage." },
    ],
    f: { sonuc: "satis - alis - gas - (satis * royalty / 100)" },
    op: "sonuc", ou: "ETH", ok: ["sonuc"],
    ol: { sonuc: "Net NFT Kârı" },
  },
  // 49. Enflasyon Düzeltme
  {
    slug: "enflasyon-duzeltme-hesaplama",
    dt: "Paranın enflasyondan arındırılmış bugünkü alım gücünü hesaplar.",
    de: "Calculate inflation-adjusted purchasing power of money.",
    cat, st, ld, sa,
    inputs: [
      { id: "nominalDeger", lt: "Nominal Değer (₺)", le: "Nominal Value (TRY)", u: "TRY", d: 10000, ct: "Bugünkü para değeri.", ce: "Current nominal money value." },
      { id: "enflasyon", lt: "Yıllık Enflasyon (%)", le: "Annual Inflation (%)", u: "%", d: 15, ct: "Ortalama yıllık enflasyon oranı.", ce: "Average annual inflation rate." },
      { id: "yil", lt: "Yıl Sayısı", le: "Number of Years", u: "years", d: 5, mn: 0, ct: "Gelecek dönem.", ce: "Future period in years." },
    ],
    f: { sonuc: "nominalDeger / Math.pow(1 + enflasyon / 100, yil)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Enflasyon Düzeltilmiş Değer" },
  },
  // 50. Real Return
  {
    slug: "reel-getiri-hesaplama",
    dt: "Enflasyon etkisi çıkarılmış net satın alma gücü artışını (reel getiri) hesaplar.",
    de: "Calculate real return — nominal return adjusted for inflation.",
    cat, st, ld, sa,
    inputs: [
      { id: "nominalGetiri", lt: "Nominal Getiri (%)", le: "Nominal Return (%)", u: "%", d: 20, ct: "Yatırımın nominal getirisi.", ce: "Nominal investment return." },
      { id: "enflasyon", lt: "Enflasyon (%)", le: "Inflation (%)", u: "%", d: 15, ct: "Dönem enflasyon oranı.", ce: "Period inflation rate." },
    ],
    f: { sonuc: "((1 + nominalGetiri / 100) / Math.max(0.0001, (1 + enflasyon / 100)) - 1) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Reel Getiri" },
  },
  // 51. Fırsat Maliyeti
  {
    slug: "firsat-maliyeti-hesaplama",
    dt: "Alternatif yatırımın kaçırılan net getirisini (fırsat maliyeti) hesaplar.",
    de: "Calculate the opportunity cost of choosing one investment over another.",
    cat, st, ld, sa,
    inputs: [
      { id: "tercihEdilenGetiri", lt: "Tercih Edilen Getiri (₺)", le: "Chosen Return (TRY)", u: "TRY", d: 15000, ct: "Seçilen yatırımın getirisi.", ce: "Return of the chosen investment." },
      { id: "vazgecilenGetiri", lt: "Vazgeçilen Getiri (₺)", le: "Foregone Return (TRY)", u: "TRY", d: 25000, ct: "Alternatif yatırımın getirisi.", ce: "Return of the alternative investment." },
    ],
    f: { sonuc: "vazgecilenGetiri - tercihEdilenGetiri" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Fırsat Maliyeti" },
  },
  // 52. Sermaye Kazancı Vergisi
  {
    slug: "sermaye-kazanci-vergisi-hesaplama",
    dt: "Varlık satışından doğan yasal vergi yükümlülüğünü hesaplar.",
    de: "Calculate capital gains tax liability from asset sales.",
    cat, st, ld, sa,
    inputs: [
      { id: "satis", lt: "Satış Bedeli (₺)", le: "Sale Proceeds (TRY)", u: "TRY", d: 500000, ct: "Varlığın satış bedeli.", ce: "Asset sale proceeds." },
      { id: "alis", lt: "Alış Bedeli (₺)", le: "Cost Basis (TRY)", u: "TRY", d: 300000, ct: "Varlığın satın alma maliyeti.", ce: "Asset purchase cost." },
      { id: "vergiOrani", lt: "Vergi Oranı (%)", le: "Tax Rate (%)", u: "%", d: 15, mn: 0, mx: 100, ct: "Sermaye kazancı vergi oranı.", ce: "Capital gains tax rate." },
      { id: "istisna", lt: "İstisna Tutarı (₺)", le: "Exemption Amount (TRY)", u: "TRY", d: 0, ct: "Vergiden muaf kısım.", ce: "Tax-free allowance." },
    ],
    f: { matrah: "Math.max(0, satis - alis - istisna)", sonuc: "Math.max(0, (satis - alis - istisna)) * vergiOrani / 100" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Ödenecek Sermaye Kazancı Vergisi" },
  },
  // 53. Emlak Vergisi
  {
    slug: "emlak-vergisi-hesaplama",
    dt: "Belediyeye ödenmesi gereken yıllık emlak vergisini hesaplar.",
    de: "Calculate annual property tax payable to the municipality.",
    cat, st, ld, sa,
    inputs: [
      { id: "rayicBedel", lt: "Rayiç Bedel (₺)", le: "Assessed Value (TRY)", u: "TRY", d: 500000, ct: "Taşınmazın vergi değeri.", ce: "Property's tax-assessed value." },
      { id: "vergiOrani", lt: "Vergi Oranı (Binde)", le: "Tax Rate (Per Mille)", u: "per mille", d: 2, mn: 0, ct: "Emlak vergisi binde oranı.", ce: "Property tax rate per thousand." },
    ],
    f: { sonuc: "rayicBedel * (vergiOrani / 1000)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Yıllık Emlak Vergisi" },
  },
];
