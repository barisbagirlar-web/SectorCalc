import type { FreeTrafficTool } from "./types";

export const MANUFACTURING_WORKSHOP_TOOLS: readonly FreeTrafficTool[] = [
  {
    "slug": "overall-equipment-effectiveness-oee",
    "title": "Overall Equipment Effectiveness Oee",
    "category": "manufacturing-workshop",
    "description": "Free online overall equipment effectiveness oee calculator. Get accurate calculations instantly.",
    "seoTitle": "Overall Equipment Effectiveness Oee | SectorCalc",
    "seoDescription": "Free online overall equipment effectiveness oee calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "availability",
        "label": "Availability Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter availability rate (%)"
      },
      {
        "key": "performance",
        "label": "Performance Efficiency (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter performance efficiency (%)"
      },
      {
        "key": "quality",
        "label": "Quality Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter quality rate (%)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "smed-mold-setup-reduction",
    "title": "Smed Mold Setup Reduction",
    "category": "manufacturing-workshop",
    "description": "Calculate machine setup time reduction, annual downtime hours saved, and total cost savings using Lean SMED methodologies.",
    "seoTitle": "SMED Setup Time & Cost Reduction Calculator | SectorCalc",
    "seoDescription": "Free online Lean SMED calculator. Estimate setup time reductions, annual machine capacity gain, and manufacturing cost savings.",
    "inputs": [
      {
        "key": "currentInternalTime",
        "label": "Current Internal Setup Time",
        "unit": "min",
        "type": "number",
        "helper": "Active setup duration when machine is fully stopped"
      },
      {
        "key": "currentExternalTime",
        "label": "Current External Setup Time",
        "unit": "min",
        "type": "number",
        "helper": "Setup tasks completed while machine is running"
      },
      {
        "key": "conversionPercentage",
        "label": "Internal-to-External Conversion",
        "unit": "%",
        "type": "number",
        "helper": "Percentage of internal tasks converted to external prep"
      },
      {
        "key": "reductionPercentage",
        "label": "Remaining Internal Task Reduction",
        "unit": "%",
        "type": "number",
        "helper": "Percentage reduction of the remaining internal task times"
      },
      {
        "key": "hourlyDowntimeCost",
        "label": "Hourly Machine Downtime Cost",
        "unit": "USD",
        "type": "number",
        "helper": "Cost of machine downtime per hour (labor + opportunity cost)"
      },
      {
        "key": "setupsPerYear",
        "label": "Setups Per Year",
        "unit": "count",
        "type": "number",
        "helper": "Total number of changeovers or setups performed annually"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Process standardization costs",
      "Operator training overhead",
      "Setup tooling capital expenditures"
    ]
  },
  {
    "slug": "manufacturing-learning-curve",
    "title": "Manufacturing Learning Curve",
    "category": "manufacturing-workshop",
    "description": "Free online manufacturing learning curve calculator. Get accurate calculations instantly.",
    "seoTitle": "Manufacturing Learning Curve | SectorCalc",
    "seoDescription": "Free online manufacturing learning curve calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "initialTime",
        "label": "Initial Cycle Time (Minutes)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter initial cycle time (minutes)"
      },
      {
        "key": "learningRate",
        "label": "Learning Curve Slope Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter learning curve slope rate (%)"
      },
      {
        "key": "unitsProduced",
        "label": "Cumulative Units Produced",
        "unit": "units",
        "type": "number",
        "helper": "Enter cumulative units produced"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "standard-production-cycle-time",
    "title": "Standard Production Cycle Time",
    "category": "manufacturing-workshop",
    "description": "Free online standard production cycle time calculator. Get accurate calculations instantly.",
    "seoTitle": "Standard Production Cycle Time | SectorCalc",
    "seoDescription": "Free online standard production cycle time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "observedTime",
        "label": "Observed Cycle Time (Minutes)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter observed cycle time (minutes)"
      },
      {
        "key": "performance",
        "label": "Performance Efficiency (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter performance efficiency (%)"
      },
      {
        "key": "allowanceTime",
        "label": "Fatigue Allowance Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter fatigue allowance rate (%)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "production-assembly-line-balance",
    "title": "Production Assembly Line Balance",
    "category": "manufacturing-workshop",
    "description": "Free online production assembly line balance calculator. Get accurate calculations instantly.",
    "seoTitle": "Production Assembly Line Balance | SectorCalc",
    "seoDescription": "Free online production assembly line balance calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "totalWork",
        "label": "Total Work Content (Minutes)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter total work content (minutes)"
      },
      {
        "key": "taktTime",
        "label": "Takt Time (Seconds)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter takt time (seconds)"
      },
      {
        "key": "istasyonsayisi",
        "label": "istasyonsayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter istasyonsayisi"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "assembly-line-bottleneck-capacity",
    "title": "Assembly Line Bottleneck Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online assembly line bottleneck capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Assembly Line Bottleneck Capacity | SectorCalc",
    "seoDescription": "Free online assembly line bottleneck capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "stationTimes",
        "label": "Station Times (comma separated, mins)",
        "unit": "Dizi Dk",
        "type": "number",
        "helper": "Enter station times (comma separated, mins)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "manufacturing-scrap-loss-cost",
    "title": "Manufacturing Scrap Loss Cost",
    "category": "manufacturing-workshop",
    "description": "Free online manufacturing scrap loss cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Manufacturing Scrap Loss Cost | SectorCalc",
    "seoDescription": "Free online manufacturing scrap loss cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "production",
        "label": "Total Units Produced",
        "unit": "units",
        "type": "number",
        "helper": "Enter total units produced"
      },
      {
        "key": "scrap",
        "label": "Defective Units (Scrap)",
        "unit": "units",
        "type": "number",
        "helper": "Enter defective units (scrap)"
      },
      {
        "key": "birimmaliyet",
        "label": "birimmaliyet",
        "unit": "USD",
        "type": "number",
        "helper": "Enter birimmaliyet"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "measurement-gage-calibration-drift",
    "title": "Measurement Gage Calibration Drift",
    "category": "manufacturing-workshop",
    "description": "Free online measurement gage calibration drift calculator. Get accurate calculations instantly.",
    "seoTitle": "Measurement Gage Calibration Drift | SectorCalc",
    "seoDescription": "Free online measurement gage calibration drift calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "finalError",
        "label": "Final Measured Deviation",
        "unit": "Unit",
        "type": "number",
        "helper": "Enter final measured deviation"
      },
      {
        "key": "prevError",
        "label": "Previous Measured Deviation",
        "unit": "Unit",
        "type": "number",
        "helper": "Enter previous measured deviation"
      },
      {
        "key": "elapsedTime",
        "label": "Elapsed Time between Calibrations (Days)",
        "unit": "days",
        "type": "number",
        "helper": "Enter elapsed time between calibrations (days)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "machine-capital-depreciation-rate",
    "title": "Machine Capital Depreciation Rate",
    "category": "manufacturing-workshop",
    "description": "Free online machine capital depreciation rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Machine Capital Depreciation Rate | SectorCalc",
    "seoDescription": "Free online machine capital depreciation rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cost",
        "label": "Cost",
        "unit": "USD",
        "type": "number",
        "helper": "Enter cost"
      },
      {
        "key": "salvageValue",
        "label": "Salvage Value",
        "unit": "USD",
        "type": "number",
        "helper": "Enter salvage value"
      },
      {
        "key": "usefulLife",
        "label": "Useful Life",
        "unit": "years",
        "type": "number",
        "helper": "Enter useful life"
      },
      {
        "key": "capacity",
        "label": "Total Production Capacity",
        "unit": "units",
        "type": "number",
        "helper": "Enter total production capacity"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "levelized-cost-of-energy-lcoe",
    "title": "Levelized Cost Of Energy Lcoe",
    "category": "manufacturing-workshop",
    "description": "Free online levelized cost of energy lcoe calculator. Get accurate calculations instantly.",
    "seoTitle": "Levelized Cost Of Energy Lcoe | SectorCalc",
    "seoDescription": "Free online levelized cost of energy lcoe calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "totalInvestment",
        "label": "Total Plant Capital Investment",
        "unit": "USD",
        "type": "number",
        "helper": "Enter total plant capital investment"
      },
      {
        "key": "totalOperating",
        "label": "Total Lifecycle Operating Costs",
        "unit": "USD",
        "type": "number",
        "helper": "Enter total lifecycle operating costs"
      },
      {
        "key": "totalGeneration",
        "label": "Total Projected Energy Output (kWh)",
        "unit": "kWh",
        "type": "number",
        "helper": "Enter total projected energy output (kwh)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "apparel-sewing-line-balance",
    "title": "Apparel Sewing Line Balance",
    "category": "manufacturing-workshop",
    "description": "Free online apparel sewing line balance calculator. Get accurate calculations instantly.",
    "seoTitle": "Apparel Sewing Line Balance | SectorCalc",
    "seoDescription": "Free online apparel sewing line balance calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "totalSmv",
        "label": "Total Standard Minute Value (SMV)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter total standard minute value (smv)"
      },
      {
        "key": "taktTime",
        "label": "Takt Time (Seconds)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter takt time (seconds)"
      },
      {
        "key": "operators",
        "label": "Number of Line Operators",
        "unit": "units",
        "type": "number",
        "helper": "Enter number of line operators"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "measurement-gage-rr-percentage",
    "title": "Measurement Gage Rr Percentage",
    "category": "manufacturing-workshop",
    "description": "Free online measurement gage rr percentage calculator. Get accurate calculations instantly.",
    "seoTitle": "Measurement Gage Rr Percentage | SectorCalc",
    "seoDescription": "Free online measurement gage rr percentage calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "partVariance",
        "label": "Part-to-Part Variance (PV)",
        "unit": "VP",
        "type": "number",
        "helper": "Enter part-to-part variance (pv)"
      },
      {
        "key": "gageVariance",
        "label": "Measurement System Variance (GRR)",
        "unit": "VGRR",
        "type": "number",
        "helper": "Enter measurement system variance (grr)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "hookes-law-axial-stress",
    "title": "Hookes Law Axial Stress",
    "category": "manufacturing-workshop",
    "description": "Free online hookes law axial stress calculator. Get accurate calculations instantly.",
    "seoTitle": "Hookes Law Axial Stress | SectorCalc",
    "seoDescription": "Free online hookes law axial stress calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "elasticModulus",
        "label": "Young's Modulus of Elasticity (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter young's modulus of elasticity (pa)"
      },
      {
        "key": "strain",
        "label": "Normal Mechanical Strain",
        "unit": "Number",
        "type": "number",
        "helper": "Enter normal mechanical strain"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "interference-fit-pressure",
    "title": "Interference Fit Pressure",
    "category": "manufacturing-workshop",
    "description": "Calculate joint contact pressure, axial assembly force, and transmissible torque for press fits and shrink fits using Lame's thick-walled cylinder equations.",
    "seoTitle": "Press Fit & Shrink Fit Pressure Calculator | Lame's Equations | SectorCalc",
    "seoDescription": "Calculate press fit interference pressure, transmissible torque, and assembly force. Supports solid and hollow shafts.",
    "inputs": [
      {
        "key": "diametralInterference",
        "label": "Diametral Interference",
        "unit": "mm",
        "type": "number",
        "helper": "Total interference on diameter (difference between shaft and hub)"
      },
      {
        "key": "shaftOuterDiameter",
        "label": "Contact Diameter (Shaft OD)",
        "unit": "mm",
        "type": "number",
        "helper": "Nominal diameter at the fit interface"
      },
      {
        "key": "shaftInnerDiameter",
        "label": "Shaft Inner Diameter",
        "unit": "mm",
        "type": "number",
        "helper": "Internal diameter of shaft (enter 0 for solid shaft)"
      },
      {
        "key": "hubOuterDiameter",
        "label": "Hub Outer Diameter",
        "unit": "mm",
        "type": "number",
        "helper": "External diameter of the surrounding hub or collar"
      },
      {
        "key": "shaftYoungsModulus",
        "label": "Shaft Young's Modulus",
        "unit": "GPa",
        "type": "number",
        "helper": "Modulus of elasticity of the shaft material (e.g. Steel = 200 GPa)"
      },
      {
        "key": "hubYoungsModulus",
        "label": "Hub Young's Modulus",
        "unit": "GPa",
        "type": "number",
        "helper": "Modulus of elasticity of the hub material (e.g. Cast Iron = 100 GPa)"
      },
      {
        "key": "shaftPoissonsRatio",
        "label": "Shaft Poisson's Ratio",
        "unit": "ratio",
        "type": "number",
        "helper": "Poisson's ratio of shaft material (typically 0.27 to 0.33)"
      },
      {
        "key": "hubPoissonsRatio",
        "label": "Hub Poisson's Ratio",
        "unit": "ratio",
        "type": "number",
        "helper": "Poisson's ratio of hub material (typically 0.25 to 0.30)"
      },
      {
        "key": "hubLength",
        "label": "Contact Joint Length",
        "unit": "mm",
        "type": "number",
        "helper": "Axial length of the fit contact area"
      },
      {
        "key": "frictionCoefficient",
        "label": "Friction Coefficient",
        "unit": "ratio",
        "type": "number",
        "helper": "Coefficient of friction at interface (e.g., 0.15 for steel/steel)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Centrifugal force stress effects",
      "Thermal expansion variations",
      "Surface finish roughness reduction factor"
    ]
  },
  {
    "slug": "thin-walled-pressure-vessel",
    "title": "Thin Walled Pressure Vessel",
    "category": "manufacturing-workshop",
    "description": "Free online thin walled pressure vessel calculator. Get accurate calculations instantly.",
    "seoTitle": "Thin Walled Pressure Vessel | SectorCalc",
    "seoDescription": "Free online thin walled pressure vessel calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "diameter",
        "label": "Diameter (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter diameter (m)"
      },
      {
        "key": "thickness",
        "label": "Wall Thickness (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter wall thickness (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "weld-joint-throat-thickness",
    "title": "Weld Joint Throat Thickness",
    "category": "manufacturing-workshop",
    "description": "Calculate the required weld throat thickness and leg size for fillet and butt joints under load, matching AISC welding design principles.",
    "seoTitle": "Weld Joint Throat Thickness & Leg Size Sizing | SectorCalc",
    "seoDescription": "Calculate weld throat thickness and leg size for fillet and butt welds under static load. Free engineering calculation tool.",
    "inputs": [
      {
        "key": "jointType",
        "label": "Weld Joint Type",
        "unit": "select",
        "type": "select",
        "helper": "Select the weld joint configuration",
        "options": [
          { "label": "Fillet Weld (Shear Limit)", "value": "fillet" },
          { "label": "Butt Weld (Tension/Compression)", "value": "butt" }
        ],
        "defaultValue": "fillet"
      },
      {
        "key": "load",
        "label": "Applied Force",
        "unit": "kN",
        "type": "number",
        "helper": "Total force acting on the weld joint"
      },
      {
        "key": "weldLength",
        "label": "Total Weld Length",
        "unit": "mm",
        "type": "number",
        "helper": "Sum of effective weld bead lengths"
      },
      {
        "key": "electrodeStrength",
        "label": "Electrode Tensile Strength",
        "unit": "MPa",
        "type": "number",
        "helper": "Classification strength of electrode (e.g. E70xx = 482 MPa)"
      },
      {
        "key": "safetyFactor",
        "label": "Design Safety Factor",
        "unit": "ratio",
        "type": "number",
        "helper": "Design code safety factor (typically 1.5 to 2.5)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic fatigue load factors",
      "Welder joint penetration efficiency",
      "Thermal welding stress concentration"
    ]
  },
  {
    "slug": "simple-beam-deflection-load",
    "title": "Simple Beam Deflection Load",
    "category": "manufacturing-workshop",
    "description": "Free online simple beam deflection load calculator. Get accurate calculations instantly.",
    "seoTitle": "Simple Beam Deflection Load | SectorCalc",
    "seoDescription": "Free online simple beam deflection load calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "elasticModulus",
        "label": "Young's Modulus of Elasticity (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter young's modulus of elasticity (pa)"
      },
      {
        "key": "momentOfInertia",
        "label": "Area Moment of Inertia (m4)",
        "unit": "m4",
        "type": "number",
        "helper": "Enter area moment of inertia (m4)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "laser-welding-energy-density",
    "title": "Laser Welding Energy Density",
    "category": "manufacturing-workshop",
    "description": "Free online laser welding energy density calculator. Get accurate calculations instantly.",
    "seoTitle": "Laser Welding Energy Density | SectorCalc",
    "seoDescription": "Free online laser welding energy density calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "laserPower",
        "label": "Laser Power Output (Watts)",
        "unit": "W",
        "type": "number",
        "helper": "Enter laser power output (watts)"
      },
      {
        "key": "cuttingSpeed",
        "label": "cuttingSpeed",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter cuttingspeed"
      },
      {
        "key": "focusDistance",
        "label": "Focus Area Diameter (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter focus area diameter (m)"
      },
      {
        "key": "materialThickness",
        "label": "Material Thickness (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter material thickness (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "beam-lintel-bending-stress",
    "title": "Beam Lintel Bending Stress",
    "category": "manufacturing-workshop",
    "description": "Free online beam lintel bending stress calculator. Get accurate calculations instantly.",
    "seoTitle": "Beam Lintel Bending Stress | SectorCalc",
    "seoDescription": "Free online beam lintel bending stress calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "span",
        "label": "Clear Span length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter clear span length (m)"
      },
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mohrs-circle-stress-transformation",
    "title": "Mohrs Circle Stress Transformation",
    "category": "manufacturing-workshop",
    "description": "Free online mohrs circle stress transformation calculator. Get accurate calculations instantly.",
    "seoTitle": "Mohrs Circle Stress Transformation | SectorCalc",
    "seoDescription": "Free online mohrs circle stress transformation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sigmaX",
        "label": "Normal Stress in X-Direction (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter normal stress in x-direction (pa)"
      },
      {
        "key": "sigmaY",
        "label": "Normal Stress in Y-Direction (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter normal stress in y-direction (pa)"
      },
      {
        "key": "tauXY",
        "label": "Shear Stress on XY-Plane (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter shear stress on xy-plane (pa)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rectangle-area-moment-inertia",
    "title": "Rectangle Area Moment Inertia",
    "category": "manufacturing-workshop",
    "description": "Free online rectangle area moment inertia calculator. Get accurate calculations instantly.",
    "seoTitle": "Rectangle Area Moment Inertia | SectorCalc",
    "seoDescription": "Free online rectangle area moment inertia calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "normal-shock-wave-relations",
    "title": "Normal Shock Wave Relations",
    "category": "manufacturing-workshop",
    "description": "Free online normal shock wave relations calculator. Get accurate calculations instantly.",
    "seoTitle": "Normal Shock Wave Relations | SectorCalc",
    "seoDescription": "Free online normal shock wave relations calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mach",
        "label": "Inlet Mach Number",
        "unit": "Number",
        "type": "number",
        "helper": "Enter inlet mach number"
      },
      {
        "key": "pressure1",
        "label": "Inlet Static Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter inlet static pressure (pa)"
      },
      {
        "key": "temperature1",
        "label": "Inlet Static Temperature (K)",
        "unit": "K",
        "type": "number",
        "helper": "Enter inlet static temperature (k)"
      },
      {
        "key": "strikePrice",
        "label": "Strike Price (K)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter strike price (k)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "pump-npsh-cavitation-margin",
    "title": "Pump Npsh Cavitation Margin",
    "category": "manufacturing-workshop",
    "description": "Free online pump npsh cavitation margin calculator. Get accurate calculations instantly.",
    "seoTitle": "Pump Npsh Cavitation Margin | SectorCalc",
    "seoDescription": "Free online pump npsh cavitation margin calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "vaporPressure",
        "label": "Liquid Vapor Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter liquid vapor pressure (pa)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      },
      {
        "key": "loss",
        "label": "Frictional Head Loss (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter frictional head loss (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "thermal-pipe-expansion-stress",
    "title": "Thermal Pipe Expansion Stress",
    "category": "manufacturing-workshop",
    "description": "Free online thermal pipe expansion stress calculator. Get accurate calculations instantly.",
    "seoTitle": "Thermal Pipe Expansion Stress | SectorCalc",
    "seoDescription": "Free online thermal pipe expansion stress calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "elasticModulus",
        "label": "Young's Modulus of Elasticity (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter young's modulus of elasticity (pa)"
      },
      {
        "key": "expansionCoefficient",
        "label": "Thermal Expansion Coefficient (1/K)",
        "unit": "1/K",
        "type": "number",
        "helper": "Enter thermal expansion coefficient (1/k)"
      },
      {
        "key": "temperatureDifference",
        "label": "Temperature Difference (K)",
        "unit": "K",
        "type": "number",
        "helper": "Enter temperature difference (k)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "flat-belt-drive-tension",
    "title": "Flat Belt Drive Tension",
    "category": "manufacturing-workshop",
    "description": "Free online flat belt drive tension calculator. Get accurate calculations instantly.",
    "seoTitle": "Flat Belt Drive Tension | SectorCalc",
    "seoDescription": "Free online flat belt drive tension calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power (Watts)",
        "unit": "W",
        "type": "number",
        "helper": "Enter transmitted power (watts)"
      },
      {
        "key": "speed",
        "label": "Belt Speed (m/s)",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter belt speed (m/s)"
      },
      {
        "key": "wrapAngle",
        "label": "Pulley Wrap Angle (Radians)",
        "unit": "Rad",
        "type": "number",
        "helper": "Enter pulley wrap angle (radians)"
      },
      {
        "key": "friction",
        "label": "Belt-to-Pulley Friction Coefficient",
        "unit": "Number",
        "type": "number",
        "helper": "Enter belt-to-pulley friction coefficient"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "natural-resonance-frequency",
    "title": "Natural Resonance Frequency",
    "category": "manufacturing-workshop",
    "description": "Free online natural resonance frequency calculator. Get accurate calculations instantly.",
    "seoTitle": "Natural Resonance Frequency | SectorCalc",
    "seoDescription": "Free online natural resonance frequency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "springConstant",
        "label": "Spring Constant / Stiffness (N/m)",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter spring constant / stiffness (n/m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "shaft-diameter-torsion-bending",
    "title": "Shaft Diameter Torsion Bending",
    "category": "manufacturing-workshop",
    "description": "Calculate minimum required transmission shaft diameter under combined torsion and bending according to the ASME B106.1M code.",
    "seoTitle": "ASME Shaft Diameter combined Torsion & Bending Calculator | SectorCalc",
    "seoDescription": "Size a mechanical shaft diameter based on ASME code. Inputs power, RPM, bending, yield, and tensile strengths.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power",
        "unit": "kW",
        "type": "number",
        "helper": "Total power transmitted through the shaft"
      },
      {
        "key": "rpm",
        "label": "Rotational Speed",
        "unit": "RPM",
        "type": "number",
        "helper": "Shaft rotational speed in revolutions per minute"
      },
      {
        "key": "bendingMoment",
        "label": "Max Bending Moment",
        "unit": "N.m",
        "type": "number",
        "helper": "Peak bending moment acting along the shaft length"
      },
      {
        "key": "yieldStrength",
        "label": "Material Yield Strength",
        "unit": "MPa",
        "type": "number",
        "helper": "Yield strength ($S_y$) of the shaft material"
      },
      {
        "key": "tensileStrength",
        "label": "Material Tensile Strength",
        "unit": "MPa",
        "type": "number",
        "helper": "Ultimate tensile strength ($S_u$) of the shaft material"
      },
      {
        "key": "loadingType",
        "label": "Loading & Shock Conditions",
        "unit": "select",
        "type": "select",
        "helper": "Type of mechanical load and fatigue shock",
        "options": [
          { "label": "Gradual Loading (No Shock)", "value": "gradual" },
          { "label": "Minor Shock Loading", "value": "minor_shock" },
          { "label": "Heavy Shock Loading", "value": "heavy_shock" }
        ],
        "defaultValue": "gradual"
      },
      {
        "key": "hasKeyway",
        "label": "Keyway Stress Reduction",
        "unit": "select",
        "type": "select",
        "helper": "Does the shaft feature keyways or splines (reduces allowable stress by 25%)?",
        "options": [
          { "label": "No Keyways Present", "value": "no" },
          { "label": "Keyways / Splines Present", "value": "yes" }
        ],
        "defaultValue": "no"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic shaft deflection limits",
      "Critical rotational speed limits",
      "Fatigue stress concentration notch factors"
    ]
  },
  {
    "slug": "shaft-torsional-shear-stress",
    "title": "Shaft Torsional Shear Stress",
    "category": "manufacturing-workshop",
    "description": "Free online shaft torsional shear stress calculator. Get accurate calculations instantly.",
    "seoTitle": "Shaft Torsional Shear Stress | SectorCalc",
    "seoDescription": "Free online shaft torsional shear stress calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "torque",
        "label": "Applied Torsional Torque (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied torsional torque (n.m)"
      },
      {
        "key": "radius",
        "label": "Component Outer Radius (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component outer radius (m)"
      },
      {
        "key": "polarInertia",
        "label": "Polar Area Moment of Inertia (m4)",
        "unit": "m4",
        "type": "number",
        "helper": "Enter polar area moment of inertia (m4)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "spring-force-compression",
    "title": "Spring Force Compression",
    "category": "manufacturing-workshop",
    "description": "Free online spring force compression calculator. Get accurate calculations instantly.",
    "seoTitle": "Spring Force Compression | SectorCalc",
    "seoDescription": "Free online spring force compression calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "springConstant",
        "label": "Spring Constant / Stiffness (N/m)",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter spring constant / stiffness (n/m)"
      },
      {
        "key": "displacement",
        "label": "Spring Compression Displacement (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter spring compression displacement (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mass-spring-angular-frequency",
    "title": "Mass Spring Angular Frequency",
    "category": "manufacturing-workshop",
    "description": "Free online mass spring angular frequency calculator. Get accurate calculations instantly.",
    "seoTitle": "Mass Spring Angular Frequency | SectorCalc",
    "seoDescription": "Free online mass spring angular frequency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "springConstant",
        "label": "Spring Constant / Stiffness (N/m)",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter spring constant / stiffness (n/m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "spur-gear-lewis-bending-stress",
    "title": "Spur Gear Lewis Bending Stress",
    "category": "manufacturing-workshop",
    "description": "Calculate theoretical tooth bending stress in a spur gear using the Lewis Bending Stress formula, including Barth velocity dynamic impact factor.",
    "seoTitle": "Spur Gear Lewis Bending Stress Calculator | SectorCalc",
    "seoDescription": "Calculate spur gear bending stress using the Lewis Equation and Barth dynamic factors. Inputs power, speed, module, face width, and teeth count.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power",
        "unit": "kW",
        "type": "number",
        "helper": "Input mechanical power transmitted through the gear"
      },
      {
        "key": "rpm",
        "label": "Gear Speed",
        "unit": "RPM",
        "type": "number",
        "helper": "Gear rotational velocity in revolutions per minute"
      },
      {
        "key": "pitchDiameter",
        "label": "Pitch Diameter",
        "unit": "mm",
        "type": "number",
        "helper": "Reference pitch diameter of the spur gear"
      },
      {
        "key": "faceWidth",
        "label": "Face Width",
        "unit": "mm",
        "type": "number",
        "helper": "Axial tooth width of the gear"
      },
      {
        "key": "module",
        "label": "Module",
        "unit": "mm",
        "type": "number",
        "helper": "Gear module (pitch diameter divided by teeth count)"
      },
      {
        "key": "teethCount",
        "label": "Number of Teeth",
        "unit": "count",
        "type": "number",
        "helper": "Total tooth count on the gear wheel"
      },
      {
        "key": "toothSystem",
        "label": "Pressure Angle & Tooth System",
        "unit": "select",
        "type": "select",
        "helper": "Select pressure angle and profile configuration",
        "options": [
          { "label": "20° Full Depth System", "value": "20_deg_full_depth" },
          { "label": "14.5° Full Depth System", "value": "14.5_deg_full_depth" }
        ],
        "defaultValue": "20_deg_full_depth"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "AGMA load distribution coefficients",
      "Dynamic tooth error overload factors",
      "Surface contact fatigue limits"
    ]
  },
  {
    "slug": "hydrostatic-fluid-pressure-depth",
    "title": "Hydrostatic Fluid Pressure Depth",
    "category": "manufacturing-workshop",
    "description": "Free online hydrostatic fluid pressure depth calculator. Get accurate calculations instantly.",
    "seoTitle": "Hydrostatic Fluid Pressure Depth | SectorCalc",
    "seoDescription": "Free online hydrostatic fluid pressure depth calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "depth",
        "label": "Fluid Depth (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter fluid depth (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "steel-beam-bending",
    "title": "Steel Beam Bending",
    "category": "manufacturing-workshop",
    "description": "Free online steel beam bending calculator. Get accurate calculations instantly.",
    "seoTitle": "Steel Beam Bending | SectorCalc",
    "seoDescription": "Free online steel beam bending calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "moment",
        "label": "Applied Bending Moment (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied bending moment (n.m)"
      },
      {
        "key": "kesitmodulu",
        "label": "kesitmodulu",
        "unit": "m3",
        "type": "number",
        "helper": "Enter kesitmodulu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "strain-calculator",
    "title": "Strain Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online strain calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Strain Calculator | SectorCalc",
    "seoDescription": "Free online strain calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "ilkboy",
        "label": "ilkboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter ilkboy"
      },
      {
        "key": "sonboy",
        "label": "sonboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter sonboy"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "stress-calculator",
    "title": "Stress Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online stress calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Stress Calculator | SectorCalc",
    "seoDescription": "Free online stress calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kuvvet",
        "label": "kuvvet",
        "unit": "N",
        "type": "number",
        "helper": "Enter kuvvet"
      },
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "tolerance-and-fit",
    "title": "Tolerance And Fit",
    "category": "manufacturing-workshop",
    "description": "Find upper/lower limit deviations and determine the type of fit (Clearance, Transition, or Interference) under the ISO 286 metric standard.",
    "seoTitle": "ISO 286 Limits & Fits Calculator | Clearance & Interference | SectorCalc",
    "seoDescription": "Free ISO 286 Limits and Fits calculator. Check hole and shaft tolerances, clearances, interferences, and fit types.",
    "inputs": [
      {
        "key": "nominalSize",
        "label": "Nominal Size",
        "unit": "mm",
        "type": "number",
        "helper": "Target dimension (nominal diameter from 1 to 500 mm)"
      },
      {
        "key": "holeToleranceClass",
        "label": "Hole Tolerance Class",
        "unit": "select",
        "type": "select",
        "helper": "ISO 286 Hole symbol (e.g. H7)",
        "options": [
          { "label": "H7 (Standard)", "value": "H7" },
          { "label": "H8 (Coarse)", "value": "H8" },
          { "label": "H9 (Wide)", "value": "H9" },
          { "label": "F7 (Clearance)", "value": "F7" },
          { "label": "G7 (Slide Clearance)", "value": "G7" },
          { "label": "JS7 (Symmetrical)", "value": "JS7" },
          { "label": "K7 (Transition)", "value": "K7" },
          { "label": "M7 (Tight Transition)", "value": "M7" },
          { "label": "N7 (Press Transition)", "value": "N7" },
          { "label": "P7 (Interference Fit)", "value": "P7" }
        ],
        "defaultValue": "H7"
      },
      {
        "key": "shaftToleranceClass",
        "label": "Shaft Tolerance Class",
        "unit": "select",
        "type": "select",
        "helper": "ISO 286 Shaft symbol (e.g. g6)",
        "options": [
          { "label": "g6 (Sliding Fit)", "value": "g6" },
          { "label": "h6 (Locating Fit)", "value": "h6" },
          { "label": "h7 (General Locating)", "value": "h7" },
          { "label": "f7 (Running Clearance)", "value": "f7" },
          { "label": "js6 (Symmetrical)", "value": "js6" },
          { "label": "k6 (Transition Fit)", "value": "k6" },
          { "label": "m6 (Tapping Fit)", "value": "m6" },
          { "label": "n6 (Light Press Fit)", "value": "n6" },
          { "label": "p6 (Medium Press Fit)", "value": "p6" },
          { "label": "r6 (Heavy Press Fit)", "value": "r6" },
          { "label": "s6 (Force/Shrink Fit)", "value": "s6" }
        ],
        "defaultValue": "g6"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Thermal expansion allowance",
      "Dynamic operating fits",
      "Geometric dimensioning & tolerancing (GD&T)"
    ]
  },
  {
    "slug": "soil-bearing-capacity",
    "title": "Soil Bearing Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online soil bearing capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Soil Bearing Capacity | SectorCalc",
    "seoDescription": "Free online soil bearing capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kohezyon",
        "label": "kohezyon",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter kohezyon"
      },
      {
        "key": "temelgenislik",
        "label": "temelgenislik",
        "unit": "m",
        "type": "number",
        "helper": "Enter temelgenislik"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "depth",
        "label": "Fluid Depth (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter fluid depth (m)"
      },
      {
        "key": "nc",
        "label": "nc",
        "unit": "Number",
        "type": "number",
        "helper": "Enter nc"
      },
      {
        "key": "nq",
        "label": "nq",
        "unit": "Number",
        "type": "number",
        "helper": "Enter nq"
      },
      {
        "key": "ng",
        "label": "ng",
        "unit": "Number",
        "type": "number",
        "helper": "Enter ng"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "torque-converter",
    "title": "Torque Converter",
    "category": "manufacturing-workshop",
    "description": "Free online torque converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Torque Converter | SectorCalc",
    "seoDescription": "Free online torque converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "Nm/lbft/kgfm",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "angle-of-twist",
    "title": "Angle Of Twist",
    "category": "manufacturing-workshop",
    "description": "Free online angle of twist calculator. Get accurate calculations instantly.",
    "seoTitle": "Angle Of Twist | SectorCalc",
    "seoDescription": "Free online angle of twist calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "torque",
        "label": "Applied Torsional Torque (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied torsional torque (n.m)"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "kaymamodulu",
        "label": "kaymamodulu",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter kaymamodulu"
      },
      {
        "key": "polarInertia",
        "label": "Polar Area Moment of Inertia (m4)",
        "unit": "m4",
        "type": "number",
        "helper": "Enter polar area moment of inertia (m4)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "torsion-spring",
    "title": "Torsion Spring",
    "category": "manufacturing-workshop",
    "description": "Free online torsion spring calculator. Get accurate calculations instantly.",
    "seoTitle": "Torsion Spring | SectorCalc",
    "seoDescription": "Free online torsion spring calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "moment",
        "label": "Applied Bending Moment (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied bending moment (n.m)"
      },
      {
        "key": "springConstant",
        "label": "Spring Constant / Stiffness (N/m)",
        "unit": "N.m/rad",
        "type": "number",
        "helper": "Enter spring constant / stiffness (n/m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "von-mises-stress",
    "title": "Von Mises Stress",
    "category": "manufacturing-workshop",
    "description": "Calculate Von Mises equivalent stress for 2D plane stress or 3D triaxial stress states and determine structural safety factors against yielding.",
    "seoTitle": "Von Mises Equivalent Stress & Safety Factor Calculator | SectorCalc",
    "seoDescription": "Calculate Von Mises equivalent stress and yield safety factor. Supports 2D and 3D stress tensors.",
    "inputs": [
      {
        "key": "stressState",
        "label": "Stress State Dimensions",
        "unit": "select",
        "type": "select",
        "helper": "Select 2D (Plane Stress) or full 3D stress tensor",
        "options": [
          { "label": "2D Stress State (Plane Stress)", "value": "2d" },
          { "label": "3D Triaxial Stress State", "value": "3d" }
        ],
        "defaultValue": "2d"
      },
      {
        "key": "sigmaX",
        "label": "Normal Stress X (σx)",
        "unit": "MPa",
        "type": "number",
        "helper": "Normal stress acting in the X direction"
      },
      {
        "key": "sigmaY",
        "label": "Normal Stress Y (σy)",
        "unit": "MPa",
        "type": "number",
        "helper": "Normal stress acting in the Y direction"
      },
      {
        "key": "sigmaZ",
        "label": "Normal Stress Z (σz)",
        "unit": "MPa",
        "type": "number",
        "helper": "Normal stress acting in the Z direction (ignored for 2D)"
      },
      {
        "key": "tauXY",
        "label": "Shear Stress XY (τxy)",
        "unit": "MPa",
        "type": "number",
        "helper": "Shear stress acting on the XY plane"
      },
      {
        "key": "tauYZ",
        "label": "Shear Stress YZ (τyz)",
        "unit": "MPa",
        "type": "number",
        "helper": "Shear stress acting on the YZ plane (ignored for 2D)"
      },
      {
        "key": "tauXZ",
        "label": "Shear Stress XZ (τxz)",
        "unit": "MPa",
        "type": "number",
        "helper": "Shear stress acting on the XZ plane (ignored for 2D)"
      },
      {
        "key": "yieldStrength",
        "label": "Material Yield Strength",
        "unit": "MPa",
        "type": "number",
        "helper": "Yield limit ($S_y$) of structural material to assess safety factor"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cyclic load fatigue",
      "Stress concentration factors (Kt)",
      "Anisotropic material behavior"
    ]
  },
    {
    "slug": "welding-heat-input",
    "title": "Welding Heat Input",
    "category": "manufacturing-workshop",
    "description": "Determine the arc heat input in kJ/mm or kJ/in during welding according to EN 1011-1 and ASME Section IX, matching process thermal efficiencies.",
    "seoTitle": "ASME Sec IX Welding Heat Input Calculator | SectorCalc",
    "seoDescription": "Calculate weld heat input using EN 1011-1 / ASME Sec IX formulas. Supports SMAW, GMAW, GTAW, and SAW processes.",
    "inputs": [
      {
        "key": "current",
        "label": "Welding Current",
        "unit": "A",
        "type": "number",
        "helper": "Amperage read from welding machine display"
      },
      {
        "key": "voltage",
        "label": "Arc Voltage",
        "unit": "V",
        "type": "number",
        "helper": "Voltage measured across the arc"
      },
      {
        "key": "travelSpeed",
        "label": "Travel Speed",
        "unit": "mm/min",
        "type": "number",
        "helper": "Speed of torch advancement along the joint"
      },
      {
        "key": "weldingProcess",
        "label": "Welding Process",
        "unit": "select",
        "type": "select",
        "helper": "Select process (automatically defines process efficiency)",
        "options": [
          { "label": "SMAW / MMA (Stick) (η = 0.8)", "value": "smaw" },
          { "label": "GMAW / MIG / MAG (η = 0.8)", "value": "gmaw" },
          { "label": "GTAW / TIG (η = 0.6)", "value": "gtaw" },
          { "label": "SAW (Submerged Arc) (η = 1.0)", "value": "saw" }
        ],
        "defaultValue": "gmaw"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Welding joint geometry heat sinks",
      "Base metal preheat temperature",
      "Post-weld cooling rate variables"
    ]
  },
  {
    "slug": "wood-beam-shear",
    "title": "Wood Beam Shear",
    "category": "manufacturing-workshop",
    "description": "Free online wood beam shear calculator. Get accurate calculations instantly.",
    "seoTitle": "Wood Beam Shear | SectorCalc",
    "seoDescription": "Free online wood beam shear calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kesmekuvveti",
        "label": "kesmekuvveti",
        "unit": "N",
        "type": "number",
        "helper": "Enter kesmekuvveti"
      },
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "worm-gear-efficiency",
    "title": "Worm Gear Efficiency",
    "category": "manufacturing-workshop",
    "description": "Free online worm gear efficiency calculator. Get accurate calculations instantly.",
    "seoTitle": "Worm Gear Efficiency | SectorCalc",
    "seoDescription": "Free online worm gear efficiency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "helisacisi",
        "label": "helisacisi",
        "unit": "Rad",
        "type": "number",
        "helper": "Enter helisacisi"
      },
      {
        "key": "suratmaacisi",
        "label": "suratmaacisi",
        "unit": "Rad",
        "type": "number",
        "helper": "Enter suratmaacisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "load-bearing-wall",
    "title": "Load Bearing Wall",
    "category": "manufacturing-workshop",
    "description": "Free online load bearing wall calculator. Get accurate calculations instantly.",
    "seoTitle": "Load Bearing Wall | SectorCalc",
    "seoDescription": "Free online load bearing wall calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "duvaralani",
        "label": "duvaralani",
        "unit": "m2",
        "type": "number",
        "helper": "Enter duvaralani"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "surface-roughness-ra",
    "title": "Surface Roughness Ra",
    "category": "manufacturing-workshop",
    "description": "Calculate theoretical arithmetic average roughness (Ra) and peak-to-valley roughness (Rz) based on turning feed rate and insert nose radius.",
    "seoTitle": "Theoretical Surface Roughness Ra & Rz Turning Calculator | SectorCalc",
    "seoDescription": "Calculate theoretical turning surface roughness Ra and Rz from feed rate and tool insert nose radius. Free CNC machinist tool.",
    "inputs": [
      {
        "key": "feedRate",
        "label": "Feed Rate",
        "unit": "mm/rev",
        "type": "number",
        "helper": "Distance traveled by the tool insert per spindle revolution"
      },
      {
        "key": "noseRadius",
        "label": "Insert Nose Radius",
        "unit": "mm",
        "type": "number",
        "helper": "Insert tip radius (standard values e.g. 0.2, 0.4, 0.8, 1.2, 1.6 mm)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Machine spindle vibration and chatter",
      "Workpiece material built-up edge (BUE)",
      "Cutting fluid coolants lubrication"
    ]
  },
  {
    "slug": "floor-joist-deflection",
    "title": "Floor Joist Deflection",
    "category": "manufacturing-workshop",
    "description": "Free online floor joist deflection calculator. Get accurate calculations instantly.",
    "seoTitle": "Floor Joist Deflection | SectorCalc",
    "seoDescription": "Free online floor joist deflection calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "span",
        "label": "Clear Span length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter clear span length (m)"
      },
      {
        "key": "elasticModulus",
        "label": "Young's Modulus of Elasticity (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter young's modulus of elasticity (pa)"
      },
      {
        "key": "momentOfInertia",
        "label": "Area Moment of Inertia (m4)",
        "unit": "m4",
        "type": "number",
        "helper": "Enter area moment of inertia (m4)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "lvl-beam-capacity",
    "title": "Lvl Beam Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online lvl beam capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Lvl Beam Capacity | SectorCalc",
    "seoDescription": "Free online lvl beam capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kesitmodulu",
        "label": "kesitmodulu",
        "unit": "m3",
        "type": "number",
        "helper": "Enter kesitmodulu"
      },
      {
        "key": "egilmedayanimi",
        "label": "egilmedayanimi",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter egilmedayanimi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ridge-beam-calculator",
    "title": "Ridge Beam Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online ridge beam calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Ridge Beam Calculator | SectorCalc",
    "seoDescription": "Free online ridge beam calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "ridgeLoad",
        "label": "ridgeLoad",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter ridgeLoad"
      },
      {
        "key": "span",
        "label": "Clear Span length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter clear span length (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "shear-force-diagram",
    "title": "Shear Force Diagram",
    "category": "manufacturing-workshop",
    "description": "Free online shear force diagram calculator. Get accurate calculations instantly.",
    "seoTitle": "Shear Force Diagram | SectorCalc",
    "seoDescription": "Free online shear force diagram calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "archimedes-principle",
    "title": "Archimedes Principle",
    "category": "manufacturing-workshop",
    "description": "Free online archimedes principle calculator. Get accurate calculations instantly.",
    "seoTitle": "Archimedes Principle | SectorCalc",
    "seoDescription": "Free online archimedes principle calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "volume",
        "label": "volume",
        "unit": "m3",
        "type": "number",
        "helper": "Enter volume"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bernoulli-equation",
    "title": "Bernoulli Equation",
    "category": "manufacturing-workshop",
    "description": "Free online bernoulli equation calculator. Get accurate calculations instantly.",
    "seoTitle": "Bernoulli Equation | SectorCalc",
    "seoDescription": "Free online bernoulli equation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "p1",
        "label": "p1",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter p1"
      },
      {
        "key": "v1",
        "label": "v1",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter v1"
      },
      {
        "key": "v2",
        "label": "v2",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter v2"
      },
      {
        "key": "h1",
        "label": "h1",
        "unit": "m",
        "type": "number",
        "helper": "Enter h1"
      },
      {
        "key": "h2",
        "label": "h2",
        "unit": "m",
        "type": "number",
        "helper": "Enter h2"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "brinell-rockwell-conversion",
    "title": "Brinell Rockwell Conversion",
    "category": "manufacturing-workshop",
    "description": "Convert hardness values for steel between Brinell (HBW), Rockwell C (HRC), Vickers (HV), and Tensile Strength (Rm) scales based on ASTM E140 and ISO 18265.",
    "seoTitle": "Metal Hardness Conversion Calculator | HBW, HRC, HV, Rm | SectorCalc",
    "seoDescription": "Convert steel hardness values between Brinell HBW, Rockwell C HRC, Vickers HV, and Tensile Strength Rm using non-linear ASTM E140 polynomials.",
    "inputs": [
      {
        "key": "inputHardness",
        "label": "Input Hardness Value",
        "unit": "value",
        "type": "number",
        "helper": "Hardness number to convert (e.g. 300 for HV, 35 for HRC)"
      },
      {
        "key": "inputType",
        "label": "Source Hardness Scale",
        "unit": "select",
        "type": "select",
        "helper": "Select input hardness testing method and scale",
        "options": [
          { "label": "Brinell Hardness (HBW)", "value": "hbw" },
          { "label": "Rockwell C Hardness (HRC)", "value": "hrc" },
          { "label": "Vickers Hardness (HV)", "value": "hv" },
          { "label": "Tensile Strength (Rm) (MPa)", "value": "tensile" }
        ],
        "defaultValue": "hrc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Non-steel metal calibration tables",
      "Test indentation temperature effects",
      "Varying crystal grain alignments"
    ]
  },
  {
    "slug": "capillary-action",
    "title": "Capillary Action",
    "category": "manufacturing-workshop",
    "description": "Free online capillary action calculator. Get accurate calculations instantly.",
    "seoTitle": "Capillary Action | SectorCalc",
    "seoDescription": "Free online capillary action calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yuzeygerilimi",
        "label": "yuzeygerilimi",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter yuzeygerilimi"
      },
      {
        "key": "temasacisi",
        "label": "temasacisi",
        "unit": "Rad",
        "type": "number",
        "helper": "Enter temasacisi"
      },
      {
        "key": "radius",
        "label": "Component Outer Radius (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component outer radius (m)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "heat-conduction-fourier",
    "title": "Heat Conduction Fourier",
    "category": "manufacturing-workshop",
    "description": "Free online heat conduction fourier calculator. Get accurate calculations instantly.",
    "seoTitle": "Heat Conduction Fourier | SectorCalc",
    "seoDescription": "Free online heat conduction fourier calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "strikePrice",
        "label": "Strike Price (K)",
        "unit": "W/mK",
        "type": "number",
        "helper": "Enter strike price (k)"
      },
      {
        "key": "thickness",
        "label": "Wall Thickness (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter wall thickness (m)"
      },
      {
        "key": "temperatureDifference",
        "label": "Temperature Difference (K)",
        "unit": "K",
        "type": "number",
        "helper": "Enter temperature difference (k)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "energy-density",
    "title": "Energy Density",
    "category": "manufacturing-workshop",
    "description": "Free online energy density calculator. Get accurate calculations instantly.",
    "seoTitle": "Energy Density | SectorCalc",
    "seoDescription": "Free online energy density calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "enerji",
        "label": "enerji",
        "unit": "J",
        "type": "number",
        "helper": "Enter enerji"
      },
      {
        "key": "volume",
        "label": "volume",
        "unit": "m3",
        "type": "number",
        "helper": "Enter volume"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "phase-diagram-lever-rule",
    "title": "Phase Diagram Lever Rule",
    "category": "manufacturing-workshop",
    "description": "Free online phase diagram lever rule calculator. Get accurate calculations instantly.",
    "seoTitle": "Phase Diagram Lever Rule | SectorCalc",
    "seoDescription": "Free online phase diagram lever rule calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "c0",
        "label": "c0",
        "unit": "%",
        "type": "number",
        "helper": "Enter c0"
      },
      {
        "key": "cl",
        "label": "cl",
        "unit": "%",
        "type": "number",
        "helper": "Enter cl"
      },
      {
        "key": "cs",
        "label": "cs",
        "unit": "%",
        "type": "number",
        "helper": "Enter cs"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "photoelectric-effect",
    "title": "Photoelectric Effect",
    "category": "manufacturing-workshop",
    "description": "Free online photoelectric effect calculator. Get accurate calculations instantly.",
    "seoTitle": "Photoelectric Effect | SectorCalc",
    "seoDescription": "Free online photoelectric effect calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      },
      {
        "key": "esikenerji",
        "label": "esikenerji",
        "unit": "J",
        "type": "number",
        "helper": "Enter esikenerji"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "porosity-calculator",
    "title": "Porosity Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online porosity calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Porosity Calculator | SectorCalc",
    "seoDescription": "Free online porosity calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "boslukhacim",
        "label": "boslukhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter boslukhacim"
      },
      {
        "key": "toplamhacim",
        "label": "toplamhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter toplamhacim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "stokes-law",
    "title": "Stokes Law",
    "category": "manufacturing-workshop",
    "description": "Free online stokes law calculator. Get accurate calculations instantly.",
    "seoTitle": "Stokes Law | SectorCalc",
    "seoDescription": "Free online stokes law calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "radius",
        "label": "Component Outer Radius (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component outer radius (m)"
      },
      {
        "key": "parcacikyogunluk",
        "label": "parcacikyogunluk",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter parcacikyogunluk"
      },
      {
        "key": "akiskanyogunluk",
        "label": "akiskanyogunluk",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter akiskanyogunluk"
      },
      {
        "key": "viskozite",
        "label": "viskozite",
        "unit": "Pa.s",
        "type": "number",
        "helper": "Enter viskozite"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "terminal-velocity",
    "title": "Terminal Velocity",
    "category": "manufacturing-workshop",
    "description": "Free online terminal velocity calculator. Get accurate calculations instantly.",
    "seoTitle": "Terminal Velocity | SectorCalc",
    "seoDescription": "Free online terminal velocity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "direnckatsayisi",
        "label": "direnckatsayisi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter direnckatsayisi"
      },
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wavelength-frequency-speed",
    "title": "Wavelength Frequency Speed",
    "category": "manufacturing-workshop",
    "description": "Free online wavelength frequency speed calculator. Get accurate calculations instantly.",
    "seoTitle": "Wavelength Frequency Speed | SectorCalc",
    "seoDescription": "Free online wavelength frequency speed calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "hiz",
        "label": "hiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter hiz"
      },
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "density-converter",
    "title": "Density Converter",
    "category": "manufacturing-workshop",
    "description": "Free online density converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Density Converter | SectorCalc",
    "seoDescription": "Free online density converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "kgm3/gcm3/lbft3",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "surface-tension",
    "title": "Surface Tension",
    "category": "manufacturing-workshop",
    "description": "Free online surface tension calculator. Get accurate calculations instantly.",
    "seoTitle": "Surface Tension | SectorCalc",
    "seoDescription": "Free online surface tension calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kuvvet",
        "label": "kuvvet",
        "unit": "N",
        "type": "number",
        "helper": "Enter kuvvet"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "thermal-conductivity-converter",
    "title": "Thermal Conductivity Converter",
    "category": "manufacturing-workshop",
    "description": "Free online thermal conductivity converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Thermal Conductivity Converter | SectorCalc",
    "seoDescription": "Free online thermal conductivity converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "WmK/kcalmhC",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "adhesive-amount",
    "title": "Adhesive Amount",
    "category": "manufacturing-workshop",
    "description": "Estimate structural or wall tiling wet volume and dry weight of adhesive needed for an installation area including process waste margins.",
    "seoTitle": "Structural & Tile Adhesive Amount Calculator | Weight & Volume | SectorCalc",
    "seoDescription": "Calculate structural adhesive, epoxy, or tile thinset weight and volume. Inputs area, thickness, and material type.",
    "inputs": [
      {
        "key": "area",
        "label": "Tiling / Bonding Area",
        "unit": "m²",
        "type": "number",
        "helper": "Total target contact surface area"
      },
      {
        "key": "thickness",
        "label": "Adhesive Layer Thickness",
        "unit": "mm",
        "type": "number",
        "helper": "Average wet thickness of adhesive coating"
      },
      {
        "key": "adhesiveType",
        "label": "Adhesive Compound Type",
        "unit": "select",
        "type": "select",
        "helper": "Select material type (defines material density)",
        "options": [
          { "label": "Tile Thinset Mortar (Density ~ 1.6 kg/L)", "value": "tile_thinset" },
          { "label": "Contact Cement (Density ~ 0.85 kg/L)", "value": "contact_cement" },
          { "label": "Epoxy Adhesive (Density ~ 1.2 kg/L)", "value": "epoxy" },
          { "label": "Polyurethane Adhesive (Density ~ 1.4 kg/L)", "value": "polyurethane" }
        ],
        "defaultValue": "tile_thinset"
      },
      {
        "key": "wastePercent",
        "label": "Trowel & Scrap Waste Allowance",
        "unit": "%",
        "type": "number",
        "helper": "Extra material margins (normally 5% to 12%)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Substrate absorption porosity rates",
      "Trowel notch geometry profiles",
      "Two-part mixture blending losses"
    ]
  },
  {
    "slug": "wood-deck-calculator",
    "title": "Wood Deck Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online wood deck calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Wood Deck Calculator | SectorCalc",
    "seoDescription": "Free online wood deck calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "tahtaen",
        "label": "tahtaen",
        "unit": "m",
        "type": "number",
        "helper": "Enter tahtaen"
      },
      {
        "key": "tahtaboy",
        "label": "tahtaboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter tahtaboy"
      },
      {
        "key": "fire",
        "label": "fire",
        "unit": "%",
        "type": "number",
        "helper": "Enter fire"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "drywall-calculator",
    "title": "Drywall Calculator",
    "category": "manufacturing-workshop",
    "description": "Estimate total drywall sheets, joint compound, drywall screws, joint tape, and vertical wall studs needed for a specific partition area.",
    "seoTitle": "Drywall Material Estimator Calculator | Sheets, Studs, Screws | SectorCalc",
    "seoDescription": "Free drywall materials calculator. Estimate drywall sheets, framing studs, joint compound, screws, and tape for walls.",
    "inputs": [
      {
        "key": "wallArea",
        "label": "Total Partition Wall Area",
        "unit": "m²",
        "type": "number",
        "helper": "Sum of total surface areas of walls or ceilings to board"
      },
      {
        "key": "sheetSize",
        "label": "Drywall Sheet Dimensions",
        "unit": "select",
        "type": "select",
        "helper": "Select sheet size (defines area per sheet)",
        "options": [
          { "label": "1.2m × 2.4m (Standard 2.88 m²)", "value": "1.2x2.4" },
          { "label": "1.2m × 3.6m (Long 4.32 m²)", "value": "1.2x3.6" }
        ],
        "defaultValue": "1.2x2.4"
      },
      {
        "key": "wastePercent",
        "label": "Cutting Waste Factor",
        "unit": "%",
        "type": "number",
        "helper": "Scrap waste margin (typically 8% to 15% depending on corners)"
      },
      {
        "key": "studSpacing",
        "label": "Stud Spacing Center-to-Center",
        "unit": "select",
        "type": "select",
        "helper": "Distance between vertical framing studs",
        "options": [
          { "label": "400 mm spacing", "value": "400" },
          { "label": "600 mm spacing", "value": "600" }
        ],
        "defaultValue": "600"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "L-trim and corner bead allowances",
      "Door and window header extra framing studs",
      "Moisture-resistant greenboard pricing upgrades"
    ]
  },
  {
    "slug": "drywall-joint-compound",
    "title": "Drywall Joint Compound",
    "category": "manufacturing-workshop",
    "description": "Free online drywall joint compound calculator. Get accurate calculations instantly.",
    "seoTitle": "Drywall Joint Compound | SectorCalc",
    "seoDescription": "Free online drywall joint compound calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "sarfiyat",
        "label": "sarfiyat",
        "unit": "kg/m2",
        "type": "number",
        "helper": "Enter sarfiyat"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "siding-calculator",
    "title": "Siding Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online siding calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Siding Calculator | SectorCalc",
    "seoDescription": "Free online siding calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "panelen",
        "label": "panelen",
        "unit": "m",
        "type": "number",
        "helper": "Enter panelen"
      },
      {
        "key": "panelboy",
        "label": "panelboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter panelboy"
      },
      {
        "key": "fire",
        "label": "fire",
        "unit": "%",
        "type": "number",
        "helper": "Enter fire"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "soffit-calculator",
    "title": "Soffit Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online soffit calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Soffit Calculator | SectorCalc",
    "seoDescription": "Free online soffit calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cevre",
        "label": "cevre",
        "unit": "m",
        "type": "number",
        "helper": "Enter cevre"
      },
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "spray-paint-calculator",
    "title": "Spray Paint Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online spray paint calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Spray Paint Calculator | SectorCalc",
    "seoDescription": "Free online spray paint calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "katsayisi",
        "label": "katsayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter katsayisi"
      },
      {
        "key": "ortimeorani",
        "label": "ortimeorani",
        "unit": "m2/L",
        "type": "number",
        "helper": "Enter ortimeorani"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wood-stain-calculator",
    "title": "Wood Stain Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online wood stain calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Wood Stain Calculator | SectorCalc",
    "seoDescription": "Free online wood stain calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "sarfiyat",
        "label": "sarfiyat",
        "unit": "m2/L",
        "type": "number",
        "helper": "Enter sarfiyat"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "exterior-stucco",
    "title": "Exterior Stucco",
    "category": "manufacturing-workshop",
    "description": "Free online exterior stucco calculator. Get accurate calculations instantly.",
    "seoTitle": "Exterior Stucco | SectorCalc",
    "seoDescription": "Free online exterior stucco calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "thickness",
        "label": "Wall Thickness (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter wall thickness (m)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "baseboard-calculator",
    "title": "Baseboard Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online baseboard calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Baseboard Calculator | SectorCalc",
    "seoDescription": "Free online baseboard calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "odacevresi",
        "label": "odacevresi",
        "unit": "m",
        "type": "number",
        "helper": "Enter odacevresi"
      },
      {
        "key": "kapigenisligi",
        "label": "kapigenisligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter kapigenisligi"
      },
      {
        "key": "kapisayisi",
        "label": "kapisayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter kapisayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "chair-rail-calculator",
    "title": "Chair Rail Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online chair rail calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Chair Rail Calculator | SectorCalc",
    "seoDescription": "Free online chair rail calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "duvaruzunlugu",
        "label": "duvaruzunlugu",
        "unit": "m",
        "type": "number",
        "helper": "Enter duvaruzunlugu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wallpaper-calculator",
    "title": "Wallpaper Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online wallpaper calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Wallpaper Calculator | SectorCalc",
    "seoDescription": "Free online wallpaper calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "ruloen",
        "label": "ruloen",
        "unit": "m",
        "type": "number",
        "helper": "Enter ruloen"
      },
      {
        "key": "ruloboy",
        "label": "ruloboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter ruloboy"
      },
      {
        "key": "desentekrari",
        "label": "desentekrari",
        "unit": "m",
        "type": "number",
        "helper": "Enter desentekrari"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "tile-layout-calculator",
    "title": "Tile Layout Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online tile layout calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Tile Layout Calculator | SectorCalc",
    "seoDescription": "Free online tile layout calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alanen",
        "label": "alanen",
        "unit": "m",
        "type": "number",
        "helper": "Enter alanen"
      },
      {
        "key": "fayansen",
        "label": "fayansen",
        "unit": "m",
        "type": "number",
        "helper": "Enter fayansen"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "linoleum-vinyl-calculator",
    "title": "Linoleum Vinyl Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online linoleum vinyl calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Linoleum Vinyl Calculator | SectorCalc",
    "seoDescription": "Free online linoleum vinyl calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "ruloen",
        "label": "ruloen",
        "unit": "m",
        "type": "number",
        "helper": "Enter ruloen"
      },
      {
        "key": "fire",
        "label": "fire",
        "unit": "%",
        "type": "number",
        "helper": "Enter fire"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wood-siding-calculator",
    "title": "Wood Siding Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online wood siding calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Wood Siding Calculator | SectorCalc",
    "seoDescription": "Free online wood siding calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "tahtaen",
        "label": "tahtaen",
        "unit": "m",
        "type": "number",
        "helper": "Enter tahtaen"
      },
      {
        "key": "bindirmepayi",
        "label": "bindirmepayi",
        "unit": "m",
        "type": "number",
        "helper": "Enter bindirmepayi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "paver-calculator",
    "title": "Paver Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online paver calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Paver Calculator | SectorCalc",
    "seoDescription": "Free online paver calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "tasen",
        "label": "tasen",
        "unit": "m",
        "type": "number",
        "helper": "Enter tasen"
      },
      {
        "key": "tasboy",
        "label": "tasboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter tasboy"
      },
      {
        "key": "fire",
        "label": "fire",
        "unit": "%",
        "type": "number",
        "helper": "Enter fire"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "gravel-sand-calculator",
    "title": "Gravel Sand Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online gravel sand calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Gravel Sand Calculator | SectorCalc",
    "seoDescription": "Free online gravel sand calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "thickness",
        "label": "Wall Thickness (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter wall thickness (m)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "ton/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rainwater-harvesting",
    "title": "Rainwater Harvesting",
    "category": "manufacturing-workshop",
    "description": "Free online rainwater harvesting calculator. Get accurate calculations instantly.",
    "seoTitle": "Rainwater Harvesting | SectorCalc",
    "seoDescription": "Free online rainwater harvesting calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "catialani",
        "label": "catialani",
        "unit": "m2",
        "type": "number",
        "helper": "Enter catialani"
      },
      {
        "key": "yillikyagis",
        "label": "yillikyagis",
        "unit": "mm",
        "type": "number",
        "helper": "Enter yillikyagis"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "%",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "well-pump-capacity",
    "title": "Well Pump Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online well pump capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Well Pump Capacity | SectorCalc",
    "seoDescription": "Free online well pump capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "debi",
        "label": "debi",
        "unit": "m3/saat",
        "type": "number",
        "helper": "Enter debi"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "%",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "building-load-factor",
    "title": "Building Load Factor",
    "category": "manufacturing-workshop",
    "description": "Free online building load factor calculator. Get accurate calculations instantly.",
    "seoTitle": "Building Load Factor | SectorCalc",
    "seoDescription": "Free online building load factor calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "makstalep",
        "label": "makstalep",
        "unit": "kW",
        "type": "number",
        "helper": "Enter makstalep"
      },
      {
        "key": "kuruluguc",
        "label": "kuruluguc",
        "unit": "kW",
        "type": "number",
        "helper": "Enter kuruluguc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "breeam-leed-score",
    "title": "Breeam Leed Score",
    "category": "manufacturing-workshop",
    "description": "Free online breeam leed score calculator. Get accurate calculations instantly.",
    "seoTitle": "Breeam Leed Score | SectorCalc",
    "seoDescription": "Free online breeam leed score calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "enerji",
        "label": "enerji",
        "unit": "Number",
        "type": "number",
        "helper": "Enter enerji"
      },
      {
        "key": "su",
        "label": "su",
        "unit": "Number",
        "type": "number",
        "helper": "Enter su"
      },
      {
        "key": "malzeme",
        "label": "malzeme",
        "unit": "Number",
        "type": "number",
        "helper": "Enter malzeme"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "carbon-footprint",
    "title": "Carbon Footprint",
    "category": "manufacturing-workshop",
    "description": "Free online carbon footprint calculator. Get accurate calculations instantly.",
    "seoTitle": "Carbon Footprint | SectorCalc",
    "seoDescription": "Free online carbon footprint calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yakit",
        "label": "yakit",
        "unit": "L",
        "type": "number",
        "helper": "Enter yakit"
      },
      {
        "key": "elektrik",
        "label": "elektrik",
        "unit": "kWh",
        "type": "number",
        "helper": "Enter elektrik"
      },
      {
        "key": "supply",
        "label": "Product Supply Cost",
        "unit": "kgCO2",
        "type": "number",
        "helper": "Enter product supply cost"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "esg-score",
    "title": "Esg Score",
    "category": "manufacturing-workshop",
    "description": "Free online esg score calculator. Get accurate calculations instantly.",
    "seoTitle": "Esg Score | SectorCalc",
    "seoDescription": "Free online esg score calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cevre",
        "label": "cevre",
        "unit": "0-100",
        "type": "number",
        "helper": "Enter cevre"
      },
      {
        "key": "sosyal",
        "label": "sosyal",
        "unit": "0-100",
        "type": "number",
        "helper": "Enter sosyal"
      },
      {
        "key": "yonetisim",
        "label": "yonetisim",
        "unit": "0-100",
        "type": "number",
        "helper": "Enter yonetisim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "circular-economy",
    "title": "Circular Economy",
    "category": "manufacturing-workshop",
    "description": "Free online circular economy calculator. Get accurate calculations instantly.",
    "seoTitle": "Circular Economy | SectorCalc",
    "seoDescription": "Free online circular economy calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "gerikazanilan",
        "label": "gerikazanilan",
        "unit": "ton",
        "type": "number",
        "helper": "Enter gerikazanilan"
      },
      {
        "key": "toplamgirdi",
        "label": "toplamgirdi",
        "unit": "ton",
        "type": "number",
        "helper": "Enter toplamgirdi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "water-footprint",
    "title": "Water Footprint",
    "category": "manufacturing-workshop",
    "description": "Free online water footprint calculator. Get accurate calculations instantly.",
    "seoTitle": "Water Footprint | SectorCalc",
    "seoDescription": "Free online water footprint calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "uretimhacmi",
        "label": "uretimhacmi",
        "unit": "Ton",
        "type": "number",
        "helper": "Enter uretimhacmi"
      },
      {
        "key": "tuketilensu",
        "label": "tuketilensu",
        "unit": "m3",
        "type": "number",
        "helper": "Enter tuketilensu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "landfill-storage",
    "title": "Landfill Storage",
    "category": "manufacturing-workshop",
    "description": "Free online landfill storage calculator. Get accurate calculations instantly.",
    "seoTitle": "Landfill Storage | SectorCalc",
    "seoDescription": "Free online landfill storage calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "atikhacmi",
        "label": "atikhacmi",
        "unit": "m3",
        "type": "number",
        "helper": "Enter atikhacmi"
      },
      {
        "key": "sikistirma",
        "label": "sikistirma",
        "unit": "%",
        "type": "number",
        "helper": "Enter sikistirma"
      },
      {
        "key": "depth",
        "label": "Fluid Depth (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter fluid depth (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "recycling-rate",
    "title": "Recycling Rate",
    "category": "manufacturing-workshop",
    "description": "Free online recycling rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Recycling Rate | SectorCalc",
    "seoDescription": "Free online recycling rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "geridonusen",
        "label": "geridonusen",
        "unit": "ton",
        "type": "number",
        "helper": "Enter geridonusen"
      },
      {
        "key": "toplamatik",
        "label": "toplamatik",
        "unit": "ton",
        "type": "number",
        "helper": "Enter toplamatik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "watershed-management",
    "title": "Watershed Management",
    "category": "manufacturing-workshop",
    "description": "Free online watershed management calculator. Get accurate calculations instantly.",
    "seoTitle": "Watershed Management | SectorCalc",
    "seoDescription": "Free online watershed management calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "havzaalani",
        "label": "havzaalani",
        "unit": "km2",
        "type": "number",
        "helper": "Enter havzaalani"
      },
      {
        "key": "yagis",
        "label": "yagis",
        "unit": "mm",
        "type": "number",
        "helper": "Enter yagis"
      },
      {
        "key": "akiskatsayisi",
        "label": "akiskatsayisi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter akiskatsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "greywater-recovery",
    "title": "Greywater Recovery",
    "category": "manufacturing-workshop",
    "description": "Free online greywater recovery calculator. Get accurate calculations instantly.",
    "seoTitle": "Greywater Recovery | SectorCalc",
    "seoDescription": "Free online greywater recovery calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "grisuhacmi",
        "label": "grisuhacmi",
        "unit": "m3/gun",
        "type": "number",
        "helper": "Enter grisuhacmi"
      },
      {
        "key": "aritmamaliyet",
        "label": "aritmamaliyet",
        "unit": "USD/m3",
        "type": "number",
        "helper": "Enter aritmamaliyet"
      },
      {
        "key": "sebekefiyat",
        "label": "sebekefiyat",
        "unit": "USD/m3",
        "type": "number",
        "helper": "Enter sebekefiyat"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "quantum-tunneling",
    "title": "Quantum Tunneling",
    "category": "manufacturing-workshop",
    "description": "Free online quantum tunneling calculator. Get accurate calculations instantly.",
    "seoTitle": "Quantum Tunneling | SectorCalc",
    "seoDescription": "Free online quantum tunneling calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "engelgenisligi",
        "label": "engelgenisligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter engelgenisligi"
      },
      {
        "key": "engelyuksekligi",
        "label": "engelyuksekligi",
        "unit": "J",
        "type": "number",
        "helper": "Enter engelyuksekligi"
      },
      {
        "key": "enerji",
        "label": "enerji",
        "unit": "J",
        "type": "number",
        "helper": "Enter enerji"
      },
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "schrodinger-equation-1d",
    "title": "Schrodinger Equation 1d",
    "category": "manufacturing-workshop",
    "description": "Free online schrodinger equation 1d calculator. Get accurate calculations instantly.",
    "seoTitle": "Schrodinger Equation 1d | SectorCalc",
    "seoDescription": "Free online schrodinger equation 1d calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kuyugenisligi",
        "label": "kuyugenisligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter kuyugenisligi"
      },
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "kuantumsayisi",
        "label": "kuantumsayisi",
        "unit": "n",
        "type": "number",
        "helper": "Enter kuantumsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "compton-scattering",
    "title": "Compton Scattering",
    "category": "manufacturing-workshop",
    "description": "Free online compton scattering calculator. Get accurate calculations instantly.",
    "seoTitle": "Compton Scattering | SectorCalc",
    "seoDescription": "Free online compton scattering calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sacilmaacisi",
        "label": "sacilmaacisi",
        "unit": "Derece",
        "type": "number",
        "helper": "Enter sacilmaacisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "chandrasekhar-limit",
    "title": "Chandrasekhar Limit",
    "category": "manufacturing-workshop",
    "description": "Free online chandrasekhar limit calculator. Get accurate calculations instantly.",
    "seoTitle": "Chandrasekhar Limit | SectorCalc",
    "seoDescription": "Free online chandrasekhar limit calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "guneskutlesi",
        "label": "guneskutlesi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter guneskutlesi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "electrical-load-factor",
    "title": "Electrical Load Factor",
    "category": "manufacturing-workshop",
    "description": "Free online electrical load factor calculator. Get accurate calculations instantly.",
    "seoTitle": "Electrical Load Factor | SectorCalc",
    "seoDescription": "Free online electrical load factor calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "ortalamaguc",
        "label": "Average Power",
        "unit": "kW",
        "type": "number",
        "helper": "Enter average power consumption"
      },
      {
        "key": "pikguc",
        "label": "Peak Power",
        "unit": "kW",
        "type": "number",
        "helper": "Enter peak power demand"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fiber-optic-attenuation",
    "title": "Fiber Optic Attenuation",
    "category": "manufacturing-workshop",
    "description": "Free online fiber optic attenuation calculator. Get accurate calculations instantly.",
    "seoTitle": "Fiber Optic Attenuation | SectorCalc",
    "seoDescription": "Free online fiber optic attenuation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "km",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "birimkayip",
        "label": "birimkayip",
        "unit": "dB/km",
        "type": "number",
        "helper": "Enter birimkayip"
      },
      {
        "key": "ekkayip",
        "label": "ekkayip",
        "unit": "dB",
        "type": "number",
        "helper": "Enter ekkayip"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rf-antenna-sizing",
    "title": "Rf Antenna Sizing",
    "category": "manufacturing-workshop",
    "description": "Free online rf antenna sizing calculator. Get accurate calculations instantly.",
    "seoTitle": "Rf Antenna Sizing | SectorCalc",
    "seoDescription": "Free online rf antenna sizing calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "MHz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      },
      {
        "key": "tip",
        "label": "tip",
        "unit": "Dipole/Yagi",
        "type": "number",
        "helper": "Enter tip"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "beam-support-reactions",
    "title": "Beam Support Reactions",
    "category": "manufacturing-workshop",
    "description": "Free online beam support reactions calculator. Get accurate calculations instantly.",
    "seoTitle": "Beam Support Reactions | SectorCalc",
    "seoDescription": "Free online beam support reactions calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "yukkonum",
        "label": "yukkonum",
        "unit": "m",
        "type": "number",
        "helper": "Enter yukkonum"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "seed-sowing-density",
    "title": "Seed Sowing Density",
    "category": "manufacturing-workshop",
    "description": "Free online seed sowing density calculator. Get accurate calculations instantly.",
    "seoTitle": "Seed Sowing Density | SectorCalc",
    "seoDescription": "Free online seed sowing density calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "siraaraligi",
        "label": "siraaraligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter siraaraligi"
      },
      {
        "key": "uzerimesafe",
        "label": "uzerimesafe",
        "unit": "m",
        "type": "number",
        "helper": "Enter uzerimesafe"
      },
      {
        "key": "bintaneagirlik",
        "label": "bintaneagirlik",
        "unit": "g",
        "type": "number",
        "helper": "Enter bintaneagirlik"
      },
      {
        "key": "cimlenme",
        "label": "cimlenme",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter cimlenme"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "drip-irrigation-pipe-size",
    "title": "Drip Irrigation Pipe Size",
    "category": "manufacturing-workshop",
    "description": "Free online drip irrigation pipe size calculator. Get accurate calculations instantly.",
    "seoTitle": "Drip Irrigation Pipe Size | SectorCalc",
    "seoDescription": "Free online drip irrigation pipe size calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "damaticidebi",
        "label": "damaticidebi",
        "unit": "L/h",
        "type": "number",
        "helper": "Enter damaticidebi"
      },
      {
        "key": "damaticisayisi",
        "label": "damaticisayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter damaticisayisi"
      },
      {
        "key": "maxhiz",
        "label": "maxhiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter maxhiz"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "aerated-drying",
    "title": "Aerated Drying",
    "category": "manufacturing-workshop",
    "description": "Free online aerated drying calculator. Get accurate calculations instantly.",
    "seoTitle": "Aerated Drying | SectorCalc",
    "seoDescription": "Free online aerated drying calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "urunkutlesi",
        "label": "urunkutlesi",
        "unit": "kg",
        "type": "number",
        "helper": "Enter urunkutlesi"
      },
      {
        "key": "baslangicnem",
        "label": "baslangicnem",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter baslangicnem"
      },
      {
        "key": "hedefnem",
        "label": "hedefnem",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter hedefnem"
      },
      {
        "key": "havadebi",
        "label": "havadebi",
        "unit": "kg/s",
        "type": "number",
        "helper": "Enter havadebi"
      },
      {
        "key": "nemfarki",
        "label": "nemfarki",
        "unit": "kg/kg",
        "type": "number",
        "helper": "Enter nemfarki"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "silage-volume",
    "title": "Silage Volume",
    "category": "manufacturing-workshop",
    "description": "Free online silage volume calculator. Get accurate calculations instantly.",
    "seoTitle": "Silage Volume | SectorCalc",
    "seoDescription": "Free online silage volume calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "silohacim",
        "label": "silohacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter silohacim"
      },
      {
        "key": "sikistirmayogunlugu",
        "label": "sikistirmayogunlugu",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter sikistirmayogunlugu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "barn-ventilation",
    "title": "Barn Ventilation",
    "category": "manufacturing-workshop",
    "description": "Free online barn ventilation calculator. Get accurate calculations instantly.",
    "seoTitle": "Barn Ventilation | SectorCalc",
    "seoDescription": "Free online barn ventilation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      },
      {
        "key": "havadegisimsayisi",
        "label": "havadegisimsayisi",
        "unit": "Adet/saat",
        "type": "number",
        "helper": "Enter havadegisimsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ship-draft",
    "title": "Ship Draft",
    "category": "manufacturing-workshop",
    "description": "Free online ship draft calculator. Get accurate calculations instantly.",
    "seoTitle": "Ship Draft | SectorCalc",
    "seoDescription": "Free online ship draft calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "displacement",
        "label": "Spring Compression Displacement (m)",
        "unit": "ton",
        "type": "number",
        "helper": "Enter spring compression displacement (m)"
      },
      {
        "key": "suyogunlugu",
        "label": "suyogunlugu",
        "unit": "t/m3",
        "type": "number",
        "helper": "Enter suyogunlugu"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "blokkatsayi",
        "label": "blokkatsayi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter blokkatsayi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ship-stability-gm",
    "title": "Ship Stability Gm",
    "category": "manufacturing-workshop",
    "description": "Free online ship stability gm calculator. Get accurate calculations instantly.",
    "seoTitle": "Ship Stability Gm | SectorCalc",
    "seoDescription": "Free online ship stability gm calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kb",
        "label": "kb",
        "unit": "m",
        "type": "number",
        "helper": "Enter kb"
      },
      {
        "key": "bm",
        "label": "bm",
        "unit": "m",
        "type": "number",
        "helper": "Enter bm"
      },
      {
        "key": "kg",
        "label": "kg",
        "unit": "m",
        "type": "number",
        "helper": "Enter kg"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mooring-rope-breaking",
    "title": "Mooring Rope Breaking",
    "category": "manufacturing-workshop",
    "description": "Free online mooring rope breaking calculator. Get accurate calculations instantly.",
    "seoTitle": "Mooring Rope Breaking | SectorCalc",
    "seoDescription": "Free online mooring rope breaking calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "halatcapi",
        "label": "halatcapi",
        "unit": "mm",
        "type": "number",
        "helper": "Enter halatcapi"
      },
      {
        "key": "malzemekatsayisi",
        "label": "malzemekatsayisi",
        "unit": "N/mm2",
        "type": "number",
        "helper": "Enter malzemekatsayisi"
      },
      {
        "key": "guvenlikfaktoru",
        "label": "guvenlikfaktoru",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter guvenlikfaktoru"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "anchor-chain",
    "title": "Anchor Chain",
    "category": "manufacturing-workshop",
    "description": "Free online anchor chain calculator. Get accurate calculations instantly.",
    "seoTitle": "Anchor Chain | SectorCalc",
    "seoDescription": "Free online anchor chain calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "suderinligi",
        "label": "suderinligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter suderinligi"
      },
      {
        "key": "ruzgarhizi",
        "label": "ruzgarhizi",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter ruzgarhizi"
      },
      {
        "key": "dipkatsayisi",
        "label": "dipkatsayisi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter dipkatsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bilge-discharge",
    "title": "Bilge Discharge",
    "category": "manufacturing-workshop",
    "description": "Free online bilge discharge calculator. Get accurate calculations instantly.",
    "seoTitle": "Bilge Discharge | SectorCalc",
    "seoDescription": "Free online bilge discharge calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "tankhacim",
        "label": "tankhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter tankhacim"
      },
      {
        "key": "pompadebi",
        "label": "pompadebi",
        "unit": "m3/saat",
        "type": "number",
        "helper": "Enter pompadebi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bottom-hole-pressure",
    "title": "Bottom Hole Pressure",
    "category": "manufacturing-workshop",
    "description": "Free online bottom hole pressure calculator. Get accurate calculations instantly.",
    "seoTitle": "Bottom Hole Pressure | SectorCalc",
    "seoDescription": "Free online bottom hole pressure calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "camuryogunlugu",
        "label": "camuryogunlugu",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter camuryogunlugu"
      },
      {
        "key": "depth",
        "label": "Fluid Depth (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter fluid depth (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rotary-drilling-torque",
    "title": "Rotary Drilling Torque",
    "category": "manufacturing-workshop",
    "description": "Free online rotary drilling torque calculator. Get accurate calculations instantly.",
    "seoTitle": "Rotary Drilling Torque | SectorCalc",
    "seoDescription": "Free online rotary drilling torque calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "matkapcapi",
        "label": "matkapcapi",
        "unit": "m",
        "type": "number",
        "helper": "Enter matkapcapi"
      },
      {
        "key": "kayadayanim",
        "label": "kayadayanim",
        "unit": "MPa",
        "type": "number",
        "helper": "Enter kayadayanim"
      },
      {
        "key": "kesicikatsayi",
        "label": "kesicikatsayi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter kesicikatsayi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mud-circulation-velocity",
    "title": "Mud Circulation Velocity",
    "category": "manufacturing-workshop",
    "description": "Free online mud circulation velocity calculator. Get accurate calculations instantly.",
    "seoTitle": "Mud Circulation Velocity | SectorCalc",
    "seoDescription": "Free online mud circulation velocity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "camurdebi",
        "label": "camurdebi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter camurdebi"
      },
      {
        "key": "kuyucapi",
        "label": "kuyucapi",
        "unit": "m",
        "type": "number",
        "helper": "Enter kuyucapi"
      },
      {
        "key": "matkapcapi",
        "label": "matkapcapi",
        "unit": "m",
        "type": "number",
        "helper": "Enter matkapcapi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bored-pile-bearing-capacity",
    "title": "Bored Pile Bearing Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online bored pile bearing capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Bored Pile Bearing Capacity | SectorCalc",
    "seoDescription": "Free online bored pile bearing capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "diameter",
        "label": "Diameter (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter diameter (m)"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "kohezyon",
        "label": "kohezyon",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter kohezyon"
      },
      {
        "key": "friction",
        "label": "Belt-to-Pulley Friction Coefficient",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter belt-to-pulley friction coefficient"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "slope-safety-factor",
    "title": "Slope Safety Factor",
    "category": "manufacturing-workshop",
    "description": "Free online slope safety factor calculator. Get accurate calculations instantly.",
    "seoTitle": "Slope Safety Factor | SectorCalc",
    "seoDescription": "Free online slope safety factor calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kohezyon",
        "label": "kohezyon",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter kohezyon"
      },
      {
        "key": "normalgerilme",
        "label": "normalgerilme",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter normalgerilme"
      },
      {
        "key": "icsuratmaacisi",
        "label": "icsuratmaacisi",
        "unit": "Derece",
        "type": "number",
        "helper": "Enter icsuratmaacisi"
      },
      {
        "key": "kaymagerilmesi",
        "label": "kaymagerilmesi",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter kaymagerilmesi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fabric-weight",
    "title": "Fabric Weight",
    "category": "manufacturing-workshop",
    "description": "Free online fabric weight calculator. Get accurate calculations instantly.",
    "seoTitle": "Fabric Weight | SectorCalc",
    "seoDescription": "Free online fabric weight calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "gramaj",
        "label": "gramaj",
        "unit": "g/m2",
        "type": "number",
        "helper": "Enter gramaj"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "sewing-machine-cycle-time",
    "title": "Sewing Machine Cycle Time",
    "category": "manufacturing-workshop",
    "description": "Free online sewing machine cycle time calculator. Get accurate calculations instantly.",
    "seoTitle": "Sewing Machine Cycle Time | SectorCalc",
    "seoDescription": "Free online sewing machine cycle time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dikisuzunluk",
        "label": "dikisuzunluk",
        "unit": "mm",
        "type": "number",
        "helper": "Enter dikisuzunluk"
      },
      {
        "key": "devirsayisi",
        "label": "devirsayisi",
        "unit": "devir/dk",
        "type": "number",
        "helper": "Enter devirsayisi"
      },
      {
        "key": "dikissikligi",
        "label": "dikissikligi",
        "unit": "dikis/mm",
        "type": "number",
        "helper": "Enter dikissikligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bobbin-yarn-capacity",
    "title": "Bobbin Yarn Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online bobbin yarn capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Bobbin Yarn Capacity | SectorCalc",
    "seoDescription": "Free online bobbin yarn capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bobinagirlik",
        "label": "bobinagirlik",
        "unit": "g",
        "type": "number",
        "helper": "Enter bobinagirlik"
      },
      {
        "key": "ipliknumara",
        "label": "ipliknumara",
        "unit": "Nm",
        "type": "number",
        "helper": "Enter ipliknumara"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fabric-shrinkage",
    "title": "Fabric Shrinkage",
    "category": "manufacturing-workshop",
    "description": "Free online fabric shrinkage calculator. Get accurate calculations instantly.",
    "seoTitle": "Fabric Shrinkage | SectorCalc",
    "seoDescription": "Free online fabric shrinkage calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "hamolcu",
        "label": "hamolcu",
        "unit": "cm",
        "type": "number",
        "helper": "Enter hamolcu"
      },
      {
        "key": "bitmisolcu",
        "label": "bitmisolcu",
        "unit": "cm",
        "type": "number",
        "helper": "Enter bitmisolcu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "weaving-loom-efficiency",
    "title": "Weaving Loom Efficiency",
    "category": "manufacturing-workshop",
    "description": "Free online weaving loom efficiency calculator. Get accurate calculations instantly.",
    "seoTitle": "Weaving Loom Efficiency | SectorCalc",
    "seoDescription": "Free online weaving loom efficiency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "atimsayisi",
        "label": "atimsayisi",
        "unit": "atim/dk",
        "type": "number",
        "helper": "Enter atimsayisi"
      },
      {
        "key": "durussure",
        "label": "durussure",
        "unit": "dk",
        "type": "number",
        "helper": "Enter durussure"
      },
      {
        "key": "vardiyasure",
        "label": "vardiyasure",
        "unit": "dk",
        "type": "number",
        "helper": "Enter vardiyasure"
      },
      {
        "key": "kumassikligi",
        "label": "kumassikligi",
        "unit": "atim/cm",
        "type": "number",
        "helper": "Enter kumassikligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cold-storage-heat-gain",
    "title": "Cold Storage Heat Gain",
    "category": "manufacturing-workshop",
    "description": "Free online cold storage heat gain calculator. Get accurate calculations instantly.",
    "seoTitle": "Cold Storage Heat Gain | SectorCalc",
    "seoDescription": "Free online cold storage heat gain calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "u_katsayi",
        "label": "u_katsayi",
        "unit": "W/m2K",
        "type": "number",
        "helper": "Enter u_katsayi"
      },
      {
        "key": "dissicaklik",
        "label": "dissicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter dissicaklik"
      },
      {
        "key": "icsicaklik",
        "label": "icsicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter icsicaklik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "liquid-food-flow-energy",
    "title": "Liquid Food Flow Energy",
    "category": "manufacturing-workshop",
    "description": "Free online liquid food flow energy calculator. Get accurate calculations instantly.",
    "seoTitle": "Liquid Food Flow Energy | SectorCalc",
    "seoDescription": "Free online liquid food flow energy calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "debi",
        "label": "debi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter debi"
      },
      {
        "key": "basincdusumu",
        "label": "basincdusumu",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter basincdusumu"
      },
      {
        "key": "pompaverim",
        "label": "pompaverim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter pompaverim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "pasteurization-time",
    "title": "Pasteurization Time",
    "category": "manufacturing-workshop",
    "description": "Free online pasteurization time calculator. Get accurate calculations instantly.",
    "seoTitle": "Pasteurization Time | SectorCalc",
    "seoDescription": "Free online pasteurization time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "volume",
        "label": "volume",
        "unit": "m3",
        "type": "number",
        "helper": "Enter volume"
      },
      {
        "key": "debi",
        "label": "debi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter debi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "vacuum-packaging",
    "title": "Vacuum Packaging",
    "category": "manufacturing-workshop",
    "description": "Free online vacuum packaging calculator. Get accurate calculations instantly.",
    "seoTitle": "Vacuum Packaging | SectorCalc",
    "seoDescription": "Free online vacuum packaging calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "posethacim",
        "label": "posethacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter posethacim"
      },
      {
        "key": "pompadebi",
        "label": "pompadebi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter pompadebi"
      },
      {
        "key": "baslangicbasinc",
        "label": "baslangicbasinc",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter baslangicbasinc"
      },
      {
        "key": "hedefbasinc",
        "label": "hedefbasinc",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter hedefbasinc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "oven-capacity",
    "title": "Oven Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online oven capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Oven Capacity | SectorCalc",
    "seoDescription": "Free online oven capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "tavasayisi",
        "label": "tavasayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter tavasayisi"
      },
      {
        "key": "tavakapasite",
        "label": "tavakapasite",
        "unit": "kg",
        "type": "number",
        "helper": "Enter tavakapasite"
      },
      {
        "key": "pismesure",
        "label": "pismesure",
        "unit": "dk",
        "type": "number",
        "helper": "Enter pismesure"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "injection-clamping-tonnage",
    "title": "Injection Clamping Tonnage",
    "category": "manufacturing-workshop",
    "description": "Free online injection clamping tonnage calculator. Get accurate calculations instantly.",
    "seoTitle": "Injection Clamping Tonnage | SectorCalc",
    "seoDescription": "Free online injection clamping tonnage calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "projeksiyonalani",
        "label": "projeksiyonalani",
        "unit": "cm2",
        "type": "number",
        "helper": "Enter projeksiyonalani"
      },
      {
        "key": "kalipicbasinc",
        "label": "kalipicbasinc",
        "unit": "bar",
        "type": "number",
        "helper": "Enter kalipicbasinc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "plastic-cooling-time",
    "title": "Plastic Cooling Time",
    "category": "manufacturing-workshop",
    "description": "Free online plastic cooling time calculator. Get accurate calculations instantly.",
    "seoTitle": "Plastic Cooling Time | SectorCalc",
    "seoDescription": "Free online plastic cooling time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "etkalinlik",
        "label": "etkalinlik",
        "unit": "mm",
        "type": "number",
        "helper": "Enter etkalinlik"
      },
      {
        "key": "termaldifuzyon",
        "label": "termaldifuzyon",
        "unit": "mm2/s",
        "type": "number",
        "helper": "Enter termaldifuzyon"
      },
      {
        "key": "erimesicaklik",
        "label": "erimesicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter erimesicaklik"
      },
      {
        "key": "kalipsicaklik",
        "label": "kalipsicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter kalipsicaklik"
      },
      {
        "key": "firinsicaklik",
        "label": "firinsicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter firinsicaklik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "plastic-drying-time",
    "title": "Plastic Drying Time",
    "category": "manufacturing-workshop",
    "description": "Free online plastic drying time calculator. Get accurate calculations instantly.",
    "seoTitle": "Plastic Drying Time | SectorCalc",
    "seoDescription": "Free online plastic drying time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "malzemekutle",
        "label": "malzemekutle",
        "unit": "kg",
        "type": "number",
        "helper": "Enter malzemekutle"
      },
      {
        "key": "nemorani",
        "label": "nemorani",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter nemorani"
      },
      {
        "key": "havadebi",
        "label": "havadebi",
        "unit": "kg/s",
        "type": "number",
        "helper": "Enter havadebi"
      },
      {
        "key": "nemalmakapasite",
        "label": "nemalmakapasite",
        "unit": "kg/kg",
        "type": "number",
        "helper": "Enter nemalmakapasite"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "extruder-output",
    "title": "Extruder Output",
    "category": "manufacturing-workshop",
    "description": "Free online extruder output calculator. Get accurate calculations instantly.",
    "seoTitle": "Extruder Output | SectorCalc",
    "seoDescription": "Free online extruder output calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "vidahacim",
        "label": "vidahacim",
        "unit": "cm3/devir",
        "type": "number",
        "helper": "Enter vidahacim"
      },
      {
        "key": "devir",
        "label": "devir",
        "unit": "devir/dk",
        "type": "number",
        "helper": "Enter devir"
      },
      {
        "key": "eriyikyogunluk",
        "label": "eriyikyogunluk",
        "unit": "g/cm3",
        "type": "number",
        "helper": "Enter eriyikyogunluk"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mold-draft-angle",
    "title": "Mold Draft Angle",
    "category": "manufacturing-workshop",
    "description": "Free online mold draft angle calculator. Get accurate calculations instantly.",
    "seoTitle": "Mold Draft Angle | SectorCalc",
    "seoDescription": "Free online mold draft angle calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "parcaderinlik",
        "label": "parcaderinlik",
        "unit": "mm",
        "type": "number",
        "helper": "Enter parcaderinlik"
      },
      {
        "key": "buzulmeorani",
        "label": "buzulmeorani",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter buzulmeorani"
      },
      {
        "key": "yanyuzeyuzunluk",
        "label": "yanyuzeyuzunluk",
        "unit": "mm",
        "type": "number",
        "helper": "Enter yanyuzeyuzunluk"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fire-pump-power",
    "title": "Fire Pump Power",
    "category": "manufacturing-workshop",
    "description": "Free online fire pump power calculator. Get accurate calculations instantly.",
    "seoTitle": "Fire Pump Power | SectorCalc",
    "seoDescription": "Free online fire pump power calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "debi",
        "label": "debi",
        "unit": "L/dk",
        "type": "number",
        "helper": "Enter debi"
      },
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "bar",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "pompaverim",
        "label": "pompaverim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter pompaverim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "building-fire-load",
    "title": "Building Fire Load",
    "category": "manufacturing-workshop",
    "description": "Free online building fire load calculator. Get accurate calculations instantly.",
    "seoTitle": "Building Fire Load | SectorCalc",
    "seoDescription": "Free online building fire load calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yanicikutle",
        "label": "yanicikutle",
        "unit": "kg",
        "type": "number",
        "helper": "Enter yanicikutle"
      },
      {
        "key": "isildeger",
        "label": "isildeger",
        "unit": "MJ/kg",
        "type": "number",
        "helper": "Enter isildeger"
      },
      {
        "key": "katalani",
        "label": "katalani",
        "unit": "m2",
        "type": "number",
        "helper": "Enter katalani"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "sprinkler-flow-rate",
    "title": "Sprinkler Flow Rate",
    "category": "manufacturing-workshop",
    "description": "Free online sprinkler flow rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Sprinkler Flow Rate | SectorCalc",
    "seoDescription": "Free online sprinkler flow rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "k_faktoru",
        "label": "k_faktoru",
        "unit": "L/dk/bar^0.5",
        "type": "number",
        "helper": "Enter k_faktoru"
      },
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "bar",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "adc-resolution",
    "title": "Adc Resolution",
    "category": "manufacturing-workshop",
    "description": "Free online adc resolution calculator. Get accurate calculations instantly.",
    "seoTitle": "Adc Resolution | SectorCalc",
    "seoDescription": "Free online adc resolution calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bitsayisi",
        "label": "bitsayisi",
        "unit": "N",
        "type": "number",
        "helper": "Enter bitsayisi"
      },
      {
        "key": "refvoltaj",
        "label": "refvoltaj",
        "unit": "V",
        "type": "number",
        "helper": "Enter refvoltaj"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "amperes-law",
    "title": "Amperes Law",
    "category": "manufacturing-workshop",
    "description": "Free online amperes law calculator. Get accurate calculations instantly.",
    "seoTitle": "Amperes Law | SectorCalc",
    "seoDescription": "Free online amperes law calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akim",
        "label": "akim",
        "unit": "A",
        "type": "number",
        "helper": "Enter akim"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "biot-savart-law",
    "title": "Biot Savart Law",
    "category": "manufacturing-workshop",
    "description": "Free online biot savart law calculator. Get accurate calculations instantly.",
    "seoTitle": "Biot Savart Law | SectorCalc",
    "seoDescription": "Free online biot savart law calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akim",
        "label": "akim",
        "unit": "A",
        "type": "number",
        "helper": "Enter akim"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "aci",
        "label": "aci",
        "unit": "Derece",
        "type": "number",
        "helper": "Enter aci"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "capacitive-reactance",
    "title": "Capacitive Reactance",
    "category": "manufacturing-workshop",
    "description": "Free online capacitive reactance calculator. Get accurate calculations instantly.",
    "seoTitle": "Capacitive Reactance | SectorCalc",
    "seoDescription": "Free online capacitive reactance calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      },
      {
        "key": "kapasite",
        "label": "kapasite",
        "unit": "F",
        "type": "number",
        "helper": "Enter kapasite"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "inductive-reactance",
    "title": "Inductive Reactance",
    "category": "manufacturing-workshop",
    "description": "Free online inductive reactance calculator. Get accurate calculations instantly.",
    "seoTitle": "Inductive Reactance | SectorCalc",
    "seoDescription": "Free online inductive reactance calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      },
      {
        "key": "induktans",
        "label": "induktans",
        "unit": "H",
        "type": "number",
        "helper": "Enter induktans"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rc-time-constant",
    "title": "Rc Time Constant",
    "category": "manufacturing-workshop",
    "description": "Free online rc time constant calculator. Get accurate calculations instantly.",
    "seoTitle": "Rc Time Constant | SectorCalc",
    "seoDescription": "Free online rc time constant calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "ohm",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "c",
        "label": "c",
        "unit": "F",
        "type": "number",
        "helper": "Enter c"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rlc-resonant-frequency",
    "title": "Rlc Resonant Frequency",
    "category": "manufacturing-workshop",
    "description": "Free online rlc resonant frequency calculator. Get accurate calculations instantly.",
    "seoTitle": "Rlc Resonant Frequency | SectorCalc",
    "seoDescription": "Free online rlc resonant frequency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "l",
        "label": "l",
        "unit": "H",
        "type": "number",
        "helper": "Enter l"
      },
      {
        "key": "c",
        "label": "c",
        "unit": "F",
        "type": "number",
        "helper": "Enter c"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "ohm",
        "type": "number",
        "helper": "Enter interest rate"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "smith-chart-vswr",
    "title": "Smith Chart Vswr",
    "category": "manufacturing-workshop",
    "description": "Free online smith chart vswr calculator. Get accurate calculations instantly.",
    "seoTitle": "Smith Chart Vswr | SectorCalc",
    "seoDescription": "Free online smith chart vswr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yukempedans",
        "label": "yukempedans",
        "unit": "ohm",
        "type": "number",
        "helper": "Enter yukempedans"
      },
      {
        "key": "hatempedans",
        "label": "hatempedans",
        "unit": "ohm",
        "type": "number",
        "helper": "Enter hatempedans"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "signal-to-noise-ratio",
    "title": "Signal To Noise Ratio",
    "category": "manufacturing-workshop",
    "description": "Free online signal to noise ratio calculator. Get accurate calculations instantly.",
    "seoTitle": "Signal To Noise Ratio | SectorCalc",
    "seoDescription": "Free online signal to noise ratio calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sinyalguc",
        "label": "sinyalguc",
        "unit": "W",
        "type": "number",
        "helper": "Enter sinyalguc"
      },
      {
        "key": "gurultuguc",
        "label": "gurultuguc",
        "unit": "W",
        "type": "number",
        "helper": "Enter gurultuguc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "zero-to-hundred-acceleration",
    "title": "Zero To Hundred Acceleration",
    "category": "manufacturing-workshop",
    "description": "Free online zero to hundred acceleration calculator. Get accurate calculations instantly.",
    "seoTitle": "Zero To Hundred Acceleration | SectorCalc",
    "seoDescription": "Free online zero to hundred acceleration calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "torque",
        "label": "Applied Torsional Torque (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied torsional torque (n.m)"
      },
      {
        "key": "cekiskatsayisi",
        "label": "cekiskatsayisi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter cekiskatsayisi"
      },
      {
        "key": "havadirenci",
        "label": "havadirenci",
        "unit": "N",
        "type": "number",
        "helper": "Enter havadirenci"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "chain-drive",
    "title": "Chain Drive",
    "category": "manufacturing-workshop",
    "description": "Free online chain drive calculator. Get accurate calculations instantly.",
    "seoTitle": "Chain Drive | SectorCalc",
    "seoDescription": "Free online chain drive calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "z1",
        "label": "z1",
        "unit": "Dis",
        "type": "number",
        "helper": "Enter z1"
      },
      {
        "key": "z2",
        "label": "z2",
        "unit": "Dis",
        "type": "number",
        "helper": "Enter z2"
      },
      {
        "key": "adim",
        "label": "adim",
        "unit": "mm",
        "type": "number",
        "helper": "Enter adim"
      },
      {
        "key": "merkezc",
        "label": "merkezc",
        "unit": "mm",
        "type": "number",
        "helper": "Enter merkezc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ev-charging-time",
    "title": "Ev Charging Time",
    "category": "manufacturing-workshop",
    "description": "Free online ev charging time calculator. Get accurate calculations instantly.",
    "seoTitle": "Ev Charging Time | SectorCalc",
    "seoDescription": "Free online ev charging time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bataryakapasite",
        "label": "bataryakapasite",
        "unit": "kWh",
        "type": "number",
        "helper": "Enter bataryakapasite"
      },
      {
        "key": "sarjguc",
        "label": "sarjguc",
        "unit": "kW",
        "type": "number",
        "helper": "Enter sarjguc"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ev-range",
    "title": "Ev Range",
    "category": "manufacturing-workshop",
    "description": "Free online ev range calculator. Get accurate calculations instantly.",
    "seoTitle": "Ev Range | SectorCalc",
    "seoDescription": "Free online ev range calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bataryaenerji",
        "label": "bataryaenerji",
        "unit": "kWh",
        "type": "number",
        "helper": "Enter bataryaenerji"
      },
      {
        "key": "tuketim",
        "label": "tuketim",
        "unit": "Wh/km",
        "type": "number",
        "helper": "Enter tuketim"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "horsepower-converter",
    "title": "Horsepower Converter",
    "category": "manufacturing-workshop",
    "description": "Free online horsepower converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Horsepower Converter | SectorCalc",
    "seoDescription": "Free online horsepower converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "HP/kW/PS",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "indicated-horsepower",
    "title": "Indicated Horsepower",
    "category": "manufacturing-workshop",
    "description": "Free online indicated horsepower calculator. Get accurate calculations instantly.",
    "seoTitle": "Indicated Horsepower | SectorCalc",
    "seoDescription": "Free online indicated horsepower calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "strok",
        "label": "strok",
        "unit": "m",
        "type": "number",
        "helper": "Enter strok"
      },
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "devir",
        "label": "devir",
        "unit": "devir/dk",
        "type": "number",
        "helper": "Enter devir"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "engine-speed-torque",
    "title": "Engine Speed Torque",
    "category": "manufacturing-workshop",
    "description": "Free online engine speed torque calculator. Get accurate calculations instantly.",
    "seoTitle": "Engine Speed Torque | SectorCalc",
    "seoDescription": "Free online engine speed torque calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power (Watts)",
        "unit": "kW",
        "type": "number",
        "helper": "Enter transmitted power (watts)"
      },
      {
        "key": "devir",
        "label": "devir",
        "unit": "devir/dk",
        "type": "number",
        "helper": "Enter devir"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "motor-efficiency",
    "title": "Motor Efficiency",
    "category": "manufacturing-workshop",
    "description": "Free online motor efficiency calculator. Get accurate calculations instantly.",
    "seoTitle": "Motor Efficiency | SectorCalc",
    "seoDescription": "Free online motor efficiency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cikisguc",
        "label": "cikisguc",
        "unit": "W",
        "type": "number",
        "helper": "Enter cikisguc"
      },
      {
        "key": "girisguc",
        "label": "girisguc",
        "unit": "W",
        "type": "number",
        "helper": "Enter girisguc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "vehicle-top-speed",
    "title": "Vehicle Top Speed",
    "category": "manufacturing-workshop",
    "description": "Free online vehicle top speed calculator. Get accurate calculations instantly.",
    "seoTitle": "Vehicle Top Speed | SectorCalc",
    "seoDescription": "Free online vehicle top speed calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power (Watts)",
        "unit": "W",
        "type": "number",
        "helper": "Enter transmitted power (watts)"
      },
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "suratmakatsayi",
        "label": "suratmakatsayi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter suratmakatsayi"
      },
      {
        "key": "havadirenckatsayi",
        "label": "havadirenckatsayi",
        "unit": "kg/m",
        "type": "number",
        "helper": "Enter havadirenckatsayi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "runway-length-required",
    "title": "Runway Length Required",
    "category": "manufacturing-workshop",
    "description": "Free online runway length required calculator. Get accurate calculations instantly.",
    "seoTitle": "Runway Length Required | SectorCalc",
    "seoDescription": "Free online runway length required calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kalkishiz",
        "label": "kalkishiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter kalkishiz"
      },
      {
        "key": "ivme",
        "label": "ivme",
        "unit": "m/s2",
        "type": "number",
        "helper": "Enter ivme"
      },
      {
        "key": "ruzgarhiz",
        "label": "ruzgarhiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter ruzgarhiz"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "de-broglie-wavelength",
    "title": "De Broglie Wavelength",
    "category": "manufacturing-workshop",
    "description": "Free online de broglie wavelength calculator. Get accurate calculations instantly.",
    "seoTitle": "De Broglie Wavelength | SectorCalc",
    "seoDescription": "Free online de broglie wavelength calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "hiz",
        "label": "hiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter hiz"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "decibel-converter",
    "title": "Decibel Converter",
    "category": "manufacturing-workshop",
    "description": "Free online decibel converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Decibel Converter | SectorCalc",
    "seoDescription": "Free online decibel converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "rate",
        "label": "rate",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter rate"
      },
      {
        "key": "tip",
        "label": "tip",
        "unit": "Guc/Voltaj",
        "type": "number",
        "helper": "Enter tip"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "diopter-lens-power",
    "title": "Diopter Lens Power",
    "category": "manufacturing-workshop",
    "description": "Free online diopter lens power calculator. Get accurate calculations instantly.",
    "seoTitle": "Diopter Lens Power | SectorCalc",
    "seoDescription": "Free online diopter lens power calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "odakuzaklik",
        "label": "odakuzaklik",
        "unit": "m",
        "type": "number",
        "helper": "Enter odakuzaklik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "faraday-electrolysis",
    "title": "Faraday Electrolysis",
    "category": "manufacturing-workshop",
    "description": "Free online faraday electrolysis calculator. Get accurate calculations instantly.",
    "seoTitle": "Faraday Electrolysis | SectorCalc",
    "seoDescription": "Free online faraday electrolysis calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akim",
        "label": "akim",
        "unit": "A",
        "type": "number",
        "helper": "Enter akim"
      },
      {
        "key": "duration",
        "label": "Duration",
        "unit": "s",
        "type": "number",
        "helper": "Enter duration"
      },
      {
        "key": "esdegeragirlik",
        "label": "esdegeragirlik",
        "unit": "g/mol",
        "type": "number",
        "helper": "Enter esdegeragirlik"
      },
      {
        "key": "elektronsayisi",
        "label": "elektronsayisi",
        "unit": "n",
        "type": "number",
        "helper": "Enter elektronsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "magnetic-field-solenoid",
    "title": "Magnetic Field Solenoid",
    "category": "manufacturing-workshop",
    "description": "Free online magnetic field solenoid calculator. Get accurate calculations instantly.",
    "seoTitle": "Magnetic Field Solenoid | SectorCalc",
    "seoDescription": "Free online magnetic field solenoid calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akim",
        "label": "akim",
        "unit": "A",
        "type": "number",
        "helper": "Enter akim"
      },
      {
        "key": "sarimsayisi",
        "label": "sarimsayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter sarimsayisi"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "propagation-constant",
    "title": "Propagation Constant",
    "category": "manufacturing-workshop",
    "description": "Free online propagation constant calculator. Get accurate calculations instantly.",
    "seoTitle": "Propagation Constant | SectorCalc",
    "seoDescription": "Free online propagation constant calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "direnc",
        "label": "direnc",
        "unit": "ohm/m",
        "type": "number",
        "helper": "Enter direnc"
      },
      {
        "key": "induktans",
        "label": "induktans",
        "unit": "H/m",
        "type": "number",
        "helper": "Enter induktans"
      },
      {
        "key": "kapasite",
        "label": "kapasite",
        "unit": "F/m",
        "type": "number",
        "helper": "Enter kapasite"
      },
      {
        "key": "iletkenlik",
        "label": "iletkenlik",
        "unit": "S/m",
        "type": "number",
        "helper": "Enter iletkenlik"
      },
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "quality-factor-q",
    "title": "Quality Factor Q",
    "category": "manufacturing-workshop",
    "description": "Free online quality factor q calculator. Get accurate calculations instantly.",
    "seoTitle": "Quality Factor Q | SectorCalc",
    "seoDescription": "Free online quality factor q calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "rezonansfrekans",
        "label": "rezonansfrekans",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter rezonansfrekans"
      },
      {
        "key": "bantgenislik",
        "label": "bantgenislik",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter bantgenislik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "quantization-noise-sqnr",
    "title": "Quantization Noise Sqnr",
    "category": "manufacturing-workshop",
    "description": "Free online quantization noise sqnr calculator. Get accurate calculations instantly.",
    "seoTitle": "Quantization Noise Sqnr | SectorCalc",
    "seoDescription": "Free online quantization noise sqnr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bitsayisi",
        "label": "bitsayisi",
        "unit": "N",
        "type": "number",
        "helper": "Enter bitsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "tesla-unit-converter",
    "title": "Tesla Unit Converter",
    "category": "manufacturing-workshop",
    "description": "Free online tesla unit converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Tesla Unit Converter | SectorCalc",
    "seoDescription": "Free online tesla unit converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "T/G/Wb",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "battery-backup-capacity",
    "title": "Battery Backup Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online battery backup capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Battery Backup Capacity | SectorCalc",
    "seoDescription": "Free online battery backup capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akukapasite",
        "label": "akukapasite",
        "unit": "Ah",
        "type": "number",
        "helper": "Enter akukapasite"
      },
      {
        "key": "yukgucu",
        "label": "yukgucu",
        "unit": "W",
        "type": "number",
        "helper": "Enter yukgucu"
      },
      {
        "key": "dcvoltaj",
        "label": "dcvoltaj",
        "unit": "V",
        "type": "number",
        "helper": "Enter dcvoltaj"
      },
      {
        "key": "desarjderinligi",
        "label": "desarjderinligi",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter desarjderinligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "hydroelectric-power",
    "title": "Hydroelectric Power",
    "category": "manufacturing-workshop",
    "description": "Free online hydroelectric power calculator. Get accurate calculations instantly.",
    "seoTitle": "Hydroelectric Power | SectorCalc",
    "seoDescription": "Free online hydroelectric power calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "debi",
        "label": "debi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter debi"
      },
      {
        "key": "dusuyuksekligi",
        "label": "dusuyuksekligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter dusuyuksekligi"
      },
      {
        "key": "turbinverim",
        "label": "turbinverim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter turbinverim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wind-turbine-energy",
    "title": "Wind Turbine Energy",
    "category": "manufacturing-workshop",
    "description": "Free online wind turbine energy calculator. Get accurate calculations instantly.",
    "seoTitle": "Wind Turbine Energy | SectorCalc",
    "seoDescription": "Free online wind turbine energy calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kanatcapi",
        "label": "kanatcapi",
        "unit": "m",
        "type": "number",
        "helper": "Enter kanatcapi"
      },
      {
        "key": "ruzgarhizi",
        "label": "ruzgarhizi",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter ruzgarhizi"
      },
      {
        "key": "havayogunlugu",
        "label": "havayogunlugu",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter havayogunlugu"
      },
      {
        "key": "cp",
        "label": "cp",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter cp"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "carnot-efficiency",
    "title": "Carnot Efficiency",
    "category": "manufacturing-workshop",
    "description": "Free online carnot efficiency calculator. Get accurate calculations instantly.",
    "seoTitle": "Carnot Efficiency | SectorCalc",
    "seoDescription": "Free online carnot efficiency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sicakkaynak",
        "label": "sicakkaynak",
        "unit": "K",
        "type": "number",
        "helper": "Enter sicakkaynak"
      },
      {
        "key": "sogukkaynak",
        "label": "sogukkaynak",
        "unit": "K",
        "type": "number",
        "helper": "Enter sogukkaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ideal-gas-law",
    "title": "Ideal Gas Law",
    "category": "manufacturing-workshop",
    "description": "Free online ideal gas law calculator. Get accurate calculations instantly.",
    "seoTitle": "Ideal Gas Law | SectorCalc",
    "seoDescription": "Free online ideal gas law calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "volume",
        "label": "volume",
        "unit": "m3",
        "type": "number",
        "helper": "Enter volume"
      },
      {
        "key": "mol",
        "label": "mol",
        "unit": "n",
        "type": "number",
        "helper": "Enter mol"
      },
      {
        "key": "sicaklik",
        "label": "sicaklik",
        "unit": "K",
        "type": "number",
        "helper": "Enter sicaklik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "carbon-offset",
    "title": "Carbon Offset",
    "category": "manufacturing-workshop",
    "description": "Free online carbon offset calculator. Get accurate calculations instantly.",
    "seoTitle": "Carbon Offset | SectorCalc",
    "seoDescription": "Free online carbon offset calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "emisyon",
        "label": "emisyon",
        "unit": "tonCO2",
        "type": "number",
        "helper": "Enter emisyon"
      },
      {
        "key": "agacyillikyutak",
        "label": "agacyillikyutak",
        "unit": "kgCO2",
        "type": "number",
        "helper": "Enter agacyillikyutak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "data-backup-time",
    "title": "Data Backup Time",
    "category": "manufacturing-workshop",
    "description": "Free online data backup time calculator. Get accurate calculations instantly.",
    "seoTitle": "Data Backup Time | SectorCalc",
    "seoDescription": "Free online data backup time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "veriboyutu",
        "label": "veriboyutu",
        "unit": "TB",
        "type": "number",
        "helper": "Enter veriboyutu"
      },
      {
        "key": "sikistirmaorani",
        "label": "sikistirmaorani",
        "unit": "Oran",
        "type": "number",
        "helper": "Enter sikistirmaorani"
      },
      {
        "key": "aghizi",
        "label": "aghizi",
        "unit": "Gbps",
        "type": "number",
        "helper": "Enter aghizi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rsa-encryption-security",
    "title": "Rsa Encryption Security",
    "category": "manufacturing-workshop",
    "description": "Free online rsa encryption security calculator. Get accurate calculations instantly.",
    "seoTitle": "Rsa Encryption Security | SectorCalc",
    "seoDescription": "Free online rsa encryption security calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "rsa_anahtaruzunlugu",
        "label": "rsa_anahtaruzunlugu",
        "unit": "Bit",
        "type": "number",
        "helper": "Enter rsa_anahtaruzunlugu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "api-latency-sla",
    "title": "Api Latency Sla",
    "category": "manufacturing-workshop",
    "description": "Free online api latency sla calculator. Get accurate calculations instantly.",
    "seoTitle": "Api Latency Sla | SectorCalc",
    "seoDescription": "Free online api latency sla calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "toplamistek",
        "label": "toplamistek",
        "unit": "units",
        "type": "number",
        "helper": "Enter toplamistek"
      },
      {
        "key": "hataliistek",
        "label": "Faulty Requests",
        "unit": "units",
        "type": "number",
        "helper": "Enter number of faulty requests"
      },
      {
        "key": "toplamgecikme",
        "label": "toplamgecikme",
        "unit": "ms",
        "type": "number",
        "helper": "Enter toplamgecikme"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "drug-half-life",
    "title": "Drug Half Life",
    "category": "manufacturing-workshop",
    "description": "Free online drug half life calculator. Get accurate calculations instantly.",
    "seoTitle": "Drug Half Life | SectorCalc",
    "seoDescription": "Free online drug half life calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yarilanmaomru",
        "label": "yarilanmaomru",
        "unit": "Saat",
        "type": "number",
        "helper": "Enter yarilanmaomru"
      },
      {
        "key": "dozaraligi",
        "label": "dozaraligi",
        "unit": "Saat",
        "type": "number",
        "helper": "Enter dozaraligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "effective-radiation-dose",
    "title": "Effective Radiation Dose",
    "category": "manufacturing-workshop",
    "description": "Free online effective radiation dose calculator. Get accurate calculations instantly.",
    "seoTitle": "Effective Radiation Dose | SectorCalc",
    "seoDescription": "Free online effective radiation dose calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sogurulandoz",
        "label": "sogurulandoz",
        "unit": "mGy",
        "type": "number",
        "helper": "Enter sogurulandoz"
      },
      {
        "key": "dokuagirlikfaktoru",
        "label": "dokuagirlikfaktoru",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter dokuagirlikfaktoru"
      },
      {
        "key": "radyasyonturufaktoru",
        "label": "radyasyonturufaktoru",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter radyasyonturufaktoru"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "biosignal-sampling",
    "title": "Biosignal Sampling",
    "category": "manufacturing-workshop",
    "description": "Free online biosignal sampling calculator. Get accurate calculations instantly.",
    "seoTitle": "Biosignal Sampling | SectorCalc",
    "seoDescription": "Free online biosignal sampling calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "makssinyalfrekansi",
        "label": "makssinyalfrekansi",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter makssinyalfrekansi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mine-reserve-volume",
    "title": "Mine Reserve Volume",
    "category": "manufacturing-workshop",
    "description": "Free online mine reserve volume calculator. Get accurate calculations instantly.",
    "seoTitle": "Mine Reserve Volume | SectorCalc",
    "seoDescription": "Free online mine reserve volume calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "blokhacim",
        "label": "blokhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter blokhacim"
      },
      {
        "key": "cevheryogunlugu",
        "label": "cevheryogunlugu",
        "unit": "ton/m3",
        "type": "number",
        "helper": "Enter cevheryogunlugu"
      },
      {
        "key": "tenor",
        "label": "tenor",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter tenor"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "drilling-well-pressure",
    "title": "Drilling Well Pressure",
    "category": "manufacturing-workshop",
    "description": "Free online drilling well pressure calculator. Get accurate calculations instantly.",
    "seoTitle": "Drilling Well Pressure | SectorCalc",
    "seoDescription": "Free online drilling well pressure calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dikeyderinlik",
        "label": "dikeyderinlik",
        "unit": "m",
        "type": "number",
        "helper": "Enter dikeyderinlik"
      },
      {
        "key": "camuryogunlugu",
        "label": "camuryogunlugu",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter camuryogunlugu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "earthquake-magnitude-pga",
    "title": "Earthquake Magnitude Pga",
    "category": "manufacturing-workshop",
    "description": "Free online earthquake magnitude pga calculator. Get accurate calculations instantly.",
    "seoTitle": "Earthquake Magnitude Pga | SectorCalc",
    "seoDescription": "Free online earthquake magnitude pga calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "momentmagnitudu",
        "label": "momentmagnitudu",
        "unit": "Mw",
        "type": "number",
        "helper": "Enter momentmagnitudu"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "zeminkatsayisi",
        "label": "zeminkatsayisi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter zeminkatsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "joint-angular-velocity-torque",
    "title": "Joint Angular Velocity Torque",
    "category": "manufacturing-workshop",
    "description": "Free online joint angular velocity torque calculator. Get accurate calculations instantly.",
    "seoTitle": "Joint Angular Velocity Torque | SectorCalc",
    "seoDescription": "Free online joint angular velocity torque calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "eylemsizlikmomenti",
        "label": "eylemsizlikmomenti",
        "unit": "kg.m2",
        "type": "number",
        "helper": "Enter eylemsizlikmomenti"
      },
      {
        "key": "acisalivme",
        "label": "acisalivme",
        "unit": "rad/s2",
        "type": "number",
        "helper": "Enter acisalivme"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "training-load-trimp",
    "title": "Training Load Trimp",
    "category": "manufacturing-workshop",
    "description": "Free online training load trimp calculator. Get accurate calculations instantly.",
    "seoTitle": "Training Load Trimp | SectorCalc",
    "seoDescription": "Free online training load trimp calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "duration",
        "label": "Duration",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter duration"
      },
      {
        "key": "ortalamanabiz",
        "label": "Average Heart Rate",
        "unit": "BPM",
        "type": "number",
        "helper": "Enter average heart rate in BPM"
      },
      {
        "key": "restingHeartRate",
        "label": "Resting Heart Rate (BPM)",
        "unit": "BPM",
        "type": "number",
        "helper": "Enter resting heart rate (bpm)"
      },
      {
        "key": "maksnabiz",
        "label": "maksnabiz",
        "unit": "BPM",
        "type": "number",
        "helper": "Enter maksnabiz"
      },
      {
        "key": "gender",
        "label": "Gender",
        "unit": "Metin",
        "type": "select",
        "helper": "Enter gender",
        "options": [
          {
            "label": "Male",
            "value": "male"
          },
          {
            "label": "Female",
            "value": "female"
          }
        ],
        "defaultValue": "male"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "injury-risk-asymmetry",
    "title": "Injury Risk Asymmetry",
    "category": "manufacturing-workshop",
    "description": "Free online injury risk asymmetry calculator. Get accurate calculations instantly.",
    "seoTitle": "Injury Risk Asymmetry | SectorCalc",
    "seoDescription": "Free online injury risk asymmetry calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sagkuvvet",
        "label": "sagkuvvet",
        "unit": "N",
        "type": "number",
        "helper": "Enter sagkuvvet"
      },
      {
        "key": "solkuvvet",
        "label": "solkuvvet",
        "unit": "N",
        "type": "number",
        "helper": "Enter solkuvvet"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "building-solar-exposure",
    "title": "Building Solar Exposure",
    "category": "manufacturing-workshop",
    "description": "Free online building solar exposure calculator. Get accurate calculations instantly.",
    "seoTitle": "Building Solar Exposure | SectorCalc",
    "seoDescription": "Free online building solar exposure calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "enlem",
        "label": "enlem",
        "unit": "Derece",
        "type": "number",
        "helper": "Enter enlem"
      },
      {
        "key": "gunsayisi",
        "label": "gunsayisi",
        "unit": "1-365",
        "type": "number",
        "helper": "Enter gunsayisi"
      },
      {
        "key": "engelyukseklik",
        "label": "engelyukseklik",
        "unit": "m",
        "type": "number",
        "helper": "Enter engelyukseklik"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "traffic-signal-timing",
    "title": "Traffic Signal Timing",
    "category": "manufacturing-workshop",
    "description": "Free online traffic signal timing calculator. Get accurate calculations instantly.",
    "seoTitle": "Traffic Signal Timing | SectorCalc",
    "seoDescription": "Free online traffic signal timing calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dongusuresi",
        "label": "dongusuresi",
        "unit": "s",
        "type": "number",
        "helper": "Enter dongusuresi"
      },
      {
        "key": "yesilsure",
        "label": "yesilsure",
        "unit": "s",
        "type": "number",
        "helper": "Enter yesilsure"
      },
      {
        "key": "akishizi",
        "label": "akishizi",
        "unit": "arac/s",
        "type": "number",
        "helper": "Enter akishizi"
      },
      {
        "key": "doygunakis",
        "label": "doygunakis",
        "unit": "arac/s",
        "type": "number",
        "helper": "Enter doygunakis"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "environmental-noise-propagation",
    "title": "Environmental Noise Propagation",
    "category": "manufacturing-workshop",
    "description": "Free online environmental noise propagation calculator. Get accurate calculations instantly.",
    "seoTitle": "Environmental Noise Propagation | SectorCalc",
    "seoDescription": "Free online environmental noise propagation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sesgucu",
        "label": "sesgucu",
        "unit": "dB",
        "type": "number",
        "helper": "Enter sesgucu"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "zeminzayiflama",
        "label": "zeminzayiflama",
        "unit": "dB",
        "type": "number",
        "helper": "Enter zeminzayiflama"
      },
      {
        "key": "engelzayiflama",
        "label": "engelzayiflama",
        "unit": "dB",
        "type": "number",
        "helper": "Enter engelzayiflama"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "inverse-kinematics-2d-arm",
    "title": "Inverse Kinematics 2d Arm",
    "category": "manufacturing-workshop",
    "description": "Free online inverse kinematics 2d arm calculator. Get accurate calculations instantly.",
    "seoTitle": "Inverse Kinematics 2d Arm | SectorCalc",
    "seoDescription": "Free online inverse kinematics 2d arm calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "hedefx",
        "label": "hedefx",
        "unit": "m",
        "type": "number",
        "helper": "Enter hedefx"
      },
      {
        "key": "hedefy",
        "label": "hedefy",
        "unit": "m",
        "type": "number",
        "helper": "Enter hedefy"
      },
      {
        "key": "kol1uzunluk",
        "label": "kol1uzunluk",
        "unit": "m",
        "type": "number",
        "helper": "Enter kol1uzunluk"
      },
      {
        "key": "kol2uzunluk",
        "label": "kol2uzunluk",
        "unit": "m",
        "type": "number",
        "helper": "Enter kol2uzunluk"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "pid-controller-ziegler",
    "title": "Pid Controller Ziegler",
    "category": "manufacturing-workshop",
    "description": "Free online pid controller ziegler calculator. Get accurate calculations instantly.",
    "seoTitle": "Pid Controller Ziegler | SectorCalc",
    "seoDescription": "Free online pid controller ziegler calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kritikkazanc",
        "label": "Critical Gain",
        "unit": "Ku",
        "type": "number",
        "helper": "Enter critical gain value"
      },
      {
        "key": "kritikperiyot",
        "label": "Critical Period",
        "unit": "Tu",
        "type": "number",
        "helper": "Enter critical period value"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "kalman-filter-prediction",
    "title": "Kalman Filter Prediction",
    "category": "manufacturing-workshop",
    "description": "Free online kalman filter prediction calculator. Get accurate calculations instantly.",
    "seoTitle": "Kalman Filter Prediction | SectorCalc",
    "seoDescription": "Free online kalman filter prediction calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "oncekidurum",
        "label": "oncekidurum",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter oncekidurum"
      },
      {
        "key": "durumgecis",
        "label": "durumgecis",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter durumgecis"
      },
      {
        "key": "kontrolgirdisi",
        "label": "kontrolgirdisi",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter kontrolgirdisi"
      },
      {
        "key": "covariance",
        "label": "Covariance",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter covariance"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "h-index",
    "title": "H Index",
    "category": "manufacturing-workshop",
    "description": "Free online h index calculator. Get accurate calculations instantly.",
    "seoTitle": "H Index | SectorCalc",
    "seoDescription": "Free online h index calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "atifsayisi",
        "label": "atifsayisi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter atifsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "item-difficulty-discrimination",
    "title": "Item Difficulty Discrimination",
    "category": "manufacturing-workshop",
    "description": "Free online item difficulty discrimination calculator. Get accurate calculations instantly.",
    "seoTitle": "Item Difficulty Discrimination | SectorCalc",
    "seoDescription": "Free online item difficulty discrimination calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dogrucevap",
        "label": "dogrucevap",
        "unit": "units",
        "type": "number",
        "helper": "Enter dogrucevap"
      },
      {
        "key": "toplamogrenci",
        "label": "toplamogrenci",
        "unit": "units",
        "type": "number",
        "helper": "Enter toplamogrenci"
      },
      {
        "key": "ustgrupdogru",
        "label": "ustgrupdogru",
        "unit": "units",
        "type": "number",
        "helper": "Enter ustgrupdogru"
      },
      {
        "key": "altgrupdogru",
        "label": "altgrupdogru",
        "unit": "units",
        "type": "number",
        "helper": "Enter altgrupdogru"
      },
      {
        "key": "grupboyutu",
        "label": "grupboyutu",
        "unit": "units",
        "type": "number",
        "helper": "Enter grupboyutu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "sample-weighting",
    "title": "Sample Weighting",
    "category": "manufacturing-workshop",
    "description": "Free online sample weighting calculator. Get accurate calculations instantly.",
    "seoTitle": "Sample Weighting | SectorCalc",
    "seoDescription": "Free online sample weighting calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "tabakapopulasyon",
        "label": "tabakapopulasyon",
        "unit": "N_h",
        "type": "number",
        "helper": "Enter tabakapopulasyon"
      },
      {
        "key": "toplampopulasyon",
        "label": "toplampopulasyon",
        "unit": "N",
        "type": "number",
        "helper": "Enter toplampopulasyon"
      },
      {
        "key": "tabakaorneklem",
        "label": "tabakaorneklem",
        "unit": "n_h",
        "type": "number",
        "helper": "Enter tabakaorneklem"
      },
      {
        "key": "toplamorneklem",
        "label": "toplamorneklem",
        "unit": "n",
        "type": "number",
        "helper": "Enter toplamorneklem"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "life-insurance-premium",
    "title": "Life Insurance Premium",
    "category": "manufacturing-workshop",
    "description": "Free online life insurance premium calculator. Get accurate calculations instantly.",
    "seoTitle": "Life Insurance Premium | SectorCalc",
    "seoDescription": "Free online life insurance premium calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "beklenenhasar",
        "label": "beklenenhasar",
        "unit": "USD",
        "type": "number",
        "helper": "Enter beklenenhasar"
      },
      {
        "key": "gideryuklemesi",
        "label": "gideryuklemesi",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter gideryuklemesi"
      },
      {
        "key": "karmarji",
        "label": "karmarji",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter karmarji"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "compound-default-interest",
    "title": "Compound Default Interest",
    "category": "manufacturing-workshop",
    "description": "Free online compound default interest calculator. Get accurate calculations instantly.",
    "seoTitle": "Compound Default Interest | SectorCalc",
    "seoDescription": "Free online compound default interest calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "principal",
        "label": "Principal",
        "unit": "USD",
        "type": "number",
        "helper": "Enter principal"
      },
      {
        "key": "annualInterest",
        "label": "Annual Interest Rate (%)",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter annual interest rate (%)"
      },
      {
        "key": "gecikmegun",
        "label": "gecikmegun",
        "unit": "Gun",
        "type": "number",
        "helper": "Enter gecikmegun"
      },
      {
        "key": "bilesimsikligi",
        "label": "bilesimsikligi",
        "unit": "Gun",
        "type": "number",
        "helper": "Enter bilesimsikligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "statute-of-limitations-period",
    "title": "Statute Of Limitations Period",
    "category": "manufacturing-workshop",
    "description": "Free online statute of limitations period calculator. Get accurate calculations instantly.",
    "seoTitle": "Statute Of Limitations Period | SectorCalc",
    "seoDescription": "Free online statute of limitations period calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yasalsure",
        "label": "yasalsure",
        "unit": "years",
        "type": "number",
        "helper": "Enter yasalsure"
      },
      {
        "key": "kesintidurumu",
        "label": "Interruption Status",
        "unit": "Number",
        "type": "number",
        "helper": "Enter interruption status indicator"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  }
];