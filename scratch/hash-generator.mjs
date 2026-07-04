import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repoRoot = process.cwd();
const wordSet = new Set();

const unambiguousTurkishWords = [
  "muhendis", "muhendisi", "muhendislik", "danismani", "danışmanı", "uzmani", "uzmanı",
  "yapisal", "yapısal", "istatistikci", "marangoz", "degerleme", "değerleme",
  "yatirim", "yatırım", "maliyet", "maliyeti", "maliyetler", "maliyetleri",
  "sicaklik", "sıcaklık", "sıcaklığı", "sicakligi",
  "tasarim", "tasarım", "tasarımı", "tasarimi",
  "cevre", "çevre", "surdurulebilirlik", "sürdürülebilirlik", "sinyalizasyon",
  "gunes", "güneş", "ruzgar", "rüzgar", "rüzgarı", "ruzgari",
  "elektrikci", "elektrikçi", "tesisatci", "tesisatçı",
  "kaynakci", "tornaci", "tornacı", "frezeci", "tamirci",
  "insaat", "inşaat", "inşaatı", "insaati",
  "celik", "çelik", "tesfiye", "iscilik", "işçilik", "işçiliği", "isciligi",
  "veresiye", "agirlik", "ağırlık", "ağırlığı", "agirligi",
  "uzunluk", "uzunluğu", "uzunlugu",
  "genislik", "genişlik", "genişliği", "genisligi",
  "yukseklik", "yükseklik", "yüksekliği", "yuksekligi",
  "derinlik", "derinliği", "derinligi",
  "yaricap", "yarıçap", "yarıçapı", "yaricapi",
  "baslangic", "başlangıç", "başlangıcı", "baslangici",
  "katsayi", "katsayı", "katsayısı", "katsayisi",
  "kullanici", "kullanıcı", "kullanıcısı", "kullanicisi",
  "hesapla", "hesaplama", "hesaplaması", "hesaplamasi",
  "guncel", "güncel", "güncelleme", "guncelleme",
  "dikdortgen", "dikdörtgen", "dikdörtgenin",
  "ucgen", "üçgen", "üçgenin", "cokgen", "çokgen", "çokgenin",
  "doseme", "döşeme", "döşemesi", "dosemesi",
  "merdiven", "korkuluk", "kompresor", "kompresör", "diyafram", "debimetre", "pervane",
  "burkulma", "burkulması", "burkulmasi",
  "burulma", "burulması", "burulmasi",
  "bukulme", "bükülme", "bükülmesi", "bukulmesi",
  "sarfiyat", "sarfiyatı", "sarfiyati",
  "tedarikci", "tedarikçi", "tedarikçisi", "tedarikcisi",
  "uretici", "üretici", "üreticisi", "ureticisi",
  "titresim", "titreşim", "titreşimi", "titresimi",
  "giris", "giriş", "girişi", "girisi",
  "cikti", "çıktı", "çıktısı", "ciktisi",
  "olcum", "ölçüm", "ölçümü", "olcumu",
  "olcut", "ölçüt", "deger", "değer", "değeri", "degeri",
  "degerlendirme", "değerlendirme", "yonetim", "yönetim", "yönetimi", "yonetimi",
  "ilerleme", "suratme", "süratme", "helis", "camur", "çamur", "yogunluk", "yoğunluk", "yoğunluğu", "yogunlugu",
  "tahta", "eni", "bindirme", "emprenye", "donen", "dönen", "kisa", "kısa", "vadeli", "borc", "borç", "borcu",
  "faktoru", "faktörü", "cekme", "çekme", "mukavemet", "mukavemeti", "sekil", "şekil", "degistirme", "değiştirme",
  "kuruma", "suresi", "süresi", "kalinlik", "kalınlık", "kalınlığı", "kalinligi",
  "kredi", "kredisi", "kreditutari", "krediTutari", "paraBirimi", "para", "birimi",
  "oran", "orani", "oranı", "adet", "adedi", "birim", "birimi", "alan", "alani", "alanı",
  "hacim", "hacmi", "kesit", "kesiti", "hiz", "hız", "hızı", "hizi", "ivme", "ivmesi",
  "bitis", "bitiş", "bitişi", "bitisi", "sonuc", "sonuç", "sonucu", "sonucu",
  "standart", "standarti", "standartı", "sapma", "sapmasi", "sapması",
  "tutar", "tutari", "tutarı", "hisse", "hissesi", "tahvil", "tahvili",
  "odeme", "ödeme", "odemesi", "ödemesi", "miktar", "miktari", "miktarı",
  "toplam", "toplami", "toplamı", "fiyat", "fiyati", "fiyatı",
  "direnc", "direnç", "direnci", "gerilim", "gerilimi",
  "akim", "akım", "akımı", "akimi", "taksit", "taksiti",
  "faiz", "faizi", "kazanc", "kazancı", "kazanci",
  "zarar", "zarari", "zararı", "gelir", "geliri", "gider", "gideri",
  "donem", "dönem", "donemi", "dönemi", "kira", "kirası", "kirasi",
  "teslimat", "teslimatı", "teslimati", "kalite", "kalitesi",
  "musteri", "müşteri", "müşterisi", "musterisi",
  "calisan", "çalışan", "çalışanı", "calisani",
  "rulman", "rulmanı", "rulmani", "yatak", "yatağı", "yatagi",
  "kasnak", "kasnağı", "kasnagi", "kayis", "kayış", "kayışı", "kayisi",
  "zincir", "zinciri", "bant", "bandı", "bandi",
  "piston", "pistonu", "silindir", "silindiri",
  "valf", "valfi", "pompa", "pompası", "pompasi",
  "egim", "eğim", "eğimi", "egimi",
  "egme", "eğme", "eğilmesi", "egilmesi",
  "yillik", "yıllık", "aylik", "aylık", "haftalik", "haftalık",
  "rapor", "raporu", "kayit", "kayıt", "kaydı", "kaydi",
  "saniye", "katman", "katmanı", "katmani", "tabaka", "tabakası", "tabakasi",
  "levha", "levhası", "levhasi", "plaka", "plakası", "plakasi",
  "eksen", "ekseni", "dilim", "dilimi", "kose", "köşe", "köşesi", "kosesi",
  "kenar", "kenarı", "kenari",
  "kolon", "kolonu", "kiris", "kiriş", "kirişi", "kirisi",
  "temel", "temeli", "duvar", "duvarı", "duvari",
  "perde", "perdesi", "cati", "çatı", "çatısı", "catisi",
  "kubbe", "kubbesi", "kemer", "kemeri",
  "donati", "donatı", "donatısı", "donatisi",
  "beton", "betonu",
  "ahsap", "ahşap", "ahşabı", "ahsaabi",
  "kompozit", "kompoziti",
  "kuvvet", "kuvveti", "yuku", "yükü", "yuku",
  "surec", "süreç", "süreci", "sureci",
  "girdi", "girdisi", "dip", "dibi",
  "yeni", "eski", "mevcut", "mevcudu"
];

unambiguousTurkishWords.forEach((word) => {
  wordSet.add(word.toLowerCase().trim());
});

const hashes = [];
for (const word of wordSet) {
  if (!word) continue;
  const hash = crypto.createHash("sha256").update(word).digest("hex");
  hashes.push(hash);
}

hashes.sort();

const destDir = path.join(repoRoot, "data", "governance");
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.writeFileSync(
  path.join(destDir, "forbidden-token-hashes.json"),
  JSON.stringify(hashes, null, 2),
  "utf8"
);

console.log(`Generated ${hashes.length} forbidden token hashes in data/governance/forbidden-token-hashes.json`);
