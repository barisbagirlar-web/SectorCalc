# SectorCalc SEO Karar Defteri

## 2026-08-09 — Security precheck

- Karar: SEO MASTER MANDATE V6 yürütmesi exposed Paddle server credentials provider seviyesinde rotate edilene kadar AIP-13 açısından BLOCK kabul edilir.
- Onaylayan: kullanıcı — “gerekenleri yap”.
- Gerekçe: görünür PR redaksiyonu credential revocation değildir.
- İcra: PR #257 açıklaması redakte edildi; issue #260 açıldı; repository secret guards ayrı security branch üzerinde sertleştirildi.
- Geri döndürülemez bölüm: provider credential revocation/rotation. GitHub connector Paddle/GCP mutation yetkisine sahip değildir.
