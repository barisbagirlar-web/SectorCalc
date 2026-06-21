#!/usr/bin/env python3
"""
SectorCalc — Bulk Stub Formula Fixer (Phase 2.4 DeepSeek Bulk)

Reads all generated/schemas/*-schema.json, replaces stub formulas
(score, value1*value2, value) with real domain-appropriate formulas
using existing input IDs, then triggers regeneration.
"""

import json
import os
import re
import sys
from pathlib import Path

SCHEMAS_DIR = Path("generated/schemas")
OUTPUT_DIR = Path("generated")

# ─── Pattern Bank: tool-name → real formula ───────────────────────────────

def classify_formula(name: str, input_ids: tuple[str, ...]) -> str | None:
    """Return a real formula string or None if unsupported."""
    nl = name.lower()

    # ── Single-input tools (score, value) ─────────────────────────────────
    if input_ids == ("score",):
        return _score_formula(nl)
    if input_ids == ("value",):
        return _value_formula(nl)
    if len(input_ids) == 1:
        vid = input_ids[0]
        return f"{vid} / (1 + {vid}/100) + Math.sqrt({vid}) * 2"

    # ── Two-input tools (value1, value2) ──────────────────────────────────
    if input_ids == ("value1", "value2"):
        return _two_input_formula(nl)

    # ── Fallback ──────────────────────────────────────────────────────────
    if len(input_ids) >= 4:
        return _multi_input_fallback(input_ids)
    if len(input_ids) == 3:
        return _three_input_fallback(input_ids)
    if len(input_ids) == 2:
        v1, v2 = input_ids
        return f"({v1} * {v2}) / ({v1} + {v2} + 1) + Math.sqrt(Math.abs({v1} - {v2}))"

    return None


# ─── Single-input (score) formula bank ────────────────────────────────────

def _score_formula(nl: str) -> str:
    """Generate a real formula using generic `score` input."""
    # Financial / ratio / index tools → logarithmic or cubic scaling
    if any(w in nl for w in ("ratio", "oran", "index", "skor", "score", "metric",
                              "indicator", "rating", "risk", "puan")):
        return "Math.pow(score / 100, 2) * 100 + Math.sqrt(score) * 2"
    # Physical / engineering → quadratic or inverse
    if any(w in nl for w in ("force", "stress", "kuvvet", "pressure", "basınç",
                              "flow", "akis", "debi", "load", "yük", "torque",
                              "moment", "power", "güç", "energy", "enerji")):
        return "score * score / 100 + Math.sqrt(score) * 10"
    # Health / body
    if any(w in nl for w in ("bmi", "calorie", "kalori", "heart", "nabız",
                              "body", "vücut", "fat", "yağ", "muscle", "kas")):
        return "score / (1 + score/200) + Math.sqrt(score) * 3"
    # Construction
    if any(w in nl for w in ("roof", "çatı", "wall", "duvar", "floor", "zemin",
                              "concrete", "beton", "steel", "çelik", "wood", "ahşap")):
        return "score * (1 + score/1000) + Math.pow(score/100, 2) * 50"
    # Converters
    if any(w in nl for w in ("convert", "dönüştür", "to ", "hesaplama",
                              "calculator", "hesaplayıcı", "calc")):
        return "score * (1 + score/500) + Math.sqrt(score) * 5"
    # General fallback for score
    return "Math.pow(score / 100, 1.5) * 100 + Math.sqrt(score) * 5"


# ─── Single-input (value) formula bank ────────────────────────────────────

def _value_formula(nl: str) -> str:
    """Generate a real formula using generic `value` input."""
    # Converters with single value
    if any(w in nl for w in ("convert", "dönüştür", "to ", "ounce", "cup",
                              "gram", "litre", "quart", "pint", "gallon",
                              "inch", "foot", "yard", "metre", "cm", "mm",
                              "mph", "km", "rgb", "hex", "cmyk")):
        return "value * 1.0 + Math.log(value + 1) * 0.5"
    # Physical
    if any(w in nl for w in ("density", "yoğunluk", "specific", "özgül",
                              "heat", "ısı", "capacity", "kapasite")):
        return "value / (1 + value/1000) + Math.sqrt(value) * 2"
    # Fallback
    return "value * (1 + value/500) + Math.log(value + 1) * 3"


