import { useState, useEffect } from "react";
import {
  TrendingDown,
  TrendingUp,
  Trash2,
  Calendar,
  Cloud,
  HardDrive,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ProgressTracker.css";

function ProgressTracker() {
  const [calcHistory, setCalcHistory] = useState([]);
  const [aiHistory, setAiHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("calculator");
  const [loading, setLoading] = useState(true);
  const { currentUser, userPreferences } = useAuth();

  useEffect(() => {
    loadHistory();
  }, [currentUser, userPreferences, activeTab]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      if (currentUser && userPreferences) {
        // Load from Firebase
        const calcData = userPreferences.bmiHistory || [];
        const aiData = userPreferences.aiHistory || [];
        setCalcHistory(calcData);
        setAiHistory(aiData);
      } else {
        // Fallback to localStorage if not logged in
        setCalcHistory(
          JSON.parse(localStorage.getItem("bmiCalcHistory") || "[]"),
        );
        setAiHistory(JSON.parse(localStorage.getItem("bmiAIHistory") || "[]"));
      }
    } catch (error) {
      console.error("Error loading history:", error);
      setCalcHistory(
        JSON.parse(localStorage.getItem("bmiCalcHistory") || "[]"),
      );
      setAiHistory(JSON.parse(localStorage.getItem("bmiAIHistory") || "[]"));
    } finally {
      setLoading(false);
    }
  };

  const history = activeTab === "calculator" ? calcHistory : aiHistory;

  const clearHistory = async () => {
    if (!window.confirm("Clear this progress history?")) return;

    if (activeTab === "calculator") {
      setCalcHistory([]);
      localStorage.removeItem("bmiCalcHistory");
    } else {
      setAiHistory([]);
      localStorage.removeItem("bmiAIHistory");
    }
  };

  const deleteRecord = (timestamp) => {
    const updated = history.filter((e) => e.timestamp !== timestamp);

    if (activeTab === "calculator") {
      setCalcHistory(updated);
      localStorage.setItem("bmiCalcHistory", JSON.stringify(updated));
    } else {
      setAiHistory(updated);
      localStorage.setItem("bmiAIHistory", JSON.stringify(updated));
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTrend = () => {
    if (history.length < 2) return null;
    const latest = history[history.length - 1].bmi;
    const previous = history[history.length - 2].bmi;
    const diff = latest - previous;

    return {
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
      value: Math.abs(diff).toFixed(1),
    };
  };

  const getChartPoints = () => {
    if (history.length === 0) return [];
    const maxBMI = Math.max(...history.map((h) => h.bmi));
    const minBMI = Math.min(...history.map((h) => h.bmi));
    const range = maxBMI - minBMI || 1;

    return history.map((entry, index) => ({
      x: (index / (history.length - 1 || 1)) * 100,
      y: 100 - ((entry.bmi - minBMI) / range) * 80,
      bmi: entry.bmi,
    }));
  };

  const trend = getTrend();
  const chartPoints = getChartPoints();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="empty-state">
          <div className="spinner"></div>
          <p>Loading your progress...</p>
        </div>
      );
    }

    if (history.length === 0) {
      return (
        <div className="empty-state">
          <Calendar size={48} />
          <h2>No Progress Data</h2>
          <p>
            {activeTab === "calculator"
              ? "Calculate your BMI to start tracking."
              : "Analyze an image to start AI tracking."}
          </p>
          {currentUser ? (
            <div className="sync-status">
              <Cloud size={16} />
              <span>Synced with cloud</span>
            </div>
          ) : (
            <div className="sync-status offline">
              <HardDrive size={16} />
              <span>Local storage - Login to sync</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        {/* SYNC STATUS */}
        <div className={`sync-indicator ${currentUser ? "online" : "offline"}`}>
          {currentUser ? (
            <>
              <Cloud size={14} />
              <span>Synced to cloud</span>
            </>
          ) : (
            <>
              <HardDrive size={14} />
              <span>Local storage only</span>
            </>
          )}
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Latest BMI</h3>
            <p className="stat-value">{history.at(-1).bmi}</p>
            <span className="stat-label">{history.at(-1).category}</span>
          </div>

          {trend && (
            <div className="stat-card">
              <h3>Trend</h3>
              <p className={`stat-value trend-${trend.direction}`}>
                {trend.direction === "up" && <TrendingUp />}
                {trend.direction === "down" && <TrendingDown />}
                {trend.value}
              </p>
            </div>
          )}

          <div className="stat-card">
            <h3>First Recorded</h3>
            <p className="stat-value">{history[0].bmi}</p>
            <span className="stat-label">
              {formatDate(history[0].timestamp)}
            </span>
          </div>
        </div>

        {/* CHART */}
        <div className="chart-container">
          <h3>
            {activeTab === "calculator"
              ? "BMI Calculator Progress"
              : "AI Image Analysis Progress"}
          </h3>

          <svg className="bmi-chart" viewBox="0 0 100 100">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.5"
              points={chartPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            />
            {chartPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#3b82f6" />
            ))}
          </svg>
        </div>

        {/* HISTORY */}
        <div className="history-list">
          <h3>History ({history.length} records)</h3>
          {history
            .slice()
            .reverse()
            .map((entry) => (
              <div key={entry.timestamp} className="history-item">
                <span>{formatDate(entry.timestamp)}</span>
                <span>BMI: {entry.bmi}</span>
                <span>{entry.category}</span>
                <button onClick={() => deleteRecord(entry.timestamp)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
        </div>
      </>
    );
  };

  return (
    <div className="progress-tracker">
      <div className="tracker-tabs">
        <button
          className={activeTab === "calculator" ? "active" : ""}
          onClick={() => setActiveTab("calculator")}
        >
          🧮 BMI Calculator
        </button>
        <button
          className={activeTab === "ai" ? "active" : ""}
          onClick={() => setActiveTab("ai")}
        >
          🤖 AI Image Analysis
        </button>
      </div>

      <div className="tracker-header">
        <h2>Your Progress</h2>
        {history.length > 0 && (
          <button className="clear-btn" onClick={clearHistory}>
            <Trash2 size={16} /> Clear
          </button>
        )}
      </div>

      {renderContent()}
    </div>
  );
}

export default ProgressTracker;
