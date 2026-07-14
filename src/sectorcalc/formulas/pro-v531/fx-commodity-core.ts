import "server-only";
import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";
export const FX_COMMODITY_FORMULA_VERSION = "2.0.0";
export const FX_COMMODITY_SCHEMA_VERSION = "5.3.1-pro-fx-commodity.1";
export const FX_COMMODITY_MODEL_ID = "PRO_HEDGE_ADJUSTED_MULTIPLICATIVE_PASS_THROUGH_V2";
export const FX_COMMODITY_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;
export interface FxCommodityInputs { basePrice: string | number; currentFxRate: string | number; budgetFxRate: string | number; currentCommodityIndex: string | number; budgetCommodityIndex: string | number; materialCostShareRatio: string | number; fxHedgeRatio: string | number; commodityHedgeRatio: string | number; annualVolume: string | number; sourceConfidenceRatio: string | number; }
export interface FxCommodityResult { fxMarketFactor: Decimal; commodityMarketFactor: Decimal; hedgeAdjustedFxFactor: Decimal; hedgeAdjustedCommodityFactor: Decimal; combinedMaterialFactor: Decimal; nonMaterialPriceComponent: Decimal; materialPriceComponent: Decimal; fxPriceImpact: Decimal; commodityAndInteractionPriceImpact: Decimal; totalPriceAdjustment: Decimal; passThroughRatio: Decimal; adjustedPrice: Decimal; annualBaseRevenue: Decimal; annualAdjustedRevenue: Decimal; annualPriceAdjustment: Decimal; sourceConfidenceRatio: Decimal; priceAdjustmentUncertainty: Decimal; adjustedPriceLowerBound: Decimal; adjustedPriceUpperBound: Decimal; annualMoneyAtRisk: Decimal; primaryMarketDriver: 0 | 1; adjustmentDirection: -1 | 0 | 1; decisionState: 0 | 1; }
type Kind = "POSITIVE" | "POSITIVE_INTEGER" | "RATIO";
export function evaluateFxCommodity(inputs: FxCommodityInputs): DomainResult<FxCommodityResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: Kind): DomainResult<Decimal> => { const p = context.decimal(value, field); if (!p.ok) return p;
    if (kind === "POSITIVE" && p.value.lte("0")) return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    if (kind === "POSITIVE_INTEGER" && (p.value.lte("0") || !p.value.round(0, 0).eq(p.value))) return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer count.` });
    if (kind === "RATIO" && (p.value.lt("0") || p.value.gt("1"))) return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` }); return p; };
  const base = read(inputs.basePrice, "base_price", "POSITIVE"); if (!base.ok) return base;
  const currentFx = read(inputs.currentFxRate, "current_fx_rate", "POSITIVE"); if (!currentFx.ok) return currentFx;
  const budgetFx = read(inputs.budgetFxRate, "budget_fx_rate", "POSITIVE"); if (!budgetFx.ok) return budgetFx;
  const currentCommodity = read(inputs.currentCommodityIndex, "current_commodity_index", "POSITIVE"); if (!currentCommodity.ok) return currentCommodity;
  const budgetCommodity = read(inputs.budgetCommodityIndex, "budget_commodity_index", "POSITIVE"); if (!budgetCommodity.ok) return budgetCommodity;
  const share = read(inputs.materialCostShareRatio, "material_cost_share_ratio", "RATIO"); if (!share.ok) return share;
  const fxHedge = read(inputs.fxHedgeRatio, "fx_hedge_ratio", "RATIO"); if (!fxHedge.ok) return fxHedge;
  const commodityHedge = read(inputs.commodityHedgeRatio, "commodity_hedge_ratio", "RATIO"); if (!commodityHedge.ok) return commodityHedge;
  const volume = read(inputs.annualVolume, "annual_volume", "POSITIVE_INTEGER"); if (!volume.ok) return volume;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO"); if (!confidence.ok) return confidence;
  const one = context.DecimalConstructor("1"); const zero = context.DecimalConstructor("0");
  const fxMarketFactor = currentFx.value.div(budgetFx.value); const commodityMarketFactor = currentCommodity.value.div(budgetCommodity.value);
  const hedgeAdjustedFxFactor = one.plus(fxMarketFactor.minus(one).times(one.minus(fxHedge.value)));
  const hedgeAdjustedCommodityFactor = one.plus(commodityMarketFactor.minus(one).times(one.minus(commodityHedge.value)));
  const combinedMaterialFactor = hedgeAdjustedFxFactor.times(hedgeAdjustedCommodityFactor);
  const materialPriceComponent = base.value.times(share.value); const nonMaterialPriceComponent = base.value.times(one.minus(share.value));
  const fxPriceImpact = materialPriceComponent.times(hedgeAdjustedFxFactor.minus(one));
  const commodityAndInteractionPriceImpact = materialPriceComponent.times(hedgeAdjustedFxFactor).times(hedgeAdjustedCommodityFactor.minus(one));
  const totalPriceAdjustment = fxPriceImpact.plus(commodityAndInteractionPriceImpact); const adjustedPrice = base.value.plus(totalPriceAdjustment);
  const passThroughRatio = totalPriceAdjustment.div(base.value); const annualBaseRevenue = base.value.times(volume.value);
  const annualAdjustedRevenue = adjustedPrice.times(volume.value); const annualPriceAdjustment = totalPriceAdjustment.times(volume.value);
  const priceAdjustmentUncertainty = totalPriceAdjustment.abs().times(one.minus(confidence.value));
  const unboundedLower = adjustedPrice.minus(priceAdjustmentUncertainty); const adjustedPriceLowerBound = unboundedLower.lt("0") ? zero : unboundedLower;
  const adjustedPriceUpperBound = adjustedPrice.plus(priceAdjustmentUncertainty); const annualMoneyAtRisk = priceAdjustmentUncertainty.times(volume.value);
  const primaryMarketDriver: 0 | 1 = commodityAndInteractionPriceImpact.abs().gt(fxPriceImpact.abs()) ? 1 : 0;
  const adjustmentDirection: -1 | 0 | 1 = totalPriceAdjustment.gt("0") ? 1 : totalPriceAdjustment.lt("0") ? -1 : 0;
  const decisionState: 0 | 1 = adjustmentDirection === 0 || adjustedPriceLowerBound.gt(base.value) || adjustedPriceUpperBound.lt(base.value) ? 0 : 1;
  return ok({ fxMarketFactor, commodityMarketFactor, hedgeAdjustedFxFactor, hedgeAdjustedCommodityFactor, combinedMaterialFactor,
    nonMaterialPriceComponent, materialPriceComponent, fxPriceImpact, commodityAndInteractionPriceImpact, totalPriceAdjustment,
    passThroughRatio, adjustedPrice, annualBaseRevenue, annualAdjustedRevenue, annualPriceAdjustment, sourceConfidenceRatio: confidence.value,
    priceAdjustmentUncertainty, adjustedPriceLowerBound, adjustedPriceUpperBound, annualMoneyAtRisk, primaryMarketDriver, adjustmentDirection, decisionState });
}
