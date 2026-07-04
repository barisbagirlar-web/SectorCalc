# SectorCalc Free V5.3.1 Formula Blueprint Package

This package contains one formula blueprint file and one server-only TypeScript stub for each listed Free calculator.

Integration rules:

1. Treat every formula file as server-only material.
2. Do not copy exact formula details into public schema, public UI, public JSON, PDF, copy summary, browser state, or public HTML.
3. Bind inputs by normalized input IDs, not by display labels.
4. Use UniversalIndustrialDecisionForm V5.3.1 only.
5. Do not create a tool-specific React form.
6. Do not execute formulas in the browser.
7. Do not return OK when a formula module is missing.
8. Do not calculate from schema defaults.
9. Keep route slug, schema tool_key, request toolKey, and metadata toolKey identical.
10. Public tool titles must come from schema.tool_name, never from raw slugs.

The package also includes a Cursor apply prompt that fixes broken slug-like page titles, mixed category labels, form overflow, and V5.3.1 page header binding.
