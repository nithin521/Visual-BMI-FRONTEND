import { useState, useEffect } from "react";
import { Scale } from "lucide-react";
import ShareResults from "./ShareResults";
import "../styles/BMICalculator.css";

function BMICalculator({ onResult }) {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    if (!weight) return;

    if (unit === "metric" && !height) return;
    if (unit === "imperial" && (!heightFt || !heightIn)) return;

    let bmiValue;

    if (unit === "metric") {
      const weightKg = parseFloat(weight);
      const heightM = parseFloat(height) / 100;
      bmiValue = weightKg / (heightM * heightM);
    } else {
      const weightLbs = parseFloat(weight);
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn);
      bmiValue = (weightLbs / (totalInches * totalInches)) * 703;
    }

    if (isNaN(bmiValue)) return;

    bmiValue = Math.round(bmiValue * 10) / 10;

    let bmiCategory;
    if (bmiValue < 18.5) bmiCategory = "Underweight";
    else if (bmiValue < 25) bmiCategory = "Normal";
    else if (bmiValue < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    setBmi(bmiValue);
    setCategory(bmiCategory);

    const result = {
      bmi: bmiValue,
      category: bmiCategory,
      weight: parseFloat(weight),
      height:
        unit === "metric"
          ? parseFloat(height)
          : parseFloat(heightFt) * 12 + parseFloat(heightIn),
      unit,
      timestamp: new Date().toISOString(),
    };

    onResult(result);

    // const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    const history = JSON.parse(localStorage.getItem("bmiCalcHistory") || "[]");

    history.push(result);
    // localStorage.setItem("bmiHistory", JSON.stringify(history));
    localStorage.setItem("bmiCalcHistory", JSON.stringify(history));
  };

  const getBMIColor = (bmiValue) => {
    if (bmiValue < 18.5) return "#3b82f6";
    if (bmiValue < 25) return "#10b981";
    if (bmiValue < 30) return "#f59e0b";
    return "#ef4444";
  };

  const getIdealWeightRange = () => {
    if (!height && !(heightFt && heightIn)) return null;

    let heightM;
    if (unit === "metric") {
      heightM = parseFloat(height) / 100;
    } else {
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn);
      heightM = totalInches * 0.0254;
    }

    const minWeight = 18.5 * heightM * heightM;
    const maxWeight = 24.9 * heightM * heightM;

    if (unit === "metric") {
      return `${Math.round(minWeight)} - ${Math.round(maxWeight)} kg`;
    } else {
      return `${Math.round(minWeight * 2.20462)} - ${Math.round(
        maxWeight * 2.20462
      )} lbs`;
    }
  };

  const getMeterPosition = () => {
    if (!bmi) return 0;
    const minBMI = 15;
    const maxBMI = 40;
    const percentage = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className="bmi-calculator">
      <div className="section-header">
        <h2>BMI Calculator</h2>
        <span className="serious-badge">Serious Mode</span>
      </div>

      <p className="section-description">
        Calculate your Body Mass Index for a trustworthy health assessment
      </p>

      <div className="unit-toggle">
        <button
          className={unit === "metric" ? "active" : ""}
          onClick={() => setUnit("metric")}
        >
          Metric (kg, cm)
        </button>
        <button
          className={unit === "imperial" ? "active" : ""}
          onClick={() => setUnit("imperial")}
        >
          Imperial (lbs, ft)
        </button>
      </div>

      <div className="input-container">
        <div className="input-group">
          <label>Weight {unit === "metric" ? "(kg)" : "(lbs)"}</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "70" : "154"}
          />
        </div>

        {unit === "metric" ? (
          <div className="input-group">
            <label>Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
            />
          </div>
        ) : (
          <div className="input-row">
            <div className="input-group">
              <label>Feet</label>
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
              />
            </div>
            <div className="input-group">
              <label>Inches</label>
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="7"
              />
            </div>
          </div>
        )}
      </div>
      <div className="calculate-btn-wrapper">
        <button className="calculate-btn" onClick={calculateBMI}>
          Calculate BMI
        </button>
      </div>

      {bmi && (
        <div className="bmi-results">
          <div className="bmi-value-card">
            <Scale size={32} />
            <div>
              <h3>Your BMI</h3>
              <p className="bmi-number" style={{ color: getBMIColor(bmi) }}>
                {bmi}
              </p>
            </div>
          </div>

          <div
            className="bmi-category-card"
            style={{ borderColor: getBMIColor(bmi) }}
          >
            <h4>Category</h4>
            <p className="category-name" style={{ color: getBMIColor(bmi) }}>
              {category}
            </p>
          </div>

          <div className="bmi-meter">
            <div className="meter-labels">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
            <div className="meter-bar">
              <div className="meter-segment underweight"></div>
              <div className="meter-segment normal"></div>
              <div className="meter-segment overweight"></div>
              <div className="meter-segment obese"></div>
              <div
                className="meter-pointer"
                style={{ left: `${getMeterPosition()}%` }}
              >
                <div className="pointer-arrow"></div>
              </div>
            </div>
            <div className="meter-numbers">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>

          <div className="ideal-weight-range">
            <h4>Healthy BMI Range: 18.5 - 24.9</h4>
            {getIdealWeightRange() && (
              <p>
                Your ideal weight range:{" "}
                <strong>{getIdealWeightRange()}</strong>
              </p>
            )}
          </div>

          <ShareResults type="bmi" result={{ bmi, category }} />
        </div>
      )}
    </div>
  );
}

export default BMICalculator;
