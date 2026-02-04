// District Detail Panel - Full-featured sliding panel for district climate info

import { useState } from "react";
import ClimateChart from "../Charts/ClimateChart";
import StatisticsTable from "./StatisticsTable";
import DownloadsSection from "./DownloadsSection";
import { useDistrictTimeSeries } from "../../hooks/useDistrictTimeSeries";
import type { ClimateVariable, ClimateComparison, Scenario, Period } from "../../types/climate";
import { formatValue, formatChange } from "../../utils/colorScales";

interface DistrictDetailPanelProps {
  districtId: string;
  districtName: string;
  regionName: string;
  variable: string;
  variableInfo: ClimateVariable | undefined;
  scenario: Scenario;
  period: Period;
  comparisonData: ClimateComparison | undefined;
  baselineValue: number | undefined;
  onClose: () => void;
}

const DistrictDetailPanel: React.FC<DistrictDetailPanelProps> = ({
  districtId,
  districtName,
  regionName,
  variable,
  variableInfo,
  scenario,
  period,
  comparisonData,
  baselineValue,
  onClose,
}) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // Fetch time series data for the chart
  const { data: timeSeriesData, statistics, isLoading } = useDistrictTimeSeries(
    districtId,
    variable,
    scenario
  );

  const unit = variableInfo?.unit || "";
  const variableName = variableInfo?.name || "Climate Variable";
  const scenarioLabel = scenario === "rcp45" ? "Low Carbon" : "High Carbon";

  // Get period labels
  const getPeriodLabel = (p: Period): string => {
    switch (p) {
      case "baseline":
        return "1991-2020";
      case "2030":
        return "2021-2050";
      case "2050":
        return "2041-2070";
      case "2080":
        return "2071-2100";
      default:
        return p;
    }
  };

  // Calculate values for display
  const currentValue = period === "baseline" ? baselineValue : comparisonData?.future;
  const baselineDisplayValue = period === "baseline" ? baselineValue : comparisonData?.baseline;
  const futureValue = comparisonData?.future;
  const change = comparisonData?.change;

  return (
    <div className="district-detail-panel">
      {/* Close button */}
      <button className="panel-close-btn" onClick={onClose} aria-label="Close panel">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Header section */}
      <div className="district-header">
        <div className="region-label">{regionName}</div>
        <h2 className="district-name">{districtName}</h2>
        <div className="variable-info">{variableName}</div>
        <div className="scenario-badge">
          {scenarioLabel} &gt; {scenario === "rcp45" ? "Moderate climate action" : "Limited climate action"}
        </div>
      </div>

      {/* Value comparison section */}
      {period !== "baseline" && comparisonData ? (
        <div className="value-comparison">
          <div className="period-value">
            <div className="period-label">1991-2020</div>
            <div className="value">
              {baselineDisplayValue !== undefined ? formatValue(baselineDisplayValue, unit) : "-"}
            </div>
          </div>

          <div className="comparison-arrow">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          <div className="period-value">
            <div className="period-label">{getPeriodLabel(period)}</div>
            <div className="value future">
              {futureValue !== undefined ? formatValue(futureValue, unit) : "-"}
            </div>
          </div>

          {change !== undefined && (
            <div className={`change-badge ${change >= 0 ? "increase" : "decrease"}`}>
              {formatChange(change, unit)}
            </div>
          )}
        </div>
      ) : (
        <div className="value-comparison single">
          <div className="period-value">
            <div className="period-label">Baseline (1991-2020)</div>
            <div className="value">
              {currentValue !== undefined ? formatValue(currentValue, unit) : "-"}
            </div>
          </div>
        </div>
      )}

      {/* Time series chart */}
      {isLoading ? (
        <div className="chart-loading">
          <div className="spinner-small" />
          <span>Loading chart data...</span>
        </div>
      ) : (
        <ClimateChart
          data={timeSeriesData}
          unit={unit}
          variableName={variableName}
        />
      )}

      {/* More Details section (collapsible) */}
      <div className="more-details-section">
        <button
          className="more-details-header"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
        >
          <span>More Details</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: showMoreDetails ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showMoreDetails && statistics && (
          <div className="more-details-content">
            <StatisticsTable
              statistics={statistics}
              unit={unit}
              futurePeriodLabel={getPeriodLabel("2080")}
            />

            <div className="explore-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Explore detailed climate data</span>
            </div>
          </div>
        )}
      </div>

      {/* Downloads section */}
      <DownloadsSection
        districtName={districtName}
        regionName={regionName}
        variableName={variableName}
        unit={unit}
        scenario={scenario}
        data={timeSeriesData}
      />

      {/* Data source footer */}
      <div className="panel-footer">
        <div className="data-source">Data: CORDEX-Africa</div>
      </div>
    </div>
  );
};

export default DistrictDetailPanel;
