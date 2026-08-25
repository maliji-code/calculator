import { useState } from "react";
import { evaluate } from "mathjs";
import "./Calculator.css";

const tabs = ["Basic", "Day / Date", "Age", "Percentage", "Marks %", "Unit", "BMI", "EMI", "GST", "Discount", "Tip", "Time", "Date Math"];

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getAge = (birthDate, endDate) => {
  const birth = new Date(`${birthDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(birth.getTime()) || Number.isNaN(end.getTime()) || birth > end) {
    return null;
  }

  let years = end.getFullYear() - birth.getFullYear();
  let months = end.getMonth() - birth.getMonth();
  let days = end.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
};

export default function Calculator({ activeTab, onTabChange }) {
  const [display, setDisplay] = useState("");
  const [scientific, setScientific] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("calculator-history")) || [];
    } catch {
      return [];
    }
  });
  const today = formatDateInput(new Date());
  const [dateStart, setDateStart] = useState(today);
  const [dateEnd, setDateEnd] = useState(today);
  const [birthDate, setBirthDate] = useState("");
  const [ageOnDate, setAgeOnDate] = useState(today);
  const [ageResult, setAgeResult] = useState(null);
  const [percent, setPercent] = useState("");
  const [percentOf, setPercentOf] = useState("");
  const [percentageResult, setPercentageResult] = useState(null);
  const [marks, setMarks] = useState(
    Array.from({ length: 5 }, () => ({ subject: "", obtained: "", total: "100" })),
  );
  const [marksResult, setMarksResult] = useState(null);
  const [unitType, setUnitType] = useState("length");
  const [unitValue, setUnitValue] = useState("");
  const [unitFrom, setUnitFrom] = useState("meter");
  const [unitTo, setUnitTo] = useState("kilometer");
  const [body, setBody] = useState({ weight: "", height: "" });
  const [loan, setLoan] = useState({ amount: "", rate: "", months: "" });
  const [tax, setTax] = useState({ amount: "", rate: "18" });
  const [discount, setDiscount] = useState({ amount: "", rate: "" });
  const [tip, setTip] = useState({ amount: "", rate: "15", people: "1" });
  const [time, setTime] = useState({ hours: "", minutes: "" });
  const [dateMath, setDateMath] = useState({ date: today, amount: "", direction: "add" });

  const calculate = () => {
    try {
      if (!display.trim()) return;

      const result = evaluate(display);
      setDisplay(result.toString());
      const entry = `${display} = ${result}`;
      setHistory((current) => {
        const next = [entry, ...current.filter((item) => item !== entry)].slice(0, 10);
        try {
          localStorage.setItem("calculator-history", JSON.stringify(next));
        } catch {
          // Storage can be unavailable in private browsing.
        }
        return next;
      });
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
  const scientificButtons = ["sqrt(", "sin(", "cos(", "tan(", "log10(", "^2"];
  const unitOptions = {
    length: ["meter", "kilometer", "mile", "foot"],
    weight: ["gram", "kilogram", "pound", "ounce"],
    temperature: ["celsius", "fahrenheit", "kelvin"],
    area: ["square meter", "square kilometer", "square foot", "acre"],
  };

  const calculateDateDifference = () => {
    const start = new Date(`${dateStart}T00:00:00`);
    const end = new Date(`${dateEnd}T00:00:00`);
    const days = Math.round((end - start) / 86400000);
    return Number.isNaN(days) ? null : Math.abs(days);
  };

  const calculatePercentage = (event) => {
    event.preventDefault();
    const result = (Number(percent) / 100) * Number(percentOf);
    setPercentageResult(Number.isFinite(result) ? result.toFixed(2) : null);
  };

  const updateMark = (index, field, value) => {
    setMarks((current) => current.map((mark, markIndex) => (
      markIndex === index ? { ...mark, [field]: value } : mark
    )));
    setMarksResult(null);
  };

  const calculateMarks = (event) => {
    event.preventDefault();
    const totals = marks.reduce((result, mark) => ({
      obtained: result.obtained + (Number(mark.obtained) || 0),
      total: result.total + (Number(mark.total) || 0),
    }), { obtained: 0, total: 0 });
    const percentageValue = totals.total ? (totals.obtained / totals.total) * 100 : 0;
    setMarksResult({ ...totals, percentage: percentageValue.toFixed(2) });
  };

  const calculateUnit = () => {
    const value = Number(unitValue);
    if (!Number.isFinite(value)) return null;
    if (unitType === "temperature") {
      const celsius = unitFrom === "celsius" ? value : unitFrom === "fahrenheit" ? (value - 32) * 5 / 9 : value - 273.15;
      return unitTo === "celsius" ? celsius : unitTo === "fahrenheit" ? celsius * 9 / 5 + 32 : celsius + 273.15;
    }
    const groups = {
      length: { meter: 1, kilometer: 1000, mile: 1609.344, foot: 0.3048 },
      weight: { gram: 1, kilogram: 1000, pound: 453.59237, ounce: 28.3495 },
      area: { "square meter": 1, "square kilometer": 1000000, "square foot": 0.092903, acre: 4046.86 },
    };
    return value * groups[unitType][unitFrom] / groups[unitType][unitTo];
  };

  const formatMoney = (value) => Number.isFinite(value) ? value.toFixed(2) : "-";
  const taxResult = (Number(tax.amount) || 0) * (1 + (Number(tax.rate) || 0) / 100);
  const discountResult = (Number(discount.amount) || 0) * (1 - (Number(discount.rate) || 0) / 100);
  const tipTotal = (Number(tip.amount) || 0) * (1 + (Number(tip.rate) || 0) / 100);
  const monthlyRate = (Number(loan.rate) || 0) / 1200;
  const emiResult = monthlyRate ? (Number(loan.amount) || 0) * monthlyRate * (1 + monthlyRate) ** (Number(loan.months) || 0) / ((1 + monthlyRate) ** (Number(loan.months) || 0) - 1) : 0;
  const bmiResult = (Number(body.weight) || 0) / ((Number(body.height) || 0) / 100) ** 2;
  const dateMathResult = () => {
    const result = new Date(`${dateMath.date}T00:00:00`);
    result.setDate(result.getDate() + (dateMath.direction === "add" ? 1 : -1) * (Number(dateMath.amount) || 0));
    return Number.isNaN(result.getTime()) ? "-" : formatDateInput(result);
  };
  const timeResult = (Number(time.hours) || 0) * 60 + (Number(time.minutes) || 0);

  const downloadResult = () => {
    const blob = new Blob([`Calculator result\n${display || "No basic result selected"}`], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calculator-result.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const shareResult = async () => {
    if (navigator.share) await navigator.share({ title: "Calculator result", text: display });
    else await navigator.clipboard?.writeText(display);
  };

  return (
    <div className="calculator" aria-label="Calculator tools">
      <div className="calculator-heading">
        <span className="eyebrow">Everyday tools</span>
        <h2>{activeTab === "Basic" ? "Simple Calculator" : activeTab}</h2>
      </div>

      <div className="tabs" role="tablist" aria-label="Calculator type">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active" : "tab"}
            onClick={() => onTabChange(tab)}
            role="tab"
            aria-selected={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Basic" && (
        <>
          <div className="calculator-actions">
            <button className={scientific ? "small-action active" : "small-action"} onClick={() => setScientific(!scientific)}>Scientific</button>
            <button className="small-action" onClick={() => navigator.clipboard?.writeText(display)} disabled={!display}>Copy result</button>
            <button className="small-action" onClick={downloadResult}>Download</button>
            <button className="small-action" onClick={shareResult}>Share</button>
          </div>
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
            {scientific && scientificButtons.map((btn) => (
              <button key={btn} onClick={() => setDisplay((prev) => `${prev}${btn}`)}>{btn}</button>
            ))}
            {buttons.map((btn) => (
              <button key={btn} onClick={() => handleButtonClick(btn)}>
                {btn}
              </button>
            ))}
          </div>
          <div className="history-header">
            <strong>History</strong>
            <button onClick={() => { setHistory([]); localStorage.removeItem("calculator-history"); }}>Clear</button>
          </div>
          {history.length > 0 && <div className="history-list">{history.map((item) => <span key={item}>{item}</span>)}</div>}
        </>
      )}

      {activeTab === "Day / Date" && (
        <section className="tool-panel">
          <p className="helper-text">Find the number of days between two dates.</p>
          <label>Start date<input type="date" value={dateStart} onChange={(event) => setDateStart(event.target.value)} /></label>
          <label>End date<input type="date" value={dateEnd} onChange={(event) => setDateEnd(event.target.value)} /></label>
          <div className="result-box"><strong>{calculateDateDifference() ?? "-"}</strong><span>days apart</span></div>
        </section>
      )}

      {activeTab === "Age" && (
        <section className="tool-panel">
          <p className="helper-text">Calculate your exact age on any date.</p>
          <label>Date of birth<input type="date" value={birthDate} onChange={(event) => { setBirthDate(event.target.value); setAgeResult(null); }} /></label>
          <label>Age on date<input type="date" value={ageOnDate} onChange={(event) => { setAgeOnDate(event.target.value); setAgeResult(null); }} /></label>
          <button className="primary-button" onClick={() => setAgeResult(getAge(birthDate, ageOnDate))}>Calculate age</button>
          {ageResult && <div className="result-box"><strong>{ageResult.years}y {ageResult.months}m {ageResult.days}d</strong><span>exact age</span></div>}
        </section>
      )}

      {activeTab === "Percentage" && (
        <form className="tool-panel" onSubmit={calculatePercentage}>
          <p className="helper-text">Find what a percentage is worth.</p>
          <label>Percentage (%)<input type="number" min="0" value={percent} onChange={(event) => setPercent(event.target.value)} placeholder="25" required /></label>
          <label>Percentage of<input type="number" min="0" value={percentOf} onChange={(event) => setPercentOf(event.target.value)} placeholder="200" required /></label>
          <button className="primary-button" type="submit">Calculate percentage</button>
          {percentageResult !== null && <div className="result-box"><strong>{percentageResult}</strong><span>result</span></div>}
        </form>
      )}

      {activeTab === "Marks %" && (
        <form className="tool-panel marks-panel" onSubmit={calculateMarks}>
          <p className="helper-text">Enter marks for each subject to get the total percentage.</p>
          <div className="marks-header"><span>Subject</span><span>Obtained</span><span>Total</span></div>
          {marks.map((mark, index) => (
            <div className="marks-row" key={index}>
              <input aria-label={`Subject ${index + 1}`} value={mark.subject} onChange={(event) => updateMark(index, "subject", event.target.value)} placeholder={`Subject ${index + 1}`} />
              <input aria-label={`Obtained marks ${index + 1}`} type="number" min="0" value={mark.obtained} onChange={(event) => updateMark(index, "obtained", event.target.value)} placeholder="0" />
              <input aria-label={`Total marks ${index + 1}`} type="number" min="1" value={mark.total} onChange={(event) => updateMark(index, "total", event.target.value)} />
            </div>
          ))}
          <button className="primary-button" type="submit">Calculate marks %</button>
          {marksResult && <div className="result-box"><strong>{marksResult.percentage}%</strong><span>{marksResult.obtained} / {marksResult.total} marks</span></div>}
        </form>
      )}

      {activeTab === "Unit" && (
        <section className="tool-panel">
          <p className="helper-text">Convert length, weight, temperature, and area offline.</p>
          <label>Category<select value={unitType} onChange={(event) => { setUnitType(event.target.value); setUnitFrom(unitOptions[event.target.value][0]); setUnitTo(unitOptions[event.target.value][1]); }}><option value="length">Length</option><option value="weight">Weight</option><option value="temperature">Temperature</option><option value="area">Area</option></select></label>
          <label>Value<input type="number" value={unitValue} onChange={(event) => setUnitValue(event.target.value)} /></label>
          <div className="split-fields"><label>From<select value={unitFrom} onChange={(event) => setUnitFrom(event.target.value)}>{unitOptions[unitType].map((unit) => <option key={unit}>{unit}</option>)}</select></label><label>To<select value={unitTo} onChange={(event) => setUnitTo(event.target.value)}>{unitOptions[unitType].map((unit) => <option key={unit}>{unit}</option>)}</select></label></div>
          <div className="result-box"><strong>{formatMoney(calculateUnit())}</strong><span>{unitTo}</span></div>
        </section>
      )}

      {activeTab === "BMI" && (
        <section className="tool-panel"><p className="helper-text">Calculate body mass index from your weight and height.</p><div className="split-fields"><label>Weight (kg)<input type="number" min="1" value={body.weight} onChange={(event) => setBody({ ...body, weight: event.target.value })} /></label><label>Height (cm)<input type="number" min="1" value={body.height} onChange={(event) => setBody({ ...body, height: event.target.value })} /></label></div><div className="result-box"><strong>{Number.isFinite(bmiResult) && bmiResult > 0 ? bmiResult.toFixed(1) : "-"}</strong><span>BMI</span></div></section>
      )}

      {activeTab === "EMI" && (
        <section className="tool-panel"><p className="helper-text">Estimate your monthly loan payment.</p><label>Loan amount<input type="number" min="0" value={loan.amount} onChange={(event) => setLoan({ ...loan, amount: event.target.value })} /></label><div className="split-fields"><label>Annual interest (%)<input type="number" min="0" value={loan.rate} onChange={(event) => setLoan({ ...loan, rate: event.target.value })} /></label><label>Term (months)<input type="number" min="1" value={loan.months} onChange={(event) => setLoan({ ...loan, months: event.target.value })} /></label></div><div className="result-box"><strong>{formatMoney(emiResult)}</strong><span>monthly EMI</span></div></section>
      )}

      {activeTab === "GST" && (
        <section className="tool-panel"><p className="helper-text">Add GST to a base price.</p><div className="split-fields"><label>Base amount<input type="number" min="0" value={tax.amount} onChange={(event) => setTax({ ...tax, amount: event.target.value })} /></label><label>GST (%)<input type="number" min="0" value={tax.rate} onChange={(event) => setTax({ ...tax, rate: event.target.value })} /></label></div><div className="result-box"><strong>{formatMoney(taxResult)}</strong><span>total incl. GST</span></div></section>
      )}

      {activeTab === "Discount" && (
        <section className="tool-panel"><p className="helper-text">Find the final price after discount.</p><div className="split-fields"><label>Original price<input type="number" min="0" value={discount.amount} onChange={(event) => setDiscount({ ...discount, amount: event.target.value })} /></label><label>Discount (%)<input type="number" min="0" max="100" value={discount.rate} onChange={(event) => setDiscount({ ...discount, rate: event.target.value })} /></label></div><div className="result-box"><strong>{formatMoney(discountResult)}</strong><span>final price</span></div></section>
      )}

      {activeTab === "Tip" && (
        <section className="tool-panel"><p className="helper-text">Split a bill and tip between people.</p><label>Bill amount<input type="number" min="0" value={tip.amount} onChange={(event) => setTip({ ...tip, amount: event.target.value })} /></label><div className="split-fields"><label>Tip (%)<input type="number" min="0" value={tip.rate} onChange={(event) => setTip({ ...tip, rate: event.target.value })} /></label><label>People<input type="number" min="1" value={tip.people} onChange={(event) => setTip({ ...tip, people: event.target.value })} /></label></div><div className="result-box"><strong>{formatMoney(tipTotal / (Number(tip.people) || 1))}</strong><span>per person</span></div></section>
      )}

      {activeTab === "Time" && (
        <section className="tool-panel"><p className="helper-text">Convert hours and minutes into total minutes.</p><div className="split-fields"><label>Hours<input type="number" min="0" value={time.hours} onChange={(event) => setTime({ ...time, hours: event.target.value })} /></label><label>Minutes<input type="number" min="0" value={time.minutes} onChange={(event) => setTime({ ...time, minutes: event.target.value })} /></label></div><div className="result-box"><strong>{timeResult}</strong><span>total minutes</span></div></section>
      )}

      {activeTab === "Date Math" && (
        <section className="tool-panel"><p className="helper-text">Add or subtract days from a date.</p><label>Date<input type="date" value={dateMath.date} onChange={(event) => setDateMath({ ...dateMath, date: event.target.value })} /></label><div className="split-fields"><label>Action<select value={dateMath.direction} onChange={(event) => setDateMath({ ...dateMath, direction: event.target.value })}><option value="add">Add</option><option value="subtract">Subtract</option></select></label><label>Days<input type="number" min="0" value={dateMath.amount} onChange={(event) => setDateMath({ ...dateMath, amount: event.target.value })} /></label></div><div className="result-box"><strong>{dateMathResult()}</strong><span>new date</span></div></section>
      )}
    </div>
  );
}