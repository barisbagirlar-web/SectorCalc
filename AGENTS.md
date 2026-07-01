# SectorCalc — AGENTS.md

Proje genel çalışma disiplini. Ana kaynak: bu dosya + `.cursor/rules/**/RULE.md`.

`.cursorrules` kullanma. Eski Cursor sürümünde gerekirse yalnızca yedek; birincil kaynak burasıdır.

## DeepSeek Priority Lock

SectorCalc görevlerinde DeepSeek API aktif ve tam kapsamlı kullanılacaktır.

### Öncelik

1. Tüm tool'ları ayağa kaldırmak
2. P2.4 / ERT / Runtime Trust bulgularını toplu onarmak
3. Input schema, validation, FormulaContract, result renderer, i18n, unit canonical, guide policy sorunlarını hızlı şekilde patchlemek
4. PASS sayısını artırmak
5. FAIL / WARN / QUARANTINE sayısını düşürmek
6. P9/payment işlerini tool gövdesi güçlendikten sonra ele almak

### Yasak

- DeepSeek'i sadece pasif rapor motoru gibi kullanmak
- Gereksiz küçük teorik planlarla zaman kaybetmek
- "Önce bekleyelim" yaklaşımı
- Fake PASS
- WARN bypass
- Sahte Formula Gate
- Free tool payment açmak
- Secret frontend'e koymak
- Test edilmemiş patch commit etmek

### Varsayılan çalışma şekli

- DeepSeek destekli bulk audit
- DeepSeek destekli bulk repair
- Patch
- lint / tsc / build
- P2.4 audit
- Runtime Trust audit
- Revenue gate assert
- Commit

### P9/payment

Tool recovery tamamlanana kadar ikinci önceliktir.

### Çıktı formatı

```txt
SONUÇ
ANALİZ
UYARI
ADIMLAR
NİHAİ ÇIKTI
```

Komutlar, env, patch ve promptlar kopyalanabilir bloklar halinde verilecektir.

---

## 1. Temel sıra

Her görevde:

1. Talimatı kısa özetle.
2. Dokunulacak dosyaları belirt.
3. Riski belirt.
4. Küçük, güvenli patch uygula.
5. Değişiklik kanıtı ver.
6. Test / audit / grep çıktısı ver.
7. Eksik kalan varsa açıkça yaz.

## 2. Kanıt zorunluluğu

Aşağıdaki ifadeler **kanıt olmadan yasaktır**:

- “Yaptım”
- “Bitti”
- “Tamamlandı”
- “Sorun çözüldü”
- “Her şey çalışıyor”
- “Uygulandı”

Kabul edilen kanıtlar:

- `git status --short`
- `git diff --stat`
- değişen dosya listesi + ilgili satırlar
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- ilgili `npm run audit:...`
- `grep` / `curl` çıktısı

Kanıt yoksa:

```txt
KANIT YOK: Bu adımın tamamlandığını söyleyemem.
```

Kapsam uygulanmadıysa:

```txt
UYGULANMADI: <eksik madde>
```

“UYGULANMADI” veya “KANIT YOK” varken tamamlanmış sayma.

## 3. Dosya ve kapsam

Dosya yolu verilmemişse önce repo içinde ara:

```bash
grep -RIn "aranacak-ifade" src app lib public scripts
find . -maxdepth 4 -type f | sort
```

Bulunamazsa kullanıcıya sor; tahmin etme.

## 4. Korunan alanlar

Açık izin olmadan dokunma:

```txt
.env / *.secret
firebase / firestore rules
vercel / cloudflare deploy config
auth / payment / checkout
admin / private routes
152 premium seed içeriği
mevcut route slugları (rastgele rename yok)
data/pro-tools/ (Pro/Free araç veri dosyaları ve _merged.json asla silinmemeli/ezilmemeli)
```

Detay: `.cursor/rules/01-sectorcalc-safety/RULE.md`

## 5. Zorunlu test kapısı (kod değişikliği)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

İlgili audit varsa ayrıca:

```bash
npm run audit:...
```

Yalnızca markdown / kural dosyası değişikliğinde en dar test yeterli; yine de `git diff` zorunlu.

## 6. Public çıktı kontrolü

Public/web değişikliğinde:

```bash
grep -RIn "TODO\|FIXME\|geçici\|düzeltilecek\|href=\"#\"\|Planlandı\|Yayında\|Faz 1\|Faz 2\|Puan" src app public scripts
```

Public yüzeyde beklenmeyen eşleşme varsa iş bitmiş sayılmaz.

## 7. Git kanıtı (her teslim)

```bash
git status --short
git diff --stat
```

## 8. Rapor formatı

```txt
İşlem:
Anlama özeti:
Dokunulan dosyalar:
Yapılan değişiklikler:
Test komutları:
Test çıktısı:
Git diff özeti:
Kalan eksikler:
Durum: TAMAMLANDI / HATA / BEKLİYOR / UYGULANMADI
```

