import { useState } from 'react';
import { Heart, Utensils, Dumbbell, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/HealthTips.css';

function HealthTips({ bmiCategory }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const getTips = () => {
    const baseTips = {
      nutrition: {
        icon: <Utensils size={24} />,
        title: 'Nutrition Basics',
        tips: [
          'Eat a variety of colorful fruits and vegetables daily',
          'Choose whole grains over refined grains',
          'Include lean proteins in your meals',
          'Stay hydrated with water throughout the day',
          'Limit processed foods and added sugars'
        ]
      },
      exercise: {
        icon: <Dumbbell size={24} />,
        title: 'Exercise Suggestions',
        tips: [
          'Aim for 150 minutes of moderate activity per week',
          'Include strength training 2-3 times weekly',
          'Start with simple walks and gradually increase intensity',
          'Find activities you enjoy to stay motivated',
          'Remember that any movement is better than none'
        ]
      },
      lifestyle: {
        icon: <Sun size={24} />,
        title: 'Lifestyle Habits',
        tips: [
          'Get 7-9 hours of quality sleep each night',
          'Manage stress through relaxation techniques',
          'Maintain consistent meal times',
          'Practice mindful eating without distractions',
          'Build a support system for your health journey'
        ]
      }
    };

    if (bmiCategory === 'Underweight') {
      baseTips.nutrition.tips.unshift('Focus on nutrient-dense, calorie-rich foods');
      baseTips.nutrition.tips.unshift('Consider eating more frequent, smaller meals');
      baseTips.exercise.tips.unshift('Include strength training to build muscle mass');
    } else if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
      baseTips.nutrition.tips.unshift('Practice portion control at meals');
      baseTips.nutrition.tips.unshift('Consider keeping a food journal');
      baseTips.exercise.tips.unshift('Start with low-impact activities like swimming or cycling');
    }

    return baseTips;
  };

  const tips = getTips();

  const toggleCard = (cardName) => {
    setExpandedCard(expandedCard === cardName ? null : cardName);
  };

  return (
    <div className="health-tips">
      <div className="tips-header">
        <Heart size={32} />
        <div>
          <h2>Personalized Health Tips</h2>
          <p>Based on your BMI category: <strong>{bmiCategory}</strong></p>
        </div>
      </div>

      <div className="disclaimer-small">
        These are general wellness tips. For personalized medical advice, consult healthcare professionals.
      </div>

      <div className="tips-grid">
        {Object.entries(tips).map(([key, tip]) => (
          <div
            key={key}
            className={`tip-card ${expandedCard === key ? 'expanded' : ''}`}
          >
            <div className="tip-header" onClick={() => toggleCard(key)}>
              <div className="tip-icon">{tip.icon}</div>
              <h3>{tip.title}</h3>
              <button className="expand-btn">
                {expandedCard === key ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {expandedCard === key && (
              <ul className="tip-list">
                {tip.tips.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="general-tip">
        <p>
          <strong>Remember:</strong> For a healthy BMI, regular walking and balanced meals
          help maintain consistency. Small, sustainable changes are more effective than
          drastic measures.
        </p>
      </div>
    </div>
  );
}

export default HealthTips;
