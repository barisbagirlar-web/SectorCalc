# AGENTS.md — SectorCalc

## 1. Mission

Maintain SectorCalc as a production-grade, global, English-only industrial calculation platform for engineers, technicians, machinists, CNC operators, maintenance teams, fabricators, contractors, quality teams, logistics teams, energy professionals, and finance users.

Primary priorities, in order:

1. Mathematical correctness.
2. Production reliability.
3. Clear decision value.
4. Security and data integrity.
5. Fast, professional user experience.
6. SEO and commercial conversion.
7. Maintainability and regression protection.

Do not optimize appearance at the expense of calculation accuracy, runtime stability, or evidence.

---

## 2. Non-Negotiable Product Rules

- Website-visible content must use standard English only.
- Do not add Turkish, German, Arabic, Spanish, French, pseudo-localized, or mixed-language UI copy.
- Root-domain routing only. Do not introduce `/en` or other locale-prefixed public routes.
- `/en` must remain unavailable unless the owner explicitly changes this rule.
- Preserve the canonical footer line exactly unless explicitly instructed otherwise:

  `© 2026 SectorCalc — Stuttgart, Germany · Global Engineering Standards · hello@sectorcalc.com`

- Preserve the canonical brand name `SectorCalc`.
- Free tools must remain free.
- Pro calculation engines must remain server-side.
- Do not expose proprietary formulas, registries, secret values, or paid calculation logic in client bundles.
- Do not claim TÜV certification, ISO certification, regulatory approval, accreditation, or official endorsement unless documentary proof exists and the owner explicitly authorizes the exact wording.
- Do not add AI-looking filler visuals, invented testimonials, fake company logos, fake usage counts, or fabricated social proof.
- Do not silently change calculator counts, product states, pricing, entitlements, routes, or catalog membership.
- Derive tool counts from the source of truth; never hardcode stale counts.

---

## 3. Hosting and Runtime Architecture

- Production hosting is Firebase Hosting.
- Do not introduce or restore Vercel deployment logic unless explicitly requested.
- Preserve server/client boundaries.
- Firebase Admin code must remain server-only.
- Never import server-only modules into client components.
- Never expose secrets through `NEXT_PUBLIC_*`, browser bundles, generated static files, logs, or error messages.
- Use static, supported package imports. Avoid computed or alias-based runtime imports.
- Treat build-time environment variables and runtime environment variables as separate concerns.
- A successful local build is not proof of production readiness.

---

## 4. Scope Discipline

For every task:

1. Identify the exact affected route, component, API, formula, registry, schema, or deployment path.
2. Trace all direct callers, importers, server/client boundaries, state transitions, side effects, caches, auth checks, and persistence paths.
3. Make the smallest complete change that permanently fixes the root cause.
4. Do not modify unrelated modules.
5. Preserve unrelated user changes and uncommitted work.
6. Do not delete files, tools, formulas, fixtures, registries, media, secrets, or user data unless explicitly instructed.
7. Do not perform production deployment, merge, force-push, destructive migration, or irreversible cleanup without explicit authorization.

When the task is ambiguous, choose the least invasive interpretation and record it as `[ASSUMPTION]`. Ask a question only when proceeding would create material or irreversible risk.

---

## 5. Calculator Integrity Standard

Every calculator change must review:

- Input schema and UI field mapping.
- Units and dimensional consistency.
- Raw unit to canonical unit conversion.
- Percent versus decimal semantics.
- Null versus zero semantics.
- Negative values.
- Zero denominators.
- Very small and very large values.
- Time-period alignment.
- Currency and locale normalization.
- Allocation and reconciliation.
- Duplicate counting and double counting.
- Rounding stage and rounding mode.
- Deterministic reproducibility.
- Result labels, decision states, tolerances, and advisory ranges.
- API response and client rendering parity.
- Export and print representation.
- Error and warning behavior.

Rules:

- Never generate expected test values using the function under test.
- Golden fixtures must contain independently calculated expected values.
- Preserve full precision through intermediate steps.
- Round only at the defined final presentation stage.
- Fail closed on missing material inputs.
- Do not convert invalid or missing values to zero unless the formula contract explicitly defines that behavior.
- Do not report a decision state when required inputs or validation are incomplete.
- Result totals must reconcile exactly within a documented tolerance.
- Client previews must never be treated as the authoritative paid result.

---

## 6. Free and Pro Tool Rules

### Free Tools

- Must calculate correctly without payment.
- Must provide immediate value.
- Must contain concise formula logic, units, assumptions, limitations, tolerances, and interpretation.
- Must not contain broken CTA paths, fake locks, or hidden paid dependencies.
- Must feed an appropriate commercial path without degrading the free result.

### Pro Tools

