# Ghana Climate Atlas - Full Implementation Plan

## Overview
Build an interactive web map for Ghana showing climate projections (temperature + rainfall) across districts, modeled after Canada's Climate Atlas.

**Tech Stack:**
- Frontend: React 18 + Leaflet + TypeScript
- Backend: Python FastAPI
- Data: GeoJSON (districts), preprocessed climate CSVs
- Database: SQLite (dev) / PostgreSQL (production)

---

## Project Structure

```
atlas-gh/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/
│   │   │   │   ├── GhanaMap.tsx        # Main Leaflet map
│   │   │   │   ├── DistrictLayer.tsx   # Choropleth polygons
│   │   │   │   └── Legend.tsx          # Color scale legend
│   │   │   ├── Controls/
│   │   │   │   ├── VariableSelector.tsx
│   │   │   │   ├── TimePeriodSlider.tsx
│   │   │   │   ├── ScenarioToggle.tsx
│   │   │   │   └── LayerPanel.tsx
│   │   │   ├── InfoPanel/
│   │   │   │   ├── DistrictInfo.tsx
│   │   │   │   └── VariableDescription.tsx
│   │   │   └── Layout/
│   │   │       ├── Header.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── hooks/
│   │   │   ├── useClimateData.ts
│   │   │   └── useMapControls.ts
│   │   ├── types/
│   │   │   └── climate.ts
│   │   ├── utils/
│   │   │   └── colorScales.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── ghana-districts.geojson
│   └── package.json
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── climate.py
│   │   │   └── districts.py
│   │   ├── models/
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   └── climate_service.py
│   │   └── data/
│   │       ├── ghana_districts.geojson
│   │       └── climate_projections.db
│   ├── requirements.txt
│   └── README.md
│
├── data-processing/             # Python scripts
│   ├── scripts/
│   │   ├── download_climate_data.py
│   │   ├── process_temperature.py
│   │   ├── process_rainfall.py
│   │   └── aggregate_by_district.py
│   ├── raw/
│   ├── processed/
│   └── requirements.txt
│
└── README.md
```

---

## Phase 1: Data Acquisition

### 1.1 Ghana District Boundaries
- Source: ArcGIS Hub Africa Geoportal
- URL: https://hub.arcgis.com/datasets/africageoportal::ghana-administrative-boundaries
- Format: GeoJSON with 260+ districts

### 1.2 Climate Projections (KAPy / Ghana Climate Atlas)

**Source**: Ghana Meteorological Agency (GMet) Climate Atlas
- Website: https://www.meteo.gov.gh/climate-atlas/
- Data Request: https://www.meteo.gov.gh/data-request/
- Powered by: KAPy framework (https://github.com/Klimaatlas/KAPy)
- Based on: 39 CORDEX-Africa downscaled climate models

**Variables needed:**
- `tas` - Mean temperature (°C)
- `tasmax` - Maximum temperature (°C)
- `pr` - Precipitation (mm)
- `hot_days` - Days above 35°C
- `dry_days` - Consecutive dry days

**Scenarios:**
- RCP4.5 (moderate emissions)
- RCP8.5 (high emissions)

**Time Periods:**
- Baseline (1991-2020)
- Near-term (2021-2050)
- Mid-term (2041-2070)
- Long-term (2071-2100)

**Data Formats Available:**
- Excel (.xlsx)
- NetCDF (.nc)

---

## Phase 2: Data Processing Pipeline

### 2.1 Temperature Variables
```python
# Per district, per scenario, per period:
annual_mean_temp      # Average of daily mean temps
annual_max_temp       # Average of daily max temps
very_hot_days         # Days where max > 35°C
extreme_hot_days      # Days where max > 40°C
cooling_degree_days   # Sum of (temp - 24°C) when temp > 24°C
```

### 2.2 Rainfall Variables
```python
# Per district, per scenario, per period:
annual_precipitation  # Total mm per year
wet_season_total      # Apr-Oct total (Ghana's rainy season)
dry_days              # Days with < 1mm precipitation
heavy_rain_days       # Days with > 20mm
max_consecutive_dry   # Longest dry spell
```

### 2.3 Output Data Format
```json
{
  "district_id": "GH-AA-001",
  "district_name": "Accra Metropolitan",
  "region": "Greater Accra",
  "centroid": [5.6037, -0.1870],
  "climate": {
    "annual_max_temp": {
      "baseline": 32.1,
      "2030_rcp45": 33.2,
      "2030_rcp85": 33.8,
      "2050_rcp45": 34.1,
      "2050_rcp85": 35.2,
      "2080_rcp45": 34.8,
      "2080_rcp85": 37.1
    },
    "annual_precipitation": {
      "baseline": 810,
      "2030_rcp45": 795,
      "2030_rcp85": 780,
      "2050_rcp45": 770,
      "2050_rcp85": 745,
      "2080_rcp45": 760,
      "2080_rcp85": 710
    },
    "very_hot_days": {
      "baseline": 15,
      "2030_rcp45": 28,
      "2030_rcp85": 35,
      "2050_rcp45": 45,
      "2050_rcp85": 62,
      "2080_rcp45": 58,
      "2080_rcp85": 95
    }
  }
}
```

---

## Phase 3: Backend API (FastAPI)

### 3.1 Directory Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── climate.py
│   │   └── districts.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── climate_service.py
│   └── data/
│       └── (data files)
├── tests/
│   └── test_api.py
├── requirements.txt
└── README.md
```

### 3.2 API Endpoints

```
GET /api/health
  → Health check

GET /api/districts
  → Returns GeoJSON FeatureCollection with all district boundaries
  → Query params: ?region=Greater+Accra (optional filter)

GET /api/districts/{district_id}
  → Returns single district GeoJSON Feature

GET /api/districts/{district_id}/climate
  → Returns full climate data for one district

GET /api/climate/variables
  → Returns list of available variables with metadata
  → Response: [{id, name, unit, description, category}]

GET /api/climate/{variable}
  → Returns values for all districts
  → Query params: ?period=2050&scenario=rcp85
  → Response: {variable, period, scenario, data: [{district_id, value}]}

GET /api/climate/compare
  → Compare baseline to future period
  → Query params: ?variable=annual_max_temp&period=2050&scenario=rcp85
  → Response: [{district_id, baseline, future, change, change_percent}]
```

### 3.3 Database Schema (SQLite)
```sql
-- Districts table
CREATE TABLE districts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    area_km2 REAL,
    population INTEGER,
    centroid_lat REAL,
    centroid_lng REAL,
    geometry TEXT NOT NULL  -- GeoJSON geometry string
);

