# Phase 8 Report — Crawl / AI Discovery

[Certain] AI-search crawlers and AI-training crawlers are governed as separate policy classes. Search retrieval remains allowed where configured; training remains blocked where configured.

[Certain] `llm.txt` and `llms.txt` are required to remain byte-identical, point to the canonical sitemap, and avoid legacy `*-pro.html` URLs as primary citations.

[Certain] IndexNow candidate selection is delta-only; unchanged URLs are excluded from submission candidates.

[Missing_data] No crawler request is called a verified bot without request-level evidence. Crawl waste and discovery lag are not fabricated because verified access-log evidence is unavailable here.

[Missing_data] No IndexNow external submission is claimed without a configured provider key and an actual response.

ROLLBACK: revert this PR; no public/runtime artifact is modified by this contract PR.
