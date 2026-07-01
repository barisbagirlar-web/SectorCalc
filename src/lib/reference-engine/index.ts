/**
 * Global Reference Engine — barrel exports
 *
 * Usage:
 *   import { GlobalReferenceInput, registry } from "@/lib/reference-engine";
 *   import type { FormReferenceBindingContractType } from "@/lib/reference-engine";
 */

export { GlobalReferenceInput } from "./GlobalReferenceInput";
export {
  FormReferenceBindingContract,
  ProjectUnitSystem,
  ReferenceItem,
  UNIT_WHITELIST,
  ALLOWED_STANDARDS,
  validateReferenceBinding,
} from "./FormReferenceBindingContract";

export type {
  FormReferenceBindingContractType,
  ReferenceItemType,
  ProjectUnitSystemType,
  ReferenceRegistry,
  UnitWhitelist,
} from "./FormReferenceBindingContract";
