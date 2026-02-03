// Map layer toggles - slim sidebar with icon-based toggles

interface MapLayerTogglesProps {
  showGrid: boolean;
  showAverage: boolean;
  showCities: boolean;
  showProtectedAreas: boolean;
  onToggleGrid: () => void;
  onToggleAverage: () => void;
  onToggleCities: () => void;
  onToggleProtectedAreas: () => void;
  onFindMe: () => void;
}

const MapLayerToggles: React.FC<MapLayerTogglesProps> = ({
  showGrid,
  showAverage,
  showCities,
  showProtectedAreas,
  onToggleGrid,
  onToggleAverage,
  onToggleCities,
  onToggleProtectedAreas,
  onFindMe,
}) => {
  return (
    <aside className="slim-sidebar">
      <div className="layer-toggles">
        <button
          className={`layer-toggle ${showGrid ? "active" : ""}`}
          onClick={onToggleGrid}
          title="Toggle Grid"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          <span className="toggle-label">Grid</span>
        </button>

        <button
          className={`layer-toggle ${showAverage ? "active" : ""}`}
          onClick={onToggleAverage}
          title="Toggle Average"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18 9l-5 5-4-4-6 6" />
          </svg>
          <span className="toggle-label">Avg</span>
        </button>

        <button
          className={`layer-toggle ${showCities ? "active" : ""}`}
          onClick={onToggleCities}
          title="Toggle Cities & Towns"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9v.01" />
            <path d="M9 12v.01" />
            <path d="M9 15v.01" />
            <path d="M9 18v.01" />
          </svg>
          <span className="toggle-label">Cities</span>
        </button>

        <button
          className={`layer-toggle ${showProtectedAreas ? "active" : ""}`}
          onClick={onToggleProtectedAreas}
          title="Toggle Protected Areas"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <span className="toggle-label">Protected</span>
        </button>
      </div>

      <div className="sidebar-divider" />

      <button className="find-me-btn" onClick={onFindMe} title="Find My Location">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
        </svg>
      </button>
    </aside>
  );
};

export default MapLayerToggles;
