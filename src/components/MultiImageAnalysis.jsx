import { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import "../styles/MultiImageAnalysis.css";

const API_URL = "https://nithin521-visual-bmi-backend.hf.space/predict-image"; // update if deployed

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function MultiImageAnalysis() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // -------------------------
  // Handle image selection
  // -------------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      setError("You can upload a maximum of 3 images.");
      return;
    }

    setImages(files);
    setError("");
    setResult(null);
  };

  // -------------------------
  // Analyze images
  // -------------------------
  const analyzeImages = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bmiValues = [];

      for (const image of images) {
        const formData = new FormData();
        formData.append("image", image);

        const res = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Failed to analyze one of the images.");
        }

        const data = await res.json();
        bmiValues.push(data.bmi);
      }

      // 🔥 Average BMI
      const avgBMI =
        bmiValues.reduce((sum, val) => sum + val, 0) / bmiValues.length;

      const finalBMI = Number(avgBMI.toFixed(1));
      const category = getBMICategory(finalBMI);

      const resultData = {
        bmi: finalBMI,
        category,
        timestamp: new Date().toISOString(),
        source: "ai-multi",
        samples: images.length,
      };

      // Save to AI history
      const history = JSON.parse(localStorage.getItem("bmiAIHistory")) || [];
      history.push(resultData);
      localStorage.setItem("bmiAIHistory", JSON.stringify(history));

      setResult(resultData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="multi-image-container">
      <div className="multi-image-card">
        <h2>Multi-Image BMI Analysis</h2>
        <p className="subtitle">
          Upload up to <strong>3 images</strong> for a more accurate AI-based
          BMI estimate
        </p>

        {/* Upload */}
        <label className="upload-box">
          <Upload size={22} />
          <span>Select Images (max 3)</span>
          <small>Front-facing, full-body images recommended</small>
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageChange}
          />
        </label>

        {/* Preview */}
        {/* Preview */}
        <div className="image-preview-fixed">
          {[0, 1, 2].map((index) => (
            <div key={index} className="preview-slot">
              {images[index] ? (
                <img
                  src={URL.createObjectURL(images[index])}
                  alt={`preview-${index}`}
                />
              ) : (
                <div className="empty-slot">
                  <ImageIcon size={24} />
                  <span>Image {index + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action */}
        <button
          className="analyze-btn"
          onClick={analyzeImages}
          disabled={loading}
        >
          {loading ? "Analyzing Images…" : "Analyze Images"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {/* Result */}
        {result && (
          <div className="result-card">
            <h3>Final BMI Result</h3>
            <div className="bmi-circle">{result.bmi}</div>
            <p className="bmi-category">{result.category}</p>
            <p className="sample-info">Averaged from {result.samples} images</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiImageAnalysis;


