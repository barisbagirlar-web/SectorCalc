# Phase 8 Report — Crawl / AI Discovery

[Certain] Search/retrieval, user-directed fetch, ad verification and training crawlers are separate policy classes.

[Certain] Current public policy allows Google/Bing search plus OpenAI, Perplexity and Claude retrieval/search crawlers on public pages while keeping private application paths blocked. Training/non-search AI-use crawlers configured by policy remain blocked.

[Certain] `llm.txt` and `llms.txt` must remain byte-identical, cite the canonical sitemap, and avoid legacy `*-pro.html` primary URLs.

[Certain] A user-agent string alone is never accepted as verified-bot evidence; explicit verification evidence and method are required before such a claim.

[Missing_data] No external IndexNow submission or verified crawler visit is claimed without provider response/log evidence.

ROLLBACK: revert this PR and redeploy the previous merged runtime.
