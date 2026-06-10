# SectorCalc Manifesto v2.0

> **Document type:** Product vision and positioning — not a live production status report.  
> For deploy baseline and smoke gates, see [production-reality.md](./production-reality.md) and [roadmap.md](./roadmap.md).

---

## 1. Biz Kimiz?

SectorCalc, pahalı ERP/SAP/Siemens/Oracle sistemlerine erişemeyen işletmelerin, ustaların, teknisyenlerin, KOBİ yöneticilerinin, danışmanların ve bireylerin ölçme, hesaplama, kayıp tespiti ve optimizasyon ihtiyaçlarını **“20 yıllık sektör uzmanı” mantığıyla** çözen global endüstriyel hesaplama ve karar platformudur.

### Kesin konumlandırma

- SectorCalc **bir hesap makinesi sitesi değildir.**
- SectorCalc **sadece teklif yazılımı değildir.**
- SectorCalc **klasik ERP alternatifi değildir.**
- SectorCalc, **Industrial Micro-SaaS App Store**’dur.
- Rakipleri yalnızca SAP/Siemens/aPriori değildir; asıl rakip **Excel**, ustanın defteri, WhatsApp’ta kaybolan teklifler, pahalı danışmanlık ve rastgele Google calculator siteleridir.

### Slogan

**Her sektör için ölç. Görünmeyen kaybı bul. Doğrulanmış veriyle karar ver.**

---

## 2. Vizyon

Fortune 500 şirketlerin pahalı sistemlerle eriştiği **OEE, teklif, fire, karbon, rota, bakım, stok, işçilik, tolerans ve maliyet zekâsını** KOBİ’lere, ustalara, teknisyenlere ve bireylere **erişilebilir fiyatla** sunmak.

---

## 3. Çözdüğümüz Ana Problem

Sahadaki sorun genelde hesap yapamamak değil, **görünmeyen kaybı görememektir.**

Özet acı kategorileri:

| Kategori | Örnek |
|----------|--------|
| Teklif / marj | Fire oranının teklife eklenmemesi; setup süresinin maliyete yansıtılmaması |
| Finans / nakit | Vade farkının fiyata dahil edilmemesi; başabaş noktasının bilinmemesi |
| Operasyon | Makine saatlik maliyetinin bilinmemesi; OEE kayıplarının ölçülmemesi |
| Enerji / karbon | Kompresör/enerji kaçaklarının parasal karşılığının bilinmemesi; CBAM riskinin bilinmemesi |
| İnsan / stok | İşçilik gerçek maliyetinin net maaş sanılması; stok maliyetinin sadece depo kirası sanılması |
| Teknik risk | Tolerans, kaynak, bağlantı ve teknik risklerin hissiyatla yönetilmesi |
| Müşteri / ürün | Müşteri ve ürün kârlılığının yanlış okunması |

Detaylı liste için bkz. **Appendix A — Operational Pain Map**.

---

## 4. Hizmet Edilen 5 Persona

### Persona 1 — Saha Operatörü / Usta / Teknisyen

- **Bağlam:** CNC, kaynak, bakım, lojistik, şantiye, restoran, atölye  
- **İhtiyaç:** hızlı sonuç, büyük okunabilir rakam, mobil kullanım, basit form

### Persona 2 — KOBİ Sahibi / Yönetici

- **Bağlam:** ERP alamayan ama zarar sebebini görmek isteyen işletme  
- **İhtiyaç:** kayıp tespiti, fiyatlama, başabaş, benchmark, rapor

### Persona 3 — Serbest Meslek / Mali Müşavir / Danışman

- **Bağlam:** Müvekkiline operasyonel ve finansal karar desteği vermek isteyen profesyonel  
- **İhtiyaç:** rapor, metodoloji, beyaz etiket, güvenilir hesaplama

### Persona 4 — Bireysel Kullanıcı

- **Bağlam:** Tadilat, rota, yakıt, yemek, bütçe, basit hesaplama  
- **İhtiyaç:** ücretsiz, hızlı, sade, reklamsız hesaplama

