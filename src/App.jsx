// import { useState, useEffect } from "react";
// import ImageAnalysis from "./components/ImageAnalysis";
// import BMICalculator from "./components/BMICalculator";
// import Comparison from "./components/Comparison";
// import HealthTips from "./components/HealthTips";
// import ProgressTracker from "./components/ProgressTracker";
// import EducationalInfo from "./components/EducationalInfo";
// import MultiImageAnalysis from "./components/MultiImageAnalysis";
// import LiveCapture from "./components/LiveCapture";
// import { Moon, Sun } from "lucide-react";
// import "./styles/App.css";

// function App() {
//   const [activeTab, setActiveTab] = useState("ai-analysis");
//   const [theme, setTheme] = useState("light");
//   const [aiResult, setAiResult] = useState(null);
//   const [bmiResult, setBmiResult] = useState(null);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "light";
//     setTheme(savedTheme);
//     document.body.className = savedTheme;
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.body.className = newTheme;
//   };

//   return (
//     <div className={`app ${theme}`}>
//       <header className="app-header">
//         <div className="header-content">
//           <h1>Body Analysis & BMI Calculator</h1>
//           <button className="theme-toggle" onClick={toggleTheme}>
//             {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
//           </button>
//         </div>
//         <nav className="nav-tabs">
//           <button
//             className={activeTab === "ai-analysis" ? "active" : ""}
//             onClick={() => setActiveTab("ai-analysis")}
//           >
//             AI Analysis
//           </button>
//           <button
//             className={activeTab === "live-camera" ? "active" : ""}
//             onClick={() => setActiveTab("live-camera")}
//           >
//             Live Camera
//           </button>
//           <button
//             className={activeTab === "multi-ai-analysis" ? "active" : ""}
//             onClick={() => setActiveTab("multi-ai-analysis")}
//           >
//             Multi-Image (More Accurate)
//           </button>
//           <button
//             className={activeTab === "bmi-calculator" ? "active" : ""}
//             onClick={() => setActiveTab("bmi-calculator")}
//           >
//             BMI Calculator
//           </button>

//           <button
//             className={activeTab === "progress" ? "active" : ""}
//             onClick={() => setActiveTab("progress")}
//           >
//             Progress Tracker
//           </button>
//           <button
//             className={activeTab === "info" ? "active" : ""}
//             onClick={() => setActiveTab("info")}
//           >
//             Learn More
//           </button>
//         </nav>
//       </header>

//       <main className="app-main">
//         {activeTab === "ai-analysis" && (
//           <ImageAnalysis onResult={setAiResult} />
//         )}
//         {activeTab === "bmi-calculator" && (
//           <BMICalculator onResult={setBmiResult} />
//         )}
//         {activeTab === "comparison" && (
//           <Comparison aiResult={aiResult} bmiResult={bmiResult} />
//         )}
//         {activeTab === "progress" && <ProgressTracker />}
//         {activeTab === "multi-ai-analysis" && <MultiImageAnalysis />}
//         {activeTab === "info" && <EducationalInfo />}
//         {activeTab === "live-camera" && <LiveCapture />}

//         {bmiResult && activeTab === "bmi-calculator" && (
//           <HealthTips bmiCategory={bmiResult.category} />
//         )}
//       </main>

//       <footer className="app-footer">
//         <p>
//           Your data stays in your browser. No information is stored on our
//           servers.
//         </p>
//         <p>
//           For entertainment and educational purposes only. Consult healthcare
//           professionals for medical advice.
//         </p>
//       </footer>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import ImageAnalysis from "./components/ImageAnalysis";
import BMICalculator from "./components/BMICalculator";
import Comparison from "./components/Comparison";
import HealthTips from "./components/HealthTips";
import ProgressTracker from "./components/ProgressTracker";
import EducationalInfo from "./components/EducationalInfo";
import MultiImageAnalysis from "./components/MultiImageAnalysis";
import LiveCapture from "./components/LiveCapture";
import { Moon, Sun, User as UserIcon } from "lucide-react";
import "./styles/App.css";

function AppContent() {
  const [activeTab, setActiveTab] = useState("ai-analysis");
  const [theme, setTheme] = useState("light");
  const [aiResult, setAiResult] = useState(null);
  const [bmiResult, setBmiResult] = useState(null);
  const [showAuthMode, setShowAuthMode] = useState("login"); // "login" or "signup"
  const { currentUser, userPreferences } = useAuth();

  useEffect(() => {
    // Load theme from user preferences or localStorage
    if (userPreferences?.preferences?.theme) {
      setTheme(userPreferences.preferences.theme);
      document.body.className = userPreferences.preferences.theme;
    } else {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }
  }, [userPreferences]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  // Show login/signup if user is not authenticated
  if (!currentUser) {
    return showAuthMode === "login" ? (
      <Login onToggleMode={() => setShowAuthMode("signup")} />
    ) : (
      <Signup onToggleMode={() => setShowAuthMode("login")} />
    );
  }

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>Body Analysis & BMI Calculator</h1>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              className={`profile-toggle ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <UserIcon size={20} />
              {currentUser?.displayName || "Profile"}
            </button>
          </div>
        </div>
        <nav className="nav-tabs">
          <button
            className={activeTab === "ai-analysis" ? "active" : ""}
            onClick={() => setActiveTab("ai-analysis")}
          >
            AI Analysis
          </button>
          <button
            className={activeTab === "live-camera" ? "active" : ""}
            onClick={() => setActiveTab("live-camera")}
          >
            Live Camera
          </button>
          <button
            className={activeTab === "multi-ai-analysis" ? "active" : ""}
            onClick={() => setActiveTab("multi-ai-analysis")}
          >
            Multi-Image (More Accurate)
          </button>
          <button
            className={activeTab === "bmi-calculator" ? "active" : ""}
            onClick={() => setActiveTab("bmi-calculator")}
          >
            BMI Calculator
          </button>
          <button
            className={activeTab === "progress" ? "active" : ""}
            onClick={() => setActiveTab("progress")}
          >
            Progress Tracker
          </button>
          <button
            className={activeTab === "info" ? "active" : ""}
            onClick={() => setActiveTab("info")}
          >
            Learn More
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === "profile" && (
          <UserProfile onThemeChange={handleThemeChange} />
        )}
        {activeTab === "ai-analysis" && (
          <ImageAnalysis onResult={setAiResult} />
        )}
        {activeTab === "bmi-calculator" && (
          <BMICalculator onResult={setBmiResult} />
        )}
        {activeTab === "comparison" && (
          <Comparison aiResult={aiResult} bmiResult={bmiResult} />
        )}
        {activeTab === "progress" && <ProgressTracker />}
        {activeTab === "multi-ai-analysis" && <MultiImageAnalysis />}
        {activeTab === "info" && <EducationalInfo />}
        {activeTab === "live-camera" && <LiveCapture />}

        {bmiResult && activeTab === "bmi-calculator" && (
          <HealthTips bmiCategory={bmiResult.category} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Your data is securely stored in the cloud and synced across devices.
        </p>
        <p>
          For entertainment and educational purposes only. Consult healthcare
          professionals for medical advice.
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
