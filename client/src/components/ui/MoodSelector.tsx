import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMood } from "@/context/MoodContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Touchable } from "@/components/ui/Touchable";
import { Check } from "lucide-react";

// Define moods with their specific colors/themes
const moods = [
  { 
    id: "Happy", 
    label: "Happy", 
    emoji: "😊", 
    color: "bg-yellow-400/20", 
    border: "border-yellow-400/50",
    glow: "shadow-[0_0_30px_-5px_rgba(250,204,21,0.4)]"
  },
  { 
    id: "Calm", 
    label: "Calm", 
    emoji: "😌", 
    color: "bg-teal-400/20", 
    border: "border-teal-400/50",
    glow: "shadow-[0_0_30px_-5px_rgba(45,212,191,0.4)]"
  },
  { 
    id: "Focused", 
    label: "Focused", 
    emoji: "🧠", 
    color: "bg-indigo-400/20", 
    border: "border-indigo-400/50",
    glow: "shadow-[0_0_30px_-5px_rgba(129,140,248,0.4)]"
  },
  { 
    id: "Tired", 
    label: "Tired", 
    emoji: "😴", 
    color: "bg-blue-400/20", 
    border: "border-blue-400/50",
    glow: "shadow-[0_0_30px_-5px_rgba(96,165,250,0.4)]"
  },
  { 
    id: "Anxious", 
    label: "Anxious", 
    emoji: "😰", 
    color: "bg-purple-400/20", 
    border: "border-purple-400/50",
    glow: "shadow-[0_0_30px_-5px_rgba(192,132,252,0.4)]"
  },
  { 
    id: "Stressed", 
    label: "Stressed", 
    emoji: "😫", 
    color: "bg-red-400/20", 
    border: "border-red-400/50",
    glow: "shadow-[0_0_30px_-5px_rgba(248,113,113,0.4)]"
  },
];

export default function MoodSelector({ onLog }: { onLog?: () => void }) {
  // 🧠 Connect to the Brain
  const { logMood, currentMood } = useMood();
  const [isLogging, setIsLogging] = useState(false);

  const handleSelect = async (moodId: string) => {
    setIsLogging(true);
    
    // 1. Send to Brain (Context -> Vault -> Encryption)
    await logMood(moodId);
    
    setIsLogging(false);
    if (onLog) onLog();
  };

  return (
    <div className="w-full relative z-10">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
          How are you feeling?
        </h3>
        {isLogging && (
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-xs text-slate-500 font-medium"
          >
            Encrypting & Saving...
          </motion.span>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {moods.map((m) => {
          const isSelected = currentMood === m.id;
          
          return (
            <Touchable key={m.id} onClick={() => handleSelect(m.id)}>
              <GlassCard 
                variant="clear"
                className={`
                  flex flex-col items-center justify-center p-3 sm:p-4
                  transition-all duration-500 ease-out
                  group relative overflow-hidden
                  ${isSelected ? `${m.color} ${m.border} ${m.glow} border` : "bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 border-transparent"}
                `}
              >
                {/* Background Flash on Select */}
                {isSelected && (
                  <motion.div 
                    layoutId="mood-active"
                    className={`absolute inset-0 opacity-20 ${m.color}`}
                  />
                )}

                {/* Emoji with bounce */}
                <motion.span 
                  className="text-3xl mb-2 filter drop-shadow-sm"
                  animate={isSelected ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                >
                  {m.emoji}
                </motion.span>

                <span className={`text-xs font-medium transition-colors ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                  {m.label}
                </span>

                {/* Checkmark Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-1 right-1 w-4 h-4 bg-white/50 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-2.5 h-2.5 text-black" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </Touchable>
          );
        })}
      </div>
    </div>
  );
}