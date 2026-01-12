import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// 🧠 CONTEXT PROVIDERS
import { UIProvider } from "@/context/UIContext";
import { MusicProvider } from "@/context/MusicContext";
import { MoodProvider } from "@/context/MoodContext";
import { BrainProvider } from "@/context/BrainContext";

// 🐚 SHELL
import { Shell } from "@/components/layout/Shell";

// --- MAIN PAGES ---
import Dashboard from "@/pages/Dashboard";
import Music from "@/pages/Music";
import AIChat from "@/pages/AIChat";
import Journal from "@/pages/Journal";
import BreakSpace from "@/pages/BreakSpace";
import Games from "@/pages/Games";
import Creativity from "@/pages/Creativity";
import Inspiration from "@/pages/Inspiration";
import Relaxation from "@/pages/Relaxation";
import Settings from "@/pages/Settings";
import GlimpseEntry from "@/pages/GlimpseEntry"; // ✅ ADD THIS

// --- ONBOARDING FLOW ---
import Onboarding from "@/pages/Onboarding";
import PrivacyNotice from "@/pages/PrivacyNotice";
import ProfileSetup from "@/pages/ProfileSetup";
import MoodCheck from "@/pages/MoodCheck";
import MoodSuggestion from "@/pages/MoodSuggestion";

// --- SPECIAL PAGES ---
import Panic from "@/pages/Panic";
import NotFound from "@/pages/not-found";

function Router() {
  // 🟢 Ensures rerender on route change
  const [location] = useLocation();

  // 🟢 ROUTING GUARD FLAGS
  const hasOnboarded = localStorage.getItem("calm_onboarding_complete");
  const hasGlimpsed = localStorage.getItem("calm_glimpse_seen");

  return (
    <Switch>
      {/* 🔥 PANIC MODE */}
      <Route path="/panic" component={Panic} />

      {/* 🔐 SPECIAL ENTRY */}
      <Route path="/glimpse" component={GlimpseEntry} />
      <Route path="/breakspace" component={BreakSpace} />

      {/* 🟦 ONBOARDING FLOW */}
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/privacy" component={PrivacyNotice} />
      <Route path="/profile-setup" component={ProfileSetup} />
      <Route path="/mood-check" component={MoodCheck} />
      <Route path="/suggestion" component={MoodSuggestion} />

      {/* 🟩 MAIN APP ROUTES */}

      {/* Root Route: Deterministic Entry Flow */}
      <Route path="/">
        {!hasGlimpsed ? (
          <Redirect to="/glimpse" />
        ) : !hasOnboarded ? (
          <Redirect to="/onboarding" />
        ) : (
          <Shell>
            <Dashboard />
          </Shell>
        )}
      </Route>

      <Route path="/dashboard">
        {localStorage.getItem("calm_onboarding_complete") ? (
          <Shell>
            <Dashboard />
          </Shell>
        ) : (
          <Redirect to="/" />
        )}
      </Route>


      <Route path="/journal">
        <Shell>
          <Journal />
        </Shell>
      </Route>

      <Route path="/creativity">
        <Shell>
          <Creativity />
        </Shell>
      </Route>

      <Route path="/music">
        <Shell>
          <Music />
        </Shell>
      </Route>

      <Route path="/games">
        <Shell>
          <Games />
        </Shell>
      </Route>

      <Route path="/aichat">
        <Shell>
          <AIChat />
        </Shell>
      </Route>

      <Route path="/inspiration">
        <Shell>
          <Inspiration />
        </Shell>
      </Route>

      <Route path="/relaxation">
        <Shell>
          <Relaxation />
        </Shell>
      </Route>

      <Route path="/settings">
        <Shell>
          <Settings />
        </Shell>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <MoodProvider>
          <MusicProvider>
            {/* 🧠 BRAIN MUST WRAP THE ROUTER */}
            <BrainProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </BrainProvider>
          </MusicProvider>
        </MoodProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

export default App;