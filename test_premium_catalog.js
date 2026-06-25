"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var build_categorized_tool_index_1 = require("./src/lib/catalog/build-categorized-tool-index");
var items = (0, build_categorized_tool_index_1.buildCategorizedToolIndex)();
var premium = items.filter(function (item) { return (item.tier === "premium" || item.tier === "premium-schema") && item.publicStatus === "active" && item.routePath !== null; });
console.log("Total premium active items:", premium.length);
