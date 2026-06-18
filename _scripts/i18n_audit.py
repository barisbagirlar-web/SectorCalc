#!/usr/bin/env python3
"""SectorCalc i18n quality scanner — comprehensive locale audit."""

import json
import os
import sys
from collections import OrderedDict

BASE = os.path.join(os.path.dirname(__file__), "..", "messages")
LOCALES = ["en.json", "tr.json", "de.json", "fr.json", "es.json", "ar.json"]
LOCALE_NAMES = {"en.json": "EN", "tr.json": "TR", "de.json": "DE", "fr.json": "FR", "es.json": "ES", "ar.json": "AR"}


def flatten(d, parent_key="", sep="."):
    """Recursively flatten nested dict to dot-notation keys."""
    items = []
    if isinstance(d, dict):
        for k, v in d.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v, dict):
                items.extend(flatten(v, new_key, sep=sep).items())
            else:
                items.append((new_key, v))
    elif isinstance(d, list):
        for i, v in enumerate(d):
            new_key = f"{parent_key}{sep}[{i}]" if parent_key else f"[{i}]"
            if isinstance(v, (dict, list)):
                items.extend(flatten(v, new_key, sep=sep).items())
            else:
                items.append((new_key, v))
    else:
        items.append((parent_key, d))
    return OrderedDict(items)


