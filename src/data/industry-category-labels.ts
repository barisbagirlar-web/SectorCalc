import type { IndustryCategory } from "@/lib/tools/industry-registry";

/** Category labels for homepage / industries showcase */
export const INDUSTRY_CATEGORY_DISPLAY: Record<
 IndustryCategory,
 { en: string }
> = {
 "heavy-industry": {
 en: "Heavy Industry & Manufacturing",
 },
 "building-trades": {
 en: "Building Trades",
 },
 "field-services": {
 en: "Field Services",
 },
 "food-retail": {
 en: "Food & Retail",
 },
 "custom-manufacturing": {
 en: "Custom Manufacturing",
 },
 "logistics-transport": {
 en: "Logistics & Transport",
 },
 "agriculture-livestock": {
 en: "Agriculture & Livestock",
 },
 "energy-environment": {
 en: "Energy & Environment",
 },
 "daily-life": {
 en: "Daily Life",
 },
};
