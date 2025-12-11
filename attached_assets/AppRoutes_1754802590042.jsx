// src/routes/AppRoutes.jsx
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "../pages/Home";
import Music from "../pages/Music";
import Panic from "../pages/Panic";
import Journal from "../pages/Journal";
import AIChat from "../pages/AIChat";
import Games from "../pages/Games";
import Creativity from "../pages/Creativity";
import Relaxation from "../pages/Relaxation";
import Inspiration from "../pages/Inspiration";
import Settings from "../pages/Settings";

import Onboarding from "../pages/Onboarding";
import PrivacyNotice from "../pages/PrivacyNotice";
import ProfileSetup from "../pages/ProfileSetup";
import MoodCheck from "../pages/MoodCheck";
import MoodSuggestion from "../pages/MoodSuggestion";

const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/music" element={<Music />} />
      <Route path="/panic" element={<Panic />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/aichat" element={<AIChat />} />
      <Route path="/games" element={<Games />} />
      <Route path="/creativity" element={<Creativity />} />
      <Route path="/relaxation" element={<Relaxation />} />
      <Route path="/inspiration" element={<Inspiration />} />
      <Route path="/settings" element={<Settings />} />

      {/* Onboarding flow */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/privacy" element={<PrivacyNotice />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/mood-check" element={<MoodCheck />} />
      <Route path="/suggestion" element={<MoodSuggestion />} />
    </Routes>
  );
};

export default AppRoutes;
