# DeepSeek AI Quality Factory

SectorCalc uses DeepSeek as an **AI-assisted quality, repair planning and draft generation engine** — not as a live calculation engine, Formula Gate authority, payment gate, deploy gate, or legal/certification authority.

DeepSeek is active, broad-scoped, and used for maximum efficiency in analysis and repair planning. Final authority for Formula Gate, payment eligibility, deployment, legal claims, and certification claims remains with deterministic test gates and human approval.

## DeepSeek Role Boundary

DeepSeek is used as an AI-assisted quality, repair planning and draft generation engine. It is not the final authority for Formula Gate, payment eligibility, deployment, legal claims or certification claims.

DeepSeek may generate formula drafts, schema drafts, validation suggestions, i18n fixes, unit normalization suggestions, result renderer plans, guide specs and bulk repair plans.

All DeepSeek outputs must pass deterministic gates before any production use:

- lint
- typecheck
- build
- P2.4 / P2.5 audit
- Runtime Trust audit
- Golden Oracle tests where available
- Playwright smoke where available
- Revenue Gate assert
- human approval

Final authority remains with deterministic test gates and human approval.

### What DeepSeek can do

- Propose formula drafts
- Generate input schema drafts
- Suggest validation rules
- Propose result renderer structure
- Find i18n / locale / RTL issues
- Suggest unit canonical fixes
- Detect generic input guide issues
- Propose premium guide spec drafts
- Interpret P2.4 / ERT / Runtime Trust findings
- Create bulk repair plans
- Produce patch plans and test plans
- Formula consistency review suggestions
- Input / variable / unit risk flags
- Validation gap recommendations
- Patch prompt material for human-reviewed fixes
- JSON repair suggestion reports (`DeepSeekSuggestionEnvelope`)

### What DeepSeek cannot do alone

- Give Formula Gate final decisions
- Decide payment eligibility
- Give deploy GO / NO-GO decisions
- Approve legal or certification claims
- Ship high-risk new formulas to production without gates
- Apply bulk patches without human approval and tests
- Fake PASS audit results
- Bypass WARN / FAIL verdicts
- Live page render or form generation
- Automatic code changes
- Git commits or deploys

### Authority model

| Actor | Role |
| --- | --- |
| **DeepSeek** | Proposes, drafts, finds risks, produces repair plans |
| **Deterministic system** | Validates via P2.4 audit, Runtime Trust, Golden Oracle, Playwright QA, lint, tsc, build, and revenue gate |
| **Human** | Final approval, deploy, payment, legal/certification, and critical formula decisions |

### Decision table

| DeepSeek task | Real authority | Rule |
| --- | --- | --- |
| Design new formula | Can draft | Field/formula fit requires tests and human approval |
| Generate schema / validation / result renderer | Can draft | Cannot go live without deterministic gates |
| Formula Gate final decision | Cannot | Requires P2.4 + Runtime Trust + Oracle + human decision |
| Payment eligibility decision | Cannot | Financial/trust/payment decision stays with human |
| Deploy GO / NO-GO | Cannot | May interpret test results; deploy decision is human |
| Legal / certification claim | Cannot | Requires authorized human and documentation |
| Bulk repair patch application | Plans only | Patch applied with human approval + tests + audit |

### Hard guardrails (immutable)

- Secrets never go to frontend.
- `.env` is never committed.
- Stripe secret is never logged.
- Brevo API key is never logged.
- Firebase private key is never logged.
- No fake PASS.
- No WARN bypass.
- No payment on free tools.
- No payment on problem slugs.
- No deploy without passing tests.
- No certification claim without evidence.
- Formula Gate final decision is never delegated to AI.
- Payment decision is never delegated to AI.
- Deploy decision is never delegated to AI.

**Formula Gate decisions remain deterministic** (FormulaContract, oracle, P2.4, ERT Runtime Trust Engine).

DeepSeek is **not a live render dependency**. If `DEEPSEEK_API_KEY` is missing, build/test/scripts exit safely with `suggestionUnavailable: true`.

## Architecture (DSK roadmap)

| Phase | Scope |
| --- | --- |
| **DSK-0A** | Client, JSON guard, minimum redaction, healthcheck, task temperature config |
| **DSK-1** | Formula Auditor — problem slug + top risky tools → JSON suggestions |
| **DSK-0B** | Full redaction, cache, cost controls |
| **DSK-2** | Schema review |
| **DSK-3** | Guide spec |
| **DSK-4** | Repair queue |

## File layout

```
src/lib/ai/deepseek/
  deepseek-types.ts
  deepseek-client.ts          # server/script only
  deepseek-json-guard.ts
  deepseek-redaction-lite.ts
  deepseek-prompts.ts
  formula-audit-collector.ts
  run-healthcheck.ts
  run-formula-audit.ts

scripts/ai/
  deepseek-healthcheck.mjs
  deepseek-formula-audit.mjs
```

## Environment

| Variable | Required | Default |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | No (offline mode without key) | — |
| `DEEPSEEK_MODEL` | No | `deepseek-chat` |
| `DEEPSEEK_TIMEOUT_MS` | No | `20000` |
| `DEEPSEEK_MAX_TOOLS_PER_RUN` | No | `10` |

**Never** expose `DEEPSEEK_API_KEY` in frontend bundles, client components, logs, or git.

## Task temperature policy

| Task | Temperature | Retries |
| --- | --- | --- |
| `formula_audit` | 0.1 | 1 |
| `schema_review` | 0.2 | 1 |
| `guide_spec` | 0.4 | 1 |
| `content_draft` | 0.5 | 1 |

## JSON suggestion format

```json
{
  "taskType": "formula_audit",
  "generatedAt": "2026-06-13T12:00:00.000Z",
  "mustNotAutoApply": true,
  "items": [
    {
      "slug": "tool-slug",
      "riskLevel": "high",
      "rootCause": "…",
      "findings": ["…"],
      "suggestedFiles": ["src/…"],
      "suggestedChanges": [
        {
          "type": "validation_rule",
          "description": "…",
          "confidence": "medium"
        }
      ]
    }
  ]
}
```

`mustNotAutoApply` is **always** `true` at envelope level. Unknown fields may be stored but are not auto-converted to patches.

## Human approval policy

1. Run auditor offline: `npm run ai:deepseek:formula-audit`
2. Review `scripts/.cache/deepseek/formula-audit-suggestions.json`
3. Human engineer applies controlled patches through existing governance (Formula Gate, P2.4, ERT)
4. Never auto-apply DeepSeek output

## Minimum redaction

Before any DeepSeek request, payloads pass through `redactSecretsLite`:

- API keys, Stripe/Brevo/Firebase secrets
- Private keys, webhook secrets
- Payment/session id patterns
- Email addresses → `[REDACTED_EMAIL]` (default)

Marker: `[REDACTED_SECRET]`

## Commands

```bash
npm run ai:deepseek:health
npm run ai:deepseek:formula-audit
```

## DSK-1 audit targets

1. Critical problem slug: `abonelik-yazilim-cloud-yillik-maliyet-hesabi` (always included)
2. Top P2.4 `FAIL` / `WARN` / `QUARANTINE` tools (from cache + verdict registry)
3. Top ERT `review` / `blocked` tools (from runtime trust report when present)

Output: `scripts/.cache/deepseek/formula-audit-suggestions.json`

## Healthcheck behavior

- No API key → exit `0`, `status: unavailable`
- API key present but failure → exit `1`
- API key present and valid JSON ping → exit `0`, `status: ok`
