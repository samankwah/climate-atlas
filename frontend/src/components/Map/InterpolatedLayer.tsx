// Canvas overlay component for IDW-interpolated climate visualization

import { useEffect, useRef, useMemo } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import {
  generateInterpolatedGrid,
  gridToImageData,
  GHANA_BOUNDS,
  type DataPoint,
} from "../../utils/idwInterpolation";

interface InterpolatedLayerProps {
  dataPoints: DataPoint[];
  colorScale: (value: number, min: number, max: number) => string;
  minValue: number;
  maxValue: number;
  resolution?: number; // Grid resolution in degrees (default: 0.05)
  opacity?: number;
  idwPower?: number;
}

const InterpolatedLayer: React.FC<InterpolatedLayerProps> = ({
  dataPoints,
  colorScale,
  minValue,
  maxValue,
  resolution = 0.05,
  opacity = 0.8,
  idwPower = 2,
}) => {
  const map = useMap();
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);

  // Generate the interpolated grid (memoized)
  const gridResult = useMemo(() => {
    if (dataPoints.length === 0) return null;

    return generateInterpolatedGrid(
      GHANA_BOUNDS,
      dataPoints,
      resolution,
      { power: idwPower }
    );
  }, [dataPoints, resolution, idwPower]);

  // Create the image data URL from the grid
  const imageDataUrl = useMemo(() => {
    if (!gridResult) return null;

    // Create an offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = gridResult.cols;
    canvas.height = gridResult.rows;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    // Generate image data from grid
    const imageData = gridToImageData(
      gridResult,
      minValue,
      maxValue,
      colorScale,
      opacity
    );

    // Put the image data on canvas
    ctx.putImageData(imageData, 0, 0);

    // Return as data URL
    return canvas.toDataURL();
  }, [gridResult, minValue, maxValue, colorScale, opacity]);

  // Create/update the image overlay
  useEffect(() => {
    if (!imageDataUrl) {
      // Remove existing overlay if no data
      if (imageOverlayRef.current) {
        map.removeLayer(imageOverlayRef.current);
        imageOverlayRef.current = null;
      }
      return;
    }

    const bounds: L.LatLngBoundsExpression = [
      [GHANA_BOUNDS.south, GHANA_BOUNDS.west],
      [GHANA_BOUNDS.north, GHANA_BOUNDS.east],
    ];

    if (imageOverlayRef.current) {
      // Update existing overlay
      imageOverlayRef.current.setUrl(imageDataUrl);
    } else {
      // Create new overlay
      imageOverlayRef.current = L.imageOverlay(imageDataUrl, bounds, {
        opacity: 1, // Opacity is baked into the image
        interactive: false,
        zIndex: 200,
      });
      imageOverlayRef.current.addTo(map);
    }

    // Cleanup on unmount
    return () => {
      if (imageOverlayRef.current) {
        map.removeLayer(imageOverlayRef.current);
        imageOverlayRef.current = null;
      }
    };
  }, [map, imageDataUrl]);

  // Ensure overlay stays below district borders
  useEffect(() => {
    if (imageOverlayRef.current) {
      imageOverlayRef.current.bringToBack();
    }
  });

  return null;
};

export default InterpolatedLayer;
