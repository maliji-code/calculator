import "./Footer.css";

const calculatorLinks = ["Basic", "Day / Date", "Age", "Percentage", "Marks %"];

export default function Footer({ onTabChange }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <section className="footer-section footer-brand">
          <h2>Calculator by Suresh</h2>
          <p>Quick, simple tools for everyday calculations.</p>
        </section>

        <section className="footer-section">
          <h3>Calculators</h3>
          {calculatorLinks.map((link) => (
            <button key={link} onClick={() => onTabChange(link)}>{link}</button>
          ))}
        </section>

        <section className="footer-section">
          <h3>Useful Tools</h3>
          <span>Basic arithmetic</span>
          <span>Date difference</span>
          <span>Age calculation</span>
          <span>Marks percentage</span>
        </section>

        <section className="footer-section">
          <h3>About</h3>
          <span>Fast and easy to use</span>
          <span>Works in your browser</span>
          <span>No account required</span>
          <span>100% client-side</span>
        </section>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Calculator by Suresh</p>
        <p>Made for everyday math</p>
      </div>
    </footer>
  );
}