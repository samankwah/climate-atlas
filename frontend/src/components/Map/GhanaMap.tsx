// Main Ghana Map component using Leaflet

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import type { Layer, PathOptions } from "leaflet";
import type { Feature, GeoJsonObject } from "geojson";
import type {
  DistrictFeatureCollection,
  ClimateValue,
  ClimateComparison,
} from "../../types/climate";
import { getColorScale, type ColorScaleType } from "../../utils/colorScales";
import CityMarkers from "./CityMarkers";
import InterpolatedLayer from "./InterpolatedLayer";
import type { DataPoint } from "../../utils/idwInterpolation";
import "leaflet/dist/leaflet.css";

interface GhanaMapProps {
  districts: DistrictFeatureCollection | undefined;
  climateData: ClimateValue[] | undefined;
  comparisonData: ClimateComparison[] | undefined;
  showChange: boolean;
  colorScaleType: ColorScaleType;
  minValue: number;
  maxValue: number;
  selectedDistrictId: string | null;
  onDistrictClick: (districtId: string) => void;
  onDistrictHover: (districtId: string | null) => void;
  showCities?: boolean;
}

// Ghana center coordinates
const GHANA_CENTER: [number, number] = [7.9465, -1.0232];
const GHANA_ZOOM = 7;

// Map bounds for Ghana
const GHANA_BOUNDS: [[number, number], [number, number]] = [
  [3.3, -3.3], // Southwest
  [11.2, 1.2], // Northeast
];

// Component to fit map to Ghana bounds
const FitBounds = () => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(GHANA_BOUNDS, { padding: [20, 20] });
  }, [map]);
  return null;
};

const GhanaMap: React.FC<GhanaMapProps> = ({
  districts,
  climateData,
  comparisonData,
  showChange,
  colorScaleType,
  minValue,
  maxValue,
  selectedDistrictId,
  onDistrictClick,
  onDistrictHover,
  showCities = false,
}) => {
  // Create a lookup map for climate values
  const valueMap = useMemo(() => {
    const map = new Map<string, number>();
    if (showChange && comparisonData) {
      comparisonData.forEach((d) => map.set(d.district_id, d.change));
    } else if (climateData) {
      climateData.forEach((d) => map.set(d.district_id, d.value));
    }
    return map;
  }, [climateData, comparisonData, showChange]);

  // Create data points from districts + climate values for IDW interpolation
  const dataPoints: DataPoint[] = useMemo(() => {
    if (!districts) return [];

    return districts.features
      .map((district) => {
        const centroid = district.properties.centroid;
        const value = valueMap.get(district.properties.id);

        if (!centroid || value === undefined) return null;

        return {
          lat: centroid[1], // latitude
          lon: centroid[0], // longitude
          value,
        };
      })
      .filter((point): point is DataPoint => point !== null);
  }, [districts, valueMap]);

  // Get color function
  const getColor = useMemo(() => {
    const scaleFn = getColorScale(showChange ? "diverging" : colorScaleType);
    return (value: number) => scaleFn(value, minValue, maxValue);
  }, [colorScaleType, showChange, minValue, maxValue]);

  // Style function for GeoJSON features - borders only, no fill (interpolated layer handles colors)
  const style = (feature: Feature | undefined): PathOptions => {
    if (!feature?.properties) {
      return { fillOpacity: 0, weight: 0.5, color: "#333", opacity: 0.3 };
    }

    const districtId = feature.properties.id as string;
    const isSelected = districtId === selectedDistrictId;

    return {
      fillOpacity: 0, // No fill - interpolated layer handles colors
      weight: isSelected ? 2 : 0.5,
      color: isSelected ? "#fff" : "#333",
      opacity: isSelected ? 0.8 : 0.3,
    };
  };

  // Event handlers for each feature
  const onEachFeature = (feature: Feature, layer: Layer) => {
    const districtId = feature.properties?.id as string;
    const districtName = feature.properties?.name as string;
    const region = feature.properties?.region as string;
    const value = valueMap.get(districtId);

    // Tooltip
    const tooltipContent = `
      <strong>${districtName}</strong><br/>
      ${region}<br/>
      ${value !== undefined ? `Value: ${value.toFixed(1)}` : "No data"}
    `;
    layer.bindTooltip(tooltipContent, { sticky: true });

    // Events
    layer.on({
      click: () => onDistrictClick(districtId),
      mouseover: () => onDistrictHover(districtId),
      mouseout: () => onDistrictHover(null),
    });
  };

  if (!districts) {
    return (
      <div className="map-loading">
        <p>Loading map data...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={GHANA_CENTER}
      zoom={GHANA_ZOOM}
      className="ghana-map"
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <FitBounds />

      {/* Dark tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* IDW Interpolated climate layer */}
      {dataPoints.length > 0 && (
        <InterpolatedLayer
          dataPoints={dataPoints}
          colorScale={getColor}
          minValue={minValue}
          maxValue={maxValue}
          resolution={0.05}
          opacity={0.75}
          idwPower={2}
        />
      )}

      {/* District polygons (borders only) */}
      <GeoJSON
        key={`${JSON.stringify(Array.from(valueMap.entries()).slice(0, 5))}-${selectedDistrictId}`}
        data={districts as GeoJsonObject}
        style={style}
        onEachFeature={onEachFeature}
      />

      {/* City markers layer */}
      <CityMarkers visible={showCities} />
    </MapContainer>
  );
};

export default GhanaMap;
