import { motion } from "framer-motion";
import { useMood } from "@/context/MoodContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function SmartGreeting() {
  // 🧠 CONNECT TO THE BRAIN
  // We don't calculate time here anymore. We just ask the context what to say.
  const { greeting, subtitle, isLoading, theme } = useMood();

  // Premium Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger effect for text reveal
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // 1. LOADING STATE (Skeleton UI for premium feel)
  if (isLoading) {
    return (
      <div className="space-y-3 mb-8 p-2">
        <Skeleton className="h-12 w-3/4 rounded-lg bg-black/5 dark:bg-white/10" />
        <Skeleton className="h-6 w-1/2 rounded-lg bg-black/5 dark:bg-white/5" />
      </div>
    );
  }

  // 2. THEME-AWARE STYLING
  // We subtly adjust the text color based on the current theme
  const themeColors = {
    calm: "text-slate-800 dark:text-slate-100",
    energy: "text-teal-900 dark:text-teal-50",
    stress: "text-slate-800 dark:text-slate-100", // Keep readable despite red bg
    night: "text-indigo-100 dark:text-indigo-50",
    focused: "text-emerald-900 dark:text-emerald-50"
  };
  
  const accentColors = {
    calm: "from-purple-400 to-blue-400",
    energy: "from-yellow-400 to-orange-400",
    stress: "from-orange-400 to-red-400",
    night: "from-indigo-400 to-purple-400",
    focused: "from-emerald-400 to-teal-400"
  };

  const textColor = themeColors[theme] || themeColors.calm;
  const gradientColor = accentColors[theme] || accentColors.calm;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative z-10 mb-8 p-2"
    >
      {/* 1. The Main Greeting */}
      <motion.h1 
        variants={itemVariants}
        className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-tight ${textColor}`}
      >
        {greeting}
      </motion.h1>

      {/* 2. The Intelligent Subtitle */}
      <motion.p 
        variants={itemVariants}
        className={`mt-2 text-lg md:text-xl font-light opacity-80 ${textColor}`}
      >
        {subtitle}
      </motion.p>

      {/* 3. The Breathing Line Decoration */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8, ease: "anticipate" }}
        className={`mt-6 h-[2px] w-24 rounded-full bg-gradient-to-r ${gradientColor} origin-left`}
      />
      
      {/* Optional: Add a subtle glow behind the text for readability on complex backgrounds */}
      <div className="absolute inset-0 -z-10 bg-white/0 blur-3xl rounded-full" />
    </motion.div>
  );
}