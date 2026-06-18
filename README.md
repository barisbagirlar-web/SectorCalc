# SectorCalc

English-first B2B platform with sector-specific calculators and premium decision-report previews for construction, cleaning, restaurant, e-commerce, and CNC manufacturing.

**Live domain:** [sectorcalc.com](https://sectorcalc.com)  
**Firebase test URL:** [sectorcalc-bf412.web.app](https://sectorcalc-bf412.web.app)

> Production reality is documented in [`docs/production-reality.md`](docs/production-reality.md).
> Repo inventory docs are not live reality by themselves — always cross-check with
> current HEAD + smoke test results (`npm run audit:revenue-tools`, `npm run smoke:premium-routes`, `npm run smoke:locale-routes`).

> **Cursor path safety:** Do not use `src/lib/calculation-intelligence/` — it does not exist.
> All Dual-Core logic lives under `src/lib/formula-governance/`.

## MVP scope (shipped)

- 5 industry hubs, 5 free tools, 5 premium tools
- Shared calculator engine with premium report previews
- Pricing page, sample decision report, lead capture modal
- LocalStorage lead fallback + optional Firestore (`leadIntents`)
- Admin-light viewer at `/admin/leads` (disabled in production by default)
- Firestore security rules (create-only for leads)
- Sitemap, robots, Privacy / Terms / Disclaimer

## Not in MVP

- Payment / checkout
- User authentication
- Full admin dashboard
- Real PDF, Excel, or Word export
- Email sending
- Server-side Admin SDK

See [docs/security-notes.md](docs/security-notes.md) for production gaps.

## Local development

```bash
npm install
cp .env.example .env.local
# Optional: set NEXT_PUBLIC_SITE_URL and Firebase vars in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test commands

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start   # production build locally
```

## Environment variables

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical origin, e.g. `https://sectorcalc.com` |
| `NEXT_PUBLIC_FIREBASE_*` (6 vars) | Optional | Firestore lead writes; see `.env.example` |
| `NEXT_PUBLIC_ENABLE_ADMIN_LIGHT` | Optional | **Do not** set `true` on public production |

Full checklist: [docs/env-checklist.md](docs/env-checklist.md).

## Model Seçimi

| Model | Kullanım |
|-------|----------|
| Claude | Kritik iş: refactor, mimari, güvenli patch, admin/stripe/revenue |
| DeepSeek (`deepseek-coder`) | Toplu iş: `scripts/deepseek/*`, schema scan, bulk repair, i18n pipeline |

### Cursor + DeepSeek

**Basit (deepseek-coder / deepseek-chat):**

1. `.env.local` → `DEEPSEEK_API_KEY=...` (tırnaksız)
2. `npm run setup:cursor-deepseek`
3. Cursor Settings → Models → Base URL `https://api.deepseek.com` → custom model ekle → seç

**V4 Pro (Agent + reasoning — proxy gerekir):**

1. `pip3 install git+https://github.com/yxlao/deepseek-cursor-proxy.git`
2. `npm run start:deepseek-proxy` — terminal açık kalsın; çıktıdaki `api_base_url` satırını not al
3. Cursor Settings → Models:
   - OpenAI API Key: `.env.local` → `DEEPSEEK_API_KEY`
   - Override Base URL: `api_base_url` (ör. `https://XXXX.ngrok-free.dev/v1`)
   - Custom model: `deepseek-v4-pro`
4. Durdurmak: `npm run stop:deepseek-proxy`

Toplu iş subagent: `@deepseek-bulk`

## Deployment

### Local pre-deploy checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

### Firebase CLI

```bash
firebase login
firebase use <your-firebase-project-id>
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only hosting
```

**Important:** If you use **Firebase App Hosting** or framework-aware Hosting for Next.js, confirm your Firebase project setup in the console before `hosting` deploy. The repo’s `firebase.json` is minimal (Firestore + `hosting.source: "."`); align with [Firebase Next.js hosting docs](https://firebase.google.com/docs/hosting/frameworks/frameworks-overview) for your chosen flow.

Set production env vars (`NEXT_PUBLIC_SITE_URL`, optional Firebase keys) in the hosting environment **before** build.

Step-by-step: [docs/deployment-checklist.md](docs/deployment-checklist.md).

## QA before / after go-live

- Route matrix: [docs/public-qa-checklist.md](docs/public-qa-checklist.md)
- First live walkthrough: [docs/first-live-test-script.md](docs/first-live-test-script.md)

## Firebase & security docs

- [src/lib/firebase/README.md](src/lib/firebase/README.md) — client config, `leadIntents` collection
- [docs/security-notes.md](docs/security-notes.md) — MVP posture and pre-launch requirements
- `firestore.rules` — deny public read; validated create on `leadIntents` only

## Project structure (high level)

```
src/app/          Next.js App Router pages
src/components/   UI, tools, leads, admin
src/data/         Tools, industries, pricing registries
src/lib/          Calculators, leads, Firebase client, analytics
docs/             Deployment, env, QA, security
firestore.rules   Firestore security rules
firebase.json     Firebase CLI config
```

## License

Private / unpublished — update when applicable.
