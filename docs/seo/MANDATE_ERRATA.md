# SEO MASTER MANDATE V6 — SectorCalc Errata

## E-SC-01 — Firebase Hosting deployment target

[Kesin] SectorCalc production hosting is Firebase Hosting. The generic V6 `deployment.target` enum does not include Firebase Hosting.

Permanent resolution for the SectorCalc profile: add `firebase_hosting` as an allowed deployment target when the V6 config layer is installed. This narrows configuration to the actual runtime and does not weaken redirect/header controls.

## E-SC-02 — Monetary representation boundary

[Kesin] SectorCalc repository policy requires monetary amounts persisted in JSON to be decimal strings and forbids JavaScript `Number` for money. V6 requires integer minor units in JSON.

Permanent resolution for the SectorCalc profile: computational and decision logic must use integer minor units or Decimal.js internally, but persisted SectorCalc JSON monetary fields remain canonical decimal strings. Serialization/deserialization must be lossless and conformance tests must reject floating-point numbers. This preserves V6's no-float objective while respecting the repository's stronger money boundary.

## E-SC-03 — JSON Schema dialect

[Kesin] SectorCalc repository policy permits JSON Schema Draft 2020-12 only. V6 example schema is Draft-07.

Permanent resolution for the SectorCalc profile: port the V6 config schema semantics to Draft 2020-12 without weakening required fields, enums or validation constraints.

## E-SC-04 — Secret guard log disclosure

[Kesin] The historical Paddle production guard used line-producing `git grep`, so a future secret violation could copy the secret into CI logs.

Permanent resolution: secret scans return only detector class and/or filename; matched values must never be printed. Negative tests must assert non-disclosure.

## E-SC-05 — Provider credential exposure

[Kesin] A historical public PR description exposed live Paddle server credentials. Visible text was redacted on 2026-08-09, but provider rotation remains mandatory under AIP-13. Tracking: issue #260.
