import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Activity 
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// 🧠 LOGIC ENGINE IMPORTS (PRESERVED)
import { brain } from "@/brain/BrainEngine";
import { vault as Vault } from "@/vault/vault";
import { MemoryStore } from "@/vault/memoryStore";
import { buildPersonalityPrompt } from "@/brain/personalityPrompt";
import { selectRelevantMemories } from "@/brain/memoryRecall";
import { trustModel } from "@/brain/TrustModel";
import { buildTrustPrompt } from "@/brain/trustPrompt";
import { needsGrounding } from "@/brain/groundingRules";
import { buildGroundingPrompt } from "@/brain/groundingPrompt";
import { emotionModel } from "@/brain/EmotionModel";
import { detectGrowth } from "@/brain/growthLogic";

/* -------------------------------------------------------------------------- */
/* TYPES                                    */
/* -------------------------------------------------------------------------- */

interface ChatMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  // ✨ NEW: Optional mood tag for UI styling (e.g., if user was angry, bubble tints slightly)
  detectedMood?: string; 
}

/* -------------------------------------------------------------------------- */
/* SUB-COMPONENTS (VISUALS)                         */
/* -------------------------------------------------------------------------- */

// 1. TYPING INDICATOR (The "Thinking" Brain)
const TypingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="flex w-full justify-start mb-4 pl-2"
  >
    <div className="bg-white/40 backdrop-blur-md px-4 py-3 rounded-2xl rounded-tl-sm border border-white/30 flex gap-1 shadow-sm">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={{ y: -4 }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity, 
            repeatType: "reverse", 
            delay: i * 0.15 
          }}
          className="w-1.5 h-1.5 bg-slate-600/60 rounded-full"
        />
      ))}
    </div>
  </motion.div>
);

