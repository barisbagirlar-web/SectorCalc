"""
SectorCalc — CFO-Approved Symbolic Formula Registry
=====================================================

VERSION: 1.0.0
APPROVAL: Pending CFO sign-off (every formula change requires re-approval)

This file is the SINGLE SOURCE OF TRUTH for all symbolic mathematical models.
No formula shall be modified without:
  1. CFO written approval
  2. Git commit with model version bump
  3. MMS test suite update

Registering a new model:
  Add a function to the registry below. Each function receives
  (I, CF, r, n, RV) as mpmath.iv interval objects and returns an mpmath.iv interval.
  Use SymPy for symbolic reference, but compile to pure interval arithmetic.

Changelog:
  v1.0.0 — Initial continuous discounting NPV model
           Formula: NPV = (CF/r) * (1 - exp(-r*n)) + RV * exp(-r*n) - I
"""

from __future__ import annotations

from typing import Any, Callable, Dict, List, Optional, Tuple

import sympy as sp
import mpmath as mp
from mpmath import iv

# ---------------------------------------------------------------------------
# CFO sign-off metadata
# ---------------------------------------------------------------------------

MODEL_VERSION = "1.0.0"
MODEL_AUTHOR = "SectorCalc Financial Engineering Team"
MODEL_APPROVAL_STATUS = "PENDING_CFO_REVIEW"
MODEL_ASSUMPTIONS = [
    "Continuous compounding (e^{-rt}), not discrete annual",
    "Equal annual cash flows — single CF value for all periods",
    "Terminal residual value discounted at same rate as cash flows",
    "No tax effects, no inflation, no working capital changes",
    "Risk-free rate proxy for discount rate in base model",
]

# ---------------------------------------------------------------------------
# Symbolic reference (for documentation/audit only — NOT used at runtime)
# ---------------------------------------------------------------------------

_I, _CF, _r, _n, _RV = sp.symbols("I CF r n RV", positive=True, real=True)
SYMBOLIC_NPV = (_CF / _r) * (1 - sp.exp(-_r * _n)) + _RV * sp.exp(-_r * _n) - _I

# ---------------------------------------------------------------------------
# Interval-arithmetic model functions
# ---------------------------------------------------------------------------
# Each function receives 5 interval arguments and returns an interval.
# Pure mpmath.iv operations — no SymPy lambdify (incompatible with intervals).


def _npv_iv_model(
    I: mp.ivmpf,
    CF: mp.ivmpf,
    r: mp.ivmpf,
    n: mp.ivmpf,
    RV: mp.ivmpf,
) -> mp.ivmpf:
    """
    NPV with continuous discounting — pure interval arithmetic.

    Formula: NPV = (CF/r) * (1 - exp(-r*n)) + RV * exp(-r*n) - I
    """
    # Guard against r crossing zero
    if r.a <= 0 <= r.b:
        r = iv.mpf([max(r.a, 1e-15), max(r.b, 1e-15)])
    exp_term = iv.exp(-r * n)
    return (CF / r) * (1 - exp_term) + RV * exp_term - I


# ---------------------------------------------------------------------------
# Model registry: name -> callable(I, CF, r, n, RV) -> mp.ivmpf
# ---------------------------------------------------------------------------
# Extend this dict for every new formula. Each entry must be a pure
# interval-arithmetic function (no SymPy lambdify).

MODELS: Dict[str, Callable[..., mp.ivmpf]] = {
    "npv": _npv_iv_model,
}

# ---------------------------------------------------------------------------
# Public accessor
# ---------------------------------------------------------------------------

def get_model(name: str) -> Callable:
    """Get the interval-arithmetic function for the named model.

    Args:
        name: Model key (e.g. "npv").

    Returns:
        Callable(I, CF, r, n, RV) -> mp.ivmpf interval result.
    """
    if name not in MODELS:
        raise KeyError(f"Unknown model '{name}'. Available: {list(MODELS.keys())}")
    return MODELS[name]

# ---------------------------------------------------------------------------
# Registry validation
# ---------------------------------------------------------------------------

def validate_registry() -> List[str]:
    """Validate all models are callable without error.

    Returns:
        List of error messages (empty if all models compile).
    """
    errors: List[str] = []
    for name, func in MODELS.items():
        if not callable(func):
            errors.append(f"Model '{name}' is not callable")
    return errors
