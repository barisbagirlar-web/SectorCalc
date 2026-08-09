# SEO V3 Registry Evidence Gaps

This file records fields that are not persisted one-to-one in the existing SectorCalc registry model. No placeholder data is introduced.

- `modifiedAt`: not persisted in every source record. The V3 adapter derives it from the latest Git commit affecting the record's source file/content source, with `seo/registry-data.mjs` as the final evidence-backed fallback. Build time is never used.
- `conversionEvent`: some non-conversion pages intentionally have no event. The adapter represents this as the explicit non-event value `none`; it does not invent a conversion event.
- `qualityContract`: V3 Phase 5 adds the stronger content-quality contract for applicable content roles. It is not fabricated during Phase 1.
- `secondaryEntityIds`: records without secondary entities map to an empty array rather than invented entities.
- Rich-result types outside the V3 allowed list are not relabeled. If no allowed V3 type exists, the adapter emits `None`.

The authoritative route, canonical, indexability and query-ownership source remains `seo/registry.mjs` / `seo/registry-data.mjs`.
