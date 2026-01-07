import { useState } from "react";
import { Camera, RefreshCw, Info } from "lucide-react";
import ShareResults from "./ShareResults";
import "../styles/ImageAnalysis.css";

function ImageAnalysis({ onResult }) {
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setScanning(true);

    try {
      const formData = new FormData();

      // Convert base64 image to Blob
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append("image", blob);

      const res = await fetch("http://127.0.0.1:5000/predict-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const resultData = {
        category: data.category,
        bmi: data.bmi,
        timestamp: new Date().toISOString(),
      };

      setResult(resultData);
      onResult(resultData);
      const history = JSON.parse(localStorage.getItem("bmiAIHistory") || "[]");
      history.push(resultData);
      localStorage.setItem("bmiAIHistory", JSON.stringify(history));
    } catch (error) {
      alert("Prediction failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };
  const getBMIRange = (bmi) => {
    if (bmi < 18.5) return "Underweight (Below 18.5)";
    if (bmi < 25) return "Normal (18.5–24.9)";
    if (bmi < 30) return "Overweight (25–29.9)";
    return "Obese (30+)";
  };

  const handleRetry = () => {
    setImage(null);
    setResult(null);
  };

  const getEmoji = (category) => {
    switch (category) {
      case "Normal":
        return "✨";
      case "Overweight":
        return "💪";
      default:
        return "🎯";
    }
  };

  const getResultColor = (category) => {
    switch (category) {
      case "Normal":
        return "#10b981";
      case "Overweight":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="image-analysis">
      <div className="section-header">
        <h2>AI Image Analysis</h2>
        <span className="fun-badge">Fun Mode</span>
      </div>

      <p className="section-description">
        Upload a face or upper-body photo for a quick AI estimation
      </p>

      <div className="upload-container">
        {!image ? (
          <label className="upload-box">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
            <Camera size={48} />
            <p>Click to upload photo</p>
            <span>or drag and drop</span>
          </label>
        ) : (
          <div className="image-preview-container">
            <div className={`image-preview ${scanning ? "scanning" : ""}`}>
              <img src={image} alt="Uploaded" />
              {scanning && (
                <>
                  <div className="scan-line"></div>
                  <div className="scan-grid"></div>
                  <div className="loading-ring"></div>
                </>
              )}
            </div>

            {!result && !scanning && (
              <button className="analyze-btn" onClick={analyzeImage}>
                Analyze Image
              </button>
            )}

            {result && (
              <div className="result-card">
                <div className="result-emoji" style={{ fontSize: "64px" }}>
                  {getEmoji(result.category)}
                </div>

                <h3 style={{ color: getResultColor(result.category) }}>
                  {result.category}
                </h3>

                <p className="confidence">
                  Estimated BMI: {result.bmi.toFixed(1)}
                </p>

                <p className="bmi-range">{getBMIRange(result.bmi)}</p>

                <button className="retry-btn" onClick={handleRetry}>
                  <RefreshCw size={16} />
                  Try Another Photo
                </button>

                <ShareResults type="ai" result={result} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="disclaimer">
        <div className="disclaimer-header">
          <Info size={20} />
          <strong>Important Disclaimer</strong>
          <button
            className="tooltip-btn"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            Why might this be inaccurate?
          </button>
        </div>
        <p>
          This AI result is an approximation based on visual features and is for
          entertainment purposes only. It should not be used for medical or
          health decisions.
        </p>
        {showTooltip && (
          <div className="tooltip">
            <p>
              <strong>AI limitations include:</strong>
            </p>
            <ul>
              <li>Cannot assess actual body composition</li>
              <li>May be influenced by clothing and lighting</li>
              <li>Does not consider muscle mass or bone density</li>
              <li>Photo angle and posture affect results</li>
              <li>No medical training or diagnostic capability</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageAnalysis;
