import type { FreeTrafficTool } from "./types";

export const LOGISTICS_TRAVEL_TOOLS: readonly FreeTrafficTool[] = [
  {
    "slug": "economic-order-quantity-eoq",
    "title": "Economic Order Quantity Eoq",
    "category": "logistics-travel",
    "description": "Free online economic order quantity eoq calculator. Get accurate calculations instantly.",
    "seoTitle": "Economic Order Quantity Eoq | SectorCalc",
    "seoDescription": "Free online economic order quantity eoq calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualDemand",
        "label": "Annual Product Demand",
        "unit": "units",
        "type": "number",
        "helper": "Enter annual product demand"
      },
      {
        "key": "orderingCost",
        "label": "Order Placement Cost per Order",
        "unit": "USD",
        "type": "number",
        "helper": "Enter order placement cost per order"
      },
      {
        "key": "holdingCost",
        "label": "Inventory Carrying Cost per Unit/Year",
        "unit": "USD",
        "type": "number",
        "helper": "Enter inventory carrying cost per unit/year"
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
    "slug": "safety-stock-reorder-point",
    "title": "Safety Stock Reorder Point",
    "category": "logistics-travel",
    "description": "Free online safety stock reorder point calculator. Get accurate calculations instantly.",
    "seoTitle": "Safety Stock Reorder Point | SectorCalc",
    "seoDescription": "Free online safety stock reorder point calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "avgDemand",
        "label": "Average Daily Demand",
        "unit": "units",
        "type": "number",
        "helper": "Enter average daily demand"
      },
      {
        "key": "stdDev",
        "label": "Standard Deviation of Daily Demand",
        "unit": "units",
        "type": "number",
        "helper": "Enter standard deviation of daily demand"
      },
      {
        "key": "leadTime",
        "label": "Supplier Lead Time (Days)",
        "unit": "days",
        "type": "number",
        "helper": "Enter supplier lead time (days)"
      },
      {
        "key": "zScore",
        "label": "Service Level Factor (Z-Score)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter service level factor (z-score)"
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
    "slug": "inventory-turnover-ratio",
    "title": "Inventory Turnover Ratio",
    "category": "logistics-travel",
    "description": "Free online inventory turnover ratio calculator. Get accurate calculations instantly.",
    "seoTitle": "Inventory Turnover Ratio | SectorCalc",
    "seoDescription": "Free online inventory turnover ratio calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualCogs",
        "label": "Annual COGS (Cost of Goods Sold)",
        "unit": "USD",
        "type": "number",
        "helper": "Enter annual cogs (cost of goods sold)"
      },
      {
        "key": "avgInventory",
        "label": "Average Inventory",
        "unit": "USD",
        "type": "number",
        "helper": "Enter average inventory"
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
    "slug": "abc-inventory-classification",
    "title": "Abc Inventory Classification",
    "category": "logistics-travel",
    "description": "Free online abc inventory classification calculator. Get accurate calculations instantly.",
    "seoTitle": "Abc Inventory Classification | SectorCalc",
    "seoDescription": "Free online abc inventory classification calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualDemand",
        "label": "Annual Product Demand",
        "unit": "units",
        "type": "number",
        "helper": "Enter annual product demand"
      },
      {
        "key": "birimmaliyet",
        "label": "birimmaliyet",
        "unit": "USD",
        "type": "number",
        "helper": "Enter birimmaliyet"
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
    "slug": "shipping-container-box-loading",
    "title": "Shipping Container Box Loading",
    "category": "logistics-travel",
    "description": "Free online shipping container box loading calculator. Get accurate calculations instantly.",
    "seoTitle": "Shipping Container Box Loading | SectorCalc",
    "seoDescription": "Free online shipping container box loading calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "konteynerhacim",
        "label": "konteynerhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter konteynerhacim"
      },
      {
        "key": "kutuhacim",
        "label": "kutuhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter kutuhacim"
      },
      {
        "key": "istifleme",
        "label": "istifleme",
        "unit": "%",
        "type": "number",
        "helper": "Enter istifleme"
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
    "slug": "warehouse-pallet-storage-capacity",
    "title": "Warehouse Pallet Storage Capacity",
    "category": "logistics-travel",
    "description": "Free online warehouse pallet storage capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Warehouse Pallet Storage Capacity | SectorCalc",
    "seoDescription": "Free online warehouse pallet storage capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "toplamalan",
        "label": "toplamalan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter toplamalan"
      },
      {
        "key": "rafkullanimi",
        "label": "rafkullanimi",
        "unit": "%",
        "type": "number",
        "helper": "Enter rafkullanimi"
      },
      {
        "key": "paletalani",
        "label": "paletalani",
        "unit": "m2",
        "type": "number",
        "helper": "Enter paletalani"
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
    "slug": "freight-trucking-distance-cost",
    "title": "Freight Trucking Distance Cost",
    "category": "logistics-travel",
    "description": "Free online freight trucking distance cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Freight Trucking Distance Cost | SectorCalc",
    "seoDescription": "Free online freight trucking distance cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "tonaj",
        "label": "tonaj",
        "unit": "Ton",
        "type": "number",
        "helper": "Enter tonaj"
      },
      {
        "key": "unitPrice",
        "label": "unitPrice",
        "unit": "USD/Ton-km",
        "type": "number",
        "helper": "Enter unitprice"
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
    "slug": "fleet-fuel-distance-cost",
    "title": "Fleet Fuel Distance Cost",
    "category": "logistics-travel",
    "description": "Free online fleet fuel distance cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Fleet Fuel Distance Cost | SectorCalc",
    "seoDescription": "Free online fleet fuel distance cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "tuketim",
        "label": "tuketim",
        "unit": "L/100km",
        "type": "number",
        "helper": "Enter tuketim"
      },
      {
        "key": "litrefiyati",
        "label": "litrefiyati",
        "unit": "USD",
        "type": "number",
        "helper": "Enter litrefiyati"
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
    "slug": "aviation-passenger-seat-cost",
    "title": "Aviation Passenger Seat Cost",
    "category": "logistics-travel",
    "description": "Free online aviation passenger seat cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Aviation Passenger Seat Cost | SectorCalc",
    "seoDescription": "Free online aviation passenger seat cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "yolcusayisi",
        "label": "yolcusayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter yolcusayisi"
      },
      {
        "key": "koltukmaliyeti",
        "label": "koltukmaliyeti",
        "unit": "USD/km",
        "type": "number",
        "helper": "Enter koltukmaliyeti"
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
    "slug": "ride-hailing-taxi-uber-fare",
    "title": "Ride Hailing Taxi Uber Fare",
    "category": "logistics-travel",
    "description": "Free online ride hailing taxi uber fare calculator. Get accurate calculations instantly.",
    "seoTitle": "Ride Hailing Taxi Uber Fare | SectorCalc",
    "seoDescription": "Free online ride hailing taxi uber fare calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "acilis",
        "label": "acilis",
        "unit": "USD",
        "type": "number",
        "helper": "Enter acilis"
      },
      {
        "key": "kmfiyati",
        "label": "kmfiyati",
        "unit": "USD",
        "type": "number",
        "helper": "Enter kmfiyati"
      },
      {
        "key": "dakikafiyati",
        "label": "dakikafiyati",
        "unit": "USD",
        "type": "number",
        "helper": "Enter dakikafiyati"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "duration",
        "label": "Duration",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter duration"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
];