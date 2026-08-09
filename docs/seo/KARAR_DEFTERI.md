# SectorCalc SEO Karar Defteri

## 2026-08-09 — Security precheck

- Karar: SEO MASTER MANDATE V6 yürütmesi, exposed Paddle server credentials provider seviyesinde rotate edilene kadar security gate açısından BLOCK kabul edilir.
- Onaylayan: user instruction — “gerekenleri yap”.
- Gerekçe: AIP-13 secret-management kuralı; görünür PR redaksiyonu credential revocation değildir.
- İcra: PR #257 açıklaması redakte edildi; issue #260 açıldı; repository secret guards hardened in a separate security branch.
- Geri döndürülemez bölüm: provider credential revocation/rotation. Bu işlem bu GitHub connector tarafından yapılamaz ve Paddle/GCP yetkisi gerektirir.
