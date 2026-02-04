// Climate time series chart with uncertainty bands

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TimeSeriesPoint } from "../../hooks/useDistrictTimeSeries";

interface ClimateChartProps {
  data: TimeSeriesPoint[];
  unit: string;
  variableName: string;
}

interface TooltipPayload {
  payload: TimeSeriesPoint;
}

const CustomTooltip = ({
  active,
  payload,
  unit,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  unit: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const formatValue = (val: number) => {
    if (unit === "°C") return `${val.toFixed(1)}${unit}`;
    if (unit === "mm" || unit === "days") return `${Math.round(val)} ${unit}`;
    return `${val.toFixed(1)} ${unit}`;
  };

  return (
    <div className="chart-tooltip">
      <div className="tooltip-header">{data.label}</div>
      <div className="tooltip-row">
        <span className="tooltip-label">Central:</span>
        <span className="tooltip-value">{formatValue(data.median)}</span>
      </div>
      <div className="tooltip-row range">
        <span className="tooltip-label">Range:</span>
        <span className="tooltip-value">
          {formatValue(data.low)} - {formatValue(data.high)}
        </span>
      </div>
    </div>
  );
};

const ClimateChart: React.FC<ClimateChartProps> = ({ data, unit, variableName }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-section">
        <div className="chart-empty">No data available</div>
      </div>
    );
  }

  // Calculate Y-axis domain with padding
  const allValues = data.flatMap((d) => [d.low, d.high]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.15;
  const yMin = Math.floor(minValue - padding);
  const yMax = Math.ceil(maxValue + padding);

  // Format Y-axis tick
  const formatYTick = (value: number) => {
    if (unit === "°C") return `${value}°`;
    return `${value}`;
  };

  return (
    <div className="chart-section">
      <div className="chart-title">Projected Change Over Time</div>
      <div className="chart-subtitle">{variableName}</div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="uncertaintyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="year"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            tickFormatter={(year) => {
              const point = data.find((d) => d.year === year);
              return point?.label || String(year);
            }}
          />

          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            tickFormatter={formatYTick}
            width={40}
          />

          <Tooltip
            content={<CustomTooltip unit={unit} />}
            cursor={{ stroke: "#64748b", strokeDasharray: "3 3" }}
          />

          {/* Reference line at baseline year */}
          <ReferenceLine
            x={data[0]?.year}
            stroke="#64748b"
            strokeDasharray="3 3"
            label={{
              value: "Baseline",
              position: "top",
              fill: "#64748b",
              fontSize: 10,
            }}
          />

          {/* Uncertainty band - upper bound */}
          <Area
            type="monotone"
            dataKey="high"
            stroke="none"
            fill="url(#uncertaintyGradient)"
            fillOpacity={1}
            isAnimationActive={false}
          />

          {/* Uncertainty band - lower bound (masks the gradient below) */}
          <Area
            type="monotone"
            dataKey="low"
            stroke="none"
            fill="#1e293b"
            fillOpacity={1}
            isAnimationActive={false}
          />

          {/* Main trend line */}
          <Line
            type="monotone"
            dataKey="median"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{
              fill: "#f59e0b",
              strokeWidth: 2,
              r: 5,
              stroke: "#1e293b",
            }}
            activeDot={{
              fill: "#fbbf24",
              strokeWidth: 2,
              r: 7,
              stroke: "#1e293b",
            }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClimateChart;
