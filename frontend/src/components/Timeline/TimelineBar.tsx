// Horizontal timeline bar for period and scenario selection

import type { Period, Scenario } from "../../types/climate";

interface TimelineBarProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
  scenario?: Scenario;
  onScenarioChange?: (scenario: Scenario) => void;
}

const PERIODS: { id: Period; label: string }[] = [
  { id: "baseline", label: "RECENT PAST" },
  { id: "2030", label: "2021-2050" },
  { id: "2080", label: "2051-2080" },
];

const TimelineBar: React.FC<TimelineBarProps> = ({
  selectedPeriod,
  onPeriodChange,
  scenario = "rcp45",
  onScenarioChange,
}) => {
  const handleScenarioSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onScenarioChange) {
      onScenarioChange(e.target.value === "0" ? "rcp45" : "rcp85");
    }
  };

  return (
    <div className="timeline-bar">
      {/* Climate Change Slider Section */}
      <div className="timeline-section">
        <span className="section-label">
          CLIMATE CHANGE
          <span className="info-icon" title="RCP scenario - Less (RCP4.5) or More (RCP8.5) carbon emissions">i</span>
        </span>
        <div className="scenario-slider">
          <span className={scenario === "rcp45" ? "active" : ""}>LESS</span>
          <input
            type="range"
            min="0"
            max="1"
            step="1"
            value={scenario === "rcp45" ? 0 : 1}
            onChange={handleScenarioSlider}
          />
          <span className={scenario === "rcp85" ? "active" : ""}>MORE</span>
        </div>
      </div>

      {/* Time Period Selector Section */}
      <div className="timeline-section">
        <span className="section-label">
          TIME PERIOD
          <span className="info-icon" title="Select time period for climate projections">i</span>
        </span>
        <div className="period-selector period-track">
          {PERIODS.map((period) => (
            <button
              key={period.id}
              className={`period-option ${selectedPeriod === period.id ? "active" : ""}`}
              onClick={() => onPeriodChange(period.id)}
            >
              <span className="period-dot" />
              <span className="period-label">{period.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineBar;
