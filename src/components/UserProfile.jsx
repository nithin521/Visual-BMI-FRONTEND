import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, LogOut, Settings, Save, Moon, Sun } from "lucide-react";
import "../styles/UserProfile.css";

function UserProfile({ onThemeChange }) {
  const { currentUser, userPreferences, logout, updateUserPreferences } =
    useAuth();
  const [preferences, setPreferences] = useState({
    theme: "light",
    units: "metric",
    notifications: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userPreferences?.preferences) {
      setPreferences(userPreferences.preferences);
    }
  }, [userPreferences]);

  async function handleSavePreferences() {
    try {
      setSaving(true);
      setMessage("");
      await updateUserPreferences(preferences);

      // Update theme in parent component
      if (onThemeChange) {
        onThemeChange(preferences.theme);
      }

      setMessage("Preferences saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  function handlePreferenceChange(key, value) {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {currentUser?.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h2>{currentUser?.displayName || "User"}</h2>
          <p className="profile-email">
            <Mail size={16} />
            {currentUser?.email}
          </p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="profile-section">
        <h3>
          <Settings size={20} />
          Preferences
        </h3>

        <div className="preference-group">
          <label>Theme</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={preferences.theme === "light"}
                onChange={(e) =>
                  handlePreferenceChange("theme", e.target.value)
                }
              />
              <Sun size={18} />
              Light
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={preferences.theme === "dark"}
                onChange={(e) =>
                  handlePreferenceChange("theme", e.target.value)
                }
              />
              <Moon size={18} />
              Dark
            </label>
          </div>
        </div>

        <div className="preference-group">
          <label>Measurement Units</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="units"
                value="metric"
                checked={preferences.units === "metric"}
                onChange={(e) =>
                  handlePreferenceChange("units", e.target.value)
                }
              />
              Metric (kg, cm)
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="units"
                value="imperial"
                checked={preferences.units === "imperial"}
                onChange={(e) =>
                  handlePreferenceChange("units", e.target.value)
                }
              />
              Imperial (lbs, in)
            </label>
          </div>
        </div>

        <div className="preference-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) =>
                handlePreferenceChange("notifications", e.target.checked)
              }
            />
            Enable notifications
          </label>
        </div>

        {message && (
          <div
            className={`save-message ${message.includes("success") ? "success" : "error"}`}
          >
            {message}
          </div>
        )}

        <button
          className="save-button"
          onClick={handleSavePreferences}
          disabled={saving}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      <div className="profile-section">
        <h3>Account Information</h3>
        <div className="info-row">
          <span className="info-label">Member since:</span>
          <span className="info-value">
            {userPreferences?.createdAt
              ? new Date(userPreferences.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
