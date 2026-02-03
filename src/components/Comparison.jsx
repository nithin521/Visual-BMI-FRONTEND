import { AlertCircle, CheckCircle } from 'lucide-react';
import '../styles/Comparison.css';

function Comparison({ aiResult, bmiResult }) {
  if (!aiResult && !bmiResult) {
    return (
      <div className="comparison">
        <div className="empty-state">
          <AlertCircle size={48} />
          <h2>No Results Yet</h2>
          <p>Complete both the AI Analysis and BMI Calculator to see a comparison</p>
        </div>
      </div>
    );
  }

  const getInsights = () => {
    if (!aiResult || !bmiResult) return null;

    const aiCategory = aiResult.category;
    const bmiCategory = bmiResult.category;

    const insights = [];

    if (aiCategory === bmiCategory) {
      insights.push({
        type: 'match',
        message: 'Both methods show similar results'
      });
    } else {
      insights.push({
        type: 'mismatch',
        message: 'Results differ - this is common and expected'
      });
    }

    insights.push({
      type: 'info',
      message: 'BMI calculation is based on scientific formula and actual measurements'
    });

    insights.push({
      type: 'info',
      message: 'AI analysis is visual estimation and less accurate'
    });

    return insights;
  };

  const insights = getInsights();

  return (
    <div className="comparison">
      <div className="section-header">
        <h2>Compare Results</h2>
      </div>

      <p className="section-description">
        See how AI estimation compares to calculated BMI
      </p>

      <div className="comparison-grid">
        <div className="comparison-card">
          <h3>AI Image Analysis</h3>
          <div className="method-badge fun">Entertainment</div>
          {aiResult ? (
            <>
              <div className="result-display">
                <span className="result-value">{aiResult.category}</span>
                <span className="confidence-badge">{aiResult.confidence}% confidence</span>
              </div>
              <ul className="method-points">
                <li>Based on visual appearance</li>
                <li>Quick estimation</li>
                <li>May be affected by clothing, lighting, angle</li>
                <li>Not medically accurate</li>
              </ul>
            </>
          ) : (
            <div className="no-result">
              <p>No AI analysis performed yet</p>
              <small>Go to AI Analysis tab to upload a photo</small>
            </div>
          )}
        </div>

        <div className="vs-divider">VS</div>

        <div className="comparison-card">
          <h3>BMI Calculator</h3>
          <div className="method-badge serious">Scientific</div>
          {bmiResult ? (
            <>
              <div className="result-display">
                <span className="result-value">{bmiResult.category}</span>
                <span className="bmi-badge">BMI: {bmiResult.bmi}</span>
              </div>
              <ul className="method-points">
                <li>Based on weight and height</li>
                <li>WHO-approved formula</li>
                <li>Objective measurement</li>
                <li>Medically recognized standard</li>
              </ul>
            </>
          ) : (
            <div className="no-result">
              <p>No BMI calculated yet</p>
              <small>Go to BMI Calculator tab to enter your measurements</small>
            </div>
          )}
        </div>
      </div>

      {insights && (
        <div className="insights-section">
          <h3>Key Insights</h3>
          <div className="insights-list">
            {insights.map((insight, index) => (
              <div key={index} className={`insight-item ${insight.type}`}>
                {insight.type === 'match' && <CheckCircle size={20} />}
                {insight.type !== 'match' && <AlertCircle size={20} />}
                <p>{insight.message}</p>
              </div>
            ))}
          </div>

          <div className="recommendation-box">
            <h4>Our Recommendation</h4>
            <p>
              Always trust the <strong>BMI Calculator</strong> for health decisions.
              Use AI Analysis for entertainment only. For personalized health advice,
              consult with healthcare professionals who can consider factors like
              muscle mass, bone density, and overall health.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comparison;
