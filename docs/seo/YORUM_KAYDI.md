# SectorCalc SEO Interpretation Log

## 2026-08-09

- V6 generic rules conflict with existing SectorCalc repository contracts in deployment target, money serialization, and JSON Schema dialect.
- Under AIP-21/AIP-24, the more restrictive existing SectorCalc production contract is preserved without weakening the V6 control objective. Details are recorded in `MANDATE_ERRATA.md`.
- The security prerequisite branch is not a normal SEO phase. Because AIP-13 has higher precedence, only containment/guard changes are allowed here. Robots, sitemap and runtime changes remain assigned to their owning phases.
- V6 Phase 0 explicitly requires verified GSC and GA4 access; the current tool environment exposes neither Search Console nor GA4, and plugin discovery returned no installable connector for either service. This is treated as a data-access gate, not as zero traffic or zero revenue.
- Missing GSC/GA4 data must not be replaced with estimates, public search snippets, or inferred analytics. Phase 0 remains `BLOCK_DATA` until those sources are accessible or the authoritative mandate is amended by the owner.
