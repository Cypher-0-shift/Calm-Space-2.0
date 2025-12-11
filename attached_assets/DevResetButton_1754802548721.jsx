// src/components/DevResetButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DevResetButton = () => {
  const navigate = useNavigate();

  const handleReset = () => {
    // Clear only the keys used by your app
    localStorage.removeItem("hasSeenOnboarding");
    localStorage.removeItem("allowPersonalization");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("currentMood");
    localStorage.removeItem("moodTheme");
    localStorage.removeItem("tourCompleted");

    // Navigate to start
    navigate("/onboarding");
  };

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-4 right-4 z-[999] bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm hover:bg-red-700 transition"
    >
      🔄 Reset App
    </button>
  );
};

export default DevResetButton;
