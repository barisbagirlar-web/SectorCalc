import { PRO_TOOLS_LIST } from "../src/lib/features/tools/pro-tools-registry";
import { UNIVERSAL_TOOLS_LIST } from "../src/lib/features/tools/universal-tools-registry";

console.log("=== GeneratedToolFormView USING TOOLS (Legacy / Pro / Universal JSON) ===");
const all = [...PRO_TOOLS_LIST, ...UNIVERSAL_TOOLS_LIST];
all.forEach(t => console.log(`- ${t.metadata.slug} (${t.metadata.name})`));
