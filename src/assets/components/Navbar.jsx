import "./Navbar.css";

const navigationOptions = ["Basic", "Day / Date", "Age", "Percentage", "Marks %", "Unit", "BMI", "EMI", "GST", "Discount", "Tip", "Time", "Date Math"];

export default function Navbar({ activeTab, onTabChange, darkMode, onThemeChange }) {
  return (
    <nav className="navbar">
      <h2 className="logo">Calculator by Suresh</h2>
      <div className="nav-options" aria-label="Calculator options">
        {navigationOptions.map((option) => (
          <button
            className={activeTab === option ? "nav-option active" : "nav-option"}
            key={option}
            onClick={() => onTabChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button className="theme-toggle" onClick={() => onThemeChange(!darkMode)} aria-label="Toggle dark mode">
        {darkMode ? "Light" : "Dark"}
      </button>
    </nav>
  );
}