## 9. Tamamlanma şartları

- Talimat kapsamı uygulandı
- **Orijinal spesifikasyondaki tüm alanlar (top-level, input, validation, reference_code, metadata, error_propagation, fmea, audit_log dahil) uygulandı — hiçbir alan "sistem formatına uymuyor" gerekçesiyle atlanamaz**
- Değişen dosyalar raporlandı
- İlgili testler çalıştı (kod değişikliğinde lint/tsc/build)
- Fail eden test yok
- Public bad grep temiz (public değişiklik varsa)
- `git diff --stat` gösterildi
- Eksik açıkça yazıldı

## 10. Alt kural dosyaları

| Dosya | Konu |
|---|---|
| `.cursor/rules/00-proof-gate/RULE.md` | Kanıt üretme, test, grep |
| `.cursor/rules/01-sectorcalc-safety/RULE.md` | Korunan alanlar, audit zorunluluğu |
| `.cursor/rules/02-ui-quality/RULE.md` | UI kalite, responsive, görsel oran |
| `.cursor/rules/04-completeness-gate/RULE.md` | Spesifikasyon tamamlama zorunluluğu — verilen alanların %100 uygulanması |

## 11. SectorCalc kalite özeti

Endüstriyel hesaplama ve karar platformu algısı korunur:

- Gereksiz animasyon / anlamsız gradient / fazla badge yok
- Hardcoded secret ve frontend API key yok
- Kategorisiz veya sahte premium tool yok
- `href="#"` yok; mobil kırılma yok
- UI değişikliğinde desktop + mobile + console + network kontrolü

Detay: `.cursor/rules/02-ui-quality/RULE.md`

## 12. Claude Tasarımı (Claude Design)

"Claude Tasarım" veya "Claude Tasarımı" dendiğinde aşağıdaki spesifikasyonlar ve tasarım kuralları her zaman hatırlanacak ve uygulanacaktır:
- **Genel Yapı**: En son `main` branch'inde (commit `9fafb0918` ve sonrasındaki renk paleti güncellemeleriyle) geliştirilmiş olan, Barlow serif/sans başlık yazı tiplerini, JetBrains Mono font-mono'sunu ve terracotta/copper tonlarındaki aksan renklerini kullanan ferah, dengeli ve kurumsal arayüz şablonudur.
- **Dosya Konumları**:
  - Bileşen: `src/components/landing/LandingPageContent.tsx`
  - Stil: `src/styles/landing-page.css`
  - Sayfa: `src/app/[locale]/page.tsx`
- **Link Standartları**: Sitedeki linkler mutlaka gerçek ve ilgili aktif sayfaları (örneğin pro-tools yerine `/pricing`) temsil edecek şekilde doğru yönlendirilmelidir. Asla kırık veya geçici (`#`) link kullanılmamalıdır.
- **İyileştirmeler**: Tasarım yerleşimlerinde veya ikonlarda görsel uyumsuzluk ya da hata görüldüğünde, sistem kalitesini artırmak için inisiyatif alınarak hizalamalar ve görsel detaylar en premium standartlarda düzenlenmelidir.

## 13. DeepSeek API / Formül ve Input Yaratma Yetkisi İptali
Kullanıcı talimatı: "deep seek apiyi bu gıubı formul /ınput yaratma yetkısını ıptal edıyorum bunu kaydet..ve kıtlıtle"
DeepSeek Priority Lock (Madde 1) kuralı, **formül analizi, formül yaratma, input doğrulama ve txt dosyasından sisteme aktarma** işlemleri için GEÇERSİZDİR. Bu işlemlerde DeepSeek API KESİNLİKLE kullanılmayacak, doğrudan ana yapay zeka ajanının (benim) kodlama, okuma ve muhakeme yeteneği kullanılacaktır.

## 14. Deployment ve Hosting
Vercel ile ÇALIŞMIYORUZ. Sadece Firebase Host (Firebase Hosting / App Hosting) ile çalışıyoruz. Deployment süreçleri ve yapılandırmaları Vercel'e göre değil, Firebase'e göre hazırlanmalıdır.

## 15. Yeni Araç Ekleme ve Deployment Workflow (Commit-First)
Yeni bir araç eklendiğinde ya da sitemap güncellendiğinde sırasıyla şu adımlar izlenmelidir:
1. Önce tüm kod ve şema değişiklikleri `git commit` edilmelidir.
2. Ardından `npm run build` ve `deploy` adımları çalıştırılmalıdır (tercihen `DEPLOY_FORCE_REBUILD=1 node scripts/deploy-production.mjs` ile).
Gerekçe: Firebase frameworks Next.js entegrasyonu deploy esnasında repoyu HEAD durumuna temizleyen (git reset) bir süreç işletir. Commit edilmemiş şemalar date resolver (`tool-git-dates.json`) lookup'larında eşleşme bulamaz ve build fallback tarihine düşer. Bu sebeple workflow her zaman "Commit First, Build Second" şeklinde olmalıdır.


