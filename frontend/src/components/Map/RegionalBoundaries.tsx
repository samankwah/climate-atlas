// Regional administrative boundaries overlay for Ghana

import { GeoJSON } from "react-leaflet";
import { useMemo } from "react";
import type { PathOptions } from "leaflet";
import type { Feature } from "geojson";
import ghanaRegions from "../../assets/ghana_regions.geojson";

interface RegionalBoundariesProps {
  visible?: boolean;
  opacity?: number;
  color?: string;
  weight?: number;
}

const RegionalBoundaries: React.FC<RegionalBoundariesProps> = ({
  visible = true,
  opacity = 0.6,
  color = "#ffffff",
  weight = 1.5,
}) => {
  const style = useMemo(
    (): PathOptions => ({
      fillOpacity: 0,
      weight,
      color,
      opacity,
    }),
    [opacity, color, weight]
  );

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    const regionName = feature.properties?.name;
    if (regionName) {
      layer.bindTooltip(regionName, {
        sticky: true,
        className: "region-tooltip",
      });
    }
  };

  if (!visible) return null;

  return (
    <GeoJSON
      data={ghanaRegions as GeoJSON.FeatureCollection}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

export default RegionalBoundaries;
