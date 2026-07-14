"""Verified interval models for Free tools that require transcendental arithmetic."""

from __future__ import annotations

import re
from typing import Any, Callable, Dict, List, Tuple

import mpmath as mp
from mpmath import iv

from interval_engine import interval_bounds_payload

ARITHMETIC_MODE = "MPMATH_IV_OUTWARD_EXACT_BOUNDS"
_DECIMAL_PATTERN = re.compile(r"^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$", re.IGNORECASE)


class FreeIntervalDomainError(ValueError):
    def __init__(self, field: str, message: str):
        self.field = field
        super().__init__(f"{field}: {message}")


def _endpoint(interval: Any, upper: bool = False) -> mp.mpf:
    return mp.mpf(interval.b if upper else interval.a)


def _scalar(
    raw_inputs: Dict[str, Any],
    normalized: Dict[str, str],
    field: str,
    constraint: str,
) -> Any:
    raw = raw_inputs.get(field)
    if isinstance(raw, bool) or not isinstance(raw, (str, int)):
        raise FreeIntervalDomainError(field, "must be supplied as an exact decimal string or integer")
    canonical = str(raw).strip()
    if not _DECIMAL_PATTERN.fullmatch(canonical):
        raise FreeIntervalDomainError(field, "is not a canonical finite decimal")
    try:
        value = iv.mpf(canonical)
    except (TypeError, ValueError) as exc:
        raise FreeIntervalDomainError(field, "cannot be represented by the interval engine") from exc
    lower, upper = _endpoint(value), _endpoint(value, True)
    if constraint == "POSITIVE" and lower <= 0:
        raise FreeIntervalDomainError(field, "must be greater than zero")
    if constraint == "NON_NEGATIVE" and lower < 0:
        raise FreeIntervalDomainError(field, "must be non-negative")
    if constraint == "PERCENT" and (lower < 0 or upper > 100):
        raise FreeIntervalDomainError(field, "must be within [0, 100]")
    if constraint == "POSITIVE_INTEGER" and (lower <= 0 or lower != upper or mp.floor(lower) != lower):
        raise FreeIntervalDomainError(field, "must be a positive integer")
    normalized[field] = canonical
    return value


def _output(output_id: str, value: Any, unit: str, role: str) -> Dict[str, Any]:
    return {
        "id": output_id,
        "unit": unit,
        "role": role,
        **interval_bounds_payload(value, mp.mpf("1e-40")),
    }


def _response(tool_key: str, status: str, outputs: List[Dict[str, Any]], normalized: Dict[str, str], warnings: List[str]) -> Dict[str, Any]:
    return {
        "tool_key": tool_key,
        "arithmetic_mode": ARITHMETIC_MODE,
        "interval_precision_digits": iv.dps,
        "status": status,
        "outputs": outputs,
        "normalized_inputs": normalized,
        "warnings": warnings,
    }


def _cutting_speed(raw: Dict[str, Any]) -> Dict[str, Any]:
    n: Dict[str, str] = {}
    speed = _scalar(raw, n, "cutting_speed_m_min", "POSITIVE")
    diameter = _scalar(raw, n, "tool_diameter_mm", "POSITIVE")
    teeth = _scalar(raw, n, "number_of_teeth", "POSITIVE_INTEGER")
    feed_per_tooth = _scalar(raw, n, "feed_per_tooth_mm", "NON_NEGATIVE")
    chip_limit = _scalar(raw, n, "max_chip_load_mm", "POSITIVE")
    rpm = iv.mpf("1000") * speed / (iv.pi * diameter)
    feed_rate = rpm * teeth * feed_per_tooth
    utilization = feed_per_tooth / chip_limit
    review = _endpoint(utilization, True) > mp.mpf("0.85")
    warnings = ["Chip-load utilization exceeds 85%; verify tool and material evidence."] if review else []
    return _response("cutting-speed-feed-rpm", "REVIEW" if review else "OK", [
        _output("spindle_speed_rpm", rpm, "rev/min", "PRIMARY_DECISION"),
        _output("feed_rate_mm_min", feed_rate, "mm/min", "SECONDARY_METRIC"),
        _output("chip_load_utilization", utilization, "ratio", "BUSINESS_IMPACT"),
    ], n, warnings)


