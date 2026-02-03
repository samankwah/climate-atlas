// Category tabs for filtering climate variables

export type Category = "hot_weather" | "cold_weather" | "temperature" | "precipitation" | "agriculture";

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

// SVG Icons for each category
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const SnowflakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4" />
  </svg>
);

const ThermometerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

interface CategoryConfig {
  id: Category;
  label: string;
  icon: React.FC;
  bgColor: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: "hot_weather", label: "Hot Weather", icon: SunIcon, bgColor: "#f59e0b" },
  { id: "cold_weather", label: "Cold Weather", icon: SnowflakeIcon, bgColor: "#3b82f6" },
  { id: "temperature", label: "Temperature", icon: ThermometerIcon, bgColor: "#f97316" },
  { id: "precipitation", label: "Precipitation", icon: DropletIcon, bgColor: "#0ea5e9" },
  { id: "agriculture", label: "Agriculture", icon: LeafIcon, bgColor: "#22c55e" },
];

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="category-tabs">
      {CATEGORIES.map((cat) => {
        const IconComponent = cat.icon;
        return (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            <span
              className="tab-icon"
              style={{ backgroundColor: cat.bgColor }}
            >
              <IconComponent />
            </span>
            <span className="tab-label">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