-- Climate data table
CREATE TABLE climate_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    district_id TEXT NOT NULL,
    variable TEXT NOT NULL,
    period TEXT NOT NULL,      -- 'baseline', '2030', '2050', '2080'
    scenario TEXT NOT NULL,    -- 'historical', 'rcp45', 'rcp85'
    value REAL NOT NULL,
    unit TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id),
    UNIQUE(district_id, variable, period, scenario)
);

-- Variable metadata
CREATE TABLE variables (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL,
    category TEXT,  -- 'temperature', 'precipitation'
    color_scale TEXT,  -- 'temperature', 'precipitation', 'diverging'
    min_value REAL,
    max_value REAL
);

-- Indexes for performance
CREATE INDEX idx_climate_district ON climate_data(district_id);
CREATE INDEX idx_climate_variable ON climate_data(variable);
CREATE INDEX idx_climate_lookup ON climate_data(variable, period, scenario);
```

### 3.4 Pydantic Schemas
```python
# schemas.py
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class DistrictBase(BaseModel):
    id: str
    name: str
    region: str

class DistrictGeoJSON(BaseModel):
    type: str = "Feature"
    properties: Dict[str, Any]
    geometry: Dict[str, Any]

class ClimateVariable(BaseModel):
    id: str
    name: str
    description: str
    unit: str
    category: str

class ClimateValue(BaseModel):
    district_id: str
    value: float

class ClimateResponse(BaseModel):
    variable: str
    period: str
    scenario: str
    unit: str
    data: List[ClimateValue]

class ClimateComparison(BaseModel):
    district_id: str
    district_name: str
    baseline: float
    future: float
    change: float
    change_percent: float
```

---

## Phase 4: Frontend (React + Leaflet)

### 4.1 Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "d3-scale": "^4.0.2",
    "d3-scale-chromatic": "^3.0.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### 4.2 Core Components

**GhanaMap.tsx**
- Leaflet MapContainer centered on Ghana (7.9465°N, 1.0232°W)
- Zoom: 6 (country view) to 12 (district detail)
- Dark tile layer (CartoDB Dark Matter or Mapbox Dark)
- Ghana district polygons as GeoJSON layer

**DistrictLayer.tsx**
- Renders districts as colored polygons
- Color based on selected variable value
- Hover: highlight border, show tooltip
- Click: select district, show info panel

**Legend.tsx**
- Gradient color bar
- Min/max values for current variable
- Unit label

**VariableSelector.tsx**
```
[Temperature ▼]
├── Annual Mean Temperature
├── Annual Max Temperature
├── Very Hot Days (>35°C)
└── Extreme Hot Days (>40°C)

