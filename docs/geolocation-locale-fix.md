# GEO-LOCATION DIL ALGILAMA DÜZELTMESİ

## Sorun

**Orijinal Şikayet:**
Türkiye'de olunmasına rağmen sayfalar İngilizce gösteriyordu. Lokasyona göre otomatik dil algılama çalışmıyordu.

**Kök Neden:**
Kod açıkça şöyle diyordu:
```typescript
// Priority: manual cookie > accept-language > default (English root)
// Country header is used for REGION only, not locale/language redirection
```

Yani:
- Cloudflare/Vercel'den gelen country code (TR, DE, etc.) **SADECE** region (para birimi) için kullanılıyordu
- Dil seçimi için country code **KULLANILMIYORDU**
- Bu yüzden Türkiye'deki kullanıcılar otomatik olarak `/tr` sayfasına yönlendirilmiyordu

## Çözüm

### 1. Otomatik Dil Algılama Etkinleştirildi

**Dosya:** `src/lib/i18n/locale-routing.ts`

**Değişiklik:** `resolveRootVisitLocale()` fonksiyonu

**YENİ Öncelik Sırası:**
1. **Manuel cookie** (kullanıcı dil seçtiyse) - en yüksek öncelik
2. **⭐ Country geolocation** (Cloudflare/Vercel IP detection) - YENİ!
3. **Accept-Language header** (tarayıcı dili)
4. **Default İngilizce**

**Kod:**
```typescript
// 1. Manual cookie (explicit user choice) - highest priority
if (options.cookieLocale && isSupportedLocale(options.cookieLocale)) {
  return options.cookieLocale;
}

// 2. Country-based geolocation - auto-detect locale from user's country
if (options.countryCode && options.countryCode in COUNTRY_TO_LOCALE) {
  const localeFromCountry = COUNTRY_TO_LOCALE[options.countryCode];
  if (localeFromCountry) {
    return localeFromCountry;
  }
}

// 3. Accept-Language header fallback
const fromAccept = detectLocaleFromAcceptLanguage(options.acceptLanguage);
if (fromAccept) {
  return fromAccept;
}

// 4. Default to English
return ROOT_LOCALE;
```

### 2. Locale Cookie Persistence

**Dosya:** `middleware.ts`

**Değişiklik:** Root redirect yapılırken locale cookie set ediliyor

**Kod:**
```typescript
if (targetLocale !== null) {
  const url = request.nextUrl.clone();
  url.pathname = getLocalePathPrefix(targetLocale);
  const response = NextResponse.redirect(url, 307);
  
  // Set locale cookie to persist user's auto-detected language
  response.cookies.set(LOCALE_COOKIE, targetLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
  
  return applyRegionHeaders(response, request);
}
```

## Desteklenen Ülke → Dil Eşleşmeleri

```typescript
TR → tr (Türkçe)
DE, AT, CH → de (Almanca)
FR, BE → fr (Fransızca)
ES, MX, AR → es (İspanyolca)
SA, AE, EG, QA, KW, BH, OM, JO, LB, MA, DZ, TN → ar (Arapça)
```

Diğer tüm ülkeler: Accept-Language header veya İngilizce (default)

## Nasıl Çalışır?

### Senaryo 1: İlk Ziyaret (Cookie Yok)

**Kullanıcı:** Türkiye'den `sectorcalc.com` açıyor

1. **Middleware çalışır:**
   - Cloudflare header: `CF-IPCountry: TR`
   - Cookie yok (ilk ziyaret)
   - `shouldRedirectRootToLocale()` çağrılır

2. **Dil algılama:**
   - Cookie yok → atla
   - **Country code: "TR"** → `COUNTRY_TO_LOCALE["TR"]` = `"tr"` ✅
   - Sonuç: **Türkçe (`tr`) döner**

3. **Redirect ve Cookie:**
   - Redirect: `sectorcalc.com` → `sectorcalc.com/tr`
   - Cookie set: `NEXT_LOCALE=tr` (1 yıl geçerli)