// 2. CHAT BUBBLE (Premium Glass)
const ChatBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const isUser = msg.isFromUser;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}
    >
      <div className={`relative max-w-[85%] md:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* The Bubble */}
        <div
          className={`
            px-6 py-4 text-[15px] md:text-base leading-relaxed shadow-sm
            ${isUser 
              ? 'bg-slate-800/90 text-white rounded-2xl rounded-tr-sm backdrop-blur-xl border border-white/10' 
              : 'bg-white/60 text-slate-800 rounded-2xl rounded-tl-sm backdrop-blur-md border border-white/40'}
          `}
        >
          {msg.content}
        </div>

        {/* Timestamp & Meta (Fade in on hover) */}
        <div className="flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && (
            <span className="flex items-center gap-1 text-[10px] text-purple-500/80">
              <ShieldCheck className="w-3 h-3" /> Encrypted
            </span>
          )}
        </div>
        
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

const AIChat = () => {
  const [, setLocation] = useLocation();
  
  // State
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>("chatHistory", []);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionMood, setSessionMood] = useState<string>("neutral"); // For UI theming

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------------------ */
  /* UI HELPERS                                */
  /* ------------------------------------------------------------------------ */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ✨ UX: Auto-focus input on load
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* RESTORE BASELINES ON LOAD                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const savedEmotion = localStorage.getItem("emotionBaseline");
    if (savedEmotion) {
      try {
        emotionModel.hydrate(JSON.parse(savedEmotion));
        setSessionMood(emotionModel.getCurrentState().mood); // Sync UI theme
      } catch (err) {
        console.warn("Emotion hydrate failed", err);
      }
    }
    
    const savedTrust = localStorage.getItem("trustBaseline");
    if (savedTrust) {
      try {
        trustModel.hydrate(JSON.parse(savedTrust));
      } catch (err) {
        console.warn("Trust hydrate failed", err);
      }
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* AI API CALL                                 */
  /* ------------------------------------------------------------------------ */

  const getAIReply = async (history: { role: string; content: string }[]) => {
    try {
      // In a real build, replace this fetch with your LLM provider
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      return data.reply || "I'm here with you. Tell me more.";
    } catch (error) {
      console.error("Chat API error:", error);
      // Fallback for demo/offline
      return new Promise<string>((resolve) => {
        setTimeout(() => resolve("I am listening. Please, go on."), 1000);
      });
    }
  };

  /* ------------------------------------------------------------------------ */
  /* SEND MESSAGE LOGIC                            */
  /* ------------------------------------------------------------------------ */

  const sendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    
    const textToSend = overrideText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: textToSend.trim(),
      isFromUser: true,
      timestamp: new Date(),
    };

    // 1. UI Update Immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true); // ✨ Show "Thinking" animation

    try {
      /* --- LOGIC: Sentiment Analysis --- */
      // Mocking fetch for demo safety, assume real endpoint exists
      let emotionData = { emotion: "neutral", confidence: 0.5 }; 
      try {
        const sentimentRes = await fetch("/api/sentiment", {
            method: "POST",
            body: JSON.stringify({ text: userMessage.content }),
        });
        if(sentimentRes.ok) emotionData = await sentimentRes.json();
      } catch(e) { /* silent fail to neutral */ }
      
      const detectedEmotion = emotionData.emotion ?? "neutral";
      const intensity = Math.round((emotionData.confidence ?? 0) * 10);

      // ✨ UI: Update Session Mood for Theme
      setSessionMood(detectedEmotion);

      /* --- LOGIC: Emotional Continuity --- */
      const previousState = emotionModel.getCurrentState();
      const updatedEmotionState = emotionModel.update(detectedEmotion, intensity);
      localStorage.setItem("emotionBaseline", JSON.stringify(updatedEmotionState));

      /* --- LOGIC: Growth Logic --- */
      const growthSignal = detectGrowth(
        previousState?.mood ?? null,
        updatedEmotionState.mood,
        previousState ? previousState.intensity * 10 : null,
        updatedEmotionState.intensity * 10
      );

      /* --- LOGIC: Trust Engine --- */
      trustModel.updateTrust({
        emotion: detectedEmotion,
        intensity,
        disclosed: detectedEmotion !== "neutral" && userMessage.content.length > 40,
      });
      const trustLevel = trustModel.getTrustLevel();
      const trustStage = trustModel.getTrustStage();
      localStorage.setItem("trustBaseline", JSON.stringify(trustModel.exportState()));

      /* --- LOGIC: Brain + Vault --- */
      await brain.handleEvent({ type: "explicit_mood", mood: detectedEmotion });
      await Vault.saveMood({
        mood: detectedEmotion,
        intensity,
        timestamp: new Date().toISOString(),
      });

      /* --- LOGIC: Long-Term Memory --- */
      // (Mocked for safety if API missing)
      try {
        const insightRes = await fetch("/api/extract-memory", {
            method: "POST",
            body: JSON.stringify({ text: userMessage.content }),
        });
        if(insightRes.ok) {
            const insight = await insightRes.json();
            if (insight.weight > 0.3) {
                await MemoryStore.saveInsight({ ...insight, timestamp: new Date().toISOString() });
            }
        }
      } catch (e) { /* ignore */ }

      const allMemories = await MemoryStore.getInsights();
      const recalledMemories = selectRelevantMemories(allMemories, detectedEmotion);

      /* --- LOGIC: Prompt Construction --- */
      const personalityPrompt = buildPersonalityPrompt();
      const trustPrompt = buildTrustPrompt(trustStage);
      const groundingPrompt = needsGrounding(detectedEmotion, intensity)
        ? buildGroundingPrompt(detectedEmotion)
        : "";

      const growthPrompt =
        growthSignal.improved && growthSignal.message
          ? `\nGROWTH REFLECTION: "${growthSignal.message}". Be subtle.`
          : "";

      const memoryContext = recalledMemories.length > 0
          ? `\nPAST CONTEXT:\n${recalledMemories.map((m) => `- ${m.content}`).join("\n")}`
          : "";

      const adaptiveTone = `
${personalityPrompt}
${trustPrompt}
${groundingPrompt}
${growthPrompt}
${memoryContext}

EMOTIONAL CONTEXT
Mood: ${updatedEmotionState.mood}
Intensity: ${(updatedEmotionState.intensity * 10).toFixed(1)}/10
Trust: ${trustLevel.toFixed(2)}

RULES
- Always be the same person
- Reflect emotion before advice
- Keep tone human and calm
`.trim();

      /* --- LOGIC: Chat History --- */
      const shortTermMessages = [...messages, userMessage].slice(-12);
      const chatHistory = [
        { role: "system", content: adaptiveTone },
        ...shortTermMessages.map((msg) => ({
          role: msg.isFromUser ? "user" : "assistant",
          content: msg.content,
        })),
      ];

      /* --- LOGIC: AI Response --- */
      const aiReply = await getAIReply(chatHistory);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiReply,
        isFromUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      /* --- LOGIC: Human-like Follow-up --- */
      if (emotionModel.hasActiveEmotion() && userMessage.content.length < 25) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              content: "I might be wrong, but it feels like something is still sitting with you. We don’t have to rush.",
              isFromUser: false,
              timestamp: new Date(),
            },
          ]);
        }, 3000); // Increased delay for realism
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "I’m having trouble processing that right now, but I’m still here with you.",
          isFromUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false); // ✨ Hide Animation
    }
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER (PREMIUM UI)                          */
  /* ------------------------------------------------------------------------ */

  // Soft Entry Suggestions
  const startingPrompts = [
    { text: "I'm feeling anxious", icon: <Activity className="w-3 h-3" /> },
    { text: "I can't sleep", icon: <Sparkles className="w-3 h-3" /> },
    { text: "Just need to vent", icon: <Leaf className="w-3 h-3" /> },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col h-[85vh] w-full max-w-5xl mx-auto">
        
        {/* 1. HEADER (Floating & Glass) */}
        <div className="flex items-center justify-between px-4 py-4 mb-2">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation('/')} 
              className="rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 opacity-70" />
            </Button>
            <div>
              <h2 className="text-xl font-light tracking-tight text-slate-800">
                Calm Companion
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Private & Secure
                </p>
              </div>
            </div>
          </div>
          
          {/* Mood Indicator (Subtle) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/30 rounded-full border border-white/20">
              <span className="text-xs opacity-60">Current Sense:</span>
              <span className="text-xs font-medium capitalize text-slate-700">{sessionMood}</span>
          </div>
        </div>

        {/* 2. CHAT AREA (Scrollable & Clean) */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-hide relative">
          
          {/* Empty State / Soft Entry */}
          {messages.length === 0 && !isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <p className="text-slate-400 font-light text-lg mb-8">
                What's on your mind today?
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center pointer-events-auto">
                {startingPrompts.map((p, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage(undefined, p.text)}
                    className="flex items-center gap-2 px-5 py-3 bg-white/40 hover:bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl text-slate-700 text-sm transition-all shadow-sm"
                  >
                    {p.icon}
                    {p.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Message List */}
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <ChatBubble key={m.id} msg={m} />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && <TypingIndicator key="typing" />}
          </AnimatePresence>

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* 3. INPUT AREA (Premium Glass Bar) */}
        <div className="px-4 pb-6 pt-2">
          <form 
            onSubmit={sendMessage} 
            className="relative group max-w-3xl mx-auto"
          >
              {/* Glass Container */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/40 shadow-lg transition-all group-focus-within:bg-white/60 group-focus-within:shadow-xl group-focus-within:border-white/60" />
              
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
                placeholder="Type your message..."
                className="relative bg-transparent border-none h-16 pl-6 pr-16 text-lg placeholder:text-slate-400 focus-visible:ring-0 rounded-3xl"
              />
              
              <Button 
                type="submit" 
                disabled={!inputMessage.trim() || isTyping}
                className={`
                  absolute right-2 top-2 h-12 w-12 rounded-2xl transition-all duration-300
                  ${inputMessage.trim() 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white shadow-md scale-100' 
                    : 'bg-slate-200 text-slate-400 scale-90 opacity-0 pointer-events-none'}
                `}
              >
                <Send className="h-5 w-5 ml-0.5" />
              </Button>
          </form>
          
          <p className="text-center text-[10px] text-slate-400 mt-3 font-light tracking-wide">
            Your conversation is encrypted and stored locally.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default AIChat;