[Precipitation ▼]
├── Annual Precipitation
├── Wet Season Total
├── Dry Days
└── Heavy Rain Days
```

**TimePeriodSlider.tsx**
```
Baseline ●───────●───────●───────● 2080s
         2030s   2050s
```

**ScenarioToggle.tsx**
```
[Less Climate Change] ○────●○ [More Climate Change]
     RCP 4.5                      RCP 8.5
```

**DistrictInfo.tsx**
```
┌─────────────────────────────────┐
│ Accra Metropolitan              │
│ Greater Accra Region            │
├─────────────────────────────────┤
│ Annual Max Temperature          │
│                                 │
│ Baseline (1991-2020): 32.1°C    │
│ 2050 (RCP 8.5):       35.2°C    │
│                                 │
│ Change: +3.1°C (+9.7%)          │
│ ████████████░░░░░░░░ ▲          │
└─────────────────────────────────┘
```

### 4.3 Color Scales
```typescript
// colorScales.ts
import * as d3 from 'd3-scale-chromatic';

export const colorScales = {
  temperature: {
    // Blue (cool) → Yellow → Orange → Red (hot)
    domain: [20, 25, 30, 35, 40, 45],
    colors: ['#313695', '#74add1', '#fed976', '#fd8d3c', '#e31a1c', '#800026']
  },
  precipitation: {
    // Brown (dry) → White → Blue (wet)
    domain: [0, 500, 1000, 1500, 2000, 2500],
    colors: ['#8c510a', '#d8b365', '#f6e8c3', '#c7eae5', '#5ab4ac', '#01665e']
  },
  hotDays: {
    // Yellow → Orange → Red → Dark Red
    domain: [0, 30, 60, 90, 120, 150],
    colors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026', '#67000d']
  },
  change: {
    // Diverging: Blue (decrease) → White → Red (increase)
    interpolator: d3.interpolateRdBu
  }
};
```

### 4.4 State Management
```typescript
// useMapControls.ts
interface MapState {
  variable: string;        // 'annual_max_temp'
  period: string;          // 'baseline' | '2030' | '2050' | '2080'
  scenario: string;        // 'rcp45' | 'rcp85'
  selectedDistrict: string | null;
  showChange: boolean;     // Show absolute values or change from baseline
}
```

---

## Phase 5: Implementation Steps

### Step 1: Backend Foundation (Day 1-2)
1. Initialize FastAPI project
2. Create SQLite database with schema
3. Implement `/api/districts` with sample GeoJSON
4. Implement `/api/climate/{variable}` with mock data
5. Add CORS middleware for frontend

### Step 2: Frontend Foundation (Day 3-4)
1. Create Vite + React + TypeScript project
2. Install Leaflet and react-leaflet
3. Build GhanaMap component with dark tiles
4. Load district boundaries and render polygons
5. Add basic hover/click interactions

### Step 3: Controls & Styling (Day 5-6)
1. Implement VariableSelector dropdown
2. Build TimePeriodSlider component
3. Create ScenarioToggle
4. Add Legend component
5. Apply dark theme CSS

### Step 4: Data Integration (Day 7-8)
1. Download real Ghana district GeoJSON
2. Process KAPY climate data (or mock realistic data)
3. Load into SQLite database
4. Connect frontend to real API endpoints

### Step 5: Info Panel & Polish (Day 9-10)
1. Build DistrictInfo panel
2. Add change calculations (baseline vs future)
3. Implement loading states
4. Add error handling
5. Mobile responsive adjustments

---

## Data Sources Summary

### Ghana District Boundaries
- **Primary**: ArcGIS Hub Africa Geoportal
- **Backup**: GADM (gadm.org), Natural Earth

### Climate Projections (KAPy / Ghana Climate Atlas)
- **Primary**: GMet Climate Atlas - https://www.meteo.gov.gh/climate-atlas/
- **Data Request**: https://www.meteo.gov.gh/data-request/
- **Framework**: KAPy (https://github.com/Klimaatlas/KAPy)
- **Models**: 39 CORDEX-Africa downscaled climate models
- **Collaboration**: GMet + Danish Meteorological Institute (DMI)

### Alternative Data Sources (if GMet data unavailable)
- World Bank Climate Knowledge Portal
- CORDEX-Africa regional projections
- CMIP6 via Copernicus Climate Data Store

---

## Commands Reference

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
npm run build
```

### Data Processing
```bash
cd data-processing
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scripts/process_temperature.py
python scripts/aggregate_by_district.py
```

---

## Next Steps
1. Confirm KAPY data source and access method
2. Start with backend foundation
3. Build frontend map with sample data
4. Integrate real climate projections

---

*Plan created: 2026-02-03*
*Ready for implementation*
