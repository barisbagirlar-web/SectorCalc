import type { FreeTrafficTool } from "./types";

export const HEALTH_BODY_TOOLS: readonly FreeTrafficTool[] = [
  {
    "slug": "body-mass-index-bmi",
    "title": "Body Mass Index Bmi",
    "category": "health-body",
    "description": "Free online body mass index bmi calculator. Get accurate calculations instantly.",
    "seoTitle": "Body Mass Index Bmi | SectorCalc",
    "seoDescription": "Free online body mass index bmi calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "weight",
        "label": "weight",
        "unit": "kg",
        "type": "number",
        "helper": "Enter weight"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "body-fat-percentage-navy",
    "title": "Body Fat Percentage Navy",
    "category": "health-body",
    "description": "Free online body fat percentage navy calculator. Get accurate calculations instantly.",
    "seoTitle": "Body Fat Percentage Navy | SectorCalc",
    "seoDescription": "Free online body fat percentage navy calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "waist",
        "label": "Waist Circumference",
        "unit": "cm",
        "type": "number",
        "helper": "Enter waist circumference"
      },
      {
        "key": "neck",
        "label": "Neck Circumference",
        "unit": "cm",
        "type": "number",
        "helper": "Enter neck circumference"
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
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "basal-metabolic-rate-bmr",
    "title": "Basal Metabolic Rate Bmr",
    "category": "health-body",
    "description": "Free online basal metabolic rate bmr calculator. Get accurate calculations instantly.",
    "seoTitle": "Basal Metabolic Rate Bmr | SectorCalc",
    "seoDescription": "Free online basal metabolic rate bmr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "weight",
        "label": "weight",
        "unit": "kg",
        "type": "number",
        "helper": "Enter weight"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "yas",
        "label": "yas",
        "unit": "years",
        "type": "number",
        "helper": "Enter yas"
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
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "daily-calorie-expenditure-tdee",
    "title": "Daily Calorie Expenditure Tdee",
    "category": "health-body",
    "description": "Free online daily calorie expenditure tdee calculator. Get accurate calculations instantly.",
    "seoTitle": "Daily Calorie Expenditure Tdee | SectorCalc",
    "seoDescription": "Free online daily calorie expenditure tdee calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bmr",
        "label": "bmr",
        "unit": "kcal",
        "type": "number",
        "helper": "Enter bmr"
      },
      {
        "key": "activityLevel",
        "label": "Activity Level Factor",
        "unit": "Number",
        "type": "number",
        "helper": "Enter activity level factor"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "target-heart-rate-karvonen",
    "title": "Target Heart Rate Karvonen",
    "category": "health-body",
    "description": "Free online target heart rate karvonen calculator. Get accurate calculations instantly.",
    "seoTitle": "Target Heart Rate Karvonen | SectorCalc",
    "seoDescription": "Free online target heart rate karvonen calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yas",
        "label": "yas",
        "unit": "years",
        "type": "number",
        "helper": "Enter yas"
      },
      {
        "key": "restingHeartRate",
        "label": "Resting Heart Rate (BPM)",
        "unit": "BPM",
        "type": "number",
        "helper": "Enter resting heart rate (bpm)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "%",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "vo2max-aerobic-capacity-cooper",
    "title": "Vo2max Aerobic Capacity Cooper",
    "category": "health-body",
    "description": "Free online vo2max aerobic capacity cooper calculator. Get accurate calculations instantly.",
    "seoTitle": "Vo2max Aerobic Capacity Cooper | SectorCalc",
    "seoDescription": "Free online vo2max aerobic capacity cooper calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "runDistance",
        "label": "Run Distance (Meters)",
        "unit": "m",
        "type": "number",
        "helper": "Enter run distance (meters)"
      },
      {
        "key": "duration",
        "label": "Duration",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter duration"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "macronutrient-gram-split-goals",
    "title": "Macronutrient Gram Split Goals",
    "category": "health-body",
    "description": "Free online macronutrient gram split goals calculator. Get accurate calculations instantly.",
    "seoTitle": "Macronutrient Gram Split Goals | SectorCalc",
    "seoDescription": "Free online macronutrient gram split goals calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "tdee",
        "label": "tdee",
        "unit": "kcal",
        "type": "number",
        "helper": "Enter tdee"
      },
      {
        "key": "protein",
        "label": "protein",
        "unit": "%",
        "type": "number",
        "helper": "Enter protein"
      },
      {
        "key": "yag",
        "label": "yag",
        "unit": "%",
        "type": "number",
        "helper": "Enter yag"
      },
      {
        "key": "karb",
        "label": "karb",
        "unit": "%",
        "type": "number",
        "helper": "Enter karb"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "daily-water-hydration-intake",
    "title": "Daily Water Hydration Intake",
    "category": "health-body",
    "description": "Free online daily water hydration intake calculator. Get accurate calculations instantly.",
    "seoTitle": "Daily Water Hydration Intake | SectorCalc",
    "seoDescription": "Free online daily water hydration intake calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "weight",
        "label": "weight",
        "unit": "kg",
        "type": "number",
        "helper": "Enter weight"
      },
      {
        "key": "activityDuration",
        "label": "Activity Duration (Mins)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter activity duration (mins)"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
];