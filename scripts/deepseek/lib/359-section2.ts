import type { ToolDef } from "./359-types";

const cat = "project-construction-management";
const st = "Gayrimenkul";
const ld: string[] = [];
const sa: string[] = ["Verify all property data with official documents.", "Consult a mortgage broker for personalized rates."];

export const section2: ToolDef[] = [
  // 55. Mortgage Taksit
  {
    slug: "mortgage-aylik-taksit-hesaplama",
    dt: "Eşit taksitli konut kredisinin aylık ödeme tutarını hesaplar.",
    de: "Calculate monthly mortgage payment for a home loan.",
    cat, st, ld, sa,
    inputs: [
      { id: "kredi", lt: "Kredi Tutarı (₺)", le: "Loan Amount (TRY)", u: "TRY", d: 1000000, ct: "Çekilen konut kredisi anaparası.", ce: "Mortgage principal." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 12, ct: "Kredinin yıllık faiz oranı.", ce: "Annual mortgage interest rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 120, mn: 1, ct: "Kredinin toplam vadesi.", ce: "Total loan term." },
    ],
    f: { aylikFaiz: "faiz / 1200", sonuc: "faiz === 0 ? kredi / Math.max(1, vade) : kredi * ((faiz / 1200) / (1 - Math.pow(1 + faiz / 1200, -vade)))" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Aylık Mortgage Taksiti" },
  },
  // 56. Mortgage Karşılaştırma
  {
    slug: "mortgage-karsilastirma-hesaplama",
    dt: "İki kredi teklifinin aylık taksit farkını hesaplar.",
    de: "Compare monthly payments between two mortgage offers.",
    cat, st, ld, sa,
    inputs: [
      { id: "kredi1", lt: "1. Kredi Tutarı (₺)", le: "Loan 1 Amount (TRY)", u: "TRY", d: 1000000, ct: "Birinci kredi teklifinin tutarı.", ce: "First loan amount." },
      { id: "faiz1", lt: "1. Faiz (%)", le: "Loan 1 Interest (%)", u: "%", d: 12, ct: "Birinci kredinin faiz oranı.", ce: "First loan interest rate." },
      { id: "kredi2", lt: "2. Kredi Tutarı (₺)", le: "Loan 2 Amount (TRY)", u: "TRY", d: 1000000, ct: "İkinci kredi teklifinin tutarı.", ce: "Second loan amount." },
      { id: "faiz2", lt: "2. Faiz (%)", le: "Loan 2 Interest (%)", u: "%", d: 10, ct: "İkinci kredinin faiz oranı.", ce: "Second loan interest rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 120, mn: 1, ct: "Kredilerin vadesi.", ce: "Common loan term." },
    ],
    f: { taksit1: "faiz1 === 0 ? kredi1 / Math.max(1, vade) : kredi1 * ((faiz1 / 1200) / (1 - Math.pow(1 + faiz1 / 1200, -vade)))", taksit2: "faiz2 === 0 ? kredi2 / Math.max(1, vade) : kredi2 * ((faiz2 / 1200) / (1 - Math.pow(1 + faiz2 / 1200, -vade)))", sonuc: "(faiz1 === 0 ? kredi1 / Math.max(1, vade) : kredi1 * ((faiz1 / 1200) / (1 - Math.pow(1 + faiz1 / 1200, -vade)))) - (faiz2 === 0 ? kredi2 / Math.max(1, vade) : kredi2 * ((faiz2 / 1200) / (1 - Math.pow(1 + faiz2 / 1200, -vade))))" },
    op: "sonuc", ou: "TRY", ok: ["sonuc", "taksit1", "taksit2"],
    ol: { sonuc: "Aylık Taksit Farkı", taksit1: "1. Kredi Taksiti", taksit2: "2. Kredi Taksiti" },
  },
  // 57. Mortgage Geri Ödeme Tablosu
  {
    slug: "mortgage-geri-odeme-tablosu-hesaplama",
    dt: "Belirli bir aydaki taksitin anapara/faiz dağılımını hesaplar.",
    de: "Calculate principal and interest portion for a specific mortgage payment.",
    cat, st, ld, sa,
    inputs: [
      { id: "kredi", lt: "Kredi Tutarı (₺)", le: "Loan Amount (TRY)", u: "TRY", d: 1000000, ct: "Konut kredisi anaparası.", ce: "Mortgage principal." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 12, ct: "Kredi faiz oranı.", ce: "Loan interest rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 120, mn: 1, ct: "Kredinin toplam vadesi.", ce: "Total loan term." },
      { id: "donem", lt: "Sorgulanan Ay", le: "Inquiry Month", u: "months", d: 12, mn: 1, ct: "Detayı görüntülenecek ay.", ce: "Month to analyze." },
    ],
    f: { taksit: "faiz === 0 ? kredi / Math.max(1, vade) : kredi * ((faiz / 1200) / (1 - Math.pow(1 + faiz / 1200, -vade)))", kalanAnapara: "faiz === 0 ? Math.max(0, kredi - (donem - 1) * (kredi / Math.max(1, vade))) : kredi * (Math.pow(1 + faiz / 1200, donem - 1) - Math.pow(1 + faiz / 1200, vade)) / (1 - Math.pow(1 + faiz / 1200, vade))", sonuc: "faiz === 0 ? kredi / Math.max(1, vade) : kredi * Math.pow(1 + faiz / 1200, donem - 1) * (1 - 1 / (1 + faiz / 1200)) / (1 - Math.pow(1 + faiz / 1200, -vade)) / (faiz / 1200)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Belirli Aydaki Anapara/ Faiz Analizi" },
  },
  // 58. Mortgage Puanları (Points)
  {
    slug: "mortgage-puani-points-hesaplama",
    dt: "Peşin ödenen puan maliyetinin faiz indirimiyle amorti süresini hesaplar.",
    de: "Calculate break-even period for mortgage points paid upfront.",
    cat, st, ld, sa,
    inputs: [
      { id: "kredi", lt: "Kredi Tutarı (₺)", le: "Loan Amount (TRY)", u: "TRY", d: 1000000, ct: "Konut kredisi tutarı.", ce: "Mortgage amount." },
      { id: "puanOrani", lt: "Puan Oranı (%)", le: "Points Rate (%)", u: "%", d: 2, ct: "Peşin ödenen puan yüzdesi.", ce: "Prepaid points percentage." },
      { id: "aylikTasarruf", lt: "Aylık Faiz Tasarrufu (₺)", le: "Monthly Interest Saving (TRY)", u: "TRY", d: 500, ct: "Düşük faiz sayesinde aylık tasarruf.", ce: "Monthly saving from lower rate." },
    ],
    f: { maliyet: "kredi * puanOrani / 100", sonuc: "(kredi * puanOrani / 100) / Math.max(1, aylikTasarruf)" },
    op: "sonuc", ou: "months", ok: ["sonuc"],
    ol: { sonuc: "Başabaş Noktası (Ay)" },
  },
  // 59. Mortgage Refinansman
  {
    slug: "mortgage-refinansman-hesaplama",
    dt: "Refinansman masrafının aylık tasarrufla geri kazanılma süresini hesaplar.",
    de: "Calculate break-even for mortgage refinancing costs.",
    cat, st, ld, sa,
    inputs: [
      { id: "eskiTaksit", lt: "Eski Aylık Taksit (₺)", le: "Old Monthly Payment (TRY)", u: "TRY", d: 12000, ct: "Mevcut kredinin aylık taksiti.", ce: "Current monthly payment." },
      { id: "yeniTaksit", lt: "Yeni Aylık Taksit (₺)", le: "New Monthly Payment (TRY)", u: "TRY", d: 10000, ct: "Refinansman sonrası aylık taksit.", ce: "New payment after refinancing." },
      { id: "kapatmaMasrafi", lt: "Kapatma Masrafı (₺)", le: "Closing Cost (TRY)", u: "TRY", d: 30000, ct: "Refinansman için ödenen toplam masraf.", ce: "Total refinancing costs." },
    ],
    f: { sonuc: "kapatmaMasrafi / Math.max(1, (eskiTaksit - yeniTaksit))" },
    op: "sonuc", ou: "months", ok: ["sonuc"],
    ol: { sonuc: "Başabaş Noktası (Ay)" },
  },
  // 60. Nakit Çıkışlı Refinansman
  {
    slug: "nakit-cikisli-refinansman-hesaplama",
    dt: "Ev sermayesinin nakde çevrilerek ele geçen net tutarı hesaplar.",
    de: "Calculate net cash-out from a cash-out refinance.",
    cat, st, ld, sa,
    inputs: [
      { id: "mulkDegeri", lt: "Mülk Değeri (₺)", le: "Property Value (TRY)", u: "TRY", d: 1500000, ct: "Evin güncel piyasa değeri.", ce: "Current property value." },
      { id: "kalanBorc", lt: "Kalan Borç (₺)", le: "Remaining Debt (TRY)", u: "TRY", d: 500000, ct: "Mevcut kredi bakiyesi.", ce: "Current mortgage balance." },
      { id: "yeniKredi", lt: "Yeni Kredi Tutarı (₺)", le: "New Loan Amount (TRY)", u: "TRY", d: 1000000, ct: "Yeni çekilen toplam kredi.", ce: "Total new loan to draw." },
      { id: "masraf", lt: "Masraflar (₺)", le: "Closing Costs (TRY)", u: "TRY", d: 30000, ct: "Kapatma ve işlem masrafları.", ce: "Closing and processing costs." },
    ],
    f: { sonuc: "yeniKredi - kalanBorc - masraf" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Net Nakit Çıkış" },
  },
  // 61. Ev Alım Gücü
  {
    slug: "ev-alim-gucu-hesaplama",
    dt: "Gelire göre bankadan çekilebilecek maksimum kredi tutarını hesaplar.",
    de: "Calculate maximum mortgage amount based on income and DTI limits.",
    cat, st, ld, sa,
    inputs: [
      { id: "aylikGelir", lt: "Aylık Gelir (₺)", le: "Monthly Income (TRY)", u: "TRY", d: 50000, ct: "Brüt aylık gelir.", ce: "Gross monthly income." },
      { id: "maxDTI", lt: "Maks DTI Oranı (%)", le: "Max DTI Ratio (%)", u: "%", d: 40, mn: 0, mx: 100, ct: "Bankanın izin verdiği maksimum borç/gelir oranı.", ce: "Maximum debt-to-income ratio allowed." },
      { id: "aylikBorc", lt: "Mevcut Aylık Borç (₺)", le: "Existing Monthly Debt (TRY)", u: "TRY", d: 5000, ct: "Kredi kartı, taşıt kredisi gibi mevcut borçlar.", ce: "Existing monthly debt obligations." },
      { id: "faiz", lt: "Tahmini Faiz (%)", le: "Estimated Interest (%)", u: "%", d: 12, ct: "Kredi faiz oranı.", ce: "Expected mortgage rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 120, mn: 1, ct: "Kredi vadesi.", ce: "Loan term." },
    ],
    f: { maxTaksit: "(aylikGelir * maxDTI / 100) - aylikBorc", sonuc: "(aylikGelir * maxDTI / 100 - aylikBorc) * ((1 - Math.pow(1 + faiz / 1200, -vade)) / (faiz / 1200))" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Maksimum Kredi Tutarı" },
  },
  // 62. Kira vs Satın Alma
  {
    slug: "kira-satin-alma-karsilastirma-hesaplama",
    dt: "Fiyat/Kira oranına göre optimal barınma stratejisini hesaplar.",
    de: "Compare renting vs buying based on price-to-rent ratio.",
    cat, st, ld, sa,
    inputs: [
      { id: "evFiyati", lt: "Ev Fiyatı (₺)", le: "Home Price (TRY)", u: "TRY", d: 2000000, ct: "Satın alınacak evin fiyatı.", ce: "Home purchase price." },
      { id: "yillikKira", lt: "Yıllık Kira (₺)", le: "Annual Rent (TRY)", u: "TRY", d: 120000, ct: "Aynı evin yıllık kira bedeli.", ce: "Annual rent for same property." },
    ],
    f: { oran: "evFiyati / Math.max(1, yillikKira)", sonuc: "evFiyati / Math.max(1, yillikKira)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "Fiyat/Kira Oranı" },
  },
  // 63. Cap Rate
  {
    slug: "cap-rate-kira-getiri-hesaplama",
    dt: "Mülkün kredi kaldıracı hariç yıllık net getiri oranını (Cap Rate) hesaplar.",
    de: "Calculate property cap rate — unleveraged annual net return.",
    cat, st, ld, sa,
    inputs: [
      { id: "yillikNetGelir", lt: "Yıllık Net Kira Geliri (₺)", le: "Annual Net Rental Income (TRY)", u: "TRY", d: 120000, ct: "Giderler düşüldükten sonraki net kira geliri.", ce: "Net rental income after expenses." },
      { id: "mulkDegeri", lt: "Mülk Değeri (₺)", le: "Property Value (TRY)", u: "TRY", d: 1500000, ct: "Gayrimenkulün piyasa değeri.", ce: "Property market value." },
    ],
    f: { sonuc: "(yillikNetGelir / Math.max(1, mulkDegeri)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Cap Rate (Getiri Oranı)" },
  },
  // 64. Cash-on-Cash
  {
    slug: "cash-on-cash-getiri-hesaplama",
    dt: "Yatırılan özsermayenin yıllık nakit dönüş oranını (CoC) hesaplar.",
    de: "Calculate cash-on-cash (CoC) return on equity invested.",
    cat, st, ld, sa,
    inputs: [
      { id: "yillikNakitAks", lt: "Yıllık Nakit Akışı (₺)", le: "Annual Cash Flow (TRY)", u: "TRY", d: 60000, ct: "Kredi ödemesi sonrası yıllık nakit akışı.", ce: "Annual cash flow after debt service." },
      { id: "toplamNakitYatirim", lt: "Toplam Nakit Yatırım (₺)", le: "Total Cash Invested (TRY)", u: "TRY", d: 300000, ct: "Peşinat ve masraflar dahil toplam nakit çıkışı.", ce: "Total cash outlay including down payment and costs." },
    ],
    f: { sonuc: "(yillikNakitAks / Math.max(1, toplamNakitYatirim)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Cash-on-Cash Getiri" },
  },
  // 65. BRRRR
  {
    slug: "brrrr-yatirim-stratejisi-hesaplama",
    dt: "Al-Yenile-Kirala-Refinanse Et (BRRRR) modelinin sermaye getirisini hesaplar.",
    de: "Calculate ROI of the Buy-Rehab-Rent-Refinance-Repeat (BRRRR) strategy.",
    cat, st, ld, sa,
    inputs: [
      { id: "alim", lt: "Alım Fiyatı (₺)", le: "Purchase Price (TRY)", u: "TRY", d: 500000, ct: "Mülkün satın alma fiyatı.", ce: "Property purchase price." },
      { id: "rehab", lt: "Yenileme Maliyeti (₺)", le: "Rehab Cost (TRY)", u: "TRY", d: 150000, ct: "Tadilat ve yenileme giderleri.", ce: "Renovation costs." },
      { id: "deger", lt: "Yenilenmiş Değer (₺)", le: "After-Repair Value (TRY)", u: "TRY", d: 800000, ct: "Tadilat sonrası mülk değeri.", ce: "Post-renovation property value." },
      { id: "kredi", lt: "Kredi Tutarı (₺)", le: "Refinance Loan (TRY)", u: "TRY", d: 600000, ct: "Refinansman ile çekilen kredi.", ce: "Cash-out refinance loan." },
      { id: "kira", lt: "Aylık Kira (₺)", le: "Monthly Rent (TRY)", u: "TRY", d: 8000, ct: "Aylık kira geliri.", ce: "Monthly rental income." },
    ],
    f: { zorunluSermaye: "alim + rehab - kredi", sonuc: "((kira * 12) / Math.max(1, (alim + rehab - kredi))) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "BRRRR ROI" },
  },
  // 66. Kiralık Gayrimenkul Analizi
  {
    slug: "kiralik-gayrimenkul-analizi-hesaplama",
    dt: "Tüm giderler ve kredi sonrası aylık net nakit akışını hesaplar.",
    de: "Calculate monthly net cash flow from rental property after all expenses.",
    cat, st, ld, sa,
    inputs: [
      { id: "brutKira", lt: "Brüt Aylık Kira (₺)", le: "Gross Monthly Rent (TRY)", u: "TRY", d: 10000, ct: "Toplam aylık kira geliri.", ce: "Total monthly rental income." },
      { id: "bosluk", lt: "Boşluk Oranı (%)", le: "Vacancy Rate (%)", u: "%", d: 5, mn: 0, mx: 100, ct: "Yıllık boş geçen süre oranı.", ce: "Annual vacancy percentage." },
      { id: "isletme", lt: "Aylık İşletme Gideri (₺)", le: "Monthly Operating Cost (TRY)", u: "TRY", d: 2000, ct: "Vergi, sigorta, bakım giderleri.", ce: "Taxes, insurance, maintenance." },
      { id: "kredi", lt: "Aylık Kredi Taksiti (₺)", le: "Monthly Mortgage (TRY)", u: "TRY", d: 5000, ct: "Kredinin aylık geri ödemesi.", ce: "Monthly debt service." },
    ],
    f: { sonuc: "(brutKira * (1 - bosluk / 100)) - isletme - kredi" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Aylık Net Nakit Akışı" },
  },
  // 67. Emlak Komisyonu
  {
    slug: "emlak-komisyonu-hesaplama",
    dt: "Emlakçıya ödenecek aracılık hizmet bedelini hesaplar.",
    de: "Calculate real estate agent commission fee.",
    cat, st, ld, sa,
    inputs: [
      { id: "satisBedeli", lt: "Satış Bedeli (₺)", le: "Sale Price (TRY)", u: "TRY", d: 1500000, ct: "Gayrimenkul satış fiyatı.", ce: "Property sale price." },
      { id: "komisyonOrani", lt: "Komisyon Oranı (%)", le: "Commission Rate (%)", u: "%", d: 3, mn: 0, mx: 100, ct: "Emlakçı komisyon yüzdesi.", ce: "Agent commission percentage." },
    ],
    f: { sonuc: "satisBedeli * komisyonOrani / 100" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Emlak Komisyonu" },
  },
  // 68. Kapanış Maliyetleri
  {
    slug: "kapanis-maliyetleri-hesaplama",
    dt: "Tapu, ekspertiz ve dosya masrafları toplamını hesaplar.",
    de: "Calculate total closing costs including title, appraisal, and origination fees.",
    cat, st, ld, sa,
    inputs: [
      { id: "krediTutari", lt: "Kredi Tutarı (₺)", le: "Loan Amount (TRY)", u: "TRY", d: 1000000, ct: "Çekilen kredi anaparası.", ce: "Loan principal." },
      { id: "oran", lt: "Oran Bazlı Masraf (%)", le: "Percentage-Based Fee (%)", u: "%", d: 2, ct: "Kredi yüzdesiyle hesaplanan masraflar.", ce: "Percentage-based closing costs." },
      { id: "sabitUcretler", lt: "Sabit Ücretler (₺)", le: "Fixed Fees (TRY)", u: "TRY", d: 10000, ct: "Ekspertiz, ipotek tescili gibi sabit ücretler.", ce: "Fixed costs like appraisal and filing fees." },
    ],
    f: { sonuc: "(krediTutari * oran / 100) + sabitUcretler" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Toplam Kapanış Maliyeti" },
  },
  // 69. HELOC
  {
    slug: "heloc-ev-sermayesi-kredisi-hesaplama",
    dt: "Evin mevcut değerine göre çekilebilecek ek kredi limitini (HELOC) hesaplar.",
    de: "Calculate home equity line of credit (HELOC) limit.",
    cat, st, ld, sa,
    inputs: [
      { id: "evDegeri", lt: "Ev Değeri (₺)", le: "Home Value (TRY)", u: "TRY", d: 1500000, ct: "Evin güncel piyasa değeri.", ce: "Current home market value." },
      { id: "kalanBorc", lt: "Kalan Borç (₺)", le: "Remaining Mortgage (TRY)", u: "TRY", d: 500000, ct: "Mevcut mortgage bakiyesi.", ce: "Current mortgage balance." },
      { id: "maksOran", lt: "Maks Kredi/Değer Oranı (%)", le: "Max LTV Ratio (%)", u: "%", d: 80, mn: 0, mx: 100, ct: "Bankanın izin verdiği maksimum kredi/değer oranı.", ce: "Maximum loan-to-value ratio." },
    ],
    f: { sonuc: "(evDegeri * maksOran / 100) - kalanBorc" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "HELOC Limiti" },
  },
  // 70. PMI
  {
    slug: "pmi-ozel-mortgage-sigortasi-hesaplama",
    dt: "Düşük peşinatlarda bankayı koruyan aylık özel mortgage sigortası primini hesaplar.",
    de: "Calculate monthly private mortgage insurance (PMI) premium for low down payments.",
    cat, st, ld, sa,
    inputs: [
      { id: "krediTutari", lt: "Kredi Tutarı (₺)", le: "Loan Amount (TRY)", u: "TRY", d: 1000000, ct: "Konut kredisi anaparası.", ce: "Mortgage principal." },
      { id: "pmiOrani", lt: "Yıllık PMI Oranı (%)", le: "Annual PMI Rate (%)", u: "%", d: 0.5, ct: "PMI sigorta prim oranı.", ce: "PMI insurance premium rate." },
    ],
    f: { sonuc: "(krediTutari * pmiOrani / 100) / 12" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Aylık PMI Primi" },
  },
  // 71. FHA Kredisi
  {
    slug: "fha-kredisi-hesaplama",
    dt: "Devlet destekli FHA kredisinin başlangıç ve aylık sigorta maliyetini hesaplar.",
    de: "Calculate FHA loan upfront and annual mortgage insurance premiums.",
    cat, st, ld, sa,
    inputs: [
      { id: "kredi", lt: "Kredi Tutarı (₺)", le: "Loan Amount (TRY)", u: "TRY", d: 1000000, ct: "FHA kredi tutarı.", ce: "FHA loan amount." },
      { id: "pesinPrim", lt: "Peşin Sigorta Primi (%)", le: "Upfront MIP Rate (%)", u: "%", d: 1.75, ct: "Peşin ödenen sigorta primi.", ce: "Upfront mortgage insurance premium." },
      { id: "yillikPrim", lt: "Yıllık Sigorta Primi (%)", le: "Annual MIP Rate (%)", u: "%", d: 0.85, ct: "Yıllık mortgage sigorta primi.", ce: "Annual mortgage insurance premium." },
    ],
    f: { pesin: "kredi * pesinPrim / 100", sonuc: "(kredi * yillikPrim / 100) / 12" },
    op: "sonuc", ou: "TRY", ok: ["pesin", "sonuc"],
    ol: { pesin: "Peşin Sigorta Primi", sonuc: "Aylık Sigorta Primi" },
  },
  // 72. VA Kredisi
  {
    slug: "va-kredisi-hesaplama",
    dt: "Gaziler için peşinatsız kredinin faize eklenen fon maliyetini hesaplar.",
    de: "Calculate VA loan funding fee added to the financed amount.",
    cat, st, ld, sa,
    inputs: [
      { id: "kredi", lt: "Kredi Tutarı (₺)", le: "Loan Amount (TRY)", u: "TRY", d: 1000000, ct: "VA kredi tutarı.", ce: "VA loan amount." },
      { id: "finansmanUcreti", lt: "Fonlama Ücreti (%)", le: "Funding Fee Rate (%)", u: "%", d: 2.3, ct: "VA fonlama ücreti oranı.", ce: "VA funding fee percentage." },
    ],
    f: { sonuc: "kredi * (1 + finansmanUcreti / 100)" },
    op: "sonuc", ou: "TRY", ok: ["sonuc"],
    ol: { sonuc: "Finanse Edilen Toplam Tutar" },
  },
];