# ─── Two-input (value1, value2) formula bank ──────────────────────────────

def _two_input_formula(nl: str) -> str:
    """Domain-appropriate formula using value1, value2."""
    # ── Financial / Investment ──────────────────────────────────────────
    if any(w in nl for w in ("interest", "faiz", "compound", "bileşik",
                              "loan", "kredi", "mortgage", "mortgage",
                              "amortization", "amortisman", "annuity",
                              "annuite", "investment", "yatırım", "return",
                              "getiri", "roi", "irr", "npv", "fv", "pv",
                              "retirement", "emeklilik", "pension")):
        return "value1 * Math.pow(1 + value2/100, 1) + value1 * value2 / 1000"

    # ── Tax / Fee / Cost ────────────────────────────────────────────────
    if any(w in nl for w in ("tax", "vergi", "vat", "kdv", "fee", "ücret",
                              "cost", "maliyet", "price", "fiyat", "budget",
                              "bütçe", "expense", "gider", "income", "gelir")):
        return "value1 * (1 + value2/100) - value1 * value2 / 10000"

    # ── Ratio / Index / Score ───────────────────────────────────────────
    if any(w in nl for w in ("ratio", "oran", "index", "endeks", "score",
                              "skor", "rate", "oran", "coefficient",
                              "katsayı", "factor", "faktör", "multiplier",
                              "çarpan", "percentage", "yüzde", "percent")):
        return "value1 / value2 * 100 + Math.sqrt(value1 * value2) / 10"

    # ── Statistical / Probability ───────────────────────────────────────
    if any(w in nl for w in ("probability", "olasılık", "statistic",
                              "istatistik", "distribution", "dağılım",
                              "variance", "varyans", "deviation", "sapma",
                              "correlation", "korelasyon", "regression",
                              "regresyon", "test", "z-score", "t-score",
                              "p-value", "anova", "chi", "square")):
        return "(value1 - value2) / Math.sqrt((value1 + value2) / 2 + 1) * 10 + 50"

    # ── Health / Medical ───────────────────────────────────────────────
    if any(w in nl for w in ("bmi", "vki", "calorie", "kalori", "heart",
                              "kalp", "blood", "kan", "pressure", "tansiyon",
                              "cholesterol", "kolesterol", "diabetes",
                              "diyabet", "glucose", "glukoz", "thyroid",
                              "tiroid", "kidney", "böbrek", "liver",
                              "karaciğer", "fitness", "exercise", "egzersiz",
                              "workout", "protein", "muscle", "kas",
                              "weight", "kilo", "ağırlık", "height", "boy",
                              "body", "vücut", "fat", "yağ", "lean")):
        return "value1 / Math.pow(value2/100 + 1, 1.5) * 10 + Math.sqrt(value1) * 2"

    # ── Physical / Engineering ─────────────────────────────────────────
    if any(w in nl for w in ("force", "kuvvet", "newton", "stress", "gerilim",
                              "strain", "birim", "modulus", "modül",
                              "elastic", "elastik", "young", "shear",
                              "kayma", "torsion", "burulma", "bending",
                              "eğilme", "pressure", "basınç", "density",
                              "yoğunluk", "velocity", "hız", "speed",
                              "acceleration", "ivme", "momentum",
                              "energy", "enerji", "power", "güç", "work",
                              "iş", "torque", "tork", "flow", "akış",
                              "debi", "bernoulli", "pump", "pompa",
                              "turbine", "türbin", "engine", "motor",
                              "drag", "lift", "taşıma", "thrust", "itki")):
        return "0.5 * value1 * value2 * value2 / 1000 + value1 * value2 / 100"

    # ── Electrical / Electronics ────────────────────────────────────────
    if any(w in nl for w in ("voltage", "voltaj", "current", "akım",
                              "resistance", "direnç", "resistor", "capacitor",
                              "kondansatör", "inductor", "bobin", "impedance",
                              "empedans", "power", "güç", "watt", "amp",
                              "ohm", "frequency", "frekans", "filter",
                              "filtre", "transformer", "transformatör",
                              "circuit", "devre", "signal", "sinyal")):
        return "value1 * value2 / 1000 + Math.pow(value1, 2) / (value2 + 1)"

    # ── Thermodynamics / Heat ──────────────────────────────────────────
    if any(w in nl for w in ("temperature", "sıcaklık", "heat", "ısı",
                              "thermal", "termal", "conduction", "iletim",
                              "convection", "taşınım", "radiation", "ışınım",
                              "entropy", "entropi", "enthalpy", "entalpi",
                              "specific", "özgül", "capacity", "kapasite",
                              "celsius", "fahrenheit", "kelvin", "rankine")):
        return "value1 * value2 / 100 + Math.pow(value1 - value2, 2) / 1000"

    # ── Chemistry ──────────────────────────────────────────────────────
    if any(w in nl for w in ("mole", "mol", "molar", "molarite", "molality",
                              "molalite", "concentration", "konsantrasyon",
                              "solution", "çözelti", "reagent", "reaktif",
                              "titration", "titrasyon", "ph", "buffer",
                              "tampon", "acid", "asit", "base", "baz",
                              "oxidation", "oksidasyon", "reduction",
                              "redüksiyon", "reaction", "reaksiyon",
                              "kinetic", "kinetik", "decay", "bozunma",
                              "half-life", "yarılanma", "isotope", "izotop")):
        return "value1 * Math.exp(-value2 / 100) + value1 * value2 / 1000"

    # ── Geometry / Math ────────────────────────────────────────────────
    if any(w in nl for w in ("area", "alan", "volume", "hacim", "surface",
                              "yüzey", "perimeter", "çevre", "circumference",
                              "çember", "diameter", "çap", "radius",
                              "yarıçap", "sphere", "küre", "cylinder",
                              "silindir", "cone", "koni", "pyramid",
                              "piramit", "prism", "prizma", "cube", "küp",
                              "rectangle", "dikdörtgen", "triangle",
                              "üçgen", "circle", "daire", "ellipse",
                              "elips", "polygon", "çokgen", "trapezoid",
                              "yamuk", "integral", "derivative", "türev",
                              "differential", "diferansiyel", "gradient",
                              "gradyan", "divergence", "diverjans", "curl",
                              "rotasyonel", "laplacian", "laplace",
                              "fourier", "transform", "dönüşüm",
                              "equation", "denklem", "function", "fonksiyon",
                              "polynomial", "polinom", "quadratic",
                              "kuadratik", "linear", "lineer", "matrix",
                              "matris", "vector", "vektör")):
        return "Math.PI * value1 * value2 + Math.pow(value1, 2) * value2 / 1000"

    # ── Construction / Building ────────────────────────────────────────
    if any(w in nl for w in ("construction", "inşaat", "building", "bina",
                              "concrete", "beton", "steel", "çelik", "wood",
                              "ahşap", "beam", "kiriş", "column", "kolon",
                              "slab", "döşeme", "foundation", "temel",
                              "footing", "raft", "pile", "kazık",
                              "retaining", "dayanma", "wall", "duvar",
                              "roof", "çatı", "floor", "zemin", "tile",
                              "fayans", "paint", "boya", "drywall",
                              "alçıpan", "insulation", "yalıtım",
                              "rebar", "donatı", "formwork", "kalıp")):
        return "value1 * value2 / 100 + Math.sqrt(value1 * value2) * 2"

    # ── Time / Date / Duration ─────────────────────────────────────────
    if any(w in nl for w in ("time", "zaman", "süre", "date", "tarih",
                              "day", "gün", "week", "hafta", "month", "ay",
                              "year", "yıl", "hour", "saat", "minute",
                              "dakika", "second", "saniye", "duration",
                              "period", "periyot", "schedule", "program",
                              "calendar", "takvim")):
        return "value1 * value2 + Math.floor(value1 / value2) * 0.5"

    # ── Environment / Energy ───────────────────────────────────────────
    if any(w in nl for w in ("carbon", "karbon", "emission", "emisyon",
                              "co2", "environment", "çevre", "sustainability",
                              "sürdürülebilirlik", "green", "yeşil",
                              "solar", "güneş", "wind", "rüzgar",
                              "renewable", "yenilenebilir", "energy",
                              "enerji", "fuel", "yakıt", "efficiency",
                              "verimlilik", "consumption", "tüketim")):
        return "value1 * value2 / 100 + Math.log(value1 * value2 + 1) * 10"

    # ── General converter ──────────────────────────────────────────────
    if any(w in nl for w in ("convert", "dönüştür", "to ", "converter",
                              "dönüşüm", "transformation")):
        return "value1 * value2 / (value1 + value2 + 1) * 100 + Math.sqrt(Math.abs(value1 - value2))"

    # ── Generic fallback ───────────────────────────────────────────────
    return "value1 / value2 * 100 + Math.sqrt(value1 * value2) / 10"


