import { useState } from "react";
import { evaluate } from "mathjs";
import "./Calculator.css";

export default function Calculator() {
  const [display, setDisplay] = useState("");

  const calculate = () => {
    try {
      if (!display.trim()) return;

      const result = evaluate(display);
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  };

  const handleButtonClick = (value) => {
    if (value === "C") {
      setDisplay("");
      return;
    }

    if (value === "=") {
      calculate();
      return;
    }

    setDisplay((prev) => prev + value);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (/^[0-9+\-*/().]*$/.test(value)) {
      setDisplay(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculate();
    }

    if (e.key === "Escape") {
      setDisplay("");
    }
  };

  const buttons = [
    "C",
    "(",
    ")",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
  ];

  return (
    <div className="calculator">
      <h2>Simple Calculator</h2>

      <input
        type="text"
        className="display"
        value={display}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="0"
        autoFocus
      />

      <div className="buttons">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}