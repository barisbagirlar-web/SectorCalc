import type { ToolDef } from "./359-types";
const c = "finance-sales-working-capital"; const s = "İşletme"; const ld: string[] = []; const sa: string[] = ["Verify financial projections with actual data.", "Review assumptions quarterly."];
const t = (sl: string, dt: string, de: string, ins: any[], f: any, op: string, ok: string[], ol: any): ToolDef => ({ slug: sl, dt, de, cat: c, st: s, ld, sa, inputs: ins, f, op, ou: ok.includes("Yüzde")||ok.includes("ratio")||ok.includes("Oran") ? ok.includes("TL") ? "TRY" : ok.includes("%")||ok[0]?.includes("Oran") ? "%" : "ratio" : "TRY", ok, ol });
// This section uses helper to keep it compact but still correct
export const section4: ToolDef[] = [
  // 89. İşletme Değerleme
  { slug: "business-valuation-multiple-calculator", dt: "Piyasa emsallerine göre tahmini satış değerini hesaplar.", de: "Estimate business valuation based on EBITDA multiples.", cat: c, st: s, ld, sa,
    inputs: [{ id: "favok", lt: "FAVÖK (TL)", le: "EBITDA (USD)", u: "USD", d: 500000, ct: "Vergi ve faiz öncesi kâr.", ce: "Earnings before interest, tax, depreciation." },{ id: "carpan", lt: "Sektör Çarpanı", le: "Industry Multiple", u: "", d: 5, mn: 1, ct: "Sektörün ortalama FAVÖK çarpanı.", ce: "Industry average EBITDA multiple." }],
    f: { sonuc: "favok * carpan" }, op: "sonuc", ou: "USD", ok: ["sonuc"], ol: { sonuc: "Tahmini İşletme Değeri" } },
  // 90. Girişim Değerleme
  { slug: "startup-valuation-calculator", dt: "Yatırım öncesi ve sonrası girişim değerini hesaplar.", de: "Calculate pre-money and post-money startup valuation.", cat: c, st: s, ld, sa,
    inputs: [{ id: "yatirim", lt: "Yatırım Tutarı (TL)", le: "Investment Amount (USD)", u: "USD", d: 1000000, ct: "Yatırımcının koyduğu tutar.", ce: "Investor capital contribution." },{ id: "hisseOrani", lt: "Verilen Hisse Oranı (%)", le: "Equity Given (%)", u: "%", d: 20, mn: 0.1, mx: 99, ct: "Yatırımcıya verilen hisse yüzdesi.", ce: "Percentage equity given to investor." }],
    f: { degerlemeSonrasi: "yatirim / Math.max(0.0001, hisseOrani / 100)", sonuc: "(yatirim / Math.max(0.0001, hisseOrani / 100)) - yatirim" },
    op: "sonuc", ou: "USD", ok: ["sonuc"], ol: { sonuc: "Yatırım Öncesi Değerleme" } },
  // 91. ESPP
  { slug: "espp-calculator", dt: "İndirimli fiyatla alınabilecek hisse adedini hesaplar.", de: "Calculate shares purchasable through employee stock purchase plan.", cat: c, st: s, ld, sa,
    inputs: [{ id: "piyasaFiyati", lt: "Piyasa Fiyatı (TL)", le: "Market Price (USD)", u: "USD", d: 100, ct: "Hisse senedinin piyasa fiyatı.", ce: "Stock market price." },{ id: "iskonto", lt: "İskonto Oranı (%)", le: "Discount Rate (%)", u: "%", d: 15, mn: 0, mx: 100, ct: "ESPP indirim oranı.", ce: "ESPP purchase discount." },{ id: "katki", lt: "Aylık Katkı (TL)", le: "Monthly Contribution (USD)", u: "USD", d: 1000, ct: "Çalışanın aylık katkısı.", ce: "Employee monthly contribution." }],
    f: { alimFiyati: "piyasaFiyati * (1 - iskonto / 100)", sonuc: "katki / Math.max(0.0001, (piyasaFiyati * (1 - iskonto / 100)))" },
    op: "sonuc", ou: "shares", ok: ["sonuc"], ol: { sonuc: "Alınabilecek Hisse" } },
  // 92. RSU
  { slug: "rsu-calculator", dt: "Vergi kesintisi sonrası ele geçen net hisse sayısını hesaplar.", de: "Calculate net RSU shares after tax withholding.", cat: c, st: s, ld, sa,
    inputs: [{ id: "hisseSayisi", lt: "Verilen Hisse (Adet)", le: "RSU Shares Granted", u: "shares", d: 1000, ct: "Hak kazanılan RSU hisse adedi.", ce: "Vested RSU shares." },{ id: "hakKazanma", lt: "Hak Kazanma (%)", le: "Vesting Percentage (%)", u: "%", d: 25, mn: 0, mx: 100, ct: "Dönemde hak kazanılan yüzde.", ce: "Vesting percentage." },{ id: "vergi", lt: "Vergi Kesintisi (%)", le: "Tax Withholding (%)", u: "%", d: 25, mn: 0, mx: 100, ct: "Stopaj oranı.", ce: "Withholding tax rate." }],
    f: { sonuc: "(hisseSayisi * hakKazanma / 100) * (1 - vergi / 100)" },
    op: "sonuc", ou: "shares", ok: ["sonuc"], ol: { sonuc: "Net Hisse" } },
  // 93. Dönüştürülebilir Not
  { slug: "convertible-note-calculator", dt: "Borç senedinin hisseye dönüşmesiyle alınan hisse adedini hesaplar.", de: "Calculate shares received from convertible note conversion.", cat: c, st: s, ld, sa,
    inputs: [{ id: "yatirim", lt: "Yatırım Tutarı (TL)", le: "Investment (USD)", u: "USD", d: 500000, ct: "Nota yatırılan tutar.", ce: "Note investment amount." },{ id: "degerleme", lt: "Değerleme Tavanı (TL)", le: "Valuation Cap (USD)", u: "USD", d: 5000000, ct: "Dönüşümdeki tavan değerleme.", ce: "Conversion valuation cap." },{ id: "iskonto", lt: "İskonto (%)", le: "Discount (%)", u: "%", d: 20, mn: 0, mx: 100, ct: "Dönüşüm iskontosu.", ce: "Conversion discount." },{ id: "faiz", lt: "Faiz (%)", le: "Interest (%)", u: "%", d: 5, ct: "Notun birikmiş faizi.", ce: "Accrued interest." }],
    f: { donusumFiyati: "degerleme * (1 - iskonto / 100)", sonuc: "(yatirim * (1 + faiz / 100)) / Math.max(0.0001, (degerleme * (1 - iskonto / 100)))" },
    op: "sonuc", ou: "shares", ok: ["sonuc"], ol: { sonuc: "Dönüşüm Sonrası Hisse" } },
  // 94. SAFE
  { slug: "safe-agreement-calculator", dt: "SAFE anlaşmasıyla yatırımcıya verilecek hisse adedini hesaplar.", de: "Calculate shares issued under a SAFE agreement.", cat: c, st: s, ld, sa,
    inputs: [{ id: "yatirim", lt: "Yatırım (TL)", le: "Investment (USD)", u: "USD", d: 500000, ct: "SAFE yatırım tutarı.", ce: "SAFE investment." },{ id: "tavanDeger", lt: "Değerleme Tavanı (TL)", le: "Valuation Cap (USD)", u: "USD", d: 5000000, ct: "Maksimum değerleme.", ce: "Valuation cap." },{ id: "toplamHisse", lt: "Toplam Hisse (Adet)", le: "Total Shares", u: "shares", d: 1000000, ct: "Şirketin toplam hisse adedi.", ce: "Total shares outstanding." }],
    f: { donusumFiyati: "tavanDeger / Math.max(1, toplamHisse)", sonuc: "yatirim / Math.max(0.0001, (tavanDeger / Math.max(1, toplamHisse)))" },
    op: "sonuc", ou: "shares", ok: ["sonuc"], ol: { sonuc: "Yeni Hisse Adedi" } },
  // 95. Hisse Sulandırması
  { slug: "equity-dilution-calculator", dt: "Mevcut hissedarların mülkiyet oranındaki azalmayı (sulandırma) hesaplar.", de: "Calculate equity dilution percentage for existing shareholders.", cat: c, st: s, ld, sa,
    inputs: [{ id: "mevcutHisse", lt: "Mevcut Hisse (Adet)", le: "Current Shares", u: "shares", d: 1000000, ct: "Mevcut toplam hisse.", ce: "Current total shares." },{ id: "yeniHisse", lt: "Yeni Hisse (Adet)", le: "New Shares", u: "shares", d: 200000, ct: "Yeni ihraç edilen hisse.", ce: "Newly issued shares." }],
    f: { sonuc: "yeniHisse / Math.max(1, (mevcutHisse + yeniHisse)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"], ol: { sonuc: "Sulandırma Oranı" } },
  // 96. Cap Table
  { slug: "cap-table-calculator", dt: "Her paydaşın güncel mülkiyet oranını hesaplar.", de: "Calculate ownership percentages in a cap table.", cat: c, st: s, ld, sa,
    inputs: [{ id: "kurucu", lt: "Kurucu Hisse (Adet)", le: "Founder Shares", u: "shares", d: 600000, ct: "Kurucuya ait hisse.", ce: "Founder shares." },{ id: "yatirimci", lt: "Yatırımcı Hisse (Adet)", le: "Investor Shares", u: "shares", d: 300000, ct: "Yatırımcıya ait hisse.", ce: "Investor shares." },{ id: "opsiyon", lt: "Opsiyon Havuzu (Adet)", le: "Option Pool", u: "shares", d: 100000, ct: "Çalışan opsiyon havuzu.", ce: "Employee option pool." }],
    f: { toplam: "kurucu + yatirimci + opsiyon", sonuc: "(kurucu / Math.max(1, (kurucu + yatirimci + opsiyon))) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"], ol: { sonuc: "Kurucu Oranı" } },
  // 97. CAC
  { slug: "customer-acquisition-cost-calculator", dt: "Bir yeni müşteriyi kazanmanın ortalama maliyetini (CAC) hesaplar.", de: "Calculate customer acquisition cost (CAC).", cat: c, st: s, ld, sa,
    inputs: [{ id: "pazarlama", lt: "Pazarlama Gideri (TL)", le: "Marketing Spend (USD)", u: "USD", d: 50000, ct: "Dönem pazarlama harcaması.", ce: "Marketing expenses." },{ id: "satisGideri", lt: "Satış Gideri (TL)", le: "Sales Cost (USD)", u: "USD", d: 30000, ct: "Satış ekibi giderleri.", ce: "Sales team costs." },{ id: "yeniMusteri", lt: "Yeni Müşteri (Adet)", le: "New Customers", u: "customers", d: 100, ct: "Kazanılan yeni müşteri sayısı.", ce: "New customers acquired." }],
    f: { sonuc: "(pazarlama + satisGideri) / Math.max(1, yeniMusteri)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"], ol: { sonuc: "Müşteri Edinim Maliyeti (CAC)" } },
  // 98. CLV
  { slug: "customer-lifetime-value-calculator", dt: "Müşterinin ömrü boyunca kazandırdığı net kârı (CLV) hesaplar.", de: "Calculate customer lifetime value (CLV).", cat: c, st: s, ld, sa,
    inputs: [{ id: "ortSiparis", lt: "Ortalama Sipariş (TL)", le: "Avg Order Value (USD)", u: "USD", d: 100, ct: "Müşteri başına ortalama sipariş.", ce: "Average order value." },{ id: "siklik", lt: "Yıllık Sipariş Sıklığı", le: "Orders per Year", u: "per year", d: 12, mn: 1, ct: "Müşterinin yıllık alışveriş sayısı.", ce: "Purchase frequency per year." },{ id: "omur", lt: "Müşteri Ömrü (Yıl)", le: "Customer Lifetime (Years)", u: "years", d: 3, mn: 0, ct: "Ortalama müşteri sadakat süresi.", ce: "Average customer retention." },{ id: "marj", lt: "Kâr Marjı (%)", le: "Profit Margin (%)", u: "%", d: 30, mn: 0, mx: 100, ct: "Net kâr marjı.", ce: "Net profit margin." }],
    f: { sonuc: "ortSiparis * siklik * omur * (marj / 100)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"], ol: { sonuc: "Müşteri Yaşam Boyu Değeri (CLV)" } },
  // 99. CAC/CLV
  { slug: "cac-to-clv-ratio-calculator", dt: "Müşteri edinim verimliliğini (CAC/CLV oranı) hesaplar.", de: "Calculate CAC to CLV ratio for acquisition efficiency.", cat: c, st: s, ld, sa,
    inputs: [{ id: "clv", lt: "CLV (TL)", le: "CLV (USD)", u: "USD", d: 5000, ct: "Müşteri yaşam boyu değeri.", ce: "Customer lifetime value." },{ id: "cac", lt: "CAC (TL)", le: "CAC (USD)", u: "USD", d: 1000, ct: "Müşteri edinim maliyeti.", ce: "Customer acquisition cost." }],
    f: { sonuc: "clv / Math.max(0.0001, cac)" },
    op: "sonuc", ou: "ratio", ok: ["sonuc"], ol: { sonuc: "CLV/CAC Oranı" } },
  // 100. Pazarlama ROI
  { slug: "marketing-roi-calculator", dt: "Pazarlama harcamasının getirdiği net kâr oranını hesaplar.", de: "Calculate marketing ROI from campaign revenue and cost.", cat: c, st: s, ld, sa,
    inputs: [{ id: "kampanyaGeliri", lt: "Kampanya Geliri (TL)", le: "Campaign Revenue (USD)", u: "USD", d: 200000, ct: "Kampanyadan elde edilen gelir.", ce: "Revenue generated." },{ id: "kampanyaMaliyeti", lt: "Kampanya Maliyeti (TL)", le: "Campaign Cost (USD)", u: "USD", d: 50000, ct: "Toplam kampanya harcaması.", ce: "Total campaign spend." }],
    f: { sonuc: "((kampanyaGeliri - kampanyaMaliyeti) / Math.max(0.0001, kampanyaMaliyeti)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"], ol: { sonuc: "Pazarlama ROI" } },
  // 101. CRO
  { slug: "conversion-rate-calculator", dt: "Siteye girenlerin hedeflenen eylemi gerçekleştirme yüzdesini hesaplar.", de: "Calculate conversion rate optimization (CRO) percentage.", cat: c, st: s, ld, sa,
    inputs: [{ id: "ziyaretci", lt: "Ziyaretçi (Adet)", le: "Visitors", u: "visitors", d: 10000, mn: 1, ct: "Toplam web sitesi ziyaretçisi.", ce: "Total website visitors." },{ id: "donusum", lt: "Dönüşüm (Adet)", le: "Conversions", u: "conversions", d: 500, ct: "Hedef eylemi gerçekleştiren sayısı.", ce: "Completed target actions." }],
    f: { sonuc: "(donusum / Math.max(1, ziyaretci)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"], ol: { sonuc: "Dönüşüm Oranı (CRO)" } },
  // 102. CTR
  { slug: "click-through-rate-calculator", dt: "Reklamın ne kadar ilgi çektiğini gösteren tıklama oranını hesaplar.", de: "Calculate click-through rate (CTR) for ads.", cat: c, st: s, ld, sa,
    inputs: [{ id: "tiklama", lt: "Tıklama (Adet)", le: "Clicks", u: "clicks", d: 500, ct: "Reklama yapılan tıklamalar.", ce: "Ad clicks." },{ id: "gosterim", lt: "Gösterim (Adet)", le: "Impressions", u: "impressions", d: 50000, mn: 1, ct: "Reklamın görüntülenme sayısı.", ce: "Ad display count." }],
    f: { sonuc: "(tiklama / Math.max(1, gosterim)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"], ol: { sonuc: "Tıklama Oranı (CTR)" } },
  // 103. CPC
  { slug: "cost-per-click-calculator", dt: "Her bir reklam tıklaması için ödenen ortalama bedeli (CPC) hesaplar.", de: "Calculate cost per click (CPC) for advertising.", cat: c, st: s, ld, sa,
    inputs: [{ id: "toplamHarcama", lt: "Toplam Harcama (TL)", le: "Total Spend (USD)", u: "USD", d: 10000, ct: "Reklam bütçesi.", ce: "Ad budget spent." },{ id: "tiklama", lt: "Tıklama (Adet)", le: "Clicks", u: "clicks", d: 500, mn: 1, ct: "Toplam tıklama.", ce: "Total clicks." }],
    f: { sonuc: "toplamHarcama / Math.max(1, tiklama)" },
    op: "sonuc", ou: "USD", ok: ["sonuc"], ol: { sonuc: "Tıklama Başı Maliyet (CPC)" } },
  // 104. CPM
  { slug: "cost-per-mille-calculator", dt: "Reklamın 1000 kişiye ulaşmasının maliyetini (CPM) hesaplar.", de: "Calculate cost per mille (CPM) for advertising.", cat: c, st: s, ld, sa,
    inputs: [{ id: "reklamMaliyeti", lt: "Reklam Maliyeti (TL)", le: "Ad Cost (USD)", u: "USD", d: 10000, ct: "Toplam reklam harcaması.", ce: "Total ad spend." },{ id: "gosterim", lt: "Gösterim (Adet)", le: "Impressions", u: "impressions", d: 500000, mn: 1, ct: "Toplam gösterim.", ce: "Total impressions." }],
    f: { sonuc: "(reklamMaliyeti / Math.max(1, gosterim)) * 1000" },
    op: "sonuc", ou: "USD", ok: ["sonuc"], ol: { sonuc: "Bin Gösterim Maliyeti (CPM)" } },
  // 105. Churn
  { slug: "customer-churn-rate-calculator", dt: "Aboneliğini iptal eden müşteri oranını (churn) hesaplar.", de: "Calculate customer churn rate.", cat: c, st: s, ld, sa,
    inputs: [{ id: "donemBasi", lt: "Dönem Başı Müşteri", le: "Start Customers", u: "customers", d: 1000, mn: 1, ct: "Dönem başı aktif müşteri.", ce: "Active customers at start." },{ id: "kaybedilen", lt: "Kaybedilen Müşteri", le: "Lost Customers", u: "customers", d: 50, ct: "Dönemde kaybedilen müşteri.", ce: "Customers lost during period." }],
    f: { sonuc: "(kaybedilen / Math.max(1, donemBasi)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"], ol: { sonuc: "Müşteri Kaybı (Churn)" } },
  // 106. Burn Rate
  { slug: "burn-rate-calculator", dt: "Şirketin iflas etmeden önce yaşayabileceği tahmini süreyi hesaplar.", de: "Calculate runway (months until cash runs out) from burn rate.", cat: c, st: s, ld, sa,
    inputs: [{ id: "baslangicNakit", lt: "Dönem Başı Nakit (TL)", le: "Start Cash (USD)", u: "USD", d: 500000, ct: "Dönem başı nakit bakiyesi.", ce: "Cash at period start." },{ id: "bitisNakit", lt: "Dönem Sonu Nakit (TL)", le: "End Cash (USD)", u: "USD", d: 200000, ct: "Dönem sonu nakit bakiyesi.", ce: "Cash at period end." },{ id: "ay", lt: "Dönem (Ay)", le: "Period (Months)", u: "months", d: 3, mn: 1, ct: "Hesaplama dönemi.", ce: "Calculation period." }],
    f: { burnRate: "(baslangicNakit - bitisNakit) / Math.max(1, ay)", sonuc: "bitisNakit / Math.max(0.0001, ((baslangicNakit - bitisNakit) / Math.max(1, ay)))" },
    op: "sonuc", ou: "months", ok: ["sonuc"], ol: { sonuc: "Kalan Süre (Runway)" } },
  // 107. Çalışma Sermayesi
  { slug: "working-capital-calculator", dt: "Şirketin kısa vadeli likidite gücünü (çalışma sermayesi) hesaplar.", de: "Calculate working capital (current assets - current liabilities).", cat: c, st: s, ld, sa,
    inputs: [{ id: "donenVarliklar", lt: "Dönen Varlıklar (TL)", le: "Current Assets (USD)", u: "USD", d: 500000, ct: "Kısa vadeli varlıklar.", ce: "Short-term assets." },{ id: "kisaVadeliBorc", lt: "Kısa Vadeli Borç (TL)", le: "Current Liabilities (USD)", u: "USD", d: 300000, ct: "Kısa vadeli yükümlülükler.", ce: "Short-term obligations." }],
    f: { sonuc: "donenVarliklar - kisaVadeliBorc" },
    op: "sonuc", ou: "USD", ok: ["sonuc"], ol: { sonuc: "Net Çalışma Sermayesi" } },
  // 108. Alacak Devir Hızı
  { slug: "accounts-receivable-turnover-calculator", dt: "Alacakların nakde dönüşme ortalama süresini (gün) hesaplar.", de: "Calculate accounts receivable turnover in days.", cat: c, st: s, ld, sa,
    inputs: [{ id: "yillikSatis", lt: "Yıllık Satış (TL)", le: "Annual Sales (USD)", u: "USD", d: 2000000, ct: "Toplam yıllık satış.", ce: "Total annual revenue." },{ id: "ortAlacak", lt: "Ortalama Alacak (TL)", le: "Avg Receivables (USD)", u: "USD", d: 200000, ct: "Dönem ortalama ticari alacak.", ce: "Average accounts receivable." }],
    f: { devirHizi: "yillikSatis / Math.max(0.0001, ortAlacak)", sonuc: "365 / Math.max(0.0001, yillikSatis / Math.max(0.0001, ortAlacak))" },
    op: "sonuc", ou: "days", ok: ["sonuc"], ol: { sonuc: "Ortalama Tahsilat Süresi" } },
  // 109. Borç Devir Hızı
  { slug: "accounts-payable-turnover-calculator", dt: "Tedarikçilere borçların ödenme ortalama süresini hesaplar.", de: "Calculate accounts payable turnover in days.", cat: c, st: s, ld, sa,
    inputs: [{ id: "yillikCOGS", lt: "Yıllık SMM (TL)", le: "Annual COGS (USD)", u: "USD", d: 1200000, ct: "Yıllık satılan mal maliyeti.", ce: "Annual cost of goods sold." },{ id: "ortBorc", lt: "Ortalama Borç (TL)", le: "Avg Payables (USD)", u: "USD", d: 150000, ct: "Ortalama ticari borç.", ce: "Average accounts payable." }],
    f: { sonuc: "365 / Math.max(0.0001, yillikCOGS / Math.max(0.0001, ortBorc))" },
    op: "sonuc", ou: "days", ok: ["sonuc"], ol: { sonuc: "Ortalama Ödeme Süresi" } },
  // 110. Stok Devir Hızı
  { slug: "inventory-turnover-calculator", dt: "Stokların satılıp yenilenme ortalama süresini (gün) hesaplar.", de: "Calculate inventory turnover in days.", cat: c, st: s, ld, sa,
    inputs: [{ id: "yillikCOGS", lt: "Yıllık SMM (TL)", le: "Annual COGS (USD)", u: "USD", d: 1200000, ct: "Yıllık satılan mal maliyeti.", ce: "Annual COGS." },{ id: "ortStok", lt: "Ortalama Stok (TL)", le: "Avg Inventory (USD)", u: "USD", d: 200000, ct: "Dönem ortalama stok seviyesi.", ce: "Average inventory level." }],
    f: { sonuc: "365 / Math.max(0.0001, yillikCOGS / Math.max(0.0001, ortStok))" },
    op: "sonuc", ou: "days", ok: ["sonuc"], ol: { sonuc: "Stokta Kalma Süresi" } },
  // 111. CCC
  { slug: "cash-conversion-cycle-calculator", dt: "Nakit çıkışı ile tahsilat arasındaki geçen süreyi (CCC) hesaplar.", de: "Calculate cash conversion cycle (CCC).", cat: c, st: s, ld, sa,
    inputs: [{ id: "stokGun", lt: "Stok Gün", le: "DIO (Days)", u: "days", d: 60, ct: "Stokta kalma süresi.", ce: "Days inventory outstanding." },{ id: "alacakGun", lt: "Alacak Gün", le: "DSO (Days)", u: "days", d: 45, ct: "Tahsilat süresi.", ce: "Days sales outstanding." },{ id: "borcGun", lt: "Borç Gün", le: "DPO (Days)", u: "days", d: 30, ct: "Ödeme süresi.", ce: "Days payable outstanding." }],
    f: { sonuc: "stokGun + alacakGun - borcGun" },
    op: "sonuc", ou: "days", ok: ["sonuc"], ol: { sonuc: "Nakit Dönüşüm Döngüsü (CCC)" } },
  // 112. Katkı Marjı
  { slug: "contribution-margin-calculator", dt: "Sabit giderleri karşılayan birim başına katkı payını hesaplar.", de: "Calculate contribution margin per unit and ratio.", cat: c, st: s, ld, sa,
    inputs: [{ id: "satisFiyati", lt: "Satış Fiyatı (TL)", le: "Selling Price (USD)", u: "USD", d: 100, ct: "Ürünün birim satış fiyatı.", ce: "Unit selling price." },{ id: "degiskenMaliyet", lt: "Değişken Maliyet (TL)", le: "Variable Cost (USD)", u: "USD", d: 60, ct: "Birim başı değişken maliyet.", ce: "Unit variable cost." }],
    f: { katki: "satisFiyati - degiskenMaliyet", sonuc: "((satisFiyati - degiskenMaliyet) / Math.max(0.0001, satisFiyati)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"], ol: { sonuc: "Katkı Marjı Oranı" } },
  // 113. Brüt ve Net Kâr
  { slug: "gross-net-profit-calculator", dt: "Üretim ve tüm giderler sonrası brüt ve net kârı hesaplar.", de: "Calculate gross profit and net profit after all expenses.", cat: c, st: s, ld, sa,
    inputs: [{ id: "ciro", lt: "Ciro (TL)", le: "Revenue (USD)", u: "USD", d: 1000000, ct: "Toplam satış geliri.", ce: "Total revenue." },{ id: "cogs", lt: "SMM (TL)", le: "COGS (USD)", u: "USD", d: 600000, ct: "Satılan mal maliyeti.", ce: "Cost of goods sold." },{ id: "isletmeGideri", lt: "İşletme Gideri (TL)", le: "Operating Expense (USD)", u: "USD", d: 200000, ct: "Faaliyet giderleri.", ce: "Operating expenses." },{ id: "vergi", lt: "Vergi (TL)", le: "Tax (USD)", u: "USD", d: 50000, ct: "Vergi gideri.", ce: "Tax expense." }],
    f: { brut: "ciro - cogs", sonuc: "(ciro - cogs) - isletmeGideri - vergi" },
    op: "sonuc", ou: "USD", ok: ["brut", "sonuc"], ol: { brut: "Brüt Kâr", sonuc: "Net Kâr" } },
  // 114. İşletme Marjı
  { slug: "operating-margin-calculator", dt: "Ana faaliyetlerden elde edilen kârlılık oranını (FAVÖK marjı) hesaplar.", de: "Calculate operating margin (EBITDA / Revenue).", cat: c, st: s, ld, sa,
    inputs: [{ id: "favok", lt: "FAVÖK (TL)", le: "EBITDA (USD)", u: "USD", d: 300000, ct: "Vergi ve faiz öncesi kâr.", ce: "EBITDA." },{ id: "ciro", lt: "Ciro (TL)", le: "Revenue (USD)", u: "USD", d: 1000000, ct: "Toplam satış geliri.", ce: "Total revenue." }],
    f: { sonuc: "(favok / Math.max(0.0001, ciro)) * 100" },
    op: "sonuc", ou: "%", ok: ["sonuc"], ol: { sonuc: "İşletme Marjı" } },
  // 115. Danışmanlık Saat Ücreti
  { slug: "consulting-hourly-rate-calculator", dt: "Giderleri ve kârı karşılayan minimum saatlik danışmanlık bedelini hesaplar.", de: "Calculate minimum hourly consulting rate covering costs and profit.", cat: c, st: s, ld, sa,
    inputs: [{ id: "hedefGelir", lt: "Hedef Yıllık Gelir (TL)", le: "Target Annual Income (USD)", u: "USD", d: 500000, ct: "Danışmanın hedef geliri.", ce: "Consultant's target income." },{ id: "yillikGider", lt: "Yıllık İşletme Gideri (TL)", le: "Annual Overhead (USD)", u: "USD", d: 100000, ct: "Ofis, sigorta, seyahat giderleri.", ce: "Office, insurance, travel costs." },{ id: "faturaliSaat", lt: "Faturalanabilir Saat", le: "Billable Hours/Year", u: "hours", d: 1500, mn: 1, ct: "Yıllık faturalanabilir saat.", ce: "Annual billable hours." }],
    f: { sonuc: "(hedefGelir + yillikGider) / Math.max(1, faturaliSaat)" },
    op: "sonuc", ou: "TRY/hour", ok: ["sonuc"], ol: { sonuc: "Saatlik Danışmanlık Ücreti" } },
  // 116. Serbest Çalışan Saat Ücreti
  { slug: "freelancer-hourly-rate-calculator", dt: "Vergi ve giderler dahil edilmesi gereken saatlik serbest çalışan ücretini hesaplar.", de: "Calculate freelancer hourly rate including tax and overhead.", cat: c, st: s, ld, sa,
    inputs: [{ id: "hedefNet", lt: "Hedef Net Gelir (TL)", le: "Target Net Income (USD)", u: "USD", d: 300000, ct: "Vergi sonrası hedef gelir.", ce: "After-tax target income." },{ id: "vergi", lt: "Vergi Oranı (%)", le: "Tax Rate (%)", u: "%", d: 25, mn: 0, mx: 100, ct: "Ortalama vergi yükü.", ce: "Average tax burden." },{ id: "gider", lt: "Yıllık Gider (TL)", le: "Annual Expense (USD)", u: "USD", d: 50000, ct: "İşletme giderleri.", ce: "Business expenses." },{ id: "calismaSaati", lt: "Yıllık Çalışma Saati", le: "Annual Work Hours", u: "hours", d: 1800, mn: 1, ct: "Toplam çalışma saati.", ce: "Total work hours." }],
    f: { brutHedef: "(hedefNet + gider) / Math.max(0.0001, (1 - vergi / 100))", sonuc: "((hedefNet + gider) / Math.max(0.0001, (1 - vergi / 100))) / Math.max(1, calismaSaati)" },
    op: "sonuc", ou: "TRY/hour", ok: ["sonuc"], ol: { sonuc: "Saatlik Serbest Çalışan Ücreti" } },
];
