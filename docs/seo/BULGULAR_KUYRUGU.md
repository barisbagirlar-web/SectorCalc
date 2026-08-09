# SectorCalc SEO Findings Queue

- [P0][security] Issue #260 — exposed Paddle server credentials require provider-level rotation before AIP-13 is clear.
- [P0][mandate-compat] V6 deployment enum lacks Firebase Hosting although SectorCalc uses Firebase Hosting.
- [P0][mandate-compat] V6 JSON monetary integer rule conflicts with SectorCalc repository JSON money-string contract.
- [P0][mandate-compat] V6 Draft-07 config schema conflicts with SectorCalc Draft 2020-12 schema contract.
- [P0][mandate-compat] V6 X.6 references `docs/seo/PROGRESS.md` but X.2 omits it from the allowed manifest.
- [P0][seo] robots.txt specific Googlebot/Bingbot allow groups can bypass wildcard private-path disallows under standard group matching semantics.
- [P0][seo] public URL universe is not fully governed by the current SEO registry; category/showcase surfaces exceed registry calculator inventory.
- [P1][seo] indexable locale/category surfaces include empty or mixed-language content and require fail-closed publication gating.

This file is a findings queue, not an execution list. Each item is handled only inside its owning V6 phase branch/PR; higher-priority security exceptions follow the AIP precedence rules.
