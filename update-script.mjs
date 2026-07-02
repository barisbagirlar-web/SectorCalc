import fs from "fs";
const file = "scripts/run-golden-tests.ts";
let content = fs.readFileSync(file, "utf8");

content = content.replace('import { BOLT_TORQUE_SCHEMA } from "../src/lib/features/premium-schema/schemas/bolt-torque-preload-analyzer";', 
`import { BOLT_TORQUE_SCHEMA } from "../src/lib/features/premium-schema/schemas/bolt-torque-preload-analyzer";
import { CNC_CYCLE_TIME_ANALYZER_SCHEMA } from "../src/lib/features/premium-schema/schemas/cnc-cycle-time-analyzer";
import { ROOF_AREA_LOAD_ANALYZER_SCHEMA } from "../src/lib/features/premium-schema/schemas/roof-area-load-analyzer";
import { MACHINE_ECONOMIC_LIFE_ANALYZER_SCHEMA } from "../src/lib/features/premium-schema/schemas/machine-economic-life-analyzer";
import { ROBOT_VS_MANUAL_ANALYZER_SCHEMA } from "../src/lib/features/premium-schema/schemas/robot-vs-manual-analyzer";
import { KWH_COST_ANALYZER_SCHEMA } from "../src/lib/features/premium-schema/schemas/kwh-cost-analyzer";`);

content = content.replace('"bolt-torque-preload-analyzer": BOLT_TORQUE_SCHEMA',
`"bolt-torque-preload-analyzer": BOLT_TORQUE_SCHEMA,
  "cnc-cycle-time-analyzer": CNC_CYCLE_TIME_ANALYZER_SCHEMA,
  "roof-area-load-analyzer": ROOF_AREA_LOAD_ANALYZER_SCHEMA,
  "machine-economic-life-analyzer": MACHINE_ECONOMIC_LIFE_ANALYZER_SCHEMA,
  "robot-vs-manual-analyzer": ROBOT_VS_MANUAL_ANALYZER_SCHEMA,
  "kwh-cost-analyzer": KWH_COST_ANALYZER_SCHEMA`);

fs.writeFileSync(file, content);
