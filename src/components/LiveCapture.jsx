import { useRef, useState } from "react";
import { Camera, RefreshCcw } from "lucide-react";
import "../styles/LiveCameraBMI.css";

const API_URL = "https://nithin521-visual-bmi-backend.hf.space/predict-image";

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export default function LiveCameraBMI() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);

  // -----------------------
  // Start Camera
  // -----------------------
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });
    videoRef.current.srcObject = stream;
  };

  // -----------------------
  // Capture Photo
  // -----------------------
  const captureAndAnalyze = async () => {
    setLoading(true);
    setError("");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 224;
    canvas.height = 224;

    ctx.drawImage(video, 0, 0, 224, 224);

    canvas.toBlob(async (blob) => {
      try {
        const formData = new FormData();
        formData.append("image", blob, "capture.jpg");

        const res = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Analysis failed");

        const data = await res.json();

        const category = getBMICategory(data.bmi);

        const resultData = {
          bmi: data.bmi,
          category,
          source: "live-camera",
          timestamp: new Date().toISOString(),
        };

        // Save to history
        const history = JSON.parse(localStorage.getItem("bmiAIHistory")) || [];
        history.push(resultData);
        localStorage.setItem("bmiAIHistory", JSON.stringify(history));

        setResult(resultData);
      } catch (err) {
        setError("Could not analyze image");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="camera-container">
      <h1>Live Camera BMI Analysis</h1>
      <p className="subtitle">
        Stand straight, full body visible, good lighting
      </p>

      <div className="camera-box">
        {/* <video ref={videoRef} autoPlay playsInline /> */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.2s ease",
          }}
        />

        <canvas ref={canvasRef} hidden />
      </div>

      <div className="zoom-controls">
        <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}>
          Zoom +
        </button>
        <button onClick={() => setZoom((z) => Math.max(z - 0.1, 1))}>
          Zoom −
        </button>
      </div>

      <div className="camera-actions">
        <button onClick={startCamera}>
          <Camera size={18} /> Start Camera
        </button>

        <button onClick={captureAndAnalyze} disabled={loading}>
          {loading ? "Analyzing…" : "Capture & Analyze"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-card">
          <div className="bmi-circle">{result.bmi}</div>
          <p className="bmi-category">{result.category}</p>
        </div>
      )}
    </div>
  );
}


