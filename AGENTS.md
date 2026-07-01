# SectorCalc — AGENTS.md

Project general working discipline. Primary source: this file + `.cursor/rules/**/RULE.md`.

Do not use `.cursorrules`. It is only a fallback for older Cursor versions; the primary source is here.

## DeepSeek Priority Lock

DeepSeek API will be active and fully utilized in SectorCalc tasks.

### Priority

1. Stand up all tools
2. Bulk repair P2.4 / ERT / Runtime Trust findings
3. Quickly patch input schema, validation, FormulaContract, result renderer, i18n, unit canonical, and guide policy issues
4. Increase PASS count
5. Decrease FAIL / WARN / QUARANTINE counts
6. Address P9/payment tasks after the tool core is strengthened

### Forbidden

- Using DeepSeek merely as a passive reporting engine
- Wasting time with unnecessary small theoretical plans
- "Let's wait first" approach
- Fake PASS
- WARN bypass
- Fake Formula Gate
- Opening free tool payment
- Putting secrets in the frontend
- Committing untested patches

### Default Workflow

- DeepSeek-assisted bulk audit
- DeepSeek-assisted bulk repair
- Patch
- lint / tsc / build
- P2.4 audit
- Runtime Trust audit
- Revenue gate assert
- Commit

### P9/payment

Secondary priority until tool recovery is complete.

### Output Format

```txt
RESULT
ANALYSIS
WARNING
STEPS
FINAL OUTPUT
```

Commands, env, patches, and prompts must be provided as copyable blocks.

---

## 1. Basic Order

In every task:

1. Briefly summarize the instruction.
2. Specify the files to be touched.
3. State the risk.
4. Apply small, safe patches.
5. Provide proof of changes.
6. Provide test / audit / grep output.
7. Explicitly write down anything left incomplete.

## 2. Proof Requirement

The following statements are **forbidden without proof**:

- "I did it"
- "Finished"
- "Completed"
- "Problem solved"
- "Everything is working"
- "Applied"

Accepted proofs:

- `git status --short`
- `git diff --stat`
- list of changed files + related lines
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- related `npm run audit:...`
- `grep` / `curl` output

If no proof:

```txt
NO PROOF: I cannot say this step is complete.
```

If scope is not applied:

```txt
NOT APPLIED: <missing item>
```

Do not count as completed if "NOT APPLIED" or "NO PROOF" is present.

## 3. File and Scope

If file path is not given, search the repo first:

```bash
grep -RIn "search-term" src app lib public scripts
find . -maxdepth 4 -type f | sort
```

If not found, ask the user; do not guess.

## 4. Protected Areas

Do not touch without explicit permission:

```txt
.env / *.secret
firebase / firestore rules
vercel / cloudflare deploy config
auth / payment / checkout
admin / private routes
152 premium seed content
existing route slugs (no random renaming)
data/pro-tools/ (Pro/Free tool data files and _merged.json must never be deleted/overwritten)
```

Details: `.cursor/rules/01-sectorcalc-safety/RULE.md`

## 5. Mandatory Test Gate (code changes)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

If there is a related audit, also:

```bash
npm run audit:...
```

For markdown / rule file changes only, the narrowest test is sufficient; `git diff` is still mandatory.

## 6. Public Output Check

For public/web changes:

```bash
grep -RIn "TODO\|FIXME\|temp\|to_be_fixed\|href=\"#\"\|Planned\|Live\|Phase 1\|Phase 2\|Score" src app public scripts
```

If there is an unexpected match on the public surface, the job is not considered done.

## 7. Git Proof (every delivery)

```bash
git status --short
git diff --stat
```

## 8. Report Format

```txt
Action:
Understanding summary:
Touched files:
Changes made:
Test commands:
Test output:
Git diff summary:
Remaining gaps:
Status: COMPLETED / ERROR / WAITING / NOT APPLIED
```

## 9. Completion Conditions

