// Parameter descriptions and metadata for the info modal

export interface ParameterDescription {
  shortDescription: string;      // Left panel description
  aboutDescription: string;      // Right panel "About this variable"
  technicalDescription: string;  // Collapsible technical section
  formula: string;               // Mathematical formula (LaTeX-style or Unicode)
  unit: string;                  // e.g., "°C", "mm", "days"
  legendMin: number;
  legendMax: number;
  legendColors: string[];        // Gradient colors for legend
}

export const PARAMETER_DESCRIPTIONS: Record<string, ParameterDescription> = {
  // Precipitation parameters
  heavy_precip_10mm: {
    shortDescription: 'The number of days per year when rainfall exceeds 10mm. This indicator helps track the frequency of moderate to heavy rainfall events.',
    aboutDescription: 'Heavy Precipitation Days (10mm) measures how often significant rainfall occurs. This metric is important for understanding flood risk, agricultural planning, and water resource management.',
    technicalDescription: 'Annual count of days where daily precipitation total is greater than or equal to 10mm.',
    formula: 'Count(P ≥ 10mm)',
    unit: 'days',
    legendMin: 0,
    legendMax: 100,
    legendColors: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#084594']
  },
  heavy_precip_20mm: {
    shortDescription: 'The number of days per year when rainfall exceeds 20mm. This tracks very heavy rainfall events that can cause flooding.',
    aboutDescription: 'Heavy Precipitation Days (20mm) indicates the frequency of very heavy rainfall. These events are significant for flood management and infrastructure planning.',
    technicalDescription: 'Annual count of days where daily precipitation total is greater than or equal to 20mm.',
    formula: 'Count(P ≥ 20mm)',
    unit: 'days',
    legendMin: 0,
    legendMax: 60,
    legendColors: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#084594']
  },
  wet_days: {
    shortDescription: 'The total number of days per year with measurable precipitation (at least 1mm of rainfall).',
    aboutDescription: 'Wet Days counts how many days receive at least 1mm of precipitation. This helps understand rainfall patterns and their distribution throughout the year.',
    technicalDescription: 'Annual count of days where daily precipitation total is greater than or equal to 1mm.',
    formula: 'Count(P ≥ 1mm)',
    unit: 'days',
    legendMin: 0,
    legendMax: 200,
    legendColors: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#084594']
  },
  dry_days: {
    shortDescription: 'The total number of days per year with no significant precipitation (less than 1mm of rainfall).',
    aboutDescription: 'Dry Days counts days without significant rainfall. This indicator is crucial for understanding drought risk and water scarcity patterns.',
    technicalDescription: 'Annual count of days where daily precipitation total is less than 1mm.',
    formula: 'Count(P < 1mm)',
    unit: 'days',
    legendMin: 0,
    legendMax: 365,
    legendColors: ['#ffffd4', '#fed98e', '#fe9929', '#d95f0e', '#993404']
  },
  max_1day_precip: {
    shortDescription: 'The highest amount of rainfall recorded in a single day during the year. Indicates extreme rainfall intensity.',
    aboutDescription: 'Maximum 1-Day Precipitation shows the most intense single-day rainfall event. This is critical for flood risk assessment and drainage infrastructure design.',
    technicalDescription: 'Maximum daily precipitation total recorded in a single day during the annual period.',
    formula: 'max(P₁)',
    unit: 'mm',
    legendMin: 0,
    legendMax: 200,
    legendColors: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#084594']
  },
  max_3day_precip: {
    shortDescription: 'The highest cumulative rainfall over any 3-day period during the year. Indicates sustained heavy rainfall events.',
    aboutDescription: 'Maximum 3-Day Precipitation captures multi-day storm events. Extended heavy rainfall periods are important for understanding flood and landslide risks.',
    technicalDescription: 'Maximum cumulative precipitation total over any consecutive 3-day period during the annual period.',
    formula: 'max(P₁ + P₂ + P₃)',
    unit: 'mm',
    legendMin: 0,
    legendMax: 300,
    legendColors: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#084594']
  },
  max_5day_precip: {
    shortDescription: 'The highest cumulative rainfall over any 5-day period during the year. Tracks extended storm systems.',
    aboutDescription: 'Maximum 5-Day Precipitation measures prolonged wet periods. This indicator helps assess cumulative flood risk and soil saturation potential.',
    technicalDescription: 'Maximum cumulative precipitation total over any consecutive 5-day period during the annual period.',
    formula: 'max(Σᵢ₌₁⁵ Pᵢ)',
    unit: 'mm',
    legendMin: 0,
    legendMax: 400,
    legendColors: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#084594']
  },

  // Agriculture parameters
  maize_heat_units: {
    shortDescription: 'A specialized measure of heat accumulation for maize (corn) growth, accounting for both day and night temperatures.',
    aboutDescription: 'Maize Heat Units (MHU) are specifically designed for maize crop planning. They provide a more accurate prediction of maize development than standard growing degree days.',
    technicalDescription: 'Calculated using the Ontario Maize Heat Unit formula, which combines daytime maximum temperature contribution and nighttime minimum temperature contribution with specific thresholds for maize growth.',
    formula: 'MHU = Σ[(Ymax + Ymin)/2], Ymax = 3.33(Tmax-10) - 0.084(Tmax-10)²',
    unit: 'MHU',
    legendMin: 1000,
    legendMax: 4000,
    legendColors: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837']
  },
  gdd_base_5: {
    shortDescription: 'Growing Degree Days accumulate whenever the daily mean temperature is above 5°C. Useful for cool-season crops and pastures.',
    aboutDescription: 'Growing Degree Days (Base 5°C) track heat accumulation for plants that grow actively at lower temperatures. This includes many vegetables and cool-season grasses.',
    technicalDescription: 'Annual sum of degrees Celsius that each day\'s mean temperature exceeds 5°C. Values below the base temperature contribute zero to the total.',
    formula: 'GDD = Σ max(Tmean - 5, 0)',
    unit: 'Degree Days',
    legendMin: 0,
    legendMax: 5000,
    legendColors: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837']
  },
  gdd_base_10: {
    shortDescription: 'Growing Degree Days accumulate whenever the daily mean temperature is above 10°C. Standard measure for warm-season crops.',
    aboutDescription: 'Growing Degree Days (Base 10°C) are commonly used for warm-season crops like maize, soybeans, and many tropical plants. They indicate whether a climate is suitable for specific agricultural activities.',
    technicalDescription: 'Annual sum of degrees Celsius that each day\'s mean temperature exceeds 10°C. This is the most widely used GDD threshold for agricultural planning.',
    formula: 'GDD = Σ max(Tmean - 10, 0)',
    unit: 'Degree Days',
    legendMin: 0,
    legendMax: 4000,
    legendColors: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837']
  },
  gdd_base_15: {
    shortDescription: 'Growing Degree Days accumulate whenever the daily mean temperature is above 15°C. Used for heat-loving tropical crops.',
    aboutDescription: 'Growing Degree Days (Base 15°C) are relevant for crops requiring warm conditions, such as rice, cotton, and many tropical fruits.',
    technicalDescription: 'Annual sum of degrees Celsius that each day\'s mean temperature exceeds 15°C. Higher base temperatures are used for crops with greater heat requirements.',
    formula: 'GDD = Σ max(Tmean - 15, 0)',
    unit: 'Degree Days',
    legendMin: 0,
    legendMax: 3000,
    legendColors: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837']
  },
  gdd_base_4: {
    shortDescription: 'Growing Degree Days accumulate whenever the daily mean temperature is above 4°C. Used for cold-tolerant crops and early spring growth.',
    aboutDescription: 'Growing Degree Days (Base 4°C) track heat accumulation for cold-tolerant plants that begin growing at lower temperatures, including many temperate fruits and vegetables.',
    technicalDescription: 'Annual sum of degrees Celsius that each day\'s mean temperature exceeds 4°C. Lower base temperatures capture growing potential in cooler climates.',
    formula: 'GDD = Σ max(Tmean - 4, 0)',
    unit: 'Degree Days',
    legendMin: 0,
    legendMax: 6000,
    legendColors: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837']
  },

  // Hot Weather parameters
  very_hot_days_30: {
    shortDescription: 'The number of days per year when the maximum temperature exceeds 30°C. A key indicator of heat stress potential.',
    aboutDescription: 'Very Hot Days (+30°C) counts days that exceed a significant heat threshold. Temperatures above 30°C can affect human health, labor productivity, and livestock welfare.',
    technicalDescription: 'Annual count of days where daily maximum temperature is greater than or equal to 30°C.',
    formula: 'Count(Tmax ≥ 30°C)',
    unit: 'days',
    legendMin: 0,
    legendMax: 200,
    legendColors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  },
  warmest_max_temp: {
    shortDescription: 'The highest maximum temperature recorded during the year. Indicates peak heat intensity.',
    aboutDescription: 'Warmest Maximum Temperature shows the most extreme heat experienced in a year. This is critical for heat emergency planning and infrastructure resilience.',
    technicalDescription: 'The highest daily maximum temperature recorded during the annual period.',
    formula: 'max(Tmax)',
    unit: '°C',
    legendMin: 25,
    legendMax: 50,
    legendColors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  },
  heat_wave_count: {
    shortDescription: 'The number of distinct heat wave events per year, where a heat wave is defined as multiple consecutive very hot days.',
    aboutDescription: 'Number of Heat Waves tracks how often extended periods of extreme heat occur. Multiple heat waves in a year compound health risks and stress on infrastructure.',
    technicalDescription: 'Count of distinct heat wave events, where a heat wave is defined as 3 or more consecutive days with maximum temperature exceeding 32°C.',
    formula: 'N(events where Tmax ≥ 32°C for ≥ 3 consecutive days)',
    unit: 'events',
    legendMin: 0,
    legendMax: 20,
    legendColors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  },
  heat_wave_avg_length: {
    shortDescription: 'The average duration of heat wave events in days. Longer heat waves have more severe impacts.',
    aboutDescription: 'Average Length of Heat Waves indicates how long extreme heat events typically persist. Extended heat waves are particularly dangerous for human health.',
    technicalDescription: 'Mean duration (in days) of heat wave events during the annual period, where a heat wave is 3+ consecutive days above 32°C.',
    formula: 'Σ(heat wave days) / N(heat waves)',
    unit: 'days',
    legendMin: 0,
    legendMax: 15,
    legendColors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  },
  longest_hot_spell: {
    shortDescription: 'The longest consecutive sequence of days with maximum temperature above 30°C during the year.',
    aboutDescription: 'Longest Spell of +30°C Days shows the most extended period of sustained heat. This is important for understanding cumulative heat stress impacts.',
    technicalDescription: 'Maximum number of consecutive days during the annual period where daily maximum temperature exceeds 30°C.',
    formula: 'max(consecutive days where Tmax ≥ 30°C)',
    unit: 'days',
    legendMin: 0,
    legendMax: 100,
    legendColors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  },
  hot_season: {
    shortDescription: 'The length of the hot season, defined as the period when daily maximum temperatures regularly exceed 30°C.',
    aboutDescription: 'Hot Season Length indicates how long the extremely hot period lasts each year. A longer hot season affects energy demand, water usage, and outdoor activities.',
    technicalDescription: 'Duration of the annual period between the first and last occurrence of daily maximum temperature exceeding 30°C.',
    formula: 'Last(Tmax ≥ 30°C) - First(Tmax ≥ 30°C)',
    unit: 'days',
    legendMin: 0,
    legendMax: 250,
    legendColors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  },
  extreme_hot_32: {
    shortDescription: 'The number of days per year when the maximum temperature exceeds 32°C. Indicates severe heat conditions.',
    aboutDescription: 'Extremely Hot Days (+32°C) counts days with severe heat. Above 32°C, outdoor work becomes dangerous without precautions and heat-related illness risk increases.',
    technicalDescription: 'Annual count of days where daily maximum temperature is greater than or equal to 32°C.',
    formula: 'Count(Tmax ≥ 32°C)',
    unit: 'days',
    legendMin: 0,
    legendMax: 150,
    legendColors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  },
  extreme_hot_34: {
    shortDescription: 'The number of days per year when the maximum temperature exceeds 34°C. Indicates extreme heat conditions.',
    aboutDescription: 'Extremely Hot Days (+34°C) tracks the most severe heat days. At these temperatures, heat stroke risk is high and many outdoor activities become unsafe.',
    technicalDescription: 'Annual count of days where daily maximum temperature is greater than or equal to 34°C.',
    formula: 'Count(Tmax ≥ 34°C)',
    unit: 'days',
    legendMin: 0,
    legendMax: 100,
    legendColors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  },

  // Temperature parameters
  mean_temp: {
    shortDescription: 'The average of daily mean temperatures across the year. A fundamental climate indicator.',
    aboutDescription: 'Mean Temperature provides the overall thermal character of a location. Changes in mean temperature reflect broader climate trends.',
    technicalDescription: 'Annual average of daily mean temperatures, where daily mean is the average of daily maximum and minimum temperatures.',
    formula: 'Tmean = (Tmax + Tmin) / 2',
    unit: '°C',
    legendMin: 20,
    legendMax: 35,
    legendColors: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027']
  },
  max_temp: {
    shortDescription: 'The average of daily maximum temperatures across the year. Indicates typical daytime heat.',
    aboutDescription: 'Maximum Temperature averages show how hot days typically get. This affects energy demand for cooling and outdoor comfort.',
    technicalDescription: 'Annual average of daily maximum temperatures.',
    formula: 'Annual mean of daily Tmax',
    unit: '°C',
    legendMin: 25,
    legendMax: 40,
    legendColors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']
  },
  min_temp: {
    shortDescription: 'The average of daily minimum temperatures across the year. Indicates typical nighttime coolness.',
    aboutDescription: 'Minimum Temperature averages show how cool nights typically get. Nighttime cooling is important for human comfort and some agricultural processes.',
    technicalDescription: 'Annual average of daily minimum temperatures.',
    formula: 'Annual mean of daily Tmin',
    unit: '°C',
    legendMin: 15,
    legendMax: 30,
    legendColors: ['#0571b0', '#92c5de', '#f7f7f7', '#f4a582', '#ca0020']
  },

  // Cold Weather parameters
  coldest_min_temp: {
    shortDescription: 'The lowest minimum temperature recorded during the year. Indicates the coldest night.',
    aboutDescription: 'Coldest Minimum Temperature shows the most extreme cold experienced. In Ghana\'s tropical climate, this helps identify areas with cooler highland conditions.',
    technicalDescription: 'The lowest daily minimum temperature recorded during the annual period.',
    formula: 'min(Tmin)',
    unit: '°C',
    legendMin: 10,
    legendMax: 25,
    legendColors: ['#0571b0', '#92c5de', '#f7f7f7', '#f4a582', '#ca0020']
  },
};

// Helper to get description with fallback
export const getParameterDescription = (parameterId: string): ParameterDescription => {
  return PARAMETER_DESCRIPTIONS[parameterId] || {
    shortDescription: 'Climate parameter data for analysis.',
    aboutDescription: 'This climate variable provides insights into regional climate patterns and changes over time.',
    technicalDescription: 'Computed from climate model outputs.',
    formula: '',
    unit: '',
    legendMin: 0,
    legendMax: 100,
    legendColors: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#084594']
  };
};
