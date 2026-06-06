# SectorCalc — Cursor Workflow

Copy-paste templates and command allowlists for stable AI-assisted development.

---

## 1. Top prompt (start every large task)

```txt
Önce mevcut yapıyı oku. Tahminle kod yazma.

Bu projede amaç:
Mevcut çalışan SectorCalc sistemini bozmadan küçük, güvenli, test edilebilir patch üretmek.

Kesin:
- Yeni repo yok.
- Yeni domain yok.
- src/app/api route yok.
- Admin panel dosyalarına dokunma.
- Lead dashboard, auth, activity, cleanup sistemini bozma.
- Secret frontend'e çıkarma.
- .env.local veya service account commit etme.
- Gereksiz refactor yapma.
- Yeni package eklemeden önce gerekçesini yaz.
- Build/lint/tsc geçmeden deploy/commit yapma.

Çıktı formatın:
1. Dokunulacak dosyalar
2. Risk
3. Yapılacak patch
4. Test komutları
5. Deploy komutları
6. Manual QA checklist
7. Git commit mesajı

Bu patch bittikten sonra working tree clean olmalı.
```

---

## 2. Final report format (end every task)

```txt
## Final Report

1. Files changed
2. What changed
3. What did not change
4. Security check (npm run check:secrets)
5. Test results (lint / tsc / build / audit)
6. Deploy result (or "skipped — no deploy needed")
7. Git commit (hash or "not committed")
8. Manual QA checklist
9. Known risks
```

---

## 3. Terminal allowlist

### Safe (routine)

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run audit:revenue-tools
npm run check:secrets
cd functions && npm run build
firebase deploy --only hosting --project sectorcalc-bf412
firebase deploy --only functions --project sectorcalc-bf412
firebase deploy --only firestore:rules --project sectorcalc-bf412
firebase functions:list --project sectorcalc-bf412
firebase firestore:databases:list --project sectorcalc-bf412
git status
git status --short
git add .
git commit -m "message"
git push
git log --oneline -5
grep -RIn
find .
cat
```

### Restricted (explain + confirm)

- `rm`, `mv`, `git reset`, `git clean`
- `firebase functions:delete`, `firebase firestore:delete`
- `npm install`, `npm update`

### Never without explicit approval

- `rm -rf`
- `git reset --hard`
- `git clean -fd`
- `firebase projects:delete`
- `firebase hosting:disable`
- `npm audit fix --force`

---

## 4. Revenue / launch phase lock

| Phase | Status |
|-------|--------|
| 1. Region + stability settings | Done |
| 2. 17-sector full catalog | Done |
| 3. Full catalog QA | Done |
| 4. Campaign tracking + UTM | Next |
| 5. Launch decision gate | Pending |
| 6. Stripe live readiness | Pending |
| 7. First paid campaign | Pending |

One phase per session when possible. Commit per phase.

---

## 5. Cursor rules in this repo

| File | Purpose |
|------|---------|
| `.cursor/rules/sectorcalc.mdc` | Always-on project discipline |
| `.cursor/rules/protected-infrastructure.mdc` | Admin / Stripe / rules lock when those files are open |
| `.cursor/rules/brand-assets-lock.mdc` | Logo/favicon lock |
