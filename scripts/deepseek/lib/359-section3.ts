import type { ToolDef } from "./359-types";

const cat = "finance-sales-working-capital";
const st = "Kredi ve Borç";
const ld: string[] = [];
const sa: string[] = ["Compare multiple loan offers before committing.", "Consider total cost including fees."];

export const section3: ToolDef[] = [
  // 73. Kişisel Kredi
  { slug: "personal-loan-calculator", dt: "İhtiyaç kredisinin aylık ödemesini ve toplam faiz yükünü hesaplar.", de: "Calculate monthly payment and total interest for a personal loan.", cat, st, ld, sa,
    inputs: [
      { id: "tutar", lt: "Kredi Tutarı (₺)", le: "Loan Amount (USD)", u: "USD", d: 50000, ct: "Çekilen kredi anaparası.", ce: "Loan principal." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 24, ct: "Kredinin yıllık faiz oranı.", ce: "Annual interest rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 36, mn: 1, ct: "Kredi vadesi.", ce: "Loan term." },
      { id: "masraf", lt: "Masraflar (₺)", le: "Fees (USD)", u: "USD", d: 500, ct: "Dosya masrafı ve diğer ücretler.", ce: "Origination and processing fees." },
    ],
    f: { taksit: "faiz === 0 ? (tutar - masraf) / Math.max(1, vade) : (tutar - masraf) * ((faiz / 1200) * Math.pow(1 + faiz / 1200, vade)) / (Math.pow(1 + faiz / 1200, vade) - 1)", sonuc: "((faiz === 0 ? (tutar - masraf) / Math.max(1, vade) : (tutar - masraf) * ((faiz / 1200) * Math.pow(1 + faiz / 1200, vade)) / (Math.pow(1 + faiz / 1200, vade) - 1)) * vade + masraf - tutar)" },
    op: "sonuc", ou: "USD", ok: ["taksit", "sonuc"],
    ol: { taksit: "Aylık Taksit", sonuc: "Toplam Maliyet" }, },

  // 74. Araba Kredisi
  { slug: "car-loan-calculator", dt: "Taşıt kredisinin peşinat düşülmüş aylık taksitini hesaplar.", de: "Calculate monthly car loan payment after down payment.", cat, st, ld, sa,
    inputs: [
      { id: "fiyat", lt: "Araç Fiyatı (₺)", le: "Vehicle Price (USD)", u: "USD", d: 500000, ct: "Aracın satış fiyatı.", ce: "Vehicle purchase price." },
      { id: "pesin", lt: "Peşinat (₺)", le: "Down Payment (USD)", u: "USD", d: 100000, ct: "Peşin ödenen tutar.", ce: "Down payment amount." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 20, ct: "Taşıt kredisi faiz oranı.", ce: "Car loan interest rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 48, mn: 1, ct: "Kredi vadesi.", ce: "Loan term." },
    ],
    f: { krediNet: "fiyat - pesin", sonuc: "(fiyat - pesin) * ((faiz / 1200) * Math.pow(1 + faiz / 1200, vade)) / (Math.pow(1 + faiz / 1200, vade) - 1)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Aylık Araba Kredisi Taksiti" }, },

  // 75. Tekne Kredisi
  { slug: "boat-loan-calculator", dt: "Deniz aracı finansmanının aylık ödeme planını hesaplar.", de: "Calculate monthly boat loan payment.", cat, st, ld, sa,
    inputs: [
      { id: "fiyat", lt: "Tekne Fiyatı (₺)", le: "Boat Price (USD)", u: "USD", d: 1000000, ct: "Teknenin satış fiyatı.", ce: "Boat purchase price." },
      { id: "pesin", lt: "Peşinat (₺)", le: "Down Payment (USD)", u: "USD", d: 200000, ct: "Peşinat tutarı.", ce: "Down payment." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 18, ct: "Tekne kredisi faiz oranı.", ce: "Boat loan rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 84, mn: 1, ct: "Kredi vadesi.", ce: "Loan term." },
    ],
    f: { krediNet: "fiyat - pesin", sonuc: "(fiyat - pesin) * ((faiz / 1200) * Math.pow(1 + faiz / 1200, vade)) / (Math.pow(1 + faiz / 1200, vade) - 1)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Aylık Tekne Kredisi Taksiti" }, },

  // 76. Motosiklet Kredisi
  { slug: "motorcycle-loan-calculator", dt: "Motosiklet alımının aylık taksit tutarını hesaplar.", de: "Calculate monthly motorcycle loan payment.", cat, st, ld, sa,
    inputs: [
      { id: "fiyat", lt: "Motosiklet Fiyatı (₺)", le: "Motorcycle Price (USD)", u: "USD", d: 150000, ct: "Motosikletin satış fiyatı.", ce: "Motorcycle price." },
      { id: "pesin", lt: "Peşinat (₺)", le: "Down Payment (USD)", u: "USD", d: 30000, ct: "Peşinat tutarı.", ce: "Down payment." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 22, ct: "Kredi faiz oranı.", ce: "Loan rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 36, mn: 1, ct: "Kredi vadesi.", ce: "Loan term." },
    ],
    f: { sonuc: "(fiyat - pesin) * ((faiz / 1200) * Math.pow(1 + faiz / 1200, vade)) / (Math.pow(1 + faiz / 1200, vade) - 1)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Aylık Motosiklet Kredisi Taksiti" }, },

  // 77. RV Kredisi
  { slug: "rv-loan-calculator", dt: "Karavan finansmanının uzun vadeli aylık ödemesini hesaplar.", de: "Calculate monthly RV loan payment for recreational vehicles.", cat, st, ld, sa,
    inputs: [
      { id: "fiyat", lt: "Karavan Fiyatı (₺)", le: "RV Price (USD)", u: "USD", d: 800000, ct: "Karavanın satış fiyatı.", ce: "RV purchase price." },
      { id: "pesin", lt: "Peşinat (₺)", le: "Down Payment (USD)", u: "USD", d: 160000, ct: "Peşinat tutarı.", ce: "Down payment." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 15, ct: "Kredi faiz oranı.", ce: "Loan rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 120, mn: 1, ct: "Kredi vadesi.", ce: "Loan term." },
    ],
    f: { sonuc: "(fiyat - pesin) * ((faiz / 1200) * Math.pow(1 + faiz / 1200, vade)) / (Math.pow(1 + faiz / 1200, vade) - 1)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Aylık RV Kredisi Taksiti" }, },

  // 78. Öğrenci Kredisi
  { slug: "student-loan-calculator", dt: "Mezuniyet sonrası erteleme süresi bitince başlayan aylık taksiti hesaplar.", de: "Calculate student loan payment starting after grace period.", cat, st, ld, sa,
    inputs: [
      { id: "tutar", lt: "Kredi Tutarı (₺)", le: "Loan Amount (USD)", u: "USD", d: 100000, ct: "Öğrenim kredisi anaparası.", ce: "Student loan principal." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 12, ct: "Kredinin faiz oranı.", ce: "Loan interest rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 60, mn: 1, ct: "Ödeme vadesi.", ce: "Repayment term." },
      { id: "gracePeriod", lt: "Erteleme Süresi (Ay)", le: "Grace Period (Months)", u: "months", d: 6, mn: 0, ct: "Mezuniyet sonrası ödemesiz dönem.", ce: "Post-graduation deferment period." },
    ],
    f: { sonuc: "faiz === 0 ? tutar / Math.max(1, vade) : tutar * ((faiz / 1200) * Math.pow(1 + faiz / 1200, vade - gracePeriod)) / (Math.pow(1 + faiz / 1200, vade - gracePeriod) - 1)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Erteleme Sonrası Aylık Taksit" }, },

  // 79. Öğrenci Kredisi Refinansman
  { slug: "student-loan-refinance-calculator", dt: "Faiz düşüşüyle vade sonuna kadar sağlanan net kazancı hesaplar.", de: "Calculate savings from student loan refinancing.", cat, st, ld, sa,
    inputs: [
      { id: "eskiBakiye", lt: "Mevcut Bakiye (₺)", le: "Current Balance (USD)", u: "USD", d: 100000, ct: "Kalan kredi borcu.", ce: "Remaining loan balance." },
      { id: "eskiFaiz", lt: "Eski Faiz (%)", le: "Old Interest (%)", u: "%", d: 12, ct: "Mevcut kredinin faizi.", ce: "Current interest rate." },
      { id: "yeniFaiz", lt: "Yeni Faiz (%)", le: "New Interest (%)", u: "%", d: 8, ct: "Refinansman sonrası faiz.", ce: "Refinanced interest rate." },
      { id: "vade", lt: "Kalan Vade (Ay)", le: "Remaining Term (Months)", u: "months", d: 48, mn: 1, ct: "Kalan ödeme süresi.", ce: "Remaining repayment period." },
    ],
    f: { eskiTaksit: "eskiFaiz === 0 ? eskiBakiye / Math.max(1, vade) : eskiBakiye * ((eskiFaiz / 1200) * Math.pow(1 + eskiFaiz / 1200, vade)) / (Math.pow(1 + eskiFaiz / 1200, vade) - 1)", yeniTaksit: "yeniFaiz === 0 ? eskiBakiye / Math.max(1, vade) : eskiBakiye * ((yeniFaiz / 1200) * Math.pow(1 + yeniFaiz / 1200, vade)) / (Math.pow(1 + yeniFaiz / 1200, vade) - 1)", sonuc: "((eskiFaiz === 0 ? eskiBakiye / Math.max(1, vade) : eskiBakiye * ((eskiFaiz / 1200) * Math.pow(1 + eskiFaiz / 1200, vade)) / (Math.pow(1 + eskiFaiz / 1200, vade) - 1)) - (yeniFaiz === 0 ? eskiBakiye / Math.max(1, vade) : eskiBakiye * ((yeniFaiz / 1200) * Math.pow(1 + yeniFaiz / 1200, vade)) / (Math.pow(1 + yeniFaiz / 1200, vade) - 1))) * vade" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Toplam Tasarruf" }, },

  // 80. Kredi Kartı Faiz
  { slug: "credit-card-interest-calculator", dt: "Ekstre kesiminden ödeme gününe kadar işleyen günlük faizi hesaplar.", de: "Calculate daily credit card interest between statement and payment.", cat, st, ld, sa,
    inputs: [
      { id: "bakiye", lt: "Dönem Borcu (₺)", le: "Statement Balance (USD)", u: "USD", d: 10000, ct: "Kredi kartı ekstre borcu.", ce: "Credit card statement balance." },
      { id: "yillikFaiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 120, ct: "Kredi kartı yıllık faiz oranı.", ce: "Annual credit card interest rate." },
      { id: "gun", lt: "Gecikme Günü", le: "Days Overdue", u: "days", d: 30, mn: 0, ct: "Ödemesiz geçen gün sayısı.", ce: "Number of days past due." },
    ],
    f: { sonuc: "bakiye * (yillikFaiz / 36500) * gun" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "İşlemiş Faiz" }, },

  // 81. Kredi Kartı Minimum Ödeme
  { slug: "minimum-credit-card-payment-calculator", dt: "Yasal olarak ödenmesi gereken asgari kredi kartı ödeme tutarını hesaplar.", de: "Calculate minimum credit card payment required by law.", cat, st, ld, sa,
    inputs: [
      { id: "bakiye", lt: "Toplam Borç (₺)", le: "Total Balance (USD)", u: "USD", d: 10000, ct: "Kredi kartı toplam borcu.", ce: "Total credit card balance." },
      { id: "asgariOran", lt: "Asgari Ödeme Oranı (%)", le: "Minimum Payment Rate (%)", u: "%", d: 20, mn: 0, mx: 100, ct: "Asgari ödeme yüzdesi.", ce: "Minimum payment percentage." },
    ],
    f: { sonuc: "Math.max(bakiye * asgariOran / 100, 10)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Asgari Ödeme Tutarı" }, },

  // 82. Kredi Kartı İşlem Ücreti
  { slug: "credit-card-processing-fee-calculator", dt: "POS cihazı veya sanal ödeme altyapısı kesintisini hesaplar.", de: "Calculate credit card processing fee for POS or online payments.", cat, st, ld, sa,
    inputs: [
      { id: "satis", lt: "Satış Tutarı (₺)", le: "Sale Amount (USD)", u: "USD", d: 1000, ct: "İşlem tutarı.", ce: "Transaction amount." },
      { id: "yuzde", lt: "Yüzde Komisyon (%)", le: "Percentage Fee (%)", u: "%", d: 2.5, ct: "İşlem başı yüzde komisyon.", ce: "Per-transaction percentage fee." },
      { id: "sabit", lt: "Sabit Ücret (₺)", le: "Fixed Fee (USD)", u: "USD", d: 0.5, ct: "İşlem başı sabit ücret.", ce: "Per-transaction fixed fee." },
    ],
    f: { sonuc: "(satis * yuzde / 100) + sabit" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "İşlem Ücreti" }, },

  // 83. Kredi Geri Ödeme (Payoff)
  { slug: "loan-payoff-calculator", dt: "Ek ödemeyle kredinin kapanacağı kısaltılmış süreyi hesaplar.", de: "Calculate early loan payoff time with extra payments.", cat, st, ld, sa,
    inputs: [
      { id: "anapara", lt: "Kredi Anaparası (₺)", le: "Loan Principal (USD)", u: "USD", d: 100000, ct: "Kalan kredi borcu.", ce: "Remaining loan balance." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 15, ct: "Kredi faiz oranı.", ce: "Loan rate." },
      { id: "odeme", lt: "Normal Aylık Taksit (₺)", le: "Regular Payment (USD)", u: "USD", d: 3000, ct: "Standart aylık ödeme.", ce: "Standard monthly payment." },
      { id: "ekOdeme", lt: "Ek Aylık Ödeme (₺)", le: "Extra Monthly Payment (USD)", u: "USD", d: 1000, ct: "Anaparaya ek ödeme.", ce: "Extra principal payment." },
    ],
    f: { sonuc: "-Math.log(Math.max(0.0001, 1 - (anapara * (faiz / 1200)) / (odeme + ekOdeme))) / Math.log(1 + faiz / 1200)" },
    op: "sonuc", ou: "months", ok: ["sonuc"],
    ol: { sonuc: "Kalan Ay (Ek Ödemeyle)" }, },

  // 84. Borç Konsolidasyon
  { slug: "debt-consolidation-calculator", dt: "Tüm borçların tek bir düşük faizli kredide birleştirilmiş taksitini hesaplar.", de: "Calculate consolidated loan payment combining all debts.", cat, st, ld, sa,
    inputs: [
      { id: "toplamBorc", lt: "Toplam Borç (₺)", le: "Total Debt (USD)", u: "USD", d: 100000, ct: "Birleştirilecek tüm borçlar.", ce: "Total debt to consolidate." },
      { id: "yeniFaiz", lt: "Yeni Kredi Faizi (%)", le: "New Loan Rate (%)", u: "%", d: 10, ct: "Konsolidasyon kredisi faizi.", ce: "Consolidation loan rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 60, mn: 1, ct: "Yeni kredi vadesi.", ce: "New loan term." },
    ],
    f: { sonuc: "toplamBorc * ((yeniFaiz / 1200) * Math.pow(1 + yeniFaiz / 1200, vade)) / (Math.pow(1 + yeniFaiz / 1200, vade) - 1)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Birleştirilmiş Aylık Taksit" }, },

  // 85. DTI
  { slug: "debt-to-income-ratio-calculator", dt: "Gelirin borç ödemelerine ayrılan yüzdesini (DTI) hesaplar.", de: "Calculate debt-to-income (DTI) ratio.", cat, st, ld, sa,
    inputs: [
      { id: "aylikBorc", lt: "Toplam Aylık Borç (₺)", le: "Total Monthly Debt (USD)", u: "USD", d: 15000, ct: "Tüm borçların aylık toplamı.", ce: "Total monthly debt payments." },
      { id: "brutGelir", lt: "Brüt Aylık Gelir (₺)", le: "Gross Monthly Income (USD)", u: "USD", d: 50000, ct: "Vergi öncesi aylık gelir.", ce: "Monthly gross income." },
    ],
    f: { sonuc: "(aylikBorc / Math.max(1, brutGelir)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"],
    ol: { sonuc: "Borç/Gelir Oranı (DTI)" }, },

  // 86. DSCR
  { slug: "debt-service-coverage-ratio-calculator", dt: "İşletmenin borç taksitlerini ödeme kapasitesini (DSCR) hesaplar.", de: "Calculate debt service coverage ratio (DSCR).", cat, st, ld, sa,
    inputs: [
      { id: "netIsletmeGeliri", lt: "Net İşletme Geliri (₺)", le: "Net Operating Income (USD)", u: "USD", d: 200000, ct: "Yıllık net işletme geliri.", ce: "Annual net operating income." },
      { id: "yillikBorcOdemesi", lt: "Yıllık Borç Ödemesi (₺)", le: "Annual Debt Service (USD)", u: "USD", d: 120000, ct: "Yıllık anapara+faiz ödemesi.", ce: "Annual principal + interest payment." },
    ],
    f: { sonuc: "netIsletmeGeliri / Math.max(1, yillikBorcOdemesi)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"],
    ol: { sonuc: "DSCR Oranı" }, },

  // 87. Kredi Uygunluk
  { slug: "loan-affordability-calculator", dt: "Bütçeyi sarsmadan ödenebilecek maksimum kredi taksitini hesaplar.", de: "Calculate maximum affordable loan payment based on budget.", cat, st, ld, sa,
    inputs: [
      { id: "netGelir", lt: "Net Aylık Gelir (₺)", le: "Net Monthly Income (USD)", u: "USD", d: 30000, ct: "Vergi sonrası net gelir.", ce: "After-tax monthly income." },
      { id: "yasamGideri", lt: "Aylık Yaşam Gideri (₺)", le: "Monthly Living Expense (USD)", u: "USD", d: 12000, ct: "Temel yaşam harcamaları.", ce: "Basic living expenses." },
      { id: "maxTaksitOrani", lt: "Maks Taksit Oranı (%)", le: "Max Payment Ratio (%)", u: "%", d: 35, mn: 0, mx: 100, ct: "Gelirin maksimum yüzdesi.", ce: "Maximum percentage of income." },
    ],
    f: { sonuc: "Math.min((netGelir - yasamGideri), netGelir * maxTaksitOrani / 100)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Maksimum Uygun Kredi Taksiti" }, },

  // 88. USD Kredisi
  { slug: "usd-loan-cost-calculator", dt: "Döviz kredisinin kur riskiyle artırılmış tahmini TL maliyetini hesaplar.", de: "Calculate estimated TRY cost of a USD loan with FX risk.", cat, st, ld, sa,
    inputs: [
      { id: "tutar", lt: "Kredi Tutarı (USD)", le: "Loan Amount (USD)", u: "USD", d: 50000, ct: "USD cinsinden kredi anaparası.", ce: "Loan principal in USD." },
      { id: "faiz", lt: "Yıllık Faiz (%)", le: "Annual Interest (%)", u: "%", d: 8, ct: "Kredi faiz oranı.", ce: "Loan interest rate." },
      { id: "vade", lt: "Vade (Ay)", le: "Term (Months)", u: "months", d: 36, mn: 1, ct: "Kredi vadesi.", ce: "Loan term." },
      { id: "kurBeklentisi", lt: "Kur Beklentisi (%)", le: "FX Expected Change (%)", u: "%", d: 20, ct: "Kurun yıllık artış beklentisi.", ce: "Expected annual FX rate increase." },
      { id: "mevcutKur", lt: "Mevcut Kur (₺/$)", le: "Current FX Rate (USD/USD)", u: "USD", d: 30, ct: "Güncel dolar kuru.", ce: "Current USD/TRY rate." },
    ],
    f: { usdTaksit: "faiz === 0 ? tutar / Math.max(1, vade) : tutar * ((faiz / 1200) * Math.pow(1 + faiz / 1200, vade)) / (Math.pow(1 + faiz / 1200, vade) - 1)", sonuc: "(faiz === 0 ? tutar / Math.max(1, vade) : tutar * ((faiz / 1200) * Math.pow(1 + faiz / 1200, vade)) / (Math.pow(1 + faiz / 1200, vade) - 1)) * mevcutKur * Math.pow(1 + kurBeklentisi / 100, vade / 12)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"],
    ol: { sonuc: "Tahmini TL Aylık Taksit" }, },
];