def load_locale(name):
    path = os.path.join(BASE, name)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    # Load all locales
    raw = {}
    for l in LOCALES:
        raw[l] = load_locale(l)

    en = raw["en.json"]
    en_flat = flatten(en)
    en_keys = set(en_flat.keys())

    print("=" * 78)
    print("SECTORCALC i18n QUALITY SCAN REPORT")
    print("=" * 78)

    # ---- 1. Missing keys per locale ----
    print("\n## 1. MISSING KEYS (vs en.json)\n")

    all_missing = {}
    for l in LOCALES[1:]:
        loc_flat = flatten(raw[l])
        loc_keys = set(loc_flat.keys())
        missing = en_keys - loc_keys
        all_missing[l] = sorted(missing)

    for l in LOCALES[1:]:
        missing = all_missing[l]
        name = LOCALE_NAMES[l]
        print(f"\n--- {name} ({l}) — {len(missing)} missing keys ---")
        if not missing:
            print("  (none)")
        else:
            # Show by namespace
            ns_map = {}
            for k in missing:
                ns = k.split(".")[0]
                ns_map.setdefault(ns, []).append(k)
            for ns in sorted(ns_map.keys()):
                keys = ns_map[ns]
                print(f"  [{ns}] ({len(keys)} keys)")
                for k in keys[:10]:
                    en_val = en_flat.get(k, "")
                    en_preview = str(en_val)[:80].replace("\n", "\\n")
                    print(f"    · {k}  →  EN: \"{en_preview}\"")
                if len(keys) > 10:
                    print(f"    ... and {len(keys) - 10} more")

    # ---- 2. Completeness percentages ----
    print("\n\n## 2. COMPLETENESS vs en.json\n")
    total_en = len(en_keys)
    print(f"  EN total keys (flattened): {total_en}")
    for l in LOCALES:
        loc_flat = flatten(raw[l])
        loc_keys = set(loc_flat.keys())
        en_only = en_keys - loc_keys
        loc_only = loc_keys - en_keys
        common = len(en_keys & loc_keys)
        pct = round(common / total_en * 100, 2) if total_en else 0
        name = LOCALE_NAMES[l]
        status = "BASELINE" if l == "en.json" else ""
        print(f"  {name:4s} ({l}): {pct:6.2f}%  —  {common}/{total_en} keys  {status}")
        if loc_only:
            print(f"       Extra keys not in EN: {len(loc_only)}  (first 10: {list(loc_only)[:10]})")

    # ---- 3. Untranslated values (non-EN text == EN text, > 2 words) ----
    print("\n\n## 3. SUSPECTED UNTRANSLATED VALUES (>2 words, identical to EN)\n")
    untranslated_found = False
    for l in LOCALES[1:]:
        loc_flat = flatten(raw[l])
        name = LOCALE_NAMES[l]
        suspects = []
        for k, en_val in en_flat.items():
            if k not in loc_flat:
                continue
            loc_val = loc_flat[k]
            if not isinstance(en_val, str) or not isinstance(loc_val, str):
                continue
            if en_val == loc_val:
                word_count = len(en_val.split())
                if word_count > 2:
                    suspects.append((k, en_val))
        if suspects:
            untranslated_found = True
            print(f"\n--- {name} ({l}) — {len(suspects)} potential untranslated values ---")
            for k, val in suspects[:30]:
                preview = str(val)[:100].replace("\n", "\\n")
                print(f"  · {k}  →  \"{preview}\"")
            if len(suspects) > 30:
                print(f"  ... and {len(suspects) - 30} more")
    if not untranslated_found:
        print("  (none found)")

    # ---- 4. Empty string values ----
    print("\n\n## 4. EMPTY STRING VALUES\n")
    empty_found = False
    for l in LOCALES:
        loc_flat = flatten(raw[l])
        name = LOCALE_NAMES[l]
        empties = [k for k, v in loc_flat.items() if isinstance(v, str) and v.strip() == ""]
        if empties:
            empty_found = True
            print(f"  {name} ({l}): {len(empties)} empty strings")
            for k in empties[:15]:
                print(f"    · {k}")
            if len(empties) > 15:
                print(f"    ... and {len(empties) - 15} more")
    if not empty_found:
        print("  (none found)")

    # ---- 5. Structural differences (top-level namespace check) ----
    print("\n\n## 5. STRUCTURAL DIFFERENCES (top-level namespaces)\n")
    en_top = set(en.keys())
    for l in LOCALES:
        loc_top = set(raw[l].keys())
        name = LOCALE_NAMES[l]
        missing_ns = en_top - loc_top
        extra_ns = loc_top - en_top
        if missing_ns:
            print(f"  {name}: MISSING top-level namespaces → {sorted(missing_ns)}")
        if extra_ns:
            print(f"  {name}: EXTRA top-level namespaces → {sorted(extra_ns)}")
        if not missing_ns and not extra_ns:
            print(f"  {name}: namespaces match EN (✓)")

    # ---- Deep structural diff: type mismatches ----
    print("\n\n## 5b. TYPE / STRUCTURE MISMATCHES (nested sub-keys)\n")
    type_mismatches = 0
    for l in LOCALES[1:]:
        loc_flat = flatten(raw[l])
        loc_keys = set(loc_flat.keys())
        name = LOCALE_NAMES[l]
        mismatches = []
        for k in en_flat:
            en_val = en_flat[k]
            if k in loc_flat:
                loc_val = loc_flat[k]
                if type(en_val) != type(loc_val):
                    mismatches.append((k, type(en_val).__name__, type(loc_val).__name__))
        if mismatches:
            type_mismatches += len(mismatches)
            print(f"  {name} ({l}): {len(mismatches)} type mismatches")
            for k, t_en, t_loc in mismatches[:10]:
                print(f"    · {k}: en={t_en}, {l}={t_loc}")
            if len(mismatches) > 10:
                print(f"    ... and {len(mismatches) - 10} more")
    if not type_mismatches:
        print("  ✓ All type-structures match EN baseline.")

    # ---- 6. Key naming violations ----
    print("\n\n## 6. KEY NAMING VIOLATIONS (spaces/special chars in keys)\n")
    violations = {}
    for l in LOCALES:
        loc_flat = flatten(raw[l])
        name = LOCALE_NAMES[l]
        bad = []
        for k in loc_flat:
            if " " in k:
                bad.append((k, "contains space"))
            if any(c in k for c in "!@#$%^&*()+=[]{}|;':\",/<>?~`"):
                bad.append((k, "contains special char"))
            if k != k.strip():
                bad.append((k, "has leading/trailing whitespace"))
        if bad:
            violations[l] = bad
            print(f"  {name} ({l}): {len(bad)} violations")
            for k, reason in bad[:10]:
                print(f"    · {k}  ({reason})")
            if len(bad) > 10:
                print(f"    ... and {len(bad) - 10} more")
    if not violations:
        print("  ✓ All keys clean.")

    # ---- Summary ----
    print("\n\n" + "=" * 78)
    print("SUMMARY")
    print("=" * 78)
    for l in LOCALES[1:]:
        name = LOCALE_NAMES[l]
        missing = all_missing[l]
        pct = round((total_en - len(missing)) / total_en * 100, 2) if total_en else 0
        print(f"  {name:4s}: {pct:6.2f}%  |  {len(missing)} missing  |  {len([x for x in flatten(raw[l]).values() if isinstance(x, str) and x == en_flat.get([k for k in flatten(raw[l]).keys() if k in en_flat][0] if any(True for _ in [1]) else '', '')])} untranslated")

    # Count untranslated per locale properly for summary
    print()
    for l in LOCALES[1:]:
        loc_flat = flatten(raw[l])
        name = LOCALE_NAMES[l]
        suspects = sum(1 for k, ev in en_flat.items()
                       if k in loc_flat and isinstance(ev, str) and isinstance(loc_flat[k], str)
                       and ev == loc_flat[k] and len(ev.split()) > 2)
        print(f"  {name:4s}: {suspects} untranslated (>2 words)")

    print(f"\n  Total keys in EN: {total_en}")


if __name__ == "__main__":
    main()