### Persona 5 — Öğrenci / Akademisyen

- **Bağlam:** Formül, benchmark, metodoloji ve kaynak arayan kullanıcı  
- **İhtiyaç:** açıklanabilir hesaplama, kaynakça, örnek vaka

---

## 5. İkame Ettiğimiz Çözümler

| Mevcut çözüm | SectorCalc farkı |
|--------------|------------------|
| **Excel** | Hata payı yüksek, standardizasyon yok |
| **Ustanın defteri** | Kaybolur, ölçeklenmez |
| **WhatsApp teklifleri** | Arşivlenmez, inkar edilebilir |
| **Pahalı danışmanlık** | KOBİ bütçesini aşar |
| **SAP / Siemens / Oracle** | Pahalı ve uzun kurulumlu |
| **Google calculator siteleri** | Amatör, reklama boğulmuş, doğrulama yok |

---

## 6. Dört Boyutlu Kayıp Haritası

Her premium analyzer en az bir boyutta **görünmeyen kaybı** yüzeye çıkarır:

1. **Parasal kayıp** — marj sızıntısı, yanlış fiyat, gizli maliyet  
2. **Malzeme kaybı** — fire, hurda, iade, israf  
3. **Zaman kaybı** — setup, bekleme, rework, rota kaybı  
4. **Enerji / karbon kaybı** — verimsiz ekipman, CBAM, utility leak  

---

## 7. Dual-Intelligence / Full-Loop Mimari

SectorCalc hesaplamayı sadece formül çalıştırmak olarak görmez.

```
Kullanıcı (Smart Form)
    → Akıl 2 / Requirement Engine (hangi input gerekli?)
    → Deterministic Calculation Engine
    → Akıl 1 / Validation Engine (oracle, property, scenario, boundary)
    → Feedback loop (eksik/geçersiz input → yönlendirme)
```

**Implementation path:** `src/lib/formula-governance/` (Mind 1 + Mind 2).  
**Not:** `src/lib/calculation-intelligence/` kullanılmaz — bu path repoda yoktur.

### Kurallar

- AI **formül uydurmaz.**
- AI **katsayı uydurmaz.**
- Hesaplama **deterministic engine** ile yapılır.
- Kullanıcı yalnızca **doğrulanmış canonical input seti** ile hesaplama yapar.
- LLM yalnızca arayüz katmanında: input çıkarma, birim normalizasyonu, eksik alan sorusu — **asla** oracle veya formül otoritesi değildir.

---

## 8. Smart Form Standardı

SectorCalc form yapısı Tekla Tedds, Simcenter, CATIA, Ansys optiSLang, CalcTree ve Maple Flow kalitesinde **sade ama profesyonel** olacaktır.

### Zorunlular

- Senaryoya göre alan değişimi  
- Simple / Advanced mod  
- Zorunlu input blokajı (eksik alan → hesaplama kapalı)  
- Help text ve validation mesajları  
- Mobile-first saha deneyimi (44px touch, tek kolon, taşma yok)  
- Runtime compatibility (contract key ↔ form key birebir)  
- Locale-aware label / error / help (EN root, `/tr`, `/ar`, `/de`, `/fr`, `/es`)

---

## 9. Trust Trace / Validation Stamp

SectorCalc sonucu sadece ekran çıktısı değildir. Her premium rapor **doğrulanabilir bir karar izidir.**

### Hedef yapı

| Bileşen | Açıklama |
|---------|----------|
| Unique report ID | Tekil rapor kimliği |
| Calculation hash | Input + formül versiyonu özeti |
| QR code | Mobil doğrulama |
| Formula version | Governance contract versiyonu |
| Input / result snapshot | Denetlenebilir anlık görüntü |
| Audit trail | Kim, ne zaman, hangi tool |
| Usage Agreement / Disclaimer | Hukuki çerçeve |
| Validation Stamp | Mind 1 geçti işareti |
| Public verify | `/verify` — üçüncü taraf doğrulama |