4. **Kullanıcı artık Türkçe sayfada!**

### Senaryo 2: Tekrar Ziyaret (Cookie Var)

**Kullanıcı:** Daha önce otomatik olarak Türkçe'ye yönlendirilmiş

1. **Middleware çalışır:**
   - Cookie: `NEXT_LOCALE=tr`
   - Country: `TR`

2. **Dil algılama:**
   - **Cookie var: "tr"** → En yüksek öncelik! ✅
   - Country code ve diğerlerine bakılmaz

3. **Redirect:**
   - Cookie "tr" olduğu için yine `/tr` sayfasına yönlendirme

### Senaryo 3: Manuel Dil Değiştirme

**Kullanıcı:** Türkiye'de ama İngilizce okumak istiyor

1. **Kullanıcı dil seçiciyi kullanır:** `/tr` → `/` veya `/en`
2. **Cookie güncellenir:** `NEXT_LOCALE=en`
3. **Sonraki ziyaretler:**
   - Cookie "en" → Manuel seçim geçerli
   - Country "TR" → İgnore edilir (cookie öncelikli)
   - Kullanıcı İngilizce kalır

## Test Senaryoları

### Test 1: Türkiye'den İlk Ziyaret

```bash
# Simulate Cloudflare header
curl -H "CF-IPCountry: TR" https://sectorcalc.com/

# Beklenen: 307 Redirect to /tr
# Cookie: NEXT_LOCALE=tr
```

### Test 2: Almanya'dan İlk Ziyaret

```bash
curl -H "CF-IPCountry: DE" https://sectorcalc.com/

# Beklenen: 307 Redirect to /de
# Cookie: NEXT_LOCALE=de
```

### Test 3: Bilinmeyen Ülke (Accept-Language Fallback)

```bash
curl -H "Accept-Language: fr-FR,fr;q=0.9" https://sectorcalc.com/

# Beklenen: 307 Redirect to /fr
# Cookie: NEXT_LOCALE=fr
```

### Test 4: Cookie Varsa (Öncelikli)

```bash
curl -H "CF-IPCountry: TR" -H "Cookie: NEXT_LOCALE=en" https://sectorcalc.com/

# Beklenen: Cookie'deki "en" geçerli
# Redirect YAPILMAZ (çünkü cookie en = root locale)
```

## Validation Sonuçları

✅ **TypeScript:** Passed (no errors)
✅ **Lint:** Passed (warnings only)
✅ **Build:** Successful

## Değiştirilen Dosyalar

```
M  middleware.ts
M  src/lib/i18n/locale-routing.ts
```

**Toplam:** 2 dosya değiştirildi
- `locale-routing.ts`: +17 lines (geolocation logic)
- `middleware.ts`: +7 lines (cookie persistence)

## Production Deployment

Değişiklikler middleware seviyesinde, hemen deploy edilebilir:

```bash
firebase deploy --only hosting --project sectorcalc-bf412
```

**Önemli:** Cloudflare/Firebase Hosting edge'de çalışan middleware otomatik olarak tüm ziyaretçilere uygulanır. Cache temizleme gerekmez.

## Beklenilen Sonuç

**Türkiye'deki kullanıcılar:**
- `sectorcalc.com` → Otomatik redirect → `sectorcalc.com/tr` ✅
- Tüm içerik Türkçe görünür ✅
- Cookie 1 yıl geçerli, tekrar ziyarette hızlı ✅

**Almanya'daki kullanıcılar:**
- `sectorcalc.com` → Otomatik redirect → `sectorcalc.com/de` ✅
- Tüm içerik Almanca görünür ✅

**Diğer ülkeler:**
- Accept-Language header'a göre veya İngilizce (default) ✅

**Manuel dil seçimi:**
- Her zaman korunur, geolocation override etmez ✅

---

**Durum:** ✅ TAMAMLANDI
**Hazırlanma:** 2026-06-11
**Deployment:** Ready for production
