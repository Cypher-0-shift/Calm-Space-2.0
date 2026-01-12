// src/pages/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrain } from '@/context/BrainContext';
import { BrainAPI } from '@/api/BrainAPI';
import { PageContainer } from "@/components/layout/PageContainer";
import { ArrowRight, Music, BookOpen, Wind, MessageCircle, Sparkles, Gamepad2 } from 'lucide-react';

/* ============================
   UI CONFIG MAPPING
============================ */
const MODULE_CONFIG: Record<string, { label: string; sublabel: string; icon: any; route: string }> = {
  music: {
    label: "Listen to calming sounds",
    sublabel: "Audio frequencies",
    icon: Music,
    route: "/music"
  },
  journal: {
    label: "Write your thoughts",
    sublabel: "Reflective journaling",
    icon: BookOpen,
    route: "/journal"
  },
  chat: {
    label: "Talk it out",
    sublabel: "AI Companion",
    icon: MessageCircle,
    route: "/chat"
  },
  grounding: {
    label: "Breathe slowly",
    sublabel: "Guided exercises",
    icon: Wind,
    route: "/breathing"
  },
  inspiration: {
    label: "Find inspiration",
    sublabel: "Daily wisdom",
    icon: Sparkles,
    route: "/inspiration"
  },
  games: {
    label: "Light games to refresh",
    sublabel: "Cognitive reset",
    icon: Gamepad2,
    route: "/games"
  }
};

const Dashboard = () => {
  const { brainState, isBrainReady } = useBrain();
  const [, setLocation] = useLocation();
  const [userName] = useState("Friend"); // Default only, no persistence reading
  
  // Soft Invitation State
  const [showUpgradeInvite, setShowUpgradeInvite] = useState(false);
  const [inviteDismissed, setInviteDismissed] = useState(false);

  // ------------------------------------------------------------
  // SOFT INVITATION LOGIC (Persistence-Free)
  // ------------------------------------------------------------
  useEffect(() => {
    if (isBrainReady && brainState && !inviteDismissed) {
      // Glimpse Mode Detection:
      // We rely solely on confidenceLevel. In Glimpse Mode, confidence is capped at 'medium'.
      // If confidence is 'high', we assume Full Mode (or sufficiently established state).
      const isGlimpseMode = brainState.meta.confidenceLevel !== "high";

      if (isGlimpseMode) {
        // Gentle delay: Show invitation after 15 seconds of dwelling
        const timer = setTimeout(() => {
          setShowUpgradeInvite(true);
        }, 15000);

        return () => clearTimeout(timer);
      }
    }
  }, [isBrainReady, brainState, inviteDismissed]);

  const handleCardClick = (id: string, route: string) => {
    BrainAPI.notifyAction('CARD_CLICKED', { cardId: id });
    setLocation(route);
  };

  const handleContinue = () => {
    // Navigate to the onboarding flow to "formalize" the relationship
    setLocation("/onboarding");
  };

  const handleContinueLater = () => {
    setShowUpgradeInvite(false);
    setInviteDismissed(true);
  };

  // ------------------------------------------------------------
  // 1. QUIET FALLBACK (Brain Not Initialized)
  // ------------------------------------------------------------
  if (!isBrainReady || !brainState) {
    return (
      <PageContainer>
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 2, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Static, peaceful presence */}
            <Wind className="w-8 h-8 text-slate-300 mx-auto opacity-40" strokeWidth={1} />
            
            <div className="space-y-3">
              <h2 className="text-2xl font-light text-slate-400 tracking-wide">
                The room is quiet.
              </h2>
              <p className="text-slate-300 font-light max-w-xs mx-auto leading-relaxed">
                You can stay here as long as you like.
              </p>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    );
  }

  // ------------------------------------------------------------
  // 2. DECISION RENDERING (Brain Ready)
  // ------------------------------------------------------------
  const { reflectionText, primaryAction, allowSecondaryActions } = brainState.dashboardDecision;

  // Resolve Primary Card
  const primaryModule = primaryAction !== 'none' ? MODULE_CONFIG[primaryAction] : null;

  // Define Safe Secondary Subset
  const SAFE_SECONDARY_KEYS = ['music', 'journal', 'chat', 'grounding', 'inspiration'];

  // Resolve Secondary Cards
  const secondaryCards = SAFE_SECONDARY_KEYS
    .filter(key => key !== primaryAction)
    .map(key => ({ id: key, ...MODULE_CONFIG[key] }));

  return (
    <PageContainer>
      <div className="py-12 space-y-12 pb-32"> {/* Added padding bottom for invite space */}
        
        {/* HEADER: MIRROR EMOTIONAL STATE */}
        <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-4xl font-light text-slate-900">
              Hello, {userName}.
            </h1>
            <motion.p 
              key={reflectionText} 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl text-slate-500 leading-relaxed font-light"
            >
              {reflectionText}
            </motion.p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* PRIMARY ACTION CARD */}
          {primaryModule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleCardClick(primaryAction, primaryModule.route)}
              className="relative overflow-hidden p-8 rounded-[2rem] cursor-pointer transition-all duration-500 bg-slate-900 text-white shadow-2xl shadow-slate-900/20 md:col-span-2 group"
            >
              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors">
                    <primaryModule.icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                    Recommended
                  </span>
                </div>
                
                <div>
                  <h3 className="text-3xl font-light mb-2">{primaryModule.label}</h3>
                  <p className="text-slate-400">{primaryModule.sublabel}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECONDARY ACTIONS (Conditional & Restricted) */}
          {allowSecondaryActions && secondaryCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (i * 0.05) }}
              onClick={() => handleCardClick(card.id, card.route)}
              className="group relative overflow-hidden p-6 rounded-[2rem] bg-white border border-slate-100 hover:shadow-xl cursor-pointer transition-all duration-300"
            >
              <div className="flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors">
                    <card.icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">{card.label}</h3>
                  <p className="text-sm text-slate-400">{card.sublabel}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
        </div>

        {/* EMPTY STATE (If Brain says NONE and NO Secondary) */}
        {(!primaryModule && !allowSecondaryActions) && (
          <div className="text-center py-20 text-slate-300">
            <Sparkles className="w-8 h-8 mx-auto mb-4 opacity-50" />
            <p>Just be here.</p>
          </div>
        )}

        {/* ------------------------------------------------------------
            3. GLIMPSE MODE: ETHICAL UPGRADE INVITATION
           ------------------------------------------------------------ */}
        <AnimatePresence>
          {showUpgradeInvite && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="fixed bottom-0 left-0 w-full p-6 pointer-events-none z-50 flex justify-center"
            >
              <div className="pointer-events-auto bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-full px-6 py-4 max-w-lg flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <p className="text-sm text-slate-600 font-light text-center md:text-left">
                  This is a temporary glimpse. If you’d like this space to remember you next time, you can stay.
                </p>
                <div className="flex items-center gap-4 shrink-0">
                  <button 
                    onClick={handleContinueLater}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Not now
                  </button>
                  <button 
                    onClick={handleContinue}
                    className="text-xs font-medium bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors shadow-lg hover:shadow-slate-900/20"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageContainer>
  );
};

export default Dashboard;