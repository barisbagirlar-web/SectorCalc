# SEO V6 Security Precheck — SectorCalc

Date: 2026-08-09
Status: BLOCKED_PENDING_PROVIDER_ROTATION

## [Kesin] Bulgular

1. Geçmiş public PR açıklamasında production Paddle server API key ve webhook secret açık metin olarak bulunuyordu.
2. Görünür PR açıklaması redakte edildi; bu işlem credential'ı revoke etmez.
3. Eski repository guard, secret yakaladığında eşleşen satırı CI loguna yazabilecek `git grep -nE` kullanıyordu.
4. Eski webhook regex'i provider secret'larında görülebilen `+`, `/`, `=` karakterlerini kapsamayabiliyordu.

## Repository-side kalıcı çözüm

- Tracked-file guard yalnızca dosya adını raporlar; secret değerini yazmaz.
- Paddle API/webhook/legacy webhook ve public-text GitHub token kalıpları için ayrı scanner vardır.
- PR title/body ve commit message CI taramasına alınır.
- Negatif testler BLOCK davranışını ve secret değerinin stdout/stderr'a sızmadığını doğrular.

## Dış bağımlılık

Provider-level API key ve webhook secret rotation issue #260 ile izlenir. Bu GitHub bağlantısı Paddle/GCP Secret Manager üzerinde mutation yetkisine sahip değildir.

ROLLBACK: repository guard PR'ı git revert ile geri alınabilir. Provider credential rotation tamamlandığında eski exposed credential'a dönüş yasaktır.
