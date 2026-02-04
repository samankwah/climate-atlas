// Parameter definitions for each climate variable category
// Based on Canada Climate Atlas structure

import type { Category } from './CategoryTabs';

export interface Parameter {
  id: string;
  label: string;
  isExpandable?: boolean;
  children?: Parameter[];
}

export const CATEGORY_PARAMETERS: Record<Category, Parameter[]> = {
  precipitation: [
    { id: 'heavy_precip_10mm', label: 'Heavy Precipitation Days (10 mm)' },
    { id: 'heavy_precip_20mm', label: 'Heavy Precipitation Days (20 mm)' },
    { id: 'wet_days', label: 'Wet Days' },
    { id: 'dry_days', label: 'Dry Days' },
    { id: 'max_1day_precip', label: 'Max 1-Day Precipitation' },
    { id: 'max_3day_precip', label: 'Max 3-Day Precipitation' },
    { id: 'max_5day_precip', label: 'Max 5-Day Precipitation' },
  ],
  agriculture: [
    { id: 'maize_heat_units', label: 'Maize Heat Units' },
    { id: 'gdd_base_5', label: 'Growing Degree Days (Base 5 °C)' },
    { id: 'gdd_base_10', label: 'Growing Degree Days (Base 10 °C)' },
    { id: 'gdd_base_15', label: 'Growing Degree Days (Base 15 °C)' },
    { id: 'gdd_base_4', label: 'Growing Degree Days (Base 4 °C)' },
  ],
  hot_weather: [
    { id: 'very_hot_days_30', label: 'Very Hot Days (+30°C)' },
    { id: 'warmest_max_temp', label: 'Warmest Maximum Temperature' },
    { id: 'heat_wave_count', label: 'Number of Heat Waves' },
    { id: 'heat_wave_avg_length', label: 'Average Length of Heat Waves' },
    { id: 'longest_hot_spell', label: 'Longest Spell of +30 °C Days' },
    { id: 'hot_season', label: 'Hot (+30 °C) Season' },
    { id: 'extreme_hot_32', label: 'Extremely Hot Days (+32 °C)' },
    { id: 'extreme_hot_34', label: 'Extremely Hot Days (+34 °C)' },
  ],
  temperature: [
    { id: 'mean_temp', label: 'Mean Temperature', isExpandable: true },
    { id: 'max_temp', label: 'Maximum Temperature', isExpandable: true },
    { id: 'min_temp', label: 'Minimum Temperature', isExpandable: true },
  ],
  cold_weather: [
    { id: 'coldest_min_temp', label: 'Coldest Minimum Temperature' },
  ],
};

export const CATEGORY_COLORS: Record<Category, string> = {
  precipitation: '#0891b2', // cyan-600
  agriculture: '#65a30d',   // lime-600
  hot_weather: '#d97706',   // amber-600
  temperature: '#ea580c',   // orange-600
  cold_weather: '#0284c7',  // sky-600
};

export const getCategoryLabel = (category: Category): string => {
  const labels: Record<Category, string> = {
    precipitation: 'PRECIPITATION',
    agriculture: 'AGRICULTURE',
    hot_weather: 'HOT WEATHER',
    temperature: 'TEMPERATURE',
    cold_weather: 'COLD WEATHER',
  };
  return labels[category];
};