- Formula execution must remain server-side.
- Registry registration must be deterministic and testable.
- Client code may submit inputs and render results, but must not contain the protected engine.
- Every Pro tool must have a clearly defined commercial state.
- Do not present quarantined, source-required, incomplete, or contract-mismatched tools as live.
- Payment, entitlement, credit, and report-consumption flows must be idempotent.
- Failed executions must not consume entitlements unless the commercial contract explicitly says otherwise.

---

## 7. UI, Content, and SEO Rules

- A user must understand the page purpose within five seconds.
- Use professional, concise, domain-specific English.
- Avoid generic marketing filler.
- H1, subheading, CTA, tool purpose, required inputs, and output value must align.
- Preserve route intent:
  - Free tools: `/free-tools`
  - Pro tools: `/pro-tools`
  - Calculator library: `/calculator-library`
- Do not create duplicate canonical pages.
- Structured data must match visible content.
- Never emit schema claims that are not supported by the page.
- Avoid keyword stuffing.
- Do not hide essential limitations below irrelevant marketing sections.
- All technical claims must be defensible.
- Accessibility, keyboard navigation, labels, focus states, contrast, and error messaging are required.
- PDF, print, and export layouts must not clip, overflow, or lose units.

---

## 8. Security Rules

- Enforce authentication and authorization server-side.
- Validate tenant/resource ownership for every object lookup.
- Never trust client-provided role, entitlement, price, result, ownership, or credit state.
- Use schema validation at all API boundaries.
- Apply rate limiting where appropriate.
- Protect against CSRF, injection, path traversal, insecure direct object references, replay, and duplicate requests.
- Use short-lived signed URLs for private downloads.
- Keep audit-relevant actions traceable.
- Never log secrets, full tokens, private keys, payment credentials, or sensitive customer documents.

---

## 9. Required Development Workflow

During development:

1. Reproduce the issue.
2. Document the root cause.
3. Identify the affected call chain.
4. Apply the permanent fix.
5. Add or update focused regression tests.
6. Run targeted tests first.
7. Run the full release gates only after targeted tests pass.

Minimum final gates for a code change:

```text
TYPECHECK=PASS
LINT=PASS
TARGETED_TESTS=PASS
RELEVANT_GUARDS=PASS
PRODUCTION_BUILD=PASS
```

For calculation changes also require:

```text
INDEPENDENT_GOLDEN_FIXTURES=PASS
UNIT_DIMENSION_TESTS=PASS
NULL_ZERO_NEGATIVE_EXTREME_TESTS=PASS
ROUNDING_TESTS=PASS
DETERMINISTIC_REPLAY=PASS
ALLOCATION_RECONCILIATION=PASS
DOUBLE_COUNTING_GUARD=PASS
```

For production readiness also require:

```text
DEPLOYED_SHA=PROVEN
LIVE_SHA=PROVEN
LIVE_ENDPOINT=PASS
REAL_BROWSER_E2E=PASS
RUNTIME_LOGS=REVIEWED
AUTH_PERSISTENCE=PASS
RELEVANT_INTEGRATIONS=PASS
```

Do not report production readiness from source code, local tests, or build output alone.

---

## 10. Evidence and Status Language

Use only these evidence-based statuses:

- `PASS`
- `FAIL`
- `NOT_PROVEN`
- `NOT_IMPLEMENTED`
- `EXTERNAL_BLOCKER`

Never fabricate a PASS.

A command is PASS only when its actual exit code and relevant output are available.

A feature is production-ready only when its live runtime path is proven.

---

## 11. Final Delivery Format

Every completed task must report:

```text
ROOT_CAUSE=
AFFECTED_CALL_CHAIN=
CHANGED_FILES=
PERMANENT_FIX=
REGRESSION_PROTECTION=
TYPECHECK=
LINT=
TARGETED_TESTS=
FULL_TESTS=
BUILD=
COMMIT_SHA=
DEPLOYED_SHA=
LIVE_SHA=
LIVE_ENDPOINT=
BROWSER_E2E=
RUNTIME_LOGS=
UNRESOLVED_BLOCKERS=
FINAL_ACCEPTANCE=
```

Do not hide skipped tests or external blockers.

---

## 12. Prohibited Actions

Do not:

- Rewrite the entire repository for a narrow bug.
- Replace proven architecture with a fashionable alternative without a measured need.
- Disable tests, guards, branch protection, lint rules, or type safety to obtain green CI.
- Mark a failing check as optional to bypass a release gate.
- Use mock success as production evidence.
- Add `any`, unsafe casts, blanket ignores, or error swallowing as a permanent fix.
- Change legal, pricing, entitlement, product-count, hosting, or language policy without explicit instruction.
- Deploy to production without explicit authorization.