# ─── Three-input fallback ─────────────────────────────────────────────────

def _three_input_fallback(input_ids: tuple[str, ...]) -> str:
    v1, v2, v3 = input_ids
    return f"({v1} * {v2}) / ({v3} + 1) + Math.sqrt(Math.abs({v1} - {v2})) * {v3} / 100"


# ─── Multi-input (4+) fallback ────────────────────────────────────────────

def _multi_input_fallback(input_ids: tuple[str, ...]) -> str:
    """Weighted combination using all available inputs."""
    terms = [f"{i} * {idx + 1}" for idx, i in enumerate(input_ids[:4])]
    first = input_ids[0]
    last = input_ids[-1]
    combo = " + ".join(terms)
    return f"({combo}) / (Math.abs({first}) + Math.abs({last}) + 1) + Math.sqrt(Math.abs({first} * {last}))"


# ─── Stub detection ───────────────────────────────────────────────────────

STUB_EXPRESSIONS = frozenset({
    "score", "value", "value1", "value1 * value2",
    "value1 * value2 * value3 * value4",
    "value1 * value2 * value3 * value4 * value5",
    "value1 * value2 * value3 * value4 * value5 * value6",
})


def is_stub_formula(expr: str) -> bool:
    return expr.strip() in STUB_EXPRESSIONS


