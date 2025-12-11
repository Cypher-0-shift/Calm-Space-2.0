// src/components/FloatingAssistant.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import AIChat from "../pages/AIChat";

const FloatingAssistant = () => {
  const location = useLocation();

  // Optional: Hide on onboarding or specific paths
  if (location.pathname === "/onboarding") return null;

  return <AIChat />;
};

export default FloatingAssistant;