- Instruction scope applied
- **All fields in original spec (including top-level, input, validation, reference_code, metadata, error_propagation, fmea, audit_log) applied — no field can be skipped citing "does not fit system format"**
- Changed files reported
- Related tests run (lint/tsc/build on code changes)
- No failing tests
- Public bad grep is clean (if public changes exist)
- `git diff --stat` shown
- Gaps explicitly written

## 10. Sub-rule Files

| File | Topic |
|---|---|
| `.cursor/rules/00-proof-gate/RULE.md` | Proof generation, test, grep |
| `.cursor/rules/01-sectorcalc-safety/RULE.md` | Protected areas, audit requirement |
| `.cursor/rules/02-ui-quality/RULE.md` | UI quality, responsive, visual ratio |
| `.cursor/rules/04-completeness-gate/RULE.md` | Spec completion requirement — 100% of given fields applied |

## 11. SectorCalc Quality Summary

Industrial calculation and decision platform perception is preserved:

- No unnecessary animation / meaningless gradients / excessive badges
- No hardcoded secrets or frontend API keys
- No uncategorized or fake premium tools
- No `href="#"`; no mobile breakage
- Desktop + mobile + console + network check on UI changes

Details: `.cursor/rules/02-ui-quality/RULE.md`

## 12. Claude Design

When "Claude Design" is mentioned, the following specifications and design rules must always be remembered and applied:
- **General Structure**: A spacious, balanced, and corporate interface template developed on the latest `main` branch (commit `9fafb0918` and subsequent color palette updates), using Barlow serif/sans heading fonts, JetBrains Mono font-mono, and terracotta/copper accent colors.
- **File Locations**:
  - Component: `src/components/landing/LandingPageContent.tsx`
  - Style: `src/styles/landing-page.css`
  - Page: `src/app/[locale]/page.tsx`
- **Link Standards**: Links on the site must absolutely point accurately to real and relevant active pages (e.g., `/pricing` instead of pro-tools). Broken or placeholder (`#`) links must never be used.
- **Improvements**: When visual incongruity or error is spotted in design layouts or icons, take initiative to adjust alignments and visual details to the most premium standards to increase system quality.

## 13. DeepSeek API / Formula and Input Creation Authority Revocation
User instruction: "I revoke deep seek api authority to create formulas/inputs like this, save this and lock it."
The DeepSeek Priority Lock (Item 1) rule is INVALID for **formula analysis, formula creation, input validation, and import from txt file into the system**. DeepSeek API will ABSOLUTELY NOT be used for these operations; the coding, reading, and reasoning ability of the main AI agent (myself) will be used directly.

## 14. Deployment and Hosting
We DO NOT WORK with Vercel. We only work with Firebase Host (Firebase Hosting / App Hosting). Deployment processes and configurations must be prepared for Firebase, not Vercel.

## 15. Adding a New Tool and Deployment Workflow (Commit-First)
When a new tool is added or the sitemap is updated, the following steps must be followed in order:
1. First, all code and schema changes must be `git commit`ted.
2. Then, `npm run build` and `deploy` steps must be run (preferably with `DEPLOY_FORCE_REBUILD=1 node scripts/deploy-production.mjs`).
Reason: Firebase frameworks Next.js integration executes a process that cleans the repo to HEAD state (git reset) during deploy. Uncommitted schemas won't find a match in date resolver (`tool-git-dates.json`) lookups and fall back to the build fallback date. For this reason, the workflow must always be "Commit First, Build Second".

## 16. SEO Policy for Removed Tools
When a Pro Tool or any other public route is permanently removed from the system, it is intentionally allowed to return a standard `404 Not Found` response. 
- A `410 Gone` HTTP status is technically preferred for permanently deleted indexed URLs.
- However, to reduce middleware complexity and maintenance overhead, we explicitly accept the standard `404 Not Found` behavior for removed tools. 
- They must be completely purged from the codebase, the sitemap, and all registries.