**Hedef:** Üçüncü taraf biri rapordaki QR veya ID ile `sectorcalc.com/verify` üzerinde raporun gerçekliğini doğrulayabilmeli.

---

## 10. Feedback / Formula Objection

Her tool sayfasında kullanıcı:

- öneri gönderebilmeli  
- hata bildirebilmeli  
- “bu formül benim sektörümde farklı” diyebilmeli (formula objection)  
- geliştirme isteği bırakabilmeli  

Bu talepler **admin queue**’ya düşmeli ve status takibi olmalıdır. (Roadmap: P3)

---

## 11. Regional Unit / Benchmark

Global kullanım için:

- Metric / Imperial seçimi  
- Locale’e göre default unit  
- Kullanıcı override  
- Canonical internal units  
- Regional benchmark (kaynaklı)  
- TSE / ISO / TÜİK / sektör odası / akademik kaynak mantığı  
- Kaynakça gösterimi  

**Kesin uyarı:** Gerçek kaynak olmadan **“sektör ortalaması”** iddiası yazılmayacak.

---

## 12. Case Study Proof Layer

“20 yıllık uzman zihniyeti” iddiası **vaka analizleriyle** kanıtlanmalıdır.

Her ana sektör için en az 1 vaka:

1. Problem  
2. Input seti  
3. Görünmeyen kayıp  
4. Hesaplama sonucu  
5. Aksiyon önerisi  
6. Metodoloji  
7. Trust Trace bağlantısı  

---

## 13. PWA / Saha Modu

Saha kullanıcısı için:

- PWA install  
- Offline shell  
- Temel hesaplamalar offline  
- Sync when online  
- Büyük butonlar, yüksek kontrast  
- **3 saniye okunabilir sonuç** hedefi  

---

## 14. Pricing / Packaging

| Paket | Kapsam |
|-------|--------|
| **Free** | Hızlı hesaplama, sınırlı kullanım, SEO discovery |
| **Pro** | Premium analyzer, onaylı PDF, Trust Trace |
| **Business** | White-label export, ekip kullanımı, kurumsal logo |
| **Enterprise** | API, custom benchmark, gelişmiş verification, enterprise audit trail |

---

## 15. AI Assistant

AI Assistant **en son fazdır** (P10).

| Tier | Rol |
|------|-----|
| **Free** | Tool yönlendirme, pazarlama, açıklama |
| **Paid** | Operasyonel destek, input hazırlama, rapor yorumlama |

**Kesin sınır:** AI hesap yapmaz, formül uydurmaz, deterministic engine yerine geçmez.

---

## Appendix A — Operational Pain Map

Düzenlenmiş saha acıları (örnek → premium tool bağlantısı roadmap ile genişletilir):

### Teklif ve marj

- Fire oranının teklife eklenmemesi  
- Setup süresinin maliyete yansıtılmaması  
- Makine saatlik maliyetinin bilinmemesi  
- Amortisman ve bakım payının hesaba katılmaması  
- Tolerans / kaynak / teknik risklerin hissiyatla yönetilmesi  

### Finans ve fiyatlama

- Vade farkının fiyata dahil edilmemesi  
- Sabit/değişken maliyet ayrımının yapılmaması  
- Başabaş noktasının bilinmemesi  
- Müşteri/ürün kârlılığının yanlış okunması  

### Operasyon ve zaman

- OEE kayıplarının ölçülmemesi  
- Rota / sevkiyat maliyetinin unutulması  
- Rework ve callback maliyetinin gizlenmesi  

### Enerji, malzeme, uyum

- Enerji ve sarf giderlerinin atlanması  
- Kompresör/enerji kaçaklarının parasal karşılığının bilinmemesi  
- Stok maliyetinin sadece depo kirası sanılması  
- CBAM ve karbon raporlama riskinin bilinmemesi  

### İnsan kaynağı

- İşçilik gerçek maliyetinin net maaş sanılması  
- Peak-shift ve verimlilik farkının fiyata yansımaması  

---

*Last updated: 2026-06-10 — Manifesto v2.0*
