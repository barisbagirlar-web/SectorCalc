import fs from "fs";
const file = "scripts/run-golden-tests.ts";
let content = fs.readFileSync(file, "utf8");

content = content.replace("import { CNC_CYCLE_TIME_ANALYZER_SCHEMA }", "import { CNC_CYCLE_TIME_SCHEMA }");
content = content.replace("import { ROOF_AREA_LOAD_ANALYZER_SCHEMA }", "import { ROOF_AREA_SCHEMA }");
content = content.replace("import { MACHINE_ECONOMIC_LIFE_ANALYZER_SCHEMA }", "import { MACHINE_ECONOMIC_LIFE_SCHEMA }");
content = content.replace("import { KWH_COST_ANALYZER_SCHEMA }", "import { KWH_COST_SCHEMA }");

content = content.replace('"cnc-cycle-time-analyzer": CNC_CYCLE_TIME_ANALYZER_SCHEMA', '"cnc-cycle-time-analyzer": CNC_CYCLE_TIME_SCHEMA');
content = content.replace('"roof-area-load-analyzer": ROOF_AREA_LOAD_ANALYZER_SCHEMA', '"roof-area-load-analyzer": ROOF_AREA_SCHEMA');
content = content.replace('"machine-economic-life-analyzer": MACHINE_ECONOMIC_LIFE_ANALYZER_SCHEMA', '"machine-economic-life-analyzer": MACHINE_ECONOMIC_LIFE_SCHEMA');
content = content.replace('"kwh-cost-analyzer": KWH_COST_ANALYZER_SCHEMA', '"kwh-cost-analyzer": KWH_COST_SCHEMA');

fs.writeFileSync(file, content);
