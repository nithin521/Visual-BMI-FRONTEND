import { BookOpen, Calculator, AlertTriangle, Users } from "lucide-react";
import "../styles/EducationalInfo.css";

function EducationalInfo() {
  return (
    <div className="educational-info">
      <div className="section-header">
        <BookOpen size={32} />
        <h2>Understanding BMI</h2>
      </div>

      <div className="info-section">
        <div className="info-card">
          <div className="info-icon">
            <Calculator size={32} />
          </div>
          <h3>What is BMI?</h3>
          <p>
            Body Mass Index (BMI) is a simple calculation using a person's
            height and weight. It's used as a screening tool to identify whether
            someone may be underweight, at a healthy weight, overweight, or
            obese.
          </p>
          <p>
            BMI was developed in the 1830s by Belgian mathematician Adolphe
            Quetelet and has been widely adopted by health organizations
            worldwide, including the World Health Organization (WHO).
          </p>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Calculator size={32} />
          </div>
          <h3>How is BMI Calculated?</h3>
          <div className="formula-box">
            <p>
              <strong>Metric Formula:</strong>
            </p>
            <code>BMI = weight (kg) / height² (m²)</code>
          </div>
          <div className="formula-box">
            <p>
              <strong>Imperial Formula:</strong>
            </p>
            <code>BMI = (weight (lbs) / height² (inches²)) × 703</code>
          </div>
          <p className="example">
            <strong>Example:</strong> A person weighing 70 kg and 1.75 m tall
            would have a BMI of 70 ÷ (1.75 × 1.75) = 22.86
          </p>
        </div>

        <div className="info-card">
          <h3>BMI Categories</h3>
          <table className="bmi-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>BMI Range</th>
              </tr>
            </thead>
            <tbody>
              <tr className="underweight-row">
                <td>Underweight</td>
                <td>Below 18.5</td>
              </tr>
              <tr className="normal-row">
                <td>Normal Weight</td>
                <td>18.5 - 24.9</td>
              </tr>
              <tr className="overweight-row">
                <td>Overweight</td>
                <td>25.0 - 29.9</td>
              </tr>
              <tr className="obese-row">
                <td>Obese</td>
                <td>30.0 and above</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info-card warning-card">
          <div className="info-icon">
            <AlertTriangle size={32} />
          </div>
          <h3>BMI Limitations</h3>
          <p>
            While BMI is a useful screening tool, it has important limitations:
          </p>
          <ul>
            <li>
              <strong>Doesn't distinguish between muscle and fat:</strong>{" "}
              Athletes and people with high muscle mass may have a high BMI but
              low body fat.
            </li>
            <li>
              <strong>Doesn't account for fat distribution:</strong> Where fat
              is stored (around organs vs. under skin) matters for health risks.
            </li>
            <li>
              <strong>Age and gender differences:</strong> Elderly people and
              women naturally have different body compositions.
            </li>
            <li>
              <strong>Ethnic variations:</strong> Different ethnic groups have
              different health risk thresholds at the same BMI.
            </li>
            <li>
              <strong>Doesn't measure overall health:</strong> BMI says nothing
              about fitness level, diet quality, or other health markers.
            </li>
          </ul>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Users size={32} />
          </div>
          <h3>Why Muscle Mass Matters</h3>
          <p>
            Muscle is denser than fat, meaning it weighs more for the same
            volume. This is why:
          </p>
          <ul>
            <li>
              Bodybuilders often have "overweight" or "obese" BMI despite being
              very lean
            </li>
            <li>
              Someone who exercises regularly might weigh more than expected
            </li>
            <li>Two people with the same BMI can look very different</li>
            <li>
              Losing weight through diet alone (without exercise) can reduce
              both fat and muscle
            </li>
          </ul>
          <p>
            This is why BMI should be used alongside other health measurements
            like waist circumference, body fat percentage, and overall fitness
            level.
          </p>
        </div>

        <div className="info-card highlight-card">
          <h3>Better Health Indicators</h3>
          <p>
            For a more complete picture of health, consider these measurements
            alongside BMI:
          </p>
          <div className="indicators-grid">
            <div className="indicator">
              <strong>Waist Circumference</strong>
              <p>Measures abdominal fat</p>
            </div>
            <div className="indicator">
              <strong>Body Fat Percentage</strong>
              <p>Actual fat vs. lean mass</p>
            </div>
            <div className="indicator">
              <strong>Waist-to-Hip Ratio</strong>
              <p>Fat distribution pattern</p>
            </div>
            <div className="indicator">
              <strong>Fitness Level</strong>
              <p>Cardiovascular health</p>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>When to Use BMI</h3>
          <p>BMI is most useful as:</p>
          <ul>
            <li>A quick screening tool for large populations</li>
            <li>A starting point for health conversations</li>
            <li>One data point among many health indicators</li>
            <li>A general guide for average adults</li>
          </ul>
          <p>
            <strong>Always consult healthcare professionals</strong> for
            personalized health assessments and recommendations. They can
            consider your complete health picture, including medical history,
            lifestyle, and other factors.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EducationalInfo;
