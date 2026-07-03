# Cursor Apply Prompt — SectorCalc V5.3.1 Calculator Schema Package

## Objective
Integrate the attached `schemas/*.schema.json` files as approved SectorCalc V5.3.1 calculator schemas without changing the existing architecture, route policy, payment, mail, hosting, keys, secrets, or unrelated infrastructure.

## Non-Negotiable Rules
- Do not create a new UI system.
- Do not replace `UniversalIndustrialDecisionForm`.
- Do not create `/en`, `/tr`, or any locale-prefixed public route.
- Do not move formula execution into the public client.
- Do not expose exact formula expressions in public UI, PDF, JSON audit, or copy summary.
- Do not call an LLM during runtime, public API execution, or browser rendering.
- Do not use `eval`.
- Do not use `new Function`.
- Do not add TypeScript `any`.
- Do not reproduce paid standard tables, restricted clauses, proprietary coefficients, or invented standard limits.
- Do not claim certification, approval, legal proof, regulatory approval, or replacement of qualified engineering review.

## Package Contents
- `schemas/*.schema.json`: one V5.3.1 calculator schema per tool.
- `manifest.json`: schema registry manifest with SHA-256 hashes.
- `tools_index.json`: tool_key to schema-file map.
- `validate-v531-cursor-package.mjs`: local package validator.

## Required Application Process
1. Copy `schemas/*.schema.json` into the existing approved schema storage path. If the repository already has a canonical path, use that path. If not, use:
   `src/sectorcalc/schemas/v531/`
2. Copy `manifest.json` or merge it into the existing approved schema registry without changing public routes.
3. Validate every schema with strict top-level key rejection.
4. Bind approved schema fetch to the existing server execution path.
5. Keep private formula registry server-only.
6. Ensure `UniversalIndustrialDecisionForm` consumes `useUniversalIndustrialDecisionFormMachine`.
7. Ensure the public client performs only unit preview and client precheck.
8. Ensure outputs, decision interpretation, hidden risks, uncertainty, sensitivity, FMEA, proof pack, audit seal, and redaction status come only from the server response.
9. Ensure proof-pack content is produced through a server-only proof-pack builder module.
10. Ensure internal checker trace is restricted and never appears in public API responses or public exports.
11. Create or update golden hash artifacts using the existing project convention.
12. Run the package validator before repository gates:
    `node validate-v531-cursor-package.mjs <package-root>`

## Required Repository Gates
Run actual repository commands or the closest existing equivalents:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run guard:root-only`
- pro-form tests
- pro-runtime tests
- formula leak guard
- non-English visible text guard
- no-client-formula-execution guard
- secret-safe check

## Required Final Report
Return exactly this structure after real command execution:

```text
V5_3_1_FORMULA_FORM_INTEGRATION_RESULT=PASS_OR_FAIL

RESULT:
- PASS or FAIL

CHANGED_FILES:
- list changed files

INTEGRATED_SCHEMA_COUNT:
- 135

SCHEMA_PACKAGE_VALIDATION:
- package validator:
- strict top-level keys:
- English-only visible text:
- public formula expression leak:
- canonical RedactionStatus:

VALIDATION:
- RedactionStatus single source of truth:
- ExecuteResponse/AuditSeal redaction_status consistency:
- state machine bound to UniversalIndustrialDecisionForm:
- schema validation:
- strict top-level key result:
- unknown key rejection:
- English-only visible text:
- brand safety:
- formula leak:
- no runtime LLM:
- no client formula execution:
- approved schema fetch:
- private formula registry boundary:

TESTS:
- typecheck:
- lint:
- unit tests:
- golden tests:
- golden hash storage:
- build:
- root-only route guard:
- formula leak guard:
- non-English guard:
- secret-safe check:

PUBLIC_SAFETY:
- exact formula exposure: YES/NO
- internal checker trace exposed: YES/NO
- restricted standard table reproduction: YES/NO
- certification claim: YES/NO
- third-party brand mention: YES/NO
- /en route created: YES/NO
- locale prefix route created: YES/NO

AUDIT:
- audit seal contract present: YES/NO
- proof pack builder implemented: YES/NO
- proof pack redaction present: YES/NO
- internal checker trace restricted: YES/NO
- deterministic server execution present: YES/NO
- uncertainty model present: YES/NO
- FMEA trigger present: YES/NO
- business impact present: YES/NO

GIT:
- branch:
- commit hash:
- push status:

BLOCKERS:
- only real blockers with file path and reason
- if none, write NONE
```

## PASS Rule
Do not return PASS unless every required verification command actually ran and passed. If a script does not exist, report `SCRIPT_MISSING`; do not silently replace it with a claim.
