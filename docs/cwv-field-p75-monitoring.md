# Core Web Vitals — Field p75 Monitoring Plan (FAZ 2.1b)

**Primary decision metric:** CrUX / GSC field p75 (not Lighthouse lab).  
**Targets:** LCP &lt; 2.5s · CLS &lt; 0.1 · INP &lt; 200ms (p75).  
**Proxy until traffic accumulates:** observed Lighthouse (`--throttling-method=provided`).

## Instrumentation (shipped)

| Layer | Mechanism | Destination |
|---|---|---|
| App RUM | `WebVitalsReporter` via `next/web-vitals` `useReportWebVitals` | GA4 `gtag` event + `dataLayer` + `window.__SC_WEB_VITALS__` |
| Metrics | LCP, CLS, INP, TTFB, FCP | event name = metric name; `metric_id`, `metric_rating` |

Verify locally after navigation:

```js
window.__SC_WEB_VITALS__
```

## Weekly cadence

1. **GSC → Experience → Core Web Vitals** — URL groups for `/tools/free/*`, `/calculators/*`, `/`.
2. **CrUX History API** (optional) — origin + key URLs: oee, von-mises, fmea-rpn, home, lean hubs.
3. **Snapshot table** (copy into release notes):

| Week | Origin LCP p75 | Origin CLS p75 | Origin INP p75 | Free-tool LCP p75 | Notes |
|---|---|---|---|---|---|
| W0 (deploy) | — | — | — | — | RUM live; await sample |
| W1 | | | | | |
| W2 | | | | | |

4. **Gate rule:** Lab/observed may guide patches; **ship/rollback judgment uses field p75** once GSC shows “Sufficient data”.

## Until field data exists

- Prefer **observed** LCP/CLS (`throttling-method=provided`) over simulated lab.
- Keep ŞART 3 SEO checks on every CWV CSS change.
- Do not declare FAZ 2.1 LCP “closed” on lab alone if field later fails.

## First meaningful field read

When GSC shows green/poor for mobile on free-tool URL group:

1. Record LCP/CLS/INP p75.
2. If LCP p75 ≥ 2.5s → open targeted patch (hero paint only; no E-E-A-T strip).
3. If CLS p75 ≥ 0.1 → attribute via RUM + PerformanceObserver layout-shift entries.
4. If INP p75 ≥ 200ms → profile `1255-*.js` / interaction handlers; code-split only then.
