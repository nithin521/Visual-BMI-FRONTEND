import { useState, useRef } from "react";
import { Download, Copy, Share2, Sparkles } from "lucide-react";
import "../styles/ShareResults.css";

function ShareResults({ type, result }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const generateResultCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(0, 0, canvas.width, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      type === "ai" ? "AI Body Analysis" : "BMI Calculator",
      canvas.width / 2,
      50
    );

    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";

    if (type === "ai") {
      ctx.fillText(result.category, canvas.width / 2, 180);
      ctx.font = "24px Arial";
    } else {
      ctx.fillText(`BMI: ${result.bmi}`, canvas.width / 2, 180);
      ctx.font = "32px Arial";
    }

    ctx.fillStyle = "#6b7280";
    ctx.font = "18px Arial";
    ctx.fillText(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      canvas.width / 2,
      300
    );

    ctx.font = "italic 16px Arial";
    ctx.fillText(
      type === "ai"
        ? "For entertainment purposes only"
        : "Based on WHO standards",
      canvas.width / 2,
      350
    );

    return canvas;
  };

  const downloadImage = () => {
    const canvas = generateResultCard();
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${
      type === "ai" ? "ai-analysis" : "bmi-result"
    }-${Date.now()}.png`;
    link.href = url;
    link.click();

    triggerConfetti();
  };

  const copyToClipboard = () => {
    let text;
    if (type === "ai") {
      text = `AI Body Analysis Result: ${result.category} (${result.bmi} BMI )\n\nFor entertainment purposes only.`;
    } else {
      text = `My BMI: ${result.bmi} (${result.category})\n\nCalculated using WHO standards.`;
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      triggerConfetti();
    });
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="share-results">
      <div className="share-header">
        <Share2 size={20} />
        <h4>Share Your Results</h4>
      </div>

      <div className="share-buttons">
        <button className="share-btn download" onClick={downloadImage}>
          <Download size={16} />
          Download Card
        </button>
        <button className="share-btn copy" onClick={copyToClipboard}>
          <Copy size={16} />
          {copied ? "Copied!" : "Copy Summary"}
        </button>
      </div>

      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: [
                  "#3b82f6",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                  "#8b5cf6",
                ][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
          <div className="confetti-icon">
            <Sparkles size={32} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareResults;