def _fillet_weld(raw: Dict[str, Any]) -> Dict[str, Any]:
    n: Dict[str, str] = {}
    leg = _scalar(raw, n, "fillet_leg_size_mm", "POSITIVE")
    length = _scalar(raw, n, "effective_weld_length_mm", "POSITIVE")
    allowable = _scalar(raw, n, "user_verified_allowable_stress_mpa", "POSITIVE")
    load = _scalar(raw, n, "applied_load_kn", "NON_NEGATIVE")
    angle_factor = _scalar(raw, n, "load_angle_factor", "POSITIVE")
    throat = iv.sqrt(iv.mpf("0.5")) * leg
    capacity = throat * length * allowable / (iv.mpf("1000") * angle_factor)
    utilization = load / capacity
    upper = _endpoint(utilization, True)
    status = "HOLD" if upper > 1 else "REVIEW" if upper >= mp.mpf("0.85") else "OK"
    warnings = [] if status == "OK" else ["Fillet-weld screening utilization is at or above 85%; connection proof is required."]
    return _response("fillet-weld-size-strength", status, [
        _output("effective_throat_mm", throat, "mm", "SECONDARY_METRIC"),
        _output("screening_capacity_kn", capacity, "kN", "BUSINESS_IMPACT"),
        _output("fillet_utilization", utilization, "ratio", "PRIMARY_DECISION"),
    ], n, warnings)


def _knurl_drill(raw: Dict[str, Any]) -> Dict[str, Any]:
    n: Dict[str, str] = {}
    drill = _scalar(raw, n, "drill_diameter_mm", "POSITIVE")
    angle = _scalar(raw, n, "drill_point_angle_deg", "POSITIVE")
    pitch = _scalar(raw, n, "knurl_pitch_mm", "POSITIVE")
    workpiece = _scalar(raw, n, "workpiece_diameter_mm", "POSITIVE")
    if _endpoint(angle, True) >= 180:
        raise FreeIntervalDomainError("drill_point_angle_deg", "must be below 180 degrees")
    half_angle = angle * iv.pi / iv.mpf("360")
    point_depth = (drill / 2) / iv.tan(half_angle)
    teeth = iv.pi * workpiece / pitch
    teeth_mid = (_endpoint(teeth) + _endpoint(teeth, True)) / 2
    nearest = mp.floor(teeth_mid + mp.mpf("0.5"))
    if _endpoint(teeth) <= nearest - mp.mpf("0.5") or _endpoint(teeth, True) >= nearest + mp.mpf("0.5"):
        raise FreeIntervalDomainError("knurl_pitch_mm", "interval crosses a nearest-tooth rounding boundary")
    deviation = abs(teeth - iv.mpf(str(nearest)))
    review = _endpoint(deviation, True) > mp.mpf("0.2")
    return _response("knurling-drill-point-depth", "REVIEW" if review else "OK", [
        _output("drill_point_depth_mm", point_depth, "mm", "PRIMARY_DECISION"),
        _output("estimated_knurl_teeth_count", teeth, "count", "SECONDARY_METRIC"),
        _output("knurl_pitch_deviation_index", deviation, "ratio", "BUSINESS_IMPACT"),
    ], n, ["Knurl pitch-to-circumference mismatch exceeds 0.2 tooth."] if review else [])


