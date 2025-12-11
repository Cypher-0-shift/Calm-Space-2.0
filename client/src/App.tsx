import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

import AppWrapper from "@/components/AppWrapper";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import PrivacyNotice from "@/pages/PrivacyNotice";
import ProfileSetup from "@/pages/ProfileSetup";
import MoodCheck from "@/pages/MoodCheck";
import MoodSuggestion from "@/pages/MoodSuggestion";
import Music from "@/pages/Music";
import AIChat from "@/pages/AIChat";
import Journal from "@/pages/Journal";
import Panic from "@/pages/Panic";
import Games from "@/pages/Games";
import Creativity from "@/pages/Creativity";
import Inspiration from "@/pages/Inspiration";
import Relaxation from "@/pages/Relaxation";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Check if user has completed onboarding
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    
    if (!hasSeenOnboarding && location !== "/onboarding" && 
        !location.startsWith("/privacy") && 
        !location.startsWith("/profile-setup") &&
        !location.startsWith("/mood-check") &&
        !location.startsWith("/suggestion")) {
      setLocation("/onboarding");
    }
  }, [location, setLocation]);

  return (
    <Switch>
      {/* Onboarding flow */}
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/privacy" component={PrivacyNotice} />
      <Route path="/profile-setup" component={ProfileSetup} />
      <Route path="/mood-check" component={MoodCheck} />
      <Route path="/suggestion" component={MoodSuggestion} />
      
      {/* Main app pages */}
      <Route path="/">
        <AppWrapper>
          <Home />
        </AppWrapper>
      </Route>
      <Route path="/music">
        <AppWrapper>
          <Music />
        </AppWrapper>
      </Route>
      <Route path="/aichat">
        <AppWrapper>
          <AIChat />
        </AppWrapper>
      </Route>
      <Route path="/journal">
        <AppWrapper>
          <Journal />
        </AppWrapper>
      </Route>
      <Route path="/panic">
        <AppWrapper>
          <Panic />
        </AppWrapper>
      </Route>
      <Route path="/games">
        <AppWrapper>
          <Games />
        </AppWrapper>
      </Route>
      <Route path="/creativity">
        <AppWrapper>
          <Creativity />
        </AppWrapper>
      </Route>
      <Route path="/inspiration">
        <AppWrapper>
          <Inspiration />
        </AppWrapper>
      </Route>
      <Route path="/relaxation">
        <AppWrapper>
          <Relaxation />
        </AppWrapper>
      </Route>
      <Route path="/settings">
        <AppWrapper>
          <Settings />
        </AppWrapper>
      </Route>
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
