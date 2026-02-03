// IDW (Inverse Distance Weighting) interpolation utility for climate data visualization

export interface DataPoint {
  lat: number;
  lon: number;
  value: number;
}

export interface InterpolationOptions {
  power?: number; // IDW power parameter (default: 2)
  maxDistance?: number; // Max search radius in degrees
  minPoints?: number; // Minimum nearby points to use
}

export interface GridResult {
  grid: number[][];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  resolution: number;
  rows: number;
  cols: number;
}

// Ghana geographic bounds
export const GHANA_BOUNDS = {
  north: 11.2,
  south: 3.3,
  east: 1.2,
  west: -3.3,
};

/**
 * Calculate the distance between two points in degrees
 * Using simple Euclidean distance (sufficient for small areas like Ghana)
 */
function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

/**
 * Core IDW function - interpolate value at a single point
 */
export function idwInterpolate(
  targetLat: number,
  targetLon: number,
  dataPoints: DataPoint[],
  options: InterpolationOptions = {}
): number {
  const { power = 2, maxDistance = 10, minPoints = 1 } = options;

  if (dataPoints.length === 0) {
    return 0;
  }

  // Calculate distances and weights
  let weightedSum = 0;
  let weightSum = 0;
  let usedPoints = 0;

  for (const point of dataPoints) {
    const d = distance(targetLat, targetLon, point.lat, point.lon);

    // If we're very close to a data point, return its value directly
    if (d < 0.0001) {
      return point.value;
    }

    // Skip points beyond max distance
    if (maxDistance && d > maxDistance) {
      continue;
    }

    // Calculate weight as inverse of distance raised to power
    const weight = 1 / Math.pow(d, power);
    weightedSum += weight * point.value;
    weightSum += weight;
    usedPoints++;
  }

  // If not enough points found, use all points regardless of distance
  if (usedPoints < minPoints) {
    weightedSum = 0;
    weightSum = 0;

    for (const point of dataPoints) {
      const d = distance(targetLat, targetLon, point.lat, point.lon);
      if (d < 0.0001) {
        return point.value;
      }
      const weight = 1 / Math.pow(d, power);
      weightedSum += weight * point.value;
      weightSum += weight;
    }
  }

  return weightSum > 0 ? weightedSum / weightSum : 0;
}

/**
 * Generate interpolated grid for the entire bounds
 * Returns a 2D array of interpolated values
 */
export function generateInterpolatedGrid(
  bounds: { north: number; south: number; east: number; west: number },
  dataPoints: DataPoint[],
  resolution: number,
  options: InterpolationOptions = {}
): GridResult {
  const cols = Math.ceil((bounds.east - bounds.west) / resolution);
  const rows = Math.ceil((bounds.north - bounds.south) / resolution);

  const grid: number[][] = [];

  for (let row = 0; row < rows; row++) {
    const gridRow: number[] = [];
    const lat = bounds.north - row * resolution - resolution / 2;

    for (let col = 0; col < cols; col++) {
      const lon = bounds.west + col * resolution + resolution / 2;
      const value = idwInterpolate(lat, lon, dataPoints, options);
      gridRow.push(value);
    }

    grid.push(gridRow);
  }

  return {
    grid,
    bounds,
    resolution,
    rows,
    cols,
  };
}

/**
 * Convert a value to a color using a color scale function
 */
export function valueToColor(
  value: number,
  minValue: number,
  maxValue: number,
  colorScale: (value: number, min: number, max: number) => string
): string {
  // Clamp value to range
  const clampedValue = Math.max(minValue, Math.min(maxValue, value));
  return colorScale(clampedValue, minValue, maxValue);
}

/**
 * Parse CSS color string to RGBA values
 */
export function parseColor(color: string): [number, number, number, number] {
  // Handle rgb() format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10),
      255,
    ];
  }

  // Handle rgba() format
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (rgbaMatch) {
    return [
      parseInt(rgbaMatch[1], 10),
      parseInt(rgbaMatch[2], 10),
      parseInt(rgbaMatch[3], 10),
      Math.round(parseFloat(rgbaMatch[4]) * 255),
    ];
  }

  // Handle hex format
  const hexMatch = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (hexMatch) {
    return [
      parseInt(hexMatch[1], 16),
      parseInt(hexMatch[2], 16),
      parseInt(hexMatch[3], 16),
      255,
    ];
  }

  // Default to transparent
  return [0, 0, 0, 0];
}

/**
 * Create an ImageData from a grid of values
 */
export function gridToImageData(
  gridResult: GridResult,
  minValue: number,
  maxValue: number,
  colorScale: (value: number, min: number, max: number) => string,
  opacity: number = 0.8
): ImageData {
  const { grid, rows, cols } = gridResult;
  const imageData = new ImageData(cols, rows);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const value = grid[row][col];
      const color = valueToColor(value, minValue, maxValue, colorScale);
      const [r, g, b] = parseColor(color);

      const pixelIndex = (row * cols + col) * 4;
      imageData.data[pixelIndex] = r;
      imageData.data[pixelIndex + 1] = g;
      imageData.data[pixelIndex + 2] = b;
      imageData.data[pixelIndex + 3] = Math.round(opacity * 255);
    }
  }

  return imageData;
}
