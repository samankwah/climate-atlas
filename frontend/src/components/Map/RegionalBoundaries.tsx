// Regional administrative boundaries overlay for Ghana

import { GeoJSON } from "react-leaflet";
import { useMemo } from "react";
import type { PathOptions } from "leaflet";
import type { FeatureCollection, Feature } from "geojson";
import ghanaRegionsRaw from "../../assets/ghana_regions.geojson";

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
  // Clean the GeoJSON - remove crs property that Leaflet doesn't support
  const ghanaRegions = useMemo((): FeatureCollection => {
    const raw = ghanaRegionsRaw as unknown as { features: Feature[] };
    return {
      type: "FeatureCollection",
      features: raw.features,
    };
  }, []);

  const style = useMemo(
    (): PathOptions => ({
      fillOpacity: 0,
      weight,
      color,
      opacity,
      interactive: false, // Allow clicks to pass through to layers below
    }),
    [opacity, color, weight]
  );

  if (!visible) return null;

  return (
    <GeoJSON
      data={ghanaRegions}
      style={style}
      interactive={false}
    />
  );
};

export default RegionalBoundaries;