def _sheet_bend(raw: Dict[str, Any]) -> Dict[str, Any]:
    n: Dict[str, str] = {}
    angle = _scalar(raw, n, "bend_angle_deg", "POSITIVE")
    radius = _scalar(raw, n, "inside_radius_mm", "NON_NEGATIVE")
    thickness = _scalar(raw, n, "material_thickness_mm", "POSITIVE")
    k_factor = _scalar(raw, n, "k_factor", "PERCENT")
    flange_a = _scalar(raw, n, "flange_a_mm", "NON_NEGATIVE")
    flange_b = _scalar(raw, n, "flange_b_mm", "NON_NEGATIVE")
    if _endpoint(angle, True) >= 180:
        raise FreeIntervalDomainError("bend_angle_deg", "must be below 180 degrees")
    if _endpoint(k_factor, True) > 1:
        raise FreeIntervalDomainError("k_factor", "must be within [0, 1]")
    radians = angle * iv.pi / iv.mpf("180")
    bend_allowance = radians * (radius + k_factor * thickness)
    setback = iv.tan(radians / 2) * (radius + thickness)
    flat_length = flange_a + flange_b + bend_allowance - 2 * setback
    if _endpoint(flat_length) <= 0:
        raise FreeIntervalDomainError("flange_a_mm", "entered geometry produces a non-positive flat blank length")
    review = _endpoint(k_factor) < mp.mpf("0.25") or _endpoint(k_factor, True) > mp.mpf("0.5")
    return _response("sheet-metal-bend-allowance", "REVIEW" if review else "OK", [
        _output("bend_allowance_mm", bend_allowance, "mm", "PRIMARY_DECISION"),
        _output("outside_setback_mm", setback, "mm", "SECONDARY_METRIC"),
        _output("flat_blank_length_mm", flat_length, "mm", "BUSINESS_IMPACT"),
    ], n, ["K-factor is outside [0.25, 0.50]; verify with a calibrated bend test."] if review else [])


def _tool_life(raw: Dict[str, Any]) -> Dict[str, Any]:
    n: Dict[str, str] = {}
    taylor_c = _scalar(raw, n, "taylor_c", "POSITIVE")
    taylor_n = _scalar(raw, n, "taylor_n", "POSITIVE")
    speed = _scalar(raw, n, "cutting_speed_m_min", "POSITIVE")
    edge_cost = _scalar(raw, n, "edge_cost", "NON_NEGATIVE")
    cycle_seconds = _scalar(raw, n, "cutting_time_seconds_per_part", "POSITIVE")
    change_minutes = _scalar(raw, n, "tool_change_minutes", "NON_NEGATIVE")
    machine_rate = _scalar(raw, n, "machine_hourly_rate", "NON_NEGATIVE")
    tool_life = iv.power(taylor_c / speed, 1 / taylor_n)
    parts_per_edge = tool_life * 60 / cycle_seconds
    if _endpoint(parts_per_edge) <= 0:
        raise FreeIntervalDomainError("parts_per_edge", "must be greater than zero")
    change_cost = (change_minutes / 60) * machine_rate
    cost_per_part = (edge_cost + change_cost) / parts_per_edge
    review = _endpoint(parts_per_edge) < 20
    return _response("tool-life-tool-cost-per-part", "REVIEW" if review else "OK", [
        _output("estimated_tool_life_minutes", tool_life, "min", "SECONDARY_METRIC"),
        _output("parts_per_edge", parts_per_edge, "parts", "SECONDARY_METRIC"),
        _output("tool_cost_per_part", cost_per_part, "currency/part", "PRIMARY_DECISION"),
    ], n, ["Estimated parts per edge is below 20; verify Taylor constants against tool-life history."] if review else [])


_MODELS: Dict[str, Callable[[Dict[str, Any]], Dict[str, Any]]] = {
    "cutting-speed-feed-rpm": _cutting_speed,
    "fillet-weld-size-strength": _fillet_weld,
    "knurling-drill-point-depth": _knurl_drill,
    "sheet-metal-bend-allowance": _sheet_bend,
    "tool-life-tool-cost-per-part": _tool_life,
}


def execute_free_interval_model(tool_key: str, raw_inputs: Dict[str, Any]) -> Dict[str, Any]:
    evaluator = _MODELS.get(tool_key)
    if evaluator is None:
        raise FreeIntervalDomainError("tool_key", "has no certified interval model")
    return evaluator(raw_inputs)


def list_free_interval_models() -> Tuple[str, ...]:
    return tuple(sorted(_MODELS))
