import { useLocation } from "wouter";

const DevResetButton = () => {
  const [, setLocation] = useLocation();

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the app? This will clear all your data.")) {
      // Clear all localStorage data
      localStorage.removeItem("hasSeenOnboarding"); // Legacy
      localStorage.removeItem("calm_onboarding_complete");
      localStorage.removeItem("calm_glimpse_seen");
      
      localStorage.removeItem("allowPersonalization");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("currentMood");
      localStorage.removeItem("moodTheme");
      localStorage.removeItem("tourCompleted");
      localStorage.removeItem("favorites");
      localStorage.removeItem("playlists");
      localStorage.removeItem("chatHistory");
      localStorage.removeItem("journalEntries");
      localStorage.removeItem("settings");
      
      // Navigate to root (router determines next step)
      setLocation("/");
    }
  };

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-4 right-4 z-[999] bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
    >
      🔄 Reset App
    </button>
  );
};

export default DevResetButton;