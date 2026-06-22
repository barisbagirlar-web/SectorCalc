# durust

---
description: SectorCalc tool ve i18n denetim protokolü. 5 adımda input, formül, UI, çeviri kontrolü.
---

# SECTORCALC TOOL AUDIT PROTOCOL

## KURAL — KESİN
- Yalnızca verilen talimatı uygula. Kod icat etme. İnisiyatif alma.
- "Yaptım" deme — kanıtla. Belirsizse: "BİLİNMİYOR: [neden]" yaz.
- PASS ancak her madde dosyada satır referansıyla kanıtlanmışsa yazılabilir.

## KAPSAM
- Tool dosyaları: /src/tools/generated/*.jsx | /src/tools/premium-schema/*.jsx
- i18n dosyaları: /src/i18n/en.json | tr.json | de.json | fr.json | es.json | ar.json
- Her tool = tek dosya = tek denetim birimi.

## 5 ADIM (sırayla — önceki PASS olmadan ilerleme)
... (SECTORCALC TOOL AUDIT PROTOCOL

## KURAL — KESİN
- Yalnızca verilen talimatı uygula. Kod icat etme. İnisiyatif alma.
- "Yaptım" deme — kanıtla. Belirsizse: "BİLİNMİYOR: [neden]" yaz.
- PASS ancak her madde dosyada satır referansıyla kanıtlanmışsa yazılabilir.

## KAPSAM
- Tool dosyaları: /src/tools/generated/*.jsx | /src/tools/premium-schema/*.jsx
- i18n dosyaları: /src/i18n/en.json | tr.json | de.json | fr.json | es.json | ar.json
- Her tool = tek dosya = tek denetim birimi.

## 5 ADIM (sırayla — önceki PASS olmadan ilerleme)

ADIM 1 — INPUT VARLIĞI
Her beklenen input alanının kodda tanımlı olduğunu doğrula.
Rapor: öğe adı → ✓ MEVCUT / ✗ EKSİK + satır no
Eksik varsa dur. Sonraki adıma geçme.

ADIM 2 — FORMÜL DOĞRULUĞU
Her formülün matematiksel olarak doğru ve değişkenlerin
tanımlı input'larla eşleştiğini doğrula.
Rapor: FORMÜL / DEĞİŞKEN EŞLEŞMESİ / SONUÇ
Hatayı sessizce düzeltme — listele, onay iste.

ADIM 3 — HESAPLAMA İZLEME (statik analiz)
NOT: Cursor kodu çalıştıramaz. Statik iz yürüt:
input değişkeni → formülde kullanım → output değişkeni → render
Sıfır / negatif / boş değer durumlarını koda bakarak değerlendir.
Her tool için 1 örnek girdi ve beklenen çıktıyı yorum satırı olarak ekle.
Rapor: PASS veya FAIL + iz adımları + satır referansları

ADIM 4 — UI BÜTÜNLÜĞÜ
Kontrol: metin taşması / satır kırılması / alan adı kesintisi /
mobil görünürlük sorunu (min-width: 320px baz al)
Rapor: SORUN / KONUM / UYGULANAN DÜZELTİ

ADIM 5 — ÇEVİRİ EKSİKSİZLİĞİ
TR/DE/FR/ES/AR dosyalarında İngilizce kalıntı = sıfır.
Kontrol: label, placeholder, hata mesajı, tooltip, birim, açıklama metni.
Rapor: DİL / BULUNAN İNGİLİZCE METİN / DOSYA:SATIR / DÜZELTİ

## TUR TANIMI
Tur 1: İlk tarama — tüm bulguları listele.
Tur 2: Tur 1 düzeltmelerini doğrula + yeni tarama yap.
Tur 3: Son durum — her adım için nihai PASS/FAIL listesi.
Her tur ayrı başlık altında raporlanacak. Özetleme yapma.

## ÇIKTI FORMATI (her bulgu için zorunlu)
TUR [N] — ADIM [X]: [PASS/FAIL]
BULGU: [tam açıklama]
DOSYA/SATIR: [referans]
İŞLEM: [yapılan] VEYA "YOK — onay bekleniyor"
Tek yapılması gereken: /src/tools/generated/ ve /src/i18n/yöntemleri kendi projenize göre kontrol edin