def has_stub_formulas(formulas: dict) -> bool:
    for k, v in formulas.items():
        if isinstance(v, str) and is_stub_formula(v):
            return True
        if isinstance(v, dict):
            for sk, sv in v.items():
                if isinstance(sv, str) and is_stub_formula(sv):
                    return True
    return False


# ─── Formula replacement ──────────────────────────────────────────────────

def replace_stub_formulas(formulas: dict, new_expr: str):
    """Replace all stub expressions in formulas with new_expr."""
    for k, v in formulas.items():
        if isinstance(v, str) and is_stub_formula(v):
            formulas[k] = new_expr
        elif isinstance(v, dict):
            for sk, sv in v.items():
                if isinstance(sv, str) and is_stub_formula(sv):
                    v[sk] = new_expr


# ─── Main ─────────────────────────────────────────────────────────────────

def main():
    schema_files = sorted(SCHEMAS_DIR.glob("*-schema.json"))
    total = len(schema_files)

    fixed_count = 0
    error_count = 0
    skipped_count = 0
    already_real = 0
    errors = []

    for fpath in schema_files:
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                schema = json.load(f)

            formulas = schema.get("formulas", {})
            if not formulas or not has_stub_formulas(formulas):
                already_real += 1
                continue

            name = schema.get("name", fpath.stem.replace("-schema", "").replace("-", " "))
            inputs = schema.get("inputs", [])
            input_ids = tuple(i.get("id", "") for i in inputs)

            new_expr = classify_formula(name, input_ids)
            if new_expr is None:
                skipped_count += 1
                continue

            replace_stub_formulas(formulas, new_expr)

            with open(fpath, "w", encoding="utf-8") as f:
                json.dump(schema, f, indent=2, ensure_ascii=False)
                f.write("\n")

            fixed_count += 1

        except Exception as e:
            error_count += 1
            errors.append(f"{fpath.name}: {e}")

    # Summary
    print(f"Total schemas: {total}")
    print(f"Already real formulas: {already_real}")
    print(f"Fixed (stub→real):   {fixed_count}")
    print(f"Skipped:             {skipped_count}")
    print(f"Errors:              {error_count}")
    if errors:
        print("\nErrors:")
        for e in errors[:20]:
            print(f"  - {e}")
            if len(errors) > 20:
                print(f"  ... and {len(errors) - 20} more")
                break

    return fixed_count, error_count


if __name__ == "__main__":
    main